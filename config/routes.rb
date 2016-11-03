Rails.application.routes.draw do
  resources :lobbies
  get 'users/new'
  root 'application#landing'
end
