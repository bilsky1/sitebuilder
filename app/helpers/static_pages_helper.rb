module StaticPagesHelper
  def home_transify
    if current_page?root_path
      "transify"
    end
  end
end
