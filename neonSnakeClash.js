// Neon Snake Clash - Code.org Game Lab Edition

// Grid configuration
var GRID_COLS = 22;
var GRID_ROWS = 22;
var CELL_SIZE = 14;
var BOARD_SIZE = CELL_SIZE * GRID_COLS;
var BOARD_X = Math.round((400 - BOARD_SIZE) / 2);
var BOARD_Y = 58;

// Timing
var BASE_STEP_FRAMES = 7;
var MIN_STEP_FRAMES = 3;
var stepFrames = BASE_STEP_FRAMES;
var lastStepFrame = 0;

// Game state
var STATE_START = "start";
var STATE_RUNNING = "running";
var STATE_GAMEOVER = "gameover";
var gameState = STATE_START;

// Player controls
var directionVectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

var directionsOrder = ["up", "right", "down", "left"];

var player = createSnake(true);
var rival = createSnake(false);
var food = { x: 0, y: 0 };

var playerHighScore = 0;
var respawnDelayFrames = 36;
var boardGlow = 0;

resetMatch();

function createSnake(isPlayer) {
  return {
    segments: [],
    dir: isPlayer ? "right" : "left",
    plannedDir: isPlayer ? "right" : "left",
    moveQueue: [],
    score: 0,
    alive: true,
    aiEnabled: !isPlayer,
    respawnTimer: 0,
    name: isPlayer ? "Player" : "Rival"
  };
}

function resetMatch() {
  player = createSnake(true);
  rival = createSnake(false);
  stepFrames = BASE_STEP_FRAMES;
  spawnSnake(player, 4, Math.floor(GRID_ROWS / 2));
  spawnSnake(rival, GRID_COLS - 5, Math.floor(GRID_ROWS / 2));
  spawnFood();
  gameState = STATE_START;
}

function spawnSnake(snake, headX, headY) {
  snake.segments = [];
  var length = 4;
  for (var i = 0; i < length; i++) {
    if (snake.dir === "right") {
      snake.segments.push({ x: headX - i, y: headY });
    } else if (snake.dir === "left") {
      snake.segments.push({ x: headX + i, y: headY });
    } else if (snake.dir === "up") {
      snake.segments.push({ x: headX, y: headY + i });
    } else {
      snake.segments.push({ x: headX, y: headY - i });
    }
  }
}

function spawnFood() {
  var attempts = 0;
  while (attempts < 200) {
    var fx = randomNumber(0, GRID_COLS - 1);
    var fy = randomNumber(0, GRID_ROWS - 1);
    if (!isCellOccupied(fx, fy, player.segments) && !isCellOccupied(fx, fy, rival.segments)) {
      food.x = fx;
      food.y = fy;
      return;
    }
    attempts++;
  }
}

function isCellOccupied(x, y, segments) {
  for (var i = 0; i < segments.length; i++) {
    if (segments[i].x === x && segments[i].y === y) {
      return true;
    }
  }
  return false;
}

function keyHandledForDirection(snake, dir) {
  if (snake.moveQueue.length >= 3) {
    snake.moveQueue.shift();
  }
  snake.moveQueue.push(dir);
}

function isOpposite(a, b) {
  return (a === "up" && b === "down") || (a === "down" && b === "up") || (a === "left" && b === "right") || (a === "right" && b === "left");
}

function updateDirectionFromQueue(snake) {
  while (snake.moveQueue.length > 0) {
    var nextDir = snake.moveQueue.shift();
    if (!isOpposite(nextDir, snake.dir)) {
      snake.plannedDir = nextDir;
      return;
    }
  }
  snake.plannedDir = snake.dir;
}

function draw() {
  background("rgb(9,11,23)");
  drawBackdrop();
  drawBoard();
  drawFood();
  drawSnakes();
  drawHUD();
  drawOverlays();
  handleInput();
  advanceGame();
  if (boardGlow > 0) {
    boardGlow--;
  }
}

function drawBackdrop() {
  noStroke();
  fill("rgb(11,17,34)");
  rect(0, 0, 400, 400);
  fill("rgb(23,28,49)");
  rect(20, 28, 360, 344);
}

