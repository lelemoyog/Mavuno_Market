from django.shortcuts import render # type: ignore




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

