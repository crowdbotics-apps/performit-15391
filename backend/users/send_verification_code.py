from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
class SendVerificationCode:
    @staticmethod
    def send_code(code, type, receiver):
        if type == 'email':
            try:
                message = "Your verification Code is {}".format(code)
                send_mail(
                    'Email Verification',
                    message,
                    'no-reply@performitapp.com',
                    [receiver.email],
                    fail_silently=False,
                )
                return {"success": True, "message": "Verification code sent."}
            except Exception as e:
                return {"success": False, "message": str(e) }
        elif type == 'phone':
            #send SMS
            account_sid = settings.TWILIO_ACCOUNT_SID
            auth_token = settings.TWOLIO_ACCOUNT_AUTH_TOKEN
            client = Client(account_sid, auth_token)
            number = receiver.phone_number
            body = "Your Verification Code is {}".format(code)
            try:
                message = client.messages.create(
                    to=number,
                    from_="+15005550006",
                    body=body)
                return {"success": True, "message": "Verification code sent."}
            except Exception as e:
                return {"success": False, "message": str(e) }
                # print(message)
