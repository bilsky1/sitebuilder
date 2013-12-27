class Web < ActiveRecord::Base
  #relations
  belongs_to :user

  #validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :user_id, presence: true
end
