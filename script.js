const CMS = window.PORTFOLIO_CMS || {};
const PROJECT_DATA = Array.isArray(CMS.projects) ? CMS.projects : [];
const CATEGORIES = Array.isArray(CMS.categories) ? CMS.categories : [];
const DISPLAY_COUNTS = CMS.filterCounts || {};
const activeFilters = new Set();
const filtersEl = document.getElementById("filters");
const projectsEl = document.getElementById("projects");
const stageEl = document.getElementById("deck-stage");
const emptyStateEl = document.getElementById("empty-state");
const activeTitleEl = document.getElementById("active-project-title");
const indexToggleEl = document.getElementById("index-toggle");
const indexPopupEl = document.getElementById("work-index");
const indexPopupCloseEl = document.getElementById("index-popup-close");
const indexWorkListEl = document.getElementById("index-work-list");
const indexBackTopEl = document.getElementById("index-back-top");
const aboutToggleEl = document.getElementById("about-toggle");
const aboutPopupEl = document.getElementById("about-popup");
const aboutPopupCloseEl = document.getElementById("about-popup-close");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayoutQuery = window.matchMedia("(max-width: 860px)");
// Carousel motion tuning: input moves the target, then the deck glides toward it.
const DECK_EASE = 0.8; /*How quickly the visible carousel catches up to the target position each animation frame. Higher = more responsive/snappier. Lower = floatier/slower.*/
const DECK_SNAP_EASE = 5; /*Catch-up speed when the carousel is near a snapped project position. Higher = finishes settling faster.*/
const SNAP_DISTANCE = 0.008; /*How close a project panel must be to center before the bottom title is allowed to update. Lower = title changes later. Higher = title changes earlier.*/
const TITLE_SYNC_DISTANCE = 0.18;/*How close a project panel must be to center before the bottom title is allowed to update. Lower = title changes later. Higher = title changes earlier.*/
const TITLE_CHANGE_DELAY = 70; /*Delay in milliseconds for the title fade/change animation. Lower = faster text swap.*/
const CLONE_RANGE = 5; /*How many duplicate sets of projects are rendered on each side to make the carousel feel infinite/looping.*/
const TOUCH_STEP_THRESHOLD = 18; /*Minimum touch drag distance in pixels before it counts as an intentional swipe.*/
const WHEEL_PROGRESS_FACTOR = 0.0042; /*How much scroll wheel movement changes the carousel position. Higher = scrolling moves through projects faster.*/
const WHEEL_SNAP_DELAY = 105; /*How long after scrolling stops before the carousel snaps to the nearest project. Higher = waits longer. Lower = settles sooner.*/
const WHEEL_SNAP_DURATION = 300; /*How long the snap animation takes in milliseconds. Higher = slower/smoother. Lower = quicker.*/
const MIN_WHEEL_DELTA = 0.05; /*Tiny wheel movements below this are ignored to prevent jitter.*/
const WHEEL_LINE_HEIGHT = 28; /*Converts “line-based” wheel events into pixels. Mostly for browser/device compatibility.*/
const WHEEL_DELTA_LINE = 1; /*Browser constant meaning wheel delta is measured in lines.*/
const WHEEL_DELTA_PAGE = 2; /*Browser constant meaning wheel delta is measured in pages.*/
const MAX_QUEUED_STEPS = 3; /*Max number of keyboard/project-step moves that can queue up while the carousel is still animating.*/
const INTRO_SWIRL_DURATION = 1450; /*How long the intro carousel swirl animation lasts, in milliseconds.*/

