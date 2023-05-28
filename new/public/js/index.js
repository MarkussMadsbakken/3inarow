token = sessionStorage.getItem("token");
username = sessionStorage.getItem("username")

var source = new EventSource("/serverMessages/" + token);
source.addEventListener("message", message => {
    var message = JSON.parse(message.data); //gjør om til dictionary
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
  
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/logout",true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      window.location.href = "/login"
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
      sendingData = false;
    }
}

function displayGames(games){
  document.getElementById("showgames").innerHTML = "";
  Object.keys(games).forEach(game => {
    document.getElementById("showgames").innerHTML = document.getElementById("showgames").innerHTML + "<div class = 'gameBox'>" + "<div class = 'owner'>"+games[game].owner +"</div>"+ "<div class = 'users'>"+games[game].users +"</div>"+"<div class = 'users'>"+game +"</div>"+ '<button id = "join" type = "button" onclick="join('+"'"+game+"'"+')"> join </button>' +"</div>"
  });
}
fetchGames();

function fetchGames(){
  //returnerer test data
  //let data = {"KLDM":{"users":"1/2","owner":"test"},"ANCD":{"users":"5/8","owner":"test2"}};
  
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/getgames/" + token ,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      displayGames(JSON.parse(xhp.response))
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
      sendingData = false;
    }
}

function join(gameid){
  window.location.href = "/game/"+gameid;
}

function makegame(){
  let token = sessionStorage.getItem("token")

  var xhp = new XMLHttpRequest(); // initierer en ny request
  xhp.responseType = 'text';

  xhp.open("POST","/creategame/"+ token,true); //man setter url til meldingen
  xhp.send();

  xhp.timeout = 2000;

  xhp.onload = () => {
    if (xhp.response.includes("id:")){
      fetchGames();
    }
  }
  
  xhp.ontimeout = (e) =>{ //connection timed out, resend
    console.log("timeout, try again");
  }
}

window.setInterval(fetchGames,5000) //henter spill hvert femte sekund


function checkImage(path){ //metode for å sjekke om ett bilde eksisterer. OUTPUTTER ALLTID ERROR? vet ikke om det er mulig å fikse
  fetch(path, {method: "head"})
    .then(res => {
      if (res.ok) {
        document.getElementById("profile").innerHTML = "<img src='/uploads/" + username + ".png'>"; //onload
      } else {
        document.getElementById("profile").innerHTML = "<img src='/uploads/default.png'>"; //onerr
      }
    })
    .catch(err => console.log(err)) //onerr
}

function goProfile(){
  window.location = "/user/"+username
}

checkImage("/uploads/"+username+".png")