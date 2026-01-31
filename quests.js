// ==================== QUESTS MODULE ====================
// Daily quests, Weekly quests, Achievements

const Quests = {
    currentTab: 'daily',
    
    // Initialize quests
    init() {
        this.render();
    },
    
    // Render quests page
    render() {
        const container = document.getElementById('questsList');
        if (!container) return;
        
        container.innerHTML = `
            <!-- Quest Tabs -->
            <div class="quest-tabs">
                <div class="quest-tab ${this.currentTab === 'daily' ? 'active' : ''}" onclick="Quests.switchTab('daily')">📅 Daily</div>
                <div class="quest-tab ${this.currentTab === 'weekly' ? 'active' : ''}" onclick="Quests.switchTab('weekly')">📆 Weekly</div>
                <div class="quest-tab ${this.currentTab === 'achieve' ? 'active' : ''}" onclick="Quests.switchTab('achieve')">🏆 Achieve</div>
            </div>
            
            <!-- Watch & Earn Section -->
            <div class="watch-earn-section">
                <div class="watch-earn-header">
                    <div class="watch-earn-title">📺 Watch & Earn</div>
                    <div class="watch-earn-count">${20 - Game.state.dailyAdsWatched}/20 today</div>
                </div>
                <div class="watch-earn-grid">
                    <div class="watch-earn-item" onclick="Quests.watchAd('coins')">
                        <span class="watch-icon">🪙</span>
                        <span class="watch-reward">+500</span>
                    </div>
                    <div class="watch-earn-item" onclick="Quests.watchAd('spin')">
                        <span class="watch-icon">🎡</span>
                        <span class="watch-reward">+1 Spin</span>
                    </div>
                    <div class="watch-earn-item" onclick="Quests.watchAd('gems')">
                        <span class="watch-icon">💎</span>
                        <span class="watch-reward">+3</span>
                    </div>
                </div>
            </div>
            
            <!-- Quest List -->
            <div class="quest-list" id="questListContent">
                ${this.renderQuestList()}
            </div>
        `;
    },
    
    // Switch tab
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tabs
        document.querySelectorAll('.quest-tab').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Re-render list
        const listContent = document.getElementById('questListContent');
        if (listContent) {
            listContent.innerHTML = this.renderQuestList();
        }
    },
    
    // Render quest list based on current tab
    renderQuestList() {
        let quests = [];
        let progressKey = 'quests';
        let claimedKey = 'questsClaimed';
        
        switch (this.currentTab) {
            case 'daily':
                quests = DATA.dailyQuests;
                progressKey = 'quests';
                claimedKey = 'questsClaimed';
                break;
            case 'weekly':
                quests = DATA.weeklyQuests;
                progressKey = 'quests'; // Use same progress tracking
                claimedKey = 'weeklyQuestsClaimed';
                break;
            case 'achieve':
                quests = DATA.achievements;
                progressKey = 'quests';
                claimedKey = 'achievementsClaimed';
                break;
        }
        
        return quests.map(quest => {
            const progress = Game.state[progressKey][quest.id] || 0;
            const claimed = Game.state[claimedKey][quest.id] || false;
            const percent = Math.min((progress / quest.target) * 100, 100);
            const complete = progress >= quest.target;
            
            return `
                <div class="quest-item ${claimed ? 'claimed' : ''} ${complete && !claimed ? 'ready' : ''}">
                    <div class="quest-icon">${quest.icon}</div>
                    <div class="quest-info">
                        <div class="quest-name">${quest.name}</div>
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width: ${percent}%"></div>
                        </div>
                        <div class="quest-progress-text">${Math.min(progress, quest.target)} / ${quest.target}</div>
                    </div>
                    <div class="quest-reward">
                        <div class="quest-reward-value">${quest.currency === 'coins' ? '🪙' : '💎'} ${this.formatNumber(quest.reward)}</div>
                        <button class="quest-claim-btn" 
                                onclick="Quests.claimQuest('${quest.id}', '${this.currentTab}')"
                                ${!complete || claimed ? 'disabled' : ''}>
                            ${claimed ? '✓' : 'Claim'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Watch ad for reward
    watchAd(type) {
        if (Game.state.dailyAdsWatched >= 20) {
            UI.showToast('No more ads today! Come back tomorrow 🌙', 'warning');
            return;
        }
        
        // Simulate ad watching
        UI.showToast('Watching ad...', 'info');
        
        setTimeout(() => {
            Game.state.dailyAdsWatched++;
            
            // Quest progress
            Game.updateQuestProgress('ad5', 1);
            Game.updateQuestProgress('ad15', 1);
            
            switch (type) {
                case 'coins':
                    Game.state.coins += 500;
                    UI.showResult('🪙', 'AD REWARD!', '+500 🪙');
                    break;
                case 'spin':
                    Game.state.spins++;
                    UI.showResult('🎡', 'AD REWARD!', '+1 Spin!');
                    break;
                case 'gems':
                    Game.state.gems += 3;
                    UI.showResult('💎', 'AD REWARD!', '+3 💎');
                    break;
            }
            
            Game.save();
            Game.updateUI();
            this.render();
        }, 1500);
    },
    
    // Claim quest reward
    claimQuest(questId, type) {
        let quests, claimedKey;
        
        switch (type) {
            case 'daily':
                quests = DATA.dailyQuests;
                claimedKey = 'questsClaimed';
                break;
            case 'weekly':
                quests = DATA.weeklyQuests;
                claimedKey = 'weeklyQuestsClaimed';
                break;
            case 'achieve':
                quests = DATA.achievements;
                claimedKey = 'achievementsClaimed';
                break;
        }
        
        const quest = quests.find(q => q.id === questId);
        if (!quest) return;
        
        const progress = Game.state.quests[questId] || 0;
        if (progress < quest.target) return;
        if (Game.state[claimedKey][questId]) return;
        
        // Mark as claimed
        Game.state[claimedKey][questId] = true;
        
        // Give reward
        if (quest.currency === 'coins') {
            Game.state.coins += quest.reward;
        } else {
            Game.state.gems += quest.reward;
        }
        
        UI.showResult('✅', 'QUEST COMPLETE!', `+${this.formatNumber(quest.reward)} ${quest.currency === 'coins' ? '🪙' : '💎'}`);
        Effects.createConfetti(30);
        
        Game.save();
        Game.updateUI();
        this.render();
    },
    
    // Format number
    formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n;
    }
};

// Add quest styles
const questStyles = document.createElement('style');
questStyles.textContent = `
    .quest-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .quest-tab {
        flex: 1;
        padding: 12px;
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        text-align: center;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .quest-tab:active { transform: scale(0.97); }
    
    .quest-tab.active {
        background: linear-gradient(135deg, var(--pink), var(--purple));
        border-color: var(--pink);
    }
    
    .watch-earn-section {
        background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,200,100,0.05));
        border: 1px solid var(--green);
        border-radius: 15px;
        padding: 15px;
        margin-bottom: 15px;
    }
    
    .watch-earn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .watch-earn-title { font-weight: 700; }
    .watch-earn-count { color: var(--green); font-size: 0.85rem; }
    
    .watch-earn-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    
    .watch-earn-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 12px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .watch-earn-item:active {
        transform: scale(0.95);
        background: rgba(0,255,136,0.2);
    }
    
    .watch-icon { font-size: 1.6rem; }
    .watch-reward { font-size: 0.75rem; font-weight: 700; color: var(--gold); }
    
    .quest-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-bottom: 100px;
    }
    
    .quest-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 15px;
        transition: all 0.2s;
    }
    
    .quest-item.claimed {
        opacity: 0.6;
        border-color: var(--green);
    }
    
    .quest-item.ready {
        border-color: var(--gold);
        box-shadow: 0 0 15px rgba(255,215,0,0.2);
        animation: questReady 1.5s infinite;
    }
    
    @keyframes questReady {
        0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.2); }
        50% { box-shadow: 0 0 25px rgba(255,215,0,0.5); }
    }
    
    .quest-icon {
        width: 45px;
        height: 45px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
    }
    
    .quest-info { flex: 1; }
    
    .quest-name {
        font-weight: 700;
        font-size: 0.9rem;
        margin-bottom: 6px;
    }
    
    .quest-progress-bar {
        height: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 4px;
    }
    
    .quest-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--pink), var(--cyan));
        border-radius: 5px;
        transition: width 0.3s;
    }
    
    .quest-progress-text {
        font-size: 0.7rem;
        opacity: 0.6;
    }
    
    .quest-reward { text-align: center; }
    
    .quest-reward-value {
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--gold);
        margin-bottom: 6px;
    }
    
    .quest-claim-btn {
        padding: 8px 16px;
        background: var(--green);
        border: none;
        border-radius: 10px;
        color: #000;
        font-weight: 700;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .quest-claim-btn:disabled {
        background: #444;
        color: #666;
        cursor: not-allowed;
    }
    
    .quest-claim-btn:not(:disabled):active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(questStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quests;
}
