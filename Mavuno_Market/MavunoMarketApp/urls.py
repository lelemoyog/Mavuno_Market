from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('farmer/', views.farmer,name='farmer' ),
    path('profile/', views.profile, name='profile'),
    path('vendor/', views.vendor,name='vendor' ),
    
    path('testimonial/', views.testimonial, name='testimonial'),

    path('description/', views.description, name='description'),
]


    



