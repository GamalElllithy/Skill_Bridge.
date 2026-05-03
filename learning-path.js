const PATH_STORAGE_KEY = "skillbridgeLearningPath";
const PASSPORT_KEY = "skillbridgeTalentPassport";

const steps = [
  {
    id: "foundations",
    title: "Learn Python Basics",
    subtitle: "Step 1 - Foundations",
    description: "افهم أساسيات Python اللي هتحتاجها في تحليل البيانات.",
    duration: "5 أيام",
    skills: ["Python", "Logic"],
    why: "+20% فرصة قبول في وظائف Data Intern.",
    jobs: ["Data Intern", "Junior Data Analyst"],
    xp: 50,
    badge: "Python Starter",
    tasks: [
      "افهم variables, loops, conditions",
      "حل 3 مسائل logic بسيطة",
      "جهز notebook فيه أول analysis بسيط"
    ],
    resources: ["Python Basics", "Simple Exercises", "First Notebook"]
  },
  {
    id: "practice",
    title: "Data Analysis Project",
    subtitle: "Step 2 - Practice",
    description: "ابن أول مشروع واضح تقدر تعرضه في Portfolio.",
    duration: "4 أيام",
    skills: ["Mini Project", "EDA", "Storytelling"],
    why: "+25% ثقة للشركة لأن عندك دليل عملي.",
    jobs: ["Data Intern", "Business Analyst Intern"],
    xp: 70,
    badge: "Data Explorer",
    tasks: [
      "اختار dataset مناسبة",
      "اعمل cleaning وتحليل أساسي",
      "اطلع 3 insights واضحة"
    ],
    resources: ["Dataset Pack", "Project Checklist", "Portfolio Guide"]
  },
  {
    id: "advanced",
    title: "SQL + Visualization",
    subtitle: "Step 3 - Job Ready",
    description: "اتعلم SQL وDashboards عشان تبقى أقرب لوظائف BI وData.",
    duration: "6 أيام",
    skills: ["SQL", "Visualization", "Dashboards"],
    why: "+30% فرص في وظائف Reporting وBI.",
    jobs: ["Junior Analyst", "BI Intern", "Reporting Associate"],
    xp: 90,
    badge: "Dashboard Builder",
    tasks: [
      "اكتب 5 queries أساسية",
      "اعمل dashboard واحد",
      "اربط النتائج بقرار business واضح"
    ],
    resources: ["SQL Cheat Sheet", "Dashboard Examples", "Visualization Tips"]
  }
];

const levelPassport = [
  {
    minCompleted: 0,
    label: "Level 1 - Starter",
    copy: "ابدأ بأول مهمة صغيرة. الهدف هنا إنك تدخل الفلو بسرعة.",
    reward: "Basic roadmap"
  },
  {
    minCompleted: 1,
    label: "Level 2 - Explorer",
    copy: "فتحت فرص Data Intern وبقى عندك دليل أول في الباسبور.",
    reward: "Data Intern jobs"
  },
  {
    minCompleted: 2,
    label: "Level 3 - Builder",
    copy: "ممتاز. أنت قريب من التقديم الجاد وكورس المكافأة قرب يفتح.",
    reward: "Premium course access"
  },
  {
    minCompleted: 3,
    label: "Level 4 - Job Ready",
    copy: "المسار اكتمل. افتح Smart Jobs وابدأ بأعلى Match.",
    reward: "Interview-ready track"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupPath();
  setupModal();
});

