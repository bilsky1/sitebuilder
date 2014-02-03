class StaticPagesController < ApplicationController
  def home
    if signed_in?
      redirect_to webs_path
    else
      @user = User.new
    end
  end

  def help
  end

  def auth
    if params[:verification]
      @user = User.find_by_verification_token(params[:verification])
      if @user
        @user.verify
        flash[:success] = "Congratulation you have successful verify your account."
        redirect_to signin_path
      else
        redirect_to signup_path
      end
    else
      redirect_to signup_path
    end
  end
end
