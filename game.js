// ==================== GAME CORE MODULE ====================
// Main game logic: tapping, energy, fever, leveling, saving

const Game = {
    // Default game state
    defaultState: {
        // WONTIME System
        wontime: 0,
        totalWontime: 0,
        
        coins: 0,
        gems: 5,
        level: 1,
        xp: 0,
        energy: 1000,
        energyMax: 1000,
        energyRegen: 1,
        tapPower: 1,
        combo: 0,
        maxCombo: 0,
        fever: 0,
        feverMode: false,
        feverBonus: 2,
        feverDuration: 10000,
        luckChance: 0,
        spins: 3,
        totalTaps: 0,
        totalCoinsEarned: 0,
        streak: 0,
        maxStreak: 0,
        lastStreakClaim: null,
        dailyAdsWatched: 0,
        lastAdReset: null,
        lastHourlyClaim: null,
        freeSlideTickets: 0,
        
        // Upgrades
        upgrades: { tap: 1, energy: 0, regen: 1, fever: 0, luck: 0, feverDuration: 0, comboKeep: 0 },
        
        // Quests
        quests: {},
        questsClaimed: {},
        weeklyQuests: {},
        weeklyQuestsClaimed: {},
        achievements: {},
        achievementsClaimed: {},
        
        // Owned items
        owned: { 
            skins: ['classic'], 
            backgrounds: ['night'], 
            effects: ['classic'] 
        },
        
        // Equipped items
        equipped: { 
            skin: 'classic', 
            background: 'night', 
            effect: 'classic' 
        },
        
        // Active boosts
        boosts: {
            coinMultiplier: 1,
            coinMultiplierEnd: 0,
            infiniteEnergy: false,
            infiniteEnergyEnd: 0,
            autoTap: false,
            autoTapEnd: 0
        },
        
        // Settings
        settings: {
            sound: true,
            music: true,
            vibration: true,
            language: 'en'
        }
    },
    
    state: null,
    comboTimer: null,
    autoTapInterval: null,
    
    // Initialize game
    init() {
        this.load();
        this.checkDailyReset();
        this.setupTapZone();
        this.startTimers();
        this.updateUI();
        
        // Initialize Telegram
        if (typeof TelegramApp !== 'undefined') TelegramApp.init();
        
        // Initialize Backend
        if (typeof Backend !== 'undefined') Backend.init();
        
        // Initialize other modules
        if (typeof Wheel !== 'undefined') Wheel.init();
        if (typeof Shop !== 'undefined') {
            Shop.init();
            // Apply equipped items visually
            setTimeout(() => Shop.applyEquipped(), 100);
        }
        if (typeof Quests !== 'undefined') Quests.init();
        
        // Initialize Interactions
        if (typeof Interactions !== 'undefined') Interactions.init();
        
        // Sync with cloud on init
        this.syncWithCloud();
        
        console.log('🍄 WonderTap initialized!');
    },
    
    // Load game state
    load() {
        const saved = localStorage.getItem('wondertap_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.state = { ...this.defaultState, ...data };
                // Merge nested objects
                this.state.owned = { ...this.defaultState.owned, ...data.owned };
                this.state.equipped = { ...this.defaultState.equipped, ...data.equipped };
                this.state.upgrades = { ...this.defaultState.upgrades, ...data.upgrades };
                this.state.boosts = { ...this.defaultState.boosts, ...data.boosts };
                this.state.settings = { ...this.defaultState.settings, ...data.settings };
                
                // Reset fever state on load (fever doesn't persist)
                this.state.fever = 0;
                this.state.feverMode = false;
            } catch (e) {
                console.error('Failed to load save:', e);
                this.state = { ...this.defaultState };
            }
        } else {
            this.state = { ...this.defaultState };
        }
    },
    
    // Save game state
    save() {
        try {
            localStorage.setItem('wondertap_save', JSON.stringify(this.state));
            
            // Also sync to Telegram cloud if available
            if (typeof TelegramApp !== 'undefined') {
                TelegramApp.saveToCloud();
            }
        } catch (e) {
            console.error('Failed to save:', e);
        }
    },
    
    // Sync with cloud storage
    syncWithCloud() {
        // Try Telegram cloud first
        if (typeof TelegramApp !== 'undefined' && TelegramApp.webapp) {
            TelegramApp.loadFromCloud((cloudData) => {
                if (cloudData && cloudData.timestamp > (this.state.lastSaveTime || 0)) {
                    // Cloud data is newer, ask to restore
                    TelegramApp.showConfirm(
                        'Cloud save found! Restore progress?',
                        (confirmed) => {
                            if (confirmed) {
                                this.state = { ...this.defaultState, ...cloudData };
                                this.updateUI();
                                UI.showToast('Progress restored! ☁️', 'success');
                            }
                        }
                    );
                }
            });
        }
        
        // Sync to backend
        if (typeof Backend !== 'undefined') {
            Backend.syncToCloud(this.state);
        }
    },
    
    // Check daily reset
    checkDailyReset() {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('wondertap_lastReset');
        
        if (lastReset !== today) {
            // Reset daily stuff
            this.state.dailyAdsWatched = 0;
            
            // Reset daily quests
            DATA.dailyQuests.forEach(q => {
                this.state.quests[q.id] = 0;
                this.state.questsClaimed[q.id] = false;
            });
            
            // Check streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.state.lastStreakClaim !== yesterday.toDateString() && 
                this.state.lastStreakClaim !== today && 
                this.state.lastStreakClaim) {
                // Missed a day - reset streak
                this.state.streak = 0;
            }
            
            localStorage.setItem('wondertap_lastReset', today);
            this.save();
        }
    },
    
    // Setup tap zone events
    setupTapZone() {
        const tapZone = document.getElementById('tapZone');
        if (!tapZone) return;
        
        // Click handler
        tapZone.addEventListener('click', (e) => this.handleTap(e));
        
        // Touch handler (for multi-touch)
        tapZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let touch of e.touches) {
                this.handleTap({ clientX: touch.clientX, clientY: touch.clientY });
            }
        }, { passive: false });
    },
    
    // Handle tap
    handleTap(e) {
        // Check energy
        if (this.state.energy < 1 && !this.state.boosts.infiniteEnergy) {
            UI.showToast('No energy! Wait or use a boost.', 'warning');
            if (typeof Audio !== 'undefined') Audio.playError();
            return;
        }
        
        const x = e.clientX || e.pageX;
        const y = e.clientY || e.pageY;
        
        // Play tap sound
        if (typeof Audio !== 'undefined') Audio.playTap();
        
        // Haptic feedback
        if (typeof TelegramApp !== 'undefined') TelegramApp.haptic('light');
        
        // ===== WONTIME SYSTEM =====
        const wontimeEarned = 1;
        this.state.wontime += wontimeEarned;
        this.state.totalWontime += wontimeEarned;
        
        // Convert WONTIME to COINS (200 WONTIME = 1 COIN)
        const conversionRate = DATA.economy ? DATA.economy.wontimeToCoin : 200;
        let coinsFromWontime = 0;
        if (this.state.wontime >= conversionRate) {
            coinsFromWontime = Math.floor(this.state.wontime / conversionRate);
            this.state.coins += coinsFromWontime;
            this.state.totalCoinsEarned += coinsFromWontime;
            this.state.wontime = this.state.wontime % conversionRate;
        }
        
        // Calculate bonus coins (fever/boosts only)
        let bonusCoins = 0;
        
        // Fever bonus - x3 COINS!
        if (this.state.feverMode) {
            bonusCoins += this.state.tapPower * 2; // +2x = total 3x
        }
        
        // Boost multiplier
        if (this.state.boosts.coinMultiplier > 1 && Date.now() < this.state.boosts.coinMultiplierEnd) {
            bonusCoins += Math.floor(this.state.tapPower * (this.state.boosts.coinMultiplier - 1));
        }
        
        // Luck bonus (Cheshire)
        if (this.state.luckChance > 0 && Math.random() < this.state.luckChance) {
            bonusCoins += this.state.tapPower;
            this.showCheshireSmile();
        }
        
        // Apply bonus coins
        if (bonusCoins > 0) {
            this.state.coins += bonusCoins;
            this.state.totalCoinsEarned += bonusCoins;
        }
        
        this.state.totalTaps++;
        this.state.xp += 1;
        
        // Energy cost (unless infinite)
        if (!this.state.boosts.infiniteEnergy || Date.now() > this.state.boosts.infiniteEnergyEnd) {
            this.state.energy -= 1;
            this.state.boosts.infiniteEnergy = false;
        }
        
        // Combo system
        this.state.combo++;
        if (this.state.combo > this.state.maxCombo) {
            this.state.maxCombo = this.state.combo;
        }
        
        // Reset combo timer
        const comboWindow = 1000 + (this.state.upgrades.comboKeep * 500);
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
            this.state.combo = 0;
            const comboEl = document.getElementById('comboDisplay');
            if (comboEl) comboEl.classList.remove('show', 'mega');
        }, comboWindow);
        
        // Show combo display
        if (this.state.combo >= 5) {
            this.showCombo();
            if (typeof Audio !== 'undefined' && this.state.combo % 5 === 0) {
                Audio.playCombo(this.state.combo);
            }
            
            // Update interactions
            if (typeof Interactions !== 'undefined') Interactions.onComboChange(this.state.combo);
        }
        
        // Fever meter
        if (!this.state.feverMode) {
            this.state.fever = Math.min(100, this.state.fever + 1.5);
            if (this.state.fever >= 100) {
                console.log('🔥 ACTIVATING FEVER MODE!');
                this.activateFever();
            }
        } else {
            // Already in fever mode, keep at 100
            this.state.fever = 100;
        }
        
        // Quest progress
        this.updateQuestProgress('tap500', 1);
        this.updateQuestProgress('tap2000', 1);
        this.updateQuestProgress('tap5000', 1);
        this.updateQuestProgress('wtap20k', 1);
        this.updateQuestProgress('wtap100k', 1);
        this.updateQuestProgress('atap10k', this.state.totalTaps);
        this.updateQuestProgress('atap100k', this.state.totalTaps);
        this.updateQuestProgress('atap1m', this.state.totalTaps);
        
        // Combo quests
        if (this.state.combo >= 15) this.updateQuestProgress('combo15', this.state.combo);
        if (this.state.combo >= 30) this.updateQuestProgress('combo30', this.state.combo);
        if (this.state.combo >= 50) this.updateQuestProgress('combo50', this.state.combo);
        this.updateQuestProgress('acombo50', this.state.maxCombo);
        this.updateQuestProgress('acombo100', this.state.maxCombo);
        this.updateQuestProgress('acombo200', this.state.maxCombo);
        
        // WONTIME achievements
        this.updateQuestProgress('awontime100k', this.state.totalWontime);
        this.updateQuestProgress('awontime1m', this.state.totalWontime);
        
        // Coins quests
        this.updateQuestProgress('wcoins100k', bonusCoins + coinsFromWontime);
        this.updateQuestProgress('acoins100k', this.state.totalCoinsEarned);
        this.updateQuestProgress('acoins1m', this.state.totalCoinsEarned);
        
        // Visual effects - Show WONTIME
        Effects.createFloatWontime(x, y, wontimeEarned, this.state.feverMode);
        Effects.createRipple(x, y, this.state.feverMode);
        Effects.createSmoke();
        
        // Level up check
        if (this.state.xp >= this.getXpNeeded()) {
            this.levelUp();
        }
        
        this.updateUI();
    },
    
    // Show combo display
    showCombo() {
        const comboEl = document.getElementById('comboDisplay');
        const comboVal = document.getElementById('comboVal');
        if (!comboEl || !comboVal) return;
        
        comboVal.textContent = this.state.combo;
        comboEl.classList.add('show');
        comboEl.classList.toggle('mega', this.state.combo >= 20);
    },
    
    // Show Cheshire smile (lucky 2x)
    showCheshireSmile() {
        const smile = document.getElementById('cheshireSmile');
        if (!smile) return;
        
        smile.classList.add('show');
        setTimeout(() => smile.classList.remove('show'), 1500);
    },
    
    // Activate fever mode
    activateFever() {
        this.state.feverMode = true;
        this.state.fever = 100;
        
        // Play fever sound
        if (typeof Audio !== 'undefined') Audio.playFever();
        
        // Quest progress
        this.updateQuestProgress('fever2', 1);
        this.updateQuestProgress('fever5', 1);
        this.updateQuestProgress('wfever20', 1);
        
        // Visual
        const caterpillar = document.getElementById('caterpillar');
        if (caterpillar) caterpillar.classList.add('fever');
        
        // Duration based on upgrades
        const duration = this.state.feverDuration + (this.state.upgrades.feverDuration * 2000);
        
        setTimeout(() => {
            this.state.feverMode = false;
            this.state.fever = 0;
            if (caterpillar) caterpillar.classList.remove('fever');
            this.updateUI();
        }, duration);
        
        UI.showToast('🔥 FEVER MODE! 🔥', 'success');
    },
    
    // Get XP needed for current level
    getXpNeeded() {
        return DATA.xpPerLevel(this.state.level);
    },
    
    // Level up
    levelUp() {
        this.state.level++;
        this.state.xp = 0;
        this.state.tapPower++;
        
        // Play level up sound
        if (typeof Audio !== 'undefined') Audio.playLevelUp();
        
        // Add Battle Pass XP
        if (typeof BattlePass !== 'undefined') {
            BattlePass.addXP(100);
        }
        
        // Quest progress
        this.updateQuestProgress('alevel10', this.state.level);
        this.updateQuestProgress('alevel25', this.state.level);
        this.updateQuestProgress('alevel50', this.state.level);
        this.updateQuestProgress('alevel100', this.state.level);
        
        // Show level up modal
        const levelNum = document.getElementById('levelupNum');
        const levelModal = document.getElementById('levelupModal');
        
        if (levelNum) levelNum.textContent = this.state.level;
        if (levelModal) levelModal.classList.add('active');
        
        Effects.createConfetti(60);
        
        setTimeout(() => {
            if (levelModal) levelModal.classList.remove('active');
        }, 2500);
        
        this.save();
    },
    
    // Update quest progress
    updateQuestProgress(questId, value) {
        // Check if it's a max-value quest (combo, level, total coins)
        const maxQuests = ['combo15', 'combo30', 'combo50', 'acombo50', 'acombo100', 'acombo200', 
                          'alevel10', 'alevel25', 'alevel50', 'alevel100',
                          'atap10k', 'atap100k', 'atap1m', 'acoins100k', 'acoins1m'];
        
        if (!this.state.quests[questId]) this.state.quests[questId] = 0;
        
        if (maxQuests.includes(questId)) {
            this.state.quests[questId] = Math.max(this.state.quests[questId], value);
        } else {
            this.state.quests[questId] += value;
        }
    },
    
    // Start auto-tap
    startAutoTap(duration) {
        this.state.boosts.autoTap = true;
        this.state.boosts.autoTapEnd = Date.now() + (duration * 1000);
        
        if (this.autoTapInterval) clearInterval(this.autoTapInterval);
        
        this.autoTapInterval = setInterval(() => {
            if (Date.now() > this.state.boosts.autoTapEnd) {
                this.stopAutoTap();
                return;
            }
            
            // Simulate tap
            const tapZone = document.getElementById('tapZone');
            if (tapZone) {
                const rect = tapZone.getBoundingClientRect();
                this.handleTap({
                    clientX: rect.left + rect.width / 2 + (Math.random() - 0.5) * 50,
                    clientY: rect.top + rect.height / 2 + (Math.random() - 0.5) * 50
                });
            }
        }, 200);
    },
    
    // Stop auto-tap
    stopAutoTap() {
        this.state.boosts.autoTap = false;
        if (this.autoTapInterval) {
            clearInterval(this.autoTapInterval);
            this.autoTapInterval = null;
        }
    },
    
    // Start game timers
    startTimers() {
        // Energy regeneration
        setInterval(() => {
            if (this.state.energy < this.state.energyMax) {
                this.state.energy = Math.min(this.state.energyMax, this.state.energy + this.state.energyRegen);
                this.updateUI();
            }
        }, 1000);
        
        // Hourly timer update
        this.updateHourlyTimer();
        setInterval(() => this.updateHourlyTimer(), 1000);
        
        // Auto-save
        setInterval(() => this.save(), 30000);
        
        // Lucky box spawn
        setInterval(() => this.trySpawnLuckyBox(), 60000);
        setTimeout(() => this.trySpawnLuckyBox(), 10000);
    },
    
    // Update hourly timer
    updateHourlyTimer() {
        const now = Date.now();
        const lastClaim = this.state.lastHourlyClaim || 0;
        const elapsed = now - lastClaim;
        const cooldown = 3600000; // 1 hour
        
        const timerEl = document.getElementById('hourlyTimer');
        const textEl = document.getElementById('hourlyText');
        
        if (!timerEl || !textEl) return;
        
        if (elapsed >= cooldown) {
            textEl.textContent = 'Ready!';
            timerEl.classList.add('ready');
        } else {
            const remaining = cooldown - elapsed;
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            textEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            timerEl.classList.remove('ready');
        }
    },
    
    // Claim hourly bonus
    claimHourly() {
        const now = Date.now();
        const lastClaim = this.state.lastHourlyClaim || 0;
        
        if (now - lastClaim < 3600000) {
            UI.showToast('Not ready yet!', 'warning');
            return;
        }
        
        this.state.lastHourlyClaim = now;
        
        const reward = 200 + (this.state.level * 50);
        this.state.coins += reward;
        
        this.updateQuestProgress('hourly3', 1);
        
        UI.showResult('🎁', 'HOURLY BONUS!', `+${reward} 🪙`);
        this.save();
        this.updateUI();
    },
    
    // Claim daily streak
    claimStreak() {
        const now = new Date();
        const today = now.toDateString();
        const lastClaim = this.state.lastStreakClaim ? new Date(this.state.lastStreakClaim).toDateString() : null;
        
        // Already claimed today
        if (lastClaim === today) {
            UI.showToast('Already claimed today!', 'warning');
            return;
        }
        
        // Check if streak continues or resets
        const yesterday = new Date(now - 86400000).toDateString();
        if (lastClaim !== yesterday && lastClaim !== null) {
            this.state.streak = 0; // Reset streak if missed a day
        }
        
        // Increment streak
        this.state.streak++;
        if (this.state.streak > this.state.maxStreak) {
            this.state.maxStreak = this.state.streak;
        }
        
        // Get reward for current day (1-7, then loops)
        const dayIndex = ((this.state.streak - 1) % 7);
        const rewards = DATA.streakRewards || [
            { coins: 50, gems: 0 },
            { coins: 75, gems: 0 },
            { coins: 0, gems: 1 },
            { coins: 100, gems: 0 },
            { coins: 0, gems: 2 },
            { coins: 150, gems: 0 },
            { coins: 250, gems: 5 }
        ];
        
        const reward = rewards[dayIndex] || rewards[0];
        
        // Apply rewards
        this.state.coins += reward.coins || 0;
        this.state.gems += reward.gems || 0;
        this.state.lastStreakClaim = now.toISOString();
        
        // Build reward text
        let rewardText = '';
        if (reward.coins > 0) rewardText += `+${reward.coins} 🪙 `;
        if (reward.gems > 0) rewardText += `+${reward.gems} 💎`;
        
        // Update streak display
        const streakDisplay = document.getElementById('streakModalDisplay');
        if (streakDisplay) streakDisplay.textContent = this.state.streak;
        
        UI.showResult('🔥', `Day ${this.state.streak}!`, rewardText);
        UI.closeModal('streakModal');
        
        // Quest progress
        this.updateQuestProgress('wstreak7', this.state.streak);
        this.updateQuestProgress('astreak30', this.state.streak);
        
        this.save();
        this.updateUI();
    },
    
    // Try spawn lucky box (VERY RARE)
    trySpawnLuckyBox() {
        if (Math.random() < 0.05) { // 5% chance - very rare!
            const box = document.getElementById('luckyBox');
            if (box) {
                box.classList.add('active');
                setTimeout(() => box.classList.remove('active'), 15000); // 15 seconds
            }
        }
    },
    
    // Open lucky box (REDUCED REWARDS)
    openLuckyBox() {
        const box = document.getElementById('luckyBox');
        if (box) box.classList.remove('active');
        
        const rewards = [
            { coins: 25, gems: 0 },
            { coins: 50, gems: 0 },
            { coins: 0, gems: 1 },
            { coins: 75, gems: 0 },
            { coins: 0, gems: 2 },
            { coins: 50, gems: 1 }
        ];
        
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        this.state.coins += reward.coins;
        this.state.gems += reward.gems;
        
        let text = '';
        if (reward.coins > 0) text += `+${reward.coins}🪙 `;
        if (reward.gems > 0) text += `+${reward.gems}💎`;
        
        UI.showResult('🎁', 'LUCKY BOX!', text);
        Effects.createConfetti(40);
        this.save();
        this.updateUI();
    },
    
    // Buy upgrade
    buyUpgrade(type) {
        const upgrade = DATA.upgrades[type];
        if (!upgrade) return;
        
        const level = this.state.upgrades[type];
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));
        
        // Check currency
        if (upgrade.currency === 'coins') {
            if (this.state.coins < cost) {
                UI.showToast('Not enough coins!', 'error');
                return;
            }
            this.state.coins -= cost;
        } else {
            if (this.state.gems < cost) {
                UI.showToast('Not enough gems!', 'error');
                return;
            }
            this.state.gems -= cost;
        }
        
        // Apply upgrade
        this.state.upgrades[type]++;
        
        switch (type) {
            case 'tap':
                this.state.tapPower++;
                break;
            case 'energy':
                this.state.energyMax += 200;
                break;
            case 'regen':
                this.state.energyRegen++;
                break;
            case 'fever':
                this.state.feverBonus += 0.2;
                break;
            case 'luck':
                this.state.luckChance += 0.05;
                break;
            case 'feverDuration':
                // Already handled in activateFever
                break;
            case 'comboKeep':
                // Already handled in handleTap
                break;
        }
        
        UI.showToast(`${upgrade.name} upgraded!`, 'success');
        this.save();
        this.updateUI();
    },
    
    // Format number
    formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return Math.floor(n).toString();
    },
    
    // Format number without abbreviation (for WONTIME big display)
    formatNumberFull(n) {
        return Math.floor(n).toLocaleString();
    },
    
    // Update all UI elements
    updateUI() {
        // Currencies - WONTIME big display shows full number
        this.updateElement('wontimeDisplay', this.formatNumber(this.state.totalWontime || 0));
        this.updateElement('wontimeBigDisplay', this.formatNumberFull(this.state.totalWontime || 0));
        this.updateElement('coinsDisplay', this.formatNumber(this.state.coins));
        this.updateElement('gemsDisplay', this.formatNumber(this.state.gems));
        this.updateElement('levelDisplay', this.state.level);
        this.updateElement('streakDisplay', this.state.streak);
        
        // XP bar
        const xpPercent = Math.min((this.state.xp / this.getXpNeeded()) * 100, 100);
        this.updateElement('xpFill', null, { width: xpPercent + '%' });
        
        // Energy bar
        const energyPercent = Math.min((this.state.energy / this.state.energyMax) * 100, 100);
        this.updateElement('energyFill', null, { width: energyPercent + '%' });
        this.updateElement('energyText', `${Math.floor(this.state.energy)}/${this.state.energyMax}`);
        
        // Fever bar - DEBUG & FIX
        const feverPercent = Math.min(100, this.state.fever);
        console.log('Fever value:', feverPercent);
        
        const feverFill = document.getElementById('feverFill');
        if (feverFill) {
            // Force style update directly
            feverFill.style.width = feverPercent + '%';
            
            // Add/remove classes based on fever state
            if (feverPercent > 0) {
                feverFill.classList.add('active');
            } else {
                feverFill.classList.remove('active');
            }
            
            if (feverPercent >= 100 || this.state.feverMode) {
                feverFill.classList.add('full');
            } else {
                feverFill.classList.remove('full');
            }
        }
        
        // Upgrades
        this.updateUpgradeUI();
    },
    
    // Update single element
    updateElement(id, text, style) {
        const el = document.getElementById(id);
        if (!el) return;
        if (text !== null && text !== undefined) el.textContent = text;
        if (style) Object.assign(el.style, style);
    },
    
    // Update upgrade UI
    updateUpgradeUI() {
        for (const [type, upgrade] of Object.entries(DATA.upgrades)) {
            const level = this.state.upgrades[type];
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));
            
            this.updateElement(`upgrade${type}Level`, level);
            this.updateElement(`upgrade${type}Cost`, this.formatNumber(cost));
        }
    },
    
    // DEV MODE - Unlock everything for testing
    devMode() {
        // Max coins and gems
        this.state.coins = 999999;
        this.state.gems = 9999;
        
        // Unlock all skins (including new ones)
        this.state.owned.skins = [
            'classic', 'rainbow', 'golden', 'neon', 'galaxy', 'diamond', 
            'fire', 'ice', 'zombie', 'alien', 'cheshire', 'madhatter', 
            'queen', 'rabbit', 'mushroom', 'clown', 'shark', 'skull',
            'dragon', 'void', 'crystal', 'phoenix'
        ];
        
        // Unlock all backgrounds (including new ones)
        this.state.owned.backgrounds = [
            'night', 'teaparty', 'garden', 'mushforest', 'rabbithole', 
            'chessboard', 'space', 'underwater', 'candyland', 'mirror', 
            'clockwork', 'aurora', 'haunted', 'starfield', 'psychedelic', 'void'
        ];
        
        // Unlock all effects
        this.state.owned.effects = [
            'classic', 'hearts', 'fire', 'lightning', 'bubbles', 'confetti', 
            'snow', 'petals', 'music', 'cards', 'butterflies', 'rainbow', 
            'galaxy', 'glitch'
        ];
        
        // Max level and stats
        this.state.level = 50;
        this.state.tapPower = 10;
        this.state.energy = 1000;
        this.state.maxEnergy = 1000;
        
        // Save and update
        this.save();
        this.updateUI();
        
        // Show confirmation
        UI.showToast('🔧 DEV MODE ACTIVATED! Everything unlocked!', 'success');
        Effects.createConfetti(50);
        
        console.log('🔧 DEV MODE: All items unlocked, 999K coins, 9K gems');
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}
