let GameData = require('../gameData');
let Config = require('../psconfig');

const starStopPos = [cc.v2(-220, -400), cc.v2(0, -400), cc.v2(220, -400)];

cc.Class({
    extends: cc.Component,

    properties: {
        toolItem: cc.Prefab,
        bigStar: cc.Prefab,
        btn_play: cc.Node,
        btn_blueBox: cc.Node,
        heart: cc.Node,
        lifeNumNode: cc.Node,
        coins: cc.Node,
        daily_item_view: cc.Prefab,
        guideScreenNode: require('./guideScreenNode'),
        firework: cc.Prefab,
        toolList: [cc.Node],

        btn_lottery: cc.Node,
        btn_dailySign: cc.Node,
        gift: cc.Node,

        node_cloud: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('TOOLOBTAIN', this.toolObtainEffect, this);
        cc.systemEvent.on('STARANIMA', this.starMoveAnimation, this);
        cc.systemEvent.on('HEART_ANIMA', this.heartMoveAnimation, this);
        cc.systemEvent.on('DAILY_BOUNS_ANIMA', this.getDailyBounsAnimation, this);
        cc.systemEvent.on('SUCCESS_BUY_ANIMA', this.buySuccessAnimation, this);
        cc.systemEvent.on('LOTTERY_FINISHED', this.lotteryFinishedAnimation, this);
        cc.systemEvent.on('LOTTERY_GUIDE', this.showLotteryAnimatiaon, this);
        cc.systemEvent.on('DAILYSIGN_GUIDE', this.showDailySignAnimation, this);
        cc.systemEvent.on('GIFT_SELL_SUCCESS', this.successBuyBigGift, this);

        cc.systemEvent.on('IN_COULD_ANIMA', this.cloudFadeIn, this);
        cc.systemEvent.on('OUT_COULD_ANIMA', this.cloudFadeOut, this);

        this.itemPool = new cc.NodePool();
        for (let i = 0; i < 5; i++) {
            let item = cc.instantiate(this.toolItem);
            this.itemPool.put(item);
        }
        this.starPool = new cc.NodePool();

        for (let i = 0; i < 5; i++) {
            let item = cc.instantiate(this.bigStar);
            this.starPool.put(item);
        }

        // 蓝盒子位置
        let boxPos = this.btn_blueBox.parent.convertToWorldSpaceAR(this.btn_blueBox);
        this.boxPos = this.node.convertToNodeSpaceAR(boxPos);

    },

    start() {
        // console.log(GameData);
        let self = this;
        // for(let i=0;i<10;i++){
        //     setTimeout(function(){
        //         self.obtainCoinsEffect(i);
        //     },100*i)
        // }

    },



    //获得金币时的效果
    obtainCoinsEffect(event) {

        let self = this;
        let coin = cc.instantiate(this.toolItem);
        let targetPos = this.node.convertToNodeSpaceAR(this.coins.parent.convertToWorldSpaceAR(this.coins.position));
        coin.getComponent('toolItem').changeItemTexture(0);
        coin.parent = this.node;
        let randomX = Math.floor(Math.random() * 200);
        let randomY = -500 + Math.floor(Math.random() * 100);
        let time = 0.2 + Math.random() * 0.5;
        coin.position = cc.v2(randomX, randomY);
        // cc.director.SoundManager.playSound('plateIn');
        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(0.1, 0.9),
                cc.scaleTo(0.1, 1.1),
                cc.scaleTo(0.1, 1),
            ),
            cc.spawn(
                cc.rotateBy(time, 720),
                cc.moveTo(time, targetPos).easing(cc.easeInOut(3.0)),
                cc.scaleTo(time, 0.5),
            ),
            cc.callFunc(function () {
                cc.director.SoundManager.playSound('flyCoins');
            }),
            cc.callFunc(function () {
                coin.removeFromParent();
                self.coins.runAction(
                    cc.sequence(
                        cc.scaleTo(0.1, 0.9),
                        cc.scaleTo(0.1, 1.1),
                        cc.scaleTo(0.1, 1),
                        cc.callFunc(function () {
                            GameData.starCount += event;
                            GameData.storeGameData();
                            cc.systemEvent.emit('UPDATE_COINS');
                        })
                    )
                )
            })
        );
        coin.runAction(action);

    },



    toolObtainEffect(event) {
        // console.log('helloworld')
        let self = this;
        let data = event;
        let localPos;
        if (data.pos) {
            localPos = this.node.convertToNodeSpaceAR(data.pos);
        }
        let type = data.type;
        let item;
        if (this.itemPool.size() > 0) {
            item = this.itemPool.get();
        } else {
            item = cc.instantiate(this.toolItem);
        }
        if (type != 0) {
            item.parent = this.node;
            if (!!localPos) {
                item.position = localPos;
            } else {
                item.position = cc.v2(0, 0);
            }

            item.getComponent('toolItem').changeItemTexture(type);
            if (type < 4 && type > 0) {
                this.toolItemMoveAnimation(item);
                GameData.changeGameTool('gameTool', data.number, type - 1, true);
            } else if (type >= 4 && type < 8) {
                this.toolItemMoveAnimation(item);
                GameData.changeGameTool('playerTool', data.number, type - 4, true);
            } else if (type == 8) {
                // 生命值增加
                GameData.lifeNumber += 1;
                GameData.storeGameData();
                cc.systemEvent.emit('HEART_ANIMA');
                this.itemPool.put(item);
            }


        } else {
            self.addCoins(data.number);
        }

    },

    addCoins(number) {
        let self = this;
        let rest = number % 10;
        let step = (number - rest) / 10;
        cc.systemEvent.emit('STOP_TOUCH', { number: 1 });
        for (let i = 0; i < 10; i++) {
            setTimeout(function () {
                if (i == 9) {
                    self.obtainCoinsEffect(step + rest);
                    cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
                } else {
                    self.obtainCoinsEffect(step);
                }

            }, 100 * i)
        }
    },


    // // 记录玩家道具的数量改变
    // recordToolNumberChange(event){

    // },


    // 道具移动动画
    toolItemMoveAnimation(node) {
        let self = this;
        let wp = this.btn_play.parent.convertToWorldSpaceAR(this.btn_play);
        let targetPos = this.node.convertToNodeSpaceAR(wp);
        cc.director.SoundManager.playSound('flyStart');
        let action =
            cc.sequence(
                cc.moveTo(0.5, targetPos),
                cc.callFunc(function () {
                    self.itemPool.put(node);
                    self.btn_play.runAction(
                        cc.sequence(
                            cc.scaleTo(0.2, 0.9),
                            cc.scaleTo(0.2, 1.1),
                            cc.scaleTo(0.2, 1)
                        )
                    );
                    cc.director.SoundManager.playSound('starCollect');
                    let firework = cc.instantiate(self.firework);
                    firework.parent = self.btn_play;
                    firework.y += 40;
                    firework.getComponent(cc.ParticleSystem).resetSystem();
                })
            );
        node.runAction(action);
    },

    // 执行星星动画
    starMoveAnimation(event) {
        // let detail = event.detail;
        let passRate = event.passRate;
        // cc.log(event);
        // let passRate=3;
        let self = this;

        for (let i = 0; i < passRate; i++) {
            this.scheduleOnce(function () {
                let star;
                if (this.starPool.size() > 0) {
                    star = this.starPool.get();
                } else {
                    star = cc.instantiate(this.bigStar);
                }
                star.parent = this.node;
                // star.position = cc.v2(-150,100*i);
                star.scale = 0.01;
                let action = cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.5, 1),
                        cc.rotateBy(0.5, 360),
                        cc.moveTo(0.5, starStopPos[i])
                    ),
                    cc.sequence(
                        cc.scaleTo(0.2, 1.05),
                        cc.scaleTo(0.2, 1),
                    ).repeat(2),
                    cc.spawn(
                        cc.scaleTo(0.7, 0.2),
                        cc.rotateBy(0.7, 360),
                        cc.moveTo(0.7, this.boxPos)
                    ),
                    cc.callFunc(
                        function () {
                            // console.log('改变数量显示状态');
                            // 改变星星的累积数
                            // 回收星星
                            // 执行撞击效果和粒子特效
                            self.starPool.put(star);
                            cc.systemEvent.emit('FINISHEDCOLLECT');
                            cc.director.SoundManager.playSound('starCollect');
                            // 
                            if (i == passRate - 1) {
                                if (GameData.bestLevel == 1) {
                                    let boxGuide = cc.sys.localStorage.getItem('boxGuide');
                                    if (!boxGuide) {
                                        self.guideScreenNode.showScreenGuide();
                                    }
                                }
                                cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
                            }

                        }
                    )
                )
                star.runAction(action);

            }, 0.2 * i);

        }
    },


    // 生命移动的动画
    heartMoveAnimation(event) {
        let data = event;

        let localPos;
        if (!!data && !!data.pos) {
            localPos = this.node.convertToNodeSpaceAR(data.pos);
        } else {
            localPos = cc.v2(0, 0);
        }
        let node = cc.instantiate(this.heart);
        node.position = localPos;
        node.active = true;
        node.parent = this.node;
        let targetPos = this.node.convertToNodeSpaceAR(this.lifeNumNode.parent.convertToWorldSpaceAR(this.lifeNumNode));
        let action = cc.sequence(
            cc.moveTo(0.5, targetPos),
            cc.callFunc(function () {
                node.removeFromParent();
                GameData.storeGameData();
                cc.systemEvent.emit('UPDATE_LIFE');
            })
        )
        // console.log(data);
        node.runAction(action);
    },

    // 领取每日奖励的动画
    getDailyBounsAnimation(event) {
        // console.log(event);
        let self = this;
        let wp = this.btn_play.parent.convertToWorldSpaceAR(this.btn_play);
        let targetPos = this.node.convertToNodeSpaceAR(wp);
        let node = cc.instantiate(this.daily_item_view);
        node.parent = this.node;
        node.scale = 0.1
        node.getComponent('item_daily_view').initView(event.type - 1);
        cc.director.SoundManager.playSound('flyStart');
        node.runAction(
            cc.sequence(
                cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(3.0)),
                cc.delayTime(1.5),
                cc.spawn(
                    cc.scaleTo(0.5, 0.2),
                    cc.moveTo(0.5, targetPos).easing(cc.easeInOut(3.0)),
                ),
                cc.callFunc(function () {
                    self.btn_play.runAction(
                        cc.sequence(
                            cc.scaleTo(0.2, 0.9),
                            cc.scaleTo(0.2, 1.1),
                            cc.scaleTo(0.2, 1),
                        )
                    )
                    cc.director.SoundManager.playSound('starCollect');
                    let firework = cc.instantiate(self.firework);
                    firework.parent = self.btn_play;
                    firework.y += 40;
                    firework.getComponent(cc.ParticleSystem).resetSystem();
                    node.removeFromParent();
                })
            )
        )

    },


    // 商店购买道具的动画
    buySuccessAnimation(event) {
        // console.log(event);
        // let moveItem = event.moveNode;
        let moveItem = cc.instantiate(this.daily_item_view);
        moveItem.getComponent('item_daily_view').initView(event.type + 3);
        moveItem.parent = this.node;
        // let np = this.node.convertToNodeSpaceAR(event.wp);
        // moveItem.position = np;
        let targetItem = this.toolList[event.type];
        let targetWp = targetItem.parent.convertToWorldSpaceAR(targetItem.position);
        let targetNp = this.node.convertToNodeSpaceAR(targetWp);
        moveItem.scale = 0.1;
        cc.director.SoundManager.playSound('flyStart');
        let action = cc.sequence(
            cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(3.0)),
            cc.delayTime(1.5),
            cc.spawn(
                cc.scaleTo(0.5, 0.2),
                cc.moveTo(0.5, targetNp).easing(cc.easeInOut(3.0)),
            ),
            cc.callFunc(function () {
                cc.director.SoundManager.playSound('starCollect');
                moveItem.removeFromParent();
                cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP', { type: event.type });
            })
        )
        moveItem.runAction(action);
    },

    // 大礼包玩家道具动画
    bigGiftPlayerToolAnima(node, type, isLast) {
        let targetItem = this.toolList[type - 4];
        // console.log( this.toolList,targetItem);
        let targetWp = targetItem.parent.convertToWorldSpaceAR(targetItem.position);
        let targetNp = this.node.convertToNodeSpaceAR(targetWp);
        cc.director.SoundManager.playSound('flyStart');
        let action = cc.sequence(
            cc.moveTo(0.8, targetNp).easing(cc.easeInOut(3.0)),
            cc.callFunc(function () {
                cc.director.SoundManager.playSound('starCollect');
                node.removeFromParent();
                cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP', { type: type - 4, tag: 2, isLast: isLast });
            })
        );
        node.runAction(action);

    },





    // 抽奖获得道具
    lotteryFinishedAnimation(event) {
        let self = this;
        let data = event;
        let type = data.type;
        if (type < 4 && type > 0) {
            // this.toolItemMoveAnimation(item);
            GameData.changeGameTool('gameTool', data.number, type - 1, true);
        } else if (type >= 4) {
            // this.toolItemMoveAnimation(item);
            GameData.changeGameTool('playerTool', data.number, type - 4, true);
        } else {
            this.addCoins(data.number);
            return;
        }
        let moveItem = cc.instantiate(this.daily_item_view);
        moveItem.getComponent('item_daily_view').initView(event.type - 1);
        moveItem.parent = this.node;
        let wp = this.btn_play.parent.convertToWorldSpaceAR(this.btn_play);
        let targetPos = this.node.convertToNodeSpaceAR(wp);
        moveItem.scale = 0.1;
        cc.director.SoundManager.playSound('flyStart');
        let action = cc.sequence(
            cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(3.0)),
            cc.delayTime(1.5),
            cc.spawn(
                cc.scaleTo(0.5, 0.2),
                cc.moveTo(0.5, targetPos).easing(cc.easeInOut(3.0)),
            ),
            cc.callFunc(function () {
                cc.director.SoundManager.playSound('starCollect');
                moveItem.removeFromParent();
                self.btn_play.runAction(
                    cc.sequence(
                        cc.scaleTo(0.2, 0.9),
                        cc.scaleTo(0.2, 1.1),
                        cc.scaleTo(0.2, 1)
                    )
                );
                // cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP');
                cc.director.SoundManager.playSound('starCollect');
                let firework = cc.instantiate(self.firework);
                firework.parent = self.btn_play;
                firework.y += 40;
                firework.getComponent(cc.ParticleSystem).resetSystem();
            })
        )
        moveItem.runAction(action);
    },


    // 显示抽奖按钮的动画
    showLotteryAnimatiaon() {
        let self = this;
        let moveItem = cc.instantiate(this.daily_item_view);
        cc.systemEvent.emit('STOP_TOUCH', { number: 1 });
        moveItem.getComponent('item_daily_view').initView(7);
        moveItem.parent = this.node;
        let targetItem = this.btn_lottery;
        let targetWp = targetItem.parent.convertToWorldSpaceAR(targetItem.position);
        let targetNp = this.node.convertToNodeSpaceAR(targetWp);
        moveItem.scale = 0.1;
        cc.director.SoundManager.playSound('unlock');
        let action = cc.sequence(
            cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(3.0)),
            cc.delayTime(1.5),
            cc.moveTo(0.5, targetNp).easing(cc.easeInOut(3.0)),

            cc.callFunc(function () {
                cc.director.SoundManager.playSound('flyStart');
                moveItem.removeFromParent();
                // cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP');
                self.btn_lottery.active = true;
                cc.sys.localStorage.setItem('lotteryGuide01', 'yes');
                cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
                cc.systemEvent.emit('START_FINGER_GUIDE', { targetNode: self.btn_lottery, worldPos: targetWp });
            })
        );
        moveItem.runAction(action);
    },


    // 显示每日签到按钮的动画
    showDailySignAnimation() {
        // let   todo
        let self = this;
        let moveItem = cc.instantiate(this.daily_item_view);
        cc.systemEvent.emit('STOP_TOUCH', { number: 1 });
        moveItem.getComponent('item_daily_view').initView(8);
        moveItem.parent = this.node;
        let targetItem = this.btn_dailySign;
        let targetWp = targetItem.parent.convertToWorldSpaceAR(targetItem.position);
        let targetNp = this.node.convertToNodeSpaceAR(targetWp);
        moveItem.scale = 0.1;
        cc.director.SoundManager.playSound('unlock');
        let action = cc.sequence(
            cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(3.0)),
            cc.delayTime(1.5),
            cc.moveTo(0.5, targetNp).easing(cc.easeInOut(3.0)),

            cc.callFunc(function () {
                cc.director.SoundManager.playSound('flyStart');
                moveItem.removeFromParent();
                // cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP');
                self.btn_dailySign.active = true;
                cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
                cc.systemEvent.emit('START_FINGER_GUIDE', { targetNode: self.btn_dailySign, worldPos: targetWp });
            })
        );
        moveItem.runAction(action);
    },




    // 购买大礼包成功的动画
    successBuyBigGift(event) {
        let self = this;
        cc.systemEvent.emit('STOP_TOUCH', { number: 1 });
        let callFunc = function () {
            let type = event.type;
            type = !!type ? type : 0;
            let giftNumber = Config.giftNumber[type];
            let coins, life, gameTool, playerTool;
            coins = giftNumber.coins;
            life = giftNumber.life;
            gameTool = giftNumber.gameTool;
            playerTool = giftNumber.playerTool;
            // console.log(giftNumber);
            // 1 出现购买的大礼包的图案；
            //  所有的道具 、金币依次展示 （金币，游戏道具飞到play按钮，玩家道具 飞到道具展示栏）

            // Object.getOwnPropertyNames(obj).length  
            // Object.keys(obj).length
            // console.log(Object.getOwnPropertyNames(gameTool));
            // console.log(Object.keys(gameTool));
            // console.log(coins,life,gameTool,playerTool);

            if (!!coins && coins > 0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
            }
            if (!!life && life > 0) {
                GameData.lifeNumber += life;
                cc.systemEvent.emit('HEART_ANIMA');
            }

            //只执行数据的更新
            let gameToolNameList = Object.getOwnPropertyNames(gameTool);
            for (let i = 0; i < gameToolNameList.length; i++) {
                let number = gameTool[gameToolNameList[i]];
                GameData.changeGameTool('gameTool', number, i, true);

            }

            let playerToolNameList = Object.getOwnPropertyNames(playerTool);
            for (let j = 0; j < playerToolNameList.length; j++) {
                let number = playerTool[playerToolNameList[j]];
                GameData.changeGameTool('playerTool', number, j, true);

            }
            // 执行动画操作 顺便去更新显示
            let animList = [1, 2, 3, 4, 5, 6, 7];
            for (let m = 0; m < animList.length; m++) {
                self.scheduleOnce(function () {
                    let tItem;
                    if (this.itemPool.size() > 0) {
                        tItem = this.itemPool.get();
                    } else {
                        tItem = cc.instantiate(this.toolItem);
                    }
                    tItem.getComponent('toolItem').changeItemTexture(animList[m]);
                    tItem.parent = this.node;
                    tItem.position = cc.v2(0, 0);
                    if (m < 3) {
                        this.toolItemMoveAnimation(tItem);
                    } else {
                        if (m == animList.length - 1) {
                            this.bigGiftPlayerToolAnima(tItem, animList[m], true);
                            self.gift.active = false;
                            cc.systemEvent.emit('STOP_TOUCH', { number: 2 });
                        } else {
                            this.bigGiftPlayerToolAnima(tItem, animList[m]);
                        }
                    }
                }, 0.2 * m);

            }
        };

        this.giftFadeIn(callFunc);

    },


    // 礼物带炫光弹出   
    giftFadeIn(callFunc) {
        this.gift.scale = 0.1;
        this.gift.active = true;
        let rotateNode = this.gift.getChildByName('light');
        rotateNode.runAction(
            cc.rotateBy(5, 360).repeatForever()
        );
        this.gift.runAction(
            cc.sequence(
                cc.scaleTo(0.5, 1).easing(cc.easeBackOut(3.0)),
                cc.callFunc(callFunc),
            )

        )

    },





    //云缓慢退出
    cloudFadeOut() {
        let self = this;
        this.node_cloud.active = true;
        let left = this.node_cloud.getChildByName('cloudLeft');
        let right = this.node_cloud.getChildByName('cloudRight');
        left.position = cc.v2(-400, 0);
        right.position = cc.v2(400, 0);
        let action1 =
            cc.sequence(
                cc.fadeIn(0.1),
                cc.spawn(
                    cc.fadeOut(1),
                    cc.moveTo(1, cc.v2(-1200, 0))
                )
            ).easing(cc.easeInOut(3.0));
        let action2 = cc.sequence(
            cc.fadeIn(0.1),
            cc.spawn(
                cc.fadeOut(1),
                cc.moveTo(1, cc.v2(1200, 0))
            ),
            // cc.callFunc(function () {
            //     self.node_cloud.active = false;
            // })
        ).easing(cc.easeInOut(3.0));
        left.runAction(action1);
        right.runAction(action2);
        cc.director.SoundManager.playSound('farm_cloud');
    },

    // 云缓慢合拢
    cloudFadeIn() {
        let self = this;
        this.node_cloud.active = true;
        let left = this.node_cloud.getChildByName('cloudLeft');
        let right = this.node_cloud.getChildByName('cloudRight');
        left.position = cc.v2(-1200, 0);
        right.position = cc.v2(1200, 0);
        let action1 = cc.sequence(
            cc.fadeOut(0.1),
            cc.spawn(
                cc.fadeIn(1),
                cc.moveTo(1, cc.v2(-400, 0))
            )
        ).easing(cc.easeInOut(3.0));
        let action2 = cc.sequence(
            cc.fadeOut(0.1),
            cc.spawn(
                cc.fadeIn(1),
                cc.moveTo(1, cc.v2(400, 0))
            ),
            // cc.callFunc(function () {
            //     self.node_cloud.active = false;
            // })
        ).easing(cc.easeInOut(3.0));
        left.runAction(action1);
        right.runAction(action2);
        cc.director.SoundManager.playSound('farm_cloud');
    },









    // update (dt) {},
});
