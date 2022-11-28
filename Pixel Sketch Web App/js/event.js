


user = new User();
Paint = new Paint();

drawTiles(pixelSize);


function drawTiles(pixelSize) {

	// Draw the Tiles
	canvasTilesCtx.clearRect(0, 0, canvas.width, canvas.height);
	// X Position of the tiles
	var positionWidthCount = 0;
	// Y Position tiles
	var positionHeightCount = 0;
	// This decides whether the tiles would be gray or white
	var crement = true;

	

	for (let j = 0;j < canvasTiles.height / pixelSize;j++) {
		for (let i = 0;i < canvasTiles.width / pixelSize;i++) {
			
			if (crement == true) {
				canvasTilesCtx.fillStyle = color1;
				canvasTilesCtx.fillRect(positionWidthCount, positionHeightCount, pixelSize, pixelSize);
				positionWidthCount += pixelSize;
				crement = false;
				continue;
			} 
			if (crement == false) {
				canvasTilesCtx.fillStyle = color2;
				canvasTilesCtx.fillRect(positionWidthCount, positionHeightCount, pixelSize, pixelSize);
				positionWidthCount += pixelSize;
				crement = true;
			}
			
		}
		positionWidthCount = 0;
		
		positionHeightCount += pixelSize;
		crement = !crement;
		
	}
}




// This is the command for drawing in the canvas using click
canvas.onclick = function(e) {
	let x = e.pageX - this.offsetLeft;
	let y = e.pageY - this.offsetTop;
	// We need to reset the redo Position in order to prevent many redo Positions colliding
	redoPos = [];
	
	
    if (Paint.pentype === "pen") {
		Paint.Pen(x,y);
	}

	// Erase when the type is eraser
	if (Paint.pentype === "eraser") {
		Paint.Eraser(x, y);
	}
    
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
  }

function hoverCanvas(x, y) {

	var xdraw = bounding_grid_1d(width, horizontal_grids, x)[0];
	var ydraw = bounding_grid_1d(height, vertical_grids, y)[0];
	canvasMouseHoverCtx.fillStyle = "grey";
	canvasMouseHoverCtx.fillRect(xdraw, ydraw, pixelSize, pixelSize);
}


// Use for Hovering on the canvas
canvas.onmousemove = function(e) {
	canvasMouseHoverCtx.clearRect(0, 0, canvas.width, canvas.height);
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		hoverCanvas(x, y);
}
	
function pushToPosX(array) {
	for (let i in array) {
		addValuesToArray(
			posX, 
			array[i].x, 
			array[i].y, 
			array[i].width,
			array[i].height,
			array[i].type,
			array[i].color,
			array[i].historyNumber 
		);
	}
	copyLineCoordinates = [];
	lineCoordinates = [];
}
newPositionsX = 0;
newPositionsY = 0;
// Functions and Mouse Events when Exiting on Canvas
function exitCanvas() {
// Remember that the following function only adds the values coordinates into the posX array

	isPainting = false; // Means that the user stops painting

	if (Paint.pentype === "rectangle") {
		pushToPosX(lineCoordinates);
	}
	if (Paint.pentype === "move") {
		tempArr = null;
		posX.push({
			x: newPositionsX,
			y: newPositionsY,
			width: 0,
			height: 0,
			type: "move",
			color: "none",
			historyNumber: historyCount
		});
		newPositionsX = 0;
		newPositionsY = 0;

	}
	if (Paint.pentype === "circle") {
		pushToPosX(copyLineCoordinates);
	}
	if (Paint.pentype === "pen") {
		pushToPosX(copyLineCoordinates);
	}
	if (Paint.pentype === "eraser") {
		pushToPosX(copyLineCoordinates);
	}
	if (Paint.pentype === "line") {
		pushToPosX(copyLineCoordinates);
	}

	penX = null;
	penY = null;
	posX = multiDimensionalUnique(posX);
	drawPath();
}

// When the user release the mouse on the main canvas
document.onmouseup = function(e) {
	exitCanvas();
} 

