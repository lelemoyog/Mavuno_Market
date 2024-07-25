from django.shortcuts import render # type: ignore
from . import genrateAcesstoken
from . import stkPush
from . import callback
from . import query
from . import B2C



# Create your views here.
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def home(request):
    return render(request, 'home.html')


def signup(request):
    return render(request, 'signup.html')

def signin(request):
    return render(request, 'signin.html')

def farmer(request):
    return render(request, 'farmer.html')

def description(request):
    return render(request, 'description.html')

def profile(request):
    return render(request, 'profile.html')

def vendor(request):
    return render(request, 'vendor.html')

def testimonial(request):
    return render(request, 'testimonial.html')

def dashboard(request):
    return render(request, 'dashboard.html')
def terms_conditions(request):
    return render(request, 'terms_conditions.html')
def terms_condition(request):
    return render(request, 'terms_condition.html')
