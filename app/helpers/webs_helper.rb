module WebsHelper
  #Zistenie zobrazovacej akcie tvoreného webu.
  def isWebsShowAction?
    (params[:action] == 'show' && params[:controller] == 'webs')
  end

  #Zistenie indexovacieho parametra pre ponúknutie obsahu vyhľadávaču za účelom zaindexovania AJAX-ového obsahu.
  def isEscapeFragmentParams?
    !params[:_escaped_fragment_].nil?
  end

  #Zaregistrovanie Edit a Update akcie vo WebsController.
  def isWebsEditOrUpdateAction?
    (params[:action] == 'edit' || params[:action] == 'update') && (params[:controller] == 'webs')
  end
end