var http = require('http');
var url = require('url');
var fs = require('fs');
var fe = ".html"
var path = require("path");
var util = require('util')

var port = 3000
var express = require('express');
var app = express();

const crypto = require('crypto');
const { text } = require('express');

let users = Object.create(null);

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname));

//game (midlertidig index)
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var databasePath = __dirname+"/very_secure_database.txt";

const readFile = util.promisify(fs.readFile) //gjør at man kan gjøre noe med dataen etter den er hentet

function readDatabase(){
  // lese database
  return readFile(databasePath, 'utf8')
}

var appendData = '"admin2": {"password": "admin", "elo": "500"}'

function appenddatabase(appendData){
  readDatabase().then(data =>{
    //finner hvor dataen skal skrives
    let endpos = data.search("--end");
    let prevdata = data.slice(0,endpos-4);
    let afterData = data.slice(endpos-3,endpos)
    let lastData = data.slice(endpos)
    
    data = prevdata + '\n'+"    ,"+appendData +"\n" +afterData + lastData; //metode for å sette inn data
    
    fs.writeFile(databasePath, data, err => { //skriver dataen
      if (err) { //hvis man ikke klarer å skrive til databasen
        console.error(err);
      } else {
        console.log("data written \n")
      }
    })
  })
}

function fetchData(){
  readDatabase().then(data =>{
    //finner hvor dataen skal leses
    let beginpos = data.search("--begin");
    let endpos = data.search("--end");
    data = data.slice("--begin".length + beginpos,endpos);
    data = JSON.parse(data);
  })
}


// når man logger inn henter man fra databasen