require 'test_helper'

class HighscoresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get highscores_index_url
    assert_response :success
  end

end
