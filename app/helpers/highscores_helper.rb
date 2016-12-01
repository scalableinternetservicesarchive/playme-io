module HighscoresHelper
  def cache_key_for_highscore(highscore)
    "highscore-#{highscore.id}-#{highscore.updated_at}"
  end
end
