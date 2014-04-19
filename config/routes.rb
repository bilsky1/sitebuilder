Sitebuilder::Application.routes.draw do


  constraints(Subdomain) do
    resources :webs
    match '/',  to: 'webs#show', via: 'get'

    match '/pages/get_page', to: 'pages#get_page', via: 'post'

    match '/ajax_contents/get_content', to: 'ajax_contents#get_content', via: 'post'
    match '/ajax_contents/get_content_after', to: 'ajax_contents#get_content_after', via: 'post'

    match '/ext_services/get_ext_service', to: 'ext_services#get_ext_service', via: 'post'
  end

  constraints(NoSubdomain) do
    resources :users
    #resources :images
    #resources :pages
    resources :sessions, only: [:new, :create, :destroy]
    resources :password_resets

    root to: 'static_pages#home'

    match '/webs/:id/update_style_settings',  to: 'webs#update_style_settings', via: 'post'
    match '/webs/:id/update_publish',  to: 'webs#update_publish', via: 'post'
    match '/webs/:id',  to: 'webs#update', via: 'post'
    resources :webs

    match '/help',    to: 'static_pages#help',    via: 'get'
    match '/auth',    to: 'static_pages#auth',    via: 'get'

    match '/signup',  to: 'users#new',            via: 'get'
    match '/signin',  to: 'sessions#new',         via: 'get'
    match '/signout', to: 'sessions#destroy',     via: 'delete'

    #images controller match for AJAX call from subpagebuild JS plugin
    match '/images/create_assets', to: 'images#create_assets',     via: 'post'
    match '/images/add_assets', to: 'images#add_assets',     via: 'post'
    match '/images/delete_assets', to: 'images#delete_assets',     via: 'post'

    #pages API
    match '/pages/get_page', to: 'pages#get_page', via: 'post'
    match '/pages/create_page', to: 'pages#create_page', via: 'post'
    match '/pages/update_page', to: 'pages#update_page', via: 'post'
    match '/pages/update_page_settings', to: 'pages#update_page_settings', via: 'post'
    match '/pages/delete_page', to: 'pages#delete_page', via: 'post'

    #navigations API
    match '/navigations/uprate_navigation', to: 'navigations#uprate_navigation', via: 'post'

    #ajax_contents API
    match '/ajax_contents/create_blank', to: 'ajax_contents#create_blank', via: 'post'
    match '/ajax_contents/update_contents', to: 'ajax_contents#update_contents', via: 'post'
    match '/ajax_contents/get_contents', to: 'ajax_contents#get_contents', via: 'post'
    match '/ajax_contents/get_content', to: 'ajax_contents#get_content', via: 'post'
    match '/ajax_contents/get_content_after', to: 'ajax_contents#get_content_after', via: 'post'
    match '/ajax_contents/delete', to: 'ajax_contents#delete', via: 'post'

    #ext_services API
    match '/ext_services/get_ext_service', to: 'ext_services#get_ext_service', via: 'post'
    match '/ext_services/create_ext_service', to: 'ext_services#create_ext_service', via: 'post'
    match '/ext_services/update_ext_service', to: 'ext_services#update_ext_service', via: 'post'
    match '/ext_services/delete_ext_service', to: 'ext_services#delete_ext_service', via: 'post'


    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".

    # You can have the root of your site routed with "root"
    # root 'welcome#index'

    # Example of regular route:
    #   get 'products/:id' => 'catalog#view'

    # Example of named route that can be invoked with purchase_url(id: product.id)
    #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

    # Example resource route (maps HTTP verbs to controller actions automatically):
    #   resources :products

    # Example resource route with options:
    #   resources :products do
    #     member do
    #       get 'short'
    #       post 'toggle'
    #     end
    #
    #     collection do
    #       get 'sold'
    #     end
    #   end

    # Example resource route with sub-resources:
    #   resources :products do
    #     resources :comments, :sales
    #     resource :seller
    #   end

    # Example resource route with more complex sub-resources:
    #   resources :products do
    #     resources :comments
    #     resources :sales do
    #       get 'recent', on: :collection
    #     end
    #   end

    # Example resource route with concerns:
    #   concern :toggleable do
    #     post 'toggle'
    #   end
    #   resources :posts, concerns: :toggleable
    #   resources :photos, concerns: :toggleable

    # Example resource route within a namespace:
    #   namespace :admin do
    #     # Directs /admin/products/* to Admin::ProductsController
    #     # (app/controllers/admin/products_controller.rb)
    #     resources :products
    #   end
  end
end
