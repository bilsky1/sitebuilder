class NoSubdomain
  #Metóda slúžiaca na vytvorenie obmedzenia používaného v route.rb pre zamedzenie prístupu návštevníkov generovaných webov k
  #niektorým častiam aplikácie.
  def self.matches?(request)
    !(request.subdomain.present? && request.subdomain != "www")
  end
end