function drawBoard() {
  var glowStrength = Math.min(20, boardGlow);
  if (glowStrength > 0) {
    var glowColor = "rgb(" + (8 + glowStrength * 4) + "," + (16 + glowStrength * 3) + "," + (32 + glowStrength * 2) + ")";
    fill(glowColor);
    rect(BOARD_X - 6, BOARD_Y - 6, BOARD_SIZE + 12, BOARD_SIZE + 12);
  }
  fill("rgb(6,8,18)");
  rect(BOARD_X, BOARD_Y, BOARD_SIZE, BOARD_SIZE);

  stroke("rgb(18,24,44)");
  strokeWeight(1);
  for (var x = 0; x <= GRID_COLS; x++) {
    line(BOARD_X + x * CELL_SIZE, BOARD_Y, BOARD_X + x * CELL_SIZE, BOARD_Y + BOARD_SIZE);
  }
  for (var y = 0; y <= GRID_ROWS; y++) {
    line(BOARD_X, BOARD_Y + y * CELL_SIZE, BOARD_X + BOARD_SIZE, BOARD_Y + y * CELL_SIZE);
  }
  noStroke();
}

function drawFood() {
  var px = BOARD_X + food.x * CELL_SIZE;
  var py = BOARD_Y + food.y * CELL_SIZE;
  noStroke();
  fill("rgb(255,78,113)");
  rect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  fill("rgb(255,170,189)");
  rect(px + 4, py + 4, CELL_SIZE - 8, CELL_SIZE - 8);
}

function drawSnakes() {
  drawSnake(player, "rgb(0,214,163)", "rgb(0,120,91)");
  if (rival.alive) {
    drawSnake(rival, "rgb(255,181,71)", "rgb(160,96,28)");
  } else if (rival.respawnTimer > 0) {
    setStrokeRGB(60, 70, 95);
    strokeWeight(2);
    noFill();
    rect(BOARD_X + 4, BOARD_Y + 4, BOARD_SIZE - 8, BOARD_SIZE - 8);
    noStroke();
  }
}

function drawSnake(snake, headColor, bodyColor) {
  for (var i = snake.segments.length - 1; i >= 0; i--) {
    var segment = snake.segments[i];
    var px = BOARD_X + segment.x * CELL_SIZE;
    var py = BOARD_Y + segment.y * CELL_SIZE;
    if (i === 0) {
      noStroke();
      fill(headColor);
      rect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      drawEyes(segment, snake.dir, headColor);
    } else {
      noStroke();
      fill(bodyColor);
      rect(px + 3, py + 3, CELL_SIZE - 6, CELL_SIZE - 6);
    }
  }
}

function drawEyes(segment, dir, headColor) {
  var centerX = BOARD_X + segment.x * CELL_SIZE + CELL_SIZE / 2;
  var centerY = BOARD_Y + segment.y * CELL_SIZE + CELL_SIZE / 2;
  var offsetX = 0;
  var offsetY = 0;
  if (dir === "up") {
    offsetY = -2;
  } else if (dir === "down") {
    offsetY = 2;
  } else if (dir === "left") {
    offsetX = -2;
  } else if (dir === "right") {
    offsetX = 2;
  }
  fill("rgb(5,9,15)");
  ellipse(centerX + offsetX - 3, centerY + offsetY, 4, 4);
  ellipse(centerX + offsetX + 3, centerY + offsetY, 4, 4);
  fill(headColor);
  ellipse(centerX + offsetX - 3, centerY + offsetY - 1, 2, 2);
  ellipse(centerX + offsetX + 3, centerY + offsetY - 1, 2, 2);
}

