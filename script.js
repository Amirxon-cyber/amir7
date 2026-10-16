
const elements = document.querySelectorAll(
    '.about-grid, .hobby, .family-card, .markus-image, .markus-text, .project-card, .goal-content, .goal-list div, .contact-card'
);

elements.forEach((element, index) => {
    element.classList.add(
        index % 2 === 0 ? 'reveal-left' : 'reveal-right'
    );
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.15
});

elements.forEach((element) => observer.observe(element));


// MOVING PARTICLES BACKGROUND

const canvas = document.querySelector("#particles-bg");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = 0;
    let height = 0;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const count = Math.min(70, Math.floor(width / 18));

        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > width) p.speedX *= -1;
            if (p.y < 0 || p.y > height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "#7187ff";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#6577ff";
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = p.x - other.x;
                const dy = p.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle =
                        `rgba(101, 119, 255, ${1 - distance / 110})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        ctx.shadowBlur = 0;
        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();

    window.addEventListener("resize", resizeCanvas);
}


// SCROLL PROGRESS AND BACK TO TOP

const progress = document.querySelector("#scroll-progress");
const backToTop = document.querySelector("#back-to-top");

function updateScroll() {
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const percent = maxScroll > 0
        ? (window.scrollY / maxScroll) * 100
        : 0;

    if (progress) {
        progress.style.width = percent + "%";
    }

    if (backToTop) {
        backToTop.classList.toggle(
            "visible",
            window.scrollY > 400
        );
    }
}

window.addEventListener("scroll", updateScroll, {
    passive: true
});

updateScroll();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// PROJECT DETAILS

const projectDetails = [
    {
        title: "Shaxsiy sayt",
        description: "Bu mening shaxsiy saytim. Unda men haqimdagi ma'lumotlar, qiziqishlarim, oilam va aloqalarim joylashgan. Texnologiyalar: HTML, CSS va JavaScript."
    },
    {
        title: "Online do‘kon",
        description: "Kelajakdagi loyiham. Unda mahsulotlar, narxlar, qidiruv va savatcha kabi imkoniyatlar bo‘lishi mumkin. Texnologiyalar: HTML, CSS va JavaScript."
    },
    {
        title: "Avtomobil sayti",
        description: "Avtomobillar haqida ma'lumot beruvchi loyiha. Unda mashinalar rasmlari, texnik xususiyatlari va narxlari ko‘rsatilishi mumkin."
    }
];

const projectCards = document.querySelectorAll(".project-card");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const closeModal = document.querySelector(".project-modal-close");

if (modal && modalTitle && modalDescription && closeModal) {
    projectCards.forEach((card, index) => {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-haspopup", "dialog");

        if (!card.querySelector(".project-more")) {
            const more = document.createElement("span");
            more.className = "project-more";
            more.textContent = "Batafsil ko‘rish ↗";
            card.appendChild(more);
        }

        function openProject() {
            const project = projectDetails[index];
            if (!project) return;

            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modal.classList.add("open");
            closeModal.focus();
        }

        card.addEventListener("click", openProject);

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProject();
            }
        });
    });

    function hideModal() {
        modal.classList.remove("open");
    }

    closeModal.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            hideModal();
        }
    });
}
