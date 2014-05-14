=begin

== Before akcie
 before_action :signed_in_user, except: :show
 before_action :correct_user,   only: [:edit, :update, :destroy, :update_style_settings, :update_publish]
 before_action :get_themes,     only: [:new,:edit, :update]

=end
class WebsController < ApplicationController
  before_action :signed_in_user, except: :show
  before_action :correct_user,   only: [:edit, :update, :destroy, :update_style_settings, :update_publish]
  before_action :get_themes,     only: [:new,:edit, :update]

  #Správa web stránok.
  def index
    @user = current_user
    @webs = current_user.webs.order("created_at DESC").paginate(page: params[:page])
  end

  #Formulár vytvorenia novej web stránky.
  def new
    @web = current_user.webs.build if signed_in?
  end

  #Spracovanie údajov z formulára pre vytvorenie novej web stránky.
  def create
    @themes = Theme.all
    @web = current_user.webs.build(web_params)
    if @web.save
      page = @web.pages.new()
      page.title = "Home"
      page.name = "Home"
      page.url_name = "home"
      page.content = ""
      page.save

      flash[:success] = "Web created!"
      redirect_to webs_url
    else
      flash[:error] = "Sorry, but web cannot be created!"
      render 'webs/new'
    end

  end

  #Akcia je volaná iba v prípade prístupu zo subdomény.
  def show
    @web = Web.find_by_subdomain(request.subdomain)
    unless @web.nil?
      @google_analytics_service = @web.ext_services.find_by_service_type("Google analytics")

      if (@web.published_at < Time.now && !@web.published)
        @pages = @web.pages
        if params[:back_link]=="true"
          flash[:success] = "You can edit this site #{view_context.link_to 'here', edit_web_url(@web, subdomain: 'www')}.".html_safe
          render 'webs/show'
        else
          render 'webs/show'
        end
      else
        render 'webs/remaining_time_to_publish'
      end
    else
      redirect_to root_url(subdomain:"www")
    end
  end

  #Akcia editačného prostredia.
  def edit
    @pages = @web.pages
    @ext_services = @web.ext_services
  end

  #Úprava formulára pre zmenu niektorých nastavení web stránky. Táto metóda nie je AJAX-ovo volaná, pretože je nutné pregenerovanie .css a .js súborov v hlavičke web stránky.
  def update
    @web.update_attributes(web_params_update)
    @pages = @web.pages
    @ext_services = @web.ext_services
    render 'webs/edit'
  end

  #Vymazanie web stránky.
  def destroy
    respond_to do |format|
      @web.destroy
      flash.now[:success] = "Web deleted. Name: #{@web.name}"

      format.html { redirect_to webs_path }
      format.js
    end
  end

  #Akcia slúžiaca pre AJAX-ovú zmenu štýlových nastavení.
  def update_style_settings
    #create new favicon
    unless params[:web][:favicon].nil?
      @web.favicon = params[:web][:favicon]
    end
    @web.bg_color = params[:web][:bg_color]
    if @web.save
      render :json => {'result'=> "1"}.to_json
    else
      render :json => { :errors => @web.errors.full_messages }.to_json
    end
  end

  #Akcia pre úpravu publikačných nastavení.
  def update_publish
    #create new image
    @web.subdomain = params[:web][:subdomain]
    @web.published_at = Time.zone.parse(params[:web][:published_at]).utc
    @web.published = false
    if @web.save
      render :json => {'result'=> "1", 'publish_url' => root_url(subdomain:@web.subdomain, :back_link => "true") }.to_json
    else
      render :json => { :errors => @web.errors.full_messages }.to_json
    end
  end

  private
    def web_params
      params.require(:web).permit(:name, :theme_id, :subdomain)
    end

    def web_params_update
      params.require(:web).permit(:name, :theme_id, :header_content, :footer_content)
    end

    def web_params_update_settings
      params.require(:web).permit(:bg_color, :favicon)
    end

    def correct_user
      @web = current_user.webs.find_by(id: params[:id])
      redirect_to root_url if @web.nil?
    end

    def get_themes
      @themes = Theme.all
    end

end