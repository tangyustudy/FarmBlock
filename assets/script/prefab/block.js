
let GameData = require('../gameData');
let Utils = require('../utils');
let Config = require('../psconfig');
const windmillLimitedLevel = 59;
cc.Class({
    extends: cc.Component,

    properties: {
        outLine: cc.Node,
        temp: cc.Node,
        view: cc.Node,
        _xPos: 0,
        _yPos: 0,
        _stoneNum: 0,
        _stoneType: 0,
        rocketType: 0,
        discoType: 0,
        lock_func: cc.Node,
        bombRatio: -1,
        nextType: -1,
        viewList: [cc.SpriteFrame],
        rocketList: [cc.SpriteFrame],
        discoList: [cc.SpriteFrame],
        hinderView: [cc.SpriteFrame],


        tipsView_2: [cc.SpriteFrame],
        tipsView_4: [cc.SpriteFrame],
        tipsView_8: [cc.SpriteFrame],
        tipsView_16: [cc.SpriteFrame],
        tipsView_32: [cc.SpriteFrame],
        tipsView_64: [cc.SpriteFrame],
        tipsView_128: [cc.SpriteFrame],
        tipsView_256: [cc.SpriteFrame],
        // toolEffect:cc.Prefab,
        combineView: [cc.SpriteFrame],
        // 彩色方块的视图资源
        colorCubeViewList: [cc.SpriteFrame],
        // 方块的视图
        boxCubesHitView: [cc.SpriteFrame],
        // 风车的视图资源
        windmillNetView: [cc.SpriteFrame],
        // 瓢虫泡泡的视图
        ladyBugBubbleView: [cc.SpriteFrame],
        // 花
        flower: cc.Node,
        plant: cc.Node,
        windmillOutlineLight: cc.Node,
        ladyBug: cc.Prefab,
        vine: cc.SpriteFrame,

        toolAnima:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchStart,this);
    },

    initStoneView(x, y, type, number) {

        this.changeStoneGrid(x, y);

        this.changeStoneNum(type, number);

    },


    // 根据类型来选择提示类型
    updateTipsView(type) {
        let spriteFrame;
        if (this._stoneType == 0) {
            spriteFrame = this.tipsView_2[type];
        }
        if (this._stoneType == 1) {
            spriteFrame = this.tipsView_4[type];
        }
        if (this._stoneType == 2) {
            spriteFrame = this.tipsView_8[type];
        }
        if (this._stoneType == 3) {
            spriteFrame = this.tipsView_16[type];
        }
        if (this._stoneType == 4) {
            spriteFrame = this.tipsView_32[type];
        }
        if (this._stoneType == 5) {
            spriteFrame = this.tipsView_64[type];
        }
        if (this._stoneType == 6) {
            spriteFrame = this.tipsView_128[type];
        }
        if (this._stoneType == 7) {
            spriteFrame = this.tipsView_256[type];
        }
        this.view.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },


    // 恢复原来的视图
    originView() {
        this.view.getComponent(cc.Sprite).spriteFrame = this.viewList[this._stoneType];
    },

    // 根据类型获得数字
    changeStoneNum(type, number) {
        // console.log(type);
        this._stoneType = type;
        if (type >= 0) {
            this._stoneNum = 2 ** (this._stoneType + 1);
            // console.log(this._stoneNum);
            if (type == Config.rType) {
                this.rocketType = this.randomCreateRocketType();
                this.view.getComponent(cc.Sprite).spriteFrame = this.rocketList[this.rocketType];

            } else if (type == Config.dType) {

                if (number <= 5) {
                    this.discoType = number;
                } else {
                    this.discoType = this.randomCreateDiscoType();
                    // this.discoType = 1;
                }

                this.view.getComponent(cc.Sprite).spriteFrame = this.discoList[this.discoType];
                // this.playToolAnima(3);                // this.mark.active=true;
            }else if(type==Config.bType){
                
                // this.view.getComponent(cc.Sprite).spriteFrame = this.viewList[type];
                this.view.active=false;
                this.playToolAnima(2);
            }

            else {

                if (type >= 20) {
                    if (type == 22) {
                        this.lock_func.active = true;
                        this.lock_func.getComponent(cc.Sprite).spriteFrame = this.vine;
                        this.nextType = this.randomCreateDiscoType();
                        this.bombRatio = 1;
                        this.view.getComponent(cc.Sprite).spriteFrame = this.viewList[this.nextType];
                    } else if (type >= 23 && type <= 25) {
                        // this.lock_func.active = true;
                        // this.lock_func
                        if (type == 23) {
                            this.initBoxCubesData(3);
                        }

                        if (type == 24) {
                            this.initBoxCubesData(2);
                        }

                        if (type == 25) {
                            this.initBoxCubesData(1);
                        }

                    } else if (type == 26) {
                        this.initFlowerCubesData();
                    } else if (type == 27) {
                        this.initWindmill(3);
                    } else if (type >= 29 && type <= 36) {
                        this.initColorfulCubes(1, type - 29);
                    }
                    else if (type == 37) {
                        this.initLadyBugCubes(3);
                    } else if (type == 39) {
                        this.initRockStone(1);
                    }
                    else {
                        this.view.getComponent(cc.Sprite).spriteFrame = this.hinderView[type - 20];
                    }
                } else {
                    this.view.getComponent(cc.Sprite).spriteFrame = this.viewList[type];
                }

            }
        } else {
            this.view.getComponent(cc.Sprite).spriteFrame = null;
            // this.hinderView[2];
        }
    },


    // 方块被解锁
    cubesUnlock() {
        if (this.bombRatio <= 0) {
            this.bombRatio = -1;
            this.lock_func.active = false;
            // let grid = cc.v2(this._xPos,this._yPos);
            // GameData.updateSingleData(grid,this.nextType);
            GameData.starMatrix[this._xPos][this._yPos] = this.nextType;
            this.changeStoneNum(this.nextType);
            this.nextType = -1;
        }
    },


    // 木块消失
    boxCubesDisappear() {

        this.bombRatio = -1;
        GameData.starMatrix[this._xPos][this._yPos] = -1;
        this.node.removeFromParent();
        // console.log('这里记得要添加箱子消失的动画');

    },

    // 方块的数据重置
    blockDataReset() {
        this.bombRatio = -1;
        GameData.starMatrix[this._xPos][this._yPos] = -1;
    },



    // 木块被消除影响；
    boxHit() {
        if (this.bombRatio > 0) {
            // console.log(this.bombRatio, '185');
            this.lock_func.getComponent(cc.Sprite).spriteFrame = this.boxCubesHitView[this.bombRatio - 2];
        } else {
            if (this.bombRatio == 0) {
                this.lock_func.active = false;
            }
        }
        // 这里要添加撞击动画
        // console.log('这里要记得添加锁的动画哦');
        this.cubeRotation(this.node, 1003);
    },

    // 木块初始化
    initBoxCubesData(count) {
        this.bombRatio = count;
        this.lock_func.active = true;
        if (count - 2 < 0) {
            this.lock_func.active = false;
        } else {
            this.lock_func.getComponent(cc.Sprite).spriteFrame = this.boxCubesHitView[this.bombRatio - 2];
        }
        this.view.getComponent(cc.Sprite).spriteFrame = this.hinderView[3];
    },

    // 花初始化
    initFlowerCubesData() {
        this.view.active = false;
        this.flower.active = true;
        this.lock_func.active = false;
        let petal = this.plant.getChildByName('petal');
        petal.active = false;
        this.bombRatio = 4;
    },

    // 花被影响
    flowerHit() {
        let self = this;
        let petal = this.plant.getChildByName('petal');
        petal.active = true;
        petal.stopActionByTag(1002);
        let name = 'item' + (4 - this.bombRatio);
        let item = petal.getChildByName(name);
        this.node.zIndex = 1;
        let action = cc.sequence(
            cc.sequence(
                cc.scaleTo(0.2, 0.8),
                cc.scaleTo(0.2, 1.2),
            ).repeat(2),
            cc.scaleTo(0.15, 1.5).easing(cc.easeBackOut(3)),
            cc.rotateBy(0.3, 90),
            cc.spawn(
                cc.scaleTo(0.25, 1).easing(cc.easeBackOut(3)),
                cc.callFunc(function () {
                    item.active = true;
                    self.node.zIndex = 0;
                })
            ),

        );
        action.tag = 1002;
        this.plant.runAction(action);
    },

    // 花被回收
    collectFlower() {
        this.bombRatio = -1;
        GameData.starMatrix[this._xPos][this._yPos] = -1;
        this.node.removeFromParent();
    },


    // 初始化风车障碍
    initWindmill(count) {
        this.bombRatio = count;
        this.lock_func.active = true;
        if (count - 2 < 0) {
            this.lock_func.active = false;
        } else {
            this.lock_func.getComponent(cc.Sprite).spriteFrame = this.windmillNetView[this.bombRatio - 2];
        }
        this.view.getComponent(cc.Sprite).spriteFrame = this.hinderView[4];
    },

    hitWindmill() {
        if (this.bombRatio > 0) {

            this.lock_func.getComponent(cc.Sprite).spriteFrame = this.windmillNetView[this.bombRatio - 2];
            if (this.bombRatio == 1) {
                this.windmillOutlineLight.active = true;
                this.node.zIndex = 1;
                this.node.runAction(
                    cc.rotateBy(5, 360).repeatForever()
                );
                if (GameData.bestLevel == windmillLimitedLevel) {
                    let eleven = cc.sys.localStorage.getItem('eleven_step');
                    if (!eleven) {
                        // 
                        cc.systemEvent.emit('WINDMILL_SECOND_GUIDE', {
                            windmillList: [cc.v2(this._xPos, this._yPos)]
                        })
                    }
                }

            } else {
                this.windmillRotation(this.view, 1002);
            }

        } else {
            if (this.bombRatio == 0) {
                this.lock_func.active = false;
            }
        }

    },

    windmillRotation(node, tag) {
        node.stopActionByTag(tag);
        let rotate = 360;
        let action = cc.rotateBy(1, rotate);
        action.tag = tag;
        node.runAction(action);
    },

    // 初始化彩色方块
    initColorfulCubes(count, nextType) {
        this.bombRatio = count;
        this.nextType = nextType;
        this.lock_func.active = false;
        if (typeof this.nextType == 'number') {
            this.view.getComponent(cc.Sprite).spriteFrame = this.colorCubeViewList[this.nextType];
        }
    },

    // 初始化瓢虫方块
    initLadyBugCubes(count) {
        this.bombRatio = count;
        this.lock_func.active = false;
        this.view.getComponent(cc.Sprite).spriteFrame = this.hinderView[5];
        this.temp.active = true;
        let ladyBugChaos = cc.instantiate(this.ladyBug);
        ladyBugChaos.parent = this.temp;
        let anima = ladyBugChaos.getComponent(cc.Animation);
        anima.play('ladyBugChaos');
        // console.log(this.view);
    },

    // 初始化石头
    initRockStone(count) {
        this.bombRatio = count;
        this.lock_func.active = false;
        this.view.getComponent(cc.Sprite).spriteFrame = this.hinderView[6];
    },


    // 瓢虫方块被影响
    hitLadyBugCubes() {
        cc.director.SoundManager.playSound('glassBallBreak');
        this.view.getComponent(cc.Sprite).spriteFrame = this.ladyBugBubbleView[this.bombRatio - 1];
        this.cubeRotation(this.node, 1003);
    },



    // 随机生成火箭的类型
    randomCreateRocketType() {
        let random = Math.floor(Math.random() * 100);
        return random % 2;
    },

    // 随机生成消除相同颜色的不同颜色
    randomCreateDiscoType() {

        let list = [0, 1, 2, 3, 4];
        let random = Math.floor(Math.random() * list.length);
        return list[random];

    },


    // 随机获得数组内的元素
    randomGetItemType(List) {
        let random;
        if (!!List && List.length > 0) {
            random = Math.floor(Math.random() * List.length);
            return List[random];
        } else {
            return false;
        }
    },


    changeStoneGrid(xPos, yPos) {

        this._xPos = xPos;
        this._yPos = yPos;

    },

    nodeRotation(node, tag) {
        let self = this;
        let action =
            cc.sequence(
                cc.sequence(
                    cc.rotateBy(0.05, 20),
                    cc.rotateBy(0.05, -20),
                ).repeat(2),
                cc.callFunc(function () {
                    self.node.rotation = 0;
                }),
            );
        action.tag = tag;//闪烁
        node.runAction(action);
    },

    cubeRotation(node, tag) {
        let action = cc.sequence(
            cc.spawn(
                cc.sequence(
                    cc.rotateBy(0.05, 20),
                    cc.rotateBy(0.05, -20),
                ).repeat(2),
                cc.scaleTo(0.2, 1.2),
            ),
            cc.scaleTo(0.2, 1),
            cc.callFunc(function () {
                node.rotation = 0;
            }),
        );
        action.tag = tag;
        node.runAction(action);
    },



    onTouchStart() {
        // console.log('点击有没有效果')
        if (!!cc.director.isMoving || cc.director.container.target.stepCount <= 0 || !!cc.director.isrunning) {
            return;
        }
        if (this._stoneType != -2 && this._stoneType != -1) {
            // console.log(this._stoneType);
            cc.director.SoundManager.playSound('tap');
        }
        if (this._stoneType < Config.rType) { //正常的数值合成
            cc.director.isMoving = true;
            let stonePos = cc.v2(this._xPos, this._yPos);
            let combineList = Utils.needRemoveList(GameData.starMatrix, stonePos);

            if (cc.director.toolType > 0) {

                if (this._stoneType == -2) {
                    cc.director.isMoving = false;
                    return;
                }
                let type = cc.director.toolType;
                let grid = cc.v2(this._xPos, this._yPos);
                let wp = this.node.parent.convertToWorldSpaceAR(Utils.grid2Pos(grid.x, grid.y));
                cc.systemEvent.emit('TOOL_TRANS_EFFECT', {
                    type, grid, wp
                })
            } else {
                if (combineList.length > 1) {
                    // cc.systemEvent.emit('COMBINE_BLOCK', { detail: combineList })
                    cc.systemEvent.emit('REMOVE_CUBES', { detail: combineList })
                }
                else {

                    this.nodeRotation(this.node, 2);
                    cc.director.isMoving = false;
                    Utils.getItemAdjacentPos(stonePos);
                    if (this._stoneType != -2 && this._stoneType != -1) {
                        // console.log(this._stoneType);
                        cc.director.SoundManager.playSound('noCombine');
                    }
                   

                }
            }

        } else {//触发道具效果
            // console.log('触发道具效果');
            if (cc.director.toolType > 0) {
                if (cc.director.toolType <= 3) {
                    // 当玩家点击 火箭 、炸弹、disco球时无效
                    if (this._stoneType >= 8 && this._stoneType <= 10 || (cc.director.toolType == 3 && this._stoneType == 20)) {
                        return;
                    }

                    let type = cc.director.toolType;
                    let grid = cc.v2(this._xPos, this._yPos);
                    let wp = this.node.parent.convertToWorldSpaceAR(Utils.grid2Pos(grid.x, grid.y));
                    cc.systemEvent.emit('TOOL_TRANS_EFFECT', {
                        type, grid, wp
                    })
                }
                return;
            }
            if (this._stoneType >= 20) {

                this.nodeRotation(this.node, 3);
                cc.director.isMoving = false;
                cc.director.SoundManager.playSound('noCombine');

            } else {
                // this.scheduleOnce(
                //     function(){
                cc.systemEvent.emit('STEP_COUNT');
                //     },1
                // )
                let type;
                if (this._stoneType == Config.rType) {
                    type = this.rocketType;
                } else if (this._stoneType == Config.dType) {
                    type = this.discoType;
                }

                let detail = {
                    index: this._stoneType,
                    type: type,
                    grid: cc.v2(this._xPos, this._yPos)
                }
                cc.systemEvent.emit('GAME_TOOL', { detail: detail });
            }

        }

    },



    //  menuItemPool.put() 获取节点后，就会调用 MenuItem 里的 unuse 方法
    unuse() {

        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        this.node.stopAllActions();
        this.node.rotation = 0;
        this.node.zIndex = 0;
        this._stoneType = -1;
        this.outLine.active = false;
        this.lock_func.active = false;
        this.windmillOutlineLight.active = false;
        this.toolAnima.active=false;
        this.view.rotation = 0;
        if (this.flower.active) {
            let petal = this.plant.getChildByName('petal');
            let children = petal.children;
            for (let i = 0; i < children.length; i++) {
                children[i].active = false;
            }
            this.flower.active = false;
        };
        if (this.temp.active) {
            this.temp.active = false;
            this.temp.removeAllChildren();
            this.view.active = false;
            this.view.stopAllActions();
            this.view.rotation = 0;
        };

    },

    // menuItemPool.get() 获取节点后，就会调用 MenuItem 里的 reuse 方法
    reuse() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        this.node.scale = 0.2;
        // this.node.active = true;
        this.node.stopActionByTag(1);
        this.node.rotation = 0;
        this.view.active = true;
        this.node.runAction(
            cc.spawn(
                cc.scaleTo(0.3, 1),
                cc.fadeIn(0.1)
            )
        )
    },

    // 色块被选中的状态
    blockChoosed() {
        // let action = cc.blink(2,10).repeatForever();
        let action = cc.sequence(
            cc.rotateBy(0.05, 10),
            cc.rotateBy(0.05, -10),
        ).repeatForever();
        action.tag = 1;//震动
        this.node.runAction(action);
    },

    // 道具
    createGameTool(num) {
        // this._stoneType = num;
        // this._stoneNum=-1;
        // let type = 
        // this.view.getComponent(cc.Sprite).spriteFrame = this.toolList[type];
    },

    // 展示道具可合成的效果
    toolCanCombineEffect(node) {
        this.temp.active = true;
        node.parent = this.temp;
        // let effect = cc.instantiate(this.toolEffect)
    },

    // 
    discoEffect(node, type) {
        // console.log(node);
        this.node.zIndex = 1;
        this.temp.active = true;
        node.active = true;
        node.parent = this.temp;
        let action = cc.rotateBy(1, 720).repeatForever();
        action.tag = 1;
        if (!!type) {
            this.view.getComponent(cc.Sprite).spriteFrame = this.combineView[type - 1];
        }

        this.view.runAction(action);
    },

    // 执行道具展示过程中的动画
    playToolAnima(type){
        this.toolAnima.active=true;
        let anima = this.toolAnima.getComponent(cc.Animation);
        let animaName;
        if(type==1){
            // animaName = ;
        }else if(type==2){
            animaName = 'tool_bomb';
        }else if(type==3){
            animaName = 'tool_disco';
        }
        if(!!animaName){
            anima.play(animaName);
        }        
    },




    test() {
<<<<<<< HEAD
        // console.log('1111111fuck');
=======
        console.log('1111111fuck');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    },

    start() {

    },

    // update (dt) {},
});
