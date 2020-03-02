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
        light:cc.Node,
        particle:cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    effect(){
        // let self=this;
        this.light.opacity=200;
        let action = 
        // cc.sequence(
            // cc.fadeIn(0.1),
            cc.spawn(
                cc.scaleTo(0.5,2),
                cc.fadeOut(0.5),
            );
        // );
        this.particle.resetSystem();
        this.light.runAction(action);
    },


    start () {
        this.effect();
    },

    // update (dt) {},
});
