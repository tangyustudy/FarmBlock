// gamedata.js
var level = 0; //记录当前关卡
var targetScore = 0; //当前关卡目标分数
var currScore = 0; //当前得分
var bestScore = 0; //历史最高得分
var starMatrix = null; //地图数据，二维数组
var starSprite = []; //一维数组，存储星星的Node
let psconfig = require('./psconfig.js');
let LeaderBoardManager = require('./LeaderBoardManager.js');
let isContinu = 1;
// let Utils = require('./utils');
let game_prop = [
    { type: 0, name: 'battle', number: 0, },
    { type: 1, name: 'fork', number: 0, },
    { type: 2, name: 'hammer', number: 0, },
    { type: 3, name: 'dice', number: 0, }
];
let starCount = 0;
let boxPoint = [];
let bestLevel = 0;
let bestLevelScore = 0;
let continueCount = 0;

let lifeNumber = 0;
let currentStar = 0;
let passRate = -1;
let gameToolList = [0, 0, 0];
let choosedList = [];
let totalStar = 0;


//清除星星
function cleanStarData(list) {
    list.forEach(function (elem, index, arr) {
        this.starMatrix[elem.x][elem.y] = -1;
    }, this);
}

// 改变单分星星的数据信息

function updateSingleData(grid, type) {
    this.starMatrix[grid.x][grid.y] = this.starMatrix[grid.x][grid.y] + type >= psconfig.dType ? psconfig.dType : this.starMatrix[grid.x][grid.y] + type;
}

// 根据行列获得数据
function getDataBygrid(grid) {
    if (!!grid) {
        return this.starMatrix[grid.x][grid.y];
    } else {
        // console.log('param is wrong');
        return false;
    }
}


// 重新更新整个数组
function tampStarData() {
    // console.log(...checkCols);
    for (let i = 0; i < psconfig.matrixCol; i++) {
        let col = i;
        let row = -1;
        for (let j = 0; j < psconfig.matrixRow; j++) {
            if (this.starMatrix[j][col] == -1) {
                row = j;
                break;
            }
        }

        if (row >= 0) {
            for (let k = row; k < psconfig.matrixCol; k++) {
                if (this.starMatrix[k][col] == -2) {
                    continue;
                }

                let index = -1;
                for (let t = k + 1; t < psconfig.matrixRow; t++) {
                    if (this.starMatrix[t][col] >= 0) {
                        index = t;
                        break;
                    }
                }

                if (index >= 0) {
                    this.starMatrix[k][col] = this.starMatrix[index][col];
                    this.starMatrix[index][col] = -1;
                } else {
                    break;
                }
            }
        }
    }
    // console.log(this.starMatrix,'19 game data');
}


function checkEmptyCol() {
    // 找出是否存在空列
    let index = -1;
    for (let i = 0; i < psconfig.matrixCol; i++) {
        if (this.starMatrix[0][i] < 0) {
            index = i;
            break;
        }
    }
    // 如果存在，进行下列操作
    if (index >= 0) {

        for (let c = index; c < psconfig.matrixCol - 1; c++) {
            // 检测右边最近的非空列
            let nIndex = -1;
            for (let j = c + 1; j < psconfig.matrixCol; j++) {
                if (this.starMatrix[0][j] >= 0) {
                    nIndex = j;
                    break;
                }
            }
            // 如果存在
            if (nIndex >= 0) {
                // 将该非空列赋给空列
                for (let r = 0; r < psconfig.matrixRow; r++) {
                    this.starMatrix[r][c] = this.starMatrix[r][nIndex];
                    this.starMatrix[r][nIndex] = -1;
                }
            }
        }
    }
    // ---------------------------------------------------------------------

    //  下面这个方法是错误的，其一是原理理解不够清晰，导致多重循环中初始值的赋值出现问题
    // 其二，对复制过来的代码过于依赖，这个方法完全可以不用传参也能计算
    // for(let a=0;a<checkCols.length;a++){
    //     let col = checkCols[i];
    //     // 寻找出现消除的列是否有空行；
    //     let index=-1;
    //     for(let i=col;i<psconfig.matrixCol;i++){
    //         if(this.starMatrix[0][i]<0){
    //             index=i;
    //             break;
    //         }
    //     }
    //     if(index>=0){

    //         for(let c=index;c<psconfig.matrixCol-1;c++){ 
    //             let nIndex=-1;
    //             for(let j=c+1;j<psconfig.matrixCol;j++){
    //                 if(this.starMatrix[0][j]>=0){
    //                     nIndex=j;
    //                     break;
    //                 }
    //             }
    //             if(nIndex>=0){
    //                 for(let r=0;r<psconfig.matrixRow;r++){
    //                     this.starMatrix[r][c] = this.starMatrix[r][nIndex];
    //                     this.starMatrix[r][nIndex]=-1;
    //                 }

    //             }
    //         }

    //     }
    // }
    // console.log(this.starMatrix,'110')

}

