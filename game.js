const config = {
  tileSize: 20,
  cols: 18,
  rows: 18,
  moveDelay: 6,
  rivalRespawnDelay: 45,
  boardOffset: 20
};

const palette = {
  boardLight: [44, 48, 64],
  boardDark: [34, 37, 52],
  accent: [0, 214, 163],
  accentDim: [0, 180, 138],
  rival: [255, 181, 71],
  rivalDim: [255, 139, 54],
  glass: [30, 36, 54],
  danger: [255, 78, 113],
  text: [224, 232, 255],
  shadow: [12, 14, 24],
  glow: [64, 255, 217],
  rivalGlow: [255, 208, 120],
  eye: [20, 24, 32]
};

function rgb(color) {
  return `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`;
}

function blendColor(a, b, t) {
  return [
    a[0] * (1 - t) + b[0] * t,
    a[1] * (1 - t) + b[1] * t,
    a[2] * (1 - t) + b[2] * t
  ];
}

class Snake {
  constructor() {
    this.body = [];
    this.direction = { x: 0, y: 0 };
    this.queue = [];
    this.score = 0;
    this.alive = false;
  }
}

class InputManager {
  constructor() {
    this.keysDown = new Set();
    this.keysPressed = new Set();
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));
  }

  onKeyDown(event) {
    const allowed = new Set([
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Space',
      'Enter',
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyP'
    ]);
    if (allowed.has(event.code)) {
      event.preventDefault();
    }
    if (!this.keysDown.has(event.code)) {
      this.keysPressed.add(event.code);
    }
    this.keysDown.add(event.code);
  }

  onKeyUp(event) {
    this.keysDown.delete(event.code);
  }

  consumeKey(codes) {
    for (const code of codes) {
      if (this.keysPressed.has(code)) {
        this.keysPressed.delete(code);
        return true;
      }
    }
    return false;
  }

  clearPressed() {
    this.keysPressed.clear();
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = new InputManager();
    this.state = 'start';
    this.player = new Snake();
    this.rival = new Snake();
    this.food = { x: -1, y: -1 };
    this.aiEnabled = true;
    this.moveCounter = 0;
    this.highScore = 0;
    this.rivalRespawnTimer = 0;
    this.elements = this.bindElements();
    this.registerEvents();
    this.resetGame();
    this.loop();
  }

  bindElements() {
    return {
      playerScore: document.getElementById('playerScore'),
      playerStatus: document.getElementById('playerStatus'),
      rivalScore: document.getElementById('rivalScore'),
      rivalStatus: document.getElementById('rivalStatus'),
      highScore: document.getElementById('highScore'),
      respawnCountdown: document.getElementById('respawnCountdown'),
      aiBadge: document.getElementById('aiBadge'),
      aiToggle: document.getElementById('aiToggle'),
      controlHint: document.getElementById('controlHint'),
      overlay: document.getElementById('overlay'),
      overlayTitle: document.getElementById('overlayTitle'),
      overlaySubtitle: document.getElementById('overlaySubtitle'),
      overlayPrompt: document.getElementById('overlayPrompt'),
      resetLink: document.getElementById('resetLink')
    };
  }

  registerEvents() {
    this.elements.aiToggle.addEventListener('click', () => {
      this.toggleAI();
    });
    this.elements.resetLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.resetToStart();
    });
    this.elements.overlay.addEventListener('click', () => {
      if (this.state === 'start') {
        this.state = 'play';
        this.elements.overlay.classList.add('hidden');
      } else if (this.state === 'gameover') {
        this.resetGame();
        this.state = 'play';
        this.elements.overlay.classList.add('hidden');
      }
    });
  }

  resetToStart() {
    this.resetGame();
    this.state = 'start';
    this.elements.overlay.classList.remove('hidden');
    this.updateOverlay();
  }

  resetGame() {
    this.player = new Snake();
    this.rival = new Snake();
    this.food = { x: -1, y: -1 };
    this.moveCounter = 0;
    this.rivalRespawnTimer = 0;
    this.setupPlayer();
    this.setupRival(true);
    this.spawnFood();
    this.updateHUD();
    this.updateOverlay();
  }

  setupPlayer() {
    const startX = Math.floor(config.cols / 2) - 2;
    const startY = Math.floor(config.rows / 2);
    this.placeSnake(this.player, startX, startY, { x: 1, y: 0 }, 4);
    this.player.alive = true;
  }

  setupRival(initial) {
    const startX = Math.floor((config.cols * 3) / 4);
    const startY = Math.floor(config.rows / 2);
    if (!this.placeSnake(this.rival, startX, startY, { x: -1, y: 0 }, 4)) {
      this.findRivalSpawn();
    }
    this.rival.alive = this.rival.body.length > 0;
    this.rival.queue = [];
    if (this.rival.body.length > 1) {
      this.rival.direction = {
        x: this.rival.body[0].x - this.rival.body[1].x,
        y: this.rival.body[0].y - this.rival.body[1].y
      };
    } else {
      this.rival.direction = { x: -1, y: 0 };
    }
    if (!initial) {
      this.rival.score = 0;
    }
  }

  findRivalSpawn() {
    this.rival.body = [];
    const dir = { x: -1, y: 0 };
    const length = 4;
    const candidates = [];
    for (let y = 2; y < config.rows - 2; y++) {
      candidates.push({ x: config.cols - 4, y });
    }
    for (let y = config.rows - 3; y >= 2; y--) {
      candidates.push({ x: config.cols - 6, y });
    }
    for (const candidate of candidates) {
      if (this.canPlaceSnake(candidate.x, candidate.y, dir, length, this.rival)) {
        this.applyPlacement(this.rival, candidate.x, candidate.y, dir, length);
        return;
      }
    }
  }

  placeSnake(entity, startX, startY, dir, length) {
    if (this.canPlaceSnake(startX, startY, dir, length, entity)) {
      this.applyPlacement(entity, startX, startY, dir, length);
      return true;
    }
    for (let y = 2; y < config.rows - 2; y++) {
      for (let x = 2; x < config.cols - 2; x++) {
        if (this.canPlaceSnake(x, y, dir, length, entity)) {
          this.applyPlacement(entity, x, y, dir, length);
          return true;
        }
      }
    }
    entity.body = [];
    return false;
  }

  canPlaceSnake(startX, startY, dir, length, entity) {
    for (let i = 0; i < length; i++) {
      const cx = startX - dir.x * i;
      const cy = startY - dir.y * i;
      if (cx < 0 || cx >= config.cols || cy < 0 || cy >= config.rows) {
        return false;
      }
      if (entity !== this.player && this.player.alive && this.isBodyAt(this.player.body, cx, cy)) {
        return false;
      }
      if (entity !== this.rival && this.rival.alive && this.isBodyAt(this.rival.body, cx, cy)) {
        return false;
      }
      if (cx === this.food.x && cy === this.food.y) {
        return false;
      }
    }
    return true;
  }

  applyPlacement(entity, startX, startY, dir, length) {
    entity.body = [];
    for (let i = 0; i < length; i++) {
      entity.body.push({ x: startX - dir.x * i, y: startY - dir.y * i });
    }
    entity.direction = { x: dir.x, y: dir.y };
    entity.queue = [];
    entity.alive = true;
  }

  spawnFood() {
    let valid = false;
    let fx = 0;
    let fy = 0;
    while (!valid) {
      fx = Math.floor(Math.random() * config.cols);
      fy = Math.floor(Math.random() * config.rows);
      valid = true;
      if (this.player.alive && this.isBodyAt(this.player.body, fx, fy)) {
        valid = false;
      }
      if (valid && this.rival.alive && this.isBodyAt(this.rival.body, fx, fy)) {
        valid = false;
      }
    }
    this.food = { x: fx, y: fy };
  }

  isBodyAt(body, x, y) {
    return body.some((segment) => segment.x === x && segment.y === y);
  }

  queueDirection(entity, nx, ny) {
    const last = entity.queue.length > 0 ? entity.queue[entity.queue.length - 1] : entity.direction;
    if (last.x + nx !== 0 || last.y + ny !== 0) {
      entity.queue.push({ x: nx, y: ny });
    }
  }

  updateDirection(entity) {
    if (entity.queue.length > 0) {
      const next = entity.queue.shift();
      entity.direction = { x: next.x, y: next.y };
    }
  }

  moveSnakeEntity(entity, opponent) {
    if (!entity.alive) {
      return;
    }
    if (entity.direction.x === 0 && entity.direction.y === 0) {
      return;
    }
    const head = {
      x: entity.body[0].x + entity.direction.x,
      y: entity.body[0].y + entity.direction.y
    };
    if (head.x < 0 || head.x >= config.cols || head.y < 0 || head.y >= config.rows) {
      this.killSnake(entity);
      return;
    }
    for (let i = 0; i < entity.body.length; i++) {
      if (entity.body[i].x === head.x && entity.body[i].y === head.y) {
        const tail = entity.body[entity.body.length - 1];
        if (!(head.x === tail.x && head.y === tail.y)) {
          this.killSnake(entity);
          return;
        }
      }
    }
    if (opponent.alive) {
      for (const segment of opponent.body) {
        if (segment.x === head.x && segment.y === head.y) {
          this.killSnake(entity);
          return;
        }
      }
    }
    entity.body.unshift(head);
    const ateFood = head.x === this.food.x && head.y === this.food.y;
    if (ateFood) {
      entity.score += 10;
      if (entity === this.player && entity.score > this.highScore) {
        this.highScore = entity.score;
      }
      this.spawnFood();
    } else {
      entity.body.pop();
    }
  }

  killSnake(entity) {
    entity.alive = false;
    entity.body = [];
    entity.queue = [];
    if (entity === this.player) {
      if (this.player.score > this.highScore) {
        this.highScore = this.player.score;
      }
      this.state = 'gameover';
      this.updateOverlay();
      this.elements.overlay.classList.remove('hidden');
    } else {
      this.rivalRespawnTimer = config.rivalRespawnDelay;
      this.rival.score = 0;
    }
  }

  handleInput() {
    if (this.input.consumeKey(['KeyP'])) {
      this.toggleAI();
    }
    if (this.state === 'start' && this.input.consumeKey(['Space', 'Enter'])) {
      this.state = 'play';
      this.elements.overlay.classList.add('hidden');
    } else if (this.state === 'gameover' && this.input.consumeKey(['Space', 'Enter'])) {
      this.resetGame();
      this.state = 'play';
      this.elements.overlay.classList.add('hidden');
    }
    if (!this.aiEnabled && this.player.alive && this.state === 'play') {
      if (this.input.consumeKey(['ArrowLeft', 'KeyA'])) {
        this.queueDirection(this.player, -1, 0);
      }
      if (this.input.consumeKey(['ArrowRight', 'KeyD'])) {
        this.queueDirection(this.player, 1, 0);
      }
      if (this.input.consumeKey(['ArrowUp', 'KeyW'])) {
        this.queueDirection(this.player, 0, -1);
      }
      if (this.input.consumeKey(['ArrowDown', 'KeyS'])) {
        this.queueDirection(this.player, 0, 1);
      }
    }
    this.input.clearPressed();
  }

  toggleAI() {
    this.aiEnabled = !this.aiEnabled;
    this.player.queue = [];
    this.updateHUD();
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    this.handleInput();
    this.update();
    this.render();
  }

  update() {
    if (this.state === 'play') {
      this.updateAI();
      this.moveCounter++;
      if (this.moveCounter >= config.moveDelay) {
        this.moveCounter = 0;
        this.updateDirection(this.player);
        this.moveSnakeEntity(this.player, this.rival);
        if (this.state !== 'gameover') {
          this.updateDirection(this.rival);
          this.moveSnakeEntity(this.rival, this.player);
        }
      }
      if (!this.rival.alive) {
        this.rivalRespawnTimer--;
        if (this.rivalRespawnTimer <= 0) {
          this.setupRival(false);
          if (this.isBodyAt(this.rival.body, this.food.x, this.food.y) ||
              (this.player.alive && this.isBodyAt(this.player.body, this.food.x, this.food.y))) {
            this.spawnFood();
          }
        }
      }
    }
    this.updateHUD();
    this.updateOverlay();
  }

  updateHUD() {
    this.elements.playerScore.textContent = this.player.score;
    this.elements.rivalScore.textContent = this.rival.score;
    this.elements.highScore.textContent = this.highScore;
    this.elements.playerStatus.textContent = this.player.alive ? (this.aiEnabled ? 'AI Control' : 'Manual') : 'Eliminated';
    this.elements.rivalStatus.textContent = this.rival.alive ? 'Hunting' : 'Respawning';
    this.elements.aiBadge.textContent = this.aiEnabled ? 'Player AI: On' : 'Player AI: Off';
    this.elements.aiBadge.style.background = this.aiEnabled ? 'rgba(0, 214, 163, 0.16)' : 'rgba(255, 78, 113, 0.16)';
    this.elements.aiBadge.style.color = this.aiEnabled ? '#00d6a3' : '#ff4e71';
    this.elements.aiToggle.textContent = this.aiEnabled ? 'Switch to Manual' : 'Switch to AI Assist';
    this.elements.controlHint.textContent = this.aiEnabled ? 'Press P to take manual control.' : 'Press P to hand control back to the AI.';
    if (!this.rival.alive) {
      const seconds = Math.max(1, Math.ceil(this.rivalRespawnTimer / 30));
      this.elements.respawnCountdown.textContent = `Respawn in ${seconds}s`;
    } else {
      this.elements.respawnCountdown.textContent = '\u00a0';
    }
  }

  updateOverlay() {
    if (this.state === 'start') {
      this.elements.overlayTitle.textContent = 'Neon Snake Clash';
      this.elements.overlaySubtitle.textContent = 'Race the rival to the fruit.';
      this.elements.overlayPrompt.textContent = 'Press Space or click to begin';
    } else if (this.state === 'gameover') {
      this.elements.overlayTitle.textContent = 'Game Over';
      this.elements.overlaySubtitle.textContent = `You scored ${this.player.score}`;
      this.elements.overlayPrompt.textContent = 'Press Space or click to play again';
    } else {
      this.elements.overlayPrompt.textContent = '';
    }
  }

  updateAI() {
    if (this.aiEnabled) {
      this.applyAIMove(this.player, this.rival.alive ? this.rival.body : []);
    }
    if (this.rival.alive) {
      this.applyAIMove(this.rival, this.player.alive ? this.player.body : []);
    }
  }

  applyAIMove(entity, opponentBody) {
    if (!entity.alive) {
      return;
    }
    const plan = this.bestAIMove(entity.body, opponentBody);
    if (plan && plan.length > 0) {
      entity.queue = [];
      const next = plan[0];
      const head = entity.body[0];
      this.queueDirection(entity, next.x - head.x, next.y - head.y);
    }
  }

  bestAIMove(body, opponentBody) {
    if (!body || body.length === 0) {
      return null;
    }
    const head = { x: body[0].x, y: body[0].y };
    const toFood = this.bfsPath(head, this.food, body, true, opponentBody);
    if (toFood && toFood.length > 0) {
      const simulated = this.simulatePath(body, toFood, this.food);
      const tail = simulated[simulated.length - 1];
      if (
        this.bfsPath(simulated[0], tail, simulated, true, opponentBody) &&
        this.floodFillSpace(simulated, true, opponentBody) >= simulated.length
      ) {
        return toFood;
      }
    }
    const toTail = this.bfsPath(head, body[body.length - 1], body, true, opponentBody);
    if (toTail && toTail.length > 0) {
      return toTail;
    }
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    let best = null;
    for (const dir of dirs) {
      const attempt = this.evaluateImmediateMove(dir, body, opponentBody, this.food);
      if (attempt && (!best || attempt.score > best.score)) {
        best = attempt;
      }
    }
    if (best) {
      return best.path;
    }
    return null;
  }

  evaluateImmediateMove(move, body, opponentBody, targetFood) {
    const head = body[0];
    const target = { x: head.x + move.x, y: head.y + move.y };
    if (this.isBlocked(target.x, target.y, body, true, null, opponentBody)) {
      return null;
    }
    const clone = this.cloneBody(body);
    clone.unshift({ x: target.x, y: target.y });
    if (!(target.x === targetFood.x && target.y === targetFood.y)) {
      clone.pop();
    }
    const space = this.floodFillSpace(clone, true, opponentBody);
    const distance = Math.abs(target.x - targetFood.x) + Math.abs(target.y - targetFood.y);
    const tail = body[body.length - 1];
    const tailDist = Math.abs(target.x - tail.x) + Math.abs(target.y - tail.y);
    const score = space * 100 - distance * 3 + tailDist;
    return { path: [{ x: target.x, y: target.y }], score };
  }

  bfsPath(start, target, body, allowTail, opponentBody) {
    if (start.x === target.x && start.y === target.y) {
      return [];
    }
    const queue = [{ x: start.x, y: start.y }];
    const visited = new Array(config.cols * config.rows).fill(false);
    const prev = new Array(config.cols * config.rows).fill(-1);
    visited[this.cellIndex(start.x, start.y)] = true;
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    while (queue.length > 0) {
      const current = queue.shift();
      const currentIdx = this.cellIndex(current.x, current.y);
      for (const dir of dirs) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;
        const nidx = this.cellIndex(nx, ny);
        if (this.isBlocked(nx, ny, body, allowTail, target, opponentBody) || visited[nidx]) {
          continue;
        }
        visited[nidx] = true;
        prev[nidx] = currentIdx;
        if (nx === target.x && ny === target.y) {
          const path = [{ x: nx, y: ny }];
          let back = currentIdx;
          const startIdx = this.cellIndex(start.x, start.y);
          while (back !== startIdx) {
            const bx = back % config.cols;
            const by = Math.floor(back / config.cols);
            path.unshift({ x: bx, y: by });
            back = prev[back];
          }
          return path;
        }
        queue.push({ x: nx, y: ny });
      }
    }
    return null;
  }

  cloneBody(body) {
    return body.map((segment) => ({ x: segment.x, y: segment.y }));
  }

  simulatePath(body, path, targetFood) {
    const copy = this.cloneBody(body);
    let grown = false;
    for (const step of path) {
      copy.unshift({ x: step.x, y: step.y });
      if (!grown && step.x === targetFood.x && step.y === targetFood.y) {
        grown = true;
      } else {
        copy.pop();
      }
    }
    return copy;
  }

  floodFillSpace(body, allowTail, opponentBody) {
    if (!body || body.length === 0) {
      return 0;
    }
    const visited = new Array(config.cols * config.rows).fill(false);
    const blocked = new Array(config.cols * config.rows).fill(false);
    for (let i = 0; i < body.length; i++) {
      if (i === 0) {
        continue;
      }
      if (allowTail && i === body.length - 1) {
        continue;
      }
      blocked[this.cellIndex(body[i].x, body[i].y)] = true;
    }
    if (opponentBody) {
      for (const segment of opponentBody) {
        blocked[this.cellIndex(segment.x, segment.y)] = true;
      }
    }
    const queue = [{ x: body[0].x, y: body[0].y }];
    visited[this.cellIndex(body[0].x, body[0].y)] = true;
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    let count = 0;
    while (queue.length > 0) {
      const current = queue.shift();
      count++;
      for (const dir of dirs) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;
        if (nx < 0 || nx >= config.cols || ny < 0 || ny >= config.rows) {
          continue;
        }
        const idx = this.cellIndex(nx, ny);
        if (!visited[idx] && !blocked[idx]) {
          visited[idx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
    }
    return count;
  }

  cellIndex(x, y) {
    return y * config.cols + x;
  }

  isBlocked(x, y, body, allowTail, target, opponentBody) {
    if (x < 0 || x >= config.cols || y < 0 || y >= config.rows) {
      return true;
    }
    for (let i = 0; i < body.length; i++) {
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
      for (const segment of opponentBody) {
        if (segment.x === x && segment.y === y) {
          if (target && target.x === x && target.y === y) {
            return false;
          }
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = rgb(palette.shadow);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawSnakeBody(this.player, palette.accent, palette.accentDim, palette.glow);
    this.drawSnakeBody(this.rival, palette.rival, palette.rivalDim, palette.rivalGlow);
    this.drawFood();
  }

  drawBoard() {
    const ctx = this.ctx;
    for (let y = 0; y < config.rows; y++) {
      for (let x = 0; x < config.cols; x++) {
        const tileX = config.boardOffset + x * config.tileSize;
        const tileY = config.boardOffset + y * config.tileSize;
        ctx.fillStyle = rgb((x + y) % 2 === 0 ? palette.boardLight : palette.boardDark);
        ctx.fillRect(tileX, tileY, config.tileSize, config.tileSize);
      }
    }
  }

  drawSnakeBody(entity, baseColor, tailColor, glowColor) {
    if (!entity.alive) {
      return;
    }
    const ctx = this.ctx;
    for (let i = 0; i < entity.body.length; i++) {
      const segment = entity.body[i];
      const ratio = entity.body.length > 1 ? i / (entity.body.length - 1) : 0;
      const blend = blendColor(tailColor, baseColor, 1 - ratio);
      const highlight = blendColor(blend, glowColor, 0.2);
      const tileX = config.boardOffset + segment.x * config.tileSize;
      const tileY = config.boardOffset + segment.y * config.tileSize;
      ctx.fillStyle = rgb(highlight);
      ctx.fillRect(tileX, tileY, config.tileSize, config.tileSize);
      ctx.fillStyle = rgb(blend);
      ctx.fillRect(tileX + 2, tileY + 2, config.tileSize - 4, config.tileSize - 4);
      if (i === 0) {
        this.drawSnakeHead(tileX, tileY, entity.direction, blend, glowColor);
      }
    }
  }

  drawSnakeHead(tileX, tileY, direction, bodyColor, glowColor) {
    const ctx = this.ctx;
    const headSize = config.tileSize - 6;
    const offset = 3;
    ctx.fillStyle = rgb(bodyColor);
    ctx.fillRect(tileX + offset, tileY + offset, headSize, headSize);
    ctx.fillStyle = rgb(blendColor(bodyColor, glowColor, 0.5));
    const eyeOffsetX = direction.x !== 0 ? direction.x * 4 : 4;
    const eyeOffsetY = direction.y !== 0 ? direction.y * 4 : 4;
    this.drawEye(tileX + config.tileSize / 2 - eyeOffsetX, tileY + config.tileSize / 2 - eyeOffsetY);
    this.drawEye(tileX + config.tileSize / 2 + eyeOffsetX, tileY + config.tileSize / 2 + eyeOffsetY);
  }

  drawEye(cx, cy) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = rgb(palette.eye);
    ctx.arc(cx, cy, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFood() {
    const ctx = this.ctx;
    const tileX = config.boardOffset + this.food.x * config.tileSize;
    const tileY = config.boardOffset + this.food.y * config.tileSize;
    ctx.fillStyle = rgb(blendColor(palette.danger, palette.glass, 0.4));
    ctx.fillRect(tileX + 2, tileY + 2, config.tileSize - 4, config.tileSize - 4);
    ctx.fillStyle = rgb(palette.danger);
    ctx.fillRect(tileX + 4, tileY + 4, config.tileSize - 8, config.tileSize - 8);
    ctx.beginPath();
    ctx.fillStyle = rgb(palette.text);
    ctx.ellipse(
      tileX + config.tileSize / 2,
      tileY + config.tileSize / 2 - 2,
      config.tileSize / 4,
      config.tileSize / 4,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = rgb(blendColor(palette.text, palette.danger, 0.5));
    ctx.ellipse(
      tileX + config.tileSize / 2 - 2,
      tileY + config.tileSize / 2 - 4,
      config.tileSize / 8,
      config.tileSize / 10,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    new Game(canvas);
  }
});
