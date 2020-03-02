let Utils = require('../utils');
let GameData = require('../gameData');
let Config = require('../psconfig');
cc.Class({
    extends: cc.Component,

    properties: {
        target: require('../component/target'),
        // timeCount: cc.Label,
        // btn_continue_coins: cc.Node,
        // btn_continue_video: cc.Node,
        coinsNumber: cc.Label,
        icon_fiveStep: cc.Node,
        icon_plus: cc.Node,
        icon_rocket: cc.Node,
        icon_bomb: cc.Node,
        icon_disco: cc.Node,
        view_txt_step: cc.Node,
        view_txt_stepAndTool: cc.Node,


    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 隐藏所有的icon
    hideAllIcon() {
        this.icon_fiveStep.active = false;
        this.icon_plus.active = false;
        this.icon_rocket.active = false;
        this.icon_bomb.active = false;
        this.icon_disco.active = false;
        this.view_txt_step.active = false;
        this.view_txt_stepAndTool.active = false;

    },


    showView() {
        // this.timeNum = 10;
        // this.timeCount.string = this.timeNum + '';
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        this.hideAllIcon();
        if (!this.continueTimes) {
            this.continueTimes = 1;
        } else {
            if (this.continueTimes < Config.continueCostList.length - 1) {
                this.continueTimes += 1;
            } else {
                this.continueTimes = Config.continueCostList.length - 1;
            }


        }
        this.changeViewByTimes(this.continueTimes);
        // this.buttonControl();
        // this.schedule(this.downTimeCount, 1);
    },

    hideView(tag) {
        this.node.active = false;
        if (!!tag) {
            return;
        } else {
            if (GameData.lifeNumber > 1) {
                cc.director.dialogScript.showRetryPrompt();
            } else {
                GameData.lifeNumber -= 1;
                //生命值改变，提交更新后的数据
                window.NativeManager.reportLifeChanged(GameData.lifeNumber);
                GameData.storeGameData();
                cc.director.loadScene('interface');
                cc.director.jumpCode = 2;
            }
        }
        this.unschedule(this.downTimeCount);
    },

    // 按钮控制
    buttonControl() {
        let hasVideo = window.NativeManager.hasRewardVideo();
        if (!!hasVideo) {
            this.btn_continue_video.active = true;
        } else {
            this.btn_continue_video.active = false;
        }
        this.btn_continue_coins.active = !this.btn_continue_video.active;
    },


    addGameStepByCoins() {
        let cost,list;
        if (!!this.continueTimes) {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            cost = Config.continueCostList[this.continueTimes - 1];
            if(this.continueTimes==2){
                list = [1,0,0];
            }else if(this.continueTimes==3){
                list = [1,1,0]
            }else if(this.continueTimes==4){
                list = [1,1,1];
            }else if(this.continueTimes==1){
                list = [0,0,0];
            }
          
        } else {
            cost = Config.continueCostList[0];
        }

        if (GameData.starCount >= cost) {
            this.unschedule(this.downTimeCount);
            cc.director.dialogScript.hideAllChildrenNode();
            this.hideView(1);
            this.addMovesEffect();
            cc.director.container.addGameToolToContainer(list,true);
            if (!!cc.director.container.target.isGameEnd) {
                cc.director.container.target.isGameEnd = false;
            };
            cc.systemEvent.emit('REDUCE_COINS_ANIMATION', { cost: cost });
        } else {
            cc.systemEvent.emit('GAMEVIEW_TIPS', { wordIndex: 2 });
        }

    },

    // 增加游戏步数
    addGameStepByVideo() {

        let self = this;
        let callback = function (res) {
            if (!!res) {
                self.unschedule(self.downTimeCount);
                cc.director.dialogScript.hideAllChildrenNode();
                self.hideView(1);
                self.addMovesEffect();
                if (!!cc.director.container.target.isGameEnd) {
                    cc.director.container.target.isGameEnd = false;
                };
            }
        }

        let hasVideo = window.NativeManager.hasRewardVideo();
        if (!!hasVideo) {
            window.NativeManager.showRewardVideo(callback);
        } else {
            cc.systemEvent.emit('GAMEVIEW_TIPS', { wordIndex: 0 });
        }

    },

    // 倒计时
    downTimeCount() {
        if (this.timeNum > 1) {
            this.timeNum--;
            this.timeCount.string = this.timeNum + '';
            cc.director.SoundManager.playSound('timeCount');
        } else {
            this.unschedule(this.downTimeCount);
            // console.log('这时候改增加步数了。')
            cc.director.dialogScript.hideAllChildrenNode();
            this.hideView(0);
            // this.addMovesEffect();
        }

    },


    // 步数增加特效
    addMovesEffect() {
        let node = this.target.step.node;
        let wp = node.parent.convertToWorldSpaceAR(node.position);
        cc.systemEvent.emit('MOVE_ADD', {
            pos: wp
        });
    },



    // 根据复活次数的不一样调整布局
    changeViewByTimes(index) {
        this.coinsNumber.string = Config.continueCostList[index-1] + '';
        switch (index) {
            // 步数
            case 1:
                this.icon_fiveStep.active = true;
                this.icon_fiveStep.position = cc.v2(0, 0);
                this.view_txt_step.active = true;
                break;
            // 步数 + 火箭
            case 2:
                this.icon_fiveStep.active = true;
                this.icon_fiveStep.position = cc.v2(-150, 0);
                this.icon_plus.active = true;
                this.view_txt_stepAndTool.active = true;
                this.icon_rocket.active = true;
                this.icon_rocket.scale = 1.5;
                this.icon_rocket.position = cc.v2(0, 0);
                break;

            // 步数 + 火箭 + 炸弹
            case 3:
                this.icon_fiveStep.active = true;
                this.icon_fiveStep.position = cc.v2(-150, 0);
                this.icon_plus.active = true;
                this.view_txt_stepAndTool.active = true;
                this.icon_rocket.active = true;
                this.icon_rocket.scale = 1;
                this.icon_rocket.position = cc.v2(-54.5,-10);
                this.icon_bomb.active = true;
                this.icon_bomb.position = cc.v2(54.5, -10);
                break;

            // 步数 +火箭 + 炸弹 + disco
            case 4:
                this.icon_fiveStep.active = true;
                this.icon_plus.active = true;
                this.icon_fiveStep.position = cc.v2(-150, 0);
                this.view_txt_stepAndTool.active = true;
                this.icon_rocket.active = true;
                this.icon_rocket.scale = 1;
                this.icon_rocket.position = cc.v2(-54.5, -52.5);
                this.icon_bomb.active = true;
                this.icon_bomb.position = cc.v2(54.5, -52.5);
                this.icon_disco.active = true;
                this.icon_disco.position = cc.v2(0, 42);
                break;

            //  步数 +火箭 + 炸弹 + disco*2
            case 5:
                break;

            //  步数 +火箭 + 炸弹 + disco*3
            case 6:
                break;
        }

        // index=1
        // if(index==1){

        // }else if(index==2){

        // }else if(index==3){

        // }else if(index)


    },





    start() {

    },

    // update (dt) {},
});
