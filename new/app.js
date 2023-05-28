//database init
const database = require("./database.js")

const path = require('path')

//express init
const port = 3000
const express = require('express');
const app = express();
//const logger = require("morgan")

//css
app.use(express.static(__dirname + '/public'));


//session init
const session = require('express-session')
var SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
    secret: "GenererTilfeldigSenere", //endre dette senere. Lagre secret som et nytt tilfelfig nummer hver gang server starter?
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({db : 'sessions.db', dir: './database'})
}));

//passport init
const passport = require('passport')
var localStrategy = require('passport-local')

// body-parser 
const bodyParser = require("body-parser");
app.use(express.json())

app.use(passport.authenticate('session'));
app.use(passport.session());

passport.use('local',new localStrategy(
    function verify(username, password, cb){ //init innlogging

        database.getUserInfo(username).then(user =>{
            if (user.hasOwnProperty("error")){

                let errorcode = user["error"]

                if (errorcode == "no_user"){
                    return cb(null, false, {message: "wrong username or password"})
                }
                return cb(errorcode)
            }

        if (password == user.password){
            return cb(null, user)
        }
        return cb(null,user)
            
        }) //hent informasjon om bruker som logger inn

    }
));

//pasport serialize
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });

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




// ----------- login -----------


//loginpage
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
  });



//login
app.post("/login/:username/:password", (req,res,next) => {
    passport.authenticate('local',  //autentiser session med passport
    function(err,user,info) {
        if (user){
            req.logIn(user,function(err){
                if (err){return next(err)}
                res.send("login")
            })
        } 
        else {
            res.send(info)
        }
    })(req,res,next)
  })



//logout
app.post("/logout", (req,res) => {
    req.logout(function(err) {
        if (err) {return next(err)}
        res.send("ok")
    })

})

//sjekk om innlogget
app.post("/checkIfLoggedIn", (req,res) => {
    if (req.user){
    res.send(user)}
})

//index
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "index.html"))
})


