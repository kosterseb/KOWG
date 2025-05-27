// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP with optimized settings
  gsap.config({
    force3D: true,
    nullTargetWarn: false
  });
  
  // Define elements
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.pagination-dots .dot');
  const leftArrow = document.querySelector('.slider-arrow-left');
  const rightArrow = document.querySelector('.slider-arrow-right');
  const navLinks = document.querySelectorAll('.nav-link');
  const gameCards = document.querySelectorAll('.game-card');
  const teamCards = document.querySelectorAll('.team-card');
  const contactCard = document.querySelector('.contact-card');
  const ctaButton = document.querySelector('.cta-button');
  
  // Animation state management
  let isAnimating = false;
  let currentSlide = 0;
  const slideCount = slides.length;
  
  // Store timeline references for cleanup
  let activeTimelines = [];
  let logoAnimations = [];
  let floatingAnimations = [];
  let marqueeAnimation = null; // Fixed: Declare marqueeAnimation here
  
  // EVEN SIMPLER - just refresh floating images visibility
  function resetHomepage() {
    console.log('🏠 Ultra simple homepage reset');
    
    const floatingImages = document.querySelectorAll('.floating-image');
    
    // Kill floating animations
    floatingAnimations.forEach(anim => anim && anim.kill());
    floatingAnimations = [];
    
    // Just set them visible and restart floating
    floatingImages.forEach((img, index) => {
      gsap.set(img, {
        autoAlpha: 0.6,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0
      });
      
      // Start floating immediately
      setTimeout(() => {
        startIndividualFloating(img, index);
      }, index * 100);
    });
  }
  
  // Set floating images to completely invisible from the start
  gsap.set('.floating-image', { 
    autoAlpha: 0, 
    scale: 0.3,
    x: 0,
    y: 0
  });
  
  // Set social media icons initial state - be very explicit
  gsap.set('.social-media-icons .social-icon', { 
    opacity: 0,
    visibility: 'hidden',
    scale: 0.5
  });
  
  // Debug: Log if social icons exist
  const socialIcons = document.querySelectorAll('.social-media-icons .social-icon');
  console.log('Social icons found:', socialIcons.length);
  
  // Load particles FIRST, then everything else
  const loadingTimeline = gsap.timeline({
    onStart: () => {
      // Create particles immediately when timeline starts
      createOptimizedParticles();
    },
    onComplete: () => {
      // Initialize modal system first (lighter)
      setTimeout(() => {
        initNewsModal();
        
        // Then load the heavy news marquee last
        setTimeout(() => {
          initNewsMarquee();
        }, 400);
      }, 200);
    }
  });
  
  loadingTimeline
    .set('.background-pattern', { autoAlpha: 1 })
    // Wait for particles to settle before starting main animations
    .to({}, { duration: 0.8 }) // Pause to let particles initialize
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
    // Load social media icons AFTER nav links are fully loaded
    .to('.social-media-icons .social-icon', { 
      duration: 0.8, 
      opacity: 1,
      visibility: 'visible',
      scale: 1, 
      stagger: 0.15, 
      ease: 'back.out(1.4)',
      onStart: () => console.log('Social icons animation started'),
      onComplete: () => console.log('Social icons animation completed')
    }, '+=0.3') // Wait 0.3 seconds after nav links finish
    .from('.logo-svg', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.8, 
      ease: 'back.out(1.4)',
      onComplete: () => {
        // Start logo floating after it appears
        const logoFloat1 = gsap.to('.logo-svg', {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        logoAnimations.push(logoFloat1);
      }
    }, '-=0.3')
    .from('.logo-svg2', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.8, 
      ease: 'back.out(1.4)',
      onComplete: () => {
        // Start logo floating after it appears
        const logoFloat2 = gsap.to('.logo-svg2', {
          y: -6,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        logoAnimations.push(logoFloat2);
      }
    }, '-=0.8')
    // Load news container without marquee animation yet
    .from('.news-marquee-container', { 
      duration: 0.8, 
      autoAlpha: 0, 
      y: 30, 
      ease: 'power2.out'
    }, '-=0.4')
    .from('.cta-button', { 
      duration: 0.6, 
      scale: 0, 
      autoAlpha: 0, 
      ease: 'back.out(1.3)' 
    }, '-=0.2')
    // Only AFTER everything else is loaded, start floating images
    .call(() => {
      loadFloatingImagesSequentially();
    }, null, '+=0.8'); // Longer wait to ensure particles are settled
  
  // Load floating images one at a time - much more controlled
  function loadFloatingImagesSequentially() {
    const floatingImages = document.querySelectorAll('.floating-image');
    
    floatingImages.forEach((img, index) => {
      // They're already set to invisible above, so just animate them in
      gsap.to(img, {
        autoAlpha: 0.6,
        scale: 1,
        duration: 1.2,
        delay: index * 0.4, // Longer delay between each image
        ease: 'power2.out', // Smoother easing
        onComplete: () => {
          // Only start floating animation after the image has fully appeared
          startIndividualFloating(img, index);
        }
      });
    });
  }
  
  // Start gentle floating for individual images
  function startIndividualFloating(img, index) {
    const floatAnimation = gsap.to(img, {
      x: `random(-15, 15)`,
      y: `random(-15, 15)`,
      rotation: `random(-8, 8)`,
      duration: 4 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2 // Random delay to make it feel more organic
    });
    
    floatingAnimations.push(floatAnimation); // Store in floating animations array
  }
  
  // Remove the startContinuousAnimations function since we're handling it differently
  // Particles are created at timeline start, other systems at timeline complete
  
  // Clean up animations when changing slides
  function cleanupAnimations() {
    activeTimelines.forEach(timeline => {
      if (timeline && timeline.kill) {
        timeline.kill();
      }
    });
    activeTimelines = [];
  }
  
  // Optimized slide transition function
  function goToSlide(slideIndex) {
    if (isAnimating || slideIndex === currentSlide) return;
    
    if (slideIndex < 0) {
      slideIndex = slideCount - 1;
    } else if (slideIndex >= slideCount) {
      slideIndex = 0;
    }
    
    isAnimating = true;
    cleanupAnimations();
    
    // Calculate slide position
    const slidePosition = -slideIndex * 25; // 25% per slide (4 slides = 100%)
    
    // Simpler transition
    const flipTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        // Manage floating animations based on current slide
        manageFloatingAnimations(slideIndex);
      }
    });
    
    activeTimelines.push(flipTimeline);
    
    // Slide transition
    flipTimeline
      .to(sliderWrapper, {
        x: `${slidePosition}%`,
        duration: 0.6,
        ease: 'power2.inOut',
        onStart: () => {
          // Update active states immediately
          document.querySelector('.slide.active')?.classList.remove('active');
          slides[slideIndex].classList.add('active');
          
          document.querySelector('.dot.active')?.classList.remove('active');
          dots[slideIndex].classList.add('active');
          
          document.querySelector('.nav-link.active')?.classList.remove('active');
          navLinks[slideIndex].classList.add('active');
        },
        onComplete: () => {
          animateSlideContent(slideIndex);
        }
      });
    
    currentSlide = slideIndex;
  }
  
  // Simpler slide content animations
  function animateSlideContent(slideIndex) {
    const targetSlide = slides[slideIndex];
    
    switch (slideIndex) {
      case 0: // Home slide
        const homeTimeline = gsap.from(targetSlide.querySelectorAll('.home-hero > *:not(.floating-images-container)'), {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });
        activeTimelines.push(homeTimeline);
        break;
        
      case 1: // Games slide
        const gamesTimeline = gsap.timeline();
        gamesTimeline
          .from(targetSlide.querySelector('h1'), {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
          .from(targetSlide.querySelectorAll('.game-card'), {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.4)'
          }, '-=0.3');
        activeTimelines.push(gamesTimeline);
        break;
        
      case 2: // About slide
        const aboutTimeline = gsap.timeline();
        aboutTimeline
          .from(targetSlide.querySelector('h1'), {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
          .from(targetSlide.querySelectorAll('.team-card'), {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.4)'
          }, '-=0.3')
          .from(targetSlide.querySelector('.studio-philosophy'), {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.2');
        activeTimelines.push(aboutTimeline);
        break;
        
      case 3: // Contact slide
        const contactTimeline = gsap.timeline();
        contactTimeline
          .from(targetSlide.querySelector('h1'), {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
          .from(targetSlide.querySelector('.contact-form-container'), {
            x: -20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.3')
          .from(targetSlide.querySelector('.contact-info'), {
            x: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.5');
        activeTimelines.push(contactTimeline);
        break;
    }
  }
  
  // Much simpler slide management - HOME = SIMPLE RESET
  function manageFloatingAnimations(slideIndex) {
    const floatingImages = document.querySelectorAll('.floating-image');
    
    if (slideIndex === 0) {
      // HOME SLIDE - Simple reset of floating images
      console.log('🏠 Returning to homepage - simple reset');
      resetHomepage();
      
    } else {
      // OTHER SLIDES - Move to background positions
      console.log('📱 Moving to slide', slideIndex);
      
      // Stop floating animations
      floatingAnimations.forEach(anim => anim && anim.kill());
      floatingAnimations = [];
      
      // Move floating images to background
      floatingImages.forEach((img, index) => {
        let randomX, randomY, targetOpacity;
        
        switch(slideIndex) {
          case 1: // Games slide
            randomX = (Math.random() - 0.5) * 400;
            randomY = (Math.random() - 0.5) * 300;
            targetOpacity = 0.1;
            break;
          case 2: // About slide
            randomX = (Math.random() - 0.5) * 300;
            randomY = (Math.random() - 0.5) * 200;
            targetOpacity = 0.15;
            break;
          case 3: // Contact slide
            randomX = (Math.random() - 0.5) * 250;
            randomY = (Math.random() - 0.5) * 150;
            targetOpacity = 0.08;
            break;
          default:
            randomX = (Math.random() - 0.5) * 200;
            randomY = (Math.random() - 0.5) * 200;
            targetOpacity = 0.1;
        }
        
        gsap.to(img, {
          x: randomX,
          y: randomY,
          autoAlpha: targetOpacity,
          scale: 0.7,
          rotation: (Math.random() - 0.5) * 15,
          duration: 1.5,
          ease: 'power2.out',
          delay: index * 0.08
        });
      });
    }
  }
  
  // Bring back more particles for better background fill
  function createOptimizedParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    const colors = ['#1abc9c', '#f1c40f', '#ecf0f1', '#3498db'];
    const particleCount = 60; // Increased back up for better fill
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = Math.random() * 0.25 + 0.05; // Slightly more visible
      
      // Varied particle sizes
      const size = Math.random() * 8 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      particleContainer.appendChild(particle);
      
      // Gentle but noticeable animation
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
    
    // Optimized styles for particles
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
  
  // Event listeners for navigation
  leftArrow.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
  });
  
  rightArrow.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
  });
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  // Header navigation
  navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(index);
    });
  });
  
  // CTA button navigation to Games slide
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      goToSlide(1);
    });
  }
  
  // Optimized card hover animations
  function initCardAnimations() {
    // Game cards
    gameCards.forEach(card => {
      let isHovered = false;
      
      card.addEventListener('mouseenter', () => {
        if (isHovered) return;
        isHovered = true;
        
        gsap.to(card.querySelector('.card-front'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.card-back'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        isHovered = false;
        
        gsap.to(card.querySelector('.card-front'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.card-back'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      // Set initial state
      gsap.set(card.querySelector('.card-back'), { rotationY: 180 });
    });
    
    // Team cards
    teamCards.forEach(card => {
      let isHovered = false;
      
      card.addEventListener('mouseenter', () => {
        if (isHovered) return;
        isHovered = true;
        
        gsap.to(card.querySelector('.member-front'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.member-back'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        isHovered = false;
        
        gsap.to(card.querySelector('.member-front'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(card.querySelector('.member-back'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      // Set initial state
      gsap.set(card.querySelector('.member-back'), { rotationY: 180 });
    });
    
    // Contact card
    if (contactCard) {
      let isHovered = false;
      
      contactCard.addEventListener('mouseenter', () => {
        if (isHovered) return;
        isHovered = true;
        
        gsap.to(contactCard.querySelector('.contact-front'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(contactCard.querySelector('.contact-back'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      contactCard.addEventListener('mouseleave', () => {
        isHovered = false;
        
        gsap.to(contactCard.querySelector('.contact-front'), {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        gsap.to(contactCard.querySelector('.contact-back'), {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      // Set initial state
      gsap.set(contactCard.querySelector('.contact-back'), { rotationY: 180 });
    }
  }
  
  // Initialize card animations
  initCardAnimations();
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    
    if (e.key === 'ArrowLeft') {
      goToSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentSlide + 1);
    }
  });
  
  // Form submission animations
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };
      
      // Simple button animation
      gsap.to('.submit-button', {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to('.submit-button', {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.2)'
          });
        }
      });
      
      // Simple success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out, ${formData.name}. We'll get back to you soon.</p>
        <button class="reset-form-button">Send Another Message</button>
      `;
      
      contactForm.appendChild(successMessage);
      
      gsap.from(successMessage, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }
  
  // Mobile swipe detection
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    if (isAnimating) return;
    
    const threshold = 75;
    
    if (touchEndX < touchStartX - threshold) {
      goToSlide(currentSlide + 1);
    }
    
    if (touchEndX > touchStartX + threshold) {
      goToSlide(currentSlide - 1);
    }
  }
  
  // Pause animations when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      logoAnimations.forEach(anim => {
        if (anim && anim.pause) anim.pause();
      });
    } else {
      logoAnimations.forEach(anim => {
        if (anim && anim.resume) anim.resume();
      });
    }
  });
});

// News Marquee Animation - FIXED VARIABLE SCOPE
function initNewsMarquee() {
  const newsContainer = document.querySelector('.news-container');
  
  if (!newsContainer) return;
  
  // Clone the news items for continuous scroll
  const newsItems = document.querySelectorAll('.news-item');
  const clonedItems = Array.from(newsItems).map(item => item.cloneNode(true));
  
  clonedItems.forEach(item => {
    newsContainer.appendChild(item);
  });
  
  // Calculate total width
  let totalWidth = 0;
  newsItems.forEach(item => {
    totalWidth += item.offsetWidth + 24;
  });
  
  // Wait for everything to settle before starting marquee animation
  setTimeout(() => {
    console.log('Starting marquee animation');
    // Store in the properly scoped variable
    marqueeAnimation = gsap.to(newsContainer, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      repeatDelay: 0
    });
    
    // Hover effects
    newsContainer.addEventListener('mouseenter', () => {
      if (marqueeAnimation) {
        gsap.to(newsContainer, { timeScale: 0.2, duration: 0.3 });
      }
    });
    
    newsContainer.addEventListener('mouseleave', () => {
      if (marqueeAnimation) {
        gsap.to(newsContainer, { timeScale: 1, duration: 0.3 });
      }
    });
  }, 1000); // Wait 1 second after marquee init before starting animation
}

// News Modal Functionality - RESTORED AND WORKING
function initNewsModal() {
  const newsItems = document.querySelectorAll('.news-item');
  const modalBackdrop = document.querySelector('.news-modal-backdrop');
  const modal = document.querySelector('.news-modal');
  const closeBtn = document.querySelector('.close-modal');
  
  if (!newsItems.length || !modalBackdrop || !modal) {
    console.log('News modal elements not found');
    return;
  }
  
  // News content data
  const newsData = {
    1: {
      title: "Join our Discord Server!",
      date: "May 18, 2025",
      image: "img/what-is-discord-1920x1080-c3d90ca45f57.jpg",
      content: `<p>We're thrilled to announce our new Discord Community: <strong>KOWG Community</strong>. In this community, we will be focusing on sharing our work and include the community in what we are making.</p>
                <p>Stay tuned for more details and feel free to ask us anything! We are currently looking for passionate developers and gamers alike to build and test!</p>
                <br><br><p>-KOWG</p>`
    },
    2: {
      title: "Whimsicalog #5: Project DCP",
      date: "May 12, 2025",
      image: "img/projectdcpfront.png",
      content: `<p>We are hard at work on creating our first games, we want to introduce them gradually as we go, but we are super excited to talk about this IP currently titled: <strong>Project DCP</strong>.</p>
                <p>We discuss different aspects of our game in our discord and can't wait to show you more as we continue development.</p>
                <br><br><p>-KOWG</p>`
    },
    3: {
      title: "Project Brothers Update!",
      date: "May 5, 2025",
      image: "img/brothersconceptart2.png",
      content: `<p>Kind of Whimsical Games building up! We're excited to announce that our new IP, project title <strong>Brothers</strong> is in writing phase!.</p>
                <p>We are currently in the main plot phase and character building. We will share some more concept art soon aswell!</p>
                <p>This is an exciting opportunity for us to write something, in the more mature direction.</p>
                <br><br><p>-KOWG</p>`
    },
    4: {
      title: "New ideas coming to life!",
      date: "April 30, 2025",
      image: "img/brothersconcptart.png",
      content: `<p>We have been hard at work to bring a new experiment to life. At this moment we a very early in the concept phase.</p>
                <p>Trying out different themes and settings over the last couple of months, we have settled on the things we feel work well together for the story we want to tell.</p>
                <p>Stay tuned, we will deliver more news about this IP soon!</p>
                <br><br><p>-KOWG</p>`
    },
    5: {
      title: "Whimsicalog #4: Retenta",
      date: "April 25, 2025",
      image: "img/retentagame.png",
      content: `<p>We are in the gameplay phase of building the game, right now we are building the different classes that is going to be chosen by the player.</p>
                <p>The choice of what class will define a campaign or run fundamentally for the player.</p>
                <p>Right now, we are not ready to show all the classes, but we have a little sneak peek on early build!</p>
                <br><br><p>-KOWG</p>`
    },
    6: {
      title: "Project DCP",
      date: "April 18, 2025",
      image: "img/projectdcpgameplay.png",
      content: `<p>We are happy and excited to announce our new project!</p>
                <p>The project name <strong>DCP</strong> is a new game that is going to be a adventure rpg with different aspects of dark fantasy themed madness!</p>
                <p>Right now we are in a 'Prototype' phase where we will be testing level design, general gameplay and character development. On the same note we are currently on the drawing board to build something special, lore wise.</p>
                <br><br><p>-KOWG</p>`
    }
  };
  
  // Add click listeners to all news items (including cloned ones)
  function addNewsClickListeners() {
    const allNewsItems = document.querySelectorAll('.news-item');
    
    allNewsItems.forEach(item => {
      // Remove existing listeners to avoid duplicates
      item.removeEventListener('click', handleNewsClick);
      // Add new listener
      item.addEventListener('click', handleNewsClick);
    });
  }
  
  function handleNewsClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const newsId = this.getAttribute('data-news-id');
    const newsInfo = newsData[newsId];
    
    console.log('News item clicked:', newsId, newsInfo);
    
    if (newsInfo) {
      // Populate modal content
      document.getElementById('modal-title').textContent = newsInfo.title;
      document.getElementById('modal-date').textContent = newsInfo.date;
      document.getElementById('modal-image').src = newsInfo.image;
      document.getElementById('modal-content').innerHTML = newsInfo.content;
      
      // Show modal with animation
      modalBackdrop.classList.add('active');
      
      gsap.fromTo(modal, 
        { scale: 0.8, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  }
  
  // Initial setup of click listeners
  addNewsClickListeners();
  
  // Re-add listeners after marquee is initialized (in case clones need them)
  setTimeout(() => {
    addNewsClickListeners();
  }, 1000);
  
  // Modal closing function
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
  
  // Close button listener
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Backdrop click listener
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });
  
  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
  
  console.log('News modal initialized successfully');
}

// Game Modal System with Book Opening Animation
function initGameModals() {
  const gameCards = document.querySelectorAll('.game-card');
  const modalBackdrop = document.querySelector('.game-modal-backdrop');
  const bookWrapper = document.querySelector('.book-wrapper');
  const closeBtn = document.querySelector('.close-book-modal');
  const sliderArrows = document.querySelectorAll('.slider-arrow');
  
  if (!modalBackdrop || !bookWrapper) {
    console.log('Game modal elements not found');
    return;
  }
  
  // Game data for modals
  const gameData = {
    game1: {
      id: 'retenta',
      title: 'Retenta',
      status: 'In Development',
      logo: 'img/Retentalogo.png',
      progress: 65,
      description: `
        <p>A strategic card game where memories become power. In Retenta, players collect and strategically play cards representing fragments of forgotten experiences, building a narrative as they compete to recover what was lost.</p>
        <p>Set in a world where memories can be extracted, stored, and traded, players must carefully manage their deck of memory cards to achieve victory while uncovering the deeper mystery of their character's past.</p>
      `,
      features: [
        'Strategic deck-building mechanics',
        'Narrative-driven gameplay',
        'Memory-based card system',
        'Multiple character classes',
        'Campaign and multiplayer modes',
        'Stunning hand-drawn artwork'
      ],
      gallery: [
        'img/retentagame.png',
        'img/Retentalogo.png',
        'img/retentagame.png'
      ]
    },
    game2: {
      id: 'brothers',
      title: 'Project Brothers',
      status: 'Concept Phase',
      logo: 'img/detective.png',
      progress: 25,
      description: `
        <p>Follow impossible clues through a city where nothing is quite as it seems. Our detective game challenges players to think outside the box, piecing together a mystery where the laws of reality might bend but never break.</p>
        <p>This mature narrative experience focuses on deep character development and moral choices that impact the story's direction.</p>
      `,
      features: [
        'Non-linear investigation system',
        'Reality-bending puzzle mechanics',
        'Mature storytelling',
        'Multiple story branches',
        'Character relationship dynamics',
        'Atmospheric noir setting'
      ],
      gallery: [
        'img/brothersconceptart2.png',
        'img/brothersconcptart.png',
        'img/detective.png'
      ]
    },
    game3: {
      id: 'dcp',
      title: 'Project DCP',
      status: 'Early Development',
      logo: 'img/projectdcpfront.png',
      progress: 40,
      description: `
        <p>More than just an endless runner - a journey through vibrant landscapes that change as you progress. Simple mechanics belie a deeper story that unfolds with each milestone reached.</p>
        <p>Combining adventure RPG elements with dark fantasy themes, Project DCP offers both accessible gameplay and rich storytelling.</p>
      `,
      features: [
        'Dynamic landscape generation',
        'Progressive story revelation',
        'Dark fantasy atmosphere',
        'Character progression system',
        'Multiple unlockable paths',
        'Procedural world events'
      ],
      gallery: [
        'img/projectdcpfront.png',
        'img/projectdcpgameplay.png',
        'img/projectdcpfront.png'
      ]
    }
  };
  
  // Function to open game modal - SIMPLIFIED
  function openGameModal(gameId) {
    const game = gameData[gameId];
    if (!game) return;
    
    console.log('Opening modal for:', game.title);
    
    // Populate modal content
    document.getElementById('modal-game-title').textContent = game.title;
    document.getElementById('modal-game-status').textContent = game.status;
    document.getElementById('modal-game-logo').src = game.logo;
    document.getElementById('modal-game-description').innerHTML = game.description;
    document.getElementById('modal-progress-fill').style.width = game.progress + '%';
    document.getElementById('modal-progress-text').textContent = game.progress + '%';
    
    // Populate features
    const featuresList = document.getElementById('modal-game-features');
    featuresList.innerHTML = '';
    game.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
    
    // Populate gallery
    const gallery = document.getElementById('modal-game-gallery');
    gallery.innerHTML = '';
    game.gallery.forEach(imageSrc => {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.className = 'gallery-image';
      img.alt = `${game.title} screenshot`;
      gallery.appendChild(img);
    });
    
    // Hide slider arrows
    sliderArrows.forEach(arrow => {
      arrow.style.opacity = '0';
      arrow.style.pointerEvents = 'none';
    });
    
    // Show modal - it should center on current viewport
    modalBackdrop.classList.add('active');
    
    // Book opening animation sequence with GSAP
    const bookOpenTimeline = gsap.timeline();
    
    bookOpenTimeline
      // Start with book closed
      .set(bookWrapper, { rotateY: 0 })
      .set('.book-cover', { rotateY: 0 })
      .set('.book-content', { opacity: 0.3 })
      
      // Slight delay then begin opening
      .to({}, { duration: 0.3 })
      
      // Book tilts slightly
      .to(bookWrapper, {
        rotateY: -15,
        duration: 0.6,
        ease: 'power2.out'
      })
      
      // Cover opens
      .to('.book-cover', {
        rotateY: -160,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.3')
      
      // Content becomes fully visible
      .to('.book-content', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      
      // Animate content sections in
      .from('.content-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.4');
  }
  
  // Function to close game modal
  function closeGameModal() {
    console.log('Closing game modal');
    
    // Book closing animation
    const bookCloseTimeline = gsap.timeline({
      onComplete: () => {
        modalBackdrop.classList.remove('active');
        
        // Show slider arrows again
        sliderArrows.forEach(arrow => {
          arrow.style.opacity = '1';
          arrow.style.pointerEvents = 'auto';
        });
      }
    });
    
    bookCloseTimeline
      // Fade out content
      .to('.content-section', {
        y: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      })
      
      // Close the cover
      .to('.book-cover', {
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.in'
      }, '-=0.2')
      
      // Return book to center
      .to(bookWrapper, {
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.in'
      }, '-=0.4');
  }
  
  // Add click listeners to "Learn More" links
  gameCards.forEach((card, index) => {
    const learnMoreLink = card.querySelector('.card-link');
    if (learnMoreLink) {
      learnMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Map card index to game ID
        const gameIds = ['game1', 'game2', 'game3'];
        const gameId = gameIds[index];
        
        if (gameId) {
          openGameModal(gameId);
        }
      });
    }
  });
  
  // Close modal listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', closeGameModal);
  }
  
  // Close on backdrop click
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeGameModal();
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeGameModal();
    }
  });
  
  // Action button handlers
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  const discordBtns = document.querySelectorAll('.discord-btn');
  
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Add wishlist functionality here
      gsap.to(btn, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
      console.log('Added to wishlist!');
    });
  });
  
  discordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Open Discord link
      gsap.to(btn, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
      // Replace with your Discord server link
      window.open('https://discord.gg/your-server', '_blank');
    });
  });
  
  console.log('Game modals initialized successfully');
}

// Initialize game modals when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add a delay to ensure other systems are loaded first
  setTimeout(() => {
    initGameModals();
  }, 2000);
});