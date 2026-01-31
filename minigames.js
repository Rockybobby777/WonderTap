// ==================== MINIGAMES MODULE ====================
// Bonus mini-games: Scratch Cards, Slot Machine

const MiniGames = {
    
    // ==================== SCRATCH CARD ====================
    scratch: {
        cost: { coins: 500, gems: 0 },
        freeDaily: 1,
        prizes: [
            { icon: '🪙', value: 100, type: 'coins', weight: 30 },
            { icon: '🪙', value: 250, type: 'coins', weight: 25 },
            { icon: '🪙', value: 500, type: 'coins', weight: 15 },
            { icon: '🪙', value: 1000, type: 'coins', weight: 8 },
            { icon: '💎', value: 2, type: 'gems', weight: 10 },
            { icon: '💎', value: 5, type: 'gems', weight: 5 },
            { icon: '💎', value: 10, type: 'gems', weight: 2 },
            { icon: '⚡', value: 100, type: 'energy', weight: 12 },
            { icon: '🎡', value: 1, type: 'spin', weight: 8 },
            { icon: '🎮', value: 1, type: 'slideTicket', weight: 1 },
            { icon: '💀', value: 0, type: 'nothing', weight: 10 }
        ],
        
        // Generate scratch card
        generate() {
            const cells = [];
            for (let i = 0; i < 9; i++) {
                cells.push(this.getRandomPrize());
            }
            return cells;
        },
        
        // Get random prize based on weight
        getRandomPrize() {
            const totalWeight = this.prizes.reduce((sum, p) => sum + p.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const prize of this.prizes) {
                random -= prize.weight;
                if (random <= 0) return { ...prize };
            }
            return { ...this.prizes[0] };
        }
    },
    
    // ==================== SLOT MACHINE ====================
    slots: {
        cost: { coins: 200, gems: 0 },
        symbols: ['🍒', '🍋', '🍊', '🍇', '⭐', '7️⃣', '💎', '🍄'],
        payouts: {
            '🍒🍒🍒': { coins: 500 },
            '🍋🍋🍋': { coins: 750 },
            '🍊🍊🍊': { coins: 1000 },
            '🍇🍇🍇': { coins: 1500 },
            '⭐⭐⭐': { coins: 2500, gems: 5 },
            '7️⃣7️⃣7️⃣': { coins: 5000, gems: 10 },
            '💎💎💎': { gems: 25 },
            '🍄🍄🍄': { coins: 10000, gems: 20, spin: 3 }
        },
        
        // Spin reels
        spin() {
            const result = [];
            for (let i = 0; i < 3; i++) {
                // Weighted random for slots (rare symbols less likely)
                const weights = [20, 18, 16, 14, 10, 5, 3, 2]; // Cherry most common, mushroom rarest
                const totalWeight = weights.reduce((a, b) => a + b, 0);
                let random = Math.random() * totalWeight;
                
                for (let j = 0; j < this.symbols.length; j++) {
                    random -= weights[j];
                    if (random <= 0) {
                        result.push(this.symbols[j]);
                        break;
                    }
                }
            }
            return result;
        },
        
        // Check win
        checkWin(result) {
            const key = result.join('');
            return this.payouts[key] || null;
        }
    },
    
    // Current states
    currentScratchCard: null,
    scratchedCells: [],
    slotsSpinning: false,
    
    // Initialize
    init() {
        this.checkDailyFreeScratch();
    },
    
    // Check daily free scratch
    checkDailyFreeScratch() {
        const today = new Date().toDateString();
        const lastFree = localStorage.getItem('wondertap_lastFreeScratch');
        
        if (lastFree !== today) {
            Game.state.freeScratchCards = (Game.state.freeScratchCards || 0) + 1;
            localStorage.setItem('wondertap_lastFreeScratch', today);
            Game.save();
        }
    },
    
    // ==================== SCRATCH CARD UI ====================
    openScratchCard() {
        // Check if can play
        const freeScratch = Game.state.freeScratchCards || 0;
        
        if (freeScratch <= 0 && Game.state.coins < this.scratch.cost.coins) {
            UI.showToast('Not enough coins!', 'error');
            return;
        }
        
        // Deduct cost if not free
        if (freeScratch > 0) {
            Game.state.freeScratchCards--;
        } else {
            Game.state.coins -= this.scratch.cost.coins;
        }
        
        // Generate card
        this.currentScratchCard = this.scratch.generate();
        this.scratchedCells = [];
        
        // Show modal
        this.renderScratchCard();
        UI.openModal('scratchModal');
        
        Game.save();
    },
    
    renderScratchCard() {
        const container = document.getElementById('scratchCardGrid');
        if (!container) return;
        
        container.innerHTML = this.currentScratchCard.map((cell, i) => `
            <div class="scratch-cell ${this.scratchedCells.includes(i) ? 'scratched' : ''}"
                 onclick="MiniGames.scratchCell(${i})">
                ${this.scratchedCells.includes(i) ? 
                    `<span class="scratch-prize">${cell.icon}</span>
                     <span class="scratch-value">${cell.value > 0 ? '+' + cell.value : '💀'}</span>` :
                    '<span class="scratch-cover">?</span>'}
            </div>
        `).join('');
        
        // Update remaining counter
        const remaining = 9 - this.scratchedCells.length;
        document.getElementById('scratchRemaining').textContent = remaining;
    },
    
    scratchCell(index) {
        if (this.scratchedCells.includes(index)) return;
        
        this.scratchedCells.push(index);
        this.renderScratchCard();
        
        // Haptic feedback simulation
        if (navigator.vibrate) navigator.vibrate(10);
        
        // All scratched?
        if (this.scratchedCells.length === 9) {
            setTimeout(() => this.collectScratchPrizes(), 500);
        }
    },
    
    scratchAll() {
        for (let i = 0; i < 9; i++) {
            if (!this.scratchedCells.includes(i)) {
                this.scratchedCells.push(i);
            }
        }
        this.renderScratchCard();
        setTimeout(() => this.collectScratchPrizes(), 500);
    },
    
    collectScratchPrizes() {
        let totalCoins = 0;
        let totalGems = 0;
        let totalEnergy = 0;
        let totalSpins = 0;
        let totalSlideTickets = 0;
        
        for (const cell of this.currentScratchCard) {
            switch (cell.type) {
                case 'coins': totalCoins += cell.value; break;
                case 'gems': totalGems += cell.value; break;
                case 'energy': totalEnergy += cell.value; break;
                case 'spin': totalSpins += cell.value; break;
                case 'slideTicket': totalSlideTickets += cell.value; break;
            }
        }
        
        // Apply rewards
        Game.state.coins += totalCoins;
        Game.state.gems += totalGems;
        Game.state.energy = Math.min(Game.state.energyMax, Game.state.energy + totalEnergy);
        Game.state.spins += totalSpins;
        Game.state.freeSlideTickets = (Game.state.freeSlideTickets || 0) + totalSlideTickets;
        
        // Build result text
        let resultParts = [];
        if (totalCoins > 0) resultParts.push(`+${totalCoins}🪙`);
        if (totalGems > 0) resultParts.push(`+${totalGems}💎`);
        if (totalEnergy > 0) resultParts.push(`+${totalEnergy}⚡`);
        if (totalSpins > 0) resultParts.push(`+${totalSpins}🎡`);
        if (totalSlideTickets > 0) resultParts.push(`+${totalSlideTickets}🎮`);
        
        UI.closeModal('scratchModal');
        
        if (resultParts.length > 0) {
            UI.showResult('🎫', 'SCRATCH WIN!', resultParts.join(' '));
            Effects.createConfetti(30);
        } else {
            UI.showResult('💀', 'NO LUCK', 'Better luck next time!');
        }
        
        Game.save();
        Game.updateUI();
    },
    
    // ==================== SLOT MACHINE UI ====================
    openSlots() {
        UI.openModal('slotsModal');
        document.getElementById('slot1').textContent = '❓';
        document.getElementById('slot2').textContent = '❓';
        document.getElementById('slot3').textContent = '❓';
    },
    
    spinSlots() {
        if (this.slotsSpinning) return;
        
        // Check cost
        if (Game.state.coins < this.slots.cost.coins) {
            UI.showToast('Not enough coins!', 'error');
            return;
        }
        
        Game.state.coins -= this.slots.cost.coins;
        this.slotsSpinning = true;
        
        const slot1 = document.getElementById('slot1');
        const slot2 = document.getElementById('slot2');
        const slot3 = document.getElementById('slot3');
        
        // Animate spinning
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            slot1.textContent = this.slots.symbols[Math.floor(Math.random() * this.slots.symbols.length)];
            slot2.textContent = this.slots.symbols[Math.floor(Math.random() * this.slots.symbols.length)];
            slot3.textContent = this.slots.symbols[Math.floor(Math.random() * this.slots.symbols.length)];
            spinCount++;
        }, 100);
        
        // Get final result
        const result = this.slots.spin();
        
        // Stop spinning
        setTimeout(() => {
            clearInterval(spinInterval);
            slot1.textContent = result[0];
        }, 1000);
        
        setTimeout(() => {
            slot2.textContent = result[1];
        }, 1500);
        
        setTimeout(() => {
            slot3.textContent = result[2];
            
            this.slotsSpinning = false;
            
            // Check win
            const key = result.join('');
            const payout = this.slots.payouts[key];
            
            if (payout) {
                // Winner!
                if (payout.coins) Game.state.coins += payout.coins;
                if (payout.gems) Game.state.gems += payout.gems;
                
                let msg = '🎉 You won ';
                if (payout.coins) msg += payout.coins + ' coins ';
                if (payout.gems) msg += '+ ' + payout.gems + ' gems';
                
                UI.showToast(msg + '!', 'success');
                Effects.createConfetti(30);
            } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
                // Two matching
                const smallWin = 50;
                Game.state.coins += smallWin;
                UI.showToast(`Two matching! +${smallWin} coins`, 'success');
            } else {
                UI.showToast('No match. Try again!', 'error');
            }
            
            Game.save();
            Game.updateUI();
        }, 2000);
    },
    
    handleSlotWin(payout) {
        let resultParts = [];
        
        if (payout.coins) {
            Game.state.coins += payout.coins;
            resultParts.push(`+${payout.coins}🪙`);
        }
        if (payout.gems) {
            Game.state.gems += payout.gems;
            resultParts.push(`+${payout.gems}💎`);
        }
        if (payout.spin) {
            Game.state.spins += payout.spin;
            resultParts.push(`+${payout.spin}🎡`);
        }
        
        // Jackpot animation
        document.querySelector('.slots-machine')?.classList.add('jackpot');
        setTimeout(() => {
            document.querySelector('.slots-machine')?.classList.remove('jackpot');
        }, 2000);
        
        Effects.createConfetti(50);
        UI.showResult('🎰', 'JACKPOT!', resultParts.join(' '));
    }
};

