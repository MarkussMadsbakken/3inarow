var http = require('http');
var url = require('url');
var fs = require('fs');
var fe = ".html"
var path = require("path");

var port = 3000
var express = require('express');
var app = express();

let users = Object.create(null);

// ------------------ game ----------------
let board = []
let dim = [5,5]
for (let i = 0; i < dim[0]; i++) {
  board.push([])
}
let players = 2
let winn_l = 4
let turn = 0
function place(collum) {
  if (collum >= 0 && collum < dim[0]) {
      if (board[collum].length < dim[1]) {
          board[collum].push(turn)
          turn ++
          if (turn >= players) {
              turn = 0
          }
      }
  }

}
// ------------------ /game ----------------

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));

//game (midlertidig index)
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//når brukeren starter serveren, lages det en eventlistener
app.get("/serverMessages", async function(req, res){
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })
  res.flushHeaders(res,req);

  let id = Math.random();

  let responseIdText = '{"responseId":"'+id+'"}'
  res.write(`data:{"message":${responseIdText},"messageType":"id"}\n\n`)
  
  users[id] = res;

  console.log("user listening to events" + id); //dette slettes serverside, legge inn slik at id lagres i session/lage bruker
  

  req.on("close",function(){
    console.log("deleting" + id)
    delete users[id];
  })
})

app.post('/:message', (req,res) => { //lager dictionary. f.eks /:userID/:move
  var message = req.params["message"] //henter verdien til message
  console.log(message)

  publishServerMessage('{"message":"'+ message+'"}', "text");
  //sender respons 
  res.send("recieved");
})

//chat
app.post("/chat/:name/:message", (req,res) => {
  var name = req.params["name"]
  var message = req.params["message"] //henter verdier

  //sender respons 
  res.send("recieved");

  publishServerMessage('{"name":"'+ name +'","chatMessage":"' + message+'"}',"chat");
})

//update from user
app.post("/boardupdate/:user/:collum", (req, res) => {
  var user = req.params["user"]
  var collum = req.params["collum"]
  //if (user = all_users[cur_user]) {place(collum); publishBoard(board)}
  console.log(collum + " fra:" + user)
  //else {koregere brett tilbake til bruker}

  //sender respons 
  res.send("recieved");
})

function publishServerMessage(message, messageType){
  for (let id in users){
    let res = users[id];
    console.log(message)
    res.write(`data:{"message":${message},"messageType":"${messageType}"}\n\n`);
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