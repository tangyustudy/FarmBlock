

let GameData = require('../gameData');
let Utils = require('../utils');
// 回复生命的时间间隔
const lifeInterval = 3600;
const maxLife = 6;
cc.Class({
    extends: cc.Component,

    properties: {
        lifeNumber: cc.Label,
        coinsNumber: cc.Label,
        lifeDisplay: cc.Node,
        timeDisplay: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('UPDATE_COINS', this.changeCoinsNumber, this);
        cc.systemEvent.on('UPDATE_LIFE', this.changeLifeNumber, this);
        cc.systemEvent.on('UPDATE_TIME_LABEL', this.changeLifeNumber, this);
       
    },

    // 改变金币的数量
    changeCoinsNumber() {
        let data = GameData.getGameData();
        this.coinsNumber.string = data.starCount + '';
    },

    // 改变生命数量
    changeLifeNumber() {
        let data = GameData.getGameData();
        if (data.lifeNumber > 0) {
            this.lifeNumber.string = data.lifeNumber + '';
            this.lifeDisplay.active = true;
            this.timeDisplay.active = false;
        } else {
            this.lifeDisplay.active = false;
            this.timeDisplay.active = true;
        }
        // console.log(data,'50');
        let isScheduled = cc.director.getScheduler().isScheduled(this.timeDowmCount, this);
        if (!isScheduled && data.lifeNumber < maxLife) {
            this.timeCount();
            cc.systemEvent.emit('TIME_COUNT_FUNC');
        }

    },

    // 改变计时显示
    changeTimeLabel(event) {
        // console.log(this.timeDisplay.active);
        if (!this.timeDisplay.active) {
            return;
        }
        let str = event.str;
        this.timeDisplay.getComponent(cc.Label).string = str;
    },

    // // 倒计时
    timeCount() {
        if (GameData.lifeNumber < maxLife) {
            let endTime = cc.sys.localStorage.getItem('costTime');
            if (!!endTime) {
                endTime = parseInt(endTime) + lifeInterval;
            } else {
                endTime = Math.floor(new Date().getTime() / 1000) + lifeInterval;//todo
                cc.sys.localStorage.setItem('restTime', endTime);
            }

            this.time = endTime;
            this.timeDowmCount();
            this.schedule(this.timeDowmCount, 1);
        } else {
            let data = GameData.getGameData();
            this.lifeNumber.string = '' + data.lifeNumber;
        }

    },

    timeDowmCount() {

        let label = Utils.countDonwTime(this.time);
        if (!label) {
            this.unschedule(this.timeDowmCount);
            return;
        }
        this.timeDisplay.getComponent(cc.Label).string = label;
    },


    // 重新上线玩游戏时 心的数量

    loadNextTime() {
        let current = Math.floor(new Date().getTime() / 1000);
        // 开始消耗生命的时间
        let costTime = cc.sys.localStorage.getItem('costTime');
        let endTime;
        if (!!costTime) {
            costTime =parseInt(costTime)
            // console.log(GameData.lifeNumber);
            if (maxLife - GameData.lifeNumber < 0) {
                cc.systemEvent.emit('UPDATE_LIFE');
                cc.systemEvent.emit('UPDATE_COINS');
                return;
            } else {
                endTime = costTime + (maxLife - GameData.lifeNumber) * lifeInterval;
            }

            if (current - endTime <= 0) {
               
                let count = Math.floor((current - costTime) / lifeInterval);
                count>=0 ? count : 0;
                GameData.lifeNumber += count;
                //生命值改变，提交更新后的数据
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                costTime = (count * lifeInterval) + parseInt(costTime);
                GameData.storeGameData();
                cc.sys.localStorage.setItem('costTime', costTime);
                cc.systemEvent.emit('UPDATE_LIFE');
                cc.systemEvent.emit('UPDATE_COINS');
                return;
            } else {
              
                let data = GameData.getGameData();
                if(data.lifeNumber>maxLife){
                    GameData.lifeNumber = data.lifeNumber;
                }else{
                    GameData.lifeNumber = maxLife;
                    GameData.storeGameData();
                }   
                //生命值改变，提交更新后的数据
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                cc.sys.localStorage.removeItem('costTime');
            }

        } else {
            let data = GameData.getGameData();
            if(data.lifeNumber>maxLife){
                GameData.lifeNumber = data.lifeNumber;
            }else{
                GameData.lifeNumber = maxLife;
            }   
            //生命值改变，提交更新后的数据
            GameData.storeGameData();
            window.NativeManager.reportLifeChanged(GameData.lifeNumber);

        }
        cc.systemEvent.emit('UPDATE_LIFE');
        cc.systemEvent.emit('UPDATE_COINS');
    },



    start() {
        this.loadNextTime();
        this.changeLifeNumber();
        // console.log(GameData.lifeNumber,'140');
    },

    // update (dt) {},
});
