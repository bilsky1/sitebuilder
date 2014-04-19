module ApplicationHelper
  def full_title (page_title)
    base_title = "WBSBuilder"
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end

  def theme_assets_load()

  end

  def nav_aktiv (page)
    if current_page?page
      "active"
    end
  end

end
