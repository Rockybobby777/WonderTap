// ==================== UI MODULE ====================
// UI helpers, modals, navigation, toasts

const UI = {
    currentPage: 'homePage',
    
    // Show page
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const page = document.getElementById(pageId);
        if (page) page.classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (navBtn) navBtn.classList.add('active');
        
        this.currentPage = pageId;
        
        // Play click sound
        if (typeof Audio !== 'undefined') Audio.playClick();
    },
    
    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
        if (typeof Audio !== 'undefined') Audio.playClick();
    },
    
    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },
    
    // Show result modal
    showResult(icon, title, value) {
        const modal = document.getElementById('resultModal');
        if (!modal) return;
        
        document.getElementById('resultIcon').textContent = icon;
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultValue').textContent = value;
        modal.classList.add('active');
    },
    
    // Close result modal
    closeResult() {
        const modal = document.getElementById('resultModal');
        if (modal) modal.classList.remove('active');
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'success' ? 'var(--green)' : type === 'error' ? 'var(--red)' : type === 'warning' ? 'var(--orange)' : 'var(--purple)'};
            color: ${type === 'success' || type === 'warning' ? '#000' : '#fff'};
            border-radius: 25px;
            font-weight: 700;
            font-size: 0.85rem;
            z-index: 9999;
            animation: toastIn 0.3s ease-out;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
};

// ==================== EFFECTS MODULE ====================
// Visual effects: confetti, floating coins, ripples, smoke

const Effects = {
    // Create floating coin display when tapping
    createFloatCoin(x, y, amount, isFever = false) {
        const el = document.createElement('div');
        el.className = 'float-coin';
        el.textContent = '+' + (typeof Game !== 'undefined' ? Game.formatNumber(amount) : amount) + ' 🪙';
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${isFever ? '#ff00ff' : '#ffd700'};
            font-size: 1.4rem;
            font-weight: 800;
            text-shadow: ${isFever ? '0 0 20px #ff00ff, 0 0 40px #ff00ff' : '0 0 15px #ffd700, 0 0 30px #ffd700'};
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1.2s ease-out forwards;
            transform: translateX(-50%);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    },
    
    // Create floating WONTIME display when tapping
    createFloatWontime(x, y, amount, isFever = false) {
        const el = document.createElement('div');
        el.className = 'float-wontime';
        el.textContent = '+' + amount + ' 🐰🕰️';
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${isFever ? '#ff00ff' : '#00ffcc'};
            font-size: 1.3rem;
            font-weight: 800;
            text-shadow: ${isFever ? '0 0 20px #ff00ff, 0 0 40px #ff00ff' : '0 0 15px #00ffcc, 0 0 30px #00ffcc'};
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1.2s ease-out forwards;
            transform: translateX(-50%);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    },
    
    // Create tap ripple effect WITH EQUIPPED EFFECT
    createRipple(x, y, isFever = false) {
        // Get current effect
        const effectId = (typeof Game !== 'undefined' && Game.state.currentEffect) ? Game.state.currentEffect : 'classic';
        
        // Define effect particles
        const effectParticles = {
            classic: ['⭐', '✨', '💫'],
            hearts: ['💖', '💕', '💗', '❤️'],
            fire: ['🔥', '🔥', '💥', '✨'],
            lightning: ['⚡', '⚡', '💥', '✨'],
            bubbles: ['🫧', '🫧', '💭', '○'],
            confetti: ['🎊', '🎉', '✨', '🎀'],
            snow: ['❄️', '❄️', '✨', '🌨️'],
            petals: ['🌸', '🌺', '🌷', '💮'],
            music: ['🎵', '🎶', '🎼', '♪'],
            cards: ['🃏', '♠️', '♥️', '♦️', '♣️'],
            butterflies: ['🦋', '🦋', '✨', '💫'],
            rainbow: ['🌈', '✨', '💜', '💙', '💚', '💛'],
            galaxy: ['✨', '🌟', '💫', '⭐', '🌌'],
            glitch: ['📺', '💜', '⬛', '⬜', '🟪']
        };
        
        const particles = effectParticles[effectId] || effectParticles.classic;
        
        // Create main ripple
        const el = document.createElement('div');
        el.className = 'tap-ripple';
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 3px solid ${isFever ? '#00ffff' : '#ff00ff'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.7s ease-out forwards;
            box-shadow: 0 0 20px ${isFever ? '#00ffff' : '#ff00ff'};
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 700);
        
        // Create particle effects based on equipped effect
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'effect-particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            
            const angle = (i / 5) * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance - 50;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${1 + Math.random() * 0.5}rem;
                pointer-events: none;
                z-index: 1001;
                transform: translate(-50%, -50%);
                animation: particleFly 0.8s ease-out forwards;
                --end-x: ${endX - x}px;
                --end-y: ${endY - y}px;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    },
    
    // Create psychedelic smoke rings from the caterpillar
    createSmoke() {
        const container = document.getElementById('smokeContainer');
        if (!container) return;
        
        // Create multiple smoke rings for psychedelic effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-ring';
                
                // Random size
                const size = 15 + Math.random() * 25;
                
                // Random color for psychedelic effect
                const colors = ['#ff00ff', '#00ffff', '#ffd700', '#ff6b35', '#9b59b6', '#00ff88'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Random drift direction
                const drift = (Math.random() * 60 - 30);
                
                smoke.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border: 2px solid ${color};
                    border-radius: 50%;
                    left: 50%;
                    bottom: 70%;
                    transform: translateX(-50%);
                    opacity: 0.8;
                    box-shadow: 0 0 10px ${color}, inset 0 0 10px ${color}40;
                    animation: smokeRise 2.5s ease-out forwards;
                    --drift: ${drift}px;
                `;
                
                container.appendChild(smoke);
                setTimeout(() => smoke.remove(), 2500);
            }, i * 100);
        }
    },
    
    // Create confetti explosion
    createConfetti(count = 50) {
        const colors = ['#ff00ff', '#00ffff', '#ffd700', '#ff6b35', '#00ff88', '#9b59b6'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                width: ${8 + Math.random() * 8}px;
                height: ${8 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall 3s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    },
    
    // Create floating background elements
    createFloatingElements() {
        const container = document.getElementById('floatingElements');
        if (!container) return;
        
        const items = ['🍄', '✨', '🌟', '💫', '🦋', '🌸', '🎭', '♠️', '♥️', '🐰', '🎩', '🫖', '⏰', '🃏', '🌙', '⭐', '🔮'];
        
        for (let i = 0; i < 25; i++) {
            const el = document.createElement('div');
            el.className = 'float-item';
            el.textContent = items[Math.floor(Math.random() * items.length)];
            el.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                font-size: ${1 + Math.random() * 1}rem;
                opacity: 0.3;
                animation: floatBg ${18 + Math.random() * 15}s linear infinite;
                animation-delay: ${Math.random() * 25}s;
            `;
            container.appendChild(el);
        }
    }
};

