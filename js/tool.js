var Tool = function() {
    function reg(name_space, obj) {
        var namespace = exports[name_space] || {};
        for (var key in obj) {
            namespace[key] = obj[key];
        }
        exports[name_space] = namespace;
    }

    function getID(id) {
        return typeof id == "string" ? document.getElementById(id) : id;
    }
    var exports = {
        getID: getID,
        reg: reg,
    }
    return exports;
}();
Tool.reg("file", function() {
    function img(imgs, cb) {
        var count = 0;
        imgAry = [];
        for (var i = 0; i < imgs.length; i++) {
            var Img = new Image();
            Img.src = imgs[i];
            Img.index = i;
            Img.onload = function() {
                this.onload = null;
                imgAry.push(this);
                count++;
                if (count >= imgs.length) {
                    imgAry.sort(function(a, b) {
                        return a.index - b.index;
                    })
                    cb && cb(imgAry);
                }
            }
        }
    }
    var exports = {
        imgs: img,
    }
    return exports;
}());
Tool.reg("time", function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
        setTimeout(cb, 1000 / 60)
    };
    var TimeProcess = function() {
        this.list = [];
        this.start = false;
    }
    TimeProcess.prototype = {
        add: function(param, context, cb) {
            this.list.push({
                cb: cb,
                param: param,
                context: context
            });
        },
        st: function() {
            this.start = true;
            var self = this;
            requestAnimationFrame(function() {
                for (var i = 0; i < self.list.length; i++) {
                    var item = self.list[i]; //timeQuene 游戏时间进程中需要做的项目   
                    item.cb(item.context, item.param); //1、Main.draw  2、Main.update
                }
                if (self.start) requestAnimationFrame(arguments.callee);
            })
        },
        stop: function() {
            this.start = false;
        }
    };
    var exports = {
        TimeProcess: TimeProcess
    };
    return exports;
}());
Tool.reg("spirit", function() {
    var Frame = function(argument) {
        this.sx = argument.sx || 0;
        this.sy = argument.sy || 0;
        this.sw = argument.sw || 0;
        this.sh = argument.sh || 0;
    }
    var Animation = function(argument) {
        this.fs = argument.fs || 1;
        this.dir = argument.dir || "right";
        this.frames = [];
        this.currentframe = null;
        this.index = 0;
        this.init(argument);
    }
    Animation.prototype = {
        init: function(argument) {
            var startx = argument.startx || 0;
            var starty = argument.starty || 0;
            for (var i = 0; i < this.fs; i++) {
                if (this.dir == "left") startx += argument.sw * -1 * i;
                if (this.dir == "right") startx += argument.sw * i;
                if (this.dir == "down") starty += argument.sh * i;
                if (this.dir == "up") starty += argument.sh * -1 * i;
                var frame = new Frame({
                    sx: startx,
                    sy: starty,
                    sw: argument.sw,
                    sh: argument.sh,
                });
                if (!this.currentframe) {
                    this.currentframe = frame
                    this.index = i;
                };
                this.frames.push(frame);
            }
        },
        next: function() {
            this.index++;
            if (this.index >= this.frames.length) {
                this.index = 0;
            }
            this.currentframe = this.frames[this.index];
        }
    };
    var Spirit = function(argument) {
        this.x = argument.x || 0;
        this.y = argument.y || 0;
        this.cxt = argument.cxt;
        this.img = argument.img;
        this.width = argument.w;
        this.height = argument.h;
        this.yspeed = argument.yspeed || 0;
        this.yspeedup = argument.yspeedup || 0;
        this.fps = argument.fps || 10;
        this.xspeed = argument.xspeed || 0;
        this.animations = {};
        this.currentanimation = null;
        this.laze = 1000.0 / this.fps;
        this.last = 0;
        this.init();
    }
    Spirit.prototype = {
        init: function() {
            this.last = new Date().getTime();
        },
        updata: function() {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.yspeed += this.yspeedup;
            var t = new Date().getTime();
            var diff = t - this.last;
            if (diff > this.laze) {
                this.last = t;
                this.currentanimation.next();
            }
        },
        draw: function() {
            var frame = this.currentanimation.currentframe;
            this.cxt.drawImage(this.img, frame.sx, frame.sy, frame.sw, frame.sh, this.x, this.y, this.width, this.height);
        },
        add: function(dir, animation) {
            this.animations[dir] = animation;
            if (!this.currentanimation) this.currentanimation = animation;
        },
        change: function(key) {
            this.currentanimation = this.animations[key];
        },
        size: function() {
            return {
                x: this.x,
                y: this.y,
                w: this.width,
                h: this.height,
                r: this.x + this.width,
                b: this.y + this.height,
            };
        },
        setYspeed: function(yspeed, yspeedup) {
            this.yspeed = yspeed;
            this.yspeedup = yspeedup;
        },
        setXspeed: function(xspeed) {
            this.xspeed = xspeed;
        },
        move: function(x, y) {
            this.x = x;
            this.y = y;
        }
    };
    var exports = {
        Spirit: Spirit,
        Animation: Animation,
    };
    return exports;
}());