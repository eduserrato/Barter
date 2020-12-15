
var global_barter_id;
var timer;
document.addEventListener('DOMContentLoaded', function() {
    
   
    load_barters('all');
    layout_buttons(); // This layout button are not needed instead delete the buttons and make them only work if they are not on the same page
    $('#conversation-textinput-form').on('submit', async function(event){
        event.preventDefault();
        console.log("form submitted!");  // sanity check
        await create_message(global_barter_id);
        conversation_fetch(global_barter_id);
        clearInterval(timer);

        timer = setInterval(function(){
            conversation_fetch(global_barter_id)
        console.log("Interval set!")},5000);
    })

});

function load_barters(barter_type){
    document.querySelector('#barters-container').style.display = 'block';
    document.querySelector('#make-barter').style.display = 'none';
    document.querySelector('#offers').style.display = 'none';
    document.querySelector('#item-page').style.display = 'none';
    document.querySelector('#messages').style.display = 'none';

    
    document.querySelector('#barters').innerHTML = "";
    document.querySelector('#barters-title').innerHTML = "";

    fetch_barters(barter_type);
}

// ERROR ("they are calling himself, recursion problem")
async function fetch_barters(barter_type){
    
    let barters_space = document.querySelector('#barters');
    
    let barters_title = document.querySelector('#barters-title');
    barters_title.innerHTML = '';
    barters_space.innerHTML ='';

    title = document.createElement("h2");
    let barter_type_uppercase = barter_type.charAt(0).toUpperCase()+barter_type.substring(1);
    title.innerHTML = barter_type_uppercase + " Barters";
    hr = document.createElement('hr');
    barters_title.append(title, hr);


    await fetch('/show_barters/'+barter_type)
    .then(response => response.json())
    .then(barters =>{
        console.log(barters);
        for(let i = 0; i < barters.length; i++){
            let owner = barters[i].owner;
            let title = barters[i].title;
            let text = barters[i].text;
            let impage_url = barters[i].image;
            let timestamp = barters[i].timestamp;

            let winner = barters[i].winner;

            
            
            let image = new Image();
            image.src = impage_url; 
            image.className = "images";
            image.width = 100;
            
            let post = document.createElement('div');
            post.className = "barter-posts";
            
            let div_owner = document.createElement("div");
            let div_title = document.createElement("div");
            let div_text = document.createElement("div");
            let div_image = document.createElement("div");
            let div_timestamp = document.createElement("div");
            let hr = document.createElement("hr");
            
            div_owner.className = "single-barter-owner";
            div_title.className = "single-barter-title";
            div_text.className = "single-barter-text";
            div_image.className = "single-barter-image";
            div_timestamp.className = "timestamp";
            
            div_owner.innerHTML = "owner:  " + owner;
            div_title.innerHTML = "<h5>"+title+"</h5>";
            div_text.innerHTML = text;
            div_image.append(image);
            div_timestamp.innerHTML = timestamp;
            
            // I will take of the hr but it might be usable
            post.append(div_title, div_text, div_owner, div_image,  div_timestamp,);

            if (winner != null){
                div_winner_choosen = document.createElement("div");
                div_winner_choosen.className = "div-winner-choosen";
                div_winner_choosen.innerHTML = "Offer for barter accepted already.";
                post.append(div_winner_choosen);
            };
            
            barters_space.append(post);
            
            post.addEventListener('click', ()=> single_barter(barters[i].id));
            // Here I might have to add an element button to add the make offer
            
            
        }
    })
    return;
    
}

function single_barter(id){
    // Make fetch call to the API that sends a single app and recive the said barter and display it...
    // If owner === current_user: display the offers under. 
    // If signed_in but not owner: avility to make an offer
    // Not signed in: simply display the item.
    document.querySelector('#barters-container').style.display = 'none';
    document.querySelector('#make-barter').style.display = 'none';
    document.querySelector('#offers').style.display = 'none';
    document.querySelector('#item-page').style.display = 'block';
    document.querySelector('#messages').style.display = 'none';


    fetch_barter(id);

    fetch_barter_offers(id);
    }

