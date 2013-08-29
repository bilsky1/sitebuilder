class UserMailer < ActionMailer::Base
  default from: "branislav.bilsky@gmail.com"

  def registration_confirmation(user)
    @user = user
    @url  = confirmation_url + "?verification=" + @user.verification_token
    mail(to: @user.email, subject: 'SiteBuilder: Registration e-mail')
  end

end
