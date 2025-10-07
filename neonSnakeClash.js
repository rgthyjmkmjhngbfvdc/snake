(function () {
  const NEON_SNAKE_STYLES = `:root {
  --bg: #0b0d17;
  --bg-alt: #12162a;
  --accent: #00d6a3;
  --accent-soft: #00a67d;
  --rival: #ffb547;
  --danger: #ff4e71;
  --text: #f5f7ff;
  --text-dim: #9ba5c3;
  --card: rgba(18, 22, 42, 0.9);
  --border: rgba(255, 255, 255, 0.08);
  --panel: rgba(16, 21, 36, 0.92);
  --panel-alt: rgba(30, 36, 54, 0.9);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: radial-gradient(circle at top right, rgba(0, 214, 163, 0.08), transparent 55%),
    radial-gradient(circle at bottom left, rgba(255, 181, 71, 0.08), transparent 50%),
    linear-gradient(135deg, var(--bg), var(--bg-alt));
  color: var(--text);
  min-height: 100vh;
  scroll-behavior: smooth;
}

a {
  color: inherit;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 48px;
  padding: 96px clamp(24px, 6vw, 120px) 64px;
  align-items: center;
}

.hero__eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin: 0 0 16px;
  color: var(--accent);
}

.hero__title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2.75rem, 5vw, 4.5rem);
  margin: 0 0 16px;
  text-shadow: 0 12px 32px rgba(0, 214, 163, 0.35);
}

.hero__subtitle {
  margin: 0 0 32px;
  line-height: 1.6;
  color: var(--text-dim);
  max-width: 520px;
}

.hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero__art {
  position: relative;
  justify-self: center;
}

.grid-preview {
  position: relative;
  width: min(320px, 80vw);
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  background: radial-gradient(circle at 20% 20%, rgba(0, 214, 163, 0.18), transparent 60%),
    linear-gradient(140deg, rgba(43, 48, 64, 0.92), rgba(24, 28, 40, 0.92));
  border: 1px solid var(--border);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.grid-preview__snake {
  position: absolute;
  width: 60%;
  height: 18%;
  border-radius: 12px;
  filter: drop-shadow(0 0 16px rgba(0, 214, 163, 0.55));
}

.grid-preview__snake--player {
  top: 24%;
  left: -8%;
  background: linear-gradient(90deg, rgba(0, 214, 163, 0.8), rgba(0, 214, 163, 0));
}

.grid-preview__snake--rival {
  bottom: 22%;
  right: -12%;
  background: linear-gradient(90deg, rgba(255, 181, 71, 0), rgba(255, 181, 71, 0.85));
  filter: drop-shadow(0 0 16px rgba(255, 181, 71, 0.55));
}

.grid-preview__food {
  position: absolute;
  top: 48%;
  left: 46%;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 78, 113, 0.85), rgba(255, 78, 113, 0.4));
  box-shadow: 0 0 24px rgba(255, 78, 113, 0.55);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  border: none;
  cursor: pointer;
}

.button--primary {
  color: #02140f;
  background: var(--accent);
  box-shadow: 0 18px 40px rgba(0, 214, 163, 0.35);
}

.button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 48px rgba(0, 214, 163, 0.45);
}

.button--ghost {
  color: var(--text);
  border: 1px solid var(--border);
  background: transparent;
}

.button--ghost:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 214, 163, 0.6);
}

.section {
  padding: 64px clamp(24px, 6vw, 120px);
}

.section__title {
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 48px;
}

.feature-grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.feature-card {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
}

.feature-card h3 {
  margin-top: 0;
  font-family: 'Orbitron', sans-serif;
}

.feature-card p {
  color: var(--text-dim);
  line-height: 1.65;
}

.highlights {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.highlight {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 40px;
  align-items: center;
}

.highlight__media {
  min-height: 220px;
  border-radius: 24px;
  background: linear-gradient(140deg, rgba(16, 21, 36, 0.9), rgba(30, 36, 54, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 24px 56px rgba(0, 0, 0, 0.45);
}

.highlight__media--score {
  background: linear-gradient(130deg, rgba(0, 214, 163, 0.22), rgba(255, 181, 71, 0.15));
}

.highlight__text h3 {
  font-family: 'Orbitron', sans-serif;
  margin-top: 0;
}

.highlight__text p {
  color: var(--text-dim);
  line-height: 1.7;
}

.game-section {
  padding: clamp(48px, 6vw, 96px) clamp(16px, 6vw, 64px) clamp(72px, 8vw, 120px);
}

.game-card {
  background: rgba(10, 12, 24, 0.92);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  backdrop-filter: blur(16px);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(20px, 3vw, 32px) clamp(24px, 4vw, 48px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 10, 20, 0.85);
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  text-decoration: none;
  color: var(--accent);
}

.header-actions {
  display: flex;
  gap: 18px;
  align-items: center;
}

.header-link {
  text-decoration: none;
  color: var(--text-dim);
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.header-link:hover {
  color: var(--accent);
}

.game-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(32px, 4vw, 48px);
  padding: clamp(32px, 4vw, 48px);
}

.hud {
  display: grid;
  gap: 24px;
}

.score-card {
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.score-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-card .label {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.score-card .status {
  font-size: 0.9rem;
  color: var(--accent);
}

.score-card--rival .status {
  color: var(--rival);
}

.score-card .score {
  font-size: clamp(2.2rem, 4vw, 3rem);
  margin: 0;
  font-family: 'Orbitron', sans-serif;
}

.score-card .hint {
  margin: 12px 0 0;
  color: var(--text-dim);
}

.control-card {
  background: var(--panel-alt);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.control-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0, 214, 163, 0.16);
  color: #00d6a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.control-card__hint {
  margin: 0 0 12px;
  color: var(--text-dim);
}

.control-card__list {
  margin: 0;
  padding-left: 18px;
  color: rgba(245, 247, 255, 0.72);
  line-height: 1.7;
}

.control-card__list span {
  color: var(--accent);
  font-weight: 600;
}

.board {
  position: relative;
}

.board__frame {
  position: relative;
  background: rgba(11, 14, 24, 0.92);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 28px 72px rgba(0, 0, 0, 0.55);
  padding: clamp(20px, 3vw, 32px);
}

canvas {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 16px;
  background: rgba(10, 12, 22, 0.85);
}

.overlay {
  position: absolute;
  inset: clamp(20px, 3vw, 32px);
  border-radius: 18px;
  background: rgba(11, 14, 24, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.overlay__inner {
  display: grid;
  gap: 12px;
}

.overlay h1 {
  margin: 0;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
}

.overlay p {
  margin: 0;
  color: rgba(245, 247, 255, 0.78);
  line-height: 1.6;
}

.overlay__prompt {
  font-size: 0.95rem;
  color: var(--accent);
}

.game-footer {
  padding: clamp(20px, 3vw, 32px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 10, 20, 0.85);
  color: rgba(245, 247, 255, 0.7);
  text-align: center;
  font-size: 0.95rem;
}

.footer {
  padding: 72px clamp(24px, 6vw, 120px);
  background: radial-gradient(circle at center, rgba(0, 214, 163, 0.1), rgba(11, 13, 23, 0.95));
}

.footer__inner {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  display: grid;
  gap: 24px;
}

.footer__title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 0;
}

.footer__note {
  margin: 0;
  color: rgba(245, 247, 255, 0.7);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero {
    padding-top: 72px;
  }

  .game-main {
    grid-template-columns: 1fr;
  }

  .header-actions {
    display: none;
  }
}

@media (max-width: 520px) {
  .game-card {
    border-radius: 20px;
  }

  .score-card,
  .control-card {
    border-radius: 20px;
    padding: 20px;
  }

  .board__frame {
    padding: 16px;
  }

  .overlay {
    inset: 16px;
  }
}
`;

  const NEON_SNAKE_MARKUP = `<header class="hero" id="top">
  <div class="hero__inner">
    <p class="hero__eyebrow">Arcade Showcase</p>
    <h1 class="hero__title">Neon Snake Clash</h1>
    <p class="hero__subtitle">
      A modern take on the classic Snake duel. Race against a cunning AI rival, watch glowing trails streak across the grid,
      and claim the high score crown.
    </p>
    <div class="hero__actions">
      <a class="button button--primary" href="#arena">Play the Game</a>
      <a class="button button--ghost" href="#features">Discover the Features</a>
    </div>
  </div>
  <div class="hero__art">
    <div class="grid-preview">
      <div class="grid-preview__snake grid-preview__snake--player"></div>
      <div class="grid-preview__snake grid-preview__snake--rival"></div>
      <div class="grid-preview__food"></div>
    </div>
  </div>
</header>

<main>
  <section id="features" class="section features">
    <h2 class="section__title">Built for Competitive Snake Fans</h2>
    <div class="feature-grid">
      <article class="feature-card">
        <h3>Arcade-Ready Controls</h3>
        <p>Switch between manual and assisted play instantly. Queue moves, dash through tight turns, and let the AI lend a hand when the rival gets too fierce.</p>
      </article>
      <article class="feature-card">
        <h3>Smart Rival AI</h3>
        <p>A dedicated rival snake plots safe paths using breadth-first search, simulating future states to avoid traps and keep the pressure on your run.</p>
      </article>
      <article class="feature-card">
        <h3>Dynamic Arena</h3>
        <p>Glow-infused tiles, layered fruit sprites, and animated heads bring the arena to life, whether you are practicing or streaming the ultimate duel.</p>
      </article>
    </div>
  </section>

  <section class="section highlights">
    <div class="highlight">
      <div class="highlight__media"></div>
      <div class="highlight__text">
        <h3>Battle-Tested Strategy</h3>
        <p>
          The rival studies every move, ensuring the board always feels alive. Advanced pathfinding keeps both snakes darting toward fruit, while a safety check prevents reckless dives into corners.
        </p>
      </div>
    </div>
    <div class="highlight highlight--reverse">
      <div class="highlight__media highlight__media--score"></div>
      <div class="highlight__text">
        <h3>Track Your Progress</h3>
        <p>
          Real-time scorecards, AI status indicators, and respawn timers provide clarity at a glance. Share your best runs and invite friends to take on the glowing gauntlet.
        </p>
      </div>
    </div>
  </section>

  <section id="arena" class="game-section">
    <div class="game-card">
      <header class="game-header">
        <a class="logo" href="#top">Neon Snake Clash</a>
        <nav class="header-actions">
          <a class="header-link" href="#top">Overview</a>
          <a class="header-link" href="#" id="resetLink">Restart</a>
        </nav>
      </header>

      <div class="game-main">
        <aside class="hud">
          <section class="score-card score-card--player">
            <header>
              <span class="label">Player</span>
              <span class="status" id="playerStatus">Active</span>
            </header>
            <p class="score" id="playerScore">0</p>
            <p class="hint">High Score: <span id="highScore">0</span></p>
          </section>
          <section class="score-card score-card--rival">
            <header>
              <span class="label">Rival AI</span>
              <span class="status" id="rivalStatus">Hunting</span>
            </header>
            <p class="score" id="rivalScore">0</p>
            <p class="hint" id="respawnCountdown">&nbsp;</p>
          </section>
          <section class="control-card">
            <div class="control-card__row">
              <span class="badge" id="aiBadge">Player AI: On</span>
              <button class="button" id="aiToggle" type="button">Switch to Manual</button>
            </div>
            <p class="control-card__hint" id="controlHint">Press P to take manual control.</p>
            <ul class="control-card__list">
              <li><span>Manual:</span> Arrow keys or WASD to steer</li>
              <li><span>Toggle AI:</span> Press P or use the button</li>
              <li><span>Restart:</span> Press Space after a crash</li>
            </ul>
          </section>
        </aside>

        <section class="board">
          <div class="board__frame">
            <canvas id="gameCanvas" width="400" height="400" aria-label="Snake game board" role="img"></canvas>
            <div class="overlay" id="overlay">
              <div class="overlay__inner">
                <h1 id="overlayTitle">Neon Snake Clash</h1>
                <p id="overlaySubtitle">Race the rival to the fruit.</p>
                <p class="overlay__prompt" id="overlayPrompt">Press Space or click to begin</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer class="game-footer">
        <p>Developed for Code.org compatibility &amp; the modern web. Built with love for classic arcades.</p>
      </footer>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="footer__inner">
    <p class="footer__title">Ready to challenge the grid?</p>
    <a class="button button--primary" href="#arena">Jump into Neon Snake Clash</a>
    <p class="footer__note">Crafted for Code.org and the open web. Built by fans of fast-paced arcade classics.</p>
  </div>
</footer>`;

  function ensureFonts(doc) {
    const fonts = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Inter:wght@400;500;600&display=swap'
      }
    ];
    for (const font of fonts) {
      const exists = Array.from(doc.head.children).some(
        (el) => el.tagName === 'LINK' && el.rel === font.rel && el.href === font.href
      );
      if (!exists) {
        const link = doc.createElement('link');
        link.rel = font.rel;
        link.href = font.href;
        if (font.crossorigin) {
          link.crossOrigin = font.crossorigin;
        }
        doc.head.appendChild(link);
      }
    }
  }

  function applyDocumentStructure(doc) {
    doc.documentElement.lang = 'en';
    doc.title = 'Neon Snake Clash';
    ensureFonts(doc);
    let styleTag = doc.getElementById('neon-snake-styles');
    if (!styleTag) {
      styleTag = doc.createElement('style');
      styleTag.id = 'neon-snake-styles';
      doc.head.appendChild(styleTag);
    }
    styleTag.textContent = NEON_SNAKE_STYLES;
    doc.body.innerHTML = NEON_SNAKE_MARKUP;
  }

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
            if (
              this.isBodyAt(this.rival.body, this.food.x, this.food.y) ||
              (this.player.alive && this.isBodyAt(this.player.body, this.food.x, this.food.y))
            ) {
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

  function boot() {
    applyDocumentStructure(document);
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
      new Game(canvas);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
