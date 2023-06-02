let window_width = window.innerWidth;
let window_heigth = window.innerHeight;

//pixi init
const app = new PIXI.Application({ background: '#cccccc ', resizeTo: document.getElementById("game"), antialias: true});
app.ticker.maxFPS = 30;

document.getElementById("game").appendChild(app.view);

//backgroundContainer
const backgroundContainer = new PIXI.Container({antialias: true});
app.stage.addChild(backgroundContainer);

//playercontainer
const playerContainer = new PIXI.Container ({antialias: true})
app.stage.addChild(backgroundContainer);

//graphics init
const graphics = new PIXI.Graphics();


//textures
const redTexture = PIXI.Texture.from('/conai/assets/red.png');



class Game {
    constructor(width,height,players){
        console.log(players)
        this.width = width;
        this.height = height;
        this.players = players; 
        this.boardTexture = PIXI.Texture.from('/conai/assets/board.png') //boardTexture
        this.holeTexture = PIXI.Texture.from('/conai/assets/hole.png') //holetexture

        this.padding = 2 //padding mellom elementer i prosent av total størrelse av canvas
        this.column = 0
        this.row = 0

        this.haswon = false;

        this.winLength = 4

        this.turn = 1 //man starter på 1, 0 er reservert for hull

        //initiere sprites
        this.board = new PIXI.Sprite(this.boardTexture);

        //lagrer players i form av sprite
        Object.keys(this.players).forEach(player => { 
            this.players[player] = PIXI.Texture.from(this.players[player])
        });


        //lager brettet
        this.boardVals = {}
        for (let x = 0; x < this.width; x++){
            this.boardVals[x] = [];
            for (let y = 0; y < this.height; y++){
                this.boardVals[x].push(0)
            }
        }

        console.log(this.boardVals) //debug

        app.stage.interactive = true; //sett interactivity ENDRE!!


        //event listeners
        app.stage.addEventListener("pointermove", (e) => {
            this.pointerMove(e.global);
        })

        app.stage.addEventListener("click", (e) =>{
            this.place(this.column,this.turn,this.row);

            if (doEval){if (this.turn == aiTurn){
                console.log(this.eval) 
                this.draw()
    
                let nMove = Number(this.eval[1].split("-")[0])
                console.log(nMove)

                let row = -1

                for (let j = 0; j < height+1; j++){
                    if (this.boardVals[nMove][height-j] == 0){ //move er valid
                        row = height - j
                        break
                    }
            }
                this.place(nMove,aiTurn,row)
                this.draw()
            }}
            this.pointerMove(e.global); //dette kaller draw hvis row ikke er 0
        })
    
        this.resize(); //kall resize når spillet starter
    }

    pointerMove(pos){

        if (this.haswon) {return;} //ikke oppdater når noen har vunnet

        //finner hvilken kolonne musen er over
        this.column = this.getColumn(pos);

        //sjekk alle verdiene fra bunenen av kolonnen
        for (let i = 0; i < this.height+1; i++){
            if (this.boardVals[this.column][this.height-i] == 0){ //move er valid
                //tegner brettet FINN EN BEDRE LØSNING

                this.draw();
                
                //tegner en texture for å indikere plass
                let waitingSprite = new PIXI.Sprite(this.players[this.turn])
                let padding = (this.board.width/100) * this.padding

                let newSize = (this.board.width - ((this.width + 2) * padding)) / this.width //kalkulerer ny størrelse

                waitingSprite.width = newSize
                waitingSprite.height = newSize

                waitingSprite.alpha = 0.5 //transparent

                //plasserer waitingsprite
                waitingSprite.x = (this.column * (((this.board.width - (padding)) / this.width))) + this.board.x + padding
                waitingSprite.y = ((this.height-i) * (((this.board.height - (padding)) / this.height))) + this.board.y + padding
                backgroundContainer.addChild(waitingSprite)
                
                //lagrer raden prikken skal plasseres i
                this.row = this.height-i 

                return;

            }
        }
    }

