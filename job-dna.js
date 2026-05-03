const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const ROLE_KEY = "skillbridgeUserRole";
const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";
const NOTES_KEY = "skillbridgeRecruiterNotes";

const JOB_LIBRARY = [
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    company: "PixelForge",
    location: "Remote",
    level: "Junior",
    requiredSkills: [
      { name: "HTML", priority: "core" },
      { name: "CSS", priority: "core" },
      { name: "JavaScript", priority: "core" },
      { name: "React", priority: "high" }
    ],
    softSkills: ["Communication", "Problem Solving", "Ownership"],
    projectsNeed: 2,
    summary: "بناء واجهات منتج سريعة ومنظمة مع اهتمام واضح بالتجربة.",
    similarJobs: [
      { title: "Frontend Intern", matchBoost: 8 },
      { title: "UI Engineer", matchBoost: 5 }
    ],
    recommendations: [
      { label: "Complete React Path", gain: 10 },
      { label: "Build 1 Frontend Project", gain: 7 },
      { label: "Practice API Integration", gain: 5 }
    ]
  },
  {
    id: "data-analyst",
    title: "Junior Data Analyst",
    company: "TechNova",
    location: "Cairo / Remote",
    level: "Junior",
    requiredSkills: [
      { name: "Python", priority: "core" },
      { name: "SQL", priority: "high" },
      { name: "Excel", priority: "core" },
      { name: "Visualization", priority: "high" }
    ],
    softSkills: ["Analytical Thinking", "Communication", "Accuracy"],
    projectsNeed: 2,
    summary: "تحويل بيانات الأعمال إلى تقارير وقرارات واضحة.",
    similarJobs: [
      { title: "Data Intern", matchBoost: 7 },
      { title: "BI Intern", matchBoost: 5 }
    ],
    recommendations: [
      { label: "Complete SQL Path", gain: 10 },
      { label: "Build 1 Dashboard", gain: 7 },
      { label: "Practice Business Storytelling", gain: 4 }
    ]
  },
  {
    id: "product-ops",
    title: "Product Operations Intern",
    company: "BridgeLab",
    location: "Alexandria / Hybrid",
    level: "Internship",
    requiredSkills: [
      { name: "Excel", priority: "core" },
      { name: "Communication", priority: "high" },
      { name: "Ownership", priority: "high" },
      { name: "Reporting", priority: "medium" }
    ],
    softSkills: ["Speed", "Problem Solving", "Follow-up"],
    projectsNeed: 1,
    summary: "تنظيم ومتابعة التنفيذ وتحويل الفوضى إلى خطوات واضحة.",
    similarJobs: [
      { title: "Operations Intern", matchBoost: 8 },
      { title: "Project Coordinator", matchBoost: 4 }
    ],
    recommendations: [
      { label: "Practice Reporting", gain: 8 },
      { label: "Build 1 Execution Case", gain: 6 },
      { label: "Improve Stakeholder Updates", gain: 4 }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupDnaTabs();
  renderJobDna();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("jobTopbar");
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

function setupDnaTabs() {
  document.querySelectorAll("[data-dna-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-dna-tab");
      document.querySelectorAll("[data-dna-tab]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-dna-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-dna-panel") === target);
      });
    });
  });
}

function renderJobDna() {
  const passport = getPassport();
  const assessment = getAssessment();
  const currentJob = getCurrentJob();
  const analysis = analyzeMatch(currentJob, passport, assessment);

  renderHero(currentJob, analysis);
  renderPicker(currentJob.id);
  renderBreakdown(analysis.breakdown);
  renderJobStructure(currentJob);
  renderComparison(analysis.comparison);
  renderGaps(analysis.gaps);
  renderBoostPlan(currentJob, analysis.overall);
  renderGrowth(analysis.overall, currentJob.recommendations);
  renderMatchReady(currentJob, analysis.overall);
  renderRecruiterSections(currentJob, analysis);
}

