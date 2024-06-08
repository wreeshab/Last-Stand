class Bullet {
    constructor({ position, velocity, bulletGravity }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 10;
      this.bulletGravity = bulletGravity;
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
  
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.velocity.y +=  this.bulletGravity ;
      this.draw();
    }
  
    isItOffScreen() {
      return this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0 || this.position.y > canvas.height;
    }
  }