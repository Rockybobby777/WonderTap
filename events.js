// ==================== EVENTS MODULE ====================
// Special events: Happy Hour, Weekend Bonus, Fever Frenzy, etc.

const Events = {
    activeEvents: [],
    
    // Event configurations
    eventTypes: {
        happyHour: {
            name: 'Happy Hour',
            icon: '🎉',
            description: 'x2 coins for 1 hour!',
            color: '#ff6b35',
            multiplier: 2,
            duration: 3600000, // 1 hour
            frequency: 'random' // Random throughout day
        },
        weekendBonus: {
            name: 'Weekend Bonus',
            icon: '🌟',
            description: '+50% coins all weekend!',
            color: '#9b59b6',
            multiplier: 1.5,
            duration: 172800000, // 48 hours
            frequency: 'weekend'
        },
        feverFrenzy: {
            name: 'Fever Frenzy',
            icon: '🔥',
            description: 'x2 fever power for 30 min!',
            color: '#e74c3c',
            feverBoost: 2,
            duration: 1800000, // 30 min
            frequency: 'random'
        },
        luckyDay: {
            name: 'Lucky Day',
            icon: '🍀',
            description: '+20% luck on wheel!',
            color: '#2ecc71',
            luckBoost: 0.2,
            duration: 3600000,
            frequency: 'random'
        },
        spinMania: {
            name: 'Spin Mania',
            icon: '🎡',
            description: 'Free spins every 10 min!',
            color: '#3498db',
            freeSpins: true,
            duration: 1800000,
            frequency: 'random'
        },
        tapRush: {
            name: 'Tap Rush',
            icon: '⚡',
            description: 'x3 XP from taps!',
            color: '#f39c12',
            xpMultiplier: 3,
            duration: 1800000,
            frequency: 'random'
        },
        gemShower: {
            name: 'Gem Shower',
            icon: '💎',
            description: 'Random gems from taps!',
            color: '#00ffff',
            gemChance: 0.02, // 2% chance per tap
            duration: 900000, // 15 min
            frequency: 'rare'
        }
    },
    
    // Initialize events
    init() {
        this.checkActiveEvents();
        this.startEventChecker();
        this.render();
    },
    
    // Check for active events
    checkActiveEvents() {
        const now = Date.now();
        
        // Load saved events
        const saved = localStorage.getItem('wondertap_events');
        if (saved) {
            this.activeEvents = JSON.parse(saved).filter(e => e.endTime > now);
        }
        
        // Check weekend bonus
        const day = new Date().getDay();
        if (day === 0 || day === 6) { // Sunday or Saturday
            const hasWeekend = this.activeEvents.some(e => e.type === 'weekendBonus');
            if (!hasWeekend) {
                this.startEvent('weekendBonus');
            }
        }
        
        this.saveEvents();
    },
    
    // Start event checker interval
    startEventChecker() {
        // Check every minute for random events
        setInterval(() => {
            this.checkRandomEvents();
            this.updateActiveEvents();
        }, 60000);
        
        // Also check immediately
        setTimeout(() => this.checkRandomEvents(), 10000);
    },
    
    // Check for random event triggers
    checkRandomEvents() {
        // Don't spawn too many events
        if (this.activeEvents.length >= 2) return;
        
        // Random chance to spawn event
        const rand = Math.random();
        
        if (rand < 0.02) { // 2% chance per minute
            const eventTypes = ['happyHour', 'feverFrenzy', 'luckyDay', 'spinMania', 'tapRush'];
            const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            
            // Check if not already active
            if (!this.activeEvents.some(e => e.type === randomType)) {
                this.startEvent(randomType);
            }
        }
        
        if (rand < 0.005) { // 0.5% chance for rare event
            if (!this.activeEvents.some(e => e.type === 'gemShower')) {
                this.startEvent('gemShower');
            }
        }
    },
    
    // Start an event
    startEvent(type) {
        const config = this.eventTypes[type];
        if (!config) return;
        
        const event = {
            type,
            startTime: Date.now(),
            endTime: Date.now() + config.duration,
            ...config
        };
        
        this.activeEvents.push(event);
        this.saveEvents();
        
        // Show notification
        UI.showToast(`${config.icon} ${config.name} started!`, 'success');
        
        // Update UI
        this.render();
        this.showEventBanner(event);
    },
    
    // Update active events (remove expired)
    updateActiveEvents() {
        const now = Date.now();
        const before = this.activeEvents.length;
        
        this.activeEvents = this.activeEvents.filter(e => e.endTime > now);
        
        if (this.activeEvents.length !== before) {
            this.saveEvents();
            this.render();
        }
    },
    
    // Save events to localStorage
    saveEvents() {
        localStorage.setItem('wondertap_events', JSON.stringify(this.activeEvents));
    },
    
    // Get active multipliers
    getMultipliers() {
        const result = {
            coins: 1,
            xp: 1,
            fever: 1,
            luck: 0,
            gemChance: 0
        };
        
        for (const event of this.activeEvents) {
            if (event.multiplier) result.coins *= event.multiplier;
            if (event.xpMultiplier) result.xp *= event.xpMultiplier;
            if (event.feverBoost) result.fever *= event.feverBoost;
            if (event.luckBoost) result.luck += event.luckBoost;
            if (event.gemChance) result.gemChance += event.gemChance;
        }
        
        return result;
    },
    
    // Check if free spin available (Spin Mania event)
    checkFreeSpin() {
        const spinEvent = this.activeEvents.find(e => e.type === 'spinMania');
        if (!spinEvent) return false;
        
        const lastFreeSpin = spinEvent.lastFreeSpin || 0;
        const now = Date.now();
        
        // Free spin every 10 minutes during event
        if (now - lastFreeSpin >= 600000) {
            spinEvent.lastFreeSpin = now;
            this.saveEvents();
            return true;
        }
        
        return false;
    },
    
    // Show event banner
    showEventBanner(event) {
        // Remove existing banner
        const existing = document.querySelector('.event-banner');
        if (existing) existing.remove();
        
        const banner = document.createElement('div');
        banner.className = 'event-banner';
        banner.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${event.color}, ${event.color}88);
            padding: 12px 25px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 999;
            animation: bannerSlide 0.4s ease-out;
            box-shadow: 0 5px 30px ${event.color}66;
        `;
        
        banner.innerHTML = `
            <span style="font-size: 1.5rem;">${event.icon}</span>
            <div>
                <div style="font-weight: 700;">${event.name}</div>
                <div style="font-size: 0.75rem; opacity: 0.9;">${event.description}</div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Remove after 5 seconds
        setTimeout(() => {
            banner.style.animation = 'bannerSlide 0.3s ease-in reverse';
            setTimeout(() => banner.remove(), 300);
        }, 5000);
    },
    
    // Render events section
    render() {
        const container = document.getElementById('eventsSection');
        if (!container) return;
        
        if (this.activeEvents.length === 0) {
            container.innerHTML = `
                <div class="events-empty">
                    <div class="events-empty-icon">🎪</div>
                    <div class="events-empty-text">No active events</div>
                    <div class="events-empty-sub">Check back soon!</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.activeEvents.map(event => {
            const remaining = event.endTime - Date.now();
            const timeStr = this.formatTime(remaining);
            
            return `
                <div class="event-card" style="border-color: ${event.color};">
                    <div class="event-icon" style="background: ${event.color};">${event.icon}</div>
                    <div class="event-info">
                        <div class="event-name">${event.name}</div>
                        <div class="event-desc">${event.description}</div>
                    </div>
                    <div class="event-timer">
                        <div class="event-time">${timeStr}</div>
                        <div class="event-label">remaining</div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Format time remaining
    formatTime(ms) {
        if (ms <= 0) return '0:00';
        
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

// Add event styles
const eventStyles = document.createElement('style');
eventStyles.textContent = `
    @keyframes bannerSlide {
        0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    .events-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .events-section-title {
        font-family: 'Bangers', cursive;
        font-size: 1.3rem;
        color: var(--orange);
    }
    
    .events-empty {
        text-align: center;
        padding: 30px;
        opacity: 0.6;
    }
    
    .events-empty-icon { font-size: 3rem; margin-bottom: 10px; }
    .events-empty-text { font-weight: 700; }
    .events-empty-sub { font-size: 0.8rem; margin-top: 5px; }
    
    .event-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: var(--card);
        border: 2px solid;
        border-radius: 15px;
        margin-bottom: 10px;
        animation: eventPulse 2s infinite;
    }
    
    @keyframes eventPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.1); }
        50% { box-shadow: 0 0 20px rgba(255,255,255,0.2); }
    }
    
    .event-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
    }
    
    .event-info { flex: 1; }
    .event-name { font-weight: 700; font-size: 1rem; }
    .event-desc { font-size: 0.75rem; opacity: 0.8; margin-top: 3px; }
    
    .event-timer { text-align: center; }
    .event-time { font-weight: 800; font-size: 1.1rem; color: var(--cyan); }
    .event-label { font-size: 0.65rem; opacity: 0.6; }
    
    /* Active events indicator in header */
    .events-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background: var(--orange);
        border-radius: 50%;
        font-size: 0.65rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: indicatorPulse 1s infinite;
    }
    
    @keyframes indicatorPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(eventStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Events;
}
