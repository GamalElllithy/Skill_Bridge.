const JOB_SELECTION_KEY = "skillbridgeSelectedJobId";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") === "saved" ? "saved" : "applied";
  const key = activeTab === "saved" ? "savedJobs" : "appliedJobs";
  const items = getStoredList(key);

  const title = document.getElementById("libraryTitle");
  const copy = document.getElementById("libraryCopy");
  const count = document.getElementById("libraryCount");
  const mode = document.getElementById("libraryMode");
  const nextAction = document.getElementById("libraryNextAction");
  const grid = document.getElementById("libraryGrid");
  const empty = document.getElementById("libraryEmpty");
  const appliedTab = document.getElementById("libraryAppliedTab");
  const savedTab = document.getElementById("librarySavedTab");

  appliedTab?.classList.toggle("active", activeTab === "applied");
  savedTab?.classList.toggle("active", activeTab === "saved");

  replaceText(title, activeTab === "applied" ? "Applied Jobs" : "Saved Jobs");
  replaceText(mode, activeTab === "applied" ? "Application Tracker" : "Saved Shortlist");
  replaceText(count, `${items.length} ${activeTab === "applied" ? "Applied" : "Saved"}`);
  replaceText(nextAction, buildNextAction(activeTab, items));
  replaceText(
    copy,
    activeTab === "applied"
      ? "متابعة مختصرة لكل وظيفة قدمت عليها: الحالة، أفضل match، والخطوة الجاية."
      : "قائمة ذكية للوظائف المحفوظة. راجع الأفضل، افتح التفاصيل، أو احذف اللي مش مناسب."
  );

  if (!grid || !empty) return;

  if (!items.length) {
    grid.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.classList.remove("hidden");
  renderItems(items, activeTab, key, items);
  setupFilters(items, activeTab, key);
});

function setupFilters(items, activeTab, key) {
  document.querySelectorAll("[data-filter-status]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter-status]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter-status");
      const filtered = items.filter((item) => {
        const match = Number(item.match || 0);
        if (filter === "ready") return match >= 75;
        if (filter === "pending") return match < 75 || /pending/i.test(item.status || "");
        return true;
      });

      renderItems(filtered, activeTab, key, items);
    });
  });
}

function renderItems(list, activeTab, key, sourceItems) {
  const grid = document.getElementById("libraryGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <article class="library-card is-empty">
        <strong>No jobs match this filter</strong>
        <p class="library-meta">غير الفلتر أو ارجع لـ Smart Jobs لاختيار فرص أوضح.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = list.map((item) => {
    const match = Number(item.match || 0);
    const isReady = match >= 75;
    const status = activeTab === "applied" ? (item.status || "Pending Review") : (isReady ? "Ready to apply" : "Saved for later");

    return `
      <article class="library-card">
        <div class="library-head">
          <div>
            <span class="library-kicker">${isReady ? "Best next move" : "Review later"}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <div class="library-meta">${escapeHtml(item.company || "SkillBridge company")}</div>
          </div>
          <span class="match-pill ${isReady ? "is-ready" : ""}">${match}% Match</span>
        </div>
        <p class="library-meta">${escapeHtml(item.location || "Job from your flow")}</p>
        <div class="library-tags">${(item.tagsLabel || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="status-row">
          <span class="status-pill ${isReady ? "is-ready" : ""}">${escapeHtml(status)}</span>
          <span class="library-meta">${isReady ? "افتح التفاصيل أو قدّم مباشرة." : "راجع الـ gaps قبل التقديم."}</span>
        </div>
        <div class="library-actions">
          <button class="primary-btn" type="button" data-open-job-id="${escapeHtml(item.id)}">Open Job Details</button>
          <a class="ghost-btn" href="candidate-passport.html">Open Passport</a>
          ${activeTab === "saved" ? `<button class="ghost-btn" type="button" data-remove-id="${escapeHtml(item.id)}">Remove</button>` : ""}
        </div>
      </article>
    `;
  }).join("");

  bindCardActions(key, sourceItems);
}

function bindCardActions(key, sourceItems) {
  document.querySelectorAll("[data-open-job-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-open-job-id");
      if (!id) return;
      window.localStorage.setItem(JOB_SELECTION_KEY, id);
      window.location.href = "job-details.html";
    });
  });

  document.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-remove-id");
      const next = sourceItems.filter((item) => item.id !== id);
      window.localStorage.setItem(key, JSON.stringify(next));
      syncPassportSavedJobs(next);
      window.location.reload();
    });
  });
}

function buildNextAction(activeTab, items) {
  if (!items.length) return "Next: Open Smart Jobs";
  const best = [...items].sort((a, b) => Number(b.match || 0) - Number(a.match || 0))[0];
  if (activeTab === "applied") return `Next: Follow ${best?.title || "top application"}`;
  return `Next: Review ${best?.title || "best saved job"}`;
}

function getStoredList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function syncPassportSavedJobs(savedJobs) {
  let passport = {};

  try {
    passport = JSON.parse(window.localStorage.getItem("skillbridgeTalentPassport") || "null") || {};
  } catch (error) {
    passport = {};
  }

  if (!passport.name) return;

  passport.savedJobs = savedJobs;
  passport.lastSeenAt = new Date().toISOString();
  window.localStorage.setItem("skillbridgeTalentPassport", JSON.stringify(passport));
}

function replaceText(element, value) {
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
