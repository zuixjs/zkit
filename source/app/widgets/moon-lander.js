class MoonLanderWidget extends ControllerInstance {
  state = {
    playing: false,
    score: 0,
    fuel: 1000,
    ship: null,
    terrain: [],
    pads: [],
    keys: {},
    width: 400,
    height: 300
  };

  physics = {
    gravity: 0.015,
    thrust: 0.045,
    rotationSpeed: 0.06,
    maxLandingV: 0.7,
    maxLandingH: 0.3,
    maxLandingAngle: 0.2
  };

  canvas = null;
  ctx = null;
  animationId = null;
  audioCtx = null;
  thrustOsc = null;

  onInit() {
    zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css', null, this.context);
    // Material Symbols Outlined
    zuix.using('style', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined', undefined, this.context)
    zuix.using('style', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined') // fonts must be added to the main document as well
  }

  onCreate() {
    const self = this;
    this.canvas = this.field('game_canvas').get();
    this.ctx = this.canvas.getContext('2d');

    this.declare({
      startGame: () => self.initGame(),
      setThrust: (v) => self.state.keys['Thrust'] = v,
      setRotate: (dir) => self.state.keys['Rotate'] = dir
    });

    this.setupKeyboard();
    this.generateTerrain();
    this.draw(); // Initial draw
    this.gameLoop();
  }

  setupKeyboard() {
    this.keydown = (e) => {
      if (e.key === 'ArrowUp') this.state.keys['Thrust'] = true;
      if (e.key === 'ArrowLeft') this.state.keys['Rotate'] = 'left';
      if (e.key === 'ArrowRight') this.state.keys['Rotate'] = 'right';
      if (e.key === 'Enter' && !this.state.playing) this.initGame();
    };
    this.keyup = (e) => {
      if (e.key === 'ArrowUp') this.state.keys['Thrust'] = false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.state.keys['Rotate'] = null;
    };
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  playThrustSound(active) {
    if (!this.audioCtx) return;
    if (active) {
      if (!this.thrustOsc) {
        this.thrustOsc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        this.thrustOsc.type = 'brown' in this.audioCtx ? 'brown' : 'sawtooth';
        this.thrustOsc.frequency.setValueAtTime(60, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        this.thrustOsc.connect(gain);
        gain.connect(this.audioCtx.destination);
        this.thrustOsc.start();
      }
    } else if (this.thrustOsc) {
      this.thrustOsc.stop();
      this.thrustOsc = null;
    }
  }

  playSound(type) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain); gain.connect(this.audioCtx.destination);
    const now = this.audioCtx.currentTime;
    if (type === 'crash') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(20, now + 0.5);
      gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0, now + 0.5);
    } else {
      osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
    }
    osc.start(); osc.stop(now + 0.5);
  }

  generateTerrain() {
    const points = [];
    const pads = [];
    let x = 0;
    let y = this.state.height * 0.8;
    const step = 10;

    while (x <= this.state.width) {
      points.push({ x, y });
      if (Math.random() > 0.85 && x < this.state.width - 40) {
        // Create landing pad
        const padWidth = 30;
        pads.push({ x1: x, x2: x + padWidth, y });
        x += padWidth;
        points.push({ x, y });
      }
      x += step;
      y += (Math.random() * 40 - 20);
      y = Math.max(this.state.height * 0.5, Math.min(y, this.state.height - 20));
    }
    this.state.terrain = points;
    this.state.pads = pads;
  }

  initGame() {
    this.initAudio();
    this.state.playing = true;
    this.state.fuel = 1000;
    this.state.ship = {
      x: 50,
      y: 50,
      vx: 1.5,
      vy: 0,
      angle: Math.PI / 2,
      width: 12,
      height: 14
    };
    this.field('overlay').hide();
    this.field('status_text').html('DESCENT ACTIVE').css({ color: '#00f2ff' });
    this.generateTerrain();
  }

  gameLoop() {
    this.updatePhysics();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  updatePhysics() {
    if (!this.state.playing || !this.state.ship) return;

    const s = this.state.ship;
    const k = this.state.keys;

    // Rotation
    if (k['Rotate'] === 'left') s.angle -= this.physics.rotationSpeed;
    if (k['Rotate'] === 'right') s.angle += this.physics.rotationSpeed;

    // Thrust
    if (k['Thrust'] && this.state.fuel > 0) {
      s.vx += Math.cos(s.angle) * this.physics.thrust;
      s.vy += Math.sin(s.angle) * this.physics.thrust;
      this.state.fuel -= 2;
      this.playThrustSound(true);
    } else {
      this.playThrustSound(false);
    }

    // Gravity
    s.vy += this.physics.gravity;

    // Position
    s.x += s.vx;
    s.y += s.vy;

    // Wrap X
    if (s.x < 0) s.x = this.state.width;
    if (s.x > this.state.width) s.x = 0;

    // Collision Check
    this.checkCollision();

    // Update UI
    this.model().v_speed = s.vy.toFixed(2);
    this.model().h_speed = Math.abs(s.vx).toFixed(2);
    this.model().altitude = Math.round(this.state.height - s.y - 20);
    this.field('fuel_bar').css({ width: (this.state.fuel / 10) + '%' });
    if (this.state.fuel < 200) this.field('fuel_bar').css({ background: '#ff0055' });
  }

  checkCollision() {
    const s = this.state.ship;
    // Find terrain Y at ship X
    let groundY = this.state.height;
    for (let i = 0; i < this.state.terrain.length - 1; i++) {
      const p1 = this.state.terrain[i];
      const p2 = this.state.terrain[i + 1];
      if (s.x >= p1.x && s.x <= p2.x) {
        const t = (s.x - p1.x) / (p2.x - p1.x);
        groundY = p1.y + t * (p2.y - p1.y);
        break;
      }
    }

    if (s.y + s.height / 2 >= groundY) {
      this.state.playing = false;
      this.playThrustSound(false);

      // Check if on pad
      const onPad = this.state.pads.find(p => s.x >= p.x1 && s.x <= p.x2);
      const safeV = Math.abs(s.vy) < this.physics.maxLandingV;
      const safeH = Math.abs(s.vx) < this.physics.maxLandingH;
      const safeA = Math.abs(s.angle - Math.PI * 1.5) < this.physics.maxLandingAngle || Math.abs(s.angle + Math.PI * 0.5) < this.physics.maxLandingAngle;

      if (onPad && safeV && safeH) {
        this.state.score += Math.round(this.state.fuel / 10) + 500;
        this.field('score_val').html(this.state.score);
        this.endGame('TOUCHDOWN SUCCESS', '#00ff00');
        this.playSound('land');
      } else {
        this.endGame('CRITICAL FAILURE', '#ff0055');
        this.playSound('crash');
      }
    }
  }

  endGame(msg, color) {
    this.field('overlay_title').html(msg).css({ color });
    this.field('overlay_sub').html('CLICK TO RE-ARM');
    this.field('status_text').html(msg).css({ color });
    this.field('overlay').show();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.state.width, this.state.height);

    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) ctx.fillRect((i * 77) % this.state.width, (i * 133) % this.state.height, 1, 1);

    // Terrain
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.state.terrain[0].x, this.state.terrain[0].y);
    this.state.terrain.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Pads
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 3;
    this.state.pads.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y); ctx.lineTo(p.x2, p.y);
      ctx.stroke();
    });

    // Ship
    if (this.state.ship) {
      const s = this.state.ship;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle + Math.PI / 2);

      // Body
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, 6); ctx.lineTo(6, 6); ctx.lineTo(0, -8); ctx.closePath();
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(-6, 6); ctx.lineTo(-9, 10);
      ctx.moveTo(6, 6); ctx.lineTo(9, 10);
      ctx.stroke();

      // Flame
      if (this.state.keys['Thrust'] && this.state.fuel > 0 && this.state.playing) {
        ctx.strokeStyle = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(-3, 7); ctx.lineTo(0, 7 + Math.random() * 10); ctx.lineTo(3, 7);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  onDispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup);
    if (this.thrustOsc) this.thrustOsc.stop();
    if (this.audioCtx) this.audioCtx.close();
  }
}
