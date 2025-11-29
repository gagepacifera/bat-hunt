// Bot AI for Player 2
class BotAI {
    constructor(player, bats) {
        this.player = player;
        this.bats = bats;
    }

    update(keys) {
        // Find the closest active bat
        const closestBat = this.findClosestBat();

        if (closestBat) {
            // Clear all player 2 keys
            keys['ArrowUp'] = false;
            keys['ArrowDown'] = false;
            keys['ArrowLeft'] = false;
            keys['ArrowRight'] = false;

            // Calculate direction to bat
            const dx = closestBat.x + closestBat.width / 2 - (this.player.x + this.player.width / 2);
            const dy = closestBat.y + closestBat.height / 2 - (this.player.y + this.player.height / 2);

            // Move towards the bat with a small threshold to prevent jittering
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
}
