require 'test_helper'

class LocalsourcesControllerTest < ActionController::TestCase
  test "should get findvideos" do
    get :findvideos
    assert_response :success
  end

end