    nextPlayer(){ //neste spiller

        if (this.turn == Object.keys(this.players).length) { //
            this.turn = 1;

        } else {
            this.turn += 1
        }
    }

    place(column,player,row){ //funksjon for å plassere brikke

        //console.log(this.boardVals) //debug

        if (this.haswon) {return;} //ikke oppdater når noen har vunnet

        //sjekke om et move er valid
        if (!this.boardVals[column][row] == 0){ //hvis plassen er fylt
            console.log("invalid, fylt")
            return; //move invalid
        }

        if (this.boardVals[column][row + 1] == 0){ //hvis det ikke er en brikke under
            console.log("invalid")
            return //move invalid
        }

        this.boardVals[column][row] = player //vi antar at spilleren har hoveret over brettet

        //neste player
        this.nextPlayer();

        if (this.row == 0){this.draw(); this.checkWin(); return;}; //hvis row er 0, draw og return

        this.checkWin(); //sjekker om en spiller har vunnet

    }

    getColumn(pos){
        //endrer posijonen til relativt i forhold til brettet.
        pos["x"] -= this.board.x
        
        let column = 0
        for (var i = 0; i < this.width; i++){ //for alle kolonnene
            if (pos["x"] > i * (((this.board.width - ((this.board.width/100) * this.padding)) / this.width)) + ((this.board.width/100) * this.padding)/2){ //bruker samme logikk som blir brukt til å rendere brikkene
                column = i //setter kollonnen til det høyeste i-verdien
            }
        }

        return column;  
    }

    draw(){

        backgroundContainer.removeChildren(); //tømmer backgroundcontainer

        //hole.blendMode = PIXI.BLEND_MODES.ERASE;

        //draw background
        backgroundContainer.addChild(this.board);

        for (let x = 0; x < this.width; x++){ //looper igjennom lengden av brettet
            
            //kalkulerer padding og størrelse
            let padding = (this.board.width/100) * this.padding
            let newSize = (this.board.width - ((this.width + 2) * padding)) / this.width

            for (let y = 0; y < this.height; y++){ //looper igjennom høyden av brettet

                if (this.boardVals[x][y] == 0){ //hvis det ikke er en brikke i hullet
                    let hole = new PIXI.Sprite(this.holeTexture); //initierer sprite

                    //((this.board.width / 100) * this.padding* (x+1)) + this.board.x
                    let spriteSize = 100 //endre dette til en metode for å finne den faktiske størrelsen til spriten. 

                    //størrelsen burde være lik i begge retninger
                    hole.width = newSize
                    hole.height = newSize
                
                    //plasserer hull
                    hole.x = (x * (((this.board.width - (padding)) / this.width))) + this.board.x + padding
                    hole.y = (y * (((this.board.height - (padding)) / this.height))) + this.board.y + padding

                    //console.log(hole.width)

                    backgroundContainer.addChild(hole)

                } else { //det er en brikke i hullet
                    let piece = new PIXI.Sprite(this.players[this.boardVals[x][y]])
                    piece.width = newSize
                    piece.height = newSize

                    piece.x = (x * (((this.board.width - (padding)) / this.width))) + this.board.x + padding
                    piece.y = (y * (((this.board.height - (padding)) / this.height))) + this.board.y + padding
                    
                    backgroundContainer.addChild(piece)

                }
            }
        }
    }

    drawWin(winx,winy){
        //fungerer ikke ved 
        graphics.lineStyle(5,0xFFFFFF,1);

        let padding = (this.board.width/100) * this.padding
        let circleSize = (this.board.width - ((this.width + 2) * padding)) / this.width
        
        let startx = (winx[0] * (((this.board.width - (padding)) / this.width))) + this.board.x + padding + (circleSize/2)
        let endx = (winx[1] * (((this.board.width - (padding)) / this.width))) + this.board.x + padding + (circleSize/2)

        let starty = (winy[0] * (((this.board.height - (padding)) / this.height))) + this.board.y + padding + (circleSize/2)
        let endy = (winy[1] * (((this.board.height - (padding)) / this.height))) + this.board.y + padding + (circleSize/2)
        
        graphics.moveTo(startx,starty);
        graphics.lineTo(endx,endy);

        this.draw(); //tegn for å unngå highlight av neste piece

        backgroundContainer.addChild(graphics)

        this.endGame(); //avslutt spillet
    }

