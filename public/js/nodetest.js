//template for å sende meldinger til server, og motta svar

document.getElementById("test_button").onclick = function(){sendData("test")};

var source = new EventSource("/serverMessages");
source.addEventListener("message", message => {
  var message = JSON.parse(message.data); //gjør om til dictionary
  console.log(message)
  //console.log("type: "+message.messageType)
  //console.log("message: "+message.message) 
  if (message.messageType === "txt"){
    console.log(message.message)
  } else if(message.messageType === "chat"){
    console.log(message.message.name +": "+ message.message.chatMessage) //rare navn men det er sånn det blir 
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

    backupxhp.ontimeout = (e) => { //connection terminated
      console.log("connection timed out");
    }
  }
}
