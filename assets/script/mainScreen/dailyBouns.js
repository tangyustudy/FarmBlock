// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// status ： 1：已领取，2：当前可领取，3：未领取
// type ： 0：金币，1：火箭，2：炸弹，3：disco，4：所有
// index: 索引，表示第几天
//number:数量
const dailyBouns = [
    { status: 3, type: 0, number: 30, index: 0, },
    { status: 3, type: 1, number: 1, index: 1, },
    { status: 3, type: 0, number: 60, index: 2, },
    { status: 3, type: 2, number: 1, index: 3, },
    { status: 3, type: 0, number: 90, index: 4, },
    { status: 3, type: 3, number: 1, index: 5, },
]

let Utils = require('../utils');
let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {

        item_daliy: cc.Prefab,
        container: cc.Node,
        seven_Bg:cc.Sprite,
        seven_mark:cc.Node,
        seven_name:cc.Node,
        bgViewList:[cc.SpriteFrame],
        seven_light:cc.Node,
        sevenNode:cc.Node,
        daily_btn:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.on('get_reward', this.getReward, this);

    },

    initDailyBouns(list) {
        this.container.removeAllChildren();
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.item_daliy);
            item.parent = this.container;
            item.getComponent('item_daily').initItem(list[i]);
        }
    },

    getReward(event) {
        let data = event.detail;
        cc.director.SoundManager.playSound('daily');

        if(data.type==0){
            cc.systemEvent.emit('TOOLOBTAIN', data);
        }else{
            cc.systemEvent.emit('DAILY_BOUNS_ANIMA',data);
        }
        cc.director.screenDialog.hideDailyBouns();
        this.updateBouns_got(data);    
    },

    //更新礼物领取数据为已领取
    updateBouns_got(data) {
        let bounsList = cc.sys.localStorage.getItem('bounsList');
        let newBouns;
        if (!bounsList) {
            // cc.sys.localStorage.setItem('bounsList',dailyBouns);
            newBouns = JSON.parse(JSON.stringify(dailyBouns));
        } else {
            newBouns = JSON.parse(bounsList);
        }
        let index = data.index;
        data.status = 1;
        newBouns.splice(index, 1, data);
        cc.sys.localStorage.setItem('bounsList', JSON.stringify(newBouns));
        cc.sys.localStorage.setItem('getReward', 'yes');
        this.recordPlayerGetTimes();
    },

    // 记录玩家的领取次数
    recordPlayerGetTimes() {

        let continueTimes = cc.sys.localStorage.getItem('continueTimes');
        if(!continueTimes){
            cc.sys.localStorage.setItem('continueTimes',JSON.stringify(1));
        }else{
            continueTimes = JSON.parse(continueTimes);
            continueTimes +=1;
            cc.sys.localStorage.setItem('continueTimes',JSON.stringify(continueTimes));
        }
        let currentZeroTime;
        currentZeroTime= Math.floor(new Date(new Date().toLocaleDateString()).getTime() / 1000);
        cc.sys.localStorage.setItem('getBounsTime',JSON.stringify(currentZeroTime));

    },

    // 更新数据为可领取
    updateBouns_coundGet(index) {
        if(index==7){
            return ;
        }
        let bounsList = cc.sys.localStorage.getItem('bounsList');
        if (!!bounsList) {
            bounsList = JSON.parse(bounsList);
            bounsList[index].status = 2;
            cc.sys.localStorage.setItem('bounsList', JSON.stringify(bounsList));
        } else {
            let newBouns = JSON.parse(JSON.stringify(dailyBouns));
            newBouns[index].status = 2;
            cc.sys.localStorage.setItem('bounsList', JSON.stringify(newBouns));
        }

    },

    // 判断哪天是领取当天
    judgeIsCurrentDay() {
       let continueTimes = cc.sys.localStorage.getItem('continueTimes');
       if(!continueTimes){
           return 0;
       }else{
           continueTimes = JSON.parse(continueTimes);
           return continueTimes;
       }
    },

    // 判断第7天是否可以点击领取
    judgeIsSeven(){
        let bounsList = cc.sys.localStorage.getItem('bounsList');
        if(!bounsList){
            return false;
        }else{
            bounsList = JSON.parse(bounsList);
            let count=0;
            for(let i=0;i<bounsList.length;i++){
                if(bounsList[i].status==1){
                    count++;
                }
            }
            if(count==6){
                return true;
            }else{
                return false;
            }
        }
        
    },

    setSevenDaysView(){
        let isSeven = this.judgeIsSeven();
        if(!isSeven){
            //未领取
            this.seven_Bg.spriteFrame = this.bgViewList[2];
            this.seven_mark.active=false;
            this.seven_name.active=true;
            this.sevenNode.getComponent(cc.Button).interactable=false;
        }else{
            // let hadGet = cc.sys.localStorage.getItem('getReward');
            let continueTimes = cc.sys.localStorage.getItem('continueTimes');
            if(!!continueTimes && JSON.parse(continueTimes)==6){
                let sevenGet = cc.sys.localStorage.getItem('sevenReward');
                // console.log(sevenGet,'173');
                if(!!sevenGet){
                    // 已领取
                    this.seven_Bg.spriteFrame = this.bgViewList[0];
                    this.seven_mark.active=true;
                    this.seven_name.active=true;
                    this.seven_light.active=false;
                    this.sevenNode.getComponent(cc.Button).interactable=false;

                }else{
                      // 可领取
                    this.seven_Bg.spriteFrame = this.bgViewList[1];
                    this.seven_mark.active=false;
                    this.seven_light.active=true;
                    this.seven_name.active=false;
                    this.sevenNode.getComponent(cc.Button).interactable=true;
                    this.seven_light.runAction(
                        cc.rotateBy(2,90).repeatForever()
                    )
                }
                
            }else{

                if(JSON.parse(continueTimes) >= 7){
                    this.seven_Bg.spriteFrame = this.bgViewList[0];
                    this.seven_mark.active=true;
                    this.seven_name.active=true;
                    this.seven_light.active=false;
                    this.sevenNode.getComponent(cc.Button).interactable=false;
                }else{
                       //未领取
                    this.seven_Bg.spriteFrame = this.bgViewList[2];
                    this.seven_mark.active=false;
                    this.seven_name.active=true;
                }
               
            }

        }


    },

    // 领取第七天的礼物
    getSevenDaysReward(){
        let sevenReward = [
            { type: 0, number: 300},
            { type: 1, number: 1,},
            { type: 2, number: 1, },
            { type: 3, number: 1, },
        ];
        //  金币，炸弹，火箭，disco，
        // console.log('hehehehehe');
        for(let i=0;i<sevenReward.length;i++){
            GameData.changeGameTool('gameTool', sevenReward[i].number, sevenReward[i].type - 1, true);
            setTimeout(function(){
                if(sevenReward[i].type==0){
                    cc.systemEvent.emit('TOOLOBTAIN', sevenReward[i]);
                }else{
                    cc.systemEvent.emit('DAILY_BOUNS_ANIMA',sevenReward[i]);
                }
            },i*2000);    
        }
        cc.sys.localStorage.setItem('sevenReward','yes');
        cc.sys.localStorage.setItem('getReward','yes');
        this.recordPlayerGetTimes();
        cc.director.screenDialog.hideDailyBouns();

    },



    // 点击领取按钮
    clickToGetReward(){
        let isSeven = this.judgeIsSeven();
        cc.director.SoundManager.playSound('daily');
        if(!isSeven){
            let index = this.judgeIsCurrentDay();
            let bounsList = cc.sys.localStorage.getItem('bounsList');
            if(!!bounsList){
                bounsList = JSON.parse(bounsList);
                if(bounsList[index].status==2){
                    if(bounsList[index].type==0){
                        cc.systemEvent.emit('TOOLOBTAIN', bounsList[index]);
                    }else{
                        cc.systemEvent.emit('DAILY_BOUNS_ANIMA',bounsList[index]);
                    }

                    cc.director.screenDialog.hideDailyBouns();
    
                    this.updateBouns_got(bounsList[index]);
                }
                if(bounsList[index].status==1){
                }
            }else{
            }
        }else{
            let continueTimes = cc.sys.localStorage.getItem('continueTimes');
            if(!!continueTimes && JSON.parse(continueTimes)==6){
                let sevenGet = cc.sys.localStorage.getItem('sevenReward');
                if(!!sevenGet){
                    // 已领取
                    // console.log('已经领取');
                }else{
                    this.getSevenDaysReward();
                }
            }
        }

        
    },


    showView() {
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
        let bouns = cc.sys.localStorage.getItem('bounsList');
        if (!!bouns) {
            bouns = JSON.parse(bouns);
            this.initDailyBouns(bouns);
        } else {
            let index = this.judgeIsCurrentDay();
            this.updateBouns_coundGet(index);
            let bouns = cc.sys.localStorage.getItem('bounsList');
            bouns = JSON.parse(bouns);
            this.initDailyBouns(bouns);
            cc.sys.localStorage.removeItem('getReward');
        }
        this.setSevenDaysView();
        let isReward = cc.sys.localStorage.getItem('getReward');
        if(!!isReward){
            this.node.getChildByName('claim').getComponent(cc.Button).interactable=false;
        }
    },

    hideView() {
        this.node.active = false;
        this.daily_btn.scale=1;
        // this.daily_btn.stopAllActions();
        this.daily_btn.getComponent(cc.Animation).stop('dailyIconAnima');
    },


    // update (dt) {},
});