    resize(){

        //resetter plasseringen til bakgrunnen
        this.board.x = 0
        this.board.y = 0

        //finner hvor størrelsen til padding
        let paddingx = (this.width + 2) * ((app.screen.width / 100) * this.padding)
        let paddingy = (this.height + 2) * ((app.screen.height / 100) * this.padding)

        //finner forholdet mellom høyde og lengde
        let widthRatio = Math.floor((app.screen.width - paddingx)/this.width)
        let heightRatio = Math.floor((app.screen.height - paddingy)/this.height);

        //endrer størrelsen til gamebackgroundContainer og brettets bakgrunn
        if (widthRatio > heightRatio){ //hvis bredden er større 
            //bredden til sirklene må være lik høyden
            this.board.height = heightRatio * this.height + paddingy;
            this.board.width = heightRatio * this.width + paddingx;


        } else { //hvis høyden er større
            //høyden til sirklene må være lik bredden
            this.board.width = widthRatio * this.width + paddingx;
            this.board.height = widthRatio * this.height + paddingy;
        }

        //flytter brettet til midten av skjermen
        this.board.x -= (this.board.width/2) - (app.renderer.width/2);
        this.board.y -= (this.board.height/2) - (app.renderer.height/2);

        this.draw(); //tegner brettet

    }
    
    checkWin(){
        //endre dette til en for løkke for å gjøre det mulig å endre win lenght
        let winx = []
        let winy = []


        //sjekker horisontal win
        for (let y = 0; y < this.height; y++){
            for (let x = 0; x < this.width - this.winLength+1; x++){ //+1??? Vet ikke hvorfor, men fungerer ikke uten
                if (this.boardVals[x][y] == this.boardVals[x+1][y] && this.boardVals[x][y] == this.boardVals[x+2][y] && this.boardVals[x][y]==this.boardVals[x+3][y] && !this.boardVals[x][y] == 0){ //endre til for løkke!!!
                    winx = [x,x+3];
                    winy = [y,y];

                    this.haswon = true;
                }
            }
        }

        //sjekker vertikal win
        for (let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                if (this.boardVals[x][y] == this.boardVals[x][y+1] && this.boardVals[x][y] == this.boardVals[x][y+2] && this.boardVals[x][y] == this.boardVals[x][y+3] && !this.boardVals[x][y] == 0){
                    winx = [x,x];
                    winy = [y,y+3];

                    this.haswon = true;
                }
            }
        }