let visibleProjects = [];
let animationFrame = 0;
let targetProgress = 0;
let currentProgress = 0;
let smoothingFrame = 0;
let touchStartY = 0;
let touchLastY = 0;
let touchStartProgress = 0;
let activeProjectTitle = "";
let titleFrame = 0;
let wheelSnapFrame = 0;
let wheelSnapAnimationFrame = 0;
let queuedSteps = 0;
let introSwirlActive = false;
let introSwirlFrame = 0;
let introSwirlStartedAt = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutSine(value) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getPlainText(value = "") {
  const template = document.createElement("template");
  template.innerHTML = String(value);

  return template.content.textContent || "";
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function getProjectUrl(project) {
  return project.url || `project.html?project=${encodeURIComponent(project.id)}`;
}

function getCover(project) {
  return project.cover || {};
}

function renderCover(project) {
  const cover = getCover(project);
  const alt = cover.alt || project.title || "";

  if (cover.kind === "video") {
    return `
      <video src="${escapeHTML(cover.src)}" ${cover.poster ? `poster="${escapeHTML(cover.poster)}"` : ""} autoplay muted loop playsinline preload="metadata" draggable="false"></video>
    `;
  }

  return `<img src="${escapeHTML(cover.src)}" alt="${escapeHTML(alt)}" draggable="false" />`;
}

function renderIndexThumbnail(project) {
  const cover = getCover(project);
  const src = cover.kind === "video" ? cover.poster : cover.src;
  const alt = cover.alt || project.title || "";

  if (!src) return "";

  return `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" draggable="false" />`;
}

function renderHomeProjects() {
  if (!stageEl) return;

  const panels = [];

  for (let copy = -CLONE_RANGE; copy <= CLONE_RANGE; copy += 1) {
    PROJECT_DATA.forEach((project, index) => {
      const categories = Array.isArray(project.categories) ? project.categories.join("|") : "";
      const label = `${project.title}, ${project.type || "Project"}, ${project.year || ""}`;
      const virtualIndex = index + copy * PROJECT_DATA.length;

      panels.push(`
        <a class="project ${copy === 0 ? "" : "is-clone"}" data-cats="${escapeHTML(categories)}" data-title="${escapeHTML(project.title || "")}" data-base-index="${index}" data-virtual-index="${virtualIndex}" href="${escapeHTML(getProjectUrl(project))}" aria-label="${escapeHTML(label)}">
          ${renderCover(project)}
        </a>
      `);
    });
  }

  stageEl.innerHTML = panels.join("");
}

function renderIndexProjects() {
  if (!indexWorkListEl) return;

  indexWorkListEl.innerHTML = `
    <div class="index-table-head" aria-hidden="true">
      <span>No.</span>
      <span></span>
      <span>Project</span>
      <span>Type</span>
      <span>Year</span>
      <span>Field</span>
    </div>
    ${PROJECT_DATA.map((project, index) => {
    const statement = getPlainText(project.detail?.statement || "");
    const type = project.type || "Project";
    const year = project.year || "----";
    const field = Array.isArray(project.categories) && project.categories.length ? project.categories[0] : "Work";

    return `
      <article class="index-work" data-index="${index}">
        <a class="index-work-row" href="${escapeHTML(getProjectUrl(project))}">
          <span class="index-work-number">${formatNumber(index + 1)}</span>
          <span class="index-work-thumb">${renderIndexThumbnail(project)}</span>
          <span class="index-work-copy">
            <span class="index-work-title">${escapeHTML(project.title || "Untitled")}</span>
            ${statement ? `<span class="index-work-note">${escapeHTML(statement)}</span>` : ""}
          </span>
          <span class="index-work-type">${escapeHTML(type)}</span>
          <span class="index-work-year">${escapeHTML(year)}</span>
          <span class="index-work-field">${escapeHTML(field)}</span>
        </a>
      </article>
    `;
  }).join("")}
  `;
}

function wrapValue(value, length) {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
}

function getLoopOffset(index, progress, length) {
  if (length <= 0) return 0;

  const halfLength = length / 2;
  return wrapValue(index - progress + halfLength, length) - halfLength;
}

function getProjectCategories(project) {
  return (project.dataset.cats || "").split("|").filter(Boolean);
}

function buildFilters() {
  if (!filtersEl) return;

  filtersEl.innerHTML = CATEGORIES.map((cat) => `
    <button class="filter ${activeFilters.has(cat) ? "is-active" : ""}" type="button" data-cat="${cat}" aria-pressed="${activeFilters.has(cat)}">
      <span class="filter-label">${cat} (${getFilterCount(cat)})</span>
    </button>
  `).join("");

  filtersEl.querySelectorAll(".filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      const cat = filter.dataset.cat;

      if (activeFilters.has(cat)) {
        activeFilters.delete(cat);
      } else {
        activeFilters.add(cat);
      }

      buildFilters();
      applyFilters();
    });
  });
}

