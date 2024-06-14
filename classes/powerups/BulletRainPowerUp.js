
class BulletRain extends PowerUp {
  constructor() {
    super("assets/powerups/bulletRain.png");
  }

  applyPrp(player) {
    for (let i = 0; i < 55; i++) {
      const bullet = new Bullet({
        position: { x: Math.random() * canvas.width, y: 0 },
        velocity: { x: (Math.random() * 5 + 1), y: Math.random() < 0.5 ? (Math.random() * 5+ 1):-(Math.random() * 5+ 1)},

        damage: player.guns[player.currentGun].damage,
        bulletGravity: Math.random() * 2,
        boxes: player.boxes,
        bullets: player.bullets,
      });
      player.bullets.push(bullet);
    }
  }
}