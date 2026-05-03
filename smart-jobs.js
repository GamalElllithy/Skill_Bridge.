const studentJobs = [
  {
    id: "job-1",
    title: "Junior Data Analyst",
    company: "TechNova",
    match: 82,
    chance: "high",
    decision: "قدّم الآن",
    reason: "مناسب لأن مهارات التحليل وPython قريبة من احتياج الدور.",
    nextStep: "راجع Advanced SQL قبل المقابلة.",
    tags: ["remote", "internship", "data"],
    tagsLabel: ["Remote", "Internship", "Data"],
    location: "Cairo / Remote",
    industry: "Data Products",
    employees: "45",
    founded: "2019",
    email: "jobs@technova.com",
    website: "technova.ai",
    companyInterests: ["Dashboards", "Business Insights", "Automation"],
    description: "تحليل بيانات وبناء تقارير واضحة تساعد فريق المنتج والإدارة.",
    requirements: ["Python", "SQL", "Dashboards"],
    missing: ["Advanced SQL"],
    urgency: "باقي 3 أيام",
    fitTrack: "data"
  },
  {
    id: "job-2",
    title: "BI Intern",
    company: "InsightFlow",
    match: 76,
    chance: "medium",
    decision: "قوّي الدليل ثم قدّم",
    reason: "التوافق جيد، لكن وجود مشروع Dashboard هيقوي موقفك جدا.",
    nextStep: "ابن Dashboard بسيط بـ Power BI.",
    tags: ["full-time", "internship", "data"],
    tagsLabel: ["Internship", "BI", "Cairo"],
    location: "Cairo",
    industry: "Business Intelligence",
    employees: "120",
    founded: "2017",
    email: "talent@insightflow.com",
    website: "insightflow.io",
    companyInterests: ["Power BI", "SQL Reporting", "KPI Tracking"],
    description: "مساعدة فريق BI في تجهيز تقارير شهرية ومتابعة مؤشرات الأداء.",
    requirements: ["Excel", "SQL", "Power BI"],
    missing: ["Power BI Project"],
    urgency: "فرصة جيدة",
    fitTrack: "data"
  },
  {
    id: "job-3",
    title: "Product Operations Intern",
    company: "BridgeLab",
    match: 68,
    chance: "medium",
    decision: "مناسب كاختيار ثاني",
    reason: "الدور مناسب لو عايز تمزج التحليل بالتنفيذ والمتابعة.",
    nextStep: "جهز Case Study صغيرة عن تنظيم عملية.",
    tags: ["hybrid", "internship", "operations"],
    tagsLabel: ["Hybrid", "Operations", "Internship"],
    location: "Alexandria / Hybrid",
    industry: "Operations Tech",
    employees: "32",
    founded: "2020",
    email: "careers@bridgelab.com",
    website: "bridgelab.co",
    companyInterests: ["Operations", "Ownership", "Execution"],
    description: "تنسيق عمليات المنتج وتحليل الأداء ومتابعة تنفيذ المهام.",
    requirements: ["Communication", "Excel", "Ownership"],
    missing: ["Operations Case Study"],
    urgency: "Quick Apply",
    fitTrack: "operations"
  }
];

const companyCandidates = [
  {
    id: "candidate-1",
    name: "جمال الليثي",
    track: "Data Analysis",
    trackKey: "data",
    university: "Cairo University",
    match: 91,
    level: "Level 3 Analyzer",
    skills: ["Python", "SQL", "Power BI"],
    dna: { analytical: 82, creative: 44, social: 58 },
    projects: ["Customer Insights Dashboard", "Retail SQL Analyzer"],
    email: "gamal@email.com",
    profile: "candidate-passport.html"
  },
  {
    id: "candidate-2",
    name: "سارة أحمد",
    track: "Product Design",
    trackKey: "design",
    university: "Ain Shams University",
    match: 84,
    level: "Level 3 Creator",
    skills: ["UX", "Figma", "Research"],
    dna: { analytical: 48, creative: 84, social: 61 },
    projects: ["Hiring Funnel Story", "Mobile App Redesign"],
    email: "sara@email.com",
    profile: "candidate-passport.html"
  },
  {
    id: "candidate-3",
    name: "عمر خالد",
    track: "Software Engineering",
    trackKey: "software",
    university: "Helwan University",
    match: 79,
    level: "Level 3 Builder",
    skills: ["JavaScript", "APIs", "React"],
    dna: { analytical: 60, creative: 52, social: 49 },
    projects: ["Task Manager", "API Dashboard"],
    email: "omar@email.com",
    profile: "candidate-passport.html"
  }
];

