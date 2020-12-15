from django import forms
from .models import *

class BarterForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title','text', 'image']
        exclude = ['owner']
        

    def __init__(self, *args, **kwargs):    
        super(BarterForm, self).__init__(*args, **kwargs)
        self.fields['title'].widget.attrs={
            'id': 'barter-form-title',
            # 'class': 'myCustomClass',
            'placeholder': 'Title'}
        self.fields['text'].widget.attrs={
            'id': 'barter-form-text',
            # 'class': 'myCustomClass',
            'placeholder': 'Describe your product, what is its condition, how old is it, etc...'}
        
class OfferForm(forms.ModelForm):
    class Meta:
        model = Offer
        fields = ['title', 'text', 'image']
        exclude = ['owner', 'barter']
        # form.fields['barter_id'].widget = forms.HiddenInput

    def __init__(self, *args, **kwargs):    
        super(OfferForm, self).__init__(*args, **kwargs)
        self.fields['title'].widget.attrs={
            'id': 'offer-form-title',
            'class': 'offer-form-title',
            'placeholder': 'Offer Title'}
        self.fields['text'].widget.attrs={
            'id': 'offer-form-text',
            'class': 'offer-form-text',
            'placeholder': 'Describe the product that you are offering, what is its condition, how old is it, etc...'}

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['text']
        exclude = ['barter','sender','receiver']
        widgets = {
                'text': forms.TextInput(attrs={
                    'id': 'message-form-text', 
                    'required': True, 
                    'placeholder': 'Say something...'
                }),
                }
    def serialize(self):
        return{
            "text": self.text
        }
