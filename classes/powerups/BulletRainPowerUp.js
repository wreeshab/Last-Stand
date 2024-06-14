class BulletRain {
    constructor() {}
  
    applyPrp(player) {
      for (let i = 0; i < 30; i++) {
        const bullet = new Bullet({
          position: { x: Math.random() * canvas.width, y: 0 },
          velocity: { x: 0, y: 5 },
          damage: player.guns[player.currentGun].damage,
          bulletGravity: 0,
          boxes: player.boxes,
          bullets: player.bullets,
        });
        player.bullets.push(bullet);
      }
    }
  }
  