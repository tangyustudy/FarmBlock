const delayTime = 3;

cc.Class({
    extends: cc.Component,

    properties: {
        label_tips_text: cc.Label,
        label_plant_number: cc.Label,
        sprite_plant_view: cc.Sprite,
        list_plant_seed: [cc.SpriteFrame],
        list_plant_props: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('UPDATE_OPERATE_NUMBER', this.updatePlantNumber, this);
    },


    addOperateListener() {
        cc.systemEvent.on('SHOW_OPERATE', this.updateOperateView, this);
        this.operateTextList = [
            'In using the seeds',
            'In using the props',
        ];
    },

    updatePlantNumber(event) {
        // console.log(event, '30');
        this.updateLabelString(event.number, this.label_plant_number);
        if (event.number == 0) {
            this.scheduleOnce(
                function () {
                    if (cc.director.currentPlantIndex >= 0) {
                        cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1010 });
                    } else if (cc.director.currentPropsIndex >= 0) {
                        cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1011 });
                    }
                }, 1.5
            );

            this.scheduleOnce(function () {
                this.showPromptByMode();
            }, delayTime);
        }
    },

    updateOperateView(event) {
        // console.log(event.data, '30');
        let data = event.data;
        this.data = data;
        // 更新提示文字
        this.updateLabelString(this.operateTextList[data.mode], this.label_tips_text);
        this.updateLabelString(data.number, this.label_plant_number);
        // 更新视图
        if (data.mode == 0) {
            this.updateSpriteView(this.sprite_plant_view, this.list_plant_seed, data.type);
        } else if (data.mode == 1) {
            this.updateSpriteView(this.sprite_plant_view, this.list_plant_props, data.type);
        };
    },

    // 更新label
    updateLabelString(str, label) {
        label.string = new String(str);
    },

    // 更新图示
    updateSpriteView(sprite, viewList, index) {
        sprite.spriteFrame = viewList[index];
    },

    showView() {
        this.node.active = true;
        cc.systemEvent.emit('HIDE_LAND_STATUE');
    },

    hideView() {
        this.node.active = false;
        //  将种植的类型成-1；表示不在种植状态
        cc.director.currentPlantIndex = -1;
        cc.director.currentPropsIndex = -1;
        //  this.showPromptByMode();
        cc.systemEvent.emit('SHOW_LAND_STATUE');
    },

    showPromptByMode() {
        // console.log(this.data.mode);
        cc.director.farmDialog.hideOperateView();
        if (this.data.mode == 0) {
            cc.director.farmDialog.showPlantPrompt();
        } else if (this.data.mode == 1) {
            cc.director.farmDialog.showPropsView();
        }
    },




    start() {
        // this.updateLabelString(0,this.label_tips_text);
    },

    // update (dt) {},
});
