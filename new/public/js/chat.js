//display chat
function displayChat(chatMessage){
    chat.push(chatMessage)
    if (chat.length > 50){
      chat.shift();
    }
  
    document.getElementById("msgContainer").innerHTML = "";
    var prevChatter = "";
  
    chat.forEach(chatMessage => { //display meldinger
      if (prevChatter === chatMessage.name){ //hvis meldingen sendes av samme person, sendes ikke navn og meldingene legges rett under hverandre (liten space ekstra space i css)
        document.getElementById("msgContainer").innerHTML = document.getElementById("msgContainer").innerHTML + "<div class = 'chatElement'>" + chatMessage.chatMessage + "</div>"
      }
      else{ //ny melding fra en annen person
        document.getElementById("msgContainer").innerHTML = document.getElementById("msgContainer").innerHTML + "<div class = 'chatElement'> <div class = 'chatName'>"+  chatMessage.name + ":"+ "</div> " + chatMessage.chatMessage + "</div>"
      }
      
      prevChatter = chatMessage.name //lagrer navn
    }); //vet ikke hvordan men dette fungerer
  }


var chatinput = document.getElementById("typebox");

var chat = [];

chatinput.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        inputvalue = document.getElementById("typebox").value;
        document.getElementById("typebox").value = "";
        sendChat(inputvalue);
    }
})

function sendChat(message){
  	var xhp = new XMLHttpRequest(); // initierer en ny request

  	xhp.open("POST","/chat/"+ token + "/" + message + "/" + gameId, true); //man setter url til meldingen
  	xhp.send();

  xhp.timeout = 2000;

  xhp.onload = () => {
  }

  xhp.ontimeout = (e) =>{ //connection timed out, resend
    console.log("connection timed out");
  }
}
