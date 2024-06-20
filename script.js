const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const background = new Image();
background.src = "./assets/backgrounds/background1.png";
background.onload = () => {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
};

const pauseButton = document.getElementById("pause");
const gameOverPopup = document.getElementById("game-over-pop");
const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("play-again");

canvas.width = 1408;
canvas.height = 792;

let gamePaused = false;
let gameOver = false;

const gravity = 0.5;

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
      fireRate: 20,
      damage: 10,
      recoil: 10,
      bulletGravity: 0.65,
      imageSrc: "./assets/guns/Normalgun.png",
    }),
    new Gun({
      //low range  but shoots 3 bullets moderate recoil
      name: "Shotgun",
      bulletVelocity: 20,
      fireRate: 750,
      damage: 25,
      recoil: 30,
      bulletGravity: 1.2,
      imageSrc: "./assets/guns/Shotgun.png",
    }),
    new Gun({
      //high range high damage high recoil
      name: "Rifle",
      bulletVelocity: 30,
      fireRate: 750,
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
    Hurt: {
      imageSrc: "./assets/hero1/Biker_hurt.png",
      frameRate: 2,
      frameBuffer: 5,
    },
  },
  boxes,
});

const gameLogic = new GameLogic({
  player,
  boxes,
  bottomPlatform: [bottomPlatform], //here im sending the bottom platform as an array because im iterating over it during powerUp collision
});

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
  // bat.update();

  boxes.forEach((box) => {
    box.draw();
    player.collisionBetweenPlayerAndPlatform(box);
  });
  player.update();
  gameLogic.update();

  player.collisionBetweenPlayerAndPlatform(bottomPlatform);
  bottomPlatform.draw("transparent");
  // Update and draw the bat

  requestAnimationFrame(mainGameLoop);
}
mainGameLoop();

pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);
