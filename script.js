/* ============================================
   PIKACHU — Electric Meme Coin
   Vanilla JS · No frameworks
   ============================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- About timeline: charge once on hover, stay forever ---------- */
  document.querySelectorAll(".timeline-card-hot").forEach(function (card) {
    card.addEventListener(
      "pointerenter",
      function () {
        card.classList.add("is-charged");
      },
      { once: true }
    );
  });

  /* ---------- Active section highlighting ---------- */
  const sectionIds = ["home", "about", "narrative", "tokenomics", "game", "community"];
  const sectionEls = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  const navAnchors = document.querySelectorAll(".nav-links a[data-section]");

  function setActiveNav(id) {
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-section") === id);
    });
  }

  if ("IntersectionObserver" in window && sectionEls.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sectionEls.forEach(function (el) {
      navObserver.observe(el);
    });
  }

  /* ---------- Bidirectional scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  let lastScrollY = window.scrollY || 0;
  let scrollDir = "down";

  function updateScrollDir() {
    const y = window.scrollY || 0;
    if (Math.abs(y - lastScrollY) < 2) return;
    scrollDir = y > lastScrollY ? "down" : "up";
    lastScrollY = y;
    document.body.dataset.scrollDir = scrollDir;
  }

  window.addEventListener("scroll", updateScrollDir, { passive: true });
  updateScrollDir();

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
      el.classList.remove("reveal-from-top");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const el = entry.target;
          if (entry.isIntersecting) {
            if (scrollDir === "up") {
              el.classList.add("reveal-from-top");
            } else {
              el.classList.remove("reveal-from-top");
            }
            // Force reflow so the "from" transform applies before becoming visible
            void el.offsetWidth;
            el.classList.add("visible");
          } else {
            el.classList.remove("visible");
            // Prepare next entrance based on where the element exited
            if (entry.boundingClientRect.top > 0) {
              // Left toward bottom → next enter while scrolling down from below
              el.classList.remove("reveal-from-top");
            } else {
              // Left toward top → next enter while scrolling up from above
              el.classList.add("reveal-from-top");
            }
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Section scroll polish (up & down) ---------- */
  const scrollSections = document.querySelectorAll("main > section");
  if (!prefersReducedMotion && "IntersectionObserver" in window && scrollSections.length) {
    scrollSections.forEach(function (section) {
      section.classList.add("scroll-section");
    });

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const section = entry.target;
          if (entry.isIntersecting) {
            section.classList.toggle("scroll-down", scrollDir === "down");
            section.classList.toggle("scroll-up", scrollDir === "up");
            section.style.setProperty(
              "--scroll-progress",
              String(Math.min(1, Math.max(0, entry.intersectionRatio)))
            );
          }
        });
      },
      { threshold: [0.15, 0.35, 0.55, 0.75] }
    );

    scrollSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Header react on scroll direction ---------- */
  const siteHeader = document.querySelector(".site-header");
  const mobileNavMq = window.matchMedia("(max-width: 980px)");
  if (siteHeader && !prefersReducedMotion) {
    let headerTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (headerTicking) return;
        headerTicking = true;
        requestAnimationFrame(function () {
          const y = window.scrollY || 0;
          siteHeader.classList.toggle("header-scrolled", y > 24);
          if (mobileNavMq.matches) {
            siteHeader.classList.remove("header-hide");
            siteHeader.classList.add("header-show");
          } else {
            siteHeader.classList.toggle("header-hide", scrollDir === "down" && y > 180);
            siteHeader.classList.toggle("header-show", scrollDir === "up" || y <= 180);
          }
          headerTicking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Hero particles ---------- */
  const particlesHost = document.getElementById("heroParticles");

  function spawnParticles() {
    if (!particlesHost || prefersReducedMotion) return;
    const count = window.innerWidth < 700 ? 14 : 28;
    particlesHost.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = -(Math.random() * 40) + "%";
      p.style.animationDuration = 6 + Math.random() * 10 + "s";
      p.style.animationDelay = Math.random() * 8 + "s";
      p.style.opacity = String(0.35 + Math.random() * 0.55);
      const size = 4 + Math.random() * 7;
      p.style.width = size + "px";
      p.style.height = size + "px";
      particlesHost.appendChild(p);
    }
  }

  spawnParticles();
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(spawnParticles, 250);
  });

  /* ---------- Contract copy ---------- */
  const copyBtn = document.getElementById("copyContract");
  const contractEl = document.getElementById("contractAddress");
  const copyToast = document.getElementById("copyToast");

  function showToast(msg) {
    if (!copyToast) return;
    copyToast.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      copyToast.textContent = "";
    }, 2200);
  }

  if (copyBtn && contractEl) {
    copyBtn.addEventListener("click", async function () {
      const value = (contractEl.textContent || "").trim();
      if (!value || value.toUpperCase() === "COMING SOON" || value.toUpperCase() === "TBA") {
        showToast("CONTRACT NOT LIVE YET ⚡");
        return;
      }
      try {
        await navigator.clipboard.writeText(value);
        showToast("COPIED ⚡");
      } catch (err) {
        showToast("COPY FAILED — SELECT MANUALLY");
      }
    });
  }

  /* ============================================
     MINI GAME — Catch the Sparks
     ============================================ */

  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");
  const scoreEl = document.getElementById("gameScore");
  const bestEl = document.getElementById("gameBest");
  const missesEl = document.getElementById("gameMisses");
  const maxMissesEl = document.getElementById("maxMisses");
  const overlay = document.getElementById("gameOverlay");
  const overlayTitle = document.getElementById("gameOverlayTitle");
  const overlayMsg = document.getElementById("gameOverlayMsg");
  const startBtn = document.getElementById("gameStartBtn");
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");

  if (!gameArea || !player || !startBtn) return;

  const BEST_KEY = "pikachu_best_score";
  const MAX_MISSES = 5;
  if (maxMissesEl) maxMissesEl.textContent = String(MAX_MISSES);

  let bestScore = 0;
  try {
    bestScore = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch (e) {
    bestScore = 0;
  }
  if (bestEl) bestEl.textContent = String(bestScore);

  const state = {
    running: false,
    score: 0,
    misses: 0,
    playerX: 0.5,
    keys: { left: false, right: false },
    mouseActive: false,
    touchDragging: false,
    sparks: [],
    lastSpawn: 0,
    spawnInterval: 900,
    speed: 2.2,
    raf: null,
    lastTs: 0,
  };

  function setHud() {
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (missesEl) missesEl.textContent = String(state.misses);
    if (bestEl) bestEl.textContent = String(bestScore);
  }

  function clearSparks() {
    state.sparks.forEach(function (s) {
      if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
    });
    state.sparks = [];
  }

  function placePlayer() {
    const areaW = gameArea.clientWidth;
    const pw = player.offsetWidth || 78;
    const x = state.playerX * (areaW - pw);
    player.style.left = x + "px";
    player.style.transform = "none";
  }

  function setPlayerFromClientX(clientX) {
    const rect = gameArea.getBoundingClientRect();
    const pw = player.offsetWidth || 78;
    const localX = clientX - rect.left - pw / 2;
    const maxX = Math.max(1, rect.width - pw);
    state.playerX = Math.max(0, Math.min(1, localX / maxX));
    placePlayer();
  }

  function showOverlay(title, msg, btnLabel) {
    if (overlayTitle) overlayTitle.textContent = title;
    if (overlayMsg) overlayMsg.textContent = msg;
    startBtn.textContent = btnLabel || "START GAME";
    startBtn.setAttribute("aria-label", btnLabel || "Start game");
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function spawnSpark() {
    const el = document.createElement("div");
    el.className = "spark-item";
    el.textContent = "⚡";
    el.setAttribute("aria-hidden", "true");
    const areaW = gameArea.clientWidth;
    const size = 22;
    const x = Math.random() * Math.max(8, areaW - size - 8);
    el.style.left = x + "px";
    el.style.top = "-28px";
    gameArea.appendChild(el);
    state.sparks.push({
      el: el,
      x: x,
      y: -28,
      speed: state.speed + Math.random() * 1.4,
      size: size,
    });
  }

  function endGame() {
    state.running = false;
    state.mouseActive = false;
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = null;
    }
    if (state.score > bestScore) {
      bestScore = state.score;
      try {
        localStorage.setItem(BEST_KEY, String(bestScore));
      } catch (e) {
        /* ignore quota / private mode */
      }
    }
    setHud();
    showOverlay(
      "CHARGE DEPLETED!",
      "You scored " + state.score + " sparks. Best: " + bestScore + ".",
      "RESTART"
    );
  }

  function collide(spark) {
    const areaRect = gameArea.getBoundingClientRect();
    const pRect = player.getBoundingClientRect();
    const sx = areaRect.left + spark.x;
    const sy = areaRect.top + spark.y;
    const pad = 8;
    return !(
      sx + spark.size < pRect.left + pad ||
      sx > pRect.right - pad ||
      sy + spark.size < pRect.top + pad ||
      sy > pRect.bottom - pad
    );
  }

  function tick(ts) {
    if (!state.running) return;
    if (!state.lastTs) state.lastTs = ts;
    const dt = Math.min(32, ts - state.lastTs);
    state.lastTs = ts;

    const areaH = gameArea.clientHeight;
    const move = (0.0045 * dt) / 16;

    if (!state.mouseActive) {
      if (state.keys.left) state.playerX -= move;
      if (state.keys.right) state.playerX += move;
      state.playerX = Math.max(0, Math.min(1, state.playerX));
      placePlayer();
    }

    if (ts - state.lastSpawn > state.spawnInterval) {
      spawnSpark();
      state.lastSpawn = ts;
      state.spawnInterval = Math.max(420, 900 - state.score * 12);
      state.speed = Math.min(5.5, 2.2 + state.score * 0.05);
    }

    for (let i = state.sparks.length - 1; i >= 0; i--) {
      const spark = state.sparks[i];
      spark.y += (spark.speed * dt) / 16;
      spark.el.style.top = spark.y + "px";

      if (collide(spark)) {
        state.score += 1;
        setHud();
        if (spark.el.parentNode) spark.el.parentNode.removeChild(spark.el);
        state.sparks.splice(i, 1);
        continue;
      }

      if (spark.y > areaH) {
        state.misses += 1;
        setHud();
        if (spark.el.parentNode) spark.el.parentNode.removeChild(spark.el);
        state.sparks.splice(i, 1);
        if (state.misses >= MAX_MISSES) {
          endGame();
          return;
        }
      }
    }

    state.raf = requestAnimationFrame(tick);
  }

  function startGame() {
    clearSparks();
    state.running = true;
    state.score = 0;
    state.misses = 0;
    state.playerX = 0.5;
    state.keys.left = false;
    state.keys.right = false;
    state.mouseActive = false;
    state.touchDragging = false;
    state.lastSpawn = 0;
    state.spawnInterval = 900;
    state.speed = 2.2;
    state.lastTs = 0;
    setHud();
    hideOverlay();
    placePlayer();
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(tick);
  }

  startBtn.addEventListener("click", startGame);

  function onKey(e, down) {
    const key = e.key;
    if (key === "ArrowLeft" || key === "a" || key === "A") {
      state.keys.left = down;
      state.mouseActive = false;
      e.preventDefault();
    } else if (key === "ArrowRight" || key === "d" || key === "D") {
      state.keys.right = down;
      state.mouseActive = false;
      e.preventDefault();
    }
  }

  window.addEventListener("keydown", function (e) {
    onKey(e, true);
  });
  window.addEventListener("keyup", function (e) {
    onKey(e, false);
  });

  function bindHold(btn, dir) {
    if (!btn) return;
    const start = function (e) {
      e.preventDefault();
      state.mouseActive = false;
      state.keys[dir] = true;
    };
    const end = function (e) {
      e.preventDefault();
      state.keys[dir] = false;
    };
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointerleave", end);
    btn.addEventListener("pointercancel", end);
  }

  bindHold(btnLeft, "left");
  bindHold(btnRight, "right");

  gameArea.addEventListener("pointermove", function (e) {
    if (!state.running) return;
    // Mouse always; touch only while actively pressing inside the game
    if (e.pointerType === "touch" && e.buttons === 0 && !state.touchDragging) return;
    state.mouseActive = true;
    setPlayerFromClientX(e.clientX);
  });

  gameArea.addEventListener("pointerdown", function (e) {
    if (!state.running) return;
    if (e.pointerType === "touch") {
      state.touchDragging = true;
      try {
        gameArea.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    }
    state.mouseActive = true;
    setPlayerFromClientX(e.clientX);
  });

  function endTouchDrag(e) {
    if (e && e.pointerType === "touch") {
      state.touchDragging = false;
      try {
        gameArea.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    }
    if (!e || e.pointerType !== "mouse") {
      state.mouseActive = false;
    }
  }

  gameArea.addEventListener("pointerup", endTouchDrag);
  gameArea.addEventListener("pointercancel", endTouchDrag);
  gameArea.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "touch") return;
    state.mouseActive = false;
  });

  window.addEventListener("resize", function () {
    if (state.running) placePlayer();
  });

  // Initial player placement
  placePlayer();
})();
