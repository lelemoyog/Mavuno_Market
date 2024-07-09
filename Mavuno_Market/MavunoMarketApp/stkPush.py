from datetime import datetime
import json
import base64
from django.http import JsonResponse
import requests # type: ignore
from . import genrateAcesstoken
import pickle
from django.shortcuts import render # type: ignore

def initiate_stk_push(request):
    access_token_response = genrateAcesstoken.get_access_token(requests)
    if isinstance(access_token_response, JsonResponse):
        access_token = access_token_response.content.decode('utf-8')
        access_token_json = json.loads(access_token)
        access_token = access_token_json.get('access_token')
        if access_token:
            amount = 1 #int(request.POST.get('amount1'))
            phone =request.POST.get('phone1')
            process_request_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
            callback_url = 'https://37c6-105-163-157-12.ngrok-free.app/query/'
            passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
            business_short_code = '174379'
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode((business_short_code + passkey + timestamp).encode()).decode()
            party_a = phone
            party_b = ""
            account_reference = 'MavunoMarketApp'
            transaction_desc = 'Order payment.'
            stk_push_headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
            
            stk_push_payload = {
                'BusinessShortCode': business_short_code,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerPayBillOnline',
                'Amount': amount,
                'PartyA': party_a,
                'PartyB': business_short_code,
                'PhoneNumber': party_a,
                'CallBackURL': callback_url,
                'AccountReference': account_reference,
                'TransactionDesc': transaction_desc
            }

            try:
                response = requests.post(process_request_url, headers=stk_push_headers, json=stk_push_payload)
                response.raise_for_status()   
                # Raise exception for non-2xx status codes
                response_data = response.json()
                checkout_request_id = response_data['CheckoutRequestID']
                response_code = response_data['ResponseCode']
                
                if response_code == "0":
                   
                #Add response checkout request id to txt file using pickle

                    with open('checkout_request_id.txt', 'wb') as f:
                        pickle.dump(checkout_request_id, f)
                        # return JsonResponse({'CheckoutRequestID': checkout_request_id})
                        return render(request, 'paymentSuccess.html',{'response_data': response_data})



                else:
                    return JsonResponse({'error': 'STK push failed.'})
            except requests.exceptions.RequestException as e:
                return JsonResponse({'error': str(e)})
        else:
            return JsonResponse({'error': 'Access token not found.'})
    else:
        return JsonResponse({'error': 'Failed to retrieve access token.'})