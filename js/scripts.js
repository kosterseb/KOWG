// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP with FLIP plugin
  
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
  
  // Set initial slide
  let currentSlide = 0;
  const slideCount = slides.length;
  
  // Initial page load animation
  const loadingTimeline = gsap.timeline();
  
  loadingTimeline
    .from('.background-pattern', { duration: 1, autoAlpha: 0, ease: 'power2.out' })
    .from('.logo-svg3', { duration: 0.8, scale: 0, autoAlpha: 0, rotation: -180, ease: 'back.out(1.7)' }, '-=0.5')
    .from('.nav-links li', { 
      duration: 0.7, 
      autoAlpha: 0, 
      y: -20, 
      stagger: 0.1, 
      ease: 'power3.out' 
    }, '-=0.4')
    .from('.logo-svg', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.5, 
      ease: 'back.out(1.7)',
      onComplete: () => {
        // Start the logo-display floating animation
        gsap.to('.logo-svg', {
          y: -8,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }
    }, '-=0.3')
    .from('.logo-svg2', { 
      duration: 2, 
      autoAlpha: 0, 
      scale: 0.5, 
      ease: 'back.out(1.7)',
      onComplete: () => {
        // Start the logo-display floating animation
        gsap.to('.logo-svg2', {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }
    }, '-=0.4')
    .from('.floating-image', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.5, 
      ease: 'back.out(1.7)',
    })
    .from('.news-marquee-container', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.5, 
      ease: 'back.out(1.7)',
    })
    
    .from('.game-preview', { 
      duration: 0.8, 
      y: 30, 
      autoAlpha: 0, 
      ease: 'power3.out',
      onComplete: () => {
        // Start the game-preview floating animation
        gsap.to('.game-preview', {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }
    }, '-=0.4')
    .from('.cta-button', { 
      duration: 0.6, 
      scale: 0, 
      autoAlpha: 0, 
      ease: 'back.out(1.5)' 
    }, '-=0.2');
  
  // Function to animate slide change
  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      slideIndex = slideCount - 1;
    } else if (slideIndex >= slideCount) {
      slideIndex = 0;
    }
    
    // Calculate slide position
    const slidePosition = -slideIndex * 25; // 25% per slide (4 slides = 100%)
    
    // Create flip animation between slides
    const flipTimeline = gsap.timeline();
    
    // First half of the flip (current slide rotates out)
    flipTimeline.to(sliderWrapper, {
      rotationY: 90,
      duration: 0.4,
      ease: 'power1.in',
      onComplete: () => {
        // Update active states
        document.querySelector('.slide.active').classList.remove('active');
        slides[slideIndex].classList.add('active');
        
        document.querySelector('.dot.active').classList.remove('active');
        dots[slideIndex].classList.add('active');
        
        document.querySelector('.nav-link.active').classList.remove('active');
        navLinks[slideIndex].classList.add('active');
        
        // Set slide wrapper position
        gsap.set(sliderWrapper, {
          x: `${slidePosition}%`
        });
      }
    })
    // Second half of the flip (new slide rotates in)
    .to(sliderWrapper, {
      rotationY: 0,
      duration: 0.4,
      ease: 'power1.out'
    });
    
    // Entrance animations for slide content
    const targetSlide = slides[slideIndex];
    
    switch (slideIndex) {
      case 0: // Home slide
        gsap.from(targetSlide.querySelectorAll('.home-hero > *'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.7,
          ease: 'power3.out'
        });
        break;
        
      case 1: // Games slide
        gsap.from(targetSlide.querySelector('h1'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.7,
          ease: 'power3.out'
        });
        
        gsap.from(targetSlide.querySelectorAll('.game-card'), {
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.9,
          ease: 'back.out(1.7)'
        });
        break;
        
      case 2: // About slide
        gsap.from(targetSlide.querySelector('h1'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.7,
          ease: 'power3.out'
        });
        
        gsap.from(targetSlide.querySelectorAll('.team-card'), {
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.9,
          ease: 'back.out(1.7)'
        });
        
        gsap.from(targetSlide.querySelector('.studio-philosophy'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 1.2,
          ease: 'power3.out'
        });
        break;
        
      case 3: // Contact slide
        gsap.from(targetSlide.querySelector('h1'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.7,
          ease: 'power3.out'
        });
        
        gsap.from(targetSlide.querySelector('.contact-form-container'), {
          x: -30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.9,
          ease: 'power3.out'
        });
        
        gsap.from(targetSlide.querySelector('.contact-info'), {
          x: 30,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.9,
          ease: 'power3.out'
        });
        break;
    }
    
    // Update currentSlide
    currentSlide = slideIndex;
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
      goToSlide(1); // Go to Games slide (index 1)
    });
  }
  
  // Handle game card flip animations with GSAP
  gameCards.forEach(card => {
    // Use custom hover events instead of CSS for more control with GSAP
    card.addEventListener('mouseenter', () => {
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
    
    // Initial state
    gsap.set(card.querySelector('.card-back'), {
      rotationY: 180
    });
  });
  
  // Handle team card flip animations with GSAP
  teamCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
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
    
    // Initial state
    gsap.set(card.querySelector('.member-back'), {
      rotationY: 180
    });
  });
  
  // Handle contact card flip animation with GSAP
  if (contactCard) {
    contactCard.addEventListener('mouseenter', () => {
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
    
    // Initial state
    gsap.set(contactCard.querySelector('.contact-back'), {
      rotationY: 180
    });
  }
  
  // Keyboard navigation (arrow keys)
  document.addEventListener('keydown', (e) => {
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
      
      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };
      
      // Animate button press
      gsap.to('.submit-button', {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to('.submit-button', {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
      
      // Simulate form submission with animation
      const formElements = contactForm.querySelectorAll('.form-group, .submit-button');
      
      // Create flip state for animation
      const formState = Flip.getState(formElements);
      
      // Create placeholder for success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out, ${formData.name}. We'll get back to you soon.</p>
        <button class="reset-form-button">Send Another Message</button>
      `;
      
      // Hide form elements
      formElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Add success message
      contactForm.appendChild(successMessage);
      
      // Animate the transition
      Flip.from(formState, {
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          // Add reset button handler
          document.querySelector('.reset-form-button').addEventListener('click', () => {
            // Reset the form
            contactForm.reset();
            
            // Remove success message
            successMessage.remove();
            
            // Show form elements again
            formElements.forEach(el => {
              el.style.display = '';
            });
            
            // Animate form elements back in
            gsap.from(formElements, {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.5,
              ease: 'power2.out'
            });
          });
        }
      });
    });
  }
  
  // Newsletter form animation
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animate button
      gsap.to(newsletterForm.querySelector('button'), {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to(newsletterForm.querySelector('button'), {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
      
      // Create flip state for animation
      const formState = Flip.getState(newsletterForm);
      
      // Get email input value
      const emailInput = newsletterForm.querySelector('input');
      const emailValue = emailInput.value;
      
      // Create thank you message
      const thankYouMessage = document.createElement('p');
      thankYouMessage.className = 'thank-you-message';
      thankYouMessage.innerHTML = `Thanks for subscribing! We've added <strong>${emailValue}</strong> to our mailing list.`;
      
      // Replace form with thank you message
      newsletterForm.innerHTML = '';
      newsletterForm.appendChild(thankYouMessage);
      
      // Animate the transition
      Flip.from(formState, {
        duration: 0.6,
        ease: 'power2.inOut'
      });
    });
  }
  
  // Add additional animations for interactive elements
  
  // Logo hover animation
  const logoWrapper = document.querySelector('.logo-wrapper');
  if (logoWrapper) {
    logoWrapper.addEventListener('mouseenter', () => {
      gsap.to(logoWrapper, {
        rotate: 360,
        duration: 2,
        ease: 'power1.inOut'
      });
    });
    
    logoWrapper.addEventListener('mouseleave', () => {
      gsap.to(logoWrapper, {
        rotate: 0,
        duration: 1,
        ease: 'power1.inOut'
      });
    });
  }
  
  // Logo SVG animation on home slide
  const logoSvg = document.querySelector('.logo-svg');
  if (logoSvg) {
    // Create a timeline for the logo animation
    const logoTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 5
    });
    
    // Add animations to the timeline
    logoTimeline
      .to(logoSvg, {
        rotate: 5,
        duration: 2,
        ease: 'sine.inOut'
      })
      .to(logoSvg, {
        rotate: -5,
        duration: 2,
        ease: 'sine.inOut'
      })
      .to(logoSvg, {
        rotate: 0,
        duration: 1,
        ease: 'power1.out'
      });
  }
  
  // Add a whimsical touch - floating particles in the background
  function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    const colors = ['#1abc9c', '#f1c40f', '#ecf0f1', '#3498db'];
    const particleCount = 90;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      
      // Random size
      const size = Math.random() * 10 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      particleContainer.appendChild(particle);
      
      // Animate each particle
      gsap.to(particle, {
        x: `${Math.random() * 400 - 200}px`,
        y: `${Math.random() * 400 - 200}px`,
        duration: Math.random() * 40 + 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
    
    // Add styles for particles
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
      }
      .particle {
        position: absolute;
        border-radius: 50%;
        filter: blur(2px);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Call createParticles function
  createParticles();
  
  // Add a "press any key to continue" effect (optional)
  const handleInitialInteraction = () => {
    // Only run this if there's a specific element to show/hide
    const initialOverlay = document.querySelector('.initial-overlay');
    if (initialOverlay) {
      gsap.to(initialOverlay, {
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          initialOverlay.remove();
          // Start the main page animations
          loadingTimeline.play();
        }
      });
      
      // Remove event listeners
      document.removeEventListener('keydown', handleInitialInteraction);
      document.removeEventListener('click', handleInitialInteraction);
      document.removeEventListener('touchstart', handleInitialInteraction);
    }
  };
  
  // Add swipe detection for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const threshold = 75; // Minimum swipe distance
    
    if (touchEndX < touchStartX - threshold) {
      // Swipe left - go to next slide
      goToSlide(currentSlide + 1);
    }
    
    if (touchEndX > touchStartX + threshold) {
      // Swipe right - go to previous slide
      goToSlide(currentSlide - 1);
    }
  }
  
  // Initialize the first slide
  // Uncomment if you want some initial animations
  // setTimeout(() => {
  //   goToSlide(0);
  // }, 100);
  
  // Helper function for debugger
  function debug(message) {
    const debugElement = document.querySelector('.debug');
    if (debugElement) {
      debugElement.textContent = message;
    } else {
      console.log(message);
    }
  }
});

