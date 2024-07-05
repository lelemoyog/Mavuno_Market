from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import requests # type: ignore
from . import genrateAcesstoken
import json
from datetime import datetime
import base64
from django_daraja.mpesa.core import MpesaClient # type: ignore
cl = MpesaClient()
def initiate_b2c(request):
        print(cl)
        phone_number = request.POST.get('phone3')
        amount = int(request.POST.get('amount3'))
        print(amount)
        transaction_desc = 'Description'
        occassion = 'Occassion'
        callback_url = 'https://api.darajambili.com/b2c/result'
        response = cl.business_payment(phone_number, amount, transaction_desc, callback_url, occassion)
        response.raise_for_status()   
                # Raise exception for non-2xx status codes
        response_data = response.json()
        return render(request, 'b2c.html',{'response_data':response_data})
   