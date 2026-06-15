document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const navbar = document.getElementById('navbar');

    let isMenuOpen = false;
    let lastScrollTop = 0;
    let isScrolling = false;

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');

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

    function closeMobileMenu() {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');

        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';

        mobileMenuLinks.forEach(link => {
            link.style.opacity = '';
            link.style.transform = '';
            link.style.transition = '';
        });
    }

    function handleNavbarScroll() {
        if (window.innerWidth >= 1024) return;
        if (isMenuOpen) return;

        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop <= 100) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
        } else if (currentScrollTop < lastScrollTop && !isScrolling) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
        } else if (currentScrollTop > lastScrollTop && currentScrollTop > 200 && !isScrolling) {
            navbar.style.transform = 'translateY(-150px)';
            navbar.style.opacity = '0';
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

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

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        
        mobileMenuButton.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 150);
        });
    });

    document.addEventListener('click', function(event) {
        if (isMenuOpen && !event.target.closest('nav')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('scroll', requestTick);

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            navbar.style.transform = '';
            navbar.style.opacity = '';
        } else {
            navbar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });

    if (window.innerWidth < 1024) {
        navbar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', () => {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });

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

    // Search Bar
    
    const certificationSearchInput = document.getElementById('certificationSearch');
    const certificationClearButton = document.getElementById('clearCertificationSearch');
    const certificationSearchResults = document.getElementById('certificationSearchResults');
    const certificationResultCount = document.getElementById('certificationResultCount');
    
    const projectSearchInput = document.getElementById('projectSearch');
    const projectClearButton = document.getElementById('clearProjectSearch');
    const projectSearchResults = document.getElementById('projectSearchResults');
    const projectResultCount = document.getElementById('projectResultCount');
    
    const certificationCards = document.querySelectorAll('#certifications .grid > div');
    const projectCards = document.querySelectorAll('#projects .grid > div');
    
    function createFilterFunction(cards, resultsDiv, countSpan, clearBtn) {
        return function(searchTerm) {
            let visibleCount = 0;
            
            cards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                
                if (searchTerm === '' || cardText.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
            
            if (searchTerm === '') {
                resultsDiv.classList.add('opacity-0', 'invisible');
                clearBtn.classList.add('opacity-0', 'invisible');
                resultsDiv.classList.remove('opacity-100');
                clearBtn.classList.remove('opacity-100');
            } else {
                resultsDiv.classList.remove('opacity-0', 'invisible');
                clearBtn.classList.remove('opacity-0', 'invisible');
                resultsDiv.classList.add('opacity-100');
                clearBtn.classList.add('opacity-100');
                countSpan.textContent = visibleCount;
            }
        };
    }
    
    function setupSearch(input, clearBtn, filterFn) {
        if (!input) return;
        
        input.addEventListener('input', function() {
            filterFn(this.value.toLowerCase().trim());
        });
        
        clearBtn.addEventListener('click', function() {
            input.value = '';
            filterFn('');
            input.focus();
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                input.value = '';
                filterFn('');
            }
        });
    }
    
    const filterCertifications = createFilterFunction(
        certificationCards, 
        certificationSearchResults, 
        certificationResultCount, 
        certificationClearButton
    );
    setupSearch(certificationSearchInput, certificationClearButton, filterCertifications);
    
    const filterProjects = createFilterFunction(
        projectCards, 
        projectSearchResults, 
        projectResultCount, 
        projectClearButton
    );
    setupSearch(projectSearchInput, projectClearButton, filterProjects);
});