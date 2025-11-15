// Fireworks particle effect for bat collection
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.active = true;
        this.lifetime = 0;
        this.maxLifetime = 60; // frames (about 1 second at 60fps)

        // Create particles
        const particleCount = 20;
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff6bff', '#ff9f40'];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 3 + 2;

            this.particles.push({
                x: this.x,
                y: this.y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 3 + 2,
                alpha: 1
            });
        }
    }

    update(deltaTime) {
        this.lifetime += deltaTime;

        if (this.lifetime >= this.maxLifetime) {
            this.active = false;
            return;
        }

        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.velocityX * deltaTime;
            particle.y += particle.velocityY * deltaTime;

            // Add gravity
            particle.velocityY += 0.15 * deltaTime;

            // Fade out
            particle.alpha = 1 - (this.lifetime / this.maxLifetime);
        });
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();

        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;

            // Draw sparkle shape
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();

            // Add a bright center
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}
