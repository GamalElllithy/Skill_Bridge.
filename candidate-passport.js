const PASSPORT_KEY = "skillbridgeTalentPassport";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const ROLE_KEY = "skillbridgeUserRole";

const DEFAULT_PROFILE = {
  name: "Gamal Ahmed",
  track: "Data Analysis",
  location: "Cairo, Egypt",
  skills: ["Python", "SQL", "Excel", "Data Cleaning"],
  strengths: ["Analytical Thinking", "Problem Solving", "Fast Learning"],
  gaps: ["Advanced SQL", "Presentation", "Dashboard Depth"],
  badges: ["Python Starter", "Fast Learner", "Data Explorer"],
  xp: 1240,
  jobReadiness: 78,
  levelLabel: "Explorer"
};

let currentPassportView = null;

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  renderPassport();
  setupActions();
});

function setupMenu() {
  const topbar = document.getElementById("passportTopbar");
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
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function renderPassport() {
  const passport = getStoredJson(PASSPORT_KEY, {});
  const assessment = getStoredJson(ASSESSMENT_KEY, {});
  const view = buildPassportView(passport, assessment);
  currentPassportView = view;

  replaceText("heroGreeting", `${view.firstName}, أنت جاهز بنسبة ${view.jobReadiness}% للوظائف`);
  replaceText("heroRole", view.roleTitle);
  replaceText("heroLocation", view.location);
  replaceText("talentSummary", view.summary);
  replaceText("jobReadyPercent", `${view.jobReadiness}%`);
  replaceText("talentScore", `${view.talentScore} / 100`);
  replaceText("xpValue", `${view.xp} XP`);
  replaceText("levelValue", view.levelLabel);
  replaceText("smartInsight", view.smartInsight);
  replaceText("passportNextMove", view.nextMove);
  replaceText("savedJobsCount", String(view.savedJobs.length));
  replaceText("applicationsCount", String(view.applications.length));
  replaceText("projectsCount", String(view.projects.length));
  replaceText("careerProgressLabel", `${view.jobReadiness}%`);
  replaceText("nextGoalText", view.nextGoal);
  replaceText("qrLabel", `QR - آخر تحديث ${view.lastUpdated}`);
  replaceText("shareHubMeta", `آخر تحديث ${view.lastUpdated} بالمهارات والشارات ونسبة الجاهزية.`);

  const avatar = document.getElementById("passportAvatar");
  if (avatar) avatar.textContent = view.avatar;

  const readinessRing = document.getElementById("readinessRing");
  if (readinessRing) {
    const circumference = 301.59;
    readinessRing.style.strokeDashoffset = `${circumference - (circumference * view.jobReadiness) / 100}`;
  }

  const progressBar = document.getElementById("careerProgressBar");
  if (progressBar) progressBar.style.width = `${view.jobReadiness}%`;

  renderDnaBars(view.dna);
  renderSkills(view.skillsWithLevels, view.badges);
  renderProjects(view.projects);
  renderMatchJobs(view.matchJobs);
  renderTimeline(view.timeline);
  renderStrengthGap(view.strengths, view.gaps);
  renderRecruiterMode(view);
  renderPdfPreview(view);
}

function buildPassportView(passport, assessment) {
  const name = cleanText(passport.name) || DEFAULT_PROFILE.name;
  const firstName = name.split(" ").filter(Boolean)[0] || "Student";
  const track = cleanText(passport.track || assessment.careerPath) || DEFAULT_PROFILE.track;
  const skills = pickList(passport.skills, DEFAULT_PROFILE.skills);
  const strengths = pickList(assessment.strengths || passport.strengths, DEFAULT_PROFILE.strengths);
  const gaps = pickList(assessment.weaknesses || passport.weaknesses, DEFAULT_PROFILE.gaps);
  const xp = clampNumber(passport.xp, DEFAULT_PROFILE.xp, 0, 100000);
  const jobReadiness = clampNumber(passport.jobReadiness || assessment.match, DEFAULT_PROFILE.jobReadiness, 35, 98);
  const projects = buildProjects(passport.projects, track);
  const savedJobs = Array.isArray(passport.savedJobs) ? passport.savedJobs : [];
  const applications = Array.isArray(passport.applications) ? passport.applications : [];
  const talentScore = Math.min(100, Math.round(jobReadiness + Math.min(strengths.length * 4, 12)));

  return {
    firstName,
    fullName: name,
    avatar: cleanText(passport.avatar) || getInitials(name),
    roleTitle: buildRoleTitle(track),
    location: cleanText(passport.location) || DEFAULT_PROFILE.location,
    summary: generateSummary(track, strengths, passport.status),
    smartInsight: generateInsight(track, gaps),
    xp,
    levelLabel: cleanText(passport.levelLabel) || DEFAULT_PROFILE.levelLabel,
    jobReadiness,
    talentScore,
    lastUpdated: formatDate(new Date()),
    skillsWithLevels: skills.map((skill, index) => ({
      name: skill,
      level: Math.max(58, 86 - index * 7)
    })),
    dna: buildDna(skills, strengths, jobReadiness),
    strengths,
    gaps,
    badges: pickList(passport.badges, DEFAULT_PROFILE.badges),
    projects,
    savedJobs,
    applications,
    matchJobs: buildMatchJobs(track, applications, savedJobs),
    nextGoal: gaps.length
      ? `تعلم ${gaps[0]} لزيادة فرصك في الوظائف المناسبة.`
      : "كمّل مشروع عملي جديد لرفع قوة البروفايل.",
    nextMove: gaps.length
      ? `ركز على ${gaps[0]} ثم افتح الوظائف المناسبة لمستواك.`
      : "افتح Smart Jobs وابدأ بأعلى فرصة match عندك.",
    timeline: buildTimeline(passport, assessment, applications)
  };
}

function buildRoleTitle(track) {
  if (/data/i.test(track)) return "Aspiring Data Analyst";
  if (/software|frontend|developer/i.test(track)) return "Aspiring Software Developer";
  if (/marketing/i.test(track)) return "Aspiring Digital Marketer";
  return `Aspiring ${track}`;
}

function buildProjects(projects, track) {
  if (Array.isArray(projects) && projects.length) {
    return projects.slice(0, 3).map((project, index) => ({
      title: cleanText(project.title) || `Project ${index + 1}`,
      summary: cleanText(project.summary) || "مشروع عملي يثبت القدرة على التطبيق وليس التعلم فقط.",
      stack: pickList(project.skills || project.stack, ["Research", "Execution", "Presentation"])
    }));
  }

  if (/software|frontend|developer/i.test(track)) {
    return [
      { title: "Task Manager App", summary: "تطبيق لإدارة المهام مع واجهة واضحة وتخزين للحالة.", stack: ["React", "APIs", "State"] },
      { title: "Portfolio Website", summary: "موقع شخصي يعرض الأعمال والمهارات بشكل احترافي.", stack: ["HTML", "CSS", "JavaScript"] }
    ];
  }

  return [
    { title: "Customer Insights Dashboard", summary: "تحليل بيانات مبيعات واستخراج insights تساعد القرار.", stack: ["Python", "SQL", "Dashboard"] },
    { title: "Retail Performance Report", summary: "تقرير مرئي يوضح الاتجاهات الرئيسية ونقاط التحسن.", stack: ["Excel", "Visualization", "Storytelling"] }
  ];
}

function buildDna(skills, strengths, readiness) {
  return [
    { label: strengths[0] || "Problem Solving", value: Math.min(96, readiness + 7) },
    { label: skills[0] || "Core Skill", value: Math.min(92, readiness + 2) },
    { label: "Communication", value: Math.max(58, readiness - 14) }
  ];
}

function buildMatchJobs(track, applications, savedJobs) {
  const base = /software|frontend|developer/i.test(track)
    ? [
        { title: "Frontend Intern", match: 80 },
        { title: "Junior Developer", match: 74 }
      ]
    : [
        { title: "Data Intern", match: 82 },
        { title: "Junior Analyst", match: 76 }
      ];

  const dynamic = applications.concat(savedJobs).slice(0, 1).map((job) => ({
    title: cleanText(job.title) || "Recommended Role",
    match: clampNumber(job.match, 78, 40, 99)
  }));

  return [...dynamic, ...base].slice(0, 3);
}

function buildTimeline(passport, assessment, applications) {
  const items = [];

  if (assessment?.careerPath || assessment?.fullTitle) {
    items.push({
      title: "تم إنشاء Talent DNA",
      copy: cleanText(assessment.fullTitle || assessment.careerPath) || "تم تحديد اتجاهك المهني الأولي."
    });
  }

  if (Array.isArray(passport.completedSteps) && passport.completedSteps.length) {
    passport.completedSteps.slice(0, 3).forEach((stepId) => {
      items.push({
        title: "تم إنهاء خطوة تعلم",
        copy: `أنهيت ${formatStepName(stepId)} وتمت إضافتها للبروفايل تلقائيا.`
      });
    });
  }

  if (applications.length) {
    const latest = applications[applications.length - 1];
    items.push({
      title: "قدمت على وظيفة",
      copy: `آخر تقديم كان على ${cleanText(latest.title) || "وظيفة مناسبة"}.`
    });
  }

  if (!items.length) {
    items.push(
      { title: "بدأت رحلتك", copy: "تم إنشاء Passport ذكي يربط التعلم والوظائف والتقدم." },
      { title: "الخطوة التالية", copy: "كمّل Learning Path لرفع Job Readiness بسرعة." }
    );
  }

  return items;
}

function generateSummary(track, strengths, status) {
  const focus = strengths.slice(0, 2).join(" و") || "التعلم السريع";
  const availability = String(status || "Available").toLowerCase() === "available"
    ? "جاهز للفرص"
    : cleanText(status);

  return `مرشح في مسار ${track} يمتلك نقاط قوة واضحة في ${focus}، وحالته الحالية ${availability}. الصفحة تجمع تقدمه ومهاراته ومشاريعه في عرض واحد يسهل تقييمه.`;
}

function generateInsight(track, gaps) {
  if (/software|frontend|developer/i.test(track)) {
    return "الشركات في هذا المسار تهتم بوجود مشاريع واضحة، تعامل مع APIs، وقدرة على شرح قراراتك التقنية.";
  }

  return `الشركات في الوظائف المشابهة تبحث كثيرا عن ${gaps[0] || "SQL"}، وتحسينها سيرفع قوة التقديم.`;
}

function renderDnaBars(items) {
  const container = document.getElementById("dnaBars");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <div class="dna-item">
      <div class="dna-head">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="dna-bar"><span style="width:${item.value}%"></span></div>
    </div>
  `).join("");
}

function renderSkills(skills, badges) {
  const skillsBox = document.getElementById("topSkills");
  const badgeBox = document.getElementById("badgeList");

  if (skillsBox) {
    skillsBox.innerHTML = skills.map((skill) => `
      <span class="skill-chip">${escapeHtml(skill.name)}<strong>${skill.level}%</strong></span>
    `).join("");
  }

  if (badgeBox) {
    badgeBox.innerHTML = badges.map((badge) => `<span class="badge-pill">${escapeHtml(badge)}</span>`).join("");
  }
}

function renderProjects(projects) {
  const container = document.getElementById("bestProjects");
  if (!container) return;

  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-cover" aria-hidden="true"></div>
      <div class="project-head">
        <strong>${escapeHtml(project.title)}</strong>
      </div>
      <p>${escapeHtml(project.summary)}</p>
      <div class="project-tech">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <a class="project-link" href="talent-dna.html">View Project</a>
    </article>
  `).join("");
}

