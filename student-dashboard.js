const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const APPLIED_JOBS_KEY = "appliedJobs";
const SAVED_JOBS_KEY = "savedJobs";
const NOTIFICATIONS_KEY = "skillbridgeStudentNotifications";

document.addEventListener("DOMContentLoaded", () => {
  setupTopbar();
  setupDropdowns();
  setupReveal();
  renderDashboard();
});

function setupTopbar() {
  const topbar = document.getElementById("studentTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");

  toggle?.addEventListener("click", () => {
    const isOpen = topbar?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  window.addEventListener("scroll", () => {
    topbar?.classList.toggle("is-scrolled", window.scrollY > 24);
    closeAllDropdowns();
  }, { passive: true });
}

function setupDropdowns() {
  const triggers = document.querySelectorAll("[data-dropdown-trigger]");

  triggers.forEach((trigger) => {
    const target = document.getElementById(trigger.getAttribute("data-dropdown-trigger"));
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    target?.setAttribute("role", "menu");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = !target?.classList.contains("is-open");
      closeAllDropdowns(target);
      target?.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) window.setTimeout(() => target?.querySelector("a, button")?.focus(), 60);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-dropdown-trigger]") || event.target.closest(".dropdown-panel")) return;
    closeAllDropdowns();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns();
  });
}

