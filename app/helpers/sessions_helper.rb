module SessionsHelper
  def sign_in(user)
      cookies.permanent[:remember_token] = user.remember_token
      self.current_user = user
  end

  def signed_in?
    !current_user.nil?
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    # ||= (“or equals”) means
    # if current user is not false
    # then find user by find_by method
    if cookies[:remember_token].present?
      @current_user ||= User.find_by_remember_token(cookies[:remember_token])
    end
  end

  def current_user?(user)
    user == current_user
  end

  def signed_in_user
    unless signed_in?
      store_location
      redirect_to signin_url, notice: "Please sign in."
    end
  end

  def sign_out
    self.current_user = nil
    cookies.delete(:remember_token)
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    session.delete(:return_to)
  end

  def store_location
    unless request.url.include?(auth_path)
      session[:return_to] = request.url
    end
  end

end
