// Init Canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Full Screen Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player Class
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    // Function to Draw Player on Canvas
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

// Projectile Class
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => projectile.update());
}

// Init Player on Center Screen
const x = canvas.width/2;
const y = canvas.height/2;
const player = new Player(x, y, 30, 'blue');

// Array of Projectiles
const projectiles = [];

// Event Click Shoot
window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - y, event.clientX - x);
    const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
    projectiles.push(new Projectile(x, y, 5, 'red', velocity));
})

animate();

