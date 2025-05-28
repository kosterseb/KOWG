// Complete Hidden Feature System with WORKING Explosion Effect
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

canvas.width = 100;   
canvas.height = 100;  

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let numberOfParticles = 100;
let colors = ['rgb(255 227 126 / 100%)', 'rgb(255 227 126 / 75%)', 'rgb(255 227 126 / 50%)', 'rgb(255 227 126 / 25%)'];
let eases = ['Power0.easeOut', 'Power2.easeOut', 'Power3.easeOut'];
let particles = [];

// Main loop control flag - THIS IS THE KEY FIX!
let mainLoopActive = true;

// Hidden Feature Variables
let discoveryLevel = 0;
let maxDiscoveryLevel = 3;
let hoverStartTime = null;
let particleIntensity = 1;
let isMouseOver = false;
let circularMotionDetected = false;

// Enhanced colors for discovery phases
const discoveryColors = [
  // Normal state
  ['rgb(255 227 126 / 100%)', 'rgb(255 227 126 / 75%)', 'rgb(255 227 126 / 50%)', 'rgb(255 227 126 / 25%)'],
  // Discovery level 1 - More vibrant
  ['rgb(241 196 15 / 100%)', 'rgb(255 227 126 / 80%)', 'rgb(26 188 156 / 60%)', 'rgb(255 255 255 / 40%)'],
  // Discovery level 2 - Magical mix
  ['rgb(241 196 15 / 100%)', 'rgb(26 188 156 / 100%)', 'rgb(255 255 255 / 80%)', 'rgb(241 196 15 / 60%)'],
  // Discovery level 3 - Full power
  ['rgb(241 196 15 / 100%)', 'rgb(26 188 156 / 100%)', 'rgb(255 255 255 / 100%)', 'rgb(52 152 219 / 80%)']
];

// Mouse tracking for circular motion detection
let mouseHistory = [];

// Get the logo wrapper - this is our interaction layer
const logoWrapper = document.querySelector('.logo-wrapper');

console.log('Logo wrapper found:', logoWrapper ? 'Yes' : 'No');

// Event listeners on logo wrapper
logoWrapper.addEventListener("mouseenter", function(event) {
  console.log('Mouse entered logo wrapper');
  isMouseOver = true;
  startDiscoverySequence();
});

logoWrapper.addEventListener("mouseleave", function(event) {
  console.log('Mouse left logo wrapper');
  isMouseOver = false;
  resetDiscoverySequence();
});

logoWrapper.addEventListener("mousemove", function(event) {
  if (!isMouseOver) return;
  
  // Convert mouse coordinates from wrapper space to canvas space
  const rect = logoWrapper.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  
  // Scale coordinates to canvas size
  x = (x / rect.width) * canvasWidth;
  y = (y / rect.height) * canvasHeight;
  
  console.log(`Mouse at wrapper: ${event.clientX - rect.left}, ${event.clientY - rect.top} → canvas: ${x}, ${y}`);
  
  // Track mouse movement for circular motion detection
  trackMouseMovement(x, y);
  
  // Create particles with current intensity
  createParticles(x, y);
  
  // Check for circular motion to advance discovery
  detectCircularMotion();
});

// Click handler on logo wrapper
logoWrapper.addEventListener("click", function(event) {
  console.log(`Click detected - Discovery level: ${discoveryLevel}/${maxDiscoveryLevel}`);
  if (discoveryLevel >= maxDiscoveryLevel) {
    activateHiddenGame();
  }
});

// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xEnd = random(0, canvasWidth);
    this.yEnd = random(0, canvasHeight);
    this.color = colors[randomInt(0, colors.length - 1)];
    this.radius = random(6, 10 * particleIntensity);
    this.delay = random(0, 2 / particleIntensity);
    this.ease = eases[randomInt(0, eases.length - 1)];
    this.alpha = random(0.5, 1);
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();    
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Add glow effect for higher discovery levels
    if (discoveryLevel >= 2) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10 + (discoveryLevel * 5);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.globalAlpha = 1;
  }
}

function anime(p) {
  let tl = gsap.timeline()
            .to(p, {
                x: p.xEnd,
                y: p.yEnd,
                delay: p.delay,
                radius: 0,
                duration: 2 / particleIntensity,
                ease: p.ease,
                repeat: -1
            });
}