// Add minigames styles
const mgStyles = document.createElement('style');
mgStyles.textContent = `
    /* Scratch Card */
    .scratch-header {
        text-align: center;
        margin-bottom: 15px;
    }
    
    .scratch-title {
        font-family: 'Bangers', cursive;
        font-size: 1.5rem;
        color: var(--gold);
    }
    
    .scratch-remaining {
        font-size: 0.85rem;
        opacity: 0.8;
    }
    
    .scratch-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .scratch-cell {
        aspect-ratio: 1;
        background: linear-gradient(135deg, var(--gold), #d4a000);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
    }
    
    .scratch-cell:active:not(.scratched) {
        transform: scale(0.95);
    }
    
    .scratch-cell.scratched {
        background: var(--card);
        cursor: default;
    }
    
    .scratch-cover {
        font-size: 2rem;
        font-weight: 800;
        color: #000;
    }
    
    .scratch-prize {
        font-size: 1.8rem;
    }
    
    .scratch-value {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gold);
    }
    
    .scratch-actions {
        display: flex;
        gap: 10px;
    }
    
    .scratch-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .scratch-btn.all {
        background: linear-gradient(135deg, var(--pink), var(--purple));
        color: white;
    }
    
    .scratch-btn.close {
        background: rgba(255,255,255,0.1);
        color: white;
    }
    
    /* Slot Machine */
    .slots-machine {
        background: linear-gradient(135deg, #2d1b4e, #1a0030);
        border: 4px solid var(--gold);
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 15px;
    }
    
    .slots-machine.jackpot {
        animation: jackpotFlash 0.3s linear infinite;
    }
    
    @keyframes jackpotFlash {
        0%, 100% { box-shadow: 0 0 20px var(--gold); }
        50% { box-shadow: 0 0 50px var(--gold), 0 0 80px var(--pink); }
    }
    
    .slots-header {
        text-align: center;
        margin-bottom: 15px;
    }
    
    .slots-title {
        font-family: 'Bangers', cursive;
        font-size: 1.5rem;
        color: var(--gold);
    }
    
    .slots-reels {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .slot-reel {
        width: 70px;
        height: 80px;
        background: linear-gradient(180deg, #1a1a2e, #0a0a15, #1a1a2e);
        border: 3px solid #444;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        box-shadow: inset 0 5px 15px rgba(0,0,0,0.5);
    }
    
    .slot-reel.spinning {
        animation: reelSpin 0.1s linear infinite;
    }
    
    @keyframes reelSpin {
        0% { transform: translateY(-5px); }
        50% { transform: translateY(5px); }
        100% { transform: translateY(-5px); }
    }
    
    .slots-cost {
        text-align: center;
        margin-bottom: 10px;
        font-size: 0.85rem;
        opacity: 0.8;
    }
    
    .slots-btn {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, var(--red), #b91c1c);
        border: none;
        border-radius: 15px;
        color: white;
        font-family: 'Bangers', cursive;
        font-size: 1.3rem;
        letter-spacing: 3px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .slots-btn:active:not(:disabled) {
        transform: scale(0.97);
    }
    
    .slots-btn:disabled {
        background: #444;
        cursor: not-allowed;
    }
    
    .slots-payouts {
        margin-top: 15px;
        padding: 10px;
        background: rgba(0,0,0,0.3);
        border-radius: 10px;
        font-size: 0.7rem;
    }
    
    .slots-payouts-title {
        text-align: center;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--gold);
    }
    
    .payout-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .payout-row:last-child { border: none; }
    
    /* Mini Games Grid */
    .minigames-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 15px;
    }
    
    .minigame-card {
        background: var(--card);
        border: 2px solid rgba(255,255,255,0.1);
        border-radius: 18px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .minigame-card:active {
        transform: scale(0.97);
        border-color: var(--gold);
    }
    
    .minigame-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .minigame-name {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 5px;
    }
    
    .minigame-cost {
        font-size: 0.8rem;
        color: var(--gold);
    }
    
    .minigame-free {
        color: var(--green);
        font-weight: 700;
    }
    
    .minigame-desc {
        font-size: 0.65rem;
        opacity: 0.6;
        margin-top: 2px;
    }
`;
document.head.appendChild(mgStyles);

