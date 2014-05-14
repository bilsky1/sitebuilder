=begin
== Popis
Model web stránok vytváraných používateľom za pomoci systému.

== Relácie
Určenie tvorcu web stránky.
 belongs_to :user
Relácia s tabuľkou Theme.
 belongs_to :theme
Možnosť obsahovať viac podstránok, pričom po vymazaní web stránky sa odstránia aj všetky podstránky.
 has_many :pages, dependent: :destroy
Prepojenie web stránky s navigáciou (Navigation).
 has_many :navigations, dependent: :destroy
Každý web môže obsahovať prepojenie s externými službami.
 has_many :ext_services, dependent: :destroy

== Validácia
Požiadavka na prítomnosť názvu web stránky a jej obmedzenie maximálnej dĺžky na 50 znakov.
 validates :name, presence: true, length: { maximum: 50 }
Maximálna dĺžka ukladanej farby je 7, pretože sa ukladá iba hexadecimálny kód farby.
 validates :bg_color, length: { maximum: 7 }
Nutnosť priradenia témy.
 validates :theme_id, presence:true
Nutnosť priradenia web stránky používateľovi.
 validates :user_id, presence: true
Validácia názvu subdomény podľa regulárneho výrazu, unikátnosti a obmedzenia maximálnej dĺžky na 30 znakov.
 validates :subdomain, length: { maximum: 30 },
          uniqueness: {allow_blank:true},
          format: { with: VALID_SUBDOMAIN_REGEX },
          allow_blank:true

== Požadované parametre Carriewave
Inštancia uploadovanej favicon ikony. Vďaka tejto inštancií má model prístup k fyzickému súboru na serveri.
  mount_uploader :favicon, FaviconUploader
Overenie veľkosti uploadovanej favicon ikony.
 validate :file_size

== Before validation metóda
Pred samotnou validáciou sa z názvu subdomény odstraňujú veľké písmená.
 before_validation do
    self.subdomain = self.subdomain.downcase
 end
=end
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
    #Overenie veľkosti uploadovaného súboru na 1MB.
    def file_size #:doc:
      if self.favicon.size.to_f/(1000*1000) > 1
        errors.add(:web, "You cannot upload a favicon.ico greater than 1MB.")
      end
    end

end

