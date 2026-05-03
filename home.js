const heroMessages = [
  "كثير من الطلاب يضيّعون وقتًا طويلًا قبل ما يفهموا هم مناسبين لإيه",
  "3 أسئلة قصيرة قد تكون بداية أوضح من ساعات طويلة من التردد",
  "SkillBridge يساعدك تبدأ من اتجاه مفهوم بدل التخمين"
];

const quizMicroFeedback = {
  data: [
    "واضح إنك تميل للمنطق والتحليل",
    "اختيارك يعكس راحة مع التفاصيل والقياس",
    "أنت قريب من الأدوار التي تعتمد على الفهم العميق للمعلومات"
  ],
  design: [
    "واضح إن عندك حس بصري واهتمام بالتجربة",
    "اختيارك يميل للإبداع وصناعة أشياء مفهومة وجذابة",
    "أنت أقرب للمسارات التي تجمع بين الذوق والحل العملي"
  ],
  business: [
    "واضح إنك تتحرك جيدًا مع الناس والقرارات",
    "اختيارك يعكس ميلًا للتأثير والتنظيم",
    "أنت أقرب للأدوار التي تحتاج قيادة وتنسيقًا واضحًا"
  ]
};

const loadingMessages = [
  "بنجهز لك تجربة سريعة وواضحة...",
  "بنرتب المؤشرات الأولى لمسارك...",
  "جاهزين نبدأ معك الآن"
];

const PASSPORT_KEY = "skillbridgeTalentPassport";
const QUICK_ASSESSMENT_KEY = "skillbridgeAssessmentResult";
const DRAFT_KEY = "skillbridgeOnboardingDraft";

const quizQuestions = [
  {
    question: "تفضل العمل مع:",
    options: [
      { label: "أرقام وتحليل", track: "data" },
      { label: "تصميم وتجربة", track: "design" },
      { label: "ناس وتنظيم", track: "business" }
    ]
  },
  {
    question: "أنت غالبًا أكثر:",
    options: [
      { label: "تحليلي", track: "data" },
      { label: "مبدع", track: "design" },
      { label: "قيادي", track: "business" }
    ]
  },
  {
    question: "أي مهمة تستمتع بها أكثر؟",
    options: [
      { label: "حل مشكلة معقدة", track: "data" },
      { label: "بناء تجربة جميلة وواضحة", track: "design" },
      { label: "تنظيم فريق وتحريك العمل", track: "business" }
    ]
  }
];