// ==================== MAGIC 8 BALL ====================
MiniGames.openMagic8Ball = function() {
    const answers = [
        "✨ Yes, definitely!",
        "🌟 It is certain",
        "💫 Without a doubt",
        "👍 Yes",
        "🔮 Signs point to yes",
        "🤔 Ask again later",
        "😶 Cannot predict now",
        "🌀 Concentrate and ask again",
        "👎 Don't count on it",
        "❌ My reply is no",
        "😔 Very doubtful",
        "🍀 Outlook good",
        "💜 Most likely"
    ];
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'magic8Modal';
    modal.innerHTML = `
        <div class="modal" style="text-align: center;">
            <div class="modal-header">
                <span class="modal-title">🎱 Magic 8 Ball</span>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <div style="font-size: 5rem; margin: 20px 0;" id="magic8Ball">🎱</div>
            <div style="font-size: 1rem; min-height: 50px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 12px; margin-bottom: 15px;" id="magic8Answer">
                Think of a question and shake the ball...
            </div>
            <button onclick="MiniGames.shakeMagic8Ball()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, var(--purple), var(--pink)); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 1rem; cursor: pointer;">
                🔮 Shake the Ball
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
};

MiniGames.shakeMagic8Ball = function() {
    const ball = document.getElementById('magic8Ball');
    const answer = document.getElementById('magic8Answer');
    const answers = [
        "✨ Yes, definitely!", "🌟 It is certain", "💫 Without a doubt", "👍 Yes",
        "🔮 Signs point to yes", "🤔 Ask again later", "😶 Cannot predict now",
        "🌀 Concentrate and ask again", "👎 Don't count on it", "❌ My reply is no",
        "😔 Very doubtful", "🍀 Outlook good", "💜 Most likely"
    ];
    
    ball.style.animation = 'shake 0.5s ease-in-out';
    answer.textContent = '🌀 Thinking...';
    
    setTimeout(() => {
        ball.style.animation = '';
        answer.textContent = answers[Math.floor(Math.random() * answers.length)];
    }, 500);
};

// ==================== COIN FLIP ====================
MiniGames.openCoinFlip = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'coinFlipModal';
    modal.innerHTML = `
        <div class="modal" style="text-align: center;">
            <div class="modal-header">
                <span class="modal-title">🪙 Coin Flip</span>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-size: 0.9rem; opacity: 0.7;">Bet Amount</div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button class="bet-btn" onclick="MiniGames.setCoinBet(100)" style="padding: 10px 20px; background: var(--card); border: 2px solid var(--gold); border-radius: 10px; color: white; cursor: pointer;">100</button>
                    <button class="bet-btn" onclick="MiniGames.setCoinBet(500)" style="padding: 10px 20px; background: var(--card); border: 2px solid var(--gold); border-radius: 10px; color: white; cursor: pointer;">500</button>
                    <button class="bet-btn" onclick="MiniGames.setCoinBet(1000)" style="padding: 10px 20px; background: var(--card); border: 2px solid var(--gold); border-radius: 10px; color: white; cursor: pointer;">1K</button>
                </div>
                <div style="margin-top: 10px; font-size: 1.2rem; color: var(--gold);" id="coinBetDisplay">Bet: 🪙 100</div>
            </div>
            <div style="font-size: 5rem; margin: 20px 0;" id="coinDisplay">🪙</div>
            <div style="display: flex; gap: 10px;">
                <button onclick="MiniGames.flipCoin('heads')" style="flex: 1; padding: 15px; background: linear-gradient(135deg, var(--gold), #b8860b); border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer;">
                    👑 HEADS
                </button>
                <button onclick="MiniGames.flipCoin('tails')" style="flex: 1; padding: 15px; background: linear-gradient(135deg, var(--cyan), var(--purple)); border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer;">
                    🌙 TAILS
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
    MiniGames.coinBet = 100;
};

