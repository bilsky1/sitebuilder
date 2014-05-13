=begin

== Before akcie
 before_action :signed_out_user, only:[:new, :create]
 before_action :signed_in_user, only: [:index, :edit, :update, :destroy]
 before_action :correct_user,   only: [:edit, :update]
 before_action :admin_user,     only: [:destroy]

=end
class UsersController < ApplicationController
  before_action :signed_out_user, only:[:new, :create]
  before_action :signed_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user,   only: [:edit, :update]
  before_action :admin_user,     only: [:destroy]

  #Správa užívateľov prístupná iba pre administrátora.
  def index
    if current_user.admin? && !current_user?(@user)
      @users = User.paginate(page: params[:page])
    else
      render 'shared/no_permission'
    end

  end

  #Akcia slúžiaca na AJAX-ové vytvorenie administrátora iným administrátorom.
  def make_admin
    if current_user.admin?
      future_user = User.find_by_id(params[:id])
      future_user.admin = params[:is_admin]
      if future_user.save(validate: false)
        render :json => { 'result' => "1"}.to_json
      else
        render :json => { 'result' => "0"}.to_json
      end
    else
      render 'shared/no_permission'
    end
  end

  #Akcia registračného formulára.
  def new
    @user = User.new
  end

  #Profil používateľa.
  def show
    @user = User.find_by_id(params[:id])
    unless @user.nil?
      @webs = @user.webs.where("published_at <= :published_at",published_at: Time.now).order("created_at DESC").paginate(page: params[:page])
    else
      redirect_to root_path
    end
  end

  #Spracovanie registračných údajov od používateľa a odoslanie verifikačného emailu.
  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_registration_confirmation
      flash[:success] = "For successful registration check your email."
      redirect_to @user
    else
      render 'new'
    end
  end

  #Formulár zmeny údajov používateľom.
  def edit
    @user = User.find(params[:id])
  end

  #Spracovanie údajov z formuláru zmeny používateľských údajov.
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      sign_in @user
      redirect_to @user
    else
      render 'edit'
    end
  end

  #Akcia pre AJAX-ové vymazanie užívateľa.
  def destroy
    @user = User.find(params[:id])
    #current_user? user is the same as current_user.is == user.id
    respond_to do |format|
      if (current_user? @user) && (current_user.admin?)
        flash.now[:error] = "You are not allowed to delete yourself as an admin."
      else
        @user.destroy
        flash.now[:success] = "User destroyed. ID: #{@user.id}"
      end

      format.html { redirect_to users_path }
      format.js
      end
    end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end

    def signed_in_user
      unless signed_in?
        store_location
        flash[:notice] = "Please sign in."
        redirect_to signin_url
      end
    end

    def signed_out_user
      if signed_in?
        store_location
        flash[:notice] = "Please sign out to create new account."
        redirect_to root_url
      end
    end

    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_path) unless current_user?(@user)
    end

    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end

    private
      def check_id(string)
        Integer(string) != nil rescue false
      end
end
