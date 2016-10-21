Rails.application.routes.draw do
  get 'lobby/new'
  get 'users/new'
  root 'application#landing'
end
