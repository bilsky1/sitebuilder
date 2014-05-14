class StaticPagesController < ApplicationController
  #Akcia určená pre home podstránku systému.
  def home
    if signed_in?
      redirect_to webs_path
    else
      @user = User.new
    end
  end

  #Výpis pomôcky v pdf súbore.
  def help
    pdf_filename = File.join(Rails.root, "public/user_guide.pdf")
    send_file(pdf_filename, :filename => "user_guide.pdf", :disposition => 'inline', :type => "application/pdf")
  end

  #Autentifikačná akcia systému. Využíva sa pri overení emailovej adresy.
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
