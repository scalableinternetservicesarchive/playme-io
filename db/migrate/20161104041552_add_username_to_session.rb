class AddUsernameToSession < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :username, :string
  end
end