function createParticles(x, y) {
  // Clear old particles if we have too many
  if (particles.length > numberOfParticles * 2) {
    particles = particles.slice(-numberOfParticles);
  }
  
  let particlesToCreate = Math.floor(numberOfParticles * particleIntensity / 10);
  
  for (let i = 0; i < particlesToCreate; i++) { 
    let particle = new Particle(x, y);
    particles.push(particle);
    anime(particle);
  }
}

// Discovery sequence functions
function startDiscoverySequence() {
  hoverStartTime = Date.now();
  console.log('Discovery sequence started');
  
  // Progressive discovery timer
  setTimeout(() => {
    if (isMouseOver && hoverStartTime && (Date.now() - hoverStartTime) > 2000) {
      console.log('Auto-advancing discovery after 2 seconds');
      advanceDiscovery();
    }
  }, 2000);
  
  // Show subtle visual feedback
  updateLogoAppearance();
}

function advanceDiscovery() {
  if (discoveryLevel < maxDiscoveryLevel) {
    discoveryLevel++;
    console.log(`Discovery advanced to level ${discoveryLevel}`);
    
    // Update particle system
    colors = discoveryColors[discoveryLevel];
    particleIntensity = 1 + (discoveryLevel * 0.5);
    numberOfParticles = 100 + (discoveryLevel * 50);
    
    // Update visual feedback
    updateLogoAppearance();
    showDiscoveryMessage();
    
    // Activate floating image hints at level 2
    if (discoveryLevel === 2) {
      activateFloatingImageHints();
    }
  }
}

function resetDiscoverySequence() {
  console.log('Resetting discovery sequence');
  
  // Always reset everything
  discoveryLevel = 0;
  particleIntensity = 1;
  numberOfParticles = 100;
  colors = discoveryColors[0];
  
  hoverStartTime = null;
  mouseHistory = [];
  circularMotionDetected = false;
  
  updateLogoAppearance();
  
  // NEW: Also reset main logo glow when sequence resets
  updateMainLogoGlow();
}

function trackMouseMovement(x, y) {
  const currentTime = Date.now();
  
  mouseHistory.push({
    x: x,
    y: y,
    time: currentTime
  });
  
  // Keep only recent history (last 2 seconds)
  mouseHistory = mouseHistory.filter(point => currentTime - point.time < 2000);
}

