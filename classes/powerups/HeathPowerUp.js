class HealthPowerUp {
  constructor() {}

  applyPrp(player) {
    if (player.health <= 50) {
      player.health += 50;
    } else {
      player.health = 100;
    }
  }
}
