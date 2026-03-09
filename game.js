const STORAGE_KEY = 'klon4_best_score_v2';
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
const restartBtn = document.getElementById('restartBtn');

const cardEmojis = [
  '💖',
  '🌸',
  '🌹',
  '🌺',
  '🌷',
  '🪷',
  '🍓',
  '🕊️',
];

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

        if (matches === cardEmojis.length) {
          stopTimer();
          showWin();
        }
        return;
      }

      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
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
  localStorage.setItem('klon4_theme_v2', THEMES[themeIndex]);
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
  loadTheme();
  resetGame();

  themeBtn.addEventListener('click', () => {
    setTheme(themeIndex + 1);
  });

  restartBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) hideOverlay();
  });
};

init();
