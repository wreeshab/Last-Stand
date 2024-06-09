class GameLogic {
  constructor({ player, boxes }) {
    this.zombies = [];
    this.waveNumber = 1;
    this.spawningGap = 2500;
    this.player = player;
    this.boxes = boxes;
    this.lastSpawn = Date.now();
    this.zombieToMoveAfterBox = [];
  }

  spawnZombies() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const placeOfSpawn =
      side === "left"
        ? { x: 0, y: canvas.height - 50 }
        : { x: canvas.width, y: canvas.height - 50 };
    const velocity = side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
    const direction = velocity.x === 1 ? "right" : "left";
    const health = 100;
    this.zombies.push(
      new ZombieBasic({
        placeOfSpawn,
        velocity,
        health,
        animations: {
          Idle: {
            imageSrc: "assets/zombies/Zombie1/animation/Idle1.png",
            frameRate: 4,
            frameBuffer: 8,
          },
          Run: {
            imageSrc: "assets/zombies/Zombie1/animation/Run1.png",
            frameRate: 9,
            frameBuffer: 5,
          },
          Walk: {
            imageSrc: "assets/zombies/Zombie1/animation/Walk1.png",
            frameRate: 6,
            frameBuffer: 5,
          },
          Jump: {
            imageSrc: "assets/zombies/Zombie1/animation/Jump1.png",
            frameRate: 7,
            frameBuffer: 15,
          },
          Attack: {
            imageSrc: "assets/zombies/Zombie1/animation/Attack1.png",
            frameRate: 6,
            frameBuffer: 15,
          },
        },
        originalDirection: direction,
      })
    );
  }
  update() {
    const timeNow = Date.now();
    if (timeNow - this.lastSpawn > this.spawningGap) {
      this.spawnZombies();
      this.lastSpawn = timeNow;
    }
    this.zombies.forEach((zombie)=>{
      zombie.update();
    })
  }
}
