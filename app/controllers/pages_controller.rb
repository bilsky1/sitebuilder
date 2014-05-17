=begin

== Popis
Vzhľadomna to, že editačné prostredie aj režim zobrazovania web stránky má AJAX-ový charakter, obsahuje tento controller potrebné API akcie.
Tieto akcie sú volané pomocou AJAX-ových volaní z editačného alebo zobrazovacieho režimu.
V každom kroku priebehu vykonávania každej akcie sa overujú hodnoty parametrov od používateľa.

== Ukážka výpisu odpovede na akciu
Úspešný priebeh akcie.
 render :json => { 'update_settings_result' => "1", 'page_name' => page.name, 'page_url_name' => page.url_name}.to_json

Neúspešný priebeh akcie.
 render :json => { :errors => page.errors.full_messages }.to_json

=end
class PagesController < ApplicationController

  #Akcia slúžiaca pre získanie údajov podstránky.
  def get_page
    if check_id(params[:web_id])
      if check_page(params[:page_url_name])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          page = web.pages.find_by_url_name(params[:page_url_name])
          unless page.nil?
            render :json => { 'page_id'=>page.id, 'page_content' => page.content, 'title' => page.title, 'meta_keywords' => page.meta_keywords, 'meta_description' => page.meta_description, 'web_name' => page.web.name }.to_json
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

  #Akcia pre vytvorenie novej podstránky webu.
  def create_page
    if check_id(params[:web_id])
      web = Web.find_by_id(params[:web_id])
      unless web.nil?
        page = web.pages.new()
        page.name = params[:name]
        page.url_name = params[:name]
        page.title = params[:title]
        page.content = ""
        if page.save
          render :json => { 'create_result' => "1", 'page_name' => page.name, 'page_url_name'=>page.url_name, "page_id"=> page.id, "page_title" => page.title}.to_json
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

  #Akcia zabezpečujúca úpravu obsahu podstránky.
  def update_page
    if check_id(params[:web_id])
      if check_id(params[:page_id])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          page = web.pages.find_by_id(params[:page_id])
          unless page.nil?
            page.content = params[:content]
            page.checkUnusedContent = true
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

  #Akcia na vymazanie podstránky.
  def delete_page
    if check_id(params[:page_id])
      page = Page.find_by_id(params[:page_id])
      unless page.nil?
        if page.web.pages.count > 1
          if page.destroy
            render :json => { 'delete_result' => "1"}.to_json
          else
            output = "Cannot delete page."
            render :json => { 'errors' => [output]}.to_json
          end
        else
          output = "Minimal count of pages is 1."
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

  #Akcia slúžiaca pre úpravu nastavení podstránky.
  def update_page_settings
    if  check_id(params[:web_id])
      if check_id(params[:page_id])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          page = web.pages.find_by_id(params[:page_id])
          unless page.nil?
            page.checkUnusedContent = false
            if page.update(updateSettingsParams)
              render :json => { 'update_settings_result' => "1", 'page_name' => page.name, 'page_url_name' => page.url_name}.to_json
            else
              render :json => { :errors => page.errors.full_messages }.to_json
            end
          else
            output = "Page doesn't exist."
            render :json => { 'errors' => [output]}.to_json
          end
        else
          output = "Web subpagepage doesn't exist."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Bad id of page."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of web."
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

    def updateSettingsParams
      params.permit(:name, :title, :meta_keywords, :meta_description)
    end

end
