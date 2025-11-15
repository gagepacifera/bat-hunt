# Bat Hunt - Technical Specification & Implementation Guide

## Overview
Bat Hunt is a competitive single-page web application game inspired by Joust mechanics. Two players control witches on broomsticks, competing to collect the most bats within 60 seconds while avoiding stationary pumpkin obstacles.

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Graphics**: HTML5 Canvas API
- **No external dependencies or frameworks**

## Game Mechanics

### Core Gameplay
- **Objective**: Collect as many bats as possible within 60 seconds
- **Players**: 2 players (local multiplayer)
- **Time Limit**: 60 seconds per game session
- **Scoring**:
  - +1 point per bat collected
  - -1 point when hitting a pumpkin
  - Minimum score: 0 (cannot go below zero)

### Game Elements

#### 1. Players (Witches on Brooms)
- **Count**: 2 witches
- **Controls**:
  - Player 1: WASD or Arrow keys (to be determined)
  - Player 2: Arrow keys or IJKL (to be determined)
- **Movement**:
  - Multi-directional movement (up, down, left, right)
  - Joust-like physics (momentum/inertia)
  - Screen boundaries prevent moving off-screen
- **Collision Detection**:
  - With bats (triggers collection)
  - With pumpkins (triggers penalty)
  - With other player (behavior to be determined)

#### 2. Bats (Collectibles)
- **Behavior**: Move continuously on screen
- **Movement Pattern**: Random or predefined flight patterns
- **Regeneration**: Respawn at random position after being caught
- **Value**: 1 point each
- **Quantity**: To be determined (recommended: 5-10 simultaneous bats)

#### 3. Pumpkins (Obstacles)
- **Behavior**: Stationary obstacles
- **Placement**: Fixed or random positions (to be determined)
- **Collision Effect**: -1 point to the colliding player
- **Quantity**: To be determined (recommended: 8-15 pumpkins)

#### 4. Environment
- **Background**: Forest scene
- **Weather Effect**: Blizzard animation
- **Layers**:
  - Background layer: Forest
  - Weather layer: Blizzard particle effect
  - Game layer: Players, bats, pumpkins
  - UI layer: Scores, timer

### User Interface

#### HUD Elements
- **Top Section**:
  - Player 1 Score (left side)
  - Timer (center) - displays remaining seconds
  - Player 2 Score (right side)
- **Game States**:
  - Start screen with instructions
  - Active gameplay
  - End screen with final scores and winner declaration

## Technical Implementation

### File Structure
```
bat-hunt/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Game styling
├── js/
│   ├── game.js         # Main game loop and state management
│   ├── player.js       # Player class and controls
│   ├── bat.js          # Bat entity class
│   ├── pumpkin.js      # Pumpkin obstacle class
│   ├── collision.js    # Collision detection logic
│   └── ui.js           # UI rendering and updates
├── assets/
│   ├── images/         # Sprite images
│   └── sounds/         # Audio files (optional)
└── README.md           # Project documentation
```

### Core Components

#### 1. Game Loop (`game.js`)
```javascript
// Pseudo-code structure
class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.gameState = 'start'; // start, playing, ended
    this.timer = 60;
    this.players = [];
    this.bats = [];
    this.pumpkins = [];
  }

  init() {
    // Initialize canvas, players, bats, pumpkins
  }

  gameLoop() {
    // Update game state (60 FPS)
    // Clear canvas
    // Update entities
    // Check collisions
    // Render all elements
    // Update UI
    // Request next frame
  }

  update(deltaTime) {
    // Update timer
    // Update player positions
    // Update bat positions
    // Check for game end
  }

  render() {
    // Draw background
    // Draw blizzard effect
    // Draw pumpkins
    // Draw bats
    // Draw players
  }
}
```

#### 2. Player Class (`player.js`)
```javascript
class Player {
  constructor(id, x, y, controls) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.score = 0;
    this.controls = controls; // Key mappings
    this.width = 40;
    this.height = 40;
  }

  update(deltaTime) {
    // Apply physics
    // Update position based on velocity
    // Handle friction/momentum
    // Constrain to screen bounds
  }

  handleInput(keys) {
    // Check pressed keys
    // Apply acceleration
  }

  addScore(points) {
    this.score = Math.max(0, this.score + points);
  }

  render(ctx) {
    // Draw witch sprite
  }
}
```

#### 3. Bat Class (`bat.js`)
```javascript
class Bat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = random(-2, 2);
    this.velocityY = random(-2, 2);
    this.width = 30;
    this.height = 30;
    this.active = true;
  }

  update(deltaTime) {
    // Update position
    // Bounce off screen edges or wrap around
    // Simple AI movement pattern
  }

  respawn() {
    // Generate random position
    // Reset velocity
    this.active = true;
  }

  render(ctx) {
    // Draw bat sprite
  }
}
```

#### 4. Pumpkin Class (`pumpkin.js`)
```javascript
class Pumpkin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 35;
  }

  render(ctx) {
    // Draw pumpkin sprite
  }
}
```

#### 5. Collision Detection (`collision.js`)
```javascript
function checkCollision(rect1, rect2) {
  // AABB collision detection
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function handleCollisions(game) {
  // Check player-bat collisions
  // Check player-pumpkin collisions
  // Optional: Check player-player collisions
}
```

