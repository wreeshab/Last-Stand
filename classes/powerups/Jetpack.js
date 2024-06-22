class JetPack extends PowerUp {
  constructor(duration = 10000) {
    super("assets/jetpack.png");
    this.duration = duration;
  }

  applyPrp(player) {
    if (player.jetpackOn) return;

    player.jetpackOn = true;
    player.jumpPower -= 10;
    setTimeout(() => {
      player.jetpackOn = false;
      player.jumpPower += 10;
    }, this.duration);
  }
}
