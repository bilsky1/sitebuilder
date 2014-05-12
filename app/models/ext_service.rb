=begin
== Popis
Model určený na komunikáciu s tabuľkou ext_services.
V tejto tabuľke sú uložené kódy jednotlivých služieb tretích strán.
Tieto kódy tretích strán využívajú používatelia napr. pre sledovanie navštevovanosti a pod.

== Relácie
Vytvorená je relácia na model Web.
 belongs_to :web

== Validácia
Táto časť kódu daného modelu určuje, že parameter web_id musí byť vždy prítomný. Nie je možné, aby ExtService nespadal pod žiadny Web.
 validates :web_id, presence: true

Určuje maximálnu dĺžku parametra service_type na 40 znakov. Taktiež tento validačný kód určuje jedinečnosť vzhľadom na parameter web_id.
Nie je teda možné, aby existovalo viacej rovnakých typov pripojených externých služieb vzhľadom na daný web.
 validates :service_type, presence: true, length: { maximum: 40 }, uniqueness: {scope: :web_id} #uniqueness for combination id and name

Podmienená prítomnosť hodnoty kódu služby tretej strany.
 validates :service_value, presence: true
=end
class ExtService < ActiveRecord::Base
  #relations


  #validations
  validates :web_id, presence: true
  validates :service_type, presence: true, length: { maximum: 40 }, uniqueness: {scope: :web_id} #uniqueness for combination id and service_type
  validates :service_value, presence: true

end
