require 'json'

class LobbiesController < ApplicationController
  def index
    @lobbies = Lobby.all
  end
  def new
    @lobby = Lobby.new
  end
  def create
    @lobby = Lobby.new(lobby_params)
    if @lobby.save
      redirect_to action: "show",id:@lobby.name
    else
      render html: "couldn't save lobby"
    end
  end
  def show
    @lobby = Lobby.find_by(name: params[:id])
    if @lobby.nil?
      raise ActiveRecord::RecordNotFound
    end
    if session_activated?
      if !(@lobby.sessions.include? current_session)
        deactivate_session
        create_session
      end
    else
      create_session
    end
  end

  def status
    @lobby = Lobby.find_by(name: params[:lobby_id])
    print params
    if @lobby.nil?
      raise ActiveRecord::RecordNotFound
    end
    lobby_hash = {:name => @lobby.name, :sessions => @lobby.sessions}
    render :json => lobby_hash
  end

  def destroy
    deactivate_session
    redirect_to root_url
  end

  def create_session
    session = @lobby.sessions.build
    session.save
    activate_session session
  end

  def players_json
    players_hash = {}
    @lobby.sessions.each do |session|
      players_hash[session.id] = session.username
    end
    return players_hash.to_json
  end
  helper_method :players_json

  private

  def lobby_params
    params.require(:lobby).permit(:name)
  end


end
