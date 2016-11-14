# This is an example Faye extension that simply tacks on
# a key/value to all messages sent to channel /0001
# This class is enabled in config/application.rb

class FayeConnect
  def incoming(message, callback)
    # Let non-subscribe messages through

    if meta_update?(message)
      print "ayyyyyyyyyy"
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
      print "hello"
      session_id = message['data']['userId']
      new_username = message['data']['value']
      print session_id.class
      session = Session.find(session_id)
      print session_id
      if session
        session.username = new_username
        session.save
      end
    end
  end
end
