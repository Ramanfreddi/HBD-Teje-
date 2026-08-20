// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===== LOADING SCREEN =====
    const loadingScreen = document.getElementById('loading-screen');

    // Hide loading screen when everything is ready
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 800);
    });

    // ===== CONFIGURATION - CUSTOMIZE THESE! =====
    // CUSTOMIZE: Set the birthday date (format: 'Month Day, Year HH:MM:SS')
    const birthdayDate = new Date('September 12, 2025 00:00:00').getTime();

    // CUSTOMIZE: Change this greeting message
    const greetingText = "Hey Teje! You're one of the most amazing people I've ever known! 💖";

    // CUSTOMIZE: Change floating elements if desired
    const floatingElements = ['💖', '✨', '🌸', '💫', '💕'];

    // ===== DOM ELEMENTS =====
    const countdownSection = document.getElementById('countdown-section');
    const passwordGate = document.getElementById('password-gate');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('birthday-password');
    const passwordError = document.getElementById('password-error');
    const birthdayContent = document.getElementById('birthday-content');
    const cursor = document.querySelector('.cursor');
    const bgMusic = null;
    const musicToggle = null;
    const musicIcon = null;

    // ===== STATE =====
    let birthdayAnimationsStarted = false;
    let passwordUnlocked = false;
    let passwordGateShown = false;
    let charIndex = 0;

    function revealBirthdayContent() {
        if (passwordGate) {
            passwordGate.hidden = true;
            passwordGate.style.display = 'none';
        }
        if (birthdayContent) birthdayContent.style.display = 'block';

        if (!birthdayAnimationsStarted) {
            birthdayAnimationsStarted = true;
            initBirthdayAnimations();
        }
    }

    function showPasswordGate() {
        if (countdownSection) countdownSection.style.display = 'none';
        if (passwordUnlocked) {
            revealBirthdayContent();
            return;
        }
        if (passwordGate) {
            passwordGate.hidden = false;
            passwordGate.style.display = 'grid';
        }
        if (!passwordGateShown && passwordInput) passwordInput.focus();
        passwordGateShown = true;
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (passwordError) passwordError.textContent = '';
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (passwordInput && passwordInput.value === '669199') {
                passwordUnlocked = true;
                revealBirthdayContent();
            } else if (passwordError) {
                passwordError.textContent = 'That password is not quite right. Try again!';
                if (passwordInput) passwordInput.select();
            }
        });
    }

    // A soft star layer keeps the page feeling alive without distracting from the message.
    const starField = document.querySelector('.star-field');
    if (starField) {
        for (let i = 0; i < 34; i++) {
            const star = document.createElement('i');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--duration', (1.8 + Math.random() * 3.4) + 's');
            star.style.animationDelay = (-Math.random() * 4) + 's';
            starField.appendChild(star);
        }
    }

    function createBurst(x, y, amount) {
        for (let i = 0; i < amount; i++) {
            const piece = document.createElement('span');
            piece.className = 'burst';
            piece.textContent = floatingElements[i % floatingElements.length];
            piece.style.left = x + 'px';
            piece.style.top = y + 'px';
            document.body.appendChild(piece);
            const angle = (Math.PI * 2 * i) / amount + Math.random() * .4;
            const distance = 55 + Math.random() * 100;
            gsap.to(piece, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance + 35,
                rotation: Math.random() * 280 - 140,
                opacity: 0,
                duration: .8 + Math.random() * .5,
                ease: 'power2.out',
                onComplete: () => piece.remove()
            });
        }
    }

    // ===== CURSOR =====
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // ===== MUSIC CONTROL =====
    function toggleMusic() {
        if (!bgMusic) return;

        if (bgMusic.paused) {
            bgMusic.play().then(function() {
                if (musicToggle) musicToggle.classList.add('playing');
                if (musicIcon) musicIcon.textContent = '🎵';
                localStorage.setItem('musicPlaying', 'true');
            }).catch(function(err) {
                console.log('Music play failed:', err);
            });
        } else {
            bgMusic.pause();
            if (musicToggle) musicToggle.classList.remove('playing');
            if (musicIcon) musicIcon.textContent = '🔇';
            localStorage.setItem('musicPlaying', 'false');
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }

    // Try to resume music if it was playing
    if (bgMusic && localStorage.getItem('musicPlaying') === 'true') {
        bgMusic.play().then(function() {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.textContent = '🎵';
        }).catch(function() {
            if (musicIcon) musicIcon.textContent = '🔇';
        });
    }

    // ===== TYPING EFFECT =====
    function typeGreeting() {
        const greetingElement = document.querySelector('#birthday-content .greeting');
        if (!greetingElement) return;

        if (charIndex < greetingText.length) {
            greetingElement.textContent += greetingText.charAt(charIndex);
            charIndex++;
            setTimeout(typeGreeting, 100);
        }
    }

    // ===== FLOATING ELEMENTS =====
    function createFloating() {
        const element = document.createElement('div');
        element.className = 'floating';
        element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = Math.random() * 100 + 'vh';
        element.style.fontSize = (Math.random() * 20 + 20) + 'px';
        document.body.appendChild(element);

        gsap.to(element, {
            y: -500,
            x: Math.random() * 100 - 50,
            rotation: Math.random() * 360,
            duration: Math.random() * 5 + 5,
            opacity: 1,
            ease: "none",
            onComplete: function() { element.remove(); }
        });
    }

    // Start floating elements
    setInterval(createFloating, 1000);

    // ===== BIRTHDAY ANIMATIONS =====
    function initBirthdayAnimations() {
        // Title animation
        gsap.to('#birthday-content h1', {
            opacity: 1,
            duration: 1,
            y: 20,
            ease: "bounce.out"
        });

        // Button animation
        gsap.to('#birthday-content .cta-button', {
            opacity: 1,
            duration: 1,
            y: -20,
            ease: "back.out"
        });

        // Start typing effect
        typeGreeting();

        // Button click handler
        const ctaButton = document.querySelector('#birthday-content .cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function() {
                const rect = ctaButton.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
                // Start music on first interaction if not playing
                if (bgMusic && bgMusic.paused) {
                    bgMusic.play().catch(function() {});
                    localStorage.setItem('musicPlaying', 'true');
                }

                gsap.to('body', {
                    opacity: 0,
                    duration: 1,
                    onComplete: function() {
                        window.location.href = 'cake-advanced.html';
                    }
                });
            });

            // Hover effects
            ctaButton.addEventListener('mouseenter', function() {
                gsap.to(ctaButton, { scale: 1.1, duration: 0.3 });
            });
            ctaButton.addEventListener('mouseleave', function() {
                gsap.to(ctaButton, { scale: 1, x: 0, y: 0, duration: 0.3 });
            });
            ctaButton.addEventListener('mousemove', function(event) {
                const rect = ctaButton.getBoundingClientRect();
                gsap.to(ctaButton, {
                    x: (event.clientX - rect.left - rect.width / 2) * .16,
                    y: (event.clientY - rect.top - rect.height / 2) * .18,
                    duration: .25,
                    ease: 'power2.out'
                });
            });
        }
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.cta-button, .music-toggle')) {
            createBurst(event.clientX, event.clientY, 6);
        }
    });

    // ===== COUNTDOWN =====
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = birthdayDate - now;

        if (distance <= 0) {
            // Birthday has arrived!
            showPasswordGate();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Run countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
