class PowerUp {
    constructor(imageSrc) {
      this.position = { x: Math.random() * canvas.width, y: 0 };
      this.velocity = { x: 0, y: 5 };
      this.image = new Image();
      this.image.src = imageSrc;
    }
  
    draw() {
      ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
      this.position.y += this.velocity.y;
    }
  
    resolvePowerUpBoxCollision(platforms) {
      for (let platform of platforms) {
        if (
          this.position.x < platform.position.x + platform.width &&
          this.position.x + 50 > platform.position.x &&
          this.position.y < platform.position.y + platform.height &&
          this.position.y + 50 > platform.position.y
        ) {
          this.velocity.y = 0;
          this.position.y = platform.position.y - 50;
        }
      }
    }
  
    applyPrp(player) {}
  }