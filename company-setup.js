const COMPANY_SETUP_KEY = "skillbridgeCompanySetup";
const ROLE_KEY = "skillbridgeUserRole";

const industryMap = {
  default: {
    subfields: ["General Tech", "Digital Products", "Services"],
    skills: ["Communication", "Problem Solving", "Ownership"],
    suggestions: [
      "ابدأ بدورين أساسيين فقط.",
      "خلي الحد الأدنى للـ Match واضح.",
      "أضف قيم الشركة لتحسين جودة الترشيح."
    ]
  },
  tech: {
    subfields: ["SaaS", "Web Products", "Developer Tools"],
    skills: ["JavaScript", "React", "APIs", "Problem Solving"],
    suggestions: [
      "ابدأ بـ Frontend وData لو محتاج تنوع سريع.",
      "حدد الـ core stack عشان الـ matching يبقى أدق.",
      "Fast learners مناسبين جدا لفرق التقنية الصغيرة."
    ]
  },
  ai: {
    subfields: ["Machine Learning", "Data Platforms", "Analytics"],
    skills: ["Python", "SQL", "Data Visualization", "Analytical Thinking"],
    suggestions: [
      "اطلب مشروع بيانات واضح بدل قائمة مهارات طويلة.",
      "اجعل Internship Friendly مفعلة لو عايز junior pool قوي.",
      "Python وSQL لازم يكونوا في أولويات الترشيح."
    ]
  },
  fintech: {
    subfields: ["Payments", "Lending", "Risk", "Banking Tech"],
    skills: ["SQL", "Accuracy", "Ownership", "Compliance Mindset"],
    suggestions: [
      "ارفع الحد الأدنى للـ Match لو الدور حساس.",
      "اختار Careful لو القرار محتاج مراجعة دقيقة.",
      "Culture tags زي reliable وstructured مهمة هنا."
    ]
  },
  design: {
    subfields: ["Brand", "Product Design", "Creative Studio"],
    skills: ["Figma", "Research", "Storytelling", "Creative Thinking"],
    suggestions: [
      "البورتفوليو أهم من عدد المهارات.",
      "UI/UX وMarketing مناسبين للأدوار الهجينة.",
      "اختار traits زي creative وfast learner."
    ]
  }
};

const stepMessages = [
  "هوية الشركة تكفي الآن: اسم، مكان، ومهمة مختصرة.",
  "المجال يحدد المهارات والتوصيات تلقائيا.",
  "الحجم وأسلوب التوظيف يضبطان سرعة الترشيح.",
  "اختار أهم الأدوار فقط عشان النتائج تبقى دقيقة.",
  "هنا نحدد شكل المرشح المناسب للشركة.",
  "راجع الإعدادات وشغل الترشيحات الذكية."
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupIntro();
  setupWizard();
});

