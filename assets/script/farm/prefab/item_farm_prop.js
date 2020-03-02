

cc.Class({
    extends: cc.Component,

    properties: {
        effectTime: cc.Label,
        // effectTime_viewList: [cc.SpriteFrame],
        item_view: cc.Sprite,
        item_view_viewList: [cc.SpriteFrame],
        item_costNum: cc.Label,
        label_name: cc.Label,
        // list_itemName: [cc.SpriteFrame],
        node_addItem: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updateItem(data) {
        this.data = data;
        // this.effectTime.spriteFrame = this.effectTime_viewList[data.index];
        this.updateItemView(this.data.type);
        this.item_costNum.string = data.cost + '';
        this.updateLabelString(data.price, this.item_costNum);
        this.updateLabelString(data.name,this.label_name);
        this.updateLabelString(data.timeStr,this.effectTime);
        // this.updateItemName(this.data.type);
    },

    // 购买
    buy_fertilizer() {

        // if(this.isEnoughBuy()){
        let event = new cc.Event.EventCustom('buy_prop', true);
        event.detail = { price: this.data.price, type: this.data.type };
        this.node.dispatchEvent(event);
        this.tipsBuySuccess();
        // }else{
        //     console.log('coins is not enough!!!');  
        // }

    },

    tipsBuySuccess() {
        // console.log('fuck!!!');
        let node = cc.instantiate(this.node_addItem);
        let action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveTo(0.5, cc.v2(node.position.x, node.position.y + 50)),
            cc.fadeOut(0.1),
            cc.callFunc(function () {
                node.removeFromParent();
            })
        );
        node.active = true;
        node.parent = this.node;
        node.runAction(action);
    },


    // 改变视图
    updateItemView(type) {
        this.item_view.spriteFrame = this.item_view_viewList[type];
    },

    // 改变名字视图
    updateItemName(type) {
        let num;
        if (type < 4) {
            num = 0;
        } else if (type < 8) {
            num = 1;
        } else if (type < 12) {
            num = 2;
        } else if (type < 15) {
            num = 3;
        }
        this.sprite_name.spriteFrame = this.list_itemName[num];
    },


    updateLabelString(str, Label) {
        Label.string = new String(str);
    },

    isEnoughBuy() {
        let coins = cc.game.FarmUtils.getLocalData('localFarmInfo').coin;
        if (!coins) {
            coins = 0;
        }
        if (coins >= this.data.cost) {
            return true;
        } else {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1001 });
        }
    },


    start() {

    },

    // update (dt) {},
});
