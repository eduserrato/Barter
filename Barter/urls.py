from django.urls import path
from . import views
#added by me 
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("", views.index, name = 'index'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),



    # API Routes
    path("create_barter",views.create_barter, name="create_barter"),
    path("show_barters/<str:barters>", views.list_of_barters, name = "show_barters"),
    path("create_offer/<int:barter_id>",views.create_offer, name="create_offer"),
    path("single_barter/<int:barter_id>",views.single_barter, name ="single_barter"),
    path("barter_offers/<int:barter_id>",views.get_barter_offers, name="single_barter_offers"),
    path("get_offers/<str:offer_type>", views.get_offers, name = "get_offers"),
    path("accept_offer/<int:offer_id>", views.accept_offer, name = "accept_offer"),
    path("reject_offer/<int:offer_id>", views.reject_offer, name = "reject_offer"),
    path("conversations", views.get_conversations, name = "get_conversations"),
    path("conversation/<int:barter_id>", views.get_conversation, name = "get_conversation"),
    path("send_message/<int:barter_id>", views.send_message, name = "send_message")


]
if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)