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

class Enemy {
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
    animationId = requestAnimationFrame(animate);
    
    // Clear Canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    
    // Animate Projectiles
    projectiles.forEach((projectile) => projectile.update());
    
    // Animate Enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        // Player Collision - Game Over
        const distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(distanceToPlayer - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
        }

        // Projectile Collision
        projectiles.forEach((projectile, projectileIndex) => {
            const distanceToProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(distanceToProjectile - enemy.radius - projectile.radius < 1) {
                enemies.splice(enemyIndex, 1);
                projectiles.splice(projectileIndex, 1);
            }

        })
    });
}

function spawnEnemies() {
    setInterval(() => {
        const color = 'green';
        const radius = Math.random() * (30 - 10) + 10;
        let x, y;

        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1500);
}

// Init Player on Center Screen
const x = canvas.width/2;
const y = canvas.height/2;
const player = new Player(x, y, 30, 'blue');

// Array of Projectiles
const projectiles = [];

// Array of Enemies
const enemies = [];

// Event Click Shoot
window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2);
    const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
    projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'red', velocity));
})

let animationId;

animate();
spawnEnemies();
