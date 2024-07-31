//done

//uses the concept of virtual time to generate parabola that is independent of time.
class Trajectory {
  constructor({
    startX,
    startY,
    angle,
    velocity,
    gravity = 100,
    color = "rgba(255,255,255,0.95)",
  }) {
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
    this.velocity = velocity;
    this.gravity = gravity;
    this.color = color;
  }

  draw() {
    const timeStep = 0.05;
    const maxTime = 3.5;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);

    for (let t = 0; t < maxTime; t += timeStep) {
      const x = this.startX + this.velocity * t * Math.cos(this.angle);
      const y =
        this.startY +
        this.velocity * t * Math.sin(this.angle) +
        0.5 * this.gravity * t * t;
      this.putDot(x, y);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  putDot(x, y) {
    const radius = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
