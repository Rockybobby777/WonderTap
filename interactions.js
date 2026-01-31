// ==================== WONDERTAP - ADDICTIVE INTERACTIONS MODULE ====================
// Advanced interactions: eye tracking, possession mode, combo celebrations, screen shake, cursor trail

const Interactions = {
    possessionMode: false,
    
    init() {
        this.setupEyeTracking();
        this.setupCursorTrail();
        console.log('✨ Addictive Interactions initialized!');
    },
    
    setupEyeTracking() {
        const tapZone = document.getElementById('tapZone');
        if (!tapZone) return;
        
        tapZone.addEventListener('mousemove', (e) => {
            this.updateEyePositions(e.clientX, e.clientY);
        });
        
        tapZone.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.updateEyePositions(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
    },
    
    updateEyePositions(x, y) {
        this.updateCheshirePupils(x, y);
        this.updateCaterpillarPupils(x, y);
    },
    
    updateCheshirePupils(x, y) {
        const pupil1 = document.getElementById('cheshirePupil1');
        const pupil2 = document.getElementById('cheshirePupil2');
        const eye1 = document.getElementById('cheshireEye1');
        const eye2 = document.getElementById('cheshireEye2');
        
        if (!pupil1 || !pupil2 || !eye1 || !eye2) return;
        
        this.movePupil(pupil1, eye1, x, y, 8);
        this.movePupil(pupil2, eye2, x, y, 8);
    },
    
    updateCaterpillarPupils(x, y) {
        const pupil1 = document.getElementById('caterpillarPupil1');
        const pupil2 = document.getElementById('caterpillarPupil2');
        const caterpillar = document.getElementById('caterpillar');
        
        if (!pupil1 || !pupil2 || !caterpillar) return;
        
        const rect = caterpillar.getBoundingClientRect();
        const base1 = { x: 130, y: 70 };
        const base2 = { x: 154, y: 70 };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(y - centerY, x - centerX);
        const distance = 2;
        
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        pupil1.setAttribute('cx', base1.x + offsetX);
        pupil1.setAttribute('cy', base1.y + offsetY);
        pupil2.setAttribute('cx', base2.x + offsetX);
        pupil2.setAttribute('cy', base2.y + offsetY);
    },
    
    movePupil(pupil, eye, cursorX, cursorY, maxMove) {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(cursorY - eyeCenterY, cursorX - eyeCenterX);
        const distance = Math.min(maxMove, Math.hypot(cursorX - eyeCenterX, cursorY - eyeCenterY) / 20);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px)';
    },
    
    celebrateCombo(combo) {
        if (combo === 10) {
            this.miniCelebration();
        } else if (combo === 25) {
            this.mediumCelebration();
        } else if (combo === 50) {
            this.megaCelebration();
            this.activatePossessionMode();
        } else if (combo === 100) {
            this.ultimateCelebration();
        }
    },
    
    miniCelebration() {
        if (typeof Effects !== 'undefined') Effects.createConfetti(15);
        this.flashScreen('#ffd700', 0.2, 200);
    },
    
    mediumCelebration() {
        if (typeof Effects !== 'undefined') Effects.createConfetti(30);
        this.shakeScreen(5, 300);
        this.flashScreen('#ff00ff', 0.3, 300);
    },
    
    megaCelebration() {
        if (typeof Effects !== 'undefined') Effects.createConfetti(60);
        this.shakeScreen(10, 500);
        this.flashScreen('#ff0000', 0.5, 400);
        if (typeof UI !== 'undefined') UI.showToast('😈 POSSESSION MODE! 😈', 'error');
    },
    
    ultimateCelebration() {
        if (typeof Effects !== 'undefined') Effects.createConfetti(100);
        this.shakeScreen(15, 800);
        this.glitchEffect();
        this.flashScreen('#ff0000', 0.6, 200);
        setTimeout(() => this.flashScreen('#00ffff', 0.6, 200), 250);
        setTimeout(() => this.flashScreen('#ffd700', 0.6, 200), 500);
        if (typeof UI !== 'undefined') UI.showToast('🔥 GODLIKE COMBO! 🔥', 'success');
    },
    
    activatePossessionMode() {
        if (this.possessionMode) return;
        this.possessionMode = true;
        
        this.darkenScreen(0.4, 1000);
        this.possessEyes();
        
        const caterpillar = document.getElementById('caterpillar');
        if (caterpillar) caterpillar.classList.add('possessed');
        
        const cheshire = document.getElementById('cheshireSection');
        if (cheshire) cheshire.classList.add('possessed');
    },
    
    deactivatePossessionMode() {
        if (!this.possessionMode) return;
        this.possessionMode = false;
        
        this.darkenScreen(0, 500);
        this.unpossessEyes();
        
        const caterpillar = document.getElementById('caterpillar');
        if (caterpillar) caterpillar.classList.remove('possessed');
        
        const cheshire = document.getElementById('cheshireSection');
        if (cheshire) cheshire.classList.remove('possessed');
    },
    
    possessEyes() {
        const pupil1 = document.getElementById('caterpillarPupil1');
        const pupil2 = document.getElementById('caterpillarPupil2');
        
        if (pupil1 && pupil2) {
            pupil1.setAttribute('fill', '#ff0000');
            pupil2.setAttribute('fill', '#ff0000');
            pupil1.style.filter = 'drop-shadow(0 0 8px #ff0000)';
            pupil2.style.filter = 'drop-shadow(0 0 8px #ff0000)';
        }
        
        const cheshirePupil1 = document.getElementById('cheshirePupil1');
        const cheshirePupil2 = document.getElementById('cheshirePupil2');
        
        if (cheshirePupil1 && cheshirePupil2) {
            cheshirePupil1.style.background = '#ff0000';
            cheshirePupil2.style.background = '#ff0000';
            cheshirePupil1.style.boxShadow = '0 0 15px #ff0000';
            cheshirePupil2.style.boxShadow = '0 0 15px #ff0000';
        }
    },
    
    unpossessEyes() {
        const pupil1 = document.getElementById('caterpillarPupil1');
        const pupil2 = document.getElementById('caterpillarPupil2');
        
        if (pupil1 && pupil2) {
            pupil1.setAttribute('fill', '#1a1a2e');
            pupil2.setAttribute('fill', '#1a1a2e');
            pupil1.style.filter = '';
            pupil2.style.filter = '';
        }
        
        const cheshirePupil1 = document.getElementById('cheshirePupil1');
        const cheshirePupil2 = document.getElementById('cheshirePupil2');
        
        if (cheshirePupil1 && cheshirePupil2) {
            cheshirePupil1.style.background = '';
            cheshirePupil2.style.background = '';
            cheshirePupil1.style.boxShadow = '';
            cheshirePupil2.style.boxShadow = '';
        }
    },
    
    shakeScreen(intensity, duration) {
        const app = document.querySelector('.app');
        if (!app) return;
        
        app.style.animation = 'screenShake ' + duration + 'ms ease-in-out';
        app.style.setProperty('--shake-intensity', intensity + 'px');
        
        setTimeout(() => { app.style.animation = ''; }, duration);
    },
    
    flashScreen(color, opacity, duration) {
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;background:' + color + ';opacity:' + opacity + ';z-index:9998;pointer-events:none;animation:flashFade ' + duration + 'ms ease-out forwards;';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), duration);
    },
    
    darkenScreen(opacity, duration) {
        let darkness = document.getElementById('possessionDarkness');
        
        if (!darkness) {
            darkness = document.createElement('div');
            darkness.id = 'possessionDarkness';
            darkness.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at center,transparent 0%,rgba(0,0,0,0.8) 100%);z-index:5;pointer-events:none;opacity:0;transition:opacity ' + duration + 'ms ease;';
            document.body.appendChild(darkness);
        }
        
        setTimeout(() => { darkness.style.opacity = opacity; }, 10);
        
        if (opacity === 0) {
            setTimeout(() => {
                if (darkness.parentNode) darkness.parentNode.removeChild(darkness);
            }, duration);
        }
    },
    
    glitchEffect() {
        const app = document.querySelector('.app');
        if (!app) return;
        app.classList.add('glitch-effect');
        setTimeout(() => app.classList.remove('glitch-effect'), 400);
    },
    
    setupCursorTrail() {
        const tapZone = document.getElementById('tapZone');
        if (!tapZone) return;
        
        tapZone.addEventListener('click', (e) => {
            this.createTrailParticle(e.clientX, e.clientY);
        });
        
        tapZone.addEventListener('touchstart', (e) => {
            for (let touch of e.touches) {
                this.createTrailParticle(touch.clientX, touch.clientY);
            }
        });
    },
    
    createTrailParticle(x, y) {
        let color = this.possessionMode ? '#ff0000' : '#ff00ff';
        if (typeof Game !== 'undefined' && Game.state && Game.state.feverMode) color = '#00ffff';
        
        const particle = document.createElement('div');
        particle.className = 'cursor-trail';
        particle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:8px;height:8px;background:' + color + ';border-radius:50%;pointer-events:none;z-index:998;box-shadow:0 0 20px ' + color + ';animation:trailFade 0.8s ease-out forwards;';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    },
    
    updateCaterpillarExpression(combo) {
        const caterpillar = document.getElementById('caterpillar');
        if (!caterpillar) return;
        
        caterpillar.classList.remove('excited', 'trippy', 'possessed');
        
        if (combo >= 50) {
            caterpillar.classList.add('possessed');
        } else if (combo >= 25) {
            caterpillar.classList.add('trippy');
        } else if (combo >= 10) {
            caterpillar.classList.add('excited');
        }
    },
    
    onComboChange(combo) {
        this.updateCaterpillarExpression(combo);
        
        if ([10, 25, 50, 100].includes(combo)) {
            this.celebrateCombo(combo);
        }
        
        if (combo < 50 && this.possessionMode) {
            this.deactivatePossessionMode();
        }
    }
};

