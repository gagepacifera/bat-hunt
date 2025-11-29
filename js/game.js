class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ui = new UI();

        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'ended'
        this.timer = 80;
        this.lastTime = 0;

        // Input
        this.keys = {};

        // Entities
        this.players = [];
        this.bats = [];
        this.pumpkins = [];

        // Effects
        this.snowflakes = [];
        this.fireworks = [];

        // Collision tracking
        this.recentCollisions = {};

        // Image assets
        this.images = {
            witchPurple: null,
            witchPink: null,
            bat: null,
            pumpkin: null,
            background: null
        };

        this.imagesLoaded = false;
        this.loadImages();
    }

    loadImages() {
        // Get the base path (works for both local and GitHub Pages)
        const basePath = window.location.pathname.endsWith('.html')
            ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
            : window.location.pathname;
        const base = basePath.endsWith('/') ? basePath : basePath + '/';

        const imagePaths = {
            witchPurple: `${base}assets/images/SVG/witch-purple.svg`,
            witchPink: `${base}assets/images/SVG/witch-pink.svg`,
            bat: `${base}assets/images/SVG/bat.svg`,
            pumpkin: `${base}assets/images/SVG/pumpkin.svg`,
            background: `${base}assets/images/SVG/bat-hunt-bg.svg`
        };

        let loadedCount = 0;
        const totalImages = Object.keys(imagePaths).length;

        Object.keys(imagePaths).forEach(key => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                    this.init();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${imagePaths[key]}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                    this.init();
                }
            };
            img.src = imagePaths[key];
            this.images[key] = img;
        });
    }

    init() {
        // Create players with image references
        this.players.push(new Player(
            1,
            100,
            this.canvas.height / 2,
            '#9b59b6',
            { up: 'w', down: 's', left: 'a', right: 'd' },
            this.images.witchPurple
        ));

        this.players.push(new Player(
            2,
            this.canvas.width - 150,
            this.canvas.height / 2,
            '#e74c3c',
            { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
            this.images.witchPink
        ));

        // Create bats with image reference
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.bats.push(new Bat(x, y, this.images.bat));
        }

        // Create pumpkins with image reference
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.pumpkins.push(new Pumpkin(x, y, this.images.pumpkin));
        }

        // Create snowflakes for blizzard effect
        for (let i = 0; i < 150; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                velocityY: Math.random() * 2 + 1,
                velocityX: Math.random() * 1 - 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2
            });
        }

        // Set up input listeners
        this.setupInput();

        // Initialize touch controls (will auto-detect and show if touch device)
        this.touchControls = new TouchControls(this);

        // Show start screen
        this.ui.showStartScreen();

        // Start game loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Handle space bar for game state transitions
            if (e.key === ' ') {
                e.preventDefault();
                if (this.gameState === 'start') {
                    this.startGame();
                } else if (this.gameState === 'ended') {
                    this.resetGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    startGame() {
        this.gameState = 'playing';
        this.timer = 80;
        this.ui.hideOverlay();
        this.lastTime = performance.now();
    }

    resetGame() {
        // Reset players
        this.players[0].reset(100, this.canvas.height / 2);
        this.players[1].reset(this.canvas.width - 150, this.canvas.height / 2);

        // Reset bats
        this.bats.forEach(bat => {
            bat.respawn(this.canvas.width, this.canvas.height);
        });

        // Clear collision tracking
        this.recentCollisions = {};

        // Start new game
        this.startGame();
    }

    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = (timestamp - this.lastTime) / 16.67; // Normalize to ~60fps
        this.lastTime = timestamp;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background
        this.renderBackground();

        // Render blizzard
        this.updateAndRenderBlizzard(deltaTime);

        if (this.gameState === 'playing') {
            // Update timer
            this.timer -= deltaTime / 60;
            if (this.timer <= 0) {
                this.timer = 0;
                this.endGame();
            }
            this.ui.updateTimer(Math.ceil(this.timer));

            // Update entities
            this.update(deltaTime);

            // Check collisions
            handleCollisions(this);

            // Update UI
            this.ui.updateScores(this.players[0].score, this.players[1].score);
        }

        // Render entities
        this.render();

        // Continue game loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(deltaTime) {
        // Update players
        this.players.forEach(player => {
            player.update(deltaTime, this.keys, this.canvas.width, this.canvas.height);
        });

        // Update bats
        this.bats.forEach(bat => {
            bat.update(deltaTime, this.canvas.width, this.canvas.height);
        });

        // Update pumpkins (for jiggle animation)
        this.pumpkins.forEach(pumpkin => {
            pumpkin.update(deltaTime);
        });

        // Update fireworks
        this.fireworks.forEach((firework, index) => {
            firework.update(deltaTime);
            // Remove inactive fireworks
            if (!firework.active) {
                this.fireworks.splice(index, 1);
            }
        });
    }

    render() {
        // Render pumpkins
        this.pumpkins.forEach(pumpkin => {
            pumpkin.render(this.ctx);
        });

        // Render bats
        this.bats.forEach(bat => {
            bat.render(this.ctx);
        });

        // Render fireworks
        this.fireworks.forEach(firework => {
            firework.render(this.ctx);
        });

        // Render players
        this.players.forEach(player => {
            // Flash effect when hit
            if (!player.isHit || Date.now() % 100 > 50) {
                player.render(this.ctx);
            }
        });
    }

    renderBackground() {
        if (this.images.background && this.images.background.complete) {
            // Draw the SVG background with "cover" behavior (fills entire canvas, may crop)
            const img = this.images.background;
            const canvasAspect = this.canvas.width / this.canvas.height;
            const imgAspect = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                // Canvas is wider than image - fit to width
                drawWidth = this.canvas.width;
                drawHeight = this.canvas.width / imgAspect;
                offsetX = 0;
                offsetY = (this.canvas.height - drawHeight) / 2;
            } else {
                // Canvas is taller than image - fit to height
                drawWidth = this.canvas.height * imgAspect;
                drawHeight = this.canvas.height;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            // Fallback: Dark forest background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#0a0520');
            gradient.addColorStop(0.5, '#1a0a2e');
            gradient.addColorStop(1, '#0f051d');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    updateAndRenderBlizzard(deltaTime) {
        this.snowflakes.forEach(flake => {
            // Update position
            flake.y += flake.velocityY * deltaTime;
            flake.x += flake.velocityX * deltaTime;

            // Wrap around screen
            if (flake.y > this.canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * this.canvas.width;
            }
            if (flake.x < 0) {
                flake.x = this.canvas.width;
            } else if (flake.x > this.canvas.width) {
                flake.x = 0;
            }

            // Render snowflake
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    endGame() {
        this.gameState = 'ended';
        this.ui.showEndScreen(this.players[0].score, this.players[1].score);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