canvas.onmouseleave = function(e) {
	
	canvasMouseHoverCtx.clearRect(0, 0, canvas.width, canvas.height);
}
function addHistoryCount() {
	historyCount++;
}
// When the user starts click on the canvas
canvas.onmousedown = function(e) {
	
	addHistoryCount(); // Adds history count which means there is a change in the canvas
    isPainting = true;

} 


function activatePen(givenValue) {
	notification.innerHTML = givenValue.toUpperCase();
	Paint.pentype = givenValue;
}


function setPixel(x0, y0) {
	lineCoordinates.push({x: x0, y: y0});
}

// Brehenman's Line Algorithm
function bline(x0, y0, x1, y1) {
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
	var err = (dx>dy ? dx : -dy)/2;
   
	while (true) {
		
	
	setPixel(x0,y0);
	  
	  if (x0 === x1 && y0 === y1) break;
	  var e2 = err;
	  if (e2 > -dx) { err -= dy; x0 += sx; }
	  if (e2 < dy) { err += dx; y0 += sy; }
	}
  }

  // Brehenman's Circle Algorithm
  function bcircle(xm, ym, r) {
	var x = -r, y = 0, err = 2-2*r;
        do {
            setPixel(xm-x, ym+y);
            setPixel(xm-y, ym-x);
            setPixel(xm+x, ym-y);
            setPixel(xm+y, ym+x);
            r = err;
            if (r <= y) err += ++y*2+1;
            if (r > x || err > y) {
			err += ++x*2+1;
		}
        } while (x < 0);
}
function copyPosX() {
	if (tempArr === null) {
		tempArr = JSON.parse(JSON.stringify(posX));
		return;
	} 
}
function draw(e) {
    if (isPainting) {
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		var xdraw = bounding_grid_1d(width, horizontal_grids, x)[0];
		var ydraw = bounding_grid_1d(height, vertical_grids, y)[0];

		// Reset the Redo Position to prevent multiple Redo Values
		redoPos = [];

		if (Paint.pentype === "circle") {
			assignMousePosition(xdraw, ydraw);
			let radius = Math.sqrt( Math.pow((penX - xdraw), 2) + Math.pow((penY-ydraw), 2) );
			bcircle(xdraw, ydraw, radius);
			drawPath();

			for (let i in lineCoordinates) {
				lineCoordinates[i].x = bounding_grid_1d(width, horizontal_grids, lineCoordinates[i].x)[0];
				lineCoordinates[i].y = bounding_grid_1d(height, horizontal_grids, lineCoordinates[i].y)[0];
				lineCoordinates[i].width = pixelSize;
				lineCoordinates[i].height = pixelSize;
				lineCoordinates[i].type = "pen";
				lineCoordinates[i].color = user.getColor();
				lineCoordinates[i].historyNumber = historyCount;
				
				ctx.fillStyle = user.getColor();
				ctx.fillRect(lineCoordinates[i].x, lineCoordinates[i].y, pixelSize, pixelSize);
			}
			copyLineCoordinates = JSON.parse(JSON.stringify(lineCoordinates));
			copyLineCoordinates = multiDimensionalUnique(copyLineCoordinates);
			lineCoordinates = [];
		}
		
		if (Paint.pentype === "move") {
			assignMousePosition(xdraw, ydraw);
			copyPosX();
			Paint.Move(tempArr, xdraw, ydraw);
		}
		if (Paint.pentype === "rectangle") {  
			drawPath();
			assignMousePosition(xdraw, ydraw);
			// Used to prevent passing second mouse positions from passing undefined values to bline function
			if (xdraw === undefined || ydraw === undefined) {
				alert();
				return;
			}

			let x = penX - (pixelSize / 2);
			let y = penY - (pixelSize / 2);
			let rectWidth = (penX - xdraw) * -1;
			let rectHeight = (penY - ydraw) * -1;

			setValuesArray(
				lineCoordinates, 
				0, 
				x,
				y, 
				rectWidth,
				rectHeight,
				"rectangle",
				user.getColor(),
				historyCount
			);

			ctx.beginPath();
			ctx.strokeStyle = user.getColor();
			ctx.lineWidth = pixelSize;
			ctx.rect(x, y, rectWidth, rectHeight);
			ctx.stroke()


		}
		

		if (Paint.pentype === "line") {
			drawPath();
			assignMousePosition(xdraw, ydraw);
			
			// Used to prevent passing second mouse positions from passing undefined values to bline function
			if (xdraw === undefined || ydraw === undefined) {
				return;
			}

			bline(penX, penY, xdraw, ydraw);

			for (let i = 0;i < lineCoordinates.length;i++) {

				lineCoordinates[i].x = bounding_grid_1d(width, horizontal_grids, lineCoordinates[i].x)[0];
				lineCoordinates[i].y = bounding_grid_1d(height, vertical_grids, lineCoordinates[i].y)[0];
				lineCoordinates[i].width = pixelSize;
				lineCoordinates[i].height = pixelSize;
				lineCoordinates[i].type = "pen";
				lineCoordinates[i].color = user.getColor();
				lineCoordinates[i].historyNumber = historyCount;

				let x = lineCoordinates[i].x;
				let y = lineCoordinates[i].y;

				ctx.fillStyle = user.getColor();
				ctx.fillRect(x, y, pixelSize, pixelSize);
				
			}

			copyLineCoordinates = JSON.parse(JSON.stringify(lineCoordinates));
			copyLineCoordinates = multiDimensionalUnique(copyLineCoordinates);
			lineCoordinates = [];

			
		}

		if (Paint.pentype === "pen") {
			assignMousePosition(xdraw, ydraw);
			
			// Used to prevent passing second mouse positions from passing undefined values to bline function
			if (xdraw === undefined || ydraw === undefined) {
				return;
			}

			bline(penX, penY, xdraw, ydraw);

			for (let i = 0;i < lineCoordinates.length;i++) {
				let x = bounding_grid_1d(width, horizontal_grids, lineCoordinates[i].x)[0];
				let y = bounding_grid_1d(height, vertical_grids, lineCoordinates[i].y)[0];

				addValuesToArray(
					copyLineCoordinates,
					x,
					y,
					pixelSize,
					pixelSize,
					Paint.pentype,
					user.getColor(),
					historyCount
				);
				ctx.fillStyle = user.getColor();
				ctx.fillRect(x, y, pixelSize, pixelSize);
				
			}
			
			copyLineCoordinates = multiDimensionalUnique(copyLineCoordinates);
			
			penX = xdraw;
			penY = ydraw;
			
			lineCoordinates = [];

		}


		if (Paint.pentype === "eraser") {
			assignMousePosition(xdraw, ydraw);
			
			// Used to prevent passing second mouse positions from passing undefined values to bline function
			if (xdraw === undefined || ydraw === undefined) {
				return;
			}

			bline(penX, penY, xdraw, ydraw);

			for (let i = 0;i < lineCoordinates.length;i++) {
				let x = bounding_grid_1d(width, horizontal_grids, lineCoordinates[i].x)[0];
				let y = bounding_grid_1d(height, vertical_grids, lineCoordinates[i].y)[0];

				addValuesToArray(
					copyLineCoordinates,
					x,
					y,
					pixelSize,
					pixelSize,
					Paint.pentype,
					user.getColor(),
					historyCount
				);
				ctx.clearRect(x, y, pixelSize, pixelSize);
				
			}
			
			copyLineCoordinates = multiDimensionalUnique(copyLineCoordinates);
			
			penX = xdraw;
			penY = ydraw;
			
			lineCoordinates = [];

		}
    } 
}
canvas.addEventListener('mousemove', draw);


