


upload = document.getElementsByClassName("uploadform")[0];
upload.addEventListener("submit", function(e){
    e.preventDefault();
    var file = document.getElementById("file").files[0];
    console.log(file);

    var formdata = new FormData(); //vet ikke helt hva formdata er men er tydeligvis det man må bruke
    formdata.append("name","icon")
    formdata.append("icon", file)

    fetch("http://localhost:3000/pfpUpload/token/user", { //sender request
        method: 'POST',
        body: formdata
    })
    .then((res) => console.log(res))
    .catch((err) => ("error" + err))
});