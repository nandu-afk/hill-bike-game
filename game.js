const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// WORLD
let cameraX = 0;
let speed = 0;
let fuel = 100;
let score = 0;

// BIKE
let bike = {
  x: 100,
  y: 0,
  vy: 0,
  angle: 0
};

// INPUT
let throttle = false;
let brake = false;

// BUTTON AREAS
canvas.addEventListener("touchstart", e => {
  for (let t of e.touches) {
    if (t.clientX > canvas.width * 0.65) throttle = true;
    if (t.clientX < canvas.width * 0.35) brake = true;
  }
});
canvas.addEventListener("touchend", () => {
  throttle = false;
  brake = false;
});

// TERRAIN (random hills)
function groundY(x) {
  return canvas.height - 140 +
    Math.sin(x * 0.008) * 60 +
    Math.sin(x * 0.02) * 25;
}

// COINS + FUEL
let coins = [];
let fuels = [];

function spawnObjects() {
  let x = cameraX + canvas.width + Math.random() * 400;
  coins.push({ x, y: groundY(x) - 40 });
  if (Math.random() < 0.3)
    fuels.push({ x, y: groundY(x) - 45 });
}
setInterval(spawnObjects, 1200);

// GAME LOOP
function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // INPUT
  if (throttle && fuel > 0) {
    speed += 0.1;
    fuel -= 0.04;
  }
  if (brake) speed -= 0.07;

  speed *= 0.99;
  cameraX += speed;

  // BIKE PHYSICS
  let gx = cameraX + bike.x;
  let gy = groundY(gx);
  bike.y += bike.vy;
  bike.vy += 0.7;

  if (bike.y > gy - 25) {
    bike.y = gy - 25;
    bike.vy = 0;
  }

  // DRAW TERRAIN
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += 10) {
    ctx.lineTo(x, groundY(cameraX + x));
  }
  ctx.stroke();

  // DRAW COINS
  ctx.fillStyle = "gold";
  coins = coins.filter(c => {
    ctx.beginPath();
    ctx.arc(c.x - cameraX, c.y, 8, 0, Math.PI*2);
    ctx.fill();
    if (Math.abs(c.x - gx) < 20) {
      score += 10;
      return false;
    }
    return true;
  });

  // DRAW FUEL
  ctx.fillStyle = "lime";
  fuels = fuels.filter(f => {
    ctx.fillRect(f.x - cameraX - 6, f.y, 12, 18);
    if (Math.abs(f.x - gx) < 20) {
      fuel = Math.min(100, fuel + 30);
      return false;
    }
    return true;
  });

  // DRAW BIKE
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bike.x - 15, bike.y + 25, 12, 0, Math.PI*2);
  ctx.arc(bike.x + 15, bike.y + 25, 12, 0, Math.PI*2);
  ctx.fill();
  ctx.fillRect(bike.x - 20, bike.y, 40, 10);

  // UI
  ctx.fillStyle = "white";
  ctx.fillText("Fuel: " + fuel.toFixed(0), 20, 30);
  ctx.fillText("Score: " + score, 20, 50);

  // BUTTONS
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, canvas.height-80, canvas.width*0.35, 80);
  ctx.fillRect(canvas.width*0.65, canvas.height-80, canvas.width*0.35, 80);
  ctx.globalAlpha = 1;

  if (fuel <= 0 && Math.abs(speed) < 0.3) {
    alert("Out of fuel! Score: " + score);
    location.reload();
  }

  requestAnimationFrame(update);
}

update();
