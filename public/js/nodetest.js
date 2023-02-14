document.getElementById("test_button").onclick = function(){sendData("test")};

var source = new EventSource("/game/gamestring");
source.addEventListener("message", message => {console.log("returnerte: " + event.data)})

function sendData(message){
  console.log("sending data");
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/"+message,true); //man setter url til meldingen
  xhp.send();
}

function ssetest(){
  console.log("gamestring");
  document.getElementById("sse_test").innerHTML = "test";
}