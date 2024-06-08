
class Box {
  constructor({ position, width, height, hitpoints }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.crateImage = new Image();
    this.crateImage.src = "./assets/crate.png";
    this.hitpoints = 100;
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

  takeDamageBox(damage) {
    this.hitpoints -= damage;
    console.log(this.hitpoints);
  }

  boxIsDestroyed() {
    return this.hitpoints <= 0;
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