function renderHero(job, analysis) {
  replaceText("jobTitle", job.title);
  replaceText("jobCompany", `${job.company} - ${job.location}`);
  replaceText("overallMatch", `${analysis.overall}%`);
  replaceText("quickSummary", analysis.quickSummary);
  replaceText("whyMatchCopy", analysis.aiExplanation);
  replaceText("decisionTitle", analysis.decision.title);
  replaceText("decisionCopy", analysis.decision.copy);
  replaceText("timeToHire", analysis.timeToHire);
  replaceText("aiRecommendation", analysis.aiRecommendation);

  const ring = document.getElementById("matchRing");
  if (ring) {
    const circumference = 301.59;
    ring.style.strokeDashoffset = `${circumference - (circumference * analysis.overall) / 100}`;
  }

  const decisionBox = document.getElementById("decisionBox");
  if (decisionBox) {
    decisionBox.classList.remove("strong", "medium", "low");
    decisionBox.classList.add(analysis.decision.className);
  }
}

function renderPicker(activeId) {
  const picker = document.getElementById("jobPicker");
  if (!picker) return;

  picker.innerHTML = JOB_LIBRARY.map((job) => `
    <button class="picker-btn ${job.id === activeId ? "active" : ""}" type="button" data-job-pick="${escapeHtml(job.id)}">
      <strong>${escapeHtml(job.title)}</strong>
      <span>${escapeHtml(job.company)}</span>
    </button>
  `).join("");

  picker.querySelectorAll("[data-job-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      window.localStorage.setItem(JOB_SELECTION_KEY, button.getAttribute("data-job-pick"));
      renderJobDna();
      showToast("تم تحديث تحليل الوظيفة.");
    });
  });
}

function renderBreakdown(items) {
  const container = document.getElementById("breakdownList");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <article class="breakdown-item" data-score="${item.value}">
      <div class="breakdown-item-head">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${item.value}%</span>
      </div>
      <p>${escapeHtml(item.copy)}</p>
      <div class="bar-track"><span style="width:${item.value}%"></span></div>
    </article>
  `).join("");
}

function renderJobStructure(job) {
  setChipList("requiredSkills", job.requiredSkills.map((skill) => skill.name), "dna-chip");
  setChipList("softSkills", job.softSkills, "soft-chip");
  replaceText("jobLevel", job.level);
}

function renderComparison(rows) {
  const container = document.getElementById("comparisonRows");
  if (!container) return;

  container.innerHTML = rows.map((row) => `
    <div class="comparison-row">
      <strong>${escapeHtml(row.skill)}</strong>
      <span class="${row.hasSkill ? "yes" : "no"}">${row.hasSkill ? "Ready" : "Gap"}</span>
      <span>Required</span>
      <span class="${row.confidence >= 70 ? "confidence-strong" : "confidence-weak"}">${row.confidence}%</span>
    </div>
  `).join("");
}

function renderGaps(gaps) {
  const container = document.getElementById("gapGrid");
  if (!container) return;

  if (!gaps.length) {
    container.innerHTML = `
      <article class="gap-card medium">
        <strong>جاهز تقريبا</strong>
        <p>لا توجد فجوة حرجة. ركز على مشروع أقوى ورسالة تقديم مختصرة.</p>
        <div class="gap-actions">
          <a class="tiny-btn" href="smart-jobs.html">Go To Jobs</a>
        </div>
      </article>
    `;
    return;
  }

  container.innerHTML = gaps.slice(0, 3).map((gap, index) => `
    <article class="gap-card ${gap.priority}">
      <span class="gap-rank">${index + 1}</span>
      <strong>${escapeHtml(gap.skill)}</strong>
      <p>${gap.priority === "high" ? "أولوية عالية" : "أولوية متوسطة"}</p>
      <p>${escapeHtml(gap.copy)}</p>
      <div class="gap-actions">
        <a class="tiny-btn" href="learning-path.html">Start Learning</a>
      </div>
    </article>
  `).join("");
}

function renderBoostPlan(job, currentMatch) {
  const container = document.getElementById("boostList");
  if (!container) return;

  let projected = currentMatch;
  container.innerHTML = job.recommendations.map((item, index) => {
    projected = Math.min(99, projected + item.gain);
    return `
      <button class="boost-card" type="button" data-boost-step="${index}">
        <div class="boost-head">
          <strong>${escapeHtml(item.label)}</strong>
          <span class="boost-gain">+${item.gain}%</span>
        </div>
        <p>بعد الخطوة دي قد تصل إلى ${projected}% Match</p>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-boost-step]").forEach((button) => {
    button.addEventListener("click", () => {
      container.querySelectorAll(".boost-card").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      showToast("اختيار ممتاز. افتح Learning Path لتنفيذ الخطوة.");
    });
  });
}

