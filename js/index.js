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
    init: function() { //初始化
        Tool.file.imgs(["img/man.png", "img/block.png", "img/move.png", "img/thorn.png", "img/flip.png", "img/thorn_bg.png"], function(imgs) {
            Tool.getId("js_start_loading").style.display = "none";
            Tool.getId("js_start_btn").style.display = "block";
            Main.imgs = imgs;
            var canvas = Tool.getId("canvas");
            Main.gameInfo.w = canvas.offsetWidth; // 偏移宽度
            Main.gameInfo.h = canvas.offsetHeight; // 偏移高度
            Main.cxt = canvas.getContext("2d"); //可以在页面绘制图形的对象
        });
    },
    start: function() {
        Tool.getId('js_end_flush').style.display = "none";
        Tool.getId("js_start_flush").style.display = "none";
        Main.initPerson();
        Main.initBlock();
        Main.initEvent();
        Main.process();
    },
    initEvent: function() { //初始化事件
        Tool.getId("js_main").onkeydown = function(e) {
            Main.keyDown(e);
        };
        Tool.getId("js_main").onkeyup = function(e) {
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
    replay: function() {
        Main.cxt.clearRect(0, 0, Main.gameInfo.w, Main.gameInfo.h);
        Main.start();
    },
    initPerson: function() {
        Main.person = new Person(150, 0, Main.imgs[0], Main.cxt, Main.gameInfo);
    },
    initBlock: function() {
        Main.blockFactory = new BlockFactory({
        	block:Main.imgs[1],
        	thorn:Main.imgs[3]
        }
        , Main.cxt
        , Main.gameInfo);
        var block = Main.blockFactory.creater(120);
        Main.blocks.push(block);
    },
    process: function() { //游戏运行
        var tq = new Tool.time.TimeProcess();
        tq.add(Main.draw, null, Main);
        tq.add(Main.update, null, Main);
        this.timeQuene = tq; //游戏时间进程
        this.timeQuene.start();
    },
    draw: function() {
        Main.cxt.clearRect(0, 0, Main.gameInfo.w, Main.gameInfo.h); //清除图像
        Main.person.draw();
        Main.drawThornBg();
        for (var i = 0; i < Main.blocks.length; i++) {
            block = Main.blocks[i];
            block.draw();
        }
    },
    update: function() {
        Main.time++;
        if (Main.time >= 50) {
            Main.time = 0;
            var block = Main.blockFactory.creater();
            Main.blocks.push(block);
        }
        for (var i = 0; i < Main.blocks.length; i++) {
            block = Main.blocks[i];
            block.update();
            if (block.checkMap()) {
            	Main.blocks.splice(Main.blocks.indexOf(block),1);
            	i--;
            	continue;
            }
            Main.person.checkBlockOn(block);
        }
        Tool.getId("js_life").style.width = Main.person.life + "px";
        Tool.getId("js_level").innerHTML = Main.person.level;
        Main.person.update();
        if (Main.person.isDead) {
            Main.over();
        }
    },
    drawThornBg: function() {
        for (var i = 0; i <= 35; i++) {
            Main.cxt.drawImage(Main.imgs[5], 0, 0, 18, 21, i * 9, 0, 9, 11);
        }
    },
    over: function() {
        Tool.getId('js_end_flush').style.display = "block";
        Tool.getId("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你牛B呀,下了<label>" + Main.person.level + "</label>层,男人中的男人呀！";
        Tool.getId("js_end_flush").getElementsByTagName("a")[0].innerHTML = "想更男人一点";
        Tool.getId("js_end_flush").getElementsByTagName("span")[0].className = "icon happy";
        Tool.getId("js_life").style.width = "0px";
        Main.blocks = [];
        this.timeQuene.stop();
    }
};
Main.init();