const learningRecommendations = [
  {
    skill: "SQL المتقدم",
    impact: "Data Analysis وBI",
    result: "أسرع خطوة ترفع فرصتك في وظائف البيانات."
  },
  {
    skill: "Power BI",
    impact: "Dashboards وتقارير",
    result: "بيحوّل مهارتك لدليل واضح قدام الشركة."
  }
];

const ROLE_KEY = "skillbridgeUserRole";
const PASSPORT_KEY = "skillbridgeTalentPassport";
const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";
const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupRoleFlow();
  setupModals();
  setupApplyForm();
  setupJobFilters();
});

function setupMenu() {
  const topbar = document.getElementById("jobsTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("scroll", () => {
    if (!topbar.classList.contains("is-open")) return;
    topbar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }, { passive: true });
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

function setupRoleFlow() {
  const roleGate = document.getElementById("roleGate");
  const authStage = document.getElementById("authStage");
  const jobsShell = document.getElementById("jobsShell");
  const loginForm = document.getElementById("roleLoginForm");
  const roleEmail = document.getElementById("roleEmail");
  const rolePassword = document.getElementById("rolePassword");
  const backToRolesBtn = document.getElementById("backToRolesBtn");
  const changeModeBtn = document.getElementById("changeModeBtn");
  const roleButtons = document.querySelectorAll("[data-role-select]");

  let selectedRole = window.localStorage.getItem(ROLE_KEY) === "company" ? "company" : "student";
  showJobsView(selectedRole);

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedRole = button.getAttribute("data-role-select") || "student";
      renderAuthCopy(selectedRole);
      roleGate?.classList.add("hidden");
      jobsShell?.classList.add("hidden");
      authStage?.classList.remove("hidden");
    });
  });

  changeModeBtn?.addEventListener("click", () => {
    if (roleEmail) roleEmail.value = "";
    if (rolePassword) rolePassword.value = "";
    jobsShell?.classList.add("hidden");
    authStage?.classList.add("hidden");
    roleGate?.classList.remove("hidden");
  });

  backToRolesBtn?.addEventListener("click", () => {
    authStage?.classList.add("hidden");
    roleGate?.classList.remove("hidden");
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailValue = roleEmail?.value.trim() || "";
    const passwordValue = rolePassword?.value.trim() || "";

    if (!emailValue || !passwordValue) {
      showToast("أدخل الإيميل وكلمة المرور أولا.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showToast("الإيميل غير صحيح.");
      return;
    }

    window.localStorage.setItem(ROLE_KEY, selectedRole);
    showJobsView(selectedRole);
    showToast(selectedRole === "student" ? "تم فتح واجهة الطالب." : "تم فتح واجهة الشركة.");
  });

  function showJobsView(role) {
    document.body.classList.toggle("company-mode", role === "company");
    roleGate?.classList.add("hidden");
    authStage?.classList.add("hidden");
    jobsShell?.classList.remove("hidden");
    renderRoleView(role);
  }
}

function renderAuthCopy(role) {
  replaceText("authEyebrow", role === "company" ? "Company Login" : "Student Login");
  replaceText("authTitle", role === "company" ? "سجل دخولك كشركة" : "سجل دخولك كطالب");
  replaceText(
    "authCopy",
    role === "company"
      ? "ادخل بحساب الشركة وشاهد المرشحين الأقرب لكل وظيفة."
      : "ادخل وشوف أقرب الفرص لك مباشرة."
  );
  replaceText("emailLabel", role === "company" ? "Company Email" : "Student Email");

  const roleEmail = document.getElementById("roleEmail");
  if (roleEmail) roleEmail.placeholder = role === "company" ? "company@email.com" : "student@email.com";

  const authBenefits = document.getElementById("authBenefits");
  if (authBenefits) {
    authBenefits.innerHTML = role === "company"
      ? "<span>Top Matches</span><span>Fast Review</span><span>Interview Ready</span>"
      : "<span>قرار سريع</span><span>فجوة واضحة</span><span>تقديم مباشر</span>";
  }
}

