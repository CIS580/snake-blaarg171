/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var mTileSize = 20;
var mSizeX = backBuffer.height / mTileSize + 2; // 20px + 'wall'
var mSizeY = backBuffer.width / mTileSize + 2; // 20px + 'wall'
var mTiles = new Array(mSizeX);
for (var x = 0; x < mSizeX; x++) {
  mTiles[x] = new Array(mSizeY);
  for (var y = 0; y < mSizeY; y++) {
    mTiles[x][y] = (x == 0 || x == mSizeX - 1 || y == 0 || y == mSizeY - 1) ? "wall" : "open";
  }
}

var Snake = {
  direction: "down",
  x: 8,
  y: 25,
  tail: [[7, 25], [6, 25]]
}

var mScore = 0;
var mGameOver = false;

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  if (mGameOver) return;

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
  // different game speeds for difficulty?

  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically
  // TODO: Move the snake
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

  // Move Snake
  moveSnake();

  // Sync Snake position
  mTiles[Snake.x][Snake.y] = "head";
  for (var i = 0; i < Snake.tail.length; i++) {
    mTiles[Snake.tail[i][0]][Snake.tail[i][1]] = "body";
  }
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

  for (var x = 0; x < mSizeX; x++) {
    for (var y = 0; y < mSizeY; y++) {
      switch (mTiles[x][y]) {
        case "wall":
          //console.log("wall");
          break;

        case "head":
          backCtx.fillStyle = "green";
          backCtx.fillRect((y - 1) * mTileSize, (x - 1) * mTileSize, mTileSize, mTileSize);
          //console.log("head");
          break;

        case "body":
          backCtx.fillStyle = "green";
          backCtx.fillRect(((y - 1) * mTileSize) + 3, (x - 1) * mTileSize, mTileSize - 6, mTileSize);
          //console.log("body");
          break;

        case "apple":
          backCtx.fillStyle = "red";
          backCtx.fillRect((y - 1) * mTileSize, (x - 1) * mTileSize, mTileSize - 6, mTileSize - 6);
          //console.log("apple");
          break;
      }
    }
  }

  // set score
  document.getElementById("score").innerHTML = mScore;
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
    case "wall":
    case "head":
    case "body":
      backCtx.fillStyle = "purple"; // Something clear and obvious besides red since apples are red...
      backCtx.font = "50px Verdana";
      backCtx.fillText("GAME OVER", backBuffer.width / 2, backBuffer.height / 2);
      mGameOver = true;
      break;

    case "apple":
      Snake.tail.push([]);

    case "open":
      for (var i = Snake.tail.length - 1; i > 0; i--) {
        Snake.tail[i][0] = Snake.tail[i - 1][0];
        Snake.tail[i][1] = Snake.tail[i - 1][1];
      }
      Snake.tail[0][0] = Snake.x;
      Snake.tail[0][1] = Snake.y;
      Snake.x = lNextTile[0];
      Snake.y = lNextTile[1];
      break;
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

/* Launch the game */
window.requestAnimationFrame(loop);
