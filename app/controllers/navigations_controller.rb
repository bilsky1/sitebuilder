class NavigationsController < ApplicationController

  def uprate_navigation
    if check_id(params[:web_id])
      unless params[:pages].blank?
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          pages = params[:pages]
          errorMessage = nil;
          pages.each do |i,p|
            navItem = web.navigations.find_or_create_by(page_id: p['page_id'])
            navItem.page_position = p['page_position']
            unless navItem.save
              errorMessage=navItem.errors
            end
          end
          render :json => { 'errors' => errorMessage}.to_json
        else
          output = "Web doesn't exist."
          render :json => { 'errors' => output}.to_json
        end

      else
        output = "Bad pages JSON format."
        render :json => { 'errors' => output}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => output}.to_json
    end
  end

  private
    def check_id(string)
      Integer(string) != nil rescue false
    end
end