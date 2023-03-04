token = sessionStorage.getItem("token");
const gameId = String(new URL(window.location.href).pathname).split("/")[2]; //det tredje elementet er alltid gamestring

var source = new EventSource("/serverMessages/" + token);
source.addEventListener("message", message => {
    console.log(message);
    var message = JSON.parse(message.data); //gjør om til dictionary
    console.log(message)
    //console.log("type: "+message.messageType)
    //console.log("message: "+message.message) 
    if (message.messageType === "err"){
        if (message.message === "no_token"){
            console.log("no_access")
            window.location.replace("/login");
        }
    }
})

auth()

function auth(){
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/gameAuth/" +gameId +  "/"+ token,true); //man setter url til meldingen
    xhp.send();
  
    xhp.timeout = 2000;
  
    xhp.onload = () => {
      sendingData = false;
      if (xhp.response.includes("no_token")){
        console.log("no_access")
        window.location.replace("/login");
      }
    }
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
      sendingData = false;
    }
  }