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
    .from('.logo-wrapper', { duration: 0.8, scale: 0, autoAlpha: 0, rotation: -180, ease: 'back.out(1.7)' }, '-=0.5')
    .from('.nav-links li', { 
      duration: 0.7, 
      autoAlpha: 0, 
      y: -20, 
      stagger: 0.1, 
      ease: 'power3.out' 
    }, '-=0.4')
    .from('.logo-display', { 
      duration: 1, 
      autoAlpha: 0, 
      scale: 0.5, 
      ease: 'back.out(1.7)' 
    }, '-=0.3')
    .from('.studio-name', { duration: 0.8, y: 30, autoAlpha: 0, ease: 'power3.out' }, '-=0.5')
    .from('.studio-tagline', { duration: 0.8, y: 20, autoAlpha: 0, ease: 'power3.out' }, '-=0.6')
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
        duration: 1,
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