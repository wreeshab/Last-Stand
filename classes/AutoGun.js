class AutoGun {
  constructor({ player }) {
    this.position = {
      x: canvas.width / 2,
      y: 100,
    };
    this.angle = 0;
    this.lastAutoGunShoot = new Date();
    this.autoGunShootGap = 5000;
    this.player = player;

    this.image = new Image();
    this.image.src = "./assets/guns/AutoGun.png";
    // this.image.onload = () => {
    //   this.draw();
    // };

    this.gunOpertor = new Image();
    this.gunOpertor.src = "assets/hero2/Punk_idle.png";
    this.gunOpertor.image;

    this.currentFrame = 0;
    this.frameBuffer = 9;
    this.frameCounter = 5;

    this.draw();
  }
  draw() {
    ctx.drawImage(
      this.gunOpertor,
      this.currentFrame * (this.gunOpertor.width / 4),
      0,
      this.gunOpertor.width / 4,
      this.gunOpertor.height,
      canvas.width / 2 ,
      200,
      200,
      150
    );
    this.frameCounter++;
    if (this.frameCounter % this.frameBuffer === 0) {
      this.currentFrame++;
      if (this.currentFrame >= 4) {
        this.currentFrame = 0;
      }
    }

    this.position = {
      x: canvas.width / 2 +50,
      y: 300,
    };

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle - Math.PI / 4 + Math.PI / 12);
    ctx.drawImage(this.image, 0, 0, 100, 100);
    ctx.restore();
  }
  rotateTowardsZombie(zombie) {
    const xDir = zombie.position.x - this.position.x;
    const yDir = zombie.position.y - this.position.y;
    this.angle = Math.atan2(yDir, xDir);
  }
  autoGunShoot() {
    const autoBulletCount = 7;
    for (let i = 0; i < autoBulletCount; i++) {
      const autoSpread = ((Math.random() - 0.5) * Math.PI) / 6;
      const velocity = {
        x: Math.cos(this.angle + autoSpread) * 10,
        y: Math.sin(this.angle + autoSpread) * 6,
      };
      this.player.bullets.push(
        new Bullet({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          velocity: velocity,
          bulletGravity: 0.1,
          damage: 5,
          boxes: this.player.boxes,
          bullets: this.player.bullets,
          radius:4,
        })
      );
    }
    this.lastAutoGunShoot = new Date();
  }
  update(zombies) {
    if (zombies.length > 0) {
      const randomZombie = zombies[Math.floor(Math.random() * zombies.length)];
      // this.rotateTowardsZombie(randomZombie);
      if (Date.now() - this.lastAutoGunShoot > this.autoGunShootGap) {
        this.rotateTowardsZombie(randomZombie);
        this.autoGunShoot();
      }
    }
    this.draw();
  }
}