        //sjekker skrå win
        for (let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){

                //skrå opp til høyre
                if (y > this.winLength-2 && x < this.width - (this.winLength-1)){
                    //console.log(this.boardVals[x][y] + "" + this.boardVals[x+1][y-1] + "" + this.boardVals[x+2][y-2] + "" + this.boardVals[x+3][y-3]) debug
                    if (this.boardVals[x][y] == this.boardVals[x+1][y-1] && this.boardVals[x][y] == this.boardVals[x+2][y-2] && this.boardVals[x][y] == this.boardVals[x+3][y-3] && !this.boardVals[x][y] == 0){
                        winx = [x,x+3];
                        winy = [y,y-3];

                        this.haswon = true;
                    }
                }
                
                //skrå opp til venstre
                if(y > this.winLength-  2 && x > this.winLength - 2){
                    if (this.boardVals[x][y] == this.boardVals[x-1][y-1] && this.boardVals[x][y] == this.boardVals[x-2][y-2] && this.boardVals[x][y] == this.boardVals[x-3][y-3] && !this.boardVals[x][y] == 0){
                        winx = [x,x-3];
                        winy = [y,y-3];

                        this.haswon = true;
                    }
                }
            }
        }

        //sjekker om brettet er fullt
        let found = false
        for (let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                if (this.boardVals[x][y] == 0){ //his brettet er fullt, break og return
                    found = true
                    break
                }
            }
            if (found){
                break
            }
        }

        if (doEval){
            this.eval = evaluate(this.boardVals,depth,this.turn,aiTurn); //evaluerer posisjonen
        }

        if (found == false){
            this.endGame();
        }
        
        
        if (this.haswon) {this.drawWin(winx,winy);}

        return;
    }

    restart(width, height,players){
        this.width = width
        this.height = height
        this.players = players

        this.padding = 2 //padding mellom elementer i prosent av total størrelse av canvas
        this.column = 0
        this.row = 0

        this.haswon = false;

        this.winLength = 4

        this.turn = 1 //man starter på 1, 0 er reservert for hull

        //lager lister som lagrer brikkene i spill
        this.boardVals = {}
        for (let x = 0; x < this.width; x++){
            this.boardVals[x] = [];
            for (let y = 0; y < this.height; y++){
                this.boardVals[x].push(0)
            }
        }

        Object.keys(this.players).forEach(player => { //lagrer players i form av sprite
            this.players[player] = PIXI.Texture.from(this.players[player])
        });

        this.resize();  

        graphics.clear();

        
    }
    endGame(){ 
        //vise start game screen

        setTimeout(function(){
            //document.getElementById("endGamePopup").style.display = "flex";
            document.getElementById("endGamePopup").style.opacity = 1;
            document.getElementById("endGamePopup").style.pointerEvents = "auto";

        },1000)
    }
}

var game = 0

function startGame(){

    players = {
        1: "/conai/assets/red.png",
        2: "/conai/assets/black.png"
    }
    

    game = new Game(7,6,players) //initierer ett nytt spill

    //koden under håndterer resize. Resize må skje med delay, for å unngå å resize til feil dimensjoner

    function resizeHandler(){ //funksjon for å calle resize etter delay
        game.resize();
    }

    //resizer etter 500ms
    var resizeTimeout;
    window.addEventListener("resize",function(){
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHandler,100); //kaller resizehandler når 500ms har gått uten resize
    })

    /*
    app.ticker.add(function(delta){
        game.render();
    })
    */
}




startGame();

function restartGame(){
    game.restart(7,7,{
        1: "/conai/assets/red.png",
        2: "/conai/assets/black.png"
    });
}

function getPageElements(){
    //hent sideelementer
    var startButton = document.getElementById("startGame")
    startButton.addEventListener("click",startHandler)
}

const colors = []
const supColors = 8 //hvor manges spillere som kan spille

//tullete måte å gjøre det på, men det fungerer
colors.push("/conai/assets/red.png")
colors.push("/conai/assets/black.png")
colors.push("/conai/assets/blue.png")
colors.push("/conai/assets/green.png")
colors.push("/conai/assets/orange.png")
colors.push("/conai/assets/purple.png")
colors.push("/conai/assets/pink.png")
colors.push("/conai/assets/yellow.png")

function startHandler(){

    let nPlayers = document.getElementById("numPlayers").value;
    let players = {}

    for (let i = 0; i < nPlayers; i++){
        players[i+1] = colors[i]
    }

    let xSize = document.getElementById("xSize").value;
    let ySize = document.getElementById("ySize").value;
    doEval = document.querySelector('#aiCheck').checked;
    

    //document.getElementById("endGamePopup").style.display = "none";
    document.getElementById("endGamePopup").style.opacity = 0;
    document.getElementById("endGamePopup").style.pointerEvents = "none";
    if (isNaN(parseInt(xSize)) || isNaN(parseInt(ySize)) || Object.keys(players) == 0) {
        game.restart(7,6,{
            1: "/conai/assets/red.png",
            2: "/conai/assets/black.png"
        });
    } else {
        game.restart(parseInt(xSize),parseInt(ySize),players)
    }
}

var doEval = false; //om posisjonen skal evalueres
var depth = 5; //hvor dypt aien skal søke

var aiTurn = 2 //hvilken turn er aien
window.onload = getPageElements


//resizer fungerer ikke alltid i enkelte ekstreme tilfeller
//fikse win når brettet er større