function renderMatchJobs(jobs) {
  const container = document.getElementById("matchReadyJobs");
  if (!container) return;

  container.innerHTML = jobs.map((job) => `
    <article class="match-card">
      <div class="match-head">
        <strong>${escapeHtml(job.title)}</strong>
        <span class="match-pill">${job.match}% Match</span>
      </div>
      <p class="match-percent">جاهز للتقديم مع قابلية تحسن واضحة.</p>
      <a class="tiny-link" href="smart-jobs.html">View Jobs</a>
    </article>
  `).join("");
}

function renderTimeline(items) {
  const container = document.getElementById("growthTimeline");
  if (!container) return;

  container.innerHTML = items.map((item) => `
    <article class="timeline-item">
      <span class="timeline-dot"></span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.copy)}</span>
      </div>
    </article>
  `).join("");
}

function renderStrengthGap(strengths, gaps) {
  const strengthBox = document.getElementById("strengthList");
  const gapBox = document.getElementById("gapList");

  if (strengthBox) {
    strengthBox.innerHTML = strengths.map((item) => `<span class="stack-badge">${escapeHtml(item)}</span>`).join("");
  }

  if (gapBox) {
    gapBox.innerHTML = gaps.map((item) => `<span class="stack-gap">${escapeHtml(item)}</span>`).join("");
  }
}

