// Utils.js
var Config = require("./psconfig");

const gap = 1.9;

var randomColorByArray = function (array) {
    var i = Math.floor(Math.random() * array.length);
    return array[i];
}

//随机生成星星关卡逻辑
function initMatrixDataPortraitRandom() {
    var matrixData = new Array(Config.matrixRow);
    for (var row = 0; row < Config.matrixRow; row++) {
        matrixData[row] = new Array(Config.matrixCol);
        for (var col = 0; col < Config.matrixCol; col++) {
            matrixData[row][col] = randomColorByArray(Config.totalColors);
        }
    }
    // let index=Math.floor(Math.random()*100);
    // let list = this.creatSpecialStarList();
    // for(let i=0;i<list.length;i++){
    //     if(i==0 && index%2==0){
    //         matrixData[list[i].x][list[i].y]=5;
    //     }
    //     if(i>0 && index%3!=0){
    //         matrixData[list[i].x][list[i].y]=6;
    //     }
    // }
    //  console.log(matrixData)
    return matrixData;
};


// 往数据中添加障碍
function addHinder(list, num, type) {
    let tempList = [];
    while (tempList.length < num) {
        let randomX = Math.floor(Math.random() * Config.matrixRow);
        let randomY = Math.floor(Math.random() * Config.matrixCol);
        let item = cc.v2(randomX, randomY);
        if (!this.indexOfV2(tempList, item) && list[randomX][randomY] >= 0 && list[randomX][randomY] < Config.rType) {
            list[randomX][randomY] = type;
            tempList.push(item);
        }
    }

    return list;
}



// 获得某一列的所有坐标
function getColData(matrix, pos) {
    let col = pos.y;
    let list = [];
    list.push(pos);
    for (let i = 0; i < matrix[col].length; i++) {
        if (matrix[i][col] >= 0 && i != pos.x && matrix[i][col] != 20) {
            let item = cc.v2(i, col);
            list.push(item);
        }
    }
    return list;
}


// 获得某一行的
function getRowData(matrix, pos) {
    let row = pos.x;
    let list = [];
    list.push(pos);
    for (let i = 0; i < matrix[row].length; i++) {
        if (matrix[row][i] >= 0 && i != pos.y && matrix[row][i] != 20) {
            let item = cc.v2(row, i);
            list.push(item);
        }
    }
    return list;
}


// 获得清除列表
function getBalloonClearList(matrix, list, type) {

    let balloonList = [];
    for (let i = 0; i < list.length; i++) {
        let itemList = this.getItemAdjacentPos(list[i]);

        for (let j = 0; j < itemList.length; j++) {
            let subItem = itemList[j];
            let cubeType = matrix[subItem.x][subItem.y];
            if (!this.indexOfV2(list, subItem) && !this.indexOfV2(balloonList, subItem)) {
                if (type == 23 && (cubeType >= type && cubeType <= type + 2)) {
                    balloonList.push(subItem);
                } else if (type == 29 && (cubeType >= type && cubeType <= type + 7)) {
                    balloonList.push(subItem);
                } else if (cubeType == type) {
                    balloonList.push(subItem);
                }
            }
        }
    }

    return balloonList;

}


// 获得清除列表





// 返回一个坐标上下左右的所有坐标

function getItemAdjacentPos(pos) {
    let list = [];
    if (pos.x - 1 >= 0) {
        let item = cc.v2(pos.x - 1, pos.y);
        if (!this.indexOfV2(list, item)) {
            list.push(item);
        }
        // console.log('1');
    }
    if (pos.x + 1 < Config.matrixCol) {
        let item = cc.v2(pos.x + 1, pos.y);
        if (!this.indexOfV2(list, item)) {
            list.push(item);
        }
        // console.log('2');

    }
    if (pos.y - 1 >= 0) {
        let item = cc.v2(pos.x, pos.y - 1);
        if (!this.indexOfV2(list, item)) {
            list.push(item);
        }
        // console.log('3');

    }
    if (pos.y + 1 < Config.matrixRow) {
        let item = cc.v2(pos.x, pos.y + 1);
        if (!this.indexOfV2(list, item)) {
            list.push(item);
        }
        // console.log('4');

    }
    // }
    return list;
}


