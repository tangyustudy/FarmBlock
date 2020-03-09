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
const progressLength = 135;
const unitTime = FarmData.costTime.ONE_MIN;

cc.Class({
    extends: cc.Component,

    properties: {
        number: cc.Label,
        unfinishedSpriteList: [cc.SpriteFrame],
        finishedSpriteList: [cc.SpriteFrame],
        //进度条的缓动速度
        speed: 0,
        // 累积的经验数
        accumulateExpNumber: 0,
        mask: cc.Node,
        expIcon: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 计算加速时间产生的经验值
    computedSpeedUpTimeExp(isMature, time) {
        let tempExp;
        let lastTime;
        let secondExp = this.getSecondExp();
        if (isMature) {
            let acculmulateList = FarmUtils.getLocalData('accumulateList');
            if (!!acculmulateList) {
                lastTime = acculmulateList[this.info.index];
            }
            // let plantTime = this.getSinglePlantTime(this.info.index);
            // let chazhi = plantTime - this.info.plantTime;
            let period = FarmData.plantInfo[this.info.type].cycle * unitTime;
            if (lastTime == -1 || !lastTime) {
                tempExp = Math.floor(period / secondExp);
            } else {
                tempExp = Math.floor((this.info.plantTime + period - lastTime) / secondExp);
            }

        } else {
            tempExp = Math.floor(time / secondExp);
        }
        return tempExp;
    },

    // 将加速经验加到经验累积上
    addSpeedUpTimeExpToAccumulateExpNumber(isMature, time) {
        let tempExp = this.computedSpeedUpTimeExp(isMature, time);
        this.accumulateExpNumber += tempExp;
        this.changeAccumulateExpNumberDisplay(this.accumulateExpNumber);
        // console.log(tempExp, '加速增加的经验');
    },


    // 计算获得一点经验需要多少时间
    getSecondExp() {
        console.log(this.speed, '速度是没算么？')
        let time = Math.floor(0.2 * progressLength / this.speed)
        console.log('增加一点经验需要的时间，', time);
        return time;
    },


    initProgressNode(time, type, info) {
        // 未成熟进度条
        this.info = info;
        // console.log(info, 'progressNode ,37');
        this.recordPlantStartTime(this.info.index, this.info.plantTime);
        this.computedProgressMoveSpeed(time);
        if (type == 1) {
            this.growUpMoveAnimation();
        } else if (type == 2) { //成熟进度条
            this.finishedMoveAnimation();
        }

        let exp = this.computedAccumulateExp();
        if (!!exp) {
            this.accumulateExpNumber = exp;
            this.changeAccumulateExpNumberDisplay(exp);
        } else {
            this.changeAccumulateExpNumberDisplay(0);
        }
    },


    //计算进度条的缓动速度 
    computedProgressMoveSpeed(time) {
        this.speed = 50 / time;
    },

    // 记录开始累积的时间
    recordAccumulateStartTime() {
        let serverTime = FarmUtils.getServerTime();
        // cc.sys
        let acculmulateList = FarmUtils.getLocalData('accumulateList');
        if (!!acculmulateList) {
            if (acculmulateList[this.info.index] == -1) {
                acculmulateList[this.info.index] = serverTime;
                // FarmUtils.setLocalData(acculmulateList, 'accumulateList');
            }
        } else {
            acculmulateList = [];
            for (let i = 0; i < 9; i++) {
                acculmulateList.push(-1);
            }
            acculmulateList[this.info.index] = serverTime;
        }
        FarmUtils.setLocalData(acculmulateList, 'accumulateList');
    },

    // 重置开始累积的时间
    resetAccumulateStartTime() {
        // let serverTime = FarmUtils.getServerTime();
        let acculmulateList = FarmUtils.getLocalData('accumulateList');
        if (!!acculmulateList) {
            acculmulateList[this.info.index] = -1;
            this.accumulateExpNumber = 0;
            FarmUtils.setLocalData(acculmulateList, 'accumulateList');
            this.changeAccumulateExpNumberDisplay(this.accumulateExpNumber);
        };
    },

    // 计算累积的经验数
    computedAccumulateExp() {
        let acculmulateList = FarmUtils.getLocalData('accumulateList');
        let secondExp = this.getSecondExp();
        if (!!acculmulateList) {
            let lastTime = acculmulateList[this.info.index];
            let serverTime = FarmUtils.getServerTime();
            let plantTime = this.getSinglePlantTime(this.info.index);
            let exp;
            let period = FarmData.plantInfo[this.info.type].cycle * unitTime;
            if (lastTime == -1) {
                // console.log('不存在上次累积时间的');
                // exp = period / secondExp;
                return 0;
            } else {
                if (serverTime >= plantTime + period) {
                    exp = Math.floor((plantTime + period - lastTime) / secondExp);
                } else {
                    if (this.info.healthStatue.reap == 1) {
                        exp = Math.floor((plantTime + period - lastTime) / secondExp);
                    } else {
                        let propsAddTime = plantTime - this.info.plantTime;
                        exp = Math.floor((serverTime - lastTime + propsAddTime) / secondExp);
                    }
                }
                // console.log(plantTime, period, lastTime, exp, '存在上次累积时间');
                return exp;
            }
        } else {
            return 0;
        }
    },

    // 100%缓动动画
    finishedMoveAnimation() {
        this.node.active = true;
        this.mask.width = progressLength;
        this.unschedule(this.changeMaskWidth);
        this.progressUnlimitedMove(this.finishedSpriteList);
    },

    //  0%-100%缓动动画
    growUpMoveAnimation() {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.runAction(
            cc.fadeIn(2.5)
        );
        this.progressUnlimitedMove(this.unfinishedSpriteList);
        // 执行mask的缓动动画 todo
        this.mask.width = 0;
        this.schedule(this.changeMaskWidth, 0.2);
    },

    // 改变mask的宽度
    changeMaskWidth() {
        // let speed = this.computedProgressMoveSpeed();
        this.mask.width += this.speed;
        if (this.mask.width >= progressLength) {
            this.mask.width = 0;
            this.recordAccumulateStartTime();
            this.accumulateExpNumber += 1;
            this.changeAccumulateExpNumberDisplay(this.accumulateExpNumber);
            this.nodeBreathAnimation(this.expIcon);
        }
    },


    // 改变累积经验值的数量展示
    changeAccumulateExpNumberDisplay(number) {
        this.number.string = new String(number);
    },



    //  图片切换实现动画效果

    progressUnlimitedMove(list) {
        let p1 = this.mask.getChildByName('progress1');
        let p2 = this.mask.getChildByName('progress2');
        p1.getComponent(cc.Sprite).spriteFrame = list[0];
        p2.getComponent(cc.Sprite).spriteFrame = list[1];
        this.tempProgress = p2;
        this.schedule(this.unlimitedMove, 0.2);
        this.progressCount = 0;
    },

    // 实现无限滚动效果
    unlimitedMove() {
        this.progressCount++;
        if (!!this.tempProgress) {
            if (this.progressCount >= 100) {
                this.progressCount = 0;
            }
            if (this.progressCount % 2 != 0) {
                this.tempProgress.active = false;
            } else {
                this.tempProgress.active = true;
            }
        }
    },

    // 隐藏进度条界面   
    hideProgressNode() {
        this.unschedule(this.unlimitedMove);
        this.unschedule(this.changeMaskWidth);
        this.node.active = false;
        this.accumulateExpNumber = 0;
        // this.resetAccumulateStartTime();
    },

    // 收集经验
    collectExp() {
        if (this.accumulateExpNumber > 0) {
            // console.log(this.accumulateExpNumber);
            cc.systemEvent.emit('UPDATE_FARM', { exp: this.accumulateExpNumber, coins: 0, worldPos: this.iconWorldPos });
            this.resetAccumulateStartTime();
            this.changeAccumulateExpNumberDisplay(this.accumulateExpNumber);
        }
    },

    // 获得当前累积的经验
    getAccumulateExpNumber() {
        return this.accumulateExpNumber;
    },


    // 记录当前植物的种植时间
    recordPlantStartTime(index, plantTime) {
        let plantStartTimeList = FarmUtils.getLocalData('plantStartTimeList');
        if (!!plantStartTimeList) {
            let time = plantStartTimeList[index];
            if (time != -1) {
                return;
            } else {
                plantStartTimeList[index] = plantTime;
            }
        } else {
            plantStartTimeList = [];
            for (let i = 0; i < 9; i++) {
                plantStartTimeList.push(-1);
            }
            plantStartTimeList[index] = plantTime;
        }
        FarmUtils.setLocalData(plantStartTimeList, 'plantStartTimeList');
    },


    // 重置植物的种植时间
    resetPlantStartTime(index) {
        let plantStartTimeList = FarmUtils.getLocalData('plantStartTimeList');
        if (!!plantStartTimeList) {
            plantStartTimeList[index] = -1;
        }
        FarmUtils.setLocalData(plantStartTimeList, 'plantStartTimeList')
    },

    // 获取某植物的种植时间
    getSinglePlantTime(index) {
        let plantStartTimeList = FarmUtils.getLocalData('plantStartTimeList');
        if (!!plantStartTimeList) {
            return plantStartTimeList[index];
        } else {
            return -1;
        }
    },

    // 节点的呼吸运动
    nodeBreathAnimation(node) {
        node.active = true;
        node.stopAllActions();
        let action = cc.sequence(
            cc.scaleTo(0.2, 0.9),
            cc.scaleTo(0.4, 1.1),
            cc.scaleTo(0.2, 1),
        );
        node.runAction(action);
    },



    start() {
        this.iconWorldPos = this.node.convertToWorldSpaceAR(this.expIcon.position);
    },

    // update (dt) {},
});
