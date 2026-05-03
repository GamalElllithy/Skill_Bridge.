const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");

if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navPanel.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNav = navPanel.contains(event.target) || menuToggle.contains(event.target);
        if (!clickedInsideNav) {
            navPanel.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
        const field = document.querySelector(button.dataset.passwordToggle);
        if (!field) {
            return;
        }

        const isPassword = field.getAttribute("type") === "password";
        field.setAttribute("type", isPassword ? "text" : "password");
        button.textContent = isPassword ? "Hide" : "Show";
    });
});

const showToast = (message) => {
    const currentToast = document.querySelector(".toast");
    if (currentToast) {
        currentToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, 3200);
};

document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("Frontend demo submitted successfully. Connect a backend next if you want live data.");
        form.reset();
    });
});

const year = document.getElementById("year");
if (year) {
    year.textContent = new Date().getFullYear();
}

const bookingDate = document.getElementById("booking-date");
if (bookingDate) {
    const today = new Date().toISOString().split("T")[0];
    bookingDate.setAttribute("min", today);
}

const statValues = document.querySelectorAll(".stat-value");
if (statValues.length) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const element = entry.target;
            const target = Number(element.dataset.target || 0);
            const suffix = element.dataset.suffix || "";
            const duration = 1400;
            const startTime = performance.now();

            const updateCount = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                element.textContent = `${value}${suffix}`;
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    element.textContent = `${target}${suffix}`;
                }
            };

            requestAnimationFrame(updateCount);
            statObserver.unobserve(element);
        });
    }, { threshold: 0.5 });

    statValues.forEach((stat) => statObserver.observe(stat));
}

const events = [
    {
        title: "Frontend Sprint Workshop",
        summary: "A hands-on design-to-code session where students build a landing page with motion and visual polish.",
        type: "workshop",
        date: "2026-04-04",
        time: "11:00 AM",
        location: "Creative Lab A",
        seats: 24
    },
    {
        title: "Open Campus Discovery Tour",
        summary: "A guided experience for students and parents to explore labs, departments, and the campus learning culture.",
        type: "tour",
        date: "2026-04-06",
        time: "01:30 PM",
        location: "Main Atrium",
        seats: 40
    },
    {
        title: "Cyber Network Challenge",
        summary: "A timed team competition focused on troubleshooting network scenarios and security awareness.",
        type: "competition",
        date: "2026-04-09",
        time: "10:00 AM",
        location: "Network Operations Room",
        seats: 18
    },
    {
        title: "Telecom Futures Talk",
        summary: "Industry speakers share how modern telecom systems are evolving through smart infrastructure and AI.",
        type: "talk",
        date: "2026-04-12",
        time: "12:15 PM",
        location: "Innovation Hall",
        seats: 60
    },
    {
        title: "Student Portfolio Review Night",
        summary: "Mentors give live feedback on student projects, code structure, and visual presentation quality.",
        type: "workshop",
        date: "2026-04-15",
        time: "05:00 PM",
        location: "Media Studio",
        seats: 28
    },
    {
        title: "Robotics and Smart Systems Showcase",
        summary: "A high-energy exhibition featuring student prototypes, embedded systems, and interactive demos.",
        type: "competition",
        date: "2026-04-18",
        time: "02:00 PM",
        location: "Tech Arena",
        seats: 90
    }
];

const campusFeed = [
    {
        title: "Labs are warming up",
        copy: "Programming teams are preparing interactive demos for the next workshop sprint."
    },
    {
        title: "Parents tour slots are filling",
        copy: "The next guided campus discovery tour is getting strong interest this week."
    },
    {
        title: "Student projects on display",
        copy: "New UI prototypes and network simulations are being highlighted in the student showcase area."
    },
    {
        title: "Mentor week is active",
        copy: "Advisors are running feedback circles to help students sharpen both code and presentation quality."
    }
];