function renderGrowth(currentMatch, recommendations) {
  const container = document.getElementById("growthProjection");
  if (!container) return;

  const week = Math.min(99, currentMatch + (recommendations[0]?.gain || 8));
  const month = Math.min(99, week + (recommendations[1]?.gain || 7) + (recommendations[2]?.gain || 5));

  container.innerHTML = `
    <article class="growth-card"><strong>الآن</strong><span class="growth-value">${currentMatch}%</span></article>
    <article class="growth-card"><strong>بعد خطوة</strong><span class="growth-value">${week}%</span></article>
    <article class="growth-card"><strong>بعد مشروع</strong><span class="growth-value">${month}%</span></article>
  `;
}

function renderMatchReady(job, currentMatch) {
  const container = document.getElementById("matchReadyJobs");
  if (!container) return;

  container.innerHTML = job.similarJobs.map((item) => `
    <article class="match-ready-card">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${Math.min(99, currentMatch + item.matchBoost)}% Match</p>
      <a href="smart-jobs.html">View Jobs</a>
    </article>
  `).join("");
}

function renderRecruiterSections(job, analysis) {
  const isCompany = window.localStorage.getItem(ROLE_KEY) === "company";
  toggleHidden("candidateRankingPanel", !isCompany);
  toggleHidden("redFlagsPanel", !isCompany);
  toggleHidden("notesPanel", !isCompany);
  if (!isCompany) return;

  const ranking = document.getElementById("candidateRanking");
  const flags = document.getElementById("redFlags");
  const notes = document.getElementById("recruiterNotes");

  if (ranking) {
    ranking.innerHTML = buildCandidateRanking(job).map((item) => `
      <article class="ranking-item">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.copy)}</span>
        </div>
        <span class="ranking-pill">${item.match}%</span>
      </article>
    `).join("");
  }

  if (flags) {
    const items = analysis.redFlags.length ? analysis.redFlags : ["No critical red flags"];
    flags.innerHTML = items.map((item) => `
      <article class="flag-item">
        <strong>${escapeHtml(item)}</strong>
        <span>راجعها قبل القرار النهائي</span>
      </article>
    `).join("");
  }

  if (notes) notes.value = getRecruiterNotes(job.id);
}

function setupActions() {
  ["heroApplyBtn", "applyNowBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      saveAppliedJob(getCurrentJob().id);
      showToast("تم حفظ الوظيفة داخل Applied Jobs.");
      setTimeout(() => {
        window.location.href = "applied-jobs.html";
      }, 850);
    });
  });

  document.getElementById("saveJobBtn")?.addEventListener("click", () => {
    toggleSavedJob(getCurrentJob().id);
    showToast("تم تحديث حالة حفظ الوظيفة.");
  });

  document.getElementById("improveMatchBtn")?.addEventListener("click", () => {
    window.location.href = "learning-path.html";
  });

  document.getElementById("saveNotesBtn")?.addEventListener("click", () => {
    const jobId = getCurrentJob().id;
    const notes = document.getElementById("recruiterNotes")?.value.trim() || "";
    saveRecruiterNotes(jobId, notes);
    showToast("تم حفظ ملاحظات الشركة.");
  });
}

