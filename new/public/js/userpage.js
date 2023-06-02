const user = String(new URL(window.location.href).pathname).split("/")[2]; //det tredje elementet er alltid user


upload = document.getElementsByClassName("uploadform")[0];
upload.addEventListener("submit", function(e){
    e.preventDefault();
    var file = document.getElementById("file").files[0];
    console.log(file);

    var formdata = new FormData(); //vet ikke helt hva formdata er men er tydeligvis det man må bruke
    formdata.append("name","icon")
    formdata.append("icon", file)

    fetch("/pfpUpload/"+user, { //sender request    fjern /markus debug
        method: 'POST',
        body: formdata
    })
    .then((res) => {
      console.log(res.text().then(function (text) {
        console.log(text)
        if (text.includes("uploaded")) {location.reload()} //her kan vi bruke else for å sende errror message
      }))
    })

    .catch((err) => ("error" + err))
});

function checkProfileImage(path){ //metode for å sjekke om ett bilde eksisterer. OUTPUTTER ALLTID ERROR? vet ikke om det er mulig å fikse
  fetch(path, {method: "head"})
    .then(res => {
      if (res.ok) {
        document.getElementById("pfp").innerHTML = "<img src='/uploads/" + user + ".png'>"; //onload
      } else {
        document.getElementById("pfp").innerHTML = "<img src='/uploads/default.png'>"; //onerr
      }
    })
    .catch(err => console.log(err)) //onerr
}

function getUserInfo(username){
  var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/getUserInfo/"+username,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      displayUserInfo(JSON.parse(xhp.response))
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
}

async function displayUserInfo(userInfo){
  document.getElementById("username").innerHTML = user
  document.getElementById("rating").innerHTML = userInfo["elo"]

  //displaye på en bedre måte. I form av dd/mm/åååå kanskje?
  var date = new Date(parseInt(userInfo["created"]))

  var day = date.getDate()
  var month = date.getMonth()+1
  var year = date.getFullYear()

  document.getElementById("joined").innerHTML = day+"/"+month+"/"+year

}

getUserInfo(user)
checkProfileImage("/uploads/"+user+".png")
