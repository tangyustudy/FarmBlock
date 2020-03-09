
cc.Class({
    extends: cc.Component,

    properties: {
        touchInterval: 0,
        touchEvent: [cc.Component.EventHandler],
        _touchCounter: 0,
        enableMultiTouching: {
            readOnly: true,
            default: false,
        },
        spriteList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    _onTouchStart(event) {
        // 这是为了不支持多点触控
        if (!this.enableMultiTouching) {
            if (this._isTouching) {
                return;
            }

            if (this.node.getBoundingBoxToWorld().contains(event.getLocation())) {
                this._isTouching = true;
            } else {
                this._isTouching = false;
            }

            if (this._isTouching) {
                // 第一次触摸立即回调一次
                this.publishOneTouch();
                // this.btnClickEffect(this.node);

                this.pressDown(this.node);
                // 然后开启计时器，计算后续的长按相当于触摸了多少次
                this.schedule(this._touchCounterCallback, this.touchInterval);
            }
        }
    },

    // 按下的效果展示   
    pressDown(node) {
        let action = cc.scaleTo(0.1, 0.95);
        node.getComponent(cc.Sprite).spriteFrame = this.spriteList[1];
        node.runAction(action);
    },

    // 松开的效果
    releaseUp(node) {
        let action = cc.scaleTo(0.1, 1);
        node.getComponent(cc.Sprite).spriteFrame = this.spriteList[0];
        node.runAction(action);
    },


    _onTouchEnd(event) {
        this._isTouching = false;
        this._touchCounter = 0;
        this.unschedule(this._touchCounterCallback);
        // this.node.runAction(cc.scaleTo(0.1, 1));
        this.releaseUp(this.node);
    },

    _onTouchCancel(event) {
        this._isTouching = false;
        this._touchCounter = 0;
        this.unschedule(this._touchCounterCallback);
        // this.node.runAction(cc.scaleTo(0.1, 1));
        this.releaseUp(this.node);


    },

    _touchCounterCallback() {
        if (this._isTouching) {
            this.publishOneTouch();
        } else {
            this.unschedule(this._touchCounterCallback);
        }
    },

    publishOneTouch() {
        if (!this._isTouching) {
            return;
        }
        this._touchCounter++;
        this.touchEvent.forEach((eventHandler) => {
            eventHandler.emit([this._touchCounter]);
        });
    },


    start() {

        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[0];

    },

    // update (dt) {},
});
