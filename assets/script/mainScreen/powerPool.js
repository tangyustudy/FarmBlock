// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils');
let GameData = require('../gameData');
const lifeCost = 60;
const lifeInterval = 3600;
const MaxLife = 6;

cc.Class({
    extends: cc.Component,

    properties: {
        l_TimeCount: cc.Label,
        heart: cc.Node,
        fill_pic: cc.Node,
        timeNode: cc.Node,
        btn_viode: cc.Node,
        btn_share: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    timeCount() {
        if (GameData.lifeNumber < MaxLife) {
            this.fill_pic.active = false;
            this.timeNode.active = true;
            let endTime = cc.sys.localStorage.getItem('costTime');
            if (!!endTime) {
                endTime = parseInt(endTime) + lifeInterval;
            } else {
                endTime = Math.floor(new Date().getTime() / 1000) + lifeInterval;//todo
                cc.sys.localStorage.setItem('costTime', endTime);
            }

            this.time = endTime;
            this.timeDowmCount();
            this.schedule(this.timeDowmCount, 1);
        } else {
            // this.fill_pic.active = true;
            // this.timeNode.active = false;
            this.lifeFull();
        }

    },

    // 生命满了后的操作
    lifeFull(){
        this.fill_pic.active=true;
        this.timeNode.active=false;
    },



    timeDowmCount() {

        let label = Utils.countDonwTime(this.time)
        if (!label) {
            this.unschedule(this.timeDowmCount);
            if (GameData.lifeNumber < MaxLife) {
                cc.sys.localStorage.removeItem('restTime');
                cc.systemEvent.emit('UPDATE_LIFE');

            }
            this.timeCount();
            return;
        }

        this.l_TimeCount.string = label;

    },



    showView() {

        this.node.active = true;
        this.timeCount();
        Utils.showPromptWithScale(this.node);
        // this.controlBtnShow();
    },

    hideView() {
        this.node.active = false;
        this.unschedule(this.timeDowmCount);
    },


    controlBtnShow() {
        let hasVideo = window.NativeManager.hasRewardVideo();
        if(!hasVideo){
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.btn_viode.active = false;
                this.btn_share.active = true;
            } else {
                this.btn_viode.active = true;
                this.btn_share.active = false;
            }
        }else{
            this.btn_viode.active = true;
            this.btn_share.active = false;
        }
        
    },





    // 看视频增加生命
    addLifeNumberByVideo() {
        let self=this;
        if (GameData.lifeNumber >= MaxLife) {
            cc.systemEvent.emit('TIPS_SUCCESS', {
                wordIndex: 1
            });
            return;
        }
        cc.director.SoundManager.playSound('btnEffect');
        let callback = function (res) {
            if (!!res) {
                if(GameData.lifeNumber<0){
                    GameData.lifeNumber=0;
                }
                GameData.lifeNumber += 1;
                GameData.storeGameData();
                // cc.systemEvent.emit('UPDATE_LIFE');
                if (GameData.lifeNumber <= MaxLife) {
                    let wp = self.heart.parent.convertToWorldSpaceAR(self.heart);
                    // GameData.lifeNumber += 1;
                    //生命值改变，提交更新后的数据
                    window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                    cc.systemEvent.emit('HEART_ANIMA', {
                        pos: wp,
                        type: 2,
                    });
                    if(GameData.lifeNumber==MaxLife){
                        self.scheduleOnce(function(){
                            self.lifeFull();
                        },0.5)
                    }
                }

            }
        }
        let hasVideo = window.NativeManager.hasRewardVideo();
        if (!!hasVideo) {
            window.NativeManager.showRewardVideo(callback);
        } else {
            cc.systemEvent.emit('TIPS_SUCCESS', {
                wordIndex: 0
            });
        }
    },


    // 分享补满生命
    fullLifeNumberByShare() {
        let self=this;
        if (GameData.lifeNumber >= MaxLife) {
            cc.systemEvent.emit('TIPS_SUCCESS', {
                wordIndex: 1
            });
            return;
        }
        cc.director.SoundManager.playSound('btnEffect');
        let callback = function (res) {
            if (!!res) {
                let wp = self.heart.parent.convertToWorldSpaceAR(self.heart);
                GameData.lifeNumber = MaxLife;
                GameData.storeGameData();
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                cc.systemEvent.emit('HEART_ANIMA', {
                    pos: wp,
                    type: 2,
                });
            }
        }
        window.NativeManager.goShare(callback);
    },




    // 使用金币购买生命生命
    buyLifeByCoins() {
        let self=this;
        if (GameData.starCount >= 100 ) {
            if (GameData.lifeNumber < MaxLife) {
                if(GameData.lifeNumber<0){
                    GameData.lifeNumber=0;
                };
                GameData.starCount -= 100;
                GameData.lifeNumber += 1;
                //生命值改变，提交更新后的数据
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                GameData.storeGameData();
                cc.systemEvent.emit('UPDATE_COINS');
                cc.director.SoundManager.playSound('btnEffect');
                let wp = this.heart.parent.convertToWorldSpaceAR(this.heart);
                cc.systemEvent.emit('HEART_ANIMA', {
                    pos: wp,
                    type: 2,
                });
                if(GameData.lifeNumber==MaxLife){
                    self.scheduleOnce(function(){
                        self.lifeFull();
                    },0.5)
                }
            } else {
                // 提示生命已经满了！！
                cc.systemEvent.emit('TIPS_SUCCESS', {
                    wordIndex: 1,
                });

            }
        } else {
            if(GameData.lifeNumber>=MaxLife){
                cc.systemEvent.emit('TIPS_SUCCESS', {
                    wordIndex: 1,
                });
            }else{
                cc.director.screenDialog.showCoinsPanel();
            }
            
        }


    },


    // 加满生命
    fillLifeNumber() {
        cc.director.SoundManager.playSound('btnEffect');
        if (GameData.lifeNumber < MaxLife) {
            let wp = this.heart.parent.convertToWorldSpaceAR(this.heart);
            cc.systemEvent.emit('HEART_ANIMA', {
                pos: wp,
                type: 1,
            });

        }
    },



    start() {

    },

    // update (dt) {},
});
