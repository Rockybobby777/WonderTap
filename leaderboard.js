// ==================== LEADERBOARD MODULE ====================
// Global rankings with multiple categories

const Leaderboard = {
    currentCategory: 'coins',
    
    // Fake leaderboard data (would come from server in real app)
    fakeData: {
        coins: [
            { rank: 1, name: 'CryptoKing', avatar: '👑', value: 15420000, level: 87 },
            { rank: 2, name: 'TapMaster', avatar: '🎯', value: 12800000, level: 74 },
            { rank: 3, name: 'AliceQueen', avatar: '👸', value: 9650000, level: 65 },
            { rank: 4, name: 'MadHatter', avatar: '🎩', value: 7420000, level: 58 },
            { rank: 5, name: 'CheshireCat', avatar: '😸', value: 5890000, level: 52 },
            { rank: 6, name: 'WhiteRabbit', avatar: '🐰', value: 4520000, level: 45 },
            { rank: 7, name: 'Caterpillar', avatar: '🐛', value: 3210000, level: 38 },
            { rank: 8, name: 'TweedleDee', avatar: '🎭', value: 2890000, level: 35 },
            { rank: 9, name: 'Dormouse', avatar: '🐭', value: 2150000, level: 30 },
            { rank: 10, name: 'CardSoldier', avatar: '♠️', value: 1820000, level: 27 }
        ],
        taps: [
            { rank: 1, name: 'TapGod', avatar: '⚡', value: 5420000, level: 92 },
            { rank: 2, name: 'FingerMaster', avatar: '👆', value: 4890000, level: 85 },
            { rank: 3, name: 'SpeedRunner', avatar: '🏃', value: 3650000, level: 71 },
            { rank: 4, name: 'TapNinja', avatar: '🥷', value: 2980000, level: 63 },
            { rank: 5, name: 'ClickerPro', avatar: '🖱️', value: 2450000, level: 55 },
            { rank: 6, name: 'RapidFire', avatar: '🔥', value: 1920000, level: 48 },
            { rank: 7, name: 'TapWarrior', avatar: '⚔️', value: 1580000, level: 42 },
            { rank: 8, name: 'FastFingers', avatar: '✋', value: 1250000, level: 36 },
            { rank: 9, name: 'TapHero', avatar: '🦸', value: 980000, level: 31 },
            { rank: 10, name: 'QuickTap', avatar: '💨', value: 750000, level: 25 }
        ],
        level: [
            { rank: 1, name: 'Grandmaster', avatar: '🏆', value: 120, level: 120 },
            { rank: 2, name: 'LevelKing', avatar: '👑', value: 105, level: 105 },
            { rank: 3, name: 'XPHunter', avatar: '🎯', value: 92, level: 92 },
            { rank: 4, name: 'Grinder', avatar: '💪', value: 85, level: 85 },
            { rank: 5, name: 'Veteran', avatar: '🎖️', value: 78, level: 78 },
            { rank: 6, name: 'ProPlayer', avatar: '🎮', value: 71, level: 71 },
            { rank: 7, name: 'Dedicated', avatar: '⭐', value: 65, level: 65 },
            { rank: 8, name: 'Committed', avatar: '💎', value: 58, level: 58 },
            { rank: 9, name: 'Rising', avatar: '📈', value: 52, level: 52 },
            { rank: 10, name: 'Newcomer', avatar: '🌟', value: 45, level: 45 }
        ],
        streak: [
            { rank: 1, name: 'StreakLord', avatar: '🔥', value: 365, level: 88 },
            { rank: 2, name: 'DailyKing', avatar: '📅', value: 280, level: 75 },
            { rank: 3, name: 'Consistent', avatar: '✅', value: 210, level: 62 },
            { rank: 4, name: 'Reliable', avatar: '🎯', value: 180, level: 55 },
            { rank: 5, name: 'Dedicated', avatar: '💪', value: 150, level: 48 },
            { rank: 6, name: 'Regular', avatar: '⏰', value: 120, level: 42 },
            { rank: 7, name: 'Committed', avatar: '🌟', value: 90, level: 35 },
            { rank: 8, name: 'Active', avatar: '⚡', value: 60, level: 28 },
            { rank: 9, name: 'Growing', avatar: '🌱', value: 45, level: 22 },
            { rank: 10, name: 'Starter', avatar: '🚀', value: 30, level: 18 }
        ],
        slide: [
            { rank: 1, name: 'SlideKing', avatar: '🎢', value: 985000, level: 78 },
            { rank: 2, name: 'RabbitHole', avatar: '🕳️', value: 820000, level: 65 },
            { rank: 3, name: 'FallMaster', avatar: '🌀', value: 680000, level: 55 },
            { rank: 4, name: 'CoinMagnet', avatar: '🧲', value: 520000, level: 48 },
            { rank: 5, name: 'Collector', avatar: '💰', value: 420000, level: 42 },
            { rank: 6, name: 'Slider', avatar: '🛷', value: 350000, level: 36 },
            { rank: 7, name: 'Glider', avatar: '🪂', value: 280000, level: 30 },
            { rank: 8, name: 'Rookie', avatar: '🌟', value: 210000, level: 25 },
            { rank: 9, name: 'Beginner', avatar: '🎮', value: 150000, level: 20 },
            { rank: 10, name: 'Newbie', avatar: '👶', value: 80000, level: 15 }
        ]
    },
    
    // Initialize leaderboard
    init() {
        // Load real data from backend if available
        if (typeof Backend !== 'undefined') {
            this.loadFromBackend();
        }
        this.render();
    },
    
    // Load data from backend
    loadFromBackend() {
        const categories = ['coins', 'taps', 'level', 'streak', 'slide'];
        
        categories.forEach(cat => {
            const data = Backend.getTopPlayers(cat, 15);
            if (data && data.length > 0) {
                this.fakeData[cat] = data;
            }
        });
    },
    
    // Render leaderboard page content
    render() {
        const container = document.getElementById('leaderboardContent');
        if (!container) return;
        
        const categories = DATA.leaderboardCategories;
        const currentData = this.fakeData[this.currentCategory] || [];
        
        // Get player's rank (simulated)
        const playerRank = this.getPlayerRank();
        
        container.innerHTML = `
            <!-- Category Tabs -->
            <div class="lb-tabs">
                ${categories.map(cat => `
                    <div class="lb-tab ${cat.id === this.currentCategory ? 'active' : ''}" 
                         onclick="Leaderboard.switchCategory('${cat.id}')">
                        <span class="lb-tab-icon">${cat.icon}</span>
                        <span class="lb-tab-name">${cat.name}</span>
                    </div>
                `).join('')}
            </div>
            
            <!-- Player Card -->
            <div class="lb-player-card">
                <div class="lb-player-rank">#${playerRank.rank}</div>
                <div class="lb-player-avatar">🐛</div>
                <div class="lb-player-info">
                    <div class="lb-player-name">You</div>
                    <div class="lb-player-level">Level ${Game.state.level}</div>
                </div>
                <div class="lb-player-value">${this.formatValue(playerRank.value, this.currentCategory)}</div>
            </div>
            
            <!-- Top 3 Podium -->
            <div class="lb-podium">
                ${currentData.slice(0, 3).map((player, i) => `
                    <div class="lb-podium-item ${['second', 'first', 'third'][i === 0 ? 1 : i === 1 ? 0 : 2]}">
                        <div class="lb-podium-crown">${['🥈', '🥇', '🥉'][i]}</div>
                        <div class="lb-podium-avatar">${player.avatar}</div>
                        <div class="lb-podium-name">${player.name}</div>
                        <div class="lb-podium-value">${this.formatValue(player.value, this.currentCategory)}</div>
                        <div class="lb-podium-stand"></div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Rankings List -->
            <div class="lb-list">
                ${currentData.slice(3).map(player => `
                    <div class="lb-item">
                        <div class="lb-item-rank ${player.rank <= 10 ? 'top10' : ''}">#${player.rank}</div>
                        <div class="lb-item-avatar">${player.avatar}</div>
                        <div class="lb-item-info">
                            <div class="lb-item-name">${player.name}</div>
                            <div class="lb-item-level">Lv.${player.level}</div>
                        </div>
                        <div class="lb-item-value">${this.formatValue(player.value, this.currentCategory)}</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Weekly Reset Notice -->
            <div class="lb-reset-notice">
                <span>🔄</span> Rankings reset every Monday at 00:00 UTC
            </div>
        `;
    },
    
    // Switch category
    switchCategory(category) {
        this.currentCategory = category;
        this.render();
    },
    
    // Get player's rank (simulated)
    getPlayerRank() {
        let value = 0;
        switch (this.currentCategory) {
            case 'coins': value = Game.state.coins; break;
            case 'taps': value = Game.state.totalTaps; break;
            case 'level': value = Game.state.level; break;
            case 'streak': value = Game.state.maxStreak || Game.state.streak; break;
            case 'slide': value = Game.state.slideHighScore || 0; break;
        }
        
        // Simulate rank based on value
        const data = this.fakeData[this.currentCategory];
        let rank = 1;
        for (const player of data) {
            if (value < player.value) rank++;
        }
        
        return { rank: Math.max(rank, 11), value };
    },
    
    // Format value based on category
    formatValue(value, category) {
        if (category === 'level' || category === 'streak') {
            return value.toLocaleString();
        }
        
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
    }
};

// Add leaderboard styles
const lbStyles = document.createElement('style');
lbStyles.textContent = `
    .lb-tabs {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 10px 15px;
        margin: -10px -15px 15px;
        background: rgba(0,0,0,0.3);
    }
    
    .lb-tabs::-webkit-scrollbar { display: none; }
    
    .lb-tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 14px;
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
    }
    
    .lb-tab.active {
        background: linear-gradient(135deg, var(--gold), #d4a000);
        border-color: var(--gold);
        color: #000;
    }
    
    .lb-tab-icon { font-size: 1.2rem; }
    .lb-tab-name { font-size: 0.65rem; font-weight: 600; }
    
    .lb-player-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,0,255,0.1));
        border: 2px solid var(--gold);
        border-radius: 15px;
        margin-bottom: 20px;
    }
    
    .lb-player-rank {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--gold);
        min-width: 45px;
    }
    
    .lb-player-avatar {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--purple), var(--pink));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
    }
    
    .lb-player-info { flex: 1; }
    .lb-player-name { font-weight: 700; font-size: 1.1rem; }
    .lb-player-level { font-size: 0.8rem; opacity: 0.7; }
    
    .lb-player-value {
        font-weight: 800;
        font-size: 1.1rem;
        color: var(--cyan);
    }
    
    .lb-podium {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 10px;
        margin-bottom: 25px;
        padding: 0 10px;
    }
    
    .lb-podium-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90px;
    }
    
    .lb-podium-item.first { order: 2; }
    .lb-podium-item.second { order: 1; }
    .lb-podium-item.third { order: 3; }
    
    .lb-podium-crown { font-size: 1.8rem; margin-bottom: 5px; }
    
    .lb-podium-avatar {
        width: 55px;
        height: 55px;
        background: var(--card);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        border: 3px solid;
        margin-bottom: -10px;
        z-index: 2;
    }
    
    .lb-podium-item.first .lb-podium-avatar { 
        width: 65px; height: 65px; font-size: 2rem;
        border-color: var(--gold); 
        box-shadow: 0 0 20px rgba(255,215,0,0.5);
    }
    .lb-podium-item.second .lb-podium-avatar { border-color: #c0c0c0; }
    .lb-podium-item.third .lb-podium-avatar { border-color: #cd7f32; }
    
    .lb-podium-name {
        font-weight: 700;
        font-size: 0.75rem;
        margin-top: 15px;
        text-align: center;
    }
    
    .lb-podium-value {
        font-size: 0.7rem;
        color: var(--cyan);
        margin-top: 2px;
    }
    
    .lb-podium-stand {
        width: 100%;
        border-radius: 8px 8px 0 0;
        margin-top: 8px;
    }
    
    .lb-podium-item.first .lb-podium-stand {
        height: 80px;
        background: linear-gradient(180deg, var(--gold), #b8860b);
    }
    .lb-podium-item.second .lb-podium-stand {
        height: 60px;
        background: linear-gradient(180deg, #c0c0c0, #808080);
    }
    .lb-podium-item.third .lb-podium-stand {
        height: 45px;
        background: linear-gradient(180deg, #cd7f32, #8b4513);
    }
    
    .lb-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-bottom: 80px;
    }
    
    .lb-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        background: var(--card);
        border-radius: 12px;
    }
    
    .lb-item-rank {
        font-weight: 700;
        font-size: 0.9rem;
        min-width: 35px;
        color: rgba(255,255,255,0.6);
    }
    
    .lb-item-rank.top10 { color: var(--gold); }
    
    .lb-item-avatar {
        width: 40px;
        height: 40px;
        background: rgba(0,0,0,0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
    }
    
    .lb-item-info { flex: 1; }
    .lb-item-name { font-weight: 600; font-size: 0.9rem; }
    .lb-item-level { font-size: 0.7rem; opacity: 0.6; }
    .lb-item-value { font-weight: 700; color: var(--cyan); }
    
    .lb-reset-notice {
        text-align: center;
        padding: 15px;
        font-size: 0.75rem;
        opacity: 0.6;
    }
`;
document.head.appendChild(lbStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Leaderboard;
}
