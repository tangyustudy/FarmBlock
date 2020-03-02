

cc.Class({
    extends: cc.Component,

    properties: {
        rank_farm: require('./rank_farm'),
        farm_shop: require('./farm_shop'),
        farm_friend: require('./farm_friend'),
        farm_warehouse: require('./farm_warehouse'),
        farm_plant: require('./farm_plantPrompt'),
        farm_operate: require('./farm_operateInterface'),
        farm_props: require('./farm_propsPrompt'),
        farm_levelUp: require('./farm_levelUp'),
        farm_message: require('./farm_message'),
        farmLevel_levelUp: require('./farmLevel_levelUp'),
        farm_freeCoins: require('../mainScreen/freeCoinsPanel'),
        farm_landUnlock: require('./farm_unlockLand'),
        farm_plantUnlock: require('./farm_plantUnlock'),
        farm_exchange: require('./farm_exchange'),
        farm_offlineExp: require('./farm_offlineExp'),
        mask: cc.Node,
        node_farm_header: cc.Node,
        node_farm_btnArea: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.farmDialog = this;
        this.farm_operate.addOperateListener();
        cc.systemEvent.on('SHOW_LEVELUP', this.showLevelUpPrompt, this);
        cc.systemEvent.on('SHOW_PLANT_UNLOCK', this.showPlantUnlockPrompt, this);

        // cc.systemEvent.on('SHOW_LAND_UNLOCK',this.showLandUnlockPormpt,this);

    },

    // 隐藏所有子节点
    hideFarmChild() {
        let children = this.node.children;
        let len = children.length;
        for (let i = 0; i < len; i++) {
            children[i].active = false;
        }
    },

    // 展示农场排行
    showFarmRank() {
        this.hideFarmChild();
        this.mask.active = true;
        this.rank_farm.showView();
        // cc.director.SoundManager.playSound('farm_btn');
    },

    // 隐藏农场排行
    hideFarmRank() {
        this.hideFarmChild();
        this.rank_farm.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 展示商店
    showFarmShop() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_shop.showView();
        // cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏商店
    hideFarmShop() {
        this.hideFarmChild();
        this.farm_shop.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 展示好友列表
    showFarmFriend() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_friend.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏好友列表
    hideFarmFriend() {
        // this.hideFarmChild();
        this.farm_friend.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 展示仓库
    showWarehouseView() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_warehouse.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏仓库
    hideWarehouseView() {
        this.hideFarmChild();
        this.farm_warehouse.hideView();


    },

    // 显示种植框
    showPlantPrompt() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_plant.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },


    // 隐藏种植框
    hidePlantPrompt() {
        // this.hideFarmChild();
        this.mask.active = false;
        this.farm_plant.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏 农场等级 按钮
    hideFarmAndBtn() {

        this.node_farm_header.active = true;
        this.node_farm_btnArea.active = false;
    },
    // 显示 农场等级 按钮
    showFarmAndBtn() {
        this.hideFarmChild();
        this.node_farm_header.active = true;
        this.node_farm_btnArea.active = true;
    },

    // 显示种植 、施肥操作界面
    showOperateView() {
        this.hideFarmAndBtn();
        this.farm_operate.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },


    // 隐藏种植 、施肥操作界面
    hideOperateView() {
        this.farm_operate.hideView();
        this.showFarmAndBtn();
        // this.showPlantPrompt();
        cc.director.SoundManager.playSound('farm_btn');
    },

    // 显示道具界面
    showPropsView() {
        this.hideFarmChild();
        this.mask.active = true;
        // this.hideFarmAndBtn();
        this.farm_props.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏道具界面
    hidePropsView() {
        // this.farm_props.showView();
        // this.showFarmAndBtn();
        // this.showPropsView();
        this.mask.active = false;
        this.farm_props.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    hideOperateView1() {
        this.farm_operate.hideView();
        this.showFarmAndBtn();
        this.showPropsView();
    },

    // 显示蔬菜升级的弹框
    showLevelUpPrompt(event) {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_levelUp.showView(event.type);
    },

    // 隐藏升级弹框
    hideLevelUpPrompt() {
        this.hideFarmChild();
        this.farm_levelUp.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    showMessagePrompt() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_message.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    hideMessagePrompt() {
        // this.hideFarmChild();
        this.farm_message.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 显示农场升级的弹框
    showFarmLevelUpPrompt() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farmLevel_levelUp.showView();
    },

    // 隐藏 农场升级的弹框
    hideFarmLevelUpPrompt() {
        this.hideFarmChild();
        this.farmLevel_levelUp.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 显示看视频免费得金币界面
    showFreeCoinsByVideo() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_freeCoins.showView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 隐藏看视频免费得金币按钮
    hideFreeCoinsByVideo() {
        this.hideFarmChild();
        this.farm_freeCoins.hideView();
        cc.director.SoundManager.playSound('farm_btn');

    },

    // 显示土地解锁界面
    showLandUnlockPormpt(obj) {

        this.hideFarmChild();
        this.mask.active = true;
        this.farm_landUnlock.showView(obj);
    },

    // 隐藏土地解锁界面
    hideLandUnlockPropmt() {
        this.hideFarmChild();
        this.farm_landUnlock.hideView();
    },

    // 显示植物解锁界面
    showPlantUnlockPrompt(event) {
        // console.log(event, '267');
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_plantUnlock.showView(event.type);
    },

    // 隐藏植物解锁界面
    hidePlantUnlockPrompt() {
        this.hideFarmChild();
        this.farm_plantUnlock.hideView();
    },

    showExchangePrompt() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_exchange.showView();
    },

    hideExchangePrompt() {
        this.hideFarmChild();
        this.farm_exchange.hideView();
    },

    // 显示离线经验界面
    showOfflineExpPrompt() {
        this.hideFarmChild();
        this.mask.active = true;
        this.farm_offlineExp.showView();
    },

    // 隐藏离线经验界面 
    hideOfflineExpPrompt() {
        this.hideFarmChild();
        this.farm_offlineExp.hideView();
    },

    start() {

    },

    // update (dt) {},
});
