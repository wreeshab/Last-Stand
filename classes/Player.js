class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    frameRate,
    enlargementRatio,
    frameBuffer,
    gunImageSrc,
  }) {
    super({ position, imageSrc, frameRate, enlargementRatio, frameBuffer });
    this.velocity = { x: 0, y: 0 };
    this.isOnGround = false;
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
    this.actualBox = {
      position: { x: this.position.x + 7, y: this.position.y + 30 },
      width: 50,
      height: 90,
    };
  }

  draw() {
    super.draw();
  }

  drawGun() {
    ctx.save();
    ctx.translate(
      this.actualBox.position.x + this.actualBox.width / 2,
      this.actualBox.position.y + this.actualBox.height / 2
    );
    ctx.rotate(this.gunAngle - 45);
    // Reduce the size of the gun by scaling
    const scaleRatio = 0.2;
    ctx.drawImage(
      this.gunImage,
      0,
      0,
      this.gunImage.width * scaleRatio,
      this.gunImage.height * scaleRatio
    );
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(1,1,this.gunImage.width * scaleRatio,this.gunImage.height * scaleRatio)
    ctx.restore();
  }

  update() {
    this.draw();
    super.update();
    this.updateActualBox();
    this.drawGun();

    // ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    // ctx.fillRect(
    //   this.actualBox.position.x,
    //   this.actualBox.position.y,
    //   this.actualBox.width,
    //   this.actualBox.height
    // );

    this.velocity.y += gravity;

    if (keys.a.pressed && this.position.x > 50) {
      this.velocity.x = -5;
    } else if (
      keys.d.pressed &&
      this.position.x + this.width < canvas.width - 50
    ) {
      this.velocity.x = 5;
    } else {
      this.velocity.x = 0;
    }

    if (keys.w.pressed && this.isOnGround) {
      this.velocity.y = -15;
      this.isOnGround = false;
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