const quizResults = {
  data: {
    title: "أنت أقرب إلى مسار Data بنسبة 82%",
    fullTitle: "مجالك الأقرب: Data Analysis بنسبة 82%",
    description: "تميل إلى التحليل، قراءة الأنماط، وتحويل المعلومات إلى قرارات واضحة.",
    personalized:
      "من اختياراتك يظهر أنك ترتاح للتفكير المنظم، وفهم التفاصيل، وبناء قرارات على معلومات واضحة. هذا يجعلك قريبًا من مسارات مثل Data Analysis وBusiness Intelligence.",
    strengths: ["تفكير تحليلي", "ملاحظة التفاصيل", "الراحة مع الأرقام"],
    paths: ["Data Analysis", "Business Intelligence", "Reporting"],
    nextStep: "ابدأ بأساسيات Excel أو SQL، ثم طبّق على مشروع صغير لترى هل هذا المسار يناسبك فعلًا.",
    retentionHooks: [
      "تميل إلى العمل الذي يحتاج فهمًا دقيقًا للمعلومات",
      "لديك قابلية جيدة للتعامل مع الأرقام والأنماط",
      "أفضل بداية لك هي التعلم العملي خطوة بخطوة"
    ],
    dnaBars: [
      { label: "Analysis", value: 82 },
      { label: "Focus", value: 76 },
      { label: "Execution", value: 68 }
    ]
  },
  design: {
    title: "أنت أقرب إلى مسار Design بنسبة 79%",
    fullTitle: "مجالك الأقرب: Product Design بنسبة 79%",
    description: "تميل إلى الحس البصري، تبسيط التجربة، وصناعة شيء مفهوم وجذاب.",
    personalized:
      "اختياراتك توضح أنك تهتم بالشكل والتجربة معًا، وتميل لتحويل الأفكار إلى شيء أسهل وأجمل للمستخدم. هذا يقربك من Product Design وUI/UX.",
    strengths: ["حس بصري", "تفكير إبداعي", "تبسيط التجربة"],
    paths: ["Product Design", "UI/UX", "Brand Experience"],
    nextStep: "ابدأ بتحليل تطبيقات أو مواقع تحبها، ثم جرّب إعادة تصميم جزء صغير منها لتختبر نفسك عمليًا.",
    retentionHooks: [
      "تنجذب للتجارب الواضحة والمريحة بصريًا",
      "عندك ميل لفهم المستخدم وتحسين رحلته",
      "أفضل بداية لك هي الملاحظة ثم التطبيق السريع"
    ],
    dnaBars: [
      { label: "Creativity", value: 79 },
      { label: "Empathy", value: 72 },
      { label: "Visual Sense", value: 84 }
    ]
  },
  business: {
    title: "أنت أقرب إلى مسار Business بنسبة 76%",
    fullTitle: "مجالك الأقرب: Business & Operations بنسبة 76%",
    description: "تميل إلى التواصل، ترتيب الأولويات، وتحريك الناس نحو هدف واضح.",
    personalized:
      "اختياراتك تشير إلى أنك تميل للعمل مع الناس، وربط التفاصيل ببعضها، واتخاذ قرارات عملية. هذا يجعلك قريبًا من مسارات Business وOperations وProduct Coordination.",
    strengths: ["القيادة", "التواصل", "تنظيم الأولويات"],
    paths: ["Operations", "Business Development", "Product Coordination"],
    nextStep: "ابدأ بفهم كيف تتحرك الفرق والمشاريع داخل الشركات، ثم جرّب متابعة حالة عملية أو منتج وتفكيكها بنفسك.",
    retentionHooks: [
      "ترتاح أكثر عندما يكون لديك هدف واضح وفريق يتحرك نحوه",
      "لديك قابلية للتنسيق بين الناس والمهام",
      "أفضل بداية لك هي فهم التشغيل واتخاذ القرار العملي"
    ],
    dnaBars: [
      { label: "Leadership", value: 76 },
      { label: "Communication", value: 82 },
      { label: "Strategy", value: 71 }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupLoadingScreen();
  setupHeader();
  setupReveal();
  setupHeroTicker();
  setupStudentFlowCtas();
  setupQuiz();
});

function setupLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingMessage = document.getElementById("loadingMessage");
  const loadingBar = document.getElementById("loadingBar");

  if (!loadingScreen || !loadingMessage || !loadingBar) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loadingBar.style.width = "100%";
    loadingScreen.classList.add("is-hidden");
    return;
  }

  let messageIndex = 0;
  let progress = 0;

  const messageInterval = window.setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingMessage.textContent = loadingMessages[messageIndex];
  }, 500);

  const progressInterval = window.setInterval(() => {
    progress += 10;
    loadingBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      window.clearInterval(progressInterval);
      window.clearInterval(messageInterval);
      loadingScreen.classList.add("is-hidden");
    }
  }, 60);
}

function setupHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!header) return;
      header.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && header) {
      header.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (
    typeof IntersectionObserver === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupHeroTicker() {
  const target = document.getElementById("heroDynamicText");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % heroMessages.length;
    target.textContent = heroMessages[index];
  }, 2600);
}

function setupStudentFlowCtas() {
  const flow = getStudentFlowState();
  const mappings = [
    { id: "landingAccessLink", href: flow.entryUrl, label: flow.entryLabel },
    { id: "heroSecondaryCta", href: flow.secondaryUrl, label: flow.secondaryLabel },
    { id: "nextPrimaryCta", href: flow.entryUrl, label: flow.entryLabel },
    { id: "nextSecondaryCta", href: flow.secondaryUrl, label: flow.secondaryLabel },
    { id: "resultPrimaryCta", href: flow.entryUrl, label: flow.entryLabel },
    { id: "resultSecondaryCta", href: flow.secondaryUrl, label: flow.secondaryLabel },
    { id: "footerStudentCta", href: flow.entryUrl, label: flow.entryLabel }
  ];

  mappings.forEach((item) => {
    const element = document.getElementById(item.id);
    if (!element) return;
    element.href = item.href;
    element.textContent = item.label;
  });
}

