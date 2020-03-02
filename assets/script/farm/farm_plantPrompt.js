let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');
const actionTime = 0.25;
const limitedList = FarmData.plantLimitedList;
cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        item_plant_seed: cc.Prefab,
        node_touchNode1: cc.Node,
        node_touchNode2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node_touchNode1.on(cc.Node.EventType.TOUCH_END, this.hideView, this);
        this.node_touchNode2.on(cc.Node.EventType.TOUCH_END, this.hideView, this);
        this.itemPool = new cc.NodePool();
        this.node.on('touchBuyBtn', this.touchBuyBtn, this);

    },


    // 初始化种植界面
    initPlantContainer() {
        let currenFarmLevel = FarmUtils.getObjectProperty('localFarmInfo', 'level');
        // console.log(currenFarmLevel,'27');
        currenFarmLevel = typeof currenFarmLevel == 'number' ? currenFarmLevel : 1;
        if (this.container.children.length > 0) {
            this.recycleItem();
        }
        let seedData = FarmUtils.getLocalData('seedData');
        if (!seedData) {
            seedData = FarmData.seedData;
            FarmUtils.setLocalData(seedData, 'seedData');
        }
        let item;
        for (let i = 0; i < seedData.length; i++) {
            if (!!this.itemPool && this.itemPool.size() > 0) {
                item = this.itemPool.get();
            } else {
                item = cc.instantiate(this.item_plant_seed);
            }
            seedData[i].limitedLevel = limitedList[i];
            item.parent = this.container;
            item.getComponent('item_farm_plant_seed').updateItem(seedData[i], currenFarmLevel);
        }

    },

    recycleItem() {
        // let children = this.container.children;
        let item, len = this.container.children.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                item = this.container.children[i];
                if (item.name == 'item_farm_plant_seed') {
                    this.itemPool.put(item);
                } else {
                    item.removeFromParent();
                }
            }
        } else {
            cc.log('error:no children in the container');
        }

    },

    showView() {
        this.initPlantContainer();
        this.node.active = true;
        this.nodeFadeIn();
    },

    nodeFadeIn() {
        let windowSize = cc.view.getDesignResolutionSize();
        let startPosY = -(windowSize.height + this.node.height) / 2;
        let endPosY = -(windowSize.height - this.node.height) / 2;
        let position = cc.v2(0, startPosY);
        this.node.position = position;
        // console.log(windowSize,'52',startPosY);
        let action = cc.spawn(
            cc.fadeIn(actionTime),
            cc.moveTo(actionTime, cc.v2(0, endPosY))
        );
        this.node.runAction(action);
    },

    nodeFadeOut() {

        let self = this;
        let windowSize = cc.view.getDesignResolutionSize();
        let startPosY = -(windowSize.height + this.node.height) / 2;
        let action = cc.sequence(
            cc.spawn(
                cc.fadeOut(actionTime),
                cc.moveTo(actionTime, cc.v2(0, startPosY)),
            ),
            cc.callFunc(function () {
                cc.director.farmDialog.mask.active = false;
                self.node.active = false;
            })
        )
        this.node.runAction(action);

    },


    hideView() {
        // this.node.active = false;
        cc.director.currentPlantIndex = -1;
        cc.director.SoundManager.playSound('farm_btn');
        this.nodeFadeOut();
    },

    touchBuyBtn(event) {
        // console.log(event,'118');
        cc.director.currentPlantIndex = -1;

        // 更细节的做法是根据点击的类型，跳到商店对应商品的位置

        let self = this;
        let windowSize = cc.view.getDesignResolutionSize();
        let startPosY = -(windowSize.height + this.node.height) / 2;
        let action = cc.sequence(
            cc.spawn(
                cc.fadeOut(actionTime),
                cc.moveTo(actionTime, cc.v2(0, startPosY)),
            ),
            cc.callFunc(function () {
                cc.director.farmDialog.mask.active = false;
                self.node.active = false;
                cc.director.farmDialog.showFarmShop();
            })
        )
        this.node.runAction(action);

    },

    // 显示农场引导
    showFarmGuide(){
        cc.systemEvent.emit('SHOW_FARM_GUIDE');
    },



    // start() {   

    // },

    // update (dt) {},
});
