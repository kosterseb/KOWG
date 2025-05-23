// Contact Page JavaScript
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
                initContactForm();
                initFAQSystem();
            }, 300);
        }
    });

    loadingTimeline
        .set('.background-pattern', { autoAlpha: 1 })
        .to({}, { duration: 0.5 }) // Brief pause for particles
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
        .from('.contact-hero', {
            duration: 1,
            y: 50,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.contact-form-container', {
            duration: 0.8,
            x: -50,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.contact-info', {
            duration: 0.8,
            x: 50,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.6')
        .from('.faq-section', {
            duration: 0.8,
            y: 30,
            autoAlpha: 0,
            ease: 'power2.out'
        }, '-=0.3');

    // Subtle particle system for contact page
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
            particle.style.opacity = Math.random() * 0.15 + 0.05;

            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;

            particleContainer.appendChild(particle);

            const particleAnim = gsap.to(particle, {
                x: `${Math.random() * 200 - 100}px`,
                y: `${Math.random() * 200 - 100}px`,
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

    // Contact Form System
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitButton = document.querySelector('.submit-button');
        const buttonText = document.querySelector('.button-text');
        const buttonLoader = document.querySelector('.button-loader');
        const successMessage = document.getElementById('successMessage');
        const resetButton = document.getElementById('resetFormButton');

        if (!form || !submitButton) {
            console.log('Contact form elements not found');
            return;
        }

        // Form validation rules
        const validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'-]+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'-]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true
            },
            message: {
                required: true,
                minLength: 10
            }
        };

        // Validation messages
        const validationMessages = {
            firstName: {
                required: 'First name is required',
                minLength: 'First name must be at least 2 characters',
                pattern: 'Please enter a valid first name'
            },
            lastName: {
                required: 'Last name is required',
                minLength: 'Last name must be at least 2 characters',
                pattern: 'Please enter a valid last name'
            },
            email: {
                required: 'Email address is required',
                pattern: 'Please enter a valid email address'
            },
            subject: {
                required: 'Please select a subject'
            },
            message: {
                required: 'Message is required',
                minLength: 'Message must be at least 10 characters'
            }
        };

        // Real-time validation
        function validateField(fieldName, value) {
            const rules = validationRules[fieldName];
            const messages = validationMessages[fieldName];

            if (rules.required && (!value || value.trim() === '')) {
                return messages.required;
            }

            if (rules.minLength && value.length < rules.minLength) {
                return messages.minLength;
            }

            if (rules.pattern && !rules.pattern.test(value)) {
                return messages.pattern;
            }

            return null;
        }

        // Show error for field
        function showFieldError(fieldName, message) {
            const errorElement = document.getElementById(`${fieldName}Error`);
            const inputElement = document.getElementById(fieldName);

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                
                gsap.fromTo(errorElement, 
                    { autoAlpha: 0, y: -10 },
                    { autoAlpha: 1, y: 0, duration: 0.3 }
                );
            }

            if (inputElement) {
                inputElement.style.borderColor = '#e74c3c';
                inputElement.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            }
        }

        // Clear error for field
        function clearFieldError(fieldName) {
            const errorElement = document.getElementById(`${fieldName}Error`);
            const inputElement = document.getElementById(fieldName);

            if (errorElement) {
                gsap.to(errorElement, {
                    autoAlpha: 0,
                    y: -10,
                    duration: 0.3,
                    onComplete: () => {
                        errorElement.style.display = 'none';
                        errorElement.textContent = '';
                    }
                });
            }

            if (inputElement) {
                inputElement.style.borderColor = '';
                inputElement.style.boxShadow = '';
            }
        }

        // Add real-time validation to form fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            
            if (field) {
                field.addEventListener('blur', () => {
                    const error = validateField(fieldName, field.value);
                    if (error) {
                        showFieldError(fieldName, error);
                    } else {
                        clearFieldError(fieldName);
                    }
                });

                field.addEventListener('input', () => {
                    // Clear error on input if field was previously invalid
                    const errorElement = document.getElementById(`${fieldName}Error`);
                    if (errorElement && errorElement.textContent) {
                        clearFieldError(fieldName);
                    }
                });
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let hasErrors = false;
            const formData = new FormData(form);
            
            Object.keys(validationRules).forEach(fieldName => {
                const value = formData.get(fieldName);
                const error = validateField(fieldName, value);
                
                if (error) {
                    showFieldError(fieldName, error);
                    hasErrors = true;
                } else {
                    clearFieldError(fieldName);
                }
            });

            if (hasErrors) {
                // Shake the form to indicate errors
                gsap.to(form, {
                    x: [-10, 10, -5, 5, 0],
                    duration: 0.5,
                    ease: 'power2.out'
                });
                return;
            }

            // Show loading state
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            submitButton.disabled = true;

            // Animate submit button
            gsap.to(submitButton, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Here you would typically send the form data to your server:
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     body: formData
                // });

                console.log('Form submitted successfully:', Object.fromEntries(formData));

                // Show success state
                showSuccessMessage();

            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error state
                buttonText.textContent = 'Error - Try Again';
                buttonText.style.color = '#e74c3c';
                
                setTimeout(() => {
                    buttonText.textContent = 'Send Message';
                    buttonText.style.color = '';
                    buttonText.style.display = 'inline-block';
                    buttonLoader.style.display = 'none';
                    submitButton.disabled = false;
                }, 3000);
            }
        });

        // Show success message
        function showSuccessMessage() {
            // Hide form and show success message
            gsap.timeline()
                .to('.contact-form', {
                    autoAlpha: 0,
                    scale: 0.95,
                    duration: 0.5,
                    ease: 'power2.in'
                })
                .set(successMessage, { display: 'flex' })
                .fromTo(successMessage,
                    { autoAlpha: 0, scale: 0.8 },
                    { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
                );

            // Animate success elements
            gsap.from('.success-icon', {
                scale: 0,
                rotation: -180,
                duration: 0.8,
                ease: 'back.out(1.4)',
                delay: 0.3
            });

            gsap.from('.success-message h3', {
                y: 20,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.5
            });

            gsap.from('.success-message p', {
                y: 20,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.7
            });

            gsap.from('.reset-form-button', {
                y: 20,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.9
            });
        }

        // Reset form functionality
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                gsap.timeline()
                    .to(successMessage, {
                        autoAlpha: 0,
                        scale: 0.8,
                        duration: 0.4,
                        ease: 'power2.in'
                    })
                    .set(successMessage, { display: 'none' })
                    .set('.contact-form', { display: 'block' })
                    .fromTo('.contact-form',
                        { autoAlpha: 0, scale: 0.95 },
                        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
                    );

                // Reset form state
                form.reset();
                buttonText.textContent = 'Send Message';
                buttonText.style.display = 'inline-block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;

                // Clear any remaining errors
                Object.keys(validationRules).forEach(fieldName => {
                    clearFieldError(fieldName);
                });
            });
        }

        console.log('Contact form initialized successfully');
    }

    // FAQ System
    function initFAQSystem() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            if (!question || !answer || !icon) return;

            // Set initial state
            gsap.set(answer, { height: 0, autoAlpha: 0 });

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        
                        gsap.to(otherAnswer, {
                            height: 0,
                            autoAlpha: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        });
                        
                        gsap.to(otherIcon, {
                            rotation: 0,
                            duration: 0.3,
                            ease: 'power2.inOut'
                        });
                        
                        otherItem.classList.remove('open');
                    }
                });

                // Toggle current item
                if (isOpen) {
                    // Close current item
                    gsap.to(answer, {
                        height: 0,
                        autoAlpha: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                    
                    gsap.to(icon, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                    
                    item.classList.remove('open');
                } else {
                    // Open current item
                    const answerHeight = answer.scrollHeight;
                    
                    gsap.to(answer, {
                        height: answerHeight,
                        autoAlpha: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(icon, {
                        rotation: 180,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                    
                    item.classList.add('open');
                }

                // Button hover effect
                gsap.to(question, {
                    scale: 0.98,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });

            // Hover effects
            question.addEventListener('mouseenter', () => {
                gsap.to(question, {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            question.addEventListener('mouseleave', () => {
                gsap.to(question, {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        console.log('FAQ system initialized successfully');
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

    // Add hover effects to contact info items
    function initContactInfoAnimations() {
        const detailItems = document.querySelectorAll('.detail-item');
        const socialLinks = document.querySelectorAll('.contact-social-link');

        detailItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    x: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(item.querySelector('.detail-icon'), {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(item.querySelector('.detail-icon'), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.05,
                    y: -2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Initialize contact info animations
    initContactInfoAnimations();

    // Staggered animation for form fields on scroll
    function initFormFieldAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        if (formGroups.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.from(formGroups, {
                            y: 20,
                            autoAlpha: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: 'power2.out'
                        });
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(document.querySelector('.contact-form'));
        }
    }

    // Initialize form field animations
    initFormFieldAnimations();

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