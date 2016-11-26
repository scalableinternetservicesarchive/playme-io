class AddStateToLobby < ActiveRecord::Migration[5.0]
  def change
    add_column :lobbies, :state, :string
  end
end
