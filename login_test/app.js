var http = require('http');
var url = require('url');
var fs = require('fs');
var fe = ".html"
var path = require("path");

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

var database = __dirname+"/very_secure_database.txt";
var databaseData = ""

// Read the database and print its contentss
fs.readFile(database, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + database);
  readDatabase(data)
});

function readDatabase(data){
    console.log(data)
    let pos = data.search("--begin")
    console.log(pos)
}

