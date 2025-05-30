// Chunko the Medieval Feline - Epic Jokes Database
// Random medieval cat jokes for each character type

const ChunkoJokes = {
    // 🐱⚔️ CHUNKO THE KNIGHT JOKES
    knight: [
      {
        joke: "Hark! Why did the dragon refuse to fight me? Because he was a-feline intimidated! *purr-hahaha*",
        sound: "armor_clank_meow",
        gesture: "proud_stance"
      },
      {
        joke: "Verily, I am not kitten around about this quest! Time to paws and reflect... nay, time for action!",
        sound: "determined_mrow_clank",
        gesture: "sword_raise"
      },
      {
        joke: "What doth a medieval cat call his army? His purr-sonal guard! Now let us venture forth!",
        sound: "trumpet_fanfare_purr",
        gesture: "heroic_point"
      },
      {
        joke: "Mine armor is purr-fectly polished for battle! Though I must say, it does make me look rather a-mew-sing!",
        sound: "armor_polish_chuckle",
        gesture: "armor_admire"
      },
      {
        joke: "By my whiskers! Why do knights prefer cats? Because we always land on our feet in battle! *noble meow*",
        sound: "victory_purr_clank",
        gesture: "triumphant_pose"
      },
      {
        joke: "What be the difference between a knight and a cat? One serves the king, the other thinks HE is the king! *regal purr*",
        sound: "royal_meow_trumpet",
        gesture: "crown_adjust"
      }
    ],
  
    // 🐱🧙‍♂️ CHUNKO THE WIZARD JOKES  
    wizard: [
      {
        joke: "Why doth wizards prefer cats as familiars? Because we're simply purr-fessional! *mystical meow*",
        sound: "magical_sparkle_wise_mew",
        gesture: "spell_cast"
      },
      {
        joke: "Behold! I shall cast a spell most wondrous... Abra-ca-tabby! *snorts at own joke*",
        sound: "magic_whoosh_giggle_purr",
        gesture: "dramatic_spell"
      },
      {
        joke: "What be the difference between a cat and a spell? One has claws, the other has clauses! *sage nod*",
        sound: "spell_charge_scholarly_meow",
        gesture: "wise_nod"
      },
      {
        joke: "Mine crystal ball shows... *peers intently* ...that I shall find many fish today! The magic never lies! *mystical purr*",
        sound: "crystal_chime_pleased_mew",
        gesture: "crystal_gaze"
      },
      {
        joke: "Why did the wizard's cat fail magic school? He kept casting spell-bound instead of spellbound! *magical chortle*",
        sound: "failed_spell_amused_purr",
        gesture: "spell_fizzle"
      },
      {
        joke: "What doth ye call a magical cat? A purr-omancer! Now witness my powers! *dramatic cape swirl*",
        sound: "cape_swish_mystical_meow",
        gesture: "cape_dramatic"
      }
    ],
  
    // 🐱🗡️ CHUNKO THE ROGUE JOKES
    rogue: [
      {
        joke: "Psst... Why do rogues love cats? We both have nine lives and sticky paws! *mischievous snicker*",
        sound: "sneaky_footsteps_sly_meow",
        gesture: "sneaky_crouch"
      },
      {
        joke: "They call me a cat burglar, but I prefer 'acquisition specialist'! *winks*",
        sound: "coin_jingle_cheeky_purr",
        gesture: "coin_flip"
      },
      {
        joke: "What's a thief's favorite type of cat? A purr-petrator! Now let's get sneaky!",
        sound: "stealth_sound_whispered_mrow",
        gesture: "stealth_pose"
      },
      {
        joke: "Why don't rogues ever get caught? Because we're always feline fine! *smug grin*",
        sound: "smug_chuckle_quiet_purr",
        gesture: "smug_lean"
      },
      {
        joke: "What be the rogue's motto? 'If at first you don't succeed, try, try, a-gain... quietly!' *stealthy meow*",
        sound: "whisper_sneak_clever_mew",
        gesture: "finger_to_lips"
      },
      {
        joke: "Mine stealth is so good, even my own shadow loses track of me! Though it does make for lonely conversations... *sly purr*",
        sound: "shadow_whoosh_lonely_mew",
        gesture: "shadow_check"
      }
    ],
  
    // 🎭 UNIVERSAL CHUNKO JOKES (can be used by any character)
    universal: [
      {
        joke: "Why don't medieval cats play poker? Too many cheetahs in the kingdom! *ba-dum-tss purr*",
        sound: "drum_roll_ba_dum_tss",
        gesture: "rimshot_pose"
      },
      {
        joke: "What doth ye call a cat who works for the royal court? A diplomatic-cat! *sophisticated meow*",
        sound: "royal_fanfare_dignified_purr",
        gesture: "bow_formal"
      },
      {
        joke: "Mine biggest fear? A rocking chair! Though I must admit, the puns are quite a-mew-sing! *nervous chuckle*",
        sound: "nervous_giggle_worried_mew",
        gesture: "chair_dodge"
      },
      {
        joke: "Why did the medieval cat become a bard? Because he had perfect pitch... when knocking things off tables! *musical meow*",
        sound: "lute_strum_mischievous_purr",
        gesture: "lute_strum"
      }
    ],
  
    // 🎯 DIFFICULTY-BASED JOKE MODIFIERS
    difficultyModifiers: {
      peasant: {
        prefix: "*clears throat gently* ",
        suffix: " *cheerful purr*",
        tone: "gentle"
      },
      knight: {
        prefix: "*adjusts armor proudly* ",
        suffix: " *confident meow*",
        tone: "noble"
      },
      'dragon-slayer': {
        prefix: "*eyes gleam with battle-hardened wisdom* ",
        suffix: " *epic war cry purr*",
        tone: "legendary"
      }
    },
  
    // 🎲 JOKE SELECTION SYSTEM
    getRandomJoke(character, difficulty) {
      // Get character-specific jokes
      const characterJokes = this[character] || this.knight;
      
      // Add some universal jokes to the pool (20% chance)
      const allJokes = [...characterJokes];
      if (Math.random() < 0.2) {
        allJokes.push(...this.universal);
      }
      
      // Select random joke
      const selectedJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
      
      // Apply difficulty modifier
      const modifier = this.difficultyModifiers[difficulty] || this.difficultyModifiers.knight;
      
      return {
        ...selectedJoke,
        joke: modifier.prefix + selectedJoke.joke + modifier.suffix,
        tone: modifier.tone,
        character: character,
        difficulty: difficulty
      };
    },
  
    // 🎪 SPECIAL OCCASION JOKES (for later use)
    special: {
      firstPlay: [
        {
          joke: "Welcome to mine realm, brave adventurer! Prepare thyself for puns most terrible and adventures most whimsical! *grand gesture*",
          sound: "grand_welcome_fanfare",
          gesture: "grand_welcome"
        }
      ],
      
      gameOver: [
        {
          joke: "Fear not! Even the mightiest cat has but nine lives... and I've got eight left! *optimistic purr*",
          sound: "comeback_determination",
          gesture: "dust_off"
        }
      ],
      
      highScore: [
        {
          joke: "By mine whiskers! Thou art truly the cat's meow of adventurers! *proud purr*",
          sound: "achievement_fanfare",
          gesture: "victory_dance"
        }
      ]
    }
  };
  
  // 🎵 SOUND EFFECT MAPPINGS for each joke type
  const JokeSounds = {
    // Knight sounds
    armor_clank_meow: () => console.log('🔊 *CLANK CLANK* + *Proud MEOW*'),
    determined_mrow_clank: () => console.log('🔊 *Determined MROW* + *Armor Clinking*'),
    trumpet_fanfare_purr: () => console.log('🔊 *TRUMPET FANFARE* + *Heroic Purr*'),
    
    // Wizard sounds  
    magical_sparkle_wise_mew: () => console.log('🔊 *MAGICAL SPARKLES* + *Wise Mew*'),
    magic_whoosh_giggle_purr: () => console.log('🔊 *MAGIC WHOOSH* + *Giggling Purr*'),
    spell_charge_scholarly_meow: () => console.log('🔊 *SPELL CHARGING* + *Scholarly Meow*'),
    
    // Rogue sounds
    sneaky_footsteps_sly_meow: () => console.log('🔊 *Sneaky Footsteps* + *Sly Meow*'),
    coin_jingle_cheeky_purr: () => console.log('🔊 *Coin Jingle* + *Cheeky Purr*'),
    stealth_sound_whispered_mrow: () => console.log('🔊 *Stealth Sound* + *Whispered Mrow*'),
    
    // Universal sounds
    drum_roll_ba_dum_tss: () => console.log('🔊 *Medieval Drum Roll* + *BA-DUM-TSS*'),
    royal_fanfare_dignified_purr: () => console.log('🔊 *Royal Fanfare* + *Dignified Purr*')
  };
  
  // 🎭 GESTURE ANIMATIONS (for visual joke delivery)
  const JokeGestures = {
    proud_stance: "character stands tall with chest out",
    sword_raise: "raises sword triumphantly", 
    heroic_point: "points forward heroically",
    spell_cast: "waves hands mystically",
    dramatic_spell: "dramatic spell casting pose",
    wise_nod: "nods sagely with eyes closed",
    sneaky_crouch: "crouches in stealth position",
    coin_flip: "flips coin with sly grin",
    stealth_pose: "finger to lips, looking around",
    rimshot_pose: "jazz hands after punchline",
    bow_formal: "formal courtly bow"
  };
  
  // Export for use in game
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChunkoJokes, JokeSounds, JokeGestures };
  }
  
  console.log('🎭 Chunko Medieval Jokes Database Loaded!');
  console.log(`📚 Available: ${ChunkoJokes.knight.length} Knight jokes, ${ChunkoJokes.wizard.length} Wizard jokes, ${ChunkoJokes.rogue.length} Rogue jokes`);