function drawHUD() {
  fill("rgb(15,20,38)");
  rect(20, 12, 360, 36);
  fill("rgb(0,214,163)");
  textAlign("left", "middle");
  textSize(16);
  text(player.name + " Score", 32, 30);
  textAlign("right", "middle");
  text(player.score, 200, 30);
  fill("rgb(120,134,170)");
  textAlign("left", "middle");
  text("High " + playerHighScore, 210, 30);
  textAlign("right", "middle");
  fill("rgb(255,181,71)");
  text(rival.name + " Score", 360, 30);
  textAlign("right", "middle");
  text(rival.score, 372, 30);

  fill("rgb(18,24,44)");
  rect(20, 360, 360, 32);
  fill("rgb(180,190,220)");
  textAlign("left", "middle");
  textSize(13);
  var status = player.aiEnabled ? "Autopilot ON (P to toggle)" : "Use arrow keys or WASD";
  text(status, 32, 376);
  textAlign("right", "middle");
  if (rival.alive) {
    text("Rival hunting...", 368, 376);
  } else if (rival.respawnTimer > 0) {
    var seconds = Math.ceil(rival.respawnTimer * stepFrames / 30);
    text("Rival respawn in " + seconds + "s", 368, 376);
  } else {
    text("Rival ready", 368, 376);
  }
}

function drawOverlays() {
  if (gameState === STATE_START) {
    drawOverlay("Neon Snake Clash", "Press Space to begin\nArrow keys to dodge\nP toggles autopilot");
  } else if (gameState === STATE_GAMEOVER) {
    var line = player.score > playerHighScore ? "New high score!" : "Score: " + player.score;
    drawOverlay("Game Over", line + "\nPress Space to play again");
  }
}

function drawOverlay(title, subtitle) {
  fill("rgb(6,8,18)");
  rect(BOARD_X + 20, BOARD_Y + 60, BOARD_SIZE - 40, 160);
  fill("rgb(0,214,163)");
  textSize(24);
  textAlign("center", "middle");
  text(title, BOARD_X + BOARD_SIZE / 2, BOARD_Y + 112);
  fill("rgb(190,202,235)");
  textSize(14);
  text(subtitle, BOARD_X + BOARD_SIZE / 2, BOARD_Y + 176);
}

function handleInput() {
  if (keyWentDown("p")) {
    player.aiEnabled = !player.aiEnabled;
    player.moveQueue = [];
  }
  if (gameState === STATE_START || gameState === STATE_GAMEOVER) {
    if (keyWentDown("space")) {
      startRound();
    }
    return;
  }
  if (!player.aiEnabled) {
    if (keyWentDown("up") || keyWentDown("w")) {
      keyHandledForDirection(player, "up");
    }
    if (keyWentDown("down") || keyWentDown("s")) {
      keyHandledForDirection(player, "down");
    }
    if (keyWentDown("left") || keyWentDown("a")) {
      keyHandledForDirection(player, "left");
    }
    if (keyWentDown("right") || keyWentDown("d")) {
      keyHandledForDirection(player, "right");
    }
  }
}

function startRound() {
  player.score = 0;
  player.dir = "right";
  player.plannedDir = "right";
  player.moveQueue = [];
  player.alive = true;
  rival.score = 0;
  rival.dir = "left";
  rival.plannedDir = "left";
  rival.moveQueue = [];
  rival.aiEnabled = true;
  rival.alive = true;
  rival.respawnTimer = 0;
  spawnSnake(player, 4, Math.floor(GRID_ROWS / 2));
  spawnSnake(rival, GRID_COLS - 5, Math.floor(GRID_ROWS / 2));
  spawnFood();
  stepFrames = BASE_STEP_FRAMES;
  lastStepFrame = World.frameCount;
  gameState = STATE_RUNNING;
}

