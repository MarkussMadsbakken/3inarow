
const database = require("./database.js") //database init
const lobby = require("./lobbyHandler.js") //lobby
const path = require('path') //path

//express init
const port = 3000   
const express = require('express');
const app = express();

//websocket
var expressWs = require('express-ws')(app);

//ws init
app.ws("/echo", function(ws, req) {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

//lagre ws i egen liste med brukere
//ws.send sender til bruker
//ws.end slett ws




//css
app.use(express.static(__dirname + '/public'));


//session init
const session = require('express-session')
var SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
    secret: "GenererTilfeldigSenere", //endre dette senere. Lagre secret som et nytt tilfelfig nummer hver gang server starter?
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({db : 'sessions.db', dir: __dirname + '/database'})
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
        return cb(null, false, {message: "wrong usename or password"})
            
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
        if (user){ //hvis brukeren finnes
            req.logIn(user,function(err){ //logg inn brukeren
                if (err){return next(err)} //hvis error, returner
                res.send("login:" + user.username) //send login
            })
        } 
        else { //hvis brukeren ikke finnes
            res.send(info) //send grunn til at innlogging feilet
        }
    })(req,res,next)
})

//sjekk om innlogget
app.post("/getLoggedIn", (req,res) => {
    if (req.user){
        res.send("LoggedIn:"+req.user.username)
    } else {
        res.send("NotLoggedIn")
    }
})

//logout
app.post("/logout", (req,res) => {
    req.logout(function(err) {
        if (err) {return next(err)}
        res.send("ok")
    })

})

// ----------- signup -----------
app.get("/signup", function(req,res){
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.post('/signup/:username/:password', (req,res) =>{
    //henter verdier
    let username = req.params["username"];
    let password = req.params["password"];

    addUser(username, password, res);
})

function addUser(username, password, res){
    database.getUserInfo(username).then(user => {
        if (user.hasOwnProperty("error")){
            database.userinit(username, password).then(cb => {
                res.send("user created")
            })
        } else {
            res.send("err: user already exists")
        }
    })

    //database.addUser()
}

// ----------- index -----------
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "index.html"))
    sse.send("ad")
})

app.post("/creategame", function(req,res){
    if(req.user){
        sse.send(req.user)
        res.send("ok")
    } else {
        sse.send("no_user")
        res.send("ok")
    }
})




// ----------- userpage -----------

const multer = require('multer')
const sharp = require('sharp')


app.get('/user/:user', async function(req,res){ //kan hende async fucker opp et par ting. Kanskje bytt til .then()?
    database.getUserInfo(req.params["user"]).then(user =>{
        if (user.hasOwnProperty("error")){
            res.sendFile(path.join(__dirname, "userNotFound.html")); //sender user not found
        }
    
        res.sendFile(path.join(__dirname, "userpage.html")); //sender userpage
    })
})
  
  
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
  
app.post('/pfpUpload/:username', imageUploader.single('icon'), async function (req, res, next) {
    //sjekke om token og brukernavn matcher
    if (req.file === undefined){
      res.send("rejected") 
      return
    }
    if (req.user){
        if(req.params["username"] == req.user.username){
            sharp(req.file.buffer).resize(250,250).toFile(__dirname+'/public/uploads/'+req.params["username"]+'.png')  //resizer og lagrer
            .then((data) => {
                res.send("uploaded"); //sender melding om at den ble lastet opp
            })
        } else {
            res.send("rejected")
        }
    } else {
        res.send("rejected")
    }
    // req.body will hold the text fields, if there were any
    })
  
  
  
app.post('/getUserInfo/:user', function (req,res){
    //her henter vi match-historikk og elo
    database.getUserInfo(req.params["user"]).then(userInfo => {
        if(userInfo){
            var games = '"games":'+userInfo["games"]
            var created = '"created":"'+userInfo["created"]+'"'
            var elo = '"elo":"'+userInfo["elo"]+'"'
            var editAccess = false
            //når ranks, returner egen rank logikk her basert på elo

            if(req.user){
                if (req.user.username == req.params["user"]){
                    editAccess = true
                }
            }
            
            res.send('{'+games+','+created+','+elo+','+'"editAccess":"'+editAccess+'"}')

        } else {
            res.send("error")
        }
    })
})


app.post('/requestImage/:user', async function (req,res){ //brukes også til å vise bilde i lobby
    //her henter vi bildet til brukeren og sender det tilbake til brukeren via res.sendfile
    console.log("requesr")
    console.log(__dirname+"/public/uploads/"+req.params["user"]+".png")
    res.sendFile(__dirname+"/public/uploads/"+req.params["user"]+".png")
})


//game
app.get('/game/:gameid', async function(req,res){
    res.sendFile(path.join(__dirname, "game.html"));
})




//https://realtimecolors.com/palettes/?colors=000000-ffffff-4685ff-f2f2f2-ffb084