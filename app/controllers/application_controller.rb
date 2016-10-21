class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def landing
    render html: "Playme.io"
  end
end
