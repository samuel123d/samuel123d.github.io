document.addEventListener("DOMContentLoaded", () => {
  // Registrar ScrollTrigger do GSAP se disponível
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Cursor Personalizado Interativo
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  const bgGlow = document.getElementById("bgGlow");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (header && menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    siteNav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  }
  const hoverTargets = document.querySelectorAll(".hover-target, a, button");

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }
    if (bgGlow) {
      bgGlow.style.left = `${mouseX}px`;
      bgGlow.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    if (follower) {
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Reação ao passar o cursor
  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      document.body.classList.add("hovered");
    });
    target.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovered");
    });
  });

  // 2. Interatividade do Mouse com Títulos e Parágrafos (.interactive-text)
  const interactiveTexts = document.querySelectorAll(".interactive-text");
  interactiveTexts.forEach((text) => {
    text.addEventListener("mouseenter", () => {
      text.classList.add("text-hovered");
    });
    text.addEventListener("mouseleave", () => {
      text.classList.remove("text-hovered");
    });
  });

  // 3. Efeito Parallax de Scroll AMPLIFICADO (Baseado no centro do Viewport)
  const parallaxElements = document.querySelectorAll(".parallax-element");

  function updateScrollParallax() {
    const windowCenter = window.innerHeight / 2;

    parallaxElements.forEach((el) => {
      const baseSpeed = parseFloat(el.getAttribute("data-speed")) || 0.2;
      const isMobileTrajectory = window.matchMedia("(max-width: 600px)").matches && el.classList.contains("trajectory-card");
      const speed = isMobileTrajectory ? baseSpeed * 0.3 : baseSpeed;
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      
      const distanceFromCenter = elementCenter - windowCenter;
      const yPos = distanceFromCenter * speed * -1;

      const isActiveTrajectory = isMobileTrajectory && el.classList.contains("is-active");
      el.style.transform = `translate3d(0, ${yPos - (isActiveTrajectory ? 8 : 0)}px, 0) scale(${isActiveTrajectory ? 1.01 : 1})`;
    });
  }

  window.addEventListener("scroll", updateScrollParallax);
  updateScrollParallax(); // Executa ao carregar

  // 4. Parallax 3D com Mouse Intensificado na Imagem do Hero
  const heroImg = document.querySelector(".hero-img");
  const heroContainer = document.getElementById("heroImageContainer");

  if (heroContainer && heroImg) {
    heroContainer.addEventListener("mousemove", (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 20;
      const rotateY = (x / (rect.width / 2)) * 20;

      heroImg.style.transform = `perspective(800px) translate3d(${x * 0.15}px, ${y * 0.15}px, 30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroContainer.addEventListener("mouseleave", () => {
      heroImg.style.transform = `perspective(800px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)`;
    });
  }

  // 5. Parallax 3D Tilt ao passar o mouse em CARDS (Jornada, Projetos, Arquivo, Jornal e Tecnologias)
  const tiltCards = document.querySelectorAll(".trajectory-card, .project-card, .archive-card, .news-paper, .tech-card");
  const trajectoryCards = document.querySelectorAll(".trajectory-card");

  const bringTrajectoryCardForward = (activeCard) => {
    trajectoryCards.forEach((card) => card.classList.toggle("is-active", card === activeCard));
    updateScrollParallax();
  };

  trajectoryCards.forEach((card) => {
    card.addEventListener("mouseenter", () => bringTrajectoryCardForward(card));
    card.addEventListener("pointerdown", () => bringTrajectoryCardForward(card));
    card.addEventListener("focusin", () => bringTrajectoryCardForward(card));
  });

  enhanceAboutSection();
  
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.matchMedia("(max-width: 600px)").matches && card.classList.contains("trajectory-card")) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 14;

      card.style.transform = `perspective(1000px) translate3d(${x * 0.08}px, ${y * 0.08}px, 20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      if (window.matchMedia("(max-width: 600px)").matches && card.classList.contains("trajectory-card")) {
        card.style.transform = "";
        return;
      }
      card.style.transform = `perspective(1000px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)`;
    });
  });

  // 6. Efeito GSAP de entrada/rolagem nos Cards de Tecnologias
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.from(".tech-card", {
      scrollTrigger: {
        trigger: "#tech",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out"
    });
  }

  // 7. Ocultar Loader
  const loader = document.querySelector(".loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
    }, 400);
  });

  // 8. Smooth Scroll com Lenis
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 9. Inicializar Partículas Tech Flutuantes de Fundo
  initTechParticles();
  initGithubCarousel();
});

