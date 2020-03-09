// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let FarmData = require('./FarmData');
let FarmUtils = require('./framUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        land: cc.Node,
        land_effect: cc.Node,
        circleContainer: cc.Node,
        landUnlockCost: [cc.SpriteFrame],
        price: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 土地的动画
    landScaleAnima() {
        let action = cc.sequence(
            cc.scaleTo(0.25, 1.1),
            cc.scaleTo(0.5, 0.9),
            cc.scaleTo(0.25, 1),
        ).repeatForever();

        this.land.runAction(action);

    },

    // 土地解锁的撒花效果
    landUnlockEffect() {
        let anima = this.land_effect.getComponent(cc.Animation);
        anima.play();
    },

    endLandUnlockEffect() {
        let anima = this.land_effect.getComponent(cc.Animation);
        anima.stop();
    },

    // 圆圈的放大 透明 消失的动画
    circleScaleFadeAnimation(node, time, scale) {
        node.scale = 0.6;
        node.active = true;
        let action = cc.sequence(
            cc.callFunc(
                function () {
                    node.active = true;
                    node.scale = 0.6;
                    node.opacity = 255;
                }
            ),
            // cc.spawn(
            //     cc.scaleTo(0.1, 1),
            //     cc.fadeIn(0.1),
            // ),
            cc.spawn(
                cc.scaleTo(time, scale),
                cc.fadeOut(time),
            ),
            cc.callFunc(
                function () {
                    node.active = false;
                }
            )

        ).repeatForever();

        node.runAction(action);
    },


    // 组合效果
    openWholeEffect(node) {
        let children = node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            this.scheduleOnce(
                function () {
                    this.circleScaleFadeAnimation(children[i], 5, 2.5);
                }, i * 1
            );
        }

    },


    // 开启光圈缓动效果
    startCircleLight() {
        this.openWholeEffect(this.circleContainer);
    },


    showView(obj) {
        this.obj = obj;
        // console.log(obj, 8 - obj.index);
        this.node.active = true;
        FarmUtils.showPromptWithScale(this.node);
        this.startCircleLight();
        this.landScaleAnima();
        this.landUnlockEffect();
        this.price.spriteFrame = this.landUnlockCost[8 - obj.index];
    },

    // 隐藏容器内所有光圈节点,停止动作
    hideAllLightCircle() {
        let children = this.circleContainer.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].active = false;
            children[i].stopAllActions();
        }
    },

    // 停止土地的动画
    stopLandAnimation() {
        this.land.stopAllActions();
    },

    hideView() {
        this.hideAllLightCircle();
        this.stopLandAnimation();
        this.endLandUnlockEffect();
        this.node.active = false;
        let cost = FarmData.landUnlockAndLevelUpCost[this.obj.index].cost;
        if (!!this.obj) {
            cc.systemEvent.emit('ANIMA_LAND_UNLOCK', this.obj);
            cc.systemEvent.emit('ADD_COINS', -cost);
        }
    },

    start() {
        this.startCircleLight();
        this.landScaleAnima();
        this.landUnlockEffect();
    },

    // update (dt) {},
});
