from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('descprition/', views.description, name='description'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('farmer/', views.farmer,name='farmer' ),
]


    



