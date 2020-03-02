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
       texture:cc.Sprite,
       viewList:[cc.SpriteFrame],
       bombCount:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // 初始化草地
    initGroundData(type){
        this.bombCount=type;
        this.texture.spriteFrame = this.viewList[this.bombCount-1];
        this.changeTexture(this.texture,this.bombCount-1,this.viewList);
    },
    
    // 草地被炸
    hitGround(){
        if(this.bombCount>0){
            // this.bombCount--;
            // this.texture.spriteFrame = this.viewList[this.bombCount-1];
            this.changeTexture(this.texture,this.bombCount-1,this.viewList);
        }
    },

    // 改变皮肤
    changeTexture(sprite,num,viewList){

        if(!sprite){
            return;
        }

        if(sprite instanceof cc.Sprite){
            sprite.spriteFrame = viewList[num];
        }

        if(sprite instanceof cc.Node){
            sprite.getComponent(cc.Sprite).spriteFrame = viewList[num];
        } 

    },





    start () {

    },

    // update (dt) {},
});
