class ZombieBasic {
  constructor({
    placeOfSpawn,
    velocity,
    health,
    animations,
    originalDirection,
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
    this.preloadImages();
    this.isZombieTouchingBox = false;
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
          img.width = this.width;
          img.height = this.height;
        };
        frames.push(img);
      }
      this.images[animation] = frames;
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

  draw() {
    const image = this.images[this.currentAnimation][this.currentFrame - 1];
    if (image) {
      ctx.save();

      if (this.direction === "left") {
        ctx.translate(
          this.position.x + this.width / 2,
          this.position.y - this.height / 2
        );
        ctx.scale(-1, 1); // Flip horizontally
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

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.fillRect(
      this.position.x,
      this.position.y - this.height,
      this.width,
      this.height
    );
  }
  update() {
    if (!this.isZombieTouchingBox && this.velocity.x != 0 ) {
      // Move the zombie
      if (this.direction === "left") {
        this.velocity.x = -1;
      } else {
        this.velocity.x = 1;
      }
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      
      // Set animation to Walk
      this.setAnimation("Walk");
    } else {
      // Zombie is either not moving or touching a box, set animation to Attack
      this.setAnimation("Attack");
    }
  
    // Update frame for the zombie animation
    this.updateFrameForZombie();
  
    // Draw the zombie
    this.draw();
  }
  
  resolveBoxZombieCollision(box, zombies) {
    let collidedWithBox = false;
    zombies.forEach((zombie) => {
      if (zombie !== this) {
        if (
          this.position.x + this.width > box.position.x &&
          this.position.x < box.position.x + box.width &&
          this.position.y + this.height > box.position.y &&
          this.position.y - this.height < box.position.y + box.height
        ) {
          // Right side collision
          if (
            this.position.x + this.width > box.position.x &&
            this.position.x < box.position.x + box.width &&
            this.velocity.x > 0
          ) {
            this.position.x = box.position.x - this.width - 0.01;
            this.velocity.x = 0;
            this.isZombieTouchingBox = true;
            box.takeDamageBox(50);
            collidedWithBox = true;
          }
          // Left side collision
          if (
            this.position.x < box.position.x + box.width &&
            this.position.x + this.width > box.position.x &&
            this.velocity.x < 0
          ) {
            this.position.x = box.position.x + box.width + 0.01;
            this.velocity.x = 0;
            this.isZombieTouchingBox = true;
            box.takeDamageBox(50);
            collidedWithBox = true;
          }
        } else {
          this.isZombieTouchingBox = false;
        }
      }
    });

    // If no collision occurred with the box, reset the flag
    if (!collidedWithBox) {
      this.isZombieTouchingBox = false;
    }
  }
}
