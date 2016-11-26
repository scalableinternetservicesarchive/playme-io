class ChangeColumnTypeForLobbyState < ActiveRecord::Migration[5.0]
  def change
    change_column :lobbies, :state, :integer
  end
end
