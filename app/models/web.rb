class Web < ActiveRecord::Base
  #relations
  belongs_to :user

  VALID_SUBDOMAIN_REGEX = /\A(?![-.])[a-zA-Z0-9.-]+(?<![-.])\z/i

  #validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :user_id, presence: true
  validates :subdomain, length: { maximum: 30 },
            uniqueness: {allow_blank:true},
            format: { with: VALID_SUBDOMAIN_REGEX },
            allow_blank:true
end
