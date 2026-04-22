class StarCatcher extends ControllerInstance {
    
    state = {
        playing: false,
        score: 0,
        highScore: 0,
        lives: 3,
        playerX: 0
    };

    items = [];
    gameLoopId = null;
    lastSpawn = 0;
    spawnRate = 1200; // ms

    onInit() {
        zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
        const self = this;
        this.declare({
            startGame: () => self.startGame(),
            movePlayer: (e) => self.movePlayer(e),
            noHighScore: () => self.state.highScore === 0
        });
    }

    onCreate() {
        // Inizializzazione posizione giocatore
        this.state.playerX = this.field('game_screen').get().clientWidth / 2;
        this.refreshUI();
    }

    onDispose() {
        this.stopLoop();
    }

    startGame() {
        if (this.state.playing) return;
        
        this.state.playing = true;
        this.state.score = 0;
        this.state.lives = 3;
        this.items.forEach(item => item.el.remove());
        this.items = [];
        this.spawnRate = 1200;
        
        this.field('overlay').hide();
        this.refreshUI();
        this.startLoop();
    }

    gameOver() {
        this.state.playing = false;
        this.stopLoop();
        
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
        }

        this.model().message_title = "GAME OVER";
        this.model().message_sub = "Riprova ancora";
        this.field('overlay').show();
        this.refreshUI();
    }

    startLoop() {
        const loop = (time) => {
            this.updatePhysics(time);
            this.gameLoopId = requestAnimationFrame(loop);
        };
        this.gameLoopId = requestAnimationFrame(loop);
    }

    stopLoop() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    }

    movePlayer(e) {
        if (!this.state.playing) return;
        const rect = this.field('game_screen').get().getBoundingClientRect();
        // Supporta sia mouse che touch
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let x = clientX - rect.left;
        
        // Limiti
        if (x < 25) x = 25;
        if (x > rect.width - 25) x = rect.width - 25;
        
        this.state.playerX = x;
        this.field('player_node').css({
            'left': `${x}px`
        });
    }

    updatePhysics(time) {
        // 1. Spawning
        if (time - this.lastSpawn > this.spawnRate) {
            this.spawnItem();
            this.lastSpawn = time;
            // Aumenta difficoltà gradualmente
            this.spawnRate = Math.max(400, this.spawnRate - 10);
        }

        const screenHeight = this.field('game_screen').get().clientHeight;
        const playerY = screenHeight - 65; // Posizione approssimativa player Y
        
        // 2. Movimento e Collisioni
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.y += item.speed;
            item.el.style.top = `${item.y}px`;

            // Controllo collisione
            const dist = Math.hypot(item.x - this.state.playerX, item.y - playerY);
            
            if (dist < 40) {
                this.handleCollision(item);
                this.removeItem(i);
                continue;
            }

            // Fuori schermo
            if (item.y > screenHeight) {
                this.removeItem(i);
            }
        }
    }

    spawnItem() {
        const isStar = Math.random() > 0.3;
        const container = this.field('play_field').get();
        const el = document.createElement('div');
        
        el.className = isStar ? 'star' : 'void';
        el.innerHTML = isStar ? '⭐' : '🕳️';
        
        const x = Math.random() * (container.clientWidth - 40) + 20;
        const speed = Math.random() * 2 + (isStar ? 3 : 4);
        
        el.style.left = `${x}px`;
        el.style.top = `-40px`;
        
        container.appendChild(el);
        this.items.push({ el, x, y: -40, speed, isStar });
    }

    handleCollision(item) {
        if (item.isStar) {
            this.state.score += 10;
        } else {
            this.state.lives -= 1;
            // Effetto visivo danno
            this.field('game_screen').addClass('shake');
            setTimeout(() => this.field('game_screen').removeClass('shake'), 300);
            
            if (this.state.lives <= 0) {
                this.gameOver();
            }
        }
        this.refreshUI();
    }

    removeItem(index) {
        const item = this.items[index];
        item.el.remove();
        this.items.splice(index, 1);
    }

    refreshUI() {
        this.model().score_val = this.state.score;
        this.model().lives_val = this.state.lives;
        this.model().high_score_val = this.state.highScore;
        this.update();
    }
}