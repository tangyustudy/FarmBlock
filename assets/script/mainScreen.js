
let Utils = require('./utils');
let GameData = require('./gameData');


cc.Class({
    extends: cc.Component,

    properties: {

        hitFlower: cc.Prefab,

        // levelDisplay:cc.Node,
        lifeNumber: cc.Label,
        coinNumber: cc.Label,
        pinkLevel: cc.Label,
        blueStarNum: cc.Label,
        starProgressBar: cc.ProgressBar,

        nextStage: cc.Label,
        // timeDisplay:cc.Label,

        // pinkBox:cc.Node,
        levelNode: cc.Node,
        pinkNode: cc.Node,
        pink_open: cc.Node,

        // blueBox:cc.Node,
        starBar: cc.Node,
        blueNode: cc.Node,
        blue_open: cc.Node,

        boxArea: cc.Node,
        // testPrefab:cc.Prefab,

        squirrelsList: [cc.Node],

        blueBox: cc.Node,
        pinkBox: cc.Node,
        needMoveArea: cc.Node,

        screenMask: cc.Node,

        btn_lottery: cc.Node,

        butterFly: cc.Prefab,

        btn_farmEnter: cc.Node,
        list_farmEnter: [cc.SpriteFrame],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.director.preloadScene('gameView');
        this.life = 5;
        this.init();
        cc.systemEvent.on('FINISHEDCOLLECT', this.finishedCollectEffect, this);
        cc.director.SoundManager = require('./SoundManager');
        cc.director.SoundManager.init();
        this.excuteSquirrelsAnimation();
        cc.systemEvent.on('STOP_TOUCH', this.stopTouchOperate, this);


    },





    //  阻隔触摸操作
    stopTouchOperate(event) {
        let num = event.number;
        if (num == 1) {
            this.screenMask.active = true;
        } else if (num == 2) {
            this.screenMask.active = false;
            if (GameData.bestLevel > 0 && GameData.bestLevel % 5 == 0) {
                let local = cc.sys.localStorage.getItem('gameEvaluation');
                if (!local) {
                    let evaLevel = cc.sys.localStorage.getItem('evaluationLevel');
                    if (!evaLevel) {
                        cc.director.screenDialog.showGameEvaluation(2);
                        cc.sys.localStorage.setItem('evaluationLevel', JSON.stringify(GameData.bestLevel));
                    } else {
                        evaLevel = JSON.parse(evaLevel);
                        if (evaLevel < GameData.bestLevel) {
                            cc.director.screenDialog.showGameEvaluation(2);
                            cc.sys.localStorage.setItem('evaluationLevel', JSON.stringify(GameData.bestLevel));
                        }
                    }

                }

            }

            if (GameData.bestLevel == 4) {
                // todo
                let local = cc.sys.localStorage.getItem('lotteryGuide01');
                if (!local) {
                    cc.systemEvent.emit('LOTTERY_GUIDE');
                }
            }
        }
    },



    // 执行松鼠动画
    excuteSquirrelsAnimation() {

        for (let i = 0; i < this.squirrelsList.length; i++) {
            let item = this.squirrelsList[i];
            let anima = item.getComponent(cc.Animation);
            anima.play('squirrels' + (i + 1));
        }

    },


    init() {
        // this.hitFlowerPool = new cc.NodePool();
        // for(let i=0;i<4;i++){
        // }
    },

    // 显示宝箱
    showBoxArea() {
        if (GameData.bestLevel < 1) {
            this.boxArea.active = false;
        } else {
            this.boxArea.active = true;
        }
    },



    // 初始化主页面的数据

    initMainScreenData(data) {
        this.updateLifeNumber(data.lifeNumber);
        this.updateCoinNumber(data.starCount);
    },

    // 更新生命数据
    updateLifeNumber(num) {
        if (num > 0) {
            this.lifeNumber.string = num + '';
        } else {
            this.levelDisplay.active = false;
            this.timeDisplay.node.active = true;
            // this.timeCount();
        }
    },

    // 更新金币数量
    updateCoinNumber(coin) {
        this.coinNumber.string = coin + '';
    },


    // 更新红色的箱子的 等级
    updateNextOpenLevel() {

        let nextLevel = Math.floor((GameData.bestLevel) / 10) * 10 + 10;
        this.pinkLevel.string = nextLevel + '';
        let isGet = cc.sys.localStorage.getItem('isGet');
        if (GameData.bestLevel != 0 && GameData.bestLevel % 10 == 0 && !isGet) {
            let times = cc.sys.localStorage.getItem('pinkMark');
            if (!times) {
                times = 0;
            } else {
                times = JSON.parse(times);
            }
            times++;
            cc.sys.localStorage.setItem('pinkMark', JSON.stringify(times));
            cc.sys.localStorage.setItem('isGet', 'yes');
        } else {
            this.controlChildNode(this.pinkNode, 'levelNode', 1);
            this.controlChildNode(this.pinkNode, 'open', 2);
            this.pinkNode.getComponent(cc.Button).interactable = false;
            // this.pinkNode.stopAllActions();
            this.boxResumeOrigin(this.pinkBox);
        }
        let pinkMark = cc.sys.localStorage.getItem('pinkMark');
        if (!!pinkMark && JSON.parse(pinkMark) > 0) {
            this.BoxOpenEffect(this.pinkBox);
            this.controlChildNode(this.pinkNode, 'levelNode', 2);
            this.controlChildNode(this.pinkNode, 'open', 1);
            this.pinkNode.getComponent(cc.Button).interactable = true;
        }

    },


    // 更新蓝色箱子的数据 
    updateBlueBoxStarNumber(num) {

        if (!num) {
            this.blueStarNum.node.parent.active = true;
            this.blueStarNum.string = GameData.currentStar + '';
            this.starProgressBar.progress = GameData.currentStar >= 20 ? 1 : GameData.currentStar / 20;
            this.controlChildNode(this.blueNode, 'starBar', 1);
            this.controlChildNode(this.blueNode, 'open', 2);
            this.blueNode.getComponent(cc.Button).interactable = false;
            // this.blueNode.stopAllActions();
            this.boxResumeOrigin(this.blueBox);
            if (GameData.currentStar >= 20) {
                // 隐藏进度条，宝箱居中，宝箱跳动，整个板块开始缩放。
                cc.sys.localStorage.setItem('blueMark', 'yes');
                this.blueStarNum.node.parent.active = false;
            }
        } else {

            GameData.currentStar += Math.abs(num);
            this.blueStarNum.string = GameData.currentStar + '';
            this.starProgressBar.progress = GameData.currentStar >= 20 ? 1 : GameData.currentStar / 20;
            if (GameData.currentStar >= 20) {
                // 隐藏进度条，宝箱居中，宝箱跳动，整个板块开始缩放。
                cc.sys.localStorage.setItem('blueMark', 'yes');
                this.blueStarNum.node.parent.active = false;
                // GameData.currentStar = 0;
                let isFirstUnlock = cc.sys.localStorage.getItem('isFirstUnlock');
                if (!!isFirstUnlock) {
                    return;
                } else {
                    cc.sys.localStorage.setItem('isFirstUnlock', 'yes');
                    this.setFarmEnterBtn();
                }
            } else {
                this.blueStarNum.node.parent.active = true;
                this.controlChildNode(this.blueNode, 'starBar', 1);
                this.controlChildNode(this.blueNode, 'open', 2);
                this.blueNode.getComponent(cc.Button).interactable = false;
                // this.blueNode.stopActionByTag(1);
            }
        }
        let blueMark = cc.sys.localStorage.getItem('blueMark');
        if (!!blueMark && blueMark == 'yes') {
            this.BoxOpenEffect(this.blueBox);
            this.controlChildNode(this.blueNode, 'starBar', 2);
            this.controlChildNode(this.blueNode, 'open', 1);
            this.blueNode.getComponent(cc.Button).interactable = true;
        }

        // this.BoxOpenEffect(this.blueBox);

    },

    // 控制子节点开关
    controlChildNode(node, name, type) {
        let child = node.getChildByName(name);
        if (!!child) {
            if (type == 1) {
                child.active = true;
            } else {
                child.active = false;
            }
        }
    },


    //箱子的可打开效果
    BoxOpenEffect(node) {
        // Utils.nodeScale(node, 0.95, 1, 0.7, -1);
        // let action = cc.sequence(
        //     cc.scaleTo(0.7,0.95),
        //     cc.scaleTo(0.7,1)
        // ).repeatForever();
        // this.boxLightEfect(node, 1);
        let action = cc.sequence(
            cc.spawn(
                cc.rotateTo(1, -10),
                cc.jumpBy(1, cc.v2(0, 0), 10, 1),
            ),
            cc.spawn(
                cc.rotateTo(1, 10),
                cc.jumpBy(1, cc.v2(0, 0), 10, 1),
            )
        ).repeatForever();

        action.tag = 1;
        node.runAction(action);
    },

    // 箱子的光效果
    boxLightEfect(node, type) {
        let light = node.parent.getChildByName('boxLight');
        if (type == 1) {
            light.active = true;
            light.runAction(
                cc.rotateBy(2, 90).repeatForever()
            )
        }
        if (type == 2) {
            light.stopAllActions();
            light.active = false;
        }
    },


    // 箱子回复到开始状态
    boxResumeOrigin(node) {
        node.stopAllActions();
        node.scale = 1;
        node.rotation = 0;
        node.position = cc.v2(0, 0);
        // this.boxLightEfect(node, 2);
    },

    // 退回到主界面的时候，显示收集星星的特效，

    collectStar() {
        // let starNum = 3;
    },

    // 星星收集成功的特效
    finishedCollectEffect() {

        let self = this;
        let hitFlower = cc.instantiate(this.hitFlower);
        hitFlower.parent = this.blueNode;
        let particle = hitFlower.getComponent(cc.ParticleSystem);
        particle.resetSystem();
        this.blueNode.runAction(
            cc.sequence(
                cc.scaleTo(0.2, 1.05),
                cc.scaleTo(0.2, 1),
                cc.callFunc(function () {
                    self.updateBlueBoxStarNumber(1);
                })
            )
        );
    },




    systemLoginTimes() {

        // 是否显示每日奖励按钮
        let dailyIcon = this.needMoveArea.getChildByName('dailyBouns');
        if (GameData.bestLevel > 1) {
            dailyIcon.active = true;
        } else {
            dailyIcon.active = false;
        }


        let isNewDay = Utils.isNewDay();
        if (!!isNewDay) {
            this.isContinueLogin();
            cc.sys.localStorage.removeItem('freeVideoTimes');
            cc.sys.localStorage.removeItem('getReward');
            let dailyBouns = cc.director.screenDialog.dailyBouns;
            let index = dailyBouns.judgeIsCurrentDay();
            dailyBouns.updateBouns_coundGet(index);
            this.playSignAnimation(dailyIcon);
        } else {
            let hadGet = cc.sys.localStorage.getItem('getReward');
            if (!!hadGet) {
                // dailyIcon.stopAllActions();
                // this.playSignAnimation(dailyIcon);
                return;
            } else {
                //每日签到按钮呼吸
                // dailyIcon.runAction(
                //     cc.sequence(
                //         cc.scaleTo(0.5, 0.95),
                //         cc.scaleTo(0.5, 1.05),
                //     ).repeatForever()
                // );
                this.playSignAnimation(dailyIcon);
            }
        }
    },

    // 是否播放签到动画
    playSignAnimation(node) {
        let anima = node.getComponent(cc.Animation);
        anima.play('dailyIconAnima');
    },


    // 是否连续登陆
    isContinueLogin() {

        let getBounsTime = cc.sys.localStorage.getItem('getBounsTime');
        let currentZeroTime = Math.floor(new Date(new Date().toLocaleDateString()).getTime() / 1000);
        if (!!getBounsTime) {
            let continueTimes = cc.sys.localStorage.getItem('continueTimes');
            continueTimes = !!continueTimes ? JSON.parse(continueTimes) : 0;
            if (continueTimes >= 7) {
                cc.sys.localStorage.removeItem('continueTimes');
                cc.sys.localStorage.removeItem('bounsList');
                cc.sys.localStorage.removeItem('sevenReward');
            } else {
                getBounsTime = JSON.parse(getBounsTime);
                if (!getBounsTime < currentZeroTime && currentZeroTime - getBounsTime != 86400) {
                    cc.sys.localStorage.removeItem('continueTimes');
                    cc.sys.localStorage.removeItem('bounsList');
                    cc.sys.localStorage.removeItem('sevenReward');
                }
            }

        }

    },


    // 判断手机是否存在刘海
    judgeHasHair() {
        let hasHair = window.NativeManager.hasPhoneHair();
        if (!!hasHair) {
            this.moveNeedMoveArea();
        }
    },

    moveNeedMoveArea() {
        let widget = this.needMoveArea.getComponent(cc.Widget);
        // console.log(widget);
        widget.top = 80;
    },

    // 是否显示抽奖按钮
    isShowLotteryBtn() { //hasChanged_11.13
        if (GameData.bestLevel > 4) {
            this.btn_lottery.active = true;
            // this.playLotteryIconAnima(this.btn_lottery);
            this.isLotteryEnable();
        } else if (GameData.bestLevel < 4) {
            this.btn_lottery.active = false;
        }
    },

    // 判断是否显示抽奖动画
    isLotteryEnable() {//hasChanged_11.13
        let local = cc.sys.localStorage.getItem('lotteryEndTime');
        let endTime;
        if (!local) {
            this.scheduleOnce(function () {
                this.playLotteryIconAnima(this.btn_lottery);
            }, 2.8);

        } else {
            endTime = parseInt(local);
            this.endTime = endTime;
            let currentTime = Math.floor(new Date().getTime() / 1000);
            if (currentTime - endTime >= 0) {
                this.scheduleOnce(function () {
                    this.playLotteryIconAnima(this.btn_lottery);
                }, 2.8);
            }
        }
    },


    // 显示抽奖动画
    playLotteryIconAnima(node) {//hasChanged_11.13
        let anima = node.getComponent(cc.Animation);
        anima.play('lotteryIconAnima');
    },


    // 添加蝴蝶飞动动画
    butterFlyMoveAnimation() {
        let butterFly = cc.instantiate(this.butterFly);
        let anima = butterFly.getComponent(cc.Animation);
        anima.play('butterFly');
        // getChildByName('needMoveArea').
        butterFly.parent = this.node.getChildByName('animal');
        this.butterFlyAnimaiton(butterFly);
    },

    // 蝴蝶运动
    butterFlyAnimaiton(node) {
        let width = node.parent.width;
        let startPos = cc.v2(width / 2, 50);
        let endPos = cc.v2(-width / 2, -50);
        node.position = startPos;
        let action = cc.sequence(
            cc.callFunc(function () {
                node.rotation = 0;
            }),
            cc.moveTo(10, endPos),
            cc.callFunc(function () {
                node.rotation = 270;
            }),
            cc.moveTo(10, startPos),
        ).repeatForever();

        node.runAction(action);

    },



    // 调试按钮
    debugBtn() {
        // changeGameTool(protoName, number, type, addOrSub)
        for (let i = 0; i < 4; i++) {
            GameData.changeGameTool('playerTool', 10, i, true);
        }
        GameData.starCount += 10000;
    },


    // 跳转到农场
    jumpToFarm() {
        if (cc.director.gameLoadingSuccess) {

            cc.systemEvent.emit('IN_COULD_ANIMA');
            this.scheduleOnce(function () {
                cc.director.loadScene('farm');
            }, 1)
        } else {
            console.log('sorry,please later!');
        }

    },

    isShowCloud() {
        // console.log(cc.director.sceneMsg,'ddddddddddddddddd');
        if (!!cc.director.sceneMsg && cc.director.sceneMsg == 'farm') {
            cc.systemEvent.emit('OUT_COULD_ANIMA');
            cc.director.sceneMsg = 'mainScreen';
        }
    },





    setFarmEnterBtn() {
        let isFirstUnlock = cc.sys.localStorage.getItem('isFirstUnlock');
        // let currentLevel = GameData.bestLevel;
        // if (!!isFirstUnlock || currentLevel >= 8) {
            this.btn_farmEnter.getComponent(cc.Sprite).spriteFrame = this.list_farmEnter[0];
            this.btn_farmEnter.getComponent(cc.Button).interactable = true;
        // } else {
        //     this.btn_farmEnter.getComponent(cc.Sprite).spriteFrame = this.list_farmEnter[1];
        //     this.btn_farmEnter.getComponent(cc.Button).interactable = false;
        // }
    },



    start() {


        Utils.resize();
        // this.loadLocalData();
        this.setFarmEnterBtn();

        this.updateNextOpenLevel();
        this.updateBlueBoxStarNumber();
        this.showBoxArea();

        if (GameData.passRate >= 1) {
            if (GameData.bestLevel >= 1) {
                cc.systemEvent.emit('STOP_TOUCH', { number: 1 });
                cc.systemEvent.emit('STARANIMA', {
                    passRate: GameData.passRate,
                });
            }
            GameData.passRate = -1;
            GameData.storeGameData();
        }

        this.nextStage.string = (GameData.bestLevel + 1) + '';
        this.systemLoginTimes();
        this.judgeHasHair();
        this.isShowLotteryBtn();

        // 添加蝴蝶飞动的动画
        this.butterFlyMoveAnimation();

        this.isShowCloud();

    },
    // update (dt) {},
});
