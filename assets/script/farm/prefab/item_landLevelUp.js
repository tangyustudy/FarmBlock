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
        level: cc.Node,
        progress: cc.ProgressBar,
        producePecent: cc.Node,
        cost: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.count = 0;
    },

    initItem(data, FarmUtils) {
        this.FarmUtils = FarmUtils;
        this.data = data;
        this.progress.progress = data.count * 0.05;
        this.changeLabelStr(this.level, 'lv ' + data.level);
        this.changeLabelStr(this.producePecent, data.level * 5 + '%');
        this.changeCostContent(data.level);
    },


    handleTapEvent(touchCounter) {
        if (touchCounter < 3) {
            this.count++;
        } else {
            this.count += Math.ceil((touchCounter - 3) * 1.003);
        }
        // console.log(this.count, 'heiehi');

        // 扣钱
        // this.node.zIndex = 1;
        // this.checkCoin();
        this.isCoinEnough();
    },


    isCoinEnough() {
        let coin = this.FarmUtils.getObjectProperty('localFarmInfo', 'coin');
        let cost = this.data.cost;
        if (coin >= cost) {
            cc.systemEvent.emit('ADD_COINS', -cost);
            this.checkCoin();
            this.changeProgress();
        } else {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1001 });
            return;
        }
    },




    changeLabelStr(node, str) {
        node.getComponent(cc.Label).string = new String(str);
    },

    changeProgress() {
        this.progress.progress += 0.05;
        if (this.progress.progress >= 1) {
            this.progress.progress -= 1;
            // this.changeLabelStr()
            this.data.level += 1;
            this.changeLabelStr(this.level, 'lv ' + this.data.level);
            this.changeLabelStr(this.producePecent, this.data.level * 5 + '%');
            this.changeCostContent(this.data.level);
        }
    },

    changeCostContent(level) {
        let totalCost = this.getTotalClickCost(level);
        let str = Math.floor(totalCost / 20);
        this.data.cost = str;
        this.changeLabelStr(this.cost, str);
    },

    // getSingleClickCost(level){
    //     // LVn = LVn-1 + (n-1)*(25k+(取整(n/5))*20k),  LV1 = 0
    //     // let total = 
    //     let total = 

    // },

    checkCoin() {
        let event = new cc.Event.EventCustom('isClick', true);
        // event.detail = { cost: this.data.cost };
        console.log(event);
        event.detail = { cost: this.data.cost };
        this.node.dispatchEvent(event);
    },



    getTotalClickCost(level) {
        let sum = 2500;
        for (let i = 1; i <= level; i++) {
            sum += (i - 1) * (25000 + Math.floor(i / 5) * 2000);
        }
        return sum;
    },




    start() {
        // console.log(this.getTotalClickCost(10));
        // this.checkCoin();
    },

    // update (dt) {},
});
