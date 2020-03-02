// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils');
let GameData = require('../gameData');
let Config = require('../psconfig');

// const levelResource = require('../levelResource');
const levelResource = require('../newLevelResource');

cc.Class({
    extends: cc.Component,
    properties: {
        stone: cc.Prefab,
        del_col: cc.Prefab,
        fire: cc.Prefab,
        line: cc.Prefab,
        tool_effect: cc.Prefab,
        rotationEffect: cc.Prefab,
        balloonBoom: cc.Prefab,
        progressBar: require('./progressBar'),
        target: require('./target'),
        bgPrompt: require('./bgPrompt'),
        rock: cc.Prefab,
        boom_effect: cc.Prefab,

        toolCombineEffect: cc.Prefab,

        absorb: cc.Prefab,
        toolItem: cc.Prefab,
        // toolList:[cc.Node],
        superDisco: cc.Prefab,
        dust: cc.Prefab,

        testArrow: cc.Prefab,
        vineBreak: cc.Prefab,

        ironLineBreak_right: cc.Prefab,
        ironLineBreak_left: cc.Prefab,
        woodCubeBreak: cc.Prefab,
        normalCubeBreak: cc.Prefab,
        netBreak1: cc.Prefab,
        netBreak2: cc.Prefab,
        windmill_particle: cc.Prefab,
        ladyBugMove: cc.Prefab,
        ladyBugArrive: cc.Prefab,
        colorCubeBreak: cc.Prefab,
        ladyBugBubbleBreak: cc.Prefab,
        rockStoneBreak: cc.Prefab,
        grassGround: require('./glassGround'),
        bubbleGround: require('./bubbleCubeContainer'),

        cubeBreakList:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        // this.node.on('combine_block', this.handleCombineList, this);
        // this.node.on('game_tool', this.handleGameTool, this);
        cc.systemEvent.on('GAME_TOOL', this.handleGameTool, this);
        // cc.systemEvent.on('COMBINE_BLOCK', this.handleCombineList, this);
        cc.systemEvent.on('REMOVE_CUBES', this.removeSameColorCubeByClick, this);
        cc.systemEvent.on('player_tool', this.handlePlayerTool, this);
        cc.systemEvent.on('FIREINTHEHOLE', this.fireTheHole, this);
        cc.systemEvent.on('BOXING_ANVIL', this.boxingAndAnvil, this);
        // cc.systemEvent.on('PASSEFFECT', this.executePassEffect, this);
        this.stonePool = new cc.NodePool('block');
        this.colPool = new cc.NodePool();
        this.firePool = new cc.NodePool('arrow');
        this.linePool = new cc.NodePool('line');
        this.rockPool = new cc.NodePool();
        this.CubeBreakPool = new cc.NodePool();
        this.lineList = [];
        let stone, del_col, fire, line, toolEffect, rotationEffect, rocketHead, breakCube;
        // 色块池
        for (let i = 0; i < 100; i++) {
            stone = cc.instantiate(this.stone);
            this.stonePool.put(stone);
        }

        // 竖消除
        for (let a = 0; a < 10; a++) {
            del_col = cc.instantiate(this.del_col);
            this.colPool.put(del_col);
        }

        // 移动粒子
        for (let b = 0; b < 20; b++) {
            fire = cc.instantiate(this.testArrow);
            this.firePool.put(fire);
        }

        // disco的连线效果
        for (let c = 0; c < 20; c++) {
            line = cc.instantiate(this.line);
            this.linePool.put(line);
        }

        // 火箭头
        for (let d = 0; d < 20; d++) {
            rocketHead = cc.instantiate(this.rock);
            this.rockPool.put(rocketHead);
        }

        // 色块消除动画
        for (let e = 0; e < 20; e++) {
            breakCube = cc.instantiate(this.normalCubeBreak);
            this.CubeBreakPool.put(breakCube);
        }


        // 开启物理碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // console.log('onLoad');
        cc.director.container = this;


        //  [

        //     [3, 0, 1, 1, 1, 2, 22, 2, 2],
        //     [3, 23, 23, 24, 25, 26, 2, 0, 1],
        //     [2, 0, 1, 22, 0, 3, -2, 3, 22],
        //     [0, 0, 1, 1, 27, 1, 2, 2, 1],
        //     [1, 10, 1, 1, 2, 1, 1, 8, 8],
        //     [2, 10, 26, 0, 3, 21, 1, 0, 0],
        //     [23, 23, 1, 0, 1, 2, 23, 23, 23],
        //     [1, 0, 2, 1, 0, 3, -2, 1, 3],
        //     [5, 22, 1, 2, 0, 2, -2, 1, 22],

        // ];
        this.passIndex = false;
    },


    // 初始化每一个砖块
    initStoneData(grid, type) {
        let stone;
        if (this.stonePool.size() > 0) {
            stone = this.stonePool.get();
        } else {
            stone = cc.instantiate(this.stone);
        }
        let pos = Utils.grid2Pos(grid.x, grid.y);
        let script = stone.getComponent('block');
        script.initStoneView(grid.x, grid.y, type);
        stone.position = pos;
        this.node.addChild(stone);
        let index = Utils.indexValue(grid.x, grid.y);
        if (type == -2) {
            GameData.starSprite[index] = null;
        } else {
            GameData.starSprite[index] = stone;
        }

    },


    // 初始化容器数据
    initContainerView(data) {
        this.reclaimNode();
        // console.log(stoneData);
        for (let i = 0; i < Config.matrixRow; i++) {
            for (let j = 0; j < Config.matrixCol; j++) {
                let pos = cc.v2(i, j);
                this.initStoneData(pos, data[i][j]);
            }
        }
    },

    // 回收容器内的所有节点
    reclaimNode() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let item = children[i];
            if (item.name == 'block') {
                this.stonePool.put(item);
            } else {
                item.removeFromParent();
            }

        }
    },


    //消除相同色块
    removeSameColorCubeByClick(event) {
        this.canclePlayerNotice();
        let removeList = event.detail;
        let newList = JSON.parse(JSON.stringify(removeList));
        this.hinderResponseCubesBreak(newList, this);
        let vector;
        if (removeList.length >= 5) {
            this.cubesToGameTool(newList);
        } else {
            while (removeList.length > 0) {
                vector = removeList.pop();
                this.normalCubeBreakAnimation(vector);
                this.removeBlock(vector);
            }
            this.scheduleOnce(function () {
                cc.systemEvent.emit('STEP_COUNT');
                if (cc.director.isrunning) {
                    return;
                }
                this.whichTimeTampRow('移除操作');
            }, 0.5);
        }
    },


    // 色块消除动画
    normalCubeBreakAnimation(vector) {
        let pos = Utils.grid2Pos(vector.x,vector.y);
        let breakCube;
        if (this.CubeBreakPool.size() > 0) {
            breakCube = this.CubeBreakPool.get();
        } else {
            breakCube = cc.instantiate(this.normalCubeBreak);
        }
        breakCube.parent = this.node;
        breakCube.position = pos;
        let type = GameData.starMatrix[vector.x][vector.y];
        let partical =  breakCube.getComponent(cc.ParticleSystem);
        partical.spriteFrame = this.cubeBreakList[type];
        partical.resetSystem();
        this.scheduleOnce(
            function(){
                this.CubeBreakPool.put(breakCube);
            },partical.life
        )

    },


    //  变成游戏道具
    becomeGameTool(pos, len, type) {
        let stone;
        if (this.stonePool.size() > 0) {
            stone = this.stonePool.get();
        } else {
            stone = cc.instantiate(this.stone);
        }
        // console.log(pos, len, type, 'container_1226_cubeNull');
        let index = Utils.indexValue(pos.x, pos.y);
        if (GameData.starSprite[index] != null) {
            let one = GameData.starSprite[index];
            this.stonePool.put(one);
        }
        GameData.starSprite[index] = stone;
        stone.parent = this.node;
        stone.position = Utils.grid2Pos(pos.x, pos.y);
        cc.director.SoundManager.playSound('combine');
        // 合成道具效果
        this.toolAndSuperToolEffect(pos);
        let script = stone.getComponent('block');
        if (len >= 5 && len < 7) {
            GameData.starMatrix[pos.x][pos.y] = 8;
            script.initStoneView(pos.x, pos.y, 8, type);
        } else if (len >= 7 && len < 9) {
            GameData.starMatrix[pos.x][pos.y] = 9;
            script.initStoneView(pos.x, pos.y, 9, type);
        } else if (len >= 9) {
            GameData.starMatrix[pos.x][pos.y] = 10;
            script.initStoneView(pos.x, pos.y, 10, type);
        }
        cc.systemEvent.emit('STEP_COUNT');

        if (cc.director.isrunning) {
            return;
        }
        this.whichTimeTampRow('changeStonetexture');
    },


    //  合成道具
    cubesToGameTool(combineList) {
        let len = combineList.length;
        let click = combineList[0];
        let type = GameData.getDataBygrid(click);
        let vector;
        cc.director.SoundManager.playSound('combine1');
        let combine_callfun = function (pos, len, type, self) {
            self.becomeGameTool(pos, len, type);
            let operateLevel = Utils.judgeOperateLevel(len);
            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: operateLevel
            })
        }
        while (combineList.length > 0) {
            vector = combineList.pop();
            // this.nodeMove(vector, click);
            if (combineList.length == 0) {
                this.nodeMove(vector, click, len, type, combine_callfun);
            } else {
                this.nodeMove(vector, click);
            }
        }
    },





    // 处理合成操作
    // handleCombineList(combineList) {

    //     this.canclePlayerNotice();
    //     // let combineList = event.detail;
    //     let newList = JSON.parse(JSON.stringify(combineList));
    //     this.hinderResponseCubesBreak(newList, this);
    //     let len = combineList.length;
    //     let click = combineList[0];
    //     let type = GameData.getDataBygrid(click);
    //     let vector;
    //     cc.director.SoundManager.playSound('combine1');
    //     let combine_callfun = function (pos, len, type, self) {
    //         self.updateStoneTexture(pos, len, type);
    //         let operateLevel = Utils.judgeOperateLevel(len);
    //         cc.systemEvent.emit('OPERATION_EVALUATE', {
    //             level: operateLevel
    //         })
    //     }
    //     while (combineList.length > 0) {
    //         vector = combineList.pop();
    //         // this.nodeMove(vector, click);
    //         if (combineList.length == 0) {
    //             this.nodeMove(vector, click, len, type, combine_callfun);
    //         } else {
    //             this.nodeMove(vector, click);
    //         }
    //     }
    // },


    // 执行气球爆炸效果
    balloonBoomEffect(pos) {
        let exam = cc.instantiate(this.balloonBoom);
        let position = Utils.grid2Pos(pos.x, pos.y);
        exam.position = position;
        exam.parent = this.node;
        let anima = exam.getComponent(cc.Animation);
        anima.play('balloon');
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                exam.removeFromParent();
            }
            , time
        )
    },

    // 执行藤蔓断裂的效果
    vineBreakEffect(pos) {
        let exam = cc.instantiate(this.vineBreak);
        let position = Utils.grid2Pos(pos.x, pos.y);
        exam.position = position;
        exam.parent = this.node;
        let anima = exam.getComponent(cc.Animation);
        cc.director.SoundManager.playSound('vineBreak');
        anima.play('vineBreak');
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                exam.removeFromParent();
            }
            , time
        )
    },

    // 执行链条断裂的效果
    woodBoxBreakEffect(pos, type) {
        // console.log('iron break!!');
        let iron;
        if (type == 2) {
            iron = cc.instantiate(this.ironLineBreak_right);
        } else {
            iron = cc.instantiate(this.ironLineBreak_left);
        }

        let position = Utils.grid2Pos(pos.x, pos.y);
        iron.position = position;
        iron.parent = this.node;
        let anima = iron.getComponent(cc.Animation);
        // cc.director.SoundManager.playSound('vineBreak');
        if (type == 2) {
            anima.play('iron_right');
            cc.director.SoundManager.playSound('ironLine1');
        } else {
            anima.play('iron_left');
            cc.director.SoundManager.playSound('ironLine1');
        }
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                iron.removeFromParent();
            }
            , time
        )

    },

    // 执行箱子破碎的效果
    woodCubeBreakEffect(pos) {
        let woodCube = cc.instantiate(this.woodCubeBreak);
        let position = Utils.grid2Pos(pos.x, pos.y);
        woodCube.position = position;
        woodCube.parent = this.node;
        let anima = woodCube.getComponent(cc.Animation);
        anima.play('woodCubeBreak');
        cc.director.SoundManager.playSound('box_bomb');
        // console.log('helloworld');
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                woodCube.removeFromParent();
            }
            , time
        )
    },


    // 执行花开的效果
    flowerOpenEffect(pos) {
        cc.director.SoundManager.playSound('flower_hit');
    },

    // 执行花被收集的动画 
    flowerCollectAnimation(pos) {
        if (!this.flowerTempList) {

            this.flowerTempList = [];
            this.flowerTempList.push(pos);

        } else {
            if (!Utils.indexOfV2(this.flowerTempList, pos)) {
                this.flowerTempList.push(pos);
            } else {
                return;
            }
        }
        let node = this.getNodeBygGrid(pos).node;
        cc.director.SoundManager.playSound('flowerFinished');
        let worldPos = this.node.convertToWorldSpaceAR(node.position);
        cc.systemEvent.emit('HINDER_FLOWER_ANIMATION', { flower: node, worldPos: worldPos });
    },

    // 执行风车动画
    windmillBreakEffect(pos, hitNumber) {

        const sum = 3;

        let prefab;
        if (hitNumber == 2) {
            prefab = cc.instantiate(this.netBreak1);
        } else {
            prefab = cc.instantiate(this.netBreak2);
        }
        let position = Utils.grid2Pos(pos.x, pos.y);
        prefab.parent = this.node;
        prefab.position = position;
        prefab.zIndex = 2;
        let anima = prefab.getComponent(cc.Animation);
        cc.director.SoundManager.playSound('netBreak');
        anima.play('netBreak' + (sum - hitNumber));
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                prefab.removeFromParent();
            }
            , time
        )
    },

    // 风车消失动效
    windmillDisappearEffect(pos) {
        if (!this.tempPos) {
            this.tempPos = [];
            this.tempPos.push(pos);
        } else {
            if (!Utils.indexOfV2(this.tempPos, pos)) {
                this.tempPos.push(pos);
            } else {
                console.log(pos, this.tempPos, '354');
                return;
            }
        }
        let disapperList = Utils.getWindmillEffectAreaList(GameData.starMatrix, pos);
        let self = this;
        if (disapperList.length <= 0) {
            return;
        }
        cc.director.needWait = 1;
        cc.game.windmillCount++;
        cc.director.SoundManager.playSound('windmill');
        for (let i = 0; i < disapperList.length; i++) {
            this.scheduleOnce(
                function () {
                    let item = disapperList[i];
                    let index = Utils.indexValue(item.x, item.y);
                    let stone = GameData.starSprite[index];
                    if (!!stone) {
                        if (GameData.starMatrix[item.x][item.y] >= 8 && GameData.starMatrix[item.x][item.y] != 27) {
                            // continue;
                            stone.runAction(cc.sequence(
                                cc.spawn(
                                    cc.sequence(
                                        cc.rotateBy(0.05, 20),
                                        cc.rotateBy(0.05, -20),
                                    ).repeat(2),
                                    cc.scaleTo(0.2, 1.2),
                                ),
                                cc.scaleTo(0.2, 1),
                                cc.callFunc(function () {
                                    stone.rotation = 0;
                                }),
                            )
                            );
                        } else {

                            if (GameData.starMatrix[item.x][item.y] == 27) {
                                let script = stone.getComponent('block');
                                if (script.bombRatio > 1) {
                                    stone.runAction(cc.sequence(
                                        cc.spawn(
                                            cc.sequence(
                                                cc.rotateBy(0.05, 20),
                                                cc.rotateBy(0.05, -20),
                                            ).repeat(2),
                                            cc.scaleTo(0.2, 1.2),
                                        ),
                                        cc.scaleTo(0.2, 1),
                                        cc.callFunc(function () {
                                            stone.rotation = 0;
                                            //    node.zIndex=0;
                                        }),
                                    )
                                    );
                                } else {
                                    stone.runAction(cc.spawn(
                                        cc.rotateBy(1, 1800),
                                        cc.scaleTo(1, 2)
                                    ));
                                }

                            } else {
                                stone.runAction(
                                    cc.spawn(
                                        cc.rotateBy(1, 1080),
                                        cc.scaleTo(1, 0.1)
                                    )
                                );
                            }
                        }
                    }

                    if (i == disapperList.length - 1) {
                        this.scheduleOnce(
                            function () {
                                let canFall = true;
                                let particle = cc.instantiate(this.windmill_particle);
                                particle.parent = this.node;
                                particle.zIndex = 3;
                                particle.position = Utils.grid2Pos(pos.x, pos.y);
                                particle.getComponent(cc.ParticleSystem).resetSystem();
                                cc.director.SoundManager.playSound('grassHit');
                                let breakwindmill = disapperList.shift();
                                self.removeBlock(breakwindmill);
                                let len = disapperList.length;
                                for (let i = 0; i < len; i++) {
                                    let item = disapperList[i];
                                    if (GameData.starMatrix[item.x][item.y] > 7) {

                                        if (GameData.starMatrix[item.x][item.y] == 27) {
                                            let script = self.getNodeBygGrid(item);
                                            if (script.bombRatio > 1) {
                                                self.handleGameToolArray(item);
                                            } else {
                                                canFall = false;
                                                self.windmillDisappearEffect(item);
                                            }
                                        } else {
                                            if (GameData.starMatrix[item.x][item.y] != 39) {
                                                self.handleGameToolArray(item);
                                            }
                                        }

                                    } else {
                                        self.removeBlock(item);
                                    }

                                    if (i == len - 1) {
                                        cc.game.windmillCount--;
                                        // console.log(cc.game.windmillCount, '451');
                                    }

                                }

                                // console.log(len,canFall, cc.director.needWait, cc.game.windmillCount, '453');
                                if (canFall) {
                                    if (len == 0 && cc.game.windmillCount > 0) {
                                        cc.game.windmillCount--;
                                    }
                                    if (!!cc.director.needWait && cc.game.windmillCount == 0) {
                                        cc.director.needWait = 0;
                                    } else {
                                        self.whichTimeTampRow('windmill');
                                    }
                                }
                            },
                            0.5
                        )


                    }


                }, i * 0.05
            )
        }
    },

    colorCubeBreakEffect(pos) {
        let colorCube = cc.instantiate(this.colorCubeBreak);
        let position = Utils.grid2Pos(pos.x, pos.y);
        colorCube.position = position;
        colorCube.parent = this.node;
        let anima = colorCube.getComponent(cc.Animation);
        let script = this.getNodeBygGrid(pos);
        let name = 'colorCube_' + script.nextType;
        anima.play(name);
        cc.director.SoundManager.playSound('box_bomb');
        // console.log('helloworld');
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                colorCube.removeFromParent();
            }
            , time
        )
    },

    ladyBugCubesBreakEffect(pos, number) {
        if (!this.tempLadyBugList) {
            this.tempLadyBugList = [];
            this.tempLadyBugList.push(pos);
        } else {
            if (!Utils.indexOfV2(this.tempLadyBugList, pos)) {
                this.tempLadyBugList.push(pos);
            } else {
                return;
            }
        }

        let bubble = cc.instantiate(this.ladyBugBubbleBreak);
        let position = Utils.grid2Pos(pos.x, pos.y);
        bubble.position = position;
        bubble.parent = this.node;
        number = number > 0 ? 3 - number : 3;
        let anima = bubble.getComponent(cc.Animation);
        cc.director.SoundManager.playSound('glassBallBreak');
        let name = 'glassBallHit' + number;
        // console.log(name);
        anima.play(name);
        let time = anima.getClips()[number - 1].duration;
        // console.log(time,'duration')
        let script = this.getNodeBygGrid(pos);
        if (number == 3 && !!script) {
            script.view.active = false;
            cc.director.needWait = 1;
            cc.director.isSuperTool = 1;
        }

        this.scheduleOnce(
            function () {
                bubble.removeFromParent();
                if (number == 3) {
                    this.ladyBugCubeBreak(pos);
                    this.removeBlock(pos);
                    script.boxCubesDisappear();
                }
            }
            , time
        )


    },

    rockStoneCubeBreakEffect(pos) {
        let rock = cc.instantiate(this.rockStoneBreak);
        let position = Utils.grid2Pos(pos.x, pos.y);
        rock.position = position;
        rock.parent = this.node;
        let anima = rock.getComponent(cc.Animation);
        cc.director.SoundManager.playSound('cubeRockBreak');
        anima.play('cubeRockBreak');
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                rock.removeFromParent();
            }
            , time
        )
    },




    // 方块爆炸对道具、障碍造成的影响 
    hinderResponseCubesBreak(list, self) {
        //气球 
        this.handleBalloonBomb(list, self);
        // 藤蔓
        this.handleVineBreak(list, self);
        // 木箱&带链子的木箱
        this.handleWoodBreak(list, self);
        // 花
        this.handleFlowerBreak(list, self);
        // 风车
        this.handleWindmillBreak(list, self);
        // 带颜色的箱子
        this.handleColorCubesBreak(list, self);
        // 瓢虫箱子
        this.handleLadyBugCubesBreak(list, self);
    },


    // 处理游戏道具
    handleGameTool(event) {
        this.canclePlayerNotice();
        let msg = event.detail;
        let toolList = Utils.needCombineTool(GameData.starMatrix, msg.grid);
        if (toolList.length >= 2 && !msg.from) {
            let str = this.whichSuperTool(GameData.starMatrix, toolList);
            this.triggerGameTool(str, msg.grid, toolList);
        } else {
            if (msg.index == Config.rType) {
                let type = msg.type;
                if (type == 0) {
                    // console.log('消除一列');
                    this.removeBlock(msg.grid);
                    this.col_rocket(msg.grid);

                } else {
                    // console.log('消除一行');
                    this.removeBlock(msg.grid);
                    this.row_rocket(msg.grid);
                }
                // console.log('1111111111111111111111111111');
                cc.systemEvent.emit('OPERATION_EVALUATE', {
                    level: 3
                })
                // if (!cc.director.specialNum) {
                if (cc.director.isrunning) {
                    return;
                }
                this.whichTimeTampRow('游戏道具');
                // }

            }

            if (msg.index == Config.bType) { //炸弹效果
                this.boomEffect(msg.grid);
                let list = Utils.rainbowStarRemoveList(GameData.starMatrix, msg.grid);
                if (!!msg.from && msg.from == 1) {
                    this.removeBombBlockOnly(list);
                } else {
                    this.removeNineBlock(list);
                }

                // if (cc.director.isrunning) {
                //     return;
                // }
                // this.whichTimeTampRow('游戏道具');
                cc.director.SoundManager.playSound('boom1');
                cc.systemEvent.emit('OPERATION_EVALUATE', {
                    level: 3
                })
            }

            if (msg.index == Config.dType) {
                let list = Utils.getSameBlockList(GameData.starMatrix, msg.grid, msg.type);
                this.discoRotation(msg.grid);
                let oldlist = JSON.parse(JSON.stringify(list));
                this.effectRemoveSame(msg.grid, list, oldlist, this.removeSameColorBlock);
                cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            }
        }
        // if(event)
        // cc.systemEvent.emit('STEP_COUNT');
    },



    // 炸弹效果
    boomEffect(grid) {

        let boom_eff = cc.instantiate(this.boom_effect);
        let pos = Utils.grid2Pos(grid.x, grid.y);
        boom_eff.position = pos;
        boom_eff.parent = this.node;
        boom_eff.getComponent(cc.ParticleSystem).resetSystem();

    },

    superDiscoAnima(grid) {
        // this.blackHoleEffect();
        let boom_eff = cc.instantiate(this.superDisco);
        let pos = Utils.grid2Pos(grid.x, grid.y);
        boom_eff.position = pos;
        boom_eff.parent = this.node;
        boom_eff.getComponent(cc.ParticleSystem).resetSystem();
    },



    // 移除9宫格范围内的色块
    removeNineBlock(list) {
        let e = list.shift();
        this.effectRemoveCol(e);
        this.removeBlock(e);
        // console.log(cc.director.specialNum, '818');
        if (list.length <= 0) {
            this.scheduleOnce(function () {
                if (cc.director.isrunning) {
                    return;
                }
                this.whichTimeTampRow('removeNineBlock1');
            }, 0.5)
        } else {
            for (let i = 0; i < list.length; i++) {
                this.handleGameToolArray(list[i]);
                if (i == list.length - 1) {
                    this.scheduleOnce(function () {
                        if (cc.director.isrunning) {
                            return;
                        }
                        this.whichTimeTampRow('removeNineBlock2');
                    }, 0.5)
                }

            }
        }

    },


    removeBombBlockOnly(list) {
        let e = list.shift();
        this.effectRemoveCol(e);
        this.removeBlock(e);
        this.boomEffect(e);
        if (list.length <= 0) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            this.handleGameToolArray(list[i]);
        }
    },



    //disco生效的状态
    discoRotation(pos, type) {

        let rotaEffect;
        rotaEffect = cc.instantiate(this.absorb);
        let script = this.getNodeBygGrid(pos);
        script.discoEffect(rotaEffect, type);
    },


    // 旋转特效
    blackHoleEffect(pos, type, callback) {
        if (!type) {
            type = 8;
        }
        let box = new cc.Node();
        box.parent = this.node;
        let position = Utils.grid2Pos(pos.x, pos.y);
        box.position = position;
        let holeEffect = cc.instantiate(this.absorb);
        holeEffect.parent = box;
        let toolItem = cc.instantiate(this.toolItem);
        toolItem.parent = box;
        holeEffect.getComponent(cc.ParticleSystem).resetSystem();
        // console.log(type,'447');
        toolItem.getComponent('toolItem').changeItemTexture(type);
        toolItem.runAction(
            cc.rotateBy(1, 1080).repeatForever()
        )
        this.scheduleOnce(function () {
            box.removeFromParent();
            if (!!callback) {
                callback(pos, 9);
            }
        }, 1.5);


    },


    // 根据道具类型来触发道具效果
    triggerGameTool(strType, pos, list) {
        let nList = JSON.parse(JSON.stringify(list));
        // this.toolAndSuperToolEffect(pos);
        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
        cc.director.isSuperTool = 1;
        switch (strType) {
            case 'superDisco':
                // console.log('superDisco');
                // 执行 合成动画

                let callback = function (self, target) {
                    self.blackHoleEffect(target, 9, self.superDiscoAnima.bind(self));
                }
                this.toolCombineAnimation(nList, callback);
                this.scheduleOnce(function () {
                    cc.director.SoundManager.playSound('2');
                    cc.director.SoundManager.playSound('3');
                    this.superDiscoEffect();

                    this.scheduleOnce(function () {
                        cc.director.isSuperTool = 0;
                    }, 1);
                }, 2.3)
                break;

            case 'disco&boom':
                // console.log('disco&boom');
                //todo
                let callback1 = function (self, pos, type) {
                    // self.blackHoleEffect(pos,9);
                    // self.scheduleOnce(function(){
                    self.discoBoomEffect(GameData.starMatrix, type, pos);
                    // },1.5);

                }
                this.toolCombineAnimation(nList, callback1);
                break;

            case 'disco&rocket':
                // 执行合成动画
                let callback2 = function (self, pos, type) {

                    self.discoRocketEffect(GameData.starMatrix, type, pos);

                }
                this.toolCombineAnimation(nList, callback2);
                break;

            case 'superBoom':
                // 执行合成动画
                let callback3 = function (self, target) {
                    let bigBoom = cc.instantiate(self.toolItem);
                    bigBoom.parent = self.node;
                    bigBoom.scale = 1;
                    bigBoom.position = Utils.grid2Pos(target.x, target.y);
                    bigBoom.getComponent('toolItem').changeItemTexture(2);
                    cc.director.SoundManager.playSound('superBomb');
                    bigBoom.runAction(
                        cc.sequence(
                            cc.scaleTo(0.3, 4),
                            cc.sequence(
                                cc.rotateBy(0.05, 20),
                                cc.rotateBy(0.05, -20),
                                cc.rotateBy(0.01, 0)
                            ).repeat(3),
                            cc.callFunc(
                                function () {
                                    bigBoom.removeFromParent();
                                    self.boomEffect(target);
                                }
                            )
                        )
                    )
                }
                this.toolCombineAnimation(nList, callback3);
                this.scheduleOnce(function () {
                    this.superBoomEffect(pos);
                    cc.director.SoundManager.playSound('boom1');

                    this.scheduleOnce(function () {
                        cc.director.isSuperTool = 0;
                    }, 1);
                }, 1.3);

                break;
            case '3row&col':
                let callback4 = function (self, pos) {
                    // console.log('3row&col，3行3竖动画');
                    // self.discoRotation(pos);
                    self.blackHoleEffect(pos);

                }
                this.toolCombineAnimation(nList, callback4);
                cc.director.SoundManager.playSound('rocket_bomb');
                this.scheduleOnce(function () {
                    this.boomAndRocketEffect(pos);

                    this.scheduleOnce(function () {
                        cc.director.isSuperTool = 0;
                    }, 1);
                }, 2);
                break;
            case 'row&col':
                let callback5 = function (self, pos, type) {
                    // console.log('row&col，一行一竖动画');
                    self.blackHoleEffect(pos, 10);
                }
                this.toolCombineAnimation(nList, callback5);
                this.scheduleOnce(function () {

                    this.superRocketEffect(pos);
                    this.scheduleOnce(function () {
                        cc.director.isSuperTool = 0;
                    }, 1);
                }, 2);
                break;
        }
    },

    // 道具合成动画
    toolCombineAnimation(list, callback) {
        let self = this;
        let target = list.shift();
        let type;
        let tScript = self.getNodeBygGrid(target);
        if (tScript._stoneType == 10) {
            type = tScript.discoType;
        }
        cc.director.SoundManager.playSound('rotation_combine');
        while (list.length > 0) {
            let startPos = list.pop();
            // let self = this;
            let script = self.getNodeBygGrid(startPos);
            if (script._stoneType == 10) {
                type = script.discoType;
            }

            // if() todo

            let index = Utils.indexValue(startPos.x, startPos.y);
            let stone = GameData.starSprite[index];
            let targetPos = Utils.grid2Pos(target.x, target.y);
            stone.runAction(
                cc.sequence(
                    cc.scaleTo(0.2, 1.1),
                    cc.spawn(
                        cc.scaleTo(0.2, 0.9),
                        cc.moveTo(0.2, targetPos).easing(cc.easeBounceOut()),
                    ),
                    cc.spawn(
                        cc.scaleTo(0.2, 0.5),
                        cc.fadeOut(0.1),
                    ),
                    cc.callFunc(
                        // callback()
                        function () {
                            self.removeBlock(startPos);
                            self.toolAndSuperToolEffect(target);
                            if (list.length == 0) {
                                callback(self, target, type);
                                // cc.audioEngine.stop(self.loopId);
                            }
                        }

                    )
                )
            )
        }
    },


    // 清空屏幕内的色块
    getSuperDiscoList(data) {
        let list = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] != 20) {
                    let item = cc.v2(i, j);
                    list.push(item);
                }
            }
        }
        return list;
    },


    // 清空横竖7行内的所有色块
    superBoomEffect(pos) {
        let bigBoomList = Utils.getThreeBlockArea(GameData.starMatrix, pos);
        this.removeNineBlock(bigBoomList);
        if (!this.target.isPass) {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: 3
            })
        }

    },

    // 清空横竖1行中的所有色块
    superRocketEffect(pos) {
        this.removeBlock(pos);
        this.row_rocket(pos);
        this.col_rocket(pos);
        if (cc.director.isrunning) {
            return;
        }
        this.whichTimeTampRow('row&col');
        if (!this.target.isPass) {

            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: 3
            })

            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
        }
    },

    // 清空三横三竖内的所有色块
    boomAndRocketEffect(pos) {

        this.row_rocket(pos);
        this.col_rocket(pos);

        if (pos.x + 1 < Config.matrixRow) {
            this.row_rocket(cc.v2(pos.x + 1, pos.y));
        }
        if (pos.x - 1 >= 0) {
            this.row_rocket(cc.v2(pos.x - 1, pos.y));
        }

        if (pos.y - 1 >= 0) {
            this.col_rocket(cc.v2(pos.x, pos.y - 1));
        }

        if (pos.y + 1 < Config.matrixCol) {
            this.col_rocket(cc.v2(pos.x, pos.y + 1));
        }

        if (cc.director.isrunning) {
            return;
        }
        if (!this.target.isPass) {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: 3
            })
        }
        this.whichTimeTampRow('row&col');

    },


    // 将相同色块变成炸弹
    discoBoomEffect(list, type, pos) {
        // cc.director.needWait = true;
        let list1 = Utils.getSameBlockList(list, pos, type);
        cc.director.SoundManager.playSound('rotation_combine');
        this.discoRotation(pos, 2);
        this.changeToBoom(pos, list1, 1);
    },

    //将相同色块变成火箭 
    discoRocketEffect(list, type, pos) {
        // let script = this.getNodeBygGrid(pos);

        let list1 = Utils.getSameBlockList(list, pos, type);
        this.discoRotation(pos, 1);
        cc.director.SoundManager.playSound('rotation_combine');
        this.changeToBoom(pos, list1, 2);
    },

    // 递归将色块变成炸弹
    changeToBoom(gridPos, list, type, oldList) {
        let self = this;
        let fire;
        if (list.length <= 0) {
            // cc.audioEngine.stop(self.loopId);
            this.executeListEffect(oldList, type);
            this.scheduleOnce(function () {
                cc.director.isSuperTool = 0;
            }, 1);

            return;
        }
        if (!oldList) {
            oldList = [gridPos];
        }
        let target = list.pop();
        oldList.push(target);
        let pos = Utils.grid2Pos(gridPos.x, gridPos.y);
        let targetPos = Utils.grid2Pos(target.x, target.y);
        if (this.firePool.size() > 0) {
            fire = this.firePool.get();
        } else {
            fire = cc.instantiate(this.fire);
        }
        fire.parent = this.node;
        fire.position = pos;
        let wpStart = this.node.convertToWorldSpaceAR(pos);
        let wpTarget = this.node.convertToWorldSpaceAR(targetPos);
        fire.getComponent('arrow').computedLineDistanceAndRotation(wpStart, wpTarget);
        // let particle = fire.getComponent(cc.ParticleSystem);
        // particle.resetSystem();
        cc.director.SoundManager.playSound('flyStart');
        fire.runAction(
            cc.sequence(
                cc.moveTo(0.3, targetPos),
                // cc.callFunc(function(){
                //     self
                // }),
                cc.callFunc(function () {
                    self.firePool.put(fire);
                    self.blockToBoom(target, type);
                    cc.director.SoundManager.playSound('flyEnd');
                    self.changeToBoom(gridPos, list, type, oldList);

                })
            )
        )
        // setTimeout(function(){
        // },100);

    },


    // 执行列表中的道具效果
    executeListEffect(list, type) {
        // console.log(list,'676');
        if (list.length == 0) {
            if (cc.director.isrunning) {
                return;
            }
            if (!this.target.isPass) {
                cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                cc.systemEvent.emit('OPERATION_EVALUATE', {
                    level: 3
                })
            }
            cc.director.needWait = true;
            this.whichTimeTampRow('相同道具列表');
            this.scheduleOnce(function () {
                cc.director.needWait = false;
            }, 0.5)
            return;
        }
        let item = list.shift();
        let script = this.getNodeBygGrid(item);

        if (type == 1) {

            if (!!script && script._stoneType == Config.bType) {
                let itemList = Utils.rainbowStarRemoveList(GameData.starMatrix, item);
                cc.director.SoundManager.playSound('boom1');
                this.removeBombBlockOnly(itemList);
            }

        } else {
            if (!!script && script._stoneType == Config.rType) {
                if (script.rocketType == 1) {
                    this.col_rocket(item);
                } else {
                    this.row_rocket(item);
                }
            }
        }
        // this.scheduleOnce(function(){
        this.executeListEffect(list, type);
        // },0.5);
    },

    // 执行数据列表的道具特效
    listEffect(list) {
        if (list.length <= 0) {
            return;
        }
        let item = list.pop();
        if (!!item) {
            let script = this.getNodeBygGrid(item);
            // 火箭
            if (script._stoneType == rType) {
                if (script.rocketType == 0) {
                    //消除一列
                } else {
                    //消除一行
                }
            }

            // 炸弹
            if (script._stoneType == bType) {
                //炸弹效果
            }


        }


    },



    // 超级转球的效果
    superDiscoEffect() {

        let superDiscoList = this.getSuperDiscoList(GameData.starMatrix);
        this.removeBlockOnly(superDiscoList);
        // this.removeNineBlock(superDiscoList);

        if (!this.target.isPass) {
            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: 3
            })
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            console.log('helloworld');
        }
    },



    // 判断超级道具的类型
    whichSuperTool(data, list) {
        let rocket = 0, boom = 0, disco = 0;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (data[item.x][item.y] == Config.rType) {
                rocket++;
            }
            if (data[item.x][item.y] == Config.bType) {
                boom++;
            }
            if (data[item.x][item.y] == Config.dType) {
                disco++;
            }
        }
        if (disco >= 2) {
            //返回超级disco；
            // console.log('superDisco');
            return 'superDisco';
        } else {
            if (disco == 1) {
                if (boom > 0) {
                    //令相同色块变成炸弹
                    // console.log('Disco&boom');
                    return 'disco&boom';
                } else {
                    if (rocket > 0) {
                        // 令相同色块变成火箭
                        // console.log('disco&rocket');

                        return 'disco&rocket';
                    }
                }

            }
            if (disco == 0) {
                if (boom >= 2) {
                    //超级炸弹
                    // console.log('superBoom');
                    return 'superBoom';
                } else {
                    if (boom == 1) {
                        if (rocket > 0) {
                            //横竖三连消
                            // console.log('3 row&col');
                            return '3row&col';
                        }
                    }
                    if (boom == 0) {
                        if (rocket >= 2) {
                            //横竖一连消
                            // console.log('row&col');
                            return 'row&col';
                        }
                    }

                }
            }
        }
    },


    // 判断disco的类型
    judgeDiscoType(list) {

        // console.log(list, '778');

        let type = -1;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            // console.log(GameData.starMatrix[item.x][item.y]);
            if (GameData.starMatrix[item.x][item.y] == Config.dType) {

                let index = Utils.indexValue(item.x, item.y);
                let stone = GameData.starSprite[index];
                let script = stone.getComponent('block');
                type = script.discoType;
                break;
            }
        }

        if (type >= 0) {
            return type;
        }
    },


    // 处理玩家道具
    handlePlayerTool(event) {
        this.canclePlayerNotice();
        let msg = event;
        // console.log(event, '689');
        if (msg.type == 1) {
            this.scheduleOnce(function () {
                this.whichTimeTampRow();
            }, 0.2)

            cc.systemEvent.emit('UPDATE_TOOL', {
                type: 1,
                statuCode: 2
            });
        }

        if (msg.type == 2) {
            this.scheduleOnce(function () {
                this.whichTimeTampRow();
            }, 0.2)

            cc.systemEvent.emit('UPDATE_TOOL', {
                type: 2,
                statuCode: 2
            })

        }

        if (msg.type == 3) {
            let item = msg.grid;
            this.toolAndSuperToolEffect(item);
            // this.removeNineBlock([msg.grid]);
            if (GameData.starMatrix[item.x][item.y] >= 8 && GameData.starMatrix[item.x][item.y] <= 10) {
                return;
            }
            this.handleSingleGrid(msg.grid);
            this.scheduleOnce(function () {
                this.whichTimeTampRow();
            }, 0.2)
            cc.director.SoundManager.playSound('ham');
            cc.systemEvent.emit('UPDATE_TOOL', {
                type: 3,
                statuCode: 2
            })
        }

        if (msg.type == 4) {

            this.shuffleStarMatrix();
            cc.director.isMoving = false;
            cc.systemEvent.emit('UPDATE_TOOL', {
                type: 4,
                statuCode: 2
            })
        }
        cc.director.isPlayerUsedTool = true;
    },


    // 被disco球消除的方块效果
    discoRemoveCuneEffect(toolGrid) {
        let pos = Utils.grid2Pos(toolGrid.x, toolGrid.y);
        let dust = cc.instantiate(this.dust);
        dust.parent = this.node;
        dust.position = pos;
        let particle = dust.getComponent(cc.ParticleSystem);
        particle.resetSystem();
    },




    // 消除动效
    effectRemoveCol(toolGrid) {
        let pos = Utils.grid2Pos(toolGrid.x, toolGrid.y);
        let del_col;
        if (this.colPool.size() > 0) {
            del_col = this.colPool.get();
        } else {
            del_col = cc.instantiate(this.del_col);
        }
        del_col.parent = this.node;
        del_col.position = pos;
        let particle = del_col.getComponent(cc.ParticleSystem);
        particle.resetSystem();

    },


    test(event) {
        let toolGrid = event.detail;
        let pos = Utils.grid2Pos(toolGrid.x, toolGrid.y);
        let del_col;
        if (this.colPool.size() > 0) {
            del_col = this.colPool.get();
        } else {
            del_col = cc.instantiate(this.del_col);
        }
        del_col.parent = this.node;
        del_col.position = pos;
        let particle = del_col.getComponent(cc.ParticleSystem);
        particle.resetSystem();
    },



    // 移除一行的光效


    // 节点碰撞

    // 移除相同色块的动画 todo

    effectRemoveSame(gridPos, list, oldList, callback, lineList) {
        let self = this;
        let line;
        if (list.length <= 0) {
            if (!!callback) {
                callback(oldList, self, lineList);
            }

            return;
        }
        if (!lineList) {
            lineList = [];
        }
        let target = list.pop();
        // console.log(target);
        let pos = Utils.grid2Pos(gridPos.x, gridPos.y);
        let targetPos = Utils.grid2Pos(target.x, target.y);
        let index = Utils.indexValue(target.x, target.y);
        // console.log(GameData.starSprite[index]);
        if (!GameData.starSprite[index]) {
            self.effectRemoveSame(gridPos, list, oldList, callback, lineList);
        } else {
            if (this.linePool.size() > 0) {
                line = this.linePool.get();
            } else {
                line = cc.instantiate(this.line);
            }
            line.parent = this.node;
            let script = line.getComponent('line');
            cc.director.SoundManager.playSound('disco');
            script.computedLineDistanceAndRotation(pos, targetPos);
            line.position = pos;
            lineList.push(line);
            line.scale = 0.05;
            line.runAction(
                cc.sequence(
                    cc.scaleTo(0.1, 1, 1),
                    cc.callFunc(function () {
                        self.blockEffect(target);
                        self.effectRemoveSame(gridPos, list, oldList, callback, lineList);
                    })
                )
            )
        }


    },

    // 被选取
    blockEffect(pos) {
        let index = Utils.indexValue(pos.x, pos.y);
        let stone = GameData.starSprite[index];
        if (!!stone) {
            let script = stone.getComponent('block');
            script.blockChoosed();
        }
    },

    // 色块变炸弹

    blockToBoom(pos, type) {
        let index = Utils.indexValue(pos.x, pos.y);
        let stone = GameData.starSprite[index];
        if (!stone) {
            return;
        }
        let blockType = GameData.getDataBygrid(pos);
        cc.systemEvent.emit('NUMBER_COUNT', {
            type: blockType
        });
        let script = stone.getComponent('block');
        if (type == 1) {
            script.changeStoneNum(Config.bType);
            // GameData.updateSingleData();
            GameData.starMatrix[pos.x][pos.y] = Config.bType;
        } else {
            script.changeStoneNum(Config.rType);
            GameData.starMatrix[pos.x][pos.y] = Config.rType;
        }

    },

    // 判断列表中是否存在道具
    isSpecialTool(list) {
        let b = false;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (GameData.starMatrix[item.x][item.y] >= Config.rType && GameData.starMatrix[item.x][item.y] < 20) {
                b = true;
                break;
            }
        }
        return b;
    },


    // 处理气球爆炸
    handleBalloonBomb(list, self) {
        let ballList = Utils.getBalloonClearList(GameData.starMatrix, list, 21);
        if (!!ballList && ballList.length > 0) {
            while (ballList.length > 0) {
                let itemBall = ballList.pop();
                self.balloonBoomEffect(itemBall);
                self.removeBlock(itemBall);
                cc.director.SoundManager.playSound('balloonBreaken');
            }
        }
    },

    // 处理藤蔓
    handleVineBreak(list, self) {
        let vineList = Utils.getBalloonClearList(GameData.starMatrix, list, 22);
        if (!!vineList && vineList.length > 0) {
            while (vineList.length > 0) {
                let itemVine = vineList.pop();
                let script = this.getNodeBygGrid(itemVine);
                self.vineBreakEffect(itemVine);
                script.bombRatio--;
                script.cubesUnlock();
            }
        }
    },

    // 处理木箱子
    handleWoodBreak(list, self) {
        let woodBoxList = Utils.getBalloonClearList(GameData.starMatrix, list, 23);
        if (!!woodBoxList && woodBoxList.length > 0) {
            while (woodBoxList.length > 0) {
                let itemWoodBox = woodBoxList.pop();
                let script = this.getNodeBygGrid(itemWoodBox);

                if (typeof script.bombRatio == 'number') {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        // this.stonePool.put(script.node);
                        self.removeBlock(itemWoodBox);
                        script.boxCubesDisappear();
                        self.woodCubeBreakEffect(itemWoodBox);
                    } else {
                        script.boxHit();
                        // self.woodBoxBreakEffect(itemWoodBox);
                        if (script.bombRatio == 2) {
                            this.woodBoxBreakEffect(itemWoodBox, 2);
                        } else {
                            this.woodBoxBreakEffect(itemWoodBox, 1);
                        }
                    }
                }
            }
        }
    },

    // 处理花
    handleFlowerBreak(list, self) {
        let flowerList = Utils.getBalloonClearList(GameData.starMatrix, list, 26);
        if (!!flowerList && flowerList.length > 0) {
            while (flowerList.length > 0) {
                let itemFlower = flowerList.pop();
                let script = this.getNodeBygGrid(itemFlower);
                if (typeof script.bombRatio == 'number') {
                    script.bombRatio--;
                    if (script.bombRatio < 0) {
                        // this.stonePool.put(script.node);
                        self.flowerCollectAnimation(itemFlower);
                        // self.removeBlock(itemFlower);
                        script.collectFlower();
                    } else {
                        script.flowerHit();
                        self.flowerOpenEffect(itemFlower);
                    }
                }
            }
        }
    },

    // 处理风车
    handleWindmillBreak(list, self) {
        let windmillList = Utils.getBalloonClearList(GameData.starMatrix, list, 27);
        if (!!windmillList && windmillList.length > 0) {
            while (windmillList.length > 0) {
                let windmill = windmillList.pop();
                let script = this.getNodeBygGrid(windmill);
                if (typeof script.bombRatio == 'number') {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        self.windmillDisappearEffect(windmill);
                    } else {
                        script.hitWindmill();
                        self.windmillBreakEffect(windmill, script.bombRatio);
                    }
                }
            }
        }
    },


    // 处理彩色箱子的破碎的破碎
    handleColorCubesBreak(list, self) {
        let colorCubeList = Utils.getBalloonClearList(GameData.starMatrix, list, 29);
        let type = GameData.starMatrix[list[0].x][list[0].y];
        if (!!colorCubeList && colorCubeList.length > 0) {
            // for(let )        
            while (colorCubeList.length > 0) {
                let item = colorCubeList.pop();
                let script = this.getNodeBygGrid(item);
                if (script.nextType == type && typeof script.bombRatio == 'number') {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        self.colorCubeBreakEffect(item);
                        self.removeBlock(item);
                        script.boxCubesDisappear();
                    }

                }
            }
        }
    },

    // 处理彩色气球的破碎
    handleColorBalloonBreak(list, self) {
        let colorCubeList = Utils.getBalloonClearList(GameData.starMatrix, list, 40);
    },



    // 处理瓢虫箱子破碎
    handleLadyBugCubesBreak(list, self) {
        let ladyBugCubesList = Utils.getBalloonClearList(GameData.starMatrix, list, 37);
        if (!!ladyBugCubesList && ladyBugCubesList.length > 0) {
            while (ladyBugCubesList.length > 0) {
                let item = ladyBugCubesList.pop();
                let script = this.getNodeBygGrid(item);
                if (typeof script.bombRatio == 'number') {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {

                        self.ladyBugCubesBreakEffect(item, script.bombRatio);

                    } else {
                        self.ladyBugCubesBreakEffect(item, script.bombRatio);
                        script.hitLadyBugCubes();
                    }
                }
            }

        }
    },

    // 瓢虫气泡破碎后
    ladyBugCubeBreak(grid) {
        let randomLength = 4 + Math.floor(Math.random() * 4);
        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
        cc.director.SoundManager.playSound('ladyBugFly');
        let randomList = Utils.randomGetGrid(randomLength, GameData.starMatrix);
        if (!!randomList && randomList.length > 0) {
            for (let i = 0; i < randomList.length; i++) {
                let endGrid = randomList[i];
                if (i == randomList.length - 1) {
                    this.ladyBugMoveLine(grid, endGrid, true);
                } else {
                    this.ladyBugMoveLine(grid, endGrid);
                }

            }
        } else {
            cc.director.needWait = 0;
            cc.director.isSuperTool = 0;
            if (!this.target.isGameEnd) {
                cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            }

        }

    },


    // 瓢虫的运动轨迹
    ladyBugMoveLine(start, end, isLast) {
        let self = this;
        let startPos, endPos;
        startPos = Utils.grid2Pos(start.x, start.y);
        endPos = Utils.grid2Pos(end.x, end.y);
        let ladyBug = cc.instantiate(this.ladyBugMove);
        let animaCtrl = ladyBug.getComponent(cc.Animation);
        animaCtrl.play('ladyBug');
        ladyBug.parent = this.node;
        ladyBug.position = startPos;
        ladyBug.zIndex = 10;
        var bezier = [cc.v2(startPos.x, (startPos.y + endPos.y) * 3 / 4), cc.v2(endPos.x, (startPos.y + endPos.y) * 1 / 4), endPos];
        let action = cc.sequence(
            cc.bezierTo(1, bezier),
            cc.spawn(
                cc.delayTime(0.3),
                cc.callFunc(function () {
                    self.cubeShakeAction(end);
                }),
            ),
            cc.fadeOut(0.2),
            cc.callFunc(function () {
                ladyBug.removeFromParent();
                self.ladyBugArriveCubeEffect(endPos);
                self.changeCubesAccordingAround(end);
                if (!!isLast) {
                    if (!self.target.isGameEnd) {
                        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                    }
                    cc.director.needWait = 0;
                    cc.director.isSuperTool = 0;
                    cc.director.SoundManager.playSound('ladyBugChangeColor');
                    self.showTipsView();
                }
            })
        )
        ladyBug.runAction(action);
    },

    // 瓢虫到达方块的动效
    ladyBugArriveCubeEffect(pos) {
        let arrive = cc.instantiate(this.ladyBugArrive);
        arrive.parent = this.node;
        arrive.position = pos;
        arrive.getComponent(cc.ParticleSystem).resetSystem();
    },

    // 瓢虫变成跟周边的方块相同
    changeCubesAccordingAround(grid) {
        let cloneGrid = this.judgeCubes(grid);
        let cloneScript = this.getNodeBygGrid(cloneGrid);
        if (!!cloneScript) {
            let script = this.getNodeBygGrid(grid);
            if (!script) {
                return;
            }
            let type = GameData.starMatrix[cloneGrid.x][cloneGrid.y];
            GameData.starMatrix[grid.x][grid.y] = type;
            let cube = script.node;
            let action = cc.sequence(
                cc.scaleTo(0.2, 0.8),
                cc.scaleTo(0.4, 1.2),
                cc.scaleTo(0.2, 1),
                // cc.callFunc(function(){
                //     cc.director.needWait=0;
                // })
            );
            cube.runAction(action);
            script.initStoneView(grid.x, grid.y, type);

        }
    },

    // 瓢虫停在方块上时方块震动的动作
    cubeShakeAction(grid) {
        let script = this.getNodeBygGrid(grid);
        if (!script) {
            return;
        }
        let cube = script.node;
        let action = cc.sequence(
            cc.scaleTo(0.02, 0.8),
            cc.scaleTo(0.04, 1.2),
            cc.scaleTo(0.02, 1.0),
        ).repeat(3);
        cube.runAction(action);
    },


    // 判断选择哪个方块同化
    judgeCubes(grid) {
        let aroundList = Utils.getItemAdjacentPos(grid);
        // console.log(aroundList,'1740');
        let isSuit = false;
        let tempGrid;
        for (let i = 0; i < aroundList.length; i++) {
            let item = aroundList[i];
            if (GameData.starMatrix[item.x][item.y] >= 0 && GameData.starMatrix[item.x][item.y] < 8) {
                isSuit = true;
                tempGrid = item;
                break;
            }
        }
        if (!!isSuit) {
            return tempGrid;
        } else {
            return false;
        }
    },




    // handleHinderCubesBreak(matrixList,List,type,self){
    //     let waitHandleList = Utils.getBalloonClearList(matrixList,List,type);
    //     let compareType = matrixList[List[0].x][List[0].y];
    //     if(!!waitHandleList && waitHandleList.length>0){
    //         while(waitHandleList.length>0){
    //             let item = waitHandleList.pop();
    //             let script = this.getNodeBygGrid(item);
    //             if(typeof script.bombRatio=='number'){
    //                 if(type==21){
    //                     self.balloonBoomEffect(item);
    //                     self.removeBlock(item);
    //                     cc.director.SoundManager.playSound('balloonBreaken');
    //                 }else if(type==22){
    //                     self.vineBreakEffect(item);
    //                     script.bombRatio--;
    //                     script.cubesUnlock();
    //                 }else if(type==23){
    //                     script.bombRatio--;
    //                     if (script.bombRatio <= 0) {
    //                         // this.stonePool.put(script.node);
    //                         self.removeBlock(item);
    //                         script.boxCubesDisappear();
    //                         self.woodCubeBreakEffect(item);
    //                     } else {
    //                         script.boxHit();
    //                         // self.woodBoxBreakEffect(itemWoodBox);
    //                         if (script.bombRatio == 2) {
    //                             this.woodBoxBreakEffect(item, 2);
    //                         } else {
    //                             this.woodBoxBreakEffect(item, 1);
    //                         }
    //                     }
    //                 }else if(type==26){ 
    //                     script.bombRatio--;
    //                     if (script.bombRatio < 0) {
    //                         // this.stonePool.put(script.node);
    //                         self.flowerCollectAnimation(item);
    //                         // self.removeBlock(itemFlower);
    //                         script.collectFlower();
    //                     } else {
    //                         script.flowerHit();
    //                         self.flowerOpenEffect(item);
    //                     }
    //                 }else if(type==27){
    //                     script.bombRatio--;
    //                     if (script.bombRatio <= 0) {
    //                         self.windmillDisappearEffect(item);
    //                     } else {
    //                         script.hitWindmill();
    //                         self.windmillBreakEffect(item, script.bombRatio);
    //                     }
    //                 }else if(type>=29 && type<=36){
    //                     if(compareType==script.nextType){
    //                         script.bombRatio--;
    //                         if (script.bombRatio <= 0) {
    //                             self.removeBlock(item);
    //                             script.boxCubesDisappear();
    //                             self.woodCubeBreakEffect(item);
    //                         }
    //                     }

    //                 }
    //             }
    //         }
    //     }
    // },





    // 移除相同的色块
    removeSameColorBlock(list, self, lineList) {

        if (!list) {
            console.log('error', list);
            return;
        }

        // 处理气球爆炸
        // self.handleBalloonBomb(list, self);
        // self.handleVineBreak(list, self);

        self.hinderResponseCubesBreak(list, self);

        for (let i = 0; i < list.length; i++) {
            let index = Utils.indexValue(list[i].x, list[i].y);
            let sItem = GameData.starSprite[index];
            if (!!sItem) {
                sItem.stopActionByTag(1);
                self.discoRemoveCuneEffect(list[i]);
                self.removeBlock(list[i]);
                cc.director.SoundManager.playSound('afterDisco');
            }
        }

        for (let i = lineList.length - 1; i >= 0; i--) {
            self.linePool.put(lineList[i]);
        }

        if (!self.target.isPass) {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            cc.systemEvent.emit('OPERATION_EVALUATE', {
                level: 3
            })
        }

        if (cc.director.isrunning) {
            return;
        }
        self.whichTimeTampRow('removeSamecolorblock');

    },



    // 改变合成后的数据
    updateStoneTexture(pos, len, type) {
        // console.log(pos, len, type, 'container_1219_cubeNull');
        let stone;
        if (this.stonePool.size() > 0) {
            stone = this.stonePool.get();
        } else {
            stone = cc.instantiate(this.stone);
        }
        // console.log(pos, len, type, 'container_1226_cubeNull');
        let index = Utils.indexValue(pos.x, pos.y);
        if (GameData.starSprite[index] != null) {
            let one = GameData.starSprite[index];
            this.stonePool.put(one);
        }
        GameData.starSprite[index] = stone;
        stone.parent = this.node;
        stone.position = Utils.grid2Pos(pos.x, pos.y);
        GameData.updateSingleData(pos, len + type);
        if (len + type - 1 >= 8) {
            cc.director.SoundManager.playSound('combine');
            // 合成道具效果
            this.toolAndSuperToolEffect(pos);
        }
        let script = stone.getComponent('block');
        let newType = GameData.getDataBygrid(pos);
        script.initStoneView(pos.x, pos.y, newType, type);
        // this.tampRows();
        cc.systemEvent.emit('STEP_COUNT');

        if (cc.director.isrunning) {
            return;
        }
        this.whichTimeTampRow('changeStonetexture');
        // console.log(GameData.starMatrix);
    },


    // 合成道具 或者超级道具的合成效果
    toolAndSuperToolEffect(grid) {
        let pos = Utils.grid2Pos(grid.x, grid.y);
        let toolCombineEffct = cc.instantiate(this.toolCombineEffect);
        toolCombineEffct.position = pos;
        toolCombineEffct.parent = this.node;
    },

    // 节点移动 todo
    nodeMove(movePos, targetPos, len, type, callFunc) {

        let self = this;
        let index = Utils.indexValue(movePos.x, movePos.y);
        let stone = GameData.starSprite[index];
        let targetPos1 = Utils.grid2Pos(targetPos.x, targetPos.y);
        stone.getComponent('block').outLine.active = true;
        stone.zIndex = 1;

        let blockType = GameData.getDataBygrid(movePos);
        GameData.starSprite[index] = null;
        GameData.cleanStarData([movePos]);
        // let last_cube = false;
        // if(!!len){
        //     last_cube=true;
        // }
        cc.systemEvent.emit('REMOVE_SINGLE_GRASS', {
            pos: movePos,
            // isLastCube: last_cube,
        });
        if (blockType >= 0 && blockType < 8) {
            cc.systemEvent.emit('REMOVE_SINGLE_BUBBLE', {
                pos: movePos,
            });
        }

        stone.runAction(
            cc.sequence(
                cc.scaleTo(0.2, 1.5),
                cc.spawn(
                    cc.rotateBy(0.2, Math.random() * 360),
                    cc.scaleTo(0.2, 0.5),
                    cc.moveTo(0.2, targetPos1),
                ),
                cc.spawn(
                    cc.scaleTo(0.2, 0.5),
                    cc.fadeOut(0.1),
                ),

                cc.callFunc(function () {
                    self.removeBlock2(stone, blockType);
                    // console.log('1296',len,callFunc,type);
                    if (!!len && !!callFunc && type >= 0) {
                        callFunc(targetPos, len, type, self);
                    }
                })
            )
        );

    },

    // 移除一个色块
    removeBlock2(stone, blockType) {
        // console.log('111111__________1365');
        // 移除色块的类型
        if (!stone) {
            // console.log('heieheiheiehei');
            return;
        }
        cc.systemEvent.emit('NUMBER_COUNT', {
            type: blockType
        });
        if (blockType < 20) {
            // let score = 2 ** (blockType + 1);
            let score = 250;
            this.progressBar.judgeStepScore(score);
        } else {
            this.progressBar.judgeStepScore(0);
        }
        stone.removeFromParent();
        this.stonePool.put(stone);
    },

    // 移除一个色块
    removeBlock(grid, status) {

        let index = Utils.indexValue(grid.x, grid.y);
        let stone = GameData.starSprite[index];
        // 移除色块的类型
        if (!stone) {
            return;
        }
        let blockType = GameData.getDataBygrid(grid);

        if (!status) {
            cc.systemEvent.emit('NUMBER_COUNT', {
                type: blockType
            });
            if (blockType < 20) {
                // let score = 2 ** (blockType + 1);
                let score = 250;
                this.progressBar.judgeStepScore(score);
            } else {
                this.progressBar.judgeStepScore(0);
            }
        }
        GameData.starSprite[index] = null;
        this.stonePool.put(stone);
        GameData.cleanStarData([grid]);
        cc.systemEvent.emit('REMOVE_SINGLE_GRASS', {
            pos: grid
        });
        if (blockType >= 0 && blockType < 8) {
            cc.systemEvent.emit('REMOVE_SINGLE_BUBBLE', {
                pos: grid,
            })
        }

    },

    // 判断当前的消除砖块中是否存在特殊砖块并返回所有需要消除的数据
    judgeSpecialBlock(list) {
        // console.log(list,'643');
        let len = list.length;
        for (let i = 0; i < list.length; i++) {
            let type = GameData.getDataBygrid(list[i]);
            if (type >= 8) {
                let script = this.getNodeBygGrid(list[i]);
                // 火箭
                if (script._stoneType == Config.rType) {
                    if (script.rocketType == 0) {//消除列
                        let itemList = Utils.getColData(GameData.starMatrix, list[i]);
                        for (let j = 0; j < itemList.length; j++) {
                            if (!Utils.indexOfV2(list, itemList[j])) {
                                list.push(itemList[j]);
                            }
                        }

                    } else {//消除行
                        let itemList = Utils.getRowData(GameData.starMatrix, list[i]);
                        for (let j = 0; j < itemList.length; j++) {
                            if (!Utils.indexOfV2(list, itemList[j])) {
                                list.push(itemList[j]);
                            }
                        }

                    }

                } else {
                    // 炸弹
                    if (script._stoneType == Config.bType) {
                        let itemList = Utils.rainbowStarRemoveList(GameData.starMatrix, list[i]);
                        for (let j = 0; j < itemList.length; j++) {
                            if (!Utils.indexOfV2(list, itemList[j])) {
                                list.push(itemList[j]);
                            }
                        }
                    }
                    if (script._stoneType == Config.dType) {
                        let type = script.discoType;
                        let itemList = Utils.getSameBlockList(GameData.starMatrix, list[i], type);
                        for (let j = 0; j < itemList.length; j++) {
                            if (!Utils.indexOfV2(list, itemList[j])) {
                                list.push(itemList[j]);
                            }
                        }
                    }
                }

            }
        }

        if (len == list.length) {
            // console.log(list,693);
            return list;
        } else {
            this.judgeSpecialBlock(list);
        }
        // console.log(list,'687');
    },


    //
    getNodeBygGrid(pos) {
        let index = Utils.indexValue(pos.x, pos.y);
        let stone = GameData.starSprite[index];
        if (!!stone) {
            let script = stone.getComponent('block');
            return script;
        } else {
            return false;
        }

    },




    // 垂直方向   
    tampRows() {
        this.canclePlayerNotice();
        this.resumeOriginView();
        this.queryCanFall();
        this.addStar();
        if (Utils.gameOver(GameData.starMatrix)) {
            // 判断游戏是否结束

            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            this.scheduleOnce(function () {
                cc.systemEvent.emit('SHUFFLE_TIPS');
            }, 1.5)

            this.scheduleOnce(function () {
                this.shuffleStarMatrix();
            }, 2.5)

        }
        this.isPineToEnd();
        cc.director.isMoving = false;
        if (GameData.bestLevel > 0) {
            this.showTipsView();
        }

    },


    // 递归查询是否还存在可下落
    queryCanFall(index_rest) {
        let start;
        if (typeof index_rest == 'number') {
            start = index_rest;
        } else {
            start = 0;
        }
        for (let i = 0; i < Config.matrixCol; i++) {
            let col = i;
            let row = -1;
            for (var j = start; j < Config.matrixRow; j++) {
                // 判断掉落的起始点
                if (GameData.starMatrix[j][col] == -1) {
                    row = j;
                    break;
                }
            }

            if (row >= 0) {
                for (let k = row; k < Config.matrixRow; k++) {
                    //  不执行掉落操作
                    if (GameData.starMatrix[k][col] == -2 || GameData.starMatrix[k][col] == 26 || GameData.starMatrix[k][col] == 27) {
                        continue;
                    }
                    let index = -1;
                    for (let t = k + 1; t < Config.matrixRow; t++) {
                        if (GameData.starMatrix[t][col] >= 0 && GameData.starMatrix[t][col] != 26 && GameData.starMatrix[t][col] != 27) {
                            index = t;
                            break;
                        }
                    }

                    if (index >= 0) {
                        if (GameData.starMatrix[index][col] == 22 || (GameData.starMatrix[index][col] >= 23 && GameData.starMatrix[index][col] <= 25)
                            || (GameData.starMatrix[index][col] >= 29 && GameData.starMatrix[index][col] <= 36)) {
                            // console.log('进来这里了么？')
                            this.queryCanFall(index + 1);
                            break;
                        }

                        GameData.starMatrix[k][col] = GameData.starMatrix[index][col];
                        GameData.starMatrix[index][col] = -1;
                        this.donwMove(cc.v2(k, col), cc.v2(index, col));
                    }


                }
            }
        }
    },


    // 显示提示图示 
    showTipsView() {
        let temp = JSON.parse(JSON.stringify(GameData.starMatrix));
        let tipsViewList = Utils.chooseRemoveList(temp);
        if (tipsViewList.length <= 0) {
            return;
        }
        for (let i = 0; i < tipsViewList.length; i++) {
            let item = tipsViewList[i];
            let len = item.length
            for (let j = 0; j < len; j++) {
                let type;
                let script = this.getNodeBygGrid(item[j]);
                if (len >= 5 && len < 7) {
                    type = 0;
                }
                if (len >= 7 && len < 9) {
                    type = 1;
                }
                if (len >= 9) {
                    type = 2;
                }
                script.updateTipsView(type);
            }
        }
        this.tempTipsView = tipsViewList;
    },


    // 回复原来的样子
    resumeOriginView() {
        for (let i = 0; i < Config.matrixRow; i++) {
            for (let j = 0; j < Config.matrixCol; j++) {
                if (GameData.starMatrix[i][j] >= 0 && GameData.starMatrix[i][j] < Config.rType) {
                    let item = cc.v2(i, j);
                    let script = this.getNodeBygGrid(item);
                    // if(!script){
                    //     continue;
                    // }else{
                    script.originView();
                    // }

                }
            }
        }

    },




    // 下移操作
    donwMove(target, start) {
        // console.log(target,start);
        let sIndex = Utils.indexValue(start.x, start.y);
        let eIndex = Utils.indexValue(target.x, target.y);
        // let startPos = Utils.grid2Pos(start.x,start.y);
        let targetPos = Utils.grid2Pos(target.x, target.y);
        let stone = GameData.starSprite[sIndex];
        // console.log(stone.getActionByTag(1));
        stone.stopActionByTag(5);
        // stone.stopAllActions();
        // stone.clear
        stone.getComponent('block').changeStoneGrid(target.x, target.y);
        GameData.starSprite[eIndex] = stone;
        GameData.starSprite[sIndex] = null;
        let action =
            cc.sequence(
                cc.moveTo(start.x * 0.05, targetPos).easing(cc.easeExponentialIn()),
                cc.jumpTo(0.1, targetPos, 10, 1),
                cc.callFunc(function () {
                    cc.director.SoundManager.playSound('drop4');
                })
            );
        action.tag = 5;
        stone.runAction(action);
    },


    // 显示



    //判断松果是否掉落到最底部
    isPineToEnd() {
        let list = this.isFallToBlow(GameData.starMatrix);

        if (!!list) {
            this.addGameMoveStatus();
            cc.director.isPine = 1;
            this.scheduleOnce(
                function () {
                    this.removePineCone(list);
                }, 0.5
            )
        }
    },


    // 移除松果（20）障碍物

    removePineCone(list) {
        // console.log(list, '1063');
        if (!!this.tempList) {
            // this.reduceGameMoveStatus();
            return;
        }
        // cc.director.needWait=false;
        this.tempList = list;
        for (let i = 0; i < list.length; i++) {
            let vector = list[i];
            this.removeBlock(vector, 1);
            let pos = Utils.grid2Pos(vector.x, vector.y);
            let worldPosition = this.node.convertToWorldSpaceAR(pos);
            let isLast = (i == list.length - 1);
            if (isLast) {
                // cc.director.checkLastPine = true;
                cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            }
            cc.systemEvent.emit('PINECONE', {
                worldPosition, isLast
            });

        }
        // 延时0.5秒，为了添加操作完成
        this.scheduleOnce(function () {
            if (cc.director.isrunning) {
                return;
            }
            this.whichTimeTampRow('removepinecone');
            this.tempList = null;
        }, 0.5);

    },


    //  判断是否有障碍到了最下面
    isFallToBlow(list) {
        // console.log('test1309')
        let ballList = [];
        let hinderList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].length; j++) {
                if (list[i][j] == 20) {
                    hinderList.push(cc.v2(i, j));
                }
            }
        }

        while (hinderList.length > 0) {
            let item = hinderList.pop();
            if (this.judgePineDowm(item, list)) {
                ballList.push(item);
            }
        }
        if (ballList.length > 0) {
            return ballList;
        } else {
            return false;
        }

    },

    // 判断坚果下面是否全是空格
    judgePineDowm(item, list) {
        let isDown = true;
        let len = item.x;
        if (len == 0) {
            return isDown;
        }
        for (let i = len - 1; i >= 0; i--) {
            if (list[i][item.y] != -2) {
                isDown = false;
                break;
            }
        }
        return isDown;
    },






    // 添加星星
    addStar() {
        // for (let col = 0; col < Config.matrixCol; col++) {
        //     for (var row = 0; row < Config.matrixRow; row++) {


        //         if (GameData.starMatrix[row][col] == -1) {

        //             let vector = cc.v2(row, col);
        //             this.fallStoneFromTop(vector);

        //         }
        //     }
        // }
        // if (!this.target.isPass) {
        //     this.handleCanCombineTool();
        // }
        for (let col = 0; col < Config.matrixCol; col++) {
            //判断是否存在藤蔓道具
            let specialHinder = -1;
            for (let row = Config.matrixRow - 1; row >= 0; row--) {
                if (GameData.starMatrix[row][col] == 22 || (GameData.starMatrix[row][col] >= 23 && GameData.starMatrix[row][col] <= 25)
                    || (GameData.starMatrix[row][col] >= 29 && GameData.starMatrix[row][col] <= 36)) {
                    specialHinder = row;
                    break;
                }
            }

            if (specialHinder >= 0) {
                for (let r = specialHinder; r < Config.matrixRow; r++) {
                    if (GameData.starMatrix[r][col] == -1) {
                        let vector = cc.v2(r, col);
                        this.fallStoneFromTop(vector);

                    }
                }
            } else {
                for (let r1 = 0; r1 < Config.matrixRow; r1++) {
                    if (GameData.starMatrix[r1][col] == -1) {
                        let vector = cc.v2(r1, col);
                        this.fallStoneFromTop(vector);
                        // cc.director.SoundManager.playSound('drop');

                    }
                }
            }

        }

        if (!this.target.isPass) {
            this.handleCanCombineTool();
        }


    },


    // 处理可合成道具特效
    handleCanCombineTool() {
        if (!this.effectList) {
            this.effectList = [];
        } else {
            while (this.effectList.length > 0) {
                let item = this.effectList.pop();
                let effect = item.getChildByName('temp');
                effect.removeAllChildren();
            }
        }
        let toolList = Utils.judgeNearNode(GameData.starMatrix);
        while (toolList.length > 0) {
            let item = toolList.pop();
            let script = this.getNodeBygGrid(item);
            let effect;
            effect = cc.instantiate(this.tool_effect);
            script.toolCanCombineEffect(effect);
            this.effectList.push(script.node);
        }
    },


    // 处理掉先前数组中的数据
    removeToolEffect(pos) {
        let temp = this.getNodeBygGrid(pos).temp;
        let effect = temp.getChildByName('tool_effect');
        this.toolEffectPool.put(effect);
        temp.active = false;
    },


    // 从顶部掉落石头
    fallStoneFromTop(pos) {
        // console.log('fuck you')
        let stone;
        let row = 10;
        let col = pos.y;
        if (this.stonePool.size() > 0) {
            stone = this.stonePool.get();
        } else {
            stone = cc.instantiate(this.stone);
        }
        let startPos = Utils.grid2Pos(row, col);
        this.node.addChild(stone);
        let script = stone.getComponent('block');
        // let type = Utils.randomColorByArray([1, 2, 3, 4, 5, 6,7,8]);
        let type = Utils.randomColorByArray([1, 2, 3, 4, 5]);
        script.initStoneView(pos.x, pos.y, type - 1);
        GameData.updateSingleData(pos, type);
        stone.position = startPos;
        let targetPos = Utils.grid2Pos(pos.x, pos.y);
        let index = Utils.indexValue(pos.x, pos.y);
        GameData.starSprite[index] = stone;
        stone.runAction(
            cc.sequence(
                cc.fadeIn(0.1),
                cc.moveTo(pos.x * 0.05, targetPos).easing(cc.easeExponentialIn()),
                cc.callFunc(function () {
                    cc.director.SoundManager.playSound('drop4');
                }),
                cc.jumpBy(0.1, cc.v2(0, 0), 10, 1),
            )
        )

    },



    // 交换
    shuffleStarMatrix() {
        this.canclePlayerNotice();
        cc.director.SoundManager.playSound('dice');
        let arr = GameData.starSprite;
        let tempArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (!!arr[i]) {
                let item = arr[i].getComponent('block')._stoneType;
                if (item >= 0 && item < Config.rType) {
                    tempArr.push(arr[i]);
                }
            }
        }
        tempArr = this.shuffle(tempArr);
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (!!arr[i]) {
                let item = arr[i].getComponent('block')._stoneType;
                if (item >= 0 && item < Config.rType) {
                    arr[i] = tempArr[count];
                    count++;
                }
            }
        }

        for (let a = 0; a < Config.matrixRow; a++) {
            for (let b = 0; b < Config.matrixCol; b++) {
                if (GameData.starMatrix[a][b] >= 0 && GameData.starMatrix[a][b] < Config.rType) {
                    let index = Utils.indexValue(a, b);
                    let starNode = GameData.starSprite[index];
                    let sScript = starNode.getComponent('block');
                    let pos = Utils.grid2Pos(a, b);
                    starNode.runAction(
                        cc.moveTo(0.5, pos)
                    );
                    GameData.starMatrix[a][b] = sScript._stoneType;
                    sScript.changeStoneGrid(a, b);
                }
            }
        }
        //  console.log(GameData.starMatrix);
        this.handleCanCombineTool();
        this.resumeOriginView();
        if (GameData.bestLevel > 0) {
            this.showTipsView();
        }

        // this.isPineToEnd();

        if (Utils.gameOver(GameData.starMatrix)) {
            // 判断游戏是否结束
            cc.systemEvent.emit('SHUFFLE_TIPS');
            this.scheduleOnce(function () {
                this.shuffleStarMatrix();
            }, 1.5)
        } else {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
        }
    },


    shuffle(arr) {
        var length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    },


    // 发射小彗星
    fireTheHole(event) {
        let self = this;
        let fire;
        let data = event;

        if (this.firePool.size() > 0) {
            fire = this.firePool.get();
        } else {
            fire = cc.instantiate(this.fire);
        }

        // let particle = fire.getComponent(cc.ParticleSystem);
        let startPos = this.node.convertToNodeSpaceAR(data.startPos);
        let endPos;
        if (!!data.endGrid) {

            endPos = Utils.grid2Pos(data.endGrid.x, data.endGrid.y);

        } else {
            this.executePassEffect();
            return;
        }

        // particle.resetSystem();
        fire.parent = this.node;
        fire.position = startPos;
        cc.director.SoundManager.playSound('flyStart');
        fire.getComponent('arrow').computedLineDistanceAndRotation(data.startPos, endPos);

        let action =
            cc.sequence(
                cc.moveTo(0.3, endPos),
                cc.callFunc(function () {
                    self.effectRemoveCol(data.endGrid);
                }),
                cc.callFunc(function () {
                    self.firePool.put(fire);
                    self.blockToBoom(data.endGrid, 2);
                    cc.director.SoundManager.playSound('flyEnd');
                })
            );
        // let testArrow = cc.instantiate(this.testArrow);
        // testArrow.rotation =degree;
        // testArrow.parent = this.node ;
        // testArrow.position = startPos;

        // testArrow.runAction(
        //     cc.moveTo(0.5, endPos),
        // );

        fire.runAction(action);
        if (data.step <= 0) {
            this.scheduleOnce(function () {
                self.executePassEffect();
            }, 1);
        }
    },

    // 获得一个游戏道具
    getGameTool() {
        let item;
        for (let i = Config.matrixRow - 1; i >= 0; i--) {
            for (let j = 0; j < Config.matrixCol; j++) {
                if (GameData.starMatrix[i][j] >= Config.rType && GameData.starMatrix[i][j] <= Config.dType) {
                    item = cc.v2(i, j);
                    // console.log(item);
                    break;
                    // console.log(item);
                }
            }
        }

        if (!!item) {
            // console.log(item)
            return item;
        } else {
            return false;
        }
    },

    // 执行消除操作 过关动效
    executePassEffect() {
        let grid = this.getGameTool();
        this.passIndex = true;
        // console.log(grid,'1767');
        if (!!grid) {
            this.handleGameToolArray(grid);
            this.scheduleOnce(function () {
                this.executePassEffect();
            }, 1);
        } else {

            setTimeout(function () {
                cc.director.dialogScript.showResultPromptView(this.list);
                // console.log('congratulation1');
            }.bind(this), 1000);
            // console.log('congratulation');

        }
        if (cc.director.isrunning) {
            return;
        }
        this.whichTimeTampRow('executepasseffect');
    },

    // 往容器中加入游戏道具
    addGameToolToContainer(list,flag) {
        let isHas = false;
        for (let a = 0; a < list.length; a++) {
            if (list[a] > 0) {
                isHas = true;
                break;
            }
        }

        if (list.length <= 0 || !isHas) {
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            cc.find('Canvas/guideNode').active = true;
            return;
        }

        let grid = Utils.getRandomBlockPosition(GameData.starMatrix, 3);
        this.isMoving = true;
        for (let i = 0; i < list.length; i++) {
            this.scheduleOnce(function () {
                if (list[i] > 0 ) {
                    let item = list[i];
                    if(!flag){
                        GameData.gameToolList[i] -= item;
                    }
                    let sScript = this.getNodeBygGrid(grid[i]);
                    let node = sScript.node;
                    node.scale = 1.2;
                    node.runAction(
                        cc.scaleTo(0.5, 1)
                    )
                    this.toolAndSuperToolEffect(grid[i]);
                    // GameData.updateSingleData(grid[i], 8 + i);
                    GameData.starMatrix[grid[i].x][grid[i].y] = (8 + i);
                    sScript.changeStoneNum(8 + i);
                    list[i] = 0;
                    cc.director.SoundManager.playSound('choosed_voice');
                }
                if (i == list.length - 1) {
                    this.handleCanCombineTool();
                    if (!this.target.isPass) {
                        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                    }
                    cc.systemEvent.emit('STOP_TOUCH', { number: 1 });

                }
            }, i * 1)
        }

    },


    // 开始新的游戏
    startNewGame() {
        cc.game.GameMoveStatus = 0;
        cc.game.windmillCount = 0;
        this.canclePlayerNotice();
        let stoneData;
        let levelRes;
        let step;
        let targetList;
        cc.director.isPine = 0;
        cc.director.checkLastPine = 0;

        if (GameData.bestLevel >= 0 && GameData.bestLevel <= 300) {
            // GameData.bestLevel = 20;
            levelRes = levelResource[GameData.bestLevel];
            stoneData = JSON.parse(JSON.stringify(levelRes.mapList));
            GameData.starMatrix = stoneData;
            this.list = levelRes.targetList;
            step = levelRes.step;
        } else {
            if (!this.hinderList) {
                targetList = this.createRandomTargetList();
                let hinder = this.createHinderList(targetList);
                let randomList = Utils.initMatrixDataPortraitRandom();
                let hinderList = Utils.addHinder(randomList, hinder[0], -2);
                hinderList = Utils.addHinder(randomList, hinder[1], 20);
                hinderList = Utils.addHinder(randomList, hinder[2], 21);
                this.hinderList = hinderList;
                this.list = targetList;
                step = this.createStep();
                this.tempStep = step;
            }
            stoneData = JSON.parse(JSON.stringify(this.hinderList));
            targetList = this.list;
            GameData.starMatrix = stoneData;
            step = this.tempStep;
            levelRes = {};
        }

        // this.demo =
        //     [
        //         [1, 2, 1, 1, 2, 1, 3, 2, 2],
        //         [37, 3, 3, 3, 37, 3, 3, 3, 2],
        //         [27, 0, 1, 29, 29, 30, 30, 0, 2],
        //         [3, 3, 4, 0, 0, 1, 1, 2, 31],
        //         [2, 39, 8, 9, -2, 39, 1, 2, 31],
        //         [36, 7, 0, 2, -2, 37, 1, 3, 32],
        //         [1, 2, 3, 4, 23, 23, 1, 2, 1],
        //         [1, 35, 35, 34, 34, 33, 33, 1, 21],
        //         [37, 6, 6, 5, 5, 4, 4, 1, 21]
        //     ],
        // [
        //     [-2, 0, 0, 0, -2, 0, 0, 0, -2],
        //     [-2, 29, 29, 29, -2, 29, 29, 29, -2],
        //     [-2, 1, 1, 1, -2, 1, 1, 1, -2],
        //     [-2, 1, 27, 2, -2, 30, 30, 30, -2],
        //     [-2, 2, 2, 2, -2, 2, 2, 2, -2],
        //     [-2, 31, 27, 31, -2, 31, 31, 31, -2],
        //     [-2, 3, 3, 3, -2, 3, 3, 3, -2],
        //     [-2, 32, 32, 32, -2, 32, 32, 32, -2],
        //     [-2, 4, 4, 4, -2, 4, 20, 4, -2]
        // ],
        // stoneData = JSON.parse(JSON.stringify(this.demo));
        // GameData.starMatrix = stoneData;
        // this.list =
        //     [[21, 2], [39, 2], [38, 15]],
        // step = 50;
        // list_bubble = [
        //     [[1, 0], [3, 8], 1]
        // ];
        let list_grass, stoneList, list_bubble;
        cc.director.isMoving = false;
        this.progressBar.initProgressBar();
        this.initContainerView(stoneData);
        // 初始化背景框
        this.bgPrompt.initBgPrompt(GameData.starMatrix);
        // 初始化游戏状态
        this.target.resumeGameStatues();
        this.target.updateNodeTag(this.list, step);
        list_grass = levelRes.grassList;
        stoneList = levelRes.stoneList;
        list_bubble = levelRes.bubbleList;

        if (!!list_grass && !!stoneList) {
            this.grassGround.initFunc(list_grass, stoneList);
        }

        if (!!list_bubble) {
            this.bubbleGround.initFunc(list_bubble);
        }

        if (GameData.bestLevel > 0) {
            this.showTipsView();
        }

        cc.director.dialogScript.goalDisplay.initGoalNumber(this.list);
        cc.director.videoCount = 1;
        this.handleCanCombineTool();
        cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });

    },


    // 随机生成目标数组
    createRandomTargetList() {
        let typeList = [0, 1, 2, 3, 4, 5, 20, 21];
        let targetList = [];
        let checkList = [];
        let len;
        GameData.bestLevel >= 60 ? len = 4 : len = 3;
        while (targetList.length < len) {

            let cList = [];
            let type = Math.floor(Math.random() * typeList.length);
            if (!this.isContain(checkList, type)) {
                checkList.push(type);
                let number = 15 + Math.floor(Math.random() * typeList.length);
                cList[0] = typeList[type];
                typeList[type] >= 4 ? cList[1] = number - 10 : cList[1] = number;
                targetList.push(cList);
            }

        }

        targetList.sort(function (a, b) {
            return a[0] - b[0];
        })
        return targetList;
    },

    //生成障碍数组 
    createHinderList(list) {
        let hinderList = [12, 0, 0];
        let index = 20;
        for (let i = 1; i < 3; i++) {
            let isHas = -1;
            for (let j = 0; j < list.length; j++) {
                if (list[j][0] == index) {
                    // hinderList[i] = list[j][1];
                    isHas = j;
                    break;
                }
            }

            if (isHas >= 0) {
                hinderList[i] = list[isHas][1];
            }

            index++;
        }
        return hinderList;
    },


    createStep() {
        return 35 + Math.floor(Math.random() * 15);
    },


    // 检测是否是包含关系
    isContain(list, item) {
        let isContain = false;
        for (let i = 0; i < list.length; i++) {
            if (item == list[i]) {
                isContain = true;
                break;
            }
        }
        return isContain;
    },





    // 火箭
    col_rocket(grid) {

        let down_rocket, up_rocket;
        if (this.rockPool.size() > 0) {
            down_rocket = this.rockPool.get();
        } else {
            down_rocket = cc.instantiate(this.rock);
        }
        if (this.rockPool.size() > 0) {
            up_rocket = this.rockPool.get();
        } else {
            up_rocket = cc.instantiate(this.rock);
        }
        this.rocketEffect(down_rocket, grid, 1, -90);
        this.rocketEffect(up_rocket, grid, -1, 90);
        cc.director.SoundManager.playSound('rocket');
    },


    row_rocket(grid) {


        let left_rocket, right_rocket;
        if (this.rockPool.size() > 0) {
            left_rocket = this.rockPool.get();
        } else {
            left_rocket = cc.instantiate(this.rock);
        }
        if (this.rockPool.size() > 0) {
            right_rocket = this.rockPool.get();
        } else {
            right_rocket = cc.instantiate(this.rock);
        }
        this.rocketEffect(left_rocket, grid, 2, 0);
        this.rocketEffect(right_rocket, grid, -2, 180);
        cc.director.SoundManager.playSound('rocket');

    },


    rocketEffect(node, grid, type, rotation) {
        let self = this;
        // self.addGameMoveStatus();
        let position = Utils.grid2Pos(grid.x, grid.y);
        node.position = position;
        node.rotation = rotation;
        node.parent = this.node;
        let posList;

        // if()

        let action1 = cc.sequence(
            cc.moveTo(0.5, cc.v2(position.x, position.y + 800 * type)),
            cc.callFunc(function () {
                // self.reduceGameMoveStatus();
                node.removeFromParent();
            })
        );

        let action2 = cc.sequence(
            cc.moveTo(0.5, cc.v2(position.x + 400 * type, position.y)),
            cc.callFunc(function () {
                // self.reduceGameMoveStatus();
                node.removeFromParent();
            })
        )

        if (Math.abs(type) == 1) {
            node.runAction(action1);
            if (type == 1) {
                posList = this.getRemovePositionList(grid, Config.direction.UP, 1);
                node.getComponent('rocket').setRocketPosition(grid, Config.direction.UP, posList);
                // this.removeRocketAcrossData(grid,Config.direction.UP);
            }
            if (type == -1) {

                posList = this.getRemovePositionList(grid, Config.direction.DOWN, 1);
                node.getComponent('rocket').setRocketPosition(grid, Config.direction.DOWN, posList);
                // this.removeRocketAcrossData(grid,Config.direction.DOWN);

            }
        } else {
            node.runAction(action2);
            if (type == 2) {
                posList = this.getRemovePositionList(grid, Config.direction.RIGHT, 2);
                node.getComponent('rocket').setRocketPosition(grid, Config.direction.RIGHT, posList);
                // this.removeRocketAcrossData(grid,Config.direction.RIGHT);
            }
            if (type == -2) {
                posList = this.getRemovePositionList(grid, Config.direction.LEFT, 2);
                node.getComponent('rocket').setRocketPosition(grid, Config.direction.LEFT, posList);
                // this.removeRocketAcrossData(grid,Config.direction.LEFT);
            }
        }

    },

    // 移除数组内的数据
    removeRocketAcrossData(grid, dir) {
        let row = grid.x;
        let col = grid.y;
        if (dir == Config.direction.UP) {
            for (let i = row; i < Config.matrixRow; i++) {
                this.scheduleOnce(function () {
                    if (GameData.starMatrix[i][col] >= 0) {
                        // GameData.starMatrix[i][col]=-1;
                        // this.removeBlock(cc.v2(i,col));
                        let item = cc.v2(i, col);
                        this.handleSingleGrid(item);
                    }
                }, Math.abs(i - row) * 0.05);
            }
        }
        if (dir == Config.direction.DOWN) {
            for (let i = row; i >= 0; i--) {
                this.scheduleOnce(function () {
                    if (GameData.starMatrix[i][col] >= 0) {
                        // GameData.starMatrix[i][col]=-1;
                        // this.removeBlock(cc.v2(i,col));
                        let item = cc.v2(i, col);
                        this.handleSingleGrid(item);
                    }

                }, Math.abs(i - row) * 0.05);
            }
        }

        if (dir == Config.direction.LEFT) {
            for (let i = col; i >= 0; i--) {
                this.scheduleOnce(function () {
                    if (GameData.starMatrix[row][i] >= 0) {
                        // GameData.starMatrix[row][i]=-1;
                        // this.removeBlock(cc.v2(row,i));
                        let item = cc.v2(row, i);
                        this.handleSingleGrid(item);
                    }

                }, Math.abs(i - col) * 0.05);
            }
        }

        if (dir == Config.direction.RIGHT) {
            for (let i = col; i < Config.matrixCol; i++) {
                this.scheduleOnce(function () {
                    if (GameData.starMatrix[row][i] >= 0) {
                        // GameData.starMatrix[row][i]=-1;
                        // this.removeBlock(cc.v2(row,i));
                        let item = cc.v2(row, i);
                        this.handleSingleGrid(item);
                    }

                }, Math.abs(i - col) * 0.05);
            }
        }

    },

    //  获得需要消除的数组坐标
    getRemovePositionList(grid, dir, type) {
        let posList = [];
        let xStart = grid.x;
        let yStart = grid.y;
        if (type == 1) {
            if (dir == Config.direction.UP) {
                for (let i = xStart; i < Config.matrixRow; i++) {
                    let pos = Utils.grid2Pos(i, yStart);
                    if (GameData.starMatrix[i][yStart] >= 0) {
                        let item = {};
                        item.grid = cc.v2(i, yStart);
                        item.position = pos;
                        posList.push(item);
                    }
                }
            } else if (dir == Config.direction.DOWN) {
                for (let i = xStart; i >= 0; i--) {
                    let pos = Utils.grid2Pos(i, yStart);
                    if (GameData.starMatrix[i][yStart] >= 0) {
                        let item = {};
                        item.grid = cc.v2(i, yStart);
                        item.position = pos;
                        posList.push(item);

                    }
                }
            }

        } else if (type == 2) {
            if (dir == Config.direction.LEFT) {
                for (let i = yStart; i >= 0; i--) {
                    let pos = Utils.grid2Pos(xStart, i);
                    if (GameData.starMatrix[xStart][i] >= 0) {
                        let item = {};
                        item.grid = cc.v2(xStart, i);
                        item.position = pos;
                        posList.push(item);

                    }
                }
            } else if (dir == Config.direction.RIGHT) {
                for (let i = yStart; i < Config.matrixCol; i++) {
                    let pos = Utils.grid2Pos(xStart, i);
                    if (GameData.starMatrix[xStart][i] >= 0) {
                        let item = {};
                        item.grid = cc.v2(xStart, i);
                        item.position = pos;
                        posList.push(item);

                    }
                }
            }
        }

        if (posList.length > 0) {
            // console.log(posList,'2903');
            return posList;
        } else {
            return false;
        }

    },

    // 拳头和锚的动画
    boxingAndAnvil(event) {
        let grid = event.grid;
        let node = event.node;
        let dir = event.dir;
        node.parent = this.node;

        let itemGrid, posList, endPos;
        if (dir == Config.direction.RIGHT) {
            node.position = Utils.grid2Pos(grid.x, 0);
            itemGrid = cc.v2(grid.x, -1);
            posList = this.getRemovePositionList(itemGrid, dir, 2);
            node.getComponent('rocket').setRocketPosition(itemGrid, dir, posList);
            endPos = Utils.grid2Pos(grid.x, 10);
            node.runAction(
                cc.sequence(
                    cc.moveTo(0.5, endPos),
                    cc.callFunc(
                        function () {
                            cc.systemEvent.emit('player_tool', {
                                type: 1,
                            });
                            node.removeFromParent();
                            cc.systemEvent.emit('CLEAR_BTN');
                            cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');

                        }
                    )
                )
            )
        }


        if (dir == Config.direction.DOWN) {
            node.position = Utils.grid2Pos(10, grid.y);
            itemGrid = cc.v2(8, grid.y);
            posList = this.getRemovePositionList(itemGrid, dir, 1);
            node.getComponent('rocket').setRocketPosition(itemGrid, dir, posList);
            endPos = Utils.grid2Pos(-1, grid.y);
            node.runAction(
                cc.sequence(
                    cc.moveTo(0.5, endPos),
                    cc.callFunc(
                        function () {
                            cc.systemEvent.emit('player_tool', {
                                type: 2,
                            });
                            node.removeFromParent();
                            cc.systemEvent.emit('CLEAR_BTN');
                            cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');

                        }
                    )
                )
            );
        }


        // let 
        // let action =
        // node.runAction(action);
    },

    handleSingleGrid(grid) {
        let index = Utils.indexValue(grid.x, grid.y);
        if (GameData.starSprite[index] == null) {
            return;
        }

        let script = this.getNodeBygGrid(grid);
        if (script._stoneType == 21) {
            cc.director.container.balloonBoomEffect(grid);
            cc.director.container.removeBlock(grid);
        } else {

            if (script._stoneType >= 0 && script._stoneType < Config.rType) {
                cc.director.container.removeBlock(grid);
                cc.director.container.effectRemoveCol(grid);
            } else {
                if (script._stoneType == 8) {
                    if (script.rocketType == 0) {
                        // console.log('消除一列');
                        cc.director.container.removeBlock(grid);
                        cc.director.container.col_rocket(grid);

                    } else {
                        // console.log('消除一行');
                        cc.director.container.removeBlock(grid);
                        cc.director.container.row_rocket(grid);
                    }
                } else if (script._stoneType == 9) {
                    //    let event = new cc.Event.EventCustom('game_tool',true);

                    let detail = {
                        index: script._stoneType,
                        type: script.discoType,
                        grid: grid,
                        from: 1,
                    }
                    //    other.node.dispatchEvent(event);
                    cc.systemEvent.emit('GAME_TOOL', { detail: detail });
                } else if (script._stoneType == 10) {
                    if (script.isEffect) {
                        script.isEffect = false;
                        return;
                    }
                    // cc.director.specialNum = true;
                    script.isEffect = true;
                    // let event = new cc.Event.EventCustom('game_tool',true);
                    let detail = {
                        index: script._stoneType,
                        type: script.discoType,
                        grid: grid,
                        from: 1,

                    }
                    // other.node.dispatchEvent(event);
                    cc.systemEvent.emit('GAME_TOOL', { detail: detail });

                } else if (script._stoneType == 22) {
                    script.bombRatio--;
                    script.cubesUnlock();
                    cc.director.container.vineBreakEffect(grid);
                } else if (script._stoneType == 23 || script._stoneType == 24 || script._stoneType == 25) {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        // cc.director.container.stonePool.put(script.node);
                        cc.director.container.woodCubeBreakEffect(grid);
                        cc.director.container.removeBlock(grid);
                        script.boxCubesDisappear();
                    } else {
                        script.boxHit();
                        cc.director.container.woodBoxBreakEffect(grid);
                    }
                } else if (script._stoneType == 26) {
                    script.bombRatio--;
                    if (script.bombRatio < 0) {
                        cc.director.container.flowerCollectAnimation(grid);
                        script.collectFlower();
                    } else {
                        script.flowerHit();
                        cc.director.container.flowerOpenEffect(grid);
                    }
                } else if (script._stoneType == 27) {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        // this.removeBlock(grid);
                        cc.director.container.windmillDisappearEffect(grid);
                    } else {
                        script.hitWindmill();
                        cc.director.container.windmillBreakEffect(grid, script.bombRatio);
                    }
                } else if (script._stoneType >= 29 && script._stoneType <= 36) {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        // cc.director.container.stonePool.put(script.node);
                        // this.colorCubeBreakEffect(pos);
                        cc.director.container.colorCubeBreakEffect(grid);
                        cc.director.container.removeBlock(grid);
                        script.boxCubesDisappear();
                    }
                } else if (script._stoneType == 37) {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {

                        this.ladyBugCubesBreakEffect(grid, script.bombRatio);

                    } else {
                        this.ladyBugCubesBreakEffect(grid, script.bombRatio);

                        script.hitLadyBugCubes();
                    }
                } else if (script._stoneType == 39) {
                    script.bombRatio--;
                    if (script.bombRatio <= 0) {
                        cc.director.container.rockStoneCubeBreakEffect(grid);
                        cc.director.container.removeBlock(grid);
                        script.boxCubesDisappear();
                        // self.woodCubeBreakEffect(item);
                        // self.bubbleBreakEffect();
                    }
                }

            }

        }
    },



    // 消除道具射程范围内的色块
    // 原则：普通色块直接消除，非普通色块触发道具特效

    handleGameToolArray(pos) {
        let type = GameData.getDataBygrid(pos);
        let script = this.getNodeBygGrid(pos);
        if (type < Config.rType) {
            this.effectRemoveCol(pos);
            this.removeBlock(pos);
        } else {
            if (type == Config.rType) {

                // console.log(script);
                if (script.rocketType == 0) {
                    this.col_rocket(pos);
                }
                if (script.rocketType == 1) {
                    this.row_rocket(pos);
                }
            } else if (type == Config.bType) {
                let list = Utils.rainbowStarRemoveList(GameData.starMatrix, pos);
                cc.director.SoundManager.playSound('boom1');
                this.removeBombBlockOnly(list);
            } else if (type == Config.dType) {
                let list = Utils.getSameBlockList(GameData.starMatrix, pos);
                let type1 = this.judgeDiscoType(list);
                this.discoRotation(pos);
                let list1 = Utils.getSameBlockList(GameData.starMatrix, pos, type1);
                let oldlist = JSON.parse(JSON.stringify(list1));
                this.effectRemoveSame(pos, list1, oldlist, this.removeSameColorBlock);
            } else if (type == 21) {
                this.effectRemoveCol(pos);
                this.removeBlock(pos);
            } else if (type == 22) {
                // let script = this.getNodeBygGrid(pos);
                script.bombRatio--;
                script.cubesUnlock();
                this.vineBreakEffect(pos);
            } else if (type == 23 || type == 24 || type == 25) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    // cc.director.container.stonePool.put(script.node);
                    this.woodCubeBreakEffect(pos);
                    this.removeBlock(pos);
                    script.boxCubesDisappear();
                } else {
                    script.boxHit();
                    // this.woodBoxBreakEffect(pos);
                    if (script.bombRatio == 2) {
                        this.woodBoxBreakEffect(pos, 2);
                    } else {
                        this.woodBoxBreakEffect(pos, 1);
                    }
                }
            } else if (type == 26) {
                script.bombRatio--;
                if (script.bombRatio < 0) {
                    // this.stonePool.put(script.node);
                    this.flowerCollectAnimation(pos);
                    // this.removeBlock(pos);
                    script.collectFlower();
                } else {
                    script.flowerHit();
                    this.flowerOpenEffect(pos);
                }
            } else if (script._stoneType == 27) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.windmillDisappearEffect(pos);
                    // this.removeBlock(pos);
                } else {
                    script.hitWindmill();
                    this.windmillBreakEffect(pos, script.bombRatio);
                }
            } else if (script._stoneType >= 29 && script._stoneType <= 36) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.colorCubeBreakEffect(pos);
                    this.removeBlock(pos);
                    script.boxCubesDisappear();

                }
            } else if (script._stoneType == 37) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.ladyBugCubesBreakEffect(pos, script.bombRatio);
                } else {
                    this.ladyBugCubesBreakEffect(pos, script.bombRatio);
                    script.hitLadyBugCubes();
                }
            } else if (script._stoneType == 39) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    // ladyBugCubesBreakEffect
                    cc.director.container.rockStoneCubeBreakEffect(pos);
                    cc.director.container.removeBlock(pos);
                    script.boxCubesDisappear();
                    // self.woodCubeBreakEffect(item);
                    // self.bubbleBreakEffect();
                }
            }

        }
    },

    // 移除色块
    removeBlockOnly(list) {

        for (let i = list.length - 1; i >= 0; i--) {
            let pos = list[i];
            let type = GameData.starMatrix[pos.x][pos.y];
            let script = this.getNodeBygGrid(pos);
            if (type != -2 && type < 22) {
                this.removeBlock(pos);
            } else if (type == 22) {
                script.bombRatio--;
                script.cubesUnlock();
            } else if (type == 23 || type == 24 || type == 25) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.woodCubeBreakEffect(pos);
                    this.removeBlock(pos);
                    script.boxCubesDisappear();
                } else {
                    script.boxHit();
                    if (script.bombRatio == 2) {
                        this.woodBoxBreakEffect(pos, 2);
                    } else {
                        this.woodBoxBreakEffect(pos, 1);
                    }

                }
            } else if (type == 26) {
                script.bombRatio--;
                if (script.bombRatio < 0) {
                    this.flowerCollectAnimation(pos);
                    script.collectFlower();
                } else {
                    script.flowerHit();
                    this.flowerOpenEffect(pos);
                }
            } else if (type == 27) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.removeBlock(pos);
                    script.collectFlower();
                } else {
                    script.hitWindmill();
                    this.windmillBreakEffect(pos, script.bombRatio);
                }
            } else if (script._stoneType >= 29 && script._stoneType <= 36) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    this.colorCubeBreakEffect(pos);
                    this.removeBlock(pos);
                    script.boxCubesDisappear();
                }
            } else if (script._stoneType == 37) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    // this.removeBlock(pos);
                    // script.boxCubesDisappear();
                    this.ladyBugCubesBreakEffect(pos, script.bombRatio);
                } else {
                    this.ladyBugCubesBreakEffect(pos, script.bombRatio);
                    script.hitLadyBugCubes();
                }
            } else if (script._stoneType == 39) {
                script.bombRatio--;
                if (script.bombRatio <= 0) {
                    cc.director.container.rockStoneCubeBreakEffect(pos);
                    cc.director.container.removeBlock(pos);
                    script.boxCubesDisappear();

                }
            }

        }

        this.scheduleOnce(function () {
            if (cc.director.isrunning) {
                return;
            }
            this.whichTimeTampRow('removeNineBlock2');
        }, 0.5)

    },



    // 何时开始执行下落操作
    whichTimeTampRow(pos) {

        let node = this.node.getChildByName('rock');
        let line = this.node.getChildByName('line');
        // console.log(pos, '3483', cc.director.needWait,cc.director.isSuperTool);
        if (!!node || line || !!cc.director.needWait) {
            cc.director.isrunning = 1;
            this.scheduleOnce(
                function () {
                    this.whichTimeTampRow('递归');
                }, 0.2
            )
        } else {
            this.tampRows();
            cc.director.isrunning = 0;
            // 将风车的暂时数组清零
            if (!!this.tempPos) {
                this.tempPos = null;
            }
            // 将瓢虫的暂时数组清零
            if (!!this.tempLadyBugList) {
                this.tempLadyBugList = null;
            }
            // 将花朵的暂时数组清零
            if (!!this.flowerTempList) {
                this.flowerTempList = null;
            }
        }

    },

    // 提示玩家可合成的方块
    noticeWhichCubesCombine() {
        let list = Utils.noticeLongestList(GameData.starMatrix);
        if (!!list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let index = Utils.indexValue(item.x, item.y);
                let stone = GameData.starSprite[index];
                this.noticeList.push(stone);
                if (!!stone) {
                    stone.zIndex = 1;
                    stone.getChildByName('outLine').active = true;
                    let nocticeAnima = cc.sequence(
                        cc.scaleTo(0.5, 0.95),
                        cc.scaleTo(1, 1.05),
                        cc.scaleTo(0.5, 1),
                    ).repeatForever();
                    nocticeAnima.tag = 10;
                    stone.runAction(nocticeAnima);
                }

            }
        }
    },

    // 提示玩家倒计时
    noticePlayerTimeCount() {
        if (this.noticeCount > 0) {
            this.noticeCount--;
            if (this.noticeCount == 0) {
                this.unschedule(this.noticePlayerTimeCount);
                this.noticeWhichCubesCombine();
                // this.pauseTarget(this);
            }
        }
    },

    // 取消提示
    canclePlayerNotice() {
        if (!!this.noticeList && this.noticeList.length > 0) {
            for (let i = 0; i < this.noticeList.length; i++) {
                let item = this.noticeList[i];
                if (!!item) {
                    item.getChildByName('outLine').active = false;
                    item.stopActionByTag(10);
                    item.scale = 1;
                    item.zIndex = 0;
                } else {
                    continue;
                }

            }
        }
        this.noticeList = [];
        this.noticeCount = 5;

        let isScheduled = cc.director.getScheduler().isScheduled(this.noticePlayerTimeCount, this);
        if (!isScheduled && !this.target.isGameEnd) {
            this.schedule(this.noticePlayerTimeCount, 1);
        } else {
            if (!!this.target.isGameEnd) {
                this.unschedule(this.noticePlayerTimeCount);
            }
        }

    },



    //  判断游戏的静止状态
    judgeGameMoveStatus() {
        if (cc.game.GameMoveStatus > 0) {
            return false;
        } else {
            return true;
        }
    },

    // 执行加操作
    addGameMoveStatus() {
        if (typeof cc.game.GameMoveStatus == 'number') {
            cc.game.GameMoveStatus++;
            // console.log(cc.game.GameMoveStatus);
        }
    },

    // 执行减操作
    reduceGameMoveStatus() {
        if (cc.game.GameMoveStatus > 0) {
            cc.game.GameMoveStatus--;
            // console.log(cc.game.GameMoveStatus);
        }
    },

    test_addLevel() {
        GameData.bestLevel++;
        this.startNewGame();
    },

    test_reduceLevel() {
        GameData.bestLevel--;
        this.startNewGame();
    },



    start() {
        // this.noticeList=[];
        // this.noticeCount=10;
        this.startNewGame();

        // this.addGameMoveStatus();
        // this.reduceGameMoveStatus();
        // console.log(this.judgeGameMoveStatus());
        // console.log(this.isScheduled(this.noticePlayerTimeCount,this)); 

    },

    // update (dt) {
    //     // this.rockNode.y+=1;
    // },
});
