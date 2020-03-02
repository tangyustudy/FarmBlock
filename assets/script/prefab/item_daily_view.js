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
        view:cc.Sprite,
        viewList:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initView(type){
        this.view.spriteFrame = this.viewList[type];
        // this.node.scale = 0.1;
        this.lightAnimation();
        // this.node.runAction(
        //     cc.sequence(
        //         cc.scaleTo(0.5,1),
        //         cc.delayTime(1.5),
        //         cc.scaleTo(0.5,0.5),
        //     )
        // )
    },

    // 炫光效果
    lightAnimation(){
        let action = cc.sequence(
            // cc.scaleTo(0.5,1),
            cc.rotateBy(2,90),
            cc.fadeOut(0.2),
        )
        this.light.runAction(action);
    },




    start () {

    },

    // update (dt) {},
});
