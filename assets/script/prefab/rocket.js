// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Config = require('../psconfig');
let Utils = require('../utils');
const debugDis = 30;
cc.Class({
    extends: cc.Component,
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    //  设置火箭当前的位置
    setRocketPosition(pos, dir, posList) {
        // console.log(pos, dir, '27');
        this.grid = pos;
        this.birthPosition = Utils.grid2Pos(pos.x, pos.y);
        this.direction = dir;
        this.tempLength = 0;
        this.tempList = posList;
        this.updateIndex = 0;
        this.copyList = [];
        this.isFinish = false;
    },





    // onCollisionEnter(other, self) {
    //     // console.log('hehe');
    //     let script = other.getComponent('block');
    //     let grid = cc.v2(script._xPos, script._yPos);
    //     if (script._stoneType == 21) {
    //         cc.director.container.balloonBoomEffect(grid);
    //         cc.director.container.removeBlock(grid);
    //     } else {

    //         if (script._stoneType >= 0 && script._stoneType < Config.rType) {
    //             cc.director.container.removeBlock(grid);
    //             cc.director.container.effectRemoveCol(grid);
    //         } else {
    //             if (script._stoneType == 8) {
    //                 if (script.rocketType == 0) {
    //                     // console.log('消除一列');
    //                     cc.director.container.removeBlock(grid);
    //                     cc.director.container.col_rocket(grid);

    //                 } else {
    //                     // console.log('消除一行');
    //                     cc.director.container.removeBlock(grid);
    //                     cc.director.container.row_rocket(grid);
    //                 }
    //             }
    //             if (script._stoneType == 9) {
    //                 //    let event = new cc.Event.EventCustom('game_tool',true);

    //                 let detail = {
    //                     index: script._stoneType,
    //                     type: script.discoType,
    //                     grid: grid,
    //                     from: 1,
    //                 }
    //                 //    other.node.dispatchEvent(event);
    //                 cc.systemEvent.emit('GAME_TOOL', { detail: detail });
    //             }

    //             if (script._stoneType == 10) {
    //                 if (script.isEffect) {
    //                     script.isEffect = false;
    //                     return;
    //                 }
    //                 // cc.director.specialNum = true;
    //                 script.isEffect = true;
    //                 // let event = new cc.Event.EventCustom('game_tool',true);
    //                 let detail = {
    //                     index: script._stoneType,
    //                     type: script.discoType,
    //                     grid: grid,
    //                     from: 1,

    //                 }
    //                 // other.node.dispatchEvent(event);
    //                 cc.systemEvent.emit('GAME_TOOL', { detail: detail });

    //             }

    //             if (script._stoneType == 22) {
    //                 script.bombRatio--;
    //                 script.cubesUnlock();
    //                 cc.director.container.vineBreakEffect(grid);
    //             }

    //             if (script._stoneType == 23 || script._stoneType == 24 || script._stoneType == 25) {
    //                 script.bombRatio--;
    //                 if (script.bombRatio <= 0) {
    //                     // cc.director.container.stonePool.put(script.node);
    //                     cc.director.container.woodCubeBreakEffect(grid);
    //                     cc.director.container.removeBlock(grid);
    //                     script.boxCubesDisappear();
    //                 } else {
    //                     script.boxHit();
    //                     cc.director.container.woodBoxBreakEffect(grid);
    //                 }
    //             }
    //             if(script._stoneType ==26){
    //                 script.bombRatio--;
    //                     if (script.bombRatio < 0) {
    //                         // this.stonePool.put(script.node);
    //                         // cc.director.container.flowerCollectAnimation(grid);
    //                         // cc.director.container.removeBlock(grid);
    //                         cc.director.container.flowerCollectAnimation(grid);
    //                         script.collectFlower();
    //                     } else {
    //                         script.flowerHit();
    //                         cc.director.container.flowerOpenEffect(grid);
    //                     }
    //             }
    //             if(script._stoneType ==27){
    //                 script.bombRatio--;
    //                 if (script.bombRatio <= 0) {
    //                     cc.director.container.windmillDisappearEffect(grid);
    //                 } else {
    //                     script.hitWindmill();
    //                     cc.director.container.windmillBreakEffect(grid,script.bombRatio);
    //                 }
    //             }

    //         }
    //         // }else{
    //         //     cc.director.container.handleGameToolArray(grid);
    //         // }

    //     }

    // },

    // 撞到道具，应该是触发道具效果
    start() {

    },



    judgeNodePosition() {
        let len = this.tempList.length;
        for (let i = this.updateIndex; i < len; i++) {

            let item = this.tempList[i];
            if (this.direction == Config.direction.UP) {
                if (this.node.y >= item.position.y) {
                    cc.director.container.handleSingleGrid(item.grid);
                    this.updateIndex = i + 1;
                }else{
                    break;
                }
            }else if(this.direction == Config.direction.DOWN){
                if (this.node.y <= item.position.y) {
                    cc.director.container.handleSingleGrid(item.grid);
                    this.updateIndex = i + 1;
                }else{
                    break;
                }
            }else if(this.direction == Config.direction.LEFT){
                if (this.node.x <= item.position.x) {
                    cc.director.container.handleSingleGrid(item.grid);
                    this.updateIndex = i + 1;
                }else{
                    break;
                }
            }else if(this.direction == Config.direction.RIGHT){
                if (this.node.x >= item.position.x) {
                    cc.director.container.handleSingleGrid(item.grid);
                    this.updateIndex = i + 1;
                }else{
                    break;
                }
            }
        }

        if(this.updateIndex >= len){
            this.isFinish = true;
        }

    },





    update(dt) {
        // if(this.node.x>)
        // console.log(this.node.position);
        if(!this.isFinish){
            this.judgeNodePosition();
        }
    },
});
