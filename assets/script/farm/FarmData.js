// 土地的位置集合
const landPositionList = [
    cc.v2(140, 190),
    cc.v2(-40, 90),
    cc.v2(-220, -10),
    cc.v2(180, 20),
    cc.v2(0, -80),
    cc.v2(-180, -180),
    cc.v2(220, -160),
    cc.v2(40, -260),
    cc.v2(-140, -360),
];

const changeRate = 500;


// 土地信息集合
const landDetail = [
    //index： 索引 ，type：类型，growthcycle：生长周期， growthStatue：生长状态，healthStatue:健康状态， output:产量，startTime:种植时间，isUse：使用状态，
    { index: 0, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 24, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 1, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 20, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 2, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 16, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 3, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 12, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 4, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 9, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 5, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 1, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 5, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 6, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 0, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 2, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 7, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 3, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 1, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
    { index: 8, type: 0, growthStatue: -1, healthStatue: { bug: 0, reap: 0, water: 0, withered: 0 }, isUse: false, isLock: 3, waterTime: -1, restTime: -1, plantTime: -1, reapTime: -1, unlockLevel: 1, insectAppearTime: -1, isReduceProduce: -1, protectEndTime: -1, protectType: -1 },
];

const landUnlockLevelList = [
    24, 20, 16, 12, 9, 5, 2, 1, 1
];

const landUnlockAndLevelUpCost = [
    { cost: 69000, levelUpCost: 50000 },
    { cost: 39000, levelUpCost: 50000 },
    { cost: 16000, levelUpCost: 50000 },
    { cost: 6600, levelUpCost: 50000 },
    { cost: 1600, levelUpCost: 50000 },
    { cost: 500, levelUpCost: 50000 },
    { cost: 50, levelUpCost: 50000 },
    { cost: 0, levelUpCost: 50000 },
    { cost: 0, levelUpCost: 50000 },
]

// 需要计算判断的属性 
// 1 生长周期
// 2 健康状态
// 3 剩余成熟时间
// 4 下一次浇水时间

// 所有植物的基本数据
const plantInfo = [
    { type: 0, name: 'carrot', cycle: 3, levelUplimite: 60, price: 10, limitedLevel: 5, waterIntervel: 5, witheredTime: 1440 },
    { type: 1, name: 'corn', cycle: 12, levelUplimite: 54, price: 12, limitedLevel: 5, waterIntervel: 5, witheredTime: 1440 },

    { type: 2, name: 'pea', cycle: 33, levelUplimite: 45, price: 18, limitedLevel: 5, waterIntervel: 10, witheredTime: 1440 },
    { type: 3, name: 'tomato', cycle: 75, levelUplimite: 45, price: 24, limitedLevel: 5, waterIntervel: 20, witheredTime: 2880 },
    { type: 4, name: 'papper', cycle: 180, levelUplimite: 45, price: 32, limitedLevel: 5, waterIntervel: 50, witheredTime: 2880 },
    { type: 5, name: 'cabbage', cycle: 375, levelUplimite: 36, price: 40, limitedLevel: 5, waterIntervel: 60, witheredTime: 2880 },
    { type: 6, name: 'peanut', cycle: 540, levelUplimite: 36, price: 52, limitedLevel: 5, waterIntervel: 60, witheredTime: 2880 },
    { type: 7, name: 'pumpkin', cycle: 735, levelUplimite: 27, price: 65, limitedLevel: 5, waterIntervel: 120, witheredTime: 2880 },
    { type: 8, name: 'paddy', cycle: 990, levelUplimite: 18, price: 82, limitedLevel: 5, waterIntervel: 120, witheredTime: 2880 },
];

// 农场信息
let farmInfo = {
    level: 1,
    exp: 0,
    coin: 0,
};


// 仓库数据
const warehouseData = [
    { type: 1, number: 4 }
];

const shopSeedData = [
    { type: 0, price: 10, },
    { type: 1, price: 12, },
    { type: 2, price: 18, },
    { type: 3, price: 24, },
    { type: 4, price: 32, },
    { type: 5, price: 40, },
    { type: 6, price: 52, },
    { type: 7, price: 65, },
    { type: 8, price: 82, },
];

const seedData = [
    { type: 0, number: 5, level: 1, isUnlock: true, unlockLevel: 1, price: 1, plantCount: 0, basicProduce: 4 },
    { type: 1, number: 10, level: 1, isUnlock: true, unlockLevel: 3, price: 2, plantCount: 0, basicProduce: 5 },
    { type: 2, number: 15, level: 1, isUnlock: true, unlockLevel: 5, price: 6, plantCount: 0, basicProduce: 6 },
    { type: 3, number: 2, level: 1, isUnlock: true, unlockLevel: 7, price: 14, plantCount: 0, basicProduce: 6 },
    { type: 4, number: 3, level: 1, isUnlock: true, unlockLevel: 9, price: 24, plantCount: 0, basicProduce: 7 },
    { type: 5, number: 0, level: 1, isUnlock: true, unlockLevel: 11, price: 35, plantCount: 0, basicProduce: 8 },
    { type: 6, number: 0, level: 1, isUnlock: false, unlockLevel: 13, price: 48, plantCount: 0, basicProduce: 8 },
    { type: 7, number: 0, level: 1, isUnlock: false, unlockLevel: 15, price: 60, plantCount: 0, basicProduce: 8 },
    { type: 8, number: 0, level: 1, isUnlock: false, unlockLevel: 17, price: 88, plantCount: 0, basicProduce: 10 },
];

const propsData = [
    { type: 0, number: 1 },
    { type: 1, number: 3 },
    { type: 2, number: 4 },
    { type: 3, number: 2 },
    { type: 4, number: 5 },
];

const propShopList = [
    // 肥料  时间单位是分钟
    { type: 0, price: 500, effectTime: 60, name: 'single speed up', timeStr: '1 h' },
    { type: 1, price: 980, effectTime: 120, name: 'single speed up', timeStr: '2 h' },
    { type: 2, price: 1920, effectTime: 240, name: 'single speed up', timeStr: '4 h' },
    { type: 3, price: 3800, effectTime: 480, name: 'single speed up', timeStr: '8 h' },
    // 时钟
    { type: 4, price: 4000, effectTime: 60, name: 'all speed up', timeStr: '1 h' },
    { type: 5, price: 7900, effectTime: 120, name: 'all speed up', timeStr: '2 h' },
    { type: 6, price: 15600, effectTime: 240, name: 'all speed up', timeStr: '4 h' },
    { type: 7, price: 31000, effectTime: 480, name: 'all speed up', timeStr: '8 h' },
    // 自动浇水
    { type: 8, price: 600, effectTime: 240, name: 'auto watering', timeStr: '4 h' },
    { type: 9, price: 1200, effectTime: 480, name: 'auto watering', timeStr: '8 h' },
    { type: 10, price: 2400, effectTime: 960, name: 'auto watering', timeStr: '16 h' },
    { type: 11, price: 7200, effectTime: 1920, name: 'auto watering', timeStr: '48 h' },
    // 保护罩
    { type: 12, price: 500, effectTime: 360, name: 'protection spray', timeStr: '6 h' },
    { type: 13, price: 900, effectTime: 720, name: 'protection spray', timeStr: '12 h' },
    { type: 14, price: 3400, effectTime: 2880, name: 'protection spray', timeStr: '48 h' },
];


// 道具列表
const propList = [
    { effectTime: 1, cost: 100, type: 1 },
    { effectTime: 2, cost: 200, type: 1 },
    { effectTime: 3, cost: 300, type: 1 },
    { effectTime: 4, cost: 400, type: 1 },
    { effectTime: 5, cost: 500, type: 1 },
    { effectTime: 6, cost: 600, type: 1 },
];

// 不同操作所对应的奖励
const OperationReward = [
    { name: 'water', exp: 100, coins: 0 },
    { name: 'plant', exp: 100, coins: 0 },
    { name: 'withered', exp: 100, coins: 0 },
    { name: 'protect', exp: 100, coins: 0 },
    { name: 'pestControl', exp: 100, coins: 0 },
    { name: 'help', exp: 300, coins: 30 },
    { name: 'fertilize', exp: 200, coins: 0 },
];

// 最大的浇水次数
const WHTER_COUNT_MAX = 5;

// 产品的出产率
const PRODUCE_RATE = 0.5;

function getPlantProduce(level, type) {
    let produce;
    if (type < 2) {
        produce = this.seedData[type].basicProduce + (level - 1) * 3;
    } else if (type < 5) {
        produce = this.seedData[type].basicProduce + (level - 1) * 2;
    } else if (type < 9) {
        produce = this.seedData[type].basicProduce + (level - 1) * 1;
    }
    return produce;
}

// 获得升级当前等级所需经验
function getLevelUpExp(level) {
    let sum = 4000, i = 2;
    while (i < level) {
        i++;
        sum += (i - 1) * (5000 + Math.floor((i / 5)) * 1000);
    }

    return sum;
}

function getReapExp(type, produce) {
    let exp = 0;
    switch (type) {
        case 0:
            exp = produce * 500;
            break;
        case 1:
            exp = produce * 1600;
            break;
        case 2:
            exp = produce * 3760;
            break;
        case 3:
            exp = produce * 8350;
            break;
        case 4:
            exp = produce * 17200;
            break;
        case 5:
            exp = produce * 31300;
            break;
        case 6:
            exp = produce * 45100;
            break;
        case 7:
            exp = produce * 61400;
            break;
        case 8:
            exp = produce * 67500;
            break;

        default:
    }
    console.log(exp);
    return exp;

}

// 虫子的出现时间
const insectAppearTimeList = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 50, 20],
    [20, 120, 60],
    [20, 240, 120],
    [30, 360, 180],
    [30, 480, 240],
    [30, 600, 360],
];

