class Theme < ActiveRecord::Base
  before_save do
    self.name = name.mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ') #delete diacritics and spaces
  end

  #relations
  has_many :webs

  #validations
  validates :name, presence: true, length: { maximum: 50 }

end