function renderRecruiterMode(view) {
  const recruiterPanel = document.getElementById("recruiterPanel");
  if (!recruiterPanel) return;

  const isCompany = window.localStorage.getItem(ROLE_KEY) === "company";
  recruiterPanel.classList.toggle("hidden", !isCompany);

  if (isCompany) {
    replaceText(
      "recruiterCopy",
      `المرشح مناسب للمقابلة المبدئية ويظهر توافقا واضحا مع أدوار ${view.matchJobs[0]?.title || "Data Intern"}.`
    );
  }
}

function renderPdfPreview(view) {
  const container = document.getElementById("passportPdfPreview");
  if (!container) return;

  container.innerHTML = `
    <article class="pdf-preview-card">
      <div class="pdf-preview-head">
        <div>
          <h3>${escapeHtml(view.fullName)}</h3>
          <p>${escapeHtml(view.roleTitle)}</p>
        </div>
        <span class="match-pill">${view.jobReadiness}% Ready</span>
      </div>
      <div class="pdf-preview-meta">
        <strong>Talent Summary</strong>
        <p>${escapeHtml(view.summary)}</p>
      </div>
      <div class="pdf-preview-skills">
        ${view.skillsWithLevels.map((skill) => `<span class="skill-chip">${escapeHtml(skill.name)}<strong>${skill.level}%</strong></span>`).join("")}
      </div>
      <div class="pdf-preview-timeline">
        <strong>Growth Timeline</strong>
        ${view.timeline.slice(0, 3).map((item) => `<span>${escapeHtml(item.title)} - ${escapeHtml(item.copy)}</span>`).join("")}
      </div>
    </article>
  `;
}

