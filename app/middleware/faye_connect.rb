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
    print action_type
    if action_type == "name_change"
      session_id = message['data']['userId']
      new_username = message['data']['value']
      session = Session.find(session_id)
      if session
        session.username = new_username
        session.save
      end
    end
    if action_type == "player_join"
      session_id = message['data']['userId']
      session = Session.find(session_id)
      if session
        session.faye_client_id = message['clientId']
        session.save
      end
    end
  end
  
end
