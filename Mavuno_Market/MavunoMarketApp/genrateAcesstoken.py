import requests # type: ignore
from django.http import JsonResponse

def get_access_token(request):
    consumer_key = "ypSxbqGfvE9kyEWrJAid9UT1JXzTsw5Ueah3AdymIkZ0R1zy"  # Fill with your app Consumer Key
    consumer_secret = "9Dl5qpKXhE4l2ml93k8nM0ivK86eeeYEIRynBj4XB0bE2cLEMmC2TaZwCdGH0pqT"  # Fill with your app Consumer Secret
    access_token_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    headers = {'Content-Type': 'application/json'}
    auth = (consumer_key, consumer_secret)
    try:
        response = requests.get(access_token_url, headers=headers, auth=auth)
        response.raise_for_status()  # Raise exception for non-2xx status codes
        result = response.json()
        access_token = result['access_token']
        return JsonResponse({'access_token': access_token})
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)})
    
    
    