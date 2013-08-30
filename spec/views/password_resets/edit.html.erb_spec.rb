require 'spec_helper'

describe "password_resets/edit.html.erb" do

  subject { page }
  let(:user) { FactoryGirl.create(:user) }
  before do
    user.send_password_reset
    visit edit_password_reset_url(user.password_reset_token)
  end

  it { should have_title("Update Password") }
  it { should have_content("Update your password") }

  describe "after fill password" do
    before do
      fill_in "Password",         with: "foobar"
      fill_in "Confirm Password", with: "foobar"
      click_button "Update Password"
    end

    it { should have_content("Password has been reset!") }

  end

end
