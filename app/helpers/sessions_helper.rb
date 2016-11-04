module SessionsHelper
  def activate_session(s)
    session[:sesh_id] = s.id
  end

  def deactivate_session
    session.delete(:sesh_id)
    @current_session = nil
  end

  def current_session
    print session[:sesh_id]
    @current_session ||= Session.find_by(id: session[:sesh_id])
  end

  def session_activated?
    !current_session.nil?
  end
end
