/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var mTileSize = 20;
var mTileX = backBuffer.height / mTileSize + 2; // 20px + 'wall'
var mTileY = backBuffer.width / mTileSize + 2; // 20px + 'wall'
var mTiles = new Array(mTileX);

var Tile = {
  x,
  y,
  type
}

var Snake = {
  x,
  y,
  tail,
  direction,
  speed
}

function start() {
  for (var x = 0; x < mTileX; x++) {
    mTiles[x] = new Array(mTileY);
  }

  Snake.direction = 'down';
  Snake.x = 8;
  Snake.y = 25;
  Snake.tail = [[7, 25], [6, 25]];
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;

  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // use elapsedTime * snake pos to ensure game is same speed on every machine.

  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically
  // TODO: Move the snake
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

  backCtx.fillRect(Snake.x * 20, Snake.y * 20, 20, 20);

}

function moveSnake() {
  var lNextTile;
  switch (Snake.direction) {
    case "up":
      lNextTile = mTiles[Snake.x - 1][Snake.y];
      break;

    case "left":
      lNextTile = [Snake.x][Snake.y - 1];
      break;

    case "right":
      lNextTile = [Snake.x][Snake.y + 1];
      break;

    case "down":
      lNextTile = [Snake.x + 1][Snake.y];
      break;
  }

  switch (lNextTile) {

  }
}

window.onkeydown = function (event) { // onkeypress?
  switch (event.keyCode) {

    //Up
    case 38:
    case 87:
      event.preventDefault();
      if (Snake.direction != "down") Snake.direction = "up";
      break;

    //Left
    case 37:
    case 65:
      event.preventDefault();
      if (Snake.direction != "right") Snake.direction = "left";
      break;

    //Right
    case 39:
    case 68:
      event.preventDefault();
      if (Snake.direction != "left") Snake.direction = "right";
      break;

    //Down
    case 40:
    case 83:
      event.preventDefault();
      if (Snake.direction != "up") Snake.direction = "down";
      break;
  }
}

start();
/* Launch the game */
window.requestAnimationFrame(loop);
