class AddLeaderIdToLobby < ActiveRecord::Migration[5.0]
  def change
    add_column :lobbies, :leader_id, :int
  end
end
