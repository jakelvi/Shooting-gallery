/**
 @type {HTMLCanvasElement}
 */
import Raven from "./raven.js";
import Explosion from "./explosion.js";
import setupCanvas from "./setupCanvas.js";

const { canvas: canvas1, ctx } = setupCanvas("canvas1");
const { canvas: canvasCollision, ctx: collisionCtx } =
  setupCanvas("canvasCollision");

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = [];
let score = 0;
let gameOver = false;
ctx.font = "50px Impact";
let explosions = [];
let particles = [];

const drawScore = () => {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 55, 80);
};

const drawGameOver = () => {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    "GAME OVER, your score is " + score,
    canvas1.width / 2,
    canvas1.height / 2
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER, your score is " + score,
    canvas1.width / 2 + 5,
    canvas1.height / 2 + 5
  );
};

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(
    e.clientX,
    e.clientY,
    1,
    1
  );
  const pc = detectPixelColor.data;
  for (const object of ravens) {
    if (
      object.randomColors[0] === pc[0] &&
      object.randomColors[1] === pc[1] &&
      object.randomColors[2] === pc[2]
    ) {
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(object.x, object.y, object.width, ctx));
    }
  }
});

const animate = (timestamp) => {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  collisionCtx.clearRect(0, 0, canvasCollision.width, canvasCollision.height);

  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  }

  drawScore();
  [...particles, ...ravens, ...explosions].forEach((object) =>
    object.update(deltaTime)
  );
  [...particles, ...ravens, ...explosions].forEach((object) => object.draw());

  ravens = ravens.filter((object) => !object.markedForDeletion);
  explosions = explosions.filter((object) => !object.markedForDeletion);
  particles = particles.filter((object) => !object.markedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
};

animate(0);
