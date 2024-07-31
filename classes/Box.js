//done

class Box {
  constructor({ position, width, height, hitpoints }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.crateImage = new Image();
    this.crateImage.src = "./assets/crate.png";
    this.hitpoints = 100;

    this.boxHitPointsBar = new HitPointsBar({
      position: {
        x: this.position.x + this.width / 2 - 40,
        y: this.position.y - 17,
      },
      hitpoints: this.hitpoints,
      totalHitpoints: 100,
    });

    this.lastHitByZombieToBox = null;
  }

  draw() {
    ctx.drawImage(
      this.crateImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    this.boxHitPointsBar.update(this.hitpoints);
  }

  takeDamageBox(damage) {
    this.hitpoints -= damage;
    // console.log(this.hitpoints);
  }

  boxIsDestroyed() {
    return this.hitpoints <= 0;
  }
  collisionBetweenBoxAndZombie(zombie) {
    if (zombie.namee === "boxZombie") return false;
    if (
      this.position.x < zombie.position.x + zombie.width &&
      this.position.x + this.width > zombie.position.x &&
      zombie.direction === "left"
    ) {
      zombie.position.x = this.position.x + this.width + 0.01;
      // zombie.velocity.x = 0;
      zombie.isAttacking = true;
    } else if (
      this.position.x < zombie.position.x + zombie.width &&
      this.position.x + this.width > zombie.position.x &&
      zombie.direction === "right"
    ) {
      zombie.position.x = this.position.x - zombie.width - 0.01;
      // zombie.velocity.x = 0;
      zombie.isAttacking = true;
    } else {
      zombie.isAttacking = false;
    }
    return zombie.isAttacking;
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
