class Page < ActiveRecord::Base
  #relations
  belongs_to :web
  has_many :images, dependent: :destroy

  #validations
  validates :web_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name
  validates :title, presence: true, length: { maximum: 70 }

end
