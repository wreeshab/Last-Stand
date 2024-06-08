class GameLogic {
    constructor({ player, boxes }) {
      this.zombies = [];
      this.waveNumber = 1;
      this.spawningGap = 1000;
      this.player = player;
      this.boxes = boxes;
      this.lastSpawn = Date.now();
    }
    spawnZombies() {
      const side = Math.random() < 0.5 ? "left" : "right";
      const placeOfSpawn =
        side === "left"
          ? { x: 0, y: canvas.height - 50 }
          : { x: canvas.width, y: canvas.height - 50 };
      const velocity = side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
      const health = 1;
      this.zombies.push(new ZombieBasic({ placeOfSpawn, velocity, health }));
    }
    update() {
      const timeNow = Date.now();
      if (timeNow - this.lastSpawn > this.spawningGap) {
        this.spawnZombies();
        this.lastSpawn = timeNow;
      }
      this.boxes.forEach((box,boxIndex) => {
          this.zombies.forEach(zombie => {
              zombie.resolveBoxZombieCollision(box,this.zombies)
              
              if(box.boxIsDestroyed()){
                  this.boxes.splice(boxIndex,1)
          
              }
          })
          
      })
      this.zombies.forEach((zombie) => {
        zombie.update();
      });
    }
  }