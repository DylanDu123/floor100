var Main = {
    imgs: [],
    gameInfo: {
        w: 0,
        h: 0
    },
    cxt: null,
    person: null,
    blockFactory: null,
    blocks: [],
    time: 0,
    timeQueue: null,
    init: function() { //初始化
        Tool.file.imgs(["img/man.png", "img/block.png", "img/move.png", "img/thorn.png", "img/flip.png", "img/thorn_bg.png"], function(imgs) {
            Tool.getID("js_start_loading").style.display = "none";
            Tool.getID("js_start_btn").style.display = "block";
            Main.imgs = imgs;
            var canvas = Tool.getID("canvas");
            Main.gameInfo.w = canvas.offsetWidth;
            Main.gameInfo.h = canvas.offsetHeight;
            Main.cxt = canvas.getContext("2d");
            Main.person = new Person(150, 0, Main.imgs[0], Main.cxt, Main.gameInfo);
            Main.blockFactory = new BlockFactory({
                block: Main.imgs[1],
                move: Main.imgs[2],
                flip: Main.imgs[4],
                thorn: Main.imgs[5],
                cxt: Main.cxt,
                gameInfo: Main.gameInfo,
            });
            Main.initEvent();
        });
    },
    start: function() {
        Tool.getID("js_start_flush").style.display = "none";
        var timeQueue = new Tool.time.TimeProcess();
        timeQueue.add(null, null, Main.updata);
        timeQueue.add(null, null, Main.draw);
        timeQueue.st();
        this.timeQueue = timeQueue;
    },
    initEvent: function() { //初始化事件
        Tool.getID("js_main").onkeydown = function(e) {
            Main.keyDown(e);
        };
        Tool.getID("js_main").onkeyup = function(e) {
            Main.keyUp(e);
        };
    },
    keyDown: function(e) { //按键按下
        if (e.keyCode == 37) {
            this.person.changeDir("left");
        }
        if (e.keyCode == 39) {
            this.person.changeDir("right");
        }
        e.preventDefault(); //阻止按键
    },
    keyUp: function(e) { //按键松开
        if (e.keyCode == 37 || e.keyCode == 39) {
            this.person.changeDir("normal");
        }
        e.preventDefault();
    },
    updata: function() {
        Main.person.updata();
        Main.time++;
        if (Main.time > 40) {
            Main.time = 0;
            Main.blocks.push(Main.blockFactory.creat());
        }
        for (var i = 0; i < Main.blocks.length; i++) {
            var block = Main.blocks[i];
            if (!block) continue;
            if (!block.checkLimit()) {
                Main.blocks.splice(Main.blocks.indexOf(block), 1);
                block = null;
                i--;
                continue;
            }
            block.updata();
        }
    },
    draw: function() {
        Main.cxt.clearRect(0, 0, Main.gameInfo.w, Main.gameInfo.h);
        Main.drawThron();
        Main.person.draw();
        for (var i = 0; i < Main.blocks.length; i++) {
            var block = Main.blocks[i];
            if (!block) continue;
            block.draw();
        }
    },
    drawThron: function() {
        for (var i = 0; i <= 35; i++) {
            Main.cxt.drawImage(Main.imgs[5], 0, 0, 18, 21, i * 9, 0, 9, 11);
        }
    }
};
Main.init();