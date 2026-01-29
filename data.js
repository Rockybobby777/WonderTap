// ==================== WONDERTAP DATA ====================
// Toutes les configurations et données du jeu

const DATA = {
    // ========== ECONOMY SETTINGS ==========
    economy: {
        wontimePerTap: 1,           // 1 tap = 1 WONTIME
        wontimeToCoin: 200,         // 200 WONTIME = 1 COIN
        wontimeIcon: '🐰🕰️',
        coinIcon: '🪙',
        gemIcon: '💎',
        starIcon: '⭐'
    },

    // ========== WHEEL PRIZES (REDUCED) ==========
    wheelPrizes: [
        { id: 'coins10', icon: '🪙', label: '10', value: 10, type: 'coins', color: '#e74c3c', weight: 20 },
        { id: 'coins25', icon: '🪙', label: '25', value: 25, type: 'coins', color: '#3498db', weight: 15 },
        { id: 'coins50', icon: '🪙', label: '50', value: 50, type: 'coins', color: '#f39c12', weight: 10 },
        { id: 'coins100', icon: '🪙', label: '100', value: 100, type: 'coins', color: '#e67e22', weight: 5 },
        { id: 'gems1', icon: '💎', label: '1', value: 1, type: 'gems', color: '#9b59b6', weight: 15 },
        { id: 'gems2', icon: '💎', label: '2', value: 2, type: 'gems', color: '#8e44ad', weight: 8 },
        { id: 'gems3', icon: '💎', label: '3', value: 3, type: 'gems', color: '#6c3483', weight: 3 },
        { id: 'energy50', icon: '⚡', label: '+50', value: 50, type: 'energy', color: '#2ecc71', weight: 12 },
        { id: 'energy100', icon: '⚡', label: '+100', value: 100, type: 'energy', color: '#27ae60', weight: 6 },
        { id: 'mystery', icon: '🎁', label: '???', value: 0, type: 'mystery', color: '#ff6b9d', weight: 8 },
        { id: 'miniGame', icon: '🎮', label: 'SLIDE!', value: 1, type: 'minigame', color: '#00ff88', weight: 2 },
        { id: 'jackpot', icon: '👑', label: 'JACKPOT', value: 500, type: 'coins', color: '#ffd700', weight: 1 }
    ],

    // ========== SHOP - SKINS (PRICES INCREASED) ==========
    skins: [
        { id: 'classic', name: 'Classic Caterpillar', icon: '🐛', head: '🐛', desc: 'The original', price: 0, currency: 'free', owned: true, rarity: 'common' },
        { id: 'rainbow', name: 'Rainbow', icon: '🌈', head: '🌈', desc: 'Colorful vibes', price: 5000, currency: 'coins', rarity: 'common' },
        { id: 'golden', name: 'Golden', icon: '✨', head: '👑', desc: 'Shiny & rich', price: 15000, currency: 'coins', rarity: 'rare' },
        { id: 'neon', name: 'Neon Glow', icon: '💜', head: '💜', desc: 'Glow in the dark', price: 25000, currency: 'coins', rarity: 'rare' },
        { id: 'galaxy', name: 'Galaxy', icon: '🌌', head: '🌟', desc: 'Cosmic beauty', price: 50, currency: 'gems', rarity: 'epic' },
        { id: 'diamond', name: 'Diamond', icon: '💎', head: '💎', desc: 'Pure luxury', price: 120, currency: 'gems', rarity: 'epic' },
        { id: 'fire', name: 'Inferno', icon: '🔥', head: '😈', desc: 'Hot hot hot!', price: 80, currency: 'gems', rarity: 'epic' },
        { id: 'ice', name: 'Frost', icon: '❄️', head: '🥶', desc: 'Ice cold', price: 80, currency: 'gems', rarity: 'epic' },
        { id: 'zombie', name: 'Zombie', icon: '🧟', head: '🧟', desc: 'Undead vibes', price: 40000, currency: 'coins', rarity: 'rare' },
        { id: 'alien', name: 'Alien', icon: '👽', head: '👽', desc: 'Out of this world', price: 180, currency: 'gems', rarity: 'legendary' },
        { id: 'cheshire', name: 'Cheshire Cat', icon: '😸', head: '😸', desc: 'Mysterious smile', price: 150, currency: 'gems', rarity: 'legendary' },
        { id: 'madhatter', name: 'Mad Hatter', icon: '🎩', head: '🎩', desc: 'Tea time!', price: 220, currency: 'gems', rarity: 'legendary' },
        { id: 'queen', name: 'Red Queen', icon: '👑', head: '👸', desc: 'Off with heads!', price: 280, currency: 'gems', rarity: 'legendary' },
        { id: 'rabbit', name: 'White Rabbit', icon: '🐰', head: '🐰', desc: "I'm late!", price: 100, currency: 'gems', rarity: 'epic' },
        { id: 'mushroom', name: 'Mushroom King', icon: '🍄', head: '🍄', desc: 'Trippy vibes', price: 60000, currency: 'coins', rarity: 'epic' },
        { id: 'clown', name: 'Evil Clown', icon: '🤡', head: '🤡', desc: 'Creepy & scary!', price: 200, currency: 'gems', rarity: 'legendary' },
        { id: 'shark', name: 'Hammer Shark', icon: '🦈', head: '🦈', desc: 'Deadly predator!', price: 250, currency: 'gems', rarity: 'legendary' },
        { id: 'skull', name: 'Death', icon: '💀', head: '💀', desc: 'Fear the reaper', price: 300, currency: 'gems', rarity: 'legendary' },
        { id: 'dragon', name: 'Jabberwocky', icon: '🐉', head: '🐲', desc: 'LEGENDARY DRAGON! Full transformation!', price: 500, currency: 'stars', rarity: 'mythic' },
        { id: 'void', name: 'Void Walker', icon: '🕳️', head: '👁️', desc: 'FROM THE ABYSS! Dark power!', price: 400, currency: 'stars', rarity: 'mythic' },
        { id: 'crystal', name: 'Crystal Oracle', icon: '🔮', head: '🔮', desc: 'SEE THE FUTURE! Magic power!', price: 350, currency: 'stars', rarity: 'mythic' },
        { id: 'phoenix', name: 'Phoenix', icon: '🦅', head: '🔥', desc: 'RISE FROM ASHES! Fire rebirth!', price: 600, currency: 'stars', rarity: 'mythic' }
    ],

    // ========== SHOP - BACKGROUNDS (PRICES INCREASED) ==========
    backgrounds: [
        { id: 'night', name: 'Wonderland Night', icon: '🌙', desc: 'Default mystical', price: 0, currency: 'free', owned: true, rarity: 'common' },
        { id: 'teaparty', name: 'Tea Party', icon: '🫖', desc: 'Mad Hatter style', price: 8000, currency: 'coins', rarity: 'common' },
        { id: 'garden', name: "Queen's Garden", icon: '🌹', desc: 'Royal roses', price: 18000, currency: 'coins', rarity: 'rare' },
        { id: 'mushforest', name: 'Mushroom Forest', icon: '🍄', desc: 'Giant shrooms', price: 35000, currency: 'coins', rarity: 'rare' },
        { id: 'rabbithole', name: 'Rabbit Hole', icon: '🕳️', desc: 'Falling forever', price: 65, currency: 'gems', rarity: 'epic' },
        { id: 'chessboard', name: 'Chess Board', icon: '♟️', desc: 'Red vs White', price: 90, currency: 'gems', rarity: 'epic' },
        { id: 'space', name: 'Space Trip', icon: '🚀', desc: 'Among the stars', price: 120, currency: 'gems', rarity: 'epic' },
        { id: 'underwater', name: 'Underwater', icon: '🐠', desc: 'Deep sea wonder', price: 80, currency: 'gems', rarity: 'epic' },
        { id: 'candyland', name: 'Candy Land', icon: '🍭', desc: 'Sweet dreams', price: 50000, currency: 'coins', rarity: 'rare' },
        { id: 'mirror', name: 'Looking Glass', icon: '🪞', desc: 'Through the mirror', price: 150, currency: 'gems', rarity: 'legendary' },
        { id: 'clockwork', name: 'Clockwork', icon: '⚙️', desc: 'Time is ticking', price: 140, currency: 'gems', rarity: 'legendary' },
        { id: 'aurora', name: 'Aurora Dreams', icon: '🌌', desc: 'Northern lights', price: 200, currency: 'gems', rarity: 'legendary' },
        { id: 'psychedelic', name: 'Pure Psychedelic', icon: '🌀', desc: 'Maximum trippy', price: 300, currency: 'stars', rarity: 'mythic' },
        { id: 'void', name: 'The Void', icon: '⬛', desc: 'Infinite darkness', price: 350, currency: 'stars', rarity: 'mythic' }
    ],

    // ========== SHOP - EFFECTS (PRICES INCREASED) ==========
    effects: [
        { id: 'classic', name: 'Classic Stars', icon: '⭐', desc: 'Default sparkles', price: 0, currency: 'free', owned: true, rarity: 'common' },
        { id: 'hearts', name: 'Hearts', icon: '💖', desc: 'Love taps', price: 12000, currency: 'coins', rarity: 'common' },
        { id: 'fire', name: 'Fire Burst', icon: '🔥', desc: 'Hot taps', price: 20000, currency: 'coins', rarity: 'rare' },
        { id: 'lightning', name: 'Lightning', icon: '⚡', desc: 'Electric shock!', price: 40, currency: 'gems', rarity: 'rare' },
        { id: 'bubbles', name: 'Bubbles', icon: '🫧', desc: 'Pop pop pop', price: 25000, currency: 'coins', rarity: 'rare' },
        { id: 'confetti', name: 'Confetti', icon: '🎊', desc: 'Party time!', price: 65, currency: 'gems', rarity: 'epic' },
        { id: 'snow', name: 'Snowflakes', icon: '❄️', desc: 'Winter magic', price: 30000, currency: 'coins', rarity: 'rare' },
        { id: 'petals', name: 'Rose Petals', icon: '🌸', desc: 'Flower power', price: 55, currency: 'gems', rarity: 'epic' },
        { id: 'music', name: 'Music Notes', icon: '🎵', desc: 'Feel the beat', price: 50, currency: 'gems', rarity: 'epic' },
        { id: 'cards', name: 'Playing Cards', icon: '🃏', desc: 'Card storm', price: 75, currency: 'gems', rarity: 'epic' },
        { id: 'butterflies', name: 'Butterflies', icon: '🦋', desc: 'Flutter away', price: 100, currency: 'gems', rarity: 'legendary' },
        { id: 'rainbow', name: 'Rainbow Trail', icon: '🌈', desc: 'Colorful magic', price: 120, currency: 'gems', rarity: 'legendary' },
        { id: 'galaxy', name: 'Galaxy Dust', icon: '✨', desc: 'Cosmic particles', price: 250, currency: 'stars', rarity: 'mythic' },
        { id: 'glitch', name: 'Glitch', icon: '📺', desc: 'Reality breaks', price: 300, currency: 'stars', rarity: 'mythic' }
    ],

    // ========== SHOP - BOOSTS ==========
    boosts: [
        { id: 'x2_1h', name: 'x2 Coins', icon: '✖️2️⃣', desc: '1 hour', price: 2000, currency: 'coins', duration: 3600 },
        { id: 'x3_30m', name: 'x3 Coins', icon: '✖️3️⃣', desc: '30 minutes', price: 10, currency: 'gems', duration: 1800 },
        { id: 'x5_15m', name: 'x5 Coins', icon: '✖️5️⃣', desc: '15 minutes', price: 25, currency: 'gems', duration: 900 },
        { id: 'energy_full', name: 'Full Energy', icon: '⚡', desc: 'Instant refill', price: 10, currency: 'gems', duration: 0 },
        { id: 'energy_infinite', name: 'Infinite Energy', icon: '♾️', desc: '30 minutes', price: 50, currency: 'gems', duration: 1800 },
        { id: 'autotap_1h', name: 'Auto-Tap', icon: '🤖', desc: '1 hour', price: 75, currency: 'gems', duration: 3600 },
        { id: 'lucky_charm', name: 'Lucky Charm', icon: '🍀', desc: '+50% wheel luck (1h)', price: 5000, currency: 'coins', duration: 3600 },
        { id: 'magnet', name: 'Coin Magnet', icon: '🧲', desc: '+20% coins (2h)', price: 8000, currency: 'coins', duration: 7200 },
        { id: 'fever_boost', name: 'Fever Boost', icon: '🔥', desc: 'Instant Fever!', price: 15, currency: 'gems', duration: 0 },
        { id: 'shield', name: 'Combo Shield', icon: '🛡️', desc: 'Keep combo 5min', price: 20, currency: 'gems', duration: 300 }
    ],

    // ========== SHOP - PREMIUM (Telegram Stars) ==========
    premium: [
        { id: 'starter_pack', name: 'Starter Pack', icon: '📦', desc: '10K coins + 50 gems', price: 50, currency: 'stars', coins: 10000, gems: 50 },
        { id: 'pro_pack', name: 'Pro Pack', icon: '💼', desc: '50K coins + 200 gems', price: 150, currency: 'stars', coins: 50000, gems: 200 },
        { id: 'mega_pack', name: 'Mega Pack', icon: '🎁', desc: '200K coins + 500 gems', price: 400, currency: 'stars', coins: 200000, gems: 500 },
        { id: 'vip_pass', name: 'VIP Pass', icon: '👑', desc: '30 days perks', price: 300, currency: 'stars', duration: 30 },
        { id: 'no_ads', name: 'No Ads Forever', icon: '🚫', desc: 'Remove all ads', price: 500, currency: 'stars', permanent: true },
        { id: 'spin_pack', name: 'Spin Pack', icon: '🎡', desc: '+50 spins', price: 100, currency: 'stars', spins: 50 },
        { id: 'minigame_pass', name: 'Mini-Game Pass', icon: '🎮', desc: 'Unlimited slides (7 days)', price: 200, currency: 'stars', duration: 7 }
    ],

    // ========== UPGRADES ==========
    upgrades: {
        tap: { name: 'Tap Power', icon: '🐛', desc: '+1 coin per tap', baseCost: 500, currency: 'coins', multiplier: 1.5 },
        energy: { name: 'Max Energy', icon: '⚡', desc: '+200 energy capacity', baseCost: 1000, currency: 'coins', multiplier: 1.8 },
        regen: { name: 'Energy Regen', icon: '🔄', desc: '+1 energy per second', baseCost: 2000, currency: 'coins', multiplier: 2 },
        fever: { name: 'Fever Power', icon: '🔥', desc: '+10% fever bonus', baseCost: 15, currency: 'gems', multiplier: 1.5 },
        luck: { name: 'Cheshire Luck', icon: '😺', desc: '+5% random 2x chance', baseCost: 25, currency: 'gems', multiplier: 1.5 },
        feverDuration: { name: 'Fever Duration', icon: '⏱️', desc: '+2s fever time', baseCost: 20, currency: 'gems', multiplier: 1.4 },
        comboKeep: { name: 'Combo Keeper', icon: '🔗', desc: '+0.5s combo window', baseCost: 3000, currency: 'coins', multiplier: 1.6 }
    },

    // ========== DAILY QUESTS ==========
    dailyQuests: [
        { id: 'tap500', name: 'Tap 500 times', icon: '👆', target: 500, reward: 500, currency: 'coins' },
        { id: 'tap2000', name: 'Tap 2,000 times', icon: '👆', target: 2000, reward: 2000, currency: 'coins' },
        { id: 'tap5000', name: 'Tap 5,000 times', icon: '👆', target: 5000, reward: 10, currency: 'gems' },
        { id: 'combo15', name: 'Reach x15 combo', icon: '🔥', target: 15, reward: 5, currency: 'gems' },
        { id: 'combo30', name: 'Reach x30 combo', icon: '🔥', target: 30, reward: 15, currency: 'gems' },
        { id: 'combo50', name: 'Reach x50 combo', icon: '🔥', target: 50, reward: 30, currency: 'gems' },
        { id: 'spin3', name: 'Spin wheel 3 times', icon: '🎡', target: 3, reward: 1000, currency: 'coins' },
        { id: 'spin10', name: 'Spin wheel 10 times', icon: '🎡', target: 10, reward: 25, currency: 'gems' },
        { id: 'fever2', name: 'Activate Fever 2x', icon: '⚡', target: 2, reward: 3000, currency: 'coins' },
        { id: 'fever5', name: 'Activate Fever 5x', icon: '⚡', target: 5, reward: 20, currency: 'gems' },
        { id: 'ad5', name: 'Watch 5 ads', icon: '📺', target: 5, reward: 1500, currency: 'coins' },
        { id: 'ad15', name: 'Watch 15 ads', icon: '📺', target: 15, reward: 15, currency: 'gems' },
        { id: 'hourly3', name: 'Claim hourly 3 times', icon: '🎁', target: 3, reward: 2000, currency: 'coins' },
        { id: 'buy1', name: 'Buy 1 item', icon: '🛒', target: 1, reward: 5, currency: 'gems' },
        { id: 'slide1', name: 'Play Slide game', icon: '🎮', target: 1, reward: 3000, currency: 'coins' }
    ],

    // ========== WEEKLY QUESTS ==========
    weeklyQuests: [
        { id: 'wtap20k', name: 'Tap 20,000 times', icon: '👆', target: 20000, reward: 10, currency: 'gems' },
        { id: 'wtap100k', name: 'Tap 100,000 times', icon: '👆', target: 100000, reward: 25, currency: 'gems' },
        { id: 'wspin30', name: 'Spin 30 times', icon: '🎡', target: 30, reward: 15, currency: 'gems' },
        { id: 'wstreak7', name: '7 day streak', icon: '🔥', target: 7, reward: 15, currency: 'gems' },
        { id: 'wcoins100k', name: 'Earn 100K coins', icon: '🪙', target: 100000, reward: 20, currency: 'gems' },
        { id: 'wfever20', name: 'Fever 20 times', icon: '⚡', target: 20, reward: 10, currency: 'gems' },
        { id: 'wslide10', name: 'Play Slide 10x', icon: '🎮', target: 10, reward: 15, currency: 'gems' }
    ],

    // ========== ACHIEVEMENTS (REDUCED) ==========
    achievements: [
        { id: 'atap10k', name: '10K Taps', icon: '🏆', target: 10000, reward: 5, currency: 'gems' },
        { id: 'atap100k', name: '100K Taps', icon: '🏆', target: 100000, reward: 15, currency: 'gems' },
        { id: 'atap1m', name: '1M Taps', icon: '🏆', target: 1000000, reward: 50, currency: 'gems' },
        { id: 'acombo50', name: 'x50 Combo', icon: '🔥', target: 50, reward: 8, currency: 'gems' },
        { id: 'acombo100', name: 'x100 Combo', icon: '🔥', target: 100, reward: 20, currency: 'gems' },
        { id: 'acombo200', name: 'x200 Combo', icon: '🔥', target: 200, reward: 40, currency: 'gems' },
        { id: 'alevel10', name: 'Level 10', icon: '⭐', target: 10, reward: 5, currency: 'gems' },
        { id: 'alevel25', name: 'Level 25', icon: '⭐', target: 25, reward: 12, currency: 'gems' },
        { id: 'alevel50', name: 'Level 50', icon: '⭐', target: 50, reward: 30, currency: 'gems' },
        { id: 'alevel100', name: 'Level 100', icon: '⭐', target: 100, reward: 75, currency: 'gems' },
        { id: 'acoins100k', name: '100K Coins Total', icon: '🪙', target: 100000, reward: 8, currency: 'gems' },
        { id: 'acoins1m', name: '1M Coins Total', icon: '🪙', target: 1000000, reward: 30, currency: 'gems' },
        { id: 'astreak30', name: '30 Day Streak', icon: '🔥', target: 30, reward: 50, currency: 'gems' },
        { id: 'askins10', name: 'Own 10 Skins', icon: '🐛', target: 10, reward: 15, currency: 'gems' },
        { id: 'aslide100', name: 'Slide 100 times', icon: '🎮', target: 100, reward: 25, currency: 'gems' },
        { id: 'awontime100k', name: '100K WONTIME', icon: '🐰🕰️', target: 100000, reward: 10, currency: 'gems' },
        { id: 'awontime1m', name: '1M WONTIME', icon: '🐰🕰️', target: 1000000, reward: 50, currency: 'gems' }
    ],

    // ========== STREAK REWARDS (REDUCED) ==========
    streakRewards: [
        { day: 1, coins: 50, gems: 0 },
        { day: 2, coins: 75, gems: 0 },
        { day: 3, coins: 0, gems: 1 },
        { day: 4, coins: 100, gems: 0 },
        { day: 5, coins: 0, gems: 2 },
        { day: 6, coins: 150, gems: 0 },
        { day: 7, coins: 250, gems: 5, bonus: 'mystery_box' }
    ],

    // ========== EVENTS ==========
    events: {
        happyHour: { name: 'Happy Hour', icon: '🎉', multiplier: 2, duration: 3600, description: 'x2 coins for 1 hour!' },
        weekendBonus: { name: 'Weekend Bonus', icon: '🌟', multiplier: 1.5, description: '+50% coins all weekend!' },
        feverFrenzy: { name: 'Fever Frenzy', icon: '🔥', feverBoost: 2, duration: 1800, description: 'x2 fever power!' },
        luckyDay: { name: 'Lucky Day', icon: '🍀', luckBoost: 0.2, duration: 3600, description: '+20% luck on wheel!' },
        spinMania: { name: 'Spin Mania', icon: '🎡', freeSpins: 5, description: '+5 free spins!' }
    },

    // ========== SLIDE MINI-GAME CONFIG ==========
    slideGame: {
        entryFee: { coins: 500 },
        freeFromWheel: true,
        baseSpeed: 5,
        maxSpeed: 15,
        coinValue: 5,
        gemValue: 1,
        gemChance: 0.03,
        obstacles: ['🍄', '🌹', '♠️', '♥️', '🎩', '⏰'],
        powerups: ['🛡️', '🧲', '⚡', '🌟'],
        backgrounds: ['rabbitHole', 'mushroom', 'chessboard', 'candyLand']
    },

    // ========== LEADERBOARD CATEGORIES ==========
    leaderboardCategories: [
        { id: 'wontime', name: 'Top WONTIME', icon: '🐰🕰️' },
        { id: 'coins', name: 'Richest', icon: '🪙' },
        { id: 'taps', name: 'Most Taps', icon: '👆' },
        { id: 'level', name: 'Highest Level', icon: '⭐' },
        { id: 'streak', name: 'Longest Streak', icon: '🔥' },
        { id: 'slide', name: 'Slide Champion', icon: '🎮' }
    ],
    
    // ========== SLIDE GAME CONFIG ==========
    slideGameAlt: {
        entryFee: 1500,
        freeTicketFromWheel: true,
        speeds: { base: 5, max: 15, increment: 0.001 },
        rewards: { coin: 5, gem: 25, obstacleHit: -50 },
        powerups: ['magnet', 'shield', 'x2', 'slow']
    },
    
    // ========== CARD FLIP GAME CONFIG (COST INCREASED) ==========
    cardFlipGame: {
        difficulties: {
            easy: { grid: [3, 4], pairs: 6, time: 45, cost: 500 },
            normal: { grid: [4, 4], pairs: 8, time: 60, cost: 1000 },
            hard: { grid: [4, 5], pairs: 10, time: 90, cost: 1500 }
        },
        matchBonus: 50,
        perfectBonus: 250,
        timeBonus: 5
    },

    // ========== LEVEL XP REQUIREMENTS ==========
    xpPerLevel: (level) => level * 1000,

    // ========== RARITY COLORS ==========
    rarityColors: {
        common: '#95a5a6',
        rare: '#3498db',
        epic: '#9b59b6',
        legendary: '#f39c12',
        mythic: '#e74c3c'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATA;
}
