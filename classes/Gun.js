class Gun {
  constructor({
    name,
    bulletVelocity,
    fireRate,
    damage,
    imageSrc,
    bulletGravity,
    recoil,
  }) {
    this.name = name;
    this.bulletVelocity = bulletVelocity;
    this.fireRate = fireRate;
    this.damage = damage;
    this.bulletGravity = bulletGravity;
    this.imageSrc = imageSrc;
    this.image = new Image();
    this.image.src = this.imageSrc;
    this.recoil = recoil;
  }
  draw(player) {
    ctx.save();
    ctx.translate(
      player.actualBox.position.x + player.actualBox.width / 2,
      player.actualBox.position.y + player.actualBox.height / 2
    );
    ctx.rotate(player.gunAngle - Math.PI / 4 + Math.PI / 120);
    const scaleRatio = 0.2;
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width * scaleRatio,
      this.image.height * scaleRatio
    );

    // ctx.fillStyle = "rgba(255, 255, 255,.3)";
    // ctx.fillRect(0,0,this.image.width * scaleRatio,this.image.height * scaleRatio)
    ctx.restore();
  }
}
