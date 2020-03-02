
let FarmData = require('./FarmData');
let FarmUtils = require('./framUtils');
const limitedList = FarmData.plantLimitedList;

cc.Class({
    extends: cc.Component,

    properties: {
        btn_seed: cc.Node,
        btn_prop: cc.Node,
        btn_seed_viewList: [cc.SpriteFrame],
        btn_prop_viewList: [cc.SpriteFrame],
        node_seedContainer: cc.Node,
        node_propContainer: cc.Node,
        item_seed: cc.Prefab,
        item_prop: cc.Prefab,
        node_seed: cc.Node,
        node_prop: cc.Node,

        node_coin: cc.Node,
        label_coin_number: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('buy_prop', this.buyProps, this);
        this.node.on('buySeed', this.buySeed, this);
        // this.node.on('updateCoin',this.updateCoins,this);
        this.propPool = new cc.NodePool();
        this.seedPool = new cc.NodePool();
        this.addNumberPool = new cc.NodePool();

    },

    // 初始化种子容器
    initSeedContainer() {
        let currentFarmLevel = FarmUtils.getObjectProperty('localFarmInfo', 'level');
        currentFarmLevel = typeof currentFarmLevel == 'number' ? currentFarmLevel : 1;
        if (this.node_seedContainer.children.length > 0) {
            this.recycleRankItem(this.node_seedContainer, this.seedPool, 'item_farm_seed');
        }
        let shopSeedData = this.composeShopSeedData();
        let len = shopSeedData.length;
        let item;
        for (let i = 0; i < len; i++) {

            if (this.seedPool.size() > 0) {
                item = this.seedPool.get();
            } else {
                item = cc.instantiate(this.item_seed);
            }
            shopSeedData[i].limitedlevel = limitedList[i];
            item.parent = this.node_seedContainer;
            item.getComponent('item_farm_seed').initItemSeed(shopSeedData[i], currentFarmLevel);

        }
    },


    // 组装数据
    composeShopSeedData() {
        // let  item={type:0,price:30,time:1,level:1,amount:10,produce:10,}

        let seedData = FarmUtils.getLocalData('seedData');
        if (!seedData) {
            seedData = FarmData.seedData;
        }
        let shopSeedData = FarmData.shopSeedData;
        let len = shopSeedData.length;
        for (let i = 0; i < len; i++) {
            let shopItem = shopSeedData[i];
            for (let j = 0; j < seedData.length; j++) {
                let seedItem = seedData[j];
                if (shopItem.type == seedItem.type) {
                    shopItem.number = seedItem.number;
                    shopItem.level = seedItem.level;
                    shopItem.name = FarmData.plantInfo[shopItem.type].name;
                    shopItem.timeCost = FarmData.seedLabel[shopItem.type].matureTime;
                    // shopItem.produce = this.computedCurrentProduce(seedItem.basicProduce, seedItem.level);
                    shopItem.produce = FarmData.getPlantProduce(seedItem.level, seedItem.type);
                    break;
                }
            }
        }
        // console.log(shopSeedData);
        return shopSeedData;
    },

    // 计算当前等级的产量   
    computedCurrentProduce(basic, level) {
        // console.log(basic, level);
        let produce = Math.floor(basic * (1 + FarmData.PRODUCE_RATE) ** (level - 1));
        return produce;
    },



    // 初始化肥料容器
    initPropContainer() {
        if (this.node_propContainer.children.length > 0) {
            this.recycleRankItem(this.node_propContainer, this.propPool, 'item_farm_prop');
        }
        let propList = FarmData.propShopList;
        let len = propList.length;
        for (let i = 0; i < len; i++) {
            let item = cc.instantiate(this.item_prop);
            let data = propList[i];
            data.index = i;
            // console.log(data);
            item.getComponent('item_farm_prop').updateItem(data);
            item.parent = this.node_propContainer;
        }
    },


    buyProps(event) {

        let data = event.detail;
        // 扣钱
        // cc.systemEvent.emit('ADD_COINS', -data.price);
        // 改数据
        cc.systemEvent.emit('UPDATE_PROPS', { data: { mode: 1, type: data.type } });

        this.updateCoins();
        this.iconCoinScale();
        cc.director.SoundManager.playSound('farm_shopBuy');

    },

    // 购买种子
    buySeed(event) {
        // console.log(event.detail);
        // 扣钱
        let data = event.detail;
        cc.systemEvent.emit('ADD_COINS', -data.price);
        // 改数据
        cc.systemEvent.emit('UPDATE_SEED', { data: { mode: 1, type: data.type, number: 1 } });

        this.updateCoins();
        this.iconCoinScale();
        cc.director.SoundManager.playSound('farm_shopBuy');

    },



    buySuccess() {

        // 购买成功 播放购买成功的动画
        // 执行扣钱动画
    },

    buyFail() {
        // 购买失败
        // 弹出失败提示
    },


    showSeedContainer() {

        if (this.node_seed.active) {
            return;
        }
        cc.director.SoundManager.playSound('farm_btn');
        this.initSeedContainer();
        this.node_seed.active = true;
        this.node_prop.active = false;
        this.btn_seed.getComponent(cc.Sprite).spriteFrame = this.btn_seed_viewList[0];
        this.btn_prop.getComponent(cc.Sprite).spriteFrame = this.btn_prop_viewList[1];

    },

    showPropContainer() {

        if (this.node_prop.active) {
            return;
        }
        cc.director.SoundManager.playSound('farm_btn');
        this.initPropContainer();
        this.node_seed.active = false;
        this.node_prop.active = true;
        this.btn_seed.getComponent(cc.Sprite).spriteFrame = this.btn_seed_viewList[1];
        this.btn_prop.getComponent(cc.Sprite).spriteFrame = this.btn_prop_viewList[0];

    },



    showView() {

        this.node.active = true;
        this.showPromptWithScale(this.node);
        this.showSeedContainer();
        // console.log('showview');
        this.updateCoins();
    },


    showPromptWithScale(node) {
        node.scale = 0.2;
        node.runAction(
            cc.scaleTo(0.3, 1).easing(cc.easeBackOut(3))
        );
    },


    // 回收节点
    recycleRankItem(node, pool, name) {
        let children = node.children;
        if (children.length > 0) {
            let len = children.length;
            for (let i = len - 1; i >= 0; i--) {
                let child = children[i];
                if (child.name == name) {
                    pool.put(child);
                } else {
                    child.removeFromParent();
                }
            }
        }
    },

    hideView() {

        this.node_prop.active = false;
        this.node_seed.active = false;
        this.node.active = false;

    },
    start() {
        // this.showView();
        // console.log(FarmUtils.getCoins(),'1111'); 

    },

    updateCoins() {
        let coins = FarmUtils.getLocalData('localFarmInfo').coin;
        if (!coins) {
            coins = 0;
        }
        console.log(coins, '217');
        this.label_coin_number.string = coins + '';
    },

    // 金币图标的缩放
    iconCoinScale() {
        let action = cc.sequence(
            cc.scaleTo(0.3, 1.2),
            cc.scaleTo(0.3, 0.9),
            cc.scaleTo(0.1, 1),
        );
        this.node_coin.stopAllActions();
        this.node_coin.runAction(action);
    },






    // update (dt) {},
});
