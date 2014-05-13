module ApplicationHelper
  #Métóda helpera slúži na vytvorenie titulku podstránky aplikácie.
  def full_title (page_title)
    base_title = "WBSBuilder"
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end
  #Metoda určujúca aktívnu podstránku aplikácie.
  def nav_aktiv (page)
    if current_page?page
      "active"
    end
  end

end
