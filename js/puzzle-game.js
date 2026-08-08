/* =========================================================
   puzzle-game.js
   لعبة كلمات أبانا الذي — مؤقت تنازلي 90 ثانية مع زر بدء ودعم اللمس للموبايل
   - زر بدء اللعبة التفاعلي (Interactive Start Button)
   - مؤقت تنازلي 90 ثانية يبدأ عند ضغط "ابدأ اللعب"
   - دعم كامل وسلس للسحب والإفلات على الموبايل واللمس (Touch & Drag)
   - محاذاة اللوحة من اليسار لليمن LTR
   - حفظ تعديلات المستخدم: الشفافية 0.5 وحجم الخط 0.22
   ========================================================= */

let puzzleState = {
  pieces: [],
  edges: { h: [], v: [] },
  selectedPieceIndex: null,
  moves: 0,
  isWon: false,
  isStarted: false,
  loadedImg: null,
  timeLeft: 9000,
  timerInterval: null
};

// حالة سحب القطع باللمس للشاشات الذكية والموبايل
let touchDragState = {
  activeTileIndex: null,
  ghostEl: null,
  startX: 0,
  startY: 0,
  isDragging: false,
  currentTargetIndex: null
};

document.addEventListener("DOMContentLoaded", () => {
  initPuzzleControls();
  preloadPuzzleImage();
});

function preloadPuzzleImage() {
  if (typeof PUZZLE_CONFIG === "undefined" || !PUZZLE_CONFIG.imagePath) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = PUZZLE_CONFIG.imagePath;
  img.onload = () => {
    puzzleState.loadedImg = img;
    prepareInitialPuzzleBoard();
  };
  img.onerror = () => {
    prepareInitialPuzzleBoard();
  };
}

function initPuzzleControls() {
  const startBtn = document.getElementById("startPuzzleBtn");
  const restartBtn = document.getElementById("restartPuzzle");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      hideStartOverlay();
      startPuzzleGame();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      hideStartOverlay();
      startPuzzleGame();
    });
  }

  window.addEventListener("resize", debounce(() => {
    if (puzzleState.pieces.length > 0) {
      renderPuzzleBoard();
    }
  }, 200));
}

