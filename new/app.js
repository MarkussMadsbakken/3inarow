const database = require("./database.js")

dbpath = "./database/db.db"

database.dbinit();

//express init
const port = 3000
const express = require('express');
const app = express();

//passport init
const passport = require('passport')
var localStrategy = require('passport-local')

passport.use(new localStrategy (db.verify(username,password)))




//const multer = require('multer')
//const sharp = require('sharp')

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));