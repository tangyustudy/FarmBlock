
let Utils = require('../utils');
let Config = require('../psconfig');
let GameData = require('../gameData');
const delayTime = 4;
cc.Class({
    extends: cc.Component,

    properties: {
        realMoneyShop: cc.Node,
        coinsShop: cc.Node,
        labelList: [cc.Node],
        // footer:cc.Node,
        toolItemList: [cc.Node],
        shop: require('./shop'),
        btn_item: cc.Node,
        btnItemList: [cc.SpriteFrame],
        btn_prop: cc.Node,
        btnPropList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('UPDATE_TOOLLIST_SHOP', this.updatePlayerToolCount, this);
    },

    // 初始化金币商店的商品价格
    initCoinsShopPrice() {
        let price;
        this.playCostList = Config.playerTooLCostList;
        for (let i = 0; i < this.playCostList.length; i++) {
            price = this.playCostList[i].price;
            let labelStr = this.labelList[i].getComponent(cc.Label);
            labelStr.string = price + '';
        }
    },

    // 刷新玩家道具的数量
    updatePlayerToolCount(event) {

        let toolData = GameData.game_prop;
        if (!event.tag) {
            GameData.changeGameTool('playerTool', 1, event.type, true);
        }
        // for (let i = 0; i < this.toolItemList.length; i++) {
        let item = this.toolItemList[event.type];
        let number = item.getChildByName('number').getComponent(cc.Label);
        number.string = '' + toolData[event.type].number;
        // }
        if (!!event.isLast) {
            this.shop.playerToolAwayFromView();
        }

    },



    hideview() {
        this.node.active = false;
        this.shop.playerToolAwayFromView();
    },

    showView() {
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        this.showRealMoneyShop();
        this.shop.playerToolIntoView(true);
    },

    showRealMoneyShop() {
        this.realMoneyShop.active = true;
        this.coinsShop.active = false;
        this.btn_item.getComponent(cc.Sprite).spriteFrame = this.btnItemList[0];
        this.btn_prop.getComponent(cc.Sprite).spriteFrame = this.btnPropList[1];
    },

    showCoinShop() {
        this.realMoneyShop.active = false;
        this.coinsShop.active = true;
        this.btn_item.getComponent(cc.Sprite).spriteFrame = this.btnItemList[1];
        this.btn_prop.getComponent(cc.Sprite).spriteFrame = this.btnPropList[0];
    },

    buyPlayerTool(type, price) {

        // let type = event.detail.data.type;
        // let price = event.detail.data.price;
        // let pos = event.detail.pos;
        // let number=1;
        GameData.starCount -= price;
        // cc.systemEvent.emit('TOOLOBTAIN',{type:(type+4),pos:pos,number:1})
        GameData.storeGameData();
        cc.systemEvent.emit('UPDATE_COINS');
        // cc.systemEvent.emit('TIPS_SUCCESS',{word:'Buy success!'});
        cc.systemEvent.emit('SUCCESS_BUY_ANIMA', { type, price });

        // }   
    },

    buyBoxing() {
        let price = this.playCostList[0].price;
        if (GameData.starCount >= price) {
            this.buyPlayerTool(0, price);
        } else {
            // 提示金币不足
            cc.systemEvent.emit('TIPS_SUCCESS', { wordIndex: 2 });
        }
    },

    buAvanil() {
        let price = this.playCostList[1].price;
        if (GameData.starCount >= price) {
            this.buyPlayerTool(1, price);
        } else {
            // 提示金币不足
            cc.systemEvent.emit('TIPS_SUCCESS', { wordIndex: 2 });
        }
    },

    buyHammer() {
        let price = this.playCostList[2].price;
        if (GameData.starCount >= price) {
            this.buyPlayerTool(2, price);
        } else {
            // 提示金币不足
            cc.systemEvent.emit('TIPS_SUCCESS', { wordIndex: 2 });
        }
    },
    buyDice() {
        let price = this.playCostList[3].price;
        if (GameData.starCount >= price) {
            this.buyPlayerTool(3, price);
        } else {
            // 提示金币不足
            cc.systemEvent.emit('TIPS_SUCCESS', { wordIndex: 2 });
        }
    },

    // 刷新数据
    updateGameData() {
        this.scheduleOnce(
            function () {
                let data = GameData.getGameData();
                Utils.updateGameInfo(data);
            }, 3
        )
    },





    // 游戏交易
    gameTrade() {
        let self = this;
        let type = 1;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            // console.log(res,148);
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res >= 0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();

                // 购买成功
                // cc.systemEvent.emit('TIPS_PROMPT_SHOW',{type:5});
            } else {
                //  购买失败
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
        }, delayTime);


    },

    gameTrade1() {
        let self = this;
        let type = 2;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            // console.log(res,148);
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    gameTrade2() {
        let self = this;
        let type = 3;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            // console.log(res,148);
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();
            }else{
             cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
                
            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    gameTrade3() {
        let self = this;
        let type = 4;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            // console.log(res,148);
            if (res>=0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    gameTrade4() {
        let self = this;
        let type = 5;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }   
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    gameTrade5() {
        let self = this;
        let type = 6;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            // console.log(res,148);
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('GIFT_SELL_SUCCESS', { type: type - 1 });
                cc.director.funcView.hideShop();
                self.shop.playerToolIntoView();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
        }, delayTime);

    },


    buyCoins() {
        let self = this;
        let type = 7;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
                
            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    buyCoins1() {
        let self = this;
        let type = 8;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    buyCoins2() {
        let self = this;
        let type = 9;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    buyCoins3() {
        let self = this;
        let type = 10;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

        }, delayTime);

    },

    buyCoins4() {
        let self = this;
        let type = 11;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                });
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
        }, delayTime);

    },

    buyCoins5() {
        let self = this;
        let type = 12;
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
        let coins = Config.coinsList[type - 7];
        window.NativeManager.purchaseGoods(type, callback);
        let callback = function (res) {
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
            if (res>=0) {
                cc.systemEvent.emit('TOOLOBTAIN', {
                    type: 0,
                    number: coins
                })
                cc.director.funcView.hideShop();
                self.updateGameData();
            }else{
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });

            }
        }

        this.scheduleOnce(function () {
            cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 4 });
            cc.systemEvent.emit('LOAD_TIPS_HIDE');
        }, delayTime);

    },

    start() {
        this.initCoinsShopPrice();
    },

    // update (dt) {},
});
