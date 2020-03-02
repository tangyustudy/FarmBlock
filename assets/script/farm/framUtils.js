let GameData = require('../gameData');
let FarmData = require('./FarmData');
let ServerManager = require('../ServerManager');

// 获得当前的UTC时间
function getUTCtime() {
    let nowTime = new Date();
    let offsetMin = nowTime.getTimezoneOffset();
    let currentStamp = Math.floor(nowTime.getTime() / 1000);
    let currentUTCStamp = currentStamp + offsetMin * 60;
    // console.log(currentStamp,currentUTCStamp,offsetMin);
    return currentUTCStamp;
}

// 记录同步服务器的本地时间
function saveSyncServerTime() {
    let time = this.getUTCtime();
    cc.sys.localStorage.setItem('SyncTime', time);

}

// 保存服务器时间
function saveServerTime(timeStamp) {
    cc.sys.localStorage.setItem('ServerTime', timeStamp);
}

// 获得当前服务器时间
function getServerTime() {
    let now = this.getUTCtime();
    let recordTime, lastServerTime;
    recordTime = cc.sys.localStorage.getItem('SyncTime');
    lastServerTime = cc.sys.localStorage.getItem('ServerTime');
    if (!!recordTime && !!lastServerTime) {
        recordTime = parseInt(recordTime);
        lastServerTime = parseInt(lastServerTime);
        let passTime = now - recordTime;
        // if (passTime >= 24 * 60 * 60) {
        //     return 0;
        // } else {
        let currentServerTime = passTime + lastServerTime;
        return currentServerTime;
        // }

    } else {
        return 0;
    }
}

// 时间校验
function checkLocalAndServerTime(timeStamp) {
    let now = this.getUTCtime();
    let recordTime, lastServerTime;
    recordTime = cc.sys.localStorage.getItem('SyncTime');
    lastServerTime = cc.sys.localStorage.getItem('ServerTime');
    if (!!recordTime && !!lastServerTime) {
        recordTime = parseInt(recordTime);
        lastServerTime = parseInt(lastServerTime);
        let localPassTime = now - recordTime;
        let serverPassTime = timeStamp - lastServerTime;
        if (Math.abs(localPassTime - serverPassTime) >= 10) {
            cc.log('error:Time anomaly!!');
            return false;
        } else {
            return true;
        }

    } else {
        cc.log('error: No record time!');
        // this.saveSyncServerTime();
        // this.saveServerTime(timeStamp);
        return false;
    }

}

// 界面展示时的缩放
function showPromptWithScale(node) {
    node.scale = 0.2;
    node.runAction(
        cc.scaleTo(0.3, 1).easing(cc.easeBackOut(3))
    );
}




// 获得游戏界面的等级
function getLevel() {
    let gd = GameData.getGameData();
    if (!gd) {
        GameData.initAllGameData();
        GameData.storeGameData();
        gd = GameData.getGameData();
    }
    return (gd.bestLevel + 1);
}


//  获得金币数量
function getCoins() {
    let gd = GameData.getGameData();
    if (!gd) {
        GameData.initAllGameData();
        GameData.storeGameData();
        gd = GameData.getGameData();
    }
    return gd.starCount;
}

// 保存金币数量
function saveCoins(cNum) {
    console.log(cNum, 'save coin');
    let gd = GameData.getGameData();
    // GameData.starCount;
    gd.starCount = cNum;
    GameData.overlapGameData(gd);
}

//获取仓库数据
function getWarehouseData(name) {
    let warehouseData = cc.sys.localStorage.getItem(name);
    if (!!warehouseData) {
        warehouseData = JSON.parse(warehouseData);
        return warehouseData;
    } else {
        return false;
    }
}

// 保存仓库数据
function saveWarehouseData(data, name) {
    if (!!data && typeof data == 'object') {
        cc.sys.localStorage.setItem(name, JSON.stringify(data));
    }
}




// 倒计时
/**
 * 
 * @param {Number} end 时间 
 * @param {Number} type type=1:时间戳 type=2:剩余时间
 */
function countdown(end, type) {
    var leftTime;
    let str = '';
    if (type == 1) {
        let now = this.getServerTime();
        // var now = Math.floor(date.getTime() / 1000);
        leftTime = end - now;
        // console.log(leftTime, now, '131');
    } else if (type == 2) {
        leftTime = end;
    } else {
        leftTime = 0
        cc.log('counttime,type is unexpected');
    }

    //时间差

    // 定义变量 d,h,m,s保存倒计时的时间
    var
        d,
        h, m, s;
    if (leftTime >= 0) {
        d = Math.floor(leftTime / 60 / 60 / 24);
        h = Math.floor(leftTime / 60 / 60 % 24);
        m = Math.floor(leftTime / 60 % 60);
        s = Math.floor(leftTime % 60);
    } else {
        return false;
    }
    if (d > 0) {
        h += d * 24;
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





// 获取本地数据
function getLocalData(name) {
    if (!!name && typeof name == 'string') {
        let farmInfo = cc.sys.localStorage.getItem(name);
        if (!!farmInfo) {
            farmInfo = JSON.parse(farmInfo);
            return farmInfo;
        } else {
            cc.log('error:data is not exist!', name);
            return false;
        }
    } else {
        cc.log('error:params error on get', name);
        return false;
    }
}

// 保存本地数据
function setLocalData(data, name) {
    if (!!data && typeof data == 'object') {
        cc.sys.localStorage.setItem(name, JSON.stringify(data));
    } else {
        cc.log('error:params error on set', name);
    }
}

//  删除本地数据
function removeLocalData(name) {
    if (!!name && typeof name == 'string') {
        cc.sys.localStorage.removeItem(name);
    } else {
        cc.log('error:params error on remove');
    }
}

// 检测是否存在本地数据
function checkLocalData(name) {
    if (!!name && typeof name == 'string') {
        let data = cc.sys.localStorage.getItem(name);
        if (!!data) {
            return true;
        } else {
            return false;
        }
    } else {
        cc.log('error:params error on remove');
        return false;
    }
}




// 适配函数 
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

//  比较两个时间戳是不是同一天
function campareTwoStamp(stamp1, stamp2) {
    console.log(new Date(stamp1 * 1000).toDateString());
    console.log(new Date(stamp2 * 1000).toDateString());
    return new Date(stamp1 * 1000).toDateString() === new Date(stamp2 * 1000).toDateString();
}

// 获得某个数据的属性
function getDataProperty(type, dataName, propName) {
    let tempData = this.getLocalData(dataName);
    if (!!tempData) {
        let index = -1;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].type === type) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            return tempData[index][propName];
        } else {
            return 0;
        }
    } else {
        cc.log(dataName, 'error:Cound not find data with this name!----getDataProperty');
    }
}

