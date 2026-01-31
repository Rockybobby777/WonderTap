// ==================== AUDIO MODULE ====================
// Sound effects and music using Web Audio API
// No external files needed - generates sounds procedurally!

const Audio = {
    // Audio context
    ctx: null,
    masterVolume: null,
    musicVolume: null,
    sfxVolume: null,
    
    // Settings
    settings: {
        musicEnabled: true,
        sfxEnabled: true,
        musicLevel: 0.3,
        sfxLevel: 0.5
    },
    
    // Music state
    music: {
        playing: false,
        currentTrack: null,
        oscillators: [],
        interval: null
    },
    
    // Initialize audio system
    init() {
        // Load settings
        this.loadSettings();
        
        // Create audio context on first user interaction
        document.addEventListener('click', () => this.ensureContext(), { once: true });
        document.addEventListener('touchstart', () => this.ensureContext(), { once: true });
    },
    
    // Ensure audio context exists
    ensureContext() {
        if (this.ctx) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Master volume
            this.masterVolume = this.ctx.createGain();
            this.masterVolume.connect(this.ctx.destination);
            
            // Music volume
            this.musicVolume = this.ctx.createGain();
            this.musicVolume.gain.value = this.settings.musicLevel;
            this.musicVolume.connect(this.masterVolume);
            
            // SFX volume
            this.sfxVolume = this.ctx.createGain();
            this.sfxVolume.gain.value = this.settings.sfxLevel;
            this.sfxVolume.connect(this.masterVolume);
            
            console.log('🔊 Audio system initialized');
            
            // Auto-start music if enabled
            if (this.settings.musicEnabled) {
                setTimeout(() => this.startMusic(), 500);
            }
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    },
    
    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('wondertap_audio');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.settings = { ...this.settings, ...data };
            } catch (e) {}
        }
    },
    
    // Save settings
    saveSettings() {
        localStorage.setItem('wondertap_audio', JSON.stringify(this.settings));
    },
    
    // Toggle music
    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        
        if (this.settings.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        
        this.saveSettings();
        return this.settings.musicEnabled;
    },
    
    // Toggle SFX
    toggleSFX() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        this.saveSettings();
        return this.settings.sfxEnabled;
    },
    
    // Set music volume
    setMusicVolume(level) {
        this.settings.musicLevel = level;
        if (this.musicVolume) {
            this.musicVolume.gain.value = level;
        }
        this.saveSettings();
    },
    
    // Set SFX volume
    setSFXVolume(level) {
        this.settings.sfxLevel = level;
        if (this.sfxVolume) {
            this.sfxVolume.gain.value = level;
        }
        this.saveSettings();
    },
    
    // ==================== SOUND EFFECTS ====================
    
    // Play tap sound
    playTap() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.sfxVolume);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },
    
    // Play coin collect sound
    playCoin() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987, this.ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318, this.ctx.currentTime + 0.05); // E6
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.sfxVolume);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    
    // Play gem collect sound
    playGem() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Sparkly arpeggio
        const notes = [1047, 1319, 1568, 2093]; // C6, E6, G6, C7
        
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = this.ctx.currentTime + i * 0.05;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            osc.connect(gain);
            gain.connect(this.sfxVolume);
            
            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    },
    
    // Play combo sound
    playCombo(comboCount) {
        // Désactivé - son trop agaçant
        return;
    },
    
    // Play fever mode activation - SWEET & PSYCHEDELIC
    playFever() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Dreamy psychedelic sound - soft and trippy
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const osc3 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        // Soft sine waves for dreamy effect
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';
        
        // Gentle ascending frequencies
        osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.8);
        
        osc2.frequency.setValueAtTime(330, this.ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.8);
        
        osc3.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc3.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.8);
        
        // Low-pass filter for smooth sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.5);
        
        // Gentle volume envelope
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.0);
        
        // Connect through filter for smoothness
        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxVolume);
        
        osc1.start();
        osc2.start();
        osc3.start();
        osc1.stop(this.ctx.currentTime + 1.0);
        osc2.stop(this.ctx.currentTime + 1.0);
        osc3.stop(this.ctx.currentTime + 1.0);
    },
    
    // Play level up sound
    playLevelUp() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Triumphant fanfare
        const melody = [
            { freq: 523, time: 0, dur: 0.15 },     // C5
            { freq: 659, time: 0.15, dur: 0.15 },  // E5
            { freq: 784, time: 0.3, dur: 0.15 },   // G5
            { freq: 1047, time: 0.45, dur: 0.4 }   // C6
        ];
        
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = note.freq;
            
            const startTime = this.ctx.currentTime + note.time;
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);
            
            osc.connect(gain);
            gain.connect(this.sfxVolume);
            
            osc.start(startTime);
            osc.stop(startTime + note.dur);
        });
    },
    
    // Play win/reward sound
    playWin() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Happy jingle
        const notes = [523, 659, 784, 659, 784, 1047];
        
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = this.ctx.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
            
            osc.connect(gain);
            gain.connect(this.sfxVolume);
            
            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    },
    
    // Play wheel spin sound
    playWheelSpin() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Clicking sound that slows down
        let clickCount = 0;
        const maxClicks = 30;
        
        const click = () => {
            if (clickCount >= maxClicks) return;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.value = 200 + Math.random() * 100;
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
            
            osc.connect(gain);
            gain.connect(this.sfxVolume);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.03);
            
            clickCount++;
            const delay = 50 + clickCount * 10;
            setTimeout(click, delay);
        };
        
        click();
    },
    
    // Play error sound
    playError() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.setValueAtTime(150, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.sfxVolume);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    },
    
    // Play button click
    playClick() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 600;
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(this.sfxVolume);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    
    // Play obstacle hit
    playHit() {
        if (!this.settings.sfxEnabled || !this.ctx) return;
        
        // Noise burst
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        
        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        noise.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxVolume);
        
        noise.start();
    },
    
    // ==================== MUSIC ====================
    
    // Start background music
    startMusic() {
        if (!this.ctx || this.music.playing) return;
        
        this.music.playing = true;
        
        // Trippy ambient music generator
        this.playAmbientMusic();
    },
    
    // Stop music
    stopMusic() {
        this.music.playing = false;
        
        // Stop all oscillators
        this.music.oscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.music.oscillators = [];
        
        if (this.music.interval) {
            clearInterval(this.music.interval);
            this.music.interval = null;
        }
    },
    
    // Generate ambient trippy music
    playAmbientMusic() {
        if (!this.ctx || !this.music.playing) return;
        
        // Base drone
        this.createDrone();
        
        // Melodic arpeggios
        this.music.interval = setInterval(() => {
            if (!this.music.playing) return;
            this.playArpeggio();
        }, 4000);
        
        // Initial arpeggio
        setTimeout(() => this.playArpeggio(), 1000);
    },
    
    // Create ambient drone
    createDrone() {
        if (!this.ctx) return;
        
        const frequencies = [65.41, 98.00, 130.81]; // C2, G2, C3
        
        frequencies.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Subtle vibrato
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.5;
            lfoGain.gain.value = 2;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            filter.type = 'lowpass';
            filter.frequency.value = 500;
            
            gain.gain.value = 0.08;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicVolume);
            
            osc.start();
            this.music.oscillators.push(osc, lfo);
        });
    },
    
    // Play melodic arpeggio
    playArpeggio() {
        if (!this.ctx || !this.music.playing) return;
        
        // Pentatonic scale for dreamy feel
        const scales = [
            [261.63, 293.66, 329.63, 392.00, 440.00], // C major pentatonic
            [293.66, 329.63, 392.00, 440.00, 523.25], // D
            [246.94, 293.66, 329.63, 392.00, 440.00]  // B minor
        ];
        
        const scale = scales[Math.floor(Math.random() * scales.length)];
        const pattern = this.generatePattern(scale);
        
        pattern.forEach((note, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = note.freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            
            const startTime = this.ctx.currentTime + note.time;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicVolume);
            
            osc.start(startTime);
            osc.stop(startTime + note.dur);
        });
    },
    
    // Generate random arpeggio pattern
    generatePattern(scale) {
        const pattern = [];
        const noteCount = 8 + Math.floor(Math.random() * 8);
        
        for (let i = 0; i < noteCount; i++) {
            pattern.push({
                freq: scale[Math.floor(Math.random() * scale.length)] * (Math.random() > 0.7 ? 2 : 1),
                time: i * 0.25 + Math.random() * 0.1,
                dur: 0.3 + Math.random() * 0.5
            });
        }
        
        return pattern;
    }
};

// Add audio control styles
const audioStyles = document.createElement('style');
audioStyles.textContent = `
    .audio-controls {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 15px;
        background: rgba(0,0,0,0.3);
        border-radius: 15px;
        margin-top: 15px;
    }
    
    .audio-control-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .audio-control-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }
    
    .audio-toggle {
        width: 50px;
        height: 28px;
        background: #333;
        border-radius: 14px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .audio-toggle.active {
        background: var(--green);
    }
    
    .audio-toggle::after {
        content: '';
        position: absolute;
        width: 22px;
        height: 22px;
        background: white;
        border-radius: 50%;
        top: 3px;
        left: 3px;
        transition: all 0.3s;
    }
    
    .audio-toggle.active::after {
        left: 25px;
    }
    
    .audio-slider {
        width: 100px;
        height: 6px;
        -webkit-appearance: none;
        background: #333;
        border-radius: 3px;
        outline: none;
    }
    
    .audio-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        background: var(--cyan);
        border-radius: 50%;
        cursor: pointer;
    }
`;
document.head.appendChild(audioStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Audio;
}
