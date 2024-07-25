from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('farmer/', views.farmer,name='farmer' ),
    path('profile/', views.profile, name='profile'),
    path('vendor/', views.vendor,name='vendor' ),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('terms_condition/', views.terms_condition, name='terms_condition.html'),
    


    path('testimonial/', views.testimonial, name='testimonial'),

    path('description/', views.description, name='description'),

    path('accesstoken/', views.genrateAcesstoken.get_access_token, name='get_access_token'),
    path('initiate/', views.stkPush.initiate_stk_push, name='initiate_stk_push'),
    path('callback/', views.callback.process_stk_callback, name='process_stk_callback'),
    path('query/', views.query.query_stk_status, name='query_stk_status'),
    path('b2c/', views.B2C.initiate_b2c, name='initiate_b2c_payment'),


    
]