async function fetch_barter(id){
    //This is what is called to make the fetch
    await fetch("single_barter/"+id)
    .then(respnse=> respnse.json())
    .then(item =>{
        
        console.log(item);
        let single_item = document.querySelector("#single-item");

        single_item.innerHTML = ""; 

        let image = new Image();
        image.src = item.image; 
        image.className = "images";
        image.id = "single-barter-image";
        // image.width = 100;

        let div_owner = document.createElement("div");
        let div_title = document.createElement("div");
        let div_text = document.createElement("div");
        let div_image = document.createElement("div");
        let div_timestamp = document.createElement("div");

        div_owner.className = "single-barter-owner";
        div_title.className = "signle-barter-title";
        div_text.className = "single-barter-text";
        // div_image.className = "signle-barter-image";
        div_timestamp.className = "timestamp";

        div_owner.innerHTML = "owner:  " + item.owner;
        div_title.innerHTML ="<h4>"+ item.title+"</h4>";
        div_text.innerHTML = item.text;
        div_image.append(image);
        div_timestamp.innerHTML = item.timestamp;

        // I will take of the hr but it might be usable
        single_item.append(div_title, div_text, div_owner, div_image, div_timestamp);
        
        if (document.getElementById('cur_user_id') != null){
            let cur_user = document.getElementById('cur_user_id').textContent;
            console.log("CUR USER = "+cur_user+",   OWNER = "+item.owner+",   OWNER_ID = "+item.owner_id)
            if (cur_user == item.owner_id){
                console.log("IAM THE OWNER LOL");
                document.querySelector("#make-offer").style.display = "none";
                document.querySelector("#barter-offers").style.display = "block";
                
            }
            else{
                console.log("I am NOT the OWNER");
                document.querySelector("#make-offer").style.display = "block";
                document.querySelector("#barter-offers").style.display = "none";
                
                document.querySelector("#make-offer-form").action = "create_offer/"+id;

            }
        }

        return;


    })
}

async function fetch_barter_offers(id){
    offers_space = document.querySelector('#barter-offers');
    offers_space.textContent = "";

    await fetch("barter_offers/"+id)
    .then(response => response.json())
    .then(offers => {
        if (offers.message){
            console.log(offers)
            
            offers_space.innerHTML = "<hr>There are no offers yet."
        }
        else{
            console.log("There is a list of offers")
            
            
            for (let x = 0; x < offers.length; x++){
                
                let image = new Image();
                image.src = offers[x].image; 
                image.className = "images";
                image.width = 100;
            
                let div_offer_number = document.createElement("div");
                let div_title = document.createElement("div");
                let div_text = document.createElement("div");
                let div_image = document.createElement("div");
                let div_timestamp = document.createElement("div");
                let hr = document.createElement("hr");

                // div_title.className = "barter-title";
                // div_text.className = "barter-text";
                // div_image.className = "barter-image";
                // div_timestamp.className = "timestamp";

                div_title.innerHTML = "<h6>"+offers[x].title+"</h6>";
                div_text.innerHTML = offers[x].text;
                div_image.append(image);
                div_timestamp.innerHTML = offers[x].timestamp;


                if (offers[x].accepted == null || offers[x].rejected == null){

                    let accept_button = document.createElement("button");
                    let reject_button = document.createElement("button");
            
                    accept_button.className = "accept-buttons-single-barter-offers";
                    reject_button.className = "reject-buttons-single-barter-offers";
                    accept_button.innerHTML = "Accept Offer";
                    reject_button.innerHTML = "Reject Offer";
                    accept_button.addEventListener("click", async()=>{
                        await accept_offer(offers[x].id);
                        await fetch_barter_offers(id);
                    });
                    reject_button.addEventListener("click", async()=>{
                        await reject_offer(offers[x].id);
                        await fetch_barter_offers(id);

                    });
                    offers_space.append(hr, div_offer_number, div_title, div_text, div_image, div_timestamp, reject_button, accept_button,);

                }
            
                else if(offers[x].accepted == true){

                    div_rejected_accepted = document.createElement('div');
                    div_rejected_accepted.innerHTML = "This offer was Accepted!!!";
                    div_rejected_accepted.style.backgroundColor  = '#98FB98';
                    div_rejected_accepted.style.borderRadius  = '5px';


                    offers_space.append(hr, div_offer_number, div_title, div_text, div_image, div_timestamp, div_rejected_accepted);
                }
                else if(offers[x].rejected == true){

                    div_rejected_accepted = document.createElement('div');
                    div_rejected_accepted.innerHTML = "This offer was rejected";
                    div_rejected_accepted.style.backgroundColor  = '#FA8072';
                    div_rejected_accepted.style.borderRadius  = '5px';
                    div_rejected_accepted.style.width = "auto";

                    offers_space.append(hr, div_offer_number, div_title, div_text, div_image, div_timestamp, div_rejected_accepted);
                }    
                else{
                    div_offer_number.innerHTML = "Offer #"+ (x+1);
                    offers_space.append(hr, div_offer_number, div_title, div_text, div_image, div_timestamp)
                }
                // Still need button to choose winner if it hassnt been selected
                // 
            }
        }
        
    })
}

