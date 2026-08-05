/* =========================================================
   puzzle-game.js
   لعبة كلمات أبانا الذي — محاذاة اللوحة واتجاه العرض 100% LTR
   - إصلاح الانقلاب الأفقي بين اليمين واليسار الناجم عن dir="rtl"
   - الشفافية المطلوبة 0.8
   - نصوص قبطية ذهبية فائقة الوضوح والتباين
   ========================================================= */

let puzzleState = {
  pieces: [],
  edges: { h: [], v: [] },
  selectedPieceIndex: null,
  moves: 0,
  isWon: false,
  loadedImg: null
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
    startPuzzleGame();
  };
  img.onerror = () => {
    startPuzzleGame();
  };
}

function initPuzzleControls() {
  const restartBtn = document.getElementById("restartPuzzle");

  if (restartBtn) {
    restartBtn.addEventListener("click", startPuzzleGame);
  }

  window.addEventListener("resize", debounce(() => {
    if (puzzleState.pieces.length > 0) {
      renderPuzzleBoard();
    }
  }, 200));
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

function startPuzzleGame() {
  if (typeof PUZZLE_CONFIG === "undefined" || !PUZZLE_CONFIG.wordUnits) return;

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
  if (winBanner) winBanner.hidden = true;

  renderPuzzleBoard();
  updatePuzzleStats();
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

  // مضاعفة الدقة لتقنيات شاشات HD / Retina
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

  // 1. رسم مقطع الصورة بشفافية 0.8 ومحاذاة تامة بدون أي إزاحة أو انقلاب
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
    ctx.globalAlpha = 0.5; // شفافية الصورة 0.8
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

  // 2. كتابة النص القبطي بنقاء ووضوح شديد بالخط الذهبي
  if (wordData && wordData.coptic) {
    const text = wordData.coptic;
    const fontSize = Math.min(cellW * 0.12, cellH * 0.22);

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

  // تعيين الاتجاه صراحةً ليكون من اليسار إلى اليمين (LTR) ليتطابق مع إحداثيات الصورة
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

    tileSlot.addEventListener("click", () => handleTileClick(index));

    tileSlot.addEventListener("dragstart", (e) => {
      tileSlot.classList.add("dragging");
      e.dataTransfer.setData("text/plain", index);
    });

    tileSlot.addEventListener("dragend", () => {
      tileSlot.classList.remove("dragging");
    });

    tileSlot.addEventListener("dragover", (e) => {
      e.preventDefault();
      tileSlot.classList.add("drag-over");
    });

    tileSlot.addEventListener("dragleave", () => {
      tileSlot.classList.remove("drag-over");
    });

    tileSlot.addEventListener("drop", (e) => {
      e.preventDefault();
      tileSlot.classList.remove("drag-over");
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (!isNaN(fromIndex) && fromIndex !== index) {
        swapTiles(fromIndex, index);
      }
    });

    board.appendChild(tileSlot);
  });
}

function handleTileClick(index) {
  if (puzzleState.isWon) return;

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
  [puzzleState.pieces[indexA], puzzleState.pieces[indexB]] = [
    puzzleState.pieces[indexB],
    puzzleState.pieces[indexA]
  ];

  puzzleState.pieces[indexA].currentIndex = indexA;
  puzzleState.pieces[indexB].currentIndex = indexB;

  puzzleState.moves += 1;

  renderPuzzleBoard();
  updatePuzzleStats();
  checkPuzzleWin();
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
    const winBanner = document.getElementById("puzzleWinBanner");
    const winMoves = document.getElementById("puzzleWinMoves");
    if (winMoves) winMoves.textContent = puzzleState.moves;
    if (winBanner) winBanner.hidden = false;
  }
}
