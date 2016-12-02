class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  rescue_from Exceptions::LobbyFullException do |exception|
    puts exception
    render "lobbies/lobby_full"
  end
  
  def landing
    render html: "Playme.io"
  end
  def record_not_found
    redirect_to root_url # Assuming you have a template named 'record_not_found'
  end
  include SessionsHelper
end
