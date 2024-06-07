class Box {
  constructor({ position, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.crateImage = new Image();
    this.crateImage.src = "./assets/crate.png";
  }
  draw() {
    ctx.drawImage(
      this.crateImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
class BottomPlatform {
  constructor({ position, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
  draw() {
    ctx.fillStyle = "transparent";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
