let Utils = require('../utils');
let GameData = require('../gameData');


cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Node,
        success: cc.Node,
        fail: cc.Node,
        targetNode: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.targetScript = this.targetNode.getComponent('target');
        // this.videoCount=2;
    },

    successView() {
        // cc.systemEvent.emit('GAMEMASK_CONTROL',{order:1});
        cc.director.SoundManager.playSound('tips_success');
        this.success.active = true;
        this.light.active = true;
        this.fail.active = false;
        this.success.scale = this.light.scale = 0.2;
        this.success.runAction(
            cc.scaleTo(1, 1).easing(cc.easeBackOut())
        );
        this.light.runAction(
            cc.spawn(
                cc.scaleTo(1, 1),
                cc.rotateBy(5, 360),
            )
        );

    },

    failView() {
        cc.director.SoundManager.playSound('tips_fail');
        this.fail.scale = this.light.scale = 0.2;
        this.success.active = false;
        this.fail.active = true;
        this.light.active = false;
        this.fail.runAction(
            cc.scaleTo(1, 1).easing(cc.easeBackOut())
        );
    },

    // 显示结果
    showView(type) {
        this.node.active = true;
       
        if (type == 1) {
            this.successView();
        } else {
            this.failView();
        }

        this.scheduleOnce(function () {
            cc.director.dialogScript.hideResultTipsView(type);
        }, 3)

    },

    // 隐藏结果
    hideView(type) {
        this.node.active = false;
        this.light.stopAllActions();
        this.light.active = false;
        this.success.active = false;
        this.fail.active = false;
        if (type == 1) {
            //  执行奖励计算
            let stepReward = Utils.randomGetGrid(this.targetScript.stepCount, GameData.starMatrix);
            let startPosition = this.targetScript.step.node.parent.convertToWorldSpaceAR(this.targetScript.step.node);
            this.targetScript.changeStepToRocket(stepReward, startPosition);
            this.targetScript.submitPlayerUsedStep();

        } else {
            // 弹出是否看视频增加步数框
            // if (cc.director.videoCount > 0) {
            //     cc.director.videoCount--;
                cc.director.dialogScript.showVideoRewardView();
            // } else {
                // if(GameData.lifeNumber>1){
                //     cc.director.dialogScript.showRetryPrompt();
                // }else{
                //     GameData.lifeNumber-=1;
                //     //生命值改变，提交更新后的数据
                //     window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                //     GameData.storeGameData();
                //     cc.director.loadScene('interface');
                //     cc.director.jumpCode = 2;
                // }
                
            // }

        }
        // if(!this.targetScript.isPass){
        //     cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });

        // }

    },


    start() {

    },

    // update (dt) {},
});
