// Init Canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Full Screen Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreElement = document.getElementById('scoreElement');
const gameUiElement = document.getElementById('gameUiElement');
const bigScoreElement = document.getElementById('bigScoreElement');
const startGameButton = document.getElementById('startGameButton');

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

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// Animation
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Clear Canvas
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, particleIndex) => {
        if(particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update();
        }
    })
    
    // Animate Projectiles
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        // Remove When Screen Out
        if(
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0)
        }
    });
    
    // Animate Enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        // Player Collision - Game Over
        const distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(distanceToPlayer - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            gameUiElement.style.display = 'flex';
            bigScoreElement.innerHTML = score;
        }

        // Projectile Collision
        projectiles.forEach((projectile, projectileIndex) => {
            const distanceToProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(distanceToProjectile - enemy.radius - projectile.radius < 1) {
                for(let i = 0; i < enemy.radius * 2 ; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            enemy.color,
                            {
                                x: Math.random() - 0.5 * Math.random() * 5,
                                y: Math.random() - 0.5 * Math.random() * 5
                            }
                        )
                    );
                }
                if(enemy.radius - 10 > 10) { 
                    score += 100;
                    scoreElement.innerHTML = score;
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    score += 250;
                    scoreElement.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }

        })
    });
}

function spawnEnemies() {
    setInterval(() => {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
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


// Init Objects of Game
const x = canvas.width/2;
const y = canvas.height/2;
const friction = 0.99;

let animationId; 
let score = 0;
let player = new Player(x, y, 10, 'white');
let projectiles = [];
let particles = [];
let enemies = [];

function init() {
    score = 0;
    scoreElement.innerHTML = score;
    bigScoreElement.innerHTML = score;
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    particles = [];
    enemies = [];
}

// Event Click Shoot
window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2);
    const velocity = {x: Math.cos(angle) * 5, y: Math.sin(angle) * 5}
    projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', velocity));
})

startGameButton.addEventListener('click', () => {
    gameUiElement.style.display = 'none';
    init();
    animate();
    spawnEnemies();
})