function setupMenu() {
  const topbar = document.getElementById("pathTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;

  toggle.setAttribute("aria-expanded", "false");
  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
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

function setupPath() {
  const timelineTrack = document.getElementById("timelineTrack");
  const resumeBtn = document.getElementById("resumePathBtn");
  if (!timelineTrack || !resumeBtn) return;

  let state = getPathState();

  function render() {
    const completedCount = state.completed.length;
    const progress = Math.round((completedCount / steps.length) * 100);
    const earnedXp = steps
      .filter((step) => state.completed.includes(step.id))
      .reduce((sum, step) => sum + step.xp, 0);
    const totalXp = 100 + earnedXp;
    const level = getLevelName(completedCount);
    const nextStep = steps.find((step) => !state.completed.includes(step.id)) || steps[steps.length - 1];

    replaceText("xpValue", `${totalXp} XP`);
    replaceText("levelValue", level.label);
    replaceText("dailyGoalValue", completedCount === steps.length ? "Done" : "1 Mission");
    replaceText("progressPercent", `${progress}%`);
    replaceText("aiInsight", buildInsight(progress, nextStep));
    replaceText("reminderCopy", buildReminder(completedCount, nextStep));
    replaceText("portfolioHint", `Next unlock: ${completedCount >= 2 ? "Interview-ready recommendations" : "Dashboard Project Access"}.`);

    const progressBar = document.getElementById("progressBar");
    const progressCircle = document.getElementById("progressCircle");
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressCircle) {
      const circumference = 301.59;
      progressCircle.style.strokeDashoffset = `${circumference - (circumference * progress) / 100}`;
    }

    renderBadges(state);
    renderUnlocks(completedCount);
    renderLevelPassport(completedCount, totalXp);
    renderTimeline(timelineTrack, state, completedCount);
    syncPassportFromLearning(state, totalXp, progress, level.label);
    bindStepActions();
  }

  function bindStepActions() {
    document.querySelectorAll("[data-start-step]").forEach((button) => {
      button.addEventListener("click", () => openLearningModal(button.getAttribute("data-start-step")));
    });

    document.querySelectorAll("[data-complete-step]").forEach((button) => {
      button.addEventListener("click", () => completeStep(button.getAttribute("data-complete-step")));
    });
  }

  function completeStep(stepId) {
    if (state.completed.includes(stepId)) return;

    const step = steps.find((item) => item.id === stepId);
    state.completed.push(stepId);
    if (step && !state.badges.includes(step.badge)) state.badges.push(step.badge);

    setPathState(state);
    render();
    celebrateStep(step);
  }

  resumeBtn.addEventListener("click", () => {
    const nextStep = steps.find((step) => !state.completed.includes(step.id)) || steps[steps.length - 1];
    openLearningModal(nextStep.id);
  });

  window.completeLearningStep = completeStep;
  render();
}

function renderTimeline(container, state, completedCount) {
  container.innerHTML = steps.map((step, index) => {
    const isComplete = state.completed.includes(step.id);
    const isActive = !isComplete && index === completedCount;
    const isLocked = !isComplete && index > completedCount;
    const stepProgress = isComplete ? 100 : isActive ? 55 : 0;

    return `
      <article class="timeline-step ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""} ${isLocked ? "is-locked" : ""}">
        <div class="timeline-step-header">
          <div class="step-number">${index + 1}</div>
          <div class="step-main">
            <span class="eyebrow">${escapeHtml(step.subtitle)}</span>
            <h3>${escapeHtml(step.title)}</h3>
            <p class="step-copy">${escapeHtml(step.description)}</p>
          </div>
          <div class="step-meta">
            <span class="meta-pill ${isComplete ? "complete" : isActive ? "active" : "locked"}">
              ${isComplete ? "Completed" : isActive ? "Active" : "Locked"}
            </span>
            <span class="meta-pill">${escapeHtml(step.duration)}</span>
          </div>
        </div>

        <div class="step-progress">
          <div class="mini-progress"><span style="width:${stepProgress}%"></span></div>
        </div>

        <div class="step-preview-row">
          <span>${escapeHtml(step.why)}</span>
          <span>${escapeHtml(step.skills.join(" - "))}</span>
        </div>

        <div class="step-actions">
          <button class="primary-btn" type="button" data-start-step="${step.id}" ${isLocked ? "disabled" : ""}>ابدأ الخطوة</button>
          <button class="ghost-btn" type="button" data-complete-step="${step.id}" ${isLocked || isComplete ? "disabled" : ""}>خلصتها</button>
          <a class="ghost-btn" href="smart-jobs.html">Jobs</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderBadges(state) {
  const badgeList = document.getElementById("badgeList");
  if (!badgeList) return;
  const badges = state.badges.length ? state.badges : ["Explorer"];
  badgeList.innerHTML = badges.map((badge) => `<span class="badge-pill">${escapeHtml(badge)}</span>`).join("");
}

function renderUnlocks(completedCount) {
  const unlockList = document.getElementById("unlockList");
  if (!unlockList) return;

  unlockList.innerHTML = `
    <div>
      <strong>Unlocked</strong>
      <span>${completedCount >= 1 ? "Data Intern Jobs" : "Basic Path Access"}</span>
    </div>
    <div>
      <strong>Next Unlock</strong>
      <span>${completedCount >= 2 ? "Interview-ready jobs" : "Dashboard Project Access"}</span>
    </div>
  `;
}

function renderLevelPassport(completedCount, totalXp) {
  const current = [...levelPassport].reverse().find((level) => completedCount >= level.minCompleted) || levelPassport[0];
  const next = levelPassport.find((level) => level.minCompleted > completedCount);
  const rewardReady = completedCount >= 2 || totalXp >= 220;

  replaceText("levelPassportTitle", current.label);
  replaceText("levelPassportCopy", next
    ? `${current.copy} الخطوة الجاية تفتح: ${next.reward}.`
    : current.copy
  );
  replaceText("rewardTitle", rewardReady ? "Premium Course Unlocked" : "Premium Course Locked");
  replaceText("rewardCopy", rewardReady
    ? "مبروك. مجهودك فتح كورس مميز مجاني، استخدمه كدفعة للمستوى الجاي."
    : "وصل Level 3 أو اجمع 220 XP وخد كورس مميز مجانا تقديرا لمجهودك."
  );

  const rewardCard = document.getElementById("rewardCard");
  const rewardAction = document.getElementById("rewardAction");
  const levelRail = document.getElementById("levelRail");

  rewardCard?.classList.toggle("is-unlocked", rewardReady);
  if (rewardAction) rewardAction.textContent = rewardReady ? "Open Free Course" : "Keep Going";

  if (levelRail) {
    levelRail.innerHTML = levelPassport.map((level, index) => {
      const isDone = completedCount >= level.minCompleted;
      const isCurrent = current.label === level.label;
      return `
        <div class="level-node ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(level.label.replace("Level ", "L"))}</strong>
          <small>${escapeHtml(level.reward)}</small>
        </div>
      `;
    }).join("");
  }
}

function buildInsight(progress, nextStep) {
  if (progress >= 100) return "أنت جاهز للتقديم. افتح Smart Jobs وابدأ بأعلى Match.";
  if (progress >= 67) return "فاضلك خطوة واحدة. بعدها هتفتح وظائف أقوى وترشيحات أدق.";
  if (progress >= 34) return `لو خلصت ${nextStep.title} النهارده، فرصتك في التوظيف هتزيد بوضوح.`;
  return "ابدأ بأول مهمة فقط. أول خطوة هتفتح لك وظائف جديدة وتبني momentum.";
}

function buildReminder(completedCount, nextStep) {
  if (completedCount === 0) return "ابدأ بمهمة واحدة صغيرة. الهدف مش مذاكرة طويلة، الهدف momentum.";
  if (completedCount === steps.length) return "المسار اكتمل. الخطوة التالية: قدّم على وظائف مناسبة.";
  return `الخطوة الحالية: ${nextStep.title}. خلص task واحد وخلي الـ streak شغال.`;
}

function openLearningModal(stepId) {
  const step = steps.find((item) => item.id === stepId);
  const modal = document.getElementById("learningModal");
  const content = document.getElementById("modalContent");
  if (!step || !modal || !content) return;

  content.innerHTML = `
    <div>
      <span class="eyebrow">${escapeHtml(step.subtitle)}</span>
      <h2>${escapeHtml(step.title)}</h2>
      <p>${escapeHtml(step.description)}</p>
    </div>
    <div class="modal-blocks">
      <section class="modal-block">
        <strong>3 Tasks فقط</strong>
        <ul>${step.tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("")}</ul>
      </section>
      <section class="modal-block">
        <strong>Resources</strong>
        <ul>${step.resources.map((resource) => `<li>${escapeHtml(resource)}</li>`).join("")}</ul>
      </section>
      <section class="modal-block">
        <strong>Why</strong>
        <p>${escapeHtml(step.why)}</p>
      </section>
      <section class="modal-block">
        <strong>Jobs Unlocked</strong>
        <ul>${step.jobs.map((job) => `<li>${escapeHtml(job)}</li>`).join("")}</ul>
      </section>
    </div>
    <div class="step-actions modal-actions">
      <button class="primary-btn" type="button" data-modal-complete="${step.id}">Mark Complete +${step.xp} XP</button>
      <a class="ghost-btn" href="smart-jobs.html">Go to Jobs</a>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  content.querySelector("[data-modal-complete]")?.addEventListener("click", () => {
    if (typeof window.completeLearningStep === "function") window.completeLearningStep(step.id);
    closeModal();
  });
}

function setupModal() {
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById("learningModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function celebrateStep(step) {
  showToast(`تم إنهاء ${step?.title || "الخطوة"} بنجاح +${step?.xp || 0} XP`);
  const burst = document.createElement("div");
  burst.className = "xp-burst";
  burst.textContent = `+${step?.xp || 0} XP`;
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1200);
}

function getPathState() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PATH_STORAGE_KEY) || "null");
    if (parsed && Array.isArray(parsed.completed) && Array.isArray(parsed.badges)) return parsed;
  } catch (error) {
    return { completed: [], badges: ["Explorer"] };
  }

  return { completed: [], badges: ["Explorer"] };
}

