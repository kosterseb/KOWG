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