function renderRoleView(role) {
  const studentView = document.getElementById("studentView");
  const companyView = document.getElementById("companyView");
  const dashboardLink = document.getElementById("dashboardLink");

  studentView?.classList.toggle("hidden", role !== "student");
  companyView?.classList.toggle("hidden", role !== "company");

  if (role === "company") {
    window.localStorage.setItem(ROLE_KEY, "company");
    replaceText("heroEyebrow", "Company Smart Match");
    replaceText("heroTitle", "اختار المرشح الأسرع للقرار");
    replaceText("heroCopy", "كل وظيفة معاها أفضل مرشحين، نسبة توافق، وسبب مختصر.");
    replaceText("insightCopy", "ابدأ بالأعلى Match ثم افتح Candidate Passport للتأكد.");
    if (dashboardLink) dashboardLink.href = "company-dashboard.html";
    renderCompanyCandidates();
    return;
  }

  window.localStorage.setItem(ROLE_KEY, "student");
  replaceText("heroEyebrow", "Student Smart Jobs");
  replaceText("heroTitle", "أقرب فرصة لك الآن");
  replaceText("heroCopy", "كل بطاقة بتقول لك: هل تقدم؟ لماذا؟ وما الخطوة التالية.");
  replaceText("insightCopy", "ابدأ بأعلى Match. لو الفجوة صغيرة، قدّم. لو واضحة، نفذ الخطوة المقترحة.");
  if (dashboardLink) dashboardLink.href = "student-dashboard.html";
  renderStudentJobs();
}

function setupJobFilters() {
  document.querySelectorAll("[data-job-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-job-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderStudentJobs();
    });
  });
}

