class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    enlargementRatio = 1,
    frameBuffer = 1,
  }) {
    this.position = position;
    // console.log(imageSrc);
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * enlargementRatio;
      this.height = this.image.height * enlargementRatio;
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.enlargementRatio = enlargementRatio;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }
  draw() {
    if (!this.image) return;

    const cropBox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: 48,
    };

    ctx.drawImage(
      this.image,
      cropBox.position.x,
      cropBox.position.y,
      cropBox.width,
      cropBox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.draw();
    this.updateFrame();
  }
  updateFrame() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else this.currentFrame = 0;
    }
  }
}