// 随机选取不重复的数据
function randomGetGrid(num, mlist) {
    let list = [];
    let count = 0;
    for (let i = 0; i < mlist.length; i++) {
        for (let j = 0; j < mlist[i].length; j++) {
            if (mlist[i][j] >= 0 && mlist[i][j] < Config.rType) {
                count++;
            }
        }
    }
    if (count == 0) {
        return list;
    }

    num = count > num ? num : count;
    while (list.length < num) {
        let xRandom = Math.floor(Math.random() * Config.matrixCol);
        let yRandom = Math.floor(Math.random() * Config.matrixRow);
        let item = cc.v2(xRandom, yRandom);
        if (mlist[xRandom][yRandom] >= 0 && mlist[xRandom][yRandom] < Config.rType && !this.indexOfV2(list, item)) {

            list.push(item);
        }
    }

    return list;

};

function creatSpecialStarList() {
    let list = [];
    let x, y;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        let p = cc.v2(x, y);
        if (!this.indexOfV2(list, p)) {
            list.push(p);
        }
    } while (list.length < 3);

    return list;
}

//可传入大小
function girdToPos(gx, gy, flexGap) {
    var px = flexGap + gap + Config.cellSize * 0.5 + (Config.cellSize + gap) * gy;
    var py = flexGap + gap + Config.cellSize * 0.5 + (Config.cellSize + gap) * gx;
    return cc.v2(px, py);
}


// 根据行列获得坐标
function grid2Pos(gx, gy) {
    var px = gap + Config.cellSize * 0.5 + (Config.cellSize + gap) * gy;
    var py = gap + Config.cellSize * 0.5 + (Config.cellSize + gap) * gx;
    return cc.v2(px, py);
};
// 根据坐标获得行列
function pos2Grid(px, py) {
    var gx = (py - Config.cellSize * 0.5 - gap) / (Config.cellSize + gap);
    var gy = (px - Config.cellSize * 0.5 - gap) / (Config.cellSize + gap);
    return cc.v2(Math.round(gx), Math.round(gy));
};

// 根据行列获得index；
function indexValue(row, col) {
    return row * Config.matrixCol + col;
};

// 根据index获得行列
function resolveIndex(index) {
    var col = index % Config.matrixCol;
    var row = (index - col) / Config.matrixCol;
    return cc.v2(row, col);
};

//检测数组array中是否坐标p
function indexOfV2(array, p) {
    return array.some(function (elem, index, arr) {
        return elem.x == p.x && elem.y == p.y
    });
};


// 返回彩虹星星周围九宫格内的数据
function rainbowStarRemoveList(data, p) {
    let list = [];
    let sRow = p.x - 1 >= 0 ? p.x - 1 : p.x;
    let sCol = p.y - 1 >= 0 ? p.y - 1 : p.y;
    let eRow = p.x + 1 < Config.matrixCol ? p.x + 1 : p.x;
    let eCol = p.y + 1 < Config.matrixCol ? p.y + 1 : p.y;
    list.push(p);
    for (let i = sRow; i <= eRow; i++) {
        for (let j = sCol; j <= eCol; j++) {
            if (data[i][j] >= 0) {
                if (i == p.x && j == p.y) {
                    continue;
                }
                let item = cc.v2(i, j);
                list.push(item);
            }
        }
    }

    // console.log(list);
    return list;
}

// 返回数据相同的所有集合 
function getSameBlockList(data, p, type) {
    let tag = type;
    let list = [];
    list.push(p);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == tag) {
                let vector = cc.v2(i, j);
                list.push(vector);
            }
        }
    }
    return list;
}


