// ==================== WHEEL MODULE ====================
// Fortune Wheel with visible prizes and fixed rotation

const Wheel = {
    isSpinning: false,
    currentRotation: 0,
    segments: DATA.wheelPrizes,
    
    // Initialize wheel
    init() {
        this.createWheel();
        this.updateUI();
    },
    
    // Create wheel segments with VISIBLE prizes
    createWheel() {
        const wheelEl = document.getElementById('wheel');
        if (!wheelEl) return;
        
        wheelEl.innerHTML = '';
        
        const segmentCount = this.segments.length;
        const segmentAngle = 360 / segmentCount;
        
        this.segments.forEach((prize, index) => {
            const segment = document.createElement('div');
            segment.className = 'wheel-segment';
            
            // Calculate rotation for this segment
            const rotation = index * segmentAngle - 90 - (segmentAngle / 2);
            
            // Create segment with clip-path for pie slice
            segment.style.cssText = `
                position: absolute;
                width: 50%;
                height: 50%;
                left: 50%;
                top: 50%;
                transform-origin: 0 0;
                transform: rotate(${rotation}deg);
                overflow: hidden;
            `;
            
            // Inner container for the colored segment
            const inner = document.createElement('div');
            inner.style.cssText = `
                position: absolute;
                width: 200%;
                height: 200%;
                left: 0;
                top: 0;
                transform-origin: 0 0;
                transform: rotate(${segmentAngle}deg) skewY(${90 - segmentAngle}deg);
                background: ${prize.color};
                border: 1px solid rgba(0, 0, 0, 0.3);
            `;
            
            segment.appendChild(inner);
            
            // Prize content (icon + text) - positioned correctly
            const content = document.createElement('div');
            content.style.cssText = `
                position: absolute;
                left: 30%;
                top: 50%;
                transform: translateY(-50%) rotate(${segmentAngle / 2}deg);
                text-align: center;
                z-index: 10;
                pointer-events: none;
            `;
            
            content.innerHTML = `
                <div style="font-size: 1.6rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${prize.icon}</div>
                <div style="font-size: 0.75rem; font-weight: 800; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); margin-top: 2px;">${prize.label}</div>
            `;
            
            segment.appendChild(content);
            wheelEl.appendChild(segment);
        });
    },
    
    // Spin the wheel
    spin() {
        if (this.isSpinning) return;
        if (Game.state.spins <= 0) {
            UI.showToast('No spins left! Watch an ad or wait.', 'warning');
            return;
        }
        
        this.isSpinning = true;
        Game.state.spins--;
        
        // Track quest progress
        Game.updateQuestProgress('spin3', 1);
        Game.updateQuestProgress('spin10', 1);
        Game.updateQuestProgress('wspin30', 1);
        
        // Calculate which prize to land on (weighted random)
        const prizeIndex = this.getWeightedRandomPrize();
        const prize = this.segments[prizeIndex];
        
        // Calculate rotation
        const segmentAngle = 360 / this.segments.length;
        const prizeAngle = prizeIndex * segmentAngle;
        
        // Multiple full rotations + land on prize
        // We need to rotate so the POINTER (at top) points to the prize
        const fullRotations = 360 * (6 + Math.floor(Math.random() * 3)); // 6-8 full spins
        const targetRotation = fullRotations + (360 - prizeAngle) - (segmentAngle / 2) + (Math.random() * segmentAngle * 0.5);
        
        this.currentRotation += targetRotation;
        
        const wheelEl = document.getElementById('wheel');
        wheelEl.style.transition = 'transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheelEl.style.transform = `rotate(${this.currentRotation}deg)`;
        
        // Play spinning sound (if available)
        // Audio.play('spin');
        
        // Wait for spin to complete
        setTimeout(() => {
            this.isSpinning = false;
            this.givePrize(prize);
            this.updateUI();
            
            // Reset transition for next spin
            setTimeout(() => {
                wheelEl.style.transition = 'none';
            }, 100);
        }, 6000);
        
        this.updateUI();
    },
    
    // Get weighted random prize index
    getWeightedRandomPrize() {
        const totalWeight = this.segments.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < this.segments.length; i++) {
            random -= this.segments[i].weight;
            if (random <= 0) return i;
        }
        
        return 0;
    },
    
    // Give prize to player
    givePrize(prize) {
        let resultText = '';
        let resultIcon = prize.icon;
        
        switch (prize.type) {
            case 'coins':
                Game.state.coins += prize.value;
                resultText = `+${this.formatNumber(prize.value)} 🪙`;
                break;
                
            case 'gems':
                Game.state.gems += prize.value;
                resultText = `+${prize.value} 💎`;
                break;
                
            case 'energy':
                Game.state.energy = Math.min(Game.state.energyMax, Game.state.energy + prize.value);
                resultText = `+${prize.value} ⚡`;
                break;
                
            case 'mystery':
                // Random rewards
                const mysteryCoins = Math.floor(Math.random() * 2000) + 500;
                const mysteryGems = Math.floor(Math.random() * 10) + 2;
                Game.state.coins += mysteryCoins;
                Game.state.gems += mysteryGems;
                resultText = `+${this.formatNumber(mysteryCoins)}🪙 +${mysteryGems}💎`;
                resultIcon = '🎁';
                break;
                
            case 'minigame':
                // Give free access to slide mini-game
                Game.state.freeSlideTickets = (Game.state.freeSlideTickets || 0) + 1;
                resultText = `🎮 FREE SLIDE GAME!`;
                resultIcon = '🎮';
                break;
        }
        
        // Show result modal
        UI.showResult(resultIcon, 'YOU WON!', resultText);
        
        // Confetti for good prizes
        if (['gems', 'mystery', 'minigame'].includes(prize.type) || prize.value >= 1000) {
            Effects.createConfetti(50);
        }
        
        Game.save();
        Game.updateUI();
    },
    
    // Watch ad for extra spin
    watchAdForSpin() {
        if (Game.state.dailyAdsWatched >= 20) {
            UI.showToast('No more ads today! Come back tomorrow 🌙', 'warning');
            return;
        }
        
        // Simulate ad watching
        UI.showToast('Watching ad...', 'info');
        
        setTimeout(() => {
            Game.state.dailyAdsWatched++;
            Game.state.spins++;
            
            Game.updateQuestProgress('ad5', 1);
            Game.updateQuestProgress('ad15', 1);
            
            UI.showToast('+1 Spin earned! 🎡', 'success');
            this.updateUI();
            Game.save();
        }, 1500);
    },
    
    // Buy spins with gems
    buySpins(amount, cost) {
        if (Game.state.gems < cost) {
            UI.showToast('Not enough gems!', 'error');
            return;
        }
        
        Game.state.gems -= cost;
        Game.state.spins += amount;
        
        UI.showToast(`+${amount} Spins purchased!`, 'success');
        this.updateUI();
        Game.save();
    },
    
    // Update wheel UI
    updateUI() {
        const spinsEl = document.getElementById('spinsCount');
        const spinBtn = document.getElementById('spinBtn');
        const adsLeftEl = document.getElementById('adsLeftWheel');
        
        if (spinsEl) spinsEl.textContent = Game.state.spins;
        if (spinBtn) spinBtn.disabled = Game.state.spins <= 0 || this.isSpinning;
        if (adsLeftEl) adsLeftEl.textContent = `${20 - Game.state.dailyAdsWatched}/20`;
    },
    
    // Format number helper
    formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return Math.floor(n).toString();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Wheel;
}
