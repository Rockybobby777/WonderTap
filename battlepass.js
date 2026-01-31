// ==================== BATTLE PASS MODULE ====================
// Season Pass system with free and premium tracks

const BattlePass = {
    // Current season config
    season: {
        id: 1,
        name: 'Wonderland Season 1',
        theme: 'Down the Rabbit Hole',
        startDate: '2025-01-01',
        endDate: '2025-02-28',
        maxLevel: 50
    },
    
    // XP requirements per level
    xpPerLevel: 1000,
    
    // Rewards for each level (free and premium tracks)
    rewards: [
        // Level 1-10
        { level: 1, free: { type: 'coins', amount: 500 }, premium: { type: 'coins', amount: 1500 } },
        { level: 2, free: { type: 'gems', amount: 5 }, premium: { type: 'gems', amount: 15 } },
        { level: 3, free: { type: 'spins', amount: 2 }, premium: { type: 'spins', amount: 5 } },
        { level: 4, free: { type: 'coins', amount: 750 }, premium: { type: 'boost', id: 'x2_1h' } },
        { level: 5, free: { type: 'energy', amount: 500 }, premium: { type: 'skin', id: 'bp_rabbit', name: 'Golden Rabbit', icon: '🐰' } },
        { level: 6, free: { type: 'coins', amount: 1000 }, premium: { type: 'gems', amount: 25 } },
        { level: 7, free: { type: 'gems', amount: 10 }, premium: { type: 'slideTicket', amount: 3 } },
        { level: 8, free: { type: 'spins', amount: 3 }, premium: { type: 'coins', amount: 3000 } },
        { level: 9, free: { type: 'coins', amount: 1000 }, premium: { type: 'boost', id: 'x3_30m' } },
        { level: 10, free: { type: 'gems', amount: 15 }, premium: { type: 'background', id: 'bp_galaxy', name: 'Galaxy Portal', icon: '🌌' } },
        
        // Level 11-20
        { level: 11, free: { type: 'coins', amount: 1500 }, premium: { type: 'gems', amount: 30 } },
        { level: 12, free: { type: 'spins', amount: 3 }, premium: { type: 'spins', amount: 10 } },
        { level: 13, free: { type: 'energy', amount: 1000 }, premium: { type: 'coins', amount: 5000 } },
        { level: 14, free: { type: 'gems', amount: 15 }, premium: { type: 'boost', id: 'energy_infinite' } },
        { level: 15, free: { type: 'coins', amount: 2000 }, premium: { type: 'effect', id: 'bp_stars', name: 'Cosmic Trail', icon: '🌠' } },
        { level: 16, free: { type: 'spins', amount: 4 }, premium: { type: 'gems', amount: 40 } },
        { level: 17, free: { type: 'gems', amount: 20 }, premium: { type: 'slideTicket', amount: 5 } },
        { level: 18, free: { type: 'coins', amount: 2500 }, premium: { type: 'coins', amount: 7500 } },
        { level: 19, free: { type: 'energy', amount: 1000 }, premium: { type: 'boost', id: 'x5_15m' } },
        { level: 20, free: { type: 'gems', amount: 25 }, premium: { type: 'skin', id: 'bp_cheshire', name: 'Neon Cheshire', icon: '😸' } },
        
        // Level 21-30
        { level: 21, free: { type: 'coins', amount: 3000 }, premium: { type: 'gems', amount: 50 } },
        { level: 22, free: { type: 'spins', amount: 5 }, premium: { type: 'spins', amount: 15 } },
        { level: 23, free: { type: 'gems', amount: 25 }, premium: { type: 'coins', amount: 10000 } },
        { level: 24, free: { type: 'coins', amount: 3500 }, premium: { type: 'slideTicket', amount: 7 } },
        { level: 25, free: { type: 'energy', amount: 2000 }, premium: { type: 'background', id: 'bp_void', name: 'The Void', icon: '🕳️' } },
        { level: 26, free: { type: 'gems', amount: 30 }, premium: { type: 'gems', amount: 75 } },
        { level: 27, free: { type: 'spins', amount: 5 }, premium: { type: 'boost', id: 'lucky_charm' } },
        { level: 28, free: { type: 'coins', amount: 4000 }, premium: { type: 'coins', amount: 15000 } },
        { level: 29, free: { type: 'gems', amount: 35 }, premium: { type: 'slideTicket', amount: 10 } },
        { level: 30, free: { type: 'spins', amount: 7 }, premium: { type: 'effect', id: 'bp_rainbow', name: 'Rainbow Burst', icon: '🌈' } },
        
        // Level 31-40
        { level: 31, free: { type: 'coins', amount: 5000 }, premium: { type: 'gems', amount: 100 } },
        { level: 32, free: { type: 'gems', amount: 40 }, premium: { type: 'spins', amount: 20 } },
        { level: 33, free: { type: 'spins', amount: 7 }, premium: { type: 'coins', amount: 20000 } },
        { level: 34, free: { type: 'energy', amount: 3000 }, premium: { type: 'boost', id: 'fever_boost' } },
        { level: 35, free: { type: 'coins', amount: 6000 }, premium: { type: 'skin', id: 'bp_hatter', name: 'Mad King', icon: '🎩' } },
        { level: 36, free: { type: 'gems', amount: 50 }, premium: { type: 'gems', amount: 125 } },
        { level: 37, free: { type: 'spins', amount: 8 }, premium: { type: 'slideTicket', amount: 15 } },
        { level: 38, free: { type: 'coins', amount: 7500 }, premium: { type: 'coins', amount: 25000 } },
        { level: 39, free: { type: 'gems', amount: 60 }, premium: { type: 'boost', id: 'autotap_1h' } },
        { level: 40, free: { type: 'spins', amount: 10 }, premium: { type: 'background', id: 'bp_psyche', name: 'Pure Psychedelia', icon: '🌀' } },
        
        // Level 41-50 (Final rewards)
        { level: 41, free: { type: 'coins', amount: 8000 }, premium: { type: 'gems', amount: 150 } },
        { level: 42, free: { type: 'gems', amount: 75 }, premium: { type: 'spins', amount: 25 } },
        { level: 43, free: { type: 'spins', amount: 10 }, premium: { type: 'coins', amount: 30000 } },
        { level: 44, free: { type: 'energy', amount: 5000 }, premium: { type: 'slideTicket', amount: 20 } },
        { level: 45, free: { type: 'coins', amount: 10000 }, premium: { type: 'effect', id: 'bp_glitch', name: 'Reality Glitch', icon: '📺' } },
        { level: 46, free: { type: 'gems', amount: 100 }, premium: { type: 'gems', amount: 200 } },
        { level: 47, free: { type: 'spins', amount: 12 }, premium: { type: 'coins', amount: 50000 } },
        { level: 48, free: { type: 'coins', amount: 15000 }, premium: { type: 'boost', id: 'mega_pack' } },
        { level: 49, free: { type: 'gems', amount: 150 }, premium: { type: 'slideTicket', amount: 30 } },
        { level: 50, free: { type: 'spins', amount: 20 }, premium: { type: 'skin', id: 'bp_alice', name: 'Cosmic Alice', icon: '👸', legendary: true } }
    ],
    
    // Initialize
    init() {
        this.checkSeasonState();
    },
    
    // Check and initialize season state
    checkSeasonState() {
        if (!Game.state.battlePass) {
            Game.state.battlePass = {
                seasonId: this.season.id,
                level: 1,
                xp: 0,
                premium: false,
                claimedFree: [],
                claimedPremium: []
            };
            Game.save();
        }
        
        // Reset if new season
        if (Game.state.battlePass.seasonId !== this.season.id) {
            Game.state.battlePass = {
                seasonId: this.season.id,
                level: 1,
                xp: 0,
                premium: false,
                claimedFree: [],
                claimedPremium: []
            };
            Game.save();
        }
    },
    
    // Add XP to battle pass
    addXP(amount) {
        if (!Game.state.battlePass) return;
        
        Game.state.battlePass.xp += amount;
        
        // Check for level up
        while (Game.state.battlePass.xp >= this.xpPerLevel && 
               Game.state.battlePass.level < this.season.maxLevel) {
            Game.state.battlePass.xp -= this.xpPerLevel;
            Game.state.battlePass.level++;
            
            // Notify
            Notifications.show('special', 'Battle Pass Level Up!', `Level ${Game.state.battlePass.level}`);
        }
        
        Game.save();
    },
    
    // Upgrade to premium
    upgradeToPremium() {
        // Would integrate with Telegram Stars
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            UI.showToast('Opening Telegram payment...', 'info');
            // Telegram.WebApp.openInvoice(...)
        } else {
            // Demo mode - just enable premium
            Game.state.battlePass.premium = true;
            Game.save();
            
            UI.showToast('Premium Battle Pass activated! 🌟', 'success');
            Notifications.special('Premium Unlocked!', 'Claim all premium rewards!');
            
            this.render();
        }
    },
    
    // Claim reward
    claimReward(level, isPremium) {
        const bp = Game.state.battlePass;
        
        // Check if can claim
        if (level > bp.level) {
            UI.showToast('Reach this level first!', 'warning');
            return;
        }
        
        if (isPremium && !bp.premium) {
            UI.showToast('Upgrade to Premium!', 'warning');
            return;
        }
        
        const claimedList = isPremium ? bp.claimedPremium : bp.claimedFree;
        if (claimedList.includes(level)) {
            UI.showToast('Already claimed!', 'warning');
            return;
        }
        
        // Get reward
        const rewardData = this.rewards.find(r => r.level === level);
        if (!rewardData) return;
        
        const reward = isPremium ? rewardData.premium : rewardData.free;
        
        // Apply reward
        this.applyReward(reward);
        
        // Mark as claimed
        claimedList.push(level);
        Game.save();
        
        // Effects
        Audio.playWin && Audio.playWin();
        Effects.createConfetti(20);
        
        this.render();
    },
    
    // Apply reward
    applyReward(reward) {
        switch (reward.type) {
            case 'coins':
                Game.state.coins += reward.amount;
                UI.showToast(`+${reward.amount} 🪙`, 'success');
                break;
            case 'gems':
                Game.state.gems += reward.amount;
                UI.showToast(`+${reward.amount} 💎`, 'success');
                break;
            case 'spins':
                Game.state.spins += reward.amount;
                UI.showToast(`+${reward.amount} 🎡 Spins`, 'success');
                break;
            case 'energy':
                Game.state.energy = Math.min(Game.state.energyMax + reward.amount, Game.state.energy + reward.amount);
                UI.showToast(`+${reward.amount} ⚡ Energy`, 'success');
                break;
            case 'slideTicket':
                Game.state.freeSlideTickets = (Game.state.freeSlideTickets || 0) + reward.amount;
                UI.showToast(`+${reward.amount} 🎫 Slide Tickets`, 'success');
                break;
            case 'skin':
                if (!Game.state.owned.skins.includes(reward.id)) {
                    Game.state.owned.skins.push(reward.id);
                }
                Notifications.special('New Skin!', `${reward.icon} ${reward.name}`);
                break;
            case 'background':
                if (!Game.state.owned.backgrounds.includes(reward.id)) {
                    Game.state.owned.backgrounds.push(reward.id);
                }
                Notifications.special('New Background!', `${reward.icon} ${reward.name}`);
                break;
            case 'effect':
                if (!Game.state.owned.effects.includes(reward.id)) {
                    Game.state.owned.effects.push(reward.id);
                }
                Notifications.special('New Effect!', `${reward.icon} ${reward.name}`);
                break;
            case 'boost':
                // Apply boost directly
                if (typeof Shop !== 'undefined') {
                    const boost = DATA.boosts.find(b => b.id === reward.id);
                    if (boost) Shop.applyBoost(boost);
                }
                UI.showToast(`Boost activated! 🚀`, 'success');
                break;
        }
        
        Game.updateUI();
    },
    
    // Get days remaining in season
    getDaysRemaining() {
        const end = new Date(this.season.endDate);
        const now = new Date();
        const diff = end - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },
    
    // Open Battle Pass page
    open() {
        UI.openModal('battlePassModal');
        this.render();
    },
    
    // Render Battle Pass UI
    render() {
        const container = document.getElementById('battlePassContent');
        if (!container) return;
        
        const bp = Game.state.battlePass || { level: 1, xp: 0, premium: false, claimedFree: [], claimedPremium: [] };
        const daysLeft = this.getDaysRemaining();
        const xpProgress = (bp.xp / this.xpPerLevel) * 100;
        
        container.innerHTML = `
            <div class="bp-header">
                <div class="bp-season-info">
                    <div class="bp-season-name">${this.season.name}</div>
                    <div class="bp-season-theme">${this.season.theme}</div>
                </div>
                <div class="bp-time-left">
                    <span class="bp-days">${daysLeft}</span>
                    <span class="bp-days-label">days left</span>
                </div>
            </div>
            
            <div class="bp-level-display">
                <div class="bp-level-badge">LV.${bp.level}</div>
                <div class="bp-xp-bar">
                    <div class="bp-xp-fill" style="width: ${xpProgress}%"></div>
                </div>
                <div class="bp-xp-text">${bp.xp} / ${this.xpPerLevel} XP</div>
            </div>
            
            ${!bp.premium ? `
                <div class="bp-premium-promo">
                    <div class="bp-premium-icon">👑</div>
                    <div class="bp-premium-info">
                        <div class="bp-premium-title">Upgrade to Premium</div>
                        <div class="bp-premium-desc">Unlock exclusive skins, backgrounds & 3x rewards!</div>
                    </div>
                    <button class="bp-premium-btn" onclick="BattlePass.upgradeToPremium()">
                        ⭐ 499 Stars
                    </button>
                </div>
            ` : `
                <div class="bp-premium-active">
                    <span>👑 PREMIUM ACTIVE</span>
                </div>
            `}
            
            <div class="bp-rewards-track">
                ${this.rewards.slice(0, 20).map(r => this.renderRewardTier(r, bp)).join('')}
            </div>
            
            <div class="bp-show-more" onclick="BattlePass.showAllRewards()">
                Show All 50 Levels ▼
            </div>
        `;
    },
    
    // Render single reward tier
    renderRewardTier(rewardData, bp) {
        const { level, free, premium } = rewardData;
        const isUnlocked = bp.level >= level;
        const freeClaimable = isUnlocked && !bp.claimedFree.includes(level);
        const premiumClaimable = isUnlocked && bp.premium && !bp.claimedPremium.includes(level);
        const freeClaimed = bp.claimedFree.includes(level);
        const premiumClaimed = bp.claimedPremium.includes(level);
        
        return `
            <div class="bp-tier ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="bp-tier-level">${level}</div>
                
                <div class="bp-reward free ${freeClaimed ? 'claimed' : ''} ${freeClaimable ? 'claimable' : ''}"
                     onclick="BattlePass.claimReward(${level}, false)">
                    ${this.renderRewardIcon(free)}
                    ${freeClaimed ? '<div class="bp-claimed-check">✓</div>' : ''}
                </div>
                
                <div class="bp-reward premium ${premiumClaimed ? 'claimed' : ''} ${premiumClaimable ? 'claimable' : ''} ${!bp.premium ? 'locked' : ''}"
                     onclick="BattlePass.claimReward(${level}, true)">
                    ${!bp.premium ? '<div class="bp-lock">🔒</div>' : ''}
                    ${this.renderRewardIcon(premium)}
                    ${premiumClaimed ? '<div class="bp-claimed-check">✓</div>' : ''}
                </div>
            </div>
        `;
    },
    
    // Render reward icon
    renderRewardIcon(reward) {
        const icons = {
            coins: '🪙',
            gems: '💎',
            spins: '🎡',
            energy: '⚡',
            slideTicket: '🎫',
            boost: '🚀',
            skin: reward.icon || '👤',
            background: reward.icon || '🎨',
            effect: reward.icon || '✨'
        };
        
        const icon = icons[reward.type] || '🎁';
        const amount = reward.amount ? `x${reward.amount}` : reward.name || '';
        
        return `
            <div class="bp-reward-icon">${icon}</div>
            <div class="bp-reward-amount">${amount}</div>
        `;
    },
    
    // Show all rewards
    showAllRewards() {
        // Would expand to show all 50 levels
        UI.showToast('Scroll to see all rewards!', 'info');
    }
};

