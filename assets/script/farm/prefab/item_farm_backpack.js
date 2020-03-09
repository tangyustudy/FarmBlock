

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_itemView: cc.Sprite,
        list_itemView: [cc.SpriteFrame],
        label_itemEffectTime: cc.Label,
        // list_effectTime: [cc.SpriteFrame],
        label_itemNumber: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.showFertilization, this);
    },


    initItem(data) {
<<<<<<< HEAD
        // console.log(data);
=======
        console.log(data);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.data = data;
        this.updateView(data.type);
        // this.updateEffectTime(data.type);
        this.label_itemEffectTime.string = new String(data.timeStr);
        this.updateNumber(data.number);
    },

    // 更新视图
    updateView(type) {
        if (typeof type == 'number') {
            this.sprite_itemView.spriteFrame = this.list_itemView[type];
        } else {
            cc.log('type is null or params error!----view');
        }
    },

    // 更新效果时间
    updateEffectTime(type) {

        if (typeof type == 'number') {
            // console.log(type,'40');
            this.sprite_itemEffectTime.spriteFrame = this.list_effectTime[type];
        } else {
            cc.log('type is null or params error---effectTime!');
        }
    },

    // 更新数量
    updateNumber(num) {
        this.label_itemNumber.string = new String(num);
    },


    // 显示浇肥操作
    showFertilization() {
        // console.log(this.data);

        if (this.data.number > 0) {
            cc.director.currentPropsIndex = this.data.type;
            if ((this.data.type >= 0 && this.data.type < 4) || (this.data.type >= 12 && this.data.type < 15)) {
                cc.director.farmDialog.hidePropsView();
                cc.director.farmDialog.showOperateView();
                cc.director.currentPropsIndex = this.data.type;
                // console.log(this.data);
                this.data.mode = 1;
                cc.systemEvent.emit('SHOW_OPERATE', { data: this.data });
            } else {
                let event = new cc.Event.EventCustom('atuoUseProp', true);
                this.data.mode = 1;
                event.detail = { data: this.data };
                this.node.dispatchEvent(event);
                cc.systemEvent.emit('SHOW_OPERATE', { data: this.data });
            }


        }
    },




    start() {

    },

    // update (dt) {},
});
