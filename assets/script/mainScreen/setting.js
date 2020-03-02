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

let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        effectBtn: cc.Node,
        musicBtn: cc.Node,
        exitBtn: cc.Node,
        bgmViewList: [cc.SpriteFrame],
        effectViewList: [cc.SpriteFrame],
        btn_changeName: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // 读取音效设置
    loadEffectSetting() {
        let isVoiceOn = cc.director.SoundManager.canSound();
        // cc.director.SoundManager.playSound('btn');
        if (isVoiceOn) {
            // todo 更换按钮图片
            cc.director.SoundManager.openSound();
            Utils.changeLocalNodeTexture(this.effectBtn, this.effectViewList, 0);
            // this.setBgm(1);
        } else {
            cc.director.SoundManager.closeSound();
            Utils.changeLocalNodeTexture(this.effectBtn, this.effectViewList, 1);
            // this.setBgm(2);
        }
    },

    // 读取背景音乐设置
    loadBgmSetting() {
        let isBgmOn = cc.sys.localStorage.getItem('bgm');
        if (!!isBgmOn) {
            isBgmOn = parseInt(isBgmOn);
            if (isBgmOn) {
                this.setBgm(1);
                Utils.changeLocalNodeTexture(this.musicBtn, this.bgmViewList, 0);
            } else {
                this.setBgm(2);
                Utils.changeLocalNodeTexture(this.musicBtn, this.bgmViewList, 1);
            }
        } else {
            cc.sys.localStorage.setItem('bgm', 1);
        }
    },

    // 改变音效
    setEffect() {
        cc.director.SoundManager.playSound('btnEffect');

        let isVoiceOn = cc.director.SoundManager.canSound();
        cc.director.SoundManager.playSound('btn');
        if (isVoiceOn) {
            cc.director.SoundManager.closeSound();
            Utils.changeLocalNodeTexture(this.effectBtn, this.effectViewList, 1);
        } else {
            cc.director.SoundManager.openSound();
            Utils.changeLocalNodeTexture(this.effectBtn, this.effectViewList, 0);
        }
    },

    // 改变背景音乐开关
    setBgmStatus() {
        cc.director.SoundManager.playSound('btnEffect');

        let isBgmOn = cc.sys.localStorage.getItem('bgm');
        if (!!isBgmOn) {
            isBgmOn = parseInt(isBgmOn);
            if (isBgmOn) {
                this.setBgm(2);
                Utils.changeLocalNodeTexture(this.musicBtn, this.bgmViewList, 1);
                cc.sys.localStorage.setItem('bgm', 0);
            } else {
                this.setBgm(1);
                Utils.changeLocalNodeTexture(this.musicBtn, this.bgmViewList, 0);
                cc.sys.localStorage.setItem('bgm', 1);
            }
        }
    },



    showView() {
        this.couldChangeName();
        this.node.active = true;
        Utils.showPromptWithScale(this.node);
    },

    hideView() {
        this.node.active = false;
    },



    // 设置背景音乐的开关
    setBgm(type) {
        let audio = cc.find('Canvas').getComponent(cc.AudioSource);
        if (type == 1) {
            audio.play();
        } else {
            audio.stop();
        }
    },

    // 跳转到主界面
    jumpToMainScreen() {
        cc.director.dialogScript.showQuitView();
        // console.log(GameData.passRate,'123');
    },


    // 判断是否已经更改我名字
    couldChangeName() {

        let localData = cc.sys.localStorage.getItem('localData');
        if (!!localData) {
            localData = JSON.parse(localData);
            if (localData.issetname == 0) {
            } else {
                if(!!this.btn_changeName){
                    this.btn_changeName.getComponent(cc.Button).interactable = false;
                }
                // console.log('不可以改名');
            }
        } else {
            console.log('可以改名')
        }
    },

    // 判断点击是否弹出改名框
    judgeIsNeedDialog() {
        let localData = cc.sys.localStorage.getItem('localData');
        if (!!localData) {
            localData = JSON.parse(localData);
            if (localData.issetname == 0) {
                cc.director.screenDialog.showChangeNamePrompt();
            } else {
                console.log('you had already change your name');
            }
        } else {
            cc.director.screenDialog.showChangeNamePrompt();
        }
    },




    //  关联faceBook
    connectFB() {

        let callback = function (isSucc, lid) {
            // let isSuccess = res.
            if (!isSucc) {
                // 弹出关联失败弹框
                cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 0 });
            } else {
                let localData = cc.sys.localStorage.getItem('localData');
                let uid, params = {};
                if (!!localData) {
                    localData = JSON.parse(localData);
                    if (!!localData.uid && localData.uid != '') {
                        uid = localData.uid;
                    } else {
                        uid = window.NativeManager.getUid();
                    }
                } else {
                    uid = window.NativeManager.getUid();
                }
                params.lid = lid;
                params.country = '';
                params.platform = '';
                let callback1 = function (res) {
                    if (!!res && res.code === 0) {
                        let data = res.data;
                        cc.sys.localStorage.setItem('localData', JSON.stringify(data));
                        // 关联成功
                        cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 1 });

                    } else {
                        // 弹出关联失败弹框
                        cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 0 });

                    }
                }
                cc.director.ServerManager.login(2, uid, params, callback1);
            }
        }
        window.NativeManager.login(callback);
        // cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 0 });

    },


    // // 呼出改名框
    // showChangeNamePrompt(){

    // },




    start() {
    },

    // update (dt) {},
});
