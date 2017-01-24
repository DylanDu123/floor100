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
                thorn: Main.imgs[3],
                cxt: Main.cxt,
                gameInfo: Main.gameInfo,
            });
            Main.initEvent();
        });
    },
    start: function() {
        Tool.getID("js_start_flush").style.display = "none";
        Main.blocks.push(Main.blockFactory.creat(130));
        var timeQueue = new Tool.time.TimeProcess();
        timeQueue.add(null, null, Main.updata);
        timeQueue.add(null, null, Main.draw);
        timeQueue.st();
        this.timeQueue = timeQueue;
    },
    replay: function() {
    	this.time = 0;
        Tool.getID("js_end_flush").style.display = "none";
        Main.person = new Person(150, 0, Main.imgs[0], Main.cxt, Main.gameInfo);
        Main.blocks = [];
        Main.start();
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
        Main.time++;
        if (Main.time > 40) {
            Main.time = 0;
            Main.blocks.push(Main.blockFactory.creat());
        }
        Main.person.updata();
        Tool.getID("js_life").style.width = Main.person.life + "px";
        if (Main.person.isDead) {
            Tool.getID("js_end_flush").style.display = "block";
            if (Main.person.level >= 100) {
                Tool.getID("js_end_flush").getElementsByTagName("p")[0].innerHTML = "厉害啊我的哥,突破100层了";
                Tool.getID("js_end_flush").getElementsByTagName("span")[0].className = "icon happy";
            } else {
                Tool.getID("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你是不是傻,100层都玩不过";
                Tool.getID("js_end_flush").getElementsByTagName("span")[0].className = "icon";
            }
            Main.timeQueue.stop();
            return;
        }
        for (var i = 0; i < Main.blocks.length; i++) {
            var block = Main.blocks[i];
            if (!block) continue;
            block.updata();
            if (!block.checkLimit() || block.broken) {
            	if (Main.person.block == block) Main.person.down();
                Main.blocks.splice(Main.blocks.indexOf(block), 1);
                block = null;
                i--;
                continue;
            }
            Main.person.checkBlock(block);
        }
        Tool.getID("js_level").innerHTML = Main.person.level;
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