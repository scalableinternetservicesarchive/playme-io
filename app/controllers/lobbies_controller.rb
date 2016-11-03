class LobbiesController < ApplicationController
  def index
    @lobbies = Lobby.all
  end
  def new
    @lobby = Lobby.new
  end
  def create
    @lobby = Lobby.new(lobby_params)
    if @lobby.save
      redirect_to @lobby
    else
      print @lobby
      render html: "couldn't save lobby"
    end
  end
  def show
    @lobby = Lobby.find(params[:id])
  end

  private

  def lobby_params
    params.require(:lobby).permit(:name)
  end

end
