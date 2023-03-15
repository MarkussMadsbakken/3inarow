var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require("path");
var util = require('util')

var port = 3000
var express = require('express'); //framework
var app = express();

var sharp = require('sharp'); //image processing
var multer = require('multer'); //file upload



//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));





app.get('/user/:user', async function(req,res){ //kan hende async fucker opp et par ting. Kanskje bytt til .then()?  
    res.sendFile(path.join(__dirname, "userpage.html")); //sender userpage
  })

