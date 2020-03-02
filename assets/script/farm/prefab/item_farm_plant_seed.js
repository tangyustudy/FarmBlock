

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_view: cc.Sprite,
        label_number: cc.Label,
        list_view: [cc.SpriteFrame],
        list_view_lock: [cc.SpriteFrame],
        node_locked: cc.Node,
        label_locked_level: cc.Label,
        node_buy: cc.Node,
        label_buy_price: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       
    },


    // 初始化当前item

    updateItem(data, currentLevel) {
        this.data = data;
        if (data.limitedLevel <= currentLevel) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.showPlantOperate, this);
            this.plantUnlocked();
        } else {
            this.plantLocked();
        }
    },


    // 被锁住
    plantLocked() {
        this.updateUnlockedLevel(this.data.limitedLevel);
        this.showLockedState(this.data.isUnlock);
    },

    plantUnlocked() {
        this.node_locked.active = false;
        this.updateSpriteView(this.data.type, this.list_view);
        if (this.data.number > 0) {
            this.updateNumber(this.data.number);
            this.label_number.node.active = true;
        } else {
            this.node_buy.active = true;
            this.updateBuyPrice(this.data.price);
        }

    },


    // 视图
    updateSpriteView(type, list) {
        if (typeof type == 'number') {
            this.sprite_view.spriteFrame = list[type];
        } else {
            cc.log('error:type is not a number,37');
        }
    },

    // 数量
    updateNumber(num) {
        if (typeof num == 'number') {
            if (num > 0) {
                this.hideBuyBtn();
                this.label_number.string = num + '';
            } else {
                this.showBuybtn();
            }

        } else {
            cc.log('error:num is not a number,51');
        }
    },

    // 解锁等级
    updateUnlockedLevel(num) {
        if (typeof num == 'number') {
            this.label_locked_level.string = ''+ num;
        } else {
            cc.log('error:num is not a number,60');
        }
    },

    // 更新购买价格
    updateBuyPrice(num) {
        if (typeof num == 'number') {
            this.label_buy_price.string = num + '';
        } else {
            cc.log('error:num is not a number,69');
        }
    },

    // 显示锁定状态
    showLockedState() {

        this.label_number.node.active = false;
        this.node_buy.active = false;
        this.node_locked.active = true;
        this.updateSpriteView(this.data.type, this.list_view_lock);

    },

    //显示购买按钮
    showBuybtn() {
        this.node_locked.active = false;
        this.label_number.node.active = false;
        this.node_buy.active = true;
    },

    // 隐藏购买按钮
    hideBuyBtn() {
        this.node_locked.active = false;
        this.label_number.node.active = true;
        this.node_buy.active = false;
    },


    
    // 显示种植操作
    showPlantOperate() {
        if (!!this.data.isUnlock && this.data.number > 0) {
            cc.director.farmDialog.hidePlantPrompt();
            cc.director.farmDialog.showOperateView();
            cc.director.currentPlantIndex = this.data.type;
            this.data.mode = 0;
            cc.systemEvent.emit('SHOW_OPERATE', { data: this.data })
        }
    },

    buyClick() {
        let event = new cc.Event.EventCustom('touchBuyBtn', true);
        this.node.dispatchEvent(event);
    },



    start() {

    },

    // update (dt) {},
});
