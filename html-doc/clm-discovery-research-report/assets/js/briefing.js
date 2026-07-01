/**
 * CLM Discovery research briefing — full-page deck controls
 * Navigation: ← → ↑ ↓  |  W A S D  |  Home End  |  1–9 jump  |  F fullscreen  |  ? help
 */
(function () {
  const deck = document.querySelector(".deck");
  const slidesEl = document.querySelector(".slides");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressBar = document.querySelector(".progress__bar");
  const indicator = document.querySelector(".slide-indicator");
  const dotsContainer = document.querySelector(".dots");
  const helpPanel = document.querySelector(".help-panel");
  const navBtns = {
    prev: document.querySelector('.bottomnav [data-action="prev"]'),
    next: document.querySelector('.bottomnav [data-action="next"]'),
    help: document.querySelector('.bottomnav [data-action="help"]'),
    fullscreen: document.querySelector('.bottomnav [data-action="fullscreen"]'),
  };

  let index = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function clamp(i) {
    return Math.max(0, Math.min(slides.length - 1, i));
  }

  function goTo(i) {
    index = clamp(i);
    slidesEl.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    indicator.innerHTML = `<strong>${index + 1}</strong> / ${slides.length}`;

    dotsContainer.querySelectorAll(".dot").forEach((dot, j) => {
      dot.classList.toggle("is-active", j === index);
      dot.setAttribute("aria-current", j === index ? "true" : "false");
    });

    slides.forEach((slide, j) => {
      slide.setAttribute("aria-hidden", j !== index ? "true" : "false");
    });

    history.replaceState(null, "", `#${index + 1}`);
    requestAnimationFrame(() => {
      fitActiveSlide();
      requestAnimationFrame(fitActiveSlide);
    });
  }

  /** Keep keyboard focus on the deck so nav buttons don't show a stale focus ring. */
  function focusDeck() {
    deck?.focus({ preventScroll: true });
  }

  function navActionForKey(key) {
    switch (key) {
      case "arrowright":
      case "arrowdown":
      case "d":
      case "s":
      case " ":
      case "pagedown":
        return "next";
      case "arrowleft":
      case "arrowup":
      case "w":
      case "a":
      case "pageup":
        return "prev";
      case "f":
        return "fullscreen";
      case "?":
        return "help";
      default:
        return null;
    }
  }

  function highlightNav(action) {
    navBtns[action]?.classList.add("is-key-press");
  }

  function unhighlightNav(action) {
    navBtns[action]?.classList.remove("is-key-press");
  }

  /**
   * Uniform content frame: scale the whole window down only when the viewport
   * is smaller than the frame — same rule for every slide.
   */
  function fitActiveSlide() {
    const slide = slides[index];
    const inner = slide?.querySelector(".slide__inner");
    if (!inner || !deck) return;

    inner.style.setProperty("--slide-scale", "1");
    inner.classList.remove("is-fit-content");
    inner.scrollTop = 0;

    const styles = getComputedStyle(document.documentElement);
    const chromeTop = parseFloat(styles.getPropertyValue("--chrome-top")) || 56;
    const chromeBottom = parseFloat(styles.getPropertyValue("--chrome-bottom")) || 72;
    const padX = parseFloat(getComputedStyle(slide).paddingLeft) || 56;

    const availW = deck.clientWidth - padX * 2;
    const availH = deck.clientHeight - chromeTop - chromeBottom;

    const rect = inner.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    let scale = Math.min(1, availW / rect.width, availH / rect.height);

    /* Slide 3: shrink to fit — no vertical scroll */
    if (inner.classList.contains("slide__inner--clm-rings")) {
      const fitH = inner.clientHeight / inner.scrollHeight;
      const fitW = inner.clientWidth / inner.scrollWidth;
      const contentFit = Math.min(1, fitH, fitW);
      if (contentFit < 1) {
        scale = Math.min(scale, contentFit);
        inner.classList.add("is-fit-content");
      }
    }

    inner.style.setProperty("--slide-scale", String(scale));
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitActiveSlide, 50);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        document.body.classList.toggle("fullscreen");
      });
    } else {
      document.exitFullscreen?.();
    }
  }

  function toggleHelp() {
    const open = helpPanel.classList.toggle("is-open");
    helpPanel.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function isTypingContext(el) {
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
  }

  document.addEventListener("keydown", (e) => {
    if (isTypingContext(e.target)) return;

    const key = e.key.toLowerCase();

    if (helpPanel.classList.contains("is-open") && key !== "?") {
      if (key === "escape") { toggleHelp(); e.preventDefault(); }
      return;
    }

    const navAction = navActionForKey(key);
    if (navAction) highlightNav(navAction);

    switch (key) {
      case "arrowright":
      case "arrowdown":
      case "d":
      case "s":
      case " ":
      case "pagedown":
        next();
        focusDeck();
        e.preventDefault();
        break;
      case "arrowleft":
      case "arrowup":
      case "w":
      case "a":
      case "pageup":
        prev();
        focusDeck();
        e.preventDefault();
        break;
      case "home":
        goTo(0);
        focusDeck();
        e.preventDefault();
        break;
      case "end":
        goTo(slides.length - 1);
        focusDeck();
        e.preventDefault();
        break;
      case "f":
        toggleFullscreen();
        e.preventDefault();
        break;
      case "?":
        toggleHelp();
        e.preventDefault();
        break;
      case "escape":
        if (document.fullscreenElement) document.exitFullscreen?.();
        else if (document.body.classList.contains("fullscreen")) document.body.classList.remove("fullscreen");
        break;
      default:
        if (/^[1-9]$/.test(key)) {
          const n = parseInt(key, 10) - 1;
          if (n < slides.length) {
            goTo(n);
            focusDeck();
          }
          e.preventDefault();
        }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (isTypingContext(e.target)) return;
    const navAction = navActionForKey(e.key.toLowerCase());
    if (navAction) unhighlightNav(navAction);
  });

  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("fullscreen", !!document.fullscreenElement);
    onResize();
  });

  dotsContainer.innerHTML = slides
    .map((_, i) => `<button type="button" class="dot${i === 0 ? " is-active" : ""}" aria-label="Slide ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`)
    .join("");

  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    goTo(Array.from(dotsContainer.children).indexOf(dot));
  });

  document.querySelector(".bottomnav")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    switch (btn.dataset.action) {
      case "prev": prev(); break;
      case "next": next(); break;
      case "fullscreen": toggleFullscreen(); break;
      case "help": toggleHelp(); break;
    }
  });

  deck?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  deck?.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  window.addEventListener("resize", onResize);

  const hash = parseInt(location.hash.replace("#", ""), 10);
  if (hash >= 1 && hash <= slides.length) index = hash - 1;
  goTo(index);
})();
