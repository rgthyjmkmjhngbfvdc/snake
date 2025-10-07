
var GRID = 20, MOVE_DELAY = 6, START_LEN = 3, PLAY_AREA = 400;
var CELLS = Math.round(PLAY_AREA / GRID);
var player = createSnake('lime', 'limegreen', 'Player');
var rival = createSnake('dodgerblue', 'lightskyblue', 'Rival');
var snakes = [player, rival];
var food = {sprite: null, x: 0, y: 0};
var frames = 0;
var gameOver = false;
var rivalRespawn = 0;
startMatch();
function createSnake(color, headColor, label){
  return {segments: [], dir: {x: 1, y: 0}, nextDir: {x: 1, y: 0}, color: color, headColor: headColor, score: 0, alive: true, label: label};
}
function startMatch(){
  frames = 0;
  gameOver = false;
  rivalRespawn = 0;
  player.score = 0;
  rival.score = 0;
  clearSnakeSegments(player);
  clearSnakeSegments(rival);
  resetSnake(player, 5, Math.floor(CELLS / 2), {x: 1, y: 0});
  resetSnake(rival, CELLS - 6, Math.floor(CELLS / 2), {x: -1, y: 0});
  if(food.sprite){
    food.sprite.remove();
    food.sprite = null;
  }
  placeFood();
}
function resetSnake(snake, headX, headY, dir){
  snake.dir = {x: dir.x, y: dir.y};
  snake.nextDir = {x: dir.x, y: dir.y};
  snake.alive = true;
  snake.segments = [];
  for(var i = START_LEN - 1; i >= 0; i--){
    var x = headX - dir.x * i;
    var y = headY - dir.y * i;
    addSegment(snake, x, y, i === 0);
  }
}
function addSegment(snake, x, y, head){
  var sprite = createSprite(x * GRID + GRID / 2, y * GRID + GRID / 2, GRID - 2, GRID - 2);
  sprite.shapeColor = head ? snake.headColor : snake.color;
  snake.segments.push({x: x, y: y, sprite: sprite});
}
function pushHead(snake, x, y){
  if(snake.segments.length > 0){
    var oldHead = snake.segments[snake.segments.length - 1];
    oldHead.sprite.shapeColor = snake.color;
  }
  var sprite = createSprite(x * GRID + GRID / 2, y * GRID + GRID / 2, GRID - 2, GRID - 2);
  sprite.shapeColor = snake.headColor;
  snake.segments.push({x: x, y: y, sprite: sprite});
}
function removeTail(snake){
  if(snake.segments.length === 0){
    return;
  }
  var tail = snake.segments.shift();
  tail.sprite.remove();
}
function clearSnakeSegments(snake){
  while(snake.segments.length > 0){
    var seg = snake.segments.pop();
    seg.sprite.remove();
  }
}
function placeFood(){
  var tries = 0;
  while(tries < 400){
    var x = randomNumber(0, CELLS - 1);
    var y = randomNumber(0, CELLS - 1);
    if(cellFree(x, y)){
      if(food.sprite){
        food.sprite.remove();
      }
      food.x = x;
      food.y = y;
      food.sprite = createSprite(x * GRID + GRID / 2, y * GRID + GRID / 2, GRID - 4, GRID - 4);
      food.sprite.shapeColor = 'red';
      return;
    }
    tries++;
  }
}
function cellFree(x, y){
  for(var s = 0; s < snakes.length; s++){
    var snake = snakes[s];
    for(var i = 0; i < snake.segments.length; i++){
      if(snake.segments[i].x === x && snake.segments[i].y === y){
        return false;
      }
    }
  }
  return true;
}
function handleInput(){
  if(!player.alive || gameOver){
    return;
  }
  if((keyWentDown('up') || keyWentDown('w')) && player.dir.y === 0){
    player.nextDir = {x: 0, y: -1};
  }
  if((keyWentDown('down') || keyWentDown('s')) && player.dir.y === 0){
    player.nextDir = {x: 0, y: 1};
  }
  if((keyWentDown('left') || keyWentDown('a')) && player.dir.x === 0){
    player.nextDir = {x: -1, y: 0};
  }
  if((keyWentDown('right') || keyWentDown('d')) && player.dir.x === 0){
    player.nextDir = {x: 1, y: 0};
  }
}
function updateRivalDirection(){
  if(!rival.alive || rival.segments.length === 0 || !food.sprite){
    return;
  }
  var head = rival.segments[rival.segments.length - 1];
  var target = findPath(head.x, head.y, food.x, food.y, rival);
  var best = null;
  if(target && !isOppositeDir(target, rival.dir)){
    best = target;
  }
  if(!best){
    best = chooseSafeDirection(rival);
  }
  if(best && !isOppositeDir(best, rival.dir)){
    rival.nextDir = {x: best.x, y: best.y};
  }
}
function findPath(startX, startY, endX, endY, snake){
  var parent = [];
  for(var y = 0; y < CELLS; y++){
    parent.push([]);
  }
  var queueX = [startX];
  var queueY = [startY];
  parent[startY][startX] = {px: startX, py: startY, dir: -1};
  var head = 0;
  var dirs = [{x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}];
  while(head < queueX.length){
    var cx = queueX[head];
    var cy = queueY[head];
    if(cx === endX && cy === endY){
      break;
    }
    for(var i = 0; i < dirs.length; i++){
      var nx = cx + dirs[i].x;
      var ny = cy + dirs[i].y;
      if(nx < 0 || ny < 0 || nx >= CELLS || ny >= CELLS){
        continue;
      }
      if(parent[ny][nx]){
        continue;
      }
      if(cellBlockedForPath(nx, ny, snake)){
        continue;
      }
      parent[ny][nx] = {px: cx, py: cy, dir: i};
      queueX.push(nx);
      queueY.push(ny);
    }
    head++;
  }
  if(!parent[endY][endX]){
    return null;
  }
  var tx = endX;
  var ty = endY;
  var dirIndex = -1;
  while(!(tx === startX && ty === startY)){
    var node = parent[ty][tx];
    dirIndex = node.dir;
    tx = node.px;
    ty = node.py;
  }
  return dirs[dirIndex];
}
function cellBlockedForPath(x, y, snake){
  for(var s = 0; s < snakes.length; s++){
    var other = snakes[s];
    for(var i = 0; i < other.segments.length; i++){
      if(other === snake){
        if(i === other.segments.length - 1){
          continue;
        }
        if(i === 0){
          continue;
        }
      }
      if(other.segments[i].x === x && other.segments[i].y === y){
        return true;
      }
    }
  }
  return false;
}
function chooseSafeDirection(snake){
  if(snake.segments.length === 0){
    return null;
  }
  var head = snake.segments[snake.segments.length - 1];
  var dirs = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];
  var best = null;
  var bestScore = -9999;
  for(var i = 0; i < dirs.length; i++){
    var dir = dirs[i];
    if(isOppositeDir(dir, snake.dir)){
      continue;
    }
    var nx = head.x + dir.x;
    var ny = head.y + dir.y;
    if(nx < 0 || ny < 0 || nx >= CELLS || ny >= CELLS){
      continue;
    }
    var grow = food.sprite && food.x === nx && food.y === ny;
    if(cellBlocked(nx, ny, snake, grow)){
      continue;
    }
    var space = floodCount(nx, ny, snake);
    var distance = Math.abs(food.x - nx) + Math.abs(food.y - ny);
    var score = space * 4 - distance;
    if(grow){
      score += 30;
    }
    if(score > bestScore){
      bestScore = score;
      best = dir;
    }
  }
  return best;
}
function floodCount(startX, startY, snake){
  var visited = [];
  for(var y = 0; y < CELLS; y++){
    visited.push([]);
  }
  var queueX = [startX];
  var queueY = [startY];
  visited[startY][startX] = true;
  var head = 0;
  var count = 0;
  var dirs = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
  while(head < queueX.length && count < CELLS * CELLS){
    var cx = queueX[head];
    var cy = queueY[head];
    count++;
    for(var i = 0; i < dirs.length; i++){
      var nx = cx + dirs[i].x;
      var ny = cy + dirs[i].y;
      if(nx < 0 || ny < 0 || nx >= CELLS || ny >= CELLS){
        continue;
      }
      if(visited[ny][nx]){
        continue;
      }
      if(cellBlockedForFlood(nx, ny, snake)){
        continue;
      }
      visited[ny][nx] = true;
      queueX.push(nx);
      queueY.push(ny);
    }
    head++;
  }
  return count;
}
function cellBlockedForFlood(x, y, snake){
  for(var s = 0; s < snakes.length; s++){
    var other = snakes[s];
    for(var i = 0; i < other.segments.length; i++){
      if(other === snake){
        if(i === other.segments.length - 1){
          continue;
        }
        if(i === 0){
          continue;
        }
      }
      if(other.segments[i].x === x && other.segments[i].y === y){
        return true;
      }
    }
  }
  return false;
}
function isOppositeDir(a, b){
  return a.x === -b.x && a.y === -b.y;
}
function stepSnakes(){
  var moves = [];
  for(var s = 0; s < snakes.length; s++){
    var snake = snakes[s];
    if(!snake.alive || snake.segments.length === 0){
      continue;
    }
    snake.dir = {x: snake.nextDir.x, y: snake.nextDir.y};
    var head = snake.segments[snake.segments.length - 1];
    var nx = head.x + snake.dir.x;
    var ny = head.y + snake.dir.y;
    var grow = food.sprite && food.x === nx && food.y === ny;
    var blocked = cellBlocked(nx, ny, snake, grow);
    moves.push({snake: snake, x: nx, y: ny, grow: grow, blocked: blocked});
  }
  for(var i = 0; i < moves.length; i++){
    if(moves[i].blocked){
      killSnake(moves[i].snake);
    }
  }
  var cells = {};
  for(var j = 0; j < moves.length; j++){
    var move = moves[j];
    if(!move.snake.alive || move.blocked){
      continue;
    }
    var key = move.x + ',' + move.y;
    if(!cells[key]){
      cells[key] = [];
    }
    cells[key].push(move.snake);
  }
  for(var key in cells){
    if(cells[key].length > 1){
      for(var n = 0; n < cells[key].length; n++){
        killSnake(cells[key][n]);
      }
    }
  }
  var playerMove = null;
  var rivalMove = null;
  for(var k = 0; k < moves.length; k++){
    if(moves[k].snake === player){
      playerMove = moves[k];
    }
    if(moves[k].snake === rival){
      rivalMove = moves[k];
    }
  }
  if(player.alive && rival.alive && playerMove && rivalMove){
    var playerHead = player.segments[player.segments.length - 1];
    var rivalHead = rival.segments[rival.segments.length - 1];
    if(playerMove.x === rivalHead.x && playerMove.y === rivalHead.y && rivalMove.x === playerHead.x && rivalMove.y === playerHead.y){
      killSnake(player);
      killSnake(rival);
    }
  }
  var ate = false;
  for(var m = 0; m < moves.length; m++){
    var action = moves[m];
    if(!action.snake.alive || action.blocked){
      continue;
    }
    pushHead(action.snake, action.x, action.y);
    if(action.grow){
      action.snake.score++;
      ate = true;
    } else {
      removeTail(action.snake);
    }
  }
  if(ate){
    placeFood();
  }
}
function cellBlocked(x, y, snake, grow){
  if(x < 0 || y < 0 || x >= CELLS || y >= CELLS){
    return true;
  }
  for(var s = 0; s < snakes.length; s++){
    var other = snakes[s];
    for(var i = 0; i < other.segments.length; i++){
      if(other === snake){
        if(i === other.segments.length - 1){
          continue;
        }
        if(!grow && i === 0){
          continue;
        }
      }
      if(other.segments[i].x === x && other.segments[i].y === y){
        return true;
      }
    }
  }
  return false;
}
function killSnake(snake){
  if(!snake.alive){
    return;
  }
  snake.alive = false;
  while(snake.segments.length > 0){
    var seg = snake.segments.pop();
    seg.sprite.remove();
  }
  if(snake === player){
    gameOver = true;
  }
  if(snake === rival){
    rivalRespawn = 60;
  }
}
function updateRespawn(){
  if(rival.alive){
    return;
  }
  if(rivalRespawn > 0){
    rivalRespawn--;
  }
  if(rivalRespawn === 0){
    var spawned = spawnRival();
    if(!spawned){
      rivalRespawn = 15;
    }
  }
}
function spawnRival(){
  var rows = [Math.floor(CELLS / 2), Math.floor(CELLS / 2) - 3, Math.floor(CELLS / 2) + 3, Math.floor(CELLS / 2) - 6, Math.floor(CELLS / 2) + 6];
  for(var r = 0; r < rows.length; r++){
    if(rows[r] < 2 || rows[r] >= CELLS - 2){
      continue;
    }
    if(canSpawnAt(rival, CELLS - 6, rows[r], {x: -1, y: 0})){
      resetSnake(rival, CELLS - 6, rows[r], {x: -1, y: 0});
      return true;
    }
  }
  for(var attempt = 0; attempt < 200; attempt++){
    var headX = randomNumber(START_LEN, CELLS - 1);
    var headY = randomNumber(1, CELLS - 2);
    if(canSpawnAt(rival, headX, headY, {x: -1, y: 0})){
      resetSnake(rival, headX, headY, {x: -1, y: 0});
      return true;
    }
  }
  return false;
}
function canSpawnAt(snake, headX, headY, dir){
  for(var i = START_LEN - 1; i >= 0; i--){
    var x = headX - dir.x * i;
    var y = headY - dir.y * i;
    if(x < 0 || y < 0 || x >= CELLS || y >= CELLS){
      return false;
    }
    for(var s = 0; s < snakes.length; s++){
      var other = snakes[s];
      if(other === snake){
        continue;
      }
      for(var j = 0; j < other.segments.length; j++){
        if(other.segments[j].x === x && other.segments[j].y === y){
          return false;
        }
      }
    }
  }
  return true;
}
function drawBoard(){
  stroke('rgb(24,28,40)');
  strokeWeight(2);
  noFill();
  rect(0, 0, PLAY_AREA, PLAY_AREA);
  stroke('rgb(18,22,32)');
  strokeWeight(1);
  for(var i = 1; i < CELLS; i++){
    line(i * GRID, 0, i * GRID, PLAY_AREA);
    line(0, i * GRID, PLAY_AREA, i * GRID);
  }
}
function drawHUD(){
  fill('rgb(10,12,20)');
  rect(8, 8, 160, 56);
  rect(PLAY_AREA - 168, 8, 160, 56);
  fill('rgb(220,232,255)');
  textSize(18);
  textAlign(LEFT, TOP);
  text(player.label, 16, 16);
  textAlign(RIGHT, TOP);
  text(player.score, 160, 16);
  textAlign(LEFT, TOP);
  text(rival.label, PLAY_AREA - 160, 16);
  textAlign(RIGHT, TOP);
  text(rival.score, PLAY_AREA - 16, 16);
  if(!rival.alive){
    textAlign(CENTER, TOP);
    textSize(14);
    var seconds = Math.ceil(rivalRespawn / 30);
    text('Rival respawn in ' + seconds, PLAY_AREA / 2, 24);
  }
}
function drawGameOver(){
  fill('rgb(0,0,0)');
  rect(80, 140, PLAY_AREA - 160, 120);
  fill('rgb(240,244,255)');
  textAlign(CENTER, CENTER);
  textSize(28);
  text('GAME OVER', PLAY_AREA / 2, 180);
  textSize(18);
  text('Press R to restart', PLAY_AREA / 2, 220);
}
function draw(){
  background('rgb(6,8,12)');
  drawBoard();
  if(gameOver){
    if(keyWentDown('r')){
      startMatch();
      return;
    }
    drawSprites();
    drawHUD();
    drawGameOver();
    return;
  }
  handleInput();
  updateRivalDirection();
  frames++;
  if(frames % MOVE_DELAY === 0){
    stepSnakes();
    frames = 0;
  }
  updateRespawn();
  drawSprites();
  drawHUD();
}
