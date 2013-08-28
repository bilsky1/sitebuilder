require "spec_helper"

describe UserMailer do
  describe 'registration_confirmation' do
    let(:user) { FactoryGirl.create(:user) }
    let(:mail) { UserMailer.registration_confirmation(user) }

    #ensure that the subject is correct
    it 'renders the subject' do
      mail.subject.should == 'SiteBuilder: Registration e-mail'
    end

    #ensure that the receiver is correct
    it 'renders the receiver email' do
      mail.to.should == [user.email]
    end

    #ensure that the sender is correct
    it 'renders the sender email' do
      mail.from.should == ['branislav.bilsky@gmail.com']
    end

    #ensure that the @name variable appears in the email body
    it 'assigns @name' do
      mail.body.encoded.should match(user.name)
    end

    #ensure that the @confirmation_url variable appears in the email body
    it 'assigns @confirmation_url' do
      mail.body.encoded.should match("http://localhost:3000/users/")
    end
  end
end
