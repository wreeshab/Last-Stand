
class RapidFire extends PowerUp {
  constructor(duration = 10000) {
    super("assets/powerups/RapidFire.png");
    this.duration = duration;
  }

  applyPrp(player) {
    player.fireRate /= 2;
    setTimeout(() => {
      player.fireRate *= 2;
    }, this.duration);
  }
}