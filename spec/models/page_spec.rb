require 'spec_helper'

describe Page do
  let(:user) {FactoryGirl.create(:user)}
  let(:web) {FactoryGirl.create(:web)}

  before do
    @page = web.pages.build(name: "Example Web", url_name: "example" , content:"example HTML", title: "Title 3")
  end

  subject { @page }

  it{ should respond_to(:name) }
  it{ should respond_to(:url_name) }
  it{ should respond_to(:content) }
  it{ should respond_to(:title) }
  it{ should respond_to(:meta_description) }
  it{ should respond_to(:meta_keywords) }
  it { should be_valid }
  its(:web) { should eq web }

  describe "when web_id is not present" do
    before { @page.web_id = nil }
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

  #--------------------- TITLE PARAMETER-----------
  describe "with blank title" do
    before { @page.title = " " }
    it{ should_not be_valid }
  end

  describe "when title is too long" do
    before { @page.title = "a" * 71 }
    it{ should_not be_valid }
  end

end
