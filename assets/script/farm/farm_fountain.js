const FarmUtils = require('./framUtils');
const FarmData = require('./FarmData');

cc.Class({
    extends: cc.Component,

    properties: {
        prefab_fountain_small: cc.Prefab,
        node_fountain_big: cc.Node,
        label_fountain_countdown: cc.Label,
        time_bg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.posList = [
            cc.v2(-300, -250),
            cc.v2(320, -20),
            cc.v2(-50, 240),
        ];
        cc.systemEvent.on('STARTOVER_AUTOWATER', this.startoverAutoWater, this);
        cc.director.isAutoWater = false;
        cc.director.isAutoInsec = false;
    },


    bigfountaianStartover() {
        let anima = this.node_fountain_big.getComponent(cc.Animation);
        anima.play('fountain');
    },

    smallFountainStartover(num) {
        let anima;
        for (let i = 0; i < this.posList.length; i++) {
            let sFountain = cc.instantiate(this.prefab_fountain_small);
            sFountain.parent = this.node;
            sFountain.position = this.posList[i];
            anima = sFountain.getComponent(cc.Animation);
            anima.play('fountain_s');
            if (num == i) {
                break;
            }
        }
    },


    //  道具等级的不同 体现出相应的变化
    startoverAutoWater(event) {
        cc.director.SoundManager.playSound('farm_waterMachine');

        let type = event.type;
        this.bigfountaianStartover();
        if (type == 9) {
            this.smallFountainStartover(type - 9);
        } else if (type == 10) {
            this.smallFountainStartover(type - 9);
        } else if (type == 11) {
            this.smallFountainStartover(type - 9);
        }
        if (event.mode == 1) {
            this.recordPropsDetail(type);
        }

    },


    // 记录当前道具等级 和 结束时间 
    recordPropsDetail(type) {
        let autoProp = FarmUtils.getLocalData('autoProp');
        if (!autoProp) {
            autoProp = {};
            let effectTime = FarmData.propShopList[type].effectTime * FarmData.costTime.ONE_MIN;
            let endTime = FarmUtils.getServerTime() + effectTime;
            let autowater = {};
            let autoInsec = {};
            if (type >= 8 && type < 12) {
                // this.label_fountain_countdown.node.active=true;
                autowater.endTime = endTime;
                autowater.grade = type;
                autoInsec.endTime = -1;
                autoInsec.grade = -1;
            } else if (type >= 12 && type < 15) {
                autowater.endTime = -1;
                autowater.grade = -1;
                autoInsec.endTime = endTime;
                autoInsec.grade = grade;
            }
            autoProp.autowater = autowater;
            autoProp.autoInsec = autoInsec;
        } else {
            let addtime = FarmData.propShopList[type].effectTime * FarmData.costTime.ONE_MIN;
            let current = FarmUtils.getServerTime();
            if (type >= 8 && type < 12) {
                // this.label_fountain_countdown.node.active=true;
                if (current > autoProp.autowater.endTime) {
                    autoProp.autowater.endTime = current + addtime;
                    autoProp.autowater.grade = type;
                } else {
                    autoProp.autowater.endTime += addtime;
                    if (autoProp.autowater.grade < type) {
                        autoProp.autowater.grade = type;
                    }
                }
                this.endTime = autoProp.autowater.endTime;
            } else if (type >= 12 && type < 15) {
                if (current > autoProp.autoInsec.endTime) {
                    autoProp.autoInsec.endTime = current + addtime;
                    autoProp.autoInsec.grade = type;
                } else {
                    autoProp.autoInsec.endTime += addtime;
                    if (autoProp.autoInsec.grade < type) {
                        autoProp.autoInsec.grade = type;
                    }
                }
            }
        }
        console.log(autoProp);
        // FarmUtils.setLocalData(autoProp, 'autoProp');
        this.isAutoWater();
    },

    // 是否处在自动浇水状态
    isAutoWater() {
        let current = FarmUtils.getServerTime();
        let autoProp = FarmUtils.getLocalData('autoProp');
        if (!!autoProp) {
            if (autoProp.autowater.endTime > current) {
                this.label_fountain_countdown.node.active = true;
                this.time_bg.active = true;
                this.time_bg
                cc.systemEvent.emit('STARTOVER_AUTOWATER', { type: autoProp.autowater.grade, mode: 2 });
                this.endTime = autoProp.autowater.endTime;
                // console.log(this.endTime, '122');
                this.label_fountain_countdown.string = FarmUtils.countdown(this.endTime, 1);
                this.schedule(this.showFountainCountdown, 1);
                cc.director.isAutoWater = true;
            } else {
                this.label_fountain_countdown.node.active = false;
                this.time_bg.active = false;
            }
            // 自动杀虫 todo

        } else {
            this.label_fountain_countdown.node.active = false;
            this.time_bg.active = false;
        }
    },

    // 喷泉的倒计时显示
    showFountainCountdown() {
        let str = FarmUtils.countdown(this.endTime, 1);
        this.label_fountain_countdown.string = new String(str);
    },

    start() {

        this.isAutoWater();

    },

    // update (dt) {},
});
