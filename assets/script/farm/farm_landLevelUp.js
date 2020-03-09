// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let FarmData = require('./FarmData');
let FarmUtils = require('./framUtils');
const offsetRight = 80;
const offsetBottom = 30;
const time = 0.3;
cc.Class({
    extends: cc.Component,

    properties: {
        landItem: cc.Prefab,
        container: cc.Node,
        notice: cc.Node,
        farmer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.landDatalist = [
            { level: 1, count: 2, },
            { level: 2, count: 5, },
            { level: 3, count: 9, },
            { level: 4, count: 12, },
            { level: 3, count: 14, },
            { level: 2, count: 5, },
            { level: 2, count: 10, },
            { level: 1, count: 15, },
            { level: 1, count: 5, },
        ];
        this.node.on('isClick', this.isLandCounldClick, this);
        this.itemPool = new cc.NodePool();
        for (let i = 0; i < 9; i++) {
            let item = cc.instantiate(this.landItem);
            this.itemPool.put(item);
        }

    },


    initLandContainer() {

        let landData = FarmUtils.getLocalData('landData');

        for (let i = 0; i < 9; i++) {
            // for()
            if (landData[i].isLock != 3) {
                continue;
            }
            let node;
            if (this.itemPool.size() > 0) {
                node = this.itemPool.get();
            } else {
                node = cc.instantiate(this.landItem);
            }
            node.parent = this.container;
            let pos = FarmData.landPositionList[i];
            node.position = cc.v2(pos.x, pos.y + 60);
            let children = node.getChildByName('bg');
            this.nodeShakeAnimation(children);
            node.getComponent('item_landLevelUp').initItem(this.landDatalist[i], FarmUtils);
            node.zIndex = -1;


        }
    },


    nodeShakeAnimation(node) {

        let action = cc.sequence(
            cc.moveTo(1, cc.v2(node.x, node.y + 5)),
            cc.moveTo(1, cc.v2(node.x, node.y - 5))
        ).repeatForever();
        node.runAction(action);
    },



    // 提示出现
    showNotice(node) {
        let position = cc.v2(offsetRight, (-this.height - node.height) / 2 - offsetBottom);
        let target = cc.v2(offsetRight, (-this.height + node.height) / 2 + offsetBottom);
        // console.log(position, target);
        node.position = position;
        let action =
            // cc.sequence(
            cc.moveTo(time, target);
        // );
        node.runAction(action);
        this.scheduleOnce(
            function () {
                this.showFarmerFingerAanima();
            }, 0.5
        )
    },

    // 提示隐藏
    hideNotice(node) {
        let target = cc.v2(offsetRight, (-this.height - node.height) / 2 - offsetBottom);
        let action = cc.moveTo(time, target);
        node.runAction(action);
    },

    // 显示升级页
    showLandLevelUp() {
        let winSize = cc.view.getDesignResolutionSize();
        this.width = winSize.width;
        this.height = winSize.height;
        cc.systemEvent.emit('BTN_FADE_OUT');
        this.scheduleOnce(function () {
            cc.director.FarmManager.hideLandUnlockPlant();
            this.node.active = true;
            this.initLandContainer();
            this.isLandCounldClick();
            this.showNotice(this.notice);
        }, 0.5);

    },


    // 隐藏升级页
    hideLandLevelUp() {
        this.hideNotice(this.notice);
        // this.hideLandList();
        this.scheduleOnce(function () {
            this.recycleItem();
            this.node.active = false;
            cc.systemEvent.emit('BTN_FADE_IN');
            cc.director.FarmManager.showLandUnlockPlant();
        }, 0.5);
    },

    recycleItem() {
        let children = this.container.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].name == 'item_landLevelUp') {
                children[i].getChildByName('bg').stopAllActions();
                this.itemPool.put(children[i]);
            }
        }
    },


    // 检测每块土地是否可点击升级
    isLandCounldClick() {
        // console.log(this.landList);
        let coin = FarmUtils.getObjectProperty('localFarmInfo', 'coin');
        let children = this.container.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'item_landLevelUp') {
                let script = children[i].getComponent('item_landLevelUp');
                if (script.data.cost <= coin) {
                    children[i].zIndex = 2;

                } else {
                    children[i].zIndex = -1;
                }
            }
        }
    },


    // 定时播放农户竖大拇指的动画
    showFarmerFingerAanima() {
        // let farmer = this.notice.getChildByName('farmer');
        if (!this.count) {
            this.count = 0;
        }
        this.count++;
        if (this.count >= 200) {
            this.count = 0;
            this.farmer.getComponent(cc.Animation).play();
        }
    },

    

    



    start() {

    },

    update(dt) {
        this.showFarmerFingerAanima();
    },
});
