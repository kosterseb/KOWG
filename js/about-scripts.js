// About Page JavaScript 
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP
  gsap.config({
    force3D: true,
    nullTargetWarn: false
  });
  
  // Animation variables
  let backgroundAnimations = [];
  
  // Set initial states
  gsap.set('.social-media-icons .social-icon', { 
    autoAlpha: 0, 
    scale: 0.5
  });
  
  // Main loading timeline
  const loadingTimeline = gsap.timeline({
    onStart: () => {
      createSubtleParticles();
    },
    onComplete: () => {
      setTimeout(() => {
        initTeamModals();
      }, 300);
    }
  });
  
  loadingTimeline
    .set('.background-pattern', { autoAlpha: 1 })
    .to({}, { duration: 0.5 }) 
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
    .from('.about-hero', {
      duration: 1,
      y: 50,
      autoAlpha: 0,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.team-card', {
      duration: 0.8,
      scale: 0.8,
      autoAlpha: 0,
      stagger: 0.3,
      ease: 'back.out(1.4)'
    }, '-=0.5')
    .from('.philosophy-section', {
      duration: 0.8,
      y: 30,
      autoAlpha: 0,
      ease: 'power2.out'
    }, '-=0.3');
  
  // Subtle particle system for about page
  function createSubtleParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    const colors = ['#1abc9c', '#f1c40f', '#ecf0f1'];
    const particleCount = 20; 
    
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
        x: `${Math.random() * 300 - 175}px`,
        y: `${Math.random() * 400 - 275}px`,
        duration: Math.random() * 35 + 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      backgroundAnimations.push(particleAnim);
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
        filter: blur(1px);
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }
  
  // TEAM MODAL SYSTEM
  function initTeamModals() {
    const teamCards = document.querySelectorAll('.team-card');
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
    const modalBackdrop = document.querySelector('.member-modal-backdrop');
    const modal = document.querySelector('.member-modal');
    const closeBtn = document.querySelector('.close-member-modal');
    
    if (!modalBackdrop || !modal) {
      console.log('Team modal elements not found');
      return;
    }
    
    // Track modal state to prevent multiple opens
    let isModalOpen = false;
    
    // Team member data
    const teamData = {
      sebastian: {
        name: 'Sebastian Aguiar Køster',
        role: 'Developer & Builder',
        image: 'img/profile-pic.png',
        linkedin: 'https://www.linkedin.com/in/sebastian-køster-34802524b/',
        instagram: 'https://www.instagram.com/kosterkoster_/',
        bio: `
          <p>Sebastian is the technical backbone of Kind of Whimsical Games, bringing skills of programming expertise and a passion for elegant code architecture to every project. His journey into game development began with a love for solving complex problems, webdevelopment and creating interactive experiences that players can truly connect with.</p>
          
          <p>With a understanding of multiple programming languages and game engines, Sebastian transforms creative concepts into playable realities. He believes that great code is like great art - it should be both functional and beautiful, efficient yet expressive.</p>
          
          <p>When he's not coding, Sebastian enjoys exploring new technologies, contributing to projects, and finding inspiration in the intersection of technology and creativity through music production and other artforms. His approach to development is methodical yet innovative, always seeking the most elegant solution to complex challenges.</p>
        `,
        skills: [
          'Unity & Unreal Engine',
          'C# & C++ Programming',
          'Game Systems Architecture',
          'Performance Optimization',
          'Cross-Platform Development',
          'Version Control & DevOps',
          'UI/UX Implementation',
          'Database Design',
          'API Development',
          'Technical Problem Solving'
        ],
        projects: [
          {
            name: 'Retenta - Core Systems',
            description: 'Developing the card game mechanics, memory system architecture, and multiplayer networking infrastructure.'
          },
          {
            name: 'Project DCP - Engine Development',
            description: 'Building the procedural generation systems and character progression mechanics for the adventure RPG.'
          },
          {
            name: 'Project Brothers - Investigation Framework',
            description: 'Creating the non-linear investigation system and reality-bending puzzle mechanics.'
          },
          {
            name: 'Studio Tools & Pipeline',
            description: 'Developing internal tools for asset management, build automation, and team collaboration workflows.'
          }
        ],
        facts: [
          'Started programming at age 26 with a simple 3D-based adventure game',
          'He made this website in a single week as a personal challenge',
          'Can debug code in his sleep (literally has solved problems in dreams)',
          'Has a collection of programming books, including first editions of classic computer science texts',
          'Build his first PC at age 12, which sparked his interest in technology',
          'Believes the best code is the code you don\'t have to write',
          'Enjoys creating music in his free time, often using it as inspiration for game soundtracks'
        ]
      },
      julie: {
        name: 'Julie Hindkjær',
        role: 'Writer & Concept Artist',
        image: 'img/Julie-Hindkjaer-1-jpg.webp',
        linkedin: 'https://www.linkedin.com/in/juliehindkjaer/?originalSubdomain=dk',
        instagram: 'https://www.instagram.com/julespoe/',
        bio: `
          <p>Julie is the creative heart of Kind of Whimsical Games, weaving stories and crafting visuals that bring emotional depth to every project. Her background in literature and visual arts creates a unique perspective that bridges narrative and aesthetic design, ensuring that every game tells a compelling story through both words and imagery.</p>
          
          <p>With an eye for detail and a passion for character-driven narratives, Julie develops the conceptual foundation that gives each game its distinctive personality. She believes that the best games are those that stay with you long after you've stopped playing - not just for their mechanics, but for the emotions they evoke and the stories they tell.</p>
          
          <p>Her creative process involves deep research into human psychology, mythology, and contemporary storytelling techniques. Julie approaches each project as an opportunity to explore new ways of connecting with players on an emotional level, creating experiences that are both universally relatable and uniquely memorable.</p>
        `,
        skills: [
          'Creative Writing & Storytelling',
          'Character Development',
          'Concept Art & Illustration',
          'Narrative Design',
          'World Building',
          'Dialogue Systems',
          'Visual Storytelling',
          'Art Direction',
          'User Experience Design',
          'Cultural Research & Analysis'
        ],
        projects: [
          {
            name: 'Retenta - Narrative Design',
            description: 'Crafting the memory-based storylines, character backstories, and the overarching mystery that drives player engagement.'
          },
          {
            name: 'Project Brothers - Story & Characters',
            description: 'Developing the mature narrative themes, character relationships, and the psychological elements of the detective story.'
          },
          {
            name: 'Project DCP - World Building',
            description: 'Creating the dark fantasy setting, environmental storytelling elements, and the progressive narrative structure.'
          },
          {
            name: 'Studio Branding & Art Direction',
            description: 'Establishing the visual identity of KOWG and ensuring consistent artistic vision across all projects.'
          }
        ],
        facts: [
          'Has filled over 20 notebooks with story ideas, character sketches, and world-building notes',
          'Once wrote a 50,000-word novella in a single month during NaNoWriMo',
          'Can create compelling characters in under 10 minutes using only three random words',
          'Believes every good story starts with a "what if" question',
          'Has a master\'s degree in Creative Writing with a focus on interactive narratives',
          'Finds inspiration in everything from ancient mythology to modern psychology'
        ]
      }
    };
    
    // Reset modal content completely
    function resetModalContent() {
      console.log('Resetting modal content...');
      
      // Reset text content to defaults
      const nameEl = document.getElementById('modal-member-name');
      const roleEl = document.getElementById('modal-member-role');
      const imageEl = document.getElementById('modal-member-image');
      const bioEl = document.getElementById('modal-member-bio');
      const linkedinEl = document.getElementById('modal-linkedin');
      const instagramEl = document.getElementById('modal-instagram');
      
      if (nameEl) nameEl.textContent = 'Team Member';
      if (roleEl) roleEl.textContent = 'Role';
      if (imageEl) imageEl.src = '';
      if (bioEl) bioEl.innerHTML = '<p>Member biography will appear here...</p>';
      if (linkedinEl) linkedinEl.href = '#';
      if (instagramEl) instagramEl.href = '#';
      
      // Clear all dynamic lists
      const skillsList = document.getElementById('modal-member-skills');
      const projectsList = document.getElementById('modal-member-projects');
      const factsList = document.getElementById('modal-member-facts');
      
      if (skillsList) skillsList.innerHTML = '';
      if (projectsList) projectsList.innerHTML = '';
      if (factsList) factsList.innerHTML = '';
      
      // CRITICAL: Reset GSAP properties to initial hidden state
      gsap.set('.modal-header', { autoAlpha: 0, y: 30 });
      gsap.set('.modal-section', { autoAlpha: 0, y: 20 });
      
      console.log('Modal content reset complete');
    }
    
    // Open modal with proper reset and animation
    function openTeamModal(memberId) {
      const member = teamData[memberId];
      if (!member || isModalOpen) {
        console.log('Modal blocked - member not found or already open');
        return;
      }
      
      console.log('Opening modal for:', member.name);
      isModalOpen = true;
      
      // Step 1: Always reset first
      resetModalContent();
      
      // Step 2: Populate with new content
      const nameEl = document.getElementById('modal-member-name');
      const roleEl = document.getElementById('modal-member-role');
      const imageEl = document.getElementById('modal-member-image');
      const bioEl = document.getElementById('modal-member-bio');
      const linkedinEl = document.getElementById('modal-linkedin');
      const instagramEl = document.getElementById('modal-instagram');
      
      if (nameEl) nameEl.textContent = member.name;
      if (roleEl) roleEl.textContent = member.role;
      if (imageEl) imageEl.src = member.image;
      if (bioEl) bioEl.innerHTML = member.bio;
      if (linkedinEl) linkedinEl.href = member.linkedin;
      if (instagramEl) instagramEl.href = member.instagram;
      
      // Populate skills
      const skillsList = document.getElementById('modal-member-skills');
      if (skillsList) {
        skillsList.innerHTML = '';
        member.skills.forEach(skill => {
          const skillDiv = document.createElement('div');
          skillDiv.className = 'skill-item';
          skillDiv.textContent = skill;
          skillsList.appendChild(skillDiv);
        });
      }
      
      // Populate projects
      const projectsList = document.getElementById('modal-member-projects');
      if (projectsList) {
        projectsList.innerHTML = '';
        member.projects.forEach(project => {
          const projectDiv = document.createElement('div');
          projectDiv.className = 'project-item';
          projectDiv.innerHTML = `
            <div class="project-name">${project.name}</div>
            <div class="project-description">${project.description}</div>
          `;
          projectsList.appendChild(projectDiv);
        });
      }
      
      // Populate fun facts
      const factsList = document.getElementById('modal-member-facts');
      if (factsList) {
        factsList.innerHTML = '';
        member.facts.forEach(fact => {
          const factDiv = document.createElement('div');
          factDiv.className = 'fact-item';
          factDiv.textContent = fact;
          factsList.appendChild(factDiv);
        });
      }
      
      // Step 3: Show modal backdrop
      modalBackdrop.classList.add('active');
      
      // Step 4: Animate in with fresh timeline
      const openTimeline = gsap.timeline();
      
      openTimeline
        .to('.modal-header', {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
        .to('.modal-section', {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }, '-=0.3');
      
      console.log('Modal animation started for:', member.name);
    }
    
    // Close modal with proper cleanup
    function closeTeamModal() {
      if (!isModalOpen) {
        console.log('Modal close blocked - not open');
        return;
      }
      
      console.log('Closing team modal');
      
      // Close animation with complete cleanup
      const closeTimeline = gsap.timeline({
        onComplete: () => {
          modalBackdrop.classList.remove('active');
          resetModalContent();
          isModalOpen = false;
          console.log('Modal completely closed and reset');
        }
      });
      
      closeTimeline
        .to('.modal-section', {
          autoAlpha: 0,
          y: -15,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        })
        .to('.modal-header', {
          autoAlpha: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in'
        }, '-=0.2');
    }
    
    // Event listeners for Learn More buttons
    learnMoreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const memberId = btn.getAttribute('data-member');
        console.log('Learn More clicked for:', memberId);
        
        if (memberId) {
          openTeamModal(memberId);
        }
      });
    });
    
    // Event listeners for team cards
    teamCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on learn more button
        if (e.target.closest('.learn-more-btn')) return;
        
        const memberId = card.getAttribute('data-member');
        console.log('Team card clicked for:', memberId);
        
        if (memberId) {
          openTeamModal(memberId);
        }
      });
    });
    
    // Close modal listeners
    if (closeBtn) {
      closeBtn.addEventListener('click', closeTeamModal);
    }
    
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeTeamModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeTeamModal();
      }
    });
    
    console.log('Team modals initialized successfully');
  }
  
  // Page transition functionality
  function initPageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const pageTransitionLinks = document.querySelectorAll('.page-transition');
    
    if (!transitionOverlay) return;
    
    pageTransitionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
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
  
  // Add subtle hover effects to team cards
  function initCardInteractions() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
  
  // Initialize card interactions
  initCardInteractions();
  
  // Add parallax effect to value cards
  function initValueCardsParallax() {
    const valueCards = document.querySelectorAll('.value-card');
    
    if (valueCards.length > 0) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        valueCards.forEach((card, index) => {
          const cardRate = rate + (index * 15);
          gsap.set(card, {
            transform: `translate3d(0, ${cardRate}px, 0)`
          });
        });
      });
    }
  }
  
  // Initialize value cards parallax
  initValueCardsParallax();
  
  // Add staggered animation for philosophy text on scroll
  function initPhilosophyAnimation() {
    const philosophyText = document.querySelector('.philosophy-text');
    const philosophyParagraphs = document.querySelectorAll('.philosophy-text p');
    
    if (philosophyText && philosophyParagraphs.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.from(philosophyParagraphs, {
              y: 20,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out'
            });
            
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(philosophyText);
    }
  }
  
  // Initialize philosophy animation
  initPhilosophyAnimation();
  
  // Pause animations when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      backgroundAnimations.forEach(anim => {
        if (anim && anim.pause) anim.pause();
      });
    } else {
      backgroundAnimations.forEach(anim => {
        if (anim && anim.resume) anim.resume();
      });
    }
  });
});