// Add this to your existing script.js file or at the bottom of your existing script

// News Marquee Animation
function initNewsMarquee() {
  const newsContainer = document.querySelector('.news-container');
  
  if (!newsContainer) return;
  
  // Clone the news items for continuous scroll
  const newsItems = document.querySelectorAll('.news-item');
  const clonedItems = Array.from(newsItems).map(item => item.cloneNode(true));
  
  clonedItems.forEach(item => {
    newsContainer.appendChild(item);
  });
  
  // Create GSAP animation for smooth scrolling
  // This will be better than CSS animation for performance
  let totalWidth = 0;
  newsItems.forEach(item => {
    totalWidth += item.offsetWidth + 24; // width + gap
  });
  
  gsap.to(newsContainer, {
    x: -totalWidth,
    duration: 30,
    ease: "linear",
    repeat: -1,
    repeatDelay: 0
  });
  
  // Pause the animation on hover
  newsContainer.addEventListener('mouseenter', () => {
    gsap.to(newsContainer, { timeScale: 0.2, duration: 0.5 });
  });
  
  newsContainer.addEventListener('mouseleave', () => {
    gsap.to(newsContainer, { timeScale: 1, duration: 0.5 });
  });
}

// News Modal Functionality
function initNewsModal() {
  const newsItems = document.querySelectorAll('.news-item');
  const modalBackdrop = document.querySelector('.news-modal-backdrop');
  const modal = document.querySelector('.news-modal');
  const closeBtn = document.querySelector('.close-modal');
  
  if (!newsItems.length || !modalBackdrop || !modal) return;
  
  // Define news content
  const newsData = {
    1: {
      title: "Join our Discord Server!",
      date: "May 18, 2025",
      image: "img/what-is-discord-1920x1080-c3d90ca45f57.jpg",
      content: `<p>We're thrilled to announce our new Discord Community: <strong>KOWG Community</strong>. In this community, we will be focusing on sharing our work and include the community in what we are making.</p>
                <p>Stay tuned for more details and feel free to ask us anything! We are currently looking for passionate developers and gamers alike to build and test!</p>
                <br>
                <br>
                <p>-KOWG</p>`
    },
    2: {
      title: "Whimsicalog #5: Project DCP",
      date: "May 12, 2025",
      image: "img/projectdcpfront.png",
      content: `<p>We are hard at work on creating our first games, we want to introduce them gradually as we go, but we are super excited to talk about this IP currently titled: <strong>Project DCP</strong>.</p>
                <p>We discuss different aspects of our game in our discord and can't wait to show you more as we continue development.</p>
                <br>
                <br>
                <p>-KOWG</p>`
    },
    3: {
      title: "Project Brothers Update!",
      date: "May 5, 2025",
      image: "img/brothersconceptart2.png",
      content: `<p>Kind of Whimsical Games building up! We're excited to announce that our new IP, project title <strong>Brothers</strong> is in writing phase!.</p>
                <p>We are currently in the main plot phase and character building. We will share some more concept art soon aswell!</p>
                <p>This is an exciting opportunity for us to write something, in the more mature direction.</p>
                <br>
                <br>
                <p>-KOWG</p>`
    },
    4: {
      title: "New ideas coming to life!",
      date: "April 30, 2025",
      image: "img/brothersconcptart.png",
      content: `<p>We have been hard at work to bring a new experiment to life. At this moment we a very early in the concept phase.</p>
                <p>Trying out different themes and settings over the last couple of months, we have settled on the things we feel work well together for the story we want to tell.</p>
                <p>Stay tuned, we will deliver more news about this IP soon!</p>
                <br>
                <br>
                <p>-KOWG</p>`
    },
    5: {
      title: "Whimsicalog #4: Retenta",
      date: "April 25, 2025",
      image: "img/retentagame.png",
      content: `<p>We are in the gameplay phase of building the game, right now we are building the different classes that is going to be chosen by the player.</p>
                <p>The choice of what class will define a campaign or run fundamentally for the player.</p>
                <p>Right now, we are not ready to show all the classes, but we have a little sneak peek on early build!</p>
                <br>
                <br>
                <p>-KOWG</p>`
    },
    6: {
      title: "Project DCP",
      date: "April 18, 2025",
      image: "img/projectdcpgameplay.png",
      content: `<p>We are happy and excited to announce our new project!</p>
                <p>The project name <strong>DCP</strong> is a new game that is going to be a adventure rpg with different aspects of dark fantasy themed madness!</p>
                <p>Right now we are in a 'Prototype' phase where we will be testing level design, general gameplay and character development. On the same note we are currently on the drawing board to build something special, lore wise.</p>
                <br>
                <br>
                <p>-KOWG</p>`
    }
  };
  
  // Open modal when clicking on news item
  newsItems.forEach(item => {
    item.addEventListener('click', () => {
      const newsId = item.getAttribute('data-news-id');
      const newsInfo = newsData[newsId];
      
      if (newsInfo) {
        // Populate modal with content
        document.getElementById('modal-title').textContent = newsInfo.title;
        document.getElementById('modal-date').textContent = newsInfo.date;
        document.getElementById('modal-image').src = newsInfo.image;
        document.getElementById('modal-content').innerHTML = newsInfo.content;
        
        // Show modal with animation
        modalBackdrop.classList.add('active');
        
        // Add slight bounce to modal entrance
        gsap.from(modal, {
          scale: 0.9,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
    });
  });
  
  // Close modal when clicking close button or backdrop
  closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });
  
  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
  
  function closeModal() {
    gsap.to(modal, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        modalBackdrop.classList.remove('active');
        gsap.set(modal, { scale: 1, opacity: 1 });
      }
    });
  }
}

// Floating Images Animation
function initFloatingImages() {
  const floatingImages = document.querySelectorAll('.floating-image');
  
  if (!floatingImages.length) return;
  
  floatingImages.forEach((img, index) => {
    // Set random starting positions around the logo
    gsap.set(img, {
      x: 0,
      y: 0,
      rotation: Math.random() * 20 - 10
    });
    
    // Create floating animation
    gsap.to(img, {
      x: `random(-30, 30)`,
      y: `random(-30, 30)`,
      rotation: `random(-15, 15)`,
      duration: 5 + index,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.5
    });
  });
  
  // Make images follow cursor slightly
  document.querySelector('.logo-display').addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    floatingImages.forEach((img) => {
      gsap.to(img, {
        x: mouseX * 40,
        y: mouseY * 40,
        duration: 1,
        ease: "power1.out",
        overwrite: "auto"
      });
    });
  });
}

// Initialize everything when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Run existing initializations
  
  // Then run our new ones
  setTimeout(() => {
    initNewsMarquee();
    initNewsModal();
    initFloatingImages();
  }, 1000); // Short delay to ensure other animations are settled
});