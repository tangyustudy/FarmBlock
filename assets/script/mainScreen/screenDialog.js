// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils');

cc.Class({
    extends: cc.Component,

    properties: {
        mask:cc.Node,
        startPrompt:require('./startPrompt'),
        boxPanel:require('./boxPanel'),
        setting:require('./setting'),
        gameToolShop:require('./gameToolShop'),
        freeCoinsPanel:require('./freeCoinsPanel'),
        dailyBouns:require('./dailyBouns'),
        reviewUs:require('./reviewUs'),
        lottery:require('./lottery'),
        hinderPreview:require('./hinderPreview'),
        // webviewTest:require('./webviewTest'),
        rank:require('./rank'),
      
        tips:cc.Node,
        tipsViewList:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on('TIPS_SUCCESS',this.showTips,this);
     
        cc.director.screenDialog = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyBackDown,this);

    },

    keyBackDown(event){
        switch(event.keyCode){  
            case cc.macro.KEY.back :
                let isSubmit = cc.sys.localStorage.getItem('gameEvaluation');
                if(!isSubmit){
                    this.showGameEvaluation(1);
                }else{
                    window.NativeManager.reportReview(0);
                }
            break;
        }
    },
    
    // 隐藏所有子节点
    hideAllChild(){
        let children = this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].active=false;
        }
        // this.hideLoadingAnimation();
    },

    // 显示游戏开始弹框
    showStartPrompt(){
        this.hideAllChild();
        this.mask.active=true;
        this.startPrompt.showView();
        cc.director.SoundManager.playSound('btnEffect');
        // window.NativeManager.showInterstitialAd(2);
    },

    // 隐藏游戏开始框
    hideStartPrompt(){
        this.hideAllChild();
        this.startPrompt.hideView();
        cc.director.SoundManager.playSound('btnEffect');

    },

    // 显示奖励盒子的界面
    showBoxPanel(e){
        let node = e.target;
        let color;
        if(node.name=='pinkBox'){
            color=2;
        }else{
            color=1;
        }
        this.hideAllChild();
        this.mask.active=true;
        this.boxPanel.showView(color);
        cc.director.SoundManager.playSound('btnEffect');

    },

    // 隐藏游戏盒子的界面
    hideBoxPanel(){
        this.hideAllChild();
        this.boxPanel.hideView();
        cc.director.SoundManager.playSound('btnEffect');
    },

    // 显示设置界面
    showSettingPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        this.setting.showView();
    },

    // 隐藏设置界面
    hideSettingPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.setting.hideView();
    },


    // 展示提示语

    showTips(event){
        this.tips.stopAllActions();
        this.tips.scale=0.1;
        this.tips.active=true;
        let tips_word = this.tips.getChildByName('wordSprite').getComponent(cc.Sprite);
        tips_word.spriteFrame =this.tipsViewList[event.wordIndex]; 
        let action =  cc.sequence(
            cc.spawn(
                cc.scaleTo(0.5,1),
                cc.fadeIn(0.5),
            ),
            cc.delayTime(1),
            cc.fadeOut(0.5),
        )
        action.tag = 1;
        this.tips.runAction(action);
    },

    // 显示购买弹框
    showGameToolShop(type,index){
        this.hideAllChild();
        this.mask.active=true;
        this.gameToolShop.showView(type,index);
      
    },

    // 关闭购买弹窗
    hideGameToolShop(){

        this.hideAllChild();
        this.gameToolShop.hideView();

    },


    // 显示看视频得金币弹窗
    showCoinsPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        this.freeCoinsPanel.showView();
    },

    // 隐藏看视频的金币弹窗
    hideCoinsPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.freeCoinsPanel.hideView();
    },

    //显示每日奖励
    showDailyBouns(){
        cc.systemEvent.emit('END_FINGER_GUIDE');
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        this.dailyBouns.showView();
        window.NativeManager.showInterstitialAd(2);
    },

    hideDailyBouns(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.dailyBouns.hideView();
    },

    // 显示游戏评价
    showGameEvaluation(type){
        if(!!this.reviewUs.node.active){
            return ;
        }
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;        
        this.reviewUs.showView(type);
    },

    // 关闭
    hideGameEvaluation(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.reviewUs.hideView();
    },


    // 显示抽奖界面
    showLotteryView(){
        cc.systemEvent.emit('END_FINGER_GUIDE');
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        this.lottery.showView();        
    },

    // 隐藏抽奖界面
    hideLotteryView(){
        cc.director.SoundManager.playSound('btnEffect');
        // this.hideAllChild();
        // this.mask.active=false;
        this.lottery.hideView();      
    },

    //  显示元素预览界面
    showHinderPreview(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.hinderPreview.showView();
    },

    hideHinderPreview(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.hinderPreview.hideView();
    },

    // 显示webview
    showWebView(){
        window.NativeManager.goForum();
    },

    // 分享到fb
    shareGame(){
        window.NativeManager.goShare();
    },

    // 显示排行
    showRankView(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        this.rank.showView();
    },  

    // 隐藏排行
    hideRankView(){
        cc.director.SoundManager.playSound('btnEffect');

        this.hideAllChild();
        this.rank.hideView();
    },

  

    // 显示改名框
    showChangeNamePrompt(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChild();
        this.mask.active=true;
        // this.changeName.showView();
        cc.systemEvent.emit('CHANGE_NAME_SHOW');
      
    },

    // 关闭改名框
    hideChangeNamePrompt(){
        cc.director.SoundManager.playSound('btnEffect');
        // this.changeName.hideView();
        this.showSettingPanel();
        cc.systemEvent.emit('CHANGE_NAME_HIDE');
    },

    // 显示提示框
    showTipsPromptView(){
        
    },


    // 隐藏提示框
    hideTipsPromptView(){

    },


    start () {
        this.setting.loadEffectSetting();
        this.setting.loadBgmSetting();
    },

    // update (dt) {},
});
