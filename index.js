// Init Elements
const scoreElement = document.getElementById('scoreElement');
const gameUiElement = document.getElementById('gameUiElement');
const bigScoreElement = document.getElementById('bigScoreElement');
const startGameButton = document.getElementById('startGameButton');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
// Full Screen Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Circle { // Base class for all game elements
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Player extends Circle { // Overwrite update()
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
    }

    update() {
        this.draw();
    }
}

class Projectile extends Circle { // Add velocity attribute
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }
}

class Enemy extends Circle { // Add velocity attribute
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }
}

class Particle extends Circle { // Add velocity attribute and Overwrite update
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }
    
    update() {
        this.draw();
        this.velocity.x *= Math.random() * (0.99 - 0.96) + 0.96;
        this.velocity.y *= Math.random() * (0.99 - 0.96) + 0.96;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

function calculateVelocity(x0, x1, y0, y1, increment = 1) {
    const angle = Math.atan2(y1 - y0, x1 - x0);
    return {
        x: Math.cos(angle) * increment,
        y: Math.sin(angle) * increment
    }
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

        const velocity = calculateVelocity(x, canvas.width/2, y, canvas.height/2, Math.random() * (3 - 1) + 1);
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1500);
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
            new Audio('./game-over.wav').play();
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
                new Audio('./explosion-8-bit.wav').play();
            }

        })
    });
}




// Init Objects of Game
const x = canvas.width/2;
const y = canvas.height/2;
const friction = 0.97;

let animationId; 
let score;
let player;
let projectiles;
let particles;
let enemies;

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
canvas.addEventListener('click', (event) => {
    const velocity = calculateVelocity(canvas.width/2, event.clientX, canvas.height/2, event.clientY, 5);
    projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', velocity));
    new Audio('./laser-8-bit.wav').play();
})

startGameButton.addEventListener('click', () => {
    gameUiElement.style.display = 'none';
    init();
    animate();
    spawnEnemies();
})