function remainStarData() {
    let list = [];
    let pos;
    for (let i = 0; i < psconfig.matrixRow; i++) {
        for (let j = 0; j < psconfig.matrixCol; j++) {
            if (this.starMatrix[i][j] >= 0) {
                pos = cc.v2(i, j);
                list.push(pos);
            }
        }
    }

    return list;
}

function initAllGameData() {
    this.targetScore = 1000;
    this.currScore = 0;
    this.level = 1;
    this.starMatrix = null;
    this.starSprite = [];
    this.isContinu = 1;
    this.passRate = -1;
    this.game_prop = [
        { type: 0, name: 'battle', number: 1, },
        { type: 1, name: 'fork', number: 1, },
        { type: 2, name: 'hammer', number: 1, },
        { type: 3, name: 'dice', number: 1, }
    ];
    this.boxPoint = [];
    this.continueCount = 0;
    this.gameToolList = [0, 0, 0];
    this.currentStar = 0;
    this.lifeNumber = 6;
  
    let oldData = this.getGameData();
    if (!!oldData) {
        this.bestLevel = oldData.bestLevel ? oldData.bestLevel : 0;
        this.bestScore = oldData.bestScore ? oldData.bestScore : 0;
        this.starCount = oldData.starCount ? oldData.starCount : 0;
        this.bestLevelScore = oldData.bestLevelScore ? oldData.bestLevelScore : 0;
        this.totalStar = oldData.totalStar ? oldData.totalStar : 0;
    } else {
        this.bestLevel = 0;
        this.bestScore = 0;
        this.starCount = 0;
        this.bestLevelScore = 0;
        this.totalStar = 0;
    }

    //  this.bestLevel=0;
    // this.bestScore=0;
    // this.starCount=0;
}

function storeGameData() {
    let data = cc.sys.localStorage.getItem('starGameData');
    if (!!data) {
        data = JSON.parse(data);
    } else {
        data = {};
    }
    data.currScore = this.currScore;
    data.targetScore = this.targetScore;
    data.level = this.level;
    data.bestScore = this.bestScore;
    // data.starMatrix = this.starMatrix;
    data.isContinu = this.isContinu;
    data.starCount = this.starCount;
    data.game_prop = this.game_prop;
    data.boxPoint = this.boxPoint;
    data.bestLevel = this.bestLevel;
    data.bestScore = this.bestScore;
    data.bestLevelScore = this.bestLevelScore;
    data.continueCount = this.continueCount;

    data.gameToolList = this.gameToolList;
    data.lifeNumber = this.lifeNumber;
    data.currentStar = this.currentStar;
    data.passRate = this.passRate;
    data.totalStar = this.totalStar;


    cc.sys.localStorage.setItem('starGameData', JSON.stringify(data));
    // console.log(data);
}

function getGameData() {
    let starGameData = cc.sys.localStorage.getItem('starGameData');
    if (!!starGameData) {
        return JSON.parse(starGameData);
    } else {
        return false;
    }
}

function overlapGameData(data) {
    //    let data = this.getGameData();
    if (!!data) {
        this.currScore = data.currScore;
        this.targetScore = data.targetScore;
        this.level = data.level;
        this.bestScore = data.bestScore;
        // this.starMatrix = data.starMatrix;
        this.isContinu = data.isContinu;
        this.starCount = data.starCount;
        this.game_prop = data.game_prop;
        this.boxPoint = data.boxPoint;
        this.bestLevel = data.bestLevel;
        this.bestLevelScore = data.bestLevelScore;
        this.continueCount = data.continueCount;

        this.gameToolList = data.gameToolList;
        this.lifeNumber = data.lifeNumber;
        this.currentStar = data.currentStar;
        this.passRate = data.passRate;
        this.totalStar = data.totalStar;

    }
    cc.sys.localStorage.setItem('starGameData', JSON.stringify(data));
    //    console.log(data,'210');

}

function getStarCount() {
    let starCount = cc.sys.localStorage.getItem('starCount');
    if (!starCount) {
        return 0;
    } else {
        return parseInt(starCount);
    }
}

function setStarCount(num) {
    cc.sys.localStorage.setItem('starCount', num);
}

function getFriendLeaderBoard() {
    if (!!window.FBInstant) {
        var self = this;
        FBInstant
            .getLeaderboardAsync('GlobalBoard')
            .then(leaderboard => leaderboard.getConnectedPlayerEntriesAsync(100, 0))
            .then(entries => {
                //{"name":"qqq","avatar":"2","rank":1,"score":150,"uid":"111"}
                var data = [];
                for (var i = 0; i < entries.length; i++) {
                    let item = {};
                    item.name = entries[i].getPlayer().getName();
                    item.rank = entries[i].getRank();
                    item.score = entries[i].getScore();
                    item.avatar = entries[i].getPlayer().getPhoto();
                    item.uid = entries[i].getPlayer().getID();
                    data.push(item);
                }
                // console.log(entries)
                cc.director.friendList = data;
            }).catch(error => {
                // self.networkError();
                console.error(error);
            });
    } else {
        let myData = cc.sys.localStorage.getItem('userNameInfo');
        if (!!myData) {
            myData = JSON.parse(myData);
            LeaderBoardManager.getListData(myData.uid, function (res) {
                if (!!res) {
                    cc.log(res, 'gameData_280');
                    cc.director.friendList = res.data;
                    cc.director.myGameData = res.mine;
                }
            })
        }
    }
}

