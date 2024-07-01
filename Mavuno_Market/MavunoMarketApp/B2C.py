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
        phone_number = '254717521766'
        amount = 1
        transaction_desc = 'Description'
        occassion = 'Occassion'
        callback_url = 'https://api.darajambili.com/b2c/result'
        response = cl.business_payment(phone_number, amount, transaction_desc, callback_url, occassion)
        return HttpResponse(response)
   
   
   
   
    # access_token_response = genrateAcesstoken.get_access_token(requests)
    # if isinstance(access_token_response, JsonResponse):
    #     access_token = access_token_response.content.decode('utf-8')
    #     access_token_json = json.loads(access_token)
    #     access_token = access_token_json.get('access_token')
    #     passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    #     business_short_code = '174379'
    #     timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    #     password = base64.b64encode((business_short_code + passkey + timestamp).encode()).decode()
    #     if access_token:
    #         headers = {
    #         'Content-Type': 'application/json',
    #         'Authorization': 'Bearer ' + access_token
    #         }

    #         payload = {
    #             "OriginatorConversationID": "41b6b365-c8ed-4c6f-a93a-a5d1496c0e42",
    #             "InitiatorName": "testapi",
    #             "SecurityCredential": "CekUZ+kLk6Ua2fYNyZjTiF5kP7zwv9EdD5y0w5LWJTW4JZF5ElSrBmY9wHKkvcuQYi35EMVwoB3KCMh/5KD+HEddtNCQnUuqa8oBtxv0XqrOsS21FyqF47ps9G2DjqUdqK7LKP++JQ0hsF9uUsPFs8MwUQnMWcCx8fxWDWCrnVY7nNd36cBCUHU5Y5NqYKK5Y204P4CQ1S/CmbvqiIL/TWNjSk3A/AiiMhxYSK1qhgJuZufAk73CQO1brc68ip5MR4lX6cbVnMC/XClawuWCv5st+VOPhj9FhST0x3Y+kWRY2uTQD45LUGt0RZpUGQk/lFAZ8sxd5yxXL04Hg/1+/w==",
    #             "CommandID": "BusinessPayment",
    #             "Amount": 10,
    #             "PartyA": 600978,
    #             "PartyB": 254708374149,
    #             "Remarks": "Test remarks",
    #             "QueueTimeOutURL": "https://37c6-105-163-157-12.ngrok-free.app",
    #             "ResultURL": "https://37c6-105-163-157-12.ngrok-free.app",
    #             "Occasion": "null",
    #         }
    #         print("Headers:", headers)
    #         print("Payload:", payload)
    #         try:
    #             response = requests.request("POST", 'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest', headers = headers, data = payload)
    #             response.raise_for_status() # Raise exception for non-2xx status codes
    #             response_data = response.json()

                
    #     # {
    #     #   "ConversationID": "AG_20240630_2010770d28b060a2fe6a",
    #     #   "OriginatorConversationID": "b3967ad1-2db2-4c83-9a2b-dc39bc67c0b9",
    #     #   "ResponseCode": "0",
    #     #   "ResponseDescription": "Accept the service request successfully."
    #     # }

    #             response_code = response_data['ResponseCode']
    #             if response_code == "0":
    #                 return JsonResponse({'response': response.text})

    #             else:
    #                 return JsonResponse({'error': response_data['ResponseDescription']})

    #         except requests.exceptions.RequestException as e:

    #     # {    
    #     #    "requestId": "11728-2929992-1",
    #     #    "errorCode": "401.002.01",
    #     #    "errorMessage": "Error Occurred - Invalid Access Token - BJGFGOXv5aZnw90KkA4TDtu4Xdyf"
    #     # }
    #             error = response.json()
    #             error_message = error.get('errorMessage')
    #             return JsonResponse({'error': error_message, 'error_code': error.get('errorCode')})

