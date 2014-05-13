class Subdomain
  #Metóda slúžiaca na vytvorenie obmedzenia používaného v route.rb.
  def self.matches?(request)
    request.subdomain.present? && request.subdomain != "www"
  end
end