MiniGames.coinBet = 100;
MiniGames.setCoinBet = function(amount) {
    this.coinBet = amount;
    document.getElementById('coinBetDisplay').textContent = `Bet: 🪙 ${amount >= 1000 ? (amount/1000)+'K' : amount}`;
};

MiniGames.flipCoin = function(choice) {
    if (Game.state.coins < this.coinBet) {
        UI.showToast('Not enough coins! 😢', 'error');
        return;
    }
    
    Game.state.coins -= this.coinBet;
    const coin = document.getElementById('coinDisplay');
    coin.style.animation = 'flip 1s ease-in-out';
    
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    setTimeout(() => {
        coin.style.animation = '';
        coin.textContent = result === 'heads' ? '👑' : '🌙';
        
        if (choice === result) {
            const winnings = this.coinBet * 2;
            Game.state.coins += winnings;
            UI.showToast(`🎉 You won ${winnings} coins!`, 'success');
            Effects.createConfetti(20);
        } else {
            UI.showToast(`😢 You lost! It was ${result}`, 'error');
        }
        
        Game.save();
        Game.updateUI();
        
        setTimeout(() => {
            coin.textContent = '🪙';
        }, 1500);
    }, 1000);
};

// ==================== LUCKY DICE ====================
MiniGames.openDice = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'diceModal';
    modal.innerHTML = `
        <div class="modal" style="text-align: center;">
            <div class="modal-header">
                <span class="modal-title">🎲 Lucky Dice</span>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 10px;">Roll two dice! Higher = Better prizes!</div>
            <div style="display: flex; justify-content: center; gap: 20px; font-size: 4rem; margin: 20px 0;">
                <div id="dice1">🎲</div>
                <div id="dice2">🎲</div>
            </div>
            <div style="padding: 15px; background: rgba(0,0,0,0.3); border-radius: 12px; margin-bottom: 15px;">
                <div style="font-size: 0.8rem; opacity: 0.7;">Prizes:</div>
                <div style="font-size: 0.75rem; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 5px;">
                    <div>2-4: 50 🪙</div>
                    <div>5-6: 100 🪙</div>
                    <div>7: 250 🪙</div>
                    <div>8-9: 150 🪙</div>
                    <div>10-11: 300 🪙</div>
                    <div>12: 1000 🪙 + 5 💎</div>
                </div>
            </div>
            <button onclick="MiniGames.rollDice()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, var(--orange), var(--pink)); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 1rem; cursor: pointer;">
                🎲 Roll Dice (🪙 150)
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
};

MiniGames.rollDice = function() {
    if (Game.state.coins < 150) {
        UI.showToast('Not enough coins! 😢', 'error');
        return;
    }
    
    Game.state.coins -= 150;
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const dice1El = document.getElementById('dice1');
    const dice2El = document.getElementById('dice2');
    
    // Animate dice
    let rolls = 0;
    const rollInterval = setInterval(() => {
        dice1El.textContent = diceEmojis[Math.floor(Math.random() * 6)];
        dice2El.textContent = diceEmojis[Math.floor(Math.random() * 6)];
        rolls++;
        if (rolls > 10) {
            clearInterval(rollInterval);
            
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            dice1El.textContent = diceEmojis[d1 - 1];
            dice2El.textContent = diceEmojis[d2 - 1];
            
            const total = d1 + d2;
            let reward = { coins: 0, gems: 0 };
            
            if (total <= 4) reward.coins = 50;
            else if (total <= 6) reward.coins = 100;
            else if (total === 7) reward.coins = 250;
            else if (total <= 9) reward.coins = 150;
            else if (total <= 11) reward.coins = 300;
            else { reward.coins = 1000; reward.gems = 5; }
            
            Game.state.coins += reward.coins;
            Game.state.gems += reward.gems;
            
            let msg = `Rolled ${total}! Won ${reward.coins} coins`;
            if (reward.gems > 0) msg += ` + ${reward.gems} gems`;
            UI.showToast(msg + '!', 'success');
            
            if (total === 12) Effects.createConfetti(30);
            
            Game.save();
            Game.updateUI();
        }
    }, 100);
};

// ==================== TREASURE HUNT ====================
MiniGames.openTreasureHunt = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'treasureModal';
    
    // Generate 9 cells, one has treasure
    const treasureIndex = Math.floor(Math.random() * 9);
    
    modal.innerHTML = `
        <div class="modal" style="text-align: center;">
            <div class="modal-header">
                <span class="modal-title">🗺️ Treasure Hunt</span>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 15px;">Find the treasure chest! 3 attempts max.</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;" id="treasureGrid">
                ${Array(9).fill(0).map((_, i) => `
                    <div class="treasure-cell" data-index="${i}" data-treasure="${i === treasureIndex}" 
                         onclick="MiniGames.digTreasure(${i}, ${i === treasureIndex})"
                         style="aspect-ratio: 1; background: linear-gradient(135deg, #5d4e37, #3d2e1f); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; border: 2px solid #8b7355;">
                        🌱
                    </div>
                `).join('')}
            </div>
            <div style="font-size: 0.9rem;" id="treasureAttempts">Attempts: 3 remaining</div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
    MiniGames.treasureAttempts = 3;
    MiniGames.treasureCost = 400;
    
    if (Game.state.coins < 400) {
        UI.showToast('Not enough coins! Need 400 🪙', 'error');
        modal.remove();
        return;
    }
    Game.state.coins -= 400;
    Game.save();
    Game.updateUI();
};

