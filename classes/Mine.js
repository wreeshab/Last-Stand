class Mine {
  constructor({ player }) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.player = player;

    this.position.x = player.actualBox.position.x;
    this.position.y =
      player.actualBox.position.y + this.player.actualBox.height - 50;

    this.image = new Image();
    this.image.src = "assets/tnt.png";

    this.zombieSteppedOnMine;
  }
  place() {
    ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
    // ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    // ctx.fillRect(this.position.x, this.position.y, 50, 50);
  }
  update() {
    this.place();
  }
  detectZombieMineCollision(zombies) {
    zombies.forEach((zombie) => {
      if (
        zombie.position.x < this.position.x + 50 &&
        zombie.position.x + zombie.width > this.position.x
        // zombie.position.y < this.position.y + 50 &&
        // zombie.position.y + zombie.height > this.position.y
      ) {
        this.blastMine();
        this.zombieSteppedOnMine = true;
      }
    });
    return this.zombieSteppedOnMine;
  }

  blastMine() {
    for (let i = 0; i < 30; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 75,
      };
      this.player.bullets.push(
        new Bullet({
          position: { x: this.position.x, y: this.position.y },
          velocity,
          bulletGravity: 0.2,
          bullets: this.player.bullets,
          damage: 30,
          radius: 6,
        })
      );
    }
  }
}
