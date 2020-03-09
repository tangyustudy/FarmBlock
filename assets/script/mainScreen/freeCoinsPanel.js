// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let Utils = require('../utils');
let GameData = require('../gameData');
let Config = require('../psconfig');
const REWARD_COINS_NUM = Config.REWARD_COINS_NUM;
cc.Class({
    extends: cc.Component,

    properties: {
        number: cc.Label,
        videoEnable: cc.Node,
        videoUnable: cc.Node,
        label_timeNumber: cc.Label,
        watchVideoTimes:cc.Sprite,
        numberViewList:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.number.string = '' + REWARD_COINS_NUM;
    },

    showView(index) {
        this.index = index;
        this.node.active = true;
        this.showPromptWithScale(this.node);
        this.getCurrentDayVideoTimes();
    },

    showPromptWithScale(node) {
        node.scale = 0.2;
        node.runAction(
            cc.scaleTo(0.3, 0.9).easing(cc.easeBackOut(3))
        )
    },

    hideView() {

        this.node.active = false;
        this.unschedule(this.countDown);
    },


    videoReward() {

        cc.director.SoundManager.playSound('btnEffect');
        let callback = function (res) {
            if (!!res) {
                let freeVideoTimes = cc.sys.localStorage.getItem('freeVideoTimes');
                freeVideoTimes = parseInt(freeVideoTimes);
                freeVideoTimes -= 1;
                cc.sys.localStorage.setItem('freeVideoTimes',freeVideoTimes);
                let name = cc.director.getScene().name;
                if (name == 'mainScreen') {
                    cc.director.screenDialog.hideCoinsPanel();
                    cc.systemEvent.emit('TOOLOBTAIN', { type: 0, number: REWARD_COINS_NUM });
                }else  if (name == 'gameView') {
                    GameData.starCount += REWARD_COINS_NUM;
                    GameData.storeGameData();
                    if (this.index == 1) {
                        cc.director.dialogScript.showRetryPrompt();
                        // cc.systemEvent.emit('GAMEVIEW_TIPS',{word:'Success!'}); 
                        cc.systemEvent.emit('GAMEVIEW_COINS_OBTAIN', REWARD_COINS_NUM);
                    } else {
                        cc.director.dialogScript.hideFreeCoinsPanel();
                        cc.systemEvent.emit('GAMEVIEW_COINS_OBTAIN', REWARD_COINS_NUM);
                    }

                }else if(name=='farm'){
<<<<<<< HEAD
                    // console.log('farm scene!');
=======
                    console.log('farm scene!');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
                }

            }
        };
        let hasVideo = window.NativeManager.hasRewardVideo();
        if (!!hasVideo) {
            window.NativeManager.showRewardVideo(callback);
        } else {
            let name = cc.director.getScene().name;

            if (name == 'mainScreen') {
                cc.systemEvent.emit('TIPS_SUCCESS', { wordIndex: 0 });
            }else  if (name == 'gameView') {
                cc.systemEvent.emit('GAMEVIEW_TIPS', { wordIndex: 0 });
            }else   if(name=='farm'){
<<<<<<< HEAD
                // console.log('farm scene11111!');
=======
                console.log('farm scene11111!');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            }


          
          

        }
    },

    // 获取当天视频次数
    getCurrentDayVideoTimes() {
        let freeVideoTimes = cc.sys.localStorage.getItem('freeVideoTimes'); 
        // let freeVideoTimes = 1;
        if (!freeVideoTimes) {
            freeVideoTimes = 3;
            cc.sys.localStorage.setItem('freeVideoTimes',3);
            this.videoEnable.active=true;
            this.videoUnable.active=false;
            this.watchVideoTimes.spriteFrame = this.numberViewList[freeVideoTimes-1];
        } else {
            freeVideoTimes = parseInt(freeVideoTimes);
            if (freeVideoTimes > 0) {
                // 显示看视频的按钮
                this.videoEnable.active = true;
                this.videoUnable.active = false;
                this.watchVideoTimes.spriteFrame = this.numberViewList[freeVideoTimes-1];
            } else {
                //显示倒计时
                this.videoEnable.active = false;
                this.videoUnable.active = true;
                let currentTime = Math.floor(new Date(new Date().toLocaleDateString()).getTime() / 1000);
                this.endTime = currentTime + 86400;
                let str = Utils.countDonwTime(this.endTime);
                this.label_timeNumber.string = str;
                this.schedule(this.countDown, 1);
            }
        }
        // 将视频次数显示在


    },

    // 倒计时
    countDown() {
        let str = Utils.countDonwTime(this.endTime);
        if (!!str) {
            this.label_timeNumber.string = str;
        } else {
            this.unschedule(this.countDown);
            this.videoEnable.active = true;
            this.videoUnable.active = false;
        }
    },




    // start () {},

    // update (dt) {},
});
