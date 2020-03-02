// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const lifeInterval = 3600;
let Utils = require('./utils');
let GameData = require('./gameData');

let MaxLife = 8 ;

cc.Class({
    extends: cc.Component,

    properties: {
        timeDisplay:cc.Node,
        lifeNumber :cc.Label,
        animaTips:require('./mainScreen/animaTips'),
        changeName:require('./mainScreen/changeName'),
        tipsPrompt:require('./mainScreen/tipsPrompt'),
    },

    // LIFE-CYCLE CALLBACKS:


    
    /**
     * costTime 第一次消耗生命的时间
     */

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        cc.systemEvent.on('TIME_COUNT_FUNC',this.checkTimeCount,this);
        // 游戏进入后台时 保存当前数据
        cc.systemEvent.on('UPDATE_DATA_GAME',this.updateData,this);
        cc.game.on(cc.game.EVENT_HIDE,this.updateData,this);
        cc.systemEvent.on('LOAD_TIPS_SHOW',this.showLoadingAnimation,this);
        cc.systemEvent.on('LOAD_TIPS_HIDE',this.hideLoadingAnimation,this);
        cc.systemEvent.on('CHANGE_NAME_SHOW',this.showChangeNamePrompt,this);
        cc.systemEvent.on('CHANGE_NAME_HIDE',this.hideChangeNamePrompt,this);
        cc.systemEvent.on('TIPS_PROMPT_SHOW',this.showTipsPromptView,this);
        cc.systemEvent.on('TIPS_PROMPT_HIDE',this.hideTipsPromptView,this);
    },

     updateData(){
        let data = GameData.getGameData();
        Utils.updateGameInfo(data);
        console.log('update game data!');
    },

      // 显示loading动画
      showLoadingAnimation(){
        // this.hideAllChild();
        // console.log('111111111');
        this.animaTips.showView();
    },

    // 关闭loading动画
    hideLoadingAnimation(){
        // this.hideAllChild();
        // console.log('22222');
        this.animaTips.hideView();
    },

    // 显示改名框
    showChangeNamePrompt(){
        this.changeName.showView();
    },


    // 隐藏改名框
    hideChangeNamePrompt(){
        this.changeName.hideView();
    },

    // 显示提示框
    showTipsPromptView(event){
        this.tipsPrompt.showView(event.type);
    },

    // 隐藏提示框
    hideTipsPromptView(){
        this.tipsPrompt.hideView();
    },


    checkTimeCount(event){
        
        let isScheduled = cc.director.getScheduler().isScheduled(this.timeDowmCount,this);
        if(!isScheduled){
            this.timeCount();
        }
    },

     // 倒计时
     timeCount() {
        if (GameData.lifeNumber < MaxLife) {
            let endTime = cc.sys.localStorage.getItem('costTime');
            if (!!endTime) {
                endTime = JSON.parse(endTime) + lifeInterval;
            } else {
                endTime = Math.floor(new Date().getTime() / 1000) + lifeInterval;//todo
                cc.sys.localStorage.setItem('restTime', endTime);
            }

            this.time = endTime;
            this.schedule(this.timeDowmCount, 1);
        }

    },

    timeDowmCount() {
        let label = Utils.countDonwTime(this.time);
        if (!label) {
            this.unschedule(this.timeDowmCount);
            if (GameData.lifeNumber < MaxLife) {
                GameData.lifeNumber++;
                let cur = Math.floor(new Date().getTime() / 1000);
                cc.sys.localStorage.setItem('costTime',cur);
                //生命值改变，提交更新后的数据
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                GameData.storeGameData();
                cc.systemEvent.emit('UPDATE_LIFE');
                if (GameData.lifeNumber >= MaxLife) {
                    cc.sys.localStorage.removeItem('restTime');
                } else {
                    let restTime = Math.floor(new Date().getTime() / 1000) + lifeInterval;//todo
                    cc.sys.localStorage.setItem('restTime', restTime);
                }
                
            }
            // this.timeCount();
            return;
        }

        // console.log(this.timeDisplay.active);
        // cc.systemEvent.emit('UPDATE_TIME_LABEL',{
        //     str:label
        // })
       
    },


  


    start () {
        
    },

    // update (dt) {},
});
