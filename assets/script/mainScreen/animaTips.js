let Utils = require('../utils');

// const step = 0.1;

cc.Class({
    extends: cc.Component,

    properties: {

        rocket: cc.Node,
        progress: cc.ProgressBar,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // squirrel 松鼠骑火箭的帧动画
    squirrelRideRocket() {
        let action = cc.sequence(
            cc.spawn(
                cc.scaleTo(1, 0.95),
                cc.moveTo(1, cc.v2(30, 10)),
            ),
            cc.sequence(
                cc.scaleTo(1, 1),
                cc.moveTo(1, cc.v2(0, 0)),
            )
        ).repeatForever();
        this.rocket.position = cc.v2(0, 0);
        this.rocket.runAction(action);
    },
    // 

    // 进度条的动画 fake
    progressBarMove() {
        this.progress.progress += 0.3 + Math.random() * 0.1;
        if (this.progress.progress >= 1) {
            this.progress.progress = 1;
            this.unschedule(this.progressBarMove);
        }
    },



    showView() {
        cc.systemEvent.emit('STOP_TOUCH', { number: 1 })
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        this.squirrelRideRocket();
        this.progress.progress = 0;
        this.schedule(this.progressBarMove, 1);
    },

    hideView() {
        if(!this.node.active){
            return ;
        }
        cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
        this.unschedule(this.progressBarMove);
        this.progress.progress = 1;
        this.rocket.stopAllActions();
        this.node.active = false;
    },


    start() {
        // this.progressBarMove();
        // this.showView();
    },

    // update (dt) {},
});
