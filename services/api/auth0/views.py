# https://auth0.com/docs/quickstart/backend/django/01-authorization
from functools import wraps
import jwt

from django.http import JsonResponse

def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]

    return token

def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """
    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_auth_header(args[0])
            decoded = jwt.decode(token, verify=False)
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse({'message': 'You don\'t have access to this resource'})
            response.status_code = 403
            return response
        return decorated
    return require_scope

from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def public(request):
    return JsonResponse({'message': 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'})


@api_view(['GET'])
def private(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated to see this.'})

@api_view(['GET'])
@requires_scope('read:messages')
def private_scoped(request):
    return JsonResponse({'message': 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'})

# import json
# from authlib.integrations.django_client import OAuth
# from django.conf import settings
# from django.shortcuts import redirect, render
# from django.urls import reverse
# from urllib.parse import quote_plus, urlencode

# # Create your views here.

# oauth = OAuth()

# oauth.register(
#   "auth0",
#   client_id=settings.AUTH0_CLIENT_ID,
#   client_secret=settings.AUTH0_CLIENT_SECRET,
#   client_kwargs={
#     "scope": "openid profile email",
#   },
#   server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
# )

# def index(request):
#   print(f"client id {settings.AUTH0_CLIENT_ID}")
#   return render(
#     request,
#     "index.html",
#     context={
#       "session": request.session.get("user"),
#       "pretty": json.dumps(request.session.get("user"), indent=4)
#     },
#   )

# def callback(request):
#   token = oauth.auth0.authorize_access_token(request)
#   request.session["user"] = token
#   return redirect(request.build_absolute_uri(reverse("index")))

# def login(request):
#   return oauth.auth0.authorize_redirect(
#     request, request.build_absolute_uri(reverse("callback"))
#   )

# def logout(request):
#   request.session.clear()

#   return redirect(
#     f"https://{settings.AUTH0_DOMAIN}/v2/logout?"
#     + urlencode(
#       {
#         "returnTo": request.build_absolute_uri(reverse("index")),
#         "client_id": settings.AUTH0_CLIENT_ID,
#       },
#       quote_via=quote_plus,
#     ),
#   )

  