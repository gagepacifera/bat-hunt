class Pumpkin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
    }

    render(ctx) {
        ctx.save();

        // Pumpkin body
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

        // Stem
        ctx.fillStyle = '#228b22';
        ctx.fillRect(this.x + this.width / 2 - 3, this.y - 5, 6, 8);

        // Face - eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 12);
        ctx.lineTo(this.x + 15, this.y + 12);
        ctx.lineTo(this.x + 12.5, this.y + 17);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 12);
        ctx.lineTo(this.x + 25, this.y + 12);
        ctx.lineTo(this.x + 22.5, this.y + 17);
        ctx.closePath();
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 22, 8, 0.2, Math.PI - 0.2);
        ctx.lineWidth = 2;
        ctx.stroke();

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
