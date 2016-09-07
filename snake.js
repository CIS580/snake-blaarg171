/* © 2016 Lowell Scott
 * Snake game, KSU CIS 580
 * 
*/

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

var Snake = new Object();
var Apple = new Object();
var Obstacles = new Array();

var mTickRate = 125;
var mTickTimer = 100; // start at a portion of the tickrate but not fully.

var mScore = 0;
var mGameOver = true;
var mInitialized = false;

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  mTickTimer += elapsedTime;

  if (mTickTimer >= mTickRate) {
    mTickTimer = 0;
    update(elapsedTime);
    render(elapsedTime);

    if (mGameOver) return;

    // Flip the back buffer
    frontCtx.drawImage(backBuffer, 0, 0);
  }

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
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

  // Snake related activities
  moveSnake();

  // Handle Apples and Walls
  handleApple(elapsedTime);
  handleObstacles();
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.fillStyle = "white";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

  for (var x = 1; x < mSizeX - 1; x++) {
    for (var y = 1; y < mSizeY - 1; y++) {
      switch (mTiles[x][y]) {
        case "wall":
          backCtx.fillStyle = "black";
          backCtx.fillRect((y - 1) * mTileSize, (x - 1) * mTileSize, mTileSize, mTileSize);
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
          backCtx.beginPath();
          backCtx.arc(((y - 1) * mTileSize) + (mTileSize / 2), ((x - 1) * mTileSize) + (mTileSize / 2), mTileSize / 2, 0, 2 * Math.PI);
          backCtx.fill();
          break;
      }
    }
  }

  // set score
  document.getElementById("scoreCurrent").innerHTML = mScore;
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
      frontCtx.fillText("GAME OVER", backBuffer.width / 2, backBuffer.height / 2);
      mGameOver = true;
      if (mScore > document.getElementById("scoreHigh").innerHTML) document.getElementById("scoreHigh").innerHTML = mScore;
      break;

    case "apple":
      Snake.tail.push([-1, -1]);
      Apple.spawned = false;
      mScore += Apple.value;

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

function handleApple(elapsedTime) {
  Apple.timer += elapsedTime;
  if (Apple.spawned) {
    if (Apple.value > 5) Apple.value--;
    return;
  }

  if (Apple.timer >= Apple.rate) {
    Apple.timer = 0;
    Apple.rate = rollRandom(50, 500);
    Apple.value = Math.min(25 + Math.max(Snake.tail.length - 7, 0) * 5, 100);

    var lNewTile = randomTile();
    Apple.x = lNewTile.x;
    Apple.y = lNewTile.y;

    Apple.spawned = true;

    mTiles[Apple.x][Apple.y] = "apple";
  }
}

function handleObstacles() {
  if (Snake.tail.length - 12 >= Obstacles.length) {
    var lNewObstacle = randomTile();
    Obstacles.push(lNewObstacle);
    mTiles[lNewObstacle.x][lNewObstacle.y] = "wall";
  }
}

function initializeGame() {
  frontCtx.fillStyle = "white";
  frontCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);
  frontCtx.fillStyle = "black";
  frontCtx.font = "bold 40px Verdana";
  frontCtx.textAlign = "center";
  frontCtx.textBaseline = "middle";
  frontCtx.fillText("Press Space to start!", backBuffer.width / 2, backBuffer.height / 2);

  // reset tiles
  for (var x = 0; x < mSizeX; x++) {
    mTiles[x] = new Array(mSizeY);
    for (var y = 0; y < mSizeY; y++) {
      mTiles[x][y] = (x == 0 || x == mSizeX - 1 || y == 0 || y == mSizeY - 1) ? "wall" : "open";
    }
  }

  Snake.direction = "down";
  Snake.x = 8;
  Snake.y = 25;
  Snake.tail = [[7, 25], [6, 25]];

  Apple.rate = 50;
  Apple.timer = 50;
  Apple.lastSpawn = oldTime;
  Apple.spawned = false;
  Apple.x = 16;
  Apple.y = 3;
  Apple.value = 5;

  mInitialized = true;
  mGameOver = !mInitialized;
}

/* Launch the game */
function startGame() {
  mInitialized = false;
  window.requestAnimationFrame(loop);
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

    //Space
    case 32:
      event.preventDefault();
      if (mInitialized) startGame();
      break;
  }
}

function rollRandom(aMinimum, aMaximum) {
  return Math.floor(Math.random() * (aMaximum - aMinimum) + aMinimum);
}

function randomTile() {
  var lTile = { x: -1, y: -1 }
  do {
    lTile.x = rollRandom(1, mSizeX - 1);
    lTile.y = rollRandom(1, mSizeY - 1);
  } while (mTiles[lTile.x][lTile.y] != "open")
  return lTile;
}

initializeGame();