const projects = window.PORTFOLIO_PROJECTS || [];

const pathTo = (file) => file;
const projectUrl = (slug) => `project.html?slug=${encodeURIComponent(slug)}`;

function visual(project, dark = false) {
  if (project.image) {
    return `<div class="project-visual"><img src="${project.image}" alt="${project.imageAlt || ""}" loading="lazy"></div>`;
  }
  const tone = dark ? "dark" : project.industry.includes("금융") ? "blue" : "";
  return `<div class="project-visual" aria-hidden="true">
    <div class="visual-system ${tone}">
      <span class="system-label">${project.industry.toUpperCase()} / ${project.type.toUpperCase()}</span>
      <strong>${project.thesis}</strong>
      <div class="system-lines">
        <div class="system-line"><span>CONTEXT</span><i></i></div>
        <div class="system-line"><span>DECISION</span><i></i></div>
        <div class="system-line"><span>OUTCOME</span><i></i></div>
      </div>
    </div>
  </div>`;
}

function projectRow(project, index) {
  return `<a class="featured-row reveal" href="${projectUrl(project.slug)}">
    ${visual(project, index === 2)}
    <div class="project-copy">
      <div>
        <div class="project-meta">${project.industry} · ${project.period}<br>${project.role}</div>
        <h3>${project.title}</h3>
        <p class="project-thesis">${project.thesis}</p>
      </div>
      <span class="project-open">View case study</span>
    </div>
  </a>`;
}

function renderHome() {
  const featured = projects.filter(p => p.featured);
  const operational = projects.filter(p => p.operational);
  document.querySelector("#featured-list").innerHTML = featured.map(projectRow).join("");
  document.querySelector("#operational-grid").innerHTML = operational.map((p, i) => `
    <a class="operational-item reveal" href="${projectUrl(p.slug)}">
      <span class="op-index">OPERATION / 0${i + 1}</span>
      <h3>${p.title}</h3>
      <p>${p.overview}</p>
    </a>`).join("");
}

function renderProjects() {
  const featured = projects.filter(p => p.featured);
  document.querySelector("#featured-list").innerHTML = featured.map(projectRow).join("");
  const list = document.querySelector("#all-projects");
  const filters = document.querySelectorAll(".filter");
  const draw = (filter = "전체") => {
    const selected = filter === "전체" ? projects : projects.filter(p => p.industry.includes(filter));
    list.innerHTML = selected.map(p => `<a class="index-row" href="${projectUrl(p.slug)}">
      <strong>${p.title}</strong><span>${p.industry}</span><span>${p.role}</span><span>${p.period.split(" — ")[0]}</span>
    </a>`).join("") || `<p class="empty-state">이 분류에 등록된 프로젝트가 없습니다.</p>`;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    draw(button.dataset.filter);
  }));
  draw();
}

function renderDetail() {
  const slug = new URLSearchParams(location.search).get("slug") || projects[0]?.slug;
  const p = projects.find(item => item.slug === slug);
  if (!p) {
    document.querySelector("main").innerHTML = `<div class="container page-hero"><h1 class="page-title">프로젝트를 찾을 수 없습니다.</h1><a class="text-link" href="projects.html">Projects로 돌아가기</a></div>`;
    return;
  }
  document.title = `${p.title} — 이서현 포트폴리오`;
  const process = p.process.map((item, i) => `<article class="process-item"><span>0${i+1} / ${item.label}</span><p>${item.text}</p></article>`).join("");
  const decisions = p.decisions.map((item, i) => `<div class="decision-row">
    <div class="decision-cell"><span>EVIDENCE 0${i+1}</span>${item.evidence}</div>
    <div class="decision-cell"><span>DECISION</span>${item.decision}</div>
    <div class="decision-cell"><span>APPLICATION</span>${item.application}</div>
  </div>`).join("");
  document.querySelector("main").innerHTML = `
    <section class="detail-hero container">
      <div class="detail-topline"><p class="eyebrow">${p.industry} / ${p.type}</p><div class="project-meta">${p.period}<br>${p.role}</div></div>
      <h1 class="detail-thesis">${p.thesis}</h1>
      <div class="detail-visual">${p.image ? `<img src="${p.image}" alt="${p.imageAlt || ""}">` : visual(p, p.slug === "avon-global").replace('class="project-visual"','class="project-visual"')}</div>
    </section>
    <div class="detail-layout container">
      <aside class="detail-rail"><div class="rail-inner">
        <dl class="fact-list">
          <div><dt>Project</dt><dd>${p.title}</dd></div><div><dt>Client</dt><dd>${p.client}</dd></div>
          <div><dt>Role</dt><dd>${p.role}</dd></div><div><dt>Scope</dt><dd>${p.scope}</dd></div>
        </dl>
        <nav class="decision-nav" aria-label="프로젝트 상세 목차">
          <a href="#overview">Overview</a><a href="#problem">Problem</a><a href="#process">Process</a><a href="#decisions">Decisions</a><a href="#impact">Impact</a>
        </nav>
      </div></aside>
      <article class="detail-content">
        <section class="case-section" id="overview"><p class="eyebrow">Project overview</p><h2>프로젝트 개요</h2><p>${p.overview}</p></section>
        <section class="case-section" id="problem"><p class="eyebrow">Context & problem</p><h2>무엇을 해결해야 했는가</h2><ol class="problem-list">${p.problems.map(x => `<li>${x}</li>`).join("")}</ol></section>
        <section class="case-section" id="process"><p class="eyebrow">Analysis & planning</p><h2>분석하고 구조화한 과정</h2><div class="process-grid">${process}</div></section>
        <section class="case-section" id="decisions"><p class="eyebrow">Decision log</p><h2>근거에서 화면까지</h2><div class="decision-table">${decisions}</div></section>
        <section class="case-section" id="impact"><p class="eyebrow">Outcome</p><h2>프로젝트를 통해 만든 변화</h2><ul class="impact-list">${p.impact.map(x => `<li>${x}</li>`).join("")}</ul><p class="case-note">${p.note}</p></section>
        <a class="text-link" href="projects.html">모든 프로젝트 보기</a>
      </article>
    </div>`;
  observeSections();
}

function observeSections() {
  const links = [...document.querySelectorAll(".decision-nav a")];
  if (!links.length) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  }), { rootMargin: "-20% 0px -65%", threshold: 0 });
  document.querySelectorAll(".case-section").forEach(section => observer.observe(section));
}

function initGlobal() {
  const button = document.querySelector(".menu-button");
  button?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Close" : "Menu";
  });
  const copy = document.querySelector(".copy-button");
  copy?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(copy.dataset.email);
    copy.textContent = "Copied";
    setTimeout(() => copy.textContent = "Copy email", 1600);
  });
  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); reveal.unobserve(e.target); }
  }), { threshold: .08 });
  document.querySelectorAll(".reveal").forEach(el => reveal.observe(el));
}

const page = document.body.dataset.page;
if (page === "home") renderHome();
if (page === "projects") renderProjects();
if (page === "detail") renderDetail();
initGlobal();
