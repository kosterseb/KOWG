// Chunko the Medieval Feline - Character Selection Menu
class ChunkoCharacterSelect {
    constructor() {
      this.selectedCharacter = 'knight'; // Default selection
      this.selectedDifficulty = 'knight'; // Default difficulty
      this.audioInitialized = false;
      this.initializeRadioEffects();
      this.initializeDifficultySelection();
      this.initializeStartButton();
      this.setupAudioSystem();
      this.playMenuMusic();
    }
  
    // Setup audio system (requires user interaction)
    setupAudioSystem() {
      const initAudio = () => {
        if (!this.audioInitialized) {
          try {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioInitialized = true;
            console.log('🔊 Audio system initialized!');
            this.playWelcomeSound();
          } catch (e) {
            console.log('Audio not supported in this browser');
          }
          
          // Remove the event listeners after first interaction
          document.removeEventListener('click', initAudio);
          document.removeEventListener('keydown', initAudio);
        }
      };
      
      // Initialize audio on first user interaction
      document.addEventListener('click', initAudio);
      document.addEventListener('keydown', initAudio);
    }
  
    playWelcomeSound() {
      console.log('🔊 *Welcome Fanfare* + *Royal Cat Purr*');
      this.playTone([329, 415, 523], 0.8); // Welcome chord
    }
  
    // Enhanced Radio Button Effects (based on your inspiration)
    initializeRadioEffects() {
      const radioBtnGroups = document.querySelectorAll('.radio-btn-group');
      this.previousRadioBtn = null;
  
      radioBtnGroups.forEach((group) => {
        const radioBtn = group.querySelector("input[type='radio']");
        
        radioBtn.addEventListener("change", () => {
          const nodes = this.getNodes(radioBtn);
          
          // Handle previous selection
          if (this.previousRadioBtn && this.previousRadioBtn !== radioBtn) {
            this.changeEffect(this.getNodes(this.previousRadioBtn), false);
          }
          
          // Activate current selection
          this.changeEffect(nodes, true);
          this.previousRadioBtn = radioBtn;
          
          // Update selected character
          this.selectedCharacter = radioBtn.value;
          this.playCharacterSelectSound(radioBtn.value);
          
          console.log(`🐱 Selected character: ${this.selectedCharacter}`);
        });
      });
  
      // Initialize first selection effect
      const firstRadio = document.querySelector('input[type="radio"]:checked');
      if (firstRadio) {
        this.changeEffect(this.getNodes(firstRadio), true);
        this.previousRadioBtn = firstRadio;
      }
    }
  
    getNodes(radioBtn) {
      const container = radioBtn.closest(".radio-btn-group");
      return [
        gsap.utils.shuffle(Array.from(container.querySelectorAll(".blue rect"))),
        gsap.utils.shuffle(Array.from(container.querySelectorAll(".pink rect")))
      ];
    }
  
    changeEffect(nodes, isChecked) {
      // Blue rectangles animation
      gsap.to(nodes[0], {
        duration: 1.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isChecked ? "-100" : "100",
        stagger: 0.012,
        overwrite: true
      });
      
      // Pink/Gold rectangles animation  
      gsap.to(nodes[1], {
        duration: 1.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isChecked ? "100" : "-100",
        stagger: 0.012,
        overwrite: true
      });
    }
  
