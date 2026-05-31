class PacManWidget extends ControllerInstance {
  settings = {
    defaultSize: '',
    sizeOptions: []
  };

  state = {
    playing: false,
    isPaused: false, // Traccia lo stato di pausa attiva
    score: 0,
    highScore: 0,
    lives: 3,
    map: [],
    dotsLeft: 0,
    pacman: null,
    ghosts: [],
    tileSize: 16,
    cols: 28,
    rows: 31,
    powerMode: false,
    powerTimeLeft: 0,
    ghostMultiplier: 200
  };

  // 1: Wall, 2: Pellet, 3: Power Pellet, 0: Empty
  classicTemplate = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 3, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 3, 1],
    [1, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  canvas = null;
  ctx = null;
  animationId = null;
  audioCtx = null;
  lastTime = 0;
  wakaToggle = false;

  onCreate() {
    const self = this;
    this.canvas = this.field('game_canvas').get();
    this.ctx = this.canvas.getContext('2d');

    this.declare({
      startGameOrResume: () => self.startGameOrResume()
    });

    this.setupKeyboard();
    this.resetMap();
    this.draw();
    this.gameLoop();
  }

  setupKeyboard() {
    this.keydown = (e) => {
      // 1. Previene lo scroll nativo della pagina tramite frecce/spazio solo se si sta giocando
      if (this.state.playing) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault();
        }
      }

      // Input di direzione
      if (['ArrowUp', 'w', 'W'].includes(e.key)) this.changeDirection('up');
      if (['ArrowDown', 's', 'S'].includes(e.key)) this.changeDirection('down');
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) this.changeDirection('left');
      if (['ArrowRight', 'd', 'D'].includes(e.key)) this.changeDirection('right');

      // 2. Gestione tasto ESC (Pausa)
      if (e.key === 'Escape' && this.state.playing) {
        e.preventDefault();
        this.pauseGame();
      }

      // Avvio o ripresa con ENTER
      if (e.key === 'Enter' && !this.state.playing) {
        e.preventDefault();
        this.startGameOrResume();
      }
    };
    window.addEventListener('keydown', this.keydown);
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  playSound(type) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'waka') {
      osc.type = 'triangle';
      this.wakaToggle = !this.wakaToggle;
      osc.frequency.setValueAtTime(this.wakaToggle ? 300 : 450, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'power') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'eat_ghost') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'death') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 1.0);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);

      const osc2 = this.audioCtx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(350, now);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 1.0);
      osc2.connect(gain);
      osc2.start(now);
      osc2.stop(now + 1.0);

      osc.start(now);
      osc.stop(now + 1.0);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.1);
      osc.frequency.setValueAtTime(659, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  }

  resetMap() {
    this.state.map = JSON.parse(JSON.stringify(this.classicTemplate));
    this.state.rows = this.state.map.length;
    this.state.cols = this.state.map[0].length;

    this.state.dotsLeft = 0;
    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
        if (this.state.map[r][c] === 2 || this.state.map[r][c] === 3) {
          this.state.dotsLeft++;
        }
      }
    }
  }

  // Metodo centralizzato di avvio/ripresa
  startGameOrResume() {
    if (this.state.isPaused) {
      this.resumeGame();
    } else {
      this.initGame();
    }
  }

  initGame() {
    this.initAudio();
    this.state.playing = true;
    this.state.isPaused = false;
    this.state.score = 0;
    this.state.lives = 3;
    this.state.powerMode = false;
    this.state.powerTimeLeft = 0;
    this.lastTime = performance.now();
    this.resetMap();

    // Blocca lo scroll della pagina web
    document.body.style.overflow = 'hidden';

    this.state.pacman = {
      x: 14 * this.state.tileSize,
      y: 16 * this.state.tileSize,
      dir: 'left',
      nextDir: 'left',
      speed: 2,
      mouthAngle: 0.2,
      mouthDir: 1
    };

    this.state.ghosts = [
      { x: 13 * this.state.tileSize, y: 10 * this.state.tileSize, dir: 'up', color: '#ff0000', speed: 1, scared: false },
      { x: 14 * this.state.tileSize, y: 10 * this.state.tileSize, dir: 'up', color: '#ffb8ff', speed: 1, scared: false },
      { x: 15 * this.state.tileSize, y: 10 * this.state.tileSize, dir: 'up', color: '#00ffff', speed: 1, scared: false }
    ];

    this.field('overlay_screen').hide();
    this.field('status_text').html('AVOID THE GHOSTS!').css({ color: '#ffff00' });
    this.field('score_val').html('0');
  }

  // Mette in pausa, mostra l'overlay e ripristina lo scroll
  pauseGame() {
    this.state.playing = false;
    this.state.isPaused = true;

    // Ripristina lo scroll nativo della pagina
    document.body.style.overflow = '';

    this.field('overlay_title').html('PAUSED').css({ color: '#ffff00' });
    this.field('overlay_sub').html('TAP OR PRESS ENTER TO RESUME');
    this.field('status_text').html('GAME PAUSED').css({ color: '#ffff00' });
    this.field('overlay_screen').show();
  }

  // Riprende la partita esattamente da dove era rimasta
  resumeGame() {
    this.initAudio();
    this.state.playing = true;
    this.state.isPaused = false;

    // Blocca nuovamente lo scroll
    document.body.style.overflow = 'hidden';

    this.field('overlay_screen').hide();
    this.field('status_text').html('AVOID THE GHOSTS!').css({ color: '#ffff00' });

    // Aggiorna l'ancora temporale per evitare scatti della fisica dovuti al tempo passato in pausa
    this.lastTime = performance.now();
  }

  changeDirection(dir) {
    if (!this.state.playing) return;
    this.state.pacman.nextDir = dir;
  }

  gameLoop() {
    const now = performance.now();
    const dt = now - (this.lastTime || now);
    this.lastTime = now;

    if (this.state.playing && this.state.powerMode) {
      this.state.powerTimeLeft -= dt;
      if (this.state.powerTimeLeft <= 0) {
        this.state.powerMode = false;
        this.state.ghosts.forEach(g => g.scared = false);
      }
    }

    this.updatePhysics();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  updatePhysics() {
    if (!this.state.playing || !this.state.pacman) return;

    const p = this.state.pacman;
    const ts = this.state.tileSize;

    p.mouthAngle += 0.03 * p.mouthDir;
    if (p.mouthAngle > 0.4 || p.mouthAngle < 0.05) p.mouthDir *= -1;

    if (p.x % ts === 0 && p.y % ts === 0) {
      if (this.canMove(p.x, p.y, p.nextDir, p.speed)) {
        p.dir = p.nextDir;
      }
    }

    if (this.canMove(p.x, p.y, p.dir, p.speed)) {
      if (p.dir === 'left') p.x -= p.speed;
      else if (p.dir === 'right') p.x += p.speed;
      else if (p.dir === 'up') p.y -= p.speed;
      else if (p.dir === 'down') p.y += p.speed;
    }

    // Wrap-around Pac-Man
    if (p.x < -ts / 2) p.x = this.state.cols * ts - ts / 2;
    if (p.x > this.state.cols * ts - ts / 2) p.x = -ts / 2;

    const gridX = Math.floor((p.x + ts / 2) / ts);
    const gridY = Math.floor((p.y + ts / 2) / ts);

    if (gridX >= 0 && gridX < this.state.cols && gridY >= 0 && gridY < this.state.rows) {
      const tile = this.state.map[gridY][gridX];
      if (tile === 2 || tile === 3) {
        const isPower = tile === 3;
        this.state.map[gridY][gridX] = 0;
        this.state.score += isPower ? 50 : 10;
        this.state.dotsLeft--;
        this.field('score_val').html(this.state.score);

        if (isPower) {
          this.playSound('power');
          this.state.powerMode = true;
          this.state.powerTimeLeft = 10000;
          this.state.ghostMultiplier = 200;
          this.state.ghosts.forEach(g => {
            g.scared = true;
            // Reverse direction on power pellet consumption
            if (g.dir === 'up') g.dir = 'down';
            else if (g.dir === 'down') g.dir = 'up';
            else if (g.dir === 'left') g.dir = 'right';
            else if (g.dir === 'right') g.dir = 'left';
          });
        } else {
          this.playSound('waka');
        }

        if (this.state.dotsLeft === 0) {
          this.playSound('win');
          this.state.playing = false;
          this.endGame('LEVEL CLEARED!', '#00ff00');
        }
      }
    }

    this.state.ghosts.forEach(g => {
      if (g.x % ts === 0 && g.y % ts === 0) {
        const possibleDirs = ['up', 'down', 'left', 'right'].filter(d => {
          if (d === 'up' && g.dir === 'down') return false;
          if (d === 'down' && g.dir === 'up') return false;
          if (d === 'left' && g.dir === 'right') return false;
          if (d === 'right' && g.dir === 'left') return false;
          return this.canMove(g.x, g.y, d, g.speed);
        });

        if (possibleDirs.length > 0) {
          g.dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        } else {
          const fallback = ['up', 'down', 'left', 'right'].filter(d => this.canMove(g.x, g.y, d, g.speed));
          if (fallback.length > 0) g.dir = fallback[0];
        }
      }

      if (this.canMove(g.x, g.y, g.dir, g.speed)) {
        if (g.dir === 'left') g.x -= g.speed;
        else if (g.dir === 'right') g.x += g.speed;
        else if (g.dir === 'up') g.y -= g.speed;
        else if (g.dir === 'down') g.y += g.speed;
      } else {
        const fallback = ['up', 'down', 'left', 'right'].filter(d => this.canMove(g.x, g.y, d, g.speed));
        if (fallback.length > 0) {
          g.dir = fallback[Math.floor(Math.random() * fallback.length)];
        }
      }

      // Wrap-around Ghosts
      if (g.x < -ts / 2) g.x = this.state.cols * ts - ts / 2;
      if (g.x > this.state.cols * ts - ts / 2) g.x = -ts / 2;

      const dist = Math.hypot((p.x - g.x), (p.y - g.y));
      if (dist < ts * 0.8) {
        if (this.state.powerMode && g.scared) {
          // Eat ghost
          this.playSound('eat_ghost');
          this.state.score += this.state.ghostMultiplier;
          this.state.ghostMultiplier *= 2;
          this.field('score_val').html(this.state.score);

          // Respawn ghost at base
          g.x = 13 * ts;
          g.y = 10 * ts;
          g.scared = false;
        } else {
          // Pac-Man dies
          this.state.lives--;
          this.playSound('death');
          if (this.state.lives <= 0) {
            this.state.playing = false;
            this.state.isPaused = false; // Non è più in pausa ma è Game Over
            if (this.state.score > this.state.highScore) {
              this.state.highScore = this.state.score;
              this.field('high_score_val').html(this.state.highScore);
            }
            this.endGame('GAME OVER', '#fd1a1a');
          } else {
            p.x = 14 * ts;
            p.y = 16 * ts;
            p.dir = 'left';
            p.nextDir = 'left';
          }
        }
      }
    });
  }

  canMove(x, y, dir, speed) {
    const ts = this.state.tileSize;
    let nextX = x;
    let nextY = y;

    if (dir === 'left') nextX -= speed;
    else if (dir === 'right') nextX += speed;
    else if (dir === 'up') nextY -= speed;
    else if (dir === 'down') nextY += speed;

    const left = Math.floor(nextX / ts);
    const right = Math.floor((nextX + ts - 1) / ts);
    const top = Math.floor(nextY / ts);
    const bottom = Math.floor((nextY + ts - 1) / ts);

    if (left < 0 || right >= this.state.cols) {
      if (top === 10 && bottom === 10) {
        return true;
      }
      return false;
    }

    if (top < 0 || bottom >= this.state.rows) {
      return false;
    }

    const rowTop = this.state.map[top];
    const rowBottom = this.state.map[bottom];

    if (!rowTop || !rowBottom) return false;

    if (rowTop[left] === 1 ||
      rowTop[right] === 1 ||
      rowBottom[left] === 1 ||
      rowBottom[right] === 1) {
      return false;
    }
    return true;
  }

  endGame(msg, color) {
    // Ripristina lo scroll quando la partita finisce (Game Over / Livello Completato)
    document.body.style.overflow = '';
    this.state.isPaused = false;

    this.field('overlay_title').html(msg).css({ color });
    this.field('overlay_sub').html('TAP TO PLAY AGAIN');
    this.field('status_text').html(msg).css({ color });
    this.field('overlay_screen').show();
  }

  draw() {
    const ctx = this.ctx;
    const ts = this.state.tileSize;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
        const tile = this.state.map[r][c];
        if (tile === 1) {
          ctx.fillStyle = '#2121de';
          ctx.fillRect(c * ts, r * ts, ts, ts);
        } else if (tile === 2) {
          ctx.fillStyle = '#ffb8ae';
          ctx.beginPath();
          ctx.arc(c * ts + ts / 2, r * ts + ts / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          // Blinking power pellet
          if (Math.floor(Date.now() / 250) % 2 === 0) {
            ctx.fillStyle = '#ffb8ae';
            ctx.beginPath();
            ctx.arc(c * ts + ts / 2, r * ts + ts / 2, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    if (this.state.pacman) {
      const p = this.state.pacman;
      ctx.save();
      ctx.translate(p.x + ts / 2, p.y + ts / 2);

      let rotation = 0;
      if (p.dir === 'right') rotation = 0;
      else if (p.dir === 'down') rotation = Math.PI / 2;
      else if (p.dir === 'left') rotation = Math.PI;
      else if (p.dir === 'up') rotation = Math.PI * 1.5;
      ctx.rotate(rotation);

      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(0, 0, ts / 2 - 1, p.mouthAngle, Math.PI * 2 - p.mouthAngle);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    this.state.ghosts.forEach(g => {
      let color = g.color;
      if (g.scared) {
        // Blink white during the last 2 seconds
        if (this.state.powerTimeLeft < 2000 && Math.floor(Date.now() / 200) % 2 === 0) {
          color = '#ffffff';
        } else {
          color = '#0000ff';
        }
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(g.x + ts / 2, g.y + ts / 2 - 2, ts / 2 - 1, Math.PI, 0, false);
      ctx.lineTo(g.x + ts - 1, g.y + ts);
      ctx.lineTo(g.x + (ts * 3 / 4), g.y + ts - 4);
      ctx.lineTo(g.x + (ts / 2), g.y + ts);
      ctx.lineTo(g.x + (ts / 4), g.y + ts - 4);
      ctx.lineTo(g.x, g.y + ts);
      ctx.closePath();
      ctx.fill();

      if (g.scared) {
        // Scared eyes (squares)
        ctx.fillStyle = '#ffb8ae';
        ctx.fillRect(g.x + 4, g.y + 4, 3, 3);
        ctx.fillRect(g.x + 10, g.y + 4, 3, 3);
        // Zig-zag mouth
        ctx.strokeStyle = '#ffb8ae';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(g.x + 3, g.y + 11);
        ctx.lineTo(g.x + 5, g.y + 9);
        ctx.lineTo(g.x + 8, g.y + 11);
        ctx.lineTo(g.x + 11, g.y + 9);
        ctx.lineTo(g.x + 13, g.y + 11);
        ctx.stroke();
      } else {
        // Normal eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(g.x + 5, g.y + 5, 2.5, 0, Math.PI * 2);
        ctx.arc(g.x + 11, g.y + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(g.x + 5, g.y + 5, 1, 0, Math.PI * 2);
        ctx.arc(g.x + 11, g.y + 5, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < this.state.lives; i++) {
      ctx.beginPath();
      ctx.arc(15 + i * 20, this.canvas.height - 15, 6, 0.2, Math.PI * 2 - 0.2);
      ctx.lineTo(15 + i * 20, this.canvas.height - 15);
      ctx.closePath();
      ctx.fill();
    }
  }

  onDispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.keydown);

    // Assicura il ripristino dello scroll se il widget viene distrutto
    document.body.style.overflow = '';

    if (this.audioCtx) this.audioCtx.close();
  }
}
