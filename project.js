const CMS = window.PORTFOLIO_CMS || {};
const PROJECTS = Array.isArray(CMS.projects) ? CMS.projects : [];

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("project");

  return PROJECTS.find((project) => project.id === id) || PROJECTS[0];
}

function getDetail(project) {
  return project.detail || {};
}

function getCover(project) {
  return project.cover || {};
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text || "";
}

function renderIndex(project) {
  const indexEl = document.getElementById("project-index");
  if (!indexEl) return;

  const sections = getDetail(project).sections || [["Brief"], ["Concept"], ["Website"]];

  const ids = ["detail-hero", ...sections.slice(1).map((_, i) => `section-${i}`)];

  indexEl.innerHTML = sections.map(([label], i) => `
    <a class="index-chip" href="#${ids[i]}">${escapeHTML(label.toLowerCase() === "print" ? "Execution" : label)}</a>
  `).join("");
}

function renderHero(project) {
  const heroEl = document.getElementById("hero-media");
  const heroSection = document.getElementById("detail-hero");
  if (!heroEl || !heroSection) return;

  const detail = getDetail(project);
  const hero = detail.hero || {};
  const cover = getCover(project);
  const heroMedia = hero.kind && hero.kind !== "placeholder" ? hero : cover;

  heroSection.style.background = "var(--paper)";
  heroEl.className = "hero-media";

  if (heroMedia.kind === "image" && heroMedia.src) {
    heroEl.innerHTML = `<img src="${escapeHTML(heroMedia.src)}" alt="${escapeHTML(heroMedia.alt || project.title)}" />`;
    return;
  }

  if (heroMedia.kind === "video" && heroMedia.src) {
    heroEl.innerHTML = `
      <video src="${escapeHTML(heroMedia.src)}" ${heroMedia.poster ? `poster="${escapeHTML(heroMedia.poster)}"` : ""} autoplay muted loop playsinline preload="metadata"></video>
    `;
    return;
  }

  heroEl.classList.add("is-placeholder");
  heroEl.textContent = hero.text || "image of the project\ngoes here (or video)";
}

function renderMediaItem(item) {
  const caption = item.caption ? `<figcaption>${escapeHTML(item.caption)}</figcaption>` : "";

  if (item.kind === "video") {
    return `
      <figure class="content-media">
        <video src="${escapeHTML(item.src)}" ${item.poster ? `poster="${escapeHTML(item.poster)}"` : ""} controls playsinline></video>
        ${caption}
      </figure>
    `;
  }

  return `
    <figure class="content-media">
      <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt || item.caption || "")}" />
      ${caption}
    </figure>
  `;
}

function renderContentBlock(block, index) {
  const id = `section-${index}`;

  if (block.kind === "quote") {
    return `
      <section id="${id}" class="content-block quote-block">
        <blockquote>${escapeHTML(block.text || "")}</blockquote>
        ${block.credit ? `<p>${escapeHTML(block.credit)}</p>` : ""}
      </section>
    `;
  }

  const mediaItems = Array.isArray(block.items) ? block.items : [];
  const body = Array.isArray(block.body) ? block.body : [];

  return `
    <section id="${id}" class="content-block ${mediaItems.length ? "feature-block" : "text-block"}">
      <div class="content-copy">
        ${block.eyebrow ? `<p class="content-eyebrow">${escapeHTML(block.eyebrow)}</p>` : ""}
        ${block.title ? `<h2>${escapeHTML(block.title)}</h2>` : ""}
        ${body.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      </div>
      ${mediaItems.length ? `
        <div class="content-media-grid">
          ${mediaItems.map(renderMediaItem).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderContent(project) {
  const contentEl = document.getElementById("project-content");
  if (!contentEl) return;

  const content = getDetail(project).content || [];
  contentEl.innerHTML = content.map((block, i) => renderContentBlock(block, i)).join("");
}

function renderProject() {
  const project = getProject();
  if (!project) return;

  const detail = getDetail(project);

  document.title = `Dayna Son - ${project.title}`;
  setText("project-title", project.title);

  const statement = document.getElementById("project-statement");
  if (statement) statement.innerHTML = detail.statement || "";

  renderIndex(project);
  renderHero(project);
  renderContent(project);
}

renderProject();
