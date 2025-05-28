// Chunko the Medieval Feline - Main Game Engine (Updated with Better Scaling + Obstacles)
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
      this.platforms = []; // NEW: Static platforms
      this.spikes = []; // NEW: Spike traps
      
      // Game physics
      this.gravity = 0.8;
      this.gameSpeed = 3;
      this.baseGameSpeed = 3; // NEW: Store the original speed
      this.maxGameSpeed = 8; // NEW: Maximum speed cap
      this.speedIncreaseRate = 0.001; // NEW: How fast speed increases
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
      
      this.loadCharacterSelection();
      this.setupCanvas();
      this.setupPaperJS();
      this.setupAudio();
      this.setupEventListeners();
      
      window.addEventListener('resize', () => this.handleResize());
      
      await this.startLoadingSequence();
      this.showDialogueScreen();
      
      console.log('🎭 Game engine ready!');
    }
  
    setupCanvas() {
      const container = this.canvas.parentElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      const targetAspectRatio = 16 / 9;
      let canvasWidth, canvasHeight;
      
      if (containerWidth / containerHeight > targetAspectRatio) {
        canvasHeight = containerHeight;
        canvasWidth = canvasHeight * targetAspectRatio;
      } else {
        canvasWidth = containerWidth;
        canvasHeight = canvasWidth / targetAspectRatio;
      }
      
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      
      this.viewport = {
        width: canvasWidth,
        height: canvasHeight,
        scale: canvasWidth / 1200
      };
      
      console.log(`🎮 Canvas set to: ${canvasWidth}x${canvasHeight}, scale: ${this.viewport.scale}`);
    }
  
    handleResize() {
      this.setupCanvas();
      
      if (this.chunko) {
        const { scale } = this.viewport;
        const newChunkoSize = Math.max(40, 60 * scale);
        
        const relativeX = this.chunko.x / this.canvas.width;
        const relativeY = (this.chunko.y + this.chunko.height) / this.groundLevel;
        
        this.chunko.width = newChunkoSize;
        this.chunko.height = newChunkoSize;
        this.chunko.x = relativeX * this.viewport.width;
        this.chunko.y = this.groundLevel - (relativeY * this.groundLevel) - newChunkoSize;
      }
    }
  
    loadCharacterSelection() {
      this.selectedCharacter = sessionStorage.getItem('chunko-character') || 'knight';
      this.selectedDifficulty = sessionStorage.getItem('chunko-difficulty') || 'knight';
      
      console.log(`🐱 Playing as: ${this.selectedCharacter}`);
      console.log(`⚔️ Difficulty: ${this.selectedDifficulty}`);
      
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
      
      const difficultyModifiers = {
        peasant: { speedMod: 0.8, healthMod: 1.5, scoreMod: 0.8 },
        knight: { speedMod: 1.0, healthMod: 1.0, scoreMod: 1.0 },
        'dragon-slayer': { speedMod: 1.3, healthMod: 0.7, scoreMod: 1.5 }
      };
      
      const modifier = difficultyModifiers[this.selectedDifficulty];
      this.baseGameSpeed = (3 * modifier.speedMod) * Math.max(0.5, this.viewport.scale); // NEW: Use baseGameSpeed
      this.gameSpeed = this.baseGameSpeed; // NEW: Start with base speed
      this.characterStats.health *= modifier.healthMod;
      this.scoreMultiplier = modifier.scoreMod;
    }
  
    setupPaperJS() {
      paper.setup(this.canvas);
      
      console.log('🎨 Paper.js initialized');
      console.log('📐 Game viewport:', this.viewport.width, 'x', this.viewport.height);
      
      paper.view.onFrame = (event) => {
        if (this.gameState === 'playing') {
          this.gameLoop(event);
        }
      };
    }
  
    setupAudio() {
      this.audioContext = null;
      
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
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
      document.addEventListener('keyup', (e) => this.handleKeyUp(e));
      
      document.getElementById('pause-btn')?.addEventListener('click', () => this.pauseGame());
      document.getElementById('menu-btn')?.addEventListener('click', () => this.returnToMenu());
      document.getElementById('sound-btn')?.addEventListener('click', () => this.toggleSound());
      
      document.getElementById('play-again-btn')?.addEventListener('click', () => this.restartGame());
      document.getElementById('character-select-btn')?.addEventListener('click', () => this.returnToCharacterSelect());
      document.getElementById('main-menu-btn')?.addEventListener('click', () => this.returnToMenu());
      
      document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
      document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
      document.getElementById('quit-btn')?.addEventListener('click', () => this.returnToMenu());
    }
  
    async startLoadingSequence() {
      console.log('📦 Starting loading sequence...');
      
      document.getElementById('loading-screen').classList.remove('hidden');
      
      const loadingText = document.querySelector('.loading-text');
      const loadingSteps = [
        'Chunko sharpens his wit...',
        'Preparing medieval puns...',
        'Loading fish and obstacles...',
        'Building platforms and traps...', // NEW
        'Calibrating jump physics...',
        'Summoning particle magic...',
        'Adventure ready!'
      ];
      
      for (let i = 0; i < loadingSteps.length; i++) {
        loadingText.textContent = loadingSteps[i];
        await this.wait(500);
      }
      
      document.getElementById('loading-screen').classList.add('hidden');
    }
  
    showDialogueScreen() {
      console.log('🎭 Showing dialogue screen with medieval joke...');
      
      this.gameState = 'dialogue';
      
      const dialogueScreen = document.getElementById('dialogue-screen');
      dialogueScreen.classList.remove('hidden');
      
      this.updateCharacterDisplay();
      this.displayRandomJoke();
      
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
      const randomJoke = ChunkoJokes.getRandomJoke(this.selectedCharacter, this.selectedDifficulty);
      
      console.log('😸 Selected joke:', randomJoke.joke);
      
      this.typewriterEffect(randomJoke.joke, document.getElementById('dialogue-text'));
      
      setTimeout(() => {
        this.playJokeSound(randomJoke.sound);
      }, 1000);
      
      this.currentJoke = randomJoke;
    }
  
    typewriterEffect(text, element) {
      element.textContent = '';
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          
          if (i % 3 === 0) {
            this.playTypingSound();
          }
          
          i++;
        } else {
          clearInterval(typeInterval);
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
      
      document.getElementById('dialogue-screen').classList.add('hidden');
      document.getElementById('game-screen').classList.remove('hidden');
      
      this.initializeGameObjects();
      this.updateUI();
      this.playGameStartSound();
      
      console.log('🏃 Game loop started!');
    }
  
    initializeGameObjects() {
      this.setupCanvas();
      
      const { width: canvasWidth, height: canvasHeight, scale } = this.viewport;
      
      this.groundLevel = canvasHeight * 0.7;
      
      const chunkoSize = Math.max(40, 60 * scale);
      
      this.chunko = {
        x: canvasWidth * 0.15,
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
      
      console.log('🐱 Chunko initialized:', chunkoSize, 'at', this.chunko.x, this.chunko.y);
      console.log('🌍 Ground level:', this.groundLevel);
      
      // Clear arrays
      this.obstacles = [];
      this.collectibles = [];
      this.powerUps = [];
      this.enemies = [];
      this.platforms = []; // NEW
      this.spikes = []; // NEW
      
      // Generate content
      this.generateCollectibles();
      this.generateEnemies();
      this.generatePlatforms(); // NEW
      this.generateSpikes(); // NEW
    }
  
    // NEW: Generate static platforms
    generatePlatforms() {
      const { width: canvasWidth, scale } = this.viewport;
      const platformWidth = Math.max(80, 120 * scale);
      const platformHeight = Math.max(15, 25 * scale);
      
      // Create several platforms at different heights and positions
      const platformConfigs = [
        { x: canvasWidth * 0.3, y: this.groundLevel - 150 },
        { x: canvasWidth * 0.5, y: this.groundLevel - 100 },
        { x: canvasWidth * 0.7, y: this.groundLevel - 200 },
        { x: canvasWidth * 0.9, y: this.groundLevel - 120 },
        { x: canvasWidth * 1.2, y: this.groundLevel - 180 },
        { x: canvasWidth * 1.5, y: this.groundLevel - 90 },
        { x: canvasWidth * 1.8, y: this.groundLevel - 160 }
      ];
      
      platformConfigs.forEach(config => {
        this.platforms.push({
          x: config.x,
          y: config.y,
          width: platformWidth,
          height: platformHeight,
          type: 'static-platform',
          color: '#8B4513', // Brown medieval stone
          solid: true
        });
      });
      
      console.log(`🏗️ Generated ${this.platforms.length} static platforms`);
    }
  
    // NEW: Generate spike traps
    generateSpikes() {
      const { width: canvasWidth, scale } = this.viewport;
      const spikeWidth = Math.max(30, 40 * scale);
      const spikeHeight = Math.max(20, 30 * scale);
      
      // Create spike traps on the ground at various positions
      const spikePositions = [
        canvasWidth * 0.4,
        canvasWidth * 0.8,
        canvasWidth * 1.1,
        canvasWidth * 1.4,
        canvasWidth * 1.7,
        canvasWidth * 2.0
      ];
      
      spikePositions.forEach(x => {
        this.spikes.push({
          x: x,
          y: this.groundLevel - spikeHeight,
          width: spikeWidth,
          height: spikeHeight,
          type: 'spike-trap',
          damage: 1,
          color: '#696969' // Dark gray spikes
        });
      });
      
      console.log(`⚔️ Generated ${this.spikes.length} spike traps`);
    }
  
    generateCollectibles() {
      const { width: canvasWidth, scale } = this.viewport;
      const fishSize = Math.max(30, 45 * scale);
      
      for (let i = 0; i < 8; i++) {
        this.collectibles.push({
          x: canvasWidth * 0.3 + i * (canvasWidth * 0.15),
          y: this.groundLevel - fishSize - Math.random() * (this.groundLevel * 0.5),
          width: fishSize,
          height: fishSize,
          type: 'fish',
          collected: false,
          icon: '🐟',
          image: 'img/Fisk.png'
        });
      }
      
      console.log(`🐟 Generated ${this.collectibles.length} fish`);
    }
  
    generateEnemies() {
      const { width: canvasWidth, scale } = this.viewport;
      const enemySize = Math.max(35, 50 * scale);
      
      for (let i = 0; i < 4; i++) {
        this.enemies.push({
          x: canvasWidth * 0.5 + i * (canvasWidth * 0.25),
          y: this.groundLevel - enemySize,
          width: enemySize,
          height: enemySize,
          type: 'fox',
          alive: true,
          velocityX: -1,
          image: 'img/FOX aka RØVEN_Transparent_Color.png'
        });
      }
      
      console.log(`🦊 Generated ${this.enemies.length} enemies`);
    }
  
    gameLoop(event) {
      if (this.gameState !== 'playing') return;
      
      this.updateChunko();
      this.updateCollectibles();
      this.updateObstacles();
      this.updateEnemies();
      this.updateDistance();
      this.updateGameSpeed(); // NEW: Update speed based on progress
      
      this.checkCollisions();
      
      this.render();
      this.generateNewContent();
      this.updateUI();
    }
  
    updateChunko() {
      if (!this.chunko) return;
      
      const moveSpeed = this.characterStats.speed * Math.max(0.8, this.viewport.scale);
      
      if (this.chunko.moveLeft) {
        this.chunko.velocityX = -moveSpeed;
      } else if (this.chunko.moveRight) {
        this.chunko.velocityX = moveSpeed;
      } else {
        this.chunko.velocityX *= 0.8;
      }
      
      this.chunko.velocityY += this.gravity;
      
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
      
      // NEW: Platform collision detection
      this.checkPlatformCollisions();
      
      this.chunko.x = Math.max(0, Math.min(this.chunko.x, this.viewport.width - this.chunko.width));
    }
  
    // NEW: Platform collision system
    checkPlatformCollisions() {
      this.platforms.forEach(platform => {
        // Only check collision if Chunko is falling (velocityY > 0) and coming from above
        if (this.chunko.velocityY > 0 && 
            this.chunko.x < platform.x + platform.width &&
            this.chunko.x + this.chunko.width > platform.x &&
            this.chunko.y + this.chunko.height > platform.y &&
            this.chunko.y + this.chunko.height < platform.y + platform.height + 15) { // Small tolerance
          
          // Land on top of platform
          this.chunko.y = platform.y - this.chunko.height;
          this.chunko.velocityY = 0;
          this.chunko.onGround = true;
          
          // Create landing particles
          this.createPlatformLandParticles(platform);
          
          console.log('🏗️ Chunko landed on platform at', platform.x, platform.y);
        }
      });
    }
  
    chunkoJump() {
      if (this.chunko && this.chunko.onGround) {
        this.chunko.velocityY = -this.characterStats.jumpPower;
        this.chunko.onGround = false;
        
        this.createJumpParticles();
        this.playJumpSound();
      }
    }
  
    chunkoSlide() {
      if (this.chunko && this.chunko.onGround) {
        this.chunko.velocityX = this.characterStats.speed * 2;
        
        this.createSlideParticles();
        this.playSlideSound();
      }
    }
  
    updateCollectibles() {
      this.collectibles.forEach(collectible => {
        collectible.x -= this.gameSpeed;
      });
      
      this.collectibles = this.collectibles.filter(collectible => collectible.x > -50);
    }
  
    updateObstacles() {
      this.obstacles.forEach(obstacle => {
        obstacle.x -= this.gameSpeed;
      });
      
      this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -100);
      
      // NEW: Update platforms and spikes
      this.platforms.forEach(platform => {
        platform.x -= this.gameSpeed;
      });
      this.platforms = this.platforms.filter(platform => platform.x > -200);
      
      this.spikes.forEach(spike => {
        spike.x -= this.gameSpeed;
      });
      this.spikes = this.spikes.filter(spike => spike.x > -100);
    }
  
    updateDistance() {
      this.score.distance += this.gameSpeed * 0.1;
    }
  
    // NEW: Progressive speed increase system
    updateGameSpeed() {
      // Increase speed based on distance traveled
      const speedIncrease = this.score.distance * this.speedIncreaseRate;
      const newSpeed = this.baseGameSpeed + speedIncrease;
      
      // Cap the maximum speed
      this.gameSpeed = Math.min(newSpeed, this.maxGameSpeed);
      
      // Log speed changes for debugging (only occasionally)
      if (Math.floor(this.score.distance) % 100 === 0 && this.score.distance > 0) {
        console.log(`🚀 Speed increased! Distance: ${Math.floor(this.score.distance)}m, Speed: ${this.gameSpeed.toFixed(2)}`);
      }
    }
  
    updateEnemies() {
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.x -= this.gameSpeed + Math.abs(enemy.velocityX);
          
          if (enemy.y >= this.groundLevel - enemy.height) {
            enemy.y = this.groundLevel - enemy.height;
          }
        }
      });
      
      this.enemies = this.enemies.filter(enemy => enemy.x > -100);
    }
  
    checkCollisions() {
      // Fish collection
      this.collectibles.forEach(collectible => {
        if (!collectible.collected && this.isColliding(this.chunko, collectible)) {
          this.collectFish(collectible);
        }
      });
      
      // Enemy collisions
      this.enemies.forEach(enemy => {
        if (enemy.alive && !this.chunko.invulnerable && this.isColliding(this.chunko, enemy)) {
          this.handleEnemyCollision(enemy);
        }
      });
      
      // NEW: Spike trap collisions
      this.checkSpikeCollisions();
    }
  
    // NEW: Spike collision detection
    checkSpikeCollisions() {
      this.spikes.forEach(spike => {
        if (!this.chunko.invulnerable && this.isColliding(this.chunko, spike)) {
          this.handleSpikeCollision(spike);
        }
      });
    }
  
    // NEW: Handle spike damage
    handleSpikeCollision(spike) {
      console.log('⚔️ Chunko hit spikes!');
      
      // Take damage
      this.chunko.health = Math.max(0, this.chunko.health - spike.damage);
      this.chunko.invulnerable = true;
      
      // Knockback from spikes
      this.chunko.velocityX = this.chunko.x < spike.x ? -8 : 8; // Push away from spike
      this.chunko.velocityY = -5; // Small jump
      
      // Visual and audio feedback
      this.createSpikeHitEffect(spike);
      this.playDamageSound();
      
      // Remove invulnerability after 1.5 seconds (longer for spikes)
      setTimeout(() => {
        if (this.chunko) {
          this.chunko.invulnerable = false;
          console.log('🛡️ Spike invulnerability removed');
        }
      }, 1500);
      
      console.log('💔 Chunko health after spikes:', this.chunko.health);
      
      // Check game over
      if (this.chunko.health <= 0) {
        console.log('💀 Game over from spikes!');
        setTimeout(() => this.gameOver(), 100);
      }
    }
  
    handleEnemyCollision(enemy) {
      console.log('💥 Enemy collision detected!');
      
      if (this.chunko.invulnerable) {
        console.log('🛡️ Chunko is invulnerable, ignoring collision');
        return;
      }
      
      if (this.chunko.velocityY > 0 && this.chunko.y < enemy.y - 10) {
        console.log('🦊 Defeating enemy by jumping on it!');
        enemy.alive = false;
        this.chunko.velocityY = -8;
        this.score.fish += Math.floor(25 * this.scoreMultiplier);
        
        try {
          this.createEnemyDefeatBurst(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
        } catch (e) {
          console.log('Particle effect failed, but continuing game');
        }
        
        this.showCollectionEffect('+25 🏆');
        this.playEnemyDefeatSound();
        
        console.log('🦊 Fox defeated! New score:', this.score.fish);
      } else {
        console.log('💔 Chunko taking damage!');
        this.chunko.health = Math.max(0, this.chunko.health - 1);
        this.chunko.invulnerable = true;
        
        this.chunko.velocityX = -5;
        this.chunko.velocityY = -3;
        
        try {
          this.createDamageEffect();
        } catch (e) {
          console.log('Damage effect failed, but continuing game');
        }
        
        this.playDamageSound();
        
        setTimeout(() => {
          if (this.chunko) {
            this.chunko.invulnerable = false;
            console.log('🛡️ Invulnerability removed');
          }
        }, 1000);
        
        console.log('💔 Chunko health now:', this.chunko.health);
        
        if (this.chunko.health <= 0) {
          console.log('💀 Game over triggered');
          setTimeout(() => this.gameOver(), 100);
        }
      }
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
      
      this.createFishCollectionBurst(fish.x + fish.width/2, fish.y + fish.height/2);
      this.showCollectionEffect('+' + Math.floor(10 * this.scoreMultiplier) + ' 🐟');
      this.playFishCollectSound();
      
      console.log('🐟 Fish collected! Score:', this.score.fish);
    }
  
    generateNewContent() {
      // NEW: Generate content faster at higher speeds (more challenge)
      const spawnRateMultiplier = 1 + (this.gameSpeed - this.baseGameSpeed) * 0.3;
      
      // Generate new fish occasionally
      if (Math.random() < 0.02 * spawnRateMultiplier) {
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
      if (Math.random() < 0.008 * spawnRateMultiplier) {
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
      
      // NEW: Generate new platforms occasionally
      if (Math.random() < 0.01 * spawnRateMultiplier) {
        const platformWidth = Math.max(80, 120 * this.viewport.scale);
        const platformHeight = Math.max(15, 25 * this.viewport.scale);
        
        this.platforms.push({
          x: this.viewport.width + 200,
          y: this.groundLevel - 80 - Math.random() * 150,
          width: platformWidth,
          height: platformHeight,
          type: 'static-platform',
          color: '#8B4513',
          solid: true
        });
      }
      
      // NEW: Generate new spikes occasionally (more frequent at higher speeds)
      if (Math.random() < 0.005 * spawnRateMultiplier) {
        const spikeWidth = Math.max(30, 40 * this.viewport.scale);
        const spikeHeight = Math.max(20, 30 * this.viewport.scale);
        
        this.spikes.push({
          x: this.viewport.width + 300,
          y: this.groundLevel - spikeHeight,
          width: spikeWidth,
          height: spikeHeight,
          type: 'spike-trap',
          damage: 1,
          color: '#696969'
        });
      }
    }
  
    render() {
      paper.project.clear();
      
      this.drawBackground();
      this.drawPlatforms(); // NEW
      this.drawSpikes(); // NEW
      this.drawChunko();
      this.drawCollectibles();
      this.drawEnemies();
      this.drawObstacles();
    }
  
    drawBackground() {
      const sky = new paper.Path.Rectangle({
        point: [0, 0],
        size: [this.viewport.width, this.groundLevel],
        fillColor: '#87CEEB'
      });
      
      const ground = new paper.Path.Rectangle({
        point: [0, this.groundLevel],
        size: [this.viewport.width, this.viewport.height - this.groundLevel],
        fillColor: '#90EE90'
      });
      
      const groundLine = new paper.Path.Line({
        from: [0, this.groundLevel],
        to: [this.viewport.width, this.groundLevel],
        strokeColor: '#228B22',
        strokeWidth: 3
      });
    }
  
    // NEW: Draw static platforms
    drawPlatforms() {
      this.platforms.forEach(platform => {
        // Create platform base
        const platformRect = new paper.Path.Rectangle({
          point: [platform.x, platform.y],
          size: [platform.width, platform.height],
          fillColor: platform.color,
          strokeColor: '#654321',
          strokeWidth: 2
        });
        
        // Add medieval stone texture lines
        for (let i = 1; i < 3; i++) {
          const stoneLine = new paper.Path.Line({
            from: [platform.x, platform.y + (platform.height / 3) * i],
            to: [platform.x + platform.width, platform.y + (platform.height / 3) * i],
            strokeColor: '#654321',
            strokeWidth: 1,
            opacity: 0.5
          });
        }
        
        // Add highlight on top for 3D effect
        const highlight = new paper.Path.Line({
          from: [platform.x, platform.y],
          to: [platform.x + platform.width, platform.y],
          strokeColor: '#A0522D',
          strokeWidth: 3
        });
      });
    }
  
    // NEW: Draw spike traps
    drawSpikes() {
      this.spikes.forEach(spike => {
        const numSpikes = Math.floor(spike.width / 8); // Spike density
        const spikeWidth = spike.width / numSpikes;
        
        for (let i = 0; i < numSpikes; i++) {
          const spikeX = spike.x + i * spikeWidth;
          
          // Create triangular spike
          const spikeTriangle = new paper.Path([
            new paper.Point(spikeX, spike.y + spike.height),
            new paper.Point(spikeX + spikeWidth/2, spike.y),
            new paper.Point(spikeX + spikeWidth, spike.y + spike.height)
          ]);
          
          spikeTriangle.fillColor = spike.color;
          spikeTriangle.strokeColor = '#2F4F4F';
          spikeTriangle.strokeWidth = 1;
          
          // Add danger glow effect
          const glowSpike = new paper.Path([
            new paper.Point(spikeX, spike.y + spike.height),
            new paper.Point(spikeX + spikeWidth/2, spike.y),
            new paper.Point(spikeX + spikeWidth, spike.y + spike.height)
          ]);
          
          glowSpike.strokeColor = '#FF4500';
          glowSpike.strokeWidth = 2;
          glowSpike.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2; // Pulsing effect
        }
        
        // Add warning base
        const base = new paper.Path.Rectangle({
          point: [spike.x, spike.y + spike.height - 3],
          size: [spike.width, 3],
          fillColor: '#8B0000'
        });
      });
    }
  
    drawChunko() {
      if (!this.chunko) return;
      
      const centerX = this.chunko.x + this.chunko.width/2;
      const centerY = this.chunko.y + this.chunko.height/2;
      const radius = this.chunko.width/2;
      
      const chunkoBody = new paper.Shape.Circle({
        center: [centerX, centerY],
        radius: radius,
        fillColor: '#FFD700',
        strokeColor: '#FF8C00',
        strokeWidth: Math.max(2, radius * 0.1)
      });
      
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
      
      if (this.chunko.invulnerable && Math.floor(Date.now() / 100) % 2) {
        [chunkoBody, leftEar, rightEar, leftEye, rightEye].forEach(shape => {
          shape.opacity = 0.5;
        });
      }
    }
  
    drawCollectibles() {
      this.collectibles.forEach((collectible, index) => {
        if (!collectible.collected) {
          const centerX = collectible.x + collectible.width/2;
          const centerY = collectible.y + collectible.height/2;
          const fishWidth = collectible.width;
          const fishHeight = collectible.height * 0.7;
          
          const fishBody = new paper.Shape.Ellipse({
            center: [centerX, centerY],
            size: [fishWidth, fishHeight],
            fillColor: '#00FFFF',
            strokeColor: '#008B8B',
            strokeWidth: Math.max(2, fishWidth * 0.08)
          });
          
          const tailSize = fishWidth * 0.4;
          const tail = new paper.Path.RegularPolygon({
            center: [collectible.x + collectible.width + tailSize/2, centerY],
            sides: 3,
            radius: tailSize,
            fillColor: '#00FFFF',
            strokeColor: '#008B8B',
            strokeWidth: Math.max(1, tailSize * 0.1)
          });
          
          const floatOffset = Math.sin(Date.now() * 0.003 + collectible.x * 0.01) * 5;
          fishBody.position.y += floatOffset;
          tail.position.y += floatOffset;
        }
      });
    }
  
    drawEnemies() {
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          const centerX = enemy.x + enemy.width/2;
          const centerY = enemy.y + enemy.height/2;
          const radius = enemy.width/2;
          
          const foxBody = new paper.Shape.Ellipse({
            center: [centerX, centerY],
            size: [enemy.width, enemy.height * 0.8],
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(2, radius * 0.1)
          });
          
          const tailRadius = radius * 0.6;
          const tail = new paper.Shape.Circle({
            center: [enemy.x + enemy.width + tailRadius, centerY],
            radius: tailRadius,
            fillColor: '#D2691E',
            strokeColor: '#8B4513',
            strokeWidth: Math.max(1, tailRadius * 0.1)
          });
          
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
  
    // NEW: Platform landing particle effect
    createPlatformLandParticles(platform) {
      const landPoint = new paper.Point(
        platform.x + platform.width/2, 
        platform.y
      );
      
      this.burst(landPoint, {
        numParticles: 8,
        colors: ['#8B4513', '#A0522D', '#DEB887'],
        particleSize: 2,
        moveRange: 20
      });
    }
  
    // NEW: Spike hit effect
    createSpikeHitEffect(spike) {
      const hitPoint = new paper.Point(
        spike.x + spike.width/2, 
        spike.y + spike.height/2
      );
      
      this.burst(hitPoint, {
        numParticles: 12,
        colors: ['#FF4500', '#FF6347', '#DC143C'],
        particleSize: 3,
        moveRange: 30
      });
    }
  
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
      
      particles.forEach((particle, i) => {
        const angle = (Math.PI * 2 * i) / numParticles + Math.random() * 0.5;
        const distance = moveRange + Math.random() * 40;
        const targetX = point.x + Math.cos(angle) * distance;
        const targetY = point.y + Math.sin(angle) * distance;
        
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
      
      const healthFill = document.querySelector('.health-fill');
      if (this.chunko && healthFill) {
        const healthPercent = (this.chunko.health / this.characterStats.health) * 100;
        healthFill.style.width = healthPercent + '%';
      }
      
      // NEW: Add speed indicator to UI
      this.updateSpeedIndicator();
    }
  
    // NEW: Show current speed to player
    updateSpeedIndicator() {
      let speedDisplay = document.getElementById('speed-display');
      if (!speedDisplay) {
        speedDisplay = document.createElement('div');
        speedDisplay.id = 'speed-display';
        speedDisplay.style.cssText = `
          position: absolute;
          top: 90px;
          right: 20px;
          background: rgba(60, 40, 24, 0.8);
          border: 2px solid #f1c40f;
          border-radius: 10px;
          padding: 0.5rem 1rem;
          color: #f4e4c1;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          z-index: 15;
        `;
        document.querySelector('.game-screen').appendChild(speedDisplay);
      }
      
      const speedPercent = Math.round(((this.gameSpeed - this.baseGameSpeed) / (this.maxGameSpeed - this.baseGameSpeed)) * 100);
      const speedColor = speedPercent > 80 ? '#e74c3c' : speedPercent > 50 ? '#f39c12' : '#27ae60';
      
      speedDisplay.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>🚀 Speed:</span>
          <div style="background: rgba(244, 228, 193, 0.3); width: 60px; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${speedColor}; width: ${speedPercent}%; height: 100%; border-radius: 4px; transition: width 0.3s ease;"></div>
          </div>
          <span style="color: ${speedColor};">${speedPercent}%</span>
        </div>
      `;
    }
  
    // Sound effects
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
  
    // Game state management
    pauseGame() {
      this.gameState = 'paused';
      document.getElementById('pause-screen').classList.remove('hidden');
    }
  
    resumeGame() {
      this.gameState = 'playing';
      document.getElementById('pause-screen').classList.add('hidden');
    }
  
    restartGame() {
      this.score.fish = 0;
      this.score.distance = 0;
      this.gameSpeed = this.baseGameSpeed; // NEW: Reset speed to base
      
      document.getElementById('game-over-screen').classList.add('hidden');
      document.getElementById('pause-screen').classList.add('hidden');
      
      // NEW: Remove speed indicator when restarting
      const speedDisplay = document.getElementById('speed-display');
      if (speedDisplay) {
        speedDisplay.remove();
      }
      
      this.showDialogueScreen();
    }
  
    gameOver() {
      console.log('💀 Game Over!');
      
      this.gameState = 'gameOver';
      
      const totalScore = this.score.fish + Math.floor(this.score.distance);
      if (totalScore > this.score.best) {
        this.score.best = totalScore;
        localStorage.setItem('chunko-best-score', this.score.best);
      }
      
      document.getElementById('final-fish').textContent = this.score.fish;
      document.getElementById('final-distance').textContent = Math.floor(this.score.distance) + 'm';
      document.getElementById('best-score').textContent = this.score.best;
      
      const gameOverJoke = ChunkoJokes.special.gameOver[0];
      document.getElementById('final-joke').textContent = gameOverJoke.joke;
      
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
      if (soundBtn) {
        soundBtn.textContent = this.audioEnabled ? '🔊' : '🔇';
      }
    }
  
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏰 Starting Chunko the Medieval Feline Game!');
    console.log('🏗️ Obstacles system initialized');
    console.log('⚔️ Platforms and spikes ready');
    
    window.chunkoGame = new ChunkoGame();
    
    console.log('🎮 Game instance created successfully');
    console.log('🚀 Ready to begin medieval cat adventure!');
  });