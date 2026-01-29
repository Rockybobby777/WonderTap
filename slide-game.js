// ==================== RABBIT SLIDE - PSYCHEDELIC EDITION ====================
// An Alice in Wonderland inspired endless runner with trippy effects!

const SlideGame = {
    // Game config - SLOWER START, more forgiving
    config: {
        width: 360,
        height: 640,
        laneCount: 3,
        laneWidth: 90,
        playerSize: 50,
        // MUCH SLOWER to start
        baseSpeed: 2,
        maxSpeed: 10,
        speedIncrement: 0.0003,
        coinValue: 10,
        gemValue: 50,
        invincibleTime: 3000,
        powerupDuration: 8000,
        obstacleSpawnRate: 0.008,
        coinSpawnRate: 0.03,
        gemSpawnRate: 0.003,
        powerupSpawnRate: 0.002
    },
    
    // Game state
    state: {
        running: false,
        paused: false,
        score: 0,
        coins: 0,
        gems: 0,
        distance: 0,
        lives: 3,
        speed: 2,
        playerLane: 1,
        invincible: false,
        invincibleEnd: 0,
        activePowerup: null,
        powerupEnd: 0,
        combo: 0,
        maxCombo: 0,
        tripIntensity: 0,
        hueRotation: 0,
        time: 0,
        // Objectifs
        objectives: {
            distance100: false,
            distance500: false,
            distance1000: false,
            gems10: false,
            combo20: false,
            powerups3: false
        },
        powerupsCollected: 0
    },
    
    // Game objects
    objects: {
        coins: [],
        gems: [],
        obstacles: [],
        powerups: [],
        particles: []
    },
    
    // Visual assets
    assets: {
        player: '🐰',
        coins: ['🪙', '⭐', '🍪', '🫖'],
        gems: ['💎', '💜', '🔮'],
        obstacles: ['🍄', '🌹', '♠️', '♥️', '🎩', '⏰', '🐛', '🦋'],
        powerups: {
            shield: '🛡️',
            magnet: '🧲',
            x2: '✖️2️⃣',
            slow: '🐌',
            rainbow: '🌈'
        }
    },
    
    canvas: null,
    ctx: null,
    animationFrame: null,
    lastTime: 0,
    
    tunnel: {
        rings: [],
        colors: ['#ff00ff', '#00ffff', '#ff6b35', '#9b59b6', '#00ff88', '#ffd700']
    },
    
    init() {
        this.createCanvas();
        this.initTunnel();
    },
    
    end() {
        this.state.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },
    
    createCanvas() {
        const container = document.getElementById('slideGameContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.canvas.style.cssText = 'width: 100%; max-width: 360px; border-radius: 15px; touch-action: none; background: #0a0015;';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.setupControls();
    },
    
    setupControls() {
        let touchStartX = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            if (Math.abs(diff) > 40) {
                if (diff > 0 && this.state.playerLane < 2) {
                    this.state.playerLane++;
                    this.createSwipeEffect(1);
                    touchStartX = touchX;
                } else if (diff < 0 && this.state.playerLane > 0) {
                    this.state.playerLane--;
                    this.createSwipeEffect(-1);
                    touchStartX = touchX;
                }
            }
        }, { passive: false });
        
        document.addEventListener('keydown', (e) => {
            if (!this.state.running) return;
            if (e.key === 'ArrowLeft' && this.state.playerLane > 0) {
                this.state.playerLane--;
                this.createSwipeEffect(-1);
            }
            if (e.key === 'ArrowRight' && this.state.playerLane < 2) {
                this.state.playerLane++;
                this.createSwipeEffect(1);
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (this.config.width / rect.width);
            const lane = Math.floor(x / (this.config.width / 3));
            
            if (lane !== this.state.playerLane) {
                const dir = lane > this.state.playerLane ? 1 : -1;
                this.state.playerLane = Math.max(0, Math.min(2, lane));
                this.createSwipeEffect(dir);
            }
        });
    },
    
    createSwipeEffect(direction) {
        for (let i = 0; i < 5; i++) {
            this.objects.particles.push({
                x: this.getLaneX(this.state.playerLane) + direction * 30,
                y: this.config.height - 100 + Math.random() * 40,
                vx: -direction * (2 + Math.random() * 3),
                vy: -1 + Math.random() * 2,
                life: 1,
                color: this.tunnel.colors[Math.floor(Math.random() * this.tunnel.colors.length)],
                size: 3 + Math.random() * 5
            });
        }
    },
    
    initTunnel() {
        this.tunnel.rings = [];
        for (let i = 0; i < 20; i++) {
            this.tunnel.rings.push({
                z: i * 50,
                rotation: Math.random() * Math.PI * 2,
                color: this.tunnel.colors[i % this.tunnel.colors.length]
            });
        }
    },
    
    open() {
        const cost = 500;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'slideEntryModal';
        modal.innerHTML = `
            <div class="modal" style="text-align: center; max-width: 340px;">
                <div class="modal-header">
                    <span class="modal-title">🐰 Rabbit Slide</span>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>
                <div style="font-size: 3rem; margin: 10px 0; animation: bounce 1s infinite;">🐰</div>
                <div style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 10px;">
                    Down the Rabbit Hole!
                </div>
                
                <!-- TUTORIAL VISUEL -->
                <div style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: var(--gold);">📖 HOW TO PLAY</div>
                    <div style="font-size: 0.8rem; text-align: left; line-height: 1.6;">
                        <div>👆 <b>TAP LEFT/RIGHT</b> to change lanes</div>
                    </div>
                </div>
                
                <!-- QUOI PRENDRE / EVITER -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    <div style="background: rgba(0,255,0,0.15); border: 2px solid rgba(0,255,0,0.4); border-radius: 10px; padding: 8px;">
                        <div style="font-size: 0.75rem; color: #00ff00; font-weight: 700;">✅ COLLECT</div>
                        <div style="font-size: 1.3rem; margin: 5px 0;">🪙 💎 ⭐</div>
                        <div style="font-size: 0.65rem; opacity: 0.8;">Coins & Gems</div>
                    </div>
                    <div style="background: rgba(255,0,0,0.15); border: 2px solid rgba(255,0,0,0.4); border-radius: 10px; padding: 8px;">
                        <div style="font-size: 0.75rem; color: #ff4444; font-weight: 700;">❌ AVOID</div>
                        <div style="font-size: 1.3rem; margin: 5px 0;">🍄 🌹 ♠️</div>
                        <div style="font-size: 0.65rem; opacity: 0.8;">Obstacles</div>
                    </div>
                </div>
                
                <!-- POWER-UPS -->
                <div style="background: rgba(255,0,255,0.15); border: 2px solid rgba(255,0,255,0.3); border-radius: 10px; padding: 8px; margin-bottom: 12px;">
                    <div style="font-size: 0.75rem; color: var(--pink); font-weight: 700;">⚡ POWER-UPS (grab them!)</div>
                    <div style="font-size: 1.1rem; margin: 5px 0;">🛡️ 🧲 ✖️2️⃣ 🐌 🌈</div>
                </div>
                
                <!-- OBJECTIFS -->
                <div style="background: rgba(255,215,0,0.15); border: 2px solid rgba(255,215,0,0.3); border-radius: 10px; padding: 8px; margin-bottom: 12px;">
                    <div style="font-size: 0.75rem; color: var(--gold); font-weight: 700;">🎯 OBJECTIVES</div>
                    <div style="font-size: 0.7rem; text-align: left; margin-top: 5px;">
                        <div>🥉 Reach 100m</div>
                        <div>🥈 Reach 500m</div>
                        <div>🥇 Reach 1000m</div>
                        <div>💎 Collect 10 gems</div>
                    </div>
                </div>
                
                <button onclick="document.getElementById('slideEntryModal').remove(); SlideGame.start();" 
                        style="width: 100%; padding: 15px; background: linear-gradient(135deg, var(--pink), var(--purple)); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-bottom: 8px;">
                    🎮 START (🪙 ${cost})
                </button>
                <button onclick="document.getElementById('slideEntryModal').remove();" 
                        style="width: 100%; padding: 10px; background: rgba(255,255,255,0.1); border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    start() {
        const cost = 500;
        if (Game.state.coins < cost) {
            UI.showToast('Not enough coins!', 'error');
            return;
        }
        
        Game.state.coins -= cost;
        Game.save();
        Game.updateUI();
        
        UI.openModal('slideGameModal');
        
        setTimeout(() => {
            this.init();
            
            this.state = {
                running: true,
                paused: false,
                score: 0,
                coins: 0,
                gems: 0,
                distance: 0,
                lives: 3,
                speed: this.config.baseSpeed,
                playerLane: 1,
                invincible: false,
                invincibleEnd: 0,
                activePowerup: null,
                powerupEnd: 0,
                combo: 0,
                maxCombo: 0,
                tripIntensity: 0,
                hueRotation: 0,
                time: 0,
                objectives: {
                    distance100: false,
                    distance500: false,
                    distance1000: false,
                    gems10: false,
                    combo20: false,
                    powerups3: false
                },
                powerupsCollected: 0
            };
            
            this.objects = {
                coins: [],
                gems: [],
                obstacles: [],
                powerups: [],
                particles: []
            };
            
            this.lastTime = performance.now();
            this.gameLoop();
        }, 200);
    },
    
    gameLoop(currentTime = 0) {
        if (!this.state.running) return;
        
        const dt = Math.min(currentTime - this.lastTime, 50);
        this.lastTime = currentTime;
        
        if (!this.state.paused) {
            this.state.time += dt;
            this.update(dt);
            this.render();
        }
        
        this.animationFrame = requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    update(dt) {
        // Gradually increase speed
        this.state.speed = Math.min(
            this.config.maxSpeed,
            this.config.baseSpeed + this.state.distance * this.config.speedIncrement
        );
        
        let currentSpeed = this.state.speed;
        if (this.state.activePowerup === 'slow' && Date.now() < this.state.powerupEnd) {
            currentSpeed *= 0.5;
        }
        
        this.state.distance += currentSpeed * 0.1;
        this.state.score = Math.floor(this.state.distance);
        
        this.state.tripIntensity = Math.min(1, this.state.distance / 500);
        this.state.hueRotation += currentSpeed * 0.5;
        
        // Vérifier objectifs
        this.checkObjectives();
        
        this.spawnObjects(currentSpeed);
        this.updateObjects(currentSpeed);
        this.checkCollisions();
        this.updateParticles();
        this.updateTunnel(currentSpeed);
        this.updateModalUI();
    },
    
    // Vérifier et célébrer les objectifs
    checkObjectives() {
        if (!this.state.objectives.distance100 && this.state.distance >= 100) {
            this.state.objectives.distance100 = true;
            this.celebrateObjective('🥉 100m reached!');
        }
        if (!this.state.objectives.distance500 && this.state.distance >= 500) {
            this.state.objectives.distance500 = true;
            this.celebrateObjective('🥈 500m reached!');
            this.state.coins += 50; // Bonus
        }
        if (!this.state.objectives.distance1000 && this.state.distance >= 1000) {
            this.state.objectives.distance1000 = true;
            this.celebrateObjective('🥇 1000m! LEGENDARY!');
            this.state.gems += 5; // Bonus
        }
        if (!this.state.objectives.gems10 && this.state.gems >= 10) {
            this.state.objectives.gems10 = true;
            this.celebrateObjective('💎 10 Gems collected!');
        }
        if (!this.state.objectives.combo20 && this.state.combo >= 20) {
            this.state.objectives.combo20 = true;
            this.celebrateObjective('🔥 COMBO x20!');
            this.state.coins += 100;
        }
        if (!this.state.objectives.powerups3 && this.state.powerupsCollected >= 3) {
            this.state.objectives.powerups3 = true;
            this.celebrateObjective('⚡ Power Collector!');
        }
    },
    
    // Animation de célébration d'objectif
    celebrateObjective(message) {
        // Créer une notification visuelle
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,0,255,0.9));
            padding: 15px 30px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 1.2rem;
            color: white;
            z-index: 9999;
            animation: objectivePop 2s forwards;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Particules de célébration
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            this.objects.particles.push({
                x: this.config.width / 2,
                y: this.config.height / 2,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                life: 1,
                color: '#ffd700',
                size: 8
            });
        }
        
        setTimeout(() => notification.remove(), 2000);
    },
    
    spawnObjects(speed) {
        const spawnY = -50;
        const difficultyMult = 1 + this.state.distance / 1000;
        
        // Coins
        if (Math.random() < this.config.coinSpawnRate * (1 + this.state.distance / 500)) {
            const lane = Math.floor(Math.random() * 3);
            const type = Math.floor(Math.random() * this.assets.coins.length);
            this.objects.coins.push({ lane, y: spawnY, type, collected: false });
        }
        
        // Gems
        if (Math.random() < this.config.gemSpawnRate) {
            const lane = Math.floor(Math.random() * 3);
            const type = Math.floor(Math.random() * this.assets.gems.length);
            this.objects.gems.push({ lane, y: spawnY, type, collected: false });
        }
        
        // Obstacles - only after 50m
        const obstacleRate = this.config.obstacleSpawnRate * Math.min(2, difficultyMult);
        if (Math.random() < obstacleRate && this.state.distance > 50) {
            const lane = Math.floor(Math.random() * 3);
            const recentObstacle = this.objects.obstacles.find(o => o.y < 150);
            if (!recentObstacle || recentObstacle.lane !== lane) {
                const type = Math.floor(Math.random() * this.assets.obstacles.length);
                this.objects.obstacles.push({ lane, y: spawnY, type, hit: false });
            }
        }
        
        // Powerups - after 100m
        if (Math.random() < this.config.powerupSpawnRate && this.state.distance > 100) {
            const lane = Math.floor(Math.random() * 3);
            const types = Object.keys(this.assets.powerups);
            const type = types[Math.floor(Math.random() * types.length)];
            this.objects.powerups.push({ lane, y: spawnY, type, collected: false });
        }
    },
    
    updateObjects(speed) {
        const moveAmount = speed * 3;
        
        ['coins', 'gems', 'obstacles', 'powerups'].forEach(type => {
            for (let i = this.objects[type].length - 1; i >= 0; i--) {
                this.objects[type][i].y += moveAmount;
                
                if (this.objects[type][i].y > this.config.height + 50) {
                    if (type === 'coins' && !this.objects[type][i].collected) {
                        this.state.combo = 0;
                    }
                    this.objects[type].splice(i, 1);
                }
            }
        });
    },
    
    checkCollisions() {
        const playerX = this.getLaneX(this.state.playerLane);
        const playerY = this.config.height - 120;
        const hitRadius = 45;
        
        const magnetActive = this.state.activePowerup === 'magnet' && Date.now() < this.state.powerupEnd;
        
        // Coins
        for (let i = this.objects.coins.length - 1; i >= 0; i--) {
            const coin = this.objects.coins[i];
            if (coin.collected) continue;
            
            const coinX = this.getLaneX(coin.lane);
            const dist = Math.sqrt(Math.pow(coinX - playerX, 2) + Math.pow(coin.y - playerY, 2));
            
            if (magnetActive && dist < 150) {
                coin.lane = this.state.playerLane;
            }
            
            if (dist < hitRadius) {
                coin.collected = true;
                let value = this.config.coinValue;
                
                if (this.state.activePowerup === 'x2' && Date.now() < this.state.powerupEnd) {
                    value *= 2;
                }
                
                this.state.coins += value;
                this.state.score += value;
                this.state.combo++;
                if (this.state.combo > this.state.maxCombo) {
                    this.state.maxCombo = this.state.combo;
                }
                
                this.createCollectEffect(coinX, coin.y, '#ffd700');
                this.objects.coins.splice(i, 1);
            }
        }
        
        // Gems
        for (let i = this.objects.gems.length - 1; i >= 0; i--) {
            const gem = this.objects.gems[i];
            if (gem.collected) continue;
            
            const gemX = this.getLaneX(gem.lane);
            const dist = Math.sqrt(Math.pow(gemX - playerX, 2) + Math.pow(gem.y - playerY, 2));
            
            if (magnetActive && dist < 150) {
                gem.lane = this.state.playerLane;
            }
            
            if (dist < hitRadius) {
                gem.collected = true;
                this.state.gems++;
                this.state.score += this.config.gemValue;
                this.createCollectEffect(gemX, gem.y, '#00ffff');
                this.objects.gems.splice(i, 1);
            }
        }
        
        // Powerups
        for (let i = this.objects.powerups.length - 1; i >= 0; i--) {
            const powerup = this.objects.powerups[i];
            if (powerup.collected) continue;
            
            const powX = this.getLaneX(powerup.lane);
            const dist = Math.sqrt(Math.pow(powX - playerX, 2) + Math.pow(powerup.y - playerY, 2));
            
            if (dist < hitRadius) {
                powerup.collected = true;
                this.activatePowerup(powerup.type);
                this.createCollectEffect(powX, powerup.y, '#ff00ff');
                this.objects.powerups.splice(i, 1);
            }
        }
        
        // Obstacles
        if (!this.state.invincible) {
            for (let i = this.objects.obstacles.length - 1; i >= 0; i--) {
                const obs = this.objects.obstacles[i];
                if (obs.hit) continue;
                
                const obsX = this.getLaneX(obs.lane);
                const dist = Math.sqrt(Math.pow(obsX - playerX, 2) + Math.pow(obs.y - playerY, 2));
                
                if (this.state.activePowerup === 'shield' && Date.now() < this.state.powerupEnd) {
                    if (dist < hitRadius + 20) {
                        obs.hit = true;
                        this.createCollectEffect(obsX, obs.y, '#ff0000');
                        this.objects.obstacles.splice(i, 1);
                        this.state.activePowerup = null;
                    }
                    continue;
                }
                
                if (dist < hitRadius - 10) {
                    obs.hit = true;
                    this.state.lives--;
                    this.state.combo = 0;
                    this.state.invincible = true;
                    this.state.invincibleEnd = Date.now() + this.config.invincibleTime;
                    
                    this.createHitEffect();
                    if (navigator.vibrate) navigator.vibrate(200);
                    
                    if (this.state.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                    
                    this.objects.obstacles.splice(i, 1);
                }
            }
        }
        
        if (this.state.invincible && Date.now() > this.state.invincibleEnd) {
            this.state.invincible = false;
        }
    },
    
    activatePowerup(type) {
        this.state.activePowerup = type;
        this.state.powerupEnd = Date.now() + this.config.powerupDuration;
        this.state.powerupsCollected++;
        
        const names = {
            shield: '🛡️ Shield!',
            magnet: '🧲 Magnet!',
            x2: '✖️2️⃣ Double Coins!',
            slow: '🐌 Slow Motion!',
            rainbow: '🌈 Rainbow Mode!'
        };
        
        UI.showToast(names[type] || 'Power-up!', 'success');
        
        if (type === 'rainbow') {
            this.state.tripIntensity = 1;
        }
    },
    
    createCollectEffect(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.objects.particles.push({
                x, y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3 - 2,
                life: 1,
                color,
                size: 4 + Math.random() * 4
            });
        }
    },
    
    createHitEffect() {
        for (let i = 0; i < 20; i++) {
            this.objects.particles.push({
                x: this.getLaneX(this.state.playerLane),
                y: this.config.height - 100,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: '#ff0000',
                size: 5 + Math.random() * 5
            });
        }
    },
    
    updateParticles() {
        for (let i = this.objects.particles.length - 1; i >= 0; i--) {
            const p = this.objects.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= 0.02;
            
            if (p.life <= 0) {
                this.objects.particles.splice(i, 1);
            }
        }
    },
    
    updateTunnel(speed) {
        for (const ring of this.tunnel.rings) {
            ring.z -= speed * 5;
            ring.rotation += 0.02;
            
            if (ring.z < 0) {
                ring.z = 1000;
                ring.color = this.tunnel.colors[Math.floor(Math.random() * this.tunnel.colors.length)];
            }
        }
    },
    
    getLaneX(lane) {
        const centerX = this.config.width / 2;
        const offset = (lane - 1) * this.config.laneWidth;
        return centerX + offset;
    },
    
    updateModalUI() {
        const livesEl = document.getElementById('slideLives');
        const scoreEl = document.getElementById('slideScore');
        const coinsEl = document.getElementById('slideCoins');
        const gemsEl = document.getElementById('slideGems');
        
        if (livesEl) livesEl.textContent = '❤️'.repeat(this.state.lives) + '🖤'.repeat(3 - this.state.lives);
        if (scoreEl) scoreEl.textContent = this.state.score;
        if (coinsEl) coinsEl.textContent = this.state.coins;
        if (gemsEl) gemsEl.textContent = this.state.gems;
    },
    
    render() {
        const ctx = this.ctx;
        const w = this.config.width;
        const h = this.config.height;
        
        if (this.state.tripIntensity > 0) {
            ctx.save();
            ctx.filter = `hue-rotate(${this.state.hueRotation % 360}deg) saturate(${1 + this.state.tripIntensity * 0.5})`;
        }
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#0a0015');
        gradient.addColorStop(0.5, '#1a0030');
        gradient.addColorStop(1, '#0f0020');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        this.renderTunnel(ctx, w, h);
        this.renderLanes(ctx, w, h);
        this.renderObjects(ctx);
        this.renderPlayer(ctx);
        this.renderParticles(ctx);
        this.renderUI(ctx, w, h);
        
        if (this.state.tripIntensity > 0) {
            ctx.restore();
        }
        
        if (this.state.invincible) {
            ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + Math.sin(Date.now() / 50) * 0.1})`;
            ctx.fillRect(0, 0, w, h);
        }
    },
    
    renderTunnel(ctx, w, h) {
        const centerX = w / 2;
        const centerY = h * 0.3;
        
        const sortedRings = [...this.tunnel.rings].sort((a, b) => b.z - a.z);
        
        for (const ring of sortedRings) {
            const scale = 500 / (ring.z + 100);
            const size = 50 + scale * 200;
            const alpha = Math.max(0, 1 - ring.z / 1000) * 0.3 * (1 + this.state.tripIntensity);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(ring.rotation);
            
            ctx.strokeStyle = ring.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 2 + scale * 2;
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    renderLanes(ctx, w, h) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 20]);
        
        for (let i = 1; i < 3; i++) {
            const x = (w / 3) * i;
            ctx.beginPath();
            ctx.moveTo(x, h * 0.4);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        for (let i = 0; i < 3; i++) {
            const x = this.getLaneX(i);
            const isActive = i === this.state.playerLane;
            
            ctx.fillStyle = isActive ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(x, h - 30, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    renderObjects(ctx) {
        const fontSize = 35;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // COINS - avec aura verte
        for (const coin of this.objects.coins) {
            if (coin.collected) continue;
            const x = this.getLaneX(coin.lane);
            const wobble = Math.sin(this.state.time / 200 + coin.y) * 5;
            
            // Aura verte = PRENDRE
            ctx.beginPath();
            ctx.arc(x + wobble, coin.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillText(this.assets.coins[coin.type], x + wobble, coin.y);
        }
        
        // GEMS - avec aura cyan brillante
        for (const gem of this.objects.gems) {
            if (gem.collected) continue;
            const x = this.getLaneX(gem.lane);
            const scale = 1 + Math.sin(this.state.time / 150) * 0.1;
            
            // Aura cyan = RARE, PRENDRE!
            ctx.beginPath();
            ctx.arc(x, gem.y, 28, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.save();
            ctx.translate(x, gem.y);
            ctx.scale(scale, scale);
            ctx.fillText(this.assets.gems[gem.type], 0, 0);
            ctx.restore();
        }
        
        // POWERUPS - avec aura magenta pulsante
        ctx.font = '40px Arial';
        for (const pow of this.objects.powerups) {
            if (pow.collected) continue;
            const x = this.getLaneX(pow.lane);
            const glow = Math.sin(this.state.time / 100) * 10 + 20;
            
            // Aura magenta = POWER-UP!
            ctx.beginPath();
            ctx.arc(x, pow.y, glow, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = glow;
            ctx.fillText(this.assets.powerups[pow.type], x, pow.y);
            ctx.shadowBlur = 0;
        }
        
        // OBSTACLES - avec aura rouge DANGER
        ctx.font = '45px Arial';
        for (const obs of this.objects.obstacles) {
            if (obs.hit) continue;
            const x = this.getLaneX(obs.lane);
            const shake = this.state.tripIntensity * Math.sin(this.state.time / 50) * 3;
            const pulse = Math.sin(this.state.time / 150) * 5;
            
            // Aura rouge = DANGER, EVITER!
            ctx.beginPath();
            ctx.arc(x + shake, obs.y, 30 + pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Symbole X au-dessus
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('✗', x + shake, obs.y - 35);
            
            ctx.font = '45px Arial';
            ctx.fillText(this.assets.obstacles[obs.type], x + shake, obs.y);
        }
    },
    
    renderPlayer(ctx) {
        const x = this.getLaneX(this.state.playerLane);
        const y = this.config.height - 100;
        
        if (this.state.speed > 3) {
            ctx.globalAlpha = 0.3;
            ctx.font = '50px Arial';
            ctx.fillText(this.assets.player, x, y + 20);
            ctx.globalAlpha = 0.15;
            ctx.fillText(this.assets.player, x, y + 35);
            ctx.globalAlpha = 1;
        }
        
        const glowColor = this.state.invincible ? 
            `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() / 50) * 0.3})` :
            this.state.activePowerup ? 'rgba(255, 0, 255, 0.5)' : 'rgba(0, 255, 255, 0.3)';
        
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 20 + Math.sin(this.state.time / 100) * 10;
        
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.assets.player, x, y);
        
        ctx.shadowBlur = 0;
        
        if (this.state.activePowerup === 'shield' && Date.now() < this.state.powerupEnd) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    
    renderParticles(ctx) {
        for (const p of this.objects.particles) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },
    
    renderUI(ctx, w, h) {
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.fillText('❤️'.repeat(this.state.lives), 15, 30);
        
        ctx.font = 'bold 20px Nunito, sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`Score: ${this.state.score}`, 15, 60);
        
        if (this.state.combo >= 5) {
            ctx.font = 'bold 18px Nunito, sans-serif';
            ctx.fillStyle = this.state.combo >= 20 ? '#ff00ff' : '#00ffff';
            ctx.textAlign = 'center';
            ctx.fillText(`COMBO x${this.state.combo}!`, w / 2, 30);
        }
        
        ctx.textAlign = 'right';
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(`${Math.floor(this.state.distance)}m`, w - 15, 30);
        ctx.fillText(`Speed: ${this.state.speed.toFixed(1)}x`, w - 15, 55);
        
        if (this.state.activePowerup && Date.now() < this.state.powerupEnd) {
            const remaining = Math.ceil((this.state.powerupEnd - Date.now()) / 1000);
            ctx.textAlign = 'center';
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#ff00ff';
            ctx.fillText(`${this.assets.powerups[this.state.activePowerup]} ${remaining}s`, w / 2, 55);
        }
    },
    
    togglePause() {
        this.state.paused = !this.state.paused;
        UI.showToast(this.state.paused ? '⏸️ Paused' : '▶️ Resumed', 'success');
    },
    
    gameOver() {
        this.state.running = false;
        
        const coinReward = this.state.coins;
        const gemReward = this.state.gems;
        const scoreBonus = Math.floor(this.state.score / 10);
        
        Game.state.coins += coinReward + scoreBonus;
        Game.state.gems += gemReward;
        
        if (!Game.state.slideHighScore || this.state.score > Game.state.slideHighScore) {
            Game.state.slideHighScore = this.state.score;
        }
        
        Game.save();
        Game.updateUI();
        
        setTimeout(() => {
            UI.closeModal('slideGameModal');
            UI.showToast(
                `🎮 Game Over! Score: ${this.state.score}\n+${coinReward + scoreBonus}🪙 +${gemReward}💎`,
                'success'
            );
            Effects.createConfetti(20);
        }, 500);
    }
};

const slideStyles = document.createElement('style');
slideStyles.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes objectivePop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        30% { transform: translate(-50%, -50%) scale(1); }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
`;
document.head.appendChild(slideStyles);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlideGame;
}
