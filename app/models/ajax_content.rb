=begin
== Popis
Tento súbor obsahuje model zaoberajúci sa správou údajov <i>AjaxContent</i> bloku.
Tento model má vytvorenú reláciu s modelom <i>Page</i>.
Relácia je typu 1:M, pričom AjaxContent vždy musí spadať pod určitú podstránku.
V tomto modeli sa nachádzajú pravidlá relácií a taktiež validačné pravidlá.

== Relácia
Vytvorená je relácia na podstránku webu. To znamená že z tohoto modelu je prístup k podstránke, do ktorej spadá.
 belongs_to :page

== Validácia
Táto časť kódu daného modelu určuje, že page_id musí byť vždy prítomný. Nieje možné, aby AjaxContent nespadal pod žiadnu podstránku.
 validates :page_id, presence: true
=end
class AjaxContent < ActiveRecord::Base

  belongs_to :page

  validates :page_id, presence: true

end
