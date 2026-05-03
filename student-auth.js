const PASSPORT_KEY = "skillbridgeTalentPassport";
const ROLE_KEY = "skillbridgeUserRole";
const ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const DRAFT_KEY = "skillbridgeOnboardingDraft";
const AUTH_DRAFT_KEY = "skillbridgeStudentAuthDraft";
const DEFAULT_JOB_READINESS = 22;

const CATEGORY_TRACKS = {
  technology: {
    title: "Technology",
    careerPath: "Frontend Developer",
    skills: [
      { name: "HTML", badge: "Recommended" },
      { name: "CSS" },
      { name: "JavaScript", badge: "Most in-demand" },
      { name: "Python", badge: "Most in-demand" },
      { name: "SQL" },
      { name: "React", badge: "Recommended" }
    ]
  },
  business: {
    title: "Business",
    careerPath: "Marketing Specialist",
    skills: [
      { name: "Communication", badge: "Recommended" },
      { name: "Leadership" },
      { name: "Excel", badge: "Most in-demand" },
      { name: "Presentation" },
      { name: "Negotiation" },
      { name: "Research", badge: "Recommended" }
    ]
  },
  design: {
    title: "Design",
    careerPath: "Product Designer",
    skills: [
      { name: "Figma", badge: "Most in-demand" },
      { name: "Wireframing" },
      { name: "UX Research", badge: "Recommended" },
      { name: "Typography" },
      { name: "Prototyping", badge: "Recommended" },
      { name: "Visual Design" }
    ]
  },
  media: {
    title: "Media",
    careerPath: "Content Creator",
    skills: [
      { name: "Content Writing", badge: "Recommended" },
      { name: "Canva" },
      { name: "Editing", badge: "Most in-demand" },
      { name: "Storytelling", badge: "Recommended" },
      { name: "Social Media" },
      { name: "Research" }
    ]
  }
};

const CUSTOM_CATEGORY_SUGGESTIONS = [
  "Cybersecurity",
  "Data Science",
  "Artificial Intelligence",
  "DevOps",
  "Cloud Computing",
  "Product Management",
  "Mobile Development",
  "Game Development"
];

const CUSTOM_CATEGORY_SKILLS = [
  {
    match: ["cyber", "security", "soc", "penetration"],
    title: "Cybersecurity",
    careerPath: "Cybersecurity Analyst",
    skills: [
      { name: "Network Security", badge: "Most in-demand" },
      { name: "Linux" },
      { name: "SIEM", badge: "Recommended" },
      { name: "Threat Analysis" },
      { name: "Python" },
      { name: "Incident Response", badge: "Recommended" }
    ]
  },
  {
    match: ["data", "analytics", "science", "analysis"],
    title: "Data Science",
    careerPath: "Data Analyst",
    skills: [
      { name: "Python", badge: "Recommended" },
      { name: "SQL", badge: "Most in-demand" },
      { name: "Data Analysis", badge: "Recommended" },
      { name: "Statistics" },
      { name: "Machine Learning" },
      { name: "Data Visualization" }
    ]
  },
  {
    match: ["ai", "ml", "machine learning", "artificial intelligence"],
    title: "Artificial Intelligence",
    careerPath: "AI Specialist",
    skills: [
      { name: "Python", badge: "Recommended" },
      { name: "Machine Learning", badge: "Most in-demand" },
      { name: "Data Analysis" },
      { name: "Deep Learning" },
      { name: "Prompt Engineering", badge: "Recommended" },
      { name: "Model Evaluation" }
    ]
  },
  {
    match: ["product", "pm"],
    title: "Product Management",
    careerPath: "Product Coordinator",
    skills: [
      { name: "Product Thinking", badge: "Recommended" },
      { name: "User Research" },
      { name: "Roadmapping" },
      { name: "Communication", badge: "Most in-demand" },
      { name: "Prioritization" },
      { name: "Analytics" }
    ]
  },
  {
    match: ["devops", "cloud", "infrastructure"],
    title: "DevOps",
    careerPath: "Cloud Engineer",
    skills: [
      { name: "Linux", badge: "Recommended" },
      { name: "Docker", badge: "Most in-demand" },
      { name: "CI/CD" },
      { name: "AWS" },
      { name: "Kubernetes" },
      { name: "Monitoring" }
    ]
  }
];

const FALLBACK_CUSTOM_SKILLS = [
  { name: "Communication", badge: "Recommended" },
  { name: "Research" },
  { name: "Problem Solving", badge: "Recommended" },
  { name: "Teamwork" },
  { name: "Digital Tools" },
  { name: "Time Management" }
];