function submitMyScore(score) {
    if (!!window.FBInstant) {
        FBInstant.getLeaderboardAsync('GlobalBoard')
            .then(function (leaderboard) {
                // console.log(leaderboard, '排行榜')
                return leaderboard.setScoreAsync(score);
            })
            .then(function (entry) {
                // console.log(entry,'我的排行');
                let item = {};
                item.name = entry.getPlayer().getName();
                item.rank = entry.getRank();
                item.score = entry.getScore();
                item.avatar = entry.getPlayer().getPhoto();
                item.uid = entry.getPlayer().getID();
                cc.director.myGameData = item;
            });
    } else {
        let myData = cc.sys.localStorage.getItem('userNameInfo');
        if (!!myData) {
            myData = JSON.parse(myData);
            let userInfo = {
                name: myData.name,
                avatar: myData.avatar
            };
            userInfo = JSON.stringify(userInfo);
            LeaderBoardManager.setScore(myData.uid, userInfo, score, function (res) {
                if (!!res) {
                    cc.log(res);
                    cc.director.myScoreList = res.data;
                }
            });
        }
    }
}

// 向服务器提交数据
function submitMyGameInfo() {
    let data = this.getGameData();
    let str = JSON.stringify(data);
    data.strData = str;
    if (!!window.FBInstant) {
        FBInstant.player.setDataAsync(data).then(function (res) {
            // console.log(res,'submit success');
        });
    }
}

// 从服务器获得数据

function getMyGameInfo() {
    let self = this;
    if (!!window.FBInstant) {
        FBInstant.player.getDataAsync(['strData']).then(function (res) {
            // console.log(res,'get success');
            let data = res.strData;
            // console.log(JSON.parse(data));
            // cc.director.myGameInfo=JSON.parse(res);
            // console.log(cc.director.myGameInfo);
            if (!!res) {
                let d = JSON.parse(data);
                self.overlapGameData(d);
                // console.log(d);
            }

        });
    }
}

function getNativeGameData() {
    let myData = cc.sys.localStorage.getItem('userNameInfo');
    if (!!myData) {
        myData = JSON.parse(myData);
        // let userInfo={
        //     name:myData.name,
        //     avatar:myData.avatar
        // };
        // userInfo = JSON.stringify(userInfo); 
        LeaderBoardManager.getListData(myData.uid, function (res) {
            cc.director.myGameData = res.mine;
        })
    }
}
/**
 * 
 * @param {表示传入参数的属性名} protoName 
 * @param {表示需要改变的数量} number 
 * @param {表示需要改变的类型} type 
 * @param {表示加减} addOrSub 
 */
function changeGameTool(protoName, number, type, addOrSub) {
    if (protoName == 'gameTool') {
        if (!!addOrSub) {
            this.gameToolList[type] += number;
        } else {
            this.gameToolList[type] -= number;
        }
    }

    if (protoName == 'playerTool') {
        if (!!addOrSub) {
            this.game_prop[type].number += number;
        } else {
            this.game_prop[type].number -= number;
        }
    }
    this.storeGameData();
}



module.exports = {
    level: level,
    targetScore: targetScore,
    currScore: currScore,
    bestScore: bestScore,
    starMatrix: starMatrix,
    starSprite: starSprite,
    game_prop: game_prop,
    isContinu: isContinu,
    starCount: starCount,
    boxPoint: boxPoint,

    lifeNumber: lifeNumber,//松鼠项目
    currentStar: currentStar,
    choosedList: choosedList,
    passRate: passRate,
    gameToolList: gameToolList,
    changeGameTool: changeGameTool,

    cleanStarData: cleanStarData,
    tampStarData: tampStarData,
    checkEmptyCol: checkEmptyCol,
    remainStarData: remainStarData,
    initAllGameData: initAllGameData,
    storeGameData: storeGameData,
    getGameData: getGameData,
    overlapGameData: overlapGameData,
    getStarCount: getStarCount,
    setStarCount: setStarCount,
    bestLevel: bestLevel,
    getFriendLeaderBoard: getFriendLeaderBoard,
    submitMyScore: submitMyScore,
    bestLevelScore: bestLevelScore,
    continueCount: continueCount,
    submitMyGameInfo: submitMyGameInfo,
    getMyGameInfo: getMyGameInfo,
    getNativeGameData: getNativeGameData,
    // getMyGameInfo_native:getMyGameInfo_native,
    updateSingleData: updateSingleData,
    getDataBygrid: getDataBygrid,
    totalStar:totalStar,

    // stageDataList: stageDataList,
    // targetList: targetList,
    // scoreStandard: scoreStandard,
    // stageStep: stageStep,
    // hinderList: hinderList
};