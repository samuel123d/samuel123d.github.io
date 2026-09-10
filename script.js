document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const loader = document.querySelector(".loader");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  const closeMenu = () => {
    if (!header || !menuToggle) return;
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };
  if (header && menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    siteNav.addEventListener("click", (event) => event.target.closest("a") && closeMenu());
    document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());
    document.addEventListener("click", (event) => header.classList.contains("menu-open") && !header.contains(event.target) && closeMenu());
    addEventListener("resize", () => innerWidth > 900 && closeMenu(), { passive: true });
  }
  addEventListener("load", () => setTimeout(() => {
    loader?.classList.add("hidden");
    document.body.classList.replace("is-loading", "is-ready");
  }, 250), { once: true });
  enhanceAboutSection();
  initSectionNavigation();
  initSectionReveal(reducedMotion.matches);
  initGithubCarousel();
  if (!reducedMotion.matches && finePointer.matches) initDesktopEffects();
  if (!reducedMotion.matches && innerWidth > 900) initTechParticles();
});

function initSectionNavigation() {
  const links = [...document.querySelectorAll(".site-nav a[href^='#']")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;
  const linkById = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    links.forEach((link) => link.classList.toggle("is-current", link === linkById.get(current.target.id)));
  }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.2, 0.5] });
  sections.forEach((section) => observer.observe(section));
}

function initSectionReveal(reducedMotion) {
  if (reducedMotion || !("IntersectionObserver" in window)) return;
  const sections = document.querySelectorAll(".section:not(.hero) .section-shell");
  sections.forEach((section) => section.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); instance.unobserve(entry.target); }
  }), { threshold: 0.08 });
  sections.forEach((section) => observer.observe(section));
}

function initDesktopEffects() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  const glow = document.getElementById("bgGlow");
  const parallax = [...document.querySelectorAll(".parallax-element")];
  let mx = innerWidth / 2, my = innerHeight / 2, fx = mx, fy = my, queued = false;
  document.addEventListener("pointermove", (event) => {
    mx = event.clientX; my = event.clientY;
    if (!queued) requestAnimationFrame(() => { queued = false; cursor?.style.setProperty("transform", `translate3d(${mx - 4}px,${my - 4}px,0)`); glow?.style.setProperty("transform", `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`); });
    queued = true;
  }, { passive: true });
  const follow = () => { fx += (mx - fx) * .16; fy += (my - fy) * .16; follower?.style.setProperty("transform", `translate3d(${fx - 18}px,${fy - 18}px,0)`); requestAnimationFrame(follow); };
  follow();
  const updateParallax = () => parallax.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    element.style.setProperty("--parallax-y", `${(rect.top + rect.height / 2 - innerHeight / 2) * (Number.parseFloat(element.dataset.speed) || .15) * -1}px`);
  });
  let scrolling = false;
  addEventListener("scroll", () => { if (!scrolling) requestAnimationFrame(() => { scrolling = false; updateParallax(); }); scrolling = true; }, { passive: true });
  updateParallax();
  document.querySelectorAll(".hover-target, a, button").forEach((target) => {
    target.addEventListener("pointerenter", () => document.body.classList.add("hovered"));
    target.addEventListener("pointerleave", () => document.body.classList.remove("hovered"));
  });
}

function enhanceAboutSection() {
  const text = document.querySelector("#about .about-text");
  if (text) text.textContent = "Sou Samuel Anderson, desenvolvedor e analista de sistemas do Brasil. No GitHub, concentro meus estudos e projetos em JavaScript, Node.js, TypeScript, React, MySQL e Git. Meus repositórios reúnem interfaces web, aplicações com autenticação, APIs e servidores, calculadoras e projetos acadêmicos. É assim que venho aprendendo: criando, publicando e evoluindo soluções na prática.";
}

async function initGithubCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  try {
    const response = await fetch("https://api.github.com/users/samuel123d/repos?per_page=24&sort=updated");
    if (!response.ok) throw new Error("GitHub indisponível");
    const repos = (await response.json()).filter((repo) => !repo.fork && !repo.archived).slice(0, 6);
    if (repos.length) {
      const cards = repos.map(createRepositoryCard);
      track.replaceChildren(...cards, ...cards.map((card) => card.cloneNode(true)));
    }
  } catch (error) { console.warn("Não foi possível atualizar os projetos do GitHub.", error); }
}

function createRepositoryCard(repo, index) {
  const card = document.createElement("a");
  card.className = "archive-card repo-card"; card.href = repo.html_url; card.target = "_blank"; card.rel = "noopener noreferrer";
  card.innerHTML = `<div class="card-header-badge">REPOSITÓRIO #${String(index + 1).padStart(2, "0")}</div><h3></h3><p></p><span class="repo-link"></span>`;
  card.querySelector("h3").textContent = repo.name;
  card.querySelector("p").textContent = repo.description || "Repositório público no GitHub.";
  card.querySelector(".repo-link").textContent = `${repo.language || "Código"} · Abrir repositório →`;
  return card;
}

function selectArchiveCard(card) {
  document.querySelectorAll(".archive-card").forEach((item) => item.classList.toggle("selected-card", item === card));
}

function initTechParticles() {
  const container = document.getElementById("particlesContainer");
  if (!container) return;
  const symbols = ["<code />", "{...}", "React", "async/await", "</>", "=>", "git push", "C++"];
  const particles = Array.from({ length: 10 }, (_, i) => {
    const element = document.createElement("span"); element.className = `tech-particle${i % 3 === 0 ? " alt-color" : ""}`; element.textContent = symbols[i % symbols.length]; container.appendChild(element);
    return { element, x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18 };
  });
  const animate = () => { particles.forEach((p) => { p.x = (p.x + p.vx + innerWidth) % innerWidth; p.y = (p.y + p.vy + innerHeight) % innerHeight; p.element.style.transform = `translate3d(${p.x}px,${p.y}px,0)`; }); requestAnimationFrame(animate); };
  animate();
}