// 根据矩阵数据查找是否存在可合并的道具
function needCombineTool(data, p) {
    let list = [];
    let toolList = [];
    toolList.push(p);
    do {
        let any = toolList.pop();
        if (any.y - 1 >= 0 && (data[any.x][any.y - 1] >= Config.rType && data[any.x][any.y - 1] < 20)) {
            let item = cc.v2(any.x, any.y - 1);
            if (!this.indexOfV2(list, item) && !this.indexOfV2(toolList, item)) {
                toolList.push(item);
            }

        }

        if (any.y + 1 < Config.matrixCol && (data[any.x][any.y + 1] >= Config.rType && data[any.x][any.y + 1] < 20)) {
            let item = cc.v2(any.x, any.y + 1);
            if (!this.indexOfV2(list, item) && !this.indexOfV2(toolList, item)) {
                toolList.push(item);
            }

        }

        if (any.x - 1 >= 0 && (data[any.x - 1][any.y] >= Config.rType && data[any.x - 1][any.y] < 20)) {
            let item = cc.v2(any.x - 1, any.y);
            if (!this.indexOfV2(list, item) && !this.indexOfV2(toolList, item)) {
                toolList.push(item);
            }


        }

        if (any.x + 1 < Config.matrixRow && (data[any.x + 1][any.y] >= Config.rType && data[any.x + 1][any.y] < 20)) {
            let item = cc.v2(any.x + 1, any.y);
            if (!this.indexOfV2(list, item) && !this.indexOfV2(toolList, item)) {
                toolList.push(item);
            }
        }

        list.push(any);

    } while (toolList.length > 0);

    return list;
}

// 返回一行一竖的所有数据
function getRowAndCol(data, p) {
    // 先获得一列的信息；
    let list = this.getColData(data, p);
    let rowList = this.getRowData(data, p);
    for (let i = 0; i < rowList.length; i++) {
        if (!this.indexOfV2(list, rowList[i])) {
            list.push(rowList[i]);
        }
    }
    return list;
}

// 返回三行所有数据
function get3Row(data, p) {
    let list = this.getRowData(data, p);
    let rowList1, rowList2;
    let count = 2;
    while (count > 0) {
        if (p.x - 1 >= 0) {
            let vector = cc.v2(p.x - 1, p.y);
            rowList1 = this.getRowData(data, vector);
            for (let i = 0; i < rowList1.length; i++) {
                if (!this.indexOfV2(list, rowList1[i])) {
                    list.push(rowList1[i]);
                }
            }
        }
        if (p.x + 1 < Config.matrixRow) {
            let vector = cc.v2(p.x + 1, p.y);
            rowList2 = this.getRowData(data, vector);
            for (let i = 0; i < rowList2.length; i++) {
                if (!this.indexOfV2(list, rowList2[i])) {
                    list.push(rowList2[i]);
                }
            }
        }
        count--;
    }

    return list;
    // if()
}

// 返回三列的所有数据
function get3Col(data, p) {
    let list = this.get3Row(data, p);
    let cStart = p.y - 1 >= 0 ? p.y - 1 : 0;
    let cEnd = p.y + 1 < Config.matrixCol ? p.y + 1 : Config.matrixCol - 1;

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (j >= cStart && j <= cEnd) {
                let item = cc.v2(i, j);
                if (!this.indexOfV2(list, item)) {
                    list.push(item);
                }
            }
        }
    }


    return list;
}

// 返回周围横竖三格内的数据
function getThreeBlockArea(data, p) {
    let list = [];
    let rStart = p.x - 2 >= 0 ? p.x - 2 : 0;
    let rEnd = p.x + 2 < Config.matrixRow ? p.x + 2 : Config.matrixRow - 1;
    let cStart = p.y - 2 >= 0 ? p.y - 2 : 0;
    let cEnd = p.y + 2 < Config.matrixRow ? p.y + 2 : Config.matrixCol - 1;
    for (let i = 0; i < data.length; i++) {
        if (i >= rStart && i <= rEnd) {
            for (let j = 0; j < data[i].length; j++) {
                if (j >= cStart && j <= cEnd) {
                    if (data[i][j] != -2) {
                        let item = cc.v2(i, j)
                        list.push(item);
                    }
                }
            }
        }
    }
    return list;
}



