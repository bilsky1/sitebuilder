require 'spec_helper'

describe Image do
  let(:page) {FactoryGirl.create(:page)}

  before do
    @image = page.images.build(name: "Example Web")
  end

  it{ should respond_to(:name) }
  it{ should respond_to(:page) }


  describe "when page_id is not present" do
    before { @image.page_id = nil }
    it { should_not be_valid }
  end

  describe "with blank name" do
    before { @image.name = " " }
    it{ should_not be_valid }
  end

  describe "when name is too long" do
    before { @image.name = "a" * 51 }
    it{ should_not be_valid }
  end

end
