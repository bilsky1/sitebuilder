# Resizing uploaded favicon if size is more then 32x32px.
#  process resize_to_limit: [32, 32]
class FaviconUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "favicons/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Resizing uploaded favicon if size is more then 32x32px
  #  process resize_to_limit: [32, 32]
  process resize_to_limit: [32, 32]

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process :resize_to_fit => [50, 50]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(ico)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  #  def filename
  #   "something.jpg" if original_filename
  #  end
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
  #Use for stored filename.
  def secure_token #:doc:
    var = :"@#{mounted_as}_secure_token"
    random_token = Digest::SHA2.hexadigest("#{Time.now.utc}--#{model.id.to_s}").first(20)
    model.instance_variable_get(var) or model.instance_variable_set(var, random_token)
  end

end
