const ServerManager = require('../ServerManager');
const FarmUtils = require('./framUtils');
const FarmData = require('./FarmData');
const NativeManager = require('../NativeManager');

cc.Class({
    extends: cc.Component,
    properties: {
        item_friend: cc.Prefab,
        itemContainer: cc.Node,
        label_aciton_number: cc.Label,
        btn_askHelp: cc.Button,
        scrollView: cc.ScrollView,

        mask: cc.Node,
        helpPrompt: cc.Node,
        node_btn_claim: cc.Node,
        node_tips: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('helpFriendWater', this.helpFriendWater, this);
    },


    initFriendContainer() {
        let list = this.friendList;
        console.log(this.friendList);
        if (!list || list.length <= 0) {

            // todo   这里需要有明确的提示
            cc.log('no data, please try later!');

            return;
        }
      
        let len = list.length;
        let index = -1;
        for (let i = 0; i < len; i++) {
            let item = cc.instantiate(this.item_friend);
            item.parent = this.itemContainer;
            list[i].index = i;
            if (list[i].self == 1) {

                item.getComponent('item_friend').initItem_Friend(list[i], true);
                index = i;
            } else {
                item.getComponent('item_friend').initItem_Friend(list[i]);
            }
        }

        if (index >= 0) {
            let data = list[index];
            this.onList(data);
        } else {
            this.btn_askHelp.node.active = true;
            this.btn_askHelp.interactable = true;
            this.node_btn_claim.active = false;
            this.node_tips.active = true;
        }

    },

    helpFriendWater(event) {
        let index = event.detail.index;
        let count = event.detail.count;
        let id = event.detail.id;
        let actionMove = this.getHelpTime();
        console.log(count, '54');
        if (actionMove > 0 && count < 5) {
            actionMove--;
            cc.sys.localStorage.setItem('helpLimited', actionMove);
            let childNode = this.itemContainer.children[index];

            childNode.getComponent('item_friend').updateHelpCount(count + 1);
            this.updateActionMoves(actionMove);
            let stamp = FarmUtils.getServerTime();
            cc.sys.localStorage.setItem('actionMovesCostTime', stamp);

            // 加农场经验
            let tempObj = FarmData.OperationReward[5];
            let exp = tempObj.exp;
            let coins = tempObj.coins;
            cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: cc.v2(0, 0) });

            let data = {};
            data.id = id;
            data.time = stamp;

            // 保存用户的操作行为
            // this.saveUserOperate(event.detail);
            console.log(data);
            this.saveUserOperate(data);
        } else {
            cc.log('error:sorry,you have no action moves or had finished help!');
        }
    },

    // 获得可浇水的好友列表
    getWaterFriendList() {
        let self = this;
        
        let uid, localData = FarmUtils.getLocalData('localData');
      
        if (!!localData) {
            if (localData.uid == '') {
                uid = window.NativeManager.getUid();
            } else {
                uid = localData.uid;

            }
        } else {
            uid = window.NativeManager.getUid();
        }
     
        let callback = function (res) {
            if (!!res) {
                self.friendList = res.data.list;
            }
        }
        ServerManager.getHelpList(uid, callback);
        // ServerManager.getHelpMessage(uid,callback);

    },


    // 记录用户的操作信息
    saveUserOperate(item) {

        this.needSubmitData.push(item);
        // console.log(this.needSubmitData);

    },

    // 提交浇水数据到服务器
    submitWaterDataToServer() {
        if (this.needSubmitData.length <= 0) {
            return;
        }
        console.log(JSON.stringify(this.needSubmitData));
        FarmUtils.updateFarmData(2, JSON.stringify(this.needSubmitData), 0);
        this.needSubmitData = [];
    },

    getHelpTime() {
        let time = cc.sys.localStorage.getItem('helpLimited');
        if (!!time) {
            time = parseInt(time) >= 0 ? parseInt(time) : 0;
        } else {
            time = 3;
        }
        return time;
    },

    // 更新行动力
    updateActionMoves(num) {
        if (!num) {
            this.label_aciton_number.string = new String(this.getHelpTime());
        } else {
            this.label_aciton_number.string = new String(num);
        }
    },

    // 看视频得行动力
    getActionsMovesByVideo() {
        let watchTimes = this.getVideoWatchTimes();
        if (watchTimes > 0) {
            let time = this.getHelpTime();
            time += 2;
            if (time >= 5) {
                time = 5;
            }
            this.updateActionMoves(time);
            cc.sys.localStorage.setItem('helpLimited', time);
            watchTimes--;
            cc.sys.localStorage.setItem('farmFriendVideWatchTimes', watchTimes);

        } else {
            console.log('tips:no enough times');
        }

    },

    //发起浇水帮助申请 
    askWaterHelp() {
        // 滚动到最底端
        let item = cc.instantiate(this.item_friend);
        // let myInfo = { name: 'handsome', help: 0, farmLevel: 4, countryIndex: 1 };
        let myInfo = this.composeMyInfo();
        item.getComponent('item_friend').initItem_Friend(myInfo, true);
        item.parent = this.itemContainer;

        // 如何判断我是否已经在列表上 
        // todo

        // this.node_btn_askHelp.interactable = false;
        this.scrollView.scrollToBottom(1);

    },

    // //   判断我是否在列表
    // isOnList(){

    // },

    //如果我已经在列表上 
    onList(data) {

        if (data.helpcount > 0) {
            this.btn_askHelp.node.active = true;
            this.btn_askHelp.interactable = false;
            this.node_btn_claim.active = false;
            this.node_tips.active = true;
        } else {
            this.node_btn_claim.active = true;
            this.btn_askHelp.node.active = false;
            this.node_tips.active = false;
        }
    },


    // 组合我的信息
    composeMyInfo() {
        let farmInfo = cc.game.FarmUtils.getLocalData('localFarmInfo');
        let localData = cc.game.FarmUtils.getLocalData('localData');
        let myInfo = {};
        myInfo.fmlevel = farmInfo.level;
        myInfo.helpCount = 0;
        myInfo.name = localData.name;
        myInfo.country = localData.country;
        myInfo.self = 1;
        return myInfo;
    },



    // 判断是否同一天
    judgeIsSameDay() {
        let serverTime = cc.sys.localStorage.getItem('ServerTime');
        serverTime = parseInt(serverTime);
        let actionMovesCostTime = cc.sys.localStorage.getItem('actionMovesCostTime');
        let isSame;
        if (!actionMovesCostTime) {
            isSame = false;
        } else {
            actionMovesCostTime = parseInt(actionMovesCostTime);
            isSame = cc.game.FarmUtils.campareTwoStamp(serverTime, actionMovesCostTime);
        }
        if (isSame) {
            console.log('heiheihei');
        } else {
            console.log('gee~~~~~~');
            // 重置数据
            let t = cc.game.FarmUtils.getServerTime();
            cc.sys.localStorage.setItem('actionMovesCostTime', t);
            cc.sys.localStorage.setItem('farmFriendVideWatchTimes', 1);
            cc.sys.localStorage.setItem('helpLimited', 3);
        }

    },

    // 获得看视频得行动力的次数
    getVideoWatchTimes() {

        let videoWatchTimes = cc.sys.localStorage.getItem('farmFriendVideWatchTimes');
        if (!!videoWatchTimes) {
            videoWatchTimes = parseInt(videoWatchTimes);
        } else {
            videoWatchTimes = 1;
        }
        return videoWatchTimes;

    },

    showView() {
        this.restartView();
        this.judgeIsSameDay();
        this.node.active = true;
        this.fromTopToCenter(this.node);
        this.getWaterFriendList();
        this.scheduleOnce(
            function () {
                this.initFriendContainer();
                cc.systemEvent.emit('HIDE_CACHE_ANIMA');

            },
            1.5
        )
        // this.initFriendContainer();
        this.updateActionMoves();
        this.needSubmitData = [];
    },


    hideView() {
        // this.node.active = false;
        this.fromCenterToTop(this.node);
        this.submitWaterDataToServer();
        cc.systemEvent.emit('HIDE_CACHE_ANIMA');
    },


    // 显示领取奖励界面
    showGetHelpRewardPrompt() {
        this.mask.active = true;
        this.helpPrompt.active = true;
    },

    hideGetHelpRewardPrompt() {
        this.mask.active = false;
        this.helpPrompt.active = false;
    },


    // 领取双倍奖励
    getDoubleReward() {
        let self = this;
        // let callback = function(res){
        //     if(!!res){
        self.hideGetHelpRewardPrompt();
        cc.director.farmDialog.hideFarmFriend();
        cc.systemEvent.emit('WATER_ALLLAND_TIME', { number: 10 })
        //     }
        // }

        // let hasVideo = NativeManager.hasRewardVideo();
        // if(!!hasVideo){
        //     NativeManager.showRewardVideo(callback);
        // }else{
        //     console.log('sorry,please try later!');
        // }

    },

    // 领取奖励
    getReward() {
        this.hideGetHelpRewardPrompt();
        cc.director.farmDialog.hideFarmFriend();
        cc.systemEvent.emit('WATER_ALLLAND_TIME', { number: 5 })
    },

    // 初始化所有的设置
    restartView(){
        this.btn_askHelp.node.active = false;
        this.node_btn_claim.active = false;
        this.node_tips.active = false;
        this.itemContainer.removeAllChildren();
    },


     // 从上往下进入界面
     fromTopToCenter(node) {
        let windowSize = cc.view.getDesignResolutionSize();
        node.position = cc.v2(0, (windowSize.height + node.height) / 2);
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, 0)).easing(cc.easeBackOut(3.0)),
            cc.callFunc(function(){
                cc.systemEvent.emit('SHOW_CACHE_ANIMA');
            })
        )
        
        node.runAction(action);
        
    },

    // 从中间往上回缩
    fromCenterToTop(node) {
        // let self=this;
        let windowSize = cc.view.getDesignResolutionSize();
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, (windowSize.height + node.height) / 2)).easing(cc.easeBackIn(3.0)),
            cc.callFunc(
                function () {
                    node.active = false;
                    cc.director.farmDialog.mask.active=false;
                }
            )

        )
        node.runAction(action);
    },



    start() {

    },

    // update (dt) {},
});
