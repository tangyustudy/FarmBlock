// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require('./utils');

cc.Class({
    extends: cc.Component,

    properties: {
        wordList:[cc.SpriteFrame],
        toolViewList:[cc.SpriteFrame],
        toolView:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    },

    // 跳转到游戏界面
    jumpToGameView(){
        cc.director.preloadScene('gameView');
        this.scheduleOnce(function(){
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.5),
                    cc.callFunc(function(){
                        cc.director.NativeManager.showInterstitialAd(3);
                        cc.director.loadScene('gameView');
                    })
                )
            )
        },4);
    },

    // 跳转到起始页
    jumpToMainScreen(){
        cc.director.preloadScene('mainScreen');
        this.scheduleOnce(function(){
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.5),
                    cc.callFunc(function(){
                        cc.director.NativeManager.showInterstitialAd(3);
                        cc.director.loadScene('mainScreen');
                    })
                )
            )
           
        },3)
    },


    // 随机选取一张图片进行展示
    showRandomTipsPhoto(){
        let isFresh = cc.sys.localStorage.getItem('isFresh');
        let random;
        if(!isFresh){ 
            random=9;
            cc.sys.localStorage.setItem('isFresh','yes');  
        }else{
            random = Math.floor(Math.random()*this.toolViewList.length);
        }    
        
        this.toolView.getComponent(cc.Sprite).spriteFrame = this.toolViewList[random];

    },


    start () {
        this.showRandomTipsPhoto();
        Utils.resize();
        if(cc.director.jumpCode==1){
            this.jumpToGameView();
        }
            
        if(cc.director.jumpCode==2){
            this.jumpToMainScreen();
        }
    },

    onDestroy(){
        
    }




    // update (dt) {},
});