// Add Battle Pass styles
const bpStyles = document.createElement('style');
bpStyles.textContent = `
    .bp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: linear-gradient(135deg, rgba(147,51,234,0.3), rgba(236,72,153,0.3));
        border-radius: 15px;
        margin-bottom: 15px;
    }
    
    .bp-season-name {
        font-family: 'Bangers', cursive;
        font-size: 1.3rem;
        color: var(--gold);
    }
    
    .bp-season-theme {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .bp-time-left {
        text-align: center;
        padding: 10px 15px;
        background: rgba(0,0,0,0.3);
        border-radius: 10px;
    }
    
    .bp-days {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--cyan);
    }
    
    .bp-days-label {
        font-size: 0.7rem;
        opacity: 0.7;
        display: block;
    }
    
    .bp-level-display {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .bp-level-badge {
        background: linear-gradient(135deg, var(--gold), #d4a000);
        color: #000;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 800;
    }
    
    .bp-xp-bar {
        flex: 1;
        height: 12px;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
        overflow: hidden;
    }
    
    .bp-xp-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--pink), var(--purple));
        border-radius: 6px;
        transition: width 0.3s;
    }
    
    .bp-xp-text {
        font-size: 0.75rem;
        opacity: 0.7;
        min-width: 80px;
        text-align: right;
    }
    
    .bp-premium-promo {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1));
        border: 2px solid var(--gold);
        border-radius: 15px;
        margin-bottom: 15px;
    }
    
    .bp-premium-icon {
        font-size: 2rem;
    }
    
    .bp-premium-info {
        flex: 1;
    }
    
    .bp-premium-title {
        font-weight: 700;
        color: var(--gold);
    }
    
    .bp-premium-desc {
        font-size: 0.75rem;
        opacity: 0.8;
    }
    
    .bp-premium-btn {
        padding: 10px 20px;
        background: linear-gradient(135deg, var(--gold), #d4a000);
        border: none;
        border-radius: 20px;
        color: #000;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
    }
    
    .bp-premium-active {
        text-align: center;
        padding: 10px;
        background: linear-gradient(135deg, var(--gold), #d4a000);
        border-radius: 10px;
        color: #000;
        font-weight: 700;
        margin-bottom: 15px;
    }
    
    .bp-rewards-track {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 5px;
    }
    
    .bp-tier {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        background: var(--card);
        border-radius: 12px;
        opacity: 0.6;
    }
    
    .bp-tier.unlocked {
        opacity: 1;
    }
    
    .bp-tier-level {
        width: 35px;
        height: 35px;
        background: rgba(0,0,0,0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
    }
    
    .bp-tier.unlocked .bp-tier-level {
        background: linear-gradient(135deg, var(--purple), var(--pink));
    }
    
    .bp-reward {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .bp-reward.premium {
        background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05));
        border: 1px solid rgba(255,215,0,0.3);
    }
    
    .bp-reward.claimable {
        border: 2px solid var(--green);
        animation: bpPulse 1.5s infinite;
    }
    
    @keyframes bpPulse {
        0%, 100% { box-shadow: 0 0 5px var(--green); }
        50% { box-shadow: 0 0 15px var(--green); }
    }
    
    .bp-reward.claimed {
        opacity: 0.5;
    }
    
    .bp-reward.locked {
        opacity: 0.4;
    }
    
    .bp-reward-icon {
        font-size: 1.5rem;
    }
    
    .bp-reward-amount {
        font-size: 0.7rem;
        font-weight: 600;
        margin-top: 3px;
    }
    
    .bp-claimed-check {
        position: absolute;
        top: 5px;
        right: 5px;
        background: var(--green);
        color: #000;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 700;
    }
    
    .bp-lock {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.2rem;
        z-index: 2;
    }
    
    .bp-show-more {
        text-align: center;
        padding: 15px;
        color: var(--cyan);
        cursor: pointer;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(bpStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattlePass;
}
