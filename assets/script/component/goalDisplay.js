

let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        goal: require('./goal'),
        bg: cc.Node,
        toolList: require('./toolList'),
        squirrelNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initGoalPosition() {
        let viewSize = cc.view.getFrameSize();

        this.constNum = this.node.width + viewSize.width / 2;
        this.node.position = cc.v2(this.constNum, 0);
        this.squirrelNode.position = cc.v2(viewSize.width / 2 + this.squirrelNode.width / 2, 0);
        // console.log(viewSize.width,'24');
    },

    // 松鼠动画
    squirrelAnimation() {
        let viewSize = cc.view.getVisibleSize();
        this.scaleRate = viewSize.width / cc.view.getDesignResolutionSize().width;
        this.squirrelNode.active = true;
        let anima = this.squirrelNode.getComponent(cc.Animation);
        anima.play('squirrelsRun');
        // console.log(1.6*this.scaleRate,this.scaleRate, cc.view.getDesignResolutionSize().width,viewSize);
        let action = cc.sequence(
            cc.fadeIn(0.1),
            // cc.moveTo(1.75,cc.v2(-this.node.width/2,0)),
            // cc.delayTime(0.3),
            cc.moveTo(2 * this.scaleRate, cc.v2(-(viewSize.width + 2 * this.squirrelNode.width) / 2, 0)),
            cc.fadeOut(0.1)
        )
        this.squirrelNode.runAction(action);
        // let time = anima.getClips()[0].duration;
        // this.scheduleOnce(
        //     function () {
        //         // exam.removeFromParent();

        //     }.bind(this)
        //     , time
        // 11111111111111111111111111111
        // )
    },

    fadeInAndOut() {
        cc.director.SoundManager.playSound('mission_show');
        this.node.parent.active = true;
        this.node.active = true;
        let self = this;
        const t = 0.79;
        this.initGoalPosition();
        this.squirrelAnimation();
        let action = cc.sequence(
            cc.spawn(
                cc.fadeIn(t),
                cc.moveTo(2 * t * this.scaleRate, cc.v2(0, 0))
            ),
            cc.callFunc(function () {
                let txt = self.goal.getTargetItemWorldPosition();
                for (let i = 0; i < txt.length; i++) {
                    cc.systemEvent.emit('NOTICE_TARGET', txt[i]);
                }
                self.goal.node.active = false;
            }),
            // cc.delayTime(2*t),
            // cc.spawn(
            //     cc.moveTo(t,cc.v2(-this.constNum,0)),
            cc.fadeOut(t),
            // ),
            cc.callFunc(function () {

                cc.director.container.addGameToolToContainer(GameData.choosedList);
                self.toolList.judgeLevel();
                self.bg.runAction(
                    cc.fadeOut(0.5),
                );
                setTimeout(function () {
                    cc.systemEvent.emit('EXCUTE_GUIDE_STEP');
                }, 500)

            })
        );
        this.node.runAction(action);
    },

    // 初始化目标数目
    initGoalNumber(list) {
        this.bg.active = true;
        this.bg.opacity = 120;
        // this.bg.runAction(cc.fadeIn(0.5));
        this.goal.node.active = true;
        this.goal.updateNodeTag(list);
        this.fadeInAndOut();
    },

    start() {
        // this.fadeInAndOut();
        // console.log('目标展示');
    },

    // update (dt) {},
});
