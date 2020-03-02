// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const rotate = 210;

cc.Class({
    extends: cc.Component,

    properties: {
        blueBox: cc.Node,
        mask: cc.Node,
        container: cc.Node,
        pinkBox: cc.Node,
        wordList: [cc.SpriteFrame],
        word: cc.Sprite,
        explainNode: cc.Node,
        gameToolMask: cc.Node,

        circle_finger: cc.Node,
        circle: cc.Node,
        finger: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('START_FINGER_GUIDE', this.startFingerGuide, this);
        cc.systemEvent.on('END_FINGER_GUIDE', this.endFingerGuide, this);
        this.guideTempList = [];
    },

    // 提示星星收集箱子
    tipsStarCollectBox() {

        this.boxType = 1;
        this.mask.active = true;
        let blueBox = cc.instantiate(this.blueBox);
        let wp = this.blueBox.parent.convertToWorldSpaceAR(this.blueBox.position);
        blueBox.removeComponent(cc.Widget);
        blueBox.parent = this.container;
        blueBox.position = this.container.convertToNodeSpaceAR(wp);
        // let node = container.getChildByName('explain_prompt').getChildByName('word');
        this.word.spriteFrame = this.wordList[this.boxType - 1];
        let arrow = this.container.getChildByName('arrow');
        arrow.active = true;
        arrow.rotation = rotate;
        this.arrowAnimation(arrow);

    },

    // 提示等级箱子
    tipsLevelBox() {

        this.boxType = 2;
        let blueBox = this.container.getChildByName('blueBox');
        if (!!blueBox) {
            blueBox.removeFromParent();
        }
        this.mask.active = true;
        let pinkBox = cc.instantiate(this.pinkBox);
        let wp = this.pinkBox.parent.convertToWorldSpaceAR(this.pinkBox.position);
        pinkBox.removeComponent(cc.Widget);
        pinkBox.parent = this.container;
        pinkBox.position = this.container.convertToNodeSpaceAR(wp);
        this.word.spriteFrame = this.wordList[this.boxType - 1];
        let arrow = this.container.getChildByName('arrow');
        arrow.active = true;
        arrow.rotation = -rotate;
        this.arrowAnimation(arrow);

    },


    stepByType() {
        cc.director.SoundManager.playSound('btnEffect');
        if (this.boxType == 1) {
            this.tipsLevelBox();
        } else if (this.boxType == 2) {
            this.hideView();
            cc.sys.localStorage.setItem('boxGuide', 'yes');
            cc.systemEvent.emit('DAILYSIGN_GUIDE');
        } else if (this.boxType == 3) {
            this.hideView();
            cc.sys.localStorage.setItem('gameToolGuide', 'yes');
        }
    },


    // 箭头动画
    arrowAnimation(node) {

        node.scale = 0.5;
        node.runAction(
            cc.sequence(
                cc.scaleTo(1, 0.45),
                cc.scaleTo(1, 0.65),
            ).repeatForever()
        )

    },

    //隐藏
    hideView() {
        // this.arrow.active=false;
        let arrow = this.container.getChildByName('arrow');
        arrow.active = false;
        this.explainNode.active = false;
        // this.blueBox.active = this.pinkBox.active = false;
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(function () {
                    this.node.active = false;
                }.bind(this))
            )
        )
        // this.node.active=false;
    },


    // 显示屏幕指引
    showScreenGuide() {
        this.mask.opacity = 180;
        this.node.active = true;
        this.container.active = true;
        // this.arrow.active=true;
        this.explainNode.active = true;
        this.explainNode.position = cc.v2(0, 0);
        this.gameToolMask.active = false;
        this.tipsStarCollectBox();
    },

    // 游戏道具引导
    showGameToolGuide() {
        let local = cc.sys.localStorage.getItem('gameToolGuide');
        if (!!local) {
            return;
        }
        this.boxType = 3;
        this.node.active = true;
        this.mask.active = false;
        this.gameToolMask.active = true;
        this.explainNode.active = true;
        this.explainNode.position = cc.v2(this.gameToolMask.position.x, this.gameToolMask.position.y + 350);
        this.gameToolGuide();
    },

    gameToolGuide() {
        this.word.spriteFrame = this.wordList[this.boxType - 1];
    },


    //  手指引导显示；
    guideGestureShow() {
        let pinkNode = this.container.getChildByName('pinkBox');
        if (!!pinkNode) {
            pinkNode.removeFromParent();
        }
        this.node.active = true;
        this.node.opacity = 255;
        this.circle_finger.active = true;
        this.circle_finger.zIndex = 3;
        this.fingerCircleAnimation();
    },

    // 手指缩放指示，光圈缩放
    fingerCircleAnimation() {
        let self = this;
        let action_circle = cc.sequence(
            cc.callFunc(function () {
                self.circle.scale = 3;
            }),
            cc.scaleTo(2, 0.1),
        ).repeatForever();
        let action_finger = cc.sequence(
            cc.scaleTo(0.5, 1.05),
            cc.scaleTo(1, 0.95),
            cc.scaleTo(0.5, 1),
        ).repeatForever();

        this.finger.runAction(action_finger);
        this.circle.runAction(action_circle);

    },



    // 手指引导隐藏
    guideGestureHide() {

        this.circle_finger.active = false;
        this.finger.stopAllActions();
        this.circle.stopAllActions();

    },


    // 启动手指引导操作
    startFingerGuide(event) {

        // this.node.active=true;
        this.mask.active = true;
        let targetNode = cc.instantiate(event.targetNode);
        targetNode.parent = this.node;
        this.guideTempList.push(targetNode);
        let pos = this.node.convertToNodeSpaceAR(event.worldPos)
        this.circle_finger.position = pos;
        this.guideGestureShow();
    },

    // 关闭手指引导指示
    endFingerGuide() {
        if (!!this.mask.active) {
            this.mask.active = false;
            // console.log(this.guideTempList, 222);
            if (this.guideTempList.length > 0) {
                while (this.guideTempList.length > 0) {
                    let node = this.guideTempList.pop();
                    node.removeFromParent();
                }
                this.guideGestureHide();
            }
        }
    },

    // 移除添加到guide节点下的所有按钮子节点。


    start() {
        // this.tipsStarCollectBox();
        // this.tipsLevelBox();
        // this.guideGestureShow();
    },

    // update (dt) {},
});
