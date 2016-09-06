/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var mTickRate = 100;
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

var Apple = {
  spawned: true,
  x: 16,
  y: 3
}

var mScore = 0;
var mGameOver = false;

/**
 * @function loop
 * The main game loop.
 */
function loop() {
  update();
  render();

  if (mGameOver) return;

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  setTimeout(loop, mTickRate);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update() {

  // different game speeds for difficulty?
  // increasing tickrate?

  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically
  // TODO: Move the snake
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

  // Move Snake
  moveSnake();

  if (Apple.spawned) mTiles[Apple.x][Apple.y] = "apple";
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render() {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.fillStyle = "white";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

  for (var x = 0; x < mSizeX; x++) {
    for (var y = 0; y < mSizeY; y++) {
      switch (mTiles[x][y]) {
        case "wall":
          break;

        /*case "open":
          backCtx.fillStyle = "white";
          backCtx.fillRect((y - 1) * mTileSize, (x - 1) * mTileSize, mTileSize, mTileSize);
          break;*/

        case "head":
          backCtx.fillStyle = "green";
          backCtx.fillRect((y - 1) * mTileSize, (x - 1) * mTileSize, mTileSize, mTileSize);
          break;

        case "body":
          backCtx.fillStyle = "green";
          backCtx.fillRect(((y - 1) * mTileSize) + 3, ((x - 1) * mTileSize) + 3, mTileSize - 6, mTileSize - 6);
          break;

        case "apple":
          backCtx.fillStyle = "red";
          backCtx.fillRect(((y - 1) * mTileSize) + 3, ((x - 1) * mTileSize) + 3, mTileSize - 6, mTileSize - 6);
          break;
      }
    }
  }

  // set score
  document.getElementById("score").innerHTML = mScore;
}

function moveSnake() {
  var lNextTile = new Object();
  switch (Snake.direction) {
    case "up":
      lNextTile.x = Snake.x - 1;
      lNextTile.y = Snake.y;
      break;

    case "left":
      lNextTile.x = Snake.x;
      lNextTile.y = Snake.y - 1;
      break;

    case "right":
      lNextTile.x = Snake.x;
      lNextTile.y = Snake.y + 1;
      break;

    case "down":
      lNextTile.x = Snake.x + 1;
      lNextTile.y = Snake.y;
      break;
  }

  lNextTile.type = mTiles[lNextTile.x][lNextTile.y];

  switch (lNextTile.type) {
    case "wall":
    case "head":
    case "body":
      // Should this be in render()?
      frontCtx.fillStyle = "purple"; // Something clear and obvious besides red since apples are red...
      frontCtx.font = "bold 60px Verdana";
      frontCtx.textAlign = "center";
      frontCtx.textBaseline = "middle";
      frontCtx.fillText("GAME OVER", backBuffer.width / 2, backBuffer.height / 2);
      mGameOver = true;
      break;

    case "apple":
      Snake.tail.push([-1, -1]);
      Apple.spawned = false;
      mScore += 5;

    case "open":
      // reset tail tile
      var lLastX = Snake.tail[Snake.tail.length - 1][0];
      var lLastY = Snake.tail[Snake.tail.length - 1][1];
      if (lLastX == -1) lLastX = Snake.tail[Snake.tail.length - 2][0];
      if (lLastX == -1) lLastY = Snake.tail[Snake.tail.length - 2][1];
      mTiles[lLastX][lLastY] = "open";

      // shift body positions and set tile 
      for (var i = Snake.tail.length - 1; i > 0; i--) {
        Snake.tail[i][0] = Snake.tail[i - 1][0];
        Snake.tail[i][1] = Snake.tail[i - 1][1];
        mTiles[Snake.tail[i][0]][Snake.tail[i][1]] = "body";
      }

      // set old head to start of tail
      Snake.tail[0][0] = Snake.x;
      Snake.tail[0][1] = Snake.y;
      mTiles[Snake.x][Snake.y] = "body";

      // set new head
      Snake.x = lNextTile.x;
      Snake.y = lNextTile.y;
      mTiles[Snake.x][Snake.y] = "head";
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
//window.requestAnimationFrame(loop);

loop();