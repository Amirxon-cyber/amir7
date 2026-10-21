document.addEventListener("DOMContentLoaded", function () {
    const select = (selector, parent = document) => parent.querySelector(selector);
    const selectAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const menuToggle = select("#menu-toggle");
    const navigation = select(".navigation");
    const navLinks = selectAll(".nav-link");
    const progressBar = select("#scroll-progress");
    const backToTop = select("#back-to-top");
    const modal = select("#project-modal");
    const modalTitle = select("#modal-title");
    const modalDescription = select("#modal-description");
    const modalClose = select(".project-modal-close");
    const modalDone = select(".modal-done");

    select("#current-year").textContent = new Date().getFullYear();

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            navigation.classList.toggle("open");
            menuToggle.textContent = navigation.classList.contains("open") ? "✕" : "☰";
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");
                menuToggle.textContent = "☰";
            });
        });

        document.addEventListener("click", function (event) {
            if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                navigation.classList.remove("open");
                menuToggle.textContent = "☰";
            }
        });
    }

    function updateScroll() {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollTop > 400);
        }
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const revealElements = selectAll(
        ".about-grid, .hobby, .family-card, .markus-image, .markus-text, .project-card, .goal-content, .goal-item, .contact-card, .detail-card, .section-heading, .about-main"
    );

    revealElements.forEach(function (element) {
        element.classList.add("js-reveal");
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }

    const counters = selectAll(".counter");
    let countersStarted = false;

    function runCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(function (counter) {
            const target = Number(counter.dataset.target) || 0;
            const duration = 1200;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const stats = select("#stats");

    if (stats && "IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(function (entries, observer) {
            if (entries[0].isIntersecting) {
                runCounters();
                observer.disconnect();
            }
        }, { threshold: 0.25 });

        counterObserver.observe(stats);
    } else {
        runCounters();
    }

    const sections = selectAll("section[id]");

    function updateActiveLink() {
        let currentId = "home";

        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 160) {
                currentId = section.id;
            }
        });

        navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + currentId;
            link.classList.toggle("active", isActive);
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    function openModal(title, description) {
        if (!modal) return;

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";

        if (modalClose) {
            modalClose.focus();
        }
    }

    function closeModal() {
        if (!modal) return;

        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    selectAll(".project-open").forEach(function (button) {
        button.addEventListener("click", function () {
            openModal(
                button.dataset.title || "Loyiha",
                button.dataset.description || "Bu loyiha haqida qo‘shimcha ma’lumot."
            );
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalDone) {
        modalDone.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    const canvas = select("#particles-bg");
    const context = canvas ? canvas.getContext("2d") : null;
    let particles = [];
    let animationFrame = null;

    function resizeCanvas() {
        if (!canvas || !context) return;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const particleCount = Math.min(
            100,
            Math.floor((window.innerWidth * window.innerHeight) / 13000)
        );

        particles = Array.from({ length: particleCount }, function () {
            return {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 1.5 + 0.4,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                alpha: Math.random() * 0.5 + 0.2
            };
        });
    }

    function drawParticles() {
        if (!canvas || !context) return;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const isLight = select("#theme-toggle")?.checked;
        const particleColor = isLight ? "112, 65, 216" : "160, 180, 255";

        particles.forEach(function (particle, index) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${particleColor}, ${particle.alpha})`;
            context.fill();

            for (let next = index + 1; next < particles.length; next++) {
                const other = particles[next];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(other.x, other.y);
                    context.strokeStyle = `rgba(${particleColor}, ${(1 - distance / 100) * 0.09})`;
                    context.lineWidth = 0.5;
                    context.stroke();
                }
            }
        });

        animationFrame = requestAnimationFrame(drawParticles);
    }

    if (canvas && context) {
        resizeCanvas();
        drawParticles();

        window.addEventListener("resize", resizeCanvas);

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                cancelAnimationFrame(animationFrame);
            } else {
                cancelAnimationFrame(animationFrame);
                drawParticles();
            }
        });
    }

    const familyCarousel = $(".family-carousel");

    if (familyCarousel.length && typeof $.fn.owlCarousel === "function") {
        familyCarousel.owlCarousel({
            loop: true,
            margin: 20,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 3500,
            autoplayHoverPause: true,
            smartSpeed: 650,
            navText: ["‹", "›"],
            responsive: {
                0: {
                    items: 1,
                    margin: 12
                },
                520: {
                    items: 2,
                    margin: 15
                },
                850: {
                    items: 3,
                    margin: 20
                }
            }
        });
    }

    selectAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = select(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});