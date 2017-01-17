var Tool = function() {
    function getId(id) {
        return typeof id == "string" ? document.getElementById(id) : id;
    }

    function reg(space, obj) { //命名空间
        var namespace = exports[space] || {};
        for (var key in obj) {
            namespace[key] = obj[key];
        }
        exports[space] = namespace;
    }
    var exports = {
        getId: getId,
        reg: reg
    };
    return exports;
}();
Tool.reg('file', function() {
    function imgs(arrUrl, cb) {
        var count = 0;
        var imgs = []; //返回图片集合
        for (var i = 0; i < arrUrl.length; i++) {
            var img = new Image();
            img.onload = function() {
                this.onload = null;
                imgs.push(this);
                count += 1;
                img = null;
                if (count >= arrUrl.length) {
                    imgs.sort(function(a, b) {
                        return a.index - b.index;
                    });; //自定义函数
                    cb && cb(imgs);
                }
            }
            img.index = i;
            img.src = arrUrl[i];
        }
    }
    var exports = {
        imgs: imgs,
    }
    return exports;
}());
Tool.reg('sprite', function() {
    var Sprite = function(img, cxt, fps, param) {
        this.animations = {};
        this.img = img;
        this.cxt = cxt;
        this.x = param.x || 0;
        this.y = param.y || 0;
        this.fps = fps; //每秒帧数
        this.xspeed = param.xspeed || 0; //x轴加速度
        this.yspeed = param.yspeed || 0; //y轴加速度
        this.yaspeed = param.yaspeed || 0; //y轴 加速度 增量
        this.lazy = 1000 / this.fps; //延迟
        this.last = 0; //持续
        this.moveLazy = 33; //延迟移动
        this.moveLast = 0; //持续移动
        //当前动画
        this.index = null;
        this.key = ""; //当前按键
    }
    Sprite.prototype = { //添加按键动画
        add: function(key, animation) {
            this.animations[key] = animation;
            if (!this.index) {
                this.index = animation;
                this.key = key;
            }
        },
        //绘画出当前帧
        draw: function() {
            if (!this.index || !this.img) return false;
            var frame = this.index.current;
            this.cxt.drawImage(this.img, frame.x, frame.y, frame.w, frame.h, this.x, this.y, frame.dw, frame.dh);
        },
        update: function() {
            //当前时间
            //返回指定的 Date 对象自 1970 年 1 月 1 日午夜（通用时间）以来的毫秒数
            var t = new Date().getTime();
            //时间差值 = 当前时间 - 持续时间(启动时间)
            var diff = t - this.last;
            //移动时间差值  = 当前时间 - 移动时间差值
            var moveDiff = t - this.moveLast;
            if (this.last == 0) { //持续时间(启动时间)
                diff = this.lazy; //延迟时间
                moveDiff = this.moveLazy; //移动延迟时间
            }
            if (diff >= this.lazy) { // 时间差值 >= 延迟时间
                this.index.next(); //当前动画 下一帧
                this.last = t; //持续时间(启动时间)
            }
            if (moveDiff >= this.moveLazy) { //移动时间差值 >= 移动延迟时间
                //y轴 增量 非空	
                if (this.yaspeed) this.yspeed += this.yaspeed; //y轴加速度 + y轴 增量
                //x轴加速度 非空
                if (this.xspeed) this.x += this.xspeed; //增加  x轴加速度 
                //y轴加速度 非空
                if (this.yspeed) this.y += this.yspeed; //增加 y轴加速度
                this.moveLast = t; //移动延迟时间(启动时间)
            }
        },
        change: function(dir) {
            this.index = this.animations[dir];
        },
        move: function(x, y) {
            this.x = x;
            this.y = y;
        },
        size: function() {
            var frame = this.index.current;
            return {
                w: frame.dw,
                h: frame.dh,
                x: this.x,
                y: this.y,
                r: this.x + frame.dw,
                b: this.y + frame.dh
            };
        },
        setYSpeed: function(yspeed, yaspeed) {
            this.yspeed = yspeed;
            this.yaspeed = yaspeed;
        },
        setXSpeed: function(xspeed) {
            this.xspeed = xspeed;
        }
    }
    var Frame = function(x, y, w, h, dw, dh) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dw = dw;
        this.dh = dh;
    }
    var Animation = function(param) {
        this.startX = param.startX || 0;
        this.startY = param.startY || 0;
        this.fs = param.fs || 1;
        this.sw = param.sw || 0;
        this.sh = param.sh || 0;
        this.width = param.width || param.sw;
        this.height = param.height || param.sh;
        this.dir = param.dir || "right";
        this.loop = !!param.loop;
        //this.fps = param.fps || 30;
        //this.lazy = 1000 / this.fps;
        //this.last = 0;
        //存放帧图像的集合
        this.ls = [];
        //当前帧
        this.current = null;
        //当前帧得索引
        this.index = -1;
        this.init();
    }
    Animation.prototype = {
        init: function() { //初始化帧动画(人物)
            for (var i = 0; i < this.fs; i++) {
                var x = this.startX + (this.dir == "right" ? i * this.sw : 0);
                var y = this.startY + (this.dir == "down" ? i * this.sh : 0);
                var frame = new Frame(x, y, this.sw, this.sh, this.width, this.height);
                //将帧动画(人物)存入数组
                this.ls.push(frame);
            }
            this.index = 0;
            this.current = this.ls[0];
        },
        //下一帧
        next: function() {
            if (this.index + 1 >= this.ls.length) { //当前帧得索引+1 >= 存放的帧数
                if (this.loop) { //是否循环
                    //
                    this.current = this.ls[0]; //当前帧
                    this.index = 0; //当前帧得索引
                }
            } else { //当前帧得索引+1 < 存放的帧数
                this.index += 1; //当前帧得索引++
                this.current = this.ls[this.index]; //在存放的帧的集合【ls】中  获取  当前帧
            }
        },
        //重置为第一帧
        reset: function() {
            this.current = this.ls[0]; //当前帧
            this.index = 0; //当前帧得索引
        },
        size: function() { //人物大小
            return {
                w: this.width,
                h: this.height
            };
        }
    }
    var exports = {
        Sprite: Sprite,
        Animation: Animation,
        Frame: Frame,
    }
    return exports;
}());
Tool.reg("time", function() {
    //定义贞管理类，兼容
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
        setTimeout(cb, 1000 / 60)
    };
    var TimeProcess = function() {
        this.list = [];
        this.isStart = false;
    }
    TimeProcess.prototype = {
        add: function(cb, param, context) {
            this.list.push({
                cb: cb,
                param: param,
                context: context
            });
        },
        start: function() {
            this.isStart = true;
            var self = this; //TimeProcess
            requestAnimationFrame(function() {
                var item = null,
                    p = [];
                for (var i = 0; i < self.list.length; i++) {
                    item = self.list[i]; //timeQuene 游戏时间进程中需要做的项目   
                    item.cb.apply(item.context, item.param); //1、Main.draw  2、Main.update
                }
                if (self.isStart) requestAnimationFrame(arguments.callee);
            });
        },
        stop: function() {
            this.isStart = false;
        }
    }
    var exports = {
        TimeProcess: TimeProcess
    };
    return exports;
}());
