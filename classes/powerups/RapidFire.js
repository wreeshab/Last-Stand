class RapidFire {
    constructor(duration = 10000) {
      this.duration = duration;
    }
  
    applyPrp(player) {
      player.fireRate /= 2;
      setTimeout(() => {
        player.fireRate *= 2;
      }, this.duration);
    }
  }
  