function setupMenu() {
  const topbar = document.getElementById("setupTopbar");
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

function setupIntro() {
  const intro = document.getElementById("setupIntro");
  const start = document.getElementById("startSetupBtn");
  const continueBtn = document.getElementById("continueSavedBtn");
  const saved = getCompanySetup();

  if (continueBtn && (!saved.companyName && !saved.industry)) {
    continueBtn.textContent = "Use Smart Defaults";
  }

  start?.addEventListener("click", closeIntro);

  continueBtn?.addEventListener("click", () => {
    closeIntro();
    if (saved.companyName || saved.industry) {
      showToast("تم تحميل الإعداد المحفوظ.");
      return;
    }

    applySmartDefaults();
    showToast("تم تطبيق إعدادات ذكية كبداية.");
  });

  function closeIntro() {
    intro?.classList.add("hidden");
    intro?.setAttribute("aria-hidden", "true");
  }
}

function setupWizard() {
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const next = document.getElementById("nextStepBtn");
  const prev = document.getElementById("prevStepBtn");
  const finish = document.getElementById("finishSetupBtn");
  const reset = document.getElementById("resetSetupBtn");
  const saveLater = document.getElementById("saveLaterBtn");
  const saveLaterTop = document.getElementById("saveLaterTopBtn");

  if (!steps.length || !next || !prev || !finish) return;

  hydrateFromStorage();
  wireDynamicInputs();
  updateIndustryUi(getValue("companyIndustry") || "default");

  let current = clampStep(Number(getCompanySetup().currentStep || 0), steps.length);

  function render() {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));

    const progress = Math.round(((current + 1) / steps.length) * 100);
    const score = calculateSetupScore();
    const progressBar = document.getElementById("setupProgressBar");

    replaceText("progressLabel", `Step ${current + 1} / ${steps.length}`);
    replaceText("progressCopy", stepMessages[current]);
    replaceText("setupScoreValue", `${score}%`);
    if (progressBar) progressBar.style.width = `${progress}%`;

    prev.classList.toggle("hidden", current === 0);
    next.classList.toggle("hidden", current === steps.length - 1);
    finish.classList.toggle("hidden", current !== steps.length - 1);

    document.body.style.setProperty("--setup-progress", `${progress}%`);
    persistCurrentStep(current);
    updatePreview(current);
  }

  next.addEventListener("click", () => {
    if (!validateStep(current)) return;
    if (current < steps.length - 1) {
      current += 1;
      render();
    }
  });

  prev.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      render();
    }
  });

  finish.addEventListener("click", () => {
    if (!validateStep(current)) return;
    const profile = buildCompanyProfile(true);
    window.localStorage.setItem(ROLE_KEY, "company");
    window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(profile));
    showToast("Company DNA جاهز. هنفتح الداشبورد.");
    setTimeout(() => {
      window.location.href = "company-dashboard.html";
    }, 850);
  });

  reset?.addEventListener("click", () => {
    window.localStorage.removeItem(COMPANY_SETUP_KEY);
    window.location.reload();
  });

  [saveLater, saveLaterTop].forEach((button) => {
    button?.addEventListener("click", () => {
      window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(buildCompanyProfile(false)));
      showToast("تم حفظ الإعداد ويمكنك الرجوع لاحقا.");
    });
  });

  render();
}

function wireDynamicInputs() {
  const industry = document.getElementById("companyIndustry");
  const minimumMatch = document.getElementById("minimumMatch");
  const timeline = document.getElementById("hiringTimeline");

  document.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => updatePreview());
    field.addEventListener("change", () => updatePreview());
  });

  document.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => {
      setSingleActive("[data-size]", button);
      applySizeDefaults(button.getAttribute("data-size"));
      updatePreview();
    });
  });

  document.querySelectorAll("[data-style]").forEach((button) => {
    button.addEventListener("click", () => {
      setSingleActive("[data-style]", button);
      updatePreview();
    });
  });

  ["role", "personality", "culture"].forEach((name) => {
    document.querySelectorAll(`[data-${name}]`).forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        updatePreview();
      });
    });
  });

  industry?.addEventListener("change", () => {
    updateIndustryUi(industry.value || "default");
    updatePreview();
  });

  minimumMatch?.addEventListener("input", () => {
    replaceText("minimumMatchValue", `${minimumMatch.value}%`);
  });

  timeline?.addEventListener("input", () => {
    replaceText("hiringTimelineValue", mapTimelineValue(timeline.value));
  });
}

