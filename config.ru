# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

Faye::WebSocket.load_adapter('thin')
use Faye::RackAdapter, :mount => '/faye', :timeout => 25 do |bayeux|
  bayeux.add_extension(FayeJoy.new)
end

run Rails.application
