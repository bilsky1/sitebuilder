require "spec_helper"

describe UserMailer do
  let(:user) { FactoryGirl.create(:user) }
  let(:mail_from) { 'branislav.bilsky@gmail.com' }

  describe 'registration_confirmation email' do
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
      mail.from.should == [mail_from]
    end

    #ensure that the @name variable appears in the email body
    it 'assigns @name' do
      mail.body.encoded.should match(user.name)
    end

    #ensure that the @confirmation_url variable appears in the email body
    it 'assigns @confirmation_url' do
      mail.body.encoded.should match(auth_url)
    end
  end

  describe 'password reset email' do
    let(:mail) { UserMailer.password_reset(user) }

    #ensure that the subject is correct
    it 'renders the subject' do
      mail.subject.should == 'SiteBuilder: Password Reset'
    end

    #ensure that the receiver is correct
    it 'renders the receiver email' do
      mail.to.should == [user.email]
    end

    #ensure that the sender is correct
    it 'renders the sender email' do
      mail.from.should == [mail_from]
    end

    #ensure that the @confirmation_url variable appears in the email body
    it 'assigns @confirmation_url' do
      mail.body.encoded.should match(password_resets_url)
    end
  end

end