// Add animation styles
const effectStyles = document.createElement('style');
effectStyles.textContent = `
    @keyframes toastIn {
        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes toastOut {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
    @keyframes floatUp {
        0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-80px) scale(1.3); }
    }
    @keyframes rippleExpand {
        0% { width: 20px; height: 20px; opacity: 1; }
        100% { width: 150px; height: 150px; opacity: 0; }
    }
    @keyframes smokeRise {
        0% { 
            opacity: 0.8; 
            transform: translateX(-50%) translateY(0) scale(1); 
        }
        100% { 
            opacity: 0; 
            transform: translateX(calc(-50% + var(--drift, 0px))) translateY(-120px) scale(2.5); 
        }
    }
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes floatBg {
        0% { transform: translateY(100vh) rotate(0deg); }
        100% { transform: translateY(-100px) rotate(360deg); }
    }
`;
document.head.appendChild(effectStyles);

// UI Extension for tooltips
UI.showTooltip = function(type) {
    const tooltip = document.getElementById('currencyTooltip');
    if (!tooltip) return;
    
    const messages = {
        wontime: '🐰🕰️ WONTIME<br><small>Your total score!</small>',
        coins: '🪙 COINS<br><small>Spend in Shop & Mini-Games</small>',
        gems: '💎 GEMS<br><small>Buy rare & legendary items</small>'
    };
    
    tooltip.innerHTML = messages[type] || '';
    tooltip.classList.add('show');
    
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 2000);
};

UI.showWontimeInfo = function() {
    const totalWontime = typeof Game !== 'undefined' ? Game.state.totalWontime : 0;
    UI.showResult('🐰🕰️', 'WONTIME', `Total: ${Game.formatNumber(totalWontime)}<br><small>200 WONTIME = 1 🪙</small>`);
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI, Effects };
}
