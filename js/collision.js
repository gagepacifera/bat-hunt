// AABB Collision Detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function handleCollisions(game) {
    // Check player-bat collisions
    game.players.forEach(player => {
        game.bats.forEach(bat => {
            if (bat.active && checkCollision(player.getBounds(), bat.getBounds())) {
                // Player collected a bat
                player.addScore(1);

                // Create fireworks effect at bat's position
                const firework = new Firework(
                    bat.x + bat.width / 2,
                    bat.y + bat.height / 2
                );
                game.fireworks.push(firework);

                bat.active = false;
                // Respawn bat after a short delay
                setTimeout(() => {
                    bat.respawn(game.canvas.width, game.canvas.height);
                }, 500);
            }
        });

        // Check player-pumpkin collisions
        game.pumpkins.forEach(pumpkin => {
            if (checkCollision(player.getBounds(), pumpkin.getBounds())) {
                // Check if this collision was already registered recently
                const collisionKey = `${player.id}-${pumpkin.x}-${pumpkin.y}`;
                const now = Date.now();

                if (!game.recentCollisions) {
                    game.recentCollisions = {};
                }

                // Only register collision if it hasn't happened in the last 1 second
                if (!game.recentCollisions[collisionKey] ||
                    now - game.recentCollisions[collisionKey] > 1000) {
                    player.addScore(-1);
                    game.recentCollisions[collisionKey] = now;

                    // Visual feedback - flash the player and jiggle pumpkin
                    player.isHit = true;
                    pumpkin.jiggle();

                    setTimeout(() => {
                        player.isHit = false;
                    }, 200);
                }
            }
        });
    });
}
