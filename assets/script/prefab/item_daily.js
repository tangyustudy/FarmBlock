

cc.Class({
    extends: cc.Component,

    properties: {
       reward:cc.Sprite,
       dayView:cc.Sprite,
       bgView:cc.Sprite,
       markView:cc.Node,
       light:cc.Node,
       rewardList:[cc.SpriteFrame],
       dayList:[cc.SpriteFrame],
       bgList:[cc.SpriteFrame],

    },

    initItem(data){
        // console.log(data);
        this.data=data;
        this.judgeStatus(data.status);
        this.changeIndex(data.index);
        this.changeRewardView(data.index);

    },

    //判断是否显示mark
    judgeStatus(statu){
        if(statu==1){
            this.markView.active=true;
        }else{
            this.markView.active=false;
        }

        if(statu==2){
            // 
            this.lightAnimation();
            this.node.getComponent(cc.Button).interactable=true;
            this.reward.node.y=0;
            this.dayView.node.active=false;
        }
        
        this.changeBgView(statu);
    },

    // 改变背景
    changeBgView(statu){
        this.bgView.spriteFrame = this.bgList[statu-1];
    },

    // 改变奖励显示
    changeRewardView(type){
        this.reward.spriteFrame = this.rewardList[type];
    },

    // 发光
    lightAnimation(){
        this.light.active=true;
        this.light.runAction(
            cc.rotateBy(2,90).repeatForever()
        )
    },

    // 改变index；
    changeIndex(index){
        this.dayView.spriteFrame = this.dayList[index];
    },

    // 点击领取
    clickEvent(){
      
        let event =new cc.Event.EventCustom('get_reward',true);
        let pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.data.pos = pos;
        event.detail = this.data;
        this.node.dispatchEvent(event);
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
