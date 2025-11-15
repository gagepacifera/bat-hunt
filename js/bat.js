class Bat {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 40;
        this.height = 40;
        this.active = true;

        // Random movement
        this.velocityX = (Math.random() - 0.5) * 3;
        this.velocityY = (Math.random() - 0.5) * 3;

        // Ensure minimum speed
        if (Math.abs(this.velocityX) < 1) this.velocityX = 1.5 * (Math.random() > 0.5 ? 1 : -1);
        if (Math.abs(this.velocityY) < 1) this.velocityY = 1.5 * (Math.random() > 0.5 ? 1 : -1);
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        if (!this.active) return;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off walls
        if (this.x <= 0 || this.x >= canvasWidth - this.width) {
            this.velocityX *= -1;
            this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        }
        if (this.y <= 0 || this.y >= canvasHeight - this.height) {
            this.velocityY *= -1;
            this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
        }
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();

        if (this.image && this.image.complete) {
            // Draw bat SVG image
            // Flip based on direction for visual variety
            if (this.velocityX < 0) {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback: simple bat representation
            ctx.fillStyle = '#2d1b3d';
            ctx.beginPath();
            ctx.ellipse(this.x + 5, this.y + this.height / 2, 8, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + this.width - 5, this.y + this.height / 2, 8, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#1a0a2e';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    respawn(canvasWidth, canvasHeight) {
        // Respawn at random position
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = Math.random() * (canvasHeight - this.height);

        // New random velocity
        this.velocityX = (Math.random() - 0.5) * 3;
        this.velocityY = (Math.random() - 0.5) * 3;

        if (Math.abs(this.velocityX) < 1) this.velocityX = 1.5 * (Math.random() > 0.5 ? 1 : -1);
        if (Math.abs(this.velocityY) < 1) this.velocityY = 1.5 * (Math.random() > 0.5 ? 1 : -1);

        this.active = true;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
