=begin
== Popis
Navigation model a celkovo tabuľka navigations je určená na ukladanie poradia podstránok v navigácií danej web stránky.

== Relácie
Vytvorená je relácie na model Web a Page.
 belongs_to :web
 belongs_to :page

== Validácia
Nutná prítomnosť pozície danej podstránky v navigácií.
 validates :page_position, presence: true
Jedinečnosť identifikátora podstránky vzhľadom na indetifikátor webu.
Táto validácia vlastne určuje, že pre každú podstránku webu môže byť vytvorený iba jeden záznam pozície v navigácií.
 validates :page_id, presence: true, uniqueness: {scope: :web_id}
=end
class Navigation < ActiveRecord::Base

  #relations
  belongs_to :web
  belongs_to :page

  #validations
  validates :page_position, presence: true
  validates :page_id, presence: true, uniqueness: {scope: :web_id} #uniqueness for combination web_id and page_id

end
