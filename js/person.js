var Person = function(x, y, img, cxt, gameInfo) {
    this.spirit = null;
    this.life = 80;
    this.x = x || 0;
    this.y = y || 0;
    this.cxt = cxt;
    this.img = img;
    this.width = 32;
    this.height = 32;
    this.gameInfo = gameInfo;
    this.yspeed = 0.2;
    this.yspeedup = 0.02;
    this.isDead = false;
    this.init();
}
Person.prototype = {
    init: function() {
        var spirit = new Tool.spirit.Spirit({
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            img: this.img,
            cxt: this.cxt,
            gameInfo: this.gameInfo,
            fps: 10,
            yspeed: this.yspeed,
            yspeedup: this.yspeedup
        });
        spirit.add("down", new Tool.spirit.Animation({
            startx: 64,
            sw: 64,
            sh: 64,
        }));
        spirit.add("normal", new Tool.spirit.Animation({
            sw: 64,
            sh: 64,
        }));
        spirit.add("up", new Tool.spirit.Animation({
            startx: 128,
            sw: 64,
            sh: 64,
        }));
        spirit.add("right", new Tool.spirit.Animation({
            startx: 320,
            sw: 64,
            sh: 64,
            fs: 2,
        }));
        spirit.add("left", new Tool.spirit.Animation({
            startx: 192,
            sw: 64,
            sh: 64,
            fs: 2,
        }));
        this.spirit = spirit;
    },
    draw: function() {
        this.spirit.draw();
    },
    updata: function() {
    	var frame = this.spirit.size();
    	if (frame.y <= 0 || frame.y+ frame.h >= this.gameInfo.height) {
    		this.isDead = true;
    	}

        this.spirit.updata();
    },
    changeDir: function(dir) {
        this.spirit.change(dir);
    }
};