const interactionStyles = document.createElement('style');
interactionStyles.textContent = '@keyframes screenShake{0%,100%{transform:translate(0,0)}10%{transform:translate(calc(var(--shake-intensity,5px)*-1),calc(var(--shake-intensity,5px)*0.5))}20%{transform:translate(var(--shake-intensity,5px),calc(var(--shake-intensity,5px)*-0.5))}30%{transform:translate(calc(var(--shake-intensity,5px)*-0.8),calc(var(--shake-intensity,5px)*0.8))}40%{transform:translate(calc(var(--shake-intensity,5px)*0.8),calc(var(--shake-intensity,5px)*-0.8))}50%{transform:translate(calc(var(--shake-intensity,5px)*-0.6),calc(var(--shake-intensity,5px)*0.6))}60%{transform:translate(calc(var(--shake-intensity,5px)*0.6),calc(var(--shake-intensity,5px)*-0.6))}70%{transform:translate(calc(var(--shake-intensity,5px)*-0.4),calc(var(--shake-intensity,5px)*0.4))}80%{transform:translate(calc(var(--shake-intensity,5px)*0.4),calc(var(--shake-intensity,5px)*-0.4))}90%{transform:translate(calc(var(--shake-intensity,5px)*-0.2),calc(var(--shake-intensity,5px)*0.2))}}@keyframes flashFade{0%{opacity:var(--flash-opacity,.5)}100%{opacity:0}}@keyframes trailFade{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0.2)}}.glitch-effect{animation:glitchShake 0.1s infinite;filter:contrast(1.5) saturate(1.5)}@keyframes glitchShake{0%{transform:translate(0,0) skew(0deg);filter:contrast(1.5)}25%{transform:translate(-3px,2px) skew(2deg);filter:contrast(1.8) hue-rotate(90deg)}50%{transform:translate(3px,-2px) skew(-2deg);filter:contrast(1.5)}75%{transform:translate(-2px,-3px) skew(1deg);filter:contrast(2) hue-rotate(-90deg)}100%{transform:translate(0,0) skew(0deg);filter:contrast(1.5)}}.caterpillar.excited{animation:caterpillarBounce 0.5s ease-in-out infinite}@keyframes caterpillarBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.02)}}.caterpillar.trippy{animation:caterpillarTrippy 1s ease-in-out infinite;filter:drop-shadow(0 0 40px rgba(255,0,255,0.9)) drop-shadow(0 0 60px rgba(0,255,255,0.7))}@keyframes caterpillarTrippy{0%,100%{transform:rotate(0deg) scale(1);filter:hue-rotate(0deg)}25%{transform:rotate(-3deg) scale(1.03);filter:hue-rotate(90deg)}50%{transform:rotate(0deg) scale(1.05);filter:hue-rotate(180deg)}75%{transform:rotate(3deg) scale(1.03);filter:hue-rotate(270deg)}}.caterpillar.possessed{animation:caterpillarPossessed 0.3s ease-in-out infinite;filter:drop-shadow(0 0 60px rgba(255,0,0,1)) drop-shadow(0 0 100px rgba(139,0,0,0.8)) brightness(1.3) contrast(1.5)}@keyframes caterpillarPossessed{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.05) rotate(-2deg)}50%{transform:scale(1.1) rotate(0deg)}75%{transform:scale(1.05) rotate(2deg)}}.cheshire-section.possessed .cheshire-eye{animation:eyeGlowRed 0.5s ease-in-out infinite}@keyframes eyeGlowRed{0%,100%{box-shadow:0 0 20px #ff0000,0 0 40px #ff0000;filter:brightness(1.5)}50%{box-shadow:0 0 40px #ff0000,0 0 80px #8b0000;filter:brightness(2)}}.cheshire-section.possessed .cheshire-smile{color:#ff0000;filter:drop-shadow(0 0 20px #ff0000);animation:evilSmile 0.5s ease-in-out infinite}@keyframes evilSmile{0%,100%{transform:translateX(-50%) scale(1) rotate(0deg)}50%{transform:translateX(-50%) scale(1.2) rotate(5deg)}}';
document.head.appendChild(interactionStyles);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Interactions;
}