function analyzeMatch(job, passport, assessment) {
  const userSkills = normalizeSkills([...(passport.skills || []), ...(assessment?.strengths || [])]);
  const requiredSkills = job.requiredSkills.map((skill) => skill.name);
  const matchedSkills = requiredSkills.filter((skill) => userSkills.includes(skill.toLowerCase()));
  const skillsMatch = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  const projectsCount = Array.isArray(passport.projects) ? passport.projects.length : 0;
  const experience = clampNumber(40 + projectsCount * 20 + Math.floor(Number(passport.xp || 0) / 120), 0, 100);
  const projectsScore = clampNumber(Math.round((projectsCount / Math.max(job.projectsNeed, 1)) * 100), 0, 100);
  const learningProgress = clampNumber(Number(passport.learningProgress || passport.jobReadiness || 35), 0, 100);
  const overall = Math.round((skillsMatch * 0.38) + (experience * 0.2) + (projectsScore * 0.22) + (learningProgress * 0.2));

  const comparison = requiredSkills.map((skill) => {
    const hasSkill = userSkills.includes(skill.toLowerCase());
    return {
      skill,
      hasSkill,
      confidence: hasSkill ? Math.min(96, 64 + Math.floor((passport.jobReadiness || 50) / 2)) : 42
    };
  });

  const gaps = requiredSkills
    .filter((skill) => !userSkills.includes(skill.toLowerCase()))
    .map((skill, index) => ({
      skill,
      priority: index === 0 ? "high" : "medium",
      copy: index === 0
        ? `إتقان ${skill} يرفع فرصة قبولك مباشرة في ${job.title}.`
        : `إضافتها تقوي الثقة وتسرع قرار الشركة.`
    }));

  const breakdown = [
    { label: "Skills", value: skillsMatch, copy: "مطابقة مهاراتك مع المطلوب." },
    { label: "Projects", value: projectsScore, copy: "قوة الدليل العملي." },
    { label: "Experience", value: experience, copy: "XP والخبرة التطبيقية." },
    { label: "Learning", value: learningProgress, copy: "استمرارية التعلم." }
  ];

  const nextGap = gaps[0]?.skill || "Project Depth";
  const strongCopy = matchedSkills.slice(0, 2).join(" و") || "الأساسيات";
  const quickSummary = `قرار سريع: ${overall}% Match. قوي في ${strongCopy}. الخطوة التالية: ${nextGap}.`;
  const aiExplanation = `أنت قريب من الوظيفة لأن عندك ${strongCopy}. أكبر فجوة الآن هي ${nextGap}.`;
  const decision = getDecision(overall, gaps.length);
  const aiRecommendation = overall >= 80
    ? "جاهز لمقابلة أو task عملي قصير."
    : `نفذ ${nextGap} أولا ثم ارجع للتقديم بثقة أعلى.`;
  const timeToHire = overall >= 85 ? "Ready Now" : overall >= 70 ? "2 Weeks" : "4 Weeks";
  const redFlags = [];

  if (projectsCount === 0) redFlags.push("No real projects yet");
  if (gaps.length >= 2) redFlags.push("Missing key skills for this job");
  if ((passport.learningProgress || 0) < 30) redFlags.push("Low learning consistency");

  return {
    overall,
    breakdown,
    comparison,
    gaps,
    quickSummary,
    aiExplanation,
    decision,
    aiRecommendation,
    timeToHire,
    redFlags
  };
}

function getDecision(match, gapsCount) {
  if (match >= 82 && gapsCount <= 1) {
    return {
      title: "Strong Candidate",
      copy: "جاهز للمقابلة أو لاختبار عملي قصير.",
      className: "strong"
    };
  }

  if (match >= 65) {
    return {
      title: "Improve Then Apply",
      copy: "واعد، لكن اقفل فجوة واحدة قبل القرار النهائي.",
      className: "medium"
    };
  }

  return {
    title: "Not Ready Yet",
    copy: "الأفضل تقوية الأساسيات قبل التقديم.",
    className: "low"
  };
}

