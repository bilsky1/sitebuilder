=begin

== Popis
Vzhľadomna to, že editačné prostredie aj režim zobrazovania web stránky má AJAX-ový charakter obsahuje tento controller potrebné API akcie.
Tieto akcie sú volané pomocou AJAX-ových volaní z editačného alebo zobrazovacieho režimu.
V každom kroku priebehu vykonávania každej akcie sa overujú hodnoty parametrov od používateľa.

== Ukážka výpisu odpovede na akciu
Úspešný priebeh akcie
 render :json => {'id'=> image.id ,'src' => image.image.url, "thumb" => image.image.url(:thumb)}.to_json

Neúspešný priebeh akcie
 render :json => { :errors => image.errors.full_messages }.to_json

=end
class ImagesController < ApplicationController
  #Akcia pre pridávanie obrázkov.
  def add_assets
    #create new image
    if check_id(params[:image_form][:page_id])
      page = Page.find_by_id(params[:image_form][:page_id])
      unless page.nil?
        image = page.images.new()
        image.name="Example"
        unless params[:image_form][:uploaded_image].nil?
          image.image = params[:image_form][:uploaded_image]
          if image.save
            render :json => {'id'=> image.id ,'src' => image.image.url, "thumb" => image.image.url(:thumb)}.to_json
          else
            render :json => { :errors => image.errors.full_messages }.to_json
          end
        else
          output = "You want to upload null image!"
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "You want to asociate image with unexisted subpage."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad page id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia slúžiaca pre zistenie existencie obrázku.
  def check_image_exist
    if check_id(params[:page_id])
      if check_id(params[:image_id])
        page = Page.find_by_id(params[:page_id])
        unless page.nil?
          image = page.images.find_by_id(params[:image_id])
          if image.nil?
            render :json => { 'remove_block' => 1}.to_json
          else
            render :json => { 'remove_block' => 0}.to_json
          end
        else
          output = "Page doesn't exist."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Bad image id."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad page id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia slúžiaca pre vymazanie resp. nahradenie niektorého z obrázkov.
  def create_assets

    #delete assets if image already exist
    if check_id(params[:image_form][:id])
      oldImage = Image.find_by_id(params[:image_form][:id])
      unless oldImage.nil?
        oldImage.destroy
      end
    end

    #create new image
    if check_id(params[:image_form][:page_id])
      page = Page.find_by_id(params[:image_form][:page_id])
      unless page.nil?
        image = page.images.new()
        image.name="Example"
        image.image = params[:image_form][:uploaded_image]
        if image.save
          render :json => {'id'=> image.id ,'src' => image.image.url, "thumb" => image.image.url(:thumb)}.to_json
        else
          render :json => { :errors => image.errors.full_messages }.to_json
        end
      else
        output = "You want to asociate image with unexisted web."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad web id."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia pre vymazanie obrázku.
  def delete_assets
    if check_id(params[:id])
      image = Image.find_by_id(params[:id])
      unless image.nil?
        image.destroy
        render :json => { 'success' => ["Image sucessfully deleted."]}.to_json
      else
        output = "Image doesn't exist."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of image."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  private
    def check_id(string)
      Integer(string) != nil rescue false
    end
end