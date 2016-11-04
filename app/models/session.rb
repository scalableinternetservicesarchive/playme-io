class Session < ApplicationRecord
  belongs_to :lobby

  after_create :set_username

  def set_username
    default_username = "user#{id}"
    self.update_columns(username: default_username) if username.nil?
  end
end
