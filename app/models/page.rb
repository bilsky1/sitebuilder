class Page < ActiveRecord::Base
  before_save do
    self.url_name = name.mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ').downcase #delete diacritics and spaces (name is used for #!url purpose)
    deleteUnusedImage
    deleteUnusedAjaxContents
  end

  after_save :check_navigation_exist



  #relations
  belongs_to :web
  has_many :images, dependent: :destroy
  has_many :navigations, dependent: :destroy
  has_many :ajax_contents, dependent: :destroy

  #validations
  validates :web_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name
  validates :url_name, presence: true, length: { maximum: 50 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name
  validates :title, presence: true, length: { maximum: 70 }

  private
    def check_navigation_exist
      if self.navigations.blank?
        newNav = self.navigations.new(web_id: self.web_id, page_position: get_next_page_position).save!
      end
    end

    def get_next_page_position
      nav = self.web.navigations.order("page_position DESC").first
      if nav.nil?
        return 1
      else
        return nav.page_position
      end
    end

    def deleteUnusedImage
      self.images.each do |image|
        unless self.content.include? "href=\"" + image.image.url + "\""
          unless isImageInAjaxContents(image)
            image.destroy
          end
        end
      end
    end

    def isImageInAjaxContents (image = nil)
      unless(image.nil?)
        self.ajax_contents.each do |ajax_content|
          if (ajax_content.content.include? "href=\"" + image.image.url + "\"") || (ajax_content.content_after.include? "href=\"" + image.image.url + "\"")
            return true
          end
        end
        return false
      end
    end

    def deleteUnusedAjaxContents
      self.ajax_contents.each do |ajax_content|
        unless self.content.include? "remote-ajax-content-id=\"" + ajax_content.id.to_s + "\""
          ajax_content.destroy
        end
      end
    end
end
