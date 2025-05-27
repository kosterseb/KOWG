// Complete Hidden Feature System with Working Explosion Effect
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

canvas.width = 100;   // Changed from 200 to 100
canvas.height = 100;  // Changed from 200 to 100

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let numberOfParticles = 100;
let colors = ['rgb(255 227 126 / 100%)', 'rgb(255 227 126 / 75%)', 'rgb(255 227 126 / 50%)', 'rgb(255 227 126 / 25%)'];
let eases = ['Power0.easeOut', 'Power2.easeOut', 'Power3.easeOut'];
let particles = [];

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

// FIXED: Enhanced Portal Activation with Working Explosion Effect
function activateHiddenGame() {
  console.log('🎉 Activating hidden game portal with explosion!');
  
  // STEP 1: Stop main animation loop IMMEDIATELY (before explosion)
  console.log('🛑 Stopping main particle loop for explosion');
  gsap.ticker.remove(particleAnimationLoop);
  
  // STEP 2: Create explosion effect immediately (now it has canvas control)
  createExplosionEffect();
  
  // STEP 3: Clean up other effects while explosion runs
  setTimeout(() => {
    cleanupDiscoveryEffects();
  }, 500); // Clean up halfway through explosion
  
  // STEP 4: Show portal after explosion completes
  setTimeout(() => {
    showGamePortal();
  }, 1500); // Give explosion more time to complete
}

// Create explosion effect
function createExplosionEffect() {
  console.log('💥 Starting explosion effect - main loop stopped');
  
  // Create explosion particles
  const explosionParticles = [];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Create burst of explosion particles
  for (let i = 0; i < 50; i++) {
    const angle = (Math.PI * 2 * i) / 50;
    const speed = random(50, 150);
    const particle = {
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: random(3, 8),
      color: ['#f1c40f', '#1abc9c', '#ffffff', '#3498db'][randomInt(0, 3)],
      alpha: 1,
      decay: random(0.02, 0.05)
    };
    explosionParticles.push(particle);
  }
  
  // Add some extra sparkle particles
  for (let i = 0; i < 30; i++) {
    const angle = random(0, Math.PI * 2);
    const speed = random(20, 80);
    const particle = {
      x: centerX + random(-20, 20),
      y: centerY + random(-20, 20),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: random(1, 3),
      color: '#ffffff',
      alpha: 1,
      decay: random(0.03, 0.06)
    };
    explosionParticles.push(particle);
  }
  
  console.log(`💥 Created ${explosionParticles.length} explosion particles`);
  
  // Explosion animation loop (now has exclusive canvas control)
  function animateExplosion() {
    // Clear canvas (no competition from main loop!)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw explosion particles
    for (let i = explosionParticles.length - 1; i >= 0; i--) {
      const p = explosionParticles[i];
      
      // Update position
      p.x += p.vx * 0.016; // 60fps timing
      p.y += p.vy * 0.016;
      
      // Add gravity to some particles
      if (p.radius > 2) {
        p.vy += 2; // Gravity effect
      }
      
      // Fade out
      p.alpha -= p.decay;
      
      // Draw particle with glow
      ctx.save();
      ctx.globalAlpha = p.alpha;
      
      // Glow effect
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      ctx.restore();
      
      // Remove dead particles
      if (p.alpha <= 0) {
        explosionParticles.splice(i, 1);
      }
    }
    
    // Continue animation if particles exist
    if (explosionParticles.length > 0) {
      requestAnimationFrame(animateExplosion);
    } else {
      // Clear canvas when explosion is done
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log('💥 Explosion effect completed - canvas cleared');
    }
  }
  
  // Start explosion animation (now it won't be interrupted!)
  animateExplosion();
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
  
  // Create epic portal overlay
  const portalOverlay = document.createElement('div');
  portalOverlay.className = 'game-portal-overlay';
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
    alert('🎉 Game coming soon! We\'ll build this together next!');
    closePortal(portalOverlay);
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

// Restart system
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
  
  // Restart main animation loop
  gsap.ticker.add(particleAnimationLoop);
  
  console.log('✅ Hidden feature system restarted');
}

// Named function for particle animation loop so we can control it
function particleAnimationLoop() {
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
console.log('Hidden feature system initialized with logo wrapper events');
console.log('Canvas size:', canvasWidth, 'x', canvasHeight);
console.log('Logo wrapper size:', logoWrapper?.getBoundingClientRect());