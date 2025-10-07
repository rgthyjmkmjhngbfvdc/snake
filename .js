var tileSize = 20;
var cols = 18;
var rows = 18;
var moveDelay = 6;
var state = "start";
var moveCounter = 0;
var aiEnabled = true;
var highScore = 0;
var food = {x: 0, y: 0};
var rivalRespawnTimer = 0;
var colors = {
  boardLight: rgb(44, 48, 64),
  boardDark: rgb(34, 37, 52),
  panel: rgb(16, 21, 36),
  accent: rgb(0, 214, 163),
  accentDim: rgb(0, 180, 138),
  rival: rgb(255, 181, 71),
  rivalDim: rgb(255, 139, 54),
  danger: rgb(255, 78, 113),
  text: rgb(224, 232, 255),
  shadow: rgb(12, 14, 24),
  glass: rgb(30, 36, 54)
};
var player = createSnakeEntity();
var rival = createSnakeEntity();
resetGame();

function createSnakeEntity() {
  return {
    body: [],
    direction: {x: 0, y: 0},
    queue: [],
    score: 0,
    alive: false
  };
}

function resetGame() {
  food = {x: -1, y: -1};
  setupPlayer();
  setupRival(true);
  player.score = 0;
  rival.score = 0;
  rivalRespawnTimer = 0;
  moveCounter = 0;
  spawnFood();
}

function setupPlayer() {
  var startX = Math.floor(cols / 2) - 2;
  var startY = Math.floor(rows / 2);
  placeSnake(player, startX, startY, {x: 1, y: 0}, 4);
  player.alive = true;
}

function setupRival(initial) {
  var startX = Math.floor(cols * 3 / 4);
  var startY = Math.floor(rows / 2);
  if (!placeSnake(rival, startX, startY, {x: -1, y: 0}, 4)) {
    findRivalSpawn();
  }
  rival.alive = rival.body.length > 0;
  rival.queue = [];
  rival.direction = rival.body.length > 1 ? {x: rival.body[0].x - rival.body[1].x, y: rival.body[0].y - rival.body[1].y} : {x: -1, y: 0};
  if (!initial) {
    rival.score = 0;
  }
}

function findRivalSpawn() {
  rival.body = [];
  var dir = {x: -1, y: 0};
  var length = 4;
  var candidates = [];
  for (var y = 2; y < rows - 2; y++) {
    candidates.push({x: cols - 4, y: y});
  }
  for (var y2 = rows - 3; y2 >= 2; y2--) {
    candidates.push({x: cols - 6, y: y2});
  }
  for (var c = 0; c < candidates.length; c++) {
    if (canPlaceSnake(candidates[c].x, candidates[c].y, dir, length, rival)) {
      applyPlacement(rival, candidates[c].x, candidates[c].y, dir, length);
      return;
    }
  }
}

function placeSnake(entity, startX, startY, dir, length) {
  if (canPlaceSnake(startX, startY, dir, length, entity)) {
    applyPlacement(entity, startX, startY, dir, length);
    return true;
  }
  for (var y = 2; y < rows - 2; y++) {
    for (var x = 2; x < cols - 2; x++) {
      if (canPlaceSnake(x, y, dir, length, entity)) {
        applyPlacement(entity, x, y, dir, length);
        return true;
      }
    }
  }
  entity.body = [];
  return false;
}

function canPlaceSnake(startX, startY, dir, length, entity) {
  for (var i = 0; i < length; i++) {
    var cx = startX - dir.x * i;
    var cy = startY - dir.y * i;
    if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) {
      return false;
    }
    if (entity !== player && player.alive && isBodyAt(player.body, cx, cy)) {
      return false;
    }
    if (entity !== rival && rival.alive && isBodyAt(rival.body, cx, cy)) {
      return false;
    }
    if (cx === food.x && cy === food.y) {
      return false;
    }
  }
  return true;
}

function applyPlacement(entity, startX, startY, dir, length) {
  entity.body = [];
  for (var i = 0; i < length; i++) {
    entity.body.push({x: startX - dir.x * i, y: startY - dir.y * i});
  }
  entity.direction = {x: dir.x, y: dir.y};
  entity.queue = [];
}

function spawnFood() {
  var valid = false;
  var fx = 0;
  var fy = 0;
  while (!valid) {
    fx = Math.floor(Math.random() * cols);
    fy = Math.floor(Math.random() * rows);
    valid = true;
    if (player.alive && isBodyAt(player.body, fx, fy)) {
      valid = false;
    }
    if (valid && rival.alive && isBodyAt(rival.body, fx, fy)) {
      valid = false;
    }
  }
  food = {x: fx, y: fy};
}

function isBodyAt(body, x, y) {
  for (var i = 0; i < body.length; i++) {
    if (body[i].x === x && body[i].y === y) {
      return true;
    }
  }
  return false;
}

