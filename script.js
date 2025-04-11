document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll("nav ul li a");
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    
    
    // Set active nav item based on current page
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        navItems.forEach(item => {
            const parent = item.parentElement;
            const itemHref = item.getAttribute("href");
            
            // Remove active class from all items
            parent.classList.remove("active");
            
            // Check if we're on the same page
            if (currentPath.includes(itemHref.split("#")[0])) {
                // If there's a hash in the URL and in the link
                if (currentHash && itemHref.includes(currentHash)) {
                    parent.classList.add("active");
                    showAndHideBubble(parent);
                } 
                // If there's no hash in URL or link
                else if (!currentHash && !itemHref.includes("#")) {
                    parent.classList.add("active");
                    showAndHideBubble(parent);
                }
                // If we're on index.html and the link is to index.html
                else if (currentPath.includes("index.html") && itemHref.includes("index.html")) {
                    parent.classList.add("active");
                    showAndHideBubble(parent);
                }
            }
        });
    }
    
    // Function to show and hide bubble
    function showAndHideBubble(element) {
        const bubble = element.querySelector('.bubble');
        if (bubble) {
            // Reset any existing animations
            bubble.style.animation = 'none';
            bubble.offsetHeight; // Trigger reflow
            
            // Show and animate the bubble
            bubble.style.display = 'block';
            bubble.style.opacity = '1';
            bubble.style.animation = 'bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Hide bubble after animation (1 second)
            setTimeout(() => {
                bubble.style.opacity = '0';
                bubble.style.transition = 'opacity 0.3s ease';
                
                // Remove completely after fade out
                setTimeout(() => {
                    bubble.style.display = 'none';
                }, 300);
            }, 1000);
        }
    }
    
    // Function to show bubble on hover
    function showBubbleOnHover(element) {
        const bubble = element.querySelector('.bubble');
        if (bubble) {
            // Reset any existing animations/transitions
            bubble.style.animation = 'none';
            bubble.style.transition = 'none';
            bubble.offsetHeight; // Trigger reflow
            
            // Show the bubble with animation
            bubble.style.display = 'block';
            bubble.style.opacity = '1';
            bubble.style.animation = 'bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    }
    
    // Function to hide bubble when not hovering
    function hideBubbleOnLeave(element) {
        const bubble = element.querySelector('.bubble');
        if (bubble) {
            bubble.style.opacity = '0';
            bubble.style.transition = 'opacity 0.3s ease';
            
            // Remove completely after fade out
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 300);
        }
    }
    
    // Add hover event listeners to all nav items
    document.querySelectorAll('nav ul li').forEach(item => {
        item.addEventListener('mouseenter', function() {
            showBubbleOnHover(this);
        });
        
        item.addEventListener('mouseleave', function() {
            hideBubbleOnLeave(this);
        });
    });
    
    setActiveNavItem();
    
    // Function for smooth scrolling
    function scrollToTarget(targetId) {
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Check if already at the same section to prevent redundant scrolling
            const currentScroll = window.scrollY;
            const targetScroll = targetSection.offsetTop - 50;

            if (Math.abs(currentScroll - targetScroll) < 5) return;

            window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });

            // Update hash after scrolling completes
            setTimeout(() => {
                if (window.location.hash !== `#${targetId}`) {
                    history.pushState(null, null, `#${targetId}`);
                    setActiveNavItem(); // Update active nav item
                }
            }, 300);
        }
    }

    // Handle nav item clicks
    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            const parent = this.parentElement;
            const targetHref = this.getAttribute("href");
            const isSamePage = targetHref.startsWith("#") || 
                               (targetHref.includes("#") && window.location.pathname.includes(targetHref.split("#")[0]));
            
            // Show bubble animation on click
            showAndHideBubble(parent);
            
            if (isSamePage) {
                e.preventDefault();
                const targetId = targetHref.includes("#") ? targetHref.split("#")[1] : targetHref.substring(1);
                scrollToTarget(targetId);
                
                // Update active nav item
                navItems.forEach(navItem => navItem.parentElement.classList.remove("active"));
                parent.classList.add("active");
            } 
            else if (targetHref.includes("#")) {
                e.preventDefault();
                const pageUrl = targetHref.split("#")[0];
                const sectionId = targetHref.split("#")[1];
                
                // Navigate to page with scrollTo parameter
                window.location.href = `${pageUrl}?scrollTo=${sectionId}`;
            }
        });
    });

    // Auto-scroll to section after page load
    function scrollToSectionFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const scrollTo = urlParams.get("scrollTo");
        const hash = window.location.hash.substring(1);

        if (scrollTo) {
            setTimeout(() => {
                scrollToTarget(scrollTo);
                history.replaceState(null, null, `${window.location.pathname}#${scrollTo}`);
                setActiveNavItem();
            }, 500);
        } else if (hash) {
            setTimeout(() => {
                scrollToTarget(hash);
                setActiveNavItem();
            }, 500);
        }
    }

    scrollToSectionFromURL();

    // Handle hash changes
    window.addEventListener("hashchange", function () {
        const targetId = location.hash.substring(1);
        if (targetId) {
            scrollToTarget(targetId);
            setActiveNavItem();
        }
    });

    // Hide navbar when footer is in view
    function handleScroll() {
        if (footer) {
            const footerPosition = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (footerPosition <= windowHeight) {
                navbar.style.opacity = "0";
                navbar.style.pointerEvents = "none";
                navbar.style.transform = "translateX(-50%) translateY(20px)";
            } else {
                navbar.style.opacity = "1";
                navbar.style.pointerEvents = "auto";
                navbar.style.transform = "translateX(-50%) translateY(0)";
            }
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    // Rest of the existing code...
    // Destination slider auto-scroll
    const destinationSlider = document.querySelector(".destination-slider");
    if (destinationSlider) {
        const cards = destinationSlider.querySelectorAll(".destination-card");
        let scrollAmount = 0;
        let scrollMax = cards.length * (cards[0].offsetWidth + 20) - destinationSlider.offsetWidth;
        
        function autoScroll() {
            if (window.innerWidth > 768) { // Only auto-scroll on larger screens
                scrollAmount += 1;
                if (scrollAmount >= scrollMax) scrollAmount = 0;
                destinationSlider.scrollLeft = scrollAmount;
                
                requestAnimationFrame(autoScroll);
            }
        }
        
        // Start auto-scroll after 2 seconds
        setTimeout(() => {
            requestAnimationFrame(autoScroll);
        }, 2000);
        
        // Pause auto-scroll on hover
        destinationSlider.addEventListener("mouseenter", () => {
            cancelAnimationFrame(autoScroll);
        });
        
        // Resume auto-scroll on mouse leave
        destinationSlider.addEventListener("mouseleave", () => {
            requestAnimationFrame(autoScroll);
        });
    }
    
    // Handle window resize
    window.addEventListener("resize", function() {
        setActiveNavItem();
        handleScroll();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let autoSlideInterval;

    // Initialize the slider
    function initSlider() {
        // Set the first slide as active
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // Start auto-sliding
        startAutoSlide();
    }

    // Show a specific slide
    function showSlide(index) {
        // Deactivate all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Activate the current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }

    // Previous slide function
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }

    // Start auto-sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    prevBtn.addEventListener('click', function() {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', function() {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Initialize the slider
    initSlider();
});
document.addEventListener('DOMContentLoaded', function() {
    const heroSlider = document.querySelector('.hero-slider');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const destinationSlider = document.querySelector('.destination-slider');
    const destinationCards = document.querySelectorAll('.destination-card');
    const prevBtn = heroSlider.querySelector('.prev-btn');
    const nextBtn = heroSlider.querySelector('.next-btn');
    const dots = heroSlider.querySelectorAll('.dot');

    let currentSlide = 0;
    const totalSlides = heroSlides.length;
    const SLIDE_DURATION = 5000; // 5 seconds per slide
    let slideTimer;

    // Function to smoothly transition destination cards
    function transitionDestinationCards(targetIndex) {
        const cardContainer = destinationSlider;
        const currentCards = Array.from(destinationCards);
        
        // Create a smooth slide-out and slide-in effect
        currentCards.forEach((card, index) => {
            card.classList.add('slide-out');
            card.style.transform = `translateX(${index < targetIndex ? '-100%' : '100%'})`;
        });

        // Use a slight delay to create a transition effect
        setTimeout(() => {
            // Rotate cards to bring target card to the front
            const rotatedCards = [
                ...currentCards.slice(targetIndex),
                ...currentCards.slice(0, targetIndex)
            ];

            // Clear existing cards
            cardContainer.innerHTML = '';

            // Reappend cards with slide-in effect
            rotatedCards.forEach((card, index) => {
                card.classList.remove('slide-out');
                card.style.transform = 'translateX(0)';
                cardContainer.appendChild(card);
            });
        }, 300); // Matches transition time
    }

    // Function to show specific slide
    function showSlide(index) {
        // Ensure index wraps around
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        // Update current slide
        currentSlide = index;

        // Update hero slides
        heroSlides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });

        // Transition destination cards
        transitionDestinationCards(currentSlide);

        // Update dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    // Progress bar for slide timing
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.classList.add('slide-progress-bar');
        heroSlider.appendChild(progressBar);
        return progressBar;
    }

    const progressBar = createProgressBar();

    // Slide timer with progress bar
    function startSlideTimer() {
        // Clear any existing timer
        if (slideTimer) {
            cancelAnimationFrame(slideTimer);
        }

        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Animate progress bar
        const startTime = Date.now();
        
        function updateProgressBar() {
            const elapsedTime = Date.now() - startTime;
            const progress = (elapsedTime / SLIDE_DURATION) * 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (elapsedTime < SLIDE_DURATION) {
                slideTimer = requestAnimationFrame(updateProgressBar);
            } else {
                // Move to next slide when timer completes
                showSlide(currentSlide + 1);
                startSlideTimer();
            }
        }
        
        slideTimer = requestAnimationFrame(updateProgressBar);
    }

    // Event listeners for manual navigation
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startSlideTimer(); // Reset timer
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startSlideTimer(); // Reset timer
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideTimer(); // Reset timer
        });
    });

    // Destination card click
    destinationCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showSlide(index);
            startSlideTimer(); // Reset timer
        });
    });

    // Touch/swipe events
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 75;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            showSlide(currentSlide + 1);
            startSlideTimer();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            showSlide(currentSlide - 1);
            startSlideTimer();
        }
    }

    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => {
        if (slideTimer) {
            cancelAnimationFrame(slideTimer);
        }
    });

    heroSlider.addEventListener('mouseleave', () => {
        startSlideTimer();
    });

    // Initial setup
    showSlide(0);
    startSlideTimer();
});