// Circular motion detection
function detectCircularMotion() {
  if (mouseHistory.length < 8) return;
  
  console.log(`Checking circular motion with ${mouseHistory.length} points`);
  
  // Use more recent points for better detection
  const recentPoints = mouseHistory.slice(-6);
  let angles = [];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  for (let point of recentPoints) {
    const angle = Math.atan2(point.y - centerY, point.x - centerX);
    angles.push(angle);
  }
  
  // Check if we've made a circular motion
  let totalRotation = 0;
  for (let i = 1; i < angles.length; i++) {
    let diff = angles[i] - angles[i-1];
    // Normalize the angle difference
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    totalRotation += diff;
  }
  
  console.log(`Total rotation: ${totalRotation.toFixed(2)} (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
  
  // Lower threshold for easier detection (60 degrees)
  const threshold = Math.PI / 3;
  
  if (Math.abs(totalRotation) > threshold && !circularMotionDetected) {
    circularMotionDetected = true;
    console.log('🎉 Circular motion detected!');
    
    if (discoveryLevel >= 1) {
      advanceDiscovery();
    }
    
    // Reset circular motion detection after a delay
    setTimeout(() => {
      circularMotionDetected = false;
      console.log('Circular motion detection reset');
    }, 1000);
  }
}

function updateLogoAppearance() {
  if (!logoWrapper) return;
  
  // Remove existing discovery classes
  logoWrapper.className = logoWrapper.className.replace(/discovery-level-\d+/g, '');
  
  // Add current discovery level class
  if (discoveryLevel > 0) {
    logoWrapper.classList.add(`discovery-level-${discoveryLevel}`);
  }
  
  // Update cursor style
  if (discoveryLevel >= maxDiscoveryLevel) {
    logoWrapper.style.cursor = 'pointer';
  } else {
    logoWrapper.style.cursor = 'default';
  }
  
  // NEW: Apply main logo glow effects based on discovery level
  updateMainLogoGlow();
}

// NEW: Main logo glow effect function - LIGHTWEIGHT VERSION
function updateMainLogoGlow() {
  const logoSvg = document.querySelector('.logo-svg');
  const logoSvg2 = document.querySelector('.logo-svg2');
  
  if (!logoSvg || !logoSvg2) return;
  
  // Remove existing glow classes
  logoSvg.classList.remove('main-logo-glow-level-3');
  logoSvg2.classList.remove('main-logo-glow-level-3');
  
  // Apply LIGHTWEIGHT glow effects ONLY at level 3
  if (discoveryLevel >= 3) {
    // Level 3: Both logos get subtle glow - much more performance friendly
    logoSvg.classList.add('main-logo-glow-level-3');
    logoSvg2.classList.add('main-logo-glow-level-3');
    console.log('💫 Main logos activated with lightweight glow - ready for the secret!');
  }
}

function showDiscoveryMessage() {
  const messages = [
    '',
    'Something magical is stirring...',
    'The power grows stronger...',
    'Click to unlock the secret!'
  ];
  
  // Create or update hint element
  let hint = document.querySelector('.discovery-hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'discovery-hint';
    logoWrapper.appendChild(hint);
  }
  
  hint.textContent = messages[discoveryLevel];
  hint.style.opacity = discoveryLevel > 0 ? '1' : '0';
}

function activateFloatingImageHints() {
  const floatingImages = document.querySelectorAll('.floating-image');
  let index = 0;
  
  const activateNext = () => {
    if (index < floatingImages.length) {
      floatingImages[index].classList.add('hint-active');
      index++;
      setTimeout(activateNext, 300);
    }
  };
  
  setTimeout(activateNext, 500);
}

// FIXED: Portal Activation with Working Explosion Effect
function activateHiddenGame() {
  console.log('🎉 Activating hidden game portal with explosion!');
  
  // STEP 1: Stop main animation loop completely
  console.log('🛑 Stopping main particle loop completely');
  mainLoopActive = false; // Set flag first
  gsap.ticker.remove(particleAnimationLoop); // Then remove from ticker
  
  // STEP 2: Clear canvas and particles
  particles = []; // Clear particle array
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // STEP 3: Wait a frame to ensure main loop has stopped, then start explosion
  requestAnimationFrame(() => {
    console.log('🚀 Starting explosion after main loop stop');
    createCleanExplosionEffect();
  });
  
  // STEP 4: Clean up other effects while explosion runs
  setTimeout(() => {
    cleanupDiscoveryEffects();
  }, 500);
  
  // STEP 5: Show portal after explosion completes
  setTimeout(() => {
    showGamePortal();
  }, 2000); // Give explosion more time
}

// Clean explosion function - THE MAIN FIX!
function createCleanExplosionEffect() {
  console.log('💥 Starting CLEAN explosion effect');
  
  const explosionParticles = [];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Create explosion particles in waves
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20 + (wave * 0.3);
        const speed = 40 + (wave * 20) + Math.random() * 30;
        
        const particle = {
          x: centerX + (Math.random() - 0.5) * 20,
          y: centerY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 3 + Math.random() * 4 + wave,
          color: ['#f1c40f', '#1abc9c', '#ffffff', '#3498db', '#e74c3c'][Math.floor(Math.random() * 5)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          gravity: wave > 0 ? 0.5 + wave : 0
        };
        explosionParticles.push(particle);
      }
      console.log(`Wave ${wave + 1} created, total particles: ${explosionParticles.length}`);
    }, wave * 150);
  }
  
  let explosionFrameCount = 0;
  
  function animateCleanExplosion() {
    explosionFrameCount++;
    
    // Ensure main loop is still stopped
    if (mainLoopActive) {
      console.log('⚠️ Main loop reactivated during explosion - stopping it again');
      mainLoopActive = false;
      gsap.ticker.remove(particleAnimationLoop);
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw explosion particles
    for (let i = explosionParticles.length - 1; i >= 0; i--) {
      const p = explosionParticles[i];
      
      // Update position
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      
      // Apply gravity
      if (p.gravity > 0) {
        p.vy += p.gravity;
      }
      
      // Air resistance
      p.vx *= 0.995;
      p.vy *= 0.995;
      
      // Fade out
      p.alpha -= p.decay;
      
      // Draw particle
      if (p.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        // Glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        
        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Bright center
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        ctx.restore();
      }
      
      // Remove dead particles
      if (p.alpha <= 0) {
        explosionParticles.splice(i, 1);
      }
    }
    
    // Continue animation
    if (explosionParticles.length > 0 && explosionFrameCount < 300) {
      requestAnimationFrame(animateCleanExplosion);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log('💥 Clean explosion completed');
    }
  }
  
  // Start the clean explosion
  animateCleanExplosion();
}

// Clean up discovery effects (not particles)
function cleanupDiscoveryEffects() {
  console.log('🧹 Cleaning up discovery effects');
  
  // Clear all normal particles (but don't interfere with explosion)
  particles = [];
  
  // Reset discovery level and visual effects
  discoveryLevel = 0;
  updateLogoAppearance();
  
  // Clear discovery hint
  const hint = document.querySelector('.discovery-hint');
  if (hint) {
    hint.style.opacity = '0';
  }
  
  // Clear floating image hints
  const floatingImages = document.querySelectorAll('.floating-image');
  floatingImages.forEach(img => {
    img.classList.remove('hint-active');
  });
  
  console.log('✅ Discovery effects cleaned up');
}

// Show game portal
function showGamePortal() {
  console.log('🌀 Opening game portal');
  
  // Create epic portal overlay - keep CSS class for animations!
  const portalOverlay = document.createElement('div');
  portalOverlay.className = 'game-portal-overlay';
  
  // Add ONLY the positioning fix, don't override other styles
  portalOverlay.style.position = 'fixed';
  portalOverlay.style.top = '0';
  portalOverlay.style.left = '0';
  portalOverlay.style.width = '100vw';
  portalOverlay.style.height = '100vh';
  
  portalOverlay.innerHTML = `
    <div class="portal-content">
      <div class="portal-logo">
        <img src="img/Katten.png" alt="Secret Portal">
      </div>
      <h2>🎮 Secret Discovered! 🎮</h2>
      <p>You've unlocked the hidden realm of KOWG!</p>
      <p>Prepare for a whimsical adventure...</p>
      <div class="portal-buttons">
        <button class="enter-game-btn">Enter the Game</button>
        <button class="close-portal-btn">Maybe Later</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(portalOverlay);
  
  // Handle portal interactions
  
  portalOverlay.querySelector('.enter-game-btn').addEventListener('click', () => {
    window.location.href = 'chunko-game/index.html';
  });
  
  portalOverlay.querySelector('.close-portal-btn').addEventListener('click', () => {
    closePortal(portalOverlay);
  });
  
  // Animate portal entrance with extra dramatic effect
  gsap.fromTo(portalOverlay, 
    { opacity: 0, scale: 0, rotation: 180 },
    { 
      opacity: 1, 
      scale: 1, 
      rotation: 0,
      duration: 1.2, 
      ease: "back.out(1.7)" 
    }
  );
}

// Close portal with restart
function closePortal(portalOverlay) {
  gsap.to(portalOverlay, {
    opacity: 0,
    scale: 0,
    rotation: -180,
    duration: 0.8,
    ease: "back.in(1.7)",
    onComplete: () => {
      if (portalOverlay.parentNode) {
        document.body.removeChild(portalOverlay);
      }
      // Restart the system when portal closes
      restartHiddenFeatureSystem();
    }
  });
}

// UPDATED: Restart system with proper loop control
function restartHiddenFeatureSystem() {
  console.log('🔄 Restarting hidden feature system');
  
  // Reset all variables
  discoveryLevel = 0;
  particleIntensity = 1;
  numberOfParticles = 100;
  colors = discoveryColors[0];
  isMouseOver = false;
  circularMotionDetected = false;
  hoverStartTime = null;
  mouseHistory = [];
  
  // Clear visual effects
  updateLogoAppearance();
  
  // Restart particle system
  particles = [];
  createParticles(canvas.width / 2, canvas.height / 2);
  
  // Restart main animation loop - THE KEY FIX!
  mainLoopActive = true; // Re-enable main loop
  gsap.ticker.add(particleAnimationLoop);
  
  console.log('✅ Hidden feature system restarted');
}

// UPDATED: Main animation loop with flag control
function particleAnimationLoop() {
  // Check if main loop should run - THIS IS THE KEY FIX!
  if (!mainLoopActive) {
    console.log('🛑 Main loop stopped by flag');
    return; // Exit immediately if stopped
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    if (particles[i]) {
      particles[i].draw(ctx);
    }
  }
}

// Initialize particles at center
createParticles(canvasWidth / 2, canvasHeight / 2);

// Main animation loop
gsap.ticker.add(particleAnimationLoop);

// Utility functions
function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Debug info
console.log('🎯 Fixed explosion system loaded with proper loop control');
console.log('Hidden feature system initialized with logo wrapper events');
console.log('Canvas size:', canvasWidth, 'x', canvasHeight);
console.log('Logo wrapper size:', logoWrapper?.getBoundingClientRect());