function setupQuiz() {
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const progressEl = document.getElementById("quizProgress");
  const stageEl = document.getElementById("quizStage");
  const resultEl = document.getElementById("quizResult");
  const resultOverlay = document.getElementById("resultOverlay");
  const resultBackdrop = document.getElementById("resultBackdrop");
  const resultClose = document.getElementById("resultClose");
  const resultTitle = document.getElementById("resultTitle");
  const resultAiCopy = document.getElementById("resultAiCopy");
  const resultStrengths = document.getElementById("resultStrengths");
  const resultPaths = document.getElementById("resultPaths");
  const resultNextStep = document.getElementById("resultNextStep");
  const resultProgressText = document.getElementById("resultProgressText");
  const resultHooks = document.getElementById("resultHooks");
  const dnaBars = document.getElementById("dnaBars");
  const quizFeedback = document.getElementById("quizFeedback");

  if (!questionEl || !optionsEl || !progressEl || !stageEl || !resultEl) return;

  let currentIndex = 0;
  let lastSelectedTrack = "data";
  const scores = { data: 0, design: 0, business: 0 };

  function renderQuestion() {
    const currentQuestion = quizQuestions[currentIndex];
    const progressValue = ((currentIndex + 1) / quizQuestions.length) * 100;

    stageEl.textContent = `سؤال ${currentIndex + 1} من ${quizQuestions.length}`;
    questionEl.textContent = currentQuestion.question;
    progressEl.style.width = `${progressValue}%`;
    resultEl.classList.add("hidden");
    resultEl.innerHTML = "";

    if (quizFeedback) {
      quizFeedback.textContent = "كل اختيار هنا يقرّبنا من صورتك المهنية الأقرب.";
    }

    optionsEl.replaceChildren(
      ...currentQuestion.options.map((option, index) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.type = "button";
        button.dataset.optionIndex = String(index);
        button.textContent = option.label;
        return button;
      })
    );
  }

  function renderInlineResult(flow, result) {
    const description = document.createElement("p");
    description.textContent = result.description;

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const primary = document.createElement("a");
    primary.className = "btn btn-primary";
    primary.href = flow.entryUrl;
    primary.textContent = flow.entryLabel;

    const secondary = document.createElement("a");
    secondary.className = "btn btn-ghost";
    secondary.href = flow.secondaryUrl;
    secondary.textContent = flow.secondaryLabel;

    actions.append(primary, secondary);
    resultEl.replaceChildren(description, actions);
    resultEl.classList.remove("hidden");
  }

  function renderList(element, items) {
    element.replaceChildren(
      ...items.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      })
    );
  }

  function renderDnaBars(element, bars) {
    element.replaceChildren(
      ...bars.map((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "dna-bar";

        const head = document.createElement("div");
        head.className = "dna-bar-head";

        const label = document.createElement("span");
        label.textContent = item.label;

        const value = document.createElement("span");
        value.textContent = `${item.value}%`;

        const track = document.createElement("div");
        track.className = "dna-bar-track";

        const fill = document.createElement("span");
        fill.style.width = `${item.value}%`;

        head.append(label, value);
        track.append(fill);
        wrapper.append(head, track);
        return wrapper;
      })
    );
  }

  function getBestTrack() {
    const rankedTracks = Object.entries(scores).sort((left, right) => right[1] - left[1]);
    const topScore = rankedTracks[0][1];
    const topTracks = rankedTracks.filter((entry) => entry[1] === topScore).map((entry) => entry[0]);

    if (topTracks.includes(lastSelectedTrack)) {
      return lastSelectedTrack;
    }

    return topTracks[0];
  }

  function showResultOverlay(result) {
    if (
      !resultOverlay ||
      !resultTitle ||
      !resultAiCopy ||
      !resultStrengths ||
      !resultPaths ||
      !resultNextStep ||
      !resultProgressText ||
      !resultHooks ||
      !dnaBars
    ) {
      return;
    }

    resultTitle.textContent = result.fullTitle;
    resultAiCopy.textContent = result.personalized;
    resultNextStep.textContent = result.nextStep;
    resultProgressText.textContent = "أنت أنهيت أول خطوة في رحلتك";

    renderList(resultStrengths, result.strengths);
    renderList(resultPaths, result.paths);
    renderList(resultHooks, result.retentionHooks);
    renderDnaBars(dnaBars, result.dnaBars);

    resultOverlay.classList.remove("hidden");
    resultOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    resultClose?.focus();
  }

  function renderResult() {
    const bestTrack = getBestTrack();
    const result = quizResults[bestTrack];

    persistQuickAssessment(bestTrack, result);
    setupStudentFlowCtas();

    const flow = getStudentFlowState();

    stageEl.textContent = "النتيجة جاهزة";
    questionEl.textContent = result.title;
    progressEl.style.width = "100%";
    optionsEl.replaceChildren();

    renderInlineResult(flow, result);
    showResultOverlay(result);
  }

  function closeResultOverlay() {
    if (!resultOverlay) return;
    resultOverlay.classList.add("hidden");
    resultOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  resultClose?.addEventListener("click", closeResultOverlay);
  resultBackdrop?.addEventListener("click", closeResultOverlay);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeResultOverlay();
  });

  optionsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option-index]");
    if (!button) return;

    optionsEl.querySelectorAll(".quiz-option").forEach((optionButton) => {
      optionButton.disabled = true;
    });
    button.classList.add("is-selected");

    const optionIndex = Number(button.dataset.optionIndex);
    const selectedOption = quizQuestions[currentIndex].options[optionIndex];

    lastSelectedTrack = selectedOption.track;
    scores[selectedOption.track] += 1;

    if (quizFeedback) {
      const feedbackSet = quizMicroFeedback[selectedOption.track];
      quizFeedback.textContent = feedbackSet[Math.min(currentIndex, feedbackSet.length - 1)];
    }

    currentIndex += 1;

    window.setTimeout(() => {
      if (currentIndex >= quizQuestions.length) {
        renderResult();
        return;
      }

      renderQuestion();
    }, 180);
  });

  renderQuestion();
}

