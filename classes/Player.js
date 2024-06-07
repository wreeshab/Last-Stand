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

    const self = this;
    document.addEventListener("mousemove", function (e) {
      self.updateGunAngle(e);
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
  }

  updateActualBox() {
    if(this.isFacingRight){
      this.actualBox = {
        position: { x: this.position.x + 7, y: this.position.y + 30 },
        width: 60,
        height: 90,
      };
    }else{
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
    ctx.rotate(this.gunAngle - 45);
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

  update() {
    this.draw();
    super.update();
    this.updateActualBox();
    this.drawGun();

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
