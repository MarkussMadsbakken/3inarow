const user = String(new URL(window.location.href).pathname).split("/")[2]; //det tredje elementet er alltid user


upload = document.getElementsByClassName("uploadform")[0];
upload.addEventListener("submit", function(e){
    e.preventDefault();
    var file = document.getElementById("file").files[0];
    console.log(file);

    var formdata = new FormData(); //vet ikke helt hva formdata er men er tydeligvis det man må bruke
    formdata.append("name","icon")
    formdata.append("icon", file)

    fetch("http://localhost:3000/pfpUpload/"+sessionStorage.getItem("token") + "/"+user, { //sender request    fjern /markus debug
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

document.getElementById("pfp").innerHTML = "<img src='/uploads/" + user + ".png'>";