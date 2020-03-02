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
       sprite_crops_view:cc.Sprite,
       label_crops_obtain:cc.Label,
       list_cropsView:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    updateDetail(data){
        this.sprite_crops_view.spriteFrame = this.list_cropsView[data.type];
        this.label_crops_obtain.string = '.' +data.number;
    },



    start () {

    },

    // update (dt) {},
});
