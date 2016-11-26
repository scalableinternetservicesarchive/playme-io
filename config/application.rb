require_relative 'boot'

require 'rails/all'
require 'eventmachine'


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module PlaymeIo
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.middleware.use Faye::RackAdapter, :mount => '/faye', :timeout => 25 do |bayeux|
      bayeux.add_extension(FayeConnect.new)
      bayeux.on(:disconnect) do |client_id|
        on_disconnect(client_id, bayeux)
      end
    end

    # server-side publish to all clients subscribed to channel
    def broadcast(channel, msg, bayeux)
      EM.run {
        bayeux.get_client.publish(channel, msg)
      }
    end

    def on_disconnect(client_id, bayeux)
      session = Session.find_by(faye_client_id: client_id)
      if session
        session_id = session.id
          # delete session
        lobby = Lobby.find session.lobby_id
        message_data = {action: "player_leave", userId: session.id, value:session.id}
        meta_channel = "/#{lobby.name}/meta"
        session.destroy
        broadcast(meta_channel, message_data, bayeux)

        if(lobby.leader_id == session_id)  # disconnected user was leader
          if !(lobby.sessions.empty?)
            lobby.leader_id = lobby.sessions[0].id # assign next user as leader
            lobby.save
            message_data = {action: "leader_change", userId: lobby.leader_id, value:lobby.leader_id}
            broadcast(meta_channel, message_data, bayeux)
          else
            lobby.destroy
          end
        end
      end
    end

  end
end
