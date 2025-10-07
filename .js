var tileSize = 20;
var cols = 18;
var rows = 18;
var moveDelay = 6;
var state = "start";
var score = 0;
var highScore = 0;
var moveCounter = 0;
var snake = [];
var direction = {x: 0, y: 0};
var directionQueue = [];
var food = {x: 0, y: 0};
var colors = {
  boardLight: rgb(44, 48, 64),
  boardDark: rgb(34, 37, 52),
  panel: rgb(16, 21, 36),
  accent: rgb(0, 214, 163),
  accentDim: rgb(0, 180, 138),
  danger: rgb(255, 78, 113),
  text: rgb(224, 232, 255),
  shadow: rgb(12, 14, 24),
  glass: rgba(8, 10, 18, 0.72)
};
resetGame();

function resetGame() {
  snake = [];
  var startX = Math.floor(cols / 2);
  var startY = Math.floor(rows / 2);
  for (var i = 0; i < 4; i++) {
    snake.push({x: startX - i, y: startY});
  }
  direction = {x: 1, y: 0};
  directionQueue = [];
  score = 0;
  moveCounter = 0;
  spawnFood();
}

function spawnFood() {
  var valid = false;
  while (!valid) {
    var fx = Math.floor(Math.random() * cols);
    var fy = Math.floor(Math.random() * rows);
    valid = true;
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        valid = false;
        break;
      }
    }
  }
  food = {x: fx, y: fy};
}

function queueDirection(nx, ny) {
  var last = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;
  if (last.x + nx !== 0 || last.y + ny !== 0) {
    directionQueue.push({x: nx, y: ny});
  }
}

function updateDirection() {
  if (directionQueue.length > 0) {
    direction = directionQueue[0];
    directionQueue.shift();
  }
}

function moveSnake() {
  updateDirection();
  var head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    endGame();
    return;
  }
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame();
      return;
    }
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    if (score > highScore) {
      highScore = score;
    }
    spawnFood();
  } else {
    snake.pop();
  }
}

function endGame() {
  state = "gameover";
}

function handleInput() {
  if (keyWentDown("left") || keyWentDown("a")) {
    queueDirection(-1, 0);
  }
  if (keyWentDown("right") || keyWentDown("d")) {
    queueDirection(1, 0);
  }
  if (keyWentDown("up") || keyWentDown("w")) {
    queueDirection(0, -1);
  }
  if (keyWentDown("down") || keyWentDown("s")) {
    queueDirection(0, 1);
  }
  if (state === "start" && (keyWentDown("space") || keyWentDown("enter"))) {
    state = "play";
  }
  if (state === "gameover" && (keyWentDown("space") || keyWentDown("enter"))) {
    resetGame();
    state = "play";
  }
}

function drawBoard() {
  noStroke();
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      if ((x + y) % 2 === 0) {
        fill(colors.boardLight);
      } else {
        fill(colors.boardDark);
      }
      rect(40 + x * tileSize, 40 + y * tileSize, tileSize, tileSize);
    }
  }
}

function drawSnake() {
  for (var i = 0; i < snake.length; i++) {
    var ratio = snake.length > 1 ? i / (snake.length - 1) : 0;
    var g = Math.floor(214 - ratio * 90);
    fill(rgb(0, g, 150 + Math.floor((1 - ratio) * 105)));
    stroke(rgba(255, 255, 255, 0.2));
    strokeWeight(2);
    rect(40 + snake[i].x * tileSize + 1, 40 + snake[i].y * tileSize + 1, tileSize - 2, tileSize - 2);
  }
  noStroke();
}

function drawFood() {
  fill(colors.danger);
  rect(40 + food.x * tileSize + 3, 40 + food.y * tileSize + 3, tileSize - 6, tileSize - 6);
  fill(rgba(255, 255, 255, 0.4));
  ellipse(40 + food.x * tileSize + tileSize / 2, 40 + food.y * tileSize + 6, tileSize / 2, tileSize / 3);
}

function drawPanel() {
  fill(colors.shadow);
  rect(0, 0, 400, 400);
  fill(colors.panel);
  rect(20, 20, 360, 360);
  fill(colors.shadow);
  rect(28, 28, 344, 344);
  fill(colors.panel);
  rect(32, 32, 336, 336);
  fill(colors.text);
  textAlign("left", "top");
  textSize(18);
  text("SCORE", 40, 350);
  textSize(30);
  text(score, 40, 372);
  textAlign("right", "top");
  textSize(18);
  text("BEST", 360, 350);
  textSize(30);
  text(highScore, 360, 372);
}

function drawStart() {
  fill(colors.glass);
  rect(60, 120, 280, 160);
  fill(colors.text);
  textAlign("center", "center");
  textSize(44);
  text("SNAKE", 200, 160);
  textSize(18);
  text("Use arrow keys or WASD", 200, 210);
  text("Press SPACE to begin", 200, 242);
}

function drawGameOver() {
  fill(rgba(0, 0, 0, 0.6));
  rect(20, 20, 360, 360);
  fill(colors.glass);
  rect(70, 160, 260, 140);
  fill(colors.text);
  textAlign("center", "center");
  textSize(36);
  text("Game Over", 200, 195);
  textSize(20);
  text("Final Score: " + score, 200, 235);
  text("Press SPACE to restart", 200, 270);
}

function draw() {
  handleInput();
  background(colors.shadow);
  drawPanel();
  drawBoard();
  if (state === "start") {
    drawSnake();
    drawFood();
    drawStart();
    return;
  }
  if (state === "play") {
    moveCounter++;
    if (moveCounter >= moveDelay) {
      moveSnake();
      moveCounter = 0;
    }
  }
  drawSnake();
  drawFood();
  if (state === "gameover") {
    drawGameOver();
  }
}
