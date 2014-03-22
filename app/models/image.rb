class Image < ActiveRecord::Base
  #relations
  belongs_to :page

  #validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :page_id, presence: true

  #remove images file from server
  before_destroy :remember_id
  after_destroy :remove_id_directory

  #Carrier Wawe gem expected
  mount_uploader :image, ImageUploader
  validates :image, presence: true
  validate :file_size

  protected
    def remember_id
      @id = id
    end

    def remove_id_directory
      FileUtils.remove_dir("#{Rails.root}/public/uploads/images/#{@id}", :force => true)
    end

    def file_size
      if self.image.size.to_f/(1000*1000) > 10
        errors.add(:image, "You cannot upload a file greater than 10MB")
      end
    end

end
