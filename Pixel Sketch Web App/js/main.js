var canvas = document.getElementById("canvas");
var canvasTiles = document.getElementById("canvasTiles");
var canvasMouseHover = document.getElementById("canvasMouseHover");
var notification = document.getElementById("notification");


var ctx = canvas.getContext('2d');
var canvasTilesCtx = canvasTiles.getContext('2d');
var canvasMouseHoverCtx = canvasMouseHover.getContext('2d');

var canvasWidth = 600;
var canvasHeight = 600;




sizeCanvas(canvasWidth, canvasHeight);

function sizeCanvas(width, height) {

    // Change Canvas Size
    canvas.width = width;
    canvasTiles.width = width;
    canvasMouseHover.width = width;

    canvas.height = height;
    canvasTiles.height = height;
    canvasMouseHover.height = height;


    // Change Canvas Width
    ctx.width = width;
    canvasTilesCtx.width = width;
    canvasMouseHoverCtx.width = width;

    // Change Canvas
    ctx.height = height;
    canvasTilesCtx.height = height;
    canvasMouseHoverCtx.height = height;
    


}



// Here u can change the canvas width and height
var height = canvas.height;
var width = canvas.width;
var pixelSize = 30;

 // Checks how many pixel can fit inside for height and width of the canvas
var horizontal_grids = width / pixelSize;
var vertical_grids = height / pixelSize;



let posX = []; // Stores all the position to paint in the canvas
let redoPos = []; // Stores Pos X Recent position to enable Redo Functions

var isPainting = false; // Check whether the user is painting or not to prevent drawing in the canvas without the proper command
var positionMoved = []; // Stores position moved in the canvas
lineCoordinates = []; // Coordinates for drawing shapes
var historyCount = 0; 
var tempArr = null;

var penX = null; // For temporary variable for X Mouse Position
var penY = null; // For temporary variable for Y Mouse Position


// The colors for the tiles
var color1 = "#D9D9D9" // Grey
var color2 = "#FFFFFF"; // White

 
var copyLineCoordinates = [];

class User {
    penColor = "black";
    User() {

    }
    getColor() {
        return this.penColor;
    }
    setColor(color) {
        this.penColor = color;
    }
}