// 为完成，兼容性差，todo
function getObjectProperty(objName, propName) {
    let tempObj = this.getLocalData(objName);
    if (!!tempObj) {
        return tempObj[propName];
    } else {
        return false;
    }
}

// 数字的滚动
function numberRoll(node, addNumber, callback) {
    if (addNumber === 0) {
        return;
    }
    let label = node.getComponent(cc.Label);
    let number = parseInt(label.string);
    let quotient = Math.floor(addNumber / 20);
    let oneOfAll, len, rest = 0, isAddRest = false;
    if (quotient > 1) {
        oneOfAll = quotient;
        len = 20;
        rest = addNumber - 20 * oneOfAll;
        isAddRest = true;
    } else {
        oneOfAll = 1;
        len = addNumber;
    }

    for (let i = 0; i < len; i++) {
        this.scheduleOnce(
            function () {
                number += oneOfAll;
                if (i == len - 1 && rest > 0 && isAddRest) {
                    number += rest;
                }
                label.string = new String(number);
                if (i == len - 1 && !!callback) {
                    callback();
                }
            }, 0.05 * i
        )
    }


}



// 计算产量
function computedCurrentProduce(basic, level) {
    // console.log(basic, level);
    let produce = Math.floor(basic * (1 + FarmData.PRODUCE_RATE) ** (level - 1));
    return produce;
}

function composeFarmData() {
    let seedData = this.getLocalData('seedData');
    let landData = this.getLocalData('landData');
    let warehouseData = this.getLocalData('warehouseData');
    let localFarmInfo = this.getLocalData('localFarmInfo');
    let propsData = this.getLocalData('propsData');
    let fData = {};
    let newSeedData = this.composeList(seedData, ['type', 'number', 'level']);
    fData.seedData = newSeedData;

    let newPropsData = this.composeList(propsData, ['type', 'number']);
    fData.propsData = newPropsData;

    fData.warehouseData = warehouseData;
    fData.landData = landData;

    let farmData = {};
    farmData.fmexp = localFarmInfo.exp;
    farmData.fmlevel = localFarmInfo.level;
    // params: {coin:0, fmlevel:255, fmexp:0, fmlasttime:0(当前更新时间时间戳, 秒为单位，不能超过11位), fmdata:"jsonstring",
    farmData.coin = this.getCoins();
    farmData.fmlasttime = this.getServerTime();
    farmData.fmdata = JSON.stringify(fData);
    //农场结果：{code:0, msg:"", data:{"uid":"ididididididdid", "name":"U123", "country":255, "gid":123, "fmdata":"jsonstring", "coin":0, "fmlevel":0, "fmexp":0, "fmlasttime":0, "curtime":0}}

    return farmData;
}

// 获得一个对象数组的中对象的某几个属性，返回一个新的数组
function composeList(list, propList) {
    let newList = [];
    for (let i = 0; i < list.length; i++) {
        // newList[i][propList[0]] =
        let item = {};
        for (let j = 0; j < propList.length; j++) {
            item[propList[j]] = list[i][propList[j]];
        }
        newList.push(item);
    }

    if (newList.length > 0) {
        return newList;
    } else {
        return false;
    }
}

function updateFarmData(type, str, help) {
    let localData = cc.sys.localStorage.getItem('localData');
    let uid;
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
    //   updateFarmData: function (type, uid, params, callback) {
    let params = this.composeFarmData();
    let callback = function (res) {
        // console.log(res, res.code);
    };
    // console.log(params);
    if (type == 1) {
        ServerManager.updateFarmData(type, uid, params, callback);
    } else if (type == 2) {
        params.help = help;
        params.helplist = str;
        ServerManager.updateFarmData(type, uid, params, callback);
    }

}

function login() {
    let self = this;
    let uid;
    let localData = cc.sys.localStorage.getItem('localData');
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
    let callback = function (res) {
        // console.log(res, res.code, res.data.curtime);
        // 同步服务器时间
        self.saveServerTime(res.data.curtime);
        self.saveSyncServerTime();

    };
    ServerManager.login(3, uid, '', callback);
}

module.exports = {
    resize,
    getUTCtime,
    saveServerTime,
    saveSyncServerTime,
    getServerTime,
    checkLocalAndServerTime,
    showPromptWithScale,
    getLevel,
    getCoins,
    saveCoins,
    getWarehouseData,
    getObjectProperty,
    saveWarehouseData,
    getLocalData,
    setLocalData,
    removeLocalData,
    checkLocalData,
    campareTwoStamp,
    countdown,
    getDataProperty,
    computedCurrentProduce,
    composeFarmData,
    composeList,
    updateFarmData,
    login,
    numberRoll,
}