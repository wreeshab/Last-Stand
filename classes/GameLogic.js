class GameLogic {
  constructor({ player, boxes, bottomPlatform }) {
    this.zombies = [];
    this.waveNumber = 1;
    this.spawningGap = 1000;
    this.player = player;
    this.boxes = boxes;
    this.bottomPlatform = bottomPlatform;
    this.lastSpawn = Date.now();
    this.zombieToMoveAfterBox = [];
    this.updateScore(0);
    this.currentScore = 0;
    document.getElementById("current-score-value").innerHTML =
      this.currentScore;
    document.getElementById("final-score").innerHTML = this.currentScore;
    this.highScore = 0;
    this.typesOfZombies = ["ZombieBasic", "BoxZombie"];
    this.waveNumber = 1;

    //this is for boxx

    this.lastHitByZombieToBoxGap = 1500;
    this.bats = [];

    this.powerUps = [];
    this.powerUpTypes = [
      BulletRain,
      GunDamageInc,
      HealthPowerUp,
      HighJump,
      RapidFire,
      JetPack,
    ];
    this.lastPowerUpSpawn = Date.now();
    this.powerUpSpawnGap = 6000;
    this.zombiesToSpawn = 7;
    this.isPrepTime = true;
    this.prepTimeDuration = 20000;
    this.lastWaveEndTime = Date.now();

    this.mines = [];
    this.numberOfMines = 3;
    this.numberOfMinesPlaced = 0;

    this.boxesPlaced = 0;
    this.maximumBoxes = 2;

    this.autoGun = new AutoGun({ player: this.player });
  }

  startWave() {
    this.isPrepTime = false;
    this.zombiesToSpawn = 7 + this.waveNumber; //here im putting 5 zombies in the first round and then +1 for every next round
    this.waveNumber++;
    document.getElementById("wave-value").innerHTML = this.waveNumber;
  }

  startPreparation() {
    this.isPrepTime = true;
    this.lastWaveEndTime = Date.now();
    this.powerUps = [];
  }

  spawnPowerUp() {
    if (this.isPrepTime) return;
    const PowerUpType =
      this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
    const powerUp = new PowerUpType();
    this.powerUps.push(powerUp);
  }

  updatePowerUps() {
    this.powerUps.forEach((powerUp, index) => {
      powerUp.draw();
      powerUp.resolvePowerUpBoxCollision(this.boxes);
      powerUp.resolvePowerUpBoxCollision(this.bottomPlatform);

      if (
        this.player.position.x < powerUp.position.x + 50 &&
        this.player.position.x + this.player.width > powerUp.position.x &&
        this.player.position.y < powerUp.position.y + 50 &&
        this.player.position.y + this.player.height > powerUp.position.y
      ) {
        this.player.collectPowerUp(powerUp);
        this.powerUps.splice(index, 1);
      }

      if (powerUp.position.y > canvas.height) {
        this.powerUps.splice(index, 1);
      }
    });
  }

  spawnZombies() {
    if (this.isPrepTime || this.zombiesToSpawn <= 0) return;
    const random = Math.random();
    if (random < 0.3) {
      this.spawnZombieBasic();
    } else if (random > 0.3 && random < 0.6) {
      this.spawnBoxZombie();
    } else if (random > 0.6) {
      this.spawnBatZombie();
    }
    this.zombiesToSpawn--;
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

  placeMine() {
    if (this.numberOfMinesPlaced >= this.numberOfMines) return;
    if (this.player.isOnGround && this.isPrepTime) {
      const mine = new Mine({ player: this.player });
      this.mines.push(mine);
      this.numberOfMinesPlaced++;
      document.getElementById("number-mine").innerHTML =
        this.numberOfMines - this.numberOfMinesPlaced;
    }
  }

  placeBox() {
    if (this.boxesPlaced >= this.maximumBoxes) return;
    if (this.player.isOnGround && this.isPrepTime) {
      const box = new Box({
        position: {
          x: this.player.actualBox.position.x,
          y: this.player.actualBox.position.y,
        },
        width: 100,
        height: 100,
      });
      this.boxes.push(box);
      this.boxesPlaced++;
      document.getElementById("number-box").innerHTML =
        this.maximumBoxes - this.boxesPlaced;
    }
  }

  update() {
    if (this.player.playerIsDead()) {
      this.gameOver = true;
      return;
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
          } else if (zombie.namee === "batZombie") {
            this.updateScore(50);
          }
        }
      }
    });
    const timeNow = new Date();
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

    this.mines.forEach((mine, index) => {
      if (mine.detectZombieMineCollision(this.zombies)) {
        console.log("mines hit zombies");
        this.mines.splice(index, 1);
      }
      mine.update();
    });

    this.autoGun.update(this.zombies);

    //wave management dont go below this comment to code. highly volatile return statements crafted with atmost care below!!!!

    const timeNowForWaves = Date.now();
    if (this.isPrepTime) {
      document.getElementById("prep-time-value").innerHTML = Math.round(
        (this.prepTimeDuration - (timeNowForWaves - this.lastWaveEndTime)) /
          1000
      );
      if (timeNowForWaves - this.lastWaveEndTime > this.prepTimeDuration) {
        this.startWave();
      }
      return;
    }
    if (timeNowForWaves - this.lastPowerUpSpawn > this.powerUpSpawnGap) {
      this.spawnPowerUp();
      this.lastPowerUpSpawn = timeNowForWaves;
    }
    this.updatePowerUps();

    if (
      timeNowForWaves - this.lastSpawn > this.spawningGap &&
      this.zombiesToSpawn > 0 &&
      !this.isPrepTime
    ) {
      this.spawnZombies();
      this.lastSpawn = timeNowForWaves;
    }
    if (this.zombies.length === 0 && this.zombiesToSpawn === 0) {
      this.numberOfMinesPlaced = 0;
      this.boxesPlaced = 0;
      this.startPreparation();
    }
  }
}
