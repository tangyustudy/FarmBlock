// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');

cc.Class({
    extends: cc.Component,

    properties: {
        viewList: [cc.SpriteFrame],
        node_view: cc.Node,
        node_unlockAnimation: cc.Node,
        node_name: cc.Label,
        // node_animation:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // initPrompt(utils,data){
    //     this.utils = utils;
    //     this.data = data;
    // },



    showView(type) {
        this.node.active = true;
        FarmUtils.showPromptWithScale(this.node);
        this.type = type;
        // 播动画
        this.playUnlockAnimation(this.node_unlockAnimation);

        // console.log(type, '43,plantunlock');

        this.changeSpriteView(this.node_view, this.viewList, type);
        let name = FarmData.plantInfo[type].name;
        this.changeLabelContent(this.node_name, name);
        this.viewNodeBreathEffect(this.node_view);
    },

    // 展示节点的呼吸效果
    viewNodeBreathEffect(node) {
        let action = cc.sequence(
            cc.scaleTo(0.2, 0.85),
            cc.scaleTo(0.4, 1.15),
            cc.scaleTo(0.2, 1)
        ).repeatForever();
        node.runAction(action);
    },


    hideView() {
        this.node_unlockAnimation.active = false;
        // 关闭界面，增送种子。
        this.node.active = false;
        this.sendRequestToAnimaLayer();
        this.node_view.stopAllActions();

    },

    playUnlockAnimation(node) {
        node.active = true;
        let animation = node.getComponent(cc.Animation);
        animation.play();
    },

    // 给动画层发送动画请求
    sendRequestToAnimaLayer() {
        let wp = this.node_view.parent.convertToWorldSpaceAR(this.node_view.position);
        let data = {};
        data.type = this.type;
        data.number = FarmData.plantUnlockSeedReward[this.type];
        cc.systemEvent.emit('OBTAIN_SEED', { worldPos: wp, data: data });
    },

    // 更新节点纹理
    changeSpriteView(node, list, type) {
        node.getComponent(cc.Sprite).spriteFrame = list[type];
    },

    // 更新节点文字信息
    changeLabelContent(node, str) {
        node.getComponent(cc.Label).string = new String(str);
    },



    start() {
        this.showView(1);
    },

    // update (dt) {},
});
