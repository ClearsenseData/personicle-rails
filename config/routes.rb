Rails.application.routes.draw do
  
  get 'mobility/index'
  get 'sessions/new'
  get 'sessions/create'
  get 'sessions/destroy'
  get 'home/index'
  
  # devise_for :users
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  get '/logout', :to => 'sessions#destroy'
  get '/login', :to => 'sessions#new', :as => :login
  resources :users
  root to: 'pages#login'
  get 'pages/dashboard', :to => 'dashboard#index'
  get 'pages/dashboard/physician', :to =>'physician#index'
  # post 'pages/physician-create-account', :to =>'physician#create_account'
  post 'pages/dashboard', :to => 'dashboard#index'
  get 'pages/connections', :to => 'connection#index'
  get 'pages/profile', :to => 'profile#index'
  post 'pages/profile/add_physician', :to=>'profile#add_physician'
  post 'pages/profile/update_user_info', :to=>'profile#update_user_info'
  # post 'pages/profile', :to => 'profile#index'
  get 'pages/foodlog', :to => 'foodlog#index'
  get 'pages/foodlog/data', :to => 'foodlog#get_edamam_data' , :as => 'get_edamam_data' 
  post 'pages/foodlog/log', :to => 'foodlog#log_food', :as => 'log_food'
  get 'pages/mobility', :to => 'mobility#index'
  post 'pages/mobility', :to => 'mobility#index'
  get 'pages/sleep', :to => 'sleep#index'
  post 'pages/sleep', :to => 'sleep#index'
  # get 'pages/foodlog/recipes', :to => 'foodlog#render'
  get 'pages/login'
  post 'pages/create-physician-account', :to => 'pages#create_physician_account'
  # get 'pages/register'
  # get 'pages/recipes'
  get 'pages/dashboard/physician-questions', :to=> 'user_questions#index'
  post 'pages/dashboard/physician-questions', :to=> 'user_questions#send_responses'
  post 'pages/profile/remove_physician', :to=>'profile#remove_physician'
  post 'pages/dashboard/physician/get_user_data',  :to =>'physician#get_user_data'
  get  'pages/dashboard/physician/get_user_data',  :to =>'physician#get_user_data'
  post 'question/create', :to => 'question#create'

  post 'pages/dashboard/delete-event', :to => 'dashboard#delete_event', :as => 'delete_user_events'
end
