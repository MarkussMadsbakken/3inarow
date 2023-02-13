let canvas = document.getElementsByTagName("canvas")[0]
var ctx = canvas.getContext("2d");
let ww = canvas.width
let wh = canvas.height
const wp = 4/5
let dim = (5,5)
let tile_size = Math.min(ww*wp/tile_size*dim[0], wh*wp/tile_size*dim[1])
let tile_color = "rgb(155, 102, 102)"


function Draw() {
    ctx = canvas.getContext("2d");
    // draw all tiles
    for (let i = 0; i < dim[0]; i++) {
        for (let j = 0; j < dim[1]; j++) {
            Rect(tile_color, ww/2 - dim[0]*tile_size/2 + i*tile_size, wh/2 - dim[1]*tile_size/2 + j*tile_size, tile_size, tile_size)
        }
    }
    // draw all pieeeecesss

}
function Circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}
function Rect(color, x, y, u, v) {
    //set color
    ctx.fillRect(x, y, u, v);
}
Draw()