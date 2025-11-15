class Player {
    constructor(id, x, y, color, controls) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.score = 0;
        this.color = color;
        this.controls = controls; // { up, down, left, right }
        this.width = 40;
        this.height = 40;

        // Physics properties (Joust-like)
        this.acceleration = 0.4;
        this.friction = 0.92;
        this.maxSpeed = 6;
    }

    update(deltaTime, keys, canvasWidth, canvasHeight) {
        // Handle input and apply acceleration
        this.handleInput(keys);

        // Apply friction
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;

        // Limit to max speed
        const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocityX *= scale;
            this.velocityY *= scale;
        }

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Constrain to screen bounds
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));

        // Stop velocity if hitting bounds
        if (this.x <= 0 || this.x >= canvasWidth - this.width) {
            this.velocityX *= -0.5;
        }
        if (this.y <= 0 || this.y >= canvasHeight - this.height) {
            this.velocityY *= -0.5;
        }
    }

    handleInput(keys) {
        // Check for each directional input
        if (keys[this.controls.up]) {
            this.velocityY -= this.acceleration;
        }
        if (keys[this.controls.down]) {
            this.velocityY += this.acceleration;
        }
        if (keys[this.controls.left]) {
            this.velocityX -= this.acceleration;
        }
        if (keys[this.controls.right]) {
            this.velocityX += this.acceleration;
        }
    }

    addScore(points) {
        this.score = Math.max(0, this.score + points);
    }

    render(ctx) {
        // Save context state
        ctx.save();

        // For now, draw a simple witch representation
        // This will be replaced with sprite images later

        // Witch body (triangle for dress)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 5);
        ctx.lineTo(this.x + 5, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width - 5, this.y + this.height - 5);
        ctx.closePath();
        ctx.fill();

        // Witch hat
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + 10, this.y + 15);
        ctx.lineTo(this.x + this.width - 10, this.y + 15);
        ctx.closePath();
        ctx.fill();

        // Broom stick
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height - 10);
        ctx.lineTo(this.x + this.width + 5, this.y + this.height);
        ctx.stroke();

        // Broom bristles
        ctx.strokeStyle = '#daa520';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width + 5, this.y + this.height);
            ctx.lineTo(this.x + this.width + 10 + i * 2, this.y + this.height + 5 - i);
            ctx.stroke();
        }

        // Player indicator (number)
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.id, this.x + this.width / 2, this.y + this.height / 2 + 5);

        // Restore context state
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.score = 0;
    }
}