function closeAllDropdowns(except = null) {
  document.querySelectorAll(".dropdown-panel").forEach((panel) => {
    if (panel !== except) panel.classList.remove("is-open");
  });
  document.querySelectorAll("[data-dropdown-trigger]").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("data-dropdown-trigger"));
    button.setAttribute("aria-expanded", String(Boolean(panel?.classList.contains("is-open"))));
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (
    typeof IntersectionObserver === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function renderDashboard() {
  const passport = readJson(PASSPORT_KEY, {});
  const assessment = readJson(ASSESSMENT_KEY, {});
  const appliedJobs = readJson(APPLIED_JOBS_KEY, []);
  const savedJobs = readJson(SAVED_JOBS_KEY, []);
  const profile = buildDashboardProfile(passport, assessment, appliedJobs, savedJobs);

  replaceText("topbarName", profile.firstName);
  replaceText("topbarAvatar", profile.avatar);
  replaceText("welcomeTitle", `أهلًا يا ${profile.firstName}`);
  replaceText("welcomeCopy", profile.welcomeCopy);
  replaceText("snapshotTitle", profile.snapshotTitle);
  replaceText("snapshotMatch", `${profile.match}%`);
  replaceText("snapshotCopy", profile.snapshotCopy);
  replaceText("journeyProgressCopy", `${profile.journeyProgress}%`);
  replaceText("xpProgressCopy", `${profile.xp} / 1000`);
  replaceText("levelBadge", profile.levelBadge);
  replaceText("nextStepTitle", profile.nextStepTitle);
  replaceText("nextStepCopy", profile.nextStepCopy);
  replaceText("welcomeTag", profile.welcomeTag);

  setActionLink("heroPrimaryAction", profile.primaryAction);
  setActionLink("heroSecondaryAction", profile.secondaryAction);
  setActionLink("nextStepAction", profile.nextStepAction);

  setProgress("journeyProgressBar", profile.journeyProgress);
  setProgress("xpProgressBar", Math.min(profile.xp, 1000) / 10);

  renderSkillList("topSkillsList", profile.skills, "موجودة في بروفايلك");
  renderSkillList("skillGapsList", profile.gaps, "طورها الآن", true);
  renderNotifications(ensureNotifications(profile));
}

function buildDashboardProfile(passport, assessment, appliedJobs, savedJobs) {
  const fullName = String(passport.name || "Student").trim();
  const firstName = fullName === "Student" ? "صديقنا" : fullName.split(" ")[0];
  const trackLabel = cleanTrackLabel(assessment.careerPath || assessment.fullTitle || passport.track || "Data Analysis");
  const strengths = pickArray(assessment.strengths, passport.strengths, ["تحليل منطقي", "حل المشكلات", "تنفيذ منظم"]);
  const gaps = pickArray(assessment.weaknesses, passport.weaknesses, ["SQL المتقدم", "العرض والتقديم", "بناء مشروع أقوى"]).slice(0, 4);
  const skills = pickArray(passport.skills, [], ["Python", "SQL", "Excel", "Dashboards", "Communication"]).slice(0, 6);
  const xp = clampNumber(passport.xp, 620, 80, 1000);
  const journeyProgress = clampNumber(passport.learningProgress ?? passport.jobReadiness, appliedJobs.length ? 72 : 60, 25, 96);
  const match = clampNumber(passport.jobReadiness, assessment.dna?.[0]?.value || 82, 55, 96);
  const nextFocus = normalizeGapLabel(gaps[0] || skills[0] || "Python");

  return {
    firstName,
    avatar: passport.avatar || initials(fullName),
    xp,
    match,
    journeyProgress,
    skills,
    gaps,
    welcomeTag: appliedJobs.length ? "On Track" : "Welcome Back",
    levelBadge: getLevelBadge(xp),
    snapshotTitle: `المسار الأقرب ليك: ${trackLabel}`,
    snapshotCopy: assessment.copy || `أقوى نقاطك حاليًا: ${strengths.slice(0, 2).join(" و")}. الخطوة الجاية لازم تكون واضحة وسريعة.`,
    welcomeCopy: appliedJobs.length
      ? `عندك ${appliedJobs.length} تقديمات محتاجة متابعة. ركز دلوقتي على تقوية ${nextFocus} وتحديث Passport.`
      : `الهدف بسيط: طور مهارة واحدة، حدث بروفايلك، وابدأ التقديم على فرص مناسبة بدون زحمة.`,
    nextStepTitle: `طور ${nextFocus}`,
    nextStepCopy: `دي أسرع خطوة ترفع فرصك داخل مسار ${trackLabel}.`,
    primaryAction: appliedJobs.length
      ? { href: "smart-jobs.html", label: "تابع الفرص المناسبة" }
      : { href: "learning-path.html", label: "ابدأ خطة التعلم" },
    secondaryAction: savedJobs.length
      ? { href: "smart-jobs.html", label: "راجع الوظائف المحفوظة" }
      : { href: "talent-dna.html", label: "راجع Talent DNA" },
    nextStepAction: { href: "learning-path.html", label: "ابدأ الخطوة التالية" }
  };
}

function renderSkillList(id, items, hint, isGap = false) {
  const el = document.getElementById(id);
  if (!el) return;

  const groups = groupSkills(items, isGap);

  el.replaceChildren(...groups.map((group) => {
    const section = document.createElement("section");
    section.className = "skill-group";

    const title = document.createElement("strong");
    title.className = "skill-group-title";
    title.textContent = group.title;

    const list = document.createElement("div");
    list.className = "skill-token-row";

    list.replaceChildren(...group.items.map((item) => {
      const button = document.createElement("button");
      button.className = isGap ? "gap-chip" : "skill-chip";
      button.type = "button";
      button.dataset.skillName = item;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${item}: ${hint}`);

      const strong = document.createElement("strong");
      strong.textContent = `${getSkillIcon(item)} ${item}`;
      const span = document.createElement("span");
      span.textContent = hint;

      button.append(strong, span);
      button.addEventListener("click", () => {
        const selected = button.classList.toggle("is-selected");
        button.setAttribute("aria-pressed", String(selected));
        updateSelectionCounter(isGap);
        updateDecisionPanel(item, isGap, selected);
        showToast(selected ? `${item} بقت قرارك الحالي.` : `${item} اتشالت من الاختيارات.`);
      });
      return button;
    }));

    section.append(title, list);
    return section;
  }));

  updateSelectionCounter(isGap);
}

function groupSkills(items, isGap) {
  const groups = [
    { title: isGap ? "Priority Gaps" : "Data & Analysis", keys: ["Python", "SQL", "Excel", "Dashboards", "Visualization", "Power BI"], items: [] },
    { title: "Frontend", keys: ["HTML", "CSS", "JavaScript", "React", "UI", "UX"], items: [] },
    { title: "Work Skills", keys: ["Communication", "Problem", "Ownership", "Presentation", "Storytelling"], items: [] }
  ];

  items.forEach((item) => {
    const target = groups.find((group) => group.keys.some((key) => item.toLowerCase().includes(key.toLowerCase()))) || groups[0];
    target.items.push(item);
  });

  return groups.filter((group) => group.items.length);
}

function getSkillIcon(skill) {
  const lower = String(skill).toLowerCase();
  if (lower.includes("python")) return "PY";
  if (lower.includes("sql")) return "DB";
  if (lower.includes("excel")) return "XL";
  if (lower.includes("dashboard") || lower.includes("visual")) return "CH";
  if (lower.includes("react")) return "RX";
  if (lower.includes("javascript")) return "JS";
  if (lower.includes("html")) return "HT";
  if (lower.includes("css")) return "CS";
  if (lower.includes("communication")) return "CM";
  if (lower.includes("presentation") || lower.includes("story")) return "PR";
  return "SK";
}

function updateSelectionCounter(isGap) {
  const selector = isGap ? "#skillGapsList .is-selected" : "#topSkillsList .is-selected";
  const counterId = isGap ? "gapsSelectionCounter" : "skillsSelectionCounter";
  const label = isGap ? "Gaps" : "Skills";
  const count = document.querySelectorAll(selector).length;
  replaceText(counterId, `Selected: ${count} ${label}`);
}

function updateDecisionPanel(skill, isGap, selected) {
  const title = document.getElementById("decisionPanelTitle");
  const copy = document.getElementById("decisionPanelCopy");
  const primary = document.getElementById("decisionPrimaryAction");
  const secondary = document.getElementById("decisionSecondaryAction");

  if (!title || !copy || !primary || !secondary) return;

  if (!selected) {
    const selectedButtons = document.querySelectorAll(".skill-chip.is-selected, .gap-chip.is-selected");
    if (selectedButtons.length) {
      const last = selectedButtons[selectedButtons.length - 1].dataset.skillName;
      updateDecisionPanel(last, false, true);
      return;
    }

    title.textContent = "اختار مهارة وشوف الخطوة تتغير";
    copy.textContent = "المهارات هنا مش labels. كل اختيار بيغير خطة التعلم والوظائف المقترحة.";
    primary.textContent = "افتح خطة التعلم";
    secondary.textContent = "شوف الوظائف";
    return;
  }

  title.textContent = isGap ? `ابدأ بسد فجوة ${skill}` : `${skill} بقت ضمن تركيزك`;
  copy.textContent = isGap
    ? `هنرشح لك خطوة تعلم قصيرة ووظائف أسهل تناسب فجوة ${skill}.`
    : `هنرتب الوظائف والـ roadmap حوالين ${skill} عشان تتحرك بسرعة ودقة.`;
  primary.textContent = isGap ? "ابدأ علاج الفجوة" : "حدّث خطة التعلم";
  secondary.textContent = `وظائف تناسب ${skill}`;
}

function ensureNotifications(profile) {
  const existing = readJson(NOTIFICATIONS_KEY, []);
  const defaults = [
    {
      id: "step-focus",
      title: "الخطوة التالية واضحة",
      message: `${profile.nextStepTitle} هي أسرع خطوة ترفع فرصك.`,
      read: false
    },
    {
      id: "jobs-snapshot",
      title: "فرص مناسبة جاهزة",
      message: "افتح Smart Jobs وشوف الوظائف حسب الـ match الحالي.",
      read: false
    },
    {
      id: "passport-reminder",
      title: "حدث Passport",
      message: "أي مشروع أو مهارة جديدة تزود ثقة الشركات فيك.",
      read: existing.some((item) => item.id === "passport-reminder")
    }
  ];

  const merged = defaults.map((item) => existing.find((current) => current.id === item.id) || item);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(merged));
  return merged;
}

function renderNotifications(notifications) {
  const unread = notifications.filter((item) => !item.read).length;
  const trigger = document.getElementById("studentNotificationsTrigger");
  const topbarList = document.getElementById("studentNotificationsList");

  trigger?.setAttribute("data-badge", String(unread));
  if (!topbarList) return;

  topbarList.replaceChildren(...notifications.map((item) => {
    const article = document.createElement("article");
    article.className = "dropdown-note";

    const strong = document.createElement("strong");
    strong.textContent = item.title;
    const span = document.createElement("span");
    span.textContent = item.message;
    const button = document.createElement("button");
    button.className = "notification-mini-action";
    button.type = "button";
    button.textContent = item.read ? "Read" : "Mark read";
    button.disabled = item.read;
    button.addEventListener("click", () => markNotificationRead(item.id));

    article.append(strong, span, button);
    return article;
  }));
}

function markNotificationRead(id) {
  const updated = readJson(NOTIFICATIONS_KEY, []).map((item) => (
    item.id === id ? { ...item, read: true } : item
  ));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  renderNotifications(updated);
  showToast("تم تعليم الإشعار كمقروء.");
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function initials(name) {
  return String(name || "ST")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "ST";
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

function setProgress(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${Math.max(0, Math.min(value, 100))}%`;
}

function setActionLink(id, action) {
  const el = document.getElementById(id);
  if (!el || !action) return;
  el.href = action.href;
  el.textContent = action.label;
}

function pickArray(primary, secondary, fallback) {
  if (Array.isArray(primary) && primary.length) return primary;
  if (Array.isArray(secondary) && secondary.length) return secondary;
  return fallback;
}

function clampNumber(value, fallback, min, max) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.min(max, Math.max(min, numericValue)) : fallback;
}

function cleanTrackLabel(value) {
  return String(value || "Data Analysis")
    .replace(/^مجالك الأقرب:\s*/i, "")
    .replace(/^أنت أقرب إلى\s*/i, "")
    .replace(/^أنت مناسب لـ?\s*/i, "")
    .replace(/\s*بنسبة\s*\d+%/i, "")
    .trim();
}

function normalizeGapLabel(value) {
  return String(value || "Python")
    .replace(/^تعلم\s+/i, "")
    .replace(/^طور\s+/i, "")
    .trim();
}

function getLevelBadge(xp) {
  if (xp >= 900) return "Level 4 - Builder";
  if (xp >= 700) return "Level 3 - Advancer";
  if (xp >= 450) return "Level 2 - Explorer";
  return "Level 1 - Starter";
}

function showToast(message) {
  const toast = document.getElementById("studentDashboardToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
