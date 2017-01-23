var BaseBlock = function(x, y, img, cxt, gameInfo) {
    this.spirit = null;
    this.x = x || 0;
    this.y = y || 0;
    this.cxt = cxt;
    this.img = img;
    this.width = 100;
    this.height = 16;
    this.gameInfo = gameInfo;
    this.yspeed = -2;
    this.man = null;
    this.broken = false;
    this.stand = false;
    this.init();
}
BaseBlock.prototype = {
    init: function() {
        this.initSpirit();
    },
    initSpirit: function() {},
    belowMan: function(man) {
        if (this.stand) return;
        this.man = man;
        this.stand = true;
        this.subbelowMan();
    },
    subbelowMan: function() {},
    updata: function() {
        this.spirit.updata();
        this.subupdata();
    },
    subupdata: function() {},
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
    size: function() {
        return this.spirit.size();
    }
}
var NormalBlock = function(x, y, img, cxt, gameInfo) {
    BaseBlock.apply(this, arguments);
}
NormalBlock.prototype = new BaseBlock();
NormalBlock.prototype.initSpirit = function() {
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
};
var ThornBlock = function(x, y, img, cxt, gameInfo) {
    BaseBlock.apply(this, arguments);
}
ThornBlock.prototype = new BaseBlock();
ThornBlock.prototype.initSpirit = function() {
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
};
ThornBlock.prototype.subbelowMan = function() {
    this.man.cutlife(60);
}
var BrokenBlock = function(x, y, img, cxt, gameInfo) {
    this.dismisstime = 20;
    BaseBlock.apply(this, arguments);
}
BrokenBlock.prototype = new BaseBlock();
BrokenBlock.prototype.initSpirit = function() {
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
        starty: 32,
        sw: 200,
        sh: 32,
        dir: "down",
    }));
    this.spirit = spirit;
};
BrokenBlock.prototype.subupdata = function() {
    if (this.stand) this.dismisstime--;
    if (this.dismisstime <= 0) {
        this.broken = true;
    }
};
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
        var rand = Math.floor(Math.random() * 16);
        var rnd_x = Math.floor(Math.random() * 224);
        var block;
        switch (rand) {
            case 0:
            case 1:
            case 2:
            case 3:
                block = new BrokenBlock(rnd_x, 480, this.imgs.block, this.cxt, this.gameInfo);
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                block = new NormalBlock(rnd_x, 480, this.imgs.block, this.cxt, this.gameInfo);
                break;
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
                block = new ThornBlock(rnd_x, 480, this.imgs.thorn, this.cxt, this.gameInfo);
                break;
        }
        return block;
    }
}