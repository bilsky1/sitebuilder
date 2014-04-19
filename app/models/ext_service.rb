class ExtService < ActiveRecord::Base
  #relations
  belongs_to :web

  #validations
  validates :web_id, presence: true
  validates :service_type, presence: true, length: { maximum: 40 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name
  validates :service_value, presence: true

end
