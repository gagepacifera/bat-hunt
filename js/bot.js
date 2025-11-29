// Bot AI for Player 2
class BotAI {
    constructor(player, bats, pumpkins, difficulty = 'hard') {
        this.player = player;
        this.bats = bats;
        this.pumpkins = pumpkins;
        this.difficulty = difficulty;
        this.updateCounter = 0;
        this.slowdownFactor = 2; // For medium/easy: only update every 2 frames (50% slower)
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    update(keys) {
        // For medium and easy difficulty, slow down by only updating every other frame
        if ((this.difficulty === 'medium' || this.difficulty === 'easy')) {
            this.updateCounter++;
            if (this.updateCounter % this.slowdownFactor !== 0) {
                return; // Skip this update
            }
        }

        // For easy mode, 50% of the time pursue a random pumpkin instead of a bat
        let target;
        if (this.difficulty === 'easy' && Math.random() < 0.5) {
            target = this.findRandomPumpkin();
        } else {
            target = this.findClosestBat();
        }

        if (target) {
            // Clear all player 2 keys
            keys['ArrowUp'] = false;
            keys['ArrowDown'] = false;
            keys['ArrowLeft'] = false;
            keys['ArrowRight'] = false;

            // Calculate direction to target
            const dx = target.x + target.width / 2 - (this.player.x + this.player.width / 2);
            const dy = target.y + target.height / 2 - (this.player.y + this.player.height / 2);

            // Move towards the target with a small threshold to prevent jittering
            const threshold = 10;

            if (Math.abs(dx) > threshold) {
                if (dx > 0) {
                    keys['ArrowRight'] = true;
                } else {
                    keys['ArrowLeft'] = true;
                }
            }

            if (Math.abs(dy) > threshold) {
                if (dy > 0) {
                    keys['ArrowDown'] = true;
                } else {
                    keys['ArrowUp'] = true;
                }
            }
        }
    }

    findClosestBat() {
        let closestBat = null;
        let closestDistance = Infinity;

        this.bats.forEach(bat => {
            if (bat.active) {
                const dx = bat.x + bat.width / 2 - (this.player.x + this.player.width / 2);
                const dy = bat.y + bat.height / 2 - (this.player.y + this.player.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestBat = bat;
                }
            }
        });

        return closestBat;
    }

    findRandomPumpkin() {
        if (this.pumpkins.length === 0) {
            return null;
        }

        // Pick a random pumpkin
        const randomIndex = Math.floor(Math.random() * this.pumpkins.length);
        return this.pumpkins[randomIndex];
    }
}
