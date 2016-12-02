Rails.application.routes.draw do
  get 'highscores/index'

  get 'highscores/list'

  resources :lobbies do
    get 'status'
    member do
      get :join
      post :show
    end
  end
  resources :highscores
  get 'users/new'
  get 'static_pages/home'
  get 'static_pages/about'
  root 'lobbies#new'
end
