require 'spec_helper'

describe "Web pages" do
  subject { page }
  let(:user) { FactoryGirl.create(:user) }
  let(:theme) { FactoryGirl.create(:theme) }
  let(:web) { FactoryGirl.create(:web, user: user, theme: theme) }

  describe "index webs page" do

    before do
      sign_in user
      visit webs_path
    end

    it { should have_title('Web sites') }
    it { should have_content('Web sites') }

    it "should list each web" do
      user.webs.each do |web|
        expect(page).to have_selector('li', text: web.name)
        expect(page).to have_link(web.name, href: edit_web_path(web))
        expect(page).to have_link('', href: edit_web_path(web))
        expect(page).to have_link('', href: web_path(web))
      end
    end

    describe "pagination" do
      before do
        50.times { FactoryGirl.create(:web, user: user, theme: theme) }
        visit webs_path
      end
      after { user.webs.delete }

      it { should have_selector('div.pagination') }

      it "should list each web" do
        user.webs.paginate(page: 1).each do |web|
          expect(page).to have_selector('li', text: web.name)
        end
      end
    end

    describe "delete links" do
        before do
          FactoryGirl.create(:web, user: user, theme: theme)
          visit webs_path
        end

        it { should have_link('', href: web_path(user.webs.last)) }
        it "delete web" do
          expect { page.find(".btn-danger").click }.to change(user.webs, :count).by(-1)
        end
    end
  end

  describe "edit"  do
    before do
      sign_in user
      visit edit_web_path(web)
    end
    it do
      should have_selector('#sidebar-big')
      should have_selector('#sidebar-small')
      should have_selector('#sidebar-toggle')
      should have_selector('#device-view-control')
    end

  end

  describe "new" do
     before do
      sign_in user
      visit new_web_path
     end

     describe "with invalid information" do
       before { click_button "Create new website" }
       it { should have_content('error') }
     end

     describe "with valid information" do
       let(:web_name)  { "Example web site" }
       before do
         #ODO choose theme in selectbox
         #theme.save!
         fill_in "Name",  with: web_name
         #select theme.id, from: "web[theme_id]"
         click_button "Create new website"
       end
       it { should have_selector('div.alert.alert-success') }
       it { should have_content(:web_name) }
     end
  end
  describe "show" do
    before do
      sign_in user
      get "http://#{web.subdomain}.lvh.me"
    end

    it "web on the subomain" do
      assigns[:web].should eql(web)
    end

    describe "with back link" do
      before { visit "http://#{web.subdomain}.lvh.me/?back_link=true" }
      it { should have_selector('div.alert.alert-success') }
    end

  end
end