module WebsHelper
  def isWebsShowAction?
    (params[:action] == 'show' && params[:controller] == 'webs')
  end

  def isEscapeFragmentParams?
    !params[:_escaped_fragment_].nil?
  end

  def isWebsEditOrUpdateAction?
    (params[:action] == 'edit' || params[:action] == 'update') && (params[:controller] == 'webs')
  end
end