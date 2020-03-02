
let FarmData = require('./FarmData');
let FarmUtils = require('./framUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        carema: cc.Node,
        landContainer: cc.Node,
        ground: cc.Prefab,
        farm: cc.Node,

        waterFall: cc.Prefab,
        insect: cc.Prefab,
        fingerFire: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // this.node 是需要移动的节点
    onLoad() {
        //节点初始位置,每次触摸结束更新
        this.nodePos = this.carema.getPosition();
        this.farm.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.farm.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.farm.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.farm.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        cc.systemEvent.on('UPDATE_FARM', this.updateFarmInfo, this);
        cc.systemEvent.on('UPDATE_LAND', this.updateLandData, this);
        cc.systemEvent.on('UPDATE_WAREHOUSE', this.updateWarehouseData, this);
        cc.systemEvent.on('UPDATE_SEED', this.updateSeedData, this);
        cc.systemEvent.on('UPDATE_PROPS', this.updatePropsData, this);
        cc.systemEvent.on('SAVE_LAND_DATA', this.saveLandInfo, this);
        cc.systemEvent.on('ADD_COINS', this.addCoins, this);
        cc.systemEvent.on('HIDE_LAND_STATUE', this.hideAllPlantStatue, this);
        cc.systemEvent.on('SHOW_LAND_STATUE', this.showAllPlantStatue, this);
        cc.systemEvent.on('FERT_ALLLAND_TIME', this.fertAllLandSpeed, this);
        cc.systemEvent.on('WATER_ALLLAND_TIME', this.waterAllLandSpeed, this);
        cc.systemEvent.on('UPDATE_LAND_STATUE', this.checkLandStatue, this);
        this.farm.on('manager_land', this.managerLandStatues, this);
        // autoWaterTime,protectTime todo
        cc.game.FarmUtils = FarmUtils;
        cc.game.FarmData = FarmData;
        this.init();
        this.initNodePool();
        cc.director.FarmManager = this;

        // 开启碰撞功能
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

    },

    init() {
        cc.director.currentPlantIndex = -1;
        cc.director.currentPropsIndex = -1;
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');

        if (!farmInfo) {
            farmInfo = { level: 1, exp: 0, coin: 0 };
            FarmUtils.setLocalData(farmInfo, 'localFarmInfo');

        }

        if (cc.director.ServerManager) {
            return;
        } else {
            cc.director.ServerManager = require('../ServerManager');
        }


        // console.log('qqqqqqqqqqqqqqqqq');

    },

    // 初始化对象池
    initNodePool() {
        let nodePool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let item = cc.instantiate(this.waterFall);
            nodePool.put(item);
        }
        cc.director.nodePool = nodePool;

        let insectPool = new cc.NodePool();
        let item1;
        for (let j = 0; j < 36; j++) {
            item1 = cc.instantiate(this.insect);
            insectPool.put(item1);
        }
        cc.director.insectPool = insectPool;

    },

    // 测试时间
    testTime() {
        let serverTime = FarmUtils.getServerTime();
        if (!serverTime) {
            let currennt = Math.floor(new Date().getTime() / 1000);
            FarmUtils.saveServerTime(currennt);
            FarmUtils.saveSyncServerTime();
        }
    },


    onTouchStart(event) {
        let fingerFire = cc.instantiate(this.fingerFire);
        let position = event.getLocation();
        // console.log(position,fingerFire);
        let nodePos = this.farm.convertToNodeSpaceAR(position);
        fingerFire.parent = this.farm;
        fingerFire.position = nodePos;
        this.fFire = fingerFire;
        this.fFire.active = false;
    },


    //触摸移动；
    onTouchMove(event) {
        // console.log(event);
        if (Math.abs(event.touch._prevPoint.x - event.touch._startPoint.x) >= 10 || Math.abs(event.touch._prevPoint.x - event.touch._startPoint.x) >= 10) {
            this.fFire.active = true;
        }
        let pos = event.getDelta();
        this.fFire.x += pos.x;
        this.fFire.y += pos.y;

    },
    onTouchEnd() {
        // this.nodePos = this.carema.getPosition(); //获取触摸结束之后的node坐标；
        cc.systemEvent.emit('MANAGER_LAND', { index: 20 });
        this.fFire.removeFromParent();
    },
    onTouchCancel: function () {
        // this.nodePos = this.carema.getPosition(); //获取触摸结束之后的node坐标；
        this.fFire.removeFromParent();
    },
    // update (dt) {},

    // 初始化农场
    initFarmContainer() {
        let positionList = FarmData.landPositionList;
        let landDetail;
        if (FarmUtils.checkLocalData('landData')) {
            landDetail = FarmUtils.getLocalData('landData');
        } else {
            landDetail = FarmData.landDetail;
        }
        // let nextUnlockLandIndex = this.getNextUnlockLand();

        for (let i = 0; i < landDetail.length; i++) {
            let item_land = cc.instantiate(this.ground);
            item_land.position = positionList[landDetail[i].index];
            item_land.parent = this.landContainer;
            // landDetail[i].nextUnlockLandIndex = nextUnlockLandIndex;
            item_land.getComponent('groundLand').initGroundLand(landDetail[i]);
        }
        this.saveLandInfo();
    },


    // 获得即将解锁的土地
    getNextUnlockLand() {
        // const landUnlockLevelList = [
        //     24, 20, 16, 12, 9, 5, 2, 1, 1
        // ];
        let list = FarmData.landUnlockLevelList;
        let currentLevel, farmInfo;
        farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (!!farmInfo) {
            currentLevel = farmInfo.level;
        } else {
            currentLevel = 1;
        }
        console.log(list, currentLevel, '179');
        let index = -1;
        for (let i = 0; i < list.length - 1; i++) {
            if (list[i] > currentLevel && list[i + 1] <= currentLevel) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            return index;
        }
    },

    // 判断升级后是否存在土地进入可解锁阶段
    isLandUnlockBylevelUp() {
        let nextIndex = this.getNextUnlockLand();
        console.log(nextIndex, '191');
        let nextIndexLand = this.landContainer.children[nextIndex];
        let canUnlockLand = this.landContainer.children[nextIndex + 1];
        console.log(nextIndexLand, canUnlockLand);
        let s1 = nextIndexLand.getComponent('groundLand');
        let s2 = canUnlockLand.getComponent('groundLand');
        console.log(s1, s2);
        if (s1.info.isLock == 0) {
            return;
        } else {

            s1.displayLandStatue(0, false);
        }

        if (s2.info.isLock == 3 && s2.info.isLock == 2) {
            return;
        } else {
            s2.displayLandStatue(2, false);
        }

        // let currenntLevel = FarmUtils.getObjectProperty('localFarmInfo', 'level');
    },


    // 更新土地信息
    updateLandData(event) {
        let singleData = event;
        let landData = FarmUtils.getLocalData('landData');
        let index = -1;
        if (!!landData) {
            for (let i = 0; i < landData.length; i++) {
                if (singleData.index == landData[i].index) {
                    index = i;
                }
            }
        }

        if (index >= 0) {
            landData.splice(index, 1, singleData);
        }
        FarmUtils.setLocalData(landData, 'landData');
        // console.log(landData);
    },

    /**
     * 
     * @param {Event} event
     * 设置更新类型，event.mode=1：增加库存
     *                 event.mode=2：减少库存 
     */

    // 更新仓库信息
    updateWarehouseData(event) {
        // let singleData = event;
        let singleData = event.data;
        let warehouseData = FarmUtils.getLocalData('warehouseData');

        // 增加 农作物进仓库的动画

        if (!warehouseData) {
            if (event.mode == 1) {
                warehouseData = [];
                warehouseData.push(singleData);
                cc.systemEvent.emit('OBTAIN_CROPS', { data: singleData, worldPos: event.worldPos });
            } else {
                return;
            }

        } else {
            let len = warehouseData.length;
            if (event.mode == 1) {
                let tag1 = -1;
                for (let i = 0; i < len; i++) {
                    if (singleData.type == warehouseData[i].type) {
                        warehouseData[i].number += singleData.number;
                        tag1 = i;
                        break;
                    }
                }
                if (tag1 < 0) {
                    warehouseData.push(singleData)
                }
                cc.systemEvent.emit('OBTAIN_CROPS', { data: singleData, worldPos: event.worldPos });
            } else {
                let tag2 = -1;
                for (let i = 0; i < len; i++) {
                    if (singleData.type == warehouseData[i].type) {

                        if (singleData.number >= warehouseData[i].number) {
                            warehouseData.splice(i, 1);
                        } else {
                            warehouseData[i].number -= singleData.number;
                        }
                        tag2 = i;
                        break;
                    }
                }
                if (tag2 < 0) {
                    cc.log('error:something wroing when you sell from you warehouse!');
                }
            }

        }
        FarmUtils.setLocalData(warehouseData, 'warehouseData');
    },


    /**
     * 根据每个操作 来增加相应的农场经验
     * @param {Event} event 
     */
    // 更新农场信息
    updateFarmInfo(event) {
        let exp = event.exp;
        let coins = event.coins;
        let worldPos = event.worldPos;
        let num = -1;
        // this.addCoins(coins);
        let islevelUp = false
        cc.systemEvent.emit('ADD_COINS', coins);
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (!farmInfo) {
            farmInfo = { level: 1, exp: 0, coin: 0 };
        }
        let current = farmInfo.level;
        farmInfo.exp += exp;
        this.computedExpLevelUpCount(farmInfo);
        if (current < farmInfo.level) {
            islevelUp = true;
        }

        //进度条 
        num = farmInfo.exp / FarmData.getLevelUpExp(farmInfo.level + 1);

        // console.log(islevelUp, '263');
        FarmUtils.setLocalData(farmInfo, 'localFarmInfo');
        cc.systemEvent.emit('START_TO_END', { worldPos: worldPos, num: num, exp: exp, islevelUp: islevelUp, coins: coins });
        // console.log(worldPos, '197');
    },

    // 计算操作经验能升多少级
    computedExpLevelUpCount(info) {
        // console.log('caocaocaon,nmsl?？？？？？？？？？？？？？？？？？？？？？？？？');
        let nextLevelExp = FarmData.getLevelUpExp(info.level + 1);
        if (nextLevelExp > info.exp) {

        } else {
            info.exp -= nextLevelExp;
            info.level += 1;
            this.computedExpLevelUpCount(info);
        }


    },

    // 金币数量刷新后检测是否有土地是处在可解锁状态的
    checkLandStatue() {
        let landData = FarmUtils.getLocalData('landData');
        if (!!landData) {
            for (let i = 0; i < landData.length; i++) {
                if (landData[i].isLock == 2) {
                    let land = this.landContainer.children[i];
                    if (land.name == 'ground') {
                        land.getComponent('groundLand').displayLandStatue(2, false);
                    }
                }
            }
        }
    },


    // 农场升级后 要判断是否存在解锁的土地
    isLandUnlockedAfterLevelUp(level) {
        // 准确的拿到是哪块土地被解锁了；
        let list = FarmData.landUnlockLevelList;
        let indexList = [];
        for (let i = 0; i < list.length; i++) {
            if (level >= list[i]) {
                indexList.push(i);
            }
        }

        if (indexList.length > 0) {

            let landData = FarmUtils.getLocalData('landData');
            if (!!landData) {
                for (let i = 0; i < indexList.length; i++) {
                    let index = indexList[i];
                    let item = landData[index];
                    if (!!item.isLock) {
                        // this.landContainer.children[index].getComponent('groundLand').isLandLock(false);
                        let node = this.landContainer.children[index];
                        let wp = node.parent.convertToWorldSpaceAR(node.position);
                        let obj = {};
                        obj.worldPos = wp;
                        obj.index = index;
                        cc.director.farmDialog.showLandUnlockPormpt(obj);
                    }
                }
            }
        }

        // if(FarmData.plantLimitedList.indexOf(level)>=0){

        // }
        let nIndex = FarmData.plantLimitedList.indexOf(level);
        if (nIndex >= 0) {
            cc.systemEvent.emit('SHOW_PLANT_UNLOCK', { type: nIndex });
        }


        // 怎么样去改写本地数据；

        // 怎么样去改变子item的视图


    },







    /**
     * 更新种子的数量
     * @param {*} event 
     */

    // 更新种子数据
    updateSeedData(event) {
        let data = event.data;
        let seedData = FarmUtils.getLocalData('seedData');
        if (!seedData) {
            seedData = FarmData.seedData;
        }

        let len = seedData.length, index = -1;
        for (let i = 0; i < len; i++) {
            if (data.type == seedData[i].type) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            let item = seedData[index];
            // 表示种子数量增加
            if (data.mode == 1) {
                item.number += data.number;
                let coins = FarmData.shopSeedData[index].price;
                cc.systemEvent.emit('UPDATE_FARM_COINS', { coins: -coins });
                // cc.systemEvent.emit('UPDATE_OPERATE_NUMBER', { number: item.number });
            } else if (data.mode == 2) {//种子减少
                item.number -= data.number;
                cc.systemEvent.emit('UPDATE_OPERATE_NUMBER', { number: item.number });
            } else if (mode == 3) {//种子的等级增加
                item.level++;
            } else if (mode == 4) {// 种子解锁
                item.isUnlock = true;
            }
        }

        FarmUtils.setLocalData(seedData, 'seedData');
    },





    // 更新道具信息
    updatePropsData(event) {
        let data = event.data;
        console.log(data);
        let propsData = FarmUtils.getLocalData('propsData');
        if (!propsData) {
            propsData = FarmData.propsData;
        }

        let len = propsData.length, index = -1;
        for (let i = 0; i < len; i++) {
            if (data.type == propsData[i].type) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            let item = propsData[index];
            // 表示道具数量增加
            if (data.mode == 1) {
                item.number++;
                cc.systemEvent.emit('UPDATE_FARM_COINS');
            } else if (data.mode == 2) {//道具减少
                item.number--;
                cc.systemEvent.emit('UPDATE_OPERATE_NUMBER', { number: item.number });
                if (item.number <= 0) {
                    propsData.splice(index, 1);
                }

            }
            else if (mode == 3) {// 种子解锁
                item.isUnlock = true;
            }
        } else {
            let tempItem = { type: data.type, number: 1 }
            propsData.push(tempItem);
        }

        FarmUtils.setLocalData(propsData, 'propsData');

    },


    // 增加金币
    addCoins(event) {
        // console.log(event, 'addcoins');
        if (typeof event != 'number') {
            cc.log('params is not a number,please check!---------------addCoins');
            return;
        }

        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        // if (!farmInfo.coin) {
        //     farmInfo.coin = 0;
        // }
        farmInfo.coin += event;
        FarmUtils.setLocalData(farmInfo, 'localFarmInfo');
        cc.systemEvent.emit('UPDATE_FARM_COINS', { number: event });

        // FarmUtils.numberRoll();
        // let totalCoins = FarmUtils.getCoins();
        // totalCoins += event;
        // FarmUtils.saveCoins(totalCoins);
        // todo 金币增加的动画效果
    },


    //  保存土地信息
    saveLandInfo() {

        let hasData = FarmUtils.checkLocalData('landData');
        if (!hasData) {
            let data = FarmData.landDetail;
            FarmUtils.setLocalData(data, 'landData');
        }
        // console.log(FarmUtils.getLocalData('landData'), '120');

    },

    // 获得当前所以土地累积的经验
    getCurrentAllLandExp() {
        let children = this.landContainer.children;
        let sum = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'ground') {
                let obj = children[i].getComponent('groundLand');
                if (obj.info.isUse) {
                    sum += obj.getCurrentLandExp();
                } else {
                    continue;
                }
            }

        }
        return sum;
    },

    // 一键收集离线经验
    collectAllLandExp() {
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'ground') {
                let obj = children[i].getComponent('groundLand');
                if (obj.info.isUse) {
                    sum += obj.progressNode.collectExp();
                } else {
                    continue;
                }
            }

        }
    },

    // 将植物的当前累积经验置零。
    resetAllLandExp() {
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'ground') {
                let obj = children[i].getComponent('groundLand');
                if (obj.info.isUse) {
                    obj.progressNode.resetAccumulateStartTime();
                } else {
                    continue;
                }
            }

        }
    },



    // //  检测是否存在本地数据？
    // checkData(){

    // },


    // 保存仓库信息

    // 背包信息


    //  给所有土地浇水
    waterAllLand(effectTime) {

        let landData = FarmUtils.getLocalData('landData');
        let len = landData.length;
        for (let i = 0; i < len; i++) {
            landData[i].waterTime += effectTime;
        }
        FarmUtils.setLocalData(landData, 'landData');
    },

    // 登陆后进行时间同步

    // 跳回主界面
    jumpToMainScreen() {
        cc.systemEvent.emit('FADEIN_COULD_ANIMA');
        this.scheduleOnce(function () {

            cc.director.loadScene('mainScreen');
            cc.director.sceneMsg = 'farm';

        }, 1);
    },

    // 根据操作来隐藏土地的状态


    // 隐藏植物的状态
    hideAllPlantStatue() {
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            children[i].getComponent('groundLand').changePlantStatue(1);
        }
    },


    // 显示植物的所有状态
    showAllPlantStatue() {
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'ground') {
                children[i].getComponent('groundLand').changePlantStatue(2);
            }

        }
    },


    // 所有的土地加速
    fertAllLandSpeed(event) {
        let type, reduceTime;
        type = event.type;
        reduceTime = FarmData.propShopList[type].effectTime * FarmData.costTime.ONE_HOUR;
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            let s = children[i].getComponent('groundLand');
            s.updatePlantReapRestTime(reduceTime);
            s.fertAnimation(type)
        }

    },

    waterAllLandSpeed(event) {
        let num, reduceTime, children;
        num = event.number;
        children = this.landContainer.children;
        reduceTime = num * FarmData.costTime.ONE_MIN;
        for (let i = 0; i < children.length; i++) {
            let s = children[i].getComponent('groundLand');
            s.updatePlantReapRestTime(reduceTime);
            s.waterAnimation(num);
        }
    },


    // 将其他的土地的状态改为正常
    managerLandStatues(event) {
        let index = event.detail.index;
        // console.log(event, '515');
        let children = this.landContainer.children;
        for (let i = 0; i < children.length; i++) {
            if (i == index || children[i].name != 'ground') {
                continue;
            }
            // console.log(children[i].getComponent('groundLand'));
            children[i].getComponent('groundLand').managerLand(2);
        }
        // event.stopPropagation();
        this.cacheTime = 6;
        if (cc.director.getScheduler().isScheduled(this.renormalLand, this)) {
            return;
        }
        this.schedule(this.renormalLand, 1);
    },


    renormalLand() {
        if (this.cacheTime && this.cacheTime > 0) {
            this.cacheTime--;
        } else {
            this.unschedule(this.renormalLand);
            let children = this.landContainer.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].name == 'ground') {
                    children[i].getComponent('groundLand').managerLand(2);
                }
            }
        }
    },


    // // 农场经验增加的动画   
    // farmExpAddAnimation(event) {
    //     let exp = event.exp;
    //     let startNode = event.node;
    // },

    onEnable() {
        FarmUtils.login();
        this.testTime();
        this.initFarmContainer();
        FarmUtils.resize();
    },

    start() {
        cc.systemEvent.emit('FADEOUT_COULD_ANIMA');
        this.scheduleOnce(
            function () {
                this.isNeedEjectOfflinePrompt();
            }
            , 2
        )
    },

    // 是否需要弹出离线弹框
    isNeedEjectOfflinePrompt() {
        let exp = this.getCurrentAllLandExp();
        if (exp >= FarmData.expThreshold) {
            cc.director.farmDialog.showOfflineExpPrompt();
        }
    },


    onDestroy() {
        // let time = FarmUtils.getServerTime();
        // cc.sys.localStorage.setItem('playerLeaveFarmTime', time);
    },


    jump() {
        // cc.director.loadScene('mainScreen');
    },


});
