// Music control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle.querySelector('.music-icon');

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
        localStorage.setItem('musicPlaying', 'true');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicIcon.textContent = '🔇';
        localStorage.setItem('musicPlaying', 'false');
    }
}

musicToggle.addEventListener('click', toggleMusic);

if (localStorage.getItem('musicPlaying') === 'true') {
    bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
    }).catch(() => {
        musicIcon.textContent = '🔇';
    });
}

const reasons = [
    {
        text: "Because you always know how to make me smile! 💖",
        emoji: "✨",
        gif: "gif1.gif"
    },
    {
        text: "Because you're the best listener I know! 🌸",
        emoji: "💫",
        gif: "gif2.gif"
    },
    {
        text: "Because your laugh is contagious! ✨",
        emoji: "🌟",
        gif: "gif3.gif"
    },
    {
        text: "Because you make every moment special! 🎂",
        emoji: "💖",
        gif: "gif4.gif"
    },
    {
        text: "Because you're simply amazing! Here's to another wonderful year! 🎉",
        emoji: "🎊",
        gif: "gif5.gif"
    }
];

let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';

    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = `${reason.emoji} ${reason.text}`;

    const gifOverlay = document.createElement('div');
    gifOverlay.className = 'gif-overlay';
    gifOverlay.innerHTML = `<img src="${reason.gif}" alt="Celebration">`;

    card.appendChild(text);
    card.appendChild(gifOverlay);

    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "back.out"
    });

    return card;
}

function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        const card = createReasonCard(reasons[currentReasonIndex]);
        reasonsContainer.appendChild(card);

        reasonCounter.textContent = `Reason ${currentReasonIndex + 1} of ${reasons.length}`;
        currentReasonIndex++;

        if (currentReasonIndex === reasons.length) {
            gsap.to(shuffleButton, {
                scale: 1.1,
                duration: 0.5,
                ease: "elastic.out",
                onComplete: () => {
                    shuffleButton.textContent = "Continue to Timeline 💫";
                    shuffleButton.classList.add('story-mode');
                    shuffleButton.addEventListener('click', () => {
                        gsap.to('body', {
                            opacity: 0,
                            duration: 1,
                            onComplete: () => {
                                window.location.href = 'timeline.html';
                            }
                        });
                    });
                }
            });
        }

        createFloatingElement();

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    } else {
        window.location.href = "timeline.html";
    }
}

shuffleButton.addEventListener('click', () => {
    gsap.to(shuffleButton, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    displayNewReason();
});

function createFloatingElement() {
    const elements = ['🌸', '✨', '💖', '🦋', '⭐'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = Math.random() * window.innerHeight + 'px';
    element.style.fontSize = (Math.random() * 20 + 10) + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -500,
        duration: Math.random() * 10 + 10,
        opacity: 0,
        onComplete: () => element.remove()
    });
}

const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 15,
        y: e.clientY - 15,
        duration: 0.2
    });
});

setInterval(createFloatingElement, 2000);