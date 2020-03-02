
let Utils = require('../utils');

cc.Class({
    extends: cc.Component,
    properties: {
        tipsWord: cc.Sprite,
        tipsWordList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showView(type) {
        cc.director.screenDialog.hideAllChild();
        cc.director.screenDialog.mask.active = true;
        this.type = type;
        this.node.active = true;
        this.showPromptWithScale(this.node);
        this.tipsWord.spriteFrame = this.tipsWordList[type];
    },


    showPromptWithScale(node) {
        node.scale = 0.2;
        node.runAction(
            cc.scaleTo(0.3, 0.8).easing(cc.easeBackOut(3))
        );
    },

    hideView() {
        this.node.active = false;
        cc.director.screenDialog.hideAllChild();
        if (this.type < 4) {
            // 显示设置界面
            cc.director.screenDialog.showSettingPanel();
        }
    },

    start() {

    },

    // update (dt) {},
});
