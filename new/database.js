const sqlite3 = require('sqlite3').verbose();

function dbinit(){
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
        db.run('CREATE TABLE users (username TEXT, password TEXT, created TEXT, games TEXT)')
        db.close();
  
    })
}

function userinit(username, password){
    const db = new sqlite3.Database(dbPath) //vet ikke om man trenger å skrive inni men hvem skal stoppe med
  
    const values = [username, password, Date.now().toString(), "{}"] //we love verdier
    db.serialize(() => { //man må ha dette med?
        db.run('INSERT INTO users VALUES (?, ?, ?, ?)', values) //sette inn verdier i databasen
        db.close(); //lukke databasen
    })
}

function deleteuser(username){
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
        db.run('DELETE FROM users WHERE username = "' + username + '"')
    })
}

module.exports = {
    dbinit,
    userinit,
    deleteuser
}

