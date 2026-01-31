// ==================== TELEGRAM INTEGRATION MODULE ====================
// Complete Telegram WebApp API integration

const TelegramApp = {
    // Telegram WebApp instance
    webapp: null,
    user: null,
    
    // Initialize Telegram integration
    init() {
        // Check if running in Telegram
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.webapp = Telegram.WebApp;
            this.setupWebApp();
            this.loadUser();
            console.log('📱 Telegram WebApp initialized');
        } else {
            console.log('🌐 Running in browser (not Telegram)');
            this.setupBrowserMode();
        }
    },
    
    // Setup Telegram WebApp
    setupWebApp() {
        const webapp = this.webapp;
        
        // Expand to full height
        webapp.expand();
        
        // Enable closing confirmation
        webapp.enableClosingConfirmation();
        
        // Set header color to match theme
        webapp.setHeaderColor('#0a0015');
        webapp.setBackgroundColor('#0a0015');
        
        // Setup back button
        webapp.BackButton.onClick(() => {
            if (UI.currentPage !== 'homePage') {
                UI.showPage('homePage');
            }
        });
        
        // Setup main button (hidden by default)
        webapp.MainButton.setParams({
            text: 'SHARE SCORE',
            color: '#ff00ff',
            text_color: '#ffffff',
            is_visible: false
        });
        
        webapp.MainButton.onClick(() => {
            this.shareScore();
        });
        
        // Handle theme changes
        webapp.onEvent('themeChanged', () => {
            this.applyTheme();
        });
        
        // Handle viewport changes
        webapp.onEvent('viewportChanged', (event) => {
            if (event.isStateStable) {
                document.body.style.height = `${webapp.viewportStableHeight}px`;
            }
        });
        
        // Ready signal
        webapp.ready();
    },
    
    // Load user data from Telegram
    loadUser() {
        if (!this.webapp || !this.webapp.initDataUnsafe) return;
        
        const initData = this.webapp.initDataUnsafe;
        
        if (initData.user) {
            this.user = {
                id: initData.user.id,
                firstName: initData.user.first_name,
                lastName: initData.user.last_name || '',
                username: initData.user.username || '',
                languageCode: initData.user.language_code || 'en',
                isPremium: initData.user.is_premium || false,
                photoUrl: initData.user.photo_url || null
            };
            
            // Update game state with user info
            Game.state.telegramId = this.user.id;
            Game.state.username = this.user.username || this.user.firstName;
            
            // Check for referral
            if (initData.start_param) {
                this.handleReferral(initData.start_param);
            }
            
            // Update UI with user name
            this.updateUserDisplay();
            
            console.log('👤 User loaded:', this.user.firstName);
        }
    },
    
    // Setup browser mode (for testing)
    setupBrowserMode() {
        // Create mock user for testing
        this.user = {
            id: 'browser_' + Date.now(),
            firstName: 'Player',
            lastName: '',
            username: 'player',
            languageCode: 'en',
            isPremium: false,
            photoUrl: null
        };
        
        Game.state.telegramId = this.user.id;
        Game.state.username = this.user.firstName;
    },
    
    // Update user display in UI
    updateUserDisplay() {
        const nameEl = document.getElementById('playerName');
        if (nameEl && this.user) {
            nameEl.textContent = this.user.firstName;
        }
    },
    
    // Apply Telegram theme
    applyTheme() {
        if (!this.webapp) return;
        
        const theme = this.webapp.themeParams;
        
        // Could apply theme colors to CSS variables
        // For now, we keep our psychedelic theme
    },
    
    // ==================== PAYMENTS ====================
    
    // Open Telegram Stars payment
    openStarsPayment(item) {
        if (!this.webapp) {
            UI.showToast('Available in Telegram app only!', 'warning');
            return;
        }
        
        // Create invoice parameters
        const invoiceParams = this.createInvoice(item);
        
        // Open payment
        this.webapp.openInvoice(invoiceParams.url, (status) => {
            if (status === 'paid') {
                this.handlePaymentSuccess(item);
            } else if (status === 'cancelled') {
                UI.showToast('Payment cancelled', 'info');
            } else if (status === 'failed') {
                UI.showToast('Payment failed', 'error');
            }
        });
    },
    
    // Create invoice (would be done server-side in production)
    createInvoice(item) {
        // In production, this would call your backend to create an invoice
        // For now, return a mock structure
        return {
            url: `https://t.me/$WonderTapBot?startattach=invoice_${item.id}`,
            item: item
        };
    },
    
    // Handle successful payment
    handlePaymentSuccess(item) {
        // Apply the purchased item
        switch (item.type) {
            case 'coins':
                Game.state.coins += item.amount;
                break;
            case 'gems':
                Game.state.gems += item.amount;
                break;
            case 'premium_pass':
                Game.state.battlePass.premium = true;
                break;
            case 'no_ads':
                Game.state.noAds = true;
                break;
            case 'spin_pack':
                Game.state.spins += item.amount;
                break;
            case 'vip':
                Game.state.vip = true;
                Game.state.vipExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
                break;
        }
        
        Game.save();
        Game.updateUI();
        
        UI.showResult('⭐', 'PURCHASE COMPLETE!', `Thank you for your support!`);
        Effects.createConfetti(50);
        
        if (typeof Notifications !== 'undefined') {
            Notifications.special('Purchase Complete!', item.name);
        }
    },
    
    // ==================== SHARING ====================
    
    // Share score to chat
    shareScore() {
        if (!this.webapp) {
            this.shareBrowser();
            return;
        }
        
        const score = Game.state.totalCoinsEarned;
        const level = Game.state.level;
        
        const message = `🍄 WonderTap Score!\n\n` +
            `🏆 Level: ${level}\n` +
            `🪙 Total Coins: ${Game.formatNumber(score)}\n` +
            `🔥 Best Streak: ${Game.state.maxStreak || 0} days\n\n` +
            `Can you beat my score? 👇`;
        
        this.webapp.switchInlineQuery(message, ['users', 'groups', 'channels']);
    },
    
    // Share achievement
    shareAchievement(achievement) {
        if (!this.webapp) return;
        
        const message = `🏆 Achievement Unlocked in WonderTap!\n\n` +
            `${achievement.icon} ${achievement.name}\n` +
            `${achievement.description}\n\n` +
            `Play now: t.me/WonderTapBot`;
        
        this.webapp.switchInlineQuery(message, ['users', 'groups']);
    },
    
    // Share via browser (fallback)
    shareBrowser() {
        const score = Game.state.totalCoinsEarned;
        const text = `🍄 I scored ${Game.formatNumber(score)} coins in WonderTap! Can you beat me? Play now: t.me/WonderTapBot`;
        
        if (navigator.share) {
            navigator.share({
                title: 'WonderTap Score',
                text: text,
                url: 'https://t.me/WonderTapBot'
            });
        } else {
            navigator.clipboard.writeText(text);
            UI.showToast('Score copied to clipboard!', 'success');
        }
    },
    
    // Show share button after game
    showShareButton() {
        if (this.webapp && this.webapp.MainButton) {
            this.webapp.MainButton.show();
        }
    },
    
    // Hide share button
    hideShareButton() {
        if (this.webapp && this.webapp.MainButton) {
            this.webapp.MainButton.hide();
        }
    },
    
    // ==================== REFERRALS ====================
    
    // Handle incoming referral
    handleReferral(startParam) {
        // Parse referral code
        if (startParam.startsWith('ref_')) {
            const referrerId = startParam.substring(4);
            
            // Check if already referred
            if (Game.state.referredBy) {
                return;
            }
            
            // Can't refer yourself
            if (referrerId === String(this.user?.id)) {
                return;
            }
            
            // Save referrer
            Game.state.referredBy = referrerId;
            Game.state.referralRewardClaimed = false;
            Game.save();
            
            // Show welcome message
            setTimeout(() => {
                UI.showResult('🎁', 'WELCOME BONUS!', 'You were invited by a friend!\nClaim your bonus in the Friends tab!');
            }, 2000);
        }
    },
    
    // Get referral link
    getReferralLink() {
        const id = this.user?.id || 'guest';
        return `https://t.me/WonderTapBot?start=ref_${id}`;
    },
    
    // Copy referral link
    copyReferralLink() {
        const link = this.getReferralLink();
        navigator.clipboard.writeText(link);
        UI.showToast('Referral link copied! 📋', 'success');
        
        if (typeof Audio !== 'undefined') Audio.playClick();
    },
    
    // Share referral link
    shareReferralLink() {
        const link = this.getReferralLink();
        const message = `🍄 Join me in WonderTap!\n\n` +
            `The trippiest tap game on Telegram!\n` +
            `🎁 Get bonus coins when you join!\n\n` +
            `Play now: ${link}`;
        
        if (this.webapp) {
            this.webapp.switchInlineQuery(message, ['users', 'groups', 'channels']);
        } else if (navigator.share) {
            navigator.share({
                title: 'Join WonderTap!',
                text: message,
                url: link
            });
        } else {
            navigator.clipboard.writeText(message);
            UI.showToast('Invite message copied!', 'success');
        }
    },
    
    // Claim referral reward
    claimReferralReward() {
        if (!Game.state.referredBy || Game.state.referralRewardClaimed) {
            UI.showToast('No reward to claim!', 'warning');
            return;
        }
        
        // Give reward
        Game.state.coins += 2000;
        Game.state.gems += 15;
        Game.state.referralRewardClaimed = true;
        Game.save();
        Game.updateUI();
        
        UI.showResult('🎁', 'REFERRAL BONUS!', '+2,000 🪙 +15 💎');
        Effects.createConfetti(40);
        
        // In production, would also notify the referrer via backend
    },
    
    // ==================== CLOUD STORAGE ====================
    
    // Save to Telegram Cloud Storage
    saveToCloud() {
        if (!this.webapp || !this.webapp.CloudStorage) return;
        
        const saveData = JSON.stringify({
            coins: Game.state.coins,
            gems: Game.state.gems,
            level: Game.state.level,
            totalTaps: Game.state.totalTaps,
            owned: Game.state.owned,
            equipped: Game.state.equipped,
            battlePass: Game.state.battlePass,
            timestamp: Date.now()
        });
        
        this.webapp.CloudStorage.setItem('game_save', saveData, (error, success) => {
            if (success) {
                console.log('☁️ Saved to cloud');
            }
        });
    },
    
    // Load from Telegram Cloud Storage
    loadFromCloud(callback) {
        if (!this.webapp || !this.webapp.CloudStorage) {
            callback(null);
            return;
        }
        
        this.webapp.CloudStorage.getItem('game_save', (error, value) => {
            if (value) {
                try {
                    const data = JSON.parse(value);
                    callback(data);
                } catch (e) {
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    },
    
    // ==================== HAPTICS ====================
    
    // Trigger haptic feedback
    haptic(type = 'light') {
        if (!this.webapp || !this.webapp.HapticFeedback) return;
        
        switch (type) {
            case 'light':
                this.webapp.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                this.webapp.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                this.webapp.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                this.webapp.HapticFeedback.notificationOccurred('success');
                break;
            case 'warning':
                this.webapp.HapticFeedback.notificationOccurred('warning');
                break;
            case 'error':
                this.webapp.HapticFeedback.notificationOccurred('error');
                break;
            case 'select':
                this.webapp.HapticFeedback.selectionChanged();
                break;
        }
    },
    
    // ==================== POPUPS ====================
    
    // Show confirm popup
    showConfirm(message, callback) {
        if (this.webapp && this.webapp.showConfirm) {
            this.webapp.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    },
    
    // Show alert popup
    showAlert(message, callback) {
        if (this.webapp && this.webapp.showAlert) {
            this.webapp.showAlert(message, callback);
        } else {
            alert(message);
            if (callback) callback();
        }
    },
    
    // ==================== QR SCANNER ====================
    
    // Open QR scanner
    openQRScanner(callback) {
        if (!this.webapp || !this.webapp.showScanQrPopup) {
            UI.showToast('QR Scanner not available', 'warning');
            return;
        }
        
        this.webapp.showScanQrPopup({
            text: 'Scan a WonderTap QR code'
        }, (text) => {
            if (text) {
                callback(text);
                this.webapp.closeScanQrPopup();
            }
        });
    },
    
    // ==================== UTILITIES ====================
    
    // Check if running in Telegram
    isInTelegram() {
        return this.webapp !== null;
    },
    
    // Check if user is premium
    isPremiumUser() {
        return this.user?.isPremium || false;
    },
    
    // Get platform
    getPlatform() {
        if (this.webapp) {
            return this.webapp.platform;
        }
        return 'browser';
    },
    
    // Open link
    openLink(url, tryInstantView = false) {
        if (this.webapp) {
            this.webapp.openLink(url, { try_instant_view: tryInstantView });
        } else {
            window.open(url, '_blank');
        }
    },
    
    // Open Telegram link
    openTelegramLink(url) {
        if (this.webapp) {
            this.webapp.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramApp;
}
