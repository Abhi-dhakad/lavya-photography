document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const hoverElements = document.querySelectorAll('a, button, .gallery-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
            cursorOutline.style.borderColor = 'var(--gold)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--gold)';
        });
    });

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // --- Scroll Reveal (.reveal elements) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < windowHeight - 80) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Section Title Underline Animation ---
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => titleObserver.observe(title));

    // --- Gallery Items Scroll Reveal ---
    const galleryItems = document.querySelectorAll('.gallery-item');

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (entry.target.dataset.index || 0) * 80);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    galleryItems.forEach((item, i) => {
        item.dataset.index = i;
        galleryObserver.observe(item);
    });

    // --- Service Cards Stagger Entrance ---
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.parentElement.querySelectorAll('.service-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 120);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        cardObserver.observe(card);
    });

    // --- Gallery Lightbox ---
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return; // Skip video items
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // --- Gallery Filtering with animation ---
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.textContent.trim().toLowerCase();

            galleryItems.forEach((item, i) => {
                const itemCategory = item.getAttribute('data-category');
                if (!itemCategory) return;

                const matches = filterValue === 'all' || itemCategory.toLowerCase() === filterValue;

                if (matches) {
                    item.style.display = 'inline-block';
                    setTimeout(() => {
                        item.animate([
                            { opacity: 0, transform: 'scale(0.85) translateY(25px)' },
                            { opacity: 1, transform: 'scale(1) translateY(0)' }
                        ], { duration: 500, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' });
                    }, i * 50);
                } else {
                    item.animate([
                        { opacity: 1, transform: 'scale(1)' },
                        { opacity: 0, transform: 'scale(0.9)' }
                    ], { duration: 250, easing: 'ease', fill: 'forwards' }).finished.then(() => {
                        item.style.display = 'none';
                    });
                }
            });
        });
    });

    // --- Testimonial Slider with Slide Animation ---
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // --- Contact Form ---
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = '✓ Request Sent!';
            btn.style.background = 'var(--gold)';
            btn.style.color = 'var(--bg-color)';
            btn.style.transform = 'scale(1.03)';

            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                btn.style.background = 'transparent';
                btn.style.color = 'var(--gold)';
                btn.style.transform = 'scale(1)';
            }, 3000);
        });
    }

    // --- Sparkle particles on hero click ---
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('click', (e) => {
            for (let i = 0; i < 10; i++) {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: fixed;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #d4af37;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(spark);
                const angle = (i / 10) * 2 * Math.PI;
                const dist = 60 + Math.random() * 60;
                spark.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`, opacity: 0 }
                ], { duration: 700 + Math.random() * 300, easing: 'ease-out' }).finished.then(() => spark.remove());
            }
        });
    }

});
