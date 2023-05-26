const sqlite3 = require('sqlite3').verbose();

const dbPath = ".db.db" //siden programmet kalles fra /database, lages det en mappe i samme navn? rart

function dbinit(){ //initierer databasen
    const db = new sqlite3.Database(dbPath)
    console.log(dbPath)
    db.serialize(() => {
        db.run('CREATE TABLE users (username TEXT, password TEXT, created TEXT, games TEXT)')
        db.close();
  
    })
}

function userinit(username, password){ //initiere bruker i databasen
    const db = new sqlite3.Database(dbPath) //vet ikke om man trenger å skrive inni men hvem skal stoppe med
  
    const values = [username, password, Date.now().toString(), "{}"] //we love verdier
    db.serialize(() => { //man må ha dette med?
        db.run('INSERT INTO users VALUES (?, ?, ?, ?)', values); //sette inn verdier i databasen
        db.close(); //lukke databasen
    })
}

function deleteuser(username){ //slette bruker fra databasen
    const db = new sqlite3.Database(dbPath);
    db.serialize(() => {
        db.run('DELETE FROM users WHERE username = "' + username + '"');
        db.close();
    })
}

function getUserInfo(username){
    const db = new sqlite3.Database(dbPath)

    db.get('SELECT * FROM users WHERE username = "' + username  +'"', function(err, user){
        if (err) {return "error: " + err;}
        if (!user) {return "error: no_user"}

        return user
    })
}

module.exports = { //eksportere funksjoner
    dbinit,
    userinit,
    deleteuser,
    getUserInfo
}

