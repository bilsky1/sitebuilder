class SessionsController < ApplicationController

  #Akcia pre výpis prihlasovacieho formuláru. Výpis sa vykonáva vo view-e.
  def new
  end

  #Spracovanie údajov z formuláru pre prihlásenie. V prípade správnych údajov nastane prihlásenie používateľa.
  def create
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password]) && user.state?
      sign_in user
      redirect_back_or webs_url
    else
      if user
        unless user.state?
          flash.now[:error] = 'Please check your email for authentification.'
        else
          flash.now[:error] = 'Invalid email/password combination'
        end
        render 'new'
      else
        flash.now[:error] = 'Invalid email/password combination'
        render 'new'
      end
    end

  end

  #Odhlásenie používateľa.
  def destroy
    sign_out
    redirect_to root_url
  end
end