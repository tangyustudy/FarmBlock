

let GameData = require('../gameData');

const correctDistance = 750;

// todo
const stageList = [5, 7, 14, 19, 24, 39, 59, 89, 129, 179,229];

cc.Class({
    extends: cc.Component,

    properties: {
        previewContainer: cc.Node,
        prefab_item: cc.Prefab,
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // 判断当前玩家处于哪个元素阶段
    judgeElement(level) {

        for (let i = 0; i < stageList.length; i++) {
            if (level < stageList[0]) {
                return false;
            }
            if (level >= stageList[i] && (level < stageList[i + 1] || i == stageList.length - 1)) {
                return i;
            }
        }

    },

    showView() {
        this.node.active = true;
        let index = this.judgeElement(GameData.bestLevel);
        this.addHinderViewItem(index);

    },

    hideView() {
        this.node.active = false;
        this.judgeIsFill();
    },

    // index   statusNumber

    addHinderViewItem(index) {
        let height = 734;
        for (let i = 0; i < stageList.length; i++) {

            let item;
            if (!!this.itemPool && this.itemPool.size() > 0) {
                item = this.itemPool.get();
            } else {
                item = cc.instantiate(this.prefab_item);
            }
            let statusNumber;
            height = item.height;
            if ( typeof index=='boolean'  &&  index == false) {
                if (i == 0) {
                    statusNumber = 2;
                } else {
                    statusNumber = 3;
                }
            } else {
                if (i <= index) {
                    statusNumber = 1;
                } else if (i == index + 1) {
                    statusNumber = 2
                } else {
                    statusNumber = 3;
                }
            }
            item.parent = this.previewContainer;
            let script = item.getComponent('item_hinderPreview');
            script.initItemData(i, statusNumber);
        }
        this.comingSoonHinderPreview();
        this.jumpToCurrentElementPosition(index, height);
    },


    // 敬请期待
    comingSoonHinderPreview(){
        let item;
        if (!!this.itemPool && this.itemPool.size() > 0) {
            item = this.itemPool.get();
        } else {
            item = cc.instantiate(this.prefab_item);
        }
        item.parent = this.previewContainer;
        let script = item.getComponent('item_hinderPreview');
        script.comingSoon();

    },




    judgeIsFill() {
        let chidlren = this.previewContainer.children;
        if (chidlren.length > 0) {
            this.itemPool = new cc.NodePool();
            for (let i = chidlren.length - 1; i >= 0; i--) {
                let item = chidlren[i];
                if (item.name == 'item_hinderPreview') {
                    this.itemPool.put(item);
                } else {
                    item.removeFromParent(true);
                }
            }
        }
    },




    // 自动跳至当前关卡元素位置
    jumpToCurrentElementPosition(index, height) {

        if (typeof index != 'number') {
            index = 0;
        }
        this.previewContainer.y = -index * height - correctDistance;



    },


    start() {

    },

    // update (dt) { 

    // },
});
