class GameLogic {
  constructor({ player, boxes }) {
    this.zombies = [];
    this.waveNumber = 1;
    this.spawningGap = 2500;
    this.player = player;
    this.boxes = boxes;
    this.lastSpawn = Date.now();
  }

  spawnZombies() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const placeOfSpawn =
      side === "left"
        ? { x: 0, y: canvas.height - 50 }
        : { x: canvas.width, y: canvas.height - 50 };
    const velocity = side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
    const direction = velocity.x === 1 ? "right" : "left";
    const health = 1;
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

  // update() {
  //   const timeNow = Date.now();
  //   if (timeNow - this.lastSpawn > this.spawningGap) {
  //     this.spawnZombies();
  //     this.lastSpawn = timeNow;
  //   }

  //   this.boxes.forEach((box, boxIndex) => {
  //     this.zombies.forEach((zombie) => {
  //       zombie.isZombieTouchingBox = false;
  //       zombie.resolveBoxZombieCollision(box, this.zombies);

  //       if (box.boxIsDestroyed()) {
  //         this.boxes.splice(boxIndex, 1);
  //         zombie.isZombieTouchingBox = false;
  //         this.zombies.forEach((zombieIterator) => {
  //           if (zombieIterator.direction === zombie.direction) {
  //             if (zombieIterator.direction === "left") {
  //               //whoa this iterator step is god level step, a bit complex onli but this is the onlyway
  //               zombieIterator.velocity.x = -1;
  //             } else {
  //               zombieIterator.velocity.x = 1;
  //             }
  //             zombieIterator.setAnimation("Walk");
  //           }
  //         });
  //       }
  //     });
  //   });
  //   this.zombies.forEach((zombie) => {
  //     zombie.update();
  //   });
  // }

  update() {
    const timeNow = Date.now();
    if (timeNow - this.lastSpawn > this.spawningGap) {
      this.spawnZombies();
      this.lastSpawn = timeNow;
    }

    const boxesToRemove = [];
    const zombiesToMoveAgainAfterBoxRemoval = [];
    this.boxes.forEach((box, boxIndex) => {
      let destroyedByZombie = false;

      this.zombies.forEach((zombie) => {
        zombie.isZombieTouchingBox = false;
        zombie.resolveBoxZombieCollision(box, this.zombies);

        if (box.boxIsDestroyed()) {
          destroyedByZombie = true;
        }
        
      });

      // If the box was destroyed by a zombie, mark it for removal
      if (destroyedByZombie) {
        boxesToRemove.push(boxIndex);
      }
    });

    // Remove boxes marked for removal
    boxesToRemove.reverse().forEach((index) => {
      this.boxes.splice(index, 1);
      
    });
    
    // this.zombies.forEach((zombieIterator) => {
    //   if (zombieIterator.direction === zombie.direction) {
    //     if (zombieIterator.direction === "left") {
    //       //whoa this iterator step is god level step, a bit complex onli but this is the onlyway
    //       zombieIterator.velocity.x = -1;
    //     } else {
    //       zombieIterator.velocity.x = 1;
    //     }
    //     zombieIterator.setAnimation("Walk");
    //   }
    // });
    

    // Update zombies after box removal
    this.zombies.forEach((zombie) => {
      zombie.update();
    });
  }
}
