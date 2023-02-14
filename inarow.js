let canvas = document.getElementById("rowgame")
var ctx = canvas.getContext("2d");
let ww = canvas.width
let wh = canvas.height
const wp = 4/5
let dim = [5,5]
let tile_size = Math.min(ww*wp/dim[0], wh*wp/dim[1])
let tile_color = "rgb(100, 100, 100)"
let board = []
for (let i = 0; i < dim[0]; i++) {
    board.push([])
}
let turn = 0
let player_info = 
[{color: "rgb(200,50,50)",name: "Rød"},
{color: "rgb(50,200,50)",name: "Grønn"},
{color: "rgb(50,50,200)",name: "Blå"}]
let players = 3
let winn_l = 4

function c_click(event) {
    let cs = window.getComputedStyle(canvas);
    let x = event.clientX - ww/2 + dim[0]/2*tile_size;
    let y = event.clientY - wh/2 - dim[1]/2*tile_size;
    let collum = Math.floor(x/tile_size)
    console.log(cs.getPropertyValue("left").replace("px",""))
    place(collum)
}
function place(collum) {
    if (collum >= 0 && collum < dim[0]) {
        if (board[collum].length < dim[1]) {
            board[collum].push(turn)
            turn ++
            if (turn >= players) {
                turn = 0
            }
        }
    }
    Draw()
}
function test_win() {
    for (let i = 0; i < board.length; i++) {
        const collum = board[i];
        for (let j = 0; j < collum.length; j++) {
            const tile = collum[j];
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > j) {
                        if (board[i+h][j] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
            if (collum.length-j >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i][j+h] != tile) {
                        test = false
                    }
                }
                if (test) {return tile}
            }
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > (j+h)) {
                        if (board[i+h][j+h] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > (j-h) && (j-h) >= 0) {
                        if (board[i+h][j-h] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
        }
    }
    test = true
    for (let i = 0; i < board.length; i++) {
        if (board[i].length < dim[1]) {test = false}
    }
    if (test) {return "Likt"}

    return false
}

function Draw() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ww, wh);

    // draw all tiles
    for (let i = 0; i < dim[0]; i++) {
        for (let j = 0; j < dim[1]; j++) {
            Rect(tile_color, ww/2 - dim[0]*tile_size/2 + i*tile_size, wh/2 - dim[1]*tile_size/2 + j*tile_size, tile_size, tile_size)
        }
    }
    // draw all pieeeecesss
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            Circle(player_info[board[i][j]].color, ww/2 - dim[0]/2*tile_size + i*tile_size + tile_size/2, wh/2 + dim[1]/2*tile_size - j*tile_size - tile_size/2, tile_size*3/8)
        }
    }

    let resultat = test_win()
    if (resultat !== false) {
        if (resultat == "Likt") {
            txt = "Likt"
        } else {txt = String(player_info[resultat].name) + " vant!"}
        console.log(txt)
    }
    
    
    
}
function Circle(color, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
}
function Rect(color, x, y, u, v) {
    ctx.beginPath()
    //set color
    ctx.rect(x, y, u, v)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
}
Draw()