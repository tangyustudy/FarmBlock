
const probabilityNum = 100;
// 概率区间
const probabilitySection = [
    [0, 5], [6, 10], [11, 26], [27, 36], [37, 41], [42, 46], [47, 57], [58, 73], [74, 79], [80, 89], [90, 94], [95, 100]
]

// 奖励列表
const rewardList = [
    { name: 'glove', number: 1 },
    { name: 'dice', number: 1 },
    { name: 'life', number: 1 },
    { name: 'coins', number: 30 },
    { name: 'hammer', number: 1 },
    { name: 'anvil', number: 1 },
    { name: 'coins', number: 120 },
    { name: 'life', number: 1 },
    { name: 'disco', number: 1 },
    { name: 'coins', number: 60 },
    { name: 'rocket', number: 1 },
    { name: 'bomb', number: 1 },
];

const delayTime = 0.5;
const circleRotation = 360;
const rewardRotation = circleRotation / probabilitySection.length;
const count = 10;

let GameData = require('../gameData');
let Utils = require('../utils');


cc.Class({
    extends: cc.Component,

    properties: {
        point: cc.Node,
        lamp1: cc.Node,
        lamp2: cc.Node,
        btn_free: cc.Node,
        btn_video: cc.Node,
        mask: cc.Node,
        timeDisplay:cc.Node,
        timeLabel:cc.Label,
        btn_lottery:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.timeCount = 0;
    },

    //  开始抽奖
    startLottery() {
        let self = this;
        this.btn_free.getComponent(cc.Button).interactable = false;
        cc.systemEvent.emit('STOP_TOUCH',{number:1});
        let randomNum = Math.floor(Math.random() * probabilityNum);
        let index;
        if(GameData.bestLevel<40){
            index = this.judgeToolIsUnlock();
        }else{
            index= this.computedRewardIndex(randomNum);
            // console.log(index);
        }
        let randomRewardRotate = 10 + Math.floor(Math.random() * 10);
        this.point.rotation = 0;
        cc.director.SoundManager.playSound('btnEffect');
        let action = cc.sequence(
            cc.rotateBy(delayTime * (index + count), circleRotation * count + index * rewardRotation + randomRewardRotate).easing(cc.easeInOut(2.5)),
            cc.callFunc(
                function () {
                    // console.log('111');
                    self.lotteryFinishedAnimation(rewardList[index]);
                    cc.director.SoundManager.playSound('lotteryBingo');
                    let zeroTime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
                    let endTime= zeroTime + 86400;
                    cc.sys.localStorage.setItem('lotteryEndTime',endTime);
                    cc.systemEvent.emit('STOP_TOUCH',{number:2});
                }
            )
        );
        this.point.runAction(action);
    },

    // 判断所抽中的道具是否已经解锁
    judgeToolIsUnlock(){
        let indexList1 = [2,3,6,7,9];
        let indexList2 = [2,3,6,7,8,9,10,11];
        let indexList3 = [0,2,3,6,7,8,9,10,11];
        let indexList4 = [0,2,3,5,6,7,8,9,10,11];
        let indexList5 = [0,2,3,4,5,6,7,8,9,10,11];
        let index;
        if(GameData.bestLevel<8){
            index = Math.floor(Math.random()*indexList1.length);
            return indexList1[index];
        }else if(GameData.bestLevel>=8 && GameData.bestLevel<9) {
            index = Math.floor(Math.random()*indexList2.length);
            return indexList2[index];
        }else if(GameData.bestLevel>=9 && GameData.bestLevel<20){
            index = Math.floor(Math.random()*indexList3.length);
            return indexList3[index];
        }else if(GameData.bestLevel>=20 && GameData.bestLevel<30){
            index = Math.floor(Math.random()*indexList4.length);
            return indexList4[index];
        }else if(GameData.bestLevel>=30 && GameData.bestLevel<40){
            index = Math.floor(Math.random()*indexList5.length);
            return indexList5[index];
        }
    },

    // 灯闪烁
    lampTwinkle() {
        this.timeCount++;
        if (this.timeCount % 2 == 0) {
            this.lamp1.active = true;
            this.lamp2.active = false;
        } else {
            this.lamp1.active = false;
            this.lamp2.active = true;
        }
    },

    // 根据随机数区间确定index
    computedRewardIndex(number) {
        for (let i = 0; i < probabilitySection.length; i++) {
            let item = probabilitySection[i];
            if (number >= item[0] && number <= item[1]) {
                return i;
            }
        }
    },


    showView() {
        this.schedule(this.lampTwinkle, 0.2);
        // 转盘进入动画
        let deviceSize = cc.view.getVisibleSize();
        this.node.position = cc.v2(0, (this.node.height + deviceSize.height) / 2);
        this.node.active = true;
        this.lotteryFadeIn();
        this.setEndTime();
    },


    // 抽奖转盘出现
    lotteryFadeIn() {
        this.point.rotation = 0;
        cc.director.SoundManager.playSound('lotteryIn');
        this.node.runAction(
            cc.moveTo(1, cc.v2(0,0)).easing(cc.easeBackInOut(3.0))
        )
    },

    //抽奖转盘的消失 
    lotteryFadeOut() {
        let self = this;
        let deviceSize = cc.view.getVisibleSize();
        cc.director.SoundManager.playSound('lotteryOut');
        this.node.runAction(
            cc.sequence(
                cc.moveTo(0.5, cc.v2(0, (this.node.height + deviceSize.height) / 2)),
                cc.callFunc(
                    function () {
                        self.node.active = false;
                        self.mask.active = false;
                    }
                )
            )
        )
    },

    // 抽奖成功后的动画
    lotteryFinishedAnimation(item) {
        let type;
        if (item.name == 'rocket') {
            type = 1;
        } else if (item.name == 'bomb') {
            type = 2;
        } else if (item.name == 'disco') {
            type = 3
        } else if (item.name == 'glove') {
            type = 4
        } else if (item.name == 'anvil') {
            type = 5;
        } else if (item.name == 'hammer') {
            type = 6;
        } else if (item.name == 'dice') {
            type = 7;
        } else if (item.name == 'coins') {
            type = 0;
        } else if (item.name = 'life') {
            GameData.lifeNumber += 1;
            GameData.storeGameData();
            this.hideView();
            this.scheduleOnce(
                function () {
                    cc.systemEvent.emit('HEART_ANIMA');
                }, 0.4
            )
            return;
        }
        this.hideView();
        this.scheduleOnce(
            function () {
                cc.systemEvent.emit('LOTTERY_FINISHED', {
                    type: type,
                    number: item.number
                })
            }, 0.4
        )


    },

    // 显示抽奖剩余时间
    timeDowmCount() {
        let label = Utils.countDonwTime(this.endTime);
        if (!label) {
            this.unschedule(this.timeDowmCount);
            this.btn_free.active=true;
            this.btn_free.getComponent(cc.Button).interactable = true;
            this.timeDisplay.active = false;
            return;
        }
        this.timeLabel.string = label;
    },


    // 获得当天剩余时间
    setEndTime(){
        let local = cc.sys.localStorage.getItem('lotteryEndTime');
        let endTime ;
        if(!local){ 
            this.btn_free.active=true;
            this.btn_free.getComponent(cc.Button).interactable = true;
            this.timeDisplay.active = false;
        }else{
            endTime = parseInt(local);
            this.endTime = endTime;
            let currentTime = Math.floor(new Date().getTime()/1000);
            if(currentTime - endTime >=0){
                this.btn_free.active=true;
                this.btn_free.getComponent(cc.Button).interactable = true;
                this.timeDisplay.active = false;
            }else{
                this.btn_free.active=false;
                this.timeDisplay.active = true;
                this.schedule(this.timeDowmCount,1);
            }
        }
        
    },



    hideView() {
        cc.director.SoundManager.playSound('btnEffect');
        this.unschedule(this.lampTwinkle);
        this.unschedule(this.timeDowmCount);
        this.lotteryFadeOut();
        // this.node.active = false;
        this.stopLotteryIconAnima();
    },


    // 停止转盘按钮的动画
    stopLotteryIconAnima(){
        this.btn_lottery.getComponent(cc.Animation).stop('lotteryIconAnima');
    },



    start() {
        // this.startLottery();
    },

    // update (dt) {},
});
