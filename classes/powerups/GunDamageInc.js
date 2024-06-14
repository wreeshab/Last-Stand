
class GunDamageInc extends PowerUp {
    constructor(duration = 10000) {
      super("assets/powerups/GunDamage.png");
      this.duration = duration;
    }
  
    applyPrp(player) {
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
  