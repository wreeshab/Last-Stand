const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pauseButton = document.getElementById("pause");
const gameOverPopup = document.getElementById("game-over-pop");
const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("play-again");

canvas.width = 1408;
canvas.height = 792;

let gamePaused = false;
let gameOver = false;

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
  position: { x: canvas.width / 2 - 50, y: 500 },
  imageSrc: "./assets/hero1/Biker_idle.png",
  frameRate: 4,
  enlargementRatio: 2.7,
  frameBuffer: 6,
  gunImageSrc: "./assets/guns/6.png",
  guns: [
    new Gun({
      name: "Normalgun",
      bulletVelocity: 20,
      fireRate: 20, //50 bullet per second but its upto your skill
      damage: 10,
      recoil: 10,
      bulletGravity: 0.65,
      imageSrc: "./assets/guns/Normalgun.png",
    }),
    new Gun({
      //low range  but shoots 3 bullets moderate recoil
      name: "Shotgun",
      bulletVelocity: 15,
      fireRate: 500, // 2 bullets per second
      damage: 25,
      recoil: 30,
      bulletGravity: 1,
      imageSrc: "./assets/guns/Shotgun.png",
    }),
    new Gun({
      //high range high damage high recoil
      name: "Rifle",
      bulletVelocity: 30,
      fireRate: 1000, //1 bullet per second
      damage: 50,
      recoil: 50,
      bulletGravity: 0.5,
      imageSrc: "./assets/guns/Rifle.png",
    }),
  ],
  animations: {
    Idle: {
      imageSrc: "./assets/hero1/Biker_idle.png",
      frameRate: 4,
      frameBuffer: 6,
    },
    Run: {
      imageSrc: "./assets/hero1/Biker_run_right.png",
      frameRate: 6,
      frameBuffer: 6,
    },
    Jump: {
      imageSrc: "./assets/hero1/Biker_jump.png",
      frameRate: 4,
      frameBuffer: 15,
    },
    Dead: {
      imageSrc: "./assets/hero1/Biker_death.png",
      frameRate: 6,
      frameBuffer: 15,
    },
  },
  boxes,
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

// function collisionBetweenPlayerAndPlatform(player, platform) {
//   const playerBottom = player.actualBox.position.y + player.actualBox.height;
//   const platformTop = platform.position.y;
//   const playerTop = player.actualBox.position.y;
//   const platformBottom = platform.position.y + platform.height;
//   const playerRight = player.actualBox.position.x + player.actualBox.width;
//   const platformRight = platform.position.x + platform.width;
//   const playerLeft = player.actualBox.position.x;
//   const platformLeft = platform.position.x;
//   // Bottom collision chking
//   if (
//     playerBottom >= platformTop &&
//     playerTop < platformTop &&
//     playerRight > platformLeft &&
//     playerLeft < platformRight &&
//     player.velocity.y >= 0
//   ) {
//     player.position.y =
//       platformTop -
//       player.actualBox.height -
//       (player.actualBox.position.y - player.position.y) -
//       0.1;
//     player.velocity.y = 0;
//     player.isOnGround = true;
//   }

//   // Left collision chking
//   if (
//     playerRight > platformLeft &&
//     playerLeft < platformLeft &&
//     playerBottom > platformTop + 1 &&
//     playerTop < platformBottom - 1 &&
//     player.velocity.x > 0
//   ) {
//     player.position.x =
//       platformLeft -
//       player.actualBox.width -
//       (player.actualBox.position.x - player.position.x) -
//       0.1;
//     player.velocity.x = 0;
//   }

//   // Right collision chking
//   if (
//     playerLeft < platformRight &&
//     playerRight > platformRight &&
//     playerBottom > platformTop + 1 &&
//     playerTop < platformBottom - 1 &&
//     player.velocity.x < 0
//   ) {
//     player.position.x =
//       platformRight - (player.actualBox.position.x - player.position.x) + 0.1;
//     player.velocity.x = 0;
//   }
// }

const gameLogic = new GameLogic({ player, boxes, gameOver });
// const bat = new Bat({
//   position: { x: 500, y: 500 },
//   velocity: { x: 0, y: 0 },
//   player:player
// });

function pauseGame() {
  gamePaused = !gamePaused;
  if (gamePaused) {
    pauseButton.innerHTML = "Resume";
    cancelAnimationFrame(mainGameLoop);
  } else {
    pauseButton.innerHTML = "Pause";
    mainGameLoop();
  }
}

function resetGame() {
  document.location.reload();
}

function gameOverFunction() {
  cancelAnimationFrame(mainGameLoop);
  gameOverPopup.style.visibility = "visible";
}

function mainGameLoop() {
  if (gamePaused) {
    return;
  }
  if (player.playerIsDead()) {
    gameOverFunction();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  player.update();
  // bat.update();

  // gameLogic.update();
  boxes.forEach((box) => {
    box.draw();
    player.collisionBetweenPlayerAndPlatform(box);
  });

  player.collisionBetweenPlayerAndPlatform(bottomPlatform);
  bottomPlatform.draw("transparent");
  // Update and draw the bat

  requestAnimationFrame(mainGameLoop);
}
mainGameLoop();

pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);
