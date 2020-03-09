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

        rightNodeList: [cc.Node],
        leftNodeList: [cc.Node],
        downNodeList: [cc.Node],
        upNodeList: [cc.Node],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let winSize = cc.view.getDesignResolutionSize();
        this.width = winSize.width;
        this.height = winSize.height;
    },

    onEnable() {
        this.regester();
    },

    onDisable() {
        this.cancle();
    },
    // 注册全局时间
    regester() {
        cc.systemEvent.on('BTN_FADE_OUT', this.allBtnLeaveViewArea, this);
        cc.systemEvent.on('BTN_FADE_IN', this.allBtnLeaveViewArea, this);
    },

    cancle() {
        cc.systemEvent.off('BTN_FADE_OUT');
        cc.systemEvent.off('BTN_FADE_IN');
    },


    // 列表淡出
    listFadeInAndOut(list, callback) {
        let len = list.length;
        if (!callback) {
            return;
        }
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                callback(list[i], 0.1)
            }
        }
    },

    leftFadeOut(node, time) {

        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            ),

            cc.moveTo(2 * time, cc.v2(this.width - node.x, node.y)),
        );
        node.runAction(action);

    },

    leftFadeIn(node, time) {
        let action = cc.sequence(
            cc.moveTo(0.2, cc.v2(this.width - node.x, node.y)),
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            )
        );
        node.runAction(action);
    },

    rightFadeOut(node, time) {

        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            ),

            cc.moveTo(2 * time, cc.v2(-this.width - node.x, node.y)),
        );
        node.runAction(action);
    },

    rightFadeIn(node, time) {

        let action = cc.sequence(
            cc.moveTo(0.2, cc.v2(-this.width - node.x, node.y)),
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            )
        );
        node.runAction(action);
    },

    downFadeOut(node, time) {

        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            ),
            cc.moveTo(0.2, cc.v2(node.x, -this.height - node.y)),
        );
        node.runAction(action);
    },

    downFadeIn(node, time) {

        let action = cc.sequence(
            cc.moveTo(0.2, cc.v2(node.x, -this.height - node.y)),

            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            ),
         
        );
        node.runAction(action);
    },

    upFadeOut(node, time) {

        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            ),
            cc.moveTo(0.2, cc.v2(node.x, this.height - node.y)),
        );
        node.runAction(action);
    },

    upFadeIn(node, time) {

        let action = cc.sequence(
            cc.moveTo(0.2, cc.v2(node.x, this.height - node.y)),
            cc.sequence(
                cc.scaleTo(time, 1.1),
                cc.scaleTo(2 * time, 0.9),
                cc.scaleTo(time, 1),
            )
        );
        node.runAction(action);

    },


    //  所有按钮离开可视区
    allBtnLeaveViewArea() {
        this.listFadeInAndOut(this.leftNodeList, this.leftFadeOut.bind(this));
        this.listFadeInAndOut(this.rightNodeList, this.rightFadeOut.bind(this));
        this.listFadeInAndOut(this.downNodeList, this.downFadeOut.bind(this));
        this.listFadeInAndOut(this.upNodeList, this.upFadeOut.bind(this));
    },

    // 所有按钮返回可视区
    allBtnBackViewArea() {
        this.listFadeInAndOut(this.leftNodeList, this.leftFadeIn.bind(this));
        this.listFadeInAndOut(this.rightNodeList, this.rightFadeIn.bind(this));
        this.listFadeInAndOut(this.downNodeList, this.downFadeIn.bind(this));
        this.listFadeInAndOut(this.upNodeList, this.upFadeIn.bind(this));
    },


    // start() {
        
    // },

    // update (dt) {},
});
