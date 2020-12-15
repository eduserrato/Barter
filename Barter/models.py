from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

class Post(models.Model):
    owner = models.ForeignKey("User", on_delete= models.CASCADE, related_name="user_posts", blank=False )
    image = models.ImageField(blank = False, upload_to = "images/")
    title = models.TextField(blank=False)
    text = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    winner = models.ForeignKey("User", on_delete= models.DO_NOTHING, related_name="user_won_posts", blank = True, null=True)
    # active = models.BooleanField(default=True)

    def serialize(self):
        if self.winner == None: 
            the_winner = self.winner 
        else: 
            the_winner = self.winner.id
        return {
            "id": self.id,
            "owner": self.owner.username,
            "owner_id":self.owner.id,
            "title":self.title,
            "text": self.text,
            "image": self.image.url,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            "winner":  the_winner
            
        }
    def __str__(self):
        return f"Post: {self.title} by user:{self.owner} at {self.timestamp}"

class Offer(models.Model):
    
    owner = models.ForeignKey("User", on_delete= models.CASCADE, related_name="user_offers", blank=False )
    image = models.ImageField(blank = False, upload_to = "images/")
    title = models.TextField(blank=False)
    text = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    barter =  models.ForeignKey("Post", on_delete=models.CASCADE, related_name="barter_offers", blank=False)
    rejected = models.BooleanField(null = True)
    accepted = models.BooleanField(null = True)

    def serialize(self):
        return {
            "id": self.id,
            "owner": self.owner.username,
            "owner_id":self.owner.id,
            "title":self.title,
            "text": self.text,
            "image": self.image.url,
            "barter": self.barter.id,
            "barter_name": self.barter.title,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            "rejected": self.rejected,
            "accepted": self.accepted
            
        }
    def __str__(self):
        return f"Offer: {self.title} by user:{self.owner} at {self.timestamp}  id: {self.id} "

class Message(models.Model):

    sender = models.ForeignKey("User", on_delete= models.CASCADE, blank=True, related_name= "user_sent_messages")
    receiver = models.ForeignKey("User", on_delete= models.CASCADE, blank=True, related_name="user_recived_message")
    barter = models.ForeignKey("Post", on_delete= models.CASCADE, blank=True, related_name="barter_messages")
    timestamp = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    text = models.TextField(blank=True)

    def serialize(self):
        return{
            "id": self.id,
            "sender_username": self.sender.username,
            "sender_id": self.sender.id,
            "receiver_username": self.receiver.username,
            "receiver_id": self.receiver.id,
            "barter_title": self.barter.title,
            "barter_id": self.barter.id,
            "text": self.text,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p")
        }
    def __str__(self):
        return f"Barter {self.barter.title}, from: {self.sender.username}, to: {self.receiver.username}"