    // Difficulty Selection Logic
    initializeDifficultySelection() {
      const difficultyBtns = document.querySelectorAll('.difficulty-btn');
      
      difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active class from all buttons
          difficultyBtns.forEach(b => b.classList.remove('active'));
          
          // Add active class to clicked button
          btn.classList.add('active');
          
          // Update selected difficulty
          this.selectedDifficulty = btn.getAttribute('data-difficulty');
          
          // Play difficulty select sound
          this.playDifficultySelectSound(this.selectedDifficulty);
          
          console.log(`⚔️ Selected difficulty: ${this.selectedDifficulty}`);
        });
      });
    }
  
    // Start Game Button Logic
    initializeStartButton() {
      const startBtn = document.getElementById('start-game-btn');
      
      startBtn.addEventListener('click', () => {
        this.startGame();
      });
  
      // Add hover sparkle effect
      startBtn.addEventListener('mouseenter', () => {
        this.animateStartButton(true);
      });
  
      startBtn.addEventListener('mouseleave', () => {
        this.animateStartButton(false);
      });
    }
  
    animateStartButton(isHover) {
      const sparkle = document.querySelector('.btn-sparkle');
      
      if (isHover) {
        gsap.to(sparkle, {
          scale: 1.3,
          rotation: "+=180",
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      } else {
        gsap.to(sparkle, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  
    // Sound Effects System
    playCharacterSelectSound(character) {
      // Medieval character selection sounds
      const sounds = {
        knight: () => {
          console.log('🔊 *Armor Clanking* + *Noble Meow*');
          this.playTone([330, 440], 0.3); // C and A notes
        },
        wizard: () => {
          console.log('🔊 *Magical Sparkle* + *Mystical Purr*');
          this.playTone([523, 659], 0.4); // C and E notes (higher, magical)
        },
        rogue: () => {
          console.log('🔊 *Sneaky Footsteps* + *Sly Meow*');
          this.playTone([220, 277], 0.2); // Lower, sneakier notes
        }
      };
      
      if (sounds[character]) {
        sounds[character]();
      }
    }
  
    playDifficultySelectSound(difficulty) {
      const sounds = {
        peasant: () => {
          console.log('🔊 *Gentle Bells* + *Confident Purr*');
          this.playTone([349, 392], 0.3);
        },
        knight: () => {
          console.log('🔊 *Sword Unsheathing* + *Determined Meow*');
          this.playTone([440, 523], 0.4);
        },
        'dragon-slayer': () => {
          console.log('🔊 *Dragon Roar* + *Epic Battle Cry Meow*');
          this.playTone([523, 659, 784], 0.5);
        }
      };
      
      if (sounds[difficulty]) {
        sounds[difficulty]();
      }
    }
  
    playMenuMusic() {
      console.log('🎵 *Medieval Tavern Music Playing Softly*');
      console.log('🎶 *Lute and Flute Melodies*');
      
      // Simple ambient background tones (very subtle)
      setTimeout(() => {
        if (this.audioInitialized) {
          this.playAmbientTone();
        }
      }, 2000);
    }
  
    playAmbientTone() {
      // Very subtle background ambient sound
      if (this.audioInitialized && window.audioContext) {
        const ctx = window.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(130, ctx.currentTime); // Very low, ambient tone
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2); // Very quiet
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 8);
        
        // Repeat ambient tone every 10 seconds
        setTimeout(() => this.playAmbientTone(), 10000);
      }
    }
  
    // Simple tone generator for sound feedback
    playTone(frequencies, duration = 0.3) {
      if (!this.audioInitialized || !window.audioContext) {
        console.log('🔇 Audio not ready yet - click something first!');
        return;
      }
      
      const ctx = window.audioContext;
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime + index * 0.1);
        oscillator.stop(ctx.currentTime + duration + index * 0.1);
      });
    }
  
    // Start the game!
    startGame() {
      console.log('🏰 Starting Chunko the Medieval Feline!');
      console.log(`🐱 Character: ${this.selectedCharacter}`);
      console.log(`⚔️ Difficulty: ${this.selectedDifficulty}`);
      
      // Play epic start sound
      this.playEpicStartSound();
      
      // Store selections in sessionStorage for the game
      sessionStorage.setItem('chunko-character', this.selectedCharacter);
      sessionStorage.setItem('chunko-difficulty', this.selectedDifficulty);
      
      // Dramatic transition to game
      this.transitionToGame();
    }
  
    playEpicStartSound() {
      console.log('🔊 *EPIC MEDIEVAL FANFARE*');
      console.log('🎺 *Trumpet Flourish* + *Heroic Cat Battle Cry*');
      
      // Epic chord progression
      const epicChord1 = [261, 329, 392]; // C Major
      const epicChord2 = [293, 369, 440]; // D Major
      const epicChord3 = [329, 415, 523]; // E Major
      
      setTimeout(() => this.playTone(epicChord1, 0.5), 0);
      setTimeout(() => this.playTone(epicChord2, 0.5), 300);
      setTimeout(() => this.playTone(epicChord3, 0.8), 600);
    }
  
    transitionToGame() {
      const body = document.body;
      
      // Create epic transition overlay
      const transitionOverlay = document.createElement('div');
      transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, 
          rgba(241, 196, 15, 0.9) 0%, 
          rgba(60, 40, 24, 0.95) 50%, 
          rgba(26, 24, 16, 0.98) 100%);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        color: #f4e4c1;
        font-family: 'Cinzel', serif;
      `;
      
      transitionOverlay.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏰</div>
          <h2 style="font-size: 2rem; margin-bottom: 1rem;">Loading Medieval Realm...</h2>
          <p style="font-size: 1.2rem; opacity: 0.8;">Chunko prepares for adventure!</p>
          <div style="margin-top: 2rem; font-size: 1.5rem;" class="loading-dots">⚔️ 🐱 ⚔️</div>
        </div>
      `;
      
      body.appendChild(transitionOverlay);
      
      // Animate transition
      gsap.timeline()
        .to(transitionOverlay, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut"
        })
        .to('.loading-dots', {
          rotation: 360,
          duration: 1,
          repeat: 2,
          ease: "power2.inOut"
        }, "-=0.3")
        .call(() => {
          // Navigate to game page
          window.location.href = 'game.html';
        }, null, "+=0.5");
    }
  }
  
  // Initialize the character selection when page loads
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏰 Welcome to Chunko the Medieval Feline Character Selection!');
    
    // Create entrance animation
    gsap.timeline()
      .from('.game-title', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.4)"
      })
      .from('.radio-btn-group', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.5")
      .from('.difficulty-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .from('.start-section', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.2")
      .call(() => {
        // Initialize the character selection system
        new ChunkoCharacterSelect();
      });
    
    console.log('🎭 Character selection system ready!');
  });