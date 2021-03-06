require 'spec_helper'

describe Web do
  let(:user) {FactoryGirl.create(:user)}

  before do
    @web = user.webs.build(name: "Example Web", theme_id:1, subdomain:"example")
  end

  subject { @web }

  it{ should respond_to(:name) }
  it{ should respond_to(:user) }
  it{ should respond_to(:theme) }
  it{ should respond_to(:published) }
  it { should_not be_published }
  it { should be_valid }
  its(:user) { should eq user }

  describe "when user_id is not present" do
    before { @web.user_id = nil }
    it { should_not be_valid }
  end

  describe "when theme_id is not present" do
    before { @web.theme_id = nil }
    it { should_not be_valid }
  end

  describe "with blank name" do
    before { @web.name = " " }
    it{ should_not be_valid }
  end

  describe "when name is too long" do
    before { @web.name = "a" * 51 }
    it{ should_not be_valid }
  end

  describe "with published attribute set to 'true'" do
    before do
      @web.save!
      @web.toggle!(:published)
    end

    it { should be_published }
  end

  describe "with blank subdomain" do
    before { @web.subdomain = " " }
    it{ should be_valid }
  end

  describe "when subdomain is too long" do
    before { @web.subdomain = "a" * 31 }
    it{ should_not be_valid }
  end

end
