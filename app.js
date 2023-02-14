var http = require('http');
var url = require('url');
var fs = require('fs');
var fe = ".html"
var path = require("path");

var port = 3000
var express = require('express');
var app = express();

let users = Object.create(null);

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));

//game (midlertidig index)
app.get('/', async function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));

});

app.get("/game/gamestring", async function(req, res){
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })
  res.flushHeaders(res,req);

  let id = Math.random();
  users[id] = res;

  console.log("user listening to events" + id); //dette slettes serverside, legge inn slik at id lagres i session/lage bruker

  req.on("close",function(){
    console.log("deleting" + id)
    delete users[id];
  })
})

app.post('/:message', (req,res) => { //lager dictionary. f.eks /:userID/:move
  console.log(req.params)
  var message = req.params["message"] //henter verdien til message
  console.log(message)

  sendGameString();
  //res.send for respons
})


function sendGameString(){
  for (let id in users){
    let res = users[id];
    res.write(`data: "test"\n\n`);
  }

  // her må dataen sendes tilbake til app.get gamestring
}

//index





// motta spilloppdateringer fra brukeren, og sjekke om riktig spiller har gitt input
// inkluderer navn/ip, hvilket move

// oppdatere spill-string

// måter å implimentere sse
// https://medium.com/system-design-blog/long-polling-vs-websockets-vs-server-sent-events-c43ba96df7c1
// https://dev.to/dhiwise/how-to-implement-server-sent-events-in-nodejs-11d9
// https://stackoverflow.com/questions/36249684/simple-way-to-implement-server-sent-events-in-node-js


// bruke sse for å sende dataen til alle brukerene samtidig
// kalles fra oppdaterings-funksjonen<

/* metode for å sende melding til serveren
function sendMessage(message) {
    fetch(url, {
      method: 'POST',
      body: message
    });
  }
*/