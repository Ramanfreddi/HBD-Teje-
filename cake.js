// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== STATE =====
    let candlesBlow = {
        0: false,
        1: false,
        2: false
    };

    let allCandlesBlown = false;
    const cursor = document.querySelector('.cursor');
    const bgMusic = document.getElementById('bgMusic');
    const celebrationMessage = document.getElementById('celebrationMessage');
    const blowSound = document.getElementById('blowSound');
    const candles = document.querySelectorAll('.candle');
    const particlesContainer = document.querySelector('.particles-container');

    // ===== AUTO-PLAY MUSIC =====
    if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => {
            console.log('Autoplay prevented - user interaction required');
        });
    }

    // ===== CUSTOM CURSOR =====
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            gsap.to(cursor, {
                duration: 0.1,
                left: e.clientX - 10,
                top: e.clientY - 10,
                overwrite: 'auto'
            });
        });

        document.addEventListener('mouseleave', function() {
            gsap.to(cursor, {
                duration: 0.2,
                opacity: 0
            });
        });

        document.addEventListener('mouseenter', function() {
            gsap.to(cursor, {
                duration: 0.2,
                opacity: 1
            });
        });
    }

    // ===== CANDLE INTERACTION =====
    candles.forEach(candle => {
        const candleIndex = parseInt(candle.getAttribute('data-candle'));

        // Click to blow
        candle.addEventListener('click', function() {
            blowCandle(candleIndex);
        });

        // Touch to blow
        candle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            blowCandle(candleIndex);
        });
    });

    // ===== BLOW CANDLE FUNCTION =====
    function blowCandle(index) {
        // Prevent double-blowing
        if (candlesBlow[index]) return;

        candlesBlow[index] = true;
        const candle = document.getElementById(`candle-${index}`);
        const flame = document.getElementById(`flame-${index}`);

        // Add blown class
        candle.classList.add('blown');

        // Flame disappear animation
        gsap.to(flame, {
            duration: 0.3,
            opacity: 0,
            scale: 0.5,
            y: -10
        });

        // Play blow sound
        try {
            blowSound.play().catch(() => {
                // Sound might fail, continue anyway
            });
        } catch (e) {
            console.log('Sound not available');
        }

        // Candle tilt animation
        gsap.to(candle, {
            duration: 0.4,
            rotation: -5 + Math.random() * 10,
            ease: 'back.out'
        });

        // Create blow effect particles
        createBlowEffect(index);

        // Shake effect on candle
        shakeCandle(candle);

        // Check if all candles are blown
        checkAllCandlesBlown();
    }

    // ===== BLOW EFFECT PARTICLES =====
    function createBlowEffect(candleIndex) {
        const candle = document.getElementById(`candle-${candleIndex}`);
        const rect = candle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create spark particles
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 2 + Math.random() * 4;
            const tx = Math.cos(angle) * velocity * 40;
            const ty = Math.sin(angle) * velocity * 40 - 20; // Upward bias

            // Spark particles
            const spark = document.createElement('div');
            spark.className = 'particle spark';
            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');
            particlesContainer.appendChild(spark);

            gsap.to(spark, {
                duration: 0.8,
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0,
                ease: 'power2.out',
                onComplete: function() {
                    spark.remove();
                }
            });
        }

        // Create confetti particles
        const confettiEmojis = ['🎉', '✨', '🎊', '💫', '🌟'];
        const confettiCount = 8;
        for (let i = 0; i < confettiCount; i++) {
            const angle = (i / confettiCount) * Math.PI * 2;
            const velocity = 1.5 + Math.random() * 3;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;
            const emoji = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

            const confetti = document.createElement('div');
            confetti.className = 'particle confetti';
            confetti.textContent = emoji;
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');
            particlesContainer.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 1500);
        }

        // Create wind/blow effect (invisible particles for motion)
        const windCount = 20;
        for (let i = 0; i < windCount; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
            const velocity = 3 + Math.random() * 5;
            const tx = Math.cos(angle) * velocity * 60;
            const ty = Math.sin(angle) * velocity * 60;

            const wind = document.createElement('div');
            wind.className = 'particle';
            wind.style.left = centerX + 'px';
            wind.style.top = centerY + 'px';
            wind.style.width = '4px';
            wind.style.height = '4px';
            wind.style.background = 'rgba(255, 200, 100, 0.8)';
            wind.style.borderRadius = '50%';
            wind.style.filter = 'blur(1px)';
            wind.style.setProperty('--tx', tx + 'px');
            wind.style.setProperty('--ty', ty + 'px');
            particlesContainer.appendChild(wind);

            gsap.to(wind, {
                duration: 1,
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0,
                ease: 'power2.out',
                onComplete: function() {
                    wind.remove();
                }
            });
        }
    }

    // ===== SHAKE EFFECT =====
    function shakeCandle(candle) {
        gsap.timeline()
            .to(candle, {
                duration: 0.05,
                x: -3
            })
            .to(candle, {
                duration: 0.05,
                x: 3
            })
            .to(candle, {
                duration: 0.05,
                x: -3
            })
            .to(candle, {
                duration: 0.05,
                x: 0
            });
    }

    // ===== CHECK ALL CANDLES BLOWN =====
    function checkAllCandlesBlown() {
        if (candlesBlow[0] && candlesBlow[1] && candlesBlow[2]) {
            allCandlesBlown = true;
            celebrateSuccess();
        }
    }

    // ===== CELEBRATION SUCCESS =====
    function celebrateSuccess() {
        // Remove hidden class to show celebration message
        celebrationMessage.classList.remove('hidden');

        // Create celebration confetti burst
        celebrationConfetti();

        // Cake bounce animation
        gsap.timeline()
            .to('.cake-wrapper', {
                duration: 0.3,
                y: -20,
                ease: 'back.out'
            })
            .to('.cake-wrapper', {
                duration: 0.3,
                y: 0,
                ease: 'bounce.out'
            });

        // Particle burst from cake center
        createCelebrationParticles();
    }

    // ===== CELEBRATION CONFETTI =====
    function celebrationConfetti() {
        const confettiEmojis = ['🎉', '🎊', '✨', '💖', '🎈', '🌟', '💫', '🎁'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle confetti';
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-30px';
            confetti.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            confetti.style.setProperty('--ty', Math.random() * 300 + 200 + 'px');
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }

    // ===== CELEBRATION PARTICLES =====
    function createCelebrationParticles() {
        const cakeWrapper = document.querySelector('.cake-wrapper');
        const rect = cakeWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            const particle = document.createElement('div');
            particle.className = 'particle spark';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.background = ['#FFD700', '#ff69b4', '#00CED1', '#FF6347'][Math.floor(Math.random() * 4)];
            particlesContainer.appendChild(particle);

            gsap.to(particle, {
                duration: 1.2,
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0,
                ease: 'power2.out',
                onComplete: function() {
                    particle.remove();
                }
            });
        }
    }

    // ===== ADD TOUCH FEEDBACK =====
    candles.forEach(candle => {
        candle.addEventListener('touchstart', function() {
            gsap.to(this, {
                duration: 0.1,
                scale: 0.95
            });
        });

        candle.addEventListener('touchend', function() {
            gsap.to(this, {
                duration: 0.1,
                scale: 1
            });
        });

        candle.addEventListener('mousedown', function() {
            gsap.to(this, {
                duration: 0.1,
                scale: 0.95
            });
        });

        candle.addEventListener('mouseup', function() {
            gsap.to(this, {
                duration: 0.1,
                scale: 1
            });
        });
    });

    // ===== INITIAL ANIMATIONS =====
    // Animate candles appearing
    candles.forEach((candle, index) => {
        gsap.from(candle, {
            duration: 0.6,
            opacity: 0,
            y: -30,
            delay: index * 0.1,
            ease: 'back.out'
        });
    });

    // Animate cake layers appearing
    gsap.from([
        '.cake-frosting-top',
        '.cake-layer-1',
        '.cake-layer-2',
        '.cake-layer-3',
        '.frosting-layer',
        '.cake-plate'
    ], {
        duration: 0.8,
        opacity: 0,
        scale: 0.8,
        ease: 'back.out'
    });

    // Gentle floating animation for the whole cake
    gsap.to('.cake-wrapper', {
        duration: 3,
        y: 10,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });
});
