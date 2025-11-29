// Touch Controls Management
class TouchControls {
    constructor(game) {
        this.game = game;
        this.touchControlsElement = document.getElementById('touch-controls');
        this.isTouchDevice = this.detectTouch();

        if (this.isTouchDevice) {
            this.showControls();
            this.setupTouchEvents();
        }
    }

    detectTouch() {
        // Check for touch capability
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    showControls() {
        if (this.touchControlsElement) {
            this.touchControlsElement.classList.remove('hidden');
        }
    }

    hideControls() {
        if (this.touchControlsElement) {
            this.touchControlsElement.classList.add('hidden');
        }
    }

    setupTouchEvents() {
        // Get all control buttons
        const buttons = document.querySelectorAll('.dpad-button[data-key]');

        buttons.forEach(button => {
            const key = button.getAttribute('data-key');

            // Handle touch start (button press)
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(key);
            }, { passive: false });

            // Handle touch end (button release)
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchEnd(key);
            }, { passive: false });

            // Handle touch cancel (e.g., finger slides off button)
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.handleTouchEnd(key);
            }, { passive: false });

            // Also support mouse events for testing on desktop
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleTouchStart(key);
            });

            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleTouchEnd(key);
            });

            button.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.handleTouchEnd(key);
            });
        });

        // Add touch support for starting the game
        // Make the overlay tappable to start/restart
        const gameOverlay = document.getElementById('game-overlay');
        const startScreen = document.getElementById('start-screen');
        const endScreen = document.getElementById('end-screen');

        const handleStartTouch = (e) => {
            if (this.game.gameState === 'start') {
                this.game.startGame();
            } else if (this.game.gameState === 'ended') {
                this.game.resetGame();
            }
        };

        // Add touch listener to both screens
        startScreen.addEventListener('touchend', handleStartTouch);
        startScreen.addEventListener('click', handleStartTouch);

        endScreen.addEventListener('touchend', handleStartTouch);
        endScreen.addEventListener('click', handleStartTouch);
    }

    handleTouchStart(key) {
        // Simulate key press by setting the key state to true
        if (this.game && this.game.keys) {
            this.game.keys[key] = true;
        }
    }

    handleTouchEnd(key) {
        // Simulate key release by setting the key state to false
        if (this.game && this.game.keys) {
            this.game.keys[key] = false;
        }
    }
}
