class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    frameRate,
    enlargementRatio,
    frameBuffer,
    gunImageSrc,
    animations,
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

    this.gunImage = new Image();
    this.gunImage.src = gunImageSrc;
    this.gunAngle = 0;

    this.bullets = [];

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
        height: 90,
      };
    } else {
      this.actualBox = {
        position: { x: this.position.x + 65, y: this.position.y + 30 },
        width: 60,
        height: 90,
      };
    }
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

  drawTrajectories() {
    const initVelocity = 250;
    const timeStep = 0.05;
    const maxTime = 3; // Adjusted for better visualization
    const startX = this.actualBox.position.x + this.actualBox.width / 2;
    const startY = this.actualBox.position.y + this.actualBox.height / 2;

    // ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let t = 0; t < maxTime; t += timeStep) {
      const x = startX + initVelocity * t * Math.cos(this.gunAngle);
      const y =
        startY + initVelocity * t * Math.sin(this.gunAngle) + 0.5 * 100 * t * t;
      // console.log(x, y);
      this.fillDot(x, y);
    }
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 3;
    // ctx.stroke();
  }
  fillDot(x, y) {
    const radius = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
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
      bulletGravity: 0.65, // Lowered gravity for better visual effect
    });
    this.bullets.push(bullet);
  }
  update() {
    super.update();
    this.updateActualBox();
    this.drawTrajectories();
    this.draw();
    this.drawGun();

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
      this.isFacingRight = false; // Update facing direction
    } else if (
      keys.d.pressed &&
      this.position.x + this.width < canvas.width - 50
    ) {
      this.velocity.x = 5;
      this.isFacingRight = true; // Update facing direction
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