function advanceGame() {
  if (gameState !== STATE_RUNNING) {
    return;
  }
  if (World.frameCount - lastStepFrame < stepFrames) {
    return;
  }
  lastStepFrame = World.frameCount;
  boardGlow = 12;

  updateDirectionFromQueue(player);
  if (player.aiEnabled) {
    planAIMove(player, rival);
  }
  updateDirectionFromQueue(rival);
  if (rival.aiEnabled && rival.alive) {
    planAIMove(rival, player);
  }

  var playerNext = nextHead(player);
  var rivalNext = rival.alive ? nextHead(rival) : null;

  var playerAte = headsEqual(playerNext, food);
  var rivalAte = rival.alive && headsEqual(rivalNext, food);

  var playerCollided = checkCollision(playerNext, player, rival, playerAte);
  var rivalCollided = rival.alive && checkCollision(rivalNext, rival, player, rivalAte);

  if (rival.alive && rivalNext && playerNext && rivalNext.x === playerNext.x && rivalNext.y === playerNext.y) {
    playerCollided = true;
    rivalCollided = true;
  }

  if (playerCollided) {
    endGame();
  } else {
    moveSnake(player, playerNext, playerAte);
    if (playerAte) {
      player.score++;
      adjustSpeed();
      spawnFood();
    }
  }

  if (rival.alive) {
    if (rivalCollided) {
      rival.alive = false;
      rival.segments = [];
      rival.respawnTimer = respawnDelayFrames;
    } else {
      moveSnake(rival, rivalNext, rivalAte);
      if (rivalAte) {
        rival.score++;
        spawnFood();
      }
    }
  } else {
    if (rival.respawnTimer > 0) {
      rival.respawnTimer--;
      if (rival.respawnTimer <= 0) {
        rival.alive = true;
        rival.dir = "left";
        rival.plannedDir = "left";
        rival.moveQueue = [];
        spawnSnake(rival, GRID_COLS - 5, Math.floor(GRID_ROWS / 2));
      }
    }
  }

}

function nextHead(snake) {
  var head = snake.segments[0];
  var dir = snake.plannedDir;
  snake.dir = dir;
  var vec = directionVectors[dir];
  return { x: head.x + vec.x, y: head.y + vec.y };
}

function checkCollision(nextHead, snake, opponent, willGrow) {
  if (!isInside(nextHead.x, nextHead.y)) {
    return true;
  }
  var limit = willGrow ? snake.segments.length : snake.segments.length - 1;
  for (var i = 0; i < limit; i++) {
    if (snake.segments[i].x === nextHead.x && snake.segments[i].y === nextHead.y) {
      return true;
    }
  }
  if (opponent.alive) {
    for (var j = 0; j < opponent.segments.length; j++) {
      if (opponent.segments[j].x === nextHead.x && opponent.segments[j].y === nextHead.y) {
        return true;
      }
    }
  }
  return false;
}

function moveSnake(snake, nextHead, grow) {
  snake.segments.unshift(nextHead);
  if (!grow) {
    snake.segments.pop();
  }
}

function adjustSpeed() {
  stepFrames = BASE_STEP_FRAMES - Math.floor(player.score / 5);
  if (stepFrames < MIN_STEP_FRAMES) {
    stepFrames = MIN_STEP_FRAMES;
  }
}

function headsEqual(pos, target) {
  return pos && pos.x === target.x && pos.y === target.y;
}

function endGame() {
  gameState = STATE_GAMEOVER;
  playerHighScore = Math.max(playerHighScore, player.score);
}

function isInside(x, y) {
  return x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS;
}

function planAIMove(controller, opponent) {
  var path = findPathToFood(controller, opponent);
  if (path.length > 0) {
    controller.plannedDir = path[0];
    controller.dir = path[0];
    return;
  }
  var bestDir = fallbackDirection(controller, opponent);
  if (bestDir) {
    controller.plannedDir = bestDir;
    controller.dir = bestDir;
  }
}

function findPathToFood(controller, opponent) {
  var head = controller.segments[0];
  var target = food;
  var queue = [];
  var queueStart = 0;
  queue.push({
    x: head.x,
    y: head.y,
    body: cloneBody(controller.segments),
    path: []
  });
  var visited = {};
  visited[stateKey(head.x, head.y, controller.segments)] = true;

  while (queueStart < queue.length) {
    var node = queue[queueStart];
    queueStart++;
    if (node.x === target.x && node.y === target.y) {
      return node.path;
    }
    for (var d = 0; d < directionsOrder.length; d++) {
      var dir = directionsOrder[d];
      var vec = directionVectors[dir];
      var nx = node.x + vec.x;
      var ny = node.y + vec.y;
      if (!isInside(nx, ny)) {
        continue;
      }
      var newBody = cloneBody(node.body);
      newBody.unshift({ x: nx, y: ny });
      var ate = nx === target.x && ny === target.y;
      if (!ate) {
        newBody.pop();
      }
      if (bodyCollision(newBody, opponent, ate ? opponent.segments.length : opponent.segments.length - 1)) {
        continue;
      }
      var key = stateKey(nx, ny, newBody);
      if (!visited[key]) {
        visited[key] = true;
        var newPath = node.path.slice(0);
        newPath.push(dir);
        queue.push({ x: nx, y: ny, body: newBody, path: newPath });
      }
    }
  }
  return [];
}