function queueDirection(entity, nx, ny) {
  var last = entity.queue.length > 0 ? entity.queue[entity.queue.length - 1] : entity.direction;
  if (last.x + nx !== 0 || last.y + ny !== 0) {
    entity.queue.push({x: nx, y: ny});
  }
}

function updateDirection(entity) {
  if (entity.queue.length > 0) {
    entity.direction = {x: entity.queue[0].x, y: entity.queue[0].y};
    entity.queue.shift();
  }
}

function moveSnakeEntity(entity, opponent) {
  if (!entity.alive) {
    return;
  }
  if (entity.direction.x === 0 && entity.direction.y === 0) {
    return;
  }
  var head = {x: entity.body[0].x + entity.direction.x, y: entity.body[0].y + entity.direction.y};
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    killSnake(entity);
    return;
  }
  for (var i = 0; i < entity.body.length; i++) {
    if (entity.body[i].x === head.x && entity.body[i].y === head.y) {
      if (!(head.x === entity.body[entity.body.length - 1].x && head.y === entity.body[entity.body.length - 1].y)) {
        killSnake(entity);
        return;
      }
    }
  }
  if (opponent.alive) {
    for (var j = 0; j < opponent.body.length; j++) {
      if (opponent.body[j].x === head.x && opponent.body[j].y === head.y) {
        killSnake(entity);
        return;
      }
    }
  }
  entity.body.unshift(head);
  var ateFood = head.x === food.x && head.y === food.y;
  if (ateFood) {
    entity.score += 10;
    if (entity === player && entity.score > highScore) {
      highScore = entity.score;
    }
    spawnFood();
  } else {
    entity.body.pop();
  }
}

