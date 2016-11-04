class AddIndexToLobby < ActiveRecord::Migration[5.0]
  def change
    add_index :lobbies, :name
  end
end
