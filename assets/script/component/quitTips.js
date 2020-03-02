// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let Utils = require('../utils');
let GameData =require('../gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showView(){
        this.node.active=true;
        Utils.showPromptWithScale(this.node);
        cc.director.SoundManager.playSound('btnEffect');
    },

    hideView(){
        this.node.active=false;
        cc.director.SoundManager.playSound('btnEffect');
    },


    jumpToInterface(){
        cc.director.SoundManager.playSound('btnEffect');
        GameData.passRate=-1;
        GameData.lifeNumber-=1;
        //生命值改变，提交更新后的数据
        // console.log(GameData.lifeNumber);
        window.NativeManager.reportLifeChanged(GameData.lifeNumber);
        let costTime = cc.sys.localStorage.getItem('costTime');
        if(!costTime){
            let current = Math.floor(new Date().getTime() / 1000);//todo 
            cc.sys.localStorage.setItem('costTime',JSON.stringify(current));               
        }
        GameData.storeGameData();
        // let data = GameData.getGameData();
        // Utils.updateGameInfo(data);
        cc.systemEvent.emit('UPDATE_DATA_GAME');
        cc.director.loadScene('interface');
        cc.director.jumpCode=2;
    },


    start () {

    },

    // update (dt) {},
});
