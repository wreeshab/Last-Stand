class GameLogic {
  constructor({ player, boxes }) {
    this.zombies = [];
    this.waveNumber = 1;
    this.spawningGap = 5000;
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
          Dead: {
            imageSrc: "assets/zombies/Zombie1/animation/Dead1.png",
            frameRate: 8,
            frameBuffer: 10,
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
    this.zombies.forEach((zombie) => {
      if (zombie.resolveZombieBulletCollision(this.player.bullets)) {
        if (zombie.isZombieDead()) {
          zombie.velocity.x = 0;
          new Promise((resolve) => {
            zombie.setAnimation("Dead");
            setTimeout(resolve, 1300); //this value = 1300 is finalised after a lot of trail and error, edit even if need be. :)
          }).then(() => {
            this.zombies.splice(this.zombies.indexOf(zombie), 1);
          });
        }
      }
    });
    // this.player.bullets.forEach((bullet, i) => {
    //   this.zombies.forEach((zombie, i) => {
    //     if (zombie.resolveZombieBulletCollision(bullet)) {
    //       this.player.bullets.splice(i, 1);
    //       if (zombie.isZombieDead()) {
    //         this.zombies.splice(i, 1);
    //       }
    //     }
    //   });
    // });
    this.zombies.forEach((zombie) => {
      zombie.update();
    });
  }
}
