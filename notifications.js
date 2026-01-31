// ==================== NOTIFICATIONS MODULE ====================
// Animated in-game notifications and alerts

const Notifications = {
    // Active notifications queue
    queue: [],
    isShowing: false,
    container: null,
    
    // Notification types with styles
    types: {
        achievement: {
            icon: '🏆',
            color: '#ffd700',
            sound: 'playWin'
        },
        levelUp: {
            icon: '⬆️',
            color: '#00ff88',
            sound: 'playLevelUp'
        },
        reward: {
            icon: '🎁',
            color: '#ff6b35',
            sound: 'playCoin'
        },
        event: {
            icon: '🎪',
            color: '#9b59b6',
            sound: 'playClick'
        },
        streak: {
            icon: '🔥',
            color: '#ff4444',
            sound: 'playWin'
        },
        quest: {
            icon: '✅',
            color: '#00ffff',
            sound: 'playCoin'
        },
        warning: {
            icon: '⚠️',
            color: '#f39c12',
            sound: 'playError'
        },
        special: {
            icon: '✨',
            color: '#ff00ff',
            sound: 'playGem'
        }
    },
    
    // Initialize
    init() {
        this.createContainer();
    },
    
    // Create notification container
    createContainer() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    },
    
    // Show notification
    show(type, title, message, duration = 3000) {
        const config = this.types[type] || this.types.reward;
        
        const notification = {
            id: Date.now(),
            type,
            title,
            message,
            duration,
            config
        };
        
        this.queue.push(notification);
        
        if (!this.isShowing) {
            this.processQueue();
        }
    },
    
    // Process notification queue
    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }
        
        this.isShowing = true;
        const notification = this.queue.shift();
        
        this.displayNotification(notification);
    },
    
    // Display single notification
    displayNotification(notification) {
        const { config, title, message, duration } = notification;
        
        // Play sound
        if (typeof Audio !== 'undefined' && Audio[config.sound]) {
            Audio[config.sound]();
        }
        
        // Create element
        const el = document.createElement('div');
        el.className = 'notification-item';
        el.style.setProperty('--notif-color', config.color);
        
        el.innerHTML = `
            <div class="notification-icon">${config.icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                ${message ? `<div class="notification-message">${message}</div>` : ''}
            </div>
            <div class="notification-progress"></div>
        `;
        
        this.container.appendChild(el);
        
        // Trigger animation
        requestAnimationFrame(() => {
            el.classList.add('show');
        });
        
        // Progress bar
        const progress = el.querySelector('.notification-progress');
        progress.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
            progress.style.width = '0%';
        });
        
        // Remove after duration
        setTimeout(() => {
            el.classList.remove('show');
            el.classList.add('hide');
            
            setTimeout(() => {
                el.remove();
                this.processQueue();
            }, 300);
        }, duration);
    },
    
    // Quick notification methods
    achievement(title, message) {
        this.show('achievement', title, message, 4000);
    },
    
    levelUp(level) {
        this.show('levelUp', `Level ${level}!`, '+1 Tap Power', 3000);
    },
    
    reward(title, amount) {
        this.show('reward', title, amount, 2500);
    },
    
    event(title, message) {
        this.show('event', title, message, 4000);
    },
    
    streak(days) {
        this.show('streak', `${days} Day Streak!`, 'Keep it up! 🔥', 3000);
    },
    
    quest(questName) {
        this.show('quest', 'Quest Complete!', questName, 3000);
    },
    
    warning(title, message) {
        this.show('warning', title, message, 3000);
    },
    
    special(title, message) {
        this.show('special', title, message, 4000);
    }
};

// Add notification styles
const notifStyles = document.createElement('style');
notifStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 350px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
    }
    
    .notification-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: linear-gradient(135deg, rgba(30,20,50,0.95), rgba(20,10,35,0.95));
        border: 2px solid var(--notif-color, #fff);
        border-radius: 16px;
        box-shadow: 0 5px 30px rgba(0,0,0,0.5), 0 0 20px var(--notif-color, #fff)33;
        backdrop-filter: blur(10px);
        transform: translateY(-100px) scale(0.8);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
        pointer-events: auto;
    }
    
    .notification-item.show {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    
    .notification-item.hide {
        transform: translateY(-30px) scale(0.9);
        opacity: 0;
    }
    
    .notification-icon {
        font-size: 2rem;
        filter: drop-shadow(0 0 10px var(--notif-color, #fff));
        animation: notifIconPulse 1s ease-in-out infinite;
    }
    
    @keyframes notifIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-title {
        font-weight: 800;
        font-size: 1rem;
        color: var(--notif-color, #fff);
        text-shadow: 0 0 10px var(--notif-color, #fff)66;
    }
    
    .notification-message {
        font-size: 0.85rem;
        opacity: 0.9;
        margin-top: 2px;
    }
    
    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--notif-color, #fff);
        border-radius: 0 0 16px 16px;
    }
    
    /* Shake animation for special notifications */
    .notification-item.shake {
        animation: notifShake 0.5s ease-in-out;
    }
    
    @keyframes notifShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(notifStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notifications;
}
