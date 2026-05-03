document.addEventListener("DOMContentLoaded", () => {
  setupTopbar();
  setupDropdowns();
  setupInteractiveTokens();
  setupFocusMode();
  setupMicroFeedback();
  setupReveal();
});

function setupTopbar() {
  const topbar = document.getElementById("dashboardTopbar");
  const toggle = document.querySelector("[data-topbar-toggle]");

  if (toggle && topbar) {
    toggle.addEventListener("click", () => {
      const isOpen = topbar.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (topbar) {
    window.addEventListener("scroll", () => {
      topbar.classList.toggle("is-scrolled", window.scrollY > 24);
    });
  }
}

function setupDropdowns() {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");

  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute("data-dropdown-trigger");
    const panel = targetId ? document.getElementById(targetId) : trigger.closest(".topbar-dropdown")?.querySelector(".dropdown-panel");

    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    if (panel) {
      panel.setAttribute("role", "menu");
      panel.querySelectorAll("a, button, input, [tabindex]").forEach((item) => {
        if (!item.hasAttribute("role") && !item.matches("input")) item.setAttribute("role", "menuitem");
      });
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const container = trigger.closest(".topbar-dropdown");
      const target = targetId ? document.getElementById(targetId) : container?.querySelector(".dropdown-panel");
      const willOpen = !container?.classList.contains("is-open");

      closeDropdowns(container);
      container?.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));

      if (willOpen && target) {
        const firstFocusable = target.querySelector("input, a, button, [tabindex]:not([tabindex='-1'])");
        window.setTimeout(() => firstFocusable?.focus(), 70);
      }
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      trigger.click();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".topbar-dropdown")) return;
    closeDropdowns();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDropdowns();
  });

  window.addEventListener("scroll", () => closeDropdowns(), { passive: true });
}

function closeDropdowns(except = null) {
  document.querySelectorAll(".topbar-dropdown").forEach((item) => {
    if (item === except) return;
    item.classList.remove("is-open");
    item.querySelector("[data-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
  });
}

function setupInteractiveTokens() {
  const tokens = document.querySelectorAll(".chip, .mini-chip, .skill-chip, .chip-btn, .filter-pill");

  tokens.forEach((token) => {
    if (token.dataset.static === "true" || token.closest("a")) return;
    token.setAttribute("tabindex", token.getAttribute("tabindex") || "0");
    token.setAttribute("role", token.getAttribute("role") || "button");
    token.setAttribute("aria-pressed", token.classList.contains("is-selected") ? "true" : "false");

    const toggle = () => {
      const selected = token.classList.toggle("is-selected");
      token.setAttribute("aria-pressed", String(selected));
      token.classList.add("is-popping");
      window.setTimeout(() => token.classList.remove("is-popping"), 260);
    };

    token.addEventListener("click", toggle);
    token.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
}

function setupFocusMode() {
  const focusableSections = document.querySelectorAll(".hero-panel, .panel, .card, .stat-card, .feed-card, .passport-card, .project-card, .match-card, .wizard-card, .auth-card, .setup-card, .graph-card");
  if (!focusableSections.length) return;

  focusableSections.forEach((section) => {
    section.addEventListener("pointerenter", () => {
      document.body.classList.add("focus-mode");
      section.classList.add("is-focus-target");
    });

    section.addEventListener("pointerleave", () => {
      section.classList.remove("is-focus-target");
      if (!document.querySelector(".is-focus-target")) document.body.classList.remove("focus-mode");
    });
  });
}

function setupMicroFeedback() {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest("button, .main-link, .ghost-link, .action-btn, .chip, .mini-chip, .skill-chip, .chip-btn");
    if (!target) return;
    target.classList.add("is-pressing");
  });

  document.addEventListener("pointerup", () => {
    document.querySelectorAll(".is-pressing").forEach((item) => item.classList.remove("is-pressing"));
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}