const FIELD_IDS = [
  "studentName",
  "studentEmail",
  "studentPhone",
  "studentLevel",
  "studentOpportunity",
  "studentWorkMode",
  "studentCity",
  "studentCustomCity",
  "studentStatus",
  "studentAbout",
  "studentCustomCategory"
];

document.addEventListener("DOMContentLoaded", () => {
  setupMenu("studentAuthTopbar");
  setupReveal();
  setupViewSwitch("[data-student-auth]");
  setupPasswordToggles();
  setupCustomSelects();
  setupFlowLinks();
  setupStudentLogin();
  setupStudentWizard();
});

function setupMenu(id) {
  const topbar = document.getElementById(id);
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("scroll", () => {
    document.querySelectorAll(".custom-select.open").forEach((item) => item.classList.remove("open"));
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

function setupViewSwitch(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const buttons = root.querySelectorAll("[data-auth-view]");
  const panels = root.querySelectorAll("[data-auth-panel]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-auth-view");
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      panels.forEach((panel) => panel.classList.toggle("active", panel.getAttribute("data-auth-panel") === target));
    });
  });
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(button.getAttribute("data-toggle-password"));
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "إخفاء" : "إظهار";
    });
  });
}

function setupCustomSelects() {
  document.querySelectorAll("select").forEach((select) => {
    if (select.closest(".custom-select")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement("button");
    trigger.className = "custom-select-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const value = document.createElement("span");
    value.className = "selected-value";

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "⌄";
    arrow.setAttribute("aria-hidden", "true");

    const list = document.createElement("div");
    list.className = "dropdown-list";
    list.setAttribute("role", "listbox");

    trigger.append(value, arrow);
    wrapper.append(trigger, list);

    const sync = () => {
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      value.textContent = selectedOption?.textContent || "اختر";

      list.innerHTML = "";
      Array.from(select.options).forEach((option) => {
        if (!option.value && option.index === 0) return;
        const item = document.createElement("button");
        item.className = "dropdown-item";
        item.type = "button";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(option.selected));
        item.classList.toggle("is-selected", option.selected);
        item.textContent = option.textContent;
        item.addEventListener("click", () => {
          select.value = option.value || option.textContent;
          close();
          select.dispatchEvent(new Event("change", { bubbles: true }));
          select.dispatchEvent(new Event("input", { bubbles: true }));
          sync();
        });
        list.appendChild(item);
      });
    };

    const open = () => {
      document.querySelectorAll(".custom-select.open").forEach((item) => {
        if (item !== wrapper) item.classList.remove("open");
      });
      wrapper.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    };

    const close = () => {
      wrapper.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", () => {
      wrapper.classList.contains("open") ? close() : open();
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    select.addEventListener("change", sync);
    sync();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".custom-select")) return;
    document.querySelectorAll(".custom-select.open").forEach((item) => item.classList.remove("open"));
  });
}

function setupFlowLinks() {
  const accessLink = document.getElementById("studentAccessLink");
  const continueLink = document.getElementById("studentContinueLink");
  const draft = readStoredJson(DRAFT_KEY);
  const label = draft?.profile || draft?.currentStep >= 0 ? "كمّل الـ Onboarding" : "ابدأ الـ Onboarding";

  [accessLink, continueLink].forEach((link) => {
    if (!link) return;
    link.href = "student-onboarding.html";
    link.textContent = label;
  });
}

function setupStudentLogin() {
  const form = document.getElementById("studentLoginForm");
  const email = document.getElementById("studentLoginEmail");
  const password = document.getElementById("studentLoginPassword");
  const remember = document.getElementById("rememberStudent");

  if (!form || !email || !password) return;

  [email, password].forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllFieldErrors(form);

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
      if (!emailValue) setFieldError(email, "اكتب البريد الإلكتروني علشان نعرف نفتح حسابك.");
      if (!passwordValue) setFieldError(password, "اكتب كلمة المرور.");
      showToast("أدخل البريد الإلكتروني وكلمة المرور أولًا.");
      return;
    }

    if (!isValidEmail(emailValue)) {
      setFieldError(email, "البريد الإلكتروني محتاج يكون بالشكل ده: name@email.com");
      showToast("البريد الإلكتروني غير صحيح.");
      email.focus();
      return;
    }

    if (passwordValue.length < 6) {
      setFieldError(password, "كلمة المرور قصيرة جدًا.");
      showToast("كلمة المرور قصيرة جدًا.");
      password.focus();
      return;
    }

    window.localStorage.setItem(ROLE_KEY, "student");

    const current = getCurrentPassport();
    const name = current.name || emailValue.split("@")[0];
    mergePassport({
      name,
      email: emailValue,
      status: current.status || "Available",
      track: current.track || "Talent in Progress",
      avatar: current.avatar || getInitials(name),
      welcomeState: remember?.checked ? "returning" : "login",
      jobReadiness: current.jobReadiness || DEFAULT_JOB_READINESS
    });

    runSmartWelcome(name, "login", "student-onboarding.html");
  });
}