// This Function removes same multi-dimensional array values
function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

function drawPath() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	
	for (let i = 0;i < posX.length;i++) {
		
		
		if (posX.x > canvas.width || posX.y > canvas.height) {
			alert();
		}
		if (posX[i].type == "pen") {
			ctx.fillStyle = posX[i].color;
			ctx.fillRect(posX[i].x, posX[i].y, posX[i].width, posX[i].height);
		}
		if (posX[i].type == "rectangle") {
			ctx.beginPath();
			ctx.strokeStyle = posX[i].color;
			ctx.lineWidth = pixelSize;
			ctx.rect(posX[i].x, posX[i].y, posX[i].width, posX[i].height);
			ctx.stroke();
				
		} 
		if (posX[i].type == "eraser") {
			ctx.clearRect(posX[i].x, posX[i].y, pixelSize, pixelSize);
		}
		if (posX[i].type == "clearCanvas") {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		
	}
	
}
function redo() {
	Paint.Redo();
}
function undo() {
	Paint.Undo();
}

function hover(hovers) {

	hovers.onmousemove = function(e) {
		var x = e.clientX,
			y = e.clientY;
		$("#hover span").css({'top' : (y + 20) + 'px', 'left' : (x) + 'px'});
			
	}
	
}


function changePenColor(colorValue) {
	user = new User();
	user.setColor("#" + colorValue);
	changePenColorTypeValues(colorValue);
}
function changePenColorTypeValues(colorValue) {
	let colorElement = document.getElementById("primary-color");
	colorElement.value = "#" + colorValue;
}
function changePenColorType(element) {
	user = new User();
	user.setColor(element.value);
}



