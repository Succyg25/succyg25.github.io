document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Navbar Active State Handling
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled', 'shadow-sm');
        } else {
            navbar.classList.remove('scrolled', 'shadow-sm');
        }
    });

    // 3. Contact Form Handling (Simulated)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // Simulate API call
            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                contactForm.reset();
            }, 1500);
        });
    }

    // 4. Interaction Observer for scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to sections on all pages
    document.querySelectorAll('section, .service-card, .portfolio-item').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
});
