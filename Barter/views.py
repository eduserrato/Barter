from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import *
from django.contrib import messages

from .models import User
from django.http import JsonResponse
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator,EmptyPage,InvalidPage ##This might or might not be used....



def index(request):    
    form_barter = BarterForm()
    form_offer = OfferForm()
    form_message = MessageForm()
    return render(request, "Barter/index.html",{'form_barter':form_barter, 'form_offer':form_offer, 'form_message':form_message})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "Barter/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "Barter/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "Barter/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "Barter/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "Barter/register.html")

def create_barter(request):
    if request.method == 'POST':
        print("method was post")
        form_filled = BarterForm(request.POST, request.FILES)

        if form_filled.is_valid():
            obj = form_filled.save(commit=False)
            obj.owner = request.user
            obj.save()
        messages.add_message(request, messages.SUCCESS, "Barter created succesfully.")
        #return render(request, "Barter/index.html", {'form':form})
    else:
        print("method not post")
    return HttpResponseRedirect(reverse("index"))

def list_of_barters(request, barters):
    if barters == 'all':
        list_barters = Post.objects.filter(winner = None)
        list_barters = list_barters.order_by("-timestamp").all()

        return JsonResponse([barter.serialize() for barter in list_barters], safe=False)
    elif barters == 'my':
        list_barters = Post.objects.filter(owner=request.user)
        list_barters = list_barters.order_by("-timestamp").all()

        return JsonResponse([barter.serialize() for barter in list_barters], safe=False)
    else:
        return JsonResponse({"ERROR":"Invalid posts"})

def single_barter(request, barter_id):
    barter = Post.objects.get(id = barter_id)
    return JsonResponse(barter.serialize())

def create_offer(request, barter_id):

    print ("CREATING A OFFER")
    if request.method == 'POST':
        print("method was post")
        form_filled = OfferForm(request.POST, request.FILES)

        if form_filled.is_valid():
            obj = form_filled.save(commit=False)
            obj.owner = request.user
            barter = Post.objects.get(id = barter_id)
            obj.barter = barter
            obj.save()
        messages.add_message(request, messages.SUCCESS, "Offer created succesfully.")
    else:
        print("method not post")
        messages.add_message(request, messages.SUCCESS, "Offer couldn't be created.")

    return HttpResponseRedirect(reverse("index"))
    # Here instead of the HttpResponse I could send a JsonResponse.

def get_barter_offers(request, barter_id):
    # This will show the owner all of the offers to a single barter.

    ##### ADD! IF STATEMENT for request user and the barter owner to be the same else return HTTP NOT AUTHORIZED
    barter = Post.objects.get(id = barter_id)
    offers = barter.barter_offers.all()
    if len(offers) <= 0:
        return JsonResponse({"message": "There are no offers"})
    else:
        return JsonResponse([offer.serialize() for offer in offers], safe=False)

def get_offers(request, offer_type):
    if offer_type == "my_offers":
        offers = request.user.user_offers.all()
        if len(offers) <= 0:
            return JsonResponse({"message":"You havent made any offers"})
        else:
            return JsonResponse([offer.serialize() for offer in offers], safe=False)
    elif offer_type == "offers_to_me":
        # For this part I will get all of the posts of a certain user and all of the offers for all of them posts.
        offers = Offer.objects.none()
        barters_list = Post.objects.filter(owner = request.user)
        for barter in barters_list:
            offers = Offer.objects.filter(barter = barter).union(offers)

        if len(offers) <= 0:
            return JsonResponse({"message":"You havent made any offers"})
        else:
            return JsonResponse([offer.serialize() for offer in offers], safe=False)

    else:
        return JsonResponse({"message":"Request not acceptable."})

