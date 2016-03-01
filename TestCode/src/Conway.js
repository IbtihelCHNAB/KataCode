function game_toggle(game, force) {
  var interval = game.getInterval();
  if (force == "stop" || interval !== null) {
    // Stop
    clearInterval(interval);
    game.setTheInterval(null);
  } else {
    // start
    interval = setInterval(game.step, 100);
    game.setTheInterval(interval);
  }
}

function add_listeners(game, example_num) {
  $("#" + example_num + " .toggle, #" + example_num + " canvas").click(function(){
    game_toggle(game);
  });
  $("#" + example_num + " .step").click(function(){
    game_toggle(game, "stop");
    game.step();
  });
}


var example1_cells = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,0,0,0,0,0,0],
 ];

var game1 = new GameOfLife({
  canvas_id:    "life-example1",
  cell_width:   10,
  cell_height:  10,
  init_cells:   example1_cells
});
add_listeners(game1, "example1");
