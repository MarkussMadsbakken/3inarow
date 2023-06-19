//lobbyhandler for inarow
class lobby {
    constructor(owner){
        this.owner = owner
        this.players = []
        this.inProgress = false
        this.settings = {"maxplayers" : 8, "size" : [6,7]}

        this.initLobby() //kaller init av lobby
    }
    initLobby(){

    }

    startGame(){
        this.inProgress = true
    }

    endGame(){
        this.inProgress = false
    }

    updateLobbySettings(changedSettings){
        changedSettings.forEach(setting => {
            console.log(setting)
        });
    }
}

class lobbyHandler{
    constructor(){
        this.lobbies = {}
    }

    makelobby(owner){

        let code = this.findValidCode()

        let found = false
        Object.keys(this.lobbies).forEach(lobbyId =>{

            if (this.lobbies[lobbyId].owner == owner){
                found = lobbyId
            }
        })
        if (found){
            return "has lobby " + found
        }

        this.lobbies[code] = new lobby(owner)
        return code
    }
    
    addToLobby(lobbyId,user){
        this.removeFromLobby(user)

        this.lobbies[lobbyId]
        return this.lobbies
    }

    removeFromLobby(){
        //fjern fra alle lobbies

        //  

    }

    deleteLobby(){

    }

    findValidCode(){ //finner en unik kodes
        let maxIterations = 100
        let i = 0

        while(i < maxIterations){
            let code = this.generateCode()

            if (!this.lobbies.hasOwnProperty(code)){
                return code
            }
            i += 1
        }
        return "no valid code found"
    }

    //automatisk slette lobbies som er tomme
    generateCode(){
        let length = 4; //hvor lang koden generert er
        let result = "";
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const charlenght = char.length;
        let i = 0;

        //stjålet fra stackoverflow
        while (i < length){
            result += char.charAt(Math.floor(Math.random()*charlenght));
            i += 1;
        }

        return result;

    }
}


lobbyHandler = new lobbyHandler
id = lobbyHandler.makelobby("a")
console.log(lobbyHandler.addToLobby(id,"a"))
console.log(lobbyHandler.makelobby("a"))

//ping server hver 5. sekund med tid, kode og id