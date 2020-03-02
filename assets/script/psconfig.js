//psconfig.js
var cellSize = 75; //星星纹理的边长
var matrixRow = 9; //地图的行数（高）
var matrixCol = 9; //地图的列数（宽）
var totalColors = [0, 1, 2, 3, 4]; //表示五种星星
let extraScore = 2000;
const rType = 8;//火箭
const bType = 9; //炸弹
const dType = 10; // 转球
const continueCostList = [100, 250, 350, 450, 750, 1050];

// 看视频得到的金币数量
const REWARD_COINS_NUM = 15;

// 默认的最大生命上限
const MAX_LIFE = 6;

const direction = cc.Enum({
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});
// 玩家道具的购买价格
const playerTooLCostList = [
    { type: 0, price: 150 },
    { type: 1, price: 120 },
    { type: 2, price: 100 },
    { type: 3, price: 80 },
];


// 游戏套餐数值
const giftNumber = [
    //                            rocket bomb disco     boxing anvil hammer dice
    // { coins: 200, life: 0, gameTool: [1, 1, 1], playerTool: [1, 1, 1, 1] },
    // { coins: 500, life: 0, gameTool: [1, 1, 1], playerTool: [1, 1, 1, 1] },
    // { coins: 1000, life: 0, gameTool: [3, 3, 3], playerTool: [3, 3, 3, 3] },
    // { coins: 2000, life: 6, gameTool: [5, 5, 5], playerTool: [5, 5, 5, 5] },
    // { coins: 4000, life: 12, gameTool: [12, 12, 12], playerTool: [12, 12, 12, 12] },
    // { coins: 8000, life: 24, gameTool: [25, 25, 25], playerTool: [25, 25, 25, 25] },
    { coins: 200, life: 0, gameTool: { rocket: 1, bomb: 1, disco: 1, }, playerTool: { boxing: 1, anvil: 1, hammer: 1, dice: 1, } },
    { coins: 500, life: 0, gameTool: { rocket: 1, bomb: 1, disco: 1, }, playerTool: { boxing: 1, anvil: 1, hammer: 1, dice: 1, } },
    { coins: 1000, life: 0, gameTool: { rocket: 3, bomb: 3, disco: 3, }, playerTool: { boxing: 3, anvil: 3, hammer: 3, dice: 3, } },
    { coins: 2000, life: 6, gameTool: { rocket: 5, bomb: 5, disco: 5, }, playerTool: { boxing: 5, anvil: 5, hammer: 5, dice: 5, } },
    { coins: 4000, life: 12, gameTool: { rocket: 12, bomb: 12, disco: 12, }, playerTool: { boxing: 12, anvil: 12, hammer: 12, dice: 12, } },
    { coins: 8000, life: 24, gameTool: { rocket: 25, bomb: 25, disco: 25, }, playerTool: { boxing: 25, anvil: 25, hammer: 25, dice: 25, } },
]

// 游戏金币数量列表
const coinsList = [
    150, 500, 1000, 2000, 4000, 8000
];

// const guideWordList = {
//     'collectCubes':'collect the remaining cubes until the goal is complete',
// };


// 游戏道具的购买价格
const gameToolCost = 120;

// todo
const hinderType = cc.Enum({
    pine: 20,
    balloon: 21,
    vine: 22,
    ironLineBox: 23,
    woodBox: 25,
    flower: 26,
    windmill: 27,
    stoneStatue: 28,
    colorCube: 29,
    ladybug: 37,
    waterBubble: 38,
    rockStone: 39,
});

module.exports = {
    cellSize: cellSize,
    matrixRow: matrixRow,
    matrixCol: matrixCol,
    totalColors: totalColors,
    extraScore: extraScore,
    rType: rType,
    bType: bType,
    dType: dType,
    direction: direction,
    continueCostList: continueCostList,
    REWARD_COINS_NUM: REWARD_COINS_NUM,
    MAX_LIFE: MAX_LIFE,
    playerTooLCostList: playerTooLCostList,
    gameToolCost: gameToolCost,
    giftNumber: giftNumber,
    coinsList: coinsList,
};