function buildCandidateRanking(job) {
  const base = [
    { name: "Ahmed", skills: ["HTML", "CSS", "JavaScript", "React"], xp: 1350, progress: 82 },
    { name: "Gamal", skills: getPassport().skills || [], xp: Number(getPassport().xp || 0), progress: Number(getPassport().jobReadiness || 0) },
    { name: "Sara", skills: ["HTML", "CSS", "JavaScript"], xp: 1020, progress: 72 }
  ];

  return base.map((candidate) => {
    const matched = job.requiredSkills.filter((skill) => normalizeSkills(candidate.skills).includes(skill.name.toLowerCase())).length;
    const match = Math.round(((matched / job.requiredSkills.length) * 60) + Math.min(40, candidate.progress * 0.4));
    return {
      name: candidate.name,
      match,
      copy: match >= 80 ? "جاهز للمقابلة" : "يحتاج خطوة تطوير"
    };
  }).sort((a, b) => b.match - a.match);
}

function getCurrentJob() {
  const selectedId = window.localStorage.getItem(JOB_SELECTION_KEY);
  const fromApplied = getStoredList(APPLIED_JOBS_KEY)[0];
  const fromSaved = getStoredList(SAVED_JOBS_KEY)[0];

  if (selectedId) {
    const selected = JOB_LIBRARY.find((job) => job.id === selectedId);
    if (selected) return selected;
  }

  return mapStoredJobToLibrary(fromApplied?.title) || mapStoredJobToLibrary(fromSaved?.title) || JOB_LIBRARY[0];
}

function mapStoredJobToLibrary(title) {
  return JOB_LIBRARY.find((job) => job.title.toLowerCase() === String(title || "").toLowerCase());
}

function normalizeSkills(skills) {
  return skills.map((skill) => String(skill).trim().toLowerCase()).filter(Boolean);
}

function setChipList(id, items, className) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = items.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("");
}

function toggleSavedJob(jobId) {
  const job = JOB_LIBRARY.find((item) => item.id === jobId);
  if (!job) return;
  const saved = getStoredList(SAVED_JOBS_KEY);
  const exists = saved.some((item) => item.id === jobId || item.title === job.title);
  const next = exists
    ? saved.filter((item) => item.id !== jobId && item.title !== job.title)
    : [...saved, { id: job.id, title: job.title, company: job.company, match: 0 }];
  setStoredList(SAVED_JOBS_KEY, next);
  syncPassport("savedJobs", next);
}

function saveAppliedJob(jobId) {
  const job = JOB_LIBRARY.find((item) => item.id === jobId);
  if (!job) return;
  const applied = getStoredList(APPLIED_JOBS_KEY);
  if (applied.some((item) => item.id === jobId || item.title === job.title)) return;
  const next = [...applied, {
    id: job.id,
    title: job.title,
    company: job.company,
    match: 0,
    status: "Pending Review",
    appliedAt: new Date().toISOString()
  }];
  setStoredList(APPLIED_JOBS_KEY, next);
  syncPassport("applications", next);
}

function syncPassport(key, value) {
  const passport = getPassport();
  if (!passport.name) return;
  passport[key] = value;
  if (key === "applications") {
    passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 72);
    passport.badges = Array.from(new Set([...(passport.badges || []), "Job Hunter"]));
  }
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function getStoredList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function setStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getPassport() {
  const fallback = {
    name: "Gamal Ahmed",
    skills: ["HTML", "CSS", "JavaScript"],
    xp: 900,
    jobReadiness: 68,
    learningProgress: 45,
    projects: [{ title: "Starter Project" }]
  };

  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || fallback;
  } catch (error) {
    return fallback;
  }
}

function getAssessment() {
  try {
    return JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getRecruiterNotes(jobId) {
  try {
    const notes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
    return notes[jobId] || "";
  } catch (error) {
    return "";
  }
}

function saveRecruiterNotes(jobId, text) {
  let notes = {};
  try {
    notes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
  } catch (error) {
    notes = {};
  }
  notes[jobId] = text;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function toggleHidden(id, hidden) {
  const element = document.getElementById(id);
  if (element) element.classList.toggle("hidden", hidden);
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) element.textContent = value;
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
  const toast = document.getElementById("jobDnaToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
