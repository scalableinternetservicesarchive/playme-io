module Exceptions
  class LobbyFullException < StandardError
    def initialize(lobby_name)
      @lobby_name = lobby_name
    end
  end
end
