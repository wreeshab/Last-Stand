const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1408;
canvas.height = 792;

const gravity = 0.5;

const background = new Image();
background.src = "./assets/backgrounds/background1.png";
background.onload = () => {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
};

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

const boxes = [
  new Box({
    position: { x: canvas.width / 2 + 100, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 + 200, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 + 300, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 + 150, y: canvas.height - 230 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 - 200, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 - 300, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 - 400, y: canvas.height - 130 },
    width: 100,
    height: 100,
  }),
  new Box({
    position: { x: canvas.width / 2 - 250, y: canvas.height - 230 },
    width: 100,
    height: 100,
  }),
];

const bottomPlatform = new BottomPlatform({
  position: { x: 0, y: canvas.height - 30 },
  width: canvas.width,
  height: 100,
});

const player = new Player({
  position: { x: canvas.width / 2 - 50, y: 100 },
  imageSrc: "./assets/hero1/Biker_idle.png",
  frameRate: 4,
  enlargementRatio: 2.5,
  frameBuffer: 6,
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

function resolveVerticalCollision(player, platform) {
  const playerBottom = player.actualBox.position.y + player.actualBox.height;
  const platformTop = platform.position.y;
  const playerTop = player.actualBox.position.y;
  const playerRight = player.actualBox.position.x + player.actualBox.width;
  const platformRight = platform.position.x + platform.width;
  const playerLeft = player.actualBox.position.x;
  const platformLeft = platform.position.x;

  if (
    playerBottom >= platformTop &&
    playerTop < platformTop &&
    playerRight > platformLeft &&
    playerLeft < platformRight
  ) {
    player.position.y =
      platformTop -
      player.actualBox.height -
      (player.actualBox.position.y - player.position.y);
    player.velocity.y = 0;
    player.isOnGround = true;
    return true;
  }

  return false;
}

function collisionBetweenPlayerAndPlatform(player, platform) {
  const playerBottom = player.actualBox.position.y + player.actualBox.height;
  const platformTop = platform.position.y;
  const playerTop = player.actualBox.position.y;
  const platformBottom = platform.position.y + platform.height;
  const playerRight = player.actualBox.position.x + player.actualBox.width;
  const platformRight = platform.position.x + platform.width;
  const playerLeft = player.actualBox.position.x;
  const platformLeft = platform.position.x;

  // Bottom collision
  if (
    playerBottom >= platformTop &&
    playerTop < platformTop &&
    playerRight > platformLeft &&
    playerLeft < platformRight
  ) {
    player.position.y =
      platformTop -
      player.actualBox.height -
      (player.actualBox.position.y - player.position.y);
    player.velocity.y = 0;
    player.isOnGround = true;
  }

  // Left collision
  if (
    playerRight > platformLeft &&
    playerLeft < platformLeft &&
    playerBottom > platformTop &&
    playerTop < platformBottom
  ) {
    player.position.x =
      platformLeft -
      player.actualBox.width -
      (player.actualBox.position.x - player.position.x);
    player.velocity.x = 0;
  }

  // Right collision
  if (
    playerLeft < platformRight &&
    playerRight > platformRight &&
    playerBottom > platformTop &&
    playerTop < platformBottom
  ) {
    player.position.x =
      platformRight - (player.actualBox.position.x - player.position.x);
    player.velocity.x = 0;
  }
}
function mainGameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  player.update();
  boxes.forEach((box) => {
    box.draw();
    collisionBetweenPlayerAndPlatform(player, box);
  });
  bottomPlatform.draw("transparent");

  collisionBetweenPlayerAndPlatform(player, bottomPlatform);

  requestAnimationFrame(mainGameLoop);
}
mainGameLoop();
