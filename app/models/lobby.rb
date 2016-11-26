class Lobby < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :sessions
  enum state: [ :in_lobby, :in_game]

  # if leader_id changes, set lobby leader to always be ready
  after_save if: :leader_id_changed? do |lobby|
    if lobby.leader_id
      leader_session = Session.find_by(id: lobby.leader_id)
      leader_session.readystate = "ready"
      leader_session.save
    end
  end
end
