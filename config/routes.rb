Rails.application.routes.draw do
  resources :lobbies
  get 'users/new'
  get 'static_pages/home'
  get 'static_pages/about'
  root 'lobbies#new'
end
