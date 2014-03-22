require 'spec_helper'

describe Image do
  let(:web) {FactoryGirl.create(:web)}

  before do
    @image = web.images.build(name: "Example Web")
  end

  it{ should respond_to(:name) }
  it{ should respond_to(:web) }


  describe "when web_id is not present" do
    before { @image.web_id = nil }
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