const insectAppearPositionList = [
    // carrot
    [
        [cc.v2(0, -110), cc.v2(-60, -65), cc.v2(-10, -80), cc.v2(70, -80)],
        [cc.v2(-60, -40), cc.v2(-10, -10), cc.v2(-0, -75), cc.v2(70, -60)],
        [cc.v2(-60, 20), cc.v2(-10, 30), cc.v2(-10, -30), cc.v2(70, -10)],
    ],
    // corn
    [
        [cc.v2(-60, -85), cc.v2(-10, -50), cc.v2(0, -100), cc.v2(70, -80)],
        [cc.v2(-60, 5), cc.v2(-7, 40), cc.v2(0, -40), cc.v2(20, -40)],
        [cc.v2(-60, -80), cc.v2(-30, 40), cc.v2(10, 0), cc.v2(60, 50)],
    ],

    // tomato
    [
        [cc.v2(-60, -60), cc.v2(-20, 0), cc.v2(10, -80), cc.v2(90, -40)],
        [cc.v2(-60, -60), cc.v2(-20, 0), cc.v2(10, -80), cc.v2(90, -40)],
        [cc.v2(-60, -45), cc.v2(-20, 30), cc.v2(10, -60), cc.v2(90, 0)],
    ],

    // pepper
    [
        [cc.v2(-20, -90), cc.v2(-20, -50), cc.v2(20, -60), cc.v2(30, -80)],
        [cc.v2(-20, 40), cc.v2(-20, -10), cc.v2(20, 20), cc.v2(30, -30)],
        [cc.v2(-70, 40), cc.v2(-20, 80), cc.v2(20, 30), cc.v2(80, 10)],
    ],

    // pumpkin
    [
        [cc.v2(-70, -70), cc.v2(-20, -50), cc.v2(0, -100), cc.v2(50, -70)],
        [cc.v2(-50, -70), cc.v2(-10, -40), cc.v2(0, -90), cc.v2(50, -55)],
        [cc.v2(-50, -60), cc.v2(0, -30), cc.v2(20, -20), cc.v2(80, -55)],
    ],

    // cabbage
    [
        [cc.v2(-50, -90), cc.v2(-15, -50), cc.v2(20, -100), cc.v2(80, -80)],
        [cc.v2(-50, -90), cc.v2(-15, -50), cc.v2(6, -90), cc.v2(80, -80)],
        [cc.v2(-50, -60), cc.v2(-15, -15), cc.v2(5, -60), cc.v2(80, -40)],
    ],

    // paddy
    [
        [cc.v2(-50, -90), cc.v2(-15, -60), cc.v2(6, -100), cc.v2(60, -80)],
        [cc.v2(-105, 30), cc.v2(-15, 35), cc.v2(20, -15), cc.v2(100, -10)],
        [cc.v2(-105, 50), cc.v2(-15, 75), cc.v2(20, 20), cc.v2(95, 50)],
    ],

    // pea
    [
        [cc.v2(-70, -45), cc.v2(-35, 0), cc.v2(40, -45), cc.v2(70, 0)],
        [cc.v2(-50, -45), cc.v2(-35, 20), cc.v2(50, -45), cc.v2(65, 15)],
        [cc.v2(-50, -5), cc.v2(-20, 75), cc.v2(50, -10), cc.v2(90, 70)],
    ],

    // peanut
    [
        [cc.v2(-80, -85), cc.v2(-20, -50), cc.v2(15, -110), cc.v2(80, -80)],
        [cc.v2(-80, -50), cc.v2(-20, -20), cc.v2(15, -75), cc.v2(80, -40)],
        [cc.v2(-80, -25), cc.v2(-20, 0), cc.v2(15, -60), cc.v2(80, -30)],
    ],

];





