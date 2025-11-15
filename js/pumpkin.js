class Pumpkin {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 50;
        this.height = 50;
    }

    render(ctx) {
        ctx.save();

        if (this.image && this.image.complete) {
            // Draw pumpkin SVG image
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: simple pumpkin representation
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2,
                        this.width / 2, this.height / 2.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vertical ridges
            ctx.strokeStyle = '#cc5200';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const xPos = this.x + (i + 1) * (this.width / 4);
                ctx.beginPath();
                ctx.moveTo(xPos, this.y + 5);
                ctx.lineTo(xPos, this.y + this.height - 5);
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
