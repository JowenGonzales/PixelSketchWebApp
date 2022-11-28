

function bounding_grid_1d(length, grids, x) {
  var divisions = [];
  var grid_width = length / grids;
  
  for ( i = 0; i <= grids; i++ ) {
    if (x || x == 0) {
      if (i*grid_width > x) {
        divisions.push((i-1)*grid_width);
        divisions.push(i*grid_width);
        break;
      }
      else if (i*grid_width == x) {
        divisions.push(i*grid_width);
        break;
      }
    }
    else {
      divisions.push(i*grid_width);
    }
  }
  
  return divisions;
}