function getFilterCount(category) {
  if (DISPLAY_COUNTS[category] !== undefined) return DISPLAY_COUNTS[category];

  return PROJECT_DATA.filter((project) => {
    const categories = Array.isArray(project.categories) ? project.categories : [];
    return categories.includes(category);
  }).length;
}

function refreshVisibleProjects() {
  if (!projectsEl || !stageEl) return;

  visibleProjects = [...stageEl.querySelectorAll(".project:not(.is-hidden)")];

  projectsEl.classList.toggle("has-no-results", visibleProjects.length === 0);
}

function getMaxProgress() {
  return Math.max(getProjectCount() - 1, 0);
}

function getProjectCount() {
  return PROJECT_DATA.length;
}

function normalizeLoopBounds() {
  const count = getProjectCount();

  if (count === 0) return;
  if (mobileLayoutQuery.matches) return;

  const recenterAt = count * (CLONE_RANGE - 2);
  if (Math.abs(targetProgress) < recenterAt) return;

  const loops = Math.trunc(targetProgress / count);

  if (loops === 0) return;

  targetProgress -= loops * count;
  currentProgress -= loops * count;
  touchStartProgress -= loops * count;
}

function applyFilters() {
  if (!stageEl) return;

  stageEl.querySelectorAll(".project").forEach((project) => {
    const cats = getProjectCategories(project);
    const matches = activeFilters.size === 0 || [...activeFilters].some((filter) => cats.includes(filter));

    project.classList.toggle("is-hidden", !matches);
    project.setAttribute("aria-hidden", String(!matches));

    if (matches) {
      project.removeAttribute("tabindex");
    } else {
      project.setAttribute("tabindex", "-1");
    }
  });

  refreshVisibleProjects();
  if (visibleProjects.length > 0) {
    targetProgress = wrapValue(targetProgress, getProjectCount());
    currentProgress = targetProgress;
  }
  requestDeckUpdate();
}

function resetCardStyles() {
  visibleProjects.forEach((project) => {
    project.style.transform = "";
    project.style.opacity = "";
    project.style.filter = "";
    project.style.zIndex = "";
    project.style.pointerEvents = "";
    project.style.boxShadow = "";
    project.classList.remove("is-active", "is-inactive");
  });

  updateActiveTitle(visibleProjects[0]);
}

function hideProject(project) {
  project.classList.remove("is-active", "is-inactive");
  project.style.transform = "";
  project.style.opacity = "0";
  project.style.filter = "";
  project.style.zIndex = "";
  project.style.boxShadow = "none";
  project.style.pointerEvents = "none";
  project.setAttribute("aria-hidden", "true");
  project.setAttribute("tabindex", "-1");
}

function updateActiveTitle(project) {
  if (!activeTitleEl || !project) return;

  const nextTitle = (project.dataset.title || "").toUpperCase();
  if (!nextTitle || nextTitle === activeProjectTitle) return;

  activeProjectTitle = nextTitle;
  activeTitleEl.classList.add("is-changing");

  if (titleFrame) window.clearTimeout(titleFrame);
  titleFrame = window.setTimeout(() => {
    activeTitleEl.textContent = nextTitle;
    activeTitleEl.classList.remove("is-changing");
  }, TITLE_CHANGE_DELAY);
}

