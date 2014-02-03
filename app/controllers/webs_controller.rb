class WebsController < ApplicationController
  before_action :signed_in_user, except: :show
  before_action :correct_user,   only: [:edit, :destroy]

  def index
    @webs = current_user.webs.paginate(page: params[:page])
  end

  def new
    @web = current_user.webs.build if signed_in?
  end

  def create
    @web = current_user.webs.build(web_params)
    if @web.save
      flash[:success] = "Web created!"
      redirect_to webs_url
    else
      flash[:error] = "Sorry, but web cannot be created!"
      render 'webs/new'
    end

  end

  def show
    @web = Web.find_by_subdomain!(request.subdomain)
    if params[:back_link]=="true"
      flash[:success] = "You can edit this site #{view_context.link_to 'here', edit_web_url(@web, subdomain: 'www')}.".html_safe
      render 'webs/show'
    end
  end

  def edit
  end

  def update
  end

  def destroy
    respond_to do |format|
      @web.destroy
      flash.now[:success] = "Web deleted. Name: #{@web.name}"

      format.html { redirect_to webs_path }
      format.js
    end
  end

  private
    def web_params
      params.require(:web).permit(:name, :subdomain)
    end

    def correct_user
      @web = current_user.webs.find_by(id: params[:id])
      redirect_to root_url if @web.nil?
    end

end