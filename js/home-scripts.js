// Clean Homepage JavaScript with News Slider
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP
  gsap.config({
    force3D: true,
    nullTargetWarn: false
  });
  
  // Animation variables
  let logoAnimations = [];
  let floatingAnimations = [];
  let sliderInterval = null;
  
  // Set initial states
  gsap.set('.floating-image', { 
    autoAlpha: 0, 
    scale: 0.3,
    x: 0,
    y: 0
  });
  
  gsap.set('.social-media-icons .social-icon', { 
    autoAlpha: 0, 
    scale: 0.5
  });
  
  // Main loading timeline
  const loadingTimeline = gsap.timeline({
    onStart: () => {
      createOptimizedParticles();
    },
    onComplete: () => {
      initNewsModal();
      setTimeout(() => {
        initNewsSlider(); // Changed from initNewsMarquee to initNewsSlider
      }, 500);
    }
  });
  
  loadingTimeline
    .set('.background-pattern', { autoAlpha: 1 })
    .to({}, { duration: 0.8 }) // Pause for particles
    .from('.logo-svg3', { 
      duration: 0.8, 
      scale: 0, 
      autoAlpha: 0, 
      rotation: -90, 
      ease: 'back.out(1.4)' 
    })
    .from('.nav-links li', { 
      duration: 0.6, 
      autoAlpha: 0, 
      y: -15, 
      stagger: 0.1, 
      ease: 'power2.out' 
    }, '-=0.4')
    .to('.social-media-icons .social-icon', { 
      duration: 0.6, 
      autoAlpha: 1, 
      scale: 1, 
      stagger: 0.15, 
      ease: 'back.out(1.4)' 
    }, '+=0.2')
    .from('.logo-svg', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.8, 
      ease: 'back.out(1.4)',
      onComplete: () => {
        startLogoFloating();
      }
    }, '-=0.3')
    .from('.logo-svg2', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.8, 
      ease: 'back.out(1.4)'
    }, '-=0.8')
    .from('.hero-actions', {
      duration: 0.8,
      y: 30,
      autoAlpha: 0,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.news-section', { 
      duration: 0.8, 
      autoAlpha: 0, 
      y: 30, 
      ease: 'power2.out'
    }, '-=0.3')
    .call(() => {
      loadFloatingImagesSequentially();
    }, null, '+=0.5');
  
  // Start logo floating animations
  function startLogoFloating() {
    const logoFloat1 = gsap.to('.logo-svg', {
      y: -8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    logoAnimations.push(logoFloat1);
    
    const logoFloat2 = gsap.to('.logo-svg2', {
      y: -6,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    logoAnimations.push(logoFloat2);
  }
  
  // Load floating images one by one
  function loadFloatingImagesSequentially() {
    const floatingImages = document.querySelectorAll('.floating-image');
    
    floatingImages.forEach((img, index) => {
      gsap.to(img, {
        autoAlpha: 0.6,
        scale: 1,
        duration: 1.2,
        delay: index * 0.4,
        ease: 'power2.out',
        onComplete: () => {
          startIndividualFloating(img, index);
        }
      });
    });
  }
  
  // Individual floating animation
  function startIndividualFloating(img, index) {
    const floatAnimation = gsap.to(img, {
      x: `random(-15, 15)`,
      y: `random(-15, 15)`,
      rotation: `random(-8, 8)`,
      duration: 4 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2
    });
    
    floatingAnimations.push(floatAnimation);
  }
  
  // Optimized particle system
  function createOptimizedParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    const colors = ['#1abc9c', '#f1c40f', '#ecf0f1', '#3498db'];
    const particleCount = 40; // Reduced for better performance
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = Math.random() * 0.55 + 0.35;
      
      const size = Math.random() * 9 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      particleContainer.appendChild(particle);
      
      const particleAnim = gsap.to(particle, {
        x: `${Math.random() * 300 - 150}px`,
        y: `${Math.random() * 300 - 150}px`,
        duration: Math.random() * 25 + 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      logoAnimations.push(particleAnim);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      .particle-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
        will-change: transform;
      }
      .particle {
        position: absolute;
        border-radius: 50%;
        filter: blur(2px);
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }
  
  // News slider initialization (replaces marquee)
  function initNewsSlider() {
    const newsContainer = document.querySelector('.news-container');
    
    if (!newsContainer) return;
    
    const newsItems = document.querySelectorAll('.news-item');
    if (newsItems.length === 0) return;
    
    console.log('🎠 Initializing news slider');
    
    // Remove any existing cloned items from marquee
    const existingClones = document.querySelectorAll('.news-item-clone');
    existingClones.forEach(clone => clone.remove());
    
    // Slider variables
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    const slidesToShow = calculateSlidesToShow();
    const maxSlide = Math.max(0, newsItems.length - slidesToShow);
    
    // Calculate how many slides to show based on container width
    function calculateSlidesToShow() {
      const containerWidth = newsContainer.parentElement.offsetWidth;
      const itemWidth = 180 + 24; // item width + gap
      return Math.floor(containerWidth / itemWidth);
    }
    
    // Set up slider structure
    function setupSlider() {
      // Reset container styles for slider
      newsContainer.style.cssText = `
        display: flex;
        gap: 1.5rem;
        transition: transform 0.5s ease-in-out;
        transform: translateX(0);
      `;
      
      console.log(`📊 Slider setup: ${slidesToShow} slides visible, max slide: ${maxSlide}`);
    }
    
    // Update slider position
    function updateSliderPosition() {
      const translateX = -(currentSlide * (180 + 24)); // item width + gap
      newsContainer.style.transform = `translateX(${translateX}px)`;
      
      console.log(`🔄 Moved to slide ${currentSlide}`);
    }
    
    // Go to next slide
    function nextSlide() {
      if (currentSlide < maxSlide) {
        currentSlide++;
      } else {
        currentSlide = 0; // Loop back to start
      }
      updateSliderPosition();
    }
    
    // Go to previous slide
    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
      } else {
        currentSlide = maxSlide; // Loop to end
      }
      updateSliderPosition();
    }
    
    // Auto-play functionality
    function startAutoPlay() {
      if (maxSlide > 0) { // Only auto-play if there are slides to move
        autoPlayInterval = setInterval(nextSlide, 4000); // Change every 4 seconds
      }
    }
    
    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }
    
    // Add navigation controls
    function addSliderControls() {
      const newsSection = document.querySelector('.news-marquee-container');
      if (!newsSection) return;
      
      // Only add controls if we have slides to navigate
      if (maxSlide === 0) return;
      
      const controlsHtml = `
        <div class="slider-controls">
          <button class="slider-btn slider-prev" aria-label="Previous news">‹</button>
          <div class="slider-dots"></div>
          <button class="slider-btn slider-next" aria-label="Next news">›</button>
        </div>
      `;
      
      newsSection.insertAdjacentHTML('beforeend', controlsHtml);
      
      // Add dots
      const dotsContainer = document.querySelector('.slider-dots');
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
      
      // Add button event listeners
      document.querySelector('.slider-prev').addEventListener('click', () => {
        prevSlide();
        updateDots();
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000); // Resume auto-play after 2 seconds
      });
      
      document.querySelector('.slider-next').addEventListener('click', () => {
        nextSlide();
        updateDots();
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000);
      });
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
      currentSlide = slideIndex;
      updateSliderPosition();
      updateDots();
      stopAutoPlay();
      setTimeout(startAutoPlay, 2000);
    }
    
    // Update dot indicators
    function updateDots() {
      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    // Pause on hover
    function addHoverControls() {
      newsContainer.addEventListener('mouseenter', () => {
        if (isAutoPlaying) stopAutoPlay();
      });
      
      newsContainer.addEventListener('mouseleave', () => {
        if (isAutoPlaying && maxSlide > 0) startAutoPlay();
      });
    }
    
    // Handle window resize
    function handleResize() {
      const newSlidesToShow = calculateSlidesToShow();
      if (newSlidesToShow !== slidesToShow) {
        // Reinitialize if layout changed significantly
        stopAutoPlay();
        initNewsSlider();
      }
    }
    
    // Initialize slider
    setupSlider();
    addSliderControls();
    addHoverControls();
    startAutoPlay();
    
    // Store interval reference for cleanup
    sliderInterval = autoPlayInterval;
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    console.log('✅ News slider initialized successfully');
  }
  
  // News modal functionality
  function initNewsModal() {
    const newsItems = document.querySelectorAll('.news-item');
    const modalBackdrop = document.querySelector('.news-modal-backdrop');
    const modal = document.querySelector('.news-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!newsItems.length || !modalBackdrop || !modal) return;
    
    const newsData = {
      1: {
        title: "Join our Discord Server!",
        date: "May 18, 2025",
        image: "img/what-is-discord-1920x1080-c3d90ca45f57.jpg",
        content: `<p>We're thrilled to announce our new Discord Community: <strong>KOWG Community</strong>. Join us to see our development process and be part of our creative journey!</p>
                  <p>Connect with other gamers, get early access to game updates, and chat directly with our development team.</p>`
      },
      2: {
        title: "Whimsicalog #5: Project DCP",
        date: "May 12, 2025",
        image: "img/projectdcpfront.png",
        content: `<p>We're excited to share the latest updates on <strong>Project DCP</strong>! This adventure RPG is taking shape with stunning visuals and engaging gameplay mechanics.</p>
                  <p>Follow our development blog for behind-the-scenes insights and concept art reveals.</p>`
      },
      3: {
        title: "Project Brothers Update!",
        date: "May 5, 2025",
        image: "img/brothersconceptart2.png",
        content: `<p><strong>Project Brothers</strong> enters its writing phase! We're crafting a mature narrative that explores complex themes through engaging detective gameplay.</p>
                  <p>Character development and plot structure are our current focus as we build this unique experience.</p>`
      },
      4: {
        title: "New ideas coming to life!",
        date: "April 30, 2025",
        image: "img/brothersconcptart.png",
        content: `<p>Our creative process is in full swing as we explore new concepts and gameplay mechanics. Every idea gets careful consideration as we shape our future projects.</p>
                  <p>Innovation and player experience drive every decision we make in our development process.</p>`
      },
      5: {
        title: "Whimsicalog #4: Retenta",
        date: "April 25, 2025",
        image: "img/retentagame.png",
        content: `<p><strong>Retenta</strong> development continues with exciting progress on character classes and game mechanics. Each class offers unique gameplay experiences and strategic possibilities.</p>
                  <p>We're balancing accessibility with depth to create engaging card-based gameplay for all skill levels.</p>`
      },
      6: {
        title: "Project DCP Gameplay",
        date: "April 18, 2025",
        image: "img/projectdcpgameplay.png",
        content: `<p>First glimpse of <strong>Project DCP</strong> gameplay! Our adventure RPG combines exploration, character progression, and atmospheric storytelling.</p>
                  <p>The game world reacts to player choices, creating a dynamic and immersive experience.</p>`
      }
    };
    
    function addNewsClickListeners() {
      const allNewsItems = document.querySelectorAll('.news-item');
      
      allNewsItems.forEach(item => {
        item.removeEventListener('click', handleNewsClick);
        item.addEventListener('click', handleNewsClick);
      });
    }
    
    function handleNewsClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const newsId = this.getAttribute('data-news-id');
      const newsInfo = newsData[newsId];
      
      if (newsInfo) {
        document.getElementById('modal-title').textContent = newsInfo.title;
        document.getElementById('modal-date').textContent = newsInfo.date;
        document.getElementById('modal-image').src = newsInfo.image;
        document.getElementById('modal-content').innerHTML = newsInfo.content;
        
        modalBackdrop.classList.add('active');
        
        gsap.fromTo(modal, 
          { scale: 0.8, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.4)" }
        );
      }
    }
    
    function closeModal() {
      gsap.to(modal, {
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => {
          modalBackdrop.classList.remove('active');
        }
      });
    }
    
    addNewsClickListeners();
    
    setTimeout(() => {
      addNewsClickListeners();
    }, 1500);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  // Page transition functionality
  function initPageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const pageTransitionLinks = document.querySelectorAll('.page-transition');
    
    if (!transitionOverlay) return;
    
    pageTransitionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetPage = link.getAttribute('data-page');
        const targetUrl = link.getAttribute('href');
        
        // Show transition overlay
        transitionOverlay.classList.add('active');
        
        // Animate transition
        gsap.timeline()
          .to('.loading-logo', {
            rotation: 360,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to('.loading-text', {
            opacity: 0.5,
            scale: 0.95,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
          }, '-=0.5')
          .call(() => {
            // Navigate to new page
            window.location.href = targetUrl;
          }, null, '+=0.3');
      });
    });
  }
  
  // Initialize page transitions
  initPageTransitions();
  
  // Pause animations when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      logoAnimations.forEach(anim => {
        if (anim && anim.pause) anim.pause();
      });
      floatingAnimations.forEach(anim => {
        if (anim && anim.pause) anim.pause();
      });
      if (sliderInterval) clearInterval(sliderInterval);
    } else {
      logoAnimations.forEach(anim => {
        if (anim && anim.resume) anim.resume();
      });
      floatingAnimations.forEach(anim => {
        if (anim && anim.resume) anim.resume();
      });
      // Slider will auto-restart on mouse interaction
    }
  });
});