function renderDeck(progress) {
  animationFrame = 0;

  if (!projectsEl || !stageEl || visibleProjects.length === 0) return;

  if (reduceMotionQuery.matches) {
    resetCardStyles();
    return;
  }

  const count = getProjectCount();
  if (count === 0) return;

  const projectsRect = projectsEl.getBoundingClientRect();
  const isMobileLayout = mobileLayoutQuery.matches;
  const radiusX = Math.max(
    isMobileLayout ? 220 : 620,
    Math.min(projectsRect.width * (isMobileLayout ? 0.5 : 0.64), isMobileLayout ? 390 : 1040)
  );
  const radiusY = Math.max(
    isMobileLayout ? 170 : 300,
    Math.min(projectsRect.height * (isMobileLayout ? 0.62 : 0.9), isMobileLayout ? 320 : 560)
  );
  const depthRange = isMobileLayout ? 760 : 1080;
  const frontLift = isMobileLayout ? 140 : 190;
  const arcStep = (Math.PI * 2) / count;
  let closestProject = visibleProjects[0];
  let closestDistance = Infinity;

  visibleProjects.forEach((project) => {
    if (project.classList.contains("is-clone")) {
      hideProject(project);
      return;
    }

    const baseIndex = Number(project.dataset.baseIndex || 0);
    const offset = getLoopOffset(baseIndex, progress, count);
    const absRawOffset = Math.abs(offset);
    const angle = offset * arcStep;
    const depth = Math.cos(angle);
    const visibleDepth = clamp(depth, 0, 1);
    const depthOpacity = clamp((depth + 1) / 2, 0, 1);
    const x = Math.sin(angle) * radiusX;
    const y = (1 - visibleDepth) * radiusY;
    const z = introSwirlActive
      ? visibleDepth * frontLift - (1 - visibleDepth) * (depthRange * 0.9)
      : isMobileLayout
      ? visibleDepth * frontLift - (1 - visibleDepth) * depthRange - Math.max(absRawOffset - 0.35, 0) * 42
      : visibleDepth * frontLift - (1 - visibleDepth) * depthRange - Math.max(absRawOffset - 0.4, 0) * 38;
    const panelTurn = introSwirlActive
      ? -Math.sin(angle) * (isMobileLayout ? 34 : 48)
      : isMobileLayout ? -Math.sin(angle) * 30 : -Math.sin(angle) * 44;
    const panelTilt = introSwirlActive
      ? (1 - visibleDepth) * -10
      : isMobileLayout ? (1 - visibleDepth) * -8 : (1 - visibleDepth) * -12;
    const panelRoll = introSwirlActive ? Math.sin(angle) * (isMobileLayout ? 1.2 : 1.8) : 0;
    const scale = isMobileLayout
      ? 0.58 + visibleDepth * 0.48
      : 0.7 + visibleDepth * 0.3;
    const opacity = introSwirlActive
      ? clamp(0.3 + depthOpacity * 0.7, 0, 1)
      : clamp(0.12 + depthOpacity * 0.88, 0, 1);
    const zIndex = isMobileLayout
      ? Math.round(1000 + visibleDepth * 520 - absRawOffset)
      : Math.round(1000 + visibleDepth * 500 - absRawOffset);
    const shadowStrength = clamp(visibleDepth, 0.18, 1);

    if (absRawOffset < closestDistance) {
      closestDistance = absRawOffset;
      closestProject = project;
    }

    project.classList.toggle("is-active", absRawOffset < 0.42);
    project.classList.toggle("is-inactive", absRawOffset >= 0.42);
    project.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${panelTurn}deg) rotateX(${panelTilt}deg) rotateZ(${panelRoll}deg) scale(${scale})`;
    project.style.opacity = String(opacity);
    project.style.filter = "";
    project.style.zIndex = String(zIndex);
    project.style.boxShadow = `0 ${Math.round(24 + shadowStrength * 30)}px ${Math.round(62 + shadowStrength * 64)}px rgba(0, 0, 0, ${0.09 + shadowStrength * 0.16})`;
    project.style.pointerEvents = absRawOffset < 1.2 ? "auto" : "none";
    project.setAttribute("aria-hidden", "false");
    if (absRawOffset < 1.2) {
      project.removeAttribute("tabindex");
    } else {
      project.setAttribute("tabindex", "-1");
    }
  });

  if (closestDistance <= TITLE_SYNC_DISTANCE) {
    updateActiveTitle(closestProject);
  }
}

function animateDeck() {
  smoothingFrame = 0;

  const delta = targetProgress - currentProgress;

  if (Math.abs(delta) < SNAP_DISTANCE) {
    currentProgress = targetProgress;
    renderDeck(currentProgress);
    if (queuedSteps !== 0) {
      consumeQueuedStep();
    }
    return;
  }

  const snapEase = Math.abs(targetProgress - Math.round(targetProgress)) < SNAP_DISTANCE ? DECK_SNAP_EASE : DECK_EASE;
  currentProgress += delta * snapEase;
  renderDeck(currentProgress);
  normalizeLoopBounds();
  smoothingFrame = window.requestAnimationFrame(animateDeck);
}

function requestDeckUpdate() {
  if (reduceMotionQuery.matches) {
    currentProgress = targetProgress;
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(() => renderDeck(currentProgress));
    return;
  }

  if (!smoothingFrame) {
    smoothingFrame = window.requestAnimationFrame(animateDeck);
  }
}

function cancelWheelSnapAnimation() {
  if (!wheelSnapAnimationFrame) return;

  window.cancelAnimationFrame(wheelSnapAnimationFrame);
  wheelSnapAnimationFrame = 0;
}

function startWheelSnapAnimation() {
  cancelWheelSnapAnimation();

  const fromProgress = targetProgress;
  const toProgress = Math.round(targetProgress);

  if (Math.abs(toProgress - fromProgress) < SNAP_DISTANCE) {
    targetProgress = toProgress;
    currentProgress = toProgress;
    requestDeckUpdate();
    return;
  }

  let startedAt = 0;

  const tick = (timestamp) => {
    if (!startedAt) startedAt = timestamp;

    const elapsed = timestamp - startedAt;
    const progress = clamp(elapsed / WHEEL_SNAP_DURATION, 0, 1);
    targetProgress = fromProgress + (toProgress - fromProgress) * easeInOutSine(progress);
    currentProgress = targetProgress;
    normalizeLoopBounds();
    renderDeck(currentProgress);

    if (progress < 1) {
      wheelSnapAnimationFrame = window.requestAnimationFrame(tick);
      return;
    }

    targetProgress = toProgress;
    currentProgress = toProgress;
    wheelSnapAnimationFrame = 0;
    renderDeck(currentProgress);
  };

  wheelSnapAnimationFrame = window.requestAnimationFrame(tick);
}

function finishIntroSwirl() {
  cancelWheelSnapAnimation();

  if (introSwirlFrame) {
    window.cancelAnimationFrame(introSwirlFrame);
    introSwirlFrame = 0;
  }

  introSwirlActive = false;
  introSwirlStartedAt = 0;
  stageEl?.classList.remove("is-intro-swirl");
  targetProgress = 0;
  currentProgress = 0;
  normalizeLoopBounds();
  renderDeck(currentProgress);
}

function startIntroSwirl() {
  if (reduceMotionQuery.matches || visibleProjects.length <= 1) return;

  if (smoothingFrame) {
    window.cancelAnimationFrame(smoothingFrame);
    smoothingFrame = 0;
  }

  introSwirlActive = true;
  introSwirlStartedAt = 0;
  stageEl?.classList.add("is-intro-swirl");
  targetProgress = 0;
  currentProgress = 0;

  const tick = (timestamp) => {
    if (!introSwirlStartedAt) introSwirlStartedAt = timestamp;

    const elapsed = timestamp - introSwirlStartedAt;
    const progress = clamp(elapsed / INTRO_SWIRL_DURATION, 0, 1);
    const easedProgress = easeOutCubic(progress);

    renderDeck(easedProgress * getProjectCount());

    if (progress < 1 && introSwirlActive) {
      introSwirlFrame = window.requestAnimationFrame(tick);
      return;
    }

    finishIntroSwirl();
  };

  introSwirlFrame = window.requestAnimationFrame(tick);
}

function consumeQueuedStep() {
  if (visibleProjects.length === 0) return;
  if (queuedSteps === 0) return;

  const step = Math.sign(queuedSteps);
  queuedSteps -= step;

  targetProgress = Math.round(targetProgress) + step;
  normalizeLoopBounds();
  requestDeckUpdate();
}

function queueDeckSteps(steps) {
  if (visibleProjects.length === 0 || steps === 0) return;

  if (queuedSteps && Math.sign(queuedSteps) !== Math.sign(steps)) {
    queuedSteps = 0;
  }

  queuedSteps = clamp(queuedSteps + steps, -MAX_QUEUED_STEPS, MAX_QUEUED_STEPS);

  if (!smoothingFrame) {
    if (Math.abs(targetProgress - currentProgress) < SNAP_DISTANCE) {
      consumeQueuedStep();
    } else {
      requestDeckUpdate();
    }
  }
}

function normalizeWheelDelta(event) {
  const primaryDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

  if (event.deltaMode === WHEEL_DELTA_LINE) return primaryDelta * WHEEL_LINE_HEIGHT;
  if (event.deltaMode === WHEEL_DELTA_PAGE) return primaryDelta * window.innerHeight;

  return primaryDelta;
}

function setAboutPopup(open) {
  if (!aboutToggleEl || !aboutPopupEl) return;

  if (open) setIndexPopup(false);
  aboutPopupEl.classList.toggle("is-open", open);
  aboutPopupEl.setAttribute("aria-hidden", String(!open));
  aboutToggleEl.setAttribute("aria-expanded", String(open));
}

function setIndexPopup(open) {
  if (!indexToggleEl || !indexPopupEl) return;

  if (open) {
    setAboutPopup(false);
    indexPopupEl.scrollTop = 0;
  }

  indexPopupEl.classList.toggle("is-open", open);
  indexPopupEl.setAttribute("aria-hidden", String(!open));
  indexToggleEl.setAttribute("aria-expanded", String(open));
}

function isPopupEvent(event) {
  return Boolean(event.target instanceof Element && event.target.closest("#about-popup, #work-index"));
}

renderHomeProjects();
renderIndexProjects();
buildFilters();
applyFilters();
startIntroSwirl();

stageEl?.querySelectorAll('a[href="#"]').forEach((project) => {
  project.addEventListener("click", (event) => event.preventDefault());
});

indexToggleEl?.addEventListener("click", (event) => {
  event.preventDefault();
  setIndexPopup(!indexPopupEl?.classList.contains("is-open"));
});

indexPopupCloseEl?.addEventListener("click", () => {
  setIndexPopup(false);
});

indexBackTopEl?.addEventListener("click", () => {
  indexPopupEl?.scrollTo({
    top: 0,
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
  });
});

aboutToggleEl?.addEventListener("click", (event) => {
  event.preventDefault();
  setAboutPopup(!aboutPopupEl?.classList.contains("is-open"));
});

aboutPopupCloseEl?.addEventListener("click", () => {
  setAboutPopup(false);
});

window.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("#about-popup, #work-index, #about-toggle, #index-toggle")) return;

  const hasOpenPopup = aboutPopupEl?.classList.contains("is-open") || indexPopupEl?.classList.contains("is-open");
  if (!hasOpenPopup) return;

  event.preventDefault();
  setAboutPopup(false);
  setIndexPopup(false);
});

window.addEventListener("wheel", (event) => {
  if (isPopupEvent(event)) return;

  event.preventDefault();
  if (introSwirlActive) finishIntroSwirl();

  const primaryDelta = normalizeWheelDelta(event);
  cancelWheelSnapAnimation();
  if (Math.abs(primaryDelta) < MIN_WHEEL_DELTA) return;

  const boundedDelta = clamp(primaryDelta, -220, 220);
  targetProgress += boundedDelta * WHEEL_PROGRESS_FACTOR;
  currentProgress = targetProgress;
  normalizeLoopBounds();
  renderDeck(currentProgress);

  if (wheelSnapFrame) window.clearTimeout(wheelSnapFrame);
  wheelSnapFrame = window.setTimeout(() => {
    startWheelSnapAnimation();
    wheelSnapFrame = 0;
  }, WHEEL_SNAP_DELAY);
}, { passive: false });

window.addEventListener("touchstart", (event) => {
  if (isPopupEvent(event)) return;
  if (event.touches.length !== 1) return;
  if (introSwirlActive) finishIntroSwirl();
  cancelWheelSnapAnimation();

  touchStartY = event.touches[0].clientY;
  touchLastY = touchStartY;
  touchStartProgress = targetProgress;
}, { passive: true });

window.addEventListener("touchmove", (event) => {
  if (isPopupEvent(event)) return;
  if (event.touches.length !== 1) return;

  event.preventDefault();
  touchLastY = event.touches[0].clientY;
  const delta = touchStartY - touchLastY;
  targetProgress = touchStartProgress + delta * 0.006;
  normalizeLoopBounds();
  requestDeckUpdate();
}, { passive: false });

window.addEventListener("touchend", (event) => {
  if (isPopupEvent(event)) return;

  const touchEndY = event.changedTouches[0]?.clientY ?? touchLastY;
  const delta = touchStartY - touchEndY;

  if (Math.abs(delta) < TOUCH_STEP_THRESHOLD) {
    targetProgress = Math.round(touchStartProgress);
  } else {
    targetProgress = Math.round(targetProgress);
  }

  normalizeLoopBounds();
  requestDeckUpdate();
}, { passive: true });

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutPopupEl?.classList.contains("is-open")) {
    setAboutPopup(false);
    return;
  }

  if (event.key === "Escape" && indexPopupEl?.classList.contains("is-open")) {
    setIndexPopup(false);
    return;
  }

  const keys = ["ArrowDown", "ArrowRight", "PageDown", " ", "ArrowUp", "ArrowLeft", "PageUp", "Home", "End"];
  if (!keys.includes(event.key)) return;

  event.preventDefault();
  if (introSwirlActive) finishIntroSwirl();
  cancelWheelSnapAnimation();

  if (event.key === "Home") {
    targetProgress = Math.round(targetProgress / Math.max(getProjectCount(), 1)) * Math.max(getProjectCount(), 1);
  } else if (event.key === "End") {
    targetProgress = Math.round(targetProgress / Math.max(getProjectCount(), 1)) * Math.max(getProjectCount(), 1) + getMaxProgress();
  } else {
    const direction = ["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key) ? -1 : 1;
    queueDeckSteps(direction * (event.key.includes("Page") ? 2 : 1));
    return;
  }

  requestDeckUpdate();
});

window.addEventListener("resize", () => {
  if (introSwirlActive) finishIntroSwirl();
  cancelWheelSnapAnimation();
  refreshVisibleProjects();
  normalizeLoopBounds();
  currentProgress = targetProgress;
  requestDeckUpdate();
});
reduceMotionQuery.addEventListener("change", () => {
  if (introSwirlActive) finishIntroSwirl();
  requestDeckUpdate();
});
mobileLayoutQuery.addEventListener("change", () => {
  if (introSwirlActive) finishIntroSwirl();
  requestDeckUpdate();
});