function resetCanvas() {
	redoPos = [];
	posX = [];
	lineCoordinates = [];
	copyLineCoordinates = [];
	historyCount = 0;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
}
function ClearAllCanvas () {
	if (posX[posX.length - 1] === undefined || posX[posX.length - 1].type === "clearCanvas" ) {
		return;
	} else {
		historyCount++;
		
		redoPos.push({x: 0, y: 0, width: canvas.width, height: canvas.height , type: "clearCanvas", color: "none", historyNumber: historyCount});
		posX.push({x: 0, y: 0, width: canvas.width, height: canvas.height , type: "clearCanvas", color: "none", historyNumber: historyCount});
		
		drawPath();
	}
	
}
function DownloadCanvas() {
	image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
	var link = document.createElement('a');
	link.download = "PixelSketch.png";
	link.href = image;
	link.click();
}
function getData() {
	console.log(ctx.getImageData);
}



function ResizeCanvas() {
	
	let xSize = parseInt(prompt("Enter Width"));
	let ySize = parseInt(prompt("Enter Height"));
	
	canvasWidth = xSize;
	canvasHeight = ySize;
	sizeCanvas(canvasWidth, canvasHeight);
	
	drawTiles(pixelSize);

}
function ResizePixelSize() {
	let size = parseInt(prompt("Enter Size: "));
	let proceed = confirm("The canvas will be cleared. Are you sure?");
	if (proceed) {
		resetCanvas();
		pixelSize = size;
		horizontal_grids = height / pixelSize;
		vertical_grids = width / pixelSize;
		console.log(horizontal_grids);
		drawTiles(pixelSize);
	}
	else {
		return;
	}
}



// This is for the distribution of the colors in the Tools Colors


colorNames = ["Default", "Simple", "Common", "Skin Tones"];