// 10. Seleção de Cards no Carrossel Infinito
function selectArchiveCard(cardElement) {
  const allCards = document.querySelectorAll(".archive-card");
  allCards.forEach((c) => c.classList.remove("selected-card"));
  cardElement.classList.add("selected-card");
}

function enhanceAboutSection() {
  const aboutSection = document.getElementById("about");
  const aboutText = aboutSection?.querySelector(".about-text");
  if (!aboutSection || !aboutText) return;

  aboutText.textContent = "Sou Samuel Anderson, desenvolvedor e analista de sistemas do Brasil. No GitHub, concentro meus estudos e projetos em JavaScript, Node.js, TypeScript, React, MySQL, Nginx e Git. Meus repositórios reúnem interfaces web, aplicações com autenticação, APIs e servidores, calculadoras e projetos acadêmicos. É assim que venho aprendendo: criando, publicando e evoluindo soluções na prática.";
}

async function initGithubCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  try {
    const response = await fetch("https://api.github.com/users/samuel123d/repos?per_page=100&sort=updated");
    if (!response.ok) throw new Error("Não foi possível carregar os repositórios.");

    const repositories = (await response.json())
      .filter((repository) => !repository.fork && !repository.archived);

    if (!repositories.length) throw new Error("Nenhum repositório público encontrado.");

    track.replaceChildren(...repositories.map((repository, index) => createRepositoryCard(repository, index)));
    initArchiveCarouselDrag(repositories.length);
  } catch (error) {
    console.warn(error.message);
    initArchiveCarouselDrag(4);
  }
}

function createRepositoryCard(repository, index) {
  const card = document.createElement("a");
  card.className = "archive-card repo-card hover-target";
  card.href = repository.html_url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("aria-label", `Abrir o repositório ${repository.name} no GitHub`);

  const badge = document.createElement("div");
  badge.className = "card-header-badge";
  badge.textContent = `REPOSITÓRIO #${String(index + 1).padStart(2, "0")}`;

  const title = document.createElement("h3");
  title.className = "interactive-text";
  title.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "interactive-text";
  description.textContent = repository.description || "Repositório público no GitHub.";

  const media = document.createElement("div");
  media.className = "archive-media repo-media";
  const image = document.createElement("img");
  image.src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  image.alt = "GitHub";
  image.loading = "lazy";
  media.appendChild(image);

  const footer = document.createElement("span");
  footer.className = "repo-link";
  footer.textContent = `${repository.language || "Código"} · Abrir repositório ↗`;

  card.append(badge, title, description, media, footer);
  return card;
}

