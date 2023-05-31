const sqlite3 = require('sqlite3').verbose();

var dbPath = __dirname + "/database/db.db" //siden programmet kalles fra /database, lages det en mappe i samme navn? rart

async function dbinit(){ //initierer databasen
    console.log(dbPath)
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
        db.run('CREATE TABLE users (username TEXT, password TEXT, created TEXT, games TEXT)')
        db.close();
  
    })
}

async function userinit(username, password){ //initiere bruker i databasen
    const db = new sqlite3.Database(dbPath) //vet ikke om man trenger å skrive inni men hvem skal stoppe med
    
    const values = [username, password, Date.now().toString(), "{}"] //we love verdier
    db.serialize(() => { //man må ha dette med?
        db.run('INSERT INTO users VALUES (?, ?, ?, ?)', values); //sette inn verdier i databasen
        db.close(); //lukke databasen
    })
}

async function deleteuser(username){ //slette bruker fra databasen
    const db = new sqlite3.Database(dbPath);
    db.serialize(() => {
        db.run('DELETE FROM users WHERE username = "' + username + '"');
        db.close();
    })
}

function getUserInfo(username){ //hente informasjonen til en bruker ved gitt brukernavn
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbPath)

        db.get('SELECT * FROM users WHERE username = "' + username  +'"', function(err, user){
            if (err) {resolve( {"error": + err})}
            if (!user) {resolve({"error": "no_user"})}
            return resolve(user)
        })
    })
}


module.exports = { //eksportere funksjoner
    dbinit,
    userinit,
    deleteuser,
    getUserInfo
}

