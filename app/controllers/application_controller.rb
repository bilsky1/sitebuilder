#Defaultný controller Rails aplikácie.
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  include UrlHelper
  include WebsHelper

  before_filter :redirectNoSubdomain

  def redirectNoSubdomain
    if !(request.subdomain.present?)
      redirect_to root_url(subdomain:"www")
    end
  end
end
