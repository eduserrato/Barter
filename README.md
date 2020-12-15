<!-- 
This file has to be edited and explain why this project, descrive it and whats contained in each file created and any other information the staff should know about the project. 
Explain why this project satisfies the distinctivness and complexity requirements, mentioned on the requirements of the project.
 -->

 <h1>Barter</h1>
 <h2>This application/webpage is my final project compleated for my Harvard Web Programming Certificate</h2>
 <h3>This project is a barter plataform for things we don't use no more, we all have been there we have an old TV that we dont use any more, and we dont wish to throw it away, after all it is still usable, we know someone else could be happy with it. This plataform helps solve that problem by letting you barter your product for something that you could actually use or want. This is done by accepting offes for your product, this works like this: you post your product and people make offers for it, then you reject the offers you dont like, when you find one you like you just accept it, the rest of the offers will be rejected automatically and no more offers will be possible, after this is done a chat will be created where you can discuss and get to an agreement to either ship the product or meet up and exchange the products, it is up to the users from here.</h3>

<h2>Mobile Responivness, Project distinctiveness, and Complexity Requirements</h2>

**Mobile Responsivnes**
- The images adapt to the size of the screen and after a certain size they just stay the same size, this because after a certain size I felt that they were extrmetly big and made everything look weird.
- The posts are in rows, depending on the size of the screen it is decided many posts will be displayed in each row.
- The size of the text in the conversations change depending on the screen size, it can be small, medium, or large.

**Distinctivness & Complexity Requirements**

This project came from the problem of having a TV and and Xbox in the house which I want to get rid of, but which I dont wish to thow away since they are usable.

My project is different from the things performed during the course, it has some similarities with some but it is a combination of them all, as well as with some other things learned by my self and added, some examples could be the chat and the use of Image files. 
For the Complexity Requirement I can explain some things I had to learn by my self like ajax, and Intervals, for the post requests I used django forms, javascript was used to put everything together and display it (frontend) and for the backend pyhton Django was used, the models I created other than User where three they are Post, Offer, and Message. All of the information sent by the backend to the get requests is sent in Json format which is represented through the use of javascript in order to be shown on the screen. I used Intevals trying to make the chat work simultaniously for both users, without having to go out of the chat and back inside, or to put a button to refresh in order to be able to see the new messages sent by another user. Some actions are performed in an async format, so everything can happen and be displayed properly. Some functions are user responsive, they act different if you are the owner, are signed in or are not signed in. Some other functions only work if you are signed in or will send you a json response that tells you something went wrong if you try to do something in a format it is not intended to.

<h2>The Files:</h2>
    
**models.py:**

    In this file you create all the models, or objects that will be used through out in the plataform.

    Users

    Posts

    Offers

    Messages

**views.py:**
    
    This file contains all the functions used in order for everything to work properly, these functions are:

    index(): this function says what will happen when the webpage first apears.

    login_view(): login page, and if user and password are correct the user logs in 

    logout_view(): logs out the user.

    register(): page to register a new user.

    create_barter(): using a filled out form, creates a barter of the Post model.

    list_of_barters(barters): funciton that depending on the "barters" string which can be 'all' or 'my' returns in Json format the list of barters requested.

    single_barter(barter_id): returns a single barter information in Json format.

    create_offer(barter_id): creates an offer using a POST request, and form which is connected to a barter.

    get_barter_offers(barter_id): displays all of the offers made toa barter

    get_offers(offer_type): returns in Json format a list of either 'my_offers' or 'offers_to_me', one is all of the offers that I have made adn the other all the offers that have been made to me.

    accept_offer(offer_id): accepts the offer with the given id and rejects all of the other offers to the same barter, this is done using the reject_offer function in a for loop.

    rejet_offer(offer_id): rejects a signle offer using the id of the said offer.

    get_conversatons(): returns in Json format a list of barters where you are either the owner of a barter where a winner(offer) was selected or said winner o of a barter.

    get_conversation(): returns in Json format a list of all the messages connected to a barter, which can only be done between 2 users.

    send_message(barter_id): sends a message if you are either the owner of the barter of the winner of the barter, if you are not it returns a Json message of Unauthorized.

