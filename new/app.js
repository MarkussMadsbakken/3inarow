const database = require("./database.js")

//express init
const port = 3000
const express = require('express');
const app = express();

//session init
const session = require('express-session')

app.use(session({
    secret: "veldig_sikker",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
}));

//passport init
const passport = require('passport')
var localStrategy = require('passport-local')

passport.use(new localStrategy(function verifyLogin(username, password, cb){ //init innlogging
    let user = database.getUserInfo(username) //hent informasjon om bruker som logger inn

    if (user.includes("error: ")){ //hvis det er en error i databasen
        let errorcode = user.split("error:")[1]
        if (errorcode = "no_user"){
            return cb(null, false, {message: "wrong username or password"})
        }
        return cb(errorcode)
    }

    if (password == user.password){
        return cb(null, user)
    }

}));

passport.serializeUser(function(user, cb) { //når en bruker aksepteres
    process.nextTick(function(){
        return cb(null, {
            id: user.id,
            username: user.username
        })
    })
})

passport.deserializeUser(function(user, cb){
    process.nextTick(function(){
        return cb(null, user)
    })
})


//const multer = require('multer')
//const sharp = require('sharp')

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port)

//css
app.use(express.static(__dirname + '/public'));


