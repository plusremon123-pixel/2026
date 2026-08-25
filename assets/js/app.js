const projects = window.PORTFOLIO_PROJECTS || [];
const archiveProjects = window.PORTFOLIO_ARCHIVE || [];

const pathTo = (file) => file;
const projectUrl = (slug) => `project.html?slug=${encodeURIComponent(slug)}`;
const formatPeriod = (value = "") => String(value)
  .replace(/\s*~\s*/g, " – ")
  .replace(/(\d{4})[.-](\d{1,2})(?!\d)/g, (_, year, month) => `${year}.${month.padStart(2, "0")}`);

function visual(project, loading = "lazy") {
  if (project.image) {
    return `<div class="project-visual"><img src="${project.image}" alt="${project.imageAlt || ""}" loading="${loading}"></div>`;
  }
  const rates = [...String(project.scope || "").matchAll(/(\d{1,3})\s*%/g)].map(match => Number(match[1]));
  const contribution = Math.min(100, Math.max(0, rates.length ? Math.max(...rates) : 100));
  return `<div class="project-visual case-map">
    <div class="case-map-head"><div><small>프로젝트 유형</small><strong>${project.industry} · ${project.type}</strong></div><div><small>기간</small><strong>${project.period}</strong></div></div>
    <div class="case-map-body">
      <div class="case-map-point"><small>해결 과제</small><strong>${project.problems[0]}</strong></div>
      <div class="case-map-connector" aria-hidden="true"></div>
      <div class="case-map-point decision"><small>핵심 결정</small><strong>${project.decisions[0].decision}</strong></div>
    </div>
    <div class="case-map-foot">
      <div class="case-map-role"><small>담당 역할</small><strong>${project.role}</strong></div>
      <div class="case-map-contribution" style="--contribution:${contribution}%" aria-label="대표 참여 범위 ${contribution}%">
        <span class="contribution-ring" aria-hidden="true"><b>${contribution}%</b></span>
        <div><small>대표 참여 범위</small><strong>${project.scope}</strong></div>
      </div>
    </div>
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
  const operational = projects.filter(p => p.operational);
  const companyOrder = ["LG U+", "대교", "웅진씽크빅", "현대자동차", "하나캐피탈", "LG생활건강 · Avon", "한화생명", "서울시", "한국식품산업클러스터진흥원", "강남시설관리공단"];
  const companyNames = { "LG생활건강 · Avon": "Avon · LG생활건강", "한국식품산업클러스터진흥원": "한국식품산업클러스터", "강남시설관리공단": "강남시설관리공단" };
  const grouped = companyOrder.map(client => ({ client, items: projects.filter(p => p.client === client) })).filter(group => group.items.length);
  document.querySelector("#home-company-projects").innerHTML = grouped.map((group, index) => `<article class="company-project-row">
    <div class="company-wordmark"><span>${String(index + 1).padStart(2, "0")}</span><strong>${companyNames[group.client] || group.client}</strong></div>
    <div class="company-project-links">${group.items.map(p => `<a href="${projectUrl(p.slug)}"><span>${p.industry} · ${p.period}</span><b>${p.title}</b><i>→</i></a>`).join("")}</div>
  </article>`).join("");
  document.querySelector("#home-operations").innerHTML = operational.map(p => `<a class="operation-row" href="${projectUrl(p.slug)}"><time>${p.period}</time><h3>${p.title}</h3><span>${p.role}</span><p>${p.impact[0]}</p><b>→</b></a>`).join("");
}

function renderProjects() {
  const featured = projects.filter(p => p.featured);
  document.querySelector("#featured-list").innerHTML = featuredCollection(featured);
  const list = document.querySelector("#all-projects");
  const filters = document.querySelectorAll(".filter");
  const count = document.querySelector("#project-count");
  const detailByArchiveTitle = {
    "웅진씽크빅 스마트올, 씽크빅 운영": "woongjin-smartall",
    "현대 핵심가치 사이트 운영/리뉴얼 구축": "hyundai-motor-operation",
    "현대자동차 울산문화센터 사이트 운영": "hyundai-motor-operation",
    "대교 눈높이 국어 리뉴얼": "daekyo-korean",
    "식품산업 비즈니스 플랫폼": "food-business-platform",
    "U+고객센터앱 운영": "uplus-customer-center",
    "하나캐피탈 앱 리뉴얼": "hana-capital",
    "미국 화장품 회사 Avon.com 통합 리뉴얼": "avon-global",
    "스마트상담/스마트가입 웹 서비스 리뉴얼": "uplus-smart-consulting",
    "보험월렛 2.0 고도화 프로젝트": "insurance-wallet",
    "강남시설관리공단 홈페이지 리뉴얼": "gangnam-facility",
    "서울시민카드 App 구축": "seoul-citizen-card"
  };
  let activeFilter = "전체";
  const draw = () => {
    const filtered = activeFilter === "전체" ? archiveProjects : archiveProjects.filter(p => p.industry.includes(activeFilter));
    const selected = filtered;
    const detailedCount = selected.filter(p => detailByArchiveTitle[p.title]).length;
    count.textContent = `${selected.length}개의 경력 기록 · 상세 사례 ${detailedCount}개`;
    list.innerHTML = selected.map(p => {
      const slug = detailByArchiveTitle[p.title];
      const tag = slug ? "a" : "div";
      const link = slug ? ` href="${projectUrl(slug)}"` : "";
      return `<${tag} class="index-row${slug ? " has-detail" : " archive-only"}"${link}>
        <strong><small>${p.client}</small>${p.title}</strong><span data-label="산업">${p.industry}</span><span data-label="참여 범위">${p.rate || "경력 기록"}</span><span data-label="기간">${formatPeriod(p.period)}</span>
      </${tag}>`;
    }).join("") || `<p class="empty-state">이 분류에 등록된 프로젝트가 없습니다.</p>`;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    draw();
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
  const currentIndex = projects.findIndex(item => item.slug === p.slug);
  const previous = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
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
      <div class="detail-visual${p.image ? "" : " is-map"}">${p.image ? `<img src="${p.image}" alt="${p.imageAlt || ""}">` : visual(p)}</div>
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
        <nav class="project-sequence" aria-label="다른 프로젝트 보기">
          ${previous ? `<a class="sequence-project previous" href="${projectUrl(previous.slug)}"><span>이전 프로젝트</span><strong>← ${previous.title}</strong></a>` : `<span class="sequence-project is-empty" aria-hidden="true"></span>`}
          <a class="sequence-all" href="projects.html"><span>Project archive</span><strong>57개 프로젝트 전체 보기</strong></a>
          ${next ? `<a class="sequence-project next" href="${projectUrl(next.slug)}"><span>다음 프로젝트</span><strong>${next.title} →</strong></a>` : `<span class="sequence-project is-empty" aria-hidden="true"></span>`}
        </nav>
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
