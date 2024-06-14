
class RapidFire extends PowerUp {
  constructor(duration = 10000) {
    super("assets/powerups/RapidFire.png");
    this.duration = duration;
  }

  applyPrp(player) {
    player.guns.forEach(gun => {
      gun.fireRate /= 3;
    });
    setTimeout(() => {
      player.guns.forEach(gun => {
        gun.fireRate *= 3;
      });
    }, this.duration);
  }
}