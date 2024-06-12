class GameLogic {
  constructor({ player, boxes }) {
    this.zombies = [];
    this.waveNumber = 1;
    this.spawningGap = 5000;
    this.player = player;
    this.boxes = boxes;
    this.lastSpawn = Date.now();
    this.zombieToMoveAfterBox = [];
    this.updateScore(0);
    this.currentScore = 0;
    document.getElementById("current-score-value").innerHTML =
      this.currentScore;
    this.highScore = 0;
    this.typesOfZombies = ["ZombieBasic", "BoxZombie"];
    this.waveNumber = 1;

    //this is for boxx

    this.lastHitByZombieToBoxGap = 1500;
    this.bats = [];
  }

  spawnZombies() {
    const random = Math.random();
    if (random < 0.3) {
      this.spawnZombieBasic();
    } else if (random > 0.3 && random < 0.6) {
      this.spawnBoxZombie();
    } else if (random > 0.6) {
      this.spawnBatZombie();
    }
  }
  spawnBatZombie() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const placeOfSpawn =
      side === "left"
        ? { x: 0, y: canvas.height - 50 }
        : { x: canvas.width, y: canvas.height - 50 };
    const velocity = side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
    const direction = velocity.x === 1 ? "right" : "left";
    const health = 175;
    this.zombies.push(
      new BatZombie({
        placeOfSpawn,
        velocity,
        health,
        animations: {
          Idle: {
            imageSrc: "assets/zombies/Zombie3/animation/Idle1.png",
            frameRate: 4,
            frameBuffer: 8,
          },
          Run: {
            imageSrc: "assets/zombies/Zombie3/animation/Run1.png",
            frameRate: 10,
            frameBuffer: 5,
          },
          Walk: {
            imageSrc: "assets/zombies/Zombie3/animation/Walk1.png",
            frameRate: 6,
            frameBuffer: 5,
          },
          Jump: {
            imageSrc: "assets/zombies/Zombie3/animation/Jump1.png",
            frameRate: 7,
            frameBuffer: 15,
          },
          Attack: {
            imageSrc: "assets/zombies/Zombie3/animation/Attack1.png",
            frameRate: 6,
            frameBuffer: 6,
          },
          Dead: {
            imageSrc: "assets/zombies/Zombie3/animation/Dead1.png",
            frameRate: 8,
            frameBuffer: 8,
          },
        },
        originalDirection: direction,
        player: this.player,
        bats: this.bats,
      })
    );
  }

  spawnBoxZombie() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const placeOfSpawn =
      side === "left"
        ? { x: 0, y: canvas.height - 50 }
        : { x: canvas.width, y: canvas.height - 50 };
    const velocity = side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
    const direction = velocity.x === 1 ? "right" : "left";
    const health = 175;
    this.zombies.push(
      new BoxZombie({
        placeOfSpawn,
        velocity,
        health,
        animations: {
          Idle: {
            imageSrc: "assets/zombies/Zombie2/animation/Idle1.png",
            frameRate: 4,
            frameBuffer: 8,
          },
          Run: {
            imageSrc: "assets/zombies/Zombie2/animation/Run1.png",
            frameRate: 9,
            frameBuffer: 5,
          },
          Walk: {
            imageSrc: "assets/zombies/Zombie2/animation/Walk1.png",
            frameRate: 6,
            frameBuffer: 5,
          },
          Jump: {
            imageSrc: "assets/zombies/Zombie2/animation/Jump1.png",
            frameRate: 7,
            frameBuffer: 15,
          },
          Attack: {
            imageSrc: "assets/zombies/Zombie2/animation/Attack1.png",
            frameRate: 6,
            frameBuffer: 15,
          },
          Dead: {
            imageSrc: "assets/zombies/Zombie2/animation/Dead1.png",
            frameRate: 8,
            frameBuffer: 10,
          },
        },
        originalDirection: direction,
        player: this.player,
      })
    );
  }

  spawnZombieBasic() {
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
        player: this.player,
      })
    );
  }

  updateScore(x) {
    this.currentScore += x;
    this.highScore = localStorage.getItem("highScore");
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem("highScore", this.highScore);
    }
    document.getElementById("high-score-value").innerHTML = this.highScore;
    document.getElementById("current-score-value").innerHTML =
      this.currentScore;
    document.getElementById("final-score").innerHTML = this.currentScore;
  }
  update() {
    if (this.player.playerIsDead()) {
      this.gameOver = true;
      return;
    }
    const timeNow = Date.now();
    if (timeNow - this.lastSpawn > this.spawningGap) {
      this.spawnZombies();
      this.lastSpawn = timeNow;
    }
    this.zombies.forEach((zombie) => {
      if (zombie.resolveZombieBulletCollision(this.player.bullets)) {
        if (zombie.isZombieDead()) {
          zombie.velocity.x = 0;
          // zombie.setAnimation("Dead");
          // zombie.update()
          // zombie.update()
          this.zombies.splice(this.zombies.indexOf(zombie), 1);
          if (zombie.namee === "zombieBasic") {
            this.updateScore(10);
          } else if (zombie.namee === "boxZombie") {
            this.updateScore(20);
          }else if(zombie.namee === "batZombie"){
            this.updateScore(50);
          }
        }
      }
    });

    this.zombies.forEach((zombie) => {
      if (zombie.namee === "zombieBasic" || zombie.namee === "batZombie") {
        this.timeNowForBoxZombie = new Date();
        for (let i = this.boxes.length - 1; i >= 0; i--) {
          if (this.boxes[i].collisionBetweenBoxAndZombie(zombie)) {
            zombie.setAnimation("Attack");
            if (
              this.timeNowForBoxZombie - this.boxes[i].lastHitByZombieToBox >
              this.lastHitByZombieToBoxGap
            ) {
              // console.log(zombie.isAttacking);
              this.boxes[i].takeDamageBox(10);
              this.boxes[i].lastHitByZombieToBox = timeNow;
              if (this.boxes[i].boxIsDestroyed()) {
                this.boxes.splice(i, 1);
                this.zombies.forEach((zombie) => {
                  zombie.setAnimation("Walk");
                });
              }
            }
          }
        }
      }
    });

    this.zombies.forEach((zombie, index) => {
      if (zombie.collisionBeteenZombieAndPlayer(this.player)) {
        if (zombie.isAttacking) {
          zombie.setAnimation("Attack");
        } else {
          zombie.setAnimation("Walk");
        }
      }
    });

    this.zombies.forEach((zombie) => {
      zombie.update();
    });
    for (let i = this.bats.length - 1; i >= 0; i--) {
      if (this.bats[i].isDead) {
       this.bats.splice(i, 1);
      } else {
        this.bats[i].update();
      }
    }
  }
}
