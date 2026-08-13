/* =========================================================
   app.js
   - تبديل التابات (Tabs)
   - بناء شبكة الحروف (Tab 1) + تشغيل الصوت عند الضغط
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderLettersGrid();
  initRulesProgress();
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

      // وقف أي صوت شغال
      stopAllLetterAudio();

      // إيقاف تشغيل جميع الفيديوهات غير الموجودة في التاب الحالي
      document.querySelectorAll("video").forEach((vid) => {
        if (!vid.closest(`#${targetId}`)) {
          vid.pause();
        }
      });
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
  // إذا كان نفس الكارت يعمل حالياً، يتم إيقافه
  if (activeCard === card) {
    stopAllLetterAudio();
    return;
  }

  stopAllLetterAudio();

  const paths = Array.isArray(letter.audioPath)
    ? letter.audioPath.filter(Boolean)
    : letter.audioPath ? [letter.audioPath] : [];

  if (paths.length === 0) {
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

  // تعيين الكارت الحالي ككارت نشط وتفعيل مظهر التشغيل
  activeCard = card;
  card.classList.add("playing");

  let currentTrackIndex = 0;

  function playNextTrack() {
    if (activeCard !== card) return;

    if (currentTrackIndex >= paths.length) {
      card.classList.remove("playing");
      activeAudio = null;
      activeCard = null;
      return;
    }

    const audio = new Audio(paths[currentTrackIndex]);
    activeAudio = audio;

    audio.addEventListener("ended", () => {
      if (activeCard !== card) return;
      currentTrackIndex++;
      playNextTrack();
    });

    audio.play().catch((err) => {
      console.warn("Audio playback error for path:", paths[currentTrackIndex], err);
      if (activeCard !== card) return;
      currentTrackIndex++;
      if (currentTrackIndex < paths.length) {
        playNextTrack();
      } else {
        card.classList.remove("playing");
        if (activeAudio === audio) activeAudio = null;
        if (activeCard === card) activeCard = null;
      }
    });
  }

  playNextTrack();
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

/* ---------------------------------------------------------
   Rules Radial Wheel Selector Logic (Tab Rules - Rotatable Dial)
--------------------------------------------------------- */
let completedRuleIds = JSON.parse(localStorage.getItem("coptic_rules_progress") || "[]");
let currentRuleIndex = 0;
let currentWheelRotation = 0;
let isDraggingWheel = false;
let startDragAngle = 0;
let startWheelRotation = 0;
let hasDraggedFar = false;

const COPTIC_NUMERALS = ["Ⲁ", "Ⲃ", "Ⲅ", "Ⲇ", "Ⲉ"];
const RULE_ICONS = [
  "fa-solid fa-scale-balanced",
  "fa-solid fa-book-bookmark",
  "fa-solid fa-user-group",
  "fa-solid fa-link",
  "fa-solid fa-crown"
];

function initRulesProgress() {
  renderRadialWheelNodes();
  setupWheelDragging();
  rotateToRuleIndex(currentRuleIndex, false);
  updateRulesProgressBar();
}

function updateRulesProgressBar() {
  const countEl = document.getElementById("rulesProgressText");
  const fillEl = document.getElementById("rulesProgressFill");
  if (!countEl || !fillEl || typeof COPTIC_RULES === "undefined") return;

  const total = COPTIC_RULES.length;
  const completedCount = completedRuleIds.length;
  const percent = Math.round((completedCount / total) * 100);

  countEl.textContent = `${completedCount} من ${total} قواعد (${percent}%)`;
  fillEl.style.width = `${percent}%`;
}

function toggleRuleCompletion(ruleId) {
  if (completedRuleIds.includes(ruleId)) {
    completedRuleIds = completedRuleIds.filter(id => id !== ruleId);
  } else {
    completedRuleIds.push(ruleId);
  }
  localStorage.setItem("coptic_rules_progress", JSON.stringify(completedRuleIds));
  updateNodeBadges();
  renderActiveRule(currentRuleIndex);
  updateRulesProgressBar();
}

