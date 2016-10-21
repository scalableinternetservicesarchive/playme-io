require 'test_helper'

class LobbyControllerTest < ActionDispatch::IntegrationTest

  def setup
    @lobby = Lobby.new(name:"Sample Lobby")
  end

  test "should be valid" do
    assert @lobby.valid?
  end

  test "name should be present" do
    @lobby.name = "sample name"
    assert_not @lobby.valid?
  end

  test "name should not be whitespace" do
    @lobby.name = "    "
    assert_not @lobby.valid?
  end

end