//  种子升级
const seedLevelUp = cc.Enum({
    BASIC_COUNT: 3,
    LEVELUP_RATE: 0.2,
});

// 缩短时间枚举单位
const costTime = cc.Enum({
    ONE_MIN: 1 * 60,
    HALF_AN_HOUR: 30 * 60,
    ONE_HOUR: 1 * 60 * 60,
});

// 浇水间隔时间
const IndirectTime = 5 * 60;

const waterStartPos = [cc.v2(-85, 130), cc.v2(-20, 150), cc.v2(0, 140), cc.v2(50, 110), cc.v2(80, 120),];

const waterEndPos = [cc.v2(-85, -90), cc.v2(-20, -70), cc.v2(0, -100), cc.v2(50, -100), cc.v2(80, -80),];
const shopLimitedList = [1, 15, 30, 50, 75, 100, 125, 160, 180];
const plantLimitedList = [1, 3, 6, 10, 14, 18, 22, 25, 30];
const plantUnlockSeedReward = [5, 4, 3, 2, 2, 2, 2, 2, 2];


const wordTips = {
    '1001': 'The coins is not enough!',
    '1002': 'Please click the land to plant!',
    '1003': 'The crops is mature!',
    '1004': 'illegal operate!',
    '1005': 'sorry , you need more diamond!',
    '1006': 'sorry , you need more money!',
    '1007': 'exchange success!',
    '1008': 'The props is not enough!',
    '1009': 'The seed is not enough!',
    '1010': 'The seed is use up!',
    '1011': 'The  props is use up!',
}

