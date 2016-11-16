class AddFayeClientIdSessionIndex < ActiveRecord::Migration[5.0]
  def change
    add_index :sessions, :faye_client_id 
  end
end
