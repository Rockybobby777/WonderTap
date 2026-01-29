// ==================== CARD FLIP GAME MODULE ====================
// Memory matching game with Alice in Wonderland theme

const CardFlip = {
    // Game config
    config: {
        gridSize: 4, // 4x4 = 16 cards = 8 pairs
        flipDuration: 400,
        matchBonus: 100,
        perfectBonus: 500,
        timeLimit: 60, // seconds
        maxFlips: 2
    },
    
    // Card designs
    cards: [
        { id: 'alice', emoji: '👧', name: 'Alice' },
        { id: 'rabbit', emoji: '🐰', name: 'White Rabbit' },
        { id: 'cat', emoji: '😸', name: 'Cheshire Cat' },
        { id: 'hatter', emoji: '🎩', name: 'Mad Hatter' },
        { id: 'queen', emoji: '👸', name: 'Red Queen' },
        { id: 'caterpillar', emoji: '🐛', name: 'Caterpillar' },
        { id: 'mushroom', emoji: '🍄', name: 'Mushroom' },
        { id: 'teapot', emoji: '🫖', name: 'Tea Party' },
        { id: 'cards', emoji: '🃏', name: 'Playing Cards' },
        { id: 'clock', emoji: '⏰', name: 'Pocket Watch' },
        { id: 'key', emoji: '🗝️', name: 'Golden Key' },
        { id: 'rose', emoji: '🌹', name: 'Painted Rose' }
    ],
    
    // Game state
    state: {
        playing: false,
        board: [],
        flipped: [],
        matched: [],
        moves: 0,
        score: 0,
        timeLeft: 60,
        timer: null,
        difficulty: 'normal' // easy (3x4), normal (4x4), hard (4x5)
    },
    
    // Difficulty settings
    difficulties: {
        easy: { grid: [3, 4], pairs: 6, time: 45, cost: 200 },
        normal: { grid: [4, 4], pairs: 8, time: 60, cost: 350 },
        hard: { grid: [4, 5], pairs: 10, time: 90, cost: 500 }
    },
    
    // Initialize
    init() {
        // Nothing to do on init
    },
    
    // Open game modal
    open() {
        UI.openModal('cardFlipModal');
        this.renderMenu();
    },
    
    // Render difficulty menu
    renderMenu() {
        const container = document.getElementById('cardFlipContent');
        if (!container) return;
        
        const highScore = Game.state.cardFlipHighScore || 0;
        
        container.innerHTML = `
            <div class="cf-menu">
                <div class="cf-title">🃏 Card Flip</div>
                <div class="cf-subtitle">Match the Wonderland pairs!</div>
                
                <div class="cf-high-score">
                    <div class="cf-hs-label">High Score</div>
                    <div class="cf-hs-value">${highScore}</div>
                </div>
                
                <div class="cf-difficulties">
                    ${Object.entries(this.difficulties).map(([key, diff]) => `
                        <div class="cf-diff-card" onclick="CardFlip.start('${key}')">
                            <div class="cf-diff-name">${key.toUpperCase()}</div>
                            <div class="cf-diff-info">${diff.grid[0]}x${diff.grid[1]} • ${diff.time}s</div>
                            <div class="cf-diff-cost">🪙 ${diff.cost}</div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="cf-close-btn" onclick="UI.closeModal('cardFlipModal')">Close</button>
            </div>
        `;
    },
    
    // Start game
    start(difficulty = 'normal') {
        const diff = this.difficulties[difficulty];
        
        // Check cost
        if (Game.state.coins < diff.cost) {
            UI.showToast('Not enough coins!', 'error');
            return;
        }
        
        Game.state.coins -= diff.cost;
        Game.save();
        Game.updateUI();
        
        // Setup state
        this.state = {
            playing: true,
            board: [],
            flipped: [],
            matched: [],
            moves: 0,
            score: 0,
            timeLeft: diff.time,
            timer: null,
            difficulty: difficulty
        };
        
        // Generate board
        this.generateBoard(diff.pairs, diff.grid);
        
        // Render game
        this.renderGame(diff.grid);
        
        // Start timer
        this.startTimer();
    },
    
    // Generate board
    generateBoard(pairCount, grid) {
        // Select random cards
        const shuffledCards = [...this.cards].sort(() => Math.random() - 0.5);
        const selectedCards = shuffledCards.slice(0, pairCount);
        
        // Create pairs
        let board = [];
        for (const card of selectedCards) {
            board.push({ ...card, uid: card.id + '_1' });
            board.push({ ...card, uid: card.id + '_2' });
        }
        
        // Shuffle board
        board = board.sort(() => Math.random() - 0.5);
        
        this.state.board = board;
    },
    
    // Render game
    renderGame(grid) {
        const container = document.getElementById('cardFlipContent');
        if (!container) return;
        
        const [cols, rows] = grid;
        
        container.innerHTML = `
            <div class="cf-game">
                <div class="cf-header">
                    <div class="cf-stat">
                        <span class="cf-stat-icon">⏱️</span>
                        <span class="cf-stat-value" id="cfTimer">${this.state.timeLeft}</span>
                    </div>
                    <div class="cf-stat">
                        <span class="cf-stat-icon">🎯</span>
                        <span class="cf-stat-value" id="cfMoves">${this.state.moves}</span>
                    </div>
                    <div class="cf-stat">
                        <span class="cf-stat-icon">⭐</span>
                        <span class="cf-stat-value" id="cfScore">${this.state.score}</span>
                    </div>
                </div>
                
                <div class="cf-board" style="grid-template-columns: repeat(${cols}, 1fr);">
                    ${this.state.board.map((card, index) => `
                        <div class="cf-card ${this.state.matched.includes(card.uid) ? 'matched' : ''}" 
                             data-index="${index}"
                             onclick="CardFlip.flipCard(${index})">
                            <div class="cf-card-inner">
                                <div class="cf-card-front">❓</div>
                                <div class="cf-card-back">${card.emoji}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cf-footer">
                    <div class="cf-pairs-left">
                        Pairs left: <span id="cfPairsLeft">${this.state.board.length / 2 - this.state.matched.length / 2}</span>
                    </div>
                    <button class="cf-quit-btn" onclick="CardFlip.quit()">Quit</button>
                </div>
            </div>
        `;
    },
    
    // Start timer
    startTimer() {
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            
            const timerEl = document.getElementById('cfTimer');
            if (timerEl) {
                timerEl.textContent = this.state.timeLeft;
                
                if (this.state.timeLeft <= 10) {
                    timerEl.style.color = 'var(--red)';
                }
            }
            
            if (this.state.timeLeft <= 0) {
                this.gameOver(false);
            }
        }, 1000);
    },
    
    // Flip card
    flipCard(index) {
        if (!this.state.playing) return;
        
        const card = this.state.board[index];
        
        // Can't flip matched cards
        if (this.state.matched.includes(card.uid)) return;
        
        // Can't flip already flipped card
        if (this.state.flipped.includes(index)) return;
        
        // Can't flip more than 2
        if (this.state.flipped.length >= 2) return;
        
        // Flip the card
        this.state.flipped.push(index);
        this.updateCardDisplay(index, true);
        
        // Check for match if 2 cards flipped
        if (this.state.flipped.length === 2) {
            this.state.moves++;
            this.updateMoves();
            this.checkMatch();
        }
    },
    
    // Update card display
    updateCardDisplay(index, flipped) {
        const cardEl = document.querySelector(`.cf-card[data-index="${index}"]`);
        if (cardEl) {
            if (flipped) {
                cardEl.classList.add('flipped');
            } else {
                cardEl.classList.remove('flipped');
            }
        }
    },
    
    // Update moves display
    updateMoves() {
        const movesEl = document.getElementById('cfMoves');
        if (movesEl) movesEl.textContent = this.state.moves;
    },
    
    // Update score display
    updateScore() {
        const scoreEl = document.getElementById('cfScore');
        if (scoreEl) scoreEl.textContent = this.state.score;
    },
    
    // Update pairs left
    updatePairsLeft() {
        const pairsEl = document.getElementById('cfPairsLeft');
        if (pairsEl) {
            pairsEl.textContent = this.state.board.length / 2 - this.state.matched.length / 2;
        }
    },
    
    // Check for match
    checkMatch() {
        const [index1, index2] = this.state.flipped;
        const card1 = this.state.board[index1];
        const card2 = this.state.board[index2];
        
        setTimeout(() => {
            if (card1.id === card2.id) {
                // Match!
                this.state.matched.push(card1.uid, card2.uid);
                this.state.score += this.config.matchBonus;
                
                // Mark as matched
                document.querySelector(`.cf-card[data-index="${index1}"]`)?.classList.add('matched');
                document.querySelector(`.cf-card[data-index="${index2}"]`)?.classList.add('matched');
                
                this.updateScore();
                this.updatePairsLeft();
                
                // Check win
                if (this.state.matched.length === this.state.board.length) {
                    this.gameOver(true);
                }
            } else {
                // No match - flip back
                this.updateCardDisplay(index1, false);
                this.updateCardDisplay(index2, false);
            }
            
            this.state.flipped = [];
        }, this.config.flipDuration);
    },
    
    // Game over
    gameOver(won) {
        this.state.playing = false;
        
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
        
        let finalScore = this.state.score;
        
        if (won) {
            // Time bonus
            const timeBonus = this.state.timeLeft * 10;
            finalScore += timeBonus;
            
            // Perfect bonus (minimum moves)
            const minMoves = this.state.board.length / 2;
            if (this.state.moves === minMoves) {
                finalScore += this.config.perfectBonus;
            }
            
            // Efficiency bonus
            const efficiency = minMoves / this.state.moves;
            if (efficiency > 0.8) {
                finalScore += Math.floor(200 * efficiency);
            }
        }
        
        // Convert score to rewards
        const coinReward = Math.floor(finalScore / 2);
        const gemReward = won ? Math.floor(finalScore / 500) : 0;
        
        // Apply rewards
        Game.state.coins += coinReward;
        Game.state.gems += gemReward;
        
        // Update high score
        if (!Game.state.cardFlipHighScore || finalScore > Game.state.cardFlipHighScore) {
            Game.state.cardFlipHighScore = finalScore;
        }
        
        Game.save();
        Game.updateUI();
        
        // Show result
        setTimeout(() => {
            UI.closeModal('cardFlipModal');
            
            if (won) {
                UI.showResult('🎉', 'YOU WIN!', 
                    `Score: ${finalScore}\n+${coinReward}🪙 +${gemReward}💎`);
                Effects.createConfetti(50);
            } else {
                UI.showResult('⏰', 'TIME UP!', 
                    `Score: ${finalScore}\n+${coinReward}🪙`);
            }
        }, 500);
    },
    
    // Quit game
    quit() {
        this.state.playing = false;
        
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
        
        UI.closeModal('cardFlipModal');
    }
};

