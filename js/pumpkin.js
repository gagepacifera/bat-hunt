class Pumpkin {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 50;
        this.height = 50;

        // Jiggle animation properties
        this.isJiggling = false;
        this.jiggleTime = 0;
        this.jiggleDuration = 30; // frames (about 0.5 seconds)
        this.jiggleIntensity = 5;
    }

    update(deltaTime) {
        if (this.isJiggling) {
            this.jiggleTime += deltaTime;
            if (this.jiggleTime >= this.jiggleDuration) {
                this.isJiggling = false;
                this.jiggleTime = 0;
            }
        }
    }

    jiggle() {
        this.isJiggling = true;
        this.jiggleTime = 0;
    }

    render(ctx) {
        ctx.save();

        let offsetX = 0;
        let offsetY = 0;
        let rotation = 0;

        // Calculate jiggle offset
        if (this.isJiggling) {
            const progress = this.jiggleTime / this.jiggleDuration;
            const intensity = this.jiggleIntensity * (1 - progress); // Fade out

            offsetX = Math.sin(this.jiggleTime * 0.5) * intensity;
            offsetY = Math.cos(this.jiggleTime * 0.7) * intensity * 0.5;
            rotation = Math.sin(this.jiggleTime * 0.6) * 0.2 * (1 - progress);
        }

        // Apply transformations for jiggle
        ctx.translate(this.x + this.width / 2 + offsetX, this.y + this.height / 2 + offsetY);
        ctx.rotate(rotation);

        if (this.image && this.image.complete) {
            // Draw pumpkin SVG image
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Fallback: simple pumpkin representation
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width / 2, this.height / 2.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vertical ridges
            ctx.strokeStyle = '#cc5200';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const xPos = -this.width / 2 + (i + 1) * (this.width / 4);
                ctx.beginPath();
                ctx.moveTo(xPos, -this.height / 2 + 5);
                ctx.lineTo(xPos, this.height / 2 - 5);
                ctx.stroke();
            }
        }

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
}
