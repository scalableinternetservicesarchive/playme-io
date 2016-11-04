class SessionsController < ApplicationController
  def new
  end

  def create
    session = Session.new
    if session.save
      activate_session session
    else
    end
  end

  def destroy
  end
end
