const darkBtn = document.getElementById("darkModeBtn");
const body = document.body;
const contactForm = document.getElementById("contactForm");

function updateThemeButton() {
  if (!darkBtn) {
    return;
  }

  darkBtn.textContent = body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
}

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
}

updateThemeButton();

darkBtn?.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeButton();
});

contactForm?.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const successMessage = document.getElementById("successMessage");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  successMessage.textContent = "";

  if (!fullName.value.trim()) {
    nameError.textContent = "Full name is required.";
    isValid = false;
  }

  if (!emailPattern.test(email.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    messageError.textContent = "Message must be at least 10 characters.";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  successMessage.textContent = "Form submitted successfully.";
  this.reset();
});
