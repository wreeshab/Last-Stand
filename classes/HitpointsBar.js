//done

class HitPointsBar {
  constructor({ position, hitpoints, totalHitpoints, color = "red" }) {
    this.position = position;
    this.hitpoints = hitpoints;
    this.totalHitpoints = totalHitpoints;
    this.width = (this.hitpoints / this.totalHitpoints) * 50;
    this.height = 5;
    this.color = color;
  }
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update(hitpoints) {
    this.width = (hitpoints / this.totalHitpoints) * 80;
    this.render();
  }
}
