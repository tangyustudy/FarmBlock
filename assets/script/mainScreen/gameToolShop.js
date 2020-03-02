

let Utils = require('../utils');
let GameData = require('../gameData');
let Config = require('../psconfig');
cc.Class({
    extends: cc.Component,

    properties: {
        tool_name: cc.Sprite,
        tool_view: cc.Sprite,
        tool_function: cc.Sprite,
        viewList: [cc.SpriteFrame],
        funcList: [cc.SpriteFrame],
        nameList: [cc.SpriteFrame],
        price: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.count = 0;
        cc.director.UiCacheList = [];
        // this.playerToolPrice = [120, 120, 120, 250, 250, 210, 180];
        this.playerToolPrice = Config.playerTooLCostList;
        this.gameToolCost = Config.gameToolCost;
        this.currentPrice = 0;
    },


    showView(type, index) {

        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        if (index == 1) {
            this.tool_name.spriteFrame = this.nameList[type];
            this.tool_view.spriteFrame = this.viewList[type];
            this.tool_function.spriteFrame = this.funcList[type];
            this.price.string = this.gameToolCost + '';
            this.currentPrice = this.gameToolCost;
        }

        if (index == 2) {
            this.tool_name.spriteFrame = this.nameList[type +2 ];
            this.tool_view.spriteFrame = this.viewList[type + 2];
            this.tool_function.spriteFrame = this.funcList[type + 2];
            this.price.string = this.playerToolPrice[type-1].price + '';
            this.currentPrice = this.playerToolPrice[type-1].price;
        }

        this.type = type;
        this.index = index;

        // this.count++;

    },

    hideView() {
        this.node.active = false;
        let scene = cc.director.getScene();
        if (scene.name == 'gameView' && this.index == 1) {
            cc.director.dialogScript.showRetryPrompt();
        }

        if (scene.name == 'mainScreen') {
            cc.director.screenDialog.showStartPrompt();
        }

    },

    // 购买成功
    buyGameTool() {
        let self = this;
        let name, type;
        const number = 1;
        const price = 100;
        cc.director.SoundManager.playSound('btnEffect');
        if (this.index == 1) {
            name = 'gameTool';
            type = this.type;
        }

        if (this.index == 2) {
            name = 'playerTool';
            type = this.type - 1;
        }

        let sName = cc.director.getScene().name;
        if (GameData.starCount >= this.currentPrice) {
            GameData.starCount -= this.currentPrice;
            // console.log(sName,'87');
            if (sName == 'gameView') {
                // cc.systemEvent.emit('UPDATE_TOOL',{type:type+1,number:number,statuCode:1});

                GameData.changeGameTool(name, number, type, true);
                
                // console.log(type,'92_gametool');
                if(this.index==1){
                    // cc.director.dialogScript.showRetryPrompt();
                    this.hideView();
                }else{
                    cc.systemEvent.emit('AFTER_BUY_PLAYERTOOL', { num: type + 1 });
                    cc.director.dialogScript.hidePlayerShop();
                }
              

                
            }
            if (sName == 'mainScreen') {

                GameData.changeGameTool(name, number, type, true);
                GameData.storeGameData();
                cc.systemEvent.emit('UPDATE_COINS');
                cc.systemEvent.emit('TIPS_SUCCESS', { word: 'Buy success!' });

            }


        } else {

            if (sName == 'gameView') {
                // cc.systemEvent.emit('GAMEVIEW_TIPS',{word:'Money is not enough!'});
                cc.director.dialogScript.showFreeCoinsPanel(this.index);
            }
            if (sName == 'mainScreen') {
                // cc.systemEvent.emit('UPDATE_COINS');
                // cc.systemEvent.emit('TIPS',{word:'Money is not enough!'});
                cc.director.screenDialog.showCoinsPanel();
            }

        }


    },



    start() {

        //    this.showView(1);

    },

    // update (dt) {},
});
