// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const mowPositionList = [cc.v2(-300, 280), cc.v2(-370, 250), cc.v2(320, 230),];
const flower_PosList_double = [cc.v2(-320, -330), cc.v2(-260, 100)];
const flower_PosList_single = [cc.v2(100, -420)];

cc.Class({
    extends: cc.Component,

    properties: {
        mow: cc.Prefab,
        flower_double: cc.Prefab,
        flower_single: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.addMowToFarm();
        this.addFlowerToFarm();
        this.turnOnSchedule();
    },

    // 将草堆加入到场景中
    addMowToFarm() {
        for (let i = 0; i < mowPositionList.length; i++) {
            this.addStuffToFarm(this.mow, mowPositionList[i]);
        }

    },

    // 将两朵花，加入到场景中
    addDoubleFlower() {
        for (let i = 0; i < flower_PosList_double.length; i++) {
            this.addStuffToFarm(this.flower_double, flower_PosList_double[i]);
        }
    },

    addSingleFlower() {
        for (let i = 0; i < flower_PosList_single.length; i++) {
            this.addStuffToFarm(this.flower_single, flower_PosList_single[i]);
        }
    },


    // 将物件加入到场景中
    addStuffToFarm(stuff, position) {
        let dFlower = cc.instantiate(stuff);
        dFlower.parent = this.node;
        dFlower.position = position;
    },

    // 将花加入到场景中
    addFlowerToFarm() {
        // this.addStuffToFarm(this.flower_double, flower_position_double);
        this.addDoubleFlower();
        this.addSingleFlower();
    },

    // 播放草堆动画
    playAnimaiton(node) {
        let anima = node.getComponent(cc.Animation);
        anima.play();
    },

    // 播放动画
    playStuffAnimation() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            this.playAnimaiton(children[i]);
        }
    },


    turnOnSchedule() {
        this.schedule(this.playStuffAnimation, 5);
    },


    // 移除定时器
    onDestroy() {
        this.unschedule(this.playStuffAnimation);
    },

    // update (dt) {},
});
