class ImagesController < ApplicationController
  #create images from multiupload
  def add_assets
    #create new image
    if check_page(params[:image_form][:page_name])
      page = Page.find_by_name(params[:image_form][:page_name])
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

  #create image and if id is specified delete old image
  def create_assets

    #delete assets if image already exist
    if check_id(params[:image_form][:id])
      oldImage = Image.find_by_id(params[:image_form][:id])
      unless oldImage.nil?
        oldImage.destroy
      end
    end

    #create new image
    if check_page(params[:image_form][:page_name])
      page = Page.find_by_name(params[:image_form][:page_name])
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

  #delete image
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

  def check_page(string)
    !string.blank?
  end
end