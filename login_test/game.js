token = localStorage.getItem("token");

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