function killSnake(entity) {
  entity.alive = false;
  entity.body = [];
  entity.queue = [];
  if (entity === player) {
    if (player.score > highScore) {
      highScore = player.score;
    }
    state = "gameover";
  } else {
    rivalRespawnTimer = 45;
    rival.score = 0;
  }
}
function handleInput() {
  if (!aiEnabled && player.alive) {
    if (keyWentDown("left") || keyWentDown("a")) {
      queueDirection(player, -1, 0);
    }
    if (keyWentDown("right") || keyWentDown("d")) {
      queueDirection(player, 1, 0);
    }
    if (keyWentDown("up") || keyWentDown("w")) {
      queueDirection(player, 0, -1);
    }
    if (keyWentDown("down") || keyWentDown("s")) {
      queueDirection(player, 0, 1);
    }
  }
  if (keyWentDown("p")) {
    aiEnabled = !aiEnabled;
    player.queue = [];
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

function drawSnakeBody(entity, baseColor, tailColor) {
  if (!entity.alive) {
    return;
  }
  for (var i = 0; i < entity.body.length; i++) {
    var ratio = entity.body.length > 1 ? i / (entity.body.length - 1) : 0;
    var r = Math.floor(colorComponent(baseColor, 0) * (1 - ratio) + colorComponent(tailColor, 0) * ratio);
    var g = Math.floor(colorComponent(baseColor, 1) * (1 - ratio) + colorComponent(tailColor, 1) * ratio);
    var b = Math.floor(colorComponent(baseColor, 2) * (1 - ratio) + colorComponent(tailColor, 2) * ratio);
    fill(rgb(r, g, b));
    stroke(rgb(255, 255, 255));
    strokeWeight(2);
    rect(40 + entity.body[i].x * tileSize + 1, 40 + entity.body[i].y * tileSize + 1, tileSize - 2, tileSize - 2);
  }
  noStroke();
}

function colorComponent(col, index) {
  if (col === colors.accent) {
    if (index === 0) {
      return 0;
    }
    if (index === 1) {
      return 214;
    }
    return 163;
  }
  if (col === colors.accentDim) {
    if (index === 0) {
      return 0;
    }
    if (index === 1) {
      return 180;
    }
    return 138;
  }
  if (col === colors.rival) {
    if (index === 0) {
      return 255;
    }
    if (index === 1) {
      return 181;
    }
    return 71;
  }
  if (col === colors.rivalDim) {
    if (index === 0) {
      return 255;
    }
    if (index === 1) {
      return 139;
    }
    return 54;
  }
  if (col === colors.danger) {
    if (index === 0) {
      return 255;
    }
    if (index === 1) {
      return 78;
    }
    return 113;
  }
  if (col === colors.text) {
    return 224;
  }
  if (col === colors.shadow) {
    return 12;
  }
  if (col === colors.boardLight) {
    return index === 0 ? 44 : index === 1 ? 48 : 64;
  }
  if (col === colors.boardDark) {
    return index === 0 ? 34 : index === 1 ? 37 : 52;
  }
  if (col === colors.panel) {
    return index === 0 ? 16 : index === 1 ? 21 : 36;
  }
  if (col === colors.glass) {
    return index === 0 ? 30 : index === 1 ? 36 : 54;
  }
  return index === 0 ? 0 : 0;
}

function drawFood() {
  fill(colors.danger);
  rect(40 + food.x * tileSize + 3, 40 + food.y * tileSize + 3, tileSize - 6, tileSize - 6);
  fill(colors.text);
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
  textSize(16);
  text("PLAYER", 40, 340);
  textSize(28);
  text(player.score, 40, 362);
  textAlign("center", "top");
  textSize(16);
  fill(aiEnabled ? colors.accent : colors.danger);
  text(aiEnabled ? "PLAYER AI" : "PLAYER MANUAL", 200, 340);
  fill(colors.text);
  textSize(14);
  text(player.alive ? "IN GAME" : "ELIMINATED", 200, 362);
  textAlign("right", "top");
  textSize(16);
  text("RIVAL", 360, 340);
  textSize(28);
  text(rival.score, 360, 362);
  textAlign("center", "top");
  textSize(14);
  fill(colors.text);
  text("BEST " + highScore, 200, 384);
}

function drawStart() {
  fill(colors.glass);
  rect(60, 120, 280, 160);
  fill(colors.text);
  textAlign("center", "center");
  textSize(44);
  text("SNAKE", 200, 160);
  textSize(18);
  text("Race the rival for fruit", 200, 205);
  text("Press SPACE to begin", 200, 238);
}

function drawGameOver() {
  fill(colors.shadow);
  rect(20, 20, 360, 360);
  fill(colors.glass);
  rect(70, 160, 260, 140);
  fill(colors.text);
  textAlign("center", "center");
  textSize(36);
  text("Game Over", 200, 195);
  textSize(20);
  text("Score: " + player.score, 200, 235);
  text("Press SPACE to restart", 200, 270);
}
function cellIndex(x, y) {
  return y * cols + x;
}

function isBlocked(x, y, body, allowTail, target, opponentBody) {
  if (x < 0 || x >= cols || y < 0 || y >= rows) {
    return true;
  }
  for (var i = 0; i < body.length; i++) {
    if (body[i].x === x && body[i].y === y) {
      if (allowTail && i === body.length - 1) {
        return false;
      }
      if (target && target.x === x && target.y === y) {
        return false;
      }
      return true;
    }
  }
  if (opponentBody) {
    for (var j = 0; j < opponentBody.length; j++) {
      if (opponentBody[j].x === x && opponentBody[j].y === y) {
        if (target && target.x === x && target.y === y) {
          return false;
        }
        return true;
      }
    }
  }
  return false;
}

function bfsPath(start, target, body, allowTail, opponentBody) {
  if (start.x === target.x && start.y === target.y) {
    return [];
  }
  var queue = [];
  var visited = [];
  var prev = [];
  for (var i = 0; i < cols * rows; i++) {
    visited.push(false);
    prev.push(-1);
  }
  queue.push({x: start.x, y: start.y});
  visited[cellIndex(start.x, start.y)] = true;
  var dirs = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
  while (queue.length > 0) {
    var current = queue.shift();
    var currentIdx = cellIndex(current.x, current.y);
    for (var d = 0; d < dirs.length; d++) {
      var nx = current.x + dirs[d].x;
      var ny = current.y + dirs[d].y;
      var nidx = cellIndex(nx, ny);
      if (isBlocked(nx, ny, body, allowTail, target, opponentBody) || visited[nidx]) {
        continue;
      }
      visited[nidx] = true;
      prev[nidx] = currentIdx;
      if (nx === target.x && ny === target.y) {
        var path = [{x: nx, y: ny}];
        var back = currentIdx;
        while (back !== cellIndex(start.x, start.y)) {
          var bx = back % cols;
          var by = Math.floor(back / cols);
          path.unshift({x: bx, y: by});
          back = prev[back];
        }
        return path;
      }
      queue.push({x: nx, y: ny});
    }
  }
  return null;
}

function cloneBody(body) {
  var copy = [];
  for (var i = 0; i < body.length; i++) {
    copy.push({x: body[i].x, y: body[i].y});
  }
  return copy;
}

function simulatePath(body, path, targetFood) {
  var copy = cloneBody(body);
  var grown = false;
  for (var step = 0; step < path.length; step++) {
    var next = path[step];
    copy.unshift({x: next.x, y: next.y});
    if (!grown && next.x === targetFood.x && next.y === targetFood.y) {
      grown = true;
    } else {
      copy.pop();
    }
  }
  return copy;
}

function floodFillSpace(body, allowTail, opponentBody) {
  if (body.length === 0) {
    return 0;
  }
  var visited = [];
  var blocked = [];
  for (var i = 0; i < cols * rows; i++) {
    visited.push(false);
    blocked.push(false);
  }
  for (var j = 0; j < body.length; j++) {
    if (j === 0) {
      continue;
    }
    if (allowTail && j === body.length - 1) {
      continue;
    }
    blocked[cellIndex(body[j].x, body[j].y)] = true;
  }
  if (opponentBody) {
    for (var k = 0; k < opponentBody.length; k++) {
      blocked[cellIndex(opponentBody[k].x, opponentBody[k].y)] = true;
    }
  }
  var queue = [{x: body[0].x, y: body[0].y}];
  visited[cellIndex(body[0].x, body[0].y)] = true;
  var dirs = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
  var count = 0;
  while (queue.length > 0) {
    var current = queue.shift();
    count++;
    for (var d = 0; d < dirs.length; d++) {
      var nx = current.x + dirs[d].x;
      var ny = current.y + dirs[d].y;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
        continue;
      }
      var idx = cellIndex(nx, ny);
      if (!visited[idx] && !blocked[idx]) {
        visited[idx] = true;
        queue.push({x: nx, y: ny});
      }
    }
  }
  return count;
}

function evaluateImmediateMove(move, body, opponentBody, targetFood) {
  var head = body[0];
  var target = {x: head.x + move.x, y: head.y + move.y};
  if (isBlocked(target.x, target.y, body, true, null, opponentBody)) {
    return null;
  }
  var clone = cloneBody(body);
  clone.unshift({x: target.x, y: target.y});
  if (!(target.x === targetFood.x && target.y === targetFood.y)) {
    clone.pop();
  }
  var space = floodFillSpace(clone, true, opponentBody);
  var distance = Math.abs(target.x - targetFood.x) + Math.abs(target.y - targetFood.y);
  var tail = body[body.length - 1];
  var tailDist = Math.abs(target.x - tail.x) + Math.abs(target.y - tail.y);
  var score = space * 100 - distance * 3 + tailDist;
  return {path: [{x: target.x, y: target.y}], score: score};
}

function bestAIMove(body, opponentBody) {
  if (body.length === 0) {
    return null;
  }
  var head = {x: body[0].x, y: body[0].y};
  var toFood = bfsPath(head, food, body, true, opponentBody);
  if (toFood && toFood.length > 0) {
    var simulated = simulatePath(body, toFood, food);
    var tail = simulated[simulated.length - 1];
    if (bfsPath(simulated[0], tail, simulated, true, opponentBody) && floodFillSpace(simulated, true, opponentBody) >= simulated.length) {
      return toFood;
    }
  }
  var toTail = bfsPath(head, body[body.length - 1], body, true, opponentBody);
  if (toTail && toTail.length > 0) {
    return toTail;
  }
  var dirs = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
  var best = null;
  for (var i = 0; i < dirs.length; i++) {
    var attempt = evaluateImmediateMove(dirs[i], body, opponentBody, food);
    if (attempt && (!best || attempt.score > best.score)) {
      best = attempt;
    }
  }
  if (best) {
    return best.path;
  }
  return null;
}
function applyAIMove(entity, opponentBody) {
  if (!entity.alive) {
    return;
  }
  var plan = bestAIMove(entity.body, opponentBody);
  if (plan && plan.length > 0) {
    entity.queue = [];
    var next = plan[0];
    var head = entity.body[0];
    queueDirection(entity, next.x - head.x, next.y - head.y);
  }
}

function updateAI() {
  if (aiEnabled) {
    applyAIMove(player, rival.alive ? rival.body : []);
  }
  if (rival.alive) {
    applyAIMove(rival, player.alive ? player.body : []);
  }
}

function draw() {
  handleInput();
  background(colors.shadow);
  drawPanel();
  drawBoard();
  if (state === "start") {
    drawSnakeBody(player, colors.accent, colors.accentDim);
    drawSnakeBody(rival, colors.rival, colors.rivalDim);
    drawFood();
    drawStart();
    return;
  }
  if (state === "play") {
    updateAI();
    moveCounter++;
    if (moveCounter >= moveDelay) {
      moveCounter = 0;
      updateDirection(player);
      moveSnakeEntity(player, rival);
      if (state !== "gameover") {
        updateDirection(rival);
        moveSnakeEntity(rival, player);
      }
    }
    if (!rival.alive) {
      rivalRespawnTimer--;
      if (rivalRespawnTimer <= 0) {
        setupRival(false);
        if (rival.alive && (isBodyAt(rival.body, food.x, food.y) || (player.alive && isBodyAt(player.body, food.x, food.y)))) {
          spawnFood();
        }
      }
    }
  }
  drawSnakeBody(player, colors.accent, colors.accentDim);
  drawSnakeBody(rival, colors.rival, colors.rivalDim);
  drawFood();
  if (state === "gameover") {
    drawGameOver();
  }
}