function persistQuickAssessment(track, result) {
  const personaMap = {
    data: "analyst",
    design: "creator",
    business: "communicator"
  };

  const weaknessMap = {
    data: ["التواصل السريع", "العمل تحت ضغط لحظي"],
    design: ["الروتين الصارم", "البيئات الجامدة جدًا"],
    business: ["العمل التقني العميق المنفرد", "التركيز الطويل جدًا على مهمة واحدة"]
  };

  const stylesMap = {
    data: "Thinking Style: Analytical. Work Style: Structured / Insight-driven.",
    design: "Thinking Style: Creative. Work Style: Flexible / Experience-driven.",
    business: "Thinking Style: Social. Work Style: Team / Action-driven."
  };

  const assessmentState = {
    persona: personaMap[track] || "analyst",
    careerPath: result.fullTitle,
    title: result.title,
    fullTitle: result.fullTitle,
    copy: result.personalized,
    personality: result.description,
    strengths: result.strengths,
    weaknesses: weaknessMap[track] || ["التواصل", "التركيز"],
    paths: result.paths,
    next: result.nextStep,
    styles: stylesMap[track] || stylesMap.data,
    dna: result.dnaBars.map((item) => ({
      label: item.label,
      value: item.value
    })),
    completedAt: new Date().toISOString(),
    source: "quick-quiz"
  };

  try {
    window.localStorage.setItem(QUICK_ASSESSMENT_KEY, JSON.stringify(assessmentState));
  } catch (error) {
    console.warn("Unable to persist quick assessment result", error);
  }
}

function getStudentFlowState() {
  let passport = {};
  let assessment = {};
  let draft = {};

  try {
    passport = JSON.parse(window.localStorage.getItem(PASSPORT_KEY) || "null") || {};
  } catch (error) {
    passport = {};
  }

  try {
    assessment = JSON.parse(window.localStorage.getItem(QUICK_ASSESSMENT_KEY) || "null") || {};
  } catch (error) {
    assessment = {};
  }

  try {
    draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null") || {};
  } catch (error) {
    draft = {};
  }

  const completedSteps = Array.isArray(passport.completedSteps) ? passport.completedSteps.length : 0;
  const hasPassport = Boolean(passport.name || passport.email);
  const hasAssessment = Boolean(assessment.fullTitle || assessment.careerPath || assessment.persona);
  const hasDraft = Boolean(draft.profile || draft.currentStep >= 0);
  const isReturning = completedSteps >= 3 || (hasPassport && hasAssessment);

  if (isReturning) {
    return {
      entryUrl: "student-dashboard.html",
      entryLabel: "افتح الـ Dashboard",
      secondaryUrl: "talent-dna.html",
      secondaryLabel: "شاهد Talent DNA"
    };
  }

  if (!hasPassport && !hasDraft && hasAssessment) {
    return {
      entryUrl: "student-auth.html",
      entryLabel: "ابدأ رحلتك الآن",
      secondaryUrl: "student-dashboard.html",
      secondaryLabel: "شاهد الـ Dashboard"
    };
  }

  if (hasDraft || hasPassport) {
    return {
      entryUrl: "student-auth.html",
      entryLabel: "كمّل رحلتك",
      secondaryUrl: "student-onboarding.html",
      secondaryLabel: "كمّل الـ Onboarding"
    };
  }

  return {
    entryUrl: "student-auth.html",
    entryLabel: "ابدأ رحلتك الآن",
    secondaryUrl: "student-auth.html",
    secondaryLabel: "لديك حساب؟ سجل دخولك"
  };
}