function renderRadialWheelNodes() {
  const container = document.getElementById("wheelContainer");
  if (!container || typeof COPTIC_RULES === "undefined") return;

  const existingNodes = container.querySelectorAll(".wheel-node");
  existingNodes.forEach(n => n.remove());

  const total = COPTIC_RULES.length;
  const stepAngle = 360 / total;
  const radius = 120; // نصف قطر العجلة بالبكسل

  COPTIC_RULES.forEach((rule, idx) => {
    const isCompleted = completedRuleIds.includes(rule.id);
    const angleDeg = (idx * stepAngle) - 90;
    const rad = (angleDeg * Math.PI) / 180;

    // حساب موضع كل أيقونة بالنسبة لمركز العجلة
    const leftPercent = 50 + ((radius * Math.cos(rad)) / 3.2);
    const topPercent = 50 + ((radius * Math.sin(rad)) / 3.2);

    const nodeBtn = document.createElement("button");
    nodeBtn.className = `wheel-node ${idx === currentRuleIndex ? "active" : ""} ${isCompleted ? "completed" : ""}`;
    nodeBtn.type = "button";
    nodeBtn.setAttribute("data-index", idx);
    nodeBtn.setAttribute("aria-label", rule.title);
    nodeBtn.style.left = `${leftPercent}%`;
    nodeBtn.style.top = `${topPercent}%`;

    const copticNum = COPTIC_NUMERALS[idx] || rule.id;
    const iconClass = RULE_ICONS[idx] || "fa-solid fa-book";

    nodeBtn.innerHTML = `
      <div class="node-inner">
        <i class="${iconClass} node-icon"></i>
        <span class="node-badge">${isCompleted ? "✓" : copticNum}</span>
      </div>
    `;

    nodeBtn.addEventListener("click", (e) => {
      if (hasDraggedFar) return;
      document.querySelectorAll("video").forEach(v => v.pause());
      rotateToRuleIndex(idx, true);
    });

    container.appendChild(nodeBtn);
  });
}

function updateNodeBadges() {
  const container = document.getElementById("wheelContainer");
  if (!container || typeof COPTIC_RULES === "undefined") return;

  COPTIC_RULES.forEach((rule, idx) => {
    const nodeBtn = container.querySelector(`.wheel-node[data-index="${idx}"]`);
    if (!nodeBtn) return;

    const isCompleted = completedRuleIds.includes(rule.id);
    nodeBtn.classList.toggle("completed", isCompleted);
    const badge = nodeBtn.querySelector(".node-badge");
    if (badge) {
      badge.textContent = isCompleted ? "✓" : (COPTIC_NUMERALS[idx] || rule.id);
    }
  });
}

function setWheelRotation(angleDeg, animate = true) {
  currentWheelRotation = angleDeg;
  const container = document.getElementById("wheelContainer");
  if (!container) return;

  const transStyle = animate ? "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
  container.style.transition = transStyle;
  container.style.transform = `rotate(${angleDeg}deg)`;

  // إلغاء تدوير المحتوى الداخلي لتبقى الأيقونات والشارات معتدلة دائماً (Upright 100%)
  const nodes = container.querySelectorAll(".wheel-node");
  nodes.forEach(node => {
    const inner = node.querySelector(".node-inner");
    if (inner) {
      inner.style.transition = transStyle;
      inner.style.transform = `rotate(${-angleDeg}deg)`;
    }
  });

  // إلغاء تدوير الصليب في المركز ليبقى معتدلاً دائماً (Upright 100%)
  const centerIcon = container.querySelector(".wheel-center-orb .orb-icon");
  if (centerIcon) {
    centerIcon.style.transition = transStyle;
    centerIcon.style.transform = `rotate(${-angleDeg}deg)`;
  }
}

function rotateToRuleIndex(idx, animate = true) {
  if (typeof COPTIC_RULES === "undefined") return;
  const total = COPTIC_RULES.length;
  const stepAngle = 360 / total;

  currentRuleIndex = (idx + total) % total;
  const targetRotation = - (currentRuleIndex * stepAngle);

  setWheelRotation(targetRotation, animate);

  const container = document.getElementById("wheelContainer");
  if (container) {
    container.querySelectorAll(".wheel-node").forEach(node => {
      const nodeIdx = parseInt(node.getAttribute("data-index"), 10);
      node.classList.toggle("active", nodeIdx === currentRuleIndex);
    });
  }

  const bannerText = document.getElementById("wheelBannerText");
  if (bannerText && COPTIC_RULES[currentRuleIndex]) {
    bannerText.textContent = `${COPTIC_RULES[currentRuleIndex].id}. ${COPTIC_RULES[currentRuleIndex].title}`;
  }

  renderActiveRule(currentRuleIndex);
}

