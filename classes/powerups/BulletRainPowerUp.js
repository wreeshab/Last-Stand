class BulletRain {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 5 };
    this.image = new Image();
    this.image.src = "assets/powerups/bulletRain.png";
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
    this.position.y += this.velocity.y;
    if (this.position.y > canvas.height - 50) {
      this.velocity.y = 0;
      this.position.y = this.canvas.height - 50;
    }
  }

  applyPrp(player) {
    for (let i = 0; i < 30; i++) {
      const bullet = new Bullet({
        position: { x: Math.random() * canvas.width, y: 0 },
        velocity: { x: 0, y: 5 },
        damage: player.guns[player.currentGun].damage,
        bulletGravity: 0,
        boxes: player.boxes,
        bullets: player.bullets,
      });
      player.bullets.push(bullet);
    }
  }
}
