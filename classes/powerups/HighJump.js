
class HighJump extends PowerUp {
    constructor(duration = 10000) {
      super("assets/powerups/HighJump.png");
      this.duration = duration;
    }
  
    applyPrp(player) {
      player.jumpPower += 5;
      setTimeout(() => {
        player.jumpPower -= 5;
      }, this.duration);
    }
  }