// 筛选出所有能合成的数组
function canRemoveList(data) {
    let list = [];
    for (let i = 0; i < Config.matrixRow; i++) {
        for (let j = 0; j < Config.matrixCol; j++) {
            // let grid;
            // if (data[i][j] < 8 && i > 2 && i < 8) {
            let grid = cc.v2(i, j);
            if (this.checkItem(grid, list)) {
                continue;
            }
            let item = this.needRemoveList(data, grid);
            if (item.length > 1) {
                return item;
            }
            // }
        }
    }
}



// 提示当前地图最长数组
function noticeLongestList(data) {
    let list = [];
    for (let i = 0; i < Config.matrixRow; i++) {
        for (let j = 0; j < Config.matrixCol; j++) {
            if (data[i][j] < 8 && data[i][j] >= 0) {
                let grid = cc.v2(i, j);
                if (this.checkItem(grid, list)) {
                    continue;
                }
                let item = this.needRemoveList(data, grid);
                if (item.length > 1) {
                    list.push(item);
                }
            }
        }
    }
    list.sort(function (a, b) {
        return a.length - b.length;
    });

    if (list.length > 0) {
        return list.pop();
    } else {
        return false;
    }

}




//筛选出所有可以组成数组_ update_11.5;
function chooseRemoveList(data) {
    let list = [];
    for (let i = 0; i < Config.matrixRow; i++) {
        for (let j = 0; j < Config.matrixCol; j++) {
            let grid = cc.v2(i, j);
            if (this.checkItem(grid, list)) {
                continue;
            }

            let item = this.needRemoveList(data, grid);
            if (item.length > 1) {
                let child = item[0];
                let type = data[child.x][child.y];
                // let num = 0;
                if (type < Config.rType && type >= 0) {
                    // num = 2 ** (type + item.length);
                    if (item.length >= 5) {
                        list.push(item);
                    }
                }
            }
        }
    }

    return list;
}


//  检查grid是否被包含
function checkItem(item, list) {

    let isContain = false;
    for (let i = 0; i < list.length; i++) {
        let cList = list[i];
        if (this.indexOfV2(cList, item)) {
            isContain = true;
            break;
        }
    }
    return isContain;

}


//根据矩阵数据查找消除的星星
function needRemoveList(data, p) {
    var list = [];
    var travelList = [];
    travelList.push(p);

    var tag = data[p.x][p.y];
    if (tag <= -2) {
        return list;
    }
    do {
        var any = travelList.pop();
        //左
        if (any.y - 1 >= 0 && (tag == data[any.x][any.y - 1])) { //|| data[any.x][any.y - 1]==5  ) 
            var tp = cc.v2(any.x, any.y - 1);

            if (!this.indexOfV2(list, tp) && !this.indexOfV2(travelList, tp)) {
                travelList.push(tp);
                // if(data[any.x][any.y - 1]==5){
                //     data[any.x][any.y - 1]=tag;
                // }
            }
        }
        //右
        if (any.y + 1 < Config.matrixCol && (tag == data[any.x][any.y + 1])) {
            var tp = cc.v2(any.x, any.y + 1);
            if (!this.indexOfV2(list, tp) && !this.indexOfV2(travelList, tp)) {
                travelList.push(tp);
                // if(data[any.x][any.y +1]==5){
                //     data[any.x][any.y + 1]=tag;
                // }
            }
        }
        //下
        if (any.x - 1 >= 0 && (tag == data[any.x - 1][any.y])) {
            var tp = cc.v2(any.x - 1, any.y);
            if (!this.indexOfV2(list, tp) && !this.indexOfV2(travelList, tp)) {
                travelList.push(tp);
                // if(data[any.x-1][any.y]==5){
                //     data[any.x-1][any.y]=tag;
                // }
            }
        }
        //上
        if (any.x + 1 < Config.matrixRow && (tag == data[any.x + 1][any.y])) {
            var tp = cc.v2(any.x + 1, any.y);
            if (!this.indexOfV2(list, tp) && !this.indexOfV2(travelList, tp)) {
                travelList.push(tp);
                // if(data[any.x+1][any.y]==5){
                //     data[any.x+1][any.y]=tag;
                // }
            }
        }
        list.push(any);
    } while (travelList.length > 0);
    return list;
};

