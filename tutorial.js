// ==================== TUTORIAL MODULE ====================
// Interactive tutorial for new players

const Tutorial = {
    // Tutorial state
    state: {
        completed: false,
        currentStep: 0,
        skipped: false
    },
    
    // Tutorial steps
    steps: [
        {
            id: 'welcome',
            title: 'tut_welcome',
            text: 'tut_tap',
            icon: '🍄',
            highlight: null,
            position: 'center',
            action: null
        },
        {
            id: 'tap',
            title: 'Tap to Earn!',
            text: 'Tap the caterpillar to earn coins. The more you tap, the more you earn!',
            icon: '👆',
            highlight: '#tapZone',
            position: 'top',
            action: 'tap',
            requirement: { taps: 5 }
        },
        {
            id: 'energy',
            title: 'Energy System',
            text: 'Each tap uses energy. Energy refills automatically over time!',
            icon: '⚡',
            highlight: '#energyFill',
            position: 'top',
            action: null
        },
        {
            id: 'fever',
            title: 'Fever Mode!',
            text: 'Tap fast to fill the Fever bar. When full, you earn 5x coins!',
            icon: '🔥',
            highlight: '#feverFill',
            position: 'top',
            action: null
        },
        {
            id: 'combo',
            title: 'Combos',
            text: 'Keep tapping without stopping to build combos and earn bonus coins!',
            icon: '💥',
            highlight: '#comboDisplay',
            position: 'bottom',
            action: null
        },
        {
            id: 'wheel',
            title: 'Fortune Wheel',
            text: 'Spin the wheel daily for free prizes!',
            icon: '🎡',
            highlight: '.quick-btn:nth-child(2)',
            position: 'bottom',
            action: null
        },
        {
            id: 'shop',
            title: 'Shop',
            text: 'Buy skins, backgrounds, and boosts to customize your experience!',
            icon: '🛒',
            highlight: '[data-page="shopPage"]',
            position: 'top',
            action: null
        },
        {
            id: 'quests',
            title: 'Quests',
            text: 'Complete daily and weekly quests for big rewards!',
            icon: '📋',
            highlight: '[data-page="questsPage"]',
            position: 'top',
            action: null
        },
        {
            id: 'games',
            title: 'Mini Games',
            text: 'Play mini games like Rabbit Slide and Card Flip for bonus coins!',
            icon: '🎮',
            highlight: '[data-page="gamesPage"]',
            position: 'top',
            action: null
        },
        {
            id: 'friends',
            title: 'Invite Friends',
            text: 'Invite friends and you both get 2,000 coins + 15 gems!',
            icon: '👥',
            highlight: '[data-page="friendsPage"]',
            position: 'top',
            action: null
        },
        {
            id: 'ready',
            title: 'tut_ready',
            text: 'Start tapping and become the richest player in Wonderland!',
            icon: '🎉',
            highlight: null,
            position: 'center',
            action: 'complete'
        }
    ],
    
    // Tutorial tracking
    tapCount: 0,
    
    // Initialize tutorial
    init() {
        // Check if tutorial completed
        const saved = localStorage.getItem('wondertap_tutorial');
        if (saved) {
            this.state = JSON.parse(saved);
        }
        
        // Show tutorial for new players
        if (!this.state.completed && !this.state.skipped) {
            setTimeout(() => this.start(), 1500);
        }
    },
    
    // Start tutorial
    start() {
        this.state.currentStep = 0;
        this.createOverlay();
        this.showStep(0);
    },
    
    // Create tutorial overlay
    createOverlay() {
        // Remove existing
        const existing = document.getElementById('tutorialOverlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'tutorialOverlay';
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-backdrop"></div>
            <div class="tutorial-spotlight" id="tutorialSpotlight"></div>
            <div class="tutorial-dialog" id="tutorialDialog">
                <div class="tutorial-icon" id="tutorialIcon">🍄</div>
                <div class="tutorial-title" id="tutorialTitle">Welcome!</div>
                <div class="tutorial-text" id="tutorialText">Let's learn how to play!</div>
                <div class="tutorial-progress" id="tutorialProgress"></div>
                <div class="tutorial-actions">
                    <button class="tutorial-btn skip" onclick="Tutorial.skip()">Skip</button>
                    <button class="tutorial-btn next" id="tutorialNextBtn" onclick="Tutorial.next()">Next</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });
    },
    
    // Show step
    showStep(index) {
        const step = this.steps[index];
        if (!step) {
            this.complete();
            return;
        }
        
        this.state.currentStep = index;
        
        // Update dialog
        const iconEl = document.getElementById('tutorialIcon');
        const titleEl = document.getElementById('tutorialTitle');
        const textEl = document.getElementById('tutorialText');
        const nextBtn = document.getElementById('tutorialNextBtn');
        const progressEl = document.getElementById('tutorialProgress');
        
        // Get translated text
        const title = typeof I18n !== 'undefined' ? I18n.t(step.title) : step.title;
        const text = typeof I18n !== 'undefined' ? I18n.t(step.text) : step.text;
        
        iconEl.textContent = step.icon;
        titleEl.textContent = title;
        textEl.textContent = text;
        
        // Update button text
        if (index === this.steps.length - 1) {
            nextBtn.textContent = typeof I18n !== 'undefined' ? I18n.t('tut_start') : 'Start Playing!';
        } else {
            nextBtn.textContent = typeof I18n !== 'undefined' ? I18n.t('next') : 'Next';
        }
        
        // Update progress
        progressEl.innerHTML = this.steps.map((s, i) => 
            `<div class="tutorial-dot ${i === index ? 'active' : ''} ${i < index ? 'done' : ''}"></div>`
        ).join('');
        
        // Position spotlight
        this.positionSpotlight(step.highlight);
        
        // Position dialog
        this.positionDialog(step.position, step.highlight);
        
        // Handle action requirements
        if (step.action === 'tap') {
            this.tapCount = 0;
            nextBtn.textContent = `Tap ${step.requirement.taps} times!`;
            nextBtn.disabled = true;
            this.setupTapTracking(step.requirement.taps);
        }
    },
    
    // Position spotlight on element
    positionSpotlight(selector) {
        const spotlight = document.getElementById('tutorialSpotlight');
        
        if (!selector) {
            spotlight.style.display = 'none';
            return;
        }
        
        const element = document.querySelector(selector);
        if (!element) {
            spotlight.style.display = 'none';
            return;
        }
        
        const rect = element.getBoundingClientRect();
        const padding = 10;
        
        spotlight.style.display = 'block';
        spotlight.style.left = `${rect.left - padding}px`;
        spotlight.style.top = `${rect.top - padding}px`;
        spotlight.style.width = `${rect.width + padding * 2}px`;
        spotlight.style.height = `${rect.height + padding * 2}px`;
    },
    
    // Position dialog
    positionDialog(position, highlight) {
        const dialog = document.getElementById('tutorialDialog');
        
        dialog.className = 'tutorial-dialog';
        
        if (position === 'center' || !highlight) {
            dialog.classList.add('center');
        } else if (position === 'top') {
            dialog.classList.add('top');
        } else if (position === 'bottom') {
            dialog.classList.add('bottom');
        }
    },
    
    // Setup tap tracking for tap step
    setupTapTracking(required) {
        const tapZone = document.getElementById('tapZone');
        
        const handler = () => {
            this.tapCount++;
            const nextBtn = document.getElementById('tutorialNextBtn');
            
            if (this.tapCount >= required) {
                nextBtn.textContent = 'Great! Next →';
                nextBtn.disabled = false;
                tapZone.removeEventListener('click', handler);
            } else {
                nextBtn.textContent = `Tap ${required - this.tapCount} more!`;
            }
        };
        
        tapZone.addEventListener('click', handler);
    },
    
    // Next step
    next() {
        const nextBtn = document.getElementById('tutorialNextBtn');
        if (nextBtn.disabled) return;
        
        // Play sound
        if (typeof Audio !== 'undefined') Audio.playClick();
        
        // Next step
        if (this.state.currentStep < this.steps.length - 1) {
            this.showStep(this.state.currentStep + 1);
        } else {
            this.complete();
        }
    },
    
    // Skip tutorial
    skip() {
        if (typeof Audio !== 'undefined') Audio.playClick();
        
        this.state.skipped = true;
        this.state.completed = true;
        this.save();
        this.close();
        
        UI.showToast('Tutorial skipped. Have fun! 🎮', 'info');
    },
    
    // Complete tutorial
    complete() {
        this.state.completed = true;
        this.save();
        this.close();
        
        // Give completion reward
        Game.state.coins += 500;
        Game.state.spins += 2;
        Game.save();
        Game.updateUI();
        
        // Show reward
        setTimeout(() => {
            UI.showResult('🎓', 'Tutorial Complete!', '+500 🪙 +2 🎡 Spins');
            Effects.createConfetti(40);
            
            if (typeof Notifications !== 'undefined') {
                Notifications.achievement('Tutorial Master', 'Completed the tutorial!');
            }
        }, 300);
    },
    
    // Close tutorial
    close() {
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    },
    
    // Save state
    save() {
        localStorage.setItem('wondertap_tutorial', JSON.stringify(this.state));
    },
    
    // Reset tutorial (for testing)
    reset() {
        this.state = {
            completed: false,
            currentStep: 0,
            skipped: false
        };
        localStorage.removeItem('wondertap_tutorial');
        this.start();
    }
};

