class HighscoresController < ApplicationController
  def index
    @highscores = Highscore.all
  end
end
