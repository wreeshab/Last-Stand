//done
class Bat {
  constructor({ position, velocity, player }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 150;
    this.height = 75;
    this.currentFrame = 0;
    this.frameBuffer = 10;
    this.frameRate = 2;
    this.elapsedFrames = 0;
    this.imageSrc = "./assets/zombies/Bat/bat.png";
    this.image = new Image();
    this.image.src = this.imageSrc;
    this.image.onload = () => {
      this.totWidth = this.image.width;
    };
    this.player = player;
    this.isDead = false;

    this.health = this.xDir = 0;
    this.yDir = 0;
    this.distance = 0;
    this.unitXDir = 0;
    this.unitYDir = 0;

    this.resX = 0;
    this.resY = 0;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.currentFrame * (this.totWidth / this.frameRate),
      0,
      this.totWidth / this.frameRate,
      this.image.height,
      this.position.x,
      this.position.y,
      this.width / 2,
      this.height
    );
    // ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    // ctx.fillRect(this.position.x, this.position.y, this.width / 2, this.height);

    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      this.currentFrame++;
      if (this.currentFrame >= this.frameRate) {
        this.currentFrame = 0;
      }
    }
  }

  resolveCollisionBwPlayerAndBat() {
    // console(this.player.actualBox.x)
    if (
      this.player.actualBox.position.x < this.position.x + this.width &&
      this.player.actualBox.position.x + this.player.actualBox.width >
        this.position.x &&
      this.player.actualBox.position.y < this.position.y + this.height &&
      this.player.actualBox.position.y + this.player.actualBox.height >
        this.position.y
    ) {
      this.resY = 25 + Math.random() * 100;
      this.resX = Math.random() * 200;
      this.position.y -= this.resY;
      Math.random() > 0.5
        ? (this.position.x += this.resX)
        : (this.position.x -= this.resX);
      this.player.playerGettingDamage(3);
    }
  }

  collisionBetweenBatAndBullet() {
    this.player.bullets.forEach((bullet) => {
      console.log("yo");
      if (
        bullet.position.x > this.position.x &&
        bullet.position.x < this.position.x + this.width &&
        bullet.position.y > this.position.y &&
        bullet.position.y < this.position.y + this.height
      ) {
        this.isDead = true;
      }
    });
  }

  update() {
    //lets find the diagonal between player and bat using pythagores theorem
    this.xDir = this.player.position.x - this.position.x;
    this.yDir = this.player.position.y - this.position.y;
    this.distance = Math.sqrt(this.xDir * this.xDir + this.yDir * this.yDir);

    this.unitXDir = this.xDir / this.distance;
    this.unitYDir = this.yDir / this.distance;

    this.velocity.x = this.unitXDir * 1;
    this.velocity.y = this.unitYDir * 1;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.resolveCollisionBwPlayerAndBat();
    this.collisionBetweenBatAndBullet();
    this.draw();
  }
}
