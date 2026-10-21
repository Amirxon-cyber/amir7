
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// ===============================
// 1. ЗВЁЗДНОЕ НЕБО
// ===============================

let canvas = select("#particles-bg");

if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "particles-bg";
    document.body.prepend(canvas);
}

const ctx = canvas.getContext("2d");

let stars = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = [];

    const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 4500),
        350
    );

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.3,
            opacity: Math.random() * 0.7 + 0.2,
            speed: Math.random() * 0.015 + 0.003,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
        star.opacity += star.speed * star.direction;

        if (star.opacity >= 1) {
            star.opacity = 1;
            star.direction = -1;
        }

        if (star.opacity <= 0.15) {
            star.opacity = 0.15;
            star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 190, 255, ${star.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#8b5cf6";
        ctx.fill();
    });

    ctx.shadowBlur = 0;
    animationFrame = requestAnimationFrame(drawStars);
}

canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
`;

resizeCanvas();
drawStars();

window.addEventListener("resize", resizeCanvas);

// Контент сайта остаётся над звёздами
const pageContent = selectAll(
    "header, main, footer, section, .modal, #back-to-top"
);

pageContent.forEach((element) => {
    if (getComputedStyle(element).position === "static") {
        element.style.position = "relative";
    }
});

// ===============================
// 2. АНИМАЦИИ ПОЯВЛЕНИЯ
// ===============================

const revealElements = selectAll(`
    .about-grid,
    .hobby,
    .family-card,
    .markus-image,
    .markus-text,
    .project-card,
    .goal-content,
    .goal-list div,
    .contact-card,
    section h2,
    .stats
`);

revealElements.forEach((element, index) => {
    element.classList.add("js-reveal");

    element.style.transitionDelay = `${(index % 4) * 0.1}s`;
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

// ===============================
// 3. СТИЛИ АНИМАЦИЙ
// ===============================

const animationStyles = document.createElement("style");

animationStyles.textContent = `
    .js-reveal {
        opacity: 0;
        transform: translateY(35px);
        transition:
            opacity 0.8s ease,
            transform 0.8s ease;
    }

    .js-reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .project-card,
    .family-card,
    .hobby,
    .contact-card {
        transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
    }

    .project-card:hover,
    .family-card:hover,
    .hobby:hover,
    .contact-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 35px rgba(124, 58, 237, 0.2);
    }

    #particles-bg {
        display: block !important;
    }

    @media (prefers-reduced-motion: reduce) {
        .js-reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;

document.head.appendChild(animationStyles);

// ===============================
// 4. ПЛАВНАЯ ПРОКРУТКА
// ===============================

selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = select(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ===============================
// 5. ИНДИКАТОР ПРОКРУТКИ
// ===============================

const progressBar = select("#scroll-progress");

function updateProgress() {
    if (!progressBar) return;

    const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress);
updateProgress();

// ===============================
// 6. КНОПКА ВВЕРХ
// ===============================

const backToTop = select("#back-to-top");

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        backToTop.style.opacity =
            window.scrollY > 400 ? "1" : "0.5";
    });
}

// ===============================
// 7. СЧЁТЧИКИ
// ===============================

const counters = selectAll(".stats strong");

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const originalText = counter.textContent.trim();

        if (!/^\d+$/.test(originalText)) {
            counterObserver.unobserve(counter);
            return;
        }

        const target = Number(originalText);
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3);

            counter.textContent = Math.floor(target * eased)
                .toString()
                .padStart(originalText.length, "0");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = originalText;
            }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
    });
}, { threshold: 0.5 });

counters.forEach((counter) => {
    counterObserver.observe(counter);
});

// ===============================
// 8. АКТИВНОЕ МЕНЮ
// ===============================

const sections = selectAll("main section[id]");
const navLinks = selectAll("nav a[href^='#']");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
            );
        });
    });
}, { threshold: 0.35 });

sections.forEach((section) => {
    sectionObserver.observe(section);
});

// ===============================
// 9. МОДАЛЬНОЕ ОКНО ПРОЕКТОВ
// ===============================

const projectModal = select("#project-modal");
const modalClose = select("#project-modal .close");
const modalContent = select("#project-modal .modal-content");

const projectDetails = [
    {
        title: "Mening loyiham",
        description: "Bu mening shaxsiy loyiham."
    },
    {
        title: "Web dasturlash",
        description: "Men HTML, CSS va JavaScript yordamida saytlar yaratishni o‘rganaman."
    },
    {
        title: "Kelajakdagi maqsadlarim",
        description: "Yangi texnologiyalarni o‘rganish va yanada yaxshi loyihalar yaratish."
    }
];

function closeModal() {
    if (!projectModal) return;

    projectModal.style.display = "none";
    document.body.style.overflow = "";
}

selectAll(".project-card").forEach((card, index) => {
    function openModal() {
        if (!projectModal || !modalContent) return;

        const project = projectDetails[index] || {
            title: card.querySelector("h3")?.textContent || "Loyiha",
            description: card.querySelector("p")?.textContent || ""
        };

        modalContent.innerHTML = `
            <button class="close" aria-label="Yopish">&times;</button>
            <h2>${project.title}</h2>
            <p>${project.description}</p>
        `;

        projectModal.style.display = "flex";
        document.body.style.overflow = "hidden";

        modalContent.querySelector(".close").addEventListener(
            "click",
            closeModal
        );
    }

    card.style.cursor = "pointer";

    card.addEventListener("click", openModal);

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal();
        }
    });

    card.setAttribute("tabindex", "0");
});

if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (projectModal) {
    projectModal.addEventListener("click", (event) => {
        if (event.target === projectModal) {
            closeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ===============================
// 10. КНОПКИ
// ===============================

selectAll("button").forEach((button) => {
    button.addEventListener("click", () => {
        button.style.transform = "scale(0.96)";

        setTimeout(() => {
            button.style.transform = "";
        }, 150);
    });
});

console.log("Sayt muvaffaqiyatli ishga tushdi!");
console.log("Yulduzli fon va animatsiyalar yoqildi!");

// FAMILY OWL CAROUSEL

$(document).ready(function () {
    $(".family-carousel").owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: true,
        smartSpeed: 700,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
});