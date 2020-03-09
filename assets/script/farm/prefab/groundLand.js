
// let FarmUtils = require('./framUtils');
// let FarmData = require('./FarmData');

let FarmUtils = require('../framUtils');
let FarmData = require('../FarmData');
const matureTime = 10;


const unitTime = FarmData.costTime.ONE_MIN;

let groundLand = cc.Class({
    extends: cc.Component,

    properties: {
        // plant: cc.Sprite,
        earth: cc.Sprite,
        growStatue: cc.Sprite,
        // woodNotice: cc.Node,
        // plantList: [plantViewList],
        statueList: [cc.SpriteFrame],
        list_locked_view: [cc.SpriteFrame],
        node_animaArea: cc.Node,
        node_speedUp: cc.Node,
        node_woodNotice: cc.Node,
        label_unlockLevel: cc.Label,

        node_tips: cc.Node,
        node_progress_reap: cc.Node,
        node_progress_produce: cc.Node,
        node_progress_protect: cc.Node,

        label_reap_time: cc.Label,
        label_produce_pecent: cc.Label,
        label_time_protectTime: cc.Label,

        list_inner_bar: [cc.SpriteFrame],
        list_tips_bg: [cc.SpriteFrame],


        unmatureProgressSpriteList: [cc.SpriteFrame],

        matureProgressSpriteList: [cc.SpriteFrame],

        // maskProgress: cc.Node,
        progressNode: require('../progressNode'),

        plantAnimationNode: require('../plantAnimaNode'),

        landStatueNodeList: [cc.Node],

        insecMachine: cc.Prefab,

        landUnlockCost: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        this.node.on('growStatueClick', this.growStatueClick, this);
        this.node.on('colliderEvent', this.handleColliderEvent, this);
        this.growStatue.node.on(cc.Node.EventType.TOUCH_END, this.click, this);
    },


    click() {
        // console.log('this.click');
        let event = new cc.Event.EventCustom();
        this.growStatue.node.dispatchEvent(event);
    },

    growStatueClick() {
        this.onTouchStart();
    },

    handleColliderEvent(event) {
<<<<<<< HEAD
        // console.log('handleColliderEvent!!!', event.detail.index);
=======
        console.log('handleColliderEvent!!!', event.detail.index);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.progressNode.collectExp();
    },

    // 获得当前土地累积的经验值
    getCurrentLandExp() {
        let exp = this.progressNode.getAccumulateExpNumber();
        return exp;
    },

    // 初始化当前土地信息
    initGroundLand(info) {
        // let data = { index: 0, type: 0, growthStatue: 0, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: true, isLock: false, waterTime: -1, restTime: -1, plantTime: -1 };
        this.info = info;
<<<<<<< HEAD
=======
        // this.calculatePlantHealthStatue();
        console.log(info, '90');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.computedAutoWaterReduceTime();
        this.updateServerData();
        this.compareInsectAppearTime();
        this.showShield();
        this.isLandLock(this.info.isUse);
        this.showPlantGrowStatue(this.info.healthStatue);
        this.updatePlantGrowStatue(this.info.type, this.info.growthStatue);
        this.excuteTimeCount();
        this.landNormal();
        this.allLandPlantMove();
    },

    // 根据服务器拉下来的数据计算
    // 1 生长周期
    // 2 健康状态
    // 3 剩余成熟时间
    // 4 下一次浇水时间

    // 更新数据
    updateServerData() {

        // 同步服务器时间
        // 计算最新的土地数据
        let current = FarmUtils.getServerTime();
        let rest = this.getPlantReapRestTime(current, 0);
        if (rest <= 0) {
            let witheredTime = FarmData.plantInfo[this.info.type].witheredTime * unitTime;
            if (Math.abs(rest) >= witheredTime) {
                this.info.growthStatue = 3;
                this.info.restTime = -1;
                this.info.healthStatue.withered = 1;
            } else {
                this.info.healthStatue.reap = 1;
                this.info.restTime = -1;
                this.info.growthStatue = 2;
            }
        } else {
            this.info.restTime = rest;
            let waterTime = this.getRestTimeNextWater();
            // console.log(waterTime,'75');
            if (waterTime <= 0) {
                // this.info.waterTime = Math.abs(waterTime);
                this.restWaterTime = Math.abs(waterTime);
            } else {
                if (this.info.type >= 3) {
                    this.info.healthStatue.water = 1;
                    this.info.waterTime = -1;
                }
            }
            this.tempPart = Math.floor(FarmData.plantInfo[this.info.type].cycle * unitTime / 3);
            this.judgePlantGrowStage(rest, this.tempPart);
        }

    },


    // 计算自动浇水时间内 缩减的植物成长时间
    computedAutoWaterReduceTime() {
        let autoProp = FarmUtils.getLocalData('autoProp');
        let current = FarmUtils.getServerTime();
        if (!!autoProp) {
            let time;
            // 获得该植物的浇水时间间隔
            let plantInterval = (FarmData.plantInfo[this.info.type].waterIntervel * unitTime);
            if (autoProp.autowater.endTime > current) {
                time = Math.floor((current - this.info.waterTime) / plantInterval);
<<<<<<< HEAD
                // console.log(current, this.info.waterTime, time, plantInterval, '2222222');
=======
                console.log(current, this.info.waterTime, time, plantInterval, '2222222');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            } else {
                let rest = this.getPlantReapRestTime(current, 0);
                if (autoProp.autowater.endTime < 0 || rest < 0) {
                    return;
                }
                time = Math.floor((autoProp.autowater.endTime - this.info.waterTime) / plantInterval);
<<<<<<< HEAD
                // console.log('3333', time);
=======
                console.log('3333', time);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            }
            time = time >= 0 ? time : 0;
            if (time == 0) {
                return;
            }
            // 缩短时间
            this.updatePlantReapRestTime(time * FarmData.IndirectTime);
            // 更新土地的浇水时间
            this.info.waterTime += time * plantInterval;
            // 更新土地信息
<<<<<<< HEAD
            // console.log(time, '11111111111111');
=======
            console.log(time, '11111111111111');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            cc.systemEvent.emit('UPDATE_LAND', this.info);
        }
    },


    /**
     * 
     * @param {number} time
     * @param {number} reduceTime 
     */
    // 植物成熟的剩余时间
    getPlantReapRestTime(time, reduceTime) {
        let restTime = -1;
        if (!this.info) {
            return restTime;
        } else {
            if (this.info.restTime < 0) {
                restTime = FarmData.plantInfo[this.info.type].cycle * unitTime;
            } else {
                if (this.info.plantTime >= 0) {
                    restTime = FarmData.plantInfo[this.info.type].cycle * unitTime + this.info.plantTime - time - reduceTime;
                    restTime = restTime >= 0 ? restTime : 0
                } else {
                    restTime = FarmData.plantInfo[this.info.type].cycle * unitTime;
                }
            }
            return restTime;
        }
    },

    // 根据剩余时间来展示植物成长的阶段性
    judgePlantGrowStage(restTime, part) {
<<<<<<< HEAD
=======

>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        // 当剩余时间少于
        if (restTime <= part) {
            this.info.growthStatue = 2;
            this.plantAnimationNode.changePlantTexture(this.info.type, 2, this.info.index);
<<<<<<< HEAD

=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        } else if (restTime <= 2 * part) {
            this.info.growthStatue = 1;
            this.plantAnimationNode.changePlantTexture(this.info.type, 1, this.info.index);

        } else if (restTime <= 3 * part) {
<<<<<<< HEAD

=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            this.info.growthStatue = 0;
            this.plantAnimationNode.changePlantTexture(this.info.type, 0, this.info.index);
        }

    },

    // 下次浇水的剩余时间
    getRestTimeNextWater() {
        let restWaterTime;
        let current = FarmUtils.getServerTime();
        if (this.info.waterTime < 0) {
            restWaterTime = FarmData.plantInfo[this.info.type].waterIntervel * unitTime;
        } else {
            restWaterTime = current - this.info.waterTime - FarmData.plantInfo[this.info.type].waterIntervel * unitTime;
        }
        return restWaterTime;
    },

    /**
     * 只有当植物没有成熟时才执行倒计时操作
     */
    // 执行定时操作
    excuteTimeCount() {
        if (this.info.isUse) {

            if (!this.info.healthStatue.reap) {
                this.startWaterIntervel();
                this.startReapInterVel();
                // 执行进度条动画
                this.scheduleOnce(
                    function () {
                        this.progressNode.initProgressNode(matureTime, 1, this.info);
                    }, 0.2 * this.info.index
                )
<<<<<<< HEAD
                // console.log('jinlezheli11111');
            } else {

                // console.log('jinlezheli2222');
                this.progressNode.initProgressNode(matureTime, 2, this.info);
                this.progressNode.finishedMoveAnimation();
=======
                console.log('jinlezheli11111');
            } else {

                console.log('jinlezheli2222');
                this.progressNode.initProgressNode(matureTime, 2, this.info);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            }

        } else {

            this.progressNode.hideProgressNode();

        }


        // if(this.restTime>0){
        //     this.progressUnlimitedMove(this.unmatureProgressSpriteList);
        // }else{
        //     this.progressUnlimitedMove(this.matureProgressSpriteList);
        // }


    },

    // 启动浇水定时器
    startWaterIntervel() {
        this.restWaterTime = Math.abs(this.getRestTimeNextWater());
        // console.log(this.restWaterTime, '164');
        this.schedule(this.excuteWater, 1);
    },

    // 启动成熟定时器
    startReapInterVel() {
        let time = FarmUtils.getServerTime();
        this.restTime = this.getPlantReapRestTime(time, 0);
        this.schedule(this.excuteReap, 1);
    },

    // 启动虫子出现定时器
    startInsectAppearIntervel() {
        this.schedule(this.excuteInsectAppear, 1);
    },

    // 启动保护罩定时器
    startShieldIntervel() {
        // let curr = FarmUtils.getServerTime();
        // this.shieldTime = this.info.protectEndTime - curr;
        this.schedule(this.excuteShield, 1);
    },

    // 浇水定时器
    excuteWater() {
        // console.log(this.restWaterTime, '176water')
        if (this.restWaterTime <= 0) {
            this.unschedule(this.excuteWater);
            if (!!cc.director.isAutoWater) {
                this.water();
            } else {

                if (!this.info.healthStatue) {
                    this.info.healthStatue.water = 1;
                    this.showPlantGrowStatue(this.info.healthStatue);
                }
                cc.systemEvent.emit('UPDATE_LAND', this.info);

            }
        } else {
            if (!this.info.healthStatue.reap) {
                this.restWaterTime--;
            } else {
                this.info.healthStatue.water = 0;
                this.unschedule(this.excuteWater);
                this.restWaterTime = 0;
            }
        }
    },


    // // 成熟定时器
    excuteReap() {

        if (this.restTime <= 0) {
            this.unschedule(this.excuteReap);
            this.info.healthStatue.reap = 1;
            this.info.healthStatue.water = 0;
            this.info.restTime = 0;
            this.info.waterTime = -1;
            this.info.growthStatue = 2;
<<<<<<< HEAD
=======
            // console.log(this.info.healthStatue);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            this.scheduleOnce(
                function () {
                    this.showPlantGrowStatue(this.info.healthStatue);
                }, 2
<<<<<<< HEAD
            );
            // this.showPlantGrowStatue(this.info.healthStatue);
            cc.systemEvent.emit('UPDATE_LAND', this.info);
            this.progressNode.finishedMoveAnimation();
            this.plantAnimationNode.stopAnimaAndResume();
=======
            )
            // this.showPlantGrowStatue(this.info.healthStatue);
            cc.systemEvent.emit('UPDATE_LAND', this.info);
            this.progressNode.finishedMoveAnimation();
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        } else {
            this.restTime--;
            // this.info.restTime=this.restTime;
            this.judgePlantGrowStage(this.restTime, this.tempPart);

        }
    },

    // 出虫定时器
    excuteInsectAppear() {

        if (this.insectTime <= 0) {
            this.unschedule(this.excuteInsectAppear);

            // 判断是否存在保护罩
            let curr = FarmUtils.getServerTime();
            if (this.info.protectEndTime > curr) {
                return;
            }

            this.info.healthStatue.bug = 1;
            // 展示虫子动画 todo    
            this.insectAnimation();
<<<<<<< HEAD
            this.scheduleOnce(
                function () {
                    this.showPlantGrowStatue(this.info.healthStatue);
                }, 2
            )

            cc.systemEvent.emit('UPDATE_LAND', this.info);
        } else {
            this.insectTime--;
            // console.log(this.insectTime);
=======
            this.showPlantGrowStatue(this.info.healthStatue);
            cc.systemEvent.emit('UPDATE_LAND', this.info);
        } else {
            this.insectTime--;
            console.log(this.insectTime);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        }

    },

    // 保护罩定时器
    excuteShield() {
        if (this.shieldTime <= 0) {
            // 关闭保护罩
            this.hideShield();
            // 关闭定时器
            this.unschedule(this.excuteShield);
            // 更新数据 ---可在此时更新服务器数据？
            cc.systemEvent.emit('UPDATE_LAND', this.info);
        } else {
            this.shieldTime--;
            // console.log(this.shieldTime, 'shieldTime');
        }
    },


    // 更新当前种植植物的健康状态
    updatePlantHealthStatue(num) {
        // console.log(typeof num);
        let node = this.growStatue.node;
        if (typeof num == 'number') {
            if (!node.active && this.info.isUse) {
                this.growStatue.node.active = true;
            }
            node.rotation = 0;
            node.position = cc.v2(0, 20);
            node.stopAllActions();
            this.growStatue.spriteFrame = this.statueList[num];
            node.scale = 0.1;
            let action = cc.sequence(
                cc.spawn(
                    cc.moveTo(0.5, cc.v2(0, 120)),
                    cc.scaleTo(0.5, 1)
                ),
                cc.callFunc(
                    function () {
                        let action1 = cc.sequence(
                            cc.spawn(
                                cc.scaleTo(1, 0.9),
                                cc.rotateBy(1, 10)
                            ),
                            cc.spawn(
                                cc.scaleTo(1, 1),
                                cc.rotateBy(1, -10),
                            )
                        ).repeatForever();
                        node.runAction(action1);
                    }
                ),

            )
                ;


            this.growStatue.node.runAction(action);
        }

    },

    // 更新当前种植植物的生长状态
    updatePlantGrowStatue(type, num) {
<<<<<<< HEAD
        // console.log(type, num, 'nmb,haidewohaizhaoa ');
        if (typeof type == 'number' && typeof num == 'number') {
            if (num >= 0) {
                // this.plant.spriteFrame = this.plantList[type].viewList[num];
                this.plantAnimationNode.changePlantTexture(type, num, this.info.index, this.info.healthStatue.reap);
=======
        if (typeof type == 'number' && typeof num == 'number') {
            if (num >= 0) {
                // this.plant.spriteFrame = this.plantList[type].viewList[num];
                this.plantAnimationNode.changePlantTexture(type, num, this.info.index);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            } else {
                return;
            }
        }
    },

    // 土地是否被使用
    isLandUsed(isUse) {
        if (!isUse) {
            // this.plant.node.active = false;
            this.growStatue.node.active = false;
        } else {
            // this.plant.node.active = true;
            this.growStatue.node.active = true;
        }
    },

    // 土地是否被锁住
    isLandLock(isUse) {
        let level, farmInfo = FarmUtils.getLocalData('localFarmInfo');
        if (!!farmInfo) {
            level = farmInfo.level;
        } else {
            level = 1;
        }
        this.displayLandStatue(this.info.isLock, isUse);

        // if (level < FarmData.landUnlockLevelList[this.info.index]) {
        //     this.info.isLock = true;
        //     this.isLandUsed(false);
        //     this.landLocked();
        // } else {
        //     this.info.isLock = false;
        //     this.node_woodNotice.active = false;
        //     this.earth.spriteFrame = this.list_locked_view[1];
        //     this.isLandUsed(isUsed);
        //     cc.systemEvent.emit('UPDATE_LAND', this.info);
        // }
    },

    // 隐藏该所有的子节点
    hideAllChildren(list) {
        for (let i = 0; i < list.length; i++) {
            list[i].active = false;
        }
    },

    isEnoughBuy(cost) {
        let coins = cc.game.FarmUtils.getLocalData('localFarmInfo').coin;
        if (!coins) {
            coins = 0;
        }
        if (coins >= cost) {
            return true;
        } else {
            return false;
        }
    },

    // 展示土地的状态
    displayLandStatue(num, isUse) {
        switch (num) {
            // 即将解锁
            case 0:
                // 土地皮肤改变 解锁等级提醒
                this.earth.spriteFrame = this.list_locked_view[0];
                this.hideAllChildren(this.landStatueNodeList);
                this.landStatueNodeList[2].active = true;
                this.landStatueNodeList[2].getChildByName('level').getComponent(cc.Label).string = 'lv ' + this.info.unlockLevel;
                if (this.info.isLock != 0) {
                    this.info.isLock = 0;
                    cc.systemEvent.emit('UPDATE_LAND', this.info);
                }
                break;

            // 未解锁
            case 1:
                // 土地皮肤改变，锁的图标
                this.earth.spriteFrame = this.list_locked_view[0];
                this.hideAllChildren(this.landStatueNodeList);
                this.landStatueNodeList[1].active = true;
                if (this.info.isLock != 1) {
                    this.info.isLock = 1;
                    cc.systemEvent.emit('UPDATE_LAND', this.info);
                }
                break;
            // 待解锁
            case 2:
                // 隐藏解锁等级 锁的图标 
                // 检查用户的金币数量 够就可点击 不够就禁止点击 有灰色蒙版
                this.earth.spriteFrame = this.list_locked_view[0];
                this.hideAllChildren(this.landStatueNodeList);
                let cost = FarmData.landUnlockAndLevelUpCost[this.info.index].cost;
                let price = this.landStatueNodeList[3];
                price.getComponent(cc.Sprite).spriteFrame = this.landUnlockCost[8 - this.info.index];
                if (this.isEnoughBuy(cost)) {
                    this.landStatueNodeList[3].active = true;
                } else {
                    this.landStatueNodeList[3].active = true;
                    this.landStatueNodeList[0].active = true;
                }
                if (this.info.isLock != 2) {
                    this.info.isLock = 2;
                    cc.systemEvent.emit('UPDATE_LAND', this.info);
                }

                break;
            // 已解锁
            case 3:
                // 已解锁的 判断是否有正在种植植物。
                this.earth.spriteFrame = this.list_locked_view[1];
                this.hideAllChildren(this.landStatueNodeList);
                this.isLandUsed(isUse);
                // cc.systemEvent.emit('UPDATE_LAND', this.info);
                if (this.info.isLock != 3) {
                    this.info.isLock = 3;
                    cc.systemEvent.emit('UPDATE_LAND', this.info);
                }
<<<<<<< HEAD
                // console.log('傻狍子，进来了么？')
=======
                console.log('傻狍子，进来了么？')
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
                break;

            default:
                break;
        }
    },








    landLocked(num) {

        // 更新土地纹理
        this.earth.spriteFrame = this.list_locked_view[0];
        if (num == 0) {
            // 显示木桩；
            this.node_woodNotice.active = true;
        } else if (num == 1) {
            this.node_icon_lock.active = true;
        } else if (num == 2) {

            this.node_land_mask = true;
        }

        // 更新解锁等级
        this.label_unlockLevel.string = 'lv ' + this.info.unlockLevel;
    },



    landNormal() {
        // console.log('diaoyongle ?')
        if (this.info.isLock < 3) {
            return;
        }
        this.earth.spriteFrame = this.list_locked_view[1];

        this.node_tips.active = false;

        this.hideTipsNode();


    },


    //  管理土地状态
    managerLand(type) {
        if (type == 1) {
            this.landLocked();
        } else if (type == 2) {
            if (this.info.isLock < 3) {
                return;
            }
            this.landNormal();
        } else if (type == 3) {
            this.landChoosed();
        }
    },


    onTouchStart() {

        if (this.info.isLock < 3) {
            // console.log('254');
<<<<<<< HEAD
            // console.log(this.info.isLock, '636');
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            if (this.info.isLock == 2) {
                let worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                let obj = {};
                obj.worldPos = worldPos;
                obj.index = this.info.index;
                // obj.
                cc.director.farmDialog.showLandUnlockPormpt(obj);
            }
            return;
        }
        if (cc.director.currentPropsIndex == -1 && cc.director.currentPlantIndex == -1) {
            if (this.info.isUse) {
                this.operateByPlantStatue(this.info.healthStatue);
            } else {
                // 显示选中状态
                this.landChoosed('a');
            }

        } else {
            if (cc.director.currentPlantIndex >= 0 && cc.director.currentPropsIndex == -1) {
                if (!this.info.isUse) {
                    this.cultivate();
                } else {
                    return;
                }
            }

            if (cc.director.currentPropsIndex >= 0 && cc.director.currentPlantIndex == -1) {
                if (this.info.isUse) {
                    this.fertilization();
                } else {
                    return;
                }
            }

        }

        cc.systemEvent.emit('UPDATE_LAND', this.info);
    },

    //土地被选中的展示效果
    landChoosed(str) {
<<<<<<< HEAD
        // console.log('landchoosed!!', str);
=======
        console.log('landchoosed!!', str);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

        let event = new cc.Event.EventCustom('manager_land', true);
        event.detail = { index: this.info.index };
        this.node.dispatchEvent(event);
        // this.scheduleOnce(function () {
        //     this.managerLand(2);
        // }, 5);
        // console.log(this.info.isUse, this.node_tips.active, 'nmsl');
        if (!this.info.isUse || this.node_tips.active) {
            // this.earth.spriteFrame = this.list_locked_view[1];
            // this.node_tips.active = false;
            this.landNormal();
            return;
        } else {
            this.earth.spriteFrame = this.list_locked_view[2];
            this.node_tips.active = true;
            this.showTipsNode();
        }

        // 启动浇水倒计时显示时定时器

    },


    //  显示提示牌
    showTipsNode() {
<<<<<<< HEAD
        // console.log('nimabizenmebuxianshi le?');
=======
        console.log('nimabizenmebuxianshi le?');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        if (!!this.shieldTime && this.shieldTime > 0) {
            // 显示三个
            this.node_tips.getComponent(cc.Sprite).spriteFrame = this.list_tips_bg[0];
            this.node_progress_reap.position = cc.v2(0, 60);
            this.node_progress_produce.position = cc.v2(0, 10);
            this.node_progress_protect.position = cc.v2(0, -40);
            this.settingReaptTime();
            this.settingProducePercent();
            this.settingProtectTime();
            this.node_progress_protect.active = true;
        } else {
            // 显示两个
            this.node_tips.getComponent(cc.Sprite).spriteFrame = this.list_tips_bg[1];
            this.node_progress_reap.position = cc.v2(0, 30);
            this.node_progress_produce.position = cc.v2(0, -10);
            this.settingReaptTime();
            this.settingProducePercent();
            this.node_progress_protect.active = false;
        }

    },




    settingProducePercent() {
        let percent = this.node_progress_produce.getChildByName('percent').getComponent(cc.Label);
        let progress = this.node_progress_produce.getChildByName('outer').getComponent(cc.ProgressBar);
        if (this.info.isReduceProduce == 1) {
            progress.progress = 0.5;
            progress.barSprite.spriteFrame = this.list_inner_bar[0];
            percent.string = '50%';
        } else if (this.info.isReduceProduce == -1) {
            progress.progress = 1;
            progress.barSprite.spriteFrame = this.list_inner_bar[1];
            percent.string = '100%';
        }

    },

    settingReaptTime() {
        // 展示成熟倒计时 和 成熟进度
        let reapPeriod = FarmData.plantInfo[this.info.type].cycle * unitTime;
        let progress = Math.floor(this.restTime / reapPeriod * 100) / 100;
        let progressBar = this.node_progress_reap.getChildByName('outer').getComponent(cc.ProgressBar);
        progressBar.progress = 1 - progress >= 0 ? 1 - progress : 1;
        this.showReapTimeCount();
        this.schedule(this.showReapTimeCount, 1);
    },

    settingProtectTime() {
        // 展示保护倒计时 和保护进度
        if (!!this.shieldTime && this.shieldTime > 0) {
            let wholeTime = FarmData.propShopList[this.info.protectType].effectTime * unitTime;
            let progress = Math.floor(this.shieldTime / wholeTime * 100) / 100;
            let progressBar = this.node_progress_protect.getChildByName('outer').getComponent(cc.ProgressBar);
            progressBar.progress = progress;
            this.showProtectTimeCount();
            this.schedule(this.showProtectTimeCount, 1);
        }
    },

    showReapTimeCount() {
        let str = FarmUtils.countdown(this.restTime, 2);
        // let reapCountTime = this.node_progress_reap.getChildByName('timeCount').getComponent(cc.Label);
        this.label_reap_time.string = new String(str);
    },


    showProtectTimeCount() {
        let str = FarmUtils.countdown(this.shieldTime, 2);
        this.label_time_protectTime.string = new String(str);
    },



    // 隐藏提示牌
    hideTipsNode() {
        this.unschedule(this.showNextWaterTime);
        this.unschedule(this.showReapTimeCount);
        this.unschedule(this.showProtectTimeCount);
    },


    showNextWaterTime() {
        let str = FarmUtils.countdown(this.restWaterTime, 2);
        this.label_tips_water_time.string = new String(str);
    },

    //改变当前植物的可操作状态
    changePlantStatue(type) {
        //隐藏植物的状态
        if (type == 1) {
            this.hideHealthStatue();
        } else if (type == 2) {
            // this.node.growStatue.active=true;
            this.showPlantGrowStatue(this.info.healthStatue);
        }

    },


    // 如何显示植物的生长状态
    showPlantGrowStatue(healthStatue) {
        // 当处于种植时不显示植物的状态 todo  处在施肥状态也不能显示植物状态
        if (cc.director.currentPlantIndex >= 0 || cc.director.currentPropsIndex >= 0) {
            return;
        }

        if (typeof healthStatue == 'object') {
            let nameList = Object.keys(healthStatue);
            // console.log(nameList);
            let len = nameList.length;
            let index = -1;
            for (let i = 0; i < len; i++) {
                if (healthStatue[nameList[i]]) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
<<<<<<< HEAD
                // console.log(index, '698!!');
=======
                console.log(index, '698!!');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
                this.updatePlantHealthStatue(index);
            } else {
                this.growStatue.node.active = false;
            }
        }

    },

    // 根据植物的生长状态来进行操作
    operateByPlantStatue(healthStatue) {
        if (typeof healthStatue == 'object') {
            let nameList = Object.keys(healthStatue);
            let len = nameList.length;
            let index = -1;
            // console.log(nameList, '249');
            for (let i = 0; i < len; i++) {
                if (healthStatue[nameList[i]]) {
                    this.updatePlantHealthStatue(i);
                    index = i;
                    break;
                }
            }
            // console.log(index, '257');

            if (index >= 0) {
                // 选中状态
                // 将其他的土地状态复原
                if (index == 0) {
                    this.pestControl();
                } else if (index == 1) {
                    this.reap();
                } else if (index == 2) {
                    this.water();
                } else if (index == 3) {
                    this.rootOut();
                }
            } else {
                //  显示浇水的倒计时
                // this.node_tips_water.active = true;
                // this.label_tips_water_time.string = FarmUtils.countdown(this.restWaterTime, 2);
                // this.schedule(this.showNextWaterTime, 1);
                this.landChoosed('b');
            }

        }
    },


    // 隐藏状态
    hideHealthStatue() {
        this.growStatue.node.active = false;
    },




    // { index: 0, type: 0, growthStatue: 0, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: true, isLock: false, waterTime: -1, restTime: -1, plantTime: -1 },
    // 初始化土地的所有属性
    resetLandProp() {

        let info = {};
        info.index = this.info.index;
        info.type = 0;
        info.growthStatue = -1;
        info.healthStatue = { bug: 0, reap: 0, water: 0, withered: 0 };
        info.isUse = false;
        info.isLock = this.info.isLock;
        info.waterTime = -1;
        info.restTime = -1;
        info.plantTime = -1;
        info.unlockLevel = this.info.unlockLevel;
        info.protectEndTime = this.info.protectEndTime;
        info.insectAppearTime = -1;
        info.isReduceProduce = -1;
        info.protectType = this.info.protectType;
        this.info = info;

    },


    // 收割
    reap() {
        this.hideHealthStatue();
        // console.log('reap');
        this.info.isUse = false;
        this.isLandUsed(false);
        let produce = this.getCurrentLevelReapNumber(this.info.type);
<<<<<<< HEAD
        // console.log(this.info.type, produce, '425');
=======
        console.log(this.info.type, produce, '425');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

        // 如果虫子存在的时间过长，植物将被迫减产50%
        if (this.info.isReduceProduce == 1) {
            produce = Math.floor(produce * 0.5);
<<<<<<< HEAD
            // console.log('ssssssssssssssssss');
=======
            console.log('ssssssssssssssssss');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        }
        // 更新仓库数据
        let data = {
            type: this.info.type,
            number: produce,//todo
        }
        let coins = 0;
        let exp = FarmData.getReapExp(this.info.type, produce);
        let accumulateExpNumber = this.progressNode.getAccumulateExpNumber();
        exp += accumulateExpNumber;
        let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
        cc.systemEvent.emit('UPDATE_WAREHOUSE', { data: data, mode: 1, worldPos: wp });
        cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });
        this.addSeedPlantAmount(this.info.type);
        this.resetLandProp();

        // 隐藏植物和植物动画
        this.plantAnimationNode.fadeOut();

        //  隐藏进度条
<<<<<<< HEAD
        cc.director.SoundManager.playSound('farm_reap');
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.progressNode.resetAccumulateStartTime();
        this.progressNode.resetPlantStartTime(this.info.index);
        this.progressNode.hideProgressNode();

<<<<<<< HEAD
        // 隐藏进度条 todo
        // this.progressNode.active = false;
=======
        cc.director.SoundManager.playSound('farm_reap');
        // 隐藏进度条 todo
        this.progressNode.active = false;
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9


    },

    // 获得当前等级可收割的个数
    getCurrentLevelReapNumber(type) {
        let sData = FarmUtils.getLocalData('seedData');
        if (!sData) {
            sData = FarmData.seedData;
        }
        let index = -1, produce;
        for (let i = 0; i < sData.length; i++) {
            if (sData[i].type == type) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            produce = FarmData.getPlantProduce(sData[index].level, type);
        }
        return produce;
    },

    //种子的种植次数；
    addSeedPlantAmount(type) {
        let sData = FarmUtils.getLocalData('seedData');
        let index = -1;
        if (!sData) {
            sData = FarmData.seedData;
        }

        for (let i = 0; i < sData.length; i++) {
            if (sData[i].type == type) {
                sData[i].plantCount += 1;
                index = i;
                break;
            }
        }
        if (index >= 0) {
            let limit = FarmData.plantInfo[index].levelUplimite;
            if (sData[index].plantCount >= limit) {
                sData[index].plantCount -= limit;
                // console.log(sData[index].plantCount,limit,'579');
                if (sData[index].level < 5) {
                    sData[index].level += 1;
                    index = -10;
                } else {
                    sData[index].level = 5;
                }
            }
        }
        FarmUtils.setLocalData(sData, 'seedData');
        // console.log(sData, '432');
        if (index == -10) {
            cc.systemEvent.emit('SHOW_LEVELUP', { type: this.info.type });
        }
    },

    // 浇水s
    water() {
        this.hideHealthStatue();
        // console.log('water');
        let reduceTime;
        reduceTime = FarmData.IndirectTime;
        let time = FarmUtils.getServerTime();
        this.info.healthStatue.water = 0;
        this.info.waterTime = time;
        this.restWaterTime = FarmData.plantInfo[this.info.type].waterIntervel * unitTime;
        this.updatePlantReapRestTime(reduceTime);
        // this.restTime = 10;
        this.schedule(this.excuteWater, 1);
        this.waterAnimation(5);
        //  获得农场经验 
        let tempObj = FarmData.OperationReward[0];
        let exp = tempObj.exp;
        let coins = tempObj.coins;
        let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
        // console.log(wp,'groundLand ,732');
        cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });
        cc.director.SoundManager.playSound('farm_water');

        // 更新服务器数据

    },

    // 更新植物的成熟剩余时间
    updatePlantReapRestTime(time) {
        if (!this.info.isUse) {
            return;
        } else {
            if (!!this.restTime) {
                if (this.restTime > time) {
                    this.restTime = this.restTime - time;
                    this.progressNode.addSpeedUpTimeExpToAccumulateExpNumber(false, time);
                } else {
                    this.restTime = 1;
                    this.progressNode.addSpeedUpTimeExpToAccumulateExpNumber(true, 0);
                }
                // this.restTime = this.restTime - time > 0 ? this.restTime - time : 1;
            }
            if (!!this.info.plantTime && this.info.plantTime > 0) {
                this.info.plantTime -= time;
            }

            cc.systemEvent.emit('UPDATE_LAND', this.info);
        }

    },


    // 施肥
    fertilization() {
        //判断是否已经成熟
        if (this.info.healthStatue.reap == 1) {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1003 })
            return;
        }

        let type = cc.director.currentPropsIndex;
        let number = this.getPropsNumber(type);
        if (number > 0) {
            if (type < 4) {
                //  更新成熟时间
                let reduceTime = FarmData.propShopList[type].effectTime * unitTime;
                this.updatePlantReapRestTime(reduceTime);
                this.fertAnimation(type);
                // 更新操作界面数量
            }
            else if (type >= 12 && type < 15) {
                this.addShield(type);
            }
            // 更新肥料数量
            cc.systemEvent.emit('UPDATE_PROPS', { data: { mode: 2, type: type } });

            // 农场经验
            let tempObj = FarmData.OperationReward[6];
            let exp = tempObj.exp;
            let coins = tempObj.coins;
            let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
            // console.log(wp,'groundLand ,732');
            cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });
        } else {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1008 });
        }

