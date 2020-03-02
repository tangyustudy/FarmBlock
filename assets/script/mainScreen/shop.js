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
let Config = require('../psconfig') ;
const shopList = Config.playerTooLCostList;

cc.Class({
    extends: cc.Component,

    properties: {
        contentList: cc.Node,
        item: cc.Prefab,
        footer: cc.Node,
        toolItemList: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('buyPlayerTool', this.buyPlayerTool, this);
        this.winSize = cc.view.getDesignResolutionSize();
        cc.systemEvent.on('UPDATE_TOOLLIST_SHOP',this.updatePlayerToolCount,this);
    },

    // 购买操作
    // 减钱 增加数量

    // 显示界面
    showView() {
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        this.initShopList();
        this.playerToolIntoView(true);
    },

    // 初始化购买列表
    initShopList() {
        
        if (this.contentList.children.length > 0) {
            this.contentList.removeAllChildren();
        }
        for (let i = 0; i < shopList.length; i++) {
            let item = cc.instantiate(this.item);
            let script = item.getComponent('item_shop');
            script.initItemView(shopList[i]);
            item.parent = this.contentList;
        }

    },

    // 隐藏界面
    hideView() {
        this.node.active = false;
        // this.playerToolAwayFromView();
    },


    buyPlayerTool(event) {

        let type = event.detail.data.type;
        let price = event.detail.data.price;
        GameData.starCount -= price;
        GameData.storeGameData();
        cc.systemEvent.emit('UPDATE_COINS');
        cc.systemEvent.emit('SUCCESS_BUY_ANIMA',{
            type
        });
    },


    // 刷新玩家道具的数量
    updatePlayerToolCount(event) {
        let toolData = GameData.game_prop;
        if(toolData.length<=0){
            toolData =  [
                { type: 0, name: 'battle', number: 0, },
                { type: 1, name: 'fork', number: 0, },
                { type: 2, name: 'hammer', number: 0, },
                { type: 3, name: 'dice', number: 0, }
            ];
        }
        
        if(!!event &&  typeof event.type =='number'){
            GameData.changeGameTool('playerTool', 1,  event.type, true);
            let item = this.toolItemList[event.type];
            let number = item.getChildByName('number').getComponent(cc.Label);
            number.string = '' + toolData[event.type].number;
        }else{
            for (let i = 0; i < this.toolItemList.length; i++) {
                let item = this.toolItemList[i];
                let number = item.getChildByName('number').getComponent(cc.Label);
                number.string = '' + toolData[i].number;
            }
        }   
    },


    // 玩家道具显示框进入可视窗
    playerToolIntoView(isUpdate) {
       
        if(!this.winSize){
            this.winSize = cc.view.getDesignResolutionSize();
        } 
        this.footer.position = cc.v2(0,-this.winSize.height / 2 - this.footer.height);
        if(!!isUpdate){
            this.updatePlayerToolCount();
            // cc.systemEvent.emit('UPDATE_TOOLLIST_SHOP');
        }
      
        this.footer.active=true;
        let action =  cc.spawn(
                cc.fadeIn(0.3),
                cc.moveTo(0.3, cc.v2(0,-this.winSize.height/2 + this.footer.height/2)).easing(cc.easeBackOut(3)),
        )
        this.footer.runAction(action);
    },

    // 玩家道具显示框退出可视区
    playerToolAwayFromView(){
        if(!this.winSize){
            this.winSize = cc.view.getDesignResolutionSize();
        } 
        let self=this;
        let action = cc.sequence(
            cc.spawn(
                cc.fadeOut(0.3),
                cc.moveTo(0.3,cc.v2(0,-this.winSize.height / 2 ))
            ),
            cc.callFunc(
                function(){
                    self.footer.active=false;
                }
            )
           
        )
        this.footer.runAction(action);
    },

    start() {
       
    },

    // update (dt) {},
});
