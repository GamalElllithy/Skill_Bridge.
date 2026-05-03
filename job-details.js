const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const SELECTED_JOB_KEY = "skillbridgeSelectedJobId";

const JOBS = [
  {
    id: "job-1",
    title: "Junior Data Analyst",
    company: "TechNova",
    logo: "TN",
    location: "Cairo / Remote",
    workType: "Internship",
    decision: "قدّم الآن",
    coreSkills: ["Python", "SQL", "Excel", "Visualization"],
    optionalSkills: ["Power BI", "Storytelling"],
    description: "تحليل بيانات وبناء تقارير تساعد فريق المنتج والإدارة على اتخاذ قرارات أسرع.",
    responsibilities: ["تنظيف البيانات", "بناء تقارير واضحة", "استخراج Insights قابلة للتنفيذ"],
    gapsHelp: {
      SQL: "راجع joins وaggregation على بيانات حقيقية.",
      Visualization: "ابن Dashboard واحد يشرح القصة بصريا.",
      "Power BI": "جهز تقرير BI بسيط يثبت قدرتك."
    },
    relatedJobs: [
      { id: "job-2", title: "BI Intern", match: 76, why: "قريب من مسار التقارير والـ dashboards." },
      { id: "job-3", title: "Product Operations Intern", match: 71, why: "مناسب لو تحب التحليل مع التنفيذ." }
    ]
  },
  {
    id: "job-2",
    title: "BI Intern",
    company: "InsightFlow",
    logo: "IF",
    location: "Cairo",
    workType: "Internship",
    decision: "قوّي المشروع ثم قدّم",
    coreSkills: ["Excel", "SQL", "Power BI", "Reporting"],
    optionalSkills: ["Storytelling", "Automation"],
    description: "دعم فريق BI في تجهيز تقارير شهرية ومتابعة KPIs.",
    responsibilities: ["تحديث dashboards", "إعداد تقارير مختصرة", "متابعة الاتجاهات المهمة"],
    gapsHelp: {
      "Power BI": "ابن Dashboard كامل لرفع قوة البورتفوليو.",
      SQL: "تمرن على joins وaggregation.",
      Reporting: "اختصر النتيجة في ملخص واضح."
    },
    relatedJobs: [
      { id: "job-1", title: "Junior Data Analyst", match: 78, why: "قريب جدا من تحليل البيانات." }
    ]
  },
  {
    id: "job-3",
    title: "Product Operations Intern",
    company: "BridgeLab",
    logo: "BL",
    location: "Alexandria / Hybrid",
    workType: "Internship",
    decision: "اختيار ثاني مناسب",
    coreSkills: ["Communication", "Excel", "Ownership", "Reporting"],
    optionalSkills: ["Operations Thinking", "Coordination"],
    description: "تنسيق عمليات المنتج وتحليل الأداء ومتابعة التنفيذ اليومي.",
    responsibilities: ["متابعة المهام", "تجهيز updates قصيرة", "التنسيق بين الفرق"],
    gapsHelp: {
      Reporting: "تعلم أساسيات التقارير لزيادة الثقة.",
      Ownership: "اكتب case study صغيرة عن طريقة تفكيرك.",
      Communication: "تمرن على كتابة updates منظمة."
    },
    relatedJobs: [
      { id: "job-1", title: "Junior Data Analyst", match: 68, why: "أقرب لو عايز تركيز بيانات أكثر." }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderPage();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("detailsTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (typeof IntersectionObserver === "undefined") {
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

function renderPage() {
  const job = getCurrentJob();
  const passport = getStoredJson(PASSPORT_KEY, {});
  const assessment = getStoredJson(ASSESSMENT_KEY, {});
  const analysis = analyzeJob(job, passport, assessment);

  replaceText("jobTitle", job.title);
  replaceText("companyLine", `${job.company} - ${job.location} - ${job.workType}`);
  replaceText("matchValue", `${analysis.match}%`);
  replaceText("whyMatchCopy", analysis.whyMatch);
  replaceText("summaryStickyCopy", analysis.summary);
  replaceText("feedbackLine", analysis.feedback);

  const logo = document.getElementById("companyLogo");
  if (logo) logo.textContent = job.logo;

  const ring = document.getElementById("matchRing");
  if (ring) {
    const circumference = 301.59;
    ring.style.strokeDashoffset = `${circumference - (circumference * analysis.match) / 100}`;
    ring.style.stroke = analysis.match >= 80
      ? "var(--success)"
      : analysis.match >= 65
        ? "var(--warning)"
        : "var(--danger)";
  }

  renderMatchHighlights(analysis);
  renderSkillsMap(job, analysis);
  renderDescription(job);
  renderRoadmap(analysis);
  renderTips(analysis);
  renderOtherJobs(job);
}

function analyzeJob(job, passport, assessment) {
  const skills = normalizeSkills([...(passport.skills || []), ...(assessment.strengths || [])]);
  const learningProgress = clampNumber(passport.learningProgress || passport.jobReadiness, 55, 0, 100);
  const projectsCount = Array.isArray(passport.projects) ? passport.projects.length : 1;
  const strengths = job.coreSkills.filter((skill) => skills.includes(skill.toLowerCase()));
  const missing = job.coreSkills.filter((skill) => !skills.includes(skill.toLowerCase()));
  const skillsMatch = Math.round((strengths.length / job.coreSkills.length) * 100);
  const proofMatch = Math.min(95, 50 + projectsCount * 16);
  const learningMatch = Math.min(95, learningProgress + 10);
  const match = Math.round((skillsMatch * 0.45) + (proofMatch * 0.25) + (learningMatch * 0.3));
  const nextSkill = missing[0] || job.optionalSkills[0] || "Portfolio";
  const canApply = match >= 72;

  return {
    match,
    skillsMatch,
    proofMatch,
    learningMatch,
    strengths,
    missing,
    nextSkill,
    decision: canApply ? job.decision : `ابدأ بـ ${nextSkill}`,
    whyMatch: canApply
      ? `قرار سريع: مناسب للتقديم الآن. أقوى نقطة عندك ${strengths[0] || "الأساسيات"}، والخطوة التالية ${nextSkill}.`
      : `لسه محتاج خطوة واحدة قبل التقديم بثقة: ${nextSkill}.`,
    summary: canApply
      ? `ابدأ بالتقديم، ثم حسّن ${nextSkill} خلال 3 أيام.`
      : `نفذ ${nextSkill} الأول، وبعدها ارجع للتقديم.`,
    feedback: canApply ? "جاهز لخطوة تقديم منظمة." : "قريب، بس محتاج تقفل فجوة واحدة."
  };
}

function renderMatchHighlights(analysis) {
  const container = document.getElementById("matchAccordion");
  if (!container) return;

  const items = [
    { title: "القرار", value: analysis.decision, copy: analysis.summary },
    { title: "القوة", value: `${analysis.skillsMatch}%`, copy: analysis.strengths.length ? analysis.strengths.join(" - ") : "أساسيات قابلة للتطوير" },
    { title: "الفجوة", value: analysis.nextSkill, copy: "دي أسرع نقطة ترفع فرصتك." }
  ];

  container.innerHTML = items.map((item) => `
    <article class="decision-card">
      <span>${escapeHtml(item.title)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <p>${escapeHtml(item.copy)}</p>
    </article>
  `).join("");
}

function renderSkillsMap(job, analysis) {
  const container = document.getElementById("skillsMap");
  if (!container) return;

  container.innerHTML = job.coreSkills.map((skill) => {
    const ready = analysis.strengths.includes(skill);
    const value = ready ? 88 : 54;
    const hint = ready ? "جاهزة" : (job.gapsHelp[skill] || "مطلوبة للتحسين");

    return `
      <article class="skill-card ${ready ? "is-ready" : "needs-work"}">
        <div class="skill-head">
          <div>
            <strong>${escapeHtml(skill)}</strong>
            <span>${ready ? "قوة" : "Gap"}</span>
          </div>
          <small>${value}%</small>
        </div>
        <div class="skill-track"><span style="width:${value}%"></span></div>
        <p class="skill-hint">${escapeHtml(hint)}</p>
      </article>
    `;
  }).join("");
}

function renderDescription(job) {
  const container = document.getElementById("descriptionAccordion");
  if (!container) return;

  container.innerHTML = `
    <article class="compact-description">
      <strong>ماذا ستفعل؟</strong>
      <p>${escapeHtml(job.description)}</p>
      <div class="job-tags">${job.responsibilities.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    </article>
  `;
}

function renderRoadmap(analysis) {
  const container = document.getElementById("actionPlan");
  if (!container) return;

  const plan = [
    { title: analysis.decision, copy: analysis.summary },
    { title: `اقفل ${analysis.nextSkill}`, copy: "خطوة قصيرة ومباشرة ترفع الـ Match." },
    { title: "حدّث الباسبور", copy: "ضيف الدليل ثم ارجع للتقديم بثقة أعلى." }
  ];

  container.innerHTML = plan.map((item, index) => `
    <article class="roadmap-card">
      <span class="step-number">${index + 1}</span>
      <div>
        <div class="roadmap-head">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${index === 0 ? "Now" : "Next"}</span>
        </div>
        <p>${escapeHtml(item.copy)}</p>
      </div>
    </article>
  `).join("");
}

function renderTips(analysis) {
  const container = document.getElementById("tipsList");
  if (!container) return;

  const tips = [
    `ابدأ بـ ${analysis.nextSkill}.`,
    "خلي رسالة التقديم قصيرة ومربوطة بالوظيفة."
  ];

  container.innerHTML = tips.map((tip, index) => `
    <article class="tips-card">
      <span>${index + 1}</span>
      <div>
        <strong>نصيحة سريعة</strong>
        <p>${escapeHtml(tip)}</p>
      </div>
    </article>
  `).join("");
}

function renderOtherJobs(job) {
  const container = document.getElementById("otherJobs");
  if (!container) return;

  container.innerHTML = job.relatedJobs.map((item) => `
    <article class="other-job-card">
      <div class="other-job-head">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${item.match}%</span>
      </div>
      <p>${escapeHtml(item.why)}</p>
      <button class="mini-action" type="button" data-related-job="${escapeHtml(item.id)}">View</button>
    </article>
  `).join("");

  container.querySelectorAll("[data-related-job]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-related-job");
      if (!id || !JOBS.some((jobItem) => jobItem.id === id)) return;
      window.localStorage.setItem(SELECTED_JOB_KEY, id);
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function setupActions() {
  ["applyNowBtn", "stickyApplyBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", applyCurrentJob);
  });

  document.getElementById("saveJobBtn")?.addEventListener("click", saveCurrentJob);
  document.getElementById("trackJobBtn")?.addEventListener("click", () => {
    showToast("تم حفظ الوظيفة للمتابعة.");
    saveCurrentJob();
  });
  document.getElementById("shareJobBtn")?.addEventListener("click", shareCurrentJob);
}

function applyCurrentJob() {
  const job = getCurrentJob();
  const payload = buildStoredJobPayload(job);
  const list = getStoredList(APPLIED_JOBS_KEY);

  if (!list.some((item) => item.id === payload.id)) {
    const next = [...list, { ...payload, status: "Pending Review", appliedAt: new Date().toISOString() }];
    setStoredList(APPLIED_JOBS_KEY, next);
    syncPassport("applications", next);
  }

  showToast("تم التقديم بنجاح.");
  setTimeout(() => {
    window.location.href = "applied-jobs.html?tab=applied";
  }, 850);
}

function saveCurrentJob() {
  const job = getCurrentJob();
  const payload = buildStoredJobPayload(job);
  const list = getStoredList(SAVED_JOBS_KEY);
  const exists = list.some((item) => item.id === payload.id);
  const next = exists
    ? list.filter((item) => item.id !== payload.id)
    : [...list, { ...payload, savedAt: new Date().toISOString() }];

  setStoredList(SAVED_JOBS_KEY, next);
  syncPassport("savedJobs", next);
  showToast(exists ? "تم حذف الوظيفة من المحفوظات." : "تم حفظ الوظيفة.");
}

function shareCurrentJob() {
  const url = window.location.href;
  if (!navigator.clipboard?.writeText) {
    showToast("تعذر نسخ الرابط.");
    return;
  }

  navigator.clipboard.writeText(url)
    .then(() => showToast("تم نسخ رابط الوظيفة."))
    .catch(() => showToast("تعذر نسخ الرابط."));
}

function getCurrentJob() {
  const selected = window.localStorage.getItem(SELECTED_JOB_KEY) || "job-1";
  return JOBS.find((job) => job.id === selected) || JOBS[0];
}

function syncPassport(key, value) {
  const passport = getStoredJson(PASSPORT_KEY, {});
  if (!passport.name) return;

  passport[key] = value;
  passport.lastSeenAt = new Date().toISOString();

  if (key === "applications") {
    passport.badges = Array.from(new Set([...(passport.badges || []), "Applied Job"]));
    passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 70);
    passport.xp = Math.max(Number(passport.xp || 0), 180) + 20;
  }

  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function buildStoredJobPayload(job) {
  const analysis = analyzeJob(job, getStoredJson(PASSPORT_KEY, {}), getStoredJson(ASSESSMENT_KEY, {}));
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    match: analysis.match,
    tagsLabel: [job.workType, job.location]
  };
}

function getStoredJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") || fallback;
  } catch (error) {
    return fallback;
  }
}

function getStoredList(key) {
  const value = getStoredJson(key, []);
  return Array.isArray(value) ? value : [];
}

function setStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeSkills(items) {
  return items.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
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
  const toast = document.getElementById("detailsToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
