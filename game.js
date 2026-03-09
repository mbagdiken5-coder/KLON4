const STORAGE_KEY = 'klon4_best_score_v2';
const SOUND_KEY = 'klon4_sound_v2';
const THEME_KEY = 'klon4_theme_v2';
const THEMES = ['love', 'dark', 'light'];

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const playAgainBtn = document.getElementById('playAgainBtn');
const themeBtn = document.getElementById('themeBtn');
const soundBtn = document.getElementById('soundBtn');
const restartBtn = document.getElementById('restartBtn');

const cardEmojis = [
  '💖',
  '🌹',
  '🌺',
  '🌷',
  '🌸',
  '🪷',
  '🍓',
  '🕊️',
  '🎀',
  '💐',
  '✨',
  '🎶',
];

const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.wav');
const matchSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.wav');
const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-horn-2-618.mp3');

let soundOn = true;

let themeIndex = 0;
let cards = [];
let opened = [];
let matches = 0;
let moves = 0;
let timer = null;
let startTime = null;

const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
};

const getBestScore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

const getSoundPref = () => {
  return localStorage.getItem(SOUND_KEY) !== 'false';
};

const setSoundPref = (value) => {
  localStorage.setItem(SOUND_KEY, value ? 'true' : 'false');
  soundOn = value;
  updateSoundUI();
};

const playSound = (audio) => {
  if (!soundOn) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

const updateSoundUI = () => {
  if (!soundBtn) return;
  soundBtn.textContent = soundOn ? '🔊 Ses' : '🔇 Sessiz';
};

const setBestScore = (score) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
};

const updateBestUI = () => {
  const best = getBestScore();
  if (!best) {
    bestEl.textContent = '—';
    return;
  }
  bestEl.textContent = `${formatTime(best.time)} / ${best.moves} hamle`;
};

const startTimer = () => {
  if (timer) return;
  startTime = Date.now();
  timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timerEl.textContent = formatTime(elapsed);
  }, 500);
};

const launchConfetti = () => {
  const confetti = document.createElement('div');
  confetti.className = 'snow';
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('span');
    const size = 6 + Math.random() * 10;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${5 + Math.random() * 2}s`;
    dot.style.opacity = `${0.6 + Math.random() * 0.4}`;
    confetti.appendChild(dot);
  }
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 5200);
};

const stopTimer = () => {
  clearInterval(timer);
  timer = null;
};

const resetStats = () => {
  moves = 0;
  matches = 0;
  opened = [];
  movesEl.textContent = '0';
  timerEl.textContent = '00:00';
  stopTimer();
  updateBestUI();
};

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildDeck = () => {
  const deck = [...cardEmojis, ...cardEmojis];
  return shuffle(deck);
};

const createCard = (emoji) => {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.dataset.emoji = emoji;
  card.innerHTML = `
    <div class="card__face card__front"></div>
    <div class="card__face card__back"><span class="card__emoji">${emoji}</span></div>
  `;

  card.addEventListener('click', () => {
    if (card.classList.contains('matched') || card.classList.contains('flipped')) return;
    if (opened.length === 2) return;

    card.classList.add('flipped');
    opened.push(card);

    if (opened.length === 1) {
      startTimer();
      playSound(flipSound);
    }

    if (opened.length === 2) {
      moves += 1;
      movesEl.textContent = String(moves);

      const [a, b] = opened;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched');
        b.classList.add('matched');
        opened = [];
        matches += 1;
        playSound(matchSound);

        if (matches === cardEmojis.length) {
          stopTimer();
          playSound(winSound);
          launchConfetti();
          showWin();
        }
        return;
      }

      a.classList.add('shake');
      b.classList.add('shake');

      setTimeout(() => {
        a.classList.remove('flipped', 'shake');
        b.classList.remove('flipped', 'shake');
        opened = [];
      }, 900);
    }
  });

  return card;
};

const renderBoard = () => {
  board.innerHTML = '';
  const deck = buildDeck();
  deck.forEach((emoji) => {
    board.appendChild(createCard(emoji));
  });
};

const showOverlay = (title, text) => {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.add('visible');
};

const hideOverlay = () => {
  overlay.classList.remove('visible');
};

const setTheme = (index) => {
  themeIndex = index % THEMES.length;
  document.body.classList.remove('theme-love', 'theme-dark', 'theme-light');
  document.body.classList.add(`theme-${THEMES[themeIndex]}`);
  localStorage.setItem(THEME_KEY, THEMES[themeIndex]);
  themeBtn.textContent = `Tema (${THEMES[themeIndex].toUpperCase()})`;
};

const loadTheme = () => {
  const saved = localStorage.getItem('klon4_theme_v2');
  const idx = saved ? THEMES.indexOf(saved) : 0;
  setTheme(idx >= 0 ? idx : 0);
};

const showWin = () => {
  const time = (Date.now() - startTime) / 1000;
  const best = getBestScore();
  const score = { time, moves };

  let message = 'Tebrikler! Hepsini eşleştirdin.';
  if (!best || time < best.time || (time === best.time && moves < best.moves)) {
    setBestScore(score);
    updateBestUI();
    message = 'Yeni en iyi skor! Harika iş!';
  }

  showOverlay('Kazandın!', message);
};

const resetGame = () => {
  resetStats();
  renderBoard();
  hideOverlay();
};

const init = () => {
  soundOn = getSoundPref();
  updateSoundUI();
  loadTheme();
  resetGame();

  themeBtn.addEventListener('click', () => {
    setTheme(themeIndex + 1);
  });

  soundBtn.addEventListener('click', () => {
    setSoundPref(!soundOn);
  });

  restartBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) hideOverlay();
  });
};

init();