colors = [
	["000000", "FFFFFF", "7F7F7F", "A1A1A1", "C3C3C3", "C40424", "880015",
	"B97A57", "DBA88C", "ED1C24", "F75B63", "F26F9B", "FF7F27", "F7AB79",
	"FFC90E", "FFF200", "CFC532", "EFE4B0", "1EE656", "0C6624", "22B14C",
	"B5E61D", "5487FF", "00A2E8", "00A2E8", "3F48CC", "3F48CC", "7092BE",
	"720899", "CD55CF", "A349A4", "C8BFE7", "", "", "" ],

	["000000", "000000", "000000", "000000", "000000", "000000", "000000",
	"00A2E8", "00A2E8", "5487FF", "B5E61D", "F26F9B", "FF7F27", "F7AB79",
	"FFC90E", "FFF200", "F26F9B", "EFE4B0", "1EE656", "0C6624", "22B14C",
	"B5E61D", "5487FF", "00A2E8", "00A2E8", "3F48CC", "3F48CC", "7092BE",
	"720899", "CD55CF", "A349A4", "C8BFE7", "", "", "" ],

	["0C6624", "0C6624", "0C6624", "0C6624", "0C6624", "0C6624", "0C6624",
	"B97A57", "DBA88C", "ED1C24", "F75B63", "F26F9B", "FF7F27", "F7AB79",
	"FFC90E", "FFF200", "CFC532", "EFE4B0", "1EE656", "0C6624", "22B14C",
	"B5E61D", "5487FF", "00A2E8", "00A2E8", "3F48CC", "3F48CC", "7092BE",
	"720899", "CD55CF", "A349A4", "C8BFE7", "", "", "" ],

	["5487FF", "5487FF", "5487FF", "5487FF", "5487FF", "5487FF", "5487FF",
	"B97A57", "DBA88C", "ED1C24", "F75B63", "F26F9B", "FF7F27", "F7AB79",
	"FFC90E", "FFF200", "CFC532", "EFE4B0", "1EE656", "0C6624", "22B14C",
	"B5E61D", "5487FF", "00A2E8", "00A2E8", "3F48CC", "3F48CC", "7092BE",
	"720899", "CD55CF", "A349A4", "C8BFE7", "", "", "" ],
	
];

// "", "", "", "", "", "", "",
var colorpalette = document.getElementById("color-palette");
colorpalette.onchange = function(e) {
	


	closeAllColorPallette();
	openColorPallette(this.value);

	

}

function closeAllColorPallette() {
	for (let i in colorNames) {
		let element = document.getElementById(colorNames[i]);
		element.style.display = "none";
	}
}


function openColorPallette(givenElement) {
	let element = document.getElementById(givenElement);
	element.style.display = "block";
}

function loadAllColorPallette(colorNames, colors) {
	for (let i in colorNames) {
		loadColorPallette(colorNames[i], colors[i]);
	}
}

function loadColorPallette(colorNames, colors) {
	let colorPerRow = 7;
	// Begin the write the buttons with distinctive colors
	var toolsColors = document.getElementById("toolsColors");
	
	var colorNameDiv = document.createElement("div");
	colorNameDiv.id = colorNames;
	


	
	colorNameDiv.style.display = "none";
	

	toolsColors.appendChild(colorNameDiv);

	var colorsCount = 0;
	var colorsCheckerCount = 0;
	while (colorsCount != colors.length) {
		
		var createDivElement = document.createElement("div");
		createDivElement.className = "row ";

		while (colorsCheckerCount != colorPerRow) {

			var createColorButtonElement = document.createElement("button");
			createColorButtonElement.className = "color";
			
			createColorButtonElement.style.backgroundColor = "#" + colors[colorsCount];
			
			createColorButtonElement.onclick = function() {
				changePenColor(this.value);
			};
			createColorButtonElement.value = colors[colorsCount];
			// Adding the Button to the Div
			createDivElement.appendChild(createColorButtonElement);
			colorsCheckerCount++;
			colorsCount++;
			
		}

		// Adding the rows to the main Div
		colorNameDiv.appendChild(createDivElement);
		colorsCheckerCount = 0;


	}
}

var pixelSizeSlider = document.getElementById("pixelSizeSlider");

function sizePixelSize(size) {
	
	size = parseInt(size);
	if (size % 4 == 0) {
		console.log("Straigt Lines")
		return;
	}
	if (size % 2 == 1) {
		size -=1;
	}
	pixelSize = size;
	console.log(size);
	horizontal_grids = height / pixelSize;
	vertical_grids = width / pixelSize;

	drawTiles(pixelSize);

}
var pixelValue = document.getElementById("pixelValue");
pixelSizeSlider.value = pixelSize;
pixelValue.innerHTML = pixelSize;


pixelSizeSlider.oninput = function(e) {
	pixelValue.innerHTML = pixelSizeSlider.value;
	sizePixelSize(pixelSizeSlider.value);
};