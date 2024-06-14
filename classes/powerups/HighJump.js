class HighJump {
    constructor(duration = 10000){
        this.duration = duration;
    }
    applyPrp(player){
        player.jumpPower += 5;
        setTimeout(() => {
            player.jumpPower -= 5;
        }, this.duration);
    }
}