function getScore(count) {
    var score = 0;
    for (var i = 1; i <= count; i++) {
        score += this.getOneScore(i);
    }
    return score;
};
//消除第i个方块的分数
function getOneScore(i) {
    return 10 + i * 5;
};

function getExtraScore(i) {
    return 2000 - ((i - 1) * 200);
}


// 返回需要检查的列
function needCheckCols(list) {
    var checkCols = [];
    list.forEach(function (elem, index, arr) {
        if (checkCols.indexOf(elem.y) == -1) {
            checkCols.push(elem.y);
        }
    })
    //从大到小排序
    checkCols.sort(function (a, b) {
        return b - a;
    });
    return checkCols;
};

// 游戏结束判断
function gameOver(matrix) {
    for (var row = 0; row < Config.matrixRow; row++) {
        for (var col = 0; col < Config.matrixCol; col++) {
            var tag = matrix[row][col];
            if (tag >= 0 && tag < 20) {
                var any = cc.v2(row, col);
                // if (any.y - 1 >= 0 && (tag == matrix[any.x][any.y - 1] || matrix[any.x][any.y - 1] == 5)) {
                //     return false;
                // }
                // if (any.y + 1 < Config.matrixCol && (tag == matrix[any.x][any.y + 1] || matrix[any.x][any.y + 1] == 5)) {
                //     return false;
                // }
                // if (any.x - 1 >= 0 && (tag == matrix[any.x - 1][any.y] || matrix[any.x - 1][any.y] == 5)) {
                //     return false;
                // }
                // if (any.x + 1 < Config.matrixRow && (tag == matrix[any.x + 1][any.y] || matrix[any.x + 1][any.y] == 5)) {
                //     return false;
                // }

                if (any.y - 1 >= 0 && (tag == matrix[any.x][any.y - 1])) {
                    return false;
                }
                if (any.y + 1 < Config.matrixCol && (tag == matrix[any.x][any.y + 1])) {
                    return false;
                }
                if (any.x - 1 >= 0 && (tag == matrix[any.x - 1][any.y])) {
                    return false;
                }
                if (any.x + 1 < Config.matrixRow && (tag == matrix[any.x + 1][any.y])) {
                    return false;
                }
            }
        }
    }
    return true;
};

// 将界面从小到大展示出来
function showPromptWithScale(node) {
    node.scale = 0.2;
    node.runAction(
        cc.scaleTo(0.3, 1).easing(cc.easeBackOut(3))
    );
}

// 判断是不是新的一天
function isNewDay() {

    let zeroTime = Math.floor(new Date(new Date().toLocaleDateString()).getTime() / 1000);
    let data = cc.sys.localStorage.getItem('currentZeroTime');
    if (!data) {
        cc.sys.localStorage.setItem('currentZeroTime', zeroTime);
        return true;
    } else {
        // console.log(data);
        let oldZeroTime = parseInt(data);
        if (oldZeroTime >= zeroTime) {
            return false;
        } else if (oldZeroTime < zeroTime) {
            cc.sys.localStorage.setItem('currentZeroTime', zeroTime);
            return true;
        }
    }

}

// 节点缩放
function nodeScale(node, start, end, time, repeat) {
    if (repeat != -1) {
        node.runAction(
            cc.sequence(
                cc.scaleTo(time, start),
                cc.scaleTo(time, end),
            ).repeat(repeat)

        )
    } else {
        node.runAction(
            cc.sequence(
                cc.scaleTo(time, start),
                cc.scaleTo(time, end),
            ).repeatForever()

        );
    }
}

