=begin
== Popis
Tento model slúži na ukladanie obsahu podstránky webu. Model obsahuje relácie na dalšie modely a
taktiež rôzne metódy veľmi podstatné pre správne fungovanie systému.

== Relácie
Každá podstránka spadá pod určitý web.
 belongs_to :web
Podstránka môže obsahovať viac obrázkov, ktoré sa po vymazaní podstránky odstránia.
 has_many :images, dependent: :destroy
Každá podstránka obsahuje svoju pozíciu v navigácií danej web stránky.
 has_many :navigations, dependent: :destroy
Rovnako ako v prípade obrázkov môže podstránka obsahovať viac Ajax-ových blokov.
 has_many :ajax_contents, dependent: :destroy

== Validácia
Nutnosť spadať pod niektorú web stránku.
 validates :web_id, presence: true
Ošetrenie veľkosti názvu podstránky webu. Maximálna dĺžka názvu je 50 znakov. Názov podstránky musí byť pre daný web jedinečný.
 validates :name, presence: true, length: { maximum: 50 }, uniqueness: {scope: :web_id}
Pre účely vytvorenia správnych odkazov je nutné pre hodnotu odkazu využívať url_name. Tento parameter je vlastne upravením parametru
name. Platia pre neho rovnaké validačné pravidlá ako pre parameter name.
 validates :url_name, presence: true, length: { maximum: 50 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name
Ošetrenie nutnosti obsahovať titulok podstránky o maximálnej veľkosti 70 znakov.
 validates :title, presence: true, length: { maximum: 70 }

== Before, After save metódy
Pred uložením podstránky sa robí úprava parametra name a uloženie do url_name za účelom správneho generovania odkazu.
Táto úprava spočíva v odstránení diakritiky, medzier a niektorých špeciálnych znakov.
 before_save do
    self.url_name = name.mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ').downcase #delete diacritics and spaces (name is used for #!url purpose)
    deleteUnusedImage
    deleteUnusedAjaxContents
 end
Po uložení sa overuje existencia záznamu v navigádií (Navigation).
 after_save :check_navigation_exist

=end
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
    #Overovanie záznamu v navigations tabuľke.
    def check_navigation_exist #:doc:
      if self.navigations.blank?
        newNav = self.navigations.new(web_id: self.web_id, page_position: get_next_page_position).save!
      end
    end

    #Zistenie poslednej uloženej hodnoty pozície v navigácií.
    def get_next_page_position #:doc:
      nav = self.web.navigations.order("page_position DESC").first
      if nav.nil?
        return 1
      else
        return nav.page_position
      end
    end

    #Odstránenie nepoužívaných obrázkov.
    def deleteUnusedImage #:doc:
      self.images.each do |image|
        unless self.content.include? "href=\"" + image.image.url + "\""
          unless isImageInAjaxContents(image)
            image.destroy
          end
        end
      end
    end

    #Zistenie, či sa používa daný obrázok v AJAX-ovom obsahu. Ako argument sa používa inštancia obrázku.
    def isImageInAjaxContents (image = nil) #:doc:
      unless(image.nil?)
        self.ajax_contents.each do |ajax_content|
          if (ajax_content.content.include? "href=\"" + image.image.url + "\"") || (ajax_content.content_after.include? "href=\"" + image.image.url + "\"")
            return true
          end
        end
        return false
      end
    end

    # Odstránenie nepoužívaných AJAX-ovo obsahových blokov.
    def deleteUnusedAjaxContents #:doc:
      self.ajax_contents.each do |ajax_content|
        unless self.content.include? "remote-ajax-content-id=\"" + ajax_content.id.to_s + "\""
          ajax_content.destroy
        end
      end
    end
end
