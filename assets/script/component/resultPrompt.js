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
// let progress = require('./progressBar');
cc.Class({
    extends: cc.Component,

    properties: {
        level: cc.Label,
        score: cc.Label,
        nodeList: [cc.Node],
        targetContainer: cc.Node,
        twinkle: cc.Node,
        targetDisplayList: [cc.Node],
        blockView: [cc.SpriteFrame],
        toolView: [cc.SpriteFrame],
        shadowClip:cc.AnimationClip,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // 根据星级来执行星星动画

    excuteStarLevelAnimation(num) {
        for (let i = 0; i < num; i++) {

            this.scheduleOnce(
                function () {
                    let item = this.nodeList[i];
                    let inner = item.getChildByName('star_inner');
                    this.starAnimation(inner);
                    if(i==num-1){
                        cc.director.SoundManager.playSound('victory');
                    }
                }, 0.3 * i
            )

        }

        this.scheduleOnce(
            function(){
                
                for (let i = 0; i < num; i++) {

                    this.scheduleOnce(
                        function () {
                            let item = this.nodeList[i];
                            let inner = item.getChildByName('star_inner');
                            this.addStarShadowAnima(inner);
                        }, 0.3 * i
                    )
                }
            },1.2
        )

    },

    // 星星动画
    starAnimation(node) {
        let self=this;
        let action1 = node.getActionByTag(1);
        if(!!action1 && !action1.isDone()){
            return ;
        }
        node.active = true;
        node.position = cc.v2(0, 200);
        node.scale = 0.01;
        let action =
            // cc.sequence(
            cc.spawn(
                cc.scaleTo(0.3, 1),
                cc.moveTo(0.3, cc.v2(0, 0)),
                cc.callFunc(function () {
                    cc.director.SoundManager.playSound('starEffect');
                }),
            )

        // );
        action.tag = 1;
        node.runAction(action)

    },

    //  添加星星的光影动画
    addStarShadowAnima(node){
        node.addComponent(cc.Animation);
        let anima = node.getComponent(cc.Animation);
        anima.addClip(this.shadowClip);
        // let anima = new cc.Animation();
        // node.addComponent(anima);
        anima.play('starShadowAnima');
    },

    // 显示当前得分
    updateLevelScore() {
        this.score.string = GameData.currScore + '';
    },

    // 展示目标
    toolTargetDisPlay(list) {
        let gap = Utils.computedNodeGap(list.length, this.targetContainer, this.targetDisplayList[0]);

        for (let i = 0; i < list.length; i++) {
            let item = this.targetDisplayList[i];
            item.active = true;
            let icon = item.getChildByName('icon');
            item.position = cc.v2(gap * (i + 1) + item.width * i + (item.width / 2), 0);
            let index = list[i][0];
            if (index >= 20) {
                if(index==38){
                    icon.getComponent(cc.Sprite).spriteFrame = this.toolView[10];
                }else if(index==39){
                    icon.getComponent(cc.Sprite).spriteFrame = this.toolView[11];
                }else if(index==37){
                    icon.getComponent(cc.Sprite).spriteFrame = this.toolView[12];
                }else{
                    index -= 20;
                    icon.getComponent(cc.Sprite).spriteFrame = this.toolView[index];
                }  
            } else {
                icon.getComponent(cc.Sprite).spriteFrame = this.blockView[index];
            }

        }

    },

    // 隐藏所有的节点
    hideToolTargetList() {
        for (let i = 0; i < this.targetDisplayList.length; i++) {
            this.targetDisplayList[i].active = false;
        }
    },



    // 光影效果
    lightRotation(node) {
        let action = cc.rotateBy(2, 180).repeatForever();
        action.tag = 1;
        node.runAction(action);
    },

    showView(list) {

        this.node.active = true;
        GameData.passRate = cc.director.dialogScript.progressBar.passRate;
        this.hideToolTargetList();
        this.lightRotation(this.twinkle);
        this.excuteStarLevelAnimation(GameData.passRate);
        this.updateLevelScore();
        this.toolTargetDisPlay(list);
        this.updatePlayerSuccessLevel();
        this.updateLevelNumber();
        
    },

    hideView() {
        this.hideToolTargetList();
        this.node.active = false;
    },

    updateLevelNumber() {
        this.level.string = (GameData.bestLevel) + '';
    },

    updatePlayerSuccessLevel(){

        GameData.totalStar += GameData.passRate;
        GameData.bestLevel += 1;
        GameData.level += 1;
        GameData.storeGameData();
        // cc.systemEvent.emit('UPDATE_DATA');
        let data = GameData.getGameData();
        Utils.updateGameInfo(data);
    },


    start() {
        // this.showView();

    },

    jumpToMainScreen() {
        cc.director.SoundManager.playSound('btnEffect');
        window.NativeManager.reportLevelEvent(GameData.bestLevel);
        cc.sys.localStorage.removeItem('isGet');
        cc.director.loadScene('interface');
        cc.director.jumpCode=2;
    },



    // update (dt) {},
});
