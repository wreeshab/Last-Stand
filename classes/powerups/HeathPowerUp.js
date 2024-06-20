class HealthPowerUp extends PowerUp {
  constructor() {
    super("assets/powerups/Health.png");
  }

  applyPrp(player) {
    if (player.hitpoints <= 50) {
      player.hitpoints += 50;
    } else {
      player.hitpoints = 100;
    }
  }
}
