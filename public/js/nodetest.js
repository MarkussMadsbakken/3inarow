//template for å sende meldinger til server, og motta svar

document.getElementById("test_button").onclick = function(){sendData("test")};

var source = new EventSource("/serverMessages");
source.addEventListener("message", message => {
  var message = JSON.parse(message.data); //gjør om til dictionary
  console.log(message)
  //console.log("type: "+message.messageType)
  //console.log("message: "+message.message) 
  if (message.messageType === "text"){
    console.log(message.message.message) //message er er dataen inn, message er datataen fra serveren, og message er teksten ut
  } else if(message.messageType === "chat"){

    console.log(message.message.name +": "+ message.message.chatMessage); //rare navn men det er sånn det blir 
    displayChat(message.message)
  }
})

var sendingData = false;

function sendData(message){
  if (sendingData){return;} //for å stoppe å lage flere requests samtidig
  sendingData = true;

  console.log("sending data");
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/"+message,true); //man setter url til meldingen
  xhp.send();

  xhp.timeout = 2000;

  xhp.onload = () => {
    sendingData = false;
  }

  xhp.ontimeout = (e) =>{ //connection timed out, resend
    console.log("timout for " + message)
    
    //resend
    console.log("resending data");
    var backupxhp = new XMLHttpRequest(); // initierer en ny request

    backupxhp.open("POST","/"+message,true);
    backupxhp.send();

    backupxhp.onload = () => {
      sendingData = false; //kanskje vise melding om connection issues
    }

    backupxhp.ontimeout = (e) => { //connection terminated, refresh page
      console.log("connection timed out");
    }
  }
}

function displayChat(chatMessage){
  chat.push(chatMessage)
  console.log(chat)
  if (chat.length > 50){
    chat.shift();
  }

  document.getElementById("msgContainer").innerHTML = "";

  chat.forEach(chatMessage => { //display meldinger
    document.getElementById("msgContainer").innerHTML = document.getElementById("msgContainer").innerHTML + "<div class = 'chatElement'> <div class = 'chatName'>"+  chatMessage.name + ": "+ "</div>" + chatMessage.chatMessage + "</div>"
  }); //vet ikke hvordan men dette fungerer
}