function updatePreview(currentStep) {
  const profile = buildCompanyProfile(false);
  const industryData = industryMap[profile.industry || "default"] || industryMap.default;
  const current = Number.isFinite(currentStep) ? currentStep : Number(getCompanySetup().currentStep || 0);

  document.body.setAttribute("data-industry", profile.industry || "default");
  window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify({ ...profile, currentStep: current }));

  const logo = document.getElementById("previewLogo");
  if (logo) logo.textContent = profile.logo || "SB";

  replaceText("previewCompanyName", profile.companyName || "Your Company");
  replaceText("previewIndustry", `${profile.industryLabel || "Industry"} - ${profile.subfield || "Focus"}`);
  replaceText("previewMission", profile.mission || "بطاقة الشركة تظهر هنا مباشرة أثناء الإعداد.");
  replaceText("previewLocation", profile.location || "Remote");
  replaceText("previewWebsite", profile.website || "company.com");
  replaceText("dnaStatus", profile.roles.length ? "Ready" : "Building");

  renderPreviewRoles(profile);
  renderSubfields(profile.industry || "default");
  renderSuggestions(industryData, profile);
  renderSimulation(profile);
  renderAiPreview(profile, industryData);

  replaceText("setupScoreValue", `${calculateSetupScore()}%`);
}

function renderPreviewRoles(profile) {
  const roles = document.getElementById("previewRoles");
  if (!roles) return;

  roles.innerHTML = profile.roles.length
    ? profile.roles.slice(0, 4).map((role) => `<span>${escapeHtml(role)}</span>`).join("")
    : "<span>اختار الأدوار الأساسية</span>";
}

