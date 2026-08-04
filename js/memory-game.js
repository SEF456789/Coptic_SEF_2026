/* =========================================================
   memory-game.js
   لعبة الذاكرة (Memory Match) — تاب 2
   كل زوج (سؤال/إجابة) بيتولد منه كارتين. الكروت بره كلها
   نفس صورة مار أفرام، وجوه إما سؤال أو إجابة.
   ========================================================= */

let mgState = {
  cards: [],       // كل الكروت بعد الخلط
  flipped: [],     // الكروت المقلوبة حاليًا (لسه معلقة في انتظار المطابقة)
  matchedCount: 0,
  moves: 0,
  locked: false,   // true وقت مقارنة كارتين عشان يمنع الضغط الزيادة
};

document.addEventListener("DOMContentLoaded", () => {
  const restartBtn = document.getElementById("restartGame");
  if (restartBtn) restartBtn.addEventListener("click", startMemoryGame);
  startMemoryGame();
});

function buildDeck() {
  if (typeof MEMORY_PAIRS === "undefined") return [];

  const deck = [];
  MEMORY_PAIRS.forEach((pair, i) => {
    deck.push({ id: `${i}-q`, pairId: i, kind: "question", text: pair.question });
    deck.push({ id: `${i}-a`, pairId: i, kind: "answer", text: pair.answer });
  });
  return shuffle(deck);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startMemoryGame() {
  mgState = {
    cards: buildDeck(),
    flipped: [],
    matchedCount: 0,
    moves: 0,
    locked: false,
  };

  const winBanner = document.getElementById("winBanner");
  if (winBanner) winBanner.hidden = true;

  renderMemoryGrid();
  updateMemoryStats();
}

function renderMemoryGrid() {
  const grid = document.getElementById("memoryGrid");
  if (!grid) return;
  grid.innerHTML = "";

  mgState.cards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "memory-card";
    el.dataset.id = card.id;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");

    const backImgHTML = CARD_BACK_IMAGE
      ? `<img src="${CARD_BACK_IMAGE}" alt="مار أفرام السرياني">`
      : `<span style="color:#EDE3CC;font-family:var(--font-utility);font-size:12px;">مار أفرام</span>`;

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">${backImgHTML}</div>
        <div class="card-face card-front is-${card.kind}">${card.text}</div>
      </div>
    `;

    el.addEventListener("click", () => handleCardClick(card.id, el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick(card.id, el);
      }
    });

    grid.appendChild(el);
  });
}

function handleCardClick(cardId, el) {
  if (mgState.locked) return;
  if (el.classList.contains("flipped") || el.classList.contains("matched")) return;
  if (mgState.flipped.length === 2) return;

  el.classList.add("flipped");
  mgState.flipped.push({ id: cardId, el });

  if (mgState.flipped.length === 2) {
    mgState.moves += 1;
    updateMemoryStats();
    checkForMatch();
  }
}

function checkForMatch() {
  const [first, second] = mgState.flipped;
  const cardA = mgState.cards.find((c) => c.id === first.id);
  const cardB = mgState.cards.find((c) => c.id === second.id);

  const isMatch = cardA.pairId === cardB.pairId && cardA.kind !== cardB.kind;

  mgState.locked = true;

  setTimeout(() => {
    if (isMatch) {
      first.el.classList.add("matched");
      second.el.classList.add("matched");
      mgState.matchedCount += 1;
      updateMemoryStats();
      checkForWin();
    } else {
      first.el.classList.remove("flipped");
      second.el.classList.remove("flipped");
    }
    mgState.flipped = [];
    mgState.locked = false;
  }, 900);
}

function updateMemoryStats() {
  const moveEl = document.getElementById("moveCount");
  const matchEl = document.getElementById("matchCount");
  const totalPairs = typeof MEMORY_PAIRS !== "undefined" ? MEMORY_PAIRS.length : 0;

  if (moveEl) moveEl.textContent = mgState.moves;
  if (matchEl) matchEl.textContent = `${mgState.matchedCount} / ${totalPairs}`;
}

function checkForWin() {
  const totalPairs = typeof MEMORY_PAIRS !== "undefined" ? MEMORY_PAIRS.length : 0;
  if (mgState.matchedCount === totalPairs && totalPairs > 0) {
    const winBanner = document.getElementById("winBanner");
    const winMoves = document.getElementById("winMoves");
    if (winMoves) winMoves.textContent = mgState.moves;
    if (winBanner) winBanner.hidden = false;
  }
}
