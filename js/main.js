// Mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const navbar = document.getElementById('navbar');

    let isMenuOpen = false;
    let lastScrollTop = 0;
    let isScrolling = false;

    // Toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');

            // Animate menu items
            mobileMenuLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(-10px)';
                    link.style.transition = 'all 0.3s ease';

                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            });
        } else {
            closeMobileMenu();
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');

        // Show navbar again
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';

        // Reset animations
        mobileMenuLinks.forEach(link => {
            link.style.opacity = '';
            link.style.transform = '';
            link.style.transition = '';
        });
    }

    // Show/Hide navbar on mobile scroll
    function handleNavbarScroll() {
        if (window.innerWidth >= 1024) return;
        if (isMenuOpen) return;

        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollTop <= 100) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
        }

        else if (currentScrollTop < lastScrollTop && !isScrolling) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
        }

        else if (currentScrollTop > lastScrollTop && currentScrollTop > 200 && !isScrolling) {
            navbar.style.transform = 'translateY(-150px)';
            navbar.style.opacity = '0';
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    // Throttle scroll events
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    function updateNavbar() {
        handleNavbarScroll();
        ticking = false;
    }

    // Event listeners
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 150);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && !event.target.closest('nav')) {
            closeMobileMenu();
        }
    });

    // Scroll event listener
    window.addEventListener('scroll', requestTick);

    // Close menu on window resize to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            // Reset navbar position on desktop
            navbar.style.transform = '';
            navbar.style.opacity = '';
        } else {
            // Initialize mobile navbar styles
            navbar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
    });

    // Handle keyboard navigation
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    // Escape key to close menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });

    // Initialize navbar styles for mobile
    if (window.innerWidth < 1024) {
        navbar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
    
    // Prevent navbar hide/show during scroll animations from anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', () => {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });
});

// EmailJS Configuration
emailjs.init("khmh3JSNlZoKyBODd");

// Contact form handler
const contactForm = document.querySelector('#contact-form');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');
const submitButton = document.querySelector('button[type="submit"]');
const loadingText = document.querySelector('.loading-text');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable button and show loading
        submitButton.disabled = true;
        loadingText.classList.remove('hidden');
        hideMessages();
        
        // Collect form data
        const formData = new FormData(this);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Send email via EmailJS
        emailjs.send('service_d7vxi17', 'template_3vhk55w', templateParams)
            .then(function(response) {
                console.log('E-Mail erfolgreich gesendet!', response.status, response.text);
                showSuccessMessage();
                contactForm.reset();
            })
            .catch(function(error) {
                console.log('Fehler beim Senden:', error);
                showErrorMessage();
            })
            .finally(function() {
                // Re-enable button and hide loading
                submitButton.disabled = false;
                loadingText.classList.add('hidden');
            });
    });
}

// Helper functions
function showSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
}

function showErrorMessage() {
    if (errorMessage) {
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
}

function hideMessages() {
    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
}

// Scroll to Top Button
const scrollToTopButton = document.getElementById('scroll-to-top');

if (scrollToTopButton) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.remove('opacity-0', 'invisible');
            scrollToTopButton.classList.add('opacity-100', 'visible');
        } else {
            scrollToTopButton.classList.remove('opacity-100', 'visible');
            scrollToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}