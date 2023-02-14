let canvas = document.getElementById("rowgame")
var ctx = canvas.getContext("2d");
let ww = canvas.width
let wh = canvas.height
const wp = 4/5
let dim = [5,5]
let tile_size = Math.min(ww*wp/dim[0], wh*wp/dim[1])
let tile_color = "rgb(155, 102, 102)"
let board = []
for (let i = 0; i < dim[0]; i++) {
    board.push([])
}
let turn = 0
let player_info = 
[{color: "rbg(200,50,50)",name: "Rød"},
{color: "rbg(50,200,50)",name: "Grønn"},
{color: "rbg(50,50,200)",name: "Blå"}]
players = 2

function c_click(event) {
    let x = event.clientX - ww/2 + dim[0]/2*tile_size;
    let y = event.clientY - wh/2 - dim[1]/2*tile_size;
    let collum = Math.floor(x/tile_size)
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

function Draw() {
    //fill with background
    console.log(board)
    ctx = canvas.getContext("2d");

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
}
function Circle(color, x, y, r) {
    ctx.beginPath();
    //set color
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}
function Rect(color, x, y, u, v) {
    ctx.beginPath();
    //set color
    ctx.rect(x, y, u, v);
    ctx.stroke();
}
Draw()