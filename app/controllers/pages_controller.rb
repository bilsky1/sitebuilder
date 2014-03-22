class PagesController < ApplicationController

  #API get - find web and then find subpage by name
  def get_page
    if check_id(params[:web_id])
      if check_page(params[:page_name])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          page = web.pages.find_by_name(params[:page_name])
          unless page.nil?
            render :json => { 'page_content' => page.content }.to_json
          else
            output = "Web subpagepage doesn't exist."
            render :json => { 'errors' => output}.to_json
          end
        else
          output = "Web doesn't exist."
          render :json => { 'errors' => output}.to_json
        end
      else
        output = "Bad name of subpage."
        render :json => { 'errors' => output}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => output}.to_json
    end
  end

  def create_page
    if check_id(params[:web_id])
      web = Web.find_by_id(params[:web_id])
      unless web.nil?
        page = web.pages.new()
        page.name = params[:name].mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ') #delete diacritics and spaces (name is used for #!url purpose)
        page.title = params[:title]
        page.content = ""
        if page.save
          render :json => { 'create_result' => "1", 'page_name' => page.name, "page_id"=> page.id}.to_json
        else
          render :json => { :errors => page.errors.full_messages }.to_json
        end
      else
        output = "Web doesn't exist."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #API update - find web, find web.pages by name, change content or name or anything save return value
  def update_page
    if check_id(params[:web_id])
      if check_page(params[:page_name])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          page = web.pages.find_by_name(params[:page_name])
          unless page.nil?
            page.content = params[:content]
            if page.save
              render :json => { 'update_result' => "1"}.to_json
            else
              render :json => { :errors => page.errors.full_messages }.to_json
            end
          else
            output = "Web subpagepage doesn't exist."
            render :json => { 'errors' => [output]}.to_json
          end
        else
          output = "Web doesn't exist."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Bad name of subpage."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  def delete_page
    if check_id(params[:page_id])
      page = Page.find_by_id(params[:page_id])
      unless page.nil?
        if page.destroy
          render :json => { 'delete_result' => "1"}.to_json
        else
          output = "Cannot delete page."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Page doesn't exist."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of page."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  private
    def check_id(string)
      Integer(string) != nil rescue false
    end

    def check_page(string)
      !string.blank?
    end

end