// Add tutorial styles
const tutorialStyles = document.createElement('style');
tutorialStyles.textContent = `
    .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    }
    
    .tutorial-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    
    .tutorial-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
    }
    
    .tutorial-spotlight {
        position: absolute;
        background: transparent;
        border-radius: 15px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85);
        transition: all 0.4s ease;
        z-index: 1;
    }
    
    .tutorial-dialog {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 320px;
        background: linear-gradient(135deg, #1a1a2e, #2d1b4e);
        border: 2px solid var(--pink);
        border-radius: 20px;
        padding: 25px;
        text-align: center;
        z-index: 2;
        box-shadow: 0 10px 40px rgba(255, 0, 255, 0.3);
    }
    
    .tutorial-dialog.center {
        top: 50%;
        transform: translate(-50%, -50%);
    }
    
    .tutorial-dialog.top {
        bottom: 20%;
    }
    
    .tutorial-dialog.bottom {
        top: 15%;
    }
    
    .tutorial-icon {
        font-size: 4rem;
        margin-bottom: 15px;
        animation: tutorialBounce 1s ease infinite;
    }
    
    @keyframes tutorialBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    .tutorial-title {
        font-family: 'Bangers', cursive;
        font-size: 1.8rem;
        color: var(--cyan);
        margin-bottom: 10px;
    }
    
    .tutorial-text {
        font-size: 0.95rem;
        line-height: 1.5;
        opacity: 0.9;
        margin-bottom: 20px;
    }
    
    .tutorial-progress {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .tutorial-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s;
    }
    
    .tutorial-dot.active {
        background: var(--pink);
        transform: scale(1.3);
    }
    
    .tutorial-dot.done {
        background: var(--green);
    }
    
    .tutorial-actions {
        display: flex;
        gap: 10px;
    }
    
    .tutorial-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 25px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .tutorial-btn.skip {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .tutorial-btn.next {
        background: linear-gradient(135deg, var(--pink), var(--purple));
        color: white;
    }
    
    .tutorial-btn.next:disabled {
        background: #444;
        color: #888;
        cursor: not-allowed;
    }
    
    .tutorial-btn:not(:disabled):active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(tutorialStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tutorial;
}
