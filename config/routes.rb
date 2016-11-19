Rails.application.routes.draw do
  resources :lobbies do
    get 'status'
  end
  get 'users/new'
  get 'static_pages/home'
  get 'static_pages/about'
  root 'lobbies#new'
end
