class ZombieBasic {
  constructor({ placeOfSpawn, velocity, health }) {
    this.position = placeOfSpawn;
    this.velocity = velocity;
    this.health = health;
    this.dead = false;
    this.color = "red";
    this.image = new Image();
    this.image.src = "assets/zombies/Zombie1/animation/Idle1.png";
    this.image.onload = () => {
      this.image.width = 120;
      this.image.height = 180;
      this.width = this.image.width;
      this.height = this.image.height;
    };
    if (velocity.x > 0){
        this.image = this.image
    }else{
        ctx.save();
        ctx.scale(-1, 1);
        this.image = this.image
        ctx.restore();
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y - this.image.height,
      this.image.width,
      this.image.height
    );
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(
      this.position.x,
      this.position.y - this.height,
      this.width,
      this.height
    );
    // ctx.fillStyle = this.color;
    // ctx.fillRect(
    //   this.position.x,
    //   this.position.y - this.height,
    //   this.width,
    //   this.height
    // );
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }

  takingDamageNow(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.dead = true;
    }
  }

  resolveBoxZombieCollision(box, zombies) {
    zombies.forEach((zombie) => {
      if (zombie !== this) {
        if (
          this.position.x + this.width > box.position.x &&
          this.position.x - this.width < box.position.x + box.width &&
          this.position.y + this.height > box.position.y &&
          this.position.y - this.height < box.position.y + box.height
        ) {

          if (
            this.position.x + this.width > box.position.x &&
            this.position.x  < box.position.x + box.width &&
            this.velocity.x > 0
          ) {
            this.position.x = box.position.x - this.width -0.01;
            this.velocity.x = 0;
            // box.takeDamage(10);
          }
  
          if (
            this.position.x  < box.position.x + box.width &&
            this.position.x + this.width > box.position.x &&
            this.velocity.x < 0
          ) {
            this.position.x = box.position.x + box.width +0.01;
            this.velocity.x = 0;
            // box.takeDamage(10);
          }
        }
      }
    });
  }
}