function renderStudentJobs() {
  const grid = document.getElementById("jobGrid");
  const learningGrid = document.getElementById("learningRecommendations");
  const companyPreviewGrid = document.getElementById("companyPreviewGrid");
  if (!grid || !learningGrid || !companyPreviewGrid) return;

  const activeFilter = document.querySelector("[data-job-filter].active")?.getAttribute("data-job-filter") || "all";
  const savedJobs = getStoredList(SAVED_JOBS_KEY);
  const appliedJobs = getStoredList(APPLIED_JOBS_KEY);
  const filteredJobs = studentJobs.filter((job) => activeFilter === "all" || job.tags.includes(activeFilter));
  const topJob = filteredJobs[0] || studentJobs[0];

  replaceText("topJobTitle", topJob.title);
  replaceText("topJobCompany", topJob.company);
  replaceText("topJobMatch", `${topJob.match}% Match`);
  replaceText("topJobReason", `${topJob.decision}: ${topJob.nextStep}`);

  grid.innerHTML = filteredJobs.map((job, index) => {
    const isSaved = savedJobs.some((item) => item.id === job.id);
    const isApplied = appliedJobs.some((item) => item.id === job.id);

    return `
      <article class="job-card student-job-card compact-job-card variant-${(index % 3) + 1}">
        <div class="card-top">
          <div>
            <span class="job-kicker">${escapeHtml(job.urgency)}</span>
            <strong>${escapeHtml(job.title)}</strong>
            <div class="meta-line">${escapeHtml(job.company)} - ${escapeHtml(job.location)}</div>
          </div>
          <span class="match-pill">${job.match}%</span>
        </div>
        <div class="match-progress" aria-hidden="true"><span style="width:${job.match}%"></span></div>
        <div class="decision-row">
          <span class="decision-pill">${escapeHtml(job.decision)}</span>
          <span>${escapeHtml(formatChance(job.chance))}</span>
        </div>
        <p class="job-reason">${escapeHtml(job.reason)}</p>
        <div class="next-step-strip">
          <strong>الخطوة التالية</strong>
          <span>${escapeHtml(job.nextStep)}</span>
        </div>
        <div class="job-tags">${job.tagsLabel.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="card-actions">
          <button class="primary-btn ${isApplied ? "applied-state" : ""}" type="button" data-apply-job="${job.id}">
            ${isApplied ? "Applied" : "Apply"}
          </button>
          <button class="ghost-btn" type="button" data-open-job="${job.id}">Details</button>
          <button class="ghost-btn ${isSaved ? "saved-state" : ""}" type="button" data-save-job="${job.id}">
            ${isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  companyPreviewGrid.innerHTML = studentJobs.slice(0, 2).map((company) => `
    <article class="company-preview-card compact-secondary-card">
      <div class="company-preview-head">
        <div>
          <strong>${escapeHtml(company.company)}</strong>
          <p>${escapeHtml(company.industry)}</p>
        </div>
        <span class="company-match-pill">${company.match}%</span>
      </div>
      <p class="company-preview-copy">${escapeHtml(company.companyInterests.join(" - "))}</p>
      <div class="card-actions">
        <button class="primary-btn" type="button" data-open-job="${company.id}">افتح الوظيفة</button>
        <a class="ghost-btn" href="${safeWebsite(company.website)}" target="_blank" rel="noreferrer">الموقع</a>
      </div>
    </article>
  `).join("");

  learningGrid.innerHTML = learningRecommendations.map((item) => `
    <article class="learn-card compact-secondary-card">
      <strong>${escapeHtml(item.skill)}</strong>
      <p>${escapeHtml(item.impact)}</p>
      <p>${escapeHtml(item.result)}</p>
    </article>
  `).join("");

  bindStudentActions();
}

function renderCompanyCandidates(filterTrack) {
  const grid = document.getElementById("candidateGrid");
  const companyJobsList = document.getElementById("companyJobsList");
  if (!grid || !companyJobsList) return;

  const visibleCandidates = filterTrack
    ? companyCandidates.filter((item) => item.trackKey === filterTrack)
    : companyCandidates;

  companyJobsList.innerHTML = studentJobs.map((job) => {
    const recommended = companyCandidates.filter((candidate) => {
      if (job.fitTrack === "operations") return candidate.trackKey === "software" || candidate.trackKey === "data";
      return candidate.trackKey === job.fitTrack;
    });

    return `
      <article class="company-job-card">
        <div class="company-job-top">
          <strong>${escapeHtml(job.title)}</strong>
          <div class="company-meta">${escapeHtml(job.company)} - ${escapeHtml(job.location)}</div>
          <p>${escapeHtml(job.requirements.join(" - "))}</p>
        </div>
        <div class="recommended-candidates">
          ${recommended.map((candidate) => `
            <div class="recommended-mini">
              <strong>${escapeHtml(candidate.name)}</strong>
              <p>${escapeHtml(candidate.track)}</p>
              <span class="mini-match">${candidate.match}% Match</span>
              <button class="ghost-btn" type="button" data-open-candidate="${candidate.id}">عرض المرشح</button>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");

  grid.innerHTML = visibleCandidates.map((candidate) => `
    <article class="candidate-card">
      <div class="card-top">
        <div>
          <strong>${escapeHtml(candidate.name)}</strong>
          <div class="meta-line">${escapeHtml(candidate.track)}</div>
        </div>
        <span class="match-pill">${candidate.match}%</span>
      </div>
      <p>${escapeHtml(candidate.level)} - ${escapeHtml(candidate.university)}</p>
      <div class="candidate-tags">${candidate.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="primary-btn" type="button" data-open-candidate="${candidate.id}">Details</button>
        <button class="ghost-btn" type="button" data-invite-candidate="${candidate.id}">Invite</button>
        <button class="ghost-btn" type="button" data-save-candidate="${candidate.id}">Save</button>
      </div>
    </article>
  `).join("");

  bindCompanyActions();
}

function bindStudentActions() {
  document.querySelectorAll("[data-open-job]").forEach((button) => {
    button.addEventListener("click", () => goToJobDetails(button.getAttribute("data-open-job")));
  });

  document.querySelectorAll("[data-apply-job]").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-apply-job");
      if (getStoredList(APPLIED_JOBS_KEY).some((job) => job.id === jobId)) {
        window.location.href = "applied-jobs.html?tab=applied";
        return;
      }
      openApplyModal(jobId);
    });
  });

  document.querySelectorAll("[data-save-job]").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-save-job");
      toggleSavedJob(jobId);
      renderStudentJobs();
      showToast(isJobSaved(jobId) ? "تم حفظ الوظيفة." : "تم حذفها من المحفوظات.");
    });
  });
}

function goToJobDetails(id) {
  const job = findJobById(id);
  if (!job) return;
  window.localStorage.setItem(JOB_SELECTION_KEY, job.id);
  window.location.href = "job-details.html";
}

function bindCompanyActions() {
  document.querySelectorAll("[data-open-candidate]").forEach((button) => {
    button.addEventListener("click", () => openCandidateDetails(button.getAttribute("data-open-candidate")));
  });

  document.querySelectorAll("[data-invite-candidate]").forEach((button) => {
    button.addEventListener("click", () => showToast("تم إرسال دعوة مقابلة."));
  });

  document.querySelectorAll("[data-save-candidate]").forEach((button) => {
    button.addEventListener("click", () => showToast("تم حفظ المرشح."));
  });

  document.querySelectorAll("[data-filter-candidates]").forEach((button) => {
    button.addEventListener("click", () => renderCompanyCandidates(button.getAttribute("data-filter-candidates")));
  });
}

function openCandidateDetails(id) {
  const candidate = companyCandidates.find((item) => item.id === id);
  const modalContent = document.getElementById("modalContent");
  if (!candidate || !modalContent) return;

  modalContent.innerHTML = `
    <div class="apply-head">
      <span class="eyebrow">Candidate Details</span>
      <h2>${escapeHtml(candidate.name)}</h2>
      <p>${escapeHtml(candidate.track)} - ${escapeHtml(candidate.university)}</p>
    </div>
    <div class="modal-grid">
      <section class="modal-section"><strong>Email</strong><p>${escapeHtml(candidate.email)}</p></section>
      <section class="modal-section"><strong>Level</strong><p>${escapeHtml(candidate.level)}</p></section>
      <section class="modal-section"><strong>Skills</strong><p>${candidate.skills.map(escapeHtml).join(" - ")}</p></section>
      <section class="modal-section"><strong>Projects</strong><p>${candidate.projects.map(escapeHtml).join(" - ")}</p></section>
    </div>
    <div class="card-actions modal-actions">
      <button class="primary-btn" type="button">Invite</button>
      <a class="ghost-btn" href="${escapeHtml(candidate.profile)}">Open Profile</a>
    </div>
  `;

  openModal("detailsModal");
}

function openApplyModal(id) {
  const modal = document.getElementById("applyModal");
  const success = document.getElementById("applySuccess");
  const form = document.getElementById("applyForm");
  const submitBtn = document.getElementById("submitApplicationBtn");
  if (!modal || !success || !form || !submitBtn) return;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  form.classList.remove("hidden");
  success.classList.add("hidden");
  submitBtn.setAttribute("data-current-job", id);
}

function setupApplyForm() {
  const form = document.getElementById("applyForm");
  const success = document.getElementById("applySuccess");
  if (!form || !success) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentJobId = document.getElementById("submitApplicationBtn")?.getAttribute("data-current-job");
    if (currentJobId) saveAppliedJob(currentJobId);
    form.classList.add("hidden");
    success.classList.remove("hidden");
    showToast("تم التقديم بنجاح.");
    setTimeout(() => {
      window.location.href = "applied-jobs.html?tab=applied";
    }, 850);
  });
}

function setupModals() {
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal("detailsModal"));
  });

  document.querySelectorAll("[data-close-apply]").forEach((button) => {
    button.addEventListener("click", () => closeModal("applyModal"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal("detailsModal");
    closeModal("applyModal");
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

function getPassport() {
  return getStoredJson(PASSPORT_KEY, {});
}

function savePassport(passport) {
  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
}

function getStoredJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function getStoredList(key) {
  const value = getStoredJson(key, []);
  return Array.isArray(value) ? value : [];
}

function setStoredList(key, list) {
  window.localStorage.setItem(key, JSON.stringify(list));
}

function findJobById(id) {
  return studentJobs.find((job) => job.id === id);
}

function isJobSaved(id) {
  return getStoredList(SAVED_JOBS_KEY).some((job) => job.id === id);
}

function toggleSavedJob(id) {
  const job = findJobById(id);
  if (!job) return;

  const saved = getStoredList(SAVED_JOBS_KEY);
  const exists = saved.some((item) => item.id === id);
  const next = exists ? saved.filter((item) => item.id !== id) : [...saved, job];
  setStoredList(SAVED_JOBS_KEY, next);
  syncPassportSavedJobs(next);
}

function saveAppliedJob(id) {
  const job = findJobById(id);
  if (!job) return;

  const applied = getStoredList(APPLIED_JOBS_KEY);
  if (applied.some((item) => item.id === id)) return;

  const next = [...applied, { ...job, status: "Pending Review", appliedAt: new Date().toISOString() }];
  setStoredList(APPLIED_JOBS_KEY, next);
  syncPassportApplications(next);
}

function syncPassportSavedJobs(savedJobs) {
  const passport = getPassport();
  if (!passport.name) return;

  passport.savedJobs = savedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    match: job.match
  }));
  passport.lastSeenAt = new Date().toISOString();
  savePassport(passport);
}

function syncPassportApplications(applications) {
  const passport = getPassport();
  if (!passport.name) return;

  passport.applications = applications.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    status: job.status,
    appliedAt: job.appliedAt,
    match: job.match
  }));
  passport.jobReadiness = Math.max(Number(passport.jobReadiness || 0), 70);
  passport.xp = Math.max(Number(passport.xp || 0), 140) + 20;
  passport.badges = Array.from(new Set([...(passport.badges || []), "Job Hunter"]));
  passport.lastSeenAt = new Date().toISOString();
  savePassport(passport);
}

function safeWebsite(website) {
  return website.startsWith("http") ? website : `https://${website}`;
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

function formatChance(level) {
  if (level === "high") return "High Chance";
  if (level === "medium") return "Good";
  return "Review";
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
  const toast = document.getElementById("jobsToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
