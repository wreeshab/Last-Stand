class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    frameRate,
    enlargementRatio,
    frameBuffer,
  }) {
    super({ position, imageSrc, frameRate, enlargementRatio, frameBuffer });
    this.velocity = { x: 0, y: 0 };
    this.isOnGround = false;
    this.actualBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 0,
      height: 0,
    };
  }

  updateActualBox() {
    this.actualBox = {
      position: { x: this.position.x + 7, y: this.position.y + 30 },
      width: 50,
      height: 90,
    };
  }

  update() {
    this.draw();
    super.update();
    this.updateActualBox();

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
