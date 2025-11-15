# Bat Hunt

A competitive two-player witch racing game inspired by Joust. Collect bats while dodging pumpkins in a spooky forest blizzard!

## How to Play

1. Open `index.html` in a web browser
2. Press **SPACE** to start the game
3. Collect as many bats as possible within 60 seconds
4. Avoid pumpkins or lose points!

### Controls

**Player 1:**
- W - Move Up
- A - Move Left
- S - Move Down
- D - Move Right

**Player 2:**
- ↑ - Move Up
- ← - Move Left
- ↓ - Move Down
- → - Move Right

### Scoring

- Collect a bat: **+1 point**
- Hit a pumpkin: **-1 point**
- Player with the most points after 60 seconds wins!

## Development Status

### Phase 1: Core Setup ✅ COMPLETE
- [x] Project structure created
- [x] HTML5 Canvas setup
- [x] Basic game loop implemented
- [x] Player class with Joust-like physics
- [x] Keyboard input handling
- [x] Two-player controls working
- [x] Bat entities with movement
- [x] Pumpkin obstacles
- [x] Collision detection
- [x] Scoring system
- [x] 60-second timer
- [x] Game states (start, playing, end)
- [x] UI overlay and HUD
- [x] Blizzard particle effect
- [x] Forest background

### Current Features

- Two-player local multiplayer
- Momentum-based movement (Joust-style physics)
- 8 moving bats that respawn when caught
- 12 stationary pumpkin obstacles
- Real-time score tracking
- 60-second countdown timer
- Winner announcement at game end
- Atmospheric blizzard weather effect
- Dark forest background

### Next Steps (Phase 2-6)

See `TECHNICAL_SPEC.md` for full implementation roadmap.

Potential enhancements:
- Custom sprite artwork for witches, bats, and pumpkins
- Sound effects and background music
- More visual polish and animations
- Additional game modes
- Power-ups

## Technical Details

- **Technology**: Vanilla JavaScript, HTML5 Canvas, CSS3
- **No dependencies**: Pure web technologies
- **Resolution**: 1200x800 pixels
- **Target FPS**: 60

## File Structure

```
bat-hunt/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Game styling
├── js/
│   ├── game.js         # Main game loop
│   ├── player.js       # Player class
│   ├── bat.js          # Bat entity
│   ├── pumpkin.js      # Pumpkin obstacle
│   ├── collision.js    # Collision detection
│   └── ui.js           # UI management
├── assets/             # Future home for sprites/sounds
├── TECHNICAL_SPEC.md   # Full technical documentation
└── README.md           # This file
```

## Browser Compatibility

Tested on modern browsers:
- Chrome
- Firefox
- Safari
- Edge

Requires HTML5 Canvas support.

---

**Version**: 1.0 (Phase 1 Complete)
**Last Updated**: 2025-11-15
