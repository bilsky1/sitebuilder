module WebsHelper
  def isWebsShowAction?
    (params[:action] == 'show' && params[:controller] == 'webs')
  end
  def isWebsEditAction?
    (params[:action] == 'edit' && params[:controller] == 'webs')
  end
end