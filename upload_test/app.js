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



var storage = multer.memoryStorage(); //buffer

var imgFilter = (req, file, cb) => { //image filter fra stackoverflow :)
  if (file.mimetype.split("/")[0] === 'image') {
      cb(null, true);
  } else {
      cb(new Error("Only images are allowed!"));
  }
};

imageUploader = multer({ //multer init
  storage,
  fileFilter: imgFilter
});


//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));



app.get('/user/:user', async function(req,res){ //kan hende async fucker opp et par ting. Kanskje bytt til .then()?  
    res.sendFile(path.join(__dirname, "userpage.html")); //sender userpage
  })

app.post('/pfpUpload/:token/:username', imageUploader.single('icon'), async function (req, res, next) {
  if (req.file === undefined){
    res.send("rejected")
    return
  }
  sharp(req.file.buffer).resize(100,100).toFile(__dirname+'/uploads/'+req.params["username"]+'.png', (err,info) => {if (err) throw err})
  res.send("accepted")
  // req.body will hold the text fields, if there were any
  })