function make_barter(){
    document.querySelector('#barters-container').style.display = 'none';
    document.querySelector('#make-barter').style.display = 'block';
    document.querySelector('#offers').style.display = 'none';
    document.querySelector('#item-page').style.display = 'none';
    document.querySelector('#messages').style.display = 'none';



}
function offers(offer_type){
    document.querySelector('#barters-container').style.display = 'none';
    document.querySelector('#make-barter').style.display = 'none';
    document.querySelector('#offers').style.display = 'block';
    document.querySelector('#item-page').style.display = 'none';
    document.querySelector('#messages').style.display = 'none';

    let offers_space = document.querySelector("#offers")
    offers_space.innerHTML = "";

 
    // How will I display the offers under a post they belong to?
    // On my posts?
    // One post and all the offers for that post
    // All the offers with the post title
    //hmmmmm...
    fetch_offers(offer_type);
}
function fetch_offers(offer_type){

    offers_space = document.querySelector("#offers")
    offers_space.innerHTML = "";
    if (offer_type === "offers_to_me"){
        title = document.createElement("h2");
        title.innerHTML = "Offers to Me"
        offers_space.append(title)
    }
    else if (offer_type === "my_offers"){
        title = document.createElement("h2");
        title.innerHTML = "My Offers"
        offers_space.append(title)
    }

    fetch("get_offers/"+offer_type)
    .then(response => response.json())
    .then(the_offers =>{
        if (offers.message){
            document.querySelector("#offers").innerHTML = the_offers.message;
        }
        else{
            
            for (let x = 0; x < the_offers.length; x++){
                
                let image = new Image();
                image.src = the_offers[x].image; 
                image.className = "offer-images";
                image.width = 100;
            
                let div_offer_for = document.createElement("div");
                let div_title = document.createElement("div");
                let div_text = document.createElement("div");
                let div_image = document.createElement("div");
                let div_timestamp = document.createElement("div");
                let hr = document.createElement("hr");
                let br = document.createElement("br");


                div_title.className = "offer-title";
                div_text.className = "offer-text";
                div_timestamp.className = "timestamp";

                div_title.innerHTML = "<h6>"+the_offers[x].title+"</h6>";
                div_text.innerHTML = the_offers[x].text;
                div_image.append(image);
                div_timestamp.innerHTML = the_offers[x].timestamp;

        
                if(offer_type === "my_offers"){
                    div_offer_for.innerHTML = "My offer for barter with title:  <strong>"+ the_offers[x].barter_name+"</strong>";
                   
                    div_rejected_accepted= document.createElement("div");
                    if(the_offers[x].accepted == true){
                        div_rejected_accepted.innerHTML = "Your offer was Accepted!!!"
                        div_rejected_accepted.style.backgroundColor  = '#98FB98';
                        div_rejected_accepted.style.borderRadius  = '5px';


                    }
                    else if(the_offers[x].rejected == true){
                        div_rejected_accepted.innerHTML = "We are sorry, your offer was rejected, you can make more offers if you'd like."
                        div_rejected_accepted.style.backgroundColor  = '#FA8072';
                        div_rejected_accepted.style.borderRadius  = '5px';
                        div_rejected_accepted.style.width = "auto";
                        

                    }
                    else{
                        div_rejected_accepted.innerHTML = "Your offer has not yet been reviewed by the offerer come back later to see if it was accepted or rejected."
                        div_rejected_accepted.style.backgroundColor  = '#fff88b';
                        div_rejected_accepted.style.borderRadius  = '5px';
                    }

                    
                    offers_space.append(hr, div_offer_for, div_title, div_text, div_image, div_timestamp, div_rejected_accepted);

                }
                else if(offer_type === "offers_to_me"){

                    if (the_offers[x].accepted == null || the_offers[x].rejected == null){


                    
                        div_offer_for.innerHTML = "Offer for my barter:  <strong>"+ the_offers[x].barter_name+"</strong>";
                        let accept_button = document.createElement("button");
                        let reject_button = document.createElement("button");
        
                        accept_button.className = "accept-buttons";
                        reject_button.className = "reject-buttons";
                        accept_button.innerHTML = "Accept Offer";
                        reject_button.innerHTML = "Reject Offer";
                        accept_button.addEventListener("click", async()=>{
                            await accept_offer(the_offers[x].id);
                            offers(offer_type);
                        });
                        reject_button.addEventListener("click", async()=>{
                            await reject_offer(the_offers[x].id);
                            offers(offer_type);
                        });

                        offers_space.append(hr, div_offer_for, div_title, div_text, div_image, div_timestamp, reject_button, accept_button);
                    }
                    else if(the_offers[x].accepted == true){
                        div_offer_for.innerHTML = "Offer for my barter:  <strong>"+ the_offers[x].barter_name+"</strong>";

                        div_rejected_accepted = document.createElement('div');
                        div_rejected_accepted.innerHTML = "This offer was Accepted!!!";
                        div_rejected_accepted.style.backgroundColor  = '#98FB98';
                        div_rejected_accepted.style.borderRadius  = '5px';


                        offers_space.append(hr, div_offer_for, div_title, div_text, div_image, div_timestamp, div_rejected_accepted);
                    }
                    else if(the_offers[x].rejected == true){
                        div_offer_for.innerHTML = "Offer for my barter:  <strong>"+ the_offers[x].barter_name+"</strong>";

                        div_rejected_accepted = document.createElement('div');
                        div_rejected_accepted.innerHTML = "This offer was rejected";
                        div_rejected_accepted.style.backgroundColor  = '#FA8072';
                        div_rejected_accepted.style.borderRadius  = '5px';
                        div_rejected_accepted.style.width = "auto";

                        offers_space.append(hr, div_offer_for, div_title, div_text, div_image, div_timestamp, div_rejected_accepted);
                    }               
                }

                // Still need button to choose winner if it hassnt been selected
                // 
            }

        }
    })
}

