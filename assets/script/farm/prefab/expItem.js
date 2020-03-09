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
        label_expNumber: cc.Label,
        node_name_exp: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updateExpNumber(num) {
        this.label_expNumber.string = '.' + num;
        let widget = this.label_expNumber.node.getComponent(cc.Widget);
        widget.left = 30;
        widget.updateAlignment();
        let widget1 = this.node_name_exp.getComponent(cc.Widget);
        widget1.right = -30;
        widget1.updateAlignment();
    },


    start() {

    },

    // update (dt) {},
});
