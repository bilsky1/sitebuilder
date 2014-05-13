class UserMailer < ActionMailer::Base
  default from: "branislav.bilsky@gmail.com"
  #Metóda slúžiaca pre odosielanie verifikačného emailu pri registrácií.
  def registration_confirmation(user)
    @user = user
    @url  = auth_url + "?verification=" + @user.verification_token
    mail(to: @user.email, subject: 'SiteBuilder: Registration e-mail')
  end

  #Metóda slúžiaca pre odosielanie emailu potrebného pri zabudnutom hesle používateľa.
  def password_reset(user)
    @user = user
    @url  = edit_password_reset_url(@user.password_reset_token)
    mail(to: @user.email, subject: 'SiteBuilder: Password Reset')
  end

end
