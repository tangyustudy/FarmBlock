// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        item_view: cc.Sprite,
        item_name: cc.Sprite,
        item_function: cc.Sprite,
        viewList: [cc.SpriteFrame],
        nameList: [cc.SpriteFrame],
        functionList: [cc.SpriteFrame],
        price: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 初始化界面
    initItemView(data) {
        this.item_view.spriteFrame = this.viewList[data.type];
        this.item_name.spriteFrame = this.nameList[data.type];
        this.item_function.spriteFrame = this.functionList[data.type];
        this.price.string = data.price + '';
        this.data = data;
    },


    // 购买操作
    buy(){
        cc.director.SoundManager.playSound('btnEffect');
        if(GameData.starCount>=this.data.price){
            let event = new cc.Event.EventCustom('buyPlayerTool',true);
            let wp = this.item_view.node.parent.convertToWorldSpaceAR(this.item_view.node.position);
            event.detail = {
                data:this.data,
                pos:wp,
                type:this.data.type,
            };
            this.node.dispatchEvent(event);
            // this.buySuccessAnimation();
        }else{
            // cc.systemEvent.emit('TIPS',{
            //     word:'Money is not enough !',
            // });
            cc.director.screenDialog.showCoinsPanel();
        }

      
    },


    // 购买成功动画
    buySuccessAnimation(){
        // let moveNode = cc.instantiate(this.item_view.node);
        // let wp = this.node.convertToWorldSpaceAR(moveNode.position);
        let type = this.data.type;
        cc.systemEvent.emit('SUCCESS_BUY_ANIMA',{
            // moveNode,
            // wp,
            type
        });
    },




    start() {

    },

    // update (dt) {},
});
