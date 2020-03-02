// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils');

cc.Class({
    extends: cc.Component,

    properties: {
        starList: [cc.Node],
        container: cc.Node,
        submit_btn:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 

    onTouchEnd(event) {

        let location = event.getLocation();
        let nodePosition = this.container.convertToNodeSpaceAR(location);
        // console.log(event.getLocation(),nodePosition);
        // console.log(this.judgeStar(nodePosition));
        let number = this.judgeStar(nodePosition);
        this.starNumber = number;
        this.showStarDisplay(number);
        this.judgeSubmitBtnEnable();
    },

    // 判断手指给了几颗星

    judgeStar(position) {
        const starWidth = this.starList[0].width + 6;
        return Math.ceil(position.x / starWidth);
    },

    // 展示星星
    showStarDisplay(number) {
        for (let i = 0; i < this.starList.length; i++) {
            let item = this.starList[i].getChildByName('star_inner');
            if (i < number) {
                item.active = true;
            } else {
                item.active = false;
            }
        }
    },

    submitGameEvaluation() {
        // console.log('Thanks for your ' + this.starNumber + ' star evaluation！！！');
        cc.sys.localStorage.setItem('gameEvaluation','yes');
        // todo 向服务器提交数据
        window.NativeManager.reportReview(this.starNumber);
        cc.director.screenDialog.hideGameEvaluation();
    },


    showView(type){
        this.showType = type;
        this.node.active=true;
        Utils.showPromptWithScale(this.node);
        this.starNumber=0;
        this.showStarDisplay(this.starNumber);
        this.judgeSubmitBtnEnable();
    },

    hideView(){
        this.node.active=false;
        // todo 向服务器提交数据
        if(this.showType==1 && this.starNumber==0){
            window.NativeManager.reportReview(0);
            // console.log('Thanks for your ' + this.starNumber + ' star evaluation！！！');
        }
      
    },

    // 判断是否能提交
    judgeSubmitBtnEnable(){
        if(this.starNumber>0){
            this.submit_btn.getComponent(cc.Button).interactable=true;
        }else{
            this.submit_btn.getComponent(cc.Button).interactable=false;
        }
    },

    start() {
        this.container.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.showView();
    },

    // update (dt) {},
});
