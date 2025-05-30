// Games Page JavaScript - COMPLETELY NEW APPROACH
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
                initGameModals();
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
        .from('.games-hero', {
            duration: 1,
            y: 50,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.game-card', {
            duration: 0.8,
            scale: 0.8,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'back.out(1.4)'
        }, '-=0.5')
        .from('.philosophy-section', {
            duration: 0.8,
            y: 30,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.3');

    // Particle system
    function createSubtleParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);

        const colors = ['#1abc9c', '#f1c40f', '#ecf0f1'];
        const particleCount = 25;

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
                y: `${Math.random() * 2300 - 150}px`,
                duration: Math.random() * 30 + 20,
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

    // BRAND NEW MODAL SYSTEM - SLIDE REVEAL APPROACH
    function initGameModals() {
        const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
        const modalBackdrop = document.querySelector('.game-modal-backdrop');
        const bookContainer = document.querySelector('.book-container');
        const bookCover = document.querySelector('.book-cover');
        const closeBtn = document.querySelector('.close-book-modal');

        if (!modalBackdrop || !bookContainer || !bookCover) {
            console.log('Game modal elements not found');
            return;
        }

        // Game data
        const gameData = {
            retenta: {
                title: 'Retenta',
                status: 'In Development',
                logo: 'img/Retentalogo.png',
                progress: 35,
                description: `
                    <p>A strategic card game where memories become power. In Retenta, players use their memory and strategically play cards representing fragments of forgotten experiences, building a narrative as they compete to recover what was lost.</p>
                    <p>Set in a world where memories can be extracted, stored, and traded, players must carefully manage their deck of memory cards to achieve victory while uncovering the deeper mystery of their character's past.</p>
                    <p>The game combines deck-building mechanics with narrative storytelling, creating a unique experience where each card played reveals more about your character's forgotten history.</p>
                `,
                features: [
                    'Based on the classic flip game',
                    'RPG-driven gameplay',
                    'Memory-based card system',
                    'Multiple character classes with unique abilities',
                    'Campaign and multiplayer modes',
                    'Hand-drawn artwork with unique character'
                ],
                gallery: [
                    'img/retentagame.png',
                    'img/retentagameplay.png',
                    'img/retenatagameplay2.png',
                    'img/Retentalong 1.png'
                ],
                updates: [
                    {
                        date: 'May 2025',
                        text: 'Character class system completed. Working on mechanics and testing gameplay flow.'
                    },
                    {
                        date: 'April 2025',
                        text: 'Core card mechanics under development. Beginning artwork production for memory fragments.'
                    },
                    {
                        date: 'March 2025',
                        text: 'Initial prototype under development. Getting feedback from playtesting sessions.'
                    }
                ]
            },
            brothers: {
                title: 'Project Brothers',
                status: 'Concept Phase',
                logo: 'img/detective.png',
                progress: 15,
                description: `
                    <p>Follow mysterious clues through a city where nothing is quite as it seems. Our detective game challenges players to think outside the box, piecing together a mystery where the laws of reality might bend but never break.</p>
                    <p>This mature narrative experience focuses on deep character development and moral choices that impact the story's direction. Players must navigate complex relationships while uncovering a conspiracy that threatens the fabric of reality itself.</p>
                    <p>The game features a unique investigation system where player intuition and logical deduction are equally important.</p>
                `,
                features: [
                    'Non-linear investigation system',
                    'Reality-bending puzzle mechanics',
                    'Mature storytelling with complex themes',
                    'Multiple story branches based on player choices',
                    'Character relationship dynamics',
                    'Atmospheric noir setting with supernatural elements'
                ],
                gallery: [
                    'img/brothersconceptart3.png',
                    'img/brothersconcptart.png',
                    'img/detective.png',
                    'img/brothersconceptart4.png',
                    'img/brothersconceptart5.png',
                    'img/brothersconceptart2.png'
                ],
                updates: [
                    {
                        date: 'May 2025',
                        text: 'Story outline being written. Character relationships and dialogue trees in development.'
                    },
                    {
                        date: 'April 2025',
                        text: 'Core narrative themes established. Beginning concept art for main characters.'
                    },
                    {
                        date: 'March 2025',
                        text: 'Initial concept phase. Exploring investigation mechanics and story structure.'
                    }
                ]
            },
            dcp: {
                title: 'Project DCP',
                status: 'Early Development',
                logo: 'img/projectdcpfront.png',
                progress: 10,
                description: `
                    <p>More than just an RPG - a journey through vibrant retro landscapes that change as you progress. Simple mechanics belie a deeper story that unfolds with each milestone reached.</p>
                    <p>Combining adventure RPG elements with dark fantasy themes, Project DCP offers both accessible gameplay and rich storytelling. The world reacts to player actions, creating a dynamic experience where no two playthroughs are identical.</p>
                    <p>Features a semi-hardcore experience with handcrafted story elements, creating the perfect balance between exploration and narrative. We want to implement a great retro nostalgic vibe to a modern take on the genre of RPG.</p>
                `,
                features: [
                    'Dynamic landscape generation',
                    'Progressive story revelation',
                    'Dark fantasy atmosphere with vibrant visuals',
                    'Character progression system',
                    'Multiple unlockable paths and secrets',
                    'Procedural events that respond to player choices'
                ],
                gallery: [
                    'img/projectdcpfront.png',
                    'img/projectdcpgame.png',
                    'img/projectdcpgame2.png',
                    'img/projectdcpgameplay.png'
                ],
                updates: [
                    {
                        date: 'May 2025',
                        text: 'Core gameplay mechanics refined. Working on procedural generation systems.'
                    },
                    {
                        date: 'April 2025',
                        text: 'Initial prototype showing promising results. Visual style guide completed.'
                    },
                    {
                        date: 'March 2025',
                        text: 'Project greenlit. Beginning development of core systems and art pipeline.'
                    }
                ],
                hasDemo: true
            }
        };

        // NEW: Simple and reliable book opening function
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

            // Populate development updates
            const updatesContainer = document.getElementById('modal-dev-updates');
            updatesContainer.innerHTML = '';
            game.updates.forEach(update => {
                const updateDiv = document.createElement('div');
                updateDiv.className = 'update-item';
                updateDiv.innerHTML = `
                    <div class="update-date">${update.date}</div>
                    <div class="update-text">${update.text}</div>
                `;
                updatesContainer.appendChild(updateDiv);
            });

            // Show/hide demo button
            const demoBtn = document.getElementById('modal-demo-btn');
            if (game.hasDemo) {
                demoBtn.style.display = 'inline-flex';
            } else {
                demoBtn.style.display = 'none';
            }

            // NEW ANIMATION: Simple slide reveal that actually works!
            const openTimeline = gsap.timeline();

            // Step 1: Show modal backdrop
            modalBackdrop.classList.add('active');

            // Step 2: Reset everything to initial state
            gsap.set(bookContainer, { 
                scale: 0.3, 
                autoAlpha: 0 
            });
            gsap.set(bookCover, { 
                x: 0 
            });
            gsap.set('.content-section', { 
                autoAlpha: 0, 
                y: 30 
            });

            openTimeline
                // Book appears and grows
                .to(bookContainer, {
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: 'back.out(1.4)'
                })
                
                // Pause to show closed book
                .to({}, { duration: 0.6 })
                
                // Cover slides away revealing content
                .to(bookCover, {
                    x: '-100%',
                    duration: 1.2,
                    ease: 'power3.out'
                })
                
                // Content sections fade in with stagger
                .to('.content-section', {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out'
                }, '-=0.4');

            console.log('Book modal opened successfully!');
        }

        // Close modal function
        function closeGameModal() {
            console.log('Closing game modal');

            const closeTimeline = gsap.timeline({
                onComplete: () => {
                    modalBackdrop.classList.remove('active');
                }
            });

            closeTimeline
                // Content sections fade out
                .to('.content-section', {
                    autoAlpha: 0,
                    y: -20,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.in'
                })
                
                // Cover slides back
                .to(bookCover, {
                    x: 0,
                    duration: 1,
                    ease: 'power3.in'
                }, '-=0.2')
                
                // Book shrinks and disappears
                .to(bookContainer, {
                    scale: 0.3,
                    autoAlpha: 0,
                    duration: 0.6,
                    ease: 'back.in(1.4)'
                }, '-=0.4');
        }

        // Event listeners
        learnMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const gameId = btn.getAttribute('data-game');
                if (gameId) {
                    openGameModal(gameId);
                }
            });
        });

        // Close modal listeners
        if (closeBtn) {
            closeBtn.addEventListener('click', closeGameModal);
        }

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeGameModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
                closeGameModal();
            }
        });

        // Action button handlers
        const actionButtons = document.querySelectorAll('.action-btn');
        
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Button animation
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(btn, {
                            scale: 1,
                            duration: 0.4,
                            ease: 'elastic.out(1, 0.3)'
                        });
                    }
                });

                // Handle different button types
                if (btn.classList.contains('wishlist-btn')) {
                    console.log('Added to wishlist!');
                    btn.textContent = 'Added!';
                    setTimeout(() => {
                        btn.textContent = 'Add to Wishlist';
                    }, 2000);
                } else if (btn.classList.contains('discord-btn')) {
                    window.open('https://discord.gg/your-server', '_blank');
                } else if (btn.classList.contains('demo-btn')) {
                    console.log('Opening demo...');
                    btn.textContent = 'Loading...';
                    setTimeout(() => {
                        btn.textContent = 'Play Demo';
                    }, 1500);
                }
            });
        });

        console.log('New slide-reveal modal system initialized!');
    }

    // Page transitions
    function initPageTransitions() {
        const transitionOverlay = document.querySelector('.page-transition-overlay');
        const pageTransitionLinks = document.querySelectorAll('.page-transition');

        if (!transitionOverlay) return;

        pageTransitionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                transitionOverlay.classList.add('active');

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
                        window.location.href = targetUrl;
                    }, null, '+=0.3');
            });
        });
    }

    // Card hover effects
    function initCardInteractions() {
        const gameCards = document.querySelectorAll('.game-card');

        gameCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Progress bar animations
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.style.width;

                    gsap.fromTo(progressBar,
                        { width: '0%' },
                        {
                            width: targetWidth,
                            duration: 1.5,
                            ease: 'power2.out',
                            delay: 0.3
                        }
                    );

                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Initialize everything
    initPageTransitions();
    initCardInteractions();
    initProgressBars();

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