MiniGames.treasureAttempts = 3;
MiniGames.digTreasure = function(index, isTreasure) {
    if (this.treasureAttempts <= 0) return;
    
    const cell = document.querySelector(`[data-index="${index}"]`);
    if (cell.classList.contains('dug')) return;
    
    cell.classList.add('dug');
    this.treasureAttempts--;
    
    if (isTreasure) {
        cell.textContent = '💰';
        cell.style.background = 'linear-gradient(135deg, var(--gold), #b8860b)';
        
        const reward = { coins: 1500, gems: Math.floor(Math.random() * 5) + 3 };
        Game.state.coins += reward.coins;
        Game.state.gems += reward.gems;
        
        UI.showToast(`🎉 Found treasure! ${reward.coins} coins + ${reward.gems} gems!`, 'success');
        Effects.createConfetti(40);
        
        // Disable all cells
        document.querySelectorAll('.treasure-cell').forEach(c => c.onclick = null);
        this.treasureAttempts = 0;
    } else {
        cell.textContent = '💀';
        cell.style.background = 'rgba(0,0,0,0.5)';
        
        if (this.treasureAttempts === 0) {
            UI.showToast('😢 No treasure found!', 'error');
            // Reveal treasure
            document.querySelector('[data-treasure="true"]').textContent = '💰';
        }
    }
    
    document.getElementById('treasureAttempts').textContent = `Attempts: ${this.treasureAttempts} remaining`;
    Game.save();
    Game.updateUI();
};

// Add CSS animations
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-20deg); }
        75% { transform: rotate(20deg); }
    }
    @keyframes flip {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(720deg); }
    }
    .treasure-cell.dug {
        cursor: default !important;
        opacity: 0.8;
    }
`;
document.head.appendChild(extraStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiniGames;
}
