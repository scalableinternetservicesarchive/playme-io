class AddPlayerIndexToSession < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :player_index, :int
  end
end
