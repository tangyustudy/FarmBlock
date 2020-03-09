let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');
const actionTime = 0.25;

cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        item_props: cc.Prefab,
        node_touchNode1: cc.Node,
        node_touchNode2: cc.Node,
<<<<<<< HEAD
        scrollView: cc.ScrollView,
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node_touchNode1.on(cc.Node.EventType.TOUCH_END, this.hideView, this);
        this.node_touchNode2.on(cc.Node.EventType.TOUCH_END, this.hideView, this);
        this.node.on('atuoUseProp', this.autoUseProp, this);
        this.itemPool = new cc.NodePool();
    },

    showView() {
        this.initPropContainer();
        this.node.active = true;
        this.nodeFadeIn();
<<<<<<< HEAD
        this.scrollView.scrollToTop(0.1);
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    },

    initPropContainer() {
        // console.log('1');
        if (this.container.children.length > 0) {
            this.recycleItem();
        }
        let propsData = FarmUtils.getLocalData('propsData');
        if (!propsData) {
            propsData = FarmData.propsData;
            FarmUtils.setLocalData(propsData, 'propsData');
        }
        let item;
        for (let i = 0; i < propsData.length; i++) {
            if (!!this.itemPool && this.itemPool.size() > 0) {
                item = this.itemPool.get();
            } else {
                item = cc.instantiate(this.item_props);
            }
            propsData[i].timeStr = FarmData.propShopList[propsData[i].type].timeStr;
            item.parent = this.container;
            item.getComponent('item_farm_backpack').initItem(propsData[i]);
        }
    },

    recycleItem() {
        // console.log(this.container);
        // let children = this.container.children;
        let item, len = this.container.children.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                item = this.container.children[i];
                if (item.name == 'item_farm_prop') {
                    this.itemPool.put(item);
                } else {
                    item.removeFromParent();
                }
            }
        } else {
            cc.log('error:no children in the container');
        }

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
                cc.moveTo(actionTime, cc.v2(0, startPosY))
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
        cc.director.currentPropsIndex = -1;
        this.nodeFadeOut();
        cc.director.SoundManager.playSound('farm_btn');

    },

    autoUseProp(event) {

        console.log(event.detail);
        let data = event.detail.data;
        if (data.type >= 4 && data.type < 8) {
            // 全局加速
            cc.systemEvent.emit('FERT_ALLLAND_TIME', { type: data.type, mode: 1 });

        } else if (data.type >= 8 && data.type < 12) {
            // 自动浇水
            cc.systemEvent.emit('STARTOVER_AUTOWATER', { type: data.type, mode: 1 });
        }
        this.hideView();
        cc.systemEvent.emit('UPDATE_PROPS', { data: { mode: 2, type: data.type } });

    },


    // 显示农场引导
<<<<<<< HEAD
    showFarmGuide() {
=======
    showFarmGuide(){
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        cc.systemEvent.emit('SHOW_FARM_GUIDE');
    },


    start() {

    },

    // update (dt) {},
});
