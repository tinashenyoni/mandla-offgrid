// Navigation and Page Management
function navigateTo(pageName, event) {
    if (event) {
        event.preventDefault();
    }

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Update URL hash without triggering page reload
        window.location.hash = pageName;

        // Update active nav link
        updateActiveNavLink(pageName);

        // Close mobile menu if open
        closeMobileMenu();

        // Trigger animations for the new page
        setTimeout(() => {
            triggerAnimations();
        }, 100);
    }
}

// Update active navigation link
function updateActiveNavLink(pageName) {
    const navLinks = document.querySelectorAll('.network-nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.getElementById('networkNav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    nav.classList.toggle('mobile-open');
    
    if (nav.classList.contains('mobile-open')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('networkNav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    nav.classList.remove('mobile-open');
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
}

// Scroll Animations
function triggerAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fadeIn');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.animated').forEach((el) => {
        el.classList.remove('fadeIn');
        observer.observe(el);
    });
}

// Contact Form Handling
function handleContactForm(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        serviceType: document.getElementById('serviceType').value,
        message: document.getElementById('message').value
    };

    // Log form data (in production, this would send to a server)
    console.log('Form submitted:', formData);

    // Show success message
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    form.style.display = 'none';
    successMessage.style.display = 'flex';

    // Reset form and hide success message after 3 seconds
    setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successMessage.style.display = 'none';
    }, 3000);
}

// Header Scroll Effect
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Handle initial page load based on hash
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'services', 'contact'].includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo('home');
    }

    // Set up mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Set up contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Set up scroll animations
    triggerAnimations();
    window.addEventListener('scroll', triggerAnimations);

    // Set up header scroll effect
    window.addEventListener('scroll', handleScroll);

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && ['home', 'services', 'contact'].includes(hash)) {
            navigateTo(hash);
        } else {
            navigateTo('home');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const nav = document.getElementById('networkNav');
        const toggle = document.getElementById('mobileMenuToggle');
        
        if (nav && toggle && nav.classList.contains('mobile-open')) {
            if (!nav.contains(event.target) && !toggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                const pageName = href.substring(1);
                if (['home', 'services', 'contact'].includes(pageName)) {
                    e.preventDefault();
                    navigateTo(pageName, e);
                }
            }
        });
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Close mobile menu on desktop
        if (window.innerWidth > 781) {
            closeMobileMenu();
        }
    }, 250);
});