
class BulletRain extends PowerUp {
  constructor() {
    super("assets/powerups/bulletRain.png");
  }

  applyPrp(player) {
    for (let i = 0; i < 30; i++) {
      const bullet = new Bullet({
        position: { x: Math.random() * canvas.width, y: 0 },
        velocity: { x: 0, y: 1},

        damage: player.guns[player.currentGun].damage,
        bulletGravity: 1,
        boxes: player.boxes,
        bullets: player.bullets,
      });
      player.bullets.push(bullet);
    }
  }
}