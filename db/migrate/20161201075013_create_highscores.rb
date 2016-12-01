class CreateHighscores < ActiveRecord::Migration[5.0]
  def change
    create_table :highscores do |t|
      t.string :game
      t.string :username
      t.integer :score

      t.timestamps
    end
  end
end
