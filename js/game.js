class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ui = new UI();

        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'ended'
        this.timer = 60;
        this.lastTime = 0;

        // Input
        this.keys = {};

        // Entities
        this.players = [];
        this.bats = [];
        this.pumpkins = [];

        // Blizzard effect
        this.snowflakes = [];

        // Collision tracking
        this.recentCollisions = {};

        this.init();
    }

    init() {
        // Create players
        this.players.push(new Player(
            1,
            100,
            this.canvas.height / 2,
            '#9b59b6',
            { up: 'w', down: 's', left: 'a', right: 'd' }
        ));

        this.players.push(new Player(
            2,
            this.canvas.width - 150,
            this.canvas.height / 2,
            '#e74c3c',
            { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
        ));

        // Create bats
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.bats.push(new Bat(x, y));
        }

        // Create pumpkins
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.pumpkins.push(new Pumpkin(x, y));
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
        this.timer = 60;
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

        // Render players
        this.players.forEach(player => {
            // Flash effect when hit
            if (!player.isHit || Date.now() % 100 > 50) {
                player.render(this.ctx);
            }
        });
    }

    renderBackground() {
        // Dark forest background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0520');
        gradient.addColorStop(0.5, '#1a0a2e');
        gradient.addColorStop(1, '#0f051d');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Simple tree silhouettes
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 15; i++) {
            const x = (i * 80) + (i % 2) * 40;
            const height = 150 + Math.random() * 100;

            // Tree trunk
            this.ctx.fillRect(x, this.canvas.height - height, 20, height);

            // Tree top (triangle)
            this.ctx.beginPath();
            this.ctx.moveTo(x + 10, this.canvas.height - height);
            this.ctx.lineTo(x - 20, this.canvas.height - height + 80);
            this.ctx.lineTo(x + 40, this.canvas.height - height + 80);
            this.ctx.closePath();
            this.ctx.fill();
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
