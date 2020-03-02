// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mask:cc.Node,
        resultPrompt:require('./component/resultPrompt'),
        retryPrompt:require('./component/retryPrompt'),
        container:require('./component/container'),
        goalDisplay:require('./component/goalDisplay'),
        setting:require('./mainScreen/setting'),
        videoReward:require('./component/viewReward'),
        resultTips:require('./component/resultTips'),
        gameToolShop:require('./mainScreen/gameToolShop'),
        freeCoinsPanel:require('./mainScreen/freeCoinsPanel'),
        quitTips:require('./component/quitTips'),
        progressBar:require('./component/progressBar'),
        tips:cc.Node,
        tipsWordList:[cc.SpriteFrame],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.dialogScript=this;
        cc.systemEvent.on('GAMEVIEW_TIPS',this.showTips,this);
        cc.director.keyCode=-1;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyBackDown,this);
    },

    //响应安卓系统的回退键
    keyBackDown(event){
        //
            switch(event.keyCode){  

                case cc.macro.KEY.back :
                    
                    if(cc.director.keyCode==-1){
                        if(cc.director.toolType>0){
                            // cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                            cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');
                            cc.systemEvent.emit('CLEAR_BTN');
                            cc.director.toolType = -1;
                        }
                        this.showQuitView();

                    }else{
                        if(cc.director.keyCode==1){
                            this.resultPrompt.jumpToMainScreen();
                        }
                        if(cc.director.keyCode==2){
                            this.retryPrompt.jumpToMainScreen();
                        }
                        if(cc.director.keyCode==3){
                            this.showRetryPrompt();
                        }
                        if(cc.director.keyCode==4){
                            this.hidePlayerShop();
                        }
                        if(cc.director.keyCode==5){
                            this.hideFreeCoinsPanel();
                        }
                        if(cc.director.keyCode==6){
                            this.hideQuitView();
                        }
                    }

                 break;
            }
    },



    // 隐藏子节点
    hideAllChildrenNode(){
        cc.director.keyCode=-1;
        let children = this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].active=false;
        }
    },


    // 显示过关界面
    showResultPromptView(list){
        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
        this.hideAllChildrenNode();
        cc.director.keyCode=1;
        this.mask.active=true;
        this.resultPrompt.showView(list);
        // window.NativeManager.showInterstitialAd(3);
    },

    // 隐藏过关界面
    hideResultPromptView(){
        this.hideAllChildrenNode();
        this.resultPrompt.hideView();
    },

    // 显示重新开始界面
    showRetryPrompt(){
        this.hideAllChildrenNode();
        cc.director.keyCode=2;
        this.mask.active=true;
        this.retryPrompt.showView();
        cc.director.SoundManager.playSound('lose');
        window.NativeManager.showInterstitialAd(3);
    },

    // 隐藏重新开始按钮
    hideRetryPrompt(){
        this.hideAllChildrenNode();
        this.retryPrompt.hideView();
    },

    // 展示目标
    showLevelGoal(list){
        this.goalDisplay.initGoalNumber(list);
    },

    // 显示设置界面
    showSettingPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChildrenNode();
        this.mask.active=true;
        this.setting.showView();
    },

    // 隐藏设置界面
    hideSettingPanel(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChildrenNode();
        this.setting.hideView();
    },

    // 显示增加步数界面
    showVideoRewardView(){
       
        this.hideAllChildrenNode();
        cc.director.keyCode=3;
        this.mask.active=true;
        this.videoReward.showView();
    },

    // 隐藏增加步数界面
    hideVideoRewardView(event){
        let tag ;
        let node=event.target;
        if(!!node && node.name =='close'){
            tag=0;
        }else{
            tag=1;
        }

        this.hideAllChildrenNode();
        this.videoReward.hideView(tag);

    },

    // 显示结果提示界面
    showResultTipsView(type){
        this.hideAllChildrenNode();
        // this.mask.active=true;
        this.resultTips.showView(type);
    },

    // 隐藏结果提示界面
    hideResultTipsView(type){
        this.hideAllChildrenNode();
        this.resultTips.hideView(type);
    },

    // 显示购买界面
    showPlayerShop(type,index){
       
        this.hideAllChildrenNode();
        cc.director.keyCode=4;
        this.mask.active=true;
        this.gameToolShop.showView(type,index);

    },

    // 隐藏购买界面
    hidePlayerShop(){
        this.hideAllChildrenNode();
        this.gameToolShop.hideView();
    },

    //显示看视频界面
    showFreeCoinsPanel(index){
       
        this.hideAllChildrenNode();
        cc.director.keyCode=5;
        this.mask.active=true;
        this.freeCoinsPanel.showView(index);
        
    },

    // 隐藏看视频界面
    hideFreeCoinsPanel(){
        this.hideAllChildrenNode();
        this.freeCoinsPanel.hideView();
    },

    // 显示放弃提示
    showQuitView(){
        this.hideAllChildrenNode();
        this.mask.active=true;
        this.quitTips.showView();
        cc.director.keyCode=6;
    },

    hideQuitView(){
        this.hideAllChildrenNode();
        this.quitTips.hideView();

    },


    // 展示提示语

    showTips(event){
        // let pre  = this.tips.getActionByTag(1);
        // if(!!pre && !pre.isDone()){
        //     return ;
        // }
        this.tips.stopAllActions();
        this.tips.scale=0.1;
        this.tips.active=true;
        let adSprite = this.tips.getChildByName('adSprite').getComponent(cc.Sprite);
        adSprite.spriteFrame =this.tipsWordList[event.wordIndex]; 
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


    start () {
        this.setting.loadEffectSetting();
        this.setting.loadBgmSetting();
    },

    // update (dt) {},
});
