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
const { text, response } = require('express');

let users = Object.create(null);

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname));

//innlogget
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/getImportantFile/:token', function(req,res){
  res.send(2);
})

//loginpage
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
  });

//login
app.post("/login/:username/:password", (req,res) => {
    let username = req.params["username"]
    let password = req.params["password"] //henter verdier
    //sender respons 
    checkPassword(username,password,res);
  })

//signup
app.get('/signup', function(req,res){
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.post('/signup/:username/:password', (req,res) =>{
    //henter verdier
    let username = req.params["username"];
    let password = req.params["password"];

    addUser(username, password, res);
})

var databasePath = __dirname+"/very_secure_database.txt"; //hvor databasen ligger

const readFile = util.promisify(fs.readFile) //gjør at man kan gjøre noe med dataen etter den er hentet

function readDatabase(){
  // lese database
  return readFile(databasePath, 'utf8')
}

function appendDatabase(appendData){
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
        return err;
      } else {
        console.log("data written \n")
        return "user added successfully"
      }
    })
  })
}

function fetchData(){ //henter ut data i et leselig format
  return readDatabase().then(data =>{
    //finner hvor dataen skal leses
    let beginpos = data.search("--begin");
    let endpos = data.search("--end");
    data = data.slice("--begin".length + beginpos,endpos);
    data = JSON.parse(data);

    return data //returnerer data
  })
}

function countJSONLength(data){ //teller antall ULIKE keys i et JSON objekt
  var count = 0
  for (let key in data){
    if(data.hasOwnProperty(key))
      count++;
  }
  return count;
}

async function checkPassword(username, userpassword,res){ //sjekker passord med verdi lagret i databasen

    //unngå at programmet kræsjer hvis verdiene ikke kan brukes
    if (typeof username == 'undefined'|| typeof userpassword == 'undefined'){
        res.send("input is undefined");
        return;
    }

    let db = await fetchData() //venter til data er hentet fra databasen

    //sjekker at brukernavnet finnes i databasen:
    if (!db.hasOwnProperty(username)){
        res.send("username does not exist");
        return;
    }

    console.log(db)
    if (db[username].password === userpassword){ //sjekker om passorder stemmer med det fra brukeren
        res.send("login");
        return;
    } else {
        res.send("wrong username or password");
        return;
    }
}

async function addUser(username, userpassword, res){ //legger til bruker
  //unngå at programmet kræsjer hvis verdiene ikke kan brukes
  if (typeof username == 'undefined'|| typeof userpassword == 'undefined'){
    res.send("input is undefined");
    return;
  }
  let db = await fetchData() //venter til data er hentet fra databasen

  //sjekker at brukernavnet ikke finnes i databasen:
  if (db.hasOwnProperty(username)){
    res.send("username already exists");
    return;
  }
  
  //unngå at noen spammer serveren full av tomme brukere
  if (countJSONLength(db) >= 20){
    res.send("brukere er foreløpig begresnet til 20, send melding på teams til Markus Stuevold Madsbakken");
    return;
  }

  res.send(appendDatabase(
    '"' + username + '": {"password": "' + userpassword + '"}'
  ));
}
