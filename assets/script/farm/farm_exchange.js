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
const changeRate = FarmData.changeRate;

cc.Class({
    extends: cc.Component,

    properties: {
        node_icon: cc.Node,
        node_cost: cc.Node,
        list_cost: [cc.SpriteFrame],
        node_view: cc.Node,
        list_view: [cc.SpriteFrame],
        node_exchangeNumber: cc.Node,
        node_currency: cc.Node,
        node_btnDiamond: cc.Node,
        list_btnDiamond: [cc.SpriteFrame],
        node_btnCoins: cc.Node,
        list_btnCoins: [cc.SpriteFrame],
        node_coinsNumber: cc.Node,
        node_diamondNumber: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showView() {
        this.node.active = true;
        this.node_currency.active = false;
        FarmUtils.showPromptWithScale(this.node);
        this.updateCoinsAndDiamondDisplay();
        this.scheduleOnce(
            function () {
                this.showDiamondAndCoins(this.node_currency);
            }, 0.5
        )
        this.diamondExchangeToCoins();
    },

    showDiamondAndCoins(node) {
        let winSize = cc.view.getDesignResolutionSize();
        let startPos = cc.v2(0, (winSize.height + node.height) / 2);
        let endPos = cc.v2(0, (winSize.height - node.height) / 2);
        node.position = startPos;
        node.active = true;
        let action = cc.moveTo(0.2, endPos);
        node.runAction(action);
    },


    hideView() {
        this.node.active = false;
    },

    diamondExchangeToCoins() {

        this.changeMode = 1;
        this.changeSpriteView(this.node_view, this.list_view, 0);
        this.changeSpriteView(this.node_icon, this.list_cost, 1)
        this.changeSpriteView(this.node_btnDiamond, this.list_btnDiamond, 0);
        this.changeSpriteView(this.node_btnCoins, this.list_btnCoins, 1);
        this.unitConvert(100, this.changeMode);

    },

    coinsExchangeToCoins() {
        this.changeMode = 2;
        this.changeSpriteView(this.node_view, this.list_view, 1);
        this.changeSpriteView(this.node_icon, this.list_cost, 0);
        this.changeSpriteView(this.node_btnDiamond, this.list_btnDiamond, 1);
        this.changeSpriteView(this.node_btnCoins, this.list_btnCoins, 0);
        this.unitConvert(10000, this.changeMode);
    },

    // 更新节点纹理
    changeSpriteView(node, list, type) {
        node.getComponent(cc.Sprite).spriteFrame = list[type];
    },

    // 更新节点文字信息
    changeLabelContent(node, str) {
        node.getComponent(cc.Label).string = new String(str);
    },

    unitConvert(number, mode) {
        if (mode == 1) {
            this.oringeNumber = number * changeRate;
            this.exchangeNumber = number;
            this.changeLabelContent(this.node_cost, this.oringeNumber);
            this.changeLabelContent(this.node_exchangeNumber, this.exchangeNumber);
        } else if (mode == 2) {
            this.exchangeNumber = number;
            this.oringeNumber = this.exchangeNumber / changeRate;
            this.changeLabelContent(this.node_cost, this.oringeNumber);
            this.changeLabelContent(this.node_exchangeNumber, this.exchangeNumber);
        }
    },

    addExchangeNumber() {
        if (this.changeMode == 1) {
            this.exchangeNumber += 100;
        } else if (this.changeMode == 2) {
            this.exchangeNumber += 10000;
        }
        this.unitConvert(this.exchangeNumber, this.changeMode);
    },

    reduceExchangeNumber() {

        if (this.changeMode == 1) {
            if (this.exchangeNumber <= 100) {
                return;
            }
            this.exchangeNumber -= 100;
        } else if (this.changeMode == 2) {
            if (this.exchangeNumber <= 10000) {
                return;
            }
            this.exchangeNumber -= 10000;
        }
        // this.exchangeNumber -= 100;
        this.unitConvert(this.exchangeNumber, this.changeMode);
    },

    // 兑换
    exchange() {
        let diamond = FarmUtils.getCoins();
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (this.changeMode == 1) {
            if (farmInfo.coin >= this.oringeNumber) {
                diamond += this.exchangeNumber;
                FarmUtils.saveCoins(diamond);
                farmInfo.coin -= this.oringeNumber;
                FarmUtils.setLocalData(farmInfo, 'localFarmInfo');
                // 更新金币和钻石的展示
                this.updateCoinsAndDiamondDisplay();
                cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1007 });
            } else {
                // 提示金币不够
                cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1006 });
            }

        } else {
            if (diamond > this.oringeNumber) {
                farmInfo.coin += this.exchangeNumber;
                diamond -= this.oringeNumber;
                FarmUtils.saveCoins(diamond);
                FarmUtils.setLocalData(farmInfo, 'localFarmInfo');
                // 更新金币和钻石的展示
                this.updateCoinsAndDiamondDisplay();
                cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1007 });
            } else {
                // 提示钻石不够
                cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1005 });
            }

        }

    },


    // 更新金币和钻石的展示
    updateCoinsAndDiamondDisplay() {
        let diamond = FarmUtils.getCoins();
        let coin = FarmUtils.getObjectProperty('localFarmInfo', 'coin');
        this.changeLabelContent(this.node_diamondNumber, diamond);
        this.changeLabelContent(this.node_coinsNumber, coin);
        cc.systemEvent.emit('UPDATE_FARM_COINS');

    },



    start() {

    },

    // update (dt) {},
});
