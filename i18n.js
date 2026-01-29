// ==================== INTERNATIONALIZATION MODULE ====================
// Multi-language support - Top 10 most spoken languages

const I18n = {
    currentLang: 'en',
    
    // 10 langues les plus importantes
    languages: {
        en: { name: 'English', flag: '🇬🇧', native: 'English' },
        fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
        es: { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
        zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
        hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
        ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
        pt: { name: 'Portuguese', flag: '🇧🇷', native: 'Português' },
        ru: { name: 'Russian', flag: '🇷🇺', native: 'Русский' },
        ja: { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
        de: { name: 'German', flag: '🇩🇪', native: 'Deutsch' }
    },
    
    translations: {
        // ==================== ENGLISH ====================
        en: {
            // Navigation
            nav_home: 'Home',
            nav_shop: 'Shop',
            nav_games: 'Games',
            nav_quests: 'Quests',
            nav_friends: 'Friends',
            nav_profile: 'Profile',
            
            // Home
            daily: 'Daily',
            wheel: 'Wheel',
            pass: 'Pass',
            rank: 'Rank',
            energy: 'Energy',
            fever: 'FEVER',
            combo: 'COMBO',
            tap_to_earn: 'Tap to earn!',
            
            // Profile
            profile: 'Profile',
            level: 'Level',
            total_coins: 'Total Coins',
            total_taps: 'Total Taps',
            best_combo: 'Best Combo',
            best_streak: 'Best Streak',
            skins: 'Skins',
            backgrounds: 'Backgrounds',
            effects: 'Effects',
            stats: 'Statistics',
            
            // Shop
            shop_title: 'SHOP',
            equipped: 'Equipped',
            owned: 'Owned',
            buy: 'Buy',
            equip: 'Equip',
            not_enough: 'Not enough!',
            purchase_success: 'Purchase successful!',
            
            // Wheel
            wheel_title: 'FORTUNE WHEEL',
            spin: 'SPIN!',
            spins: 'Spins',
            no_spins: 'No spins left!',
            
            // Quests
            quests_title: 'QUESTS',
            daily_quests: 'Daily',
            weekly_quests: 'Weekly',
            achievements: 'Achievements',
            claim: 'Claim',
            completed: 'Completed',
            
            // Games
            games_title: 'MINI GAMES',
            play: 'Play',
            high_score: 'High Score',
            
            // Friends
            friends_title: 'INVITE FRIENDS',
            friends_reward: 'Per friend',
            your_link: 'Your Link',
            copy: 'Copy',
            share: 'Share',
            
            // Settings
            settings: 'Settings',
            music: 'Music',
            sound: 'Sound',
            language: 'Language',
            
            // General
            coins: 'Coins',
            gems: 'Gems',
            close: 'Close',
            confirm: 'Confirm',
            cancel: 'Cancel',
            save: 'Save',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success!'
        },
        
        // ==================== FRANÇAIS ====================
        fr: {
            nav_home: 'Accueil',
            nav_shop: 'Boutique',
            nav_games: 'Jeux',
            nav_quests: 'Quêtes',
            nav_friends: 'Amis',
            nav_profile: 'Profil',
            
            daily: 'Quotidien',
            wheel: 'Roue',
            pass: 'Pass',
            rank: 'Rang',
            energy: 'Énergie',
            fever: 'FIÈVRE',
            combo: 'COMBO',
            tap_to_earn: 'Tape pour gagner!',
            
            profile: 'Profil',
            level: 'Niveau',
            total_coins: 'Total Pièces',
            total_taps: 'Total Taps',
            best_combo: 'Meilleur Combo',
            best_streak: 'Meilleure Série',
            skins: 'Skins',
            backgrounds: 'Fonds',
            effects: 'Effets',
            stats: 'Statistiques',
            
            shop_title: 'BOUTIQUE',
            equipped: 'Équipé',
            owned: 'Possédé',
            buy: 'Acheter',
            equip: 'Équiper',
            not_enough: 'Pas assez!',
            purchase_success: 'Achat réussi!',
            
            wheel_title: 'ROUE DE FORTUNE',
            spin: 'TOURNER!',
            spins: 'Tours',
            no_spins: 'Plus de tours!',
            
            quests_title: 'QUÊTES',
            daily_quests: 'Quotidiennes',
            weekly_quests: 'Hebdomadaires',
            achievements: 'Succès',
            claim: 'Récupérer',
            completed: 'Terminé',
            
            games_title: 'MINI JEUX',
            play: 'Jouer',
            high_score: 'Record',
            
            friends_title: 'INVITER DES AMIS',
            friends_reward: 'Par ami',
            your_link: 'Ton lien',
            copy: 'Copier',
            share: 'Partager',
            
            settings: 'Paramètres',
            music: 'Musique',
            sound: 'Son',
            language: 'Langue',
            
            coins: 'Pièces',
            gems: 'Gemmes',
            close: 'Fermer',
            confirm: 'Confirmer',
            cancel: 'Annuler',
            save: 'Sauvegarder',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès!'
        },
        
        // ==================== ESPAÑOL ====================
        es: {
            nav_home: 'Inicio',
            nav_shop: 'Tienda',
            nav_games: 'Juegos',
            nav_quests: 'Misiones',
            nav_friends: 'Amigos',
            nav_profile: 'Perfil',
            
            daily: 'Diario',
            wheel: 'Ruleta',
            pass: 'Pase',
            rank: 'Rango',
            energy: 'Energía',
            fever: 'FIEBRE',
            combo: 'COMBO',
            tap_to_earn: '¡Toca para ganar!',
            
            profile: 'Perfil',
            level: 'Nivel',
            total_coins: 'Total Monedas',
            total_taps: 'Total Toques',
            best_combo: 'Mejor Combo',
            best_streak: 'Mejor Racha',
            skins: 'Skins',
            backgrounds: 'Fondos',
            effects: 'Efectos',
            stats: 'Estadísticas',
            
            shop_title: 'TIENDA',
            wheel_title: 'RULETA DE FORTUNA',
            quests_title: 'MISIONES',
            games_title: 'MINI JUEGOS',
            friends_title: 'INVITAR AMIGOS',
            
            spin: '¡GIRAR!',
            spins: 'Giros',
            buy: 'Comprar',
            equip: 'Equipar',
            claim: 'Reclamar',
            play: 'Jugar',
            copy: 'Copiar',
            share: 'Compartir',
            
            settings: 'Ajustes',
            music: 'Música',
            sound: 'Sonido',
            language: 'Idioma',
            close: 'Cerrar',
            success: '¡Éxito!'
        },
        
        // ==================== 中文 (Chinese) ====================
        zh: {
            nav_home: '首页',
            nav_shop: '商店',
            nav_games: '游戏',
            nav_quests: '任务',
            nav_friends: '好友',
            nav_profile: '个人',
            
            daily: '每日',
            wheel: '转盘',
            pass: '通行证',
            rank: '排名',
            energy: '能量',
            fever: '狂热',
            combo: '连击',
            tap_to_earn: '点击赚取!',
            
            profile: '个人资料',
            level: '等级',
            total_coins: '总金币',
            total_taps: '总点击',
            stats: '统计',
            
            shop_title: '商店',
            wheel_title: '幸运转盘',
            quests_title: '任务',
            games_title: '小游戏',
            friends_title: '邀请好友',
            
            spin: '旋转!',
            buy: '购买',
            claim: '领取',
            play: '玩',
            copy: '复制',
            share: '分享',
            
            settings: '设置',
            music: '音乐',
            sound: '音效',
            language: '语言',
            close: '关闭',
            success: '成功!'
        },
        
        // ==================== हिन्दी (Hindi) ====================
        hi: {
            nav_home: 'होम',
            nav_shop: 'दुकान',
            nav_games: 'खेल',
            nav_quests: 'क्वेस्ट',
            nav_friends: 'दोस्त',
            nav_profile: 'प्रोफाइल',
            
            daily: 'दैनिक',
            wheel: 'पहिया',
            pass: 'पास',
            rank: 'रैंक',
            energy: 'ऊर्जा',
            fever: 'फीवर',
            combo: 'कॉम्बो',
            tap_to_earn: 'कमाने के लिए टैप करें!',
            
            profile: 'प्रोफाइल',
            level: 'स्तर',
            stats: 'आंकड़े',
            
            shop_title: 'दुकान',
            wheel_title: 'भाग्य चक्र',
            quests_title: 'क्वेस्ट',
            games_title: 'मिनी गेम्स',
            friends_title: 'दोस्तों को आमंत्रित करें',
            
            spin: 'घुमाएं!',
            buy: 'खरीदें',
            claim: 'दावा करें',
            play: 'खेलें',
            
            settings: 'सेटिंग्स',
            music: 'संगीत',
            sound: 'ध्वनि',
            language: 'भाषा',
            close: 'बंद करें',
            success: 'सफलता!'
        },
        
        // ==================== العربية (Arabic) ====================
        ar: {
            nav_home: 'الرئيسية',
            nav_shop: 'المتجر',
            nav_games: 'ألعاب',
            nav_quests: 'مهام',
            nav_friends: 'أصدقاء',
            nav_profile: 'الملف',
            
            daily: 'يومي',
            wheel: 'العجلة',
            pass: 'تذكرة',
            rank: 'الترتيب',
            energy: 'طاقة',
            fever: 'حمى',
            combo: 'كومبو',
            tap_to_earn: 'اضغط لتكسب!',
            
            profile: 'الملف الشخصي',
            level: 'المستوى',
            stats: 'إحصائيات',
            
            shop_title: 'المتجر',
            wheel_title: 'عجلة الحظ',
            quests_title: 'المهام',
            games_title: 'ألعاب صغيرة',
            friends_title: 'دعوة الأصدقاء',
            
            spin: 'دوران!',
            buy: 'شراء',
            claim: 'استلام',
            play: 'العب',
            
            settings: 'الإعدادات',
            music: 'موسيقى',
            sound: 'صوت',
            language: 'اللغة',
            close: 'إغلاق',
            success: 'نجاح!'
        },
        
        // ==================== PORTUGUÊS ====================
        pt: {
            nav_home: 'Início',
            nav_shop: 'Loja',
            nav_games: 'Jogos',
            nav_quests: 'Missões',
            nav_friends: 'Amigos',
            nav_profile: 'Perfil',
            
            daily: 'Diário',
            wheel: 'Roleta',
            pass: 'Passe',
            rank: 'Ranking',
            energy: 'Energia',
            fever: 'FEBRE',
            combo: 'COMBO',
            tap_to_earn: 'Toque para ganhar!',
            
            profile: 'Perfil',
            level: 'Nível',
            total_coins: 'Total Moedas',
            total_taps: 'Total Toques',
            stats: 'Estatísticas',
            
            shop_title: 'LOJA',
            wheel_title: 'ROLETA DA FORTUNA',
            quests_title: 'MISSÕES',
            games_title: 'MINI JOGOS',
            friends_title: 'CONVIDAR AMIGOS',
            
            spin: 'GIRAR!',
            buy: 'Comprar',
            claim: 'Resgatar',
            play: 'Jogar',
            copy: 'Copiar',
            share: 'Compartilhar',
            
            settings: 'Configurações',
            music: 'Música',
            sound: 'Som',
            language: 'Idioma',
            close: 'Fechar',
            success: 'Sucesso!'
        },
        
        // ==================== РУССКИЙ ====================
        ru: {
            nav_home: 'Главная',
            nav_shop: 'Магазин',
            nav_games: 'Игры',
            nav_quests: 'Задания',
            nav_friends: 'Друзья',
            nav_profile: 'Профиль',
            
            daily: 'Ежедневно',
            wheel: 'Колесо',
            pass: 'Пропуск',
            rank: 'Рейтинг',
            energy: 'Энергия',
            fever: 'ЛИХОРАДКА',
            combo: 'КОМБО',
            tap_to_earn: 'Нажимай и зарабатывай!',
            
            profile: 'Профиль',
            level: 'Уровень',
            total_coins: 'Всего монет',
            total_taps: 'Всего нажатий',
            stats: 'Статистика',
            
            shop_title: 'МАГАЗИН',
            wheel_title: 'КОЛЕСО ФОРТУНЫ',
            quests_title: 'ЗАДАНИЯ',
            games_title: 'МИНИ ИГРЫ',
            friends_title: 'ПРИГЛАСИТЬ ДРУЗЕЙ',
            
            spin: 'КРУТИТЬ!',
            buy: 'Купить',
            claim: 'Забрать',
            play: 'Играть',
            copy: 'Копировать',
            share: 'Поделиться',
            
            settings: 'Настройки',
            music: 'Музыка',
            sound: 'Звук',
            language: 'Язык',
            close: 'Закрыть',
            success: 'Успех!'
        },
        
        // ==================== 日本語 ====================
        ja: {
            nav_home: 'ホーム',
            nav_shop: 'ショップ',
            nav_games: 'ゲーム',
            nav_quests: 'クエスト',
            nav_friends: '友達',
            nav_profile: 'プロフィール',
            
            daily: 'デイリー',
            wheel: 'ルーレット',
            pass: 'パス',
            rank: 'ランク',
            energy: 'エネルギー',
            fever: 'フィーバー',
            combo: 'コンボ',
            tap_to_earn: 'タップで稼ごう!',
            
            profile: 'プロフィール',
            level: 'レベル',
            stats: '統計',
            
            shop_title: 'ショップ',
            wheel_title: 'ラッキールーレット',
            quests_title: 'クエスト',
            games_title: 'ミニゲーム',
            friends_title: '友達を招待',
            
            spin: '回す!',
            buy: '購入',
            claim: '受け取る',
            play: 'プレイ',
            
            settings: '設定',
            music: '音楽',
            sound: 'サウンド',
            language: '言語',
            close: '閉じる',
            success: '成功!'
        },
        
        // ==================== DEUTSCH ====================
        de: {
            nav_home: 'Startseite',
            nav_shop: 'Shop',
            nav_games: 'Spiele',
            nav_quests: 'Aufgaben',
            nav_friends: 'Freunde',
            nav_profile: 'Profil',
            
            daily: 'Täglich',
            wheel: 'Rad',
            pass: 'Pass',
            rank: 'Rang',
            energy: 'Energie',
            fever: 'FIEBER',
            combo: 'KOMBO',
            tap_to_earn: 'Tippe um zu verdienen!',
            
            profile: 'Profil',
            level: 'Level',
            total_coins: 'Münzen gesamt',
            total_taps: 'Tipps gesamt',
            stats: 'Statistiken',
            
            shop_title: 'SHOP',
            wheel_title: 'GLÜCKSRAD',
            quests_title: 'AUFGABEN',
            games_title: 'MINI SPIELE',
            friends_title: 'FREUNDE EINLADEN',
            
            spin: 'DREHEN!',
            buy: 'Kaufen',
            claim: 'Abholen',
            play: 'Spielen',
            copy: 'Kopieren',
            share: 'Teilen',
            
            settings: 'Einstellungen',
            music: 'Musik',
            sound: 'Sound',
            language: 'Sprache',
            close: 'Schließen',
            success: 'Erfolg!'
        }
    },
    
    // Initialize
    init() {
        const saved = localStorage.getItem('wondertap_lang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        } else {
            this.detectLanguage();
        }
        this.applyTranslations();
    },
    
    // Detect user language
    detectLanguage() {
        if (typeof TelegramApp !== 'undefined' && TelegramApp.user) {
            const lang = TelegramApp.user.languageCode;
            if (lang && this.translations[lang]) {
                this.currentLang = lang;
                return;
            }
        }
        const browserLang = navigator.language?.split('-')[0];
        if (browserLang && this.translations[browserLang]) {
            this.currentLang = browserLang;
        }
    },
    
    // Get translation
    t(key) {
        const lang = this.translations[this.currentLang] || this.translations.en;
        return lang[key] || this.translations.en[key] || key;
    },
    
    // Set language
    setLanguage(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('wondertap_lang', lang);
        this.applyTranslations();
        this.translateNavigation();
        this.renderLanguageSelector('languageSelector');
        if (typeof UI !== 'undefined') {
            UI.showToast(`${this.languages[lang].flag} ${this.languages[lang].native}`, 'success');
        }
    },
    
    // Apply translations to data-i18n elements
    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
    },
    
    // Translate navigation and main UI elements
    translateNavigation() {
        // Navigation buttons (bottom nav)
        const navBtns = document.querySelectorAll('.nav-btn');
        const navKeys = ['nav_home', 'nav_shop', 'nav_games', 'nav_profile', 'nav_friends'];
        navBtns.forEach((btn, index) => {
            const label = btn.querySelector('.label');
            if (label && navKeys[index]) {
                label.textContent = this.t(navKeys[index]);
            }
        });
        
        // Quick action buttons (Daily, Wheel, Pass, Rank)
        const quickBtns = document.querySelectorAll('.quick-btn-mini');
        const quickKeys = ['daily_bonus', 'spin_wheel', 'battle_pass', 'leaderboard_title'];
        const quickFallbacks = ['Daily', 'Wheel', 'Pass', 'Rank'];
        quickBtns.forEach((btn, index) => {
            const label = btn.querySelector('.label');
            if (label && quickKeys[index]) {
                const translated = this.t(quickKeys[index]);
                // Use fallback if translation key not found
                label.textContent = translated !== quickKeys[index] ? translated : quickFallbacks[index];
            }
        });
        
        // WONTIME label
        const wontimeLabel = document.querySelector('.wontime-label');
        if (wontimeLabel) wontimeLabel.textContent = 'WONTIME';
        
        // Ready button
        const hourlyText = document.getElementById('hourlyText');
        if (hourlyText && hourlyText.textContent.includes('Ready')) {
            hourlyText.textContent = this.t('claim') + '!';
        }
        
        // Settings modal
        const settingsTitle = document.querySelector('#settingsModal .modal-title');
        if (settingsTitle) settingsTitle.innerHTML = '⚙️ ' + this.t('settings');
        
        // Streak modal
        const streakTitle = document.querySelector('#streakModal .modal-title');
        if (streakTitle) streakTitle.innerHTML = '🔥 ' + this.t('daily_streak');
        
        // Wheel page
        const wheelTitle = document.querySelector('.wheel-title');
        if (wheelTitle) wheelTitle.innerHTML = '🎡 ' + this.t('spin_wheel').toUpperCase();
        
        const wheelSubtitle = document.querySelector('.wheel-subtitle');
        if (wheelSubtitle) wheelSubtitle.textContent = this.t('wheel_subtitle') || 'Spin to win trippy prizes!';
        
        console.log('🌍 Language applied:', this.currentLang);
    },
    
    // Render language selector (all 10 languages)
    renderLanguageSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="lang-grid">
                ${Object.entries(this.languages).map(([code, lang]) => `
                    <div class="lang-option ${code === this.currentLang ? 'active' : ''}" 
                         onclick="I18n.setLanguage('${code}')">
                        <span class="lang-flag">${lang.flag}</span>
                        <span class="lang-name">${lang.native}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// Add styles
const i18nStyles = document.createElement('style');
i18nStyles.textContent = `
    .lang-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
    }
    .lang-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: var(--card);
        border: 2px solid transparent;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .lang-option:active { transform: scale(0.97); }
    .lang-option.active {
        border-color: var(--cyan);
        background: rgba(0,255,255,0.1);
    }
    .lang-flag { font-size: 1.3rem; }
    .lang-name { font-weight: 600; font-size: 0.85rem; }
`;
document.head.appendChild(i18nStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
