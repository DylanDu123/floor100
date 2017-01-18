/*
img	规定要使用的图像、画布或视频。
sx	可选。开始剪切的 x 坐标位置。
sy	可选。开始剪切的 y 坐标位置。
swidth	可选。被剪切图像的宽度。
sheight	可选。被剪切图像的高度。
x	在画布上放置图像的 x 坐标位置。
y	在画布上放置图像的 y 坐标位置。
width	可选。要使用的图像的宽度。（伸展或缩小图像）
height	可选。要使用的图像的高度。（伸展或缩小图像）
*/
/**
 * 各种障碍物块的定义
 */
var BlockBase = function(x,y,img,cxt,panelInfo){//基础障碍物
	
	this.x = x;
	this.y = y;
	this.img = img;
	this.cxt = cxt;
	this.pinfo = panelInfo;
	
	this.yspeed = -4;
	
	this.sprite = null;

	this.dismiss = false;//障碍物消失
}
BlockBase.prototype = {
		
		init : function(){//初始化
			
			this.initSprite();
		},
		initSprite : function(){},//初始化精灵
		draw : function() {//绘制障碍物
			
			this.sprite.draw();
		},
		update : function(){//更新
			
			this.sprite.update();

			this.childUpdate();
		},
		childUpdate : function(){},//子更新
		checkMap : function(){//检查障碍物是否超出地图
			
			var size = this.sprite.size();
			
			if(size.y <= 0)return true;
			
			return false;
		},
		ManOn : function(man){},//人物在障碍物上
		size : function(){//障碍物大小

			return this.sprite.size();
		}
	}

var NormalBlock = function(x,y,img,cxt,panelInfo){
	BlockBase.apply(this,arguments);
}
NormalBlock.prototype = new BlockBase();

NormalBlock.prototype.initSprite = function(){//初始化普通障碍物

	var sprite = new Tool.sprite.Sprite(this.img,this.cxt,1,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new Tool.sprite.Animation({sw:200,sh:32,width:100,height:16,dir:"down"}));
	
	this.sprite = sprite;
};
NormalBlock.prototype.ManOn = function(man){//人物在普通障碍物上

	man.changeSpeed(0,this.yspeed);
}

var BlockFactory =  function(img,cxt,panelInfo) {
	this.img = img;
	this.cxt = cxt;
	this.pinfo = panelInfo;

}
BlockFactory.prototype = {
	creater:function(sx) {
		var rnd = Math.floor(Math.random()*14);

		var rnd_x = Math.floor(Math.random()*224);

		var x = sx?sx:rnd_x;
		var y = 460;
		var block = new NormalBlock(x, y, this.img, this.cxt, this.pinfo);
		block.init();
		return block;
	}
}