const eventsGrid = document.getElementById("events-grid");
const filterButtons = document.querySelectorAll("[data-filter]");
const nextEventTitle = document.getElementById("next-event-title");
const nextEventSummary = document.getElementById("next-event-summary");
const nextEventDate = document.getElementById("next-event-date");
const nextEventTime = document.getElementById("next-event-time");
const nextEventLocation = document.getElementById("next-event-location");
const countdownContainer = document.getElementById("event-countdown");
const feedTitle = document.getElementById("campus-feed-title");
const feedCopy = document.getElementById("campus-feed-copy");

const formatEventDate = (dateString) => {
    const date = new Date(`${dateString}T09:00:00`);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
};

const renderEvents = (filter = "all") => {
    if (!eventsGrid) {
        return;
    }

    const filteredEvents = filter === "all"
        ? events
        : events.filter((event) => event.type === filter);

    eventsGrid.innerHTML = filteredEvents.map((event) => {
        const date = new Date(`${event.date}T09:00:00`);
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const day = date.toLocaleDateString("en-US", { day: "2-digit" });
        return `
            <article class="event-card reveal is-visible">
                <div class="event-top">
                    <span class="event-type">${event.type}</span>
                    <div class="event-date-badge">
                        <span>${month}</span>
                        <strong>${day}</strong>
                    </div>
                </div>
                <h3>${event.title}</h3>
                <p>${event.summary}</p>
                <div class="event-meta">
                    <div>
                        <span>Date</span>
                        <strong>${formatEventDate(event.date)}</strong>
                    </div>
                    <div>
                        <span>Time & Place</span>
                        <strong>${event.time} · ${event.location}</strong>
                    </div>
                </div>
                <div class="event-footer">
                    <span class="event-seats">${event.seats} seats available</span>
                    <a class="event-link" href="we-school-booking.html">Reserve spot</a>
                </div>
            </article>
        `;
    }).join("");
};

if (filterButtons.length) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((chip) => chip.classList.remove("is-active"));
            button.classList.add("is-active");
            renderEvents(button.dataset.filter);
        });
    });
}

const getNextEvent = () => {
    const now = new Date();
    const upcoming = events
        .map((event) => ({
            ...event,
            timestamp: new Date(`${event.date}T09:00:00`)
        }))
        .find((event) => event.timestamp >= now);

    return upcoming || {
        ...events[0],
        timestamp: new Date(`${events[0].date}T09:00:00`)
    };
};

const nextEvent = getNextEvent();

if (nextEventTitle && nextEventSummary && nextEventDate && nextEventTime && nextEventLocation) {
    nextEventTitle.textContent = nextEvent.title;
    nextEventSummary.textContent = nextEvent.summary;
    nextEventDate.textContent = formatEventDate(nextEvent.date);
    nextEventTime.textContent = nextEvent.time;
    nextEventLocation.textContent = nextEvent.location;
}

const updateCountdown = () => {
    if (!countdownContainer) {
        return;
    }

    const now = new Date();
    const diff = Math.max(nextEvent.timestamp - now, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    countdownContainer.innerHTML = `
        <div><strong>${String(days).padStart(2, "0")}</strong><span>Days</span></div>
        <div><strong>${String(hours).padStart(2, "0")}</strong><span>Hours</span></div>
        <div><strong>${String(minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
    `;
};

let feedIndex = 0;
const updateCampusFeed = () => {
    if (!feedTitle || !feedCopy) {
        return;
    }

    const item = campusFeed[feedIndex];
    feedTitle.textContent = item.title;
    feedCopy.textContent = item.copy;
    feedIndex = (feedIndex + 1) % campusFeed.length;
};

renderEvents();
updateCountdown();
updateCampusFeed();

if (countdownContainer) {
    window.setInterval(updateCountdown, 60000);
}

if (feedTitle && feedCopy) {
    window.setInterval(updateCampusFeed, 3500);
}
