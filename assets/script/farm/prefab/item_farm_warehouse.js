// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        view: cc.Node,
<<<<<<< HEAD
        list_view: [cc.SpriteFrame],
=======
        list_view:[cc.SpriteFrame],
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        label_number: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    // 更新数量
    initItemDetail(data) {
        // console.log(data,'27');
        this.data = data;
        this.updateNumber(data.number);
        this.updateView(data.type);
    },

    updateNumber(num) {
        if (typeof num == 'number') {
            this.label_number.string = '' + num;
<<<<<<< HEAD
        } else {
=======
        }else{
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            cc.log('The params is not number!');
        }
    },

    // 更新纹理
<<<<<<< HEAD
    updateView(type) {
        if (typeof type == 'number') {
=======
    updateView(type){
        if(typeof type=='number'){
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            this.view.getComponent(cc.Sprite).spriteFrame = this.list_view[type];
        }
    },

    onTouchEnd() {
        let event = new cc.Event.EventCustom('click_item', true);
<<<<<<< HEAD
        event.detail = {
            index: this.data.index,
            number: this.data.number,
            type: this.data.type,
        }
        this.btnClickEffect(this.view);
        this.scheduleOnce(
            function () {
                this.node.dispatchEvent(event);
            }, 0.2
        )

=======
        event.detail  = {
            index:this.data.index,
            number:this.data.number,
            type:this.data.type,
        }
        this.node.dispatchEvent(event);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        cc.director.currentPlantIndex = this.data.type;
    },


<<<<<<< HEAD
    btnClickEffect(node, callback) {
        let action = cc.sequence(
            cc.scaleTo(0.1, 0.85),
            cc.scaleTo(0.1, 1),
            cc.callFunc(function () {
                if (!!callback) {
                    callback();
                }
            })
        );
        node.runAction(action);
    },
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9




<<<<<<< HEAD
=======
    
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9



    start() {

    },

    // update (dt) {},
});
