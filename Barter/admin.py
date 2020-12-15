from django.contrib import admin

# Register your models here.
from .models import Post,Offer,Message

admin.site.register(Post),
admin.site.register(Offer),
admin.site.register(Message)