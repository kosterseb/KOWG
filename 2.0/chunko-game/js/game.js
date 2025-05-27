// Chunko the Medieval Feline - Main Game Engine (Updated with Better Scaling)
class ChunkoGame {
    constructor() {
      this.gameState = 'loading'; // loading, dialogue, playing, paused, gameOver
      this.selectedCharacter = 'knight';
      this.selectedDifficulty = 'knight';
      this.audioEnabled = true;
      
      // Game stats
      this.score = {
        fish: 0,
        distance: 0,
        best: localStorage.getItem('chunko-best-score') || 0
      };
      
      // Game objects
      this.chunko = null;
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.powerUps = [];
      
      // Game physics
      this.gravity = 0.8;
      this.gameSpeed = 3;
      this.groundLevel = 0;
      
      // Viewport management for better scaling
      this.viewport = {
        width: 1200,
        height: 675,
        scale: 1
      };
      
      // Paper.js setup
      this.canvas = document.getElementById('game-canvas');
      this.particleOverlay = document.getElementById('particle-overlay');
      
      this.init();
    }
  
    async init() {
      console.log('🏰 Initializing Chunko the Medieval Feline...');
      
      // Load character selection from menu
      this.loadCharacterSelection();
      
      // Setup canvas FIRST (important for proper scaling!)
      this.setupCanvas();
      
      // Setup Paper.js for particle effects
      this.setupPaperJS();
      
      // Initialize audio system
      this.setupAudio();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Add resize handler for responsive design
      window.addEventListener('resize', () => this.handleResize());
      
      // Start loading sequence
      await this.startLoadingSequence();
      
      // Show dialogue with medieval joke
      this.showDialogueScreen();
      
      console.log('🎭 Game engine ready!');
    }
  
    // NEW: Proper canvas scaling setup
    setupCanvas() {
      // Get the container size
      const container = this.canvas.parentElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      // Set a good aspect ratio (16:9 works well for platformers)
      const targetAspectRatio = 16 / 9;
      let canvasWidth, canvasHeight;
      
      if (containerWidth / containerHeight > targetAspectRatio) {
        // Container is wider - limit by height
        canvasHeight = containerHeight;
        canvasWidth = canvasHeight * targetAspectRatio;
      } else {
        // Container is taller - limit by width
        canvasWidth = containerWidth;
        canvasHeight = canvasWidth / targetAspectRatio;
      }
      
      // Set canvas size
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      
      // Store viewport for game logic
      this.viewport = {
        width: canvasWidth,
        height: canvasHeight,
        scale: canvasWidth / 1200 // Base scale on 1200px reference width
      };
      
      console.log(`🎮 Canvas set to: ${canvasWidth}x${canvasHeight}, scale: ${this.viewport.scale}`);
    }
  
    // NEW: Handle window resize
    handleResize() {
      // Recalculate canvas size
      this.setupCanvas();
      
      // Adjust existing game objects to new scale
      if (this.chunko) {
        const { scale } = this.viewport;
        const newChunkoSize = Math.max(40, 60 * scale);
        
        // Maintain relative positions
        const relativeX = this.chunko.x / this.canvas.width;
        const relativeY = (this.chunko.y + this.chunko.height) / this.groundLevel;
        
        this.chunko.width = newChunkoSize;
        this.chunko.height = newChunkoSize;
        this.chunko.x = relativeX * this.viewport.width;
        this.chunko.y = this.groundLevel - (relativeY * this.groundLevel) - newChunkoSize;
      }
    }
  
    loadCharacterSelection() {
      // Get selections from character menu
      this.selectedCharacter = sessionStorage.getItem('chunko-character') || 'knight';
      this.selectedDifficulty = sessionStorage.getItem('chunko-difficulty') || 'knight';
      
      console.log(`🐱 Playing as: ${this.selectedCharacter}`);
      console.log(`⚔️ Difficulty: ${this.selectedDifficulty}`);
      
      // Set character-specific properties
      this.setCharacterProperties();
    }
  