<<<<<<< HEAD
        // console.log('施肥');
=======
        console.log('施肥');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        cc.director.SoundManager.playSound('farm_fert_1');

    },

    // 获得当前使用肥料的数量
    getPropsNumber(type) {
        let propList = FarmUtils.getLocalData('propsData');
        if (!!propList) {
            let index = -1;
            for (let i = 0; i < propList.length; i++) {
                if (propList[i].type == type) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                return propList[index].number;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    },




    // 施肥动画
    fertAnimation(type) {
        if (!this.info.isUse || this.info.isLock < 3) {
            return;
        }
        let fert = this.node_animaArea.getChildByName('fert');
        fert.active = true;
        let particle = fert.getComponent(cc.ParticleSystem);
        particle.resetSystem();
        // this.getFertReduceTime(type);
        let time = FarmData.propShopList[type].effectTime;
        this.scheduleOnce(
            function () {
                // if (time == 1) {
                //     this.speedUpAnimation(time, 'HOUR');
                // } else if (time > 1) {
                this.speedUpAnimation(time, 'MINUTES');
                // }
                fert.active = false;
                cc.director.SoundManager.playSound('farm_fert_2');
            }, 1
        )
    },


    // 除虫
    pestControl() {
        this.hideHealthStatue();
<<<<<<< HEAD
        // console.log('bug');
=======
        console.log('bug');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.info.healthStatue.bug = 0;
        this.info.insectAppearTime = -1;
        // 喷洒杀虫剂的动画
        this.insecAnimation();

        // 除虫动画
        this.removeInsectAnimation();

        this.scheduleOnce(
            function () {
                this.showPlantGrowStatue(this.info.healthStatue);
            }, 2
        )


        let tempObj = FarmData.OperationReward[4];
        let exp = tempObj.exp;
        let coins = tempObj.coins;
        let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.scheduleOnce(function () {
            cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });
        }, 1)

        cc.director.SoundManager.playSound('farm_insec');
    },

    // 铲除
    rootOut() {

        this.resetLandProp();
        // 获得农场经验
        let tempObj = FarmData.OperationReward[2];
        let exp = tempObj.exp;
        let coins = tempObj.coins;
        let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
        cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });

    },

    // 种植
    cultivate() {
        this.info.type = cc.director.currentPlantIndex;
        // 判断种子数量是否大于零
        // let sCount = this.getSeedNumberByType(this.info.type);
        let seedCount = FarmUtils.getDataProperty(this.info.type, 'seedData', 'number');
        // console.log(seedCount);
        if (seedCount > 0) {
            this.tempPart = Math.floor(FarmData.plantInfo[this.info.type].cycle * unitTime / 3);
            this.info.plantTime = FarmUtils.getServerTime();
            this.info.isUse = true;
            let healthStatue = { bug: 0, reap: 0, water: 0, withered: 0 };
            this.info.healthStatue = healthStatue;
            if (this.info.type > 1) {
                this.info.healthStatue.water = 1;
            }
            this.info.growthStatue = 0;

            // 计算虫子的出现时间
            this.computedInsectAppearTime(this.info.plantTime, this.info.type);

            // 更新种子库存
            cc.systemEvent.emit('UPDATE_SEED', { data: { mode: 2, type: this.info.type, number: 1 } });

            // this.plantAnimationNode.startPlantAnimation();
            this.plantAnimationNode.changePlantTexture(this.info.type, this.info.growStatue, this.info.index);

            if (!!cc.director.isAutoWater && this.type > 1) {
                this.scheduleOnce(
                    function () {
                        this.water();
                    }, 2
                )

            };
            this.startReapInterVel();

            // 显示未成熟进度条
            // this.showUnlimitedMoveProgress(1);
            this.progressNode.initProgressNode(matureTime, 1, this.info);
            // 增加农场经验
            let tempObj = FarmData.OperationReward[1];
            let exp = tempObj.exp;
            let coins = tempObj.coins;
            let wp = this.node.parent.convertToWorldSpaceAR(this.node.position);
            // console.log(wp,'groundLand ,732');
            cc.systemEvent.emit('UPDATE_FARM', { exp: exp, coins: coins, worldPos: wp });

        } else {
            cc.systemEvent.emit('SHOW_WORD_NOTICE', { code: 1009 });
        }
        cc.director.SoundManager.playSound('farm_plant');
    },

    //  计算虫子出现的时间
    computedInsectAppearTime(currentTime, type) {

        // 前三种植物不出现虫子
        if (type < 3) {
            return;
        }

        let item = FarmData.insectAppearTimeList[type];
        let min = item[0], max = item[1];
        let peroidtime = Math.floor(Math.random(max - min) + min) * unitTime;
        // + currentTime;
        // let peroidtime = 20;
<<<<<<< HEAD
        // console.log(peroidtime, item, 1258);
=======
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        this.info.insectAppearTime = peroidtime > 0 ? peroidtime + currentTime : -1;
        // console.log(peroidtime, this.info.insectAppearTime, '760');
        this.insectTime = peroidtime;
        this.startInsectAppearIntervel();
    },

    // 比较当前时间和虫子出现时间
    compareInsectAppearTime() {
<<<<<<< HEAD
        // console.log(this.info, '767');
=======
        console.log(this.info, '767');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        let current = FarmUtils.getServerTime();
        let insectAppearTime = this.info.insectAppearTime;
        if (current < insectAppearTime || insectAppearTime == -1) {
            // 启动虫子的出现倒计时
            this.insectTime = insectAppearTime - current;
            if (this.insectTime > 0) {
                this.startInsectAppearIntervel();
<<<<<<< HEAD
                // console.log('insect is not appear! start insect countdown !');
            }
            return;
        } else {
            // console.log('insect is appear');
            // console.log(insectAppearTime, this.info.protectEndTime, '848');
=======
                console.log('insect is not appear! start insect countdown !');
            }
            return;
        } else {
            console.log('insect is appear');
            console.log(insectAppearTime, this.info.protectEndTime, '848');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            // 判断是否存在保护罩 
            if (insectAppearTime < this.info.protectEndTime) {

                return;
            }
<<<<<<< HEAD
            // console.log('shenmegui ?')
=======
            console.log('shenmegui ?')
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

            // 执行虫子动画
            let peroid = FarmData.insectAppearTimeList[this.info.type][3] * unitTime;
            this.info.healthStatue.bug = 1;
            // 展示虫子的动画
            this.insectAnimation();

            if (current < insectAppearTime + peroid) {
                // 出现虫子，没有减产；
            } else {
                // 出现虫子，减产50%；
                this.info.isReduceProduce = 1;
            }
        }
    },

    // 虫子的动画
    insectAnimation() {
        if (!this.info.isUse || this.info.isLock < 3) {
            return;
        }
        let insectNode = this.node.getChildByName('insectNode');
        let peroidPosition = FarmData.insectAppearPositionList[this.info.type][this.info.growthStatue];
        for (let i = 0; i < 4; i++) {
            let insect;
            if (cc.director.insectPool.size() > 0) {
                insect = cc.director.insectPool.get();
            } else {
                insect = cc.instantiate(cc.director.FarmManager.insect);
            }
            insect.opacity = 0;
            insect.parent = insectNode;
            insect.position = peroidPosition[i];
            insect.runAction(cc.fadeIn(2));
            insect.getComponent(cc.Animation).play('insect');
        }

    },

    // 移除虫子的动画
    removeInsectAnimation() {
        let insectNode = this.node.getChildByName('insectNode');
        let children = insectNode.children;
        if (children.length <= 0) {
            return;
        } else {

            for (let i = children.length - 1; i >= 0; i--) {
                this.scheduleOnce(
                    function () {
                        children[i].getComponent(cc.Animation).stop('insect');
                        let action = cc.sequence(
                            cc.fadeOut(1),
                            cc.callFunc(function () {
                                cc.director.insectPool.put(children[i]);
                            })
                        );
                        children[i].runAction(action);

                    }, 1
                )

            }
        }
    },

    // 保护罩添加
    addShield(type) {

        // 展示保护罩
        let shield = this.node.getChildByName('protect');
        shield.active = true;
        let protect = shield.getChildByName('protect');
        protect.active = true;
        protect.getComponent(cc.ParticleSystem).resetSystem();

        // 写入保护罩结束时间
        let currTime = FarmUtils.getServerTime();
        let peroid = FarmData.propShopList[type].effectTime * unitTime;
        this.info.protectType = type;
        if (this.info.protectEndTime > currTime) {
            this.info.protectEndTime += peroid;
            this.shieldTime += peroid;
            if (cc.director.getScheduler().isScheduled(this.excuteShield, this)) {
                return;
            } else {
                this.startShieldIntervel();
            }

        } else {
            this.info.protectEndTime = currTime + peroid;
            this.shieldTime = peroid;
            // 开启倒计时
            this.startShieldIntervel();
        }


<<<<<<< HEAD
        // console.log(peroid, FarmData.propShopList[type].effectTime, '878');
=======
        console.log(peroid, FarmData.propShopList[type].effectTime, '878');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

        cc.director.SoundManager.playSound('farm_protect');

        // 改写土地信息
        cc.systemEvent.emit('UPDATE_LAND', this.info);

    },

    // 展示保护罩
    showShield() {
        if (!this.info.protectEndTime && this.info.protectEndTime <= 0) {
            return;
        }
        let current = FarmUtils.getServerTime();

        if (this.info.protectEndTime > current) {
            let shield = this.node.getChildByName('protect');
            shield.active = true;
            this.shieldTime = this.info.protectEndTime - current;
            let protect = shield.getChildByName('protect');
            protect.active = true;
            protect.getComponent(cc.ParticleSystem).resetSystem();
            // 开启倒计时
            this.startShieldIntervel();
        }


    },

    // 关闭保护罩
    hideShield() {
        let shield = this.node.getChildByName('protect');
        shield.active = false;
        let protect = shield.getChildByName('protect');
        protect.active = false;
        this.info.protectEndTime = -1;
    },


    // 获得某个品种种子的数量

    getSeedNumberByType(type) {
        // console.log(type, '570');
        let seedData = FarmUtils.getLocalData('seedData');
        if (!!seedData) {
            let index = -1;
            for (let i = 0; i < seedData.length; i++) {
                if (seedData[i].type == type) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                return seedData[index]['number'];
            } else {
                return 0;
            }
        }

    },

    // 获取当前土地的信息
    getLandInfo() {
        return this.info ? this.info : false;
    },




    // 浇水动画

    waterAnimation(num) {
        if (!this.info.isUse || this.info.isLock < 3) {
            return;
        }
        let start = FarmData.waterStartPos;
        let end = FarmData.waterEndPos;
        let item;
        for (let i = 0; i < start.length; i++) {
<<<<<<< HEAD

=======
            // this.scheduleOnce(function(){
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            if (cc.director.nodePool.size() > 0) {
                item = cc.director.nodePool.get();
            } else {
                item = cc.instantiate(cc.director.FarmManager.waterFall);
            }
            // console.log(item);
            item.parent = this.node_animaArea;
            item.position = start[i];
            item.getComponent('item_fallWater').fallDown(end[i]);
<<<<<<< HEAD

=======
            // },0.1*i);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

        }

        this.scheduleOnce(function () {
            this.speedUpAnimation(num, 'MINUTES');
        }, 0.5)

    },

    // 加速动画
    speedUpAnimation(num, str) {
        this.node_speedUp.active = true;
        let anima = this.node_speedUp.getComponent(cc.Animation);
        anima.play('speedUp');
        let endTime = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                this.node_speedUp.active = false;
                this.reduceTimeAnimation(num, str);
            }, endTime
        )
    },


    //减少时间提示动画
    reduceTimeAnimation(num, str) {
        let reduceTime = this.node_animaArea.getChildByName('reduceTime');
        let number = reduceTime.getChildByName('number');
        let numberStr = number.getComponent(cc.Label);
        reduceTime.getComponent(cc.Label).string = str;
        numberStr.string = '.' + num;
        reduceTime.position = cc.v2(50, -50);
        reduceTime.active = true;
        let action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveTo(0.5, cc.v2(50, 0)),
            cc.fadeOut(0.1),
            cc.callFunc(function () {
                reduceTime.active = false;
            }),
        );
        reduceTime.runAction(action);
    },

    start() {
        // this.progressUnlimitedMove(this.matureProgressSpriteList);
    },

    onDestroy() {
        // 移除定时器函数
        this.unschedule(this.excuteReap);
        this.unschedule(this.excuteWater);
        // console.log('摧毁了当前节点')
    },

    // 除虫动画

    insecAnimation() {
        let insec = cc.instantiate(this.insecMachine);
        insec.parent = this.node;
<<<<<<< HEAD
        insec.position = cc.v2(0, 120);
=======
        insec.position = cc.v2(60, 120);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        let particle = insec.getComponent(cc.ParticleSystem);
        particle.resetSystem();
        let duration = particle.duration;
        // console.log(duration, '1265');
        this.scheduleOnce(function () {
            insec.removeFromParent();
        }, duration);
    },



    // 土地上的植物全部缓动
    allLandPlantMove() {
        if (this.info.isLock < 3 || !this.info.isUse) {
            this.plantAnimationNode.hideView();
            return;
        } else {
<<<<<<< HEAD
            // console.log(this.info.type, this.info.growthStatue, this.info.index, this.info.healthStatue, 1552);
            this.plantAnimationNode.changePlantTexture(this.info.type, this.info.growthStatue, this.info.index, this.info.healthStatue.reap);
        }
    },

    // 隐藏进度条 隐藏植物
    hideProgressAndPlant() {
        this.progressNode.node.active = false;
        this.plantAnimationNode.node.active = false;
        this.growStatue.node.active = false;
        this.earth.node.active = false;
    },

    // 显示进度条 显示植物
    showProgressAndPlant() {
        if (this.info.isUse) {
            this.progressNode.node.active = true;
        }
        this.plantAnimationNode.node.active = true;
        this.showPlantGrowStatue(this.info.healthStatue);
        this.earth.node.active = true;
    },
=======
            // this.info.type
            // this.plantAnimationNode.startPlantAnimation();
            this.plantAnimationNode.changePlantTexture(this.info.type, this.info.growthStatue, this.info.index);
        }
    },






>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9

    // update (dt) {},
});
