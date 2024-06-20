class JetPack extends PowerUp {
  constructor(duration = 10000) {
    super("assets/jetpack.png");
    this.duration = duration;
  }

  applyPrp(player) {
    if (player.jetpackOn) return;

    player.jetpackOn = true;
    player.jumpPower = 4;
    setTimeout(() => {
      player.jetpackOn = false;
      player.jumpPower = 15;
    }, this.duration);
  }
}