    setCharacterProperties() {
      const characterStats = {
        knight: {
          icon: '🐱⚔️',
          title: 'Sir Chunko',
          speed: 5,
          jumpPower: 15,
          health: 3,
          size: 1.0
        },
        wizard: {
          icon: '🐱🧙‍♂️',
          title: 'Wizard Chunko',
          speed: 3,
          jumpPower: 20,
          health: 2,
          size: 1.0
        },
        rogue: {
          icon: '🐱🗡️',
          title: 'Rogue Chunko',
          speed: 7,
          jumpPower: 12,
          health: 2,
          size: 0.8
        }
      };
      
      this.characterStats = characterStats[this.selectedCharacter];
      
      // Apply difficulty modifiers with viewport scaling
      const difficultyModifiers = {
        peasant: { speedMod: 0.8, healthMod: 1.5, scoreMod: 0.8 },
        knight: { speedMod: 1.0, healthMod: 1.0, scoreMod: 1.0 },
        'dragon-slayer': { speedMod: 1.3, healthMod: 0.7, scoreMod: 1.5 }
      };
      
      const modifier = difficultyModifiers[this.selectedDifficulty];
      // Scale game speed with viewport and difficulty
      this.gameSpeed = (3 * modifier.speedMod) * Math.max(0.5, this.viewport.scale);
      this.characterStats.health *= modifier.healthMod;
      this.scoreMultiplier = modifier.scoreMod;
    }
  
    setupPaperJS() {
      // Canvas is already sized by setupCanvas()
      paper.setup(this.canvas);
      
      console.log('🎨 Paper.js initialized');
      console.log('📐 Game viewport:', this.viewport.width, 'x', this.viewport.height);
      
      // Set up the animation loop
      paper.view.onFrame = (event) => {
        if (this.gameState === 'playing') {
          this.gameLoop(event);
        }
      };
    }
  
    setupAudio() {
      this.audioContext = null;
      
      // Initialize audio on first user interaction
      const initAudio = () => {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          console.log('🔊 Audio system ready!');
        } catch (e) {
          console.log('Audio not supported');
        }
      };
      
