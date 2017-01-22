var Block = function(x, y, img, cxt, gameInfo) {
    this.spirit = null;
    this.x = x || 0;
    this.y = y || 0;
    this.cxt = cxt;
    this.img = img;
    this.width = 100;
    this.height = 16;
    this.gameInfo = gameInfo;
    this.width
    this.yspeed = -0.5;
    this.init();
}
Block.prototype = {
    init: function() {
        var spirit = new Tool.spirit.Spirit({
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            img: this.img,
            cxt: this.cxt,
            yspeed: this.yspeed,
            gameInfo: this.gameInfo,
            fps: 10,
        });
        spirit.add("normal", new Tool.spirit.Animation({
            sw: 200,
            sh: 32,
            dir: "down",
        }));
        this.spirit = spirit;
    },
    updata: function() {
        this.spirit.updata();
    },
    draw: function() {
        this.spirit.draw();
    },
    checkLimit: function() {
        var frame = this.spirit.size();
        if (frame.y < 0) {
            return false;
        }
        return true;
    },
}
var BlockFactory = function(argument) {
    this.imgs = {};
    this.imgs.block = argument.block;
    this.imgs.move = argument.move;
    this.imgs.flip = argument.flip;
    this.imgs.thorn = argument.thorn;
    this.cxt = argument.cxt;
    this.gameInfo = argument.gameInfo;
}
BlockFactory.prototype = {
    creat: function() {
        var block = new Block(150, 300, this.imgs.block, this.cxt, this.gameInfo);
        return block;
    }
}