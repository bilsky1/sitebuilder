class PasswordResetsController < ApplicationController
  # Akcia slúži na výpis formuláru zabudnutého hesla.
  # Ak je aj akcia prázdna je na ňu defaultne vytvorená url adresa v routes.rb a priradený view.
  def new
  end

  # Po vyplnení formuláru zabudnutého hesla je používateľovi zaslaný email s inštrukciami.
  def create
    user = User.find_by_email(params[:email])
    user.send_password_reset if user
    flash[:notice] = "Email sent with password reset instructions."
    redirect_to root_url
  end

  # Akcia zmeny hesla.
  def edit
    @user = User.find_by_password_reset_token!(params[:id])
  end

  # Akcia na spracovanie údajov z formuláru pre zmenu hesla.
  def update
    @user = User.find_by_password_reset_token!(params[:id])
    if @user.password_reset_sent_at < 2.hours.ago
      flash[:alert] = "Password reset has expired."
      redirect_to new_password_reset_path
    elsif @user.update_attributes(params.permit![:user])
      flash[:notice] = "Password has been reset!"
      redirect_to root_url
    else
      render :edit
    end
  end

end
