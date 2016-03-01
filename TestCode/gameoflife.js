
var GameOfLife = function(params){
 
  var num_cells_y = params["init_cells"].length,
      num_cells_x = params["init_cells"][0].length,
      cell_width  = params["cell_width"]  || 10,
      cell_height = params["cell_height"] || 10,
      init_cells  = params["init_cells"]  || [],
      canvas_id   = params["canvas_id"]   || "life",

      colourful   = params["colourful"] || params["colorful"] || false,

      cell_array = [],
      display     = new GameDisplay(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, colourful),
      interval = null,    // Will store reference to setInterval method -- this should maybe be part of GameDisplay
      init        = function() {
        // Convert init_cells array of 0's and 1's to actual Cell objects
        var length_y = init_cells.length,
            length_x,
            y, x;
       
        for (y = 0; y < length_y; y++) {
          length_x = init_cells[y].length;
          
          for (x = 0; x < length_x; x++) {
            var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
            init_cells[y][x] = new Cell(x, y, state);
          }
        }
        cell_array = init_cells;
        display.update(cell_array);
      },
	  
      // Function to calculate the next generation of cells
      nextGenCells = function() {
        
        //  - For each cell:
        //      - Check all of its neighbours
        //      - Based on the rules, set the next gen cell to alive or dead
        
        var current_gen = cell_array,
            next_gen = [],      
            length_y = cell_array.length,
            length_x,
            y, x;
       
        for (y = 0; y < length_y; y++) {
          length_x = current_gen[y].length;
          next_gen[y] = []; 
          
          for (x = 0; x < length_x; x++) {
            
            var cell = current_gen[y][x];
            // Calculate above/below/left/right row/column values
            var row_above = (y-1 >= 0) ? y-1 : length_y-1; 
            var row_below = (y+1 <= length_y-1) ? y+1 : 0; 
            var column_left = (x-1 >= 0) ? x-1 : length_x - 1; 
            var column_right = (x+1 <= length_x-1) ? x+1 : 0; 

            var neighbours = {
              top_left: current_gen[row_above][column_left].clone(),
              top_center: current_gen[row_above][x].clone(),
              top_right: current_gen[row_above][column_right].clone(),
              left: current_gen[y][column_left].clone(),
              right: current_gen[y][column_right].clone(),
              bottom_left: current_gen[row_below][column_left].clone(),
              bottom_center: current_gen[row_below][x].clone(),
              bottom_right: current_gen[row_below][column_right].clone()
            };

            var alive_count = 0;
            var dead_count = 0;
            for (var neighbour in neighbours) {
              if (neighbours[neighbour].getState() == "dead") {
                dead_count++;
              } else {
                alive_count++;
              }
            }

            // Set new state to current state
            var new_state = cell.getState();
            if (cell.getState() == "alive") {
              if (alive_count < 2 || alive_count > 3) {
               
                new_state = "dead";
              } else if (alive_count === 2 || alive_count === 3) {
               
                new_state = "alive";
              }
            } else {
              if (alive_count === 3) {
               
                new_state = "alive";
              }
            }

            
            next_gen[y][x] = new Cell(x, y, new_state);
            
          }
        }

        return next_gen;
      }
  ;
  init();
  return {
    // Return the next generation array of cells
    step: function(){
      var next_gen = nextGenCells();
      // Set next gen as current cell array
      cell_array = next_gen;
      
      display.update(cell_array);
    },
    // Return the current generation array of cells
    getCurrentGenCells: function() {
      return cell_array;
    },
    
    setTheInterval: function(the_interval) {
      interval = the_interval;
    },
    getInterval: function() {
      return interval;
    }
  };
};

var GameDisplay = function(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, colourful) {
  var canvas = document.getElementById(canvas_id),
      ctx = canvas.getContext && canvas.getContext('2d'),
      width_pixels = num_cells_x * cell_width,
      height_pixels = num_cells_y * cell_height,
      drawGridLines = function() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.beginPath();
        // foreach column
        for (var i = 0; i <= num_cells_x; i++) {
          ctx.moveTo(i*cell_width, 0);
          ctx.lineTo(i*cell_width, height_pixels);
        }
        // foreach row
        for (var j = 0; j <= num_cells_y; j++) {
          ctx.moveTo(0, j*cell_height);
          ctx.lineTo(width_pixels, j*cell_height);
        }
        ctx.stroke();
      },
      updateCells = function(cell_array) {
        var length_y = cell_array.length,
            length_x,
            y, x;
        // each row
        for (y = 0; y < length_y; y++) {
          length_x = cell_array[y].length;
          // each column in rows
          for (x = 0; x < length_x; x++) {
            // Draw Cell on Canvas
            drawCell(cell_array[y][x]);
          }
        }
      },
      drawCell = function(cell) {
        
        var start_x = cell.getXPos() * cell_width,
            start_y = cell.getYPos() * cell_height;
       
        if (cell.getState() == "alive") {
          
          if (colourful === true) {
            var r=Math.floor(Math.random()*256),
                g=Math.floor(Math.random()*256),
                b=Math.floor(Math.random()*256),
                a=(Math.floor(Math.random()*6)+5)/10; 
            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
          }
          ctx.fillRect(start_x, start_y, cell_width, cell_height);
        } else {
          ctx.clearRect(start_x, start_y, cell_width, cell_height);
        }
      },
      init = function() {
       
        
        canvas.width = width_pixels;
        canvas.height = height_pixels;

      
      };
  init();
  return {
    update: function(cell_array) {
      updateCells(cell_array);
    }
  };


};

var Cell = function(x_pos, y_pos, state) {
  
  return {
    x_pos: x_pos,
    y_pos: y_pos,
    state: state,
    getXPos: function() {
      return x_pos;
    },
    getYPos: function() {
      return y_pos;
    },
    getState: function() {
      return state;
    },
    setState: function(new_state) {
      state = new_state;
    },
    clone: function() {
      return new Cell(x_pos, y_pos, state);
    }
  };
};

