# This is an example Faye extension that simply tacks on
# a key/value to all messages sent to channel /0001
# This class is enabled in config/application.rb

class FayeConnect
  def incoming(message, callback)
    # Let non-subscribe messages through

    if meta_update?(message)
      update_db!(message)
    end

    # Call the server back now we're done
    callback.call(message)
  end

  def meta_update?(message)
    return message['channel'][-5..-1] == "/meta"
  end

  def update_db!(message)
    action_type = message['data']['action']
    session_id = message['data']['userId']
    session = Session.find_by(id: session_id)
    if session
      if action_type == "name_change"
        new_username = message['data']['value']
        session.username = new_username
      end
      if action_type == "player_join"
        session.faye_client_id = message['clientId']
      end
      if action_type == "state_change"
        new_state = message['data']['value']
        session.readystate = new_state
      end
      session.save
    end
  end

end
