class Lobby < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :sessions
end