function setPathState(state) {
  window.localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(state));
}

function syncPassportFromLearning(state, xp, progress, levelLabel) {
  const passport = getPassport();
  if (!passport.name) return;

  const levelNumber = progress >= 100 ? 4 : progress >= 67 ? 3 : progress >= 34 ? 2 : 1;
  const completedSkills = steps
    .filter((step) => state.completed.includes(step.id))
    .flatMap((step) => step.skills);

  passport.learningProgress = progress;
  passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 30 + Math.round(progress * 0.45));
  passport.completedSteps = [...state.completed];
  passport.badges = Array.from(new Set([...(passport.badges || []), ...state.badges]));
  passport.xp = Math.max(Number(passport.xp || 0), xp);
  passport.level = levelNumber;
  passport.levelLabel = levelLabel;
  passport.skills = Array.from(new Set([...(passport.skills || []), ...completedSkills]));

  state.completed.forEach((stepId) => {
    const step = steps.find((item) => item.id === stepId);
    if (!step) return;

    const alreadyLogged = Array.isArray(passport.projects) && passport.projects.some((project) => project.id === step.id);
    if (!alreadyLogged) {
      passport.projects = passport.projects || [];
      passport.projects.push({
        id: step.id,
        title: step.title,
        summary: `Completed learning milestone in ${step.subtitle}`,
        skills: step.skills
      });
    }
  });

  savePassport(passport);
}

function getPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function savePassport(passport) {
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function getLevelName(completedCount) {
  if (completedCount >= 3) return { label: "Level 4 - Ready" };
  if (completedCount >= 2) return { label: "Level 3 - Builder" };
  if (completedCount >= 1) return { label: "Level 2 - Explorer" };
  return { label: "Level 1 - Beginner" };
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = document.getElementById("pathToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
