from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
     path('farmer/', views.farmer, name='farmer'),
     
   
]