// Add card flip styles
const cfStyles = document.createElement('style');
cfStyles.textContent = `
    .cf-menu {
        text-align: center;
    }
    
    .cf-title {
        font-family: 'Bangers', cursive;
        font-size: 2rem;
        background: linear-gradient(135deg, var(--gold), var(--pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 5px;
    }
    
    .cf-subtitle {
        opacity: 0.7;
        margin-bottom: 20px;
    }
    
    .cf-high-score {
        background: rgba(255,215,0,0.1);
        border: 1px solid var(--gold);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 20px;
    }
    
    .cf-hs-label { font-size: 0.8rem; opacity: 0.7; }
    .cf-hs-value { font-size: 1.8rem; font-weight: 800; color: var(--gold); }
    
    .cf-difficulties {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .cf-diff-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .cf-diff-card:active {
        transform: scale(0.98);
        border-color: var(--pink);
    }
    
    .cf-diff-name { font-weight: 700; }
    .cf-diff-info { font-size: 0.8rem; opacity: 0.7; }
    .cf-diff-cost { color: var(--gold); font-weight: 700; }
    
    .cf-close-btn {
        width: 100%;
        padding: 12px;
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 700;
        cursor: pointer;
    }
    
    /* Game */
    .cf-game { }
    
    .cf-header {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        margin-bottom: 15px;
    }
    
    .cf-stat {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .cf-stat-icon { font-size: 1.2rem; }
    .cf-stat-value { font-weight: 700; font-size: 1.1rem; }
    
    .cf-board {
        display: grid;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .cf-card {
        aspect-ratio: 1;
        perspective: 1000px;
        cursor: pointer;
    }
    
    .cf-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.4s;
        transform-style: preserve-3d;
    }
    
    .cf-card.flipped .cf-card-inner,
    .cf-card.matched .cf-card-inner {
        transform: rotateY(180deg);
    }
    
    .cf-card-front,
    .cf-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
    }
    
    .cf-card-front {
        background: linear-gradient(135deg, var(--purple), var(--pink));
        border: 2px solid rgba(255,255,255,0.2);
    }
    
    .cf-card-back {
        background: linear-gradient(135deg, #1a1a2e, #2d1b4e);
        border: 2px solid var(--gold);
        transform: rotateY(180deg);
    }
    
    .cf-card.matched .cf-card-back {
        background: linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,200,100,0.1));
        border-color: var(--green);
    }
    
    .cf-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .cf-pairs-left {
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .cf-quit-btn {
        padding: 10px 25px;
        background: var(--red);
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: 700;
        cursor: pointer;
    }
`;
document.head.appendChild(cfStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardFlip;
}
