import requests # type: ignore
import json
import base64
from datetime import datetime
from django.http import JsonResponse
from . import genrateAcesstoken
from . import stkPush
import pickle
from django.shortcuts import render # type: ignore

def query_stk_status(request):
    access_token_response = genrateAcesstoken.get_access_token(request)
    # Retrieve checkout request ID from file using pickle
    with open('checkout_request_id.txt', 'rb') as f:
        checkout_request_id = pickle.load(f)
    if isinstance(access_token_response, JsonResponse):
        access_token = access_token_response.content.decode('utf-8')
        access_token_json = json.loads(access_token)
        access_token = access_token_json.get('access_token')


        if access_token:
            query_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
            business_short_code = '174379'
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
            password = base64.b64encode((business_short_code + passkey + timestamp).encode()).decode()
           
            

            query_headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }

            query_payload = {
                'BusinessShortCode': business_short_code,
                'Password': password,
                'Timestamp': timestamp,
                'CheckoutRequestID': checkout_request_id
            }

            try:
                response = requests.post(query_url, headers=query_headers, json=query_payload)
                response.raise_for_status()
                # Raise exception for non-2xx status codes
                response_data = response.json()

                if 'ResultCode' in response_data:
                    result_code = response_data['ResultCode']
                    if result_code == '1037':
                        message = "Timeout in completing transaction"
                         #return JsonResponse({'message': message})  # Return JSON response
                        return render(request, 'c2b.html',{'message': message,'result_code': result_code})
                    elif result_code == '1032':
                        message = "Transaction canceled"
                         #return JsonResponse({'message': message})  # Return JSON response
                        return render(request, 'c2b.html',{'message': message,'result_code': result_code})
                    elif result_code == '1':
                        message = "The balance is insufficient for the transaction"
                         #return JsonResponse({'message': message})  # Return JSON response
                        return render(request, 'c2b.html',{'message': message,'result_code': result_code})
                    elif result_code == '0':
                        message = "The transaction successful"
                         #return JsonResponse({'message': message})  # Return JSON response
                        return render(request, 'c2b.html',{'message': message,'result_code': result_code})
                    else:
                        message = "wrong pin, result code: " + result_code
                        return render(request, 'c2b.html',{'message': message,'result_code': result_code})
                else:
                    message = "Error in response"
                    return render(request, 'c2b.html',{'message': message,'result_code': result_code})

               
            except requests.exceptions.RequestException as e:
                message = "please wait ..."
                result_code = "1"
                return render(request, 'c2b.html',{'message': message,'result_code': result_code}) # Return JSON response for network error
            except json.JSONDecodeError as e:
                return JsonResponse({'error': 'Error decoding JSON: ' + str(e)})  # Return JSON response for JSON decoding error
        else:
            return JsonResponse({'error': 'Access token not found.'})
    else:
        return JsonResponse({'error': 'Failed to retrieve access token.'})