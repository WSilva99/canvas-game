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


// Init Player on Center Screen
const x = canvas.width/2;
const y = canvas.height/2;
const player = new Player(x, y, 30, 'blue');
player.draw();



