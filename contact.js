const CONTACT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyX7Xov4PeuQtb8fJHrhVWpWJ0Sum1i04YC-F27aLLqZmQnQ7ifvKwacXN0fxZkhJeBcw/exec";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupContactIntents();
  setupFieldFeedback();
  setupContactForm();
});

function setupMenu() {
  const topbar = document.getElementById("contactTopbar");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!topbar || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupContactIntents() {
  const buttons = document.querySelectorAll("[data-subject]");
  const subject = document.getElementById("subject");
  if (!buttons.length || !subject) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      subject.value = button.getAttribute("data-subject") || "";
      updateFieldState(subject);
      clearError(subject);
      subject.focus();
    });
  });
}

function setupFieldFeedback() {
  document.querySelectorAll(".input-box input, .input-box textarea").forEach((input) => {
    updateFieldState(input);
    input.addEventListener("input", () => updateFieldState(input));
    input.addEventListener("blur", () => updateFieldState(input));
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  items.forEach((item) => observer.observe(item));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const submitButton = form?.querySelector(".submit-btn");
  if (!form || !successMessage) return;

  const fields = {
    name: document.getElementById("name"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };

  const validators = {
    name: (value) => value.trim().length >= 3 ? "" : "من فضلك اكتب الاسم الكامل بشكل صحيح",
    phone: (value) => validPhone(value) ? "" : "من فضلك اكتب رقم هاتف صحيح",
    email: (value) => validEmail(value) ? "" : "من فضلك اكتب بريد إلكتروني صحيح",
    subject: (value) => value.trim().length >= 3 ? "" : "من فضلك اكتب موضوعًا واضحًا",
    message: (value) => value.trim().length >= 10 ? "" : "من فضلك اكتب رسالة أوضح لا تقل عن 10 أحرف"
  };

  Object.entries(fields).forEach(([key, input]) => {
    if (!input) return;
    input.addEventListener("input", () => {
      if (!input.classList.contains("is-invalid")) return;
      validateField(key, input, validators[key]);
    });
    input.addEventListener("blur", () => {
      validateField(key, input, validators[key]);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.textContent = "";
    successMessage.dataset.state = "";

    const invalidInputs = Object.entries(fields)
      .map(([key, input]) => ({
        input,
        error: validateField(key, input, validators[key])
      }))
      .filter(({ error }) => Boolean(error));

    if (invalidInputs.length) {
      invalidInputs[0].input.focus();
      return;
    }

    const payload = buildPayload(fields);
    setSubmitState(submitButton, true);

    try {
      const response = await fetch(CONTACT_WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: new URLSearchParams(payload).toString()
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      successMessage.textContent = "تم إرسال رسالتك بنجاح  .";
      form.reset();
      Object.values(fields).forEach(clearError);
    } catch (error) {
      successMessage.textContent = "حصلت مشكلة أثناء الإرسال. حاول مرة أخرى بعد قليل.";
      successMessage.dataset.state = "error";
      return;
    } finally {
      if (!successMessage.dataset.state) {
        successMessage.dataset.state = "success";
      }
      setSubmitState(submitButton, false);
    }
  });
}

function validateField(key, input, validator) {
  if (!input || typeof validator !== "function") return "";
  const error = validator(input.value);
  if (error) {
    showError(input, error);
    return error;
  }

  clearError(input);
  return "";
}

function showError(input, message) {
  const errorNode = input.parentElement.querySelector(".error");
  if (!errorNode) return;
  errorNode.textContent = message;
  input.classList.add("is-invalid");
  input.parentElement.classList.add("has-error");
}

function clearError(input) {
  const errorNode = input.parentElement.querySelector(".error");
  if (!errorNode) return;
  errorNode.textContent = "";
  input.classList.remove("is-invalid");
  input.parentElement.classList.remove("has-error");
}

function updateFieldState(input) {
  input.parentElement?.classList.toggle("is-filled", Boolean(input.value.trim()));
}

function buildPayload(fields) {
  return {
    name: fields.name?.value.trim() || "",
    phone: fields.phone?.value.trim() || "",
    email: fields.email?.value.trim() || "",
    subject: fields.subject?.value.trim() || "",
    message: fields.message?.value.trim() || "",
    page: "contact",
    submittedAt: new Date().toISOString()
  };
}

function setSubmitState(button, isSubmitting) {
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "جارٍ الإرسال..." : "إرسال الرسالة";
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function validPhone(phone) {
  const normalized = String(phone).replace(/[^\d+]/g, "");
  return /^(?:\+20|0)?1[0125]\d{8}$/.test(normalized) || /^\+?\d{8,15}$/.test(normalized);
}