**index.js:**

    This file contains all of the functinons that choose what will be displayed and what not, it also fills up the spaces that will have things displayed by fetching and appending the information to the space.

    load_barters(): hide the parts that are not supposed to be displayed and displays what is required to be displayed, then calls funciton ftech barters(barter_type).

    fetch_barters(barter_type): Sets the title that will be displayed and then fetches from show_barters/(barter_type) url which return in Json format the objects, these objects are then displayed in form of posts on the page.

    single_barter(id): is called when a barter is clicked on,it hide the parts that are not supposed to be displayed and displays what is required to be displayed, then calls funciton ftech barter(id).


    fetch_barter(id): it diaplays the information of a single item in detail and calls the function fetch_barter_offers(id)

    fetch_barter_offers(id): when called this page display three diferent things depending who you are, if you are not signed in it just displays the information about the barter, if you are signed in but not the owner it displays the a offer form which can be filled out and submited to create an offer for that item, and if you are the owner of that item it will show all of the offers for said item and two buttons accept and reject, they can be clicked to choose which ever the user wants, if they have been accepted or rejected before then they will have a message in green or red that says this offer was rejected already or this offer was accepted already.

    make_barter(): this page simply displays the make_barter_form, which is on the index.html page.

    offers(offer_type): diaplays what is supposed to be shown and hiddes the other things. Then calls the fetch_offers(offer_type)

    fetch_offers(offer_type): writes the title that will be displayed and makes a fetch request to get_offers/(offers_type) which will return in a json response a list of offers that will dipslay buttons if they are offers to the user, or just display a list of offers if the user is not the owner, they also diplay messages depending if the offer was rejected accepted or is still wating to be accepted/rejected.

    accept_offer(offer_id): makes a call to a url to accept the offer.

    reject_offer(offer_id): makes a call to a url to reject the offer.

    convesations(): hiddes the things that are not supposed to be diplayed and shows what is supposed to be displayed, adds the title to the page and then makes a fetch_conversations() function call.

    fetch_conversations(): this function makes a call to a url which returns the list of conversations that the user has in json forms then they are displayed as clickable list, when one of those conversations is clicked on the function conversation(barter_id) is called.

    conversation(barter_id):
    displays only the messages div and hiddes all of the other parts, then calls a funciton called covnersation_fetch(barter_id) to diaplay the messages, after it creates an interval that calls coversation_fetch(barter_id) every 5 seconds, this in order to be able to have a continuous conversation without having to re-enter the conversation to see the new mesages, it is like a refresh.

    conversation_fetch(barter_id): fetches all of the messages of a chat, and recives them as a json list, then displays them in div's called message

    create_message(barter_id): it uses **ajax** to make the POST request without needing to go to another page after, no page redirection, it just makes the post.

    layout_buttons(): this funciton adds event listeners to all of the buttons in the layout page, it makes them be clickable and do what they are supposed to, it allso clear the interval so it doesnt keep counting when you are not in the conversation.

    csrfSafeMethod(method): Chooses which methods require csrf token. It is needed in order to be able to use ajax.

    ajaxSetup: makes it posible to use ajax, without it you would need to go to a page redirection after a post it makes it posible to do post request without changing page.

**forms.py:**
    
    This file contains all of the forms that were used on the project.
    
    BarterForm
 
    OfferForm
    
    MessageForm

**urls.py:**
    
    This file contains all of the urls that can be accesed on the web page they are the from of making the requests to either post, patch, or get.


**admin.py:**
    
    File that controls what can be displayed to the administrator, in this case the Posts, Offers, and Messages are displayed to him,

**index.html:**
    
    File that contains all of the things that will be displayed, it is divided in div sections that are filled out by the get requests used in the javscript file.

**layout.html:**
    
    File that contains the look of the header that all of the pages will display

**login.html:**
    
    File displayed when on the login page.

**register.html:**
    
    File displayed when on the register page.

**styles.css:**

    This file helps make the things look how I want to, display the user messages on the right and the other users on the left, choose the background color of buttons, round the corners of buttons, between more look options and changes I made.


