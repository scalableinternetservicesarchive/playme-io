# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

Faye::WebSocket.load_adapter('thin')
run Rails.application
