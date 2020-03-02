let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');

cc.Class({

    extends: cc.Component,
    properties: {
        progressBar: cc.ProgressBar,
        label_lv: cc.Label,
        label_coins: cc.Label,
        icon: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('UPDATE_FARM_LEVEL', this.updateLevel, this);
        cc.systemEvent.on('UPDATE_FARM_COINS', this.updateCoins, this);
        cc.systemEvent.on('UPDATE_FARM_PROGRESS', this.updateProgressBar, this);

    },

    updateProgressBar(event) {
        this.progressBar.progress = event.num;
     
        console.log(event.num, 'progerssBar 25');
        this.icon.runAction(
            cc.sequence(
                cc.scaleTo(0.2, 1.1),
                cc.scaleTo(0.2, 0.9),
                cc.scaleTo(0.2, 1)
            )
        );
        if (event.islevelUp) {
            cc.director.farmDialog.showFarmLevelUpPrompt();
        }
        // else {
        this.updateLevel();
        // if(event.coins)
        this.updateCoins();
        // }

    },


    updateLevel() {
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (!farmInfo) {
            this.label_lv.string = '1';
        } else {
            this.label_lv.string = new String(farmInfo.level);
            this.label_lv.node.getChildByName('Lv').getComponent(cc.Widget).left = -30;
        }

    },

    updateCoins(event) {
        let self = this;
        // let callback = function () {
        if (event.number == 0) {
            let coins = FarmUtils.getObjectProperty('localFarmInfo', 'coin');
            if (!coins) {
                coins = 0;
            }
            self.label_coins.string = new String(coins);
        } else {
            FarmUtils.numberRoll(this.label_coins, event.number);
        }

        // };
        // FarmUtils.numberRoll(this.label_coins, event.tempNumber, callback);
        cc.systemEvent.emit('UPDATE_LAND_STATUE');
    },

    updateCurrentProgress() {
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (!farmInfo) {
            cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: 0.01 });
        } else {
            let num = farmInfo.exp / FarmData.getLevelUpExp(farmInfo.level + 1);
            // if (num == 0) {
            //     cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: 0.01 });
            // } else {
            cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: num });
            // }

        }
    },


    init() {
        this.updateLevel();
        this.updateCoins();
        this.updateCurrentProgress();
    },



    start() {
        this.init();
    },

    // update (dt) {},
});
