const quizQuestions = [
  {
    title: "لو عندك مشكلة صعبة، بتتصرف إزاي؟",
    options: [
      { label: "أفكر لوحدي", hint: "تحب العمق والتحليل", weights: { analyst: 3, leader: 1 } },
      { label: "أسأل حد", hint: "تؤمن بقوة التعاون", weights: { leader: 2, creator: 1 } },
      { label: "أجرب بسرعة", hint: "تميل للحركة والتنفيذ", weights: { creator: 2, leader: 1 } }
    ]
  },
  {
    title: "تحب الشغل يكون...",
    options: [
      { label: "سريع", hint: "الزخم يحمسك", weights: { leader: 2, creator: 1 } },
      { label: "دقيق", hint: "الجودة عندك أساسية", weights: { analyst: 3 } },
      { label: "إبداعي", hint: "تنجذب للحلول الجديدة", weights: { creator: 3 } }
    ]
  },
  {
    title: "أنت أقرب لـ:",
    options: [
      { label: "Leader", hint: "تتحرك وتجمع الناس", weights: { leader: 3 } },
      { label: "Analyst", hint: "تفهم قبل ما تتحرك", weights: { analyst: 3 } },
      { label: "Creator", hint: "تبني أفكارًا غير متوقعة", weights: { creator: 3 } }
    ]
  },
  {
    title: "في فريق جديد، الناس غالبًا تعتمد عليك في...",
    options: [
      { label: "تنظيم الصورة", hint: "تشوف الأنماط بسرعة", weights: { analyst: 2, leader: 1 } },
      { label: "إشعال الحماس", hint: "تحرك الآخرين للأمام", weights: { leader: 3 } },
      { label: "اقتراح أفكار مختلفة", hint: "تفتح زوايا جديدة", weights: { creator: 3 } }
    ]
  },
  {
    title: "أكثر شيء يرضيك في أي إنجاز هو...",
    options: [
      { label: "أنه كان منطقيًا", hint: "تحب الوضوح والسببية", weights: { analyst: 3 } },
      { label: "أنه أثّر على الناس", hint: "تهتم بالقيادة والأثر", weights: { leader: 3 } },
      { label: "أنه خرج بشكل مميز", hint: "الجودة الجمالية تهمك", weights: { creator: 3 } }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupIntro();
  setupNav();
  setupReveal();
  setupQuiz();
  setupOnboarding();
  animateMeters();
});

function setupIntro() {
  const overlay = document.querySelector("[data-intro]");
  if (!overlay) return;

  const texts = overlay.querySelectorAll(".intro-text");
  texts.forEach((text, index) => {
    window.setTimeout(() => text.classList.add("is-visible"), 250 + index * 900);
  });

  window.setTimeout(() => overlay.classList.add("is-hidden"), 2550);
}

function setupNav() {
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector("[data-menu-toggle]");

  if (toggle && topbar) {
    toggle.addEventListener("click", () => {
      topbar.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-open-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = document.querySelector("#mini-quiz");
      const root = document.querySelector("[data-quiz-root]");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (root) {
        root.closest(".quiz-shell")?.classList.add("is-active");
      }
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupQuiz() {
  const root = document.querySelector("[data-quiz-root]");
  if (!root) return;

  const shell = root.closest(".quiz-shell");
  let current = 0;
  const scores = { analyst: 0, creator: 0, leader: 0 };

  root.innerHTML = `
    <div class="quiz-cover">
      <div class="career-banner">
        <strong>ابدأ تحليل شخصيتك في 30 ثانية</strong>
        <p class="copy">خمس أسئلة قصيرة فقط، وبعدها يظهر لك تحليل مبدئي يخليك حابب تكمل الرحلة.</p>
      </div>
      <button class="primary-btn" type="button" data-quiz-start>ابدأ الآن</button>
    </div>
    <div class="quiz-flow hidden">
      <div class="quiz-title-row">
        <strong class="muted-strong" data-quiz-counter></strong>
        <span class="pill">Mini Experience</span>
      </div>
      <div class="quiz-progress"><span data-quiz-progress></span></div>
      <div class="quiz-steps" data-quiz-steps></div>
    </div>
    <div class="result-card hidden" data-quiz-result></div>
  `;

  const startButton = root.querySelector("[data-quiz-start]");
  const quizFlow = root.querySelector(".quiz-flow");
  const counter = root.querySelector("[data-quiz-counter]");
  const progress = root.querySelector("[data-quiz-progress]");
  const stepsHolder = root.querySelector("[data-quiz-steps]");
  const result = root.querySelector("[data-quiz-result]");

  stepsHolder.innerHTML = quizQuestions
    .map(
      (question, index) => `
        <section class="quiz-step ${index === 0 ? "is-active" : ""}" data-step="${index}">
          <h3 class="title-sm">${question.title}</h3>
          <div class="quiz-options">
            ${question.options
              .map(
                (option, optionIndex) => `
                  <button class="option-card" type="button" data-answer="${index}-${optionIndex}">
                    <strong>${option.label}</strong>
                    <span class="muted">${option.hint}</span>
                  </button>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  const refresh = () => {
    counter.textContent = `سؤال ${current + 1} من ${quizQuestions.length}`;
    progress.style.width = `${((current + 1) / quizQuestions.length) * 100}%`;
    stepsHolder.querySelectorAll(".quiz-step").forEach((step, index) => {
      step.classList.toggle("is-active", index === current);
    });
  };

  startButton?.addEventListener("click", () => {
    shell?.classList.add("is-playing");
    quizFlow.classList.remove("hidden");
    refresh();
  });

  stepsHolder.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (!button) return;

    const [questionIndex, optionIndex] = button.dataset.answer.split("-").map(Number);
    const option = quizQuestions[questionIndex].options[optionIndex];
    Object.entries(option.weights).forEach(([key, value]) => {
      scores[key] += value;
    });

    current += 1;
    if (current < quizQuestions.length) {
      refresh();
      return;
    }

    const total = scores.analyst + scores.creator + scores.leader;
    const percentages = {
      analyst: Math.round((scores.analyst / total) * 100),
      creator: Math.round((scores.creator / total) * 100),
      leader: Math.round((scores.leader / total) * 100)
    };
    const topType = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0];
    const labels = { analyst: "Analyst", creator: "Creator", leader: "Leader" };
    const summaries = {
      analyst: "أنت تقرأ الأنماط وتبني قرارات ذكية بسرعة.",
      creator: "أنت ترى احتمالات لا يراها معظم الناس.",
      leader: "أنت تحوّل الحركة الفردية إلى طاقة جماعية."
    };

    shell?.classList.remove("is-playing");
    shell?.classList.add("is-finished");
    quizFlow.classList.add("hidden");
    result.classList.remove("hidden");
    result.classList.add("is-visible");
    result.innerHTML = `
      <div class="career-banner">
        <strong>تحليل مبدئي لشخصيتك</strong>
        <p class="copy">${summaries[topType[0]]}</p>
      </div>
      <div class="result-summary">
        <div class="result-stat">
          <span class="muted">الشخصية الأقرب لك</span>
          <strong>${topType[1]}% ${labels[topType[0]]}</strong>
        </div>
        <div class="result-stat">
          <span class="muted">الانطباع الأول</span>
          <strong>ملف مهني واضح قابل للبناء</strong>
        </div>
      </div>
      <div class="result-bars">
        ${["analyst", "creator", "leader"]
          .map(
            (key) => `
              <div class="bar-row">
                <div class="bar-label">
                  <span>${labels[key]}</span>
                  <span>${percentages[key]}%</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${percentages[key]}%"></div>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="cta-banner">
        <strong>لو كملت معانا، هنبني لك تحليل كامل + فرص مناسبة ليك</strong>
        <p class="copy">الخطوة التالية تحول الانطباع السريع إلى بروفايل كامل + مسار تعلم + وظائف ذكية.</p>
        <div class="hero-actions">
          <a class="primary-btn" href="student-auth.html">Unlock Full Analysis</a>
          <a class="ghost-btn" href="company-auth.html">أنا شركة وأريد Job DNA</a>
        </div>
      </div>
    `;
  });
}

function setupOnboarding() {
  const root = document.querySelector("[data-onboarding]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll(".wizard-step"));
  const progress = root.querySelector("[data-wizard-progress]");
  const status = root.querySelector("[data-wizard-status]");
  const next = root.querySelector("[data-next-step]");
  const prev = root.querySelector("[data-prev-step]");
  const finish = root.querySelector("[data-finish-step]");
  const completion = root.querySelector("[data-completion]");
  const challengeInput = root.querySelector("[data-challenge-input]");
  const challengeFeedback = root.querySelector("[data-challenge-feedback]");
  let current = 0;

  const refresh = () => {
    steps.forEach((step, index) => step.classList.toggle("is-active", index === current));
    const percentage = Math.round(((current + 1) / steps.length) * 100);
    if (progress) progress.style.width = `${percentage}%`;
    if (status) status.textContent = `أنت دلوقتي ${percentage}% مكتمل`;
    if (prev) prev.disabled = current === 0;
    if (next) next.classList.toggle("hidden", current === steps.length - 1);
    if (finish) finish.classList.toggle("hidden", current !== steps.length - 1);
  };

  root.querySelectorAll("[data-selectable]").forEach((item) => {
    item.addEventListener("click", () => item.classList.toggle("is-selected"));
  });

  next?.addEventListener("click", () => {
    if (current < steps.length - 1) {
      current += 1;
      refresh();
    }
  });

  prev?.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      refresh();
    }
  });

  finish?.addEventListener("click", () => {
    const answer = challengeInput?.value.trim();
    if (answer !== "8") {
      if (challengeFeedback) {
        challengeFeedback.textContent = "جرّب مرة ثانية. ركّز في ترتيب الأولويات قبل التنفيذ.";
      }
      return;
    }

    if (challengeFeedback) {
      challengeFeedback.textContent = "إجابة ممتازة. واضح أنك تميل للتفكير المنهجي تحت الضغط.";
    }

    completion?.classList.remove("hidden");
    completion?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  refresh();
}

function animateMeters() {
  document.querySelectorAll("[data-meter]").forEach((item) => {
    const value = Number(item.dataset.meter || "0");
    window.setTimeout(() => {
      item.style.width = `${value}%`;
    }, 150);
  });
}