def accept_offer(request, offer_id):
    # This shuld only be able to be done if the Owner of the Barter!!!!
    
    # This will:
    # - Add the offer user as the winner in barter
    # - Patch offer: making accepted == true, and rejected == false
    # - Reject all the other offers and change barter as finished barter.
    offer_to_accept =  Offer.objects.get(id= offer_id)

    offers_barter = offer_to_accept.barter


    if offers_barter.owner == request.user:
        offer_to_accept.accepted = True
        offer_to_accept.rejected = False
        offer_to_accept.save(update_fields=['accepted','rejected'])

        offers_to_reject = Offer.objects.filter(barter = offers_barter).exclude(id = offer_id)

        for offer_to_reject in offers_to_reject:
            offer_to_reject_id = offer_to_reject.id
            reject_offer(request, offer_id=offer_to_reject_id)

        offers_barter.winner = offer_to_accept.owner
        offers_barter.save(update_fields=["winner"])
        print("accept offer")
        return JsonResponse({"message":"Offer accepted"})
    else:
        return JsonResponse({"message":"User not authorized to accept the offer"})


def reject_offer(request, offer_id):
    # This will:
    # - Patch offer: making accepted == false, rejected == true
    offer = Offer.objects.get(id = offer_id)
    barter_of_offer = offer.barter

    if barter_of_offer.owner == request.user:

        offer.accepted = False
        offer.rejected = True
        offer.save(update_fields=['accepted','rejected'])
        print("reject offer")
        return JsonResponse({"message":"Offer rejected"})
    else: 
        return JsonResponse({"message":"User not authorized to reject the offer"})

def get_conversations(request):
    # This will:
    # - Display a list of conversations, they are between the barter.owner and barter.winner
    # - This doesnt matter if there are messages or not yet
    conversations = Post.objects.filter(winner=request.user)
    conversations = Post.objects.filter(owner = request.user).exclude(winner__isnull = True).union(conversations)

    if len(conversations) <= 0:
        return JsonResponse({"message":"You have no conversations yet."})
    else:
        return JsonResponse([conversation.serialize() for conversation in conversations], safe=False)

def get_conversation(request, barter_id):
#     # This will:
#     # - Display all the messages between the barter.owner and barter.winner
#     # - If there are not any messages, show a message that they can send a messages, to organize and submit the item or meet exchange items

    # Check if the barter has a winner if not no convo
    # check if the user is request user or barter.winner if not no convo
    # Get the messages with that convo in it.

    barter = Post.objects.get(id = barter_id)
    if barter.winner is None:
        return JsonResponse({"message":"Something went wrong, there is no conversation for this barter between the owner and the offerer."})
    elif barter.owner == request.user or barter.winner == request.user:
        # Do whatever is supposed to happen
        barter = Post.objects.get(id = barter_id)
        messages = Message.objects.filter(barter=barter)

        return JsonResponse([{"barter_name":barter.title},[message.serialize() for message in messages]], safe=False)
# HERE NEEEDS WORKKKKKKK!!!!!
    else:
        return JsonResponse({"message":"Unauthorized"})


def send_message(request, barter_id):
#     # This will:
#     # - Create a message with the request user as the sender and the reiver being the other person in the conversation.
    if request.method == 'POST':
            
            form_filled = MessageForm(request.POST)

            message_text = request.POST.get('the_message')
            response_data = {}

            obj = Message(text=message_text)
            barter = Post.objects.get(id = barter_id)
            obj.barter = barter
            if barter.winner == None:
                return JsonResponse({'message': "Message can't be send"})
            
            if barter.owner == request.user and barter.winner != None:
                obj.sender = request.user
                obj.receiver = barter.winner
                obj.save()

            elif barter.winner == request.user:
                obj.sender = request.user
                obj.receiver = barter.owner
                obj.save()
                
            else:
                return JsonResponse({'message': 'Unauthorized'})

                
            return JsonResponse({'message': 'Backend: Succesfully created the message'})

    else:
        return JsonResponse({'message':'Not a POST request'})
        # Here instead of the HttpResponse I could send a JsonResponse.

## TO THINK ABOUT:
# What will happen when they make an offer? 
# How thoes the owner choose the Winner?
# What is displayied to the owner? What is displayed to the offerer?
# Adress or set location? Conversation?