async function accept_offer(offer_id){
    await fetch("accept_offer/"+offer_id)
    .then(response=>response.json())
    .then(response =>{
        console.log("accepted offer")
    })
    
}

async function reject_offer(offer_id){
    await fetch("reject_offer/"+offer_id)
    .then(response=>response.json())
    .then(response =>{
        console.log("rejected offer")
    })
}

async function conversations(){

    document.querySelector('#barters-container').style.display = 'none';
    document.querySelector('#make-barter').style.display = 'none';
    document.querySelector('#offers').style.display = 'none';
    document.querySelector('#item-page').style.display = 'none';
    document.querySelector('#messages').style.display = 'block';
    document.querySelector('#conversation').style.display = 'none';

    
    conversations_space = document.querySelector("#conversations");

    conversations_space.style.display = 'block';
    let hr = document.createElement("hr");

    conversations_space.innerHTML = "";

    title = document.createElement("h2");
    title.innerHTML = "Conversations";

    conversations_space.append(title,hr);
    
    fetch_conversations();
    
}

async function fetch_conversations(){
    await fetch("conversations")
    .then(response => response.json())
    .then(conversations_list=>{

        if (conversations_list.message){
            conversations_space.innerHTML = conversations_list.message;
        }
        else{
            for(let i=0; i < conversations_list.length; i++ ){
                
                //  This might need to be incide a post or conv section
                let chat = document.createElement("div");
                conv_title = document.createElement("div");
                conv_title.innerHTML = conversations_list[i].title;
                let hr1 = document.createElement("hr");


                chat.append(conv_title,hr1);
                chat.addEventListener('click', ()=> {
                    conversation(conversations_list[i].id)
                    global_barter_id = conversations_list[i].id;
                })
                conversations_space.append(chat);
                
            }
        }
    })
}

