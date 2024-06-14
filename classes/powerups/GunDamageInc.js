
class GunDamageInc extends PowerUp {
    constructor(duration = 10000) {
      super("assets/powerups/GunDamage.png");
      this.duration = duration;
    }
  
    applyPrp(player) {
      player.guns.forEach(gun => {
        gun.damage *= 2;
      });
      setTimeout(() => {
        player.guns.forEach(gun => {
          gun.damage /= 2;
        });
      }, this.duration);
    }
  }
  