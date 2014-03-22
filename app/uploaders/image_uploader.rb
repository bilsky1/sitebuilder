# encoding: utf-8

class ImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
   include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/images/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
   version :thumb do
     process :resize_to_fit => [300, 300]
   end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
   def extension_white_list
     %w(jpg jpeg gif png)
   end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
   #def filename
   #  "#{secure_token}.#{file.extension}"  if original_filename
   #end

   def filename
     @name ||= "#{timestamp}.#{file.extension}" if original_filename.present? and super.present?
   end

   def timestamp
     var = :"@#{mounted_as}_timestamp"
     model.instance_variable_get(var) or model.instance_variable_set(var, Time.now.to_i)
   end

   #def filename
   #  @filename ||= "#{secure_token}.#{file.extension}" if original_filename.present?
   #end

  private
   #use for stored filename
   def secure_token
     var = :"@#{mounted_as}_secure_token"
     random_token = Digest::SHA2.hexadigest("#{Time.now.utc}--#{model.id.to_s}").first(20)
     model.instance_variable_get(var) or model.instance_variable_set(var, random_token)
   end

end