function hideStartOverlay() {
  const overlay = document.getElementById("puzzleStartOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function showStartOverlay() {
  const overlay = document.getElementById("puzzleStartOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function generateEdgeMaps(count) {
  const h = [];
  for (let i = 0; i < count; i++) {
    h[i] = Math.random() < 0.5 ? 1 : -1;
  }
  const v = [];
  for (let i = 0; i < count; i++) {
    v[i] = Math.random() < 0.5 ? 1 : -1;
  }
  return { h, v };
}

function getPieceEdges(index, count, edgeMaps) {
  const top = index < 4 ? 0 : edgeMaps.h[index % count];
  const right = index % 4 === 3 ? 0 : edgeMaps.v[index % count];
  const bottom = index >= count - 4 ? 0 : -edgeMaps.h[(index + 4) % count];
  const left = index % 4 === 0 ? 0 : -edgeMaps.v[(index - 1 + count) % count];

  return { top, right, bottom, left };
}

function prepareInitialPuzzleBoard() {
  if (typeof PUZZLE_CONFIG === "undefined" || !PUZZLE_CONFIG.wordUnits) return;

  const totalTiles = PUZZLE_CONFIG.wordUnits.length;
  puzzleState.edges = generateEdgeMaps(totalTiles);

  const pieces = [];
  for (let i = 0; i < totalTiles; i++) {
    const edges = getPieceEdges(i, totalTiles, puzzleState.edges);
    pieces.push({
      correctIndex: i,
      currentIndex: i,
      wordData: PUZZLE_CONFIG.wordUnits[i],
      edges
    });
  }

  puzzleState.pieces = shufflePieces(pieces);
  puzzleState.pieces.forEach((p, idx) => {
    p.currentIndex = idx;
  });

  puzzleState.selectedPieceIndex = null;
  puzzleState.moves = 0;
  puzzleState.isWon = false;
  puzzleState.isStarted = false;
  puzzleState.timeLeft = 9000;

  updateTimerUI();
  renderPuzzleBoard();
  updatePuzzleStats();
  showStartOverlay();
}

function startPuzzleGame() {
  if (typeof PUZZLE_CONFIG === "undefined" || !PUZZLE_CONFIG.wordUnits) return;

  puzzleState.isStarted = true;
  const totalTiles = PUZZLE_CONFIG.wordUnits.length; // 36 قطعة كلمة
  puzzleState.edges = generateEdgeMaps(totalTiles);

  const pieces = [];
  for (let i = 0; i < totalTiles; i++) {
    const edges = getPieceEdges(i, totalTiles, puzzleState.edges);
    pieces.push({
      correctIndex: i,
      currentIndex: i,
      wordData: PUZZLE_CONFIG.wordUnits[i],
      edges
    });
  }

  // خلط قطع الكلمات
  puzzleState.pieces = shufflePieces(pieces);
  puzzleState.pieces.forEach((p, idx) => {
    p.currentIndex = idx;
  });

  puzzleState.selectedPieceIndex = null;
  puzzleState.moves = 0;
  puzzleState.isWon = false;

  const winBanner = document.getElementById("puzzleWinBanner");
  const timeUpBanner = document.getElementById("puzzleTimeUpBanner");
  if (winBanner) winBanner.hidden = true;
  if (timeUpBanner) timeUpBanner.hidden = true;

  renderPuzzleBoard();
  updatePuzzleStats();
  startPuzzleTimer();
}

function startPuzzleTimer() {
  stopPuzzleTimer();

  puzzleState.timeLeft = 9000; // 90 ثانية
  updateTimerUI();

  puzzleState.timerInterval = setInterval(() => {
    if (!puzzleState.isStarted) return;
    puzzleState.timeLeft--;
    updateTimerUI();

    if (puzzleState.timeLeft <= 0) {
      stopPuzzleTimer();
      puzzleState.isWon = true; // قفل إمكانية اللعب
      const timeUpBanner = document.getElementById("puzzleTimeUpBanner");
      if (timeUpBanner) timeUpBanner.hidden = false;
    }
  }, 1000);
}

function stopPuzzleTimer() {
  if (puzzleState.timerInterval) {
    clearInterval(puzzleState.timerInterval);
    puzzleState.timerInterval = null;
  }
}

function updateTimerUI() {
  const timerEl = document.getElementById("puzzleTimer");
  if (!timerEl) return;

  const sec = Math.max(0, puzzleState.timeLeft);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mStr = String(m).padStart(2, "0");
  const sStr = String(s).padStart(2, "0");

  timerEl.textContent = `${mStr}:${sStr}`;

  if (sec <= 15 && puzzleState.isStarted) {
    timerEl.classList.add("warning");
  } else {
    timerEl.classList.remove("warning");
  }
}

function shufflePieces(arr) {
  let scrambled = [...arr];
  let isSame = true;

  while (isSame && scrambled.length > 1) {
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    isSame = scrambled.every((p, idx) => p.correctIndex === idx);
  }
  return scrambled;
}

function drawJigsawPieceCanvas(img, correctIndex, totalTiles, wordData, edges, cellW, cellH) {
  const canvas = document.createElement("canvas");

  const cols = 4;
  const rows = Math.ceil(totalTiles / cols);
  const r = Math.floor(correctIndex / cols);
  const c = correctIndex % cols;

  const pad = Math.max(cellW, cellH) * 0.15;
  const cssW = cellW + pad * 2;
  const cssH = cellH + pad * 2;

  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(cssW * dpr);
  canvas.height = Math.ceil(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(dpr, dpr);
  ctx.save();
  ctx.translate(pad, pad);

  // رسم مسار قطعة البازل الحقيقية
  ctx.beginPath();
  buildJigsawPath(ctx, cellW, cellH, edges);
  ctx.clip();

  // أرضية لون البرق القديم
  ctx.fillStyle = "#E4D5AE";
  ctx.fillRect(-pad, -pad, cssW, cssH);

  // 1. رسم مقطع الصورة بشفافية 0.5 (حسب تعديل المستخدم) ومحاذاة تامة
  if (img && img.complete && img.naturalWidth > 0) {
    const srcW = img.naturalWidth / cols;
    const srcH = img.naturalHeight / rows;
    const srcX = c * srcW;
    const srcY = r * srcH;

    const scaleX = srcW / cellW;
    const scaleY = srcH / cellH;

    const srcPadX = pad * scaleX;
    const srcPadY = pad * scaleY;

    ctx.save();
    ctx.globalAlpha = 0.5; // حفظ شفافية 0.5 المعدلة بواسطة المستخدم
    ctx.drawImage(
      img,
      srcX - srcPadX,
      srcY - srcPadY,
      srcW + srcPadX * 2,
      srcH + srcPadY * 2,
      -pad,
      -pad,
      cssW,
      cssH
    );
    ctx.restore();

    // طبقة تظليل ناعمة لإبراز النص
    ctx.fillStyle = "rgba(20, 10, 5, 0.32)";
    ctx.fillRect(-pad, -pad, cssW, cssH);
  }

  // 2. كتابة النص القبطي بالخط الذهبي وتعديلات حجم الخط الخاضعة للمستخدم
  if (wordData && wordData.coptic) {
    const text = wordData.coptic;
    const fontSize = Math.min(cellW * 0.12, cellH * 0.22); // حفظ تعديل المستخدم

    ctx.font = `bold ${Math.max(12, Math.floor(fontSize))}px "coptic-abraam", "Amiri", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // تظليل النص لإبرازه
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    // حدود دقيقة بارزة داكنة
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgba(15, 8, 3, 0.95)";
    ctx.strokeText(text, cellW / 2, cellH / 2);

    // لون النص الذهبي الناصع High-Contrast
    ctx.fillStyle = "#FFF4B8";
    ctx.fillText(text, cellW / 2, cellH / 2);

    ctx.shadowColor = "transparent";
  }

  ctx.restore();
  ctx.save();
  ctx.translate(pad, pad);
  ctx.beginPath();
  buildJigsawPath(ctx, cellW, cellH, edges);

  // حواف تظليل 3D لقطعة البازل
  ctx.strokeStyle = "rgba(43, 33, 24, 0.75)";
  ctx.lineWidth = 2.0;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 245, 220, 0.45)";
  ctx.lineWidth = 1.0;
  ctx.stroke();

  ctx.restore();

  return canvas;
}

function buildJigsawPath(ctx, w, h, edges) {
  ctx.moveTo(0, 0);

  drawJigsawSide(ctx, 0, 0, w, 0, edges.top);
  drawJigsawSide(ctx, w, 0, w, h, edges.right);
  drawJigsawSide(ctx, w, h, 0, h, edges.bottom);
  drawJigsawSide(ctx, 0, h, 0, 0, edges.left);

  ctx.closePath();
}

function drawJigsawSide(ctx, x1, y1, x2, y2, tabType) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);

  if (tabType === 0 || len === 0) {
    ctx.lineTo(x2, y2);
    return;
  }

  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy * tabType;
  const ny = ux * tabType;

  const tabAmp = 0.08;

  const pt = (t, n) => [
    x1 + t * len * ux + n * len * nx,
    y1 + t * len * uy + n * len * ny
  ];

  const p1 = pt(0.38, 0);
  ctx.lineTo(p1[0], p1[1]);

  const c1 = pt(0.36, tabAmp * 0.3);
  const c2 = pt(0.34, tabAmp * 0.7);
  const ep1 = pt(0.42, tabAmp * 0.8);
  ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], ep1[0], ep1[1]);

  const c3 = pt(0.46, tabAmp * 1.2);
  const c4 = pt(0.54, tabAmp * 1.2);
  const ep2 = pt(0.58, tabAmp * 0.8);
  ctx.bezierCurveTo(c3[0], c3[1], c4[0], c4[1], ep2[0], ep2[1]);

  const c5 = pt(0.66, tabAmp * 0.7);
  const c6 = pt(0.64, tabAmp * 0.3);
  const ep3 = pt(0.62, 0);
  ctx.bezierCurveTo(c5[0], c5[1], c6[0], c6[1], ep3[0], ep3[1]);

  ctx.lineTo(x2, y2);
}

function renderPuzzleBoard() {
  const board = document.getElementById("puzzleBoard");
  if (!board) return;

  const totalTiles = puzzleState.pieces.length;
  const cols = 4;
  const rows = Math.ceil(totalTiles / cols);

  board.setAttribute("dir", "ltr");
  board.style.direction = "ltr";
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  board.style.aspectRatio = `${PUZZLE_CONFIG.aspectRatio || (1136 / 1385)}`;
  board.innerHTML = "";

  const boardRect = board.getBoundingClientRect();
  const boardW = boardRect.width > 0 ? boardRect.width : 560;
  const boardH = boardW / (PUZZLE_CONFIG.aspectRatio || (1136 / 1385));
  const cellW = boardW / cols;
  const cellH = boardH / rows;

  puzzleState.pieces.forEach((piece, index) => {
    const tileSlot = document.createElement("div");
    tileSlot.className = "puzzle-tile-slot";
    tileSlot.dataset.index = index;
    tileSlot.setAttribute("draggable", "true");

    const canvas = drawJigsawPieceCanvas(
      puzzleState.loadedImg,
      piece.correctIndex,
      totalTiles,
      piece.wordData,
      piece.edges,
      cellW,
      cellH
    );

    canvas.className = "jigsaw-piece-canvas";
    tileSlot.appendChild(canvas);

    const isCorrect = piece.correctIndex === index;
    if (isCorrect) {
      tileSlot.classList.add("in-place");
    }

    // 1. النقر للاختيار والاستبدال (Click / Tap Selection)
    tileSlot.addEventListener("click", () => handleTileClick(index));

    // 2. أحداث السحب والإفلات للكمبيوتر (Desktop HTML5 Drag & Drop)
    tileSlot.addEventListener("dragstart", (e) => {
      if (!puzzleState.isStarted || puzzleState.isWon) return;
      tileSlot.classList.add("dragging");
      e.dataTransfer.setData("text/plain", index);
    });

    tileSlot.addEventListener("dragend", () => {
      tileSlot.classList.remove("dragging");
    });

    tileSlot.addEventListener("dragover", (e) => {
      if (!puzzleState.isStarted || puzzleState.isWon) return;
      e.preventDefault();
      tileSlot.classList.add("drag-over");
    });

    tileSlot.addEventListener("dragleave", () => {
      tileSlot.classList.remove("drag-over");
    });

    tileSlot.addEventListener("drop", (e) => {
      if (!puzzleState.isStarted || puzzleState.isWon) return;
      e.preventDefault();
      tileSlot.classList.remove("drag-over");
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (!isNaN(fromIndex) && fromIndex !== index) {
        swapTiles(fromIndex, index);
      }
    });

    // 3. أحداث السحب والإفلات المتوافقة مع الموبايل واللمس (Mobile Touch Drag & Drop)
    setupMobileTouchEvents(tileSlot, index);

    board.appendChild(tileSlot);
  });
}

function setupMobileTouchEvents(tileSlot, index) {
  tileSlot.addEventListener("touchstart", (e) => {
    if (!puzzleState.isStarted || puzzleState.isWon) return;
    const touch = e.touches[0];
    touchDragState.activeTileIndex = index;
    touchDragState.startX = touch.clientX;
    touchDragState.startY = touch.clientY;
    touchDragState.isDragging = false;
    touchDragState.currentTargetIndex = null;
  }, { passive: false });

  tileSlot.addEventListener("touchmove", (e) => {
    if (!puzzleState.isStarted || puzzleState.isWon || touchDragState.activeTileIndex !== index) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchDragState.startX);
    const dy = Math.abs(touch.clientY - touchDragState.startY);

    // تفعيل السحب عند تجاوز التحرّك 8 بكسل
    if (!touchDragState.isDragging && (dx > 8 || dy > 8)) {
      touchDragState.isDragging = true;
      tileSlot.classList.add("touch-dragging");

      const originalCanvas = tileSlot.querySelector("canvas");
      if (originalCanvas) {
        const ghost = originalCanvas.cloneNode(true);
        ghost.className = "touch-drag-ghost";
        const rect = originalCanvas.getBoundingClientRect();
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.left = `${touch.clientX}px`;
        ghost.style.top = `${touch.clientY}px`;
        document.body.appendChild(ghost);
        touchDragState.ghostEl = ghost;
      }
    }

    if (touchDragState.isDragging) {
      e.preventDefault(); // منع التمرير على الموبايل أثناء سحب قطعة البازل

      if (touchDragState.ghostEl) {
        touchDragState.ghostEl.style.left = `${touch.clientX}px`;
        touchDragState.ghostEl.style.top = `${touch.clientY}px`;
      }

      // إزالة التحديد السابق عن القطع المستهدفة
      document.querySelectorAll(".puzzle-tile-slot.drag-over").forEach(el => el.classList.remove("drag-over"));

      const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetSlot = elementUnder ? elementUnder.closest(".puzzle-tile-slot") : null;

      if (targetSlot && targetSlot.dataset.index !== undefined) {
        const targetIdx = parseInt(targetSlot.dataset.index, 10);
        touchDragState.currentTargetIndex = targetIdx;
        targetSlot.classList.add("drag-over");
      } else {
        touchDragState.currentTargetIndex = null;
      }
    }
  }, { passive: false });

  tileSlot.addEventListener("touchend", () => {
    if (!puzzleState.isStarted || puzzleState.isWon || touchDragState.activeTileIndex !== index) return;

    document.querySelectorAll(".puzzle-tile-slot.drag-over").forEach(el => el.classList.remove("drag-over"));
    tileSlot.classList.remove("touch-dragging");

    if (touchDragState.ghostEl) {
      touchDragState.ghostEl.remove();
      touchDragState.ghostEl = null;
    }

    if (touchDragState.isDragging && touchDragState.currentTargetIndex !== null && touchDragState.currentTargetIndex !== index) {
      swapTiles(index, touchDragState.currentTargetIndex);
    }

    touchDragState.activeTileIndex = null;
    touchDragState.isDragging = false;
    touchDragState.currentTargetIndex = null;
  });
}

function handleTileClick(index) {
  if (!puzzleState.isStarted || puzzleState.isWon) return;

  if (puzzleState.selectedPieceIndex === null) {
    puzzleState.selectedPieceIndex = index;
    highlightTile(index, true);
  } else if (puzzleState.selectedPieceIndex === index) {
    highlightTile(index, false);
    puzzleState.selectedPieceIndex = null;
  } else {
    const firstIndex = puzzleState.selectedPieceIndex;
    highlightTile(firstIndex, false);
    puzzleState.selectedPieceIndex = null;
    swapTiles(firstIndex, index);
  }
}

function highlightTile(index, select) {
  const board = document.getElementById("puzzleBoard");
  if (!board) return;
  const slot = board.children[index];
  if (slot) {
    slot.classList.toggle("selected", select);
  }
}

function swapTiles(indexA, indexB) {
  if (!puzzleState.isStarted || puzzleState.isWon) return;

  const pieceA = puzzleState.pieces[indexA];
  const pieceB = puzzleState.pieces[indexB];

  [puzzleState.pieces[indexA], puzzleState.pieces[indexB]] = [pieceB, pieceA];

  puzzleState.pieces[indexA].currentIndex = indexA;
  puzzleState.pieces[indexB].currentIndex = indexB;

  puzzleState.moves += 1;

  renderPuzzleBoard();
  updatePuzzleStats();

  const board = document.getElementById("puzzleBoard");
  if (board) {
    if (puzzleState.pieces[indexA].correctIndex === indexA) {
      createSparkleBurst(board.children[indexA]);
    }
    if (puzzleState.pieces[indexB].correctIndex === indexB) {
      createSparkleBurst(board.children[indexB]);
    }
  }

  checkPuzzleWin();
}

function createSparkleBurst(container) {
  if (!container) return;
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle-particle";
    const angle = (i / 8) * Math.PI * 2;
    const dist = 18 + Math.random() * 24;
    const dx = Math.cos(angle) * dist + "px";
    const dy = Math.sin(angle) * dist + "px";
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.left = "50%";
    particle.style.top = "50%";
    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 600);
  }
}

function updatePuzzleStats() {
  const moveEl = document.getElementById("puzzleMoves");
  const matchEl = document.getElementById("puzzleMatches");
  const total = puzzleState.pieces.length;

  let correctCount = 0;
  puzzleState.pieces.forEach((p, idx) => {
    if (p.correctIndex === idx) correctCount++;
  });

  if (moveEl) moveEl.textContent = puzzleState.moves;
  if (matchEl) matchEl.textContent = `${correctCount} / ${total}`;
}

function checkPuzzleWin() {
  const total = puzzleState.pieces.length;
  const isAllCorrect = puzzleState.pieces.every((p, idx) => p.correctIndex === idx);

  if (isAllCorrect && total > 0) {
    puzzleState.isWon = true;
    stopPuzzleTimer();

    const winBanner = document.getElementById("puzzleWinBanner");
    const winMoves = document.getElementById("puzzleWinMoves");
    if (winMoves) winMoves.textContent = puzzleState.moves;
    if (winBanner) winBanner.hidden = false;
  }
}
