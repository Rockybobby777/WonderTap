// ==================== BACKEND SIMULATION MODULE ====================
// Simulates server-side functionality for leaderboards and cloud sync
// In production, replace with real API calls

const Backend = {
    // API endpoint (would be your real server in production)
    apiUrl: 'https://api.wondertap.game', // Placeholder
    
    // Local storage keys for simulation
    storageKeys: {
        leaderboard: 'wondertap_leaderboard',
        globalStats: 'wondertap_global_stats',
        referrals: 'wondertap_referrals'
    },
    
    // Initialize backend
    init() {
        this.initializeLeaderboard();
        this.initializeGlobalStats();
    },
    
    // ==================== LEADERBOARD ====================
    
    // Initialize leaderboard with sample data
    initializeLeaderboard() {
        if (localStorage.getItem(this.storageKeys.leaderboard)) return;
        
        // Create sample leaderboard data
        const sampleData = {
            coins: this.generateSamplePlayers('coins'),
            taps: this.generateSamplePlayers('taps'),
            level: this.generateSamplePlayers('level'),
            streak: this.generateSamplePlayers('streak'),
            slide: this.generateSamplePlayers('slide')
        };
        
        localStorage.setItem(this.storageKeys.leaderboard, JSON.stringify(sampleData));
    },
    
    // Generate sample players for leaderboard
    generateSamplePlayers(category) {
        const names = [
            'CryptoKing', 'TapMaster', 'AliceQueen', 'MadHatter', 'CheshireCat',
            'WhiteRabbit', 'Caterpillar', 'TweedleDee', 'Dormouse', 'CardSoldier',
            'RedQueen', 'MarchHare', 'Absolem', 'Bandersnatch', 'JubJubBird'
        ];
        
        const avatars = ['👑', '🎯', '👸', '🎩', '😸', '🐰', '🐛', '🎭', '🐭', '♠️', '❤️', '🐰', '🦋', '🐉', '🦅'];
        
        const players = [];
        
        for (let i = 0; i < 15; i++) {
            let value;
            switch (category) {
                case 'coins':
                    value = Math.floor(15000000 * Math.pow(0.75, i) + Math.random() * 500000);
                    break;
                case 'taps':
                    value = Math.floor(5000000 * Math.pow(0.78, i) + Math.random() * 200000);
                    break;
                case 'level':
                    value = Math.floor(120 - i * 6 - Math.random() * 3);
                    break;
                case 'streak':
                    value = Math.floor(365 * Math.pow(0.82, i) + Math.random() * 10);
                    break;
                case 'slide':
                    value = Math.floor(1000000 * Math.pow(0.8, i) + Math.random() * 50000);
                    break;
            }
            
            players.push({
                rank: i + 1,
                id: `bot_${i}`,
                name: names[i],
                avatar: avatars[i],
                value: value,
                level: Math.floor(50 + Math.random() * 70)
            });
        }
        
        return players;
    },
    
    // Get leaderboard data
    getLeaderboard(category) {
        const data = JSON.parse(localStorage.getItem(this.storageKeys.leaderboard) || '{}');
        return data[category] || [];
    },
    
    // Submit score to leaderboard
    submitScore(category, score) {
        const data = JSON.parse(localStorage.getItem(this.storageKeys.leaderboard) || '{}');
        const leaderboard = data[category] || [];
        
        // Get player info
        const player = {
            id: Game.state.telegramId || 'local_player',
            name: Game.state.username || 'You',
            avatar: '🐛',
            value: score,
            level: Game.state.level
        };
        
        // Remove existing entry for this player
        const existingIndex = leaderboard.findIndex(p => p.id === player.id);
        if (existingIndex !== -1) {
            // Only update if new score is higher
            if (leaderboard[existingIndex].value >= score) {
                return this.getPlayerRank(category, score);
            }
            leaderboard.splice(existingIndex, 1);
        }
        
        // Add player to leaderboard
        leaderboard.push(player);
        
        // Sort by value (descending)
        leaderboard.sort((a, b) => b.value - a.value);
        
        // Update ranks
        leaderboard.forEach((p, i) => p.rank = i + 1);
        
        // Keep top 100
        if (leaderboard.length > 100) {
            leaderboard.length = 100;
        }
        
        // Save
        data[category] = leaderboard;
        localStorage.setItem(this.storageKeys.leaderboard, JSON.stringify(data));
        
        return this.getPlayerRank(category, score);
    },
    
    // Get player's rank
    getPlayerRank(category, score) {
        const leaderboard = this.getLeaderboard(category);
        const playerId = Game.state.telegramId || 'local_player';
        
        // Find player in leaderboard
        const playerEntry = leaderboard.find(p => p.id === playerId);
        if (playerEntry) {
            return { rank: playerEntry.rank, total: leaderboard.length };
        }
        
        // Calculate estimated rank if not in top 100
        let rank = 1;
        for (const player of leaderboard) {
            if (score < player.value) rank++;
        }
        
        return { rank: Math.max(rank, leaderboard.length + 1), total: leaderboard.length };
    },
    
    // Get top players
    getTopPlayers(category, limit = 10) {
        const leaderboard = this.getLeaderboard(category);
        return leaderboard.slice(0, limit);
    },
    
    // ==================== GLOBAL STATS ====================
    
    // Initialize global stats
    initializeGlobalStats() {
        if (localStorage.getItem(this.storageKeys.globalStats)) return;
        
        const stats = {
            totalPlayers: 12847,
            totalTaps: 8472619453,
            totalCoinsEarned: 294857261934,
            activePlayers24h: 3421,
            gamesPlayedToday: 15234
        };
        
        localStorage.setItem(this.storageKeys.globalStats, JSON.stringify(stats));
    },
    
    // Get global stats
    getGlobalStats() {
        return JSON.parse(localStorage.getItem(this.storageKeys.globalStats) || '{}');
    },
    
    // Update global stats (simulated)
    updateGlobalStats(taps, coins) {
        const stats = this.getGlobalStats();
        stats.totalTaps = (stats.totalTaps || 0) + taps;
        stats.totalCoinsEarned = (stats.totalCoinsEarned || 0) + coins;
        localStorage.setItem(this.storageKeys.globalStats, JSON.stringify(stats));
    },
    
    // ==================== REFERRALS ====================
    
    // Track referral
    trackReferral(referrerId, newPlayerId) {
        const referrals = JSON.parse(localStorage.getItem(this.storageKeys.referrals) || '{}');
        
        if (!referrals[referrerId]) {
            referrals[referrerId] = [];
        }
        
        // Check if already referred
        if (!referrals[referrerId].includes(newPlayerId)) {
            referrals[referrerId].push(newPlayerId);
            localStorage.setItem(this.storageKeys.referrals, JSON.stringify(referrals));
            return true;
        }
        
        return false;
    },
    
    // Get referral count
    getReferralCount(playerId) {
        const referrals = JSON.parse(localStorage.getItem(this.storageKeys.referrals) || '{}');
        return (referrals[playerId] || []).length;
    },
    
    // Get referrals list
    getReferrals(playerId) {
        const referrals = JSON.parse(localStorage.getItem(this.storageKeys.referrals) || '{}');
        return referrals[playerId] || [];
    },
    
    // ==================== CLOUD SYNC ====================
    
    // Sync game state to "cloud" (localStorage simulation)
    syncToCloud(gameState) {
        const playerId = gameState.telegramId || 'local_player';
        const cloudKey = `wondertap_cloud_${playerId}`;
        
        const cloudData = {
            ...gameState,
            lastSync: Date.now(),
            version: '3.0'
        };
        
        localStorage.setItem(cloudKey, JSON.stringify(cloudData));
        
        // Also submit scores to leaderboards
        this.submitScore('coins', gameState.coins);
        this.submitScore('taps', gameState.totalTaps);
        this.submitScore('level', gameState.level);
        this.submitScore('streak', gameState.maxStreak || gameState.streak);
        if (gameState.slideHighScore) {
            this.submitScore('slide', gameState.slideHighScore);
        }
        
        return true;
    },
    
    // Load from cloud
    loadFromCloud(playerId) {
        const cloudKey = `wondertap_cloud_${playerId}`;
        const data = localStorage.getItem(cloudKey);
        
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return null;
            }
        }
        
        return null;
    },
    
    // ==================== DAILY CHALLENGES ====================
    
    // Get today's daily challenge
    getDailyChallenge() {
        const today = new Date().toDateString();
        const savedChallenge = localStorage.getItem('wondertap_daily_challenge');
        
        if (savedChallenge) {
            const challenge = JSON.parse(savedChallenge);
            if (challenge.date === today) {
                return challenge;
            }
        }
        
        // Generate new challenge
        const challenges = [
            { type: 'taps', target: 5000, reward: { coins: 5000 }, desc: 'Tap 5,000 times' },
            { type: 'combo', target: 50, reward: { coins: 3000, gems: 5 }, desc: 'Reach 50 combo' },
            { type: 'fever', target: 10, reward: { coins: 4000 }, desc: 'Trigger Fever 10 times' },
            { type: 'slide', target: 50000, reward: { gems: 15 }, desc: 'Score 50K in Slide' },
            { type: 'spins', target: 10, reward: { coins: 2500 }, desc: 'Spin the wheel 10 times' },
            { type: 'cards', target: 3, reward: { coins: 3000, gems: 3 }, desc: 'Win 3 Card Flip games' }
        ];
        
        const challenge = {
            date: today,
            ...challenges[Math.floor(Math.random() * challenges.length)],
            progress: 0,
            completed: false,
            claimed: false
        };
        
        localStorage.setItem('wondertap_daily_challenge', JSON.stringify(challenge));
        return challenge;
    },
    
    // Update daily challenge progress
    updateDailyChallengeProgress(type, amount) {
        const challenge = this.getDailyChallenge();
        
        if (challenge.type !== type || challenge.claimed) return;
        
        challenge.progress = Math.min(challenge.progress + amount, challenge.target);
        
        if (challenge.progress >= challenge.target) {
            challenge.completed = true;
        }
        
        localStorage.setItem('wondertap_daily_challenge', JSON.stringify(challenge));
        
        return challenge;
    },
    
    // Claim daily challenge reward
    claimDailyChallengeReward() {
        const challenge = this.getDailyChallenge();
        
        if (!challenge.completed || challenge.claimed) {
            return null;
        }
        
        challenge.claimed = true;
        localStorage.setItem('wondertap_daily_challenge', JSON.stringify(challenge));
        
        return challenge.reward;
    }
};

