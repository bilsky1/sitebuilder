=begin
== Popis
Model Image má na starosť správu obrázkov či už ako záznam v databáze alebo aj fyzického súboru na serveri.
V tomto modely je využitý aj ruby gem Carrierwave, resp. je využitá pomocou neho vygenerovaná trieda (ImageUploader) slúžiaca na upload obrázkov.

== Relácia
Vytvorená je relácia na podstránku webu. To znamená, že z tohto modelu je prístup k podstránke (Page), na ktorej je obrázok zobrazovaný.
 belongs_to :page

== Validácia
Maximálna dĺžka názvu obrázku je 50 znakov.
 validates :name, presence: true, length: { maximum: 50 }
Nutná prítomnosť identifikátora podstránky.
 validates :page_id, presence: true

== Požadované parametre Carriewave
Inštancia uploadovaného obrázka. Vďaka tejto inštancií má model prístup k fyzickému súboru na serveri.
  mount_uploader :image, ImageUploader
Nutnosť tohto modelu obsahovať inštanciu uploadovaného súboru. Tento súbor podlieha validácií veľkosti v ImageUploader triede.
  validates :image, presence: true
  validate :file_size

== Before, After save metódy
 before_destroy :remember_id
 after_destroy :remove_id_directory

=end
class Image < ActiveRecord::Base
  #relations
  belongs_to :page

  #validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :page_id, presence: true

  #remove images file from server
  before_destroy :remember_id
  after_destroy :remove_id_directory

  #Carrier Wawe gem expected
  mount_uploader :image, ImageUploader
  validates :image, presence: true
  validate :file_size

  protected
    #Zapamätanie resp. sprístupnenie ID.
    def remember_id
      @id = id
    end

    #Táto metóda sa volá po vymazaní daného záznamu z databázy. Slúži na fyzické odstránenie obrázku zo servera.
    def remove_id_directory
      FileUtils.remove_dir("#{Rails.root}/public/uploads/images/#{@id}", :force => true)
    end

    #Pred uložením obrázku do databázy a jeho uploadovaním je potrebné overiť maximálnu veľkosť súboru.
    #Práve na tento účel slúži metóda file_size. Určuje maximálnu veľkosť uploadovaného obrázku na 10MB.
    def file_size
      if self.image.size.to_f/(1000*1000) > 10
        errors.add(:image, "You cannot upload a file greater than 10MB")
      end
    end
end
