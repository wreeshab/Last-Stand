class HealthPowerUp {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 5 };
    this.image = new Image();
    this.image.src = "assets/powerups/Health.png";
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
    if (player.health <= 50) {
      player.health += 50;
    } else {
      player.health = 100;
    }
  }
}
