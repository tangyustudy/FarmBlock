

let FarmData = require('../FarmData');

cc.Class({
    extends: cc.Component,

    properties: {
        itme_level: cc.Label,
        itemView: cc.Sprite,
        item_name: cc.Label,
        item_get_icon: cc.Sprite,
        item_get_number: cc.Label,
        item_sell_price: cc.Label,
        item_time_cost: cc.Label,
        item_amount_number: cc.Label,

        // item_get_icon_viewList:[cc.SpriteFrame],
        // item_name_viewList: [cc.SpriteFrame],
        itemView_viewList: [cc.SpriteFrame],
        // item_time_cost_viewList: [cc.SpriteFrame],

        // list_level: [cc.SpriteFrame],

        node_display_unlock: cc.Node,
        node_display_lock: cc.Node,

        label_lock_name: cc.Label,
        label_lock_level: cc.Label,
        sprite_lock_view: cc.Sprite,
        list_lock_view: [cc.SpriteFrame],
        item_bg: cc.Sprite,
        list_itembg: [cc.SpriteFrame],

        node_addItem: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItemSeed(data, currentLevel) {
        this.data = data;
        // console.log(data.limitedlevel,currentLevel);

        console.log(data);
        if (data.limitedlevel <= currentLevel) {
            this.changeItemBg(0);
            this.updateUnlockDetail(data);
        } else {
            this.changeItemBg(1);
            this.updateLockDetail(data);
        }
    },

    updateItemViewByType(data) {
        this.itemView.spriteFrame = this.itemView_viewList[data.type];
        this.item_name.string = new String(data.name);
        this.item_time_cost.string = new String(data.timeCost);
        this.item_time_cost.getComponent(cc.Widget).left = 40;
    },

    // updateItemLabelByType() {
    //    this.updateLabelStr();
    // },

    updateLabelStr(label, str) {
        label.string = new String(str);
    },


    // 提升+1；
    tipsBuySuccess() {
        console.log('fuck!!!');
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


    // 购买种子
    buySeed() {
        // 判断金币是否够买
        if (this.isEnoughBuy()) {
            let event = new cc.Event.EventCustom('buySeed', true);
            event.detail = this.data;
            this.node.dispatchEvent(event);
            this.changeSeedNumber();
            this.tipsBuySuccess();
        } else {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1001 });
            // todo
            // console.log('coin is not enough');
        }

    },

    // 改变种子的数量
    changeSeedNumber() {
        this.data.number += 1;
        this.updateLabelStr(this.item_amount_number, this.data.number);
    },

    // 更改背景
    changeItemBg(type) {
        this.item_bg.spriteFrame = this.list_itembg[type];
    },

    // 判断金币是否够买当前种子
    isEnoughBuy() {
        let coins = cc.game.FarmUtils.getLocalData('localFarmInfo').coin;
        if (!coins) {
            coins = 0;
        }
        if (coins >= this.data.price) {
            return true;
        } else {
            return false;
        }
    },

    // 更新锁住界面的详情
    updateLockDetail(data) {
        // this.mask.active=true;
        this.node_display_unlock.active = false;
        this.node_display_lock.active = true;
        this.label_lock_name.string = new String(data.name);
        this.label_lock_level.string = new String('level ' + data.limitedlevel + ' unlock');
        this.sprite_lock_view.spriteFrame = this.list_lock_view[data.type];
    },

    // 更新解锁界面的详情
    updateUnlockDetail(data) {
        // this.mask.active=false;
        this.node_display_unlock.active = true;
        this.node_display_lock.active = false;
        this.itme_level.string = 'lv.' + data.level;
        this.updateItemViewByType(data);
        this.updateLabelStr(this.item_sell_price, data.price);
        this.updateLabelStr(this.item_amount_number, data.number);
        this.updateLabelStr(this.item_get_number, data.produce);
    },


    start() {

    },

    // update (dt) {},
});
