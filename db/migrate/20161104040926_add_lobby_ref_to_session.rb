class AddLobbyRefToSession < ActiveRecord::Migration[5.0]
  def change
    add_reference :sessions, :lobby, foreign_key: true
  end
end
