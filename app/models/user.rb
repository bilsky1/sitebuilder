=begin
== Popis
Model slúžiaci na interakciu s tabuľkou Users, v ktorej sú uložené všetky údaje o používateľovi.

== Relácie
Každý používateľ môže mať vytvorených viac web stránok.
 has_many :webs, dependent: :destroy

== Validácia
Bez názvu web stránky nie je možné danú stránku uložiť, resp. vytvoriť. Maximálna dĺžka názvu webu je 50 znakov.
 validates :name, presence: true, length: { maximum: 50 }
Validácie e-mailovej adresy. Overuje sa, či zadaná emailová adresa nie je prázdna.
Taktiež overujeme email pomocou regulárneho výrazu a kontrolujeme unikátnosť emailu v systéme.
 validates :email, presence: true,
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }

== Before save metóda
Pred uložením sa upravuje emailová adresa a taktiež sa generujú bezpečnostné tokeny.
 before_save do
    self.email = email.downcase
    generate_token(:remember_token)
    generate_token(:verification_token)
 end
Po uložení sa overuje existencia záznamu v navigácií (Navigation).
 after_save :check_navigation_exist

=end
class User < ActiveRecord::Base
  before_save do
    self.email = email.downcase
    generate_token(:remember_token)
    generate_token(:verification_token)
  end

  #relations
  has_many :webs, dependent: :destroy


  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true,
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }

  #password confirmation
  has_secure_password
  validates :password_confirmation, presence:true
  validates :password, length: { minimum: 6 }  #presence is automatically validate in has_secure_password

  #Metóda slúžiaca pre nastavenie používateľa ako verifikovaného.
  def verify
    self.state = 1
    self.save(:validate=>false)
  end

  #Odosielanie emailu za účelom znovu obnovenia zabudnutého hesla.
  #Pred samotným odoslaním emailu sa generuje bezpečnostný token a ukladá sa čas odoslania.
  def send_password_reset
    generate_token(:password_reset_token)
    self.password_reset_sent_at = Time.zone.now
    self.save(:validate=>false)
    UserMailer.password_reset(self).deliver
  end

  #Úspešnej registrácií predchádza aj overenie emailu používateľom.
  #Toto overenie prebieha na základe registračného emailu, ktorý obsahuje overovací odkaz s vygenerovaným bezpečnostným kľúčom.
  #Odosielanie emailu zabezpečuje práve táto metóda.
  def send_registration_confirmation
    UserMailer.registration_confirmation(self).deliver
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private
    #Generovanie bezpečnostných tokenov.
    def generate_token(column) #:doc:
      begin
        self[column] = User.encrypt(SecureRandom.base64(15).tr('+/=', '0aZ').strip.delete("\n"))
      end while User.exists?(column => self[column])
    end

end
