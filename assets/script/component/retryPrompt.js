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
        level:cc.Label,
        toolList:require('../mainScreen/toolChoose'),
        viewReward:require('./viewReward'),
        selectArea:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showView(){ 
       
        this.node.active=true;
        Utils.showPromptWithScale(this.node);
        this.toolList.updateGameToolNumber(GameData.gameToolList);
        this.updateLevelString();
    },

    hideView(){

        this.toolList.resumeData();
        this.node.active=false;

    },

    jumpToMainScreen(){

        GameData.passRate=-1;
        // GameData.lifeNumber-=1;
        GameData.storeGameData();
        let data = GameData.getGameData();
        Utils.updateGameInfo(data);
        cc.director.loadScene('interface');
        cc.director.jumpCode=2;
        
    },

    tryAgain(){
        if(GameData.lifeNumber>1){  
            GameData.lifeNumber-=1;
            //生命值改变，提交更新后的数据
            window.NativeManager.reportLifeChanged(GameData.lifeNumber);
            GameData.storeGameData();
            this.viewReward.continueTimes=0;
            let costTime = cc.sys.localStorage.getItem('costTime');
            if(!costTime){
               let current = Math.floor(new Date().getTime() / 1000);//todo 
               cc.sys.localStorage.setItem('costTime',JSON.stringify(current));               
            }
            cc.director.dialogScript.hideRetryPrompt();
            cc.director.container.startNewGame();
        }else{
            // console.log('兄弟，该看广告了！！！');
            GameData.lifeNumber-=1;
            window.NativeManager.reportLifeChanged(GameData.lifeNumber);
            this.jumpToMainScreen();
        }
       
    },

    updateLevelString(){
        this.level.string = (GameData.bestLevel+1)+'';
    },

    start () {
        
    },

    // update (dt) {},
});