function initArchiveCarouselDrag(sourceCardCount) {
  const wrapper = document.querySelector(".carousel-wrapper");
  const track = document.getElementById("carouselTrack");
  if (!wrapper || !track) return;

  // Mantém duas sequências exatamente iguais: uma termina onde a outra começa.
  const originalCards = Array.from(track.children).slice(0, sourceCardCount);
  while (track.children.length > originalCards.length) {
    track.removeChild(track.lastElementChild);
  }
  originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));

  const getLoopDistance = () => {
    const firstRepeatedCard = track.children[originalCards.length];
    return firstRepeatedCard ? firstRepeatedCard.offsetLeft : 0;
  };

  let loopDistance = 0;
  const updateLoopDistance = () => {
    loopDistance = getLoopDistance();
    if (loopDistance) track.style.setProperty("--carousel-loop-distance", `-${loopDistance}px`);
  };

  updateLoopDistance();
  window.addEventListener("resize", updateLoopDistance);

  let startX = 0;
  let startPosition = 0;
  let currentPosition = 0;
  let isDragging = false;
  let hasDragged = false;
  let isPointerCaptured = false;

  const getTrackPosition = () => {
    const transform = getComputedStyle(track).transform;
    if (!transform || transform === "none") return 0;
    return new DOMMatrixReadOnly(transform).m41;
  };

  const normalizePosition = (position) => {
    if (!loopDistance) return position;
    return ((position % loopDistance) + loopDistance) % loopDistance - loopDistance;
  };

  const resumeFrom = (position) => {
    if (!loopDistance) return;

    const normalizedPosition = normalizePosition(position);
    const speed = loopDistance / 55;
    track.style.transform = "";
    track.style.animationDelay = `${normalizedPosition / speed}s`;
  };

  wrapper.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    startX = event.clientX;
    startPosition = getTrackPosition();
    currentPosition = startPosition;
    isDragging = true;
    hasDragged = false;
    track.style.transform = `translateX(${currentPosition}px)`;
    wrapper.classList.add("is-dragging");
  });

  wrapper.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const distance = event.clientX - startX;
    if (Math.abs(distance) > 5) {
      hasDragged = true;
      if (!isPointerCaptured) {
        wrapper.setPointerCapture(event.pointerId);
        isPointerCaptured = true;
      }
    }
    currentPosition = normalizePosition(startPosition + distance);
    track.style.transform = `translateX(${currentPosition}px)`;
  });

  const finishDrag = (event) => {
    if (!isDragging) return;

    isDragging = false;
    resumeFrom(currentPosition);
    wrapper.classList.remove("is-dragging");
    if (isPointerCaptured && wrapper.hasPointerCapture(event.pointerId)) {
      wrapper.releasePointerCapture(event.pointerId);
    }
    isPointerCaptured = false;
  };

  wrapper.addEventListener("pointerup", finishDrag);
  wrapper.addEventListener("pointercancel", finishDrag);
  wrapper.addEventListener("click", (event) => {
    if (!hasDragged) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    hasDragged = false;
  }, true);
}

// 11. Sistema de Partículas e Códigos Flutuantes Interativos no Fundo
function initTechParticles() {
  const container = document.getElementById("particlesContainer");
  if (!container) return;

  const techSymbols = [
    "<code />", "01101001", "{...}", "const dev = true;", 
    "import AI", "C++", "System.out.println();", "git push", 
    "React", "async/await", "01001", "function()", 
    "</>", "=>", "Gemini.api", "npm run dev", "[ ]"
  ];

  const particleCount = 28;
  const particles = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement("span");
    el.className = "tech-particle" + (i % 3 === 0 ? " alt-color" : "");
    el.textContent = techSymbols[Math.floor(Math.random() * techSymbols.length)];
    
    const size = Math.random() * 12 + 12;
    el.style.fontSize = `${size}px`;

    container.appendChild(el);

    particles.push({
      element: el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      offsetX: 0,
      offsetY: 0
    });
  }

  function animateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -100) p.x = window.innerWidth + 50;
      if (p.x > window.innerWidth + 100) p.x = -50;
      if (p.y < -50) p.y = window.innerHeight + 50;
      if (p.y > window.innerHeight + 50) p.y = -50;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        const angle = Math.atan2(dy, dx);
        
        p.offsetX += Math.cos(angle) * force * 4;
        p.offsetY += Math.sin(angle) * force * 4;
      }

      p.offsetX *= 0.92;
      p.offsetY *= 0.92;

      const finalX = p.x + p.offsetX;
      const finalY = p.y + p.offsetY;

      p.element.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  window.addEventListener("resize", () => {
    particles.forEach((p) => {
      if (p.x > window.innerWidth) p.x = Math.random() * window.innerWidth;
      if (p.y > window.innerHeight) p.y = Math.random() * window.innerHeight;
    });
  });
}