function setItemPicture(url, node) {
    // var self = this;
    cc.loader.load(url, function (err, texture) {
        if (!!texture) {
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }

    });
}

function changeLocalNodeTexture(node, list, type) {
    let sprite = node.getComponent(cc.Sprite);
    sprite.spriteFrame = list[type];
}


function getNodeWorldPosition(node) {
    return node.parent.convertToWorldSpaceAR(node.position);
}


function resize() {

    var cvs = cc.find('Canvas').getComponent(cc.Canvas);
    //保存原始设计分辨率，供屏幕大小变化时使用
    if (!this.curDR) {
        this.curDR = cvs.designResolution;
    }
    var dr = this.curDR;
    var s = cc.view.getFrameSize();
    var rw = s.width;
    var rh = s.height;
    var finalW = rw;
    var finalH = rh;

    if ((rw / rh) > (dr.width / dr.height)) {
        //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
        //cvs.fitHeight = true;

        //如果更长，则用定高
        finalH = dr.height;
        finalW = finalH * rw / rh;
    }
    else {
        /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
        //cvs.fitWidth = true;
        //如果更短，则用定宽
        finalW = dr.width;
        finalH = rh / rw * finalW;
    }
    cvs.designResolution = cc.size(finalW, finalH);
    cvs.node.width = finalW;
    cvs.node.height = finalH;
    cvs.node.emit('resize');
}

//  随机获取一个色块坐标
function getRandomBlockPosition(list, len) {
    let rList = [];
    while (rList.length < len) {
        let randomX = parseInt(Math.random() * Config.matrixRow);
        let randomY = parseInt(Math.random() * Config.matrixCol);
        if (list[randomX][randomY] >= 0 && list[randomX][randomY] < 8) {
            let item = cc.v2(randomX, randomY);
            if (!this.indexOfV2(rList, item)) {
                rList.push(item);
            }
        }
    }
    return rList;

}

// 计算多个相同子节点在父节点中的间隙

function computedNodeGap(num, parent, child) {
    let gap = (parent.width - (num * child.width)) / (num + 1);
    return gap;
}

// 倒计时
function countDonwTime(end) {
    let date = new Date();
    let str = '';
    var now = Math.floor(date.getTime() / 1000);
    //时间差
    var leftTime = end - now;
    // 定义变量 d,h,m,s保存倒计时的时间
    var
        // d,
        h, m, s;
    if (leftTime >= 0) {
        h = Math.floor(leftTime / 60 / 60 % 24);
        m = Math.floor(leftTime / 60 % 60);
        s = Math.floor(leftTime % 60);
    } else {
        // console.log('走这里了么？');
        // this.unschedule(this.countDonwTime);
        // this.fixedGiftAction();
        // this.countDown.node.parent.active = true;
        // this.countDown.string = 'Get Free';
        return false;
    }
    let hour, min, sec;
    if (h < 10) {
        hour = '0' + h;
    } else {
        hour = '' + h;
    }
    if (m < 10) {
        min = '0' + m;
    } else {
        min = '' + m;
    }
    if (s < 10) {
        sec = '0' + s;
    } else {
        sec = '' + s;
    }
    if (h > 0) {
        str = hour + ':' + min + ':' + sec;
    } else {
        str = min + ':' + sec;
    }

    return str;

}

// 判断一个节点的相邻节点是否为道具；
function judgeNearNode(list) {
    let toolEffectList = [];
    for (let i = 0; i < Config.matrixRow; i++) {
        for (let j = 0; j < Config.matrixCol; j++) {
            if (list[i][j] >= 8 && list[i][j] < 11) {
                let item = cc.v2(i, j);
                if (this.judgeNearBy(item, list)) {
                    toolEffectList.push(cc.v2(i, j));
                }
            }
        }
    }
    return toolEffectList;
}

