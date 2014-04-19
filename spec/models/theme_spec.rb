require 'spec_helper'

describe Theme do
=begin  let(:user) {FactoryGirl.create(:user)}
  let(:web) {FactoryGirl.create(:web)}

  before do
    @theme = web.themes.build(name: "example")
  end

  subject { @theme }

  it{ should respond_to(:name) }
  it { should be_valid }
  its(:web) { should eq web }

  describe "when web_id is not present" do
    before { @theme.web_id = nil }
    it { should_not be_valid }
  end

  #--------------------- NAME PARAMETER-----------
  describe "with blank name" do
    before { @page.name = " " }
    it{ should_not be_valid }
  end

  describe "when name is too long" do
    before { @page.name = "a" * 51 }
    it{ should_not be_valid }
  end
=end
end
