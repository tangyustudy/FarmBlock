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
let Config = require('../psconfig');
const targetPos = [cc.v2(-160, 180), cc.v2(0, 180), cc.v2(160, 180)];
const coinsNumber = 180;
const max_life = Config.MAX_LIFE;
cc.Class({
    extends: cc.Component,
    properties: {
        toolList: [cc.Node],
        toolBox: cc.Node,
        firework: cc.ParticleSystem,
        btn_claim: cc.Node,
        nameList: [cc.SpriteFrame],
        toolViewList: [cc.SpriteFrame],
        blueBoxStatusView: [cc.SpriteFrame],
        pinkBoxStatusView: [cc.SpriteFrame],
        name_title: cc.Sprite,
        light: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 显示
    showView(color) {
        // console.log(color, '31');
        this.color = color;
        this.name_title.spriteFrame = this.nameList[this.color - 1];
        let isFirstTime = cc.sys.localStorage.getItem('isFirstTime');
        if (!isFirstTime) {
            this.packageList = this.pakageType([0, 1, 3]);
            cc.sys.localStorage.setItem('isFirstTime', 'no');
        } else {
            this.packageList = this.pakageType(this.randomBoxReward());
            // 当玩家的生命值低于3时，打开箱子必给生命；
            if(GameData.lifeNumber<3){
                this.packageList.pop();
                this.packageList.push({type:8,number:1});
            }

        }

        this.node.active = true;

        Utils.showPromptWithScale(this.node);
        // 将箱子设置成闭合状态
        this.changeBoxStatus(0, color);
        this.hideToolList();
        // this.scheduleOnce(function () {
        // this.toolFromBoxEffect(this.packageList);
        this.toolFromBoxBefore(this.toolBox);
        // }, 1)

        this.scheduleOnce(function () {
            this.toolFromBoxEffect(this.packageList, color);
        }, 0.7)

        this.btn_claim.active = false;
        this.light.runAction(
            cc.rotateBy(2, 100).repeatForever()
        )
    },

    hideView() {

        if (this.color == 1) {
            cc.sys.localStorage.setItem('blueMark', 'no');

            GameData.currentStar >= 20 ? GameData.currentStar -= 20 : GameData.currentStar = 0;
            GameData.storeGameData();

            cc.find('Canvas').getComponent('mainScreen').updateBlueBoxStarNumber();
        }
        if (this.color == 2) {
            let times = cc.sys.localStorage.getItem('pinkMark');
            if (!!times) {
                times = JSON.parse(times);
                if (times > 0) {
                    times--;
                    cc.sys.localStorage.setItem('pinkMark', JSON.stringify(times));
                }
            }
            // cc.sys.localStorage.setItem('pinkMark','no');
            cc.find('Canvas').getComponent('mainScreen').updateNextOpenLevel();
        }

        this.node.active = false;
        this.hideToolList();
        this.afterObtainAnimation();
        this.light.stopAllActions();

    },


    // 改变箱子的闭合状态
    changeBoxStatus(type, color) {

        let box = this.toolBox.getChildByName('box');
        if (color == 1) {
            Utils.changeLocalNodeTexture(box, this.blueBoxStatusView, type);
        } else {
            Utils.changeLocalNodeTexture(box, this.pinkBoxStatusView, type);
        }
    },

    // 执行领取后的动画
    afterObtainAnimation() {

        for (let i = 0; i < this.packageList.length; i++) {
            let pos = this.node.convertToWorldSpaceAR(targetPos[i]);
            cc.systemEvent.emit('TOOLOBTAIN', {
                pos: pos,
                type: this.packageList[i].type,
                number: this.packageList[i].number,
            })
        }
    },



    // 隐藏所有得道具节点
    hideToolList() {
        for (let i = 0; i < this.toolList.length; i++) {
            let item = this.toolList[i];
            item.active = false;
            item.scale = 1;
            item.rotation = 0;
            item.stopActionByTag(1);
            item.position = this.toolBox.position;
        }

    },


    // 道具从箱子里面出来前的动画
    toolFromBoxBefore(node) {
        let self = this;
        let action =
            // cc.sequence(
            cc.sequence(
                cc.rotateBy(0.1, 15),
                cc.rotateBy(0.1, -15),
                cc.callFunc(
                    function () {
                        node.rotation = 0;
                    }
                )
            ).repeat(3);

        // );
        node.runAction(action);

    },



    // 道具从宝箱里面冲出来的效果
    toolFromBoxEffect(dataList, color) {
        this.changeBoxStatus(1, color);
        for (let i = 0; i < this.toolList.length; i++) {
            let item = this.toolList[i];
            let icon = item.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = this.toolViewList[dataList[i].type];
            let count = this.toolList[i].getChildByName('count').getComponent(cc.Label);
            count.string = dataList[i].number;
            this.scheduleOnce(function () {
                cc.director.SoundManager.playSound('flyTool');
                this.swallowEffect(this.toolBox);
                this.toolAction(item, targetPos[i]);
                if (i == this.toolList.length - 1) {
                    this.btn_claim.active = true;
                }
            }, i * 1);
        }
    },


    // 道具的旋转帧动画
    toolAction(node, pos) {
        node.stopActionByTag(1);
        node.active = true;
        node.position = this.toolBox.position;
        node.scale = 0.01;
        let action = cc.spawn(
            cc.rotateBy(0.5, 360),
            cc.scaleTo(0.5, 1),
            cc.moveTo(0.5, pos),
        );
        action.tag = 1;
        node.runAction(action);
    },

    // 盒子的吞咽效果
    swallowEffect(node) {
        let action = cc.sequence(
            cc.scaleTo(0.2, 1.1),
            cc.scaleTo(0.2, 1),
        )
        action.tag = 2;
        node.runAction(action);
        this.firework.node.active = true;
        this.firework.resetSystem();
    },


    // 随机宝箱奖励类型
    randomBoxReward() {
        let list;
        if (GameData.lifeNumber < max_life) {
            list = [0, 1, 2, 3, 4, 5, 6, 8];
        }
        else {
            list = [0, 1, 2, 3, 4, 5, 6];
        }

        let rewardList = [];
        while (rewardList.length < 3) {
            let random = Math.floor(Math.random() * (list.length - 1));
            if (!this.checkList(rewardList, list[random])) {
                rewardList.push(list[random]);
            }
        }
        rewardList.sort(function (a, b) {
            return a - b;
        });
        return rewardList;
    },

    // 根据类型来封装数据
    pakageType(list) {
        let dataList = [];
        for (let i = 0; i < list.length; i++) {
            let item = {};
            item.type = list[i];
            if (list[i] == 0) {//0 表示类型为金币
                item.number = this.randomCoinsNumber();
            } else {
                item.number = 1;
            }
            dataList.push(item);
        }
        return dataList;
    },


    // 返回随机的金额
    randomCoinsNumber() {
        // let num = Math.ceil(Math.random() * 10) + 10;
        let num = coinsNumber + Math.ceil(Math.random() * 12) * 10;
        return num;
    },


    // 检测是否存在相同的数字
    checkList(array, item) {
        return array.some(function (elem, index, arr) {
            return elem == item;
        });
    },


    start() {

    },

    // update (dt) {},
});
