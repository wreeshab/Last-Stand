class Box {
  constructor({ position, width, height, hitpoints }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.crateImage = new Image();
    this.crateImage.src = "./assets/crate.png";
    this.hitpoints = 100;

    // Initialize hit points bar
    this.boxHitPointsBar = new HitPointsBar({
      position: {
        x: this.position.x + this.width / 2 - 40,
        y: this.position.y - 17,
      },
      hitpoints: this.hitpoints,
      totalHitpoints: 100,
    });
  }

  draw() {
    ctx.drawImage(
      this.crateImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // Render hit points bar
    this.boxHitPointsBar.update(this.hitpoints);
    // this.boxHitPointsBar.render();
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
