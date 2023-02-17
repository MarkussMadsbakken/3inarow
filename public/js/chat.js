var chatinput = document.getElementById("typebox");

var chat = [];

chatinput.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        inputvalue = document.getElementById("typebox").value;
        userName = document.getElementById("namebox").value;
        document.getElementById("typebox").value = "";
        sendChat(inputvalue,userName);
    }
})

var sendingData = false;

function sendChat(message, name){
  if (sendingData){return;}
  sendingData = true;

  console.log("sending data");
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/chat/"+ name + "/" + message,true); //man setter url til meldingen
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

    xhp.open("POST","/chat/"+ name + "/" + message,true);
    backupxhp.send();

    backupxhp.onload = () => {
      sendingData = false; //kanskje vise melding om connection issues
    }

    backupxhp.ontimeout = (e) => { //connection terminated
      console.log("connection timed out");
    }
  }
}