function renderSubfields(industryKey) {
  const subfield = document.getElementById("companySubfield");
  if (!subfield) return;

  const currentValue = subfield.value;
  const options = (industryMap[industryKey] || industryMap.default).subfields;
  subfield.innerHTML = `<option value="">Choose Sub-field</option>${options.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
  if (options.includes(currentValue)) subfield.value = currentValue;
}

function renderSuggestions(industryData, profile) {
  const skillsBox = document.getElementById("suggestedSkills");
  const suggestionList = document.getElementById("smartSuggestions");

  if (skillsBox) {
    skillsBox.innerHTML = industryData.skills
      .map((skill) => `<button class="role-tag active" type="button">${escapeHtml(skill)}</button>`)
      .join("");
  }

  if (suggestionList) {
    suggestionList.innerHTML = industryData.suggestions.slice(0, 3).map((item, index) => `
      <article class="suggestion-item">
        <strong>${index + 1}</strong>
        <span>${escapeHtml(item)}</span>
      </article>
    `).join("");
  }
}

function renderSimulation(profile) {
  const rolesWeight = Math.min(profile.roles.length * 8, 24);
  const minimumMatchValue = Number(profile.minimumMatch || 70);
  const learnersBoost = profile.acceptLearners ? 8 : 0;
  const internshipBoost = profile.internshipFriendly ? 6 : 0;
  const styleBoost = profile.hiringStyle === "Fast" ? 5 : profile.hiringStyle === "Careful" ? -2 : 2;
  const simulation = Math.max(52, Math.min(96, 48 + rolesWeight + learnersBoost + internshipBoost + styleBoost - Math.round((minimumMatchValue - 60) * 0.35)));
  const bar = document.getElementById("simulationBar");

  replaceText("simulationValue", `${simulation}%`);
  replaceText("simulationCopy", `توقع جودة أعلى للمرشحين عند ${profile.minimumMatch}% Match مع ${profile.hiringStyle} hiring.`);
  if (bar) bar.style.width = `${simulation}%`;
}

function renderAiPreview(profile, industryData) {
  const roleText = profile.roles.length ? profile.roles.join(" / ") : "Talent";
  const personality = profile.personalities.length ? profile.personalities.join(", ") : "Fast Learner";
  const skillLevel = profile.skillLevel || "Beginner";

  replaceText(
    "aiPreviewText",
    `هنرشح ${skillLevel} ${roleText} بصفات ${personality} ومع أساس قوي في ${industryData.skills[0]}.`
  );
}

function validateStep(index) {
  const validations = [
    () => !!getValue("companyName") && !!getValue("companyLocation"),
    () => !!getValue("companyIndustry") && !!getValue("companySubfield"),
    () => hasActive("[data-size]") && hasActive("[data-style]"),
    () => getActiveValues("[data-role]").length > 0,
    () => !!getValue("skillLevel") && !!getValue("workStyle") && getActiveValues("[data-personality]").length > 0,
    () => true
  ];

  const ok = validations[index] ? validations[index]() : true;
  if (!ok) showToast("كمّل بيانات الخطوة الحالية أولا.");
  return ok;
}

function buildCompanyProfile(markReady) {
  const industryKey = getValue("companyIndustry") || "default";
  const size = getSingleActiveValue("[data-size]") || "Startup";
  const hiringStyle = getSingleActiveValue("[data-style]") || "Fast";

  return {
    companyName: getValue("companyName") || "Your Company",
    logo: getValue("companyLogo") || getInitials(getValue("companyName") || "SkillBridge"),
    location: getValue("companyLocation") || "Remote",
    website: getValue("companyWebsite") || "company.com",
    mission: getValue("companyMission") || "Smart hiring profile focused on better matching and faster decisions.",
    industry: industryKey,
    industryLabel: toLabel(industryKey),
    subfield: getValue("companySubfield") || "General Tech",
    size,
    hiringStyle,
    roles: getActiveValues("[data-role]"),
    coreTech: splitTags(getValue("coreTech")),
    skillLevel: getValue("skillLevel") || "Beginner",
    workStyle: getValue("workStyle") || "Remote",
    personalities: getActiveValues("[data-personality]"),
    cultureTags: getActiveValues("[data-culture]"),
    minimumMatch: Number(getValue("minimumMatch") || 70),
    hiringTimeline: mapTimelineValue(getValue("hiringTimeline") || 2),
    acceptLearners: document.getElementById("acceptLearners")?.checked || false,
    internshipFriendly: document.getElementById("internshipFriendly")?.checked || false,
    setupScore: calculateSetupScore(),
    currentStep: Number(document.getElementById("progressLabel")?.textContent.match(/\d+/)?.[0] || 1) - 1,
    isReady: !!markReady,
    updatedAt: new Date().toISOString()
  };
}

function calculateSetupScore() {
  const checks = [
    !!getValue("companyName"),
    !!getValue("companyLocation"),
    !!getValue("companyIndustry"),
    !!getValue("companySubfield"),
    hasActive("[data-size]"),
    hasActive("[data-style]"),
    getActiveValues("[data-role]").length > 0,
    !!getValue("skillLevel"),
    !!getValue("workStyle"),
    getActiveValues("[data-personality]").length > 0,
    Number(getValue("minimumMatch") || 70) >= 50
  ];

  return Math.max(Math.round((checks.filter(Boolean).length / checks.length) * 100), 15);
}

function hydrateFromStorage() {
  const data = getCompanySetup();
  if (!data || (!data.companyName && !data.industry && !data.roles?.length)) return;

  setValue("companyName", data.companyName);
  setValue("companyLogo", data.logo);
  setValue("companyLocation", data.location);
  setValue("companyWebsite", data.website);
  setValue("companyMission", data.mission);
  setValue("companyIndustry", data.industry);
  updateIndustryUi(data.industry || "default");
  setValue("companySubfield", data.subfield);
  setSingleByValue("[data-size]", data.size, "data-size");
  setSingleByValue("[data-style]", data.hiringStyle, "data-style");
  setMultiByValue("[data-role]", data.roles, "data-role");
  setValue("coreTech", Array.isArray(data.coreTech) ? data.coreTech.join(", ") : "");
  setValue("skillLevel", data.skillLevel);
  setValue("workStyle", data.workStyle);
  setMultiByValue("[data-personality]", data.personalities, "data-personality");
  setMultiByValue("[data-culture]", data.cultureTags, "data-culture");
  setValue("minimumMatch", data.minimumMatch || 70);
  setValue("hiringTimeline", data.hiringTimeline === "Fast" ? 1 : data.hiringTimeline === "Careful" ? 3 : 2);
  setChecked("acceptLearners", data.acceptLearners);
  setChecked("internshipFriendly", data.internshipFriendly);
  replaceText("minimumMatchValue", `${data.minimumMatch || 70}%`);
  replaceText("hiringTimelineValue", data.hiringTimeline || "Balanced");
}

function updateIndustryUi(industryKey) {
  document.body.setAttribute("data-industry", industryKey || "default");
  renderSubfields(industryKey || "default");
}

function applySizeDefaults(size) {
  if (size === "Startup") {
    setSingleByValue("[data-style]", "Fast", "data-style");
    setChecked("acceptLearners", true);
    setChecked("internshipFriendly", true);
  }

  if (size === "Enterprise") {
    setSingleByValue("[data-style]", "Careful", "data-style");
    setChecked("acceptLearners", false);
  }
}

function applySmartDefaults() {
  setValue("companyName", "TechNova");
  setValue("companyLogo", "TN");
  setValue("companyLocation", "Cairo, Egypt");
  setValue("companyWebsite", "technova.ai");
  setValue("companyMission", "نبني منتجات رقمية ذكية ونبحث عن مواهب سريعة التعلم.");
  setValue("companyIndustry", "tech");
  updateIndustryUi("tech");
  setValue("companySubfield", "SaaS");
  setSingleByValue("[data-size]", "Startup", "data-size");
  setSingleByValue("[data-style]", "Fast", "data-style");
  setMultiByValue("[data-role]", ["Frontend", "Data"], "data-role");
  setValue("coreTech", "React, Node.js, SQL");
  setValue("skillLevel", "Beginner");
  setValue("workStyle", "Hybrid");
  setMultiByValue("[data-personality]", ["Fast Learner", "Team Player"], "data-personality");
  setMultiByValue("[data-culture]", ["Innovative", "Flexible"], "data-culture");
  setValue("minimumMatch", 70);
  replaceText("minimumMatchValue", "70%");
  setValue("hiringTimeline", 1);
  replaceText("hiringTimelineValue", "Fast");
  setChecked("acceptLearners", true);
  setChecked("internshipFriendly", true);
  updatePreview(0);
}

function persistCurrentStep(current) {
  const data = buildCompanyProfile(false);
  data.currentStep = current;
  window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(data));
}

function getCompanySetup() {
  try {
    return JSON.parse(window.localStorage.getItem(COMPANY_SETUP_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.value = value;
}

function setChecked(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = !!value;
}

function hasActive(selector) {
  return document.querySelector(`${selector}.active`) !== null;
}

function setSingleActive(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function getSingleActiveValue(selector) {
  const active = document.querySelector(`${selector}.active`);
  if (!active) return "";
  return active.getAttribute("data-size") || active.getAttribute("data-style") || "";
}

function getActiveValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}.active`)).map((button) =>
    button.getAttribute("data-role") ||
    button.getAttribute("data-personality") ||
    button.getAttribute("data-culture") ||
    ""
  ).filter(Boolean);
}

function setSingleByValue(selector, value, attr) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", button.getAttribute(attr) === value);
  });
}

function setMultiByValue(selector, values, attr) {
  const list = Array.isArray(values) ? values : [];
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", list.includes(button.getAttribute(attr)));
  });
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitials(value) {
  return String(value || "SB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");
}

function mapTimelineValue(value) {
  if (String(value) === "1") return "Fast";
  if (String(value) === "3") return "Careful";
  return "Balanced";
}

function toLabel(key) {
  if (key === "tech") return "Technology";
  if (key === "ai") return "AI / Data";
  if (key === "fintech") return "Fintech";
  if (key === "design") return "Design Studio";
  return "Industry";
}

function clampStep(value, total) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(total - 1, value));
}

function replaceText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
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
  const toast = document.getElementById("setupToast");
  if (!toast || !message) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