// Add backend-related styles
const backendStyles = document.createElement('style');
backendStyles.textContent = `
    .daily-challenge-card {
        background: linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.1));
        border: 2px solid var(--pink);
        border-radius: 15px;
        padding: 15px;
        margin: 15px;
    }
    
    .daily-challenge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .daily-challenge-title {
        font-weight: 700;
        color: var(--pink);
    }
    
    .daily-challenge-timer {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    .daily-challenge-desc {
        font-size: 0.9rem;
        margin-bottom: 10px;
    }
    
    .daily-challenge-progress {
        height: 10px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .daily-challenge-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--pink), var(--cyan));
        border-radius: 5px;
        transition: width 0.3s;
    }
    
    .daily-challenge-reward {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .daily-challenge-reward-text {
        font-size: 0.85rem;
        color: var(--gold);
    }
    
    .daily-challenge-claim-btn {
        padding: 8px 20px;
        background: linear-gradient(135deg, var(--green), #00cc6a);
        border: none;
        border-radius: 20px;
        color: #000;
        font-weight: 700;
        cursor: pointer;
    }
    
    .daily-challenge-claim-btn:disabled {
        background: #444;
        color: #666;
        cursor: not-allowed;
    }
    
    .global-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 15px;
    }
    
    .global-stat-item {
        background: var(--card);
        padding: 12px;
        border-radius: 12px;
        text-align: center;
    }
    
    .global-stat-value {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--cyan);
    }
    
    .global-stat-label {
        font-size: 0.7rem;
        opacity: 0.7;
        margin-top: 3px;
    }
`;
document.head.appendChild(backendStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Backend;
}
