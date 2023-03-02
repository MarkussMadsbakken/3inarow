token = localStorage.getItem("token");

var sendingData = false;

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

document.getElementById("loggutb").addEventListener("click", publishLogout);

function publishLogout(){
    let token = localStorage.getItem("token")

    console.log("logout")
    if (sendingData){return;}
    sendingData = true;
  
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/logout/"+ token,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      sendingData = false;
      console.log(xhp.response);
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
  }


