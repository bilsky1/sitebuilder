=begin

== Popis
Vzhľadomna to, že editačné prostredie aj režim zobrazovania web stránky má AJAX-ový charakter, obsahuje tento controller potrebné API akcie.
Tieto akcie sú volané pomocou AJAX-ových volaní z editačného alebo zobrazovacieho režimu.
V každom kroku priebehu vykonávania každej akcie sa overujú hodnoty parametrov od používateľa.

== Ukážka výpisu odpovede na akciu.
Úspešný priebeh akcie
 render :json => { 'result' => 1}.to_json

Neúspešný priebeh akcie.
 render :json => { 'errors' => [output]}.to_json

=end
class AjaxContentsController < ApplicationController
  #Akcia slúžiaca na inicializáciu alebo vytvorenie prázdneho AjaxContent bloku.
  def create_blank
    if check_id(params[:page_id])
      page = Page.find_by_id(params[:page_id])
      unless page.nil?
        ajaxContent = page.ajax_contents.new();
        ajaxContent.content = "";
        ajaxContent.content_after = "";
        if ajaxContent.save()
          render :json => { 'id' => ajaxContent.id}.to_json
        else
          output = "Ajax content Cannot be created."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Page doesn't exist"
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad page id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia úpravy AjaxContent bloku.
  def update_contents
    if check_id(params[:ajax_content_id])
      ajaxContent = AjaxContent.find_by_id(params[:ajax_content_id])
      unless ajaxContent.nil?
        ajaxContent.content = params[:content]
        ajaxContent.content_after = params[:content_after]
        if ajaxContent.save()
          render :json => { 'result' => 1}.to_json
        else
          output = "Ajax content cannot be saved."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Ajax content doesn't exist"
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad ajax content id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia pre načítanie obsahov požadovaného AjaxContent bloku.
  def get_contents
    if check_id(params[:ajax_content_id])
      ajaxContent = AjaxContent.find_by_id(params[:ajax_content_id])
      unless ajaxContent.nil?
        render :json => { 'content' => ajaxContent.content, 'content_after' => ajaxContent.content_after }.to_json
      else
        output = "Ajax content doesn't exist"
        render :json => { 'errors' => [output], 'remove_block' => 1}.to_json
      end
    else
      output = "Bad ajax content id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia pre odstránenie AjaxContent bloku.
  def delete
    if check_id(params[:ajax_content_id])
      ajaxContent = AjaxContent.find_by_id(params[:ajax_content_id])
      unless ajaxContent.nil?
        if ajaxContent.destroy()
          render :json => { 'result' => 1}.to_json
        else
          output = "Ajax content cannot be destroyed."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Ajax content doesn't exist"
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad ajax content id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia na zistenie požadovaného obsahu(content) v AjaxContent bloku.
  def get_content
    if check_id(params[:ajax_content_id])
      ajaxContent = AjaxContent.find_by_id(params[:ajax_content_id])
      unless ajaxContent.nil?
        render :json => { 'content' => ajaxContent.content }.to_json
      else
        output = "Ajax content doesn't exist"
        render :json => { 'errors' => [output], 'remove_block' => 1}.to_json
      end
    else
      output = "Bad ajax content id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia na zistenie požadovaného obsahu (content_after) v AjaxContent bloku.
  def get_content_after
    if check_id(params[:ajax_content_id])
      ajaxContent = AjaxContent.find_by_id(params[:ajax_content_id])
      unless ajaxContent.nil?
        render :json => {'content_after' => ajaxContent.content_after }.to_json
      else
        output = "Ajax content doesn't exist"
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad ajax content id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  private
    def check_id(string)
      Integer(string) != nil rescue false
    end

end