/*

Reminders:
    function : bounding_grid_1d() is a function which snap the following mouse positions onto pixel positions
    it has 3 parameters: (lets take width for example)
    
    width - width of the canvas
    horizontal_grids - width divided by canvas size
    x - the mouse position

    function: posX.push();
    It is a function to push the positions into posX array which is all the canvas draw coordinates positions
    located. 
    Since it only store the coordinates it wouldn't be automatically draw it in the canvas.
    In order to draw it to canvas you must call the drawPath() function
*/

class Paint {
    pentype = "pen";
    Draw() {

    }
    Pen(x, y) {
        var xdraw = bounding_grid_1d(width, horizontal_grids, x)[0];
		var ydraw = bounding_grid_1d(height, vertical_grids, y)[0];
		ctx.fillStyle = user.getColor();
        
		ctx.fillRect(xdraw, ydraw, pixelSize, pixelSize);
		posX.push({x:xdraw, y:ydraw, width: pixelSize, height: pixelSize, type:"pen", color:user.getColor(), historyNumber: historyCount});
	
    } 
    Eraser(x, y) {
		var xdraw = bounding_grid_1d(width, horizontal_grids, x)[0];
		var ydraw = bounding_grid_1d(height, vertical_grids, y)[0];

		ctx.clearRect(xdraw, ydraw, pixelSize, pixelSize);
		posX.push({x:xdraw, y:ydraw, width: pixelSize, height: pixelSize, type:"eraser", color:user.getColor(), historyNumber: historyCount});
    }
    Move(firstPositions, x, y) {
        // First we need to temporary copy the PosX

        // Check what is the distance between the First mouse Position to current Mouse Position
        newPositionsX = (penX - x) * -1;
		newPositionsY = (penY - y) * -1;
		
        for (let i in posX) {
            if (posX[i].type != "move") {
                // set the posX based on the Copy PosX.x added by NewPositionsX
                posX[i].x = firstPositions[i].x + newPositionsX;
                posX[i].y = firstPositions[i].y + newPositionsY;
                
            }
        }

		drawPath();

    }
    Redo() {
        // This decides whether the user made changes to the canvas
        let addHistoryCount = false;
        
        // Prevent from Redoing of Moving Canvas
        positionMoved = [];
        for (let i in redoPos) {
            
            if (redoPos[i].type === "move" && redoPos[i].historyNumber == historyCount + 1)  {
                
                this.Move(posX, redoPos[i].x, redoPos[i].y);
                addHistoryCount = true;
                posX.push({x: redoPos[i].x, y: redoPos[i].y,  width: redoPos[i].width, height: redoPos[i].height, type: redoPos[i].type, color: redoPos[i].color, historyNumber: redoPos[i].historyNumber});
                break;
            }
            if (redoPos[i].historyNumber == historyCount + 1) {
                posX.push({x: redoPos[i].x, y: redoPos[i].y,  width: redoPos[i].width, height: redoPos[i].height, type: redoPos[i].type, color: redoPos[i].color, historyNumber: redoPos[i].historyNumber});
                addHistoryCount = true;
            }
        }
        /*
            This will run if the user made changes to the canvas.
            This is very important because there are instance wherein you can redo it, 
            even though the user hasn't made any changes to the canvas.

        */
        if (addHistoryCount) {
            historyCount++;
        }
        // Removing values based on history count number which giving the illusion of redo
        redoPos = redoPos.filter(function(item){ return item.historyNumber != historyCount });
        
        drawPath();
    }
    Undo() {

        // Prevent undoing even though the user hasn't made any changes to the canvas 
        if (historyCount == 0) {
            return;
        } else {
            
            // This is the undo if the user move the canvas
            
            
            // This is the undo for painting in the canvas
            // Removes the Elements that has the same values
            posX = multiDimensionalUnique(posX);
            // Pushing recent draws to the Redo Positions
            let breakLoop = false;
            for (let i = 0;i < posX.length;i++) {
                
                if (posX[i].type === "move" && posX[i].historyNumber == historyCount) {
                    
                    for (let j in posX) {
                        if (posX[j].type != "move") {
                            posX[j].x -= posX[i].x;
                            posX[j].y -= posX[i].y;
                            redoPos.push({x: posX[i].x, y: posX[i].y, width: posX[i].width, height: posX[i].height , type: posX[i].type, color: posX[i].color, historyNumber: posX[i].historyNumber});
                            
                        } 
                    }
                }
                
                if (posX[i].historyNumber == historyCount) {
                    redoPos.push({x: posX[i].x, y: posX[i].y, width: posX[i].width, height: posX[i].height , type: posX[i].type, color: posX[i].color, historyNumber: posX[i].historyNumber});
                    
                }
            }
           
            // Removing values based on history Count Number and drawing it, giving the illusion of undo
            posX = posX.filter(function(item){ return item.historyNumber != historyCount });
            historyCount--;
            
            drawPath();
        }
        
    }
} 