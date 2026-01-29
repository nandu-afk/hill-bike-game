const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let time = 0;
let speed = 0;
let fuel = 100;

// BIKE
let bike = { x: 150, y: 0, vy: 0 };

// CONTROLS
let throttle = false;
let brake = false;

canvas.addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  if (x > canvas.width / 2) throttle = true;
  else brake = true;
});

canvas.addEventListener("touchend", () => {
  throttle = false;
  brake = false;
});

// TERRAIN
function groundY(x) {
  return canvas.height - 120 + Math.sin((x + time) * 0.01) * 80;
}

function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // INPUT
  if (throttle && fuel > 0) {
    speed += 0.08;
    fuel -= 0.03;
  }
  if (brake) speed -= 0.05;

  speed *= 0.99;
  time += speed;

  // BIKE PHYSICS
  let gy = groundY(bike.x);
  bike.y += bike.vy;
  bike.vy += 0.6;

  if (bike.y > gy - 20) {
    bike.y = gy - 20;
    bike.vy = 0;
  }

  // DRAW TERRAIN
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += 10) {
    ctx.lineTo(x, groundY(x));
  }
  ctx.stroke();

  // DRAW BIKE
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bike.x - 15, bike.y + 20, 12, 0, Math.PI*2);
  ctx.arc(bike.x + 15, bike.y + 20, 12, 0, Math.PI*2);
  ctx.fill();
  ctx.fillRect(bike.x - 20, bike.y, 40, 10);

  // UI
  ctx.fillStyle = "white";
  ctx.fillText("Fuel: " + fuel.toFixed(0), 20, 30);

  if (fuel <= 0 && Math.abs(speed) < 0.2) {
    alert("Game Over");
    location.reload();
  }

  requestAnimationFrame(update);
}

update();