// 判断上下左右是否为道具
function judgeNearBy(pos, list) {
    let isTool = false;
    if (pos.x - 1 >= 0) {
        if (list[pos.x - 1][pos.y] >= 8 && list[pos.x - 1][pos.y] < 11) {
            isTool = true;
        }
    }
    if (pos.x + 1 < Config.matrixRow) {
        if (list[pos.x + 1][pos.y] >= 8 && list[pos.x + 1][pos.y] < 11) {
            isTool = true;
        }
    }
    if (pos.y + 1 < Config.matrixCol) {
        if (list[pos.x][pos.y + 1] >= 8 && list[pos.x][pos.y + 1] < 11) {
            isTool = true;
        }
    }
    if (pos.y - 1 >= 0) {
        if (list[pos.x][pos.y - 1] >= 8 && list[pos.x][pos.y - 1] < 11) {
            isTool = true;
        }
    }
    return isTool;
}

// 判断色块是否处在边界或者跟空色块相邻
function judgeBounder(pos, list) {

    let boundList = [];
    // 上
    if (pos.y + 1 >= Config.matrixCol) {
        boundList[3] = 1;
    } else {
        if (list[pos.x][pos.y + 1] == -2) {
            boundList[3] = 1;
        } else {
            boundList[3] = 0;
        }
    }

    // 下
    if (pos.y - 1 < 0) {
        boundList[2] = 1;
    } else {
        if (list[pos.x][pos.y - 1] == -2) {
            boundList[2] = 1;
        } else {
            boundList[2] = 0;
        }
    }

    // 左
    if (pos.x - 1 < 0) {
        boundList[1] = 1;
    } else {
        if (list[pos.x - 1][pos.y] == -2) {
            boundList[1] = 1;
        } else {
            boundList[1] = 0;
        }
    }

    // 右
    if (pos.x + 1 >= Config.matrixRow) {
        boundList[0] = 1;
    } else {
        if (list[pos.x + 1][pos.y] == -2) {
            boundList[0] = 1;
        } else {
            boundList[0] = 0;
        }
    }

    return boundList;

}

// 判断色块的四个对角位置是否存在色块
function judgeAngle(pos, list) {
    let angleList = [0, 0, 0, 0];
    // 左上
    if (pos.x - 1 >= 0 && pos.y + 1 < Config.matrixCol) {
        if (list[pos.x - 1][pos.y + 1] != -2) {
            angleList[2] = 1;
        }
    }

    // 右上
    if (pos.x + 1 < Config.matrixRow && pos.y + 1 < Config.matrixCol) {
        if (list[pos.x + 1][pos.y + 1] != -2) {
            angleList[1] = 2;
        }
    }

    // 右下
    if (pos.x + 1 < Config.matrixRow && pos.y - 1 >= 0) {
        if (list[pos.x + 1][pos.y - 1] != -2) {
            angleList[0] = 3;
        }
    }

    // 左下
    if (pos.x - 1 >= 0 && pos.y - 1 >= 0) {
        if (list[pos.x - 1][pos.y - 1] != -2) {
            angleList[3] = 4;
        }
    }

    // console.log(pos,angleList,list[pos.x][pos.y]);
    return angleList;
}

// 判断当前的操作的等级
function judgeOperateLevel(len) {
    if (len < 5) {
        return false;
    } else {
        if (len >= 5 && len < 7) {
            return 1;
        }
        if (len == 7) {
            return 2;
        }
        if (len >= 8) {
            return 3;
        }
    }
}

//  判断当前地图是否存在藤蔓
function getCurrentMapVineList(data) {
    let list = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
            let item = data[i][j];
            if (item == 22 && !this.indexOfV2(list, item)) {
                list.push(cc.v2(i, j));
            }
        }
    }
    if (list.length > 0) {
        return list;
    } else {
        return false;
    }
}

//  判断当前地图是否存在游戏障碍

function judgeCurrentMapHinderByType(data, type) {
    let list = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
            let item = data[i][j];
            if (item == type && !this.indexOfV2(list, item)) {
                list.push(cc.v2(i, j));
            }
        }
    }
    if (list.length > 0) {
        return list;
    } else {
        return false;
    }
}

