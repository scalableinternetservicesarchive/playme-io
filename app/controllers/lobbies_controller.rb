require 'json'

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
      redirect_to action: "show",id:@lobby.name
    else
      render html: "couldn't save lobby"
    end
  end
  def show
    @lobby = Lobby.find_by(name: params[:id])
    if @lobby.nil?
      raise ActiveRecord::RecordNotFound
    end
    if session_activated?
      if !(@lobby.sessions.include? current_session)
        deactivate_session
        create_session
      end
    else
      create_session
    end
  end

  def status
    @lobby = Lobby.find_by(name: params[:lobby_id])
    print params
    if @lobby.nil?
      raise ActiveRecord::RecordNotFound
    end
    lobby_hash = {:name => @lobby.name, :sessions => @lobby.sessions}
    render :json => lobby_hash
  end

  def destroy
    deactivate_session
    redirect_to root_url
  end

  def create_session
    session = @lobby.sessions.build
    player_index = get_next_player_index
    if player_index == -1
      # if lobby has 4 players already, raise error
      raise ActiveRecord::RecordNotFound
    end
    session.player_index = player_index
    session.save
    activate_session session
  end

  def players_json
    players_hash = {}
    @lobby.sessions.each do |session|
      players_hash[session.id] = {}
      players_hash[session.id]["username"] = session.username
      players_hash[session.id]["playerIndex"] = session.player_index
    end
    return players_hash.to_json
  end
  helper_method :players_json

  private

  def get_next_player_index
    indices = []
    @lobby.sessions.each do |session|
      indices.push session.player_index
    end
    for i in 0..3 do
      return i unless indices.include?(i)
    end
    return -1
  end

  def lobby_params
    params.require(:lobby).permit(:name)
  end


end
