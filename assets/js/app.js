const projects = window.PORTFOLIO_PROJECTS || [];

const pathTo = (file) => file;
const projectUrl = (slug) => `project.html?slug=${encodeURIComponent(slug)}`;

function visual(project, loading = "lazy") {
  if (project.image) {
    return `<div class="project-visual"><img src="${project.image}" alt="${project.imageAlt || ""}" loading="${loading}"></div>`;
  }
  return `<div class="project-visual case-map">
    <div class="case-map-head"><span>${project.industry}</span><span>${project.type}</span></div>
    <div class="case-map-body">
      <div class="case-map-point"><small>해결 과제</small><strong>${project.problems[0]}</strong></div>
      <div class="case-map-connector" aria-hidden="true"></div>
      <div class="case-map-point decision"><small>핵심 결정</small><strong>${project.decisions[0].decision}</strong></div>
    </div>
    <div class="case-map-foot"><span>${project.role}</span><span>${project.scope}</span></div>
  </div>`;
}

function projectRow(project, index) {
  return `<a class="featured-row reveal" href="${projectUrl(project.slug)}">
    ${visual(project)}
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

function featuredCollection(featured) {
  const [lead, ...rest] = featured;
  return `<a class="featured-lead" href="${projectUrl(lead.slug)}">${visual(lead, "eager")}<div class="featured-lead-copy"><div class="project-meta">${lead.industry}<br>${lead.period}<br>${lead.role}</div><div><h3>${lead.title}</h3><p>${lead.thesis}</p><span class="project-open">대표 사례 보기</span></div></div></a>
    <div class="work-index">${rest.map(p => `<a class="work-index-row" href="${projectUrl(p.slug)}"><span class="work-index-industry">${p.industry}</span><strong>${p.title}</strong><p>${p.thesis}</p><span class="work-index-open">프로젝트 보기</span></a>`).join("")}</div>`;
}

function renderHome() {
  const bySlug = slug => projects.find(p => p.slug === slug);
  const lead = bySlug("daekyo-korean");
  const selected = ["uplus-smart-consulting", "hana-capital", "avon-global"].map(bySlug).filter(Boolean);
  const operational = projects.filter(p => p.operational);
  document.querySelector("#home-lead-project").innerHTML = `<a class="journey-lead-case" href="${projectUrl(lead.slug)}">${visual(lead)}<div class="journey-case-copy"><div class="case-heading"><span>${lead.industry} · ${lead.period}</span><h3>${lead.title}</h3></div><dl><div><dt>문제</dt><dd>${lead.problems[0]}</dd></div><div><dt>내 역할</dt><dd>${lead.role}<br>${lead.scope}</dd></div><div><dt>핵심 결정</dt><dd>${lead.decisions[0].decision}</dd></div><div><dt>결과</dt><dd>${lead.impact[0]}</dd></div></dl><span class="case-link">프로젝트 상세 보기 →</span></div></a>`;
  document.querySelector("#home-selected-projects").innerHTML = selected.map((p, i) => `<a class="journey-case-row case-${i + 2}" href="${projectUrl(p.slug)}"><div class="case-row-no">0${i + 2}</div><div class="case-row-title"><span>${p.industry} · ${p.period}</span><h3>${p.title}</h3><p>${p.problems[0]}</p></div><div class="case-row-decision"><span>핵심 결정</span><strong>${p.decisions[0].decision}</strong></div><div class="case-row-role"><span>내 역할</span><p>${p.role}<br>${p.scope}</p></div><span class="case-row-open">→</span></a>`).join("");
  document.querySelector("#home-operations").innerHTML = operational.map(p => `<a class="operation-row" href="${projectUrl(p.slug)}"><time>${p.period}</time><h3>${p.title}</h3><span>${p.role}</span><p>${p.impact[0]}</p><b>→</b></a>`).join("");
}

function renderProjects() {
  const featured = projects.filter(p => p.featured);
  document.querySelector("#featured-list").innerHTML = featuredCollection(featured);
  const list = document.querySelector("#all-projects");
  const filters = document.querySelectorAll(".filter");
  const draw = (filter = "전체") => {
    const selected = filter === "전체" ? projects : projects.filter(p => p.industry.includes(filter));
    list.innerHTML = selected.map(p => `<a class="index-row" href="${projectUrl(p.slug)}">
      <strong>${p.title}</strong><span>${p.industry}</span><span>${p.role}</span><span>${p.period.split(" - ")[0]}</span>
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
  document.title = `${p.title} - 이서현 포트폴리오`;
  const process = p.process.map(item => `<article class="process-item"><h3>${item.label}</h3><p>${item.text}</p></article>`).join("");
  const decisions = p.decisions.map(item => `<div class="decision-row">
    <div class="decision-cell evidence"><span>확인한 근거</span><p>${item.evidence}</p></div>
    <div class="decision-cell decision"><span>내린 결정</span><p>${item.decision}</p></div>
    <div class="decision-cell application"><span>적용 범위</span><p>${item.application}</p></div>
  </div>`).join("");
  document.querySelector("main").innerHTML = `
    <section class="detail-hero container">
      <div class="detail-topline"><p class="eyebrow">${p.industry} / ${p.type}</p><div class="project-meta">${p.period}<br>${p.role}</div></div>
      <h1 class="detail-thesis">${p.thesis}</h1>
      <div class="detail-visual">${p.image ? `<img src="${p.image}" alt="${p.imageAlt || ""}">` : visual(p)}</div>
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
        <section class="case-section" id="overview"><h2>프로젝트 개요</h2><p>${p.overview}</p></section>
        <section class="case-section" id="problem"><h2>무엇을 해결해야 했는가</h2><ol class="problem-list">${p.problems.map(x => `<li>${x}</li>`).join("")}</ol></section>
        <section class="case-section" id="process"><h2>분석하고 구조화한 과정</h2><div class="process-grid">${process}</div></section>
        <section class="case-section" id="decisions"><h2>근거에서 화면까지</h2><div class="decision-table">${decisions}</div></section>
        <section class="case-section" id="impact"><h2>프로젝트를 통해 만든 변화</h2><ul class="impact-list">${p.impact.map(x => `<li>${x}</li>`).join("")}</ul></section>
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
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      document.body.classList.remove("menu-open");
      button?.setAttribute("aria-expanded", "false");
      if (button) button.textContent = "Menu";
      button?.focus();
    }
  });
  document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    button?.setAttribute("aria-expanded", "false");
  }));
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
