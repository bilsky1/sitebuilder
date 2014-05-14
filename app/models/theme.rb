=begin
== Popis
Ukladanie jednotlivých tém používaných pri tvorbe web stránky.

== Relácie
Každá téma môže byť priradená viacerým web stránkam.
 has_many :webs

== Validácia
Uloženie témy požaduje definovanie názvu témy, ktorý nesmie obsahovať viac ako 50 znakov.
 validates :name, presence: true, length: { maximum: 50 }

== Before save metóda
Vzhľadom na to, že sa používa názov súborov témy rovnaký ako name atribút v tabuľke Themes, je vytvorená before metóda na normalizáciu tohoto názvu.
 before_save do
   self.name = name.mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ') #delete diacritics and spaces
 end

=end
class Theme < ActiveRecord::Base
  before_save do
    self.name = name.mb_chars.normalize(:kd).gsub(/[^\x00-\x7F]/n,'').to_s.delete(' ') #delete diacritics and spaces
  end

  #relations
  has_many :webs

  #validations
  validates :name, presence: true, length: { maximum: 50 }

end
