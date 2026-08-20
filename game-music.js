// Shared background music for the playable game pages. Browsers may block
// audible autoplay, so the first tap, click, or key press starts it as well.
const gameMusic = new Audio('hbd.mp3');
gameMusic.loop = true;
gameMusic.volume = 0.35;

function startGameMusic() {
  gameMusic.play().catch(() => {});
}

window.addEventListener('pageshow', startGameMusic);
document.addEventListener('pointerdown', startGameMusic, { once: true, passive: true });
document.addEventListener('keydown', startGameMusic, { once: true });
