/* =========================================================
   app.js
   - تبديل التابات (Tabs)
   - بناء شبكة الحروف (Tab 1) + تشغيل الصوت عند الضغط
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initFontSwitcher();
  renderLettersGrid();
});

/* ---------------------------------------------------------
   Tabs
--------------------------------------------------------- */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });

      panels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.classList.toggle("active", isTarget);
        panel.hidden = !isTarget;
      });

      // وقف أي صوت شغال لو الفينسورا في تاب تاني
      stopAllLetterAudio();
    });
  });
}

/* ---------------------------------------------------------
   Font switcher (تحديد أي خط قبطي يُستخدم لعرض الحروف)
--------------------------------------------------------- */
let currentCopticFont = "coptic-shenouda";

function initFontSwitcher() {
  const options = document.querySelectorAll(".font-opt");
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.toggle("active", o === opt));
      currentCopticFont = opt.dataset.font;
      applyCopticFontToGlyphs();
    });
  });
}

function applyCopticFontToGlyphs() {
  document.querySelectorAll(".letter-glyph").forEach((el) => {
    el.style.fontFamily = `"${currentCopticFont}"`;
  });
}

/* ---------------------------------------------------------
   Letters grid (Tab 1)
--------------------------------------------------------- */
let activeAudio = null;
let activeCard = null;

function renderLettersGrid() {
  const grid = document.getElementById("lettersGrid");
  if (!grid || typeof COPTIC_LETTERS === "undefined") return;

  grid.innerHTML = "";

  COPTIC_LETTERS.forEach((letter, index) => {
    const card = document.createElement("button");
    card.className = "letter-card";
    card.type = "button";
    card.setAttribute("aria-label", `حرف ${letter.name}`);

    // خانة شكل الحرف — تعرض صورة لو imagePath متحطة، وإلا ترجع للخط القبطي
    const shapeHTML = letter.imagePath
      ? `<img src="${letter.imagePath}" alt="حرف ${letter.name}">`
      : `<span class="letter-glyph" style="font-family:'${currentCopticFont}'">${letter.char}</span>`;

    card.innerHTML = `
      <span class="sound-indicator"><span></span><span></span><span></span></span>
      <span class="letter-shape">${shapeHTML}</span>
      <span class="letter-name">${letter.name}</span>
    `;

    card.addEventListener("click", () => playLetterAudio(letter, card));

    grid.appendChild(card);
  });
}

function playLetterAudio(letter, card) {
  stopAllLetterAudio();

  if (!letter.audioPath) {
    // مفيش مسار صوت متحط لسه — نعرض حالة "تشغيل" بصريًا لمدة قصيرة فقط كمعاينة
    card.classList.add("playing");
    activeCard = card;
    setTimeout(() => {
      if (activeCard === card) {
        card.classList.remove("playing");
        activeCard = null;
      }
    }, 1200);
    return;
  }

  const audio = new Audio(letter.audioPath);
  activeAudio = audio;
  activeCard = card;
  card.classList.add("playing");

  audio.addEventListener("ended", () => {
    card.classList.remove("playing");
    if (activeAudio === audio) activeAudio = null;
    if (activeCard === card) activeCard = null;
  });

  audio.play().catch(() => {
    // تعذر تشغيل الصوت (مسار خاطئ أو المتصفح منع التشغيل التلقائي)
    card.classList.remove("playing");
  });
}

function stopAllLetterAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (activeCard) {
    activeCard.classList.remove("playing");
    activeCard = null;
  }
}