function setupActions() {
  ["copyProfileBtn", "hubCopyBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", copyProfileLink);
  });

  ["shareProfileBtn", "heroShareBtn", "qrPreviewBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => openModal("passportShareModal"));
  });

  ["downloadPassportBtn", "downloadCvBtn", "hubPreviewPdfBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => openModal("passportPdfModal"));
  });

  document.getElementById("confirmPrintBtn")?.addEventListener("click", () => window.print());

  ["whatsAppShareBtn", "hubWhatsAppBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", shareViaWhatsApp);
  });

  ["emailShareBtn", "hubEmailBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", shareViaEmail);
  });

  document.getElementById("inviteInterviewBtn")?.addEventListener("click", () => {
    showToast("تم تجهيز دعوة المقابلة المبدئية.");
  });

  document.getElementById("contactCandidateBtn")?.addEventListener("click", () => {
    showToast("تم تجهيز وسيلة التواصل مع المرشح.");
  });

  document.querySelectorAll("[data-close-share]").forEach((button) => {
    button.addEventListener("click", () => closeModal("passportShareModal"));
  });

  document.querySelectorAll("[data-close-pdf]").forEach((button) => {
    button.addEventListener("click", () => closeModal("passportPdfModal"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal("passportShareModal");
    closeModal("passportPdfModal");
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function shareViaWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Candidate Passport على SkillBridge - ${currentPassportView?.roleTitle || "Profile"}`);
  window.open(`https://wa.me/?text=${text}%20${url}`, "_blank", "noopener,noreferrer");
}

function shareViaEmail() {
  const subject = encodeURIComponent("Candidate Passport");
  const body = encodeURIComponent(`Here is my Candidate Passport: ${window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copyProfileLink() {
  const url = window.location.href;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showToast("تم نسخ رابط البروفايل."))
      .catch(() => showToast("تعذر نسخ الرابط، يمكنك نسخه يدويا."));
    return;
  }

  showToast("تعذر نسخ الرابط، يمكنك نسخه يدويا.");
}

function pickList(value, fallback) {
  const list = Array.isArray(value) ? value.map(cleanText).filter(Boolean) : [];
  return list.length ? list : fallback;
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function getStoredJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function formatStepName(stepId) {
  const labels = {
    foundations: "Step 1 - Foundations",
    practice: "Step 2 - Practice",
    advanced: "Step 3 - Advanced"
  };

  return labels[stepId] || cleanText(stepId);
}

function getInitials(name) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return initials || "ST";
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function replaceText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
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
  const toast = document.getElementById("passportToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