function conversation(barter_id){
    document.querySelector('#barters-container').style.display = 'none';
    document.querySelector('#make-barter').style.display = 'none';
    document.querySelector('#offers').style.display = 'none';
    document.querySelector('#item-page').style.display = 'none';
    document.querySelector('#messages').style.display = 'block';
    document.querySelector('#conversations').style.display = 'none';

    conversation_space = document.querySelector('#conversation');
    conversation_space.style.display = 'block';

    conversation_fetch(barter_id);
    
    timer = setInterval(function(){
        conversation_fetch(barter_id)
    console.log("Interval set!")},5000);
    
}

async function conversation_fetch(barter_id){
    await fetch("conversation/"+barter_id)
    .then(response => response.json())
    .then(response=>{
        let messages = response[1];
        let barter_name = response[0];
        barter_name = barter_name.barter_name;
        let title = document.createElement("h2");
        title.innerHTML = barter_name;
        console.log(messages)

        let cur_user = document.getElementById('cur_user_id').textContent;
        

        conversation_messages = document.querySelector('#conversation-messages')
        conversation_messages.innerHTML = "";
        conversation_messages.append(title);
        // If there is a message then write it to tell that it is not done
        for(let i = 0; i < messages.length; i++){
            // If sent by me the class my_messages, else his_messages
            let message = document.createElement("div");
            let sender = document.createElement("div");
            let text = document.createElement("div");
            let hr = document.createElement("hr");
            

            if(cur_user == messages[i].sender_id){
                message.className = "myMessages";
                sender.className = "message_sender";
                text.className = "message_text";
                

                text.innerHTML = messages[i].text;
                sender.innerHTML = messages[i].sender_username;
               
                message.append(sender, text);
                conversation_messages.append(message, hr)

            }
            else if(cur_user == messages[i].receiver_id){
                message.className = "notMyMessages";
                sender.className = "message_sender";
                text.className = "message_text";
                
                text.innerHTML = messages[i].text;
                sender.innerHTML = messages[i].sender_username;

                message.append(sender, text);
                conversation_messages.append(message, hr)


            }
            else{
                
            }

            
        }
        // Display each message the user's on one side and the others on the other side
    })
}


async function create_message(barter_id) {
    console.log("create post is working!") // sanity check

    await $.ajax({
        url : "send_message/"+barter_id, 
        type : "POST", // http method
        data : { the_message : $('#message-form-text').val() }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#message-form-text').val(''); // remove the value from the input
            // console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check   
            // conversation_fetch(barter_id)         
        },

        // handle a non-successful response
        error : function() {
            console.log("An error happened"); // provide a bit more info about the error to the console
        }
        
    });
};





// This function makes all of the buttons in the layout page work and display what they are supposed to display
// To fix this make it send a word layout(all) y ese hace que ese boton no funcione
function layout_buttons(){
    document.querySelector('#allBarters').addEventListener('click', ()=>{
        clearInterval(timer);
        load_barters('all');
    });
    document.querySelector('#createBarter').addEventListener('click', ()=>{
        clearInterval(timer);
        make_barter()
    });
    document.querySelector('#myBarters').addEventListener('click',()=>{
        clearInterval(timer);
        load_barters('my')
    });
    document.querySelector('#offersToMe').addEventListener('click',()=>{
        clearInterval(timer);
        offers('offers_to_me')
    });
    document.querySelector('#myOffers').addEventListener('click',()=>{
        clearInterval(timer);
        offers('my_offers')
    });
    document.querySelector('#allConversations').addEventListener('click', ()=>{
        clearInterval(timer);
        conversations()
    });
}
// Search for make barter submit and on click it calls views create post


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// This helps use the ajax
