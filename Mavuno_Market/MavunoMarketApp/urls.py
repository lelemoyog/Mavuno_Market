from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
<<<<<<< HEAD
    path('farmer/', views.farmer, name='farmer'),
    path('login/', views.login_view, name='login'),  # Add login view
    path('signup/', views.signup_view, name='signup'),  # Add signup view

]
=======
    path('descprition/', views.description, name='description'),
>>>>>>> 993d1e609e4f77dd266a99db8cfe7a5f449fbc76

