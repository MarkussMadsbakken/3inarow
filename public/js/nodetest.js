document.getElementById("test_button").onclick = function(){sendData("test")};

var source = new EventSource("/game/gamestring");
source.addEventListener("message", message => {console.log("returnerte: " + event.data)})

var sendingData = false;

function sendData(message){
  if (sendingData){return;}
  sendingData = true;

  console.log("sending data");
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/"+message,true); //man setter url til meldingen
  xhp.send();

  xhp.timeout = 2000;

  xhp.onload = () => {
    sendingData = false;
  }

  xhp.ontimeout = (e) =>{ //connection timed out
    console.log("timout for " + message)
    
    //resend
    console.log("resending data");
    var backupxhp = new XMLHttpRequest(); // initierer en ny request

    backupxhp.open("POST","/"+message,true); //man setter url til meldingen
    backupxhp.send();
    
    backupxhp.onload = () => {
      sendingData = false;
    }

    backupxhp.ontimeout = (e) => {
      console.log("connection timed out");
    }
  }
}

function ssetest(){
  console.log("gamestring");
  document.getElementById("sse_test").innerHTML = "test";
}