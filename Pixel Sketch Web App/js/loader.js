loadAllColorPallette(colorNames, colors);
openColorPallette(colorNames[0]);
function assignMousePosition(x, y) {
    // Used to prevent passing second mouse positions from passing undefined values to bline function
			
    if (penX === null) {
        penX = bounding_grid_1d(width, horizontal_grids, x)[0];
		penY = bounding_grid_1d(height, vertical_grids, y)[0];
        return;   
    }
    
    
}   

function addValuesToArray(array, x, y, width, height, type, color,  historyNumber) {
    array.push({x: x, y: y, width: width, height: height, type: type, color: color, historyNumber: historyNumber});
}

function setValuesArray(array, position, x, y, width, height, type, color, historyNumber) {
    array[position] = ({
        x: x,
        y: y,
        width: width,
        height: height,
        type: type,
        color: color,
        historyNumber: historyNumber
    });
}
