// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require('./utils');
let GameData = require('./gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        //    progress_inner1:cc.Node,
        //    progress_inner2:cc.Node,
        mask: cc.Node,
        pine: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.bool = true;
        cc.director.preloadScene('mainScreen');
        this.mask.width = 0;
        window.NativeManager = require('./NativeManager');
        cc.director.NativeManager = require('./NativeManager');
        window.NativeManager.splashBegin();
        // cc.director.Utils = require('./utils');
        // cc.director.GameData = require('./gameData');
        cc.director.RegistManager = require('./RegistManager');
        cc.director.ServerManager = require('./ServerManager');
        cc.game.on(cc.game.EVENT_HIDE, this.updateInfo, this);

    },

    fadeInAndOut() {
        this.bool = !this.bool;
        this.progress_inner1.active = this.bool;
        this.progress_inner2.active = !this.bool;
    },

    progressAnimation() {
        let randomNum = Math.floor(20 + Math.random() * 100);

        this.mask.width + randomNum < this.mask.parent.width ? this.mask.width += randomNum : this.mask.width = this.mask.parent.width;

        this.pine.position = cc.v2(this.mask.width, 0);
    },

    jumpToMainScreen() {
        window.NativeManager.splashBegin();
        this.schedule(this.progressAnimation, 0.5);
        this.scheduleOnce(function () {

            window.NativeManager.splashEnd();
            // if (cc.director.gameLoadingSuccess) {
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.5),
                    cc.callFunc(function () {
                        cc.director.loadScene('mainScreen');
                    })
                )
            )
            // }

        }, 5)
    },


    updateInfo() {
        let data = GameData.getGameData();
        Utils.updateGameInfo(data);
<<<<<<< HEAD
        // console.log('event_onGameHide');
=======
        console.log('event_onGameHide');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    },


    //  后台获取用户信息，初始化用户名 并实行登陆
    autoFillPlayerInformation() {
        let self = this;
        let callback = function (res) {
            self.checkLocalData(res);
        };
        let uid, index;
        let localData = cc.sys.localStorage.getItem('localData');
        if (!!localData) {
            localData = JSON.parse(localData);
            if (localData.uid == '') {
                uid = window.NativeManager.getUid();
                let countryCode = window.NativeManager.getCountryCode();
                index = cc.director.RegistManager.getCountryAvatarIndex(countryCode);
            } else {
                uid = localData.uid;
                index = localData.country;
            }
        } else {
            uid = window.NativeManager.getUid();
            let countryCode = window.NativeManager.getCountryCode();
            index = cc.director.RegistManager.getCountryAvatarIndex(countryCode);
        }
        let params = {};
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            params.platform = 'android';
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            params.platform = 'ios';
        } else {
            params.platform = 'android';
        }
        params.country = index;
        params.lid = '';
        uid = '109';
        if (uid == '') {
            cc.director.gameLoadingSuccess = true;
<<<<<<< HEAD
            // console.log('error : login failed');
=======
            console.log('error : login failed');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            // this.jumpToMainScreen();
        } else {
            cc.director.ServerManager.login(1, uid, params, callback);
        }
    },

    // 校验本地数据
    checkLocalData(data) {
        let detail = data.data;
        if (data.code == 0) {
            cc.director.gameLoadingSuccess = true;
        }
<<<<<<< HEAD
        // console.log(detail, 'loading,112');
=======
        console.log(detail, 'loading,112');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        let timeStamp = detail.lasttime;
        let localData = cc.sys.localStorage.getItem('localData');
        if (!localData) {
            if (data.code == 0) {
                cc.sys.localStorage.setItem('localData', JSON.stringify(detail));
                this.dataSync(detail);
            }

        } else {

            localData = JSON.parse(localData);
            let data = GameData.getGameData();
            if (!timeStamp) {
                // 12.26 todo 
                // 可能存在第一次登陆失败，但玩家留下了游戏数据，等玩家第二次登陆时发现本地存在数据，这时候应该用本地数据去更新服务器数据。
                Utils.updateGameInfo(data);

            } else {
                // 当服务器时间比本地时间新的时候，覆盖数据
                if (timeStamp > localData.lasttime) {
                    cc.sys.localStorage.setItem('localData', JSON.stringify(detail));
                    this.dataSync(detail);
                } else {
                    // 用本地数据覆盖服务器的时间
                    Utils.updateGameInfo(data);
                }
            }
        }
    },

    // {name:"newname", level:255, star:0, lasttime:0(当前更新时间时间戳), data:"jsonstring"}

    // 数据同步
    dataSync(data) {
<<<<<<< HEAD
        // console.log(data, 'loading ,134');
=======
        console.log(data, 'loading ,134');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        // 最高等级 
        GameData.bestLevel = data.level;
        // 星星总数
        GameData.totalStar = data.star;
        // 金币
        GameData.starCount = data.coin;
        if (!!data.data) {
            // 等级同步
            let tool = JSON.parse(data.data);
            // 游戏道具数量同步
            GameData.gameToolList = tool.game;
            // 玩家道具的数量同步
            if (tool.player.length > 0) {
                GameData.game_prop = tool.player;
            } else {
                GameData.game_prop = [
                    { type: 0, name: 'battle', number: 0, },
                    { type: 1, name: 'fork', number: 0, },
                    { type: 2, name: 'hammer', number: 0, },
                    { type: 3, name: 'dice', number: 0, }
                ];
            }

        } else {
<<<<<<< HEAD
            // console.log('data.data is not exist!!');
=======
            console.log('data.data is not exist!!');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        }

        // 保存数据
        GameData.storeGameData();

    },

    // 当游戏进入后台时，记录当前的数据
    recordGame() {

    },


    // 读取旧数据
    loadLocalData() {
        let data = GameData.getGameData();
        if (!!data) {
            GameData.overlapGameData(data);
        } else {
            GameData.initAllGameData();
            GameData.storeGameData();
        }
    },


    start() {
        Utils.resize();
        this.loadLocalData();
        // 自动登录
        this.autoFillPlayerInformation();
        
        // Utils.updateGameInfo(GameData.getGameData());
        // this.updateGameInfo();

        this.jumpToMainScreen();
    },

    // update (dt) {},
});
