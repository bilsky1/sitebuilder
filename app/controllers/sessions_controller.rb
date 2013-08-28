class SessionsController < ApplicationController

  def new

  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password]) && user.state?
      sign_in user
      redirect_back_or user
    else
      if user
        unless user.state?
          flash.now[:error] = 'Please check your email for confirmation'
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

  def destroy
    sign_out
    redirect_to root_url
  end
end