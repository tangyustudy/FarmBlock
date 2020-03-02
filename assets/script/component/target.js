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
        viewList: [cc.SpriteFrame],
        nodeList: [cc.Node],
        step: cc.Label,
        hinderListView: [cc.SpriteFrame],
        gameMask: cc.Node,
        resultTips: require('./resultTips'),
        boom_star: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.isPass = false;
        cc.systemEvent.on('NUMBER_COUNT', this.countBlockNumber, this);
        cc.systemEvent.on('STEP_COUNT', this.countGameStep, this);
        cc.systemEvent.on('GAMEMASK_CONTROL', this.controlGameMask, this);
        // this.initTargetNumber();
    },


    // 重置游戏状态
    resumeGameStatues() {
        this.isPass = false;
        this.isGameEnd = false;
        this.initTargetNumber();
    },

    //隐藏节点
    hideTargetNode() {
        for (let i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].active = false;
            let finishIcon = this.nodeList[i].getChildByName('finishIcon');
            finishIcon.active = false;
        }
    },


    // 控制阻隔节点的显示隐藏
    controlGameMask(event) {
        // console.log(event, '49');
        if (event.order == 1) {
            this.gameMask.active = true;
        } else {
            this.gameMask.active = false;
        }
    },


    initTargetNumber() {
        // this.target1 = 0;
        // this.target2 = 0;
        // this.target3 = 0;
        // this.type1 = 0;
        // this.type2 = 0;
        // this.type3 = 0;
        this.targetList = {};
    },



    // 更新节点的tag；
    updateNodeTag(list, step) {
        this.originStep = step;
        this.stepCount = step;
        this.tContent = list;
        this.updateGameStep(this.stepCount);
        this.hideTargetNode();
        let gap = this.computedNodeGap(list.length, this.node, this.nodeList[0]);
        for (let i = 0; i < list.length; i++) {
            let node = this.nodeList[i];
            node.position = cc.v2(gap * (i + 1) + node.width * i + (node.width / 2), 0);
            node.active = true;
            node.name = list[i][0] + '';
            let sprite = node.getChildByName('icon');
            let type = list[i][0] < 20 ? list[i][0] : list[i][0] - 20;
            if (list[i][0] < 20) {
                Utils.changeLocalNodeTexture(sprite, this.viewList, type);
            } else {
                if (list[i][0] == 38) {
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 10);
                } else if (list[i][0] == 39) {
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 11);
                } else if (list[i][0] == 37) {
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 12);
                }
                else {
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, type);
                }
            }
            this.updateTargetNumber(list[i][0], list[i][1]);
            this.targetList[list[i][0] + ''] = list[i][1];

        }

    },


    // 根据type改变target数量
    updateTargetNumber(type, num) {

        // console.log(type,num,'118');

        let children = this.node.getChildByName(type + '');
        let numNode = children.getChildByName('num');
        let number = numNode.getComponent(cc.Label);
        if (num > 0) {
            number.string = num + '';
            numNode.active = true;
            let act = children.getActionByTag(2);
            if (!!act && !act.isDone()) {
                return;
            }
            let action = cc.sequence(
                cc.scaleTo(0.2, 0.9),
                cc.scaleTo(0.2, 1.1),
                cc.scaleTo(0.2, 1),
            );
            action.tag = 2;
            children.runAction(action);

            let star = cc.instantiate(this.boom_star);
            star.parent = children;
            star.getComponent(cc.ParticleSystem).resetSystem();
        } else {
            // number.string = 'ok';
            numNode.active = false;
            let finishIcon = children.getChildByName('finishIcon');
            finishIcon.active = true;
        }
    },

    updateGameStep(num) {
        this.step.string = num + '';
    },



    // 计算节点的位置
    computedNodeGap(num, parent, child) {
        let gap = (parent.width - (num * child.width)) / (num + 1);
        return gap;
    },


    //计算游戏剩余步数
    countGameStep() {

        this.stepCount--;
        if (this.stepCount > 0) {
            this.updateGameStep(this.stepCount);
            if (!this.isPass && this.stepCount == 5) {
                cc.systemEvent.emit('FIVE_STEP_TIPS');
            }
        } else {
            this.isGameEnd = true;
            this.updateGameStep('0');
            cc.director.container.canclePlayerNotice();
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            this.checkDeath();

        }

    },

    checkDeath() {
        // console.log(cc.director.isPine,'164');
        this.scheduleOnce(function () {
            if (cc.director.isPine == 0) {
                if (cc.director.isrunning || cc.director.isSuperTool == 1 || cc.director.needWait == 1) {
                    this.checkDeath();
                } else {
                    // console.log(cc.director.isPine,'172');
                    this.scheduleOnce(function () {
                        if (cc.director.isPine == 0 && !cc.director.isrunning &&!cc.director.isMoving) {
                            this.scheduleOnce(function () {
                                if (!this.isPass) {
                                    //失败的动画
                                    cc.director.dialogScript.showResultTipsView(2);
                                }
                            }, 2);
                        }
                    }, 0.3)
                }
            }
        }.bind(this), 0.5);

    },


    showSuccess() {
        if (cc.director.isSuperTool == 1) {
            this.scheduleOnce(
                function () {
                    this.showSuccess();
                }.bind(this), 0.5
            )
        } else {
            this.scheduleOnce(function () {
                cc.director.dialogScript.showResultTipsView(1);
            }, 2);
        }
    },

    // 判断是否完成目标
    isFinishedTarget() {

        if (this.isPass) {
            return;
        }

        let isFinished = true;
        for (let item in this.targetList) {

            if (this.targetList[item + ''] > 0) {
                isFinished = false;
                break;
            }
        }

        if (isFinished && this.stepCount >= 0) {
            this.isPass = true;
            this.isGameEnd = true;
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            cc.director.container.canclePlayerNotice();
            this.showSuccess();
            // 显示过关的提醒
            // this.scheduleOnce(function () {
            //     cc.director.dialogScript.showResultTipsView(1);
            // }, 2);
            // this.scheduleOnce(function(){
            //     this.isNeedWait(1);
            // },1);

        } else if (cc.director.checkLastPine > 0) {

            if (this.stepCount > 0) {
                cc.director.isPine = 0;
            } else {
                this.scheduleOnce(function () {
                    cc.director.checkLastPine--;
                    if (cc.director.checkLastPine <= 0) {
                        cc.director.dialogScript.showResultTipsView(2);
                    }
                }, 1.1);
            }

        }

    },


    // 将步数转化为游戏道具
    changeStepToRocket(list, startPos) {
        let item = list.pop();
        this.updateGameStep(list.length);
        this.countGameStep();
        cc.systemEvent.emit('FIREINTHEHOLE', {
            startPos: startPos,
            endGrid: item,
            step: this.stepCount,
            // targetList : this.tContent,
        });
        // },0.5);
        if (list.length > 0) {
            this.scheduleOnce(function () {
                this.changeStepToRocket(list, startPos);
            }, 0.1);
        }
    },

    submitPlayerUsedStep() {
        let costStep = this.originStep - this.stepCount;
        let isProp = !!cc.director.isPlayerUsedTool ? 1 : 0;
        // console.log(GameData.bestLevel + 1, this.originStep, costStep, isProp, '289');
        // level, step, isProp
        window.NativeManager.tjReport(GameData.bestLevel + 1, costStep,isProp);
    },


    countBlockNumber(event) {

        let obj = event;
        // console.log(obj.type);
        if (this.judgeType(obj.type) || obj.type == 100) {
            if (obj.type != 100) {
                let name;
                if (obj.type >= 23 && obj.type <= 25) {
                    obj.type = 25;
                } else if (obj.type >= 29 && obj.type <= 36) {
                    obj.type = 29;
                }
                name = obj.type + '';
                // console.log(name, obj.type);
                if (this.targetList[name] >= 0) {
                    if (this.targetList[name] > 0) {
                        this.targetList[name]--;
                    }
                    this.updateTargetNumber(obj.type, this.targetList[name]);

                } else {
                    this.targetList[name] = 0;
                }
            }

            if (event.type != 20) {
                this.isFinishedTarget();
            }

        };

    },

    judgeType(type) {
        let isContain = false;
        // console.log(this.tContent,type);
        for (let i = 0; i < this.tContent.length; i++) {

            if (this.tContent[i][0] == 25) {
                if (type >= 23 && type <= 25) {
                    isContain = true;
                    break;
                }
            } else if (this.tContent[i][0] == 29) {
                if (type >= 29 && type <= 36) {
                    isContain = true;
                    break;
                }
            } else {
                if (this.tContent[i][0] == type) {
                    isContain = true;
                    break;
                }
            }
        }
        return isContain;
    },

    // 获得目标图标的世界坐标
    getTargetIconWolrdPosition(tag) {
        let node = this.node.getChildByName('' + tag);
        if (!!node) {
            let worldPosition = node.parent.convertToWorldSpaceAR(node.position);
            return worldPosition;
        } else {
            return false;
        }

    },

    checkTargetAgain() {
        let isFinished = true;
        for (let item in this.targetList) {

            if (this.targetList[item + ''] > 0) {
                isFinished = false;
                break;
            }
        }
        return isFinished;
    },



    start() {
        // this.updateNodeTag();
    },

    // update (dt) {},
});
