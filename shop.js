// ==================== SHOP MODULE ====================
// Shop with profile, equipment system, and Telegram Stars

const Shop = {
    currentTab: 'skins',
    
    // Initialize shop
    init() {
        this.renderTabs();
        this.renderSection('skins');
    },
    
    // Render shop tabs
    renderTabs() {
        const tabsContainer = document.getElementById('shopTabs');
        if (!tabsContainer) return;
        
        const tabs = [
            { id: 'skins', icon: '🐛', label: 'Skins' },
            { id: 'backgrounds', icon: '🎨', label: 'BGs' },
            { id: 'effects', icon: '✨', label: 'Effects' },
            { id: 'boosts', icon: '🚀', label: 'Boosts' },
            { id: 'premium', icon: '⭐', label: 'Premium' }
        ];
        
        tabsContainer.innerHTML = tabs.map(tab => `
            <div class="shop-tab ${tab.id === this.currentTab ? 'active' : ''}" 
                 onclick="Shop.switchTab('${tab.id}')">
                ${tab.icon} ${tab.label}
            </div>
        `).join('');
    },
    
    // Switch tab
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update tab styles
        document.querySelectorAll('.shop-tab').forEach(tab => tab.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Hide all sections, show selected
        document.querySelectorAll('.shop-section').forEach(s => s.classList.remove('active'));
        this.renderSection(tabId);
    },
    
    // Render shop section
    renderSection(sectionId) {
        const container = document.getElementById(`shop-${sectionId}`);
        if (!container) return;
        
        container.classList.add('active');
        
        let items = [], equippedId = null, ownedItems = [];
        
        switch (sectionId) {
            case 'skins':
                items = DATA.skins;
                equippedId = Game.state.equipped.skin;
                ownedItems = Game.state.owned.skins;
                break;
            case 'backgrounds':
                items = DATA.backgrounds;
                equippedId = Game.state.equipped.background;
                ownedItems = Game.state.owned.backgrounds;
                break;
            case 'effects':
                items = DATA.effects;
                equippedId = Game.state.equipped.effect;
                ownedItems = Game.state.owned.effects;
                break;
            case 'boosts':
                this.renderBoosts(container);
                return;
            case 'premium':
                this.renderPremium(container);
                return;
        }
        
        container.innerHTML = items.map(item => {
            const owned = ownedItems.includes(item.id);
            const equipped = equippedId === item.id;
            
            return `
                <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}"
                     onclick="Shop.handleItemClick('${sectionId}', '${item.id}')">
                    <div class="shop-item-rarity ${item.rarity}"></div>
                    ${owned ? '<div class="owned-badge">✓</div>' : ''}
                    ${equipped ? '<div class="equipped-badge">EQUIPPED</div>' : ''}
                    <span class="shop-item-icon">${item.icon}</span>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-desc">${item.desc}</div>
                    ${this.renderPrice(item, owned)}
                </div>
            `;
        }).join('');
    },
    
    // Render boosts section
    renderBoosts(container) {
        container.innerHTML = DATA.boosts.map(item => `
            <div class="shop-item" onclick="Shop.buyBoost('${item.id}')">
                <span class="shop-item-icon">${item.icon}</span>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-desc">${item.desc}</div>
                ${this.renderPrice(item, false)}
            </div>
        `).join('');
    },
    
    // Render premium section (Telegram Stars)
    renderPremium(container) {
        container.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 15px; background: linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1)); border-radius: 15px; margin-bottom: 10px;">
                <div style="font-size: 2rem; margin-bottom: 5px;">⭐</div>
                <div style="font-weight: 700; margin-bottom: 5px;">Telegram Stars</div>
                <div style="font-size: 0.75rem; opacity: 0.7;">Support the game & get exclusive rewards!</div>
            </div>
            ${DATA.premium.map(item => `
                <div class="shop-item" onclick="Shop.buyPremium('${item.id}')">
                    <div class="shop-item-rarity mythic"></div>
                    <span class="shop-item-icon">${item.icon}</span>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-desc">${item.desc}</div>
                    <div class="shop-item-price stars">⭐ ${item.price}</div>
                </div>
            `).join('')}
        `;
    },
    
    // Render price button
    renderPrice(item, owned) {
        if (owned) return `<div class="shop-item-price owned">Owned</div>`;
        if (item.currency === 'free') return `<div class="shop-item-price free">FREE</div>`;
        
        const icon = item.currency === 'coins' ? '🪙' : item.currency === 'gems' ? '💎' : '⭐';
        const cls = item.currency === 'gems' ? 'gems' : item.currency === 'stars' ? 'stars' : '';
        const price = item.price >= 1000 ? (item.price/1000).toFixed(item.price%1000===0?0:1)+'K' : item.price;
        
        return `<div class="shop-item-price ${cls}">${icon} ${price}</div>`;
    },
    
    // Handle item click (buy or equip)
    handleItemClick(category, itemId) {
        const items = category === 'skins' ? DATA.skins : 
                     category === 'backgrounds' ? DATA.backgrounds : DATA.effects;
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        
        const ownedKey = category === 'skins' ? 'skins' :
                        category === 'backgrounds' ? 'backgrounds' : 'effects';
        const owned = Game.state.owned[ownedKey].includes(itemId);
        
        if (owned) {
            this.equipItem(category, itemId);
        } else {
            this.buyItem(category, item);
        }
    },
    
    // Equip item
    equipItem(category, itemId) {
        const key = category === 'skins' ? 'skin' :
                   category === 'backgrounds' ? 'background' : 'effect';
        
        Game.state.equipped[key] = itemId;
        
        // Apply visual changes
        if (key === 'skin') this.applySkin(itemId);
        if (key === 'background') this.applyBackground(itemId);
        if (key === 'effect') this.applyEffect(itemId);
        
        UI.showToast(`Equipped! ✨`, 'success');
        this.renderSection(category);
        Game.save();
    },
    
    // Buy item
    buyItem(category, item) {
        let canAfford = false;
        
        switch (item.currency) {
            case 'coins':
                canAfford = Game.state.coins >= item.price;
                if (canAfford) Game.state.coins -= item.price;
                break;
            case 'gems':
                canAfford = Game.state.gems >= item.price;
                if (canAfford) Game.state.gems -= item.price;
                break;
            case 'stars':
                this.handleTelegramStars(item);
                return;
            case 'free':
                canAfford = true;
                break;
        }
        
        if (!canAfford) {
            UI.showToast(`Not enough ${item.currency}! 😢`, 'error');
            return;
        }
        
        // Add to owned
        const ownedKey = category === 'skins' ? 'skins' :
                        category === 'backgrounds' ? 'backgrounds' : 'effects';
        
        if (!Game.state.owned[ownedKey].includes(item.id)) {
            Game.state.owned[ownedKey].push(item.id);
        }
        
        this.equipItem(category, item.id);
        Game.updateQuestProgress('buy1', 1);
        
        UI.showToast(`${item.name} purchased! 🎉`, 'success');
        Effects.createConfetti(30);
        
        Game.save();
        Game.updateUI();
    },
    
    // Buy boost
    buyBoost(boostId) {
        const boost = DATA.boosts.find(b => b.id === boostId);
        if (!boost) return;
        
        let canAfford = false;
        if (boost.currency === 'coins') {
            canAfford = Game.state.coins >= boost.price;
            if (canAfford) Game.state.coins -= boost.price;
        } else {
            canAfford = Game.state.gems >= boost.price;
            if (canAfford) Game.state.gems -= boost.price;
        }
        
        if (!canAfford) {
            UI.showToast(`Not enough!`, 'error');
            return;
        }
        
        this.applyBoost(boost);
        UI.showToast(`${boost.name} activated! 🚀`, 'success');
        Game.save();
        Game.updateUI();
    },
    
    // Apply boost
    applyBoost(boost) {
        const now = Date.now();
        
        switch (boost.id) {
            case 'x2_1h':
                Game.state.boosts.coinMultiplier = 2;
                Game.state.boosts.coinMultiplierEnd = now + 3600000; // 1 hour
                UI.showToast('x2 Coins for 1 hour! 💰', 'success');
                break;
            case 'x3_30m':
                Game.state.boosts.coinMultiplier = 3;
                Game.state.boosts.coinMultiplierEnd = now + 1800000; // 30 min
                UI.showToast('x3 Coins for 30 min! 💰💰', 'success');
                break;
            case 'x5_15m':
                Game.state.boosts.coinMultiplier = 5;
                Game.state.boosts.coinMultiplierEnd = now + 900000; // 15 min
                UI.showToast('x5 Coins for 15 min! 💰💰💰', 'success');
                break;
            case 'energy_full':
                Game.state.energy = Game.state.maxEnergy;
                UI.showToast('Energy fully restored! ⚡', 'success');
                break;
            case 'energy_infinite':
                Game.state.boosts.infiniteEnergy = true;
                Game.state.boosts.infiniteEnergyEnd = now + 1800000; // 30 min
                Game.state.energy = Game.state.maxEnergy;
                UI.showToast('♾️ Infinite Energy for 30 min!', 'success');
                break;
            case 'autotap_1h':
                Game.startAutoTap(3600); // 1 hour in seconds
                UI.showToast('🤖 Auto-Tap activated for 1 hour!', 'success');
                break;
            case 'lucky_charm':
                Game.state.boosts.luckBonus = 0.5;
                Game.state.boosts.luckBonusEnd = now + 3600000;
                UI.showToast('🍀 +50% Wheel luck for 1 hour!', 'success');
                break;
            case 'magnet':
                Game.state.boosts.coinMagnet = 1.2;
                Game.state.boosts.coinMagnetEnd = now + 7200000; // 2 hours
                UI.showToast('🧲 +20% coins for 2 hours!', 'success');
                break;
            case 'fever_boost':
                Game.activateFever();
                UI.showToast('🔥 FEVER MODE ACTIVATED!', 'success');
                break;
            case 'shield':
                Game.state.boosts.comboShield = true;
                Game.state.boosts.comboShieldEnd = now + 300000; // 5 min
                UI.showToast('🛡️ Combo protected for 5 min!', 'success');
                break;
        }
    },
    
    // Handle Telegram Stars
    handleTelegramStars(item) {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            UI.showToast('Opening Telegram payment...', 'info');
        } else {
            UI.showToast('Available in Telegram app! ⭐', 'info');
        }
    },
    
    // Buy premium
    buyPremium(itemId) {
        const item = DATA.premium.find(p => p.id === itemId);
        if (item) this.handleTelegramStars(item);
    },
    
    // Apply all equipped items visually
    applyEquipped() {
        this.applySkin(Game.state.equipped.skin);
        this.applyBackground(Game.state.equipped.background);
        this.applyEffect(Game.state.equipped.effect);
    },
    
    // Apply skin to caterpillar
    applySkin(skinId) {
        const caterpillar = document.getElementById('caterpillar');
        if (!caterpillar) return;
        
        // Remove all skin classes
        caterpillar.classList.remove('skin-rainbow', 'skin-golden', 'skin-neon', 'skin-galaxy', 
            'skin-diamond', 'skin-fire', 'skin-ice', 'skin-zombie', 'skin-alien', 
            'skin-cheshire', 'skin-madhatter', 'skin-queen', 'skin-rabbit', 
            'skin-mushroom', 'skin-dragon', 'skin-void', 'skin-crystal',
            'skin-clown', 'skin-shark', 'skin-skull', 'skin-phoenix');
        
        // Add new skin class
        if (skinId && skinId !== 'classic') {
            caterpillar.classList.add('skin-' + skinId);
        }
        
        // Get or create head overlay that REPLACES the caterpillar head
        let headOverlay = document.getElementById('skinHead');
        if (!headOverlay) {
            headOverlay = document.createElement('div');
            headOverlay.id = 'skinHead';
            // Position it exactly where the caterpillar head is
            const tapArea = document.querySelector('.tap-area');
            if (tapArea) {
                tapArea.appendChild(headOverlay);
            }
        }
        
        // Style for the head - positioned to overlap the caterpillar's head
        headOverlay.style.cssText = `
            position: absolute;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4.5rem;
            z-index: 50;
            pointer-events: none;
            transition: all 0.3s ease;
            text-shadow: 0 0 20px rgba(255,255,255,0.5);
        `;
        
        // Get head emoji from skin data
        const skin = DATA.skins.find(s => s.id === skinId);
        if (skin && skinId !== 'classic') {
            headOverlay.textContent = skin.head || skin.icon;
            headOverlay.style.display = 'block';
            
            // Special animations for different rarities
            if (skin.rarity === 'mythic') {
                headOverlay.style.fontSize = '5rem';
                headOverlay.style.animation = 'mythicHeadGlow 2s ease-in-out infinite';
                headOverlay.style.filter = 'drop-shadow(0 0 20px gold) drop-shadow(0 0 30px magenta)';
            } else if (skin.rarity === 'legendary') {
                headOverlay.style.fontSize = '4.5rem';
                headOverlay.style.animation = 'legendaryHeadPulse 3s ease-in-out infinite';
                headOverlay.style.filter = 'drop-shadow(0 0 15px cyan)';
            } else {
                headOverlay.style.animation = 'none';
                headOverlay.style.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.5))';
            }
        } else {
            headOverlay.style.display = 'none';
        }
        
        console.log('🐛 Skin applied:', skinId);
    },
    
    // Apply background
    applyBackground(bgId) {
        const trippyBg = document.querySelector('.trippy-bg');
        if (!trippyBg) return;
        
        // Remove all background classes
        trippyBg.classList.remove('bg-teaparty', 'bg-garden', 'bg-mushforest', 'bg-rabbithole',
            'bg-chessboard', 'bg-space', 'bg-underwater', 'bg-candyland', 'bg-mirror',
            'bg-clockwork', 'bg-aurora', 'bg-psychedelic', 'bg-void', 'bg-haunted', 'bg-starfield');
        
        // Add new background class
        if (bgId && bgId !== 'night') {
            trippyBg.classList.add('bg-' + bgId);
        }
        
        // Create animated floating elements for this background
        this.createBackgroundElements(bgId || 'night');
        
        console.log('🎨 Background applied:', bgId || 'night');
    },
    
    // Create animated elements for each background theme
    createBackgroundElements(bgId) {
        const container = document.getElementById('floatingElements');
        if (!container) return;
        
        // Clear existing elements
        container.innerHTML = '';
        
        // Define elements for each background
        const themes = {
            night: { elements: ['🌙', '⭐', '✨', '🦋'], count: 15, speed: 'slow' },
            teaparty: { elements: ['🫖', '☕', '🍰', '🎩', '⏰', '🃏'], count: 20, speed: 'medium' },
            garden: { elements: ['🌹', '🌷', '🌸', '🦋', '🐛', '♥️'], count: 25, speed: 'slow' },
            mushforest: { elements: ['🍄', '🍄', '🍄', '🌿', '🦋', '✨'], count: 20, speed: 'slow' },
            rabbithole: { elements: ['🐰', '⏰', '🎩', '🃏', '🔮', '⬇️'], count: 15, speed: 'fast' },
            chessboard: { elements: ['♟️', '♞', '♝', '♜', '♛', '♚', '♙', '♘', '♗', '♖', '♕', '♔'], count: 30, speed: 'medium' },
            space: { elements: ['🌟', '⭐', '✨', '🚀', '🛸', '🌙', '☄️'], count: 25, speed: 'slow' },
            underwater: { elements: ['🐠', '🐟', '🐙', '🦀', '🫧', '🐚', '🌊'], count: 25, speed: 'medium' },
            candyland: { elements: ['🍭', '🍬', '🍫', '🧁', '🍩', '🍪', '🎀'], count: 25, speed: 'medium' },
            mirror: { elements: ['🪞', '✨', '💎', '🔮', '👁️', '🌀'], count: 15, speed: 'slow' },
            clockwork: { elements: ['⚙️', '⏰', '🔧', '⏱️', '🕐', '🔩'], count: 20, speed: 'medium' },
            aurora: { elements: ['✨', '💫', '🌟', '❄️', '🌌', '💜'], count: 20, speed: 'slow' },
            psychedelic: { elements: ['🌀', '🍄', '👁️', '🌈', '💜', '🔮', '✨'], count: 30, speed: 'fast' },
            void: { elements: ['🕳️', '👁️', '✨', '💀', '🌑'], count: 10, speed: 'slow' },
            haunted: { elements: ['👻', '🎃', '🦇', '🕷️', '💀', '🌙', '🕸️', '☠️'], count: 25, speed: 'medium' },
            starfield: { elements: ['⭐', '✨', '🌟', '💫', '✦', '✧', '🌠'], count: 40, speed: 'slow' }
        };
        
        const theme = themes[bgId] || themes.night;
        
        // Create floating elements
        for (let i = 0; i < theme.count; i++) {
            const element = document.createElement('div');
            element.className = 'floating-item';
            element.textContent = theme.elements[Math.floor(Math.random() * theme.elements.length)];
            
            // Random horizontal position
            element.style.left = Math.random() * 100 + '%';
            
            // Random size
            const size = 1 + Math.random() * 2;
            element.style.fontSize = size + 'rem';
            
            // Animation duration based on speed
            const baseDuration = theme.speed === 'fast' ? 8 : theme.speed === 'medium' ? 15 : 22;
            const duration = baseDuration + Math.random() * 10;
            element.style.animationDuration = duration + 's';
            
            // Random delay so they start at different positions
            element.style.animationDelay = -(Math.random() * duration) + 's';
            
            container.appendChild(element);
        }
    },
    
    // Apply tap effect
    applyEffect(effectId) {
        // Store effect ID for use in tap effects
        Game.state.currentEffect = effectId || 'classic';
        console.log('✨ Effect applied:', effectId);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Shop;
}
