document.getElementById("loggutb").addEventListener("click", publishLogout);
document.getElementById("goLogin").addEventListener("click", function(){
  window.location = "/login"
});
document.getElementById("goProfile").addEventListener("click", function() {
  window.location = "/user/"+username
})
document.getElementById("goSignup").addEventListener("click", function(){
    window.location = "/signup"
})

var username = ""

function goHome(){
    window.location = "/"
}

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

function checkImage(path){ //metode for å sjekke om ett bilde eksisterer. OUTPUTTER ALLTID ERROR? vet ikke om det er mulig å fikse
    fetch(path, {method: "head"})
      .then(res => {
        if (res.ok) {
          document.getElementById("navProfile").innerHTML = "<img src='/uploads/" + username + ".png'>"; //onload
        } else {
          document.getElementById("navProfile").innerHTML = "<img src='/uploads/default.png'>"; //onerr
        }
      })
      .catch(err => console.log(err)) //onerr
  }

function getLoggedIn(){
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/getLoggedIn",true); //man setter url til meldingen
    xhp.send();
  
    xhp.timeout = 2000;
  
    xhp.onload = () => {
      if (xhp.response.includes("LoggedIn:")){
        //hvis brukeren er logget inn
        username = xhp.response.split(":")[1];
        document.getElementById("showUserName").innerHTML = username;
        document.getElementById("ifLoggedInContent").style.display = "block";
        document.getElementById("ifNotLoggedInContent").style.display = "none";
      } else {
        document.getElementById("ifLoggedInContent").style.display = "none";
        document.getElementById("ifNotLoggedInContent").style.display = "block";
      }
      checkImage("/uploads/"+username+".png") //oppdatere profilbilde basert på brukernavn
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
}
  

  
getLoggedIn();