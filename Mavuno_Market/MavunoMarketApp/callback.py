import json
from django.http import JsonResponse


def process_stk_callback(request):
    try:
        data = json.loads(request.body)
        # Process the data
        stk_callback_response = json.loads(request.body)
    except json.JSONDecodeError:
        # Handle empty or malformed JSON
        return JsonResponse({'error': 'Invalid JSON payload.'})
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': str(e)})
        pass        
    
    merchant_request_id = stk_callback_response['Body']['stkCallback']['MerchantRequestID']
    checkout_request_id = stk_callback_response['Body']['stkCallback']['CheckoutRequestID']
    result_code = stk_callback_response['Body']['stkCallback']['ResultCode']
    result_desc = stk_callback_response['Body']['stkCallback']['ResultDesc']
    amount = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value']
    transaction_id = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value']
    user_phone_number = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value']
    
    if result_code == 0:
        # Add data to firebase
        return JsonResponse({'message': 'STK push successful.'})
        