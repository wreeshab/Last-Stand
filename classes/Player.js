class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    frameRate,
    enlargementRatio,
    frameBuffer,
    gunImageSrc,
    animations,
    boxes,
    guns,
  }) {
    super({ position, imageSrc, frameRate, enlargementRatio, frameBuffer });
    this.velocity = { x: 0, y: 0 };
    this.isOnGround = false;
    this.isFacingRight = true; // Track the direction the player is facing
    this.actualBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 0,
      height: 0,
    };
    this.dead = false;

    this.gunImage = new Image();
    this.gunImage.src = gunImageSrc;
    this.gunAngle = 0;

    this.bullets = [];
    this.guns = guns;
    this.currentGun = 0;

    this.lastShotTime = 0;

    this.boxes = boxes;

    this.hitpoints = 100;

    this.bulletShotForRecoil = false;

    this.jumpPower = 15;

    this.jetpackOn = false;
    this.jetpack = new Image();
    this.jetpack.src = "./assets/jetpack.png";

    const self = this;
    document.addEventListener("mousemove", function (e) {
      self.updateGunAngle(e);
    });
    document.addEventListener("mousedown", function () {
      self.shootBullet();
    });

    this.animations = animations;

    for (let k in this.animations) {
      const image = new Image();
      image.src = this.animations[k].imageSrc;
      this.animations[k].image = image;
    }
    this.hitPointsBar = new HitPointsBar({
      position: {
        x: this.actualBox.position.x + this.width / 2 - 40,
        y: this.actualBox.position.y - 10,
      },
      hitpoints: this.hitpoints,
      totalHitpoints: 100,
      color: "white",
    });
  }

  switchSprite(sprite) {
    if (this.image === this.animations[sprite].image) return;
    this.image = this.animations[sprite].image;
    this.frameRate = this.animations[sprite].frameRate;
    this.frameBuffer = this.animations[sprite].frameBuffer;
    this.currentFrame = 0; // Changed from frameIndex to currentFrame
  }

  updateGunAngle(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    const deltaX = mouseX - this.position.x - this.width / 2;
    const deltaY = mouseY - this.position.y - this.height / 2;
    const angle = Math.atan2(deltaY, deltaX);
    this.gunAngle = angle;
    this.adjustedGunAngle = this.gunAngle - 45;
  }

  updateActualBox() {
    if (this.isFacingRight) {
      this.actualBox = {
        position: { x: this.position.x + 7, y: this.position.y + 30 },
        width: 60,
        height: 95,
      };
    } else {
      this.actualBox = {
        position: { x: this.position.x + 65, y: this.position.y + 30 },
        width: 60,
        height: 95,
      };
    }
  }
  collisionBetweenPlayerAndPlatform(platform) {
    const playerBottom = this.actualBox.position.y + this.actualBox.height;
    const platformTop = platform.position.y;
    const playerTop = this.actualBox.position.y;
    const platformBottom = platform.position.y + platform.height;
    const playerRight = this.actualBox.position.x + this.actualBox.width;
    const platformRight = platform.position.x + platform.width;
    const playerLeft = this.actualBox.position.x;
    const platformLeft = platform.position.x;

    // Bottom collision checking
    if (
      playerBottom >= platformTop &&
      playerTop < platformTop &&
      playerRight > platformLeft &&
      playerLeft < platformRight &&
      this.velocity.y >= 0
    ) {
      this.position.y =
        platformTop -
        this.actualBox.height -
        (this.actualBox.position.y - this.position.y);
      this.velocity.y = 0;
      this.isOnGround = true;
    }

    // Left collision checking
    if (
      playerRight > platformLeft &&
      playerLeft < platformLeft &&
      playerBottom > platformTop + 1 &&
      playerTop < platformBottom - 1 &&
      this.velocity.x > 0
    ) {
      this.position.x =
        platformLeft -
        this.actualBox.width -
        (this.actualBox.position.x - this.position.x);
      this.velocity.x = 0;
    }

    // Right collision checking
    if (
      playerLeft < platformRight &&
      playerRight > platformRight &&
      playerBottom > platformTop + 1 &&
      playerTop < platformBottom - 1 &&
      this.velocity.x < 0
    ) {
      this.position.x =
        platformRight - (this.actualBox.position.x - this.position.x);
      this.velocity.x = 0;
    }
  }

  drawGun() {
    ctx.save();
    ctx.translate(
      this.actualBox.position.x + this.actualBox.width / 2,
      this.actualBox.position.y + this.actualBox.height / 2
    );
    this.adjustedGunAngle = this.gunAngle - Math.PI / 4 + Math.PI / 120; //this math.pi / 120 is some visual adjustment value that i found by trail and error
    ctx.rotate(this.adjustedGunAngle);
    const scaleRatio = 0.2;
    ctx.drawImage(
      this.gunImage,
      0,
      0,
      this.gunImage.width * scaleRatio,
      this.gunImage.height * scaleRatio
    );
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(
      1,
      1,
      this.gunImage.width * scaleRatio,
      this.gunImage.height * scaleRatio
    );
    ctx.restore();
  }

  updateTrajectory() {
    const trajectory = new Trajectory({
      startX: this.actualBox.position.x + this.actualBox.width / 2,
      startY: this.actualBox.position.y + this.actualBox.height / 2,
      angle: this.gunAngle,
      velocity: 251,
      gravity: this.guns[this.currentGun].BulletGravity,
      color: "rgba(255, 255, 255, 0.95)",
    });
    console.log(trajectory);
    // trajectory.gravity = this.guns[this.currentGun].BulletGravity;
    // trajectory.velocity = this.guns[this.currentGun].bulletVelocity
    trajectory.draw();
  }

  drawGun() {
    this.guns[this.currentGun].draw(this);
  }
  shootBullet() {
    const timeNowForShootBullet = Date.now();
    if (
      timeNowForShootBullet - this.lastShotTime <
      this.guns[this.currentGun].fireRate
    ) {
      return;
    }
    this.lastShotTime = timeNowForShootBullet;
    if (this.currentGun === 1) {
      for (let i = 0; i < 5; i++) {
        const bullet = new Bullet({
          position: {
            x: this.actualBox.position.x + this.actualBox.width / 2,
            y: this.actualBox.position.y + this.actualBox.height / 2,
          },
          velocity: {
            x:
              Math.cos(this.gunAngle - Math.PI / 6 + (Math.PI / 12) * i) *
              this.guns[this.currentGun].bulletVelocity,
            y:
              Math.sin(this.gunAngle - Math.PI / 6 + (Math.PI / 12) * i) *
              this.guns[this.currentGun].bulletVelocity,
          },
          damage: this.guns[this.currentGun].damage,
          // bulletGravity: .65,
          bulletGravity: this.guns[this.currentGun].bulletGravity,
          boxes: this.boxes,
          bullets: this.bullets,
        });
        this.bullets.push(bullet);
      }
    } else {
      const bullet = new Bullet({
        position: {
          x: this.actualBox.position.x + this.actualBox.width / 2,
          y: this.actualBox.position.y + this.actualBox.height / 2,
        },
        velocity: {
          x:
            Math.cos(this.gunAngle) * this.guns[this.currentGun].bulletVelocity,
          y:
            Math.sin(this.gunAngle) * this.guns[this.currentGun].bulletVelocity,
        },
        damage: this.guns[this.currentGun].damage,
        // bulletGravity: .65,
        bulletGravity: this.guns[this.currentGun].bulletGravity,
        boxes: this.boxes,
        bullets: this.bullets,
      });
      this.bullets.push(bullet);
    }

    // this.update()
    this.bulletShotForRecoil = true;
    this.updateActualBox();
    this.boxes.forEach((box) => {
      this.collisionBetweenPlayerAndPlatform(box);
    });
  }

  switchGun(index) {
    1;
    if (this.currentGun === index) return;
    if (index >= 0 && index < this.guns.length) {
      this.currentGun = index;
    }
  }

  // shootBullet() {
  //   const bullet = new Bullet({
  //     position: {
  //       x: this.actualBox.position.x + this.actualBox.width / 2,
  //       y: this.actualBox.position.y + this.actualBox.height / 2,
  //     },
  //     velocity: {
  //       x: Math.cos(this.gunAngle) * 20,
  //       y: Math.sin(this.gunAngle) * 20,
  //     },
  //     bulletGravity: 0.65, //dont change this gravity value:(
  //     boxes: this.boxes,
  //     bullets: this.bullets,
  //   });
  //   this.bullets.push(bullet);
  // }

  playerGettingDamage(damage) {
    this.hitpoints -= damage;
    if (this.hitpoints <= 0) {
      this.hitpoints = 0;
      this.hitPointsBar.update(this.hitpoints);
      this.dead = true;
    }
    if (this.hitpoints <= 35) {
      this.hitPointsBar.color = "red";
    }
  }

  playerIsDead() {
    if (this.dead) {
      return true;
    }
    return false;
  }

  draw() {
    ctx.save();

    if (!this.isFacingRight) {
      ctx.translate(this.position.x + this.width / 2, 0); // Move to the sprite's horizontal center
      ctx.scale(-1, 1); // Flip the context horizontally
      ctx.translate(-this.position.x - this.width / 2, 0); // Move back to the original position
    }

    super.draw();

    ctx.restore();
    // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    // ctx.fillRect(
    //   this.actualBox.position.x,
    //   this.actualBox.position.y,
    //   this.actualBox.width,
    //   this.actualBox.height
    // );

    this.hitPointsBar.position = {
      x: this.actualBox.position.x + this.actualBox.width / 2 - 40,
      y: this.actualBox.position.y - 17,
    };

    this.hitPointsBar.render();
  }

  collectPowerUp(powerUp) {
    powerUp.applyPrp(this);
  }

  drawJetpack() {
    if (this.jetpackOn) {
      ctx.drawImage(
        this.jetpack,
        this.actualBox.position.x + this.actualBox.width / 2 - 37.5,
        this.actualBox.position.y,
        75,
        75
      );
    }
  }

  update() {
    super.update();
    this.updateActualBox();
    this.drawJetpack();
    if(this.currentGun === 0 ){
      this.updateTrajectory();
    }
    this.draw();
    this.drawGun();



    this.hitPointsBar.update(this.hitpoints);

    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.isItOffScreen()) {
        this.bullets.splice(index, 1);
      }
    });

    this.boxes.forEach((box) => {
      this.collisionBetweenPlayerAndPlatform(box);
    });

    this.velocity.y += gravity;

    if (keys.a.pressed && this.position.x > 50) {
      this.velocity.x = -5;
      this.isFacingRight = false;
    } else if (
      keys.d.pressed &&
      this.position.x + this.width < canvas.width - 50
    ) {
      this.velocity.x = 5;
      this.isFacingRight = true;
    } else if (!keys.a.pressed || !keys.d.pressed || keys.w.pressed) {
      this.velocity.x = 0;
    } else {
      this.velocity.x = 0;
    }
    if (this.bulletShotForRecoil) {
      //putting recoil
      this.velocity.x -=
        Math.cos(this.gunAngle) * this.guns[this.currentGun].recoil;
      this.position.y -=
        Math.sin(this.gunAngle) * this.guns[this.currentGun].recoil;
      this.bulletShotForRecoil = false;
    }

    if (keys.w.pressed && this.isOnGround) {
      this.velocity.y = -this.jumpPower;
      if (this.jetpackOn) {
        this.isOnGround = true;
      } else {
        this.isOnGround = false;
      }
    }
    if (this.jetpackOn) {
      this.switchSprite("Idle");
    } else if (!this.isOnGround) {
      this.switchSprite("Jump");
    } else if (keys.d.pressed || keys.a.pressed) {
      this.switchSprite("Run");
    } else {
      this.switchSprite("Idle");
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height > canvas.height) {
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
      this.isOnGround = true;
    }

    if (this.position.y < 0) {
      this.position.y = 0;
    }
  }
}
