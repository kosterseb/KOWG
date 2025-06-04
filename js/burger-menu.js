

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing whimsical burger menu system with spectacular animations');
    
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
      
      // Create mobile navigation with enhanced structure for animations
      mobileNavOverlay.innerHTML = `
        <!-- Animated Background Elements -->
        <div class="mobile-nav-decoration decoration-1"></div>
        <div class="mobile-nav-decoration decoration-2"></div>
        <div class="mobile-nav-decoration decoration-3"></div>
        <div class="mobile-nav-decoration decoration-4"></div>
        <div class="mobile-nav-decoration decoration-5"></div>
        
        <!-- Mobile Logo -->
        <div class="mobile-logo-container">
          <div class="mobile-logo-wrapper">
            <a href="index.html">
              <img src="img/kowg_upper_logo.png" alt="KOWG Logo" class="mobile-logo-img">
            </a>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <ul class="mobile-nav-links">
          <li class="nav-item-wrapper">
            <a href="index.html" class="mobile-nav-link page-transition ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
              <span class="nav-text">Home</span>
              <span class="nav-accent"></span>
            </a>
          </li>
          <li class="nav-item-wrapper">
            <a href="games.html" class="mobile-nav-link page-transition ${currentPage === 'games.html' ? 'active' : ''}">
              <span class="nav-text">Our Games</span>
              <span class="nav-accent"></span>
            </a>
          </li>
          <li class="nav-item-wrapper">
            <a href="about.html" class="mobile-nav-link page-transition ${currentPage === 'about.html' ? 'active' : ''}">
              <span class="nav-text">About Us</span>
              <span class="nav-accent"></span>
            </a>
          </li>
          <li class="nav-item-wrapper">
            <a href="contact.html" class="mobile-nav-link page-transition ${currentPage === 'contact.html' ? 'active' : ''}">
              <span class="nav-text">Contact</span>
              <span class="nav-accent"></span>
            </a>
          </li>
        </ul>
        
        <!-- Social Icons -->
        <div class="mobile-social-icons">
          <a href="https://instagram.com/your-handle" target="_blank" class="social-icon social-instagram" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
  
          <a href="https://discord.gg/your-server" target="_blank" class="social-icon social-discord" aria-label="Discord">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
  
          <a href="https://tiktok.com/@your-handle" target="_blank" class="social-icon social-tiktok" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
  
          <a href="https://linkedin.com/company/your-company" target="_blank" class="social-icon social-linkedin" aria-label="LinkedIn">
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
      
      console.log('Burger menu HTML created with enhanced animation structure');
    }
    
    function setupBurgerMenuEvents() {
      const burgerMenu = document.querySelector('.burger-menu');
      const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
      
      if (!burgerMenu || !mobileNavOverlay) {
        console.warn('Burger menu elements not found');
        return;
      }
      
      let isMenuOpen = false;
      let openTimeline = null;
      let closeTimeline = null;
      
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
        // Kill any existing timelines
        if (openTimeline) openTimeline.kill();
        if (closeTimeline) closeTimeline.kill();
        
        burgerMenu.classList.toggle('active', open);
        mobileNavOverlay.classList.toggle('active', open);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = open ? 'hidden' : '';
        
        if (open) {
          animateMenuOpen();
        } else {
          animateMenuClose();
        }
        
        console.log(`Menu ${open ? 'opened' : 'closed'} with spectacular animations`);
      }
      
      // 🎭 SPECTACULAR OPENING ANIMATION
      function animateMenuOpen() {
        // Set initial states for all elements
        gsap.set('.mobile-nav-decoration', { 
          scale: 0, 
          rotation: 0, 
          autoAlpha: 0,
          x: 0,
          y: 0
        });
        
        gsap.set('.mobile-logo-wrapper', { 
          scale: 0, 
          rotation: -180, 
          autoAlpha: 0,
          y: -50
        });
        
        gsap.set('.nav-item-wrapper', { 
          x: -100, 
          autoAlpha: 0, 
          rotation: -10 
        });
        
        gsap.set('.nav-text', { 
          y: 20, 
          autoAlpha: 0 
        });
        
        gsap.set('.nav-accent', { 
          scaleX: 0 
        });
        
        gsap.set('.mobile-social-icons .social-icon', { 
          scale: 0, 
          rotation: 180, 
          autoAlpha: 0 
        });
        
        // Create the spectacular opening timeline
        openTimeline = gsap.timeline();
        
        openTimeline
          // Phase 1: Decorations burst in with stagger
          .to('.mobile-nav-decoration', {
            scale: 1,
            rotation: 720,
            autoAlpha: 0.1,
            duration: 1.2,
            stagger: {
              each: 0.15,
              from: "center"
            },
            ease: "back.out(2)"
          })
          
          // Phase 2: Decorations start floating
          .to('.decoration-1', {
            x: -20,
            y: -30,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }, 0.8)
          
          .to('.decoration-2', {
            x: 25,
            y: -15,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }, 0.9)
          
          .to('.decoration-3', {
            x: -15,
            y: 25,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }, 1.0)
          
          .to('.decoration-4', {
            x: 30,
            y: 20,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }, 1.1)
          
          .to('.decoration-5', {
            x: -25,
            y: -20,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }, 1.2)
          
          // Phase 3: Logo dramatic entrance
          .to('.mobile-logo-wrapper', {
            scale: 1.2,
            rotation: 0,
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.8)"
          }, 0.6)
          
          .to('.mobile-logo-wrapper', {
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.8)"
          })
          
          // Phase 4: Navigation links cascade in
          .to('.nav-item-wrapper', {
            x: 0,
            autoAlpha: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
          }, 1.0)
          
          .to('.nav-text', {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out"
          }, 1.2)
          
          .to('.nav-accent', {
            scaleX: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
          }, 1.4)
          
          // Phase 5: Social icons spiral in
          .to('.mobile-social-icons .social-icon', {
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)"
          }, 1.6)
          
          // Phase 6: Burger lines animate
          .to('.burger-line', {
            scaleX: 1.2,
            duration: 0.2,
            stagger: 0.05,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }, 0.2);
      }
      
      // SPECTACULAR CLOSING ANIMATION
      function animateMenuClose() {
        closeTimeline = gsap.timeline();
        
        closeTimeline
          // Phase 1: Social icons spin out
          .to('.mobile-social-icons .social-icon', {
            scale: 0,
            rotation: -180,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.in(1.5)"
          })
          
          // Phase 2: Nav links slide out with rotation
          .to('.nav-accent', {
            scaleX: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
          }, 0.1)
          
          .to('.nav-text', {
            y: -20,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in"
          }, 0.2)
          
          .to('.nav-item-wrapper', {
            x: 100,
            autoAlpha: 0,
            rotation: 10,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.in"
          }, 0.3)
          
          // Phase 3: Logo dramatic exit
          .to('.mobile-logo-wrapper', {
            scale: 0,
            rotation: 180,
            autoAlpha: 0,
            y: -50,
            duration: 0.6,
            ease: "back.in(1.8)"
          }, 0.5)
          
          // Phase 4: Decorations collapse inward
          .to('.mobile-nav-decoration', {
            scale: 0,
            rotation: -360,
            autoAlpha: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            stagger: {
              each: 0.1,
              from: "end"
            },
            ease: "power3.in"
          }, 0.6)
          
          // Phase 5: Final burger line animation
          .to('.burger-line', {
            scaleX: 0.8,
            duration: 0.1,
            stagger: 0.03,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }, 0.2);
      }
      
      console.log('Spectacular burger menu animations setup complete');
    }
    
    // Enhanced hover effects for burger menu
    function addEnhancedHoverEffects() {
      const burgerMenu = document.querySelector('.burger-menu');
      if (!burgerMenu) return;
      
      burgerMenu.addEventListener('mouseenter', () => {
        if (window.gsap && !burgerMenu.classList.contains('active')) {
          const lines = burgerMenu.querySelectorAll('.burger-line');
          gsap.to(lines, {
            scaleX: 1.2,
            y: (i) => [1, 0, -1][i],
            duration: 0.3,
            stagger: 0.05,
            ease: "elastic.out(1, 0.5)"
          });
        }
      });
      
      burgerMenu.addEventListener('mouseleave', () => {
        if (window.gsap && !burgerMenu.classList.contains('active')) {
          const lines = burgerMenu.querySelectorAll('.burger-line');
          gsap.to(lines, {
            scaleX: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "elastic.out(1, 0.5)"
          });
        }
      });
      
      // Enhanced hover effects for navigation links
      setTimeout(() => {
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
          link.addEventListener('mouseenter', () => {
            if (window.gsap) {
              gsap.to(link.querySelector('.nav-text'), {
                scale: 1.05,
                x: 5,
                duration: 0.3,
                ease: "power2.out"
              });
              
              gsap.to(link.querySelector('.nav-accent'), {
                scaleX: 1.2,
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
          
          link.addEventListener('mouseleave', () => {
            if (window.gsap) {
              gsap.to(link.querySelector('.nav-text'), {
                scale: 1,
                x: 0,
                duration: 0.3,
                ease: "power2.out"
              });
              
              gsap.to(link.querySelector('.nav-accent'), {
                scaleX: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
        });
        
        // Enhanced hover effects for social icons
        const socialIcons = document.querySelectorAll('.mobile-social-icons .social-icon');
        socialIcons.forEach(icon => {
          icon.addEventListener('mouseenter', () => {
            if (window.gsap) {
              gsap.to(icon, {
                scale: 1.3,
                rotation: 10,
                y: -5,
                duration: 0.3,
                ease: "back.out(1.5)"
              });
            }
          });
          
          icon.addEventListener('mouseleave', () => {
            if (window.gsap) {
              gsap.to(icon, {
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 0.3,
                ease: "back.out(1.5)"
              });
            }
          });
        });
      }, 1000);
    }
    
    // Initialize enhanced effects after DOM is ready
    setTimeout(addEnhancedHoverEffects, 100);
    
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
    
    console.log('Spectacular whimsical burger menu system fully initialized');
  });