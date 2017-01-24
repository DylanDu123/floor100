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
    this.yspeedup = 0;
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
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        w: this.width,
        h: this.height,
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
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        w: this.width,
        h: this.height,
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
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        starty: 32,
        w: this.width,
        h: this.height,
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
var LeftBlock = function(x, y, img, cxt, gameInfo) {
    this.xforce = -2;
    BaseBlock.apply(this, arguments);
}
LeftBlock.prototype = new BaseBlock();
LeftBlock.prototype.initSpirit = function() {
    var spirit = new Tool.spirit.Spirit({
        x: this.x,
        y: this.y,
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        w: this.width,
        h: this.height,
        fs: 2,
        sw: 200,
        sh: 32,
        dir: "down",
    }));
    this.spirit = spirit;
}
LeftBlock.prototype.subbelowMan = function() {
    this.man.setXforce(this.xforce);
}
var RightBlock = function(x, y, img, cxt, gameInfo) {
    this.xforce = 2;
    BaseBlock.apply(this, arguments);
}
RightBlock.prototype = new BaseBlock();
RightBlock.prototype.initSpirit = function() {
    var spirit = new Tool.spirit.Spirit({
        x: this.x,
        y: this.y,
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        w: this.width,
        h: this.height,
        starty: 64,
        fs: 2,
        sw: 200,
        sh: 32,
        dir: "down",
    }));
    this.spirit = spirit;
}
RightBlock.prototype.subbelowMan = function() {
    this.man.setXforce(this.xforce);
}
var FlipBlock = function(x, y, img, cxt, gameInfo) {
    this.standCount = 4;
    this.dir = "normal";
    BaseBlock.apply(this, arguments);
}
FlipBlock.prototype = new BaseBlock();
FlipBlock.prototype.initSpirit = function() {
    var spirit = new Tool.spirit.Spirit({
        x: this.x,
        y: this.y,
        img: this.img,
        cxt: this.cxt,
        yspeed: this.yspeed,
        gameInfo: this.gameInfo,
        fps: 10,
    });
    spirit.add("normal", new Tool.spirit.Animation({
        w: this.width,
        h: 16,
        sw: 200,
        sh: 32,
    }));
    spirit.add("down", new Tool.spirit.Animation({
        w: this.width,
        h: 11,
        starty: 32,
        sw: 200,
        sh: 22,
    }));
    spirit.add("up", new Tool.spirit.Animation({
        w: this.width,
        h: 21,
        starty: 54,
        sw: 200,
        sh: 42,
    }));
    this.spirit = spirit;
}
FlipBlock.prototype.subbelowMan = function() {
    this.man.up();
    this.changeDir("down");
    this.standCount--;
    this.stand = (this.standCount <= 0);
    if (this.standCount <= 0) this.changeDir("normal");
}
FlipBlock.prototype.changeDir = function(dir) {
    this.dir = dir;
    var frame = this.spirit.size();
    this.spirit.change(dir);
    var n_frame = this.spirit.size();
    var y = frame.b - n_frame.h;
    this.spirit.move(frame.x, y);
}
FlipBlock.prototype.subupdata = function() {
    if (this.dir == "down") {
        this.standTime = 20;
        this.changeDir("up");
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
    creat: function(x) {
        var rand = x ? 4 : Math.floor(Math.random() * 16);
        var rnd_x = x ? x : Math.floor(Math.random() * 224);
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
                block = new FlipBlock(rnd_x, 480, this.imgs.flip, this.cxt, this.gameInfo);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                block = new NormalBlock(rnd_x, 480, this.imgs.block, this.cxt, this.gameInfo);
                break;
            case 10:
            case 11:
                block = new RightBlock(rnd_x, 480, this.imgs.move, this.cxt, this.gameInfo);
                break;
            case 12:
            case 13:
                block = new LeftBlock(rnd_x, 480, this.imgs.move, this.cxt, this.gameInfo);
                break;
            case 14:
            case 15:
            case 16:
                block = new ThornBlock(rnd_x, 480, this.imgs.thorn, this.cxt, this.gameInfo);
                break;
        }
        return block;
    }
}