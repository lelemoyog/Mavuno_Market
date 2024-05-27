from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('farmer/', views.farmer, name='farmer'),
    path('login/', views.login_view, name='login'),  # Add login view
    path('signup/', views.signup_view, name='signup'),  # Add signup view

]

