// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils');
let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        // toolArea:require('./toolChoose'),
       
        funcView:require('./funcView'),
        // screenDialog:require('../mainScreen/screenDialog')
        currentLevel:cc.Label,
        toolArea:cc.Node,
        selectArea:cc.Node,
        bigStar:cc.Prefab,
        guideView:require('./guideScreenNode'),

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.toolAreaScript = this.toolArea.getComponent('toolChoose');
    },

    showView() {
        if(GameData.bestLevel==8){
            let localRecord = cc.sys.localStorage.getItem('gameToolGuide');
            if(!localRecord){
                GameData.gameToolList=[1,1,1];
                GameData.storeGameData();
            }
            cc.systemEvent.emit('STOP_TOUCH',{number:1});
            this.scheduleOnce(
                function(){
                    this.guideView.showGameToolGuide();
                    cc.systemEvent.emit('STOP_TOUCH',{number:2});
                },0.6
            )
        }
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        this.toolAreaScript.updateGameToolNumber(GameData.gameToolList);
        this.currentLevel.string = (GameData.bestLevel+1) +'';
      
    },


    hideView() {
        this.node.active = false;
        this.toolAreaScript.resumeData();
    },

    jumpToGameView(){

        if(GameData.lifeNumber>0){
            // console.log(GameData.lifeNumber,'67');
            cc.director.SoundManager.playSound('btnEffect');
            GameData.storeGameData();
            this.markTime();
            cc.director.loadScene('interface');
            cc.director.jumpCode=1;
            // 
        }else{
            // console.log('不好意思，你可以通过看视频获得更多的游戏次数哦！！');
            this.funcView.showPowerPool();
            this.node.parent.getComponent('screenDialog').hideStartPrompt();
        }   
    },

    markTime(){
        let time = cc.sys.localStorage.getItem('restTime');
        if(!!time){
            return;
        }else{
            let current = Math.floor(new Date().getTime()/1000);
            cc.sys.localStorage.setItem('restTime',JSON.stringify(current));
        }
    },



    start() {

    },

    // update (dt) {},
});
