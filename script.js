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
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. Create a new email service (Gmail, Outlook, etc.)
// 3. Create an email template with variables: to_email, from_name, from_email, phone, organization, service, message, subject
// 4. Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID with actual values
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

    // Disable submit button
    const submitButton = document.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Initialize EmailJS (replace with your public key)
    emailjs.init('YOUR_PUBLIC_KEY');

    // Map service type to display name
    const serviceOptions = {
        'power': 'Power-Independent IT Services',
        'internet': 'Off-Grid Internet & Connectivity',
        'security': 'Security & Surveillance',
        'it-support': 'IT Support',
        'smart-solutions': 'Smart Off-Grid Solutions',
        'training': 'Training & Capacity Building',
        'maintenance': 'Maintenance Contracts',
        'hardware': 'Hardware Sales & Rentals',
        'other': 'Other / Multiple Services'
    };
    const serviceDisplay = serviceOptions[formData.serviceType] || formData.serviceType;

    // Prepare email parameters
    const emailParams = {
        to_email: 'info@offgridit.co.za',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        service: serviceDisplay,
        message: formData.message,
        subject: 'New Site Assessment Request – OffGrid Solutions'
    };

    // Send email
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            
            // Show success message
            const form = document.getElementById('contactForm');
            const successMessage = document.getElementById('successMessage');
            
            form.style.display = 'none';
            successMessage.style.display = 'flex';

            // Reset form and hide success message after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Request
                `;
            }, 5000);
        }, function(error) {
            console.error('Email send failed:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3 class="heading-3">Error</h3>
                <p class="body-medium">
                    There was an error sending your request. Please try again or contact us directly.
                </p>
            `;
            
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(errorMessage, form);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                if (errorMessage.parentNode) {
                    errorMessage.parentNode.removeChild(errorMessage);
                }
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Request
                `;
            }, 5000);
        });
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