const seedLabel = [
    { name: 'carrot', matureTime: '3 min' },
    { name: 'corn', matureTime: '12 min' },
    { name: 'pea', matureTime: '33 min' },
    { name: 'tomato', matureTime: '1hour 15 min' },
    { name: 'pepper', matureTime: '3 hours' },
    { name: 'cabbage', matureTime: '6 hours 15 min' },
    { name: 'peanut', matureTime: '9 hours' },
    { name: 'pumpkin', matureTime: '12 hours  15 min' },
    { name: 'paddy', matureTime: '16 hours 30 min' },
]

const expThreshold = 1000;

const landLevelUpInfo = [
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
    { landLevel: 0, baseCost: 0, levelUpCount: 0 },
]



module.exports = {
    landPositionList,
    landDetail,
    costTime,
    plantInfo,
    IndirectTime,
    propList,
    OperationReward,
    warehouseData,
    // farmInfo,
    seedData,
    propsData,
    shopSeedData,
    seedLevelUp,
    WHTER_COUNT_MAX,
    PRODUCE_RATE,
    propShopList,
    waterStartPos,
    waterEndPos,
    shopLimitedList,
    plantLimitedList,
    insectAppearTimeList,
    insectAppearPositionList,
    landUnlockLevelList,
    landUnlockAndLevelUpCost,
    wordTips,
    plantUnlockSeedReward,
    changeRate,
    seedLabel,
    expThreshold,


    getPlantProduce,
    getLevelUpExp,
    getReapExp,

};