class GunDamageInc{
    constructor(duration = 10000){
        this.duration = duration;
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 5 };
        this.image = new Image();
        this.image.src = "assets/powerups/GunDamage.png";
      }
    
      draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, 50, 50);
        this.position.y += this.velocity.y;
        if (this.position.y > canvas.height - 50) {
          this.velocity.y = 0;
          this.position.y = this.canvas.height - 50;
        }
      }
    applyPrp(player){
        player.guns.forEach(gun => {
            gun.damage *= 1.5;
        });
        setTimeout(() => {
            player.guns.forEach(gun => {
                gun.damage /= 1.5;
            });
        }, this.duration);
    }
}