class Navigation < ActiveRecord::Base

  #relations
  belongs_to :web
  belongs_to :page

  #validations
  validates :page_position, presence: true
  validates :page_id, presence: true, uniqueness: {scope: :web_id} #uniqueness for combination web_id and page_id

end
