const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const maxStars = 100;
const mouse = { x: null, y: null };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.velocityX = Math.random() * 0.5 - 0.25;
        this.velocityY = Math.random() * 0.5 - 0.25;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.velocityX = -this.velocityX;
        if (this.y > canvas.height || this.y < 0) this.velocityY = -this.velocityY;

        this.x += this.velocityX;
        this.y += this.velocityY;

        const distance = Math.sqrt((mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2);
        if (distance < 100) {
            this.x -= (mouse.x - this.x) / 20;
            this.y -= (mouse.y - this.y) / 20;
        }

        this.draw();
    }
}

function createStars() {
    for (let i = 0; i < maxStars; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
    });
    connectStars();
    requestAnimationFrame(animate);
}

function connectStars() {
    for (let i = 0; i < maxStars; i++) {
        for (let j = i; j < maxStars; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
            }
        }
    }
}

createStars();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0;
    createStars();
});
