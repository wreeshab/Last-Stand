//done

class ZombieBasic {
  constructor({
    placeOfSpawn,
    velocity,
    health,
    animations,
    originalDirection,
    player,

  }) {
    this.position = placeOfSpawn;
    this.velocity = velocity;
    this.health = health;
    this.dead = false;
    this.color = "red";
    this.animations = animations;
    this.currentAnimation = "Idle";
    this.currentFrame = 1;
    this.elapsedFrames = 0;
    this.images = {};
    this.width = 0;
    this.height = 0;
    this.direction = originalDirection;
    this.hitpoints = health;
    this.preloadImages();
    //this is for player
    this.attackingGap = 1500;
    this.lastAttackTime = null;
    this.isTouchingBox = false;
    this.setAnimation("Walk")
    this.player = player;
    this.namee = "zombieBasic"
    this.isAttacking = false;
    
 
    
  }

  preloadImages() {
    Object.keys(this.animations).forEach((animation) => {
      const frames = [];
      const { imageSrc, frameRate } = this.animations[animation];
      for (let i = 1; i <= frameRate; i++) {
        const img = new Image();
        img.src = imageSrc.replace("1.png", `${i}.png`);
        img.onload = () => {
          if (this.width === 0 && this.height === 0) {
            this.width = img.width / 2.5;
            this.height = img.height / 2.5;
          }
          // img.width = this.width;
          // img.height = this.height;
        };
        frames.push(img);
      }
      this.images[animation] = frames;
    });
    this.initHitPointsBar();
  }

  initHitPointsBar() {
    this.zombieHitPointsBar = new HitPointsBar({
      position: {
        x: this.position.x + this.width / 2 - 40,
        y: this.position.y - 17,
      },
      hitpoints: this.hitpoints,
      totalHitpoints: 100,
      color: "white",
    });
  }

  setAnimation(animation) {
    if (this.currentAnimation !== animation) {
      this.currentAnimation = animation;
      this.currentFrame = 1;
      this.elapsedFrames = 0;
    }
  }

  updateFrameForZombie() {
    this.elapsedFrames++;
    if (
      this.elapsedFrames %
        this.animations[this.currentAnimation].frameBuffer ===
      0
    ) {
      this.currentFrame++;
      if (
        this.currentFrame > this.animations[this.currentAnimation].frameRate
      ) {
        this.currentFrame = 1;
      }
    }
  }
  resolveZombieBulletCollision(bullets) {
    let collisionDetected = false;
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (
        bullet.position.x + bullet.radius > this.position.x &&
        bullet.position.x - bullet.radius < this.position.x + this.width &&
        bullet.position.y + bullet.radius > this.position.y - this.height &&
        bullet.position.y - bullet.radius < this.position.y &&
        this.dead === false
      ) {
        console.log("Collision detected!");
        this.zombieIsTakingDamage(bullet.damage);
        bullets.splice(i, 1);
        collisionDetected = true;
      }
    }
    return collisionDetected;
  }

  zombieIsTakingDamage(damage) {
    this.hitpoints -= damage;
    if (this.hitpoints <= 30) {
      this.zombieHitPointsBar.color = "red";
    }
    if (this.hitpoints <= 0) {
      this.dead = true;
    }
  }
  isZombieDead() {
    if (this.hitpoints <= 0) {
      return true;
    }
    return false;
  }
  draw() {
    const image = this.images[this.currentAnimation][this.currentFrame - 1];
    if (image) {
      ctx.save();

      if (this.direction === "left") {
        ctx.translate(
          this.position.x + this.width / 2,
          this.position.y - this.height / 2
        );
        ctx.scale(-1, 1);
        ctx.translate(
          -this.position.x - this.width / 2,
          -this.position.y + this.height / 2
        );
      }

      ctx.drawImage(
        image,
        this.position.x,
        this.position.y - this.height,
        this.width,
        this.height
      );

      ctx.restore();
    }

    // ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    // ctx.fillRect(
    //   this.position.x,
    //   this.position.y - this.height,
    //   this.width,
    //   this.height
    // );

    // Update hit points bar position
    this.zombieHitPointsBar.position = {
      x: this.position.x + this.width / 2 - 40,
      y: this.position.y - this.height - 17,
    };

    this.zombieHitPointsBar.render();
  }

  collisionBeteenZombieAndPlayer(player) {
    this.timeNowForZombiePlayer = new Date();
    if (
      this.position.x + this.width > player.position.x &&
      this.position.x < player.position.x + player.width &&
      this.position.y - this.height < player.position.y + player.height &&
      this.position.y > player.position.y
    ) {
      console.log("collision between zombie and player");
      if (
        this.timeNowForZombiePlayer - this.lastAttackTime >
        this.attackingGap
      ) {
        this.lastAttackTime = this.timeNowForZombiePlayer;
        player.playerGettingDamage(7);
        this.isAttacking = true;
        console.log("player getting damage");
      }else{
        this.isAttacking = false;
      }
      return true;
    }
  }

  update() {
    if(this.isAttacking){
      this.setAnimation("Attack");
    }
    if(this.player.position.x > this.position.x && this.direction === "left"){
      this.direction = "right";
    }else if(this.player.position.x < this.position.x && this.direction === "right"){
      this.direction = "left";
      }
      if (this.direction === "left") {
      this.velocity.x = -1;
    } else {
      this.velocity.x = 1;
    }
    this.position.x += this.velocity.x;
    // this.setAnimation("Walk");

    // if (this.dead) {
    //   this.setAnimation("Dead");
    // } else if (this.isTouchingBox && this.dead == false) {
    //   this.setAnimation("Attack");
    // } else if (this.velocity == 0 && this.dead == true) {
    //   this.setAnimation("Dead");
    // } else {
    //   this.setAnimation("Walk");
    // }

    this.updateFrameForZombie();
    this.zombieHitPointsBar.update(this.hitpoints);
    
  this.draw();
    }
}