// Whimsical Burger Menu System for KOWG
// This file can be included on all pages for consistent mobile navigation

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍔 Initializing whimsical burger menu system');
    
    // Initialize burger menu
    initBurgerMenu();
    
    function initBurgerMenu() {
      // Check if burger menu already exists (for pages that include this multiple times)
      if (document.querySelector('.burger-menu')) {
        console.log('Burger menu already exists, skipping initialization');
        return;
      }
      
      createBurgerMenuHTML();
      setupBurgerMenuEvents();
      setupMobileNavigation();
    }
    
    function createBurgerMenuHTML() {
      const header = document.querySelector('.site-header');
      if (!header) {
        console.warn('Site header not found, cannot create burger menu');
        return;
      }
      
      // Create burger menu button
      const burgerMenu = document.createElement('button');
      burgerMenu.className = 'burger-menu';
      burgerMenu.setAttribute('aria-label', 'Toggle mobile menu');
      
      // Create burger lines with whimsical animation
      for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'burger-line';
        burgerMenu.appendChild(line);
      }
      
      // Create mobile navigation overlay
      const mobileNavOverlay = document.createElement('div');
      mobileNavOverlay.className = 'mobile-nav-overlay';
      
      // Get current navigation links
      const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      
      mobileNavOverlay.innerHTML = `
        <div class="mobile-nav-decoration"></div>
        <div class="mobile-nav-decoration"></div>
        <div class="mobile-nav-decoration"></div>
        
        <ul class="mobile-nav-links">
          <li><a href="index.html" class="mobile-nav-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Home</a></li>
          <li><a href="games.html" class="mobile-nav-link ${currentPage === 'games.html' ? 'active' : ''}">Our Games</a></li>
          <li><a href="about.html" class="mobile-nav-link ${currentPage === 'about.html' ? 'active' : ''}">About Us</a></li>
          <li><a href="contact.html" class="mobile-nav-link ${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
        </ul>
        
        <div class="mobile-social-icons">
          <a href="https://instagram.com/your-handle" target="_blank" class="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
  
          <a href="https://discord.gg/your-server" target="_blank" class="social-icon" aria-label="Discord">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
  
          <a href="https://tiktok.com/@your-handle" target="_blank" class="social-icon" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
  
          <a href="https://linkedin.com/company/your-company" target="_blank" class="social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      `;
      
      // Add burger menu to header
      header.appendChild(burgerMenu);
      
      // Add mobile nav overlay to body
      document.body.appendChild(mobileNavOverlay);
      
      console.log('✅ Burger menu HTML created');
    }
    
    function setupBurgerMenuEvents() {
      const burgerMenu = document.querySelector('.burger-menu');
      const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
      
      if (!burgerMenu || !mobileNavOverlay) {
        console.warn('Burger menu elements not found');
        return;
      }
      
      let isMenuOpen = false;
      
      // Burger menu click handler
      burgerMenu.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        toggleMobileMenu(isMenuOpen);
      });
      
      // Close menu when clicking outside
      mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay) {
          isMenuOpen = false;
          toggleMobileMenu(false);
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
          isMenuOpen = false;
          toggleMobileMenu(false);
        }
      });
      
      // Close menu when clicking nav links
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          isMenuOpen = false;
          toggleMobileMenu(false);
        });
      });
      
      function toggleMobileMenu(open) {
        burgerMenu.classList.toggle('active', open);
        mobileNavOverlay.classList.toggle('active', open);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = open ? 'hidden' : '';
        
        // Add whimsical entrance animation using GSAP if available
        if (open && window.gsap) {
          animateMenuEntrance();
        }
        
        console.log(`🍔 Menu ${open ? 'opened' : 'closed'}`);
      }
      
      function animateMenuEntrance() {
        const decorations = document.querySelectorAll('.mobile-nav-decoration');
        
        // Animate decorative elements
        gsap.fromTo(decorations, 
          { scale: 0, rotation: 0 },
          { 
            scale: 1, 
            rotation: 360, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "back.out(1.7)" 
          }
        );
        
        // Add bounce to burger lines
        const burgerLines = document.querySelectorAll('.burger-line');
        gsap.to(burgerLines, {
          scaleX: 1.1,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          stagger: 0.05
        });
      }
      
      console.log('✅ Burger menu events setup complete');
    }
    
    function setupMobileNavigation() {
      // Add page transition effects for mobile navigation
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
      
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Only add transition effect if not on same page
          const targetPage = link.getAttribute('href');
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          
          if (targetPage !== currentPage && targetPage !== '') {
            e.preventDefault();
            
            // Add whimsical exit animation
            if (window.gsap) {
              const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
              
              gsap.to(mobileNavOverlay, {
                scale: 0.8,
                rotation: 10,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                  window.location.href = targetPage;
                }
              });
            } else {
              // Fallback without GSAP
              setTimeout(() => {
                window.location.href = targetPage;
              }, 200);
            }
          }
        });
      });
      
      console.log('✅ Mobile navigation setup complete');
    }
    
    // Add whimsical hover effects to burger menu
    function addWhimsicalEffects() {
      const burgerMenu = document.querySelector('.burger-menu');
      if (!burgerMenu) return;
      
      burgerMenu.addEventListener('mouseenter', () => {
        if (window.gsap) {
          const lines = burgerMenu.querySelectorAll('.burger-line');
          gsap.to(lines, {
            scaleX: 1.1,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out"
          });
        }
      });
      
      burgerMenu.addEventListener('mouseleave', () => {
        if (window.gsap) {
          const lines = burgerMenu.querySelectorAll('.burger-line');
          gsap.to(lines, {
            scaleX: 1,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out"
          });
        }
      });
    }
    
    // Initialize whimsical effects after DOM is ready
    setTimeout(addWhimsicalEffects, 100);
    
    // Handle window resize to ensure proper mobile/desktop switching
    window.addEventListener('resize', () => {
      const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
      const burgerMenu = document.querySelector('.burger-menu');
      
      if (window.innerWidth > 968) {
        // Switch to desktop mode
        if (mobileNavOverlay) {
          mobileNavOverlay.classList.remove('active');
        }
        if (burgerMenu) {
          burgerMenu.classList.remove('active');
        }
        document.body.style.overflow = '';
      }
    });
    
    console.log('🎯 Whimsical burger menu system fully initialized');
  });