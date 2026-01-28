/**
 * 炭火焼き鳥 炎-HOMURA- Landing Page
 * JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initMobileMenu();
    initStickyHeader();
    initMenuTabs();
    initScrollAnimations();
    initReservationForm();
    initSmoothScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuToggle || !mobileOverlay) return;

    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking overlay background
    mobileOverlay.addEventListener('click', function (e) {
        if (e.target === this) {
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Sticky Header on Scroll
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Menu Category Tabs
 */
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const contents = document.querySelectorAll('.menu-category-content');

    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const category = this.dataset.category;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding content
            contents.forEach(content => {
                if (content.id === category) {
                    content.classList.remove('hidden');
                    // Add fade-in animation
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.concept-card, .menu-featured-card, .course-card, .gallery-item, .drink-category'
    );

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Reservation Form Handling
 */
function initReservationForm() {
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    // Set minimum date to today
    const dateInput = form.querySelector('#date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        const requiredFields = ['date', 'time', 'guests', 'name', 'phone'];
        const emptyFields = requiredFields.filter(field => !data[field]);

        if (emptyFields.length > 0) {
            showNotification('必須項目を入力してください', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('ご予約を承りました。確認メールをお送りします。', 'success');
            form.reset();
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-20px)',
        padding: '16px 24px',
        background: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        zIndex: '9999',
        opacity: '0',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Time Slot Click Handler
 */
document.querySelectorAll('.time-slot:not(.full)').forEach(slot => {
    slot.addEventListener('click', function () {
        const time = this.querySelector('.time').textContent;
        const timeSelect = document.querySelector('#time');

        if (timeSelect) {
            timeSelect.value = time;

            // Scroll to reservation form
            const reservationSection = document.querySelector('#reservation');
            if (reservationSection) {
                const headerOffset = 80;
                const elementPosition = reservationSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/**
 * Parallax Effect for Hero (optional enhancement)
 */
window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
}, { passive: true });

/**
 * Lazy Load Images (placeholder implementation)
 */
document.querySelectorAll('img[data-src]').forEach(img => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    observer.observe(img);
});
