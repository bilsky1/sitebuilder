require 'spec_helper'

describe "StaticPages" do
  subject { page }

  shared_examples_for "all static pages" do
    it { should have_content(heading) }
    it { should have_title(full_title(page_title)) }
  end

  describe "Home page" do
    before { visit root_path }

    let(:heading)    { 'Sign in to WBSBuilder' }
    let(:page_title) { '' }

    it_should_behave_like "all static pages"
    it { should_not have_title('| Home') }

    describe "visit with signed user" do
      let(:user) { FactoryGirl.create(:user) }
      let(:heading)    { 'Web sites' }
      before do
        sign_in user
        visit root_path
      end

      it_should_behave_like "all static pages"
      it { should have_title('| Web sites') }
      it { should have_content(:heading) }
    end
  end

  describe "Help page" do
    before { visit help_path }

    let(:heading)    { 'Help' }
    let(:page_title) { 'Help' }

    it_should_behave_like "all static pages"
  end

  describe "auth page" do
    let(:user) { FactoryGirl.create(:user) }
    before { visit auth_path }

    it { should have_content("Sign up") }

    describe "visit with valid verification" do
      let(:verification_link) { auth_path + "?verification=" + user.verification_token }
      before { visit verification_link}

      it { should have_content("successful verify") }
    end

    describe "visit with in valid verification" do
      let(:verification_link) { auth_path + "?verification=aaaaaaaaaaaaaaa"}
      before { visit verification_link}

      it { should have_content("Sign up") }
    end
  end
end
