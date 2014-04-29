class Web < ActiveRecord::Base
  before_validation do
    self.subdomain = self.subdomain.downcase
  end

  #relations
  belongs_to :user
  belongs_to :theme
  has_many :pages, dependent: :destroy
  has_many :navigations, dependent: :destroy
  has_many :ext_services, dependent: :destroy

  #favicon uploader carriewave
  mount_uploader :favicon, FaviconUploader

  VALID_SUBDOMAIN_REGEX = /\A(?![-.])[a-zA-Z0-9.-]+(?<![-.])\z/i

  #validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :bg_color, length: { maximum: 7 }
  validates :theme_id, presence:true
  validates :user_id, presence: true
  validates :subdomain, length: { maximum: 30 },
            uniqueness: {allow_blank:true},
            format: { with: VALID_SUBDOMAIN_REGEX },
            allow_blank:true
  validate :file_size

  private
    def file_size
      if self.favicon.size.to_f/(1000*1000) > 1
        errors.add(:web, "You cannot upload a favicon.ico greater than 1MB.")
      end
    end

end

