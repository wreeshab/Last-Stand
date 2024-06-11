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
    this.boxes = boxes;

    this.hitpoints = 100;

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
        height: 100,
      };
    } else {
      this.actualBox = {
        position: { x: this.position.x + 65, y: this.position.y + 30 },
        width: 60,
        height: 100,
      };
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
      gravity: 100,
      color: "rgba(255, 255, 255, 0.95)",
    });

    trajectory.draw();
  }

  shootBullet() {
    const bullet = new Bullet({
      position: {
        x: this.actualBox.position.x + this.actualBox.width / 2,
        y: this.actualBox.position.y + this.actualBox.height / 2,
      },
      velocity: {
        x: Math.cos(this.gunAngle) * 20,
        y: Math.sin(this.gunAngle) * 20,
      },
      bulletGravity: 0.65, //dont change this gravity value:(
      boxes: this.boxes,
      bullets: this.bullets,
    });
    this.bullets.push(bullet);
  }

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
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(
      this.actualBox.position.x,
      this.actualBox.position.y,
      this.actualBox.width,
      this.actualBox.height
    );

    this.hitPointsBar.position = {
      x: this.actualBox.position.x + this.actualBox.width / 2 - 40,
      y: this.actualBox.position.y - 17,
    };

    this.hitPointsBar.render();
  }

  update() {
    super.update();
    this.updateActualBox();
    this.updateTrajectory();
    // this.drawTrajectories();
    this.draw();
    this.drawGun();
    this.hitPointsBar.update(this.hitpoints);

    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.isItOffScreen()) {
        this.bullets.splice(index, 1);
      }
    });
    //here againn to put some visually pleasing looks the dots will be ath the back then the player then the gun in the very front

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
    } else if (!keys.a.pressed && !keys.d.pressed && keys.w.pressed) {
      this.velocity.x = 0;
    } else {
      this.velocity.x = 0;
    }

    if (keys.w.pressed && this.isOnGround) {
      this.velocity.y = -15;
      this.isOnGround = false;
    }

    if (!this.isOnGround) {
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
  }
}
