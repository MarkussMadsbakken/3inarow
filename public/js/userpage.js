const user = String(new URL(window.location.href).pathname).split("/")[2]; //det tredje elementet er alltid user


upload = document.getElementsByClassName("uploadform")[0];
upload.addEventListener("submit", function(e){
    e.preventDefault();
    var file = document.getElementById("file").files[0];
    console.log(file);

    var formdata = new FormData(); //vet ikke helt hva formdata er men er tydeligvis det man må bruke
    formdata.append("name","icon")
    formdata.append("icon", file)

    fetch("http://localhost:3000/pfpUpload/"+sessionStorage.getItem("token") + "/markus", { //sender request    fjern /markus debug
        method: 'POST',
        body: formdata
    })
    .then((res) => console.log(res))
    .catch((err) => ("error" + err))
});


/*
function requestImg(){
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/requestImage/" + user,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
        document.getElementById("pfp").innerHTML = "<img src='" + user + ".png'>";
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
  }

requestImg()
*/
document.getElementById("pfp").innerHTML = "<img src='/uploads/" + user + ".png'>";