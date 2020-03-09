

let Utils = require('../utils');
let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        enterTips: cc.Sprite,
        enterTipsList: [cc.SpriteFrame],
        editBox: cc.EditBox,
        moveTips: cc.Node,
        moveTipsList: [cc.SpriteFrame],

        node_btn_continue:cc.Node,
        list_btn:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showView() {
        let localData = cc.sys.localStorage.getItem('localData');
        if (!!localData) {
          
            localData = JSON.parse(localData);
          
            if (typeof localData.issetname == 'number' && localData.issetname === 0) {
                this.node.active = true;
                Utils.showPromptWithScale(this.node);
                this.initChangeBox();
            } else {
<<<<<<< HEAD
                // console.log('fuck');
            }
        } else {
            cc.director.screenDialog.mask.active = false;
            // console.log('zou le zheli?')
=======
                console.log('fuck');
            }
        } else {
            cc.director.screenDialog.mask.active = false;
            console.log('zou le zheli?')
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            return;
        }
        // 可以改名
    },

    initChangeBox() {
<<<<<<< HEAD
        // console.log(this.editBox);
=======
        console.log(this.editBox);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.editBox.string = '';
        this.editBox.placeholder = 'Enter your name...';
        this.clickTime = 0;
        this.enterTips.spriteFrame = this.enterTipsList[0];
        this.node_btn_continue.getComponent(cc.Sprite).spriteFrame = this.list_btn[0];
    },


    hideView() {
        this.node.active = false;
    },

    //  params: {name:"newname", level:255, star:0, lasttime:0(当前更新时间时间戳), data:"jsonstring"}

    // 点击
    btnClick() {
        let self = this;
        if (this.clickTime == 0) {
            this.name1 = this.editBox.string.trim();
            this.editBox.string = '';
            this.enterTips.spriteFrame = this.enterTipsList[1];
            this.clickTime++;
            this.node_btn_continue.getComponent(cc.Sprite).spriteFrame = this.list_btn[1];
        } else {
            let name2 = this.editBox.string.trim();
           
            if (this.name1 == name2 && this.name1 != '') {
                cc.systemEvent.emit('LOAD_TIPS_SHOW');
                // 更新
                let params = {}, uid;
                params.name = this.name1;
                let callback = function (res) {
                    // LOAD_TIPS_HIDE
                    cc.systemEvent.emit('LOAD_TIPS_HIDE');
                    if (res.code === 0) {
<<<<<<< HEAD
                        // console.log('change name successed');
                        cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 2 });
                        self.hideView();
                    } else if (res.code == 1005) {
                        // console.log('the name is exists');
                        self.moveTipsAnima(0);
                        self.initChangeBox();
                    } else {
                        // console.log(res.code, 'error:', res.msg);
=======
                        console.log('change name successed');
                        cc.systemEvent.emit('TIPS_PROMPT_SHOW', { type: 2 });
                        self.hideView();
                    } else if (res.code == 1005) {
                        console.log('the name is exists');
                        self.moveTipsAnima(0);
                        self.initChangeBox();
                    } else {
                        console.log(res.code, 'error:', res.msg);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
                    }
                };
                let localData = cc.sys.localStorage.getItem('localData');
                if (!!localData) {
                    localData = JSON.parse(localData);
                    if (localData.uid == '') {
                        uid = window.NativeManager.getUid();
                    } else {
                        uid = localData.uid;
                    }
                    cc.director.ServerManager.updateData(2, uid, params, callback);
                } else {
                    uid = window.NativeManager.getUid();
                    cc.director.ServerManager.updateData(2, uid, params, callback);
                }

            } else {
                // 提示两次的输入不一样
<<<<<<< HEAD
                // console.log('两次的输入不一样');
=======
                console.log('两次的输入不一样');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
                this.moveTipsAnima(1);
                this.initChangeBox();
            }
        }

    },

    // 移动提示卡
    moveTipsAnima(type) {
        let self = this;
        this.moveTips.getComponent(cc.Sprite).spriteFrame = this.moveTipsList[type];
        this.moveTips.active = true;
        this.moveTips.stopAllActions();
        this.moveTips.position = cc.v2(0, 0);
        let action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveTo(1, cc.v2(0, 100)).easing(cc.easeOut(3.0)),
            cc.fadeOut(0.5),
            cc.callFunc(function () {
                self.moveTips.active = false;
            })
        )
        this.moveTips.runAction(action);
    },



    start() {

    },

    // update (dt) {},
});