### Canvas Setup
- **Recommended Resolution**: 1200x800 pixels
- **Rendering**: 60 FPS using `requestAnimationFrame`
- **Coordinate System**: Standard canvas (0,0 at top-left)

### Input Handling
```javascript
// Key state tracking
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});
```

**Proposed Control Schemes**:
- **Player 1**: W (up), A (left), S (down), D (right)
- **Player 2**: Arrow keys (↑, ←, ↓, →)

### Visual Effects

#### Background (Forest)
- Static or parallax scrolling forest image
- Dark, atmospheric color palette
- Trees, fog elements

#### Blizzard Effect
```javascript
class BlizzardParticle {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = random(0, canvas.height);
    this.velocityY = random(2, 5);
    this.velocityX = random(-1, 1);
    this.opacity = random(0.3, 0.8);
    this.size = random(2, 5);
  }

  update() {
    // Move particle downward with slight drift
    // Wrap around screen when reaching bottom
  }

  render(ctx) {
    // Draw white/blue semi-transparent circle
  }
}
```

### Game States

#### 1. Start Screen
- Display game title
- Show controls for both players
- "Press SPACE to Start" message
- Instructions summary

#### 2. Playing State
- Active gameplay
- Timer counting down
- Score updates in real-time
- All entities active

#### 3. End Screen
- Display final scores
- Announce winner
- "Press SPACE to Restart" message
- Option to return to start screen

### Timer Implementation
```javascript
class Timer {
  constructor(duration) {
    this.duration = duration;
    this.remaining = duration;
    this.active = false;
  }

  start() {
    this.remaining = this.duration;
    this.active = true;
  }

  update(deltaTime) {
    if (this.active) {
      this.remaining -= deltaTime;
      if (this.remaining <= 0) {
        this.remaining = 0;
        this.active = false;
        return true; // Signal game end
      }
    }
    return false;
  }

  getDisplayTime() {
    return Math.ceil(this.remaining);
  }
}
```

## Art Assets Requirements

### Sprites Needed
1. **Witch on Broom**: ~40x40px (2 variations for different players)
2. **Bat**: ~30x30px (animated flying pose optional)
3. **Pumpkin**: ~35x35px
4. **Forest Background**: 1200x800px
5. **Snowflake/Blizzard particle**: Small white/blue dot

### Asset Options
- Hand-drawn sprites
- Pixel art
- Use placeholder shapes initially (can be replaced later)

## Sound Effects (Optional Enhancement)
- Bat collection sound
- Pumpkin collision sound
- Background music (spooky theme)
- Game start/end sounds
- Timer warning (last 10 seconds)

## Performance Considerations
- Target 60 FPS on modern browsers
- Efficient collision detection (spatial partitioning if needed)
- Optimize particle count for blizzard effect
- Use sprite sheets for animations
- Minimize DOM manipulation (use canvas exclusively for game rendering)

## Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- HTML5 Canvas support required
- CSS3 for layout and styling

## Development Phases

### Phase 1: Core Setup
- [x] Create project structure
- [ ] Set up HTML5 Canvas
- [ ] Implement basic game loop
- [ ] Create Player class with movement
- [ ] Implement keyboard input handling

### Phase 2: Game Entities
- [ ] Create Bat class with movement
- [ ] Create Pumpkin class
- [ ] Implement collision detection
- [ ] Add scoring system

### Phase 3: Game Logic
- [ ] Implement 60-second timer
- [ ] Add game states (start, playing, end)
- [ ] Create UI overlay for scores and timer
- [ ] Add bat respawn logic

### Phase 4: Visual Polish
- [ ] Add forest background
- [ ] Implement blizzard particle effect
- [ ] Create/integrate sprite assets
- [ ] Add visual feedback for collisions

### Phase 5: Testing & Refinement
- [ ] Balance gameplay (bat speed, pumpkin placement)
- [ ] Test two-player controls
- [ ] Fix bugs and edge cases
- [ ] Optimize performance
- [ ] Add game instructions

### Phase 6: Optional Enhancements
- [ ] Sound effects
- [ ] Animations
- [ ] Power-ups
- [ ] Different difficulty levels
- [ ] High score persistence (localStorage)

## Testing Checklist
- [ ] Both players can move independently
- [ ] Collisions detected accurately
- [ ] Score updates correctly
- [ ] Timer counts down properly
- [ ] Bats respawn after collection
- [ ] Pumpkin penalties apply correctly
- [ ] Game ends at 0 seconds
- [ ] Winner is displayed correctly
- [ ] Game can be restarted
- [ ] No performance issues at 60 FPS
- [ ] Works across different browsers

## Known Design Decisions to Finalize
1. Exact number of bats on screen simultaneously
2. Exact number and placement of pumpkins
3. Player-to-player collision behavior
4. Bat movement patterns (random vs. programmed)
5. Physics values (acceleration, friction, max speed)
6. Visual style for sprites
7. Pumpkin respawn rules (if applicable)
8. Boundary behavior for bats (bounce vs. wrap)

## Future Enhancements
- Mobile touch controls
- Online multiplayer
- Additional characters/skins
- Multiple levels with different backgrounds
- Power-ups (speed boost, temporary invincibility)
- Leaderboard
- Achievements
- Practice mode (single player vs. AI)

## References
- Joust (1982) - Original arcade game for mechanics inspiration
- HTML5 Canvas API Documentation
- JavaScript Game Development best practices

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Status**: Initial specification - ready for implementation
