class StaticPagesController < ApplicationController
  def home
    @user = User.new
  end

  def help
  end
end
