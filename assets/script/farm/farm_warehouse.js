
let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');

cc.Class({
    extends: cc.Component,

    properties: {
        warehouse_container: cc.Node,
        item_vagetable: cc.Prefab,
        item_prompt_view: cc.Sprite,
        display_view_list: [cc.SpriteFrame],
        // display_view_icon: cc.Sprite,
        // display_view_icon_list: [cc.SpriteFrame],
        // display_count: cc.Label,
        // price: cc.Label,
        mask: cc.Node,
        node_prompt: cc.Node,
        node_sell: cc.Node,
        label_prompt_number: cc.Label,
        node_prompt_name: cc.Sprite,
        label_btn_sell_price: cc.Label,
        label_btn_sell_totalPrice: cc.Label,

        node_null: cc.Node,

        node_btn_sellAll: cc.Node,

        node_farmer: cc.Node,

        node_btn_add: cc.Node,
        node_btn_reduce: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.on('update_display', this.updateDisplay, this);
        this.node.on('click_item', this.showItemDeatailPrompt, this);
    },

    // updateDisplay(event) {
    //     let data = event.detail;
    //     this.display_view.spriteFrame = this.display_view_list[data.index];
    //     this.display_view_icon.spriteFrame = this.display_view_icon_list[data.index];
    //     this.display_count.string = data.count + '';
    //     this.price.string = data.price + '';
    // },

    showItemDeatailPrompt(event) {
        // console.log(event.detail, 'warehouse 35');
        let data = event.detail;
        let detail = {};
        let plantInfo = FarmData.plantInfo;
        let item, index = -1;
        for (let i = 0; i < plantInfo.length; i++) {
            if (plantInfo[i].type == data.type) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            item = plantInfo[index];
        } else {
            cc.log('warehouse error: no type! ');
            return;
        }

        if (!!item) {
            detail.name = item.name;
            detail.price = item.price;
            detail.type = item.type;
            detail.number = data.number;
            this.showItemPrompt(detail);
            // this.updatePromptView();
        }

    },

    // 更新item弹窗的数据
    updatePromptView(data) {
        this.data = data;
        console.log(data);
        // this.node_prompt_name = data.name + '';
        this.label_prompt_number.string = data.number + '';
        this.label_btn_sell_price.string = data.number * data.price + '';
        this.item_prompt_view.spriteFrame = this.display_view_list[data.type];
        this.itemCount = data.number;
        this.addItemNumber();
    },

    // 增加
    addItemNumber() {
        if (this.itemCount < this.data.number) {
            this.itemCount++;
            this.label_prompt_number.string = this.itemCount + '';

        } else {
            this.label_prompt_number.string = this.itemCount + '';
        }
        this.label_btn_sell_price.string = this.itemCount * this.data.price + '';
    },

    //减少
    reduceItemNumber() {

        if (this.itemCount > 1) {

            this.itemCount--;
            this.label_prompt_number.string = this.itemCount + '';

        } else {
            this.label_prompt_number.string = this.itemCount + '';
        }
        this.label_btn_sell_price.string = this.itemCount * this.data.price + '';

    },

    // 显示
    showItemPrompt(data) {
        this.itemNumberMax = data.number;
        this.itemCount = 1;
        this.mask.active = true;
        this.node_prompt.active = true;
        FarmUtils.showPromptWithScale(this.node_prompt);
        this.updatePromptView(data);
    },

    // 关闭
    hideItemPrompt() {

        this.mask.active = false;
        this.node_prompt.active = false;

    },

    test(event) {
        console.log(event, '1111111111111');
    },

    /**
    * 处理长按逻辑
    *
    * @param touchCounter 本次长按触摸次数
    * @param customEventData 在属性检查器中传入进来的 CustomEventData
    */
    handleMiddleBtnTouchLogic(touchCounter, customEventData) {
        // 这里演示效果为：
        //  如果长按回调次数小于等于3次的，那么 累计次数 = 累计次数 + 1
        //  如果长按回调次数大于3次的，那么 累计次数 = 累计次数 + 权重公式后的结果
        if (touchCounter <= 3) {
            this.counter++;
        } else {
            // PS: 实际使用，开发者需要根据自己的期望权重递增公司来编写，这里仅为演示
            this.counter += Math.ceil((touchCounter - 3) * 1.003);
        }
        // this.label_prompt_number.string = `累计计数 ${this.counter} 次`;
    },

    addNumber(touchCounter) {
        if (this.itemCount < this.itemNumberMax) {
            if (touchCounter <= 3) {
                this.itemCount++;
            } else {

                this.itemCount += Math.ceil((touchCounter - 3) * 1.003);
            }
        } else {
            this.itemCount = this.itemNumberMax;
        }
        this.label_prompt_number.string = this.itemCount + '';
        this.label_btn_sell_price.string = this.itemCount * this.data.price + '';
    },

    reduceNumber(touchCounter) {
        if (this.itemCount > 0) {
            if (touchCounter <= 3) {
                this.itemCount--;
            } else {
                this.itemCount = 0;
            }
        }
        this.label_prompt_number.string = this.itemCount + '';
        this.label_btn_sell_price.string = this.itemCount * this.data.price + '';
    },



    // 初始化仓库
    initWarehouseContainer() {
        this.recycleItem();
        let data = FarmUtils.getLocalData('warehouseData');
        let len;
        if (!!data) {
            len = data.length;
            if (len <= 0) {
                this.node_null.active = true;
                this.node_btn_sellAll.getComponent(cc.Button).interactable = false;
                return;
            } else {
                this.node_btn_sellAll.getComponent(cc.Button).interactable = true;
                this.node_null.active = false;
            }

            for (let i = 0; i < len; i++) {
                let item;
                if (!this.itemPool) {
                    this.itemPool = new cc.NodePool();
                    item = cc.instantiate(this.item_vagetable);
                } else {
                    if (this.itemPool.size() > 0) {
                        item = this.itemPool.get();
                    } else {
                        item = cc.instantiate(this.item_vagetable);
                    }
                }
                let obj = data[i];
                obj.index = i;
                item.getComponent('item_farm_warehouse').initItemDetail(obj);
                item.parent = this.warehouse_container;
            }
        } else {
            // console.log('进来了么？');
            this.node_null.active = true;
            this.node_btn_sellAll.getComponent(cc.Button).interactable = false;
        }



    },


    recycleItem() {
        let len = this.warehouse_container.children.length;
        if (!!len && len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                let item = this.warehouse_container.children[i];
                // console.log(item);

                if (!this.itemPool) {
                    this.itemPool = new cc.NodePool();
                }
                this.itemPool.put(item);

            }
        }
    },



    // 出售仓库货物
    sell() {

        // 出售
        let data = { type: this.data.type, number: this.itemCount };
        cc.systemEvent.emit('UPDATE_WAREHOUSE', { data: data, mode: 2 });

        // 增加金币
        let coins = this.data.price * this.itemCount;

        // 金币效果
        cc.systemEvent.emit('OBTAIN_COINS', { coin: coins });

        // cc.systemEvent.emit('ADD_COINS', coins);
        // 更新视图
        // cc.systemEvent.emit('UPDATE_FARM_COINS');

        //  隐藏小窗口
        this.hideItemPrompt();
        this.initWarehouseContainer();

    },

    sellAll() {

        let warehouse = FarmUtils.getLocalData('warehouseData');
        for (let i = 0; i < warehouse.length; i++) {
            let data = { type: warehouse[i].type, number: warehouse[i].number };
            cc.systemEvent.emit('UPDATE_WAREHOUSE', { data: data, mode: 2 });
        }

        // 更新金币
        let coins = this.totalEarn;

        // 金币效果
        cc.systemEvent.emit('OBTAIN_COINS', { coin: coins });

        // cc.systemEvent.emit('ADD_COINS', coins);
        // 更新视图
        // cc.systemEvent.emit('UPDATE_FARM_COINS');

        // 隐藏窗口
        this.hideSellAll();
        this.initWarehouseContainer();
    },



    showView() {
        this.node.active = true;
        this.showPromptWithScale(this.node);
        // this.warehouseFadeIn();
        this.initWarehouseContainer();
    },

    hideView() {
        this.node_farmer.active = false;
        this.node.active = false;
    },

    // farmer进场动画 todo

    // 出售按钮的进场动画


    // 显示出售所有农产品的界面
    showSellAll() {
        let totalEarn = this.computedAllPrice();
        this.totalEarn = totalEarn;
        this.mask.active = true;
        this.node_sell.active = true;
        FarmUtils.showPromptWithScale(this.node_sell);
        // 计算所有的农产品价格
        this.label_btn_sell_totalPrice.string = totalEarn + '';
    },

    hideSellAll() {
        this.mask.active = false;
        this.node_sell.active = false;
    },

    showPromptWithScale(node) {
        let self = this;
        node.scale = 0.2;
        node.runAction(
            cc.sequence(
                cc.scaleTo(0.3, 1).easing(cc.easeBackOut(3)),
                cc.callFunc(function () {
                    self.farmerFadeIn();
                })
            )

        );
    },




    computedAllPrice() {
        let warehouse = FarmUtils.getLocalData('warehouseData');
        let plantInfo = FarmData.plantInfo;
        let price, earn, sum = 0;
        if (!!warehouse) {
            let len = warehouse.length;
            for (let i = 0; i < len; i++) {
                let type = warehouse[i].type;
                for (let j = 0; j < plantInfo.length; j++) {
                    if (type === plantInfo[j].type) {
                        price = plantInfo[j].price;
                        break;
                    }
                }
                earn = price * warehouse[i].number;
                sum += earn;
            }
        }
        console.log(sum);
        return sum;
    },

    // 仓库的缓入动画
    warehouseFadeIn() {
        let self = this;
        this.node.position = cc.v2(800, -50);
        this.node_farmer.active = false;
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, -50)).easing(cc.easeIn(3.0)),
            cc.callFunc(function () {
                self.farmerFadeIn();
            })
        );
        this.node.runAction(action);
    },

    farmerFadeIn() {
        this.node_farmer.active = true;
        this.node_farmer.position = cc.v2(-650, 100);
        let action = cc.moveTo(0.5, cc.v2(-100, 100)).easing(cc.easeIn(3.0));
        this.node_farmer.runAction(action);
    },



    // 仓库缓出动画

    warehouseFadeOut() {
        this.node.position = cc.v2(0, -50);
        this.node_farmer.active = false;
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(800, -50)).easing(cc.easeIn(3.0)),
            cc.callFunc(function () {
                // self.hideView();
                cc.director.farmDialog.hideWarehouseView();
            })
        );
        this.node.runAction(action);
    },


    farmerFadeOut() {
        let self = this;
        this.node_farmer.active = true;
        this.node_farmer.position = cc.v2(-100, 100);
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(-650, 100)).easing(cc.easeIn(3.0)),
            cc.callFunc(function () {
                self.warehouseFadeOut();
            })
        );
        this.node_farmer.runAction(action);
        cc.director.SoundManager.playSound('farm_btn');
    },


    closeWarehouse() {
        this.farmerFadeOut();
    },



    start() {
        // this.showView();
    },

    // update (dt) {},
});
