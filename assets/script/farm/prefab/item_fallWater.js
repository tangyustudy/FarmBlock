// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        water: cc.Node,
        waterAnima: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 水滴下落
    fallDown(pos) {
        let self = this;
        self.node.active=true;
        self.water.active=true;
        self.waterAnima.active=false;
        let action = cc.sequence(
            // cc.spawn(
                cc.moveTo(0.5, pos),
                // cc.fadeOut(0.5),
            // ),
            cc.callFunc(function () {
                self.water.active=false;
                self.waterAnima.active=true;
                self.waterFallDownAnimation();
            })
        );
        this.node.runAction(action);
    },

    // 水滴溅起的动画
    waterFallDownAnimation() {
        let anima = this.waterAnima.getComponent(cc.Animation);
        anima.play('waterFall');
        let endtime = anima.getClips()[0].duration;
        this.scheduleOnce(
            function(){
                this.waterAnima.active=false;
                cc.director.nodePool.put(this.node);
                // let s = this.node.parent.parent.getComponent('groundLand');
                // s.speedUpAnimation();
            },endtime
        );
    },

    start() {

    },

    // update (dt) {},
});
