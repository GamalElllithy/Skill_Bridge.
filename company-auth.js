const COMPANY_SETUP_KEY = "skillbridgeCompanySetup";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu("companyAuthTopbar");
  setupReveal();
  setupViewSwitch("[data-company-auth]");
  setupPasswordToggles();
  setupCompanyLogin();
  setupCompanyWizard();
  setupToasts();
});

function setupMenu(id) {
  const topbar = document.getElementById(id);
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;
  toggle.addEventListener("click", () => topbar.classList.toggle("is-open"));
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
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

function setupCompanyWizard() {
  const steps = Array.from(document.querySelectorAll(".signup-step"));
  const next = document.querySelector("[data-next-step]");
  const prev = document.querySelector("[data-prev-step]");
  const finish = document.querySelector("[data-finish-step]");
  const label = document.querySelector("[data-progress-label]");
  const bar = document.querySelector("[data-progress-bar]");
  const copy = document.querySelector("[data-progress-copy]");
  if (!steps.length || !next || !prev || !finish || !label || !bar || !copy) return;

  const stepMessages = [
    "ابدأ من هوية الشركة ثم نصل إلى المرشح المثالي.",
    "ممتاز، عرفنا الصناعة والفرص المتاحة.",
    "الآن نبني صورة واضحة للشركة أمام المواهب.",
    "آخر خطوة قبل تشغيل Talent Pool الذكي."
  ];

  let current = 0;

  const validateStep = () => {
    const activeStep = steps[current];
    const fields = activeStep.querySelectorAll("input, select, textarea");

    for (const field of fields) {
      const value = field.value.trim();
      const id = field.id || "";

      if (!value) {
        showToast("أكمل بيانات هذه الخطوة أولًا.");
        field.focus();
        return false;
      }

      if (id === "companyEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showToast("البريد الإلكتروني للشركة غير صحيح.");
        field.focus();
        return false;
      }

      if (id === "companyPassword" && value.length < 8) {
        showToast("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
        field.focus();
        return false;
      }
    }

    return true;
  };

  const render = () => {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));
    label.textContent = `Step ${current + 1} / ${steps.length}`;
    bar.style.width = `${((current + 1) / steps.length) * 100}%`;
    copy.textContent = stepMessages[current];
    prev.classList.toggle("hidden", current === 0);
    next.classList.toggle("hidden", current === steps.length - 1);
    finish.classList.toggle("hidden", current !== steps.length - 1);
  };

  next.addEventListener("click", () => {
    if (!validateStep()) return;
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

  finish.addEventListener("click", (event) => {
    if (!validateStep()) {
      event.preventDefault();
      return;
    }
    persistCompanyDraft();
    window.localStorage.setItem("skillbridgeUserRole", "company");
    showToast("تم تجهيز حساب الشركة للانتقال إلى الإعدادات النهائية.");
  });

  render();
}

function setupToasts() {
  const toast = document.getElementById("companyAuthToast");
  const buttons = document.querySelectorAll("[data-toast]");
  if (!toast || !buttons.length) return;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.getAttribute("data-toast"));
    });
  });
}

function setupCompanyLogin() {
  const submit = document.querySelector('.auth-view[data-auth-panel="login"] .submit-btn');
  const email = document.getElementById("companyLoginEmail");
  const password = document.getElementById("companyLoginPassword");
  if (!submit || !email || !password) return;

  submit.addEventListener("click", () => {
    if (!email.value.trim() || !password.value.trim()) {
      showToast("أدخل بيانات دخول الشركة أولًا.");
      return;
    }

    if (password.value.trim().length < 6) {
      showToast("كلمة المرور قصيرة جدًا.");
      return;
    }

    window.localStorage.setItem("skillbridgeUserRole", "company");
    showToast(submit.getAttribute("data-toast"));
    window.setTimeout(() => {
      window.location.href = getCompanyNextRoute();
    }, 700);
  });
}

function persistCompanyDraft() {
  const existing = getStoredJson(COMPANY_SETUP_KEY, {});
  const next = {
    ...existing,
    companyName: document.getElementById("companyName")?.value.trim() || existing.companyName || "Your Company",
    industry: mapCompanyIndustryToSetup(document.getElementById("companyIndustry")?.value.trim()) || existing.industry || "default",
    location: document.getElementById("companyLocation")?.value.trim() || existing.location || "Remote",
    logo: document.getElementById("companyLogo")?.value.trim() || existing.logo || "SB",
    opportunity: document.getElementById("companyOpportunity")?.value.trim() || existing.opportunity || "Internship",
    size: mapCompanySizeToSetup(document.getElementById("companySize")?.value.trim()) || existing.size || "Startup",
    email: document.getElementById("companyEmail")?.value.trim() || existing.email || "",
    currentStep: Number(existing.currentStep || 0),
    isReady: Boolean(existing.isReady)
  };

  window.localStorage.setItem(COMPANY_SETUP_KEY, JSON.stringify(next));
}

function getCompanyNextRoute() {
  const companySetup = getStoredJson(COMPANY_SETUP_KEY, {});
  return companySetup.isReady ? "company-dashboard.html" : "company-setup.html";
}

function getStoredJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function mapCompanyIndustryToSetup(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "technology") return "tech";
  if (normalized === "finance") return "fintech";
  if (normalized === "education") return "default";
  return normalized || "default";
}

function mapCompanySizeToSetup(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "small") return "Startup";
  if (normalized === "medium") return "Medium";
  if (normalized === "large") return "Enterprise";
  return value || "Startup";
}

function showToast(message) {
  const toast = document.getElementById("companyAuthToast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