function setupStudentWizard() {
  const form = document.getElementById("studentSignupForm");
  const steps = Array.from(document.querySelectorAll(".signup-step"));
  const next = document.querySelector("[data-next-step]");
  const prev = document.querySelector("[data-prev-step]");
  const finish = document.querySelector("[data-finish-step]");
  const label = document.querySelector("[data-progress-label]");
  const bar = document.querySelector("[data-progress-bar]");
  const copy = document.querySelector("[data-progress-copy]");
  const motivation = document.querySelector("[data-motivation-copy]");
  const completion = document.querySelector("[data-completion-chip]");
  const autosave = document.querySelector("[data-autosave-status]");
  const categoryButtons = Array.from(document.querySelectorAll("[data-category]"));
  const customCategoryField = document.getElementById("customCategoryField");
  const customCategoryInput = document.getElementById("studentCustomCategory");
  const categorySuggestions = document.getElementById("categorySuggestions");
  const workModeSelect = document.getElementById("studentWorkMode");
  const citySelect = document.getElementById("studentCity");
  const customCityField = document.getElementById("customCityField");
  const customCityInput = document.getElementById("studentCustomCity");
  const passwordInput = document.getElementById("studentPassword");
  const passwordFeedback = document.getElementById("studentPasswordFeedback");
  const passwordBar = document.querySelector("[data-password-bar]");
  const skillsGrid = document.getElementById("studentSkillsGrid");
  const skillsCounter = document.getElementById("skillsCounter");
  const skillsHint = document.getElementById("skillsHint");
  const aboutInput = document.getElementById("studentAbout");
  const skipAboutBtn = document.getElementById("skipAboutBtn");
  const previewRoot = document.getElementById("studentProfilePreview");

  if (!form || !steps.length || !next || !prev || !finish || !label || !bar || !copy || !motivation || !completion || !autosave || !skillsGrid || !skillsCounter || !skillsHint || !previewRoot) {
    return;
  }

  const draft = readStoredJson(AUTH_DRAFT_KEY) || {};
  const state = {
    current: normalizeStep(draft.currentStep, steps.length),
    selectedCategory: draft.selectedCategory || "technology",
    customCategory: draft.customCategory || "",
    selectedSkills: Array.isArray(draft.selectedSkills) ? draft.selectedSkills.slice(0, 12) : [],
    skippedAbout: Boolean(draft.skippedAbout)
  };

  restoreDraftFields(draft);
  if (customCategoryInput) customCategoryInput.value = state.customCategory;

  const stepMessages = [
    {
      copy: "خلّينا نبدأ بالمعلومات الأساسية فقط.",
      motivation: "33% completed. البداية هنا ووراك خطوتين فقط."
    },
    {
      copy: "اختيار واحد هنا يكفي، والتفاصيل هنكملها في الـ onboarding.",
      motivation: "66% completed. قربت جدًا، باقي اختيار البداية المناسبة ليك."
    },
    {
      copy: "بقيت خطوة أخيرة ثم ننقلك مباشرة للتحليل الذكي.",
      motivation: "100% completed. خطوة واحدة وتظهر لك الفرص المناسبة."
    }
  ];

  const persistDraft = () => {
    const payload = {
      currentStep: state.current,
      selectedCategory: state.selectedCategory,
      customCategory: state.customCategory,
      selectedSkills: state.selectedSkills,
      skippedAbout: state.skippedAbout,
      fields: FIELD_IDS.reduce((accumulator, id) => {
        accumulator[id] = getValue(id);
        return accumulator;
      }, {})
    };

    autosave.textContent = "Saving...";
    autosave.classList.add("is-saving");
    window.localStorage.setItem(AUTH_DRAFT_KEY, JSON.stringify(payload));

    window.clearTimeout(persistDraft.timeoutId);
    persistDraft.timeoutId = window.setTimeout(() => {
      autosave.textContent = "Saved automatically ✓";
      autosave.classList.remove("is-saving");
    }, 180);
  };

  const render = () => {
    const step = stepMessages[state.current];
    steps.forEach((item, index) => item.classList.toggle("active", index === state.current));

    label.textContent = `Step ${state.current + 1} / ${steps.length}`;
    bar.style.width = `${((state.current + 1) / steps.length) * 100}%`;
    copy.textContent = step.copy;
    motivation.textContent = step.motivation;
    completion.textContent = `${Math.round(((state.current + 1) / steps.length) * 100)}% completed`;
    updateRewardChips(state);
    prev.classList.toggle("hidden", state.current === 0);
    next.classList.toggle("hidden", state.current === steps.length - 1);
    finish.classList.toggle("hidden", state.current !== steps.length - 1);

    categoryButtons.forEach((button) => {
      button.classList.toggle("selected", button.getAttribute("data-category") === state.selectedCategory);
    });

    toggleHidden(customCategoryField, state.selectedCategory !== "other");

    if (state.selectedCategory === "other") {
      renderCategorySuggestions(state.customCategory, categorySuggestions);
    } else {
      hideSuggestions(categorySuggestions);
    }

    renderLocationFields(citySelect, customCityField, customCityInput);
    renderSkills(getSelectedTrack(state), state.selectedSkills, skillsGrid, skillsCounter, skillsHint, () => {
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
    renderProfilePreview(state, previewRoot);
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.getAttribute("data-category") || "";
      if (state.selectedCategory !== "other") {
        state.customCategory = "";
        if (customCategoryInput) customCategoryInput.value = "";
        hideSuggestions(categorySuggestions);
      }
      state.selectedSkills = [];
      render();
      persistDraft();
    });
  });

  if (customCategoryInput) {
    customCategoryInput.addEventListener("input", () => {
      state.customCategory = customCategoryInput.value.trim();
      state.selectedSkills = [];
      renderCategorySuggestions(state.customCategory, categorySuggestions);
      render();
      persistDraft();
    });

    customCategoryInput.addEventListener("focus", () => {
      renderCategorySuggestions(customCategoryInput.value.trim(), categorySuggestions);
    });
  }

  if (categorySuggestions) {
    categorySuggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-suggestion]");
      if (!button || !customCategoryInput) return;
      const value = button.getAttribute("data-suggestion") || "";
      customCategoryInput.value = value;
      state.customCategory = value;
      state.selectedSkills = [];
      hideSuggestions(categorySuggestions);
      render();
      persistDraft();
    });
  }

  if (workModeSelect) {
    workModeSelect.addEventListener("change", () => {
      renderLocationFields(citySelect, customCityField, customCityInput);
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
  }

  if (citySelect) {
    citySelect.addEventListener("change", () => {
      renderLocationFields(citySelect, customCityField, customCityInput);
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
  }

  if (customCityInput) {
    customCityInput.addEventListener("input", () => {
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      updatePasswordStrength(passwordInput, passwordBar, passwordFeedback);
      persistDraft();
    });
  }

  FIELD_IDS.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener("input", () => {
      clearFieldError(field);
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
    field.addEventListener("change", () => {
      clearFieldError(field);
      renderProfilePreview(state, previewRoot);
      persistDraft();
    });
  });

  if (skipAboutBtn && aboutInput) {
    skipAboutBtn.addEventListener("click", () => {
      aboutInput.value = "";
      state.skippedAbout = true;
      renderProfilePreview(state, previewRoot);
      persistDraft();
      showToast("ممكن تكمل النبذة لاحقًا من الـ onboarding.");
    });
  }

  if (aboutInput) {
    aboutInput.addEventListener("input", () => {
      state.skippedAbout = false;
    });
  }

  next.addEventListener("click", () => {
    clearAllFieldErrors(form);
    if (!validateStep(state.current, state)) return;
    if (state.current < steps.length - 1) {
      state.current += 1;
      render();
      persistDraft();
    }
  });

  prev.addEventListener("click", () => {
    if (state.current > 0) {
      state.current -= 1;
      render();
      persistDraft();
    }
  });

  finish.addEventListener("click", () => {
    clearAllFieldErrors(form);
    if (!validateStep(state.current, state)) return;

    const name = getValue("studentName");
    const email = getValue("studentEmail");
    const phone = getValue("studentPhone");
    const password = getValue("studentPassword");
    const level = getValue("studentLevel");
    const opportunity = getValue("studentOpportunity");
    const workMode = getValue("studentWorkMode");
    const city = getResolvedCity();
    const status = getValue("studentStatus");
    const about = getValue("studentAbout");
    const selectedTrack = getSelectedTrack(state);
    const location = buildLocationLabel(workMode, city);
    const passwordState = evaluatePasswordStrength(password);

    if (passwordState.score < 2) {
      setFieldError(passwordInput, "قوّي كلمة المرور قبل إنشاء الحساب.");
      showToast("اجعل كلمة المرور أقوى قبل إنشاء الحساب.");
      passwordInput?.focus();
      return;
    }

    window.localStorage.setItem(ROLE_KEY, "student");

    mergePassport({
      name,
      email,
      phone,
      track: selectedTrack.careerPath,
      category: selectedTrack.title,
      academicLevel: level,
      opportunity,
      workMode,
      city,
      location,
      status,
      about: about || "سأكمل النبذة لاحقًا.",
      skills: state.selectedSkills,
      avatar: getInitials(name),
      welcomeState: "signup",
      jobReadiness: Math.max(getCurrentPassport().jobReadiness || DEFAULT_JOB_READINESS, 28)
    });

    window.localStorage.removeItem(AUTH_DRAFT_KEY);
    runSmartWelcome(name, "signup", "student-onboarding.html");
  });

  function getResolvedCity() {
    const selected = getValue("studentCity");
    return selected === "Other" ? getValue("studentCustomCity") : selected;
  }

  renderLocationFields(citySelect, customCityField, customCityInput);
  updatePasswordStrength(passwordInput, passwordBar, passwordFeedback);
  render();
}

function restoreDraftFields(draft) {
  const fields = draft?.fields || {};
  FIELD_IDS.forEach((id) => {
    const field = document.getElementById(id);
    if (!field || typeof fields[id] !== "string") return;
    field.value = fields[id];
    if (field.tagName === "SELECT") {
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

function renderLocationFields(citySelect, customCityField, customCityInput) {
  const needsCustomCity = citySelect?.value === "Other";
  toggleHidden(customCityField, !needsCustomCity);
  if (!needsCustomCity && customCityInput) {
    customCityInput.value = "";
  }
}

function renderCategorySuggestions(query, suggestionsRoot) {
  if (!suggestionsRoot) return;

  const normalized = String(query || "").trim().toLowerCase();
  const list = CUSTOM_CATEGORY_SUGGESTIONS.filter((item) => {
    if (!normalized) return true;
    return item.toLowerCase().includes(normalized);
  }).slice(0, 5);

  if (!list.length || !normalized) {
    hideSuggestions(suggestionsRoot);
    return;
  }

  suggestionsRoot.innerHTML = list.map((item) => `
    <button type="button" class="suggestion-btn" data-suggestion="${escapeHtml(item)}">${item}</button>
  `).join("");
  suggestionsRoot.classList.remove("hidden");
}

function hideSuggestions(root) {
  if (!root) return;
  root.classList.add("hidden");
  root.innerHTML = "";
}

function renderSkills(track, selectedSkills, skillsGrid, skillsCounter, skillsHint, onChange) {
  if (!skillsGrid || !skillsCounter || !skillsHint) return;

  const skills = Array.isArray(track.skills) ? track.skills : [];
  const groupedSkills = groupAuthSkills(skills);
  skillsHint.textContent = track.isCustom
    ? `بناءً على "${track.title}" دي skills مقترحة كبداية. اختار اللي تعرفه دلوقتي وممكن تعدل بعدين.`
    : `هنرشح لك skills مناسبة لمسار ${track.title}. اختار اللي تعرفه دلوقتي، و3 مهارات تديك تخصيص أقوى.`;

  skillsGrid.innerHTML = groupedSkills.map((group) => `
    <section class="skill-choice-group">
      <strong>${group.title}</strong>
      <div class="skill-choice-row">
        ${group.items.map((skill) => {
          const isSelected = selectedSkills.includes(skill.name);
          return `
            <button class="skill-btn ${isSelected ? "selected" : ""}" type="button" data-skill="${escapeHtml(skill.name)}">
              <span class="skill-icon">${getSkillIcon(skill.name)}</span>
              <span class="skill-name">${skill.name}</span>
              ${skill.badge ? `<small class="skill-badge">${skill.badge}</small>` : ""}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");

  skillsCounter.textContent = selectedSkills.length >= 3
    ? `Selected: ${selectedSkills.length} Skills · Boost ready`
    : `Selected: ${selectedSkills.length} Skills · Optional`;

  skillsGrid.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = button.getAttribute("data-skill") || "";
      const existingIndex = selectedSkills.indexOf(skill);

      if (existingIndex >= 0) {
        selectedSkills.splice(existingIndex, 1);
      } else {
        selectedSkills.push(skill);
      }

      renderSkills(track, selectedSkills, skillsGrid, skillsCounter, skillsHint, onChange);
      if (typeof onChange === "function") onChange();
    });
  });
}

function groupAuthSkills(skills) {
  const groups = [
    { title: "Frontend", keys: ["HTML", "CSS", "JavaScript", "React", "Figma", "UX", "Wireframing", "Typography", "Prototype", "Visual"], items: [] },
    { title: "Data & Backend", keys: ["Python", "SQL", "Excel", "Data", "Analytics", "Machine", "Linux", "Docker", "AWS", "Cloud", "Network"], items: [] },
    { title: "Work Skills", keys: ["Communication", "Leadership", "Presentation", "Negotiation", "Research", "Storytelling", "Writing", "Editing", "Social", "Team", "Time"], items: [] }
  ];

  skills.forEach((skill) => {
    const name = String(skill.name || "");
    const target = groups.find((group) => group.keys.some((key) => name.toLowerCase().includes(key.toLowerCase()))) || groups[2];
    target.items.push(skill);
  });

  return groups.filter((group) => group.items.length);
}

function getSkillIcon(skill) {
  const lower = String(skill).toLowerCase();
  if (lower.includes("python")) return "PY";
  if (lower.includes("sql")) return "DB";
  if (lower.includes("excel")) return "XL";
  if (lower.includes("react")) return "RX";
  if (lower.includes("javascript")) return "JS";
  if (lower.includes("html")) return "HT";
  if (lower.includes("css")) return "CS";
  if (lower.includes("figma")) return "FG";
  if (lower.includes("data") || lower.includes("analytics")) return "DA";
  if (lower.includes("communication")) return "CM";
  if (lower.includes("presentation")) return "PR";
  if (lower.includes("research")) return "RS";
  if (lower.includes("leadership")) return "LD";
  return "SK";
}

function renderProfilePreview(state, previewRoot) {
  if (!previewRoot) return;

  const selectedTrack = getSelectedTrack(state);
  const name = getValue("studentName") || "اسمك سيظهر هنا";
  const workMode = getValue("studentWorkMode");
  const city = getValue("studentCity") === "Other" ? getValue("studentCustomCity") : getValue("studentCity");
  const workLabel = buildLocationLabel(workMode, city) || "لم يتم التحديد بعد";
  const about = getValue("studentAbout");
  const previewSkills = Array.isArray(state.selectedSkills) && state.selectedSkills.length
    ? state.selectedSkills.slice(0, 4).join("، ")
    : "ممكن تضيف مهاراتك لاحقًا";

  updatePreviewText("[data-preview-name]", name);
  updatePreviewText("[data-preview-category]", selectedTrack.title || "لم يتم الاختيار بعد");
  updatePreviewText("[data-preview-work]", workLabel);
  updatePreviewText("[data-preview-skills]", previewSkills);
  updatePreviewText("[data-preview-about]", about || "أضف نبذة قصيرة أو استخدم Skip for now.");
}

function updatePreviewText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function getSelectedTrack(state) {
  if (state.selectedCategory && CATEGORY_TRACKS[state.selectedCategory]) {
    return CATEGORY_TRACKS[state.selectedCategory];
  }

  const customValue = String(state.customCategory || "").trim();
  if (!customValue) {
    return {
      title: "Custom Track",
      careerPath: "Career Explorer",
      skills: FALLBACK_CUSTOM_SKILLS,
      isCustom: true
    };
  }

  const normalized = customValue.toLowerCase();
  const match = CUSTOM_CATEGORY_SKILLS.find((item) => item.match.some((keyword) => normalized.includes(keyword)));

  if (match) {
    return {
      ...match,
      isCustom: true
    };
  }

  return {
    title: customValue,
    careerPath: `${customValue} Explorer`,
    skills: FALLBACK_CUSTOM_SKILLS,
    isCustom: true
  };
}

function validateStep(current, state) {
  if (current === 0) {
    const passwordState = evaluatePasswordStrength(getValue("studentPassword"));

    if (!getValue("studentName") || !getValue("studentEmail") || !getValue("studentPhone") || !getValue("studentPassword")) {
      requireField("studentName", "اكتب اسمك علشان نخصص التجربة.");
      requireField("studentEmail", "اكتب بريدك الإلكتروني.");
      requireField("studentPhone", "اكتب رقم الهاتف.");
      requireField("studentPassword", "اكتب كلمة مرور قوية.");
      showToast("أكمل المعلومات الأساسية أولًا.");
      return false;
    }

    if (!isValidEmail(getValue("studentEmail"))) {
      setFieldError(document.getElementById("studentEmail"), "البريد الإلكتروني محتاج يكون بالشكل ده: name@email.com");
      showToast("البريد الإلكتروني غير صحيح.");
      return false;
    }

    if (passwordState.score < 2) {
      setFieldError(document.getElementById("studentPassword"), "زوّد قوة كلمة المرور قبل المتابعة.");
      showToast("كلمة المرور ما زالت ضعيفة. قوّيها قبل المتابعة.");
      return false;
    }

    return true;
  }

  if (current === 1) {
    const hasCategory = state.selectedCategory && (state.selectedCategory !== "other" || state.customCategory);

    if (!hasCategory || !getValue("studentLevel") || !getValue("studentOpportunity")) {
      if (!hasCategory) setFieldError(document.getElementById("studentCustomCategory") || document.getElementById("studentLevel"), "اختار مجال أو اكتب مجالك.");
      requireField("studentLevel", "اختار مستواك التعليمي.");
      requireField("studentOpportunity", "اختار نوع الفرصة اللي بتدور عليها.");
      showToast("اختَر المجال والمستوى ونوع الفرصة أولًا.");
      return false;
    }

    return true;
  }

  if (!getValue("studentWorkMode") || !getValue("studentCity")) {
    requireField("studentWorkMode", "اختار طريقة العمل المناسبة ليك.");
    requireField("studentCity", "اختار المدينة أو Remote preference.");
    showToast("اختَر طريقة العمل والمدينة أولًا.");
    return false;
  }

  if (getValue("studentCity") === "Other" && !getValue("studentCustomCity")) {
    requireField("studentCustomCity", "اكتب المدينة التي تناسبك.");
    showToast("اكتب المدينة التي تناسبك.");
    return false;
  }

  if (!getValue("studentStatus")) {
    requireField("studentStatus", "اختار حالتك الحالية.");
    showToast("اختَر حالتك الحالية أولًا.");
    return false;
  }

  if (state.selectedSkills.length < 3) {
    showToast("تقدر تكمل الآن، وإضافة 3 مهارات هتديك ترشيحات أدق.");
  }

  return true;
}

function updateRewardChips(state) {
  const xp = document.querySelector("[data-xp-chip]");
  const level = document.querySelector("[data-level-chip]");
  const reward = document.querySelector("[data-reward-chip]");
  if (!xp || !level || !reward) return;

  const skillBonus = Math.min((state.selectedSkills?.length || 0) * 5, 25);
  const progressXp = (state.current + 1) * 20 + skillBonus;
  xp.textContent = `+${progressXp} XP`;
  level.textContent = state.current >= 2 ? "Level 2 - Profile Ready" : "Level 1 - Starter";
  reward.textContent = state.selectedSkills.length >= 3 ? "Matching boost unlocked" : "Talent DNA loading";
}

function requireField(id, message) {
  const field = document.getElementById(id);
  if (!field || getValue(id)) return false;
  setFieldError(field, message);
  return true;
}

function setFieldError(input, message) {
  if (!input) return;
  const field = input.closest(".field");
  if (!field) return;
  field.classList.add("has-error");

  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "field-error";
    field.appendChild(error);
  }

  error.textContent = message;
}

function clearFieldError(input) {
  const field = input?.closest?.(".field");
  if (!field) return;
  field.classList.remove("has-error");
}

function clearAllFieldErrors(root = document) {
  root.querySelectorAll(".field.has-error").forEach((field) => field.classList.remove("has-error"));
}

function updatePasswordStrength(input, meterBar, feedback) {
  if (!input || !meterBar || !feedback) return;

  const result = evaluatePasswordStrength(input.value.trim());
  meterBar.style.width = `${result.percent}%`;
  meterBar.className = result.tone;
  feedback.textContent = result.message;
}

function evaluatePasswordStrength(value) {
  const password = String(value || "");
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password.length) {
    return {
      score: 0,
      percent: 0,
      tone: "",
      message: "استخدم 8 أحرف على الأقل مع رقم وحرف كبير لنتيجة أقوى."
    };
  }

  if (score <= 1) {
    return {
      score,
      percent: 25,
      tone: "is-weak",
      message: "Weak password. زوّد الطول واستخدم أرقام وحروف مختلفة."
    };
  }

  if (score <= 3) {
    return {
      score,
      percent: 60,
      tone: "is-medium",
      message: "Good start. أضف حرفًا كبيرًا أو رمزًا لتصبح أقوى."
    };
  }

  return {
    score,
    percent: 100,
    tone: "is-strong",
    message: "Strong password. ممتاز، جاهز للمتابعة."
  };
}

function runSmartWelcome(name, mode, destination) {
  const overlay = document.getElementById("smartAuthOverlay");
  const title = document.getElementById("overlayTitle");
  const subtitle = document.getElementById("overlaySubtitle");
  const targetUrl = destination || "student-onboarding.html";

  if (!overlay || !title || !subtitle) {
    window.location.href = targetUrl;
    return;
  }

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  title.textContent = "بنحدد مستقبلك المهني...";
  subtitle.textContent = "بنحوّل اختياراتك إلى Talent DNA مبدئي";

  setTimeout(() => {
    title.textContent = `جاهز يا ${name}`;
    subtitle.textContent = mode === "signup"
      ? "حسابك اتبنى. نبدأ التحليل الذكي الآن."
      : "أهلاً بعودتك. نكمل رحلتك من حيث توقفت.";
  }, 1200);

  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2600);
}

function getStudentFlowState() {
  const passport = getCurrentPassport();
  let assessment = {};
  let draft = {};

  try {
    assessment = JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    assessment = {};
  }

  try {
    draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null") || {};
  } catch (error) {
    draft = {};
  }

  const hasPassport = Boolean(passport.name || passport.email);
  const hasDraft = Boolean(draft.profile || draft.currentStep >= 0);
  const completedSteps = Array.isArray(passport.completedSteps) ? passport.completedSteps.length : 0;
  const hasAssessment = Boolean(assessment.fullTitle || assessment.careerPath || assessment.persona);
  const isReadyForDashboard = hasPassport && (completedSteps >= 3 || hasAssessment);

  if (isReadyForDashboard) {
    return {
      entryUrl: "student-dashboard.html",
      entryLabel: "افتح الـ Dashboard"
    };
  }

  if (hasDraft || hasPassport) {
    return {
      entryUrl: "student-onboarding.html",
      entryLabel: "كمّل رحلتك"
    };
  }

  return {
    entryUrl: "student-onboarding.html",
    entryLabel: "ابدأ رحلتك"
  };
}

function readStoredJson(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

function getCurrentPassport() {
  try {
    return JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    return {};
  }
}

function mergePassport(partial) {
  const current = getCurrentPassport();
  const name = partial.name || current.name || "Student";
  const next = {
    ...current,
    name,
    email: partial.email || current.email || "",
    phone: partial.phone || current.phone || "",
    track: partial.track || current.track || "Talent in Progress",
    category: partial.category || current.category || "",
    academicLevel: partial.academicLevel || current.academicLevel || "",
    opportunity: partial.opportunity || current.opportunity || "Internship",
    workMode: partial.workMode || current.workMode || "",
    city: partial.city || current.city || "",
    location: partial.location || current.location || "Remote",
    status: partial.status || current.status || "Available",
    about: partial.about || current.about || "Student profile generated from smart access flow.",
    avatar: partial.avatar || current.avatar || getInitials(name),
    skills: Array.isArray(partial.skills) && partial.skills.length ? partial.skills : Array.isArray(current.skills) ? current.skills : [],
    strengths: Array.isArray(current.strengths) ? current.strengths : [],
    weaknesses: Array.isArray(current.weaknesses) ? current.weaknesses : [],
    badges: Array.isArray(current.badges) && current.badges.length ? current.badges : ["Explorer"],
    xp: typeof current.xp === "number" ? current.xp : 120,
    level: typeof current.level === "number" ? current.level : 1,
    levelLabel: current.levelLabel || "Level 1 - Starter",
    jobReadiness: partial.jobReadiness || current.jobReadiness || DEFAULT_JOB_READINESS,
    learningProgress: typeof current.learningProgress === "number" ? current.learningProgress : 0,
    projects: Array.isArray(current.projects) ? current.projects : [],
    applications: Array.isArray(current.applications) ? current.applications : [],
    savedJobs: Array.isArray(current.savedJobs) ? current.savedJobs : [],
    completedSteps: Array.isArray(current.completedSteps) ? current.completedSteps : [],
    welcomeState: partial.welcomeState || current.welcomeState || "signup",
    lastSeenAt: new Date().toISOString()
  };

  window.localStorage.setItem(PASSPORT_KEY, JSON.stringify(next));
  return next;
}

function buildLocationLabel(workMode, city) {
  if (!workMode && !city) return "";
  if (!city) return workMode;
  return `${workMode} - ${city}`;
}

function normalizeStep(value, length) {
  const step = Number.isInteger(value) ? value : 0;
  return Math.max(0, Math.min(step, Math.max(0, length - 1)));
}

function toggleHidden(element, hidden) {
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showToast(message) {
  const toast = document.getElementById("studentAuthToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
