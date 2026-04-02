document.addEventListener("DOMContentLoaded", () => {
  /* ── Navbar active state ───────────────────────── */
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link-custom").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === current);
  });

  /* ── Navbar scroll effect ──────────────────────── */
  const nav = document.getElementById("mainNav");
  const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────── */
  const mobileMenu = document.getElementById("mobileMenu");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const open = () => {
    mobileMenu?.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    mobileMenu?.classList.remove("open");
    document.body.style.overflow = "";
  };
  menuToggle?.addEventListener("click", open);
  menuClose?.addEventListener("click", close);
  mobileMenu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", close));

  /* ── Typewriter effect ─────────────────────────── */
  const el = document.getElementById("heroTypewriter");
  if (el) {
    const words = [
      "Web Experiences",
      "Brand Identities",
      "Growth Strategies",
      "Digital Products",
    ];
    let wi = 0,
      ci = 0,
      deleting = false;
    const MIN_DELAY = 60,
      MAX_DELAY = 120,
      PAUSE = 1800;
    const type = () => {
      const word = words[wi];
      el.textContent = word.substring(0, ci);
      if (!deleting) {
        ci++;
        if (ci > word.length) {
          deleting = true;
          setTimeout(type, PAUSE);
          return;
        }
      } else {
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(
        type,
        deleting
          ? MIN_DELAY / 2
          : MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY),
      );
    };
    type();
  }

  /* ── Animated counters ─────────────────────────── */
  const animateCounter = (el, target, duration = 1800) => {
    let start = 0,
      startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || "+");
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── Intersection Observer (reveal + counters + skills) */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        /* Scroll reveal */
        if (el.classList.contains("reveal-hidden")) {
          el.classList.add("animate-reveal");
          io.unobserve(el);
        }

        /* Counter */
        if (el.dataset.counter) {
          animateCounter(el, parseInt(el.dataset.counter));
          io.unobserve(el);
        }

        /* Skill bar */
        if (el.classList.contains("skill-bar-fill") && el.dataset.width) {
          el.style.width = el.dataset.width;
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal-hidden, [data-counter], .skill-bar-fill")
    .forEach((el) => io.observe(el));

  /* ── Portfolio filter tabs ──────────────────────── */
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".portfolio-card[data-category]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.transition = "opacity .35s ease, transform .35s ease";
        card.style.opacity = match ? "1" : "0.15";
        card.style.transform = match ? "scale(1)" : "scale(0.97)";
        card.style.pointerEvents = match ? "auto" : "none";
      });
    });
  });

  /* ── Contact form ──────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message Sent!';
        btn.style.background = "linear-gradient(135deg,#10b981,#059669)";
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = "";
        }, 3000);
      }, 1600);
    });
  }

  /* ── Particle canvas (hero only) ───────────────── */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let W,
      H,
      particles = [];

    const resize = () => {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const rand = (a, b) => a + Math.random() * (b - a);
    const COLORS = ["rgba(99,102,241,", "rgba(6,182,212,", "rgba(168,85,247,"];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: rand(0, 1),
        y: rand(0, 1),
        r: rand(1, 2.5),
        sp: rand(0.0002, 0.0006),
        dx: rand(-0.15, 0.15),
        dy: rand(-0.08, -0.22),
        alpha: rand(0.1, 0.4),
        color: COLORS[Math.floor(rand(0, 3))],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.y -= p.sp;
        p.x += p.dx * 0.001;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = rand(0, 1);
        }
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
});
