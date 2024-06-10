class BatZombie{ 
    constructor(position,toLocation,velocity,imageSrc){
        this.position = position;
        this.toLocation = toLocation;
        this.velocity = velocity;
        this.imageSrc = imageSrc;

        this.image = new Image();
        this.image.src = this.imageSrc;
        this.frameRate = 2;
        this.frameBuffer = 5;
        this.currentFrame = 0;
    }

    draw(){
        
    }
}