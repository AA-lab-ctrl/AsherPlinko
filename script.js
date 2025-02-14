const canvas = document.getElementById("plinkoCanvas");
const ctx = canvas.getContext("2d");
const pegs = [];
const balls = [];
let ballImage = new Image();
let customBallImage = false;

function createPegs() {
    const cols = 9;
    const rows = 10;
    const spacing = 40;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * spacing + (row % 2 === 0 ? spacing / 2 : 0) + 50;
            let y = row * spacing + 50;
            pegs.push({ x, y });
        }
    }
}

function drawPegs() {
    ctx.fillStyle = "black";
    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function dropBall() {
    balls.push({ x: canvas.width / 2, y: 10, vx: 0, vy: 2 });
}

function drawBalls() {
    balls.forEach(ball => {
        if (customBallImage) {
            ctx.drawImage(ballImage, ball.x - 10, ball.y - 10, 20, 20);
        } else {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function updateBalls() {
    balls.forEach(ball => {
        ball.y += ball.vy;
        ball.x += ball.vx;
        ball.vy += 0.1; 
        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 10) {
                ball.vx = Math.random() < 0.5 ? -2 : 2;
                ball.vy = -ball.vy * 0.5;
            }
        });
        if (ball.y > canvas.height - 20) {
            ball.vy = 0;
            ball.vx = 0;
        }
    });
}

function loadBallImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            ballImage.src = e.target.result;
            customBallImage = true;
        };
        reader.readAsDataURL(file);
    }
}

function resetGame() {
    balls.length = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    updateBalls();
    drawBalls();
    requestAnimationFrame(gameLoop);
}

createPegs();
gameLoop();