function stateKey(x, y, body) {
  var s = x + ":" + y + "|";
  for (var i = 0; i < body.length; i++) {
    s += body[i].x + "," + body[i].y + ";";
  }
  return s;
}

function cloneBody(body) {
  var clone = [];
  for (var i = 0; i < body.length; i++) {
    clone.push({ x: body[i].x, y: body[i].y });
  }
  return clone;
}

function bodyCollision(body, opponent, opponentLimit) {
  if (typeof opponentLimit === "undefined") {
    opponentLimit = opponent.segments.length - 1;
  }
  for (var i = 1; i < body.length; i++) {
    if (body[i].x === body[0].x && body[i].y === body[0].y) {
      return true;
    }
  }
  if (opponent.alive) {
    for (var j = 0; j <= opponentLimit && j < opponent.segments.length; j++) {
      if (opponent.segments[j].x === body[0].x && opponent.segments[j].y === body[0].y) {
        return true;
      }
    }
  }
  return false;
}

function fallbackDirection(controller, opponent) {
  var bestDir = null;
  var bestScore = -1;
  for (var d = 0; d < directionsOrder.length; d++) {
    var dir = directionsOrder[d];
    if (isOpposite(dir, controller.dir)) {
      continue;
    }
    var vec = directionVectors[dir];
    var nx = controller.segments[0].x + vec.x;
    var ny = controller.segments[0].y + vec.y;
    if (!isInside(nx, ny)) {
      continue;
    }
    if (wouldHit(controller, opponent, nx, ny)) {
      continue;
    }
    var score = floodFillSpace(nx, ny, controller, opponent);
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }
  if (bestDir === null) {
    for (var k = 0; k < directionsOrder.length; k++) {
      var alt = directionsOrder[k];
      var vecAlt = directionVectors[alt];
      var ax = controller.segments[0].x + vecAlt.x;
      var ay = controller.segments[0].y + vecAlt.y;
      if (isInside(ax, ay) && !wouldHit(controller, opponent, ax, ay)) {
        bestDir = alt;
        break;
      }
    }
  }
  return bestDir || controller.dir;
}

function wouldHit(controller, opponent, nx, ny) {
  for (var i = 0; i < controller.segments.length - 1; i++) {
    if (controller.segments[i].x === nx && controller.segments[i].y === ny) {
      return true;
    }
  }
  if (opponent.alive) {
    for (var j = 0; j < opponent.segments.length - 1; j++) {
      if (opponent.segments[j].x === nx && opponent.segments[j].y === ny) {
        return true;
      }
    }
  }
  return false;
}

function floodFillSpace(nx, ny, controller, opponent) {
  var visited = {};
  var queue = [];
  queue.push({ x: nx, y: ny });
  visited[nx + "," + ny] = true;
  var count = 0;
  while (queue.length > 0 && count < 120) {
    var current = queue.shift();
    count++;
    for (var d = 0; d < directionsOrder.length; d++) {
      var dir = directionsOrder[d];
      var vec = directionVectors[dir];
      var cx = current.x + vec.x;
      var cy = current.y + vec.y;
      var key = cx + "," + cy;
      if (!isInside(cx, cy) || visited[key]) {
        continue;
      }
      if (isBlocked(cx, cy, controller, opponent)) {
        continue;
      }
      visited[key] = true;
      queue.push({ x: cx, y: cy });
    }
  }
  return count;
}

function isBlocked(x, y, controller, opponent) {
  for (var i = 0; i < controller.segments.length - 1; i++) {
    if (controller.segments[i].x === x && controller.segments[i].y === y) {
      return true;
    }
  }
  if (opponent.alive) {
    for (var j = 0; j < opponent.segments.length - 1; j++) {
      if (opponent.segments[j].x === x && opponent.segments[j].y === y) {
        return true;
      }
    }
  }
  return false;
}

function setStrokeRGB(r, g, b) {
  stroke("rgb(" + r + "," + g + "," + b + ")");
}
