
let Utils = require('../utils');
let Config = require('../psconfig');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 根据起末点来初始化熊的数据
    initBearData(list) {
        // if(!!list && list.length>0){

        // }
        this.list = list;
        this.comfirmBearWidthAndHeight(list);
    },

    // 根据两个坐标来确定熊的位置信息
    comfirmBearPosition(list) {
        let position;
        if (!!list && list.length > 0) {
            // let bearPos = list[1].sub(list[0]);
            let xPos = (list[1][0] + list[0][0] ) / 2;
            let yPos = (list[1][1] + list[0][1] ) / 2;
            // console.log(bearPos);
            position = Utils.grid2Pos(xPos, yPos);
        }

        if (!!position) {
            return position;
        } else {
            return false;
        }


        // return position ;
    },

    //根据坐标大小计算出熊的大小 
    comfirmBearWidthAndHeight(list) {
        //  原则上以长的为高，短的为宽，随机熊的角度
        let xCount = Math.abs(list[1][0] - list[0][0]) + 1;
        let yCount = Math.abs(list[1][1] - list[0][1]) + 1;
        let scale;
        if (xCount - yCount > 0) {
            // 竖着的
            this.node.height = xCount * Config.cellSize;
            this.node.width = yCount * Config.cellSize;
            // scale = yCount * Config.cellSize / this.node.width;
            // this.node.scale = scale;
            this.node.rotation = 0;
        } else {
            // 横着的
            // scale = xCount * Config.cellSize / this.node.width;
            this.node.width = xCount * Config.cellSize;
            this.node.height = yCount * Config.cellSize;
            // this.node.scale = scale;
            this.node.rotation = 90;
        }

        // console.log(this.node.width, this.node.height);
    },

    // 判断熊是否已经没有被遮挡
    judgeBearIsHide(list) {
        // console.log(list,'72');
        let xStart = this.list[0][0];
        let xEnd = this.list[1][0];
        let yStart = this.list[0][1];
        let yEnd = this.list[1][1];
        let isHide = false;
        for (let i = xStart; i <= xEnd; i++) {
            for (let j = yStart; j <= yEnd; j++) {
                if (list[i][j] >=1) {
                    // return true;
                    // console.log(i, j);
                    isHide = true;
                    break;
                }
            }

            if (isHide) {
                break;
            }

        }
        return isHide;
    },






    start() {

    },

    // update (dt) {},
});
