let FarmUtils = require('./framUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        offlineNumber: cc.Node,
        house: cc.Node,
        doubleOfflineNumber: cc.Node,
        btn_get: cc.Node,
        btn_collect: cc.Node,
        btn_close: cc.Node,
        // landContainer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // 计算离开时间产生的经验
    computedOfflineExp() {
        // console.log(exp);
        let exp = cc.director.FarmManager.getCurrentAllLandExp();
        this.exp = exp;
    },

    getOfflineExp() {
        // cc.director.FarmManager.collectAllLandExp();
        cc.director.farmDialog.hideOfflineExpPrompt();
    },

    getDoubleOfflineExp() {
        let worldPos = this.offlineNumber.parent.convertToWorldSpaceAR(this.offlineNumber.position);
        cc.systemEvent.emit('UPDATE_FARM', {
            coins: 0,
            exp: this.exp * 2,
            worldPos: worldPos,
        });
        cc.director.farmDialog.hideOfflineExpPrompt();
        cc.director.FarmManager.resetAllLandExp();
    },

    // 看视频广告
    watchVideoAd() {
        // console.log(this);
        this.numberRoll(this.offlineNumber, this.exp);
        this.btn_collect.active = true;
        this.btn_get.active = false;
        this.btn_close.active = false;
    },



    showView() {
        this.node.active = true;
        FarmUtils.showPromptWithScale(this.node);
        this.playNodeAnimation(this.house, 1);
        this.computedOfflineExp();
        this.computedOfflineExp();
        this.changeNodeLabelString(this.offlineNumber, this.exp);
        this.changeNodeLabelString(this.doubleOfflineNumber, this.exp * 2);
        this.btn_collect.active = false;
        this.btn_close.active = true;
        this.btn_get.active = true;
    },

    hideView() {
        this.playNodeAnimation(this.house, 2);
        this.node.active = false;
    },


    // 填充label的内容
    changeNodeLabelString(node, str) {
        let label = node.getComponent(cc.Label);
        label.string = new String(str);
    },


    // 播放动画
    playNodeAnimation(node, type, name) {
        let anima = node.getComponent(cc.Animation);
        if (!anima) {
            cc.log('no animation component on this node!');
            return;
        }
        if (!!name) {
            if (type == 1) {
                anima.play(name);
            } else if (type == 2) {
                anima.stop(name)
            } else {
                cc.log(type, 'sorry, your type is not exist!');
            }
        } else {
            if (type == 1) {
                anima.play();
            } else if (type == 2) {
                anima.stop();
            } else {
                cc.log(type, 'sorry, your type is not exist!');
            }
        }

    },


    // 数字的滚动
    numberRoll(node, addNumber) {
        let label = node.getComponent(cc.Label);
        let number = parseInt(label.string);
        let quotient = Math.floor(addNumber / 20);
        let oneOfAll, len, rest = 0, isAddRest = false;
        if (quotient > 1) {
            oneOfAll = quotient;
            len = 20;
            rest = addNumber - 20 * oneOfAll;
            isAddRest = true;
        } else {
            oneOfAll = 1;
            len = addNumber;
        }

        for (let i = 0; i < len; i++) {
            this.scheduleOnce(
                function () {
                    number += oneOfAll;
                    if (i == len - 1 && rest > 0 && isAddRest) {
                        number += rest;
                    }
                    label.string = new String(number);
                }, 0.05 * i
            )
        }


    },



    start() {

    },

    // update (dt) {},
});