// 获得一个4*3的游戏数组
function getWindmillEffectAreaList(data, p) {
    let list = [];
    let sRow = p.x - 1 >= 0 ? p.x - 1 : p.x;
    let sCol = p.y - 1 >= 0 ? p.y - 1 : p.y;
    let eRow = p.x + 2 < Config.matrixCol ? p.x + 2 : (p.x + 1 < Config.matrixCol ? p.x + 1 : p.x);
    let eCol = p.y + 1 < Config.matrixCol ? p.y + 1 : p.y;
    list.push(p);
    for (let i = sRow; i <= eRow; i++) {
        for (let j = sCol; j <= eCol; j++) {
            if (data[i][j] >= 0) {
                if (i == p.x && j == p.y) {
                    continue;
                }
                let item = cc.v2(i, j);
                list.push(item);
            }
        }
    }
    // console.log(list);
    return list;
}

// 更新游戏数据
function updateGameInfo(data) {
    // let data = GameData.getGameData();
    // console.log(data, '1033');
    let localData = cc.sys.localStorage.getItem('localData');
    let uid, tool = {}, params = {};
    if (!localData) {
        uid = window.NativeManager.getUid();
        console.log('localData is not exist');
    } else {
        localData = JSON.parse(localData);
        if (localData.uid == '') {
            uid = window.NativeManager.getUid();
        } else {
            uid = localData.uid;
        }
    }

    tool.game = data.gameToolList;
    tool.player = data.game_prop;
    // 封装需要更新的数据
    params.name = '';
    params.level = data.bestLevel;
    // 9;

    params.coin = data.starCount;

    params.star = data.totalStar;
    // 40;

    params.lasttime = Math.floor(new Date().getTime() / 1000);
    params.data = JSON.stringify(tool);

    let callback = function (res) {
        console.log(res);
    };
    cc.director.ServerManager.updateData(1, uid, params, callback);
}


module.exports = {
    resize: resize,
    initMatrixDataPortraitRandom: initMatrixDataPortraitRandom,
    grid2Pos: grid2Pos,
    pos2Grid: pos2Grid,
    indexValue: indexValue,
    resolveIndex: resolveIndex,
    indexOfV2: indexOfV2,
    needRemoveList: needRemoveList,
    getScore: getScore,
    getOneScore: getOneScore,
    needCheckCols: needCheckCols,
    randomColorByArray: randomColorByArray,
    gameOver: gameOver,
    getExtraScore: getExtraScore,
    rainbowStarRemoveList: rainbowStarRemoveList,
    creatSpecialStarList: creatSpecialStarList,
    showPromptWithScale: showPromptWithScale,
    isNewDay: isNewDay,
    nodeScale: nodeScale,
    setItemPicture: setItemPicture,
    changeLocalNodeTexture: changeLocalNodeTexture,
    getColData: getColData,
    getRowData: getRowData,
    getSameBlockList: getSameBlockList,
    needCombineTool: needCombineTool,
    getRowAndCol: getRowAndCol,
    get3Row: get3Row,
    get3Col: get3Col,
    getThreeBlockArea: getThreeBlockArea,
    getItemAdjacentPos: getItemAdjacentPos,
    getBalloonClearList: getBalloonClearList,
    randomGetGrid: randomGetGrid,
    getRandomBlockPosition: getRandomBlockPosition,
    computedNodeGap: computedNodeGap,
    countDonwTime: countDonwTime,
    judgeNearNode: judgeNearNode,
    judgeNearBy: judgeNearBy,


    girdToPos,
    judgeBounder,
    judgeAngle,
    addHinder,
    chooseRemoveList,
    checkItem,
    canRemoveList,
    noticeLongestList,
    judgeOperateLevel,
    getCurrentMapVineList,
    judgeCurrentMapHinderByType,
    getWindmillEffectAreaList,


    updateGameInfo,

};