function setupWheelDragging() {
  const container = document.getElementById("wheelContainer");
  if (!container) return;

  const getAngle = (e) => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  };

  const onDragStart = (e) => {
    if (e.target.closest("video") || e.target.closest(".rule-actions-bar")) return;

    isDraggingWheel = true;
    hasDraggedFar = false;
    container.classList.add("is-dragging");
    startDragAngle = getAngle(e);
    startWheelRotation = currentWheelRotation;
  };

  const onDragMove = (e) => {
    if (!isDraggingWheel) return;

    const currentAngle = getAngle(e);
    let delta = currentAngle - startDragAngle;

    if (Math.abs(delta) > 3) {
      hasDraggedFar = true;
    }

    let newRotation = startWheelRotation + delta;
    setWheelRotation(newRotation, false);

    if (typeof COPTIC_RULES !== "undefined") {
      const total = COPTIC_RULES.length;
      const stepAngle = 360 / total;
      let normRotation = (-newRotation) % 360;
      if (normRotation < 0) normRotation += 360;
      let nearestIdx = Math.round(normRotation / stepAngle) % total;
      if (nearestIdx < 0) nearestIdx += total;

      const bannerText = document.getElementById("wheelBannerText");
      if (bannerText && COPTIC_RULES[nearestIdx]) {
        bannerText.textContent = `${COPTIC_RULES[nearestIdx].id}. ${COPTIC_RULES[nearestIdx].title}`;
      }
    }
  };

  const onDragEnd = () => {
    if (!isDraggingWheel) return;
    isDraggingWheel = false;
    container.classList.remove("is-dragging");

    if (typeof COPTIC_RULES === "undefined") return;
    const total = COPTIC_RULES.length;
    const stepAngle = 360 / total;

    let normRotation = (-currentWheelRotation) % 360;
    if (normRotation < 0) normRotation += 360;

    let nearestIdx = Math.round(normRotation / stepAngle) % total;
    if (nearestIdx < 0) nearestIdx += total;

    document.querySelectorAll("video").forEach(v => v.pause());
    rotateToRuleIndex(nearestIdx, true);
  };

  container.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  container.addEventListener("touchstart", onDragStart, { passive: true });
  window.addEventListener("touchmove", onDragMove, { passive: true });
  window.addEventListener("touchend", onDragEnd);
}

function renderActiveRule(index) {
  const container = document.getElementById("rulesVideoContainer");
  if (!container || typeof COPTIC_RULES === "undefined") return;

  const rule = COPTIC_RULES[index];
  if (!rule) return;

  const isCompleted = completedRuleIds.includes(rule.id);
  const isFirst = index === 0;
  const isLast = index === COPTIC_RULES.length - 1;

  container.innerHTML = `
    <div class="rule-video-card active-step-card">
      <div class="rule-video-header">
        <span class="rule-num-badge ${isCompleted ? 'completed-badge' : ''}">${isCompleted ? '✓' : rule.id}</span>
        <div class="rule-title-group">
          <span class="rule-step-tag">الخطوة ${rule.id} من ${COPTIC_RULES.length}</span>
          <h3 class="rule-video-title">${rule.title}</h3>
          <p class="rule-video-desc">${rule.description}</p>
        </div>
      </div>

      <div class="rule-video-wrapper">
        <video id="activeRuleVideo" controls preload="metadata" class="rule-video">
          <source src="${rule.videoPath}" type="video/mp4">
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>



        <button type="button" id="toggleCompleteBtn" class="btn-toggle-complete ${isCompleted ? 'is-complete' : ''}">
          ${isCompleted ? '✓ مكتملة (اضغط للإلغاء)' : 'تعيين كمكتملة ✓'}
        </button>

      </div>
    </div>
  `;

  const vid = document.getElementById("activeRuleVideo");
  if (vid) {
    vid.addEventListener("ended", () => {
      if (!completedRuleIds.includes(rule.id)) {
        toggleRuleCompletion(rule.id);
      }
    });
  }

  const prevBtn = document.getElementById("prevRuleBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentRuleIndex > 0) {
        document.querySelectorAll("video").forEach(v => v.pause());
        rotateToRuleIndex(currentRuleIndex - 1, true);
      }
    });
  }

  const nextBtn = document.getElementById("nextRuleBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentRuleIndex < COPTIC_RULES.length - 1) {
        document.querySelectorAll("video").forEach(v => v.pause());
        rotateToRuleIndex(currentRuleIndex + 1, true);
      }
    });
  }

  const completeBtn = document.getElementById("toggleCompleteBtn");
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      toggleRuleCompletion(rule.id);
    });
  }
}

