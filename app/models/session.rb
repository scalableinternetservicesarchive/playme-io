class Session < ApplicationRecord
  belongs_to :lobby

  after_create :set_username

  enum readystate: [ :not_ready, :ready]

  def set_username
    default_username = "user#{id}"
    self.update_columns(username: default_username) if username.nil?
  end

  def set_player_index
    default_player_index = -1
    self.update_columns(player_index: default_player_index) if username.nil?
  end

end
