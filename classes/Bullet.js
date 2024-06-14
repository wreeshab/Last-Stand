class Bullet {
    constructor({ position, velocity, bulletGravity,boxes,bullets,damage = 10 }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 9;
      this.bulletGravity = bulletGravity;
      this.boxes = boxes;
      this.bullets = bullets;
      this.damage = damage;
      this.isPiercing = false;
           
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
    bulletCollisionWithBox() {
      for (let i = 0; i < this.bullets.length; i++) {
        const bullet = this.bullets[i];
        const bulletX = bullet.position.x;
        const bulletY = bullet.position.y;
        const bulletWidth = bullet.width;
        boxes.forEach((box)=>{
          if(bulletX >= box.position.x && bulletX <= box.position.x + box.width && bulletY >= box.position.y && bulletY <= box.position.y + box.height){
            this.bullets.splice(i, 1);
          }
        })
      }
    }
  
    update() {
      // console.log(this.bulletGravity)
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.velocity.y +=  this.bulletGravity ;
      this.draw();
      this.bulletCollisionWithBox();
    }
  
    isItOffScreen() {
      return this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0 || this.position.y > canvas.height;
    }
  }