      document.addEventListener('click', initAudio, { once: true });
      document.addEventListener('keydown', initAudio, { once: true });
    }
  
    setupEventListeners() {
      // Keyboard controls
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
      document.addEventListener('keyup', (e) => this.handleKeyUp(e));
      
      // Button clicks
      document.getElementById('pause-btn')?.addEventListener('click', () => this.pauseGame());
      document.getElementById('menu-btn')?.addEventListener('click', () => this.returnToMenu());
      document.getElementById('sound-btn')?.addEventListener('click', () => this.toggleSound());
      
      // Game over buttons
      document.getElementById('play-again-btn')?.addEventListener('click', () => this.restartGame());
      document.getElementById('character-select-btn')?.addEventListener('click', () => this.returnToCharacterSelect());
      document.getElementById('main-menu-btn')?.addEventListener('click', () => this.returnToMenu());
      
      // Pause screen buttons
      document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
      document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
      document.getElementById('quit-btn')?.addEventListener('click', () => this.returnToMenu());
    }
  
    async startLoadingSequence() {
      console.log('📦 Starting loading sequence...');
      
      // Show loading screen
      document.getElementById('loading-screen').classList.remove('hidden');
      
      // Simulate loading time with progress
      const loadingText = document.querySelector('.loading-text');
      const loadingSteps = [
        'Chunko sharpens his wit...',
        'Preparing medieval puns...',
        'Loading fish and obstacles...',
        'Calibrating jump physics...',
        'Summoning particle magic...',
        'Adventure ready!'
      ];
      
      for (let i = 0; i < loadingSteps.length; i++) {
        loadingText.textContent = loadingSteps[i];
        await this.wait(500);
      }
      
      // Hide loading screen
      document.getElementById('loading-screen').classList.add('hidden');
    }
  
    showDialogueScreen() {
      console.log('🎭 Showing dialogue screen with medieval joke...');
      
      this.gameState = 'dialogue';
      
      // Show dialogue screen
      const dialogueScreen = document.getElementById('dialogue-screen');
      dialogueScreen.classList.remove('hidden');
      
      // Update character display
      this.updateCharacterDisplay();
      
      // Get random joke and display it
      this.displayRandomJoke();
      
      // Animate dialogue entrance
      gsap.fromTo(dialogueScreen, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  
    updateCharacterDisplay() {
      const characterIcon = document.querySelector('.character-icon');
      const characterName = document.querySelector('.character-name');
      const speakerName = document.querySelector('.speaker-name');
      
      characterIcon.textContent = this.characterStats.icon;
      characterName.textContent = this.characterStats.title;
      speakerName.textContent = this.characterStats.title;
    }
  
    displayRandomJoke() {
      // Get random joke from jokes database
      const randomJoke = ChunkoJokes.getRandomJoke(this.selectedCharacter, this.selectedDifficulty);
      
      console.log('😸 Selected joke:', randomJoke.joke);
      
      // Display joke with typewriter effect
      this.typewriterEffect(randomJoke.joke, document.getElementById('dialogue-text'));
      
      // Play joke sound effect
      setTimeout(() => {
        this.playJokeSound(randomJoke.sound);
      }, 1000);
      
      // Store joke for potential reuse
      this.currentJoke = randomJoke;
    }
  
    typewriterEffect(text, element) {
      element.textContent = '';
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          
          // Play typing sound occasionally
          if (i % 3 === 0) {
            this.playTypingSound();
          }
          
          i++;
        } else {
          clearInterval(typeInterval);
          
          // Show continue hint when done
          document.querySelector('.continue-hint').style.opacity = '1';
        }
      }, 50);
    }
  
    handleKeyDown(e) {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (this.gameState === 'dialogue') {
            this.startGame();
          } else if (this.gameState === 'playing') {
            this.chunkoJump();
          } else if (this.gameState === 'gameOver') {
            this.restartGame();
          }
          break;
          
        case 'KeyA':
        case 'ArrowLeft':
          if (this.gameState === 'playing') {
            this.chunko.moveLeft = true;
          }
          break;
          
        case 'KeyD':
        case 'ArrowRight':
          if (this.gameState === 'playing') {
            this.chunko.moveRight = true;
          }
          break;
          
        case 'KeyS':
        case 'ArrowDown':
          if (this.gameState === 'playing') {
            this.chunkoSlide();
          }
          break;
          
        case 'Escape':
          if (this.gameState === 'playing') {
            this.pauseGame();
          } else if (this.gameState === 'paused') {
            this.resumeGame();
          }
          break;
      }
    }
  
    handleKeyUp(e) {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          if (this.chunko) this.chunko.moveLeft = false;
          break;
          
        case 'KeyD':
        case 'ArrowRight':
          if (this.chunko) this.chunko.moveRight = false;
          break;
      }
    }
  
    startGame() {
      console.log('🎮 Starting main game!');
      
      this.gameState = 'playing';
      
      // Hide dialogue screen
      document.getElementById('dialogue-screen').classList.add('hidden');
      
      // Show game screen
      document.getElementById('game-screen').classList.remove('hidden');
      
      // Initialize game objects
      this.initializeGameObjects();
      
      // Update UI
      this.updateUI();
      
      // Play start sound
      this.playGameStartSound();
      
      console.log('🏃 Game loop started!');
    }
  
    // UPDATED: Better scaled game objects initialization
    initializeGameObjects() {
      // Make sure canvas is properly sized first
      this.setupCanvas();
      
      const { width: canvasWidth, height: canvasHeight, scale } = this.viewport;
      
      // Better ground level - 70% down gives more sky space
      this.groundLevel = canvasHeight * 0.7;
      
      // Scale objects based on viewport scale, but with minimum sizes
      const chunkoSize = Math.max(40, 60 * scale); // Minimum 40px, scales with viewport
      
      this.chunko = {
        x: canvasWidth * 0.15, // Move a bit further from edge
        y: this.groundLevel - chunkoSize,
        width: chunkoSize,
        height: chunkoSize,
        velocityX: 0,
        velocityY: 0,
        onGround: true,
        moveLeft: false,
        moveRight: false,
        health: this.characterStats.health,
        invulnerable: false
      };
      
      console.log('🐱 Chunko size:', chunkoSize, 'at position:', this.chunko.x, this.chunko.y);
      console.log('🌍 Ground level:', this.groundLevel, `(${Math.round((this.groundLevel/canvasHeight)*100)}% down)`);
      
      // Clear arrays
      this.obstacles = [];
      this.collectibles = [];
      this.powerUps = [];
      this.enemies = [];
      
      // Generate content with better scaling
      this.generateCollectibles();
      this.generateEnemies();
    }
  
    // UPDATED: Better scaled collectibles
    generateCollectibles() {
      const { width: canvasWidth, scale } = this.viewport;
      const fishSize = Math.max(30, 45 * scale); // Minimum 30px, better scaling
      
      for (let i = 0; i < 8; i++) { // Slightly fewer but bigger fish
        this.collectibles.push({
          x: canvasWidth * 0.3 + i * (canvasWidth * 0.15), // Better spacing
          y: this.groundLevel - fishSize - Math.random() * (this.groundLevel * 0.5), // Stay in upper 50% of sky
          width: fishSize,
          height: fishSize,
          type: 'fish',
          collected: false,
          icon: '🐟',
          image: 'img/Fisk.png'
        });
      }
      
      console.log('🐟 Generated', this.collectibles.length, 'fish with size:', fishSize);
    }
  
    // UPDATED: Better scaled enemies
    generateEnemies() {
      const { width: canvasWidth, scale } = this.viewport;
      const enemySize = Math.max(35, 50 * scale); // Minimum 35px, better scaling
      
      for (let i = 0; i < 4; i++) { // Fewer but more visible enemies
        this.enemies.push({
          x: canvasWidth * 0.5 + i * (canvasWidth * 0.25), // Better spacing
          y: this.groundLevel - enemySize,
          width: enemySize,
          height: enemySize,
          type: 'fox',
          alive: true,
          velocityX: -1,
          image: 'img/FOX aka RØVEN_Transparent_Color.png'
        });
      }
      
      console.log('🦊 Generated', this.enemies.length, 'enemies with size:', enemySize);
    }
  
    gameLoop(event) {
      if (this.gameState !== 'playing') return;
      
      // Update physics
      this.updateChunko();
      this.updateCollectibles();
      this.updateObstacles();
      this.updateEnemies();
      this.updateDistance();
      
      // Check collisions
      this.checkCollisions();
      
      // Render everything
      this.render();
      
      // Generate new content
      this.generateNewContent();
      
      // Update UI
      this.updateUI();
    }
  
    // UPDATED: Scaled movement
    updateChunko() {
      if (!this.chunko) return;
      
      // Scale movement speed with viewport
      const moveSpeed = this.characterStats.speed * Math.max(0.8, this.viewport.scale);
      
      // Horizontal movement
      if (this.chunko.moveLeft) {
        this.chunko.velocityX = -moveSpeed;
      } else if (this.chunko.moveRight) {
        this.chunko.velocityX = moveSpeed;
      } else {
        this.chunko.velocityX *= 0.8; // Friction
      }
      
      // Apply gravity
      this.chunko.velocityY += this.gravity;
      
      // Update position
      this.chunko.x += this.chunko.velocityX;
      this.chunko.y += this.chunko.velocityY;
      
      // Ground collision
      if (this.chunko.y >= this.groundLevel - this.chunko.height) {
        this.chunko.y = this.groundLevel - this.chunko.height;
        this.chunko.velocityY = 0;
        this.chunko.onGround = true;
      } else {
        this.chunko.onGround = false;
      }
      
      // Keep Chunko on screen
      this.chunko.x = Math.max(0, Math.min(this.chunko.x, this.viewport.width - this.chunko.width));
    }
  
    chunkoJump() {
      if (this.chunko && this.chunko.onGround) {
        this.chunko.velocityY = -this.characterStats.jumpPower;
        this.chunko.onGround = false;
        
        // Create jump particle effect
        this.createJumpParticles();
        
        // Play jump sound
        this.playJumpSound();
      }
    }
  
    chunkoSlide() {
      if (this.chunko && this.chunko.onGround) {
        // Slide effect (temporary speed boost + lower hitbox)
        this.chunko.velocityX = this.characterStats.speed * 2;
        
        // Create slide particles
        this.createSlideParticles();
        
        // Play slide sound
        this.playSlideSound();
      }
    }
  
    updateCollectibles() {
      this.collectibles.forEach(collectible => {
        // Move collectibles left (world scrolling effect)
        collectible.x -= this.gameSpeed;
      });
      
      // Remove off-screen collectibles
      this.collectibles = this.collectibles.filter(collectible => collectible.x > -50);
    }
  
    updateObstacles() {
      this.obstacles.forEach(obstacle => {
        obstacle.x -= this.gameSpeed;
      });
      
      this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -100);
    }
  
    updateDistance() {
      this.score.distance += this.gameSpeed * 0.1;
    }
  
    updateEnemies() {
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          // Move enemies left (world scrolling) + their own movement
          enemy.x -= this.gameSpeed + Math.abs(enemy.velocityX);
          
          // Simple AI: bounce when reaching ground edges
          if (enemy.y >= this.groundLevel - enemy.height) {
            enemy.y = this.groundLevel - enemy.height;
          }
        }
      });
      
      // Remove off-screen enemies
      this.enemies = this.enemies.filter(enemy => enemy.x > -100);
    }
  
    checkCollisions() {
      // Check fish collection
      this.collectibles.forEach(collectible => {
        if (!collectible.collected && this.isColliding(this.chunko, collectible)) {
          this.collectFish(collectible);
        }
      });
      
      // Check enemy collisions
      this.enemies.forEach(enemy => {
        if (enemy.alive && !this.chunko.invulnerable && this.isColliding(this.chunko, enemy)) {
          this.handleEnemyCollision(enemy);
        }
      });
    }
  
    handleEnemyCollision(enemy) {
      console.log('💥 Enemy collision detected!');
      
      // Prevent multiple collision handling
      if (this.chunko.invulnerable) {
        console.log('🛡️ Chunko is invulnerable, ignoring collision');
        return;
      }
      
      // Check if Chunko is jumping on enemy (from above)
      if (this.chunko.velocityY > 0 && this.chunko.y < enemy.y - 10) {
        // Defeat enemy by jumping on it
        console.log('🦊 Defeating enemy by jumping on it!');
        enemy.alive = false;
        this.chunko.velocityY = -8; // Bounce off enemy
        this.score.fish += Math.floor(25 * this.scoreMultiplier); // Bonus points
        
        // Create enemy defeat particles (safe version)
        try {
          this.createEnemyDefeatBurst(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
        } catch (e) {
          console.log('Particle effect failed, but continuing game');
        }
        
        this.showCollectionEffect('+25 🏆');
        this.playEnemyDefeatSound();
        
        console.log('🦊 Fox defeated! Bonus points! New score:', this.score.fish);
      } else {
        // Take damage
        console.log('💔 Chunko taking damage!');
        this.chunko.health = Math.max(0, this.chunko.health - 1); // Ensure health doesn't go negative
        this.chunko.invulnerable = true;
        
        // Knockback (reduced to prevent freezing)
        this.chunko.velocityX = -5; // Reduced knockback
        this.chunko.velocityY = -3;
        
        // Create damage effect (safe version)
        try {
          this.createDamageEffect();
        } catch (e) {
          console.log('Damage effect failed, but continuing game');
        }
        
        this.playDamageSound();
        
        // Remove invulnerability after 1 second
        setTimeout(() => {
          if (this.chunko) { // Safety check
            this.chunko.invulnerable = false;
            console.log('🛡️ Invulnerability removed');
          }
        }, 1000);
        
        console.log('💔 Chunko health now:', this.chunko.health);
        
        // Check game over
        if (this.chunko.health <= 0) {
          console.log('💀 Game over triggered');
          setTimeout(() => this.gameOver(), 100); // Small delay to prevent freezing
        }
      }
    }
  
    createEnemyDefeatBurst(x, y) {
      const defeatPoint = new paper.Point(x, y);
      
      this.burst(defeatPoint, {
        numParticles: 20,
        colors: ['#FF6B35', '#F7931E', '#FFD23F'],
        particleSize: 6,
        moveRange: 70
      });
    }
  
    createDamageEffect() {
      if (!this.chunko) return;
      
      const damagePoint = new paper.Point(
        this.chunko.x + this.chunko.width/2, 
        this.chunko.y + this.chunko.height/2
      );
      
      this.burst(damagePoint, {
        numParticles: 15,
        colors: ['#E74C3C', '#C0392B', '#fff'],
        particleSize: 4,
        moveRange: 50
      });
    }
  
    isColliding(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }
  
    collectFish(fish) {
      fish.collected = true;
      this.score.fish += Math.floor(10 * this.scoreMultiplier);
      
      // Create fish collection particle burst
      this.createFishCollectionBurst(fish.x + fish.width/2, fish.y + fish.height/2);
      
      // Show collection effect
      this.showCollectionEffect('+' + Math.floor(10 * this.scoreMultiplier) + ' 🐟');
      
      // Play collection sound
      this.playFishCollectSound();
      
      console.log('🐟 Fish collected! Score:', this.score.fish);
    }
  
    generateNewContent() {
      // Generate new fish occasionally
      if (Math.random() < 0.02) {
        const fishSize = Math.max(30, 45 * this.viewport.scale);
        this.collectibles.push({
          x: this.viewport.width + 100,
          y: this.groundLevel - fishSize - Math.random() * (this.groundLevel * 0.5),
          width: fishSize,
          height: fishSize,
          type: 'fish',
          collected: false,
          icon: '🐟',
          image: 'img/Fisk.png'
        });
      }
      
      // Generate new enemies occasionally
      if (Math.random() < 0.008) {
        const enemySize = Math.max(35, 50 * this.viewport.scale);
        this.enemies.push({
          x: this.viewport.width + 150,
          y: this.groundLevel - enemySize,
          width: enemySize,
          height: enemySize,
          type: 'fox',
          alive: true,
          velocityX: -1,
          image: 'img/FOX aka RØVEN_Transparent_Color.png'
        });
      }
    }
  
    render() {
      // Clear canvas
      paper.project.clear();
      
      // Draw background elements with more space
      this.drawBackground();
      
      // Draw Chunko (with actual image)
      this.drawChunko();
      
      // Draw collectibles (fish images)
      this.drawCollectibles();
      
      // Draw enemies (fox images)
      this.drawEnemies();
      
      // Draw obstacles
      this.drawObstacles();
    }
  
    drawBackground() {
      // Simple blue sky
      const sky = new paper.Path.Rectangle({
        point: [0, 0],
        size: [this.viewport.width, this.groundLevel],
        fillColor: '#87CEEB'
      });
      
      // Simple green ground
      const ground = new paper.Path.Rectangle({
        point: [0, this.groundLevel],
        size: [this.viewport.width, this.viewport.height - this.groundLevel],
        fillColor: '#90EE90'
      });
      
      // Ground line
      const groundLine = new paper.Path.Line({
        from: [0, this.groundLevel],
        to: [this.viewport.width, this.groundLevel],
        strokeColor: '#228B22',
        strokeWidth: 3
      });
    }
  
    // UPDATED: Better proportional Chunko drawing
    drawChunko() {
      if (!this.chunko) return;
      
      const centerX = this.chunko.x + this.chunko.width/2;
      const centerY = this.chunko.y + this.chunko.height/2;
      const radius = this.chunko.width/2;
      
      // More proportional cat with better visibility
      const chunkoBody = new paper.Shape.Circle({
        center: [centerX, centerY],
        radius: radius,
        fillColor: '#FFD700',
        strokeColor: '#FF8C00',
        strokeWidth: Math.max(2, radius * 0.1) // Scale stroke width
      });
      
      // Proportional ears
      const earSize = radius * 0.6;
      const earOffset = radius * 0.6;
      
      const leftEar = new paper.Path.RegularPolygon({
        center: [centerX - earOffset, centerY - earOffset],
        sides: 3,
        radius: earSize,
        fillColor: '#FFD700',
        strokeColor: '#FF8C00',
        strokeWidth: Math.max(1, earSize * 0.1)
      });
      
      const rightEar = new paper.Path.RegularPolygon({
        center: [centerX + earOffset, centerY - earOffset],
        sides: 3,
        radius: earSize,
        fillColor: '#FFD700',
        strokeColor: '#FF8C00',
        strokeWidth: Math.max(1, earSize * 0.1)
      });
      
      // Proportional eyes
      const eyeSize = radius * 0.15;
      const eyeOffset = radius * 0.4;
      
      const leftEye = new paper.Shape.Circle({
        center: [centerX - eyeOffset, centerY - radius * 0.2],
        radius: eyeSize,
        fillColor: '#000'
      });
      
      const rightEye = new paper.Shape.Circle({
        center: [centerX + eyeOffset, centerY - radius * 0.2],
        radius: eyeSize,
        fillColor: '#000'
      });
      
      // Invulnerability effect
      if (this.chunko.invulnerable && Math.floor(Date.now() / 100) % 2) {
        [chunkoBody, leftEar, rightEar, leftEye, rightEye].forEach(shape => {
          shape.opacity = 0.5;
        });
      }
    }
  
    // UPDATED: Better scaled collectibles drawing
    drawCollectibles() {
      this.collectibles.forEach((collectible, index) => {
        if (!collectible.collected) {
          const centerX = collectible.x + collectible.width/2;
          const centerY = collectible.y + collectible.height/2;
          const fishWidth = collectible.width;
          const fishHeight = collectible.height * 0.7;
          
          // Make fish much more visible with proper scaling
          const fishBody = new paper.Shape.Ellipse({
            center: [centerX, centerY],
            size: [fishWidth, fishHeight],
            fillColor: '#00FFFF', // Bright cyan
            strokeColor: '#008B8B', // Dark cyan outline
            strokeWidth: Math.max(2, fishWidth * 0.08) // Scale stroke
          });
          
          // Proportional tail
          const tailSize = fishWidth * 0.4;
          const tail = new paper.Path.RegularPolygon({
            center: [collectible.x + collectible.width + tailSize/2, centerY],
            sides: 3,
            radius: tailSize,
            fillColor: '#00FFFF',
            strokeColor: '#008B8B',
            strokeWidth: Math.max(1, tailSize * 0.1)
          });
          
          // Gentle floating animation
          const floatOffset = Math.sin(Date.now() * 0.003 + collectible.x * 0.01) * 5;
          fishBody.position.y += floatOffset;
          tail.position.y += floatOffset;
        }
      });
    }
  
    // UPDATED: Better scaled enemies drawing
    drawEnemies() {
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          const centerX = enemy.x + enemy.width/2;
          const centerY = enemy.y + enemy.height/2;
          const radius = enemy.width/2;
          
          // Better fox representation with proper scaling
          const foxBody = new paper.Shape.Ellipse({
            center: [centerX, centerY],
            size: [enemy.width, enemy.height * 0.8],
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(2, radius * 0.1)
          });
          
          // Proportional tail
          const tailRadius = radius * 0.6;
          const tail = new paper.Shape.Circle({
            center: [enemy.x + enemy.width + tailRadius, centerY],
            radius: tailRadius,
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(1, tailRadius * 0.1)
          });
          
          // Proportional ears
          const earSize = radius * 0.3;
          const earOffset = radius * 0.6;
          
          const leftEar = new paper.Path.RegularPolygon({
            center: [centerX - earOffset, centerY - earOffset],
            sides: 3,
            radius: earSize,
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(1, earSize * 0.1)
          });
          
          const rightEar = new paper.Path.RegularPolygon({
            center: [centerX + earOffset, centerY - earOffset],
            sides: 3,
            radius: earSize,
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(1, earSize * 0.1)
          });
        }
      });
    }
  
    drawObstacles() {
      this.obstacles.forEach(obstacle => {
        const obstacleShape = new paper.Shape.Rectangle(
          new paper.Point(obstacle.x, obstacle.y),
          new paper.Size(obstacle.width, obstacle.height)
        );
        obstacleShape.fillColor = '#8B4513';
      });
    }
  
    // PARTICLE EFFECTS SYSTEM (Your burst inspiration!)
    createJumpParticles() {
      if (!this.chunko) return;
      
      const jumpPoint = new paper.Point(
        this.chunko.x + this.chunko.width/2, 
        this.chunko.y + this.chunko.height
      );
      
      this.burst(jumpPoint, {
        numParticles: 16,
        colors: ['#f1c40f', '#e67e22', '#fff'],
        particleSize: 3,
        moveRange: 40
      });
    }
  
    createSlideParticles() {
      if (!this.chunko) return;
      
      const slidePoint = new paper.Point(
        this.chunko.x, 
        this.chunko.y + this.chunko.height
      );
      
      this.burst(slidePoint, {
        numParticles: 12,
        colors: ['#8B4513', '#A0522D', '#DEB887'],
        particleSize: 2,
        moveRange: 30
      });
    }
  
    createFishCollectionBurst(x, y) {
      const collectPoint = new paper.Point(x, y);
      
      this.burst(collectPoint, {
        numParticles: 24,
        colors: ['#1abc9c', '#16a085', '#fff', '#f1c40f'],
        particleSize: 4,
        moveRange: 60
      });
    }
  
    // Enhanced burst function based on your inspiration
    burst(point, options = {}) {
      const {
        numParticles = 32,
        colors = ['#f1c40f', '#1abc9c', '#fff'],
        particleSize = 5,
        moveRange = 80
      } = options;
      
      const particles = [];
      
      for (let i = 0; i < numParticles; i++) {
        const particle = new paper.Shape.Circle({
          center: point,
          radius: particleSize + Math.random() * 3,
          fillColor: colors[Math.floor(Math.random() * colors.length)]
        });
        
        particles.push(particle);
      }
      
      // Animate particles
      particles.forEach((particle, i) => {
        const angle = (Math.PI * 2 * i) / numParticles + Math.random() * 0.5;
        const distance = moveRange + Math.random() * 40;
        const targetX = point.x + Math.cos(angle) * distance;
        const targetY = point.y + Math.sin(angle) * distance;
        
        // Use GSAP for smooth animation
        gsap.to(particle.position, {
          x: targetX,
          y: targetY,
          duration: 0.8 + Math.random() * 0.4,
          ease: "power2.out"
        });
        
        gsap.to(particle, {
          opacity: 0,
          duration: 0.6 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => {
            particle.remove();
          }
        });
      });
    }
  
    showCollectionEffect(text) {
      const effect = document.getElementById('coin-collect-effect');
      effect.textContent = text;
      effect.classList.remove('hidden');
      
      setTimeout(() => {
        effect.classList.add('hidden');
      }, 1000);
    }
  
    updateUI() {
      document.getElementById('fish-score').textContent = this.score.fish;
      document.getElementById('distance-score').textContent = Math.floor(this.score.distance) + 'm';
      
      // Update health bar
      const healthFill = document.querySelector('.health-fill');
      if (this.chunko && healthFill) {
        const healthPercent = (this.chunko.health / this.characterStats.health) * 100;
        healthFill.style.width = healthPercent + '%';
      }
    }
  
    // SOUND SYSTEM - Enhanced with enemy sounds
    playJokeSound(soundType) {
      if (JokeSounds[soundType]) {
        JokeSounds[soundType]();
      }
    }
  
    playEnemyDefeatSound() {
      console.log('🔊 *Fox Defeated Yelp* + *Victory Meow*');
    }
  
    playDamageSound() {
      console.log('🔊 *Damage Hit* + *Pained Mrow*');
    }
  
    playTypingSound() {
      console.log('🔊 *quill scratch*');
    }
  
    playGameStartSound() {
      console.log('🔊 *EPIC ADVENTURE BEGINS FANFARE*');
    }
  
    playJumpSound() {
      console.log('🔊 *Heroic Cat Leap* + *Wind Whoosh*');
    }
  
    playSlideSound() {
      console.log('🔊 *Sliding on Stone* + *Determined Mrow*');
    }
  
    playFishCollectSound() {
      console.log('🔊 *Magical Chime* + *Satisfied Purr*');
    }
  
    // GAME STATE MANAGEMENT
    pauseGame() {
      this.gameState = 'paused';
      document.getElementById('pause-screen').classList.remove('hidden');
    }
  
    resumeGame() {
      this.gameState = 'playing';
      document.getElementById('pause-screen').classList.add('hidden');
    }
  
    restartGame() {
      // Reset scores
      this.score.fish = 0;
      this.score.distance = 0;
      
      // Hide screens
      document.getElementById('game-over-screen').classList.add('hidden');
      document.getElementById('pause-screen').classList.add('hidden');
      
      // Restart dialogue
      this.showDialogueScreen();
    }
  
    gameOver() {
      console.log('💀 Game Over!');
      
      this.gameState = 'gameOver';
      
      // Update best score
      const totalScore = this.score.fish + Math.floor(this.score.distance);
      if (totalScore > this.score.best) {
        this.score.best = totalScore;
        localStorage.setItem('chunko-best-score', this.score.best);
      }
      
      // Show final stats
      document.getElementById('final-fish').textContent = this.score.fish;
      document.getElementById('final-distance').textContent = Math.floor(this.score.distance) + 'm';
      document.getElementById('best-score').textContent = this.score.best;
      
      // Show final joke
      const gameOverJoke = ChunkoJokes.special.gameOver[0];
      document.getElementById('final-joke').textContent = gameOverJoke.joke;
      
      // Show game over screen
      document.getElementById('game-over-screen').classList.remove('hidden');
    }
  
    returnToCharacterSelect() {
      window.location.href = 'index.html';
    }
  
    returnToMenu() {
      window.location.href = 'index.html';
    }
  
    toggleSound() {
      this.audioEnabled = !this.audioEnabled;
      const soundBtn = document.getElementById('sound-btn');
      soundBtn.textContent = this.audioEnabled ? '🔊' : '🔇';
    }
  
    // UTILITY FUNCTIONS
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  // Initialize game when page loads
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏰 Starting Chunko the Medieval Feline Game!');
    
    // Create game instance
    window.chunkoGame = new ChunkoGame();
  });