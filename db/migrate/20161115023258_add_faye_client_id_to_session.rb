class AddFayeClientIdToSession < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :faye_client_id, :string
  end
end
