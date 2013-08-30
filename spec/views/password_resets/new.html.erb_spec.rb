require 'spec_helper'

describe "password_resets/new.html.erb" do

  subject { page }
  let(:user) { FactoryGirl.create(:user) }
  before { visit new_password_reset_path }

  it { should have_title("Reset Password") }
  it { should have_content("Reset your forgotten password") }

  describe "after fill email" do
    before do
      fill_in "Email",    with: user.email
      click_button "Reset Password"
    end

    it { should have_content("Email sent with password reset instructions.") }

  end

end
