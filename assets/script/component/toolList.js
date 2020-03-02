
let GameData = require('../gameData');

const unlockList = [1, 5, 10, 15];

cc.Class({
    extends: cc.Component,

    properties: {
        btn1: cc.Node,
        btn2: cc.Node,
        btn3: cc.Node,
        btn4: cc.Node,
        // shooter:cc.Node,
        // btn_1_buy:cc.Node,
        // btn_2_buy:cc.Node,
        // btn_3_buy:cc.Node,
        // btn_4_buy:cc.Node,
        lockList: [cc.SpriteFrame],
        unlockList: [cc.SpriteFrame],
        lockIcon:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.toolCost = [40, 35, 25, 15];
        // this.toolUnlockList=[1,5,10,15];
        this.focusIndex = -1;
        cc.director.changeList = [];
        cc.systemEvent.on('CLEAR_BTN', this.clearBtnFocusEffect, this);
        cc.systemEvent.on('UPDATE_TOOL', this.updateToolCountDisplay, this);
        cc.systemEvent.on('BUY_TOOL', this.buyTool, this);
        cc.systemEvent.on('UPDATE_STATUS', this.loadBtnstatu, this);
        cc.systemEvent.on('LIMITED_BTN', this.limitedUnlockTool, this);
        // this.shooterScript = this.shooter.getComponent('shooter'); 
        cc.systemEvent.on('JUDGELEVEL', this.judgeLevel, this);

        this.initBtnName();
    },

    // 给节点编号
    initBtnName() {
        this.btn1.name = 'btn1';
        this.btn2.name = 'btn2';
        this.btn3.name = 'btn3';
        this.btn4.name = 'btn4';
    },

    // 改变道具的价格
    updateToolCost(type) {
        let name = 'btn' + type;
        let node = this.node.getChildByName(name).getChildByName('priceNode');
        let scoreLabel = node.getChildByName('price').getComponent(cc.Label);
        scoreLabel.string = '' + this.toolCost[type - 1];
    },

    // 锁住、禁用状态
    updateToolBtnStatus(type, statu) {
        let name = 'btn' + type;
        let node = this.node.getChildByName(name);
        node.getComponent(cc.Button).interactable = false;
        if (statu == 1) {
            node.getComponent(cc.Sprite).spriteFrame = this.lockList[type - 1];
        } else {
            node.getComponent(cc.Sprite).spriteFrame = this.lockList[4];
        }
    },

    // 解锁状态
    unlockToolbtn(type) {
        let name = 'btn' + type;
        let node = this.node.getChildByName(name);
        node.getComponent(cc.Button).interactable = true;
        node.getComponent(cc.Sprite).spriteFrame = this.unlockList[type - 1];
    },


    // 初始化道具的展示
    initToolDisplay() {
        for (let i = 1; i < 5; i++) {
            cc.systemEvent.emit('UPDATE_TOOL', {
                type: i,
            })
            // this.updateToolCost(i);
            // this.updateToolBtnStatus(i,2);
        }
    },


    // 改变可使用的道具数量
    updateToolCountDisplay(event) {
        // let data = e.detail;
        // console.log(event);
        let data = event;
        let name = 'btn' + (data.type);
        let eNumber = !!event.number ? event.number : 1;
        // console.log(this.node);
        let node = this.node.getChildByName(name);
        let child_label = node.getChildByName('number').getComponent(cc.Label);
        if (data.statuCode == 1) {
            GameData.game_prop[data.type - 1].number += eNumber;
        }

        if (data.statuCode == 2) {
            GameData.game_prop[data.type - 1].number -= eNumber;
        }
        //显示道具的数量
        child_label.string = '' + GameData.game_prop[data.type - 1].number;
        // 刷新金币的数量
        let addIcon = node.getChildByName('addIcon');
        if (GameData.game_prop[data.type - 1].number <= 0) {
            addIcon.active = true;
            // node.getComponent(cc.Button).interactable=false;
            child_label.node.active = false;
        } else {
            // node.getComponent(cc.Button).interactable=true;
            addIcon.active = false;
            child_label.node.active = true;
        }

        // cc.systemEvent.emit('UPDATE_COINS');
        if (data.statuCode != 3) {
            GameData.storeGameData();
        }
    },

    // 购买道具
    buyTool(e) {
        let type = e.detail.type;
        // cc.director.SoundManager.playSound('btn');
        if (GameData.starCount >= this.toolCost[type - 1]) {
            GameData.starCount -= this.toolCost[type - 1];
            GameData.storeGameData();
        } else {
            // cc.director.dialogScript.showVideoDialog();
        }
    },

    buy_1() {
        this.buyTool(1);
    },

    buy_2() {
        this.buyTool(2);
    },
    buy_3() {
        this.buyTool(3);
    },
    buy_4() {
        this.buyTool(4);
    },


    // 按钮1 消除整行
    btn1Event(event) {
        cc.director.SoundManager.playSound('btnEffect');
        const index = 1;
        // if(this.focusIndex!=index){
        //     if(this.focusIndex!=-1){
        //         this.clearBtnFocusEffect();

        //     }
        //     this.focusIndex = index;
        //     this.onFocusEffect(this.btn1);
        //     cc.director.toolType=index;
        // }else{
        //     this.clearBtnFocusEffect();
        // }

        // cc.director.SoundManager.playSound('btn');
        // if(GameData.game_prop[index-1].number>0){
        //     // this.updateToolCountDisplay(1,2);
        //     cc.systemEvent.emit('UPDATE_TOOL',{
        //         type:index,
        //         statuCode:2
        //     })
        //     cc.director.numberScript.removeLastLine();
        //     this.clearBtnFocusEffect();
        // }else{
        // if(GameData.starCount>=this.toolCost[index-1]){
        //     // this.buyTool(index);
        //     cc.systemEvent.emit('BUY_TOOL',{
        //         type:index
        //     })
        //     // cc.systemEvent.emit('UPDATE_TOOL',{
        //     //     type:index,
        //     //     statuCode:2
        //     // })
        //     cc.director.numberScript.removeLastLine();
        //     this.clearBtnFocusEffect();
        // }else{
        //     cc.director.dialogScript.showVideoDialog();
        // }
        // console.log('弹出看视频界面');
        // }   

        let node = event.target;
        let wp = node.parent.convertToWorldSpaceAR(node);

        if (GameData.game_prop[index - 1].number > 0) {
            // this.buyTool(index);
            // cc.systemEvent.emit('TOOL_EXPLAIN_IN',{index});
            if (this.focusIndex != index) {
                if (this.focusIndex != -1) {
                    this.clearBtnFocusEffect();
                    // cc.director.toolType=-1;
                }
                this.focusIndex = index;
                this.onFocusEffect(this.btn1);
                cc.director.toolType = index;
                cc.systemEvent.emit('FUNCTION_EXPLAIN_ON', {
                    type: index - 1,
                    itemPos: wp
                });
            } else {
                this.clearBtnFocusEffect();
                // cc.director.toolType=-1;
            }
        } else {
            // cc.director.dialogScript.showVideoDialog();
            cc.director.dialogScript.showPlayerShop(index, 2);
        }



    },
    // 按钮2 消除整列
    btn2Event(event) {
        const index = 2;
        cc.director.SoundManager.playSound('btnEffect');

        // cc.director.SoundManager.playSound('btn');
        // if(GameData.game_prop[index-1].number>0){
        //     if(this.focusIndex!=index){
        //         if(this.focusIndex!=-1){
        //             this.clearBtnFocusEffect();
        //             // cc.director.toolType=-1;
        //         }
        //         this.focusIndex = index;
        //         this.onFocusEffect(this.btn2);
        //         cc.director.toolType=index;
        //     }else{
        //         this.clearBtnFocusEffect();
        //         // cc.director.toolType=-1;
        //     }
        // }else{
        let node = event.target;
        let wp = node.parent.convertToWorldSpaceAR(node);

        if (GameData.game_prop[index - 1].number > 0) {
            // this.buyTool(index);
            // cc.systemEvent.emit('TOOL_EXPLAIN_IN',{index});
            if (this.focusIndex != index) {
                if (this.focusIndex != -1) {
                    this.clearBtnFocusEffect();
                    // cc.director.toolType=-1;
                }
                this.focusIndex = index;
                this.onFocusEffect(this.btn2);
                cc.director.toolType = index;
                cc.systemEvent.emit('FUNCTION_EXPLAIN_ON', {
                    type: index - 1,
                    itemPos: wp
                });
            } else {
                this.clearBtnFocusEffect();
                // cc.director.toolType=-1;
            }
        } else {
            // cc.director.dialogScript.showVideoDialog();
            cc.director.dialogScript.showPlayerShop(index, 2);
        }


        // }

        // console.log('按钮2');

    },
    // 按钮3 消除单个
    btn3Event(event) {
        const index = 3;
        cc.director.SoundManager.playSound('btnEffect');
        // cc.director.SoundManager.playSound('btn');
        // if(GameData.game_prop[index-1].number>0){

        let node = event.target;
        let wp = node.parent.convertToWorldSpaceAR(node);

        // }else{
        if (GameData.game_prop[index - 1].number > 0) {
            // this.buyTool(index);
            // cc.systemEvent.emit('TOOL_EXPLAIN_IN',{index});
            if (this.focusIndex != index) {
                if (this.focusIndex != -1) {
                    this.clearBtnFocusEffect();
                    // cc.director.toolType=-1;

                }
                this.focusIndex = index;
                this.onFocusEffect(this.btn3);
                cc.director.toolType = index;
                cc.systemEvent.emit('FUNCTION_EXPLAIN_ON', {
                    type: index - 1,
                    itemPos: wp
                });
            } else {
                this.clearBtnFocusEffect();
                // cc.director.toolType=-1;
            }
        } else {
            // cc.director.dialogScript.showVideoDialog();
            cc.director.dialogScript.showPlayerShop(index, 2);
        }
        // }
        // console.log('按钮3');

    },
    // 按钮4 万能砖块
    btn4Event(event) {
        const index = 4;
        cc.director.SoundManager.playSound('btnEffect');

        // cc.director.SoundManager.playSound('btn');
        // if(this.focusIndex!=index){
        //     if(this.focusIndex!=-1){
        //         this.clearBtnFocusEffect();
        //         // cc.director.toolType=-1;
        //     }
        //     this.focusIndex = index;
        //     this.onFocusEffect(this.btn4);
        //     cc.director.toolType=index;
        // }else{
        //     this.clearBtnFocusEffect();
        //     // cc.director.toolType=-1;
        // }
        // // console.log('按钮4');
        // cc.systemEvent.emit('PAUSE_GAME');
        // if(GameData.game_prop[index-1].number>0){
        //     this.shooterScript.initMoveStonePosition(true);
        //     cc.systemEvent.emit('UPDATE_TOOL',{
        //         type:index,
        //         statuCode:2
        //     });
        // }else{
        // if(GameData.starCount>=this.toolCost[index-1]){
        //     // this.buyTool(index);
        //     cc.systemEvent.emit('BUY_TOOL',{
        //         type:index
        //     })
        //     this.shooterScript.initMoveStonePosition(true);
        //     // cc.systemEvent.emit('UPDATE_TOOL',{
        //     //     type:index,
        //     //     statuCode:2
        //     // });
        // }else{
        //     cc.director.dialogScript.showVideoDialog();
        // }
        // }
        let node = event.target;
        let wp = node.parent.convertToWorldSpaceAR(node);

        if (GameData.game_prop[index - 1].number > 0) {
            // this.buyTool(index);
            // cc.systemEvent.emit('TOOL_EXPLAIN_IN',{index});
            if (this.focusIndex != index) {
                if (this.focusIndex != -1) {
                    this.clearBtnFocusEffect();
                    // cc.director.toolType=-1;
                }
                this.focusIndex = index;
                this.onFocusEffect(this.btn4);
                cc.director.toolType = index;
                cc.systemEvent.emit('FUNCTION_EXPLAIN_ON', {
                    type: index - 1,
                    itemPos: wp
                });
            } else {
                this.clearBtnFocusEffect();
                // cc.director.toolType=-1;
            }
        } else {
            // cc.director.dialogScript.showVideoDialog();
            cc.director.dialogScript.showPlayerShop(index, 2);
        }

    },


    // 按钮点击后选中效果
    onFocusEffect(node) {
        let action = cc.sequence(
            cc.scaleTo(0.5, 0.9),
            cc.scaleTo(0.5, 1),
        ).repeatForever();
        action.tag = 1;
        node.runAction(action);

    },


    // 移除所有按钮的选中效果
    clearBtnFocusEffect() {

        // if(this.focusIndex!=-1){
        let children = this.node.children;
        if (this.focusIndex - 1 >= 0) {
            children[this.focusIndex - 1].stopActionByTag(1);
            children[this.focusIndex - 1].scale = 1;
            this.focusIndex = -1;
            cc.director.toolType = -1;
        }

        // }
    },

    // 判断是否已经解锁
    getUnlockBtnList(level) {
        let type;
        let list = [];
        for (let i = 0; i < unlockList.length; i++) {
            if (level >= unlockList[i]) {
                type = i + 1;
                list.push(type);
            }
        }
        // console.log(list);
        return list;
    },

    //加载时读取当前按钮的状态
    loadBtnstatu() {
        let data = GameData.getGameData();
        let list = this.getUnlockBtnList(data.bestLevel);
        for (let i = 0; i < list.length; i++) {
            this.unlockToolbtn(list[i]);
        }
    },

    // 限制已解锁道具不能使用
    limitedUnlockTool() {
        let data = GameData.getGameData();
        // let l = data.bestLevel<100 ? data.bestLevel+1 : 100;
        let list = this.getUnlockBtnList(data.bestLevel);
        for (let i = 0; i < list.length; i++) {
            this.updateToolBtnStatus(list[i], 1);
        }
    },



    // 锁住所有的玩家道具
    lockedAllPlayerTool() {
        for (let i = 1; i < 5; i++) {
            let name = 'btn' + i;
            let item = this.node.getChildByName(name);
            item.getChildByName('number').active = false;
            item.getComponent(cc.Button).interactable = false;
            item.getComponent(cc.Sprite).spriteFrame = this.lockIcon;
            item.getChildByName('lockLevel').active=true;
        }
    },

    // 根据等级解锁玩家道具
    unlockPlayerTool() {
        const nameList = ['btn1','btn2','btn3','btn4'];
        if(GameData.bestLevel<41){
          
            for(let i=0;i<nameList.length;i++){
                let name = nameList[i];
                let record = cc.sys.localStorage.getItem(name);
                if(!!record){
                    this.changeBtnStatus(i+1);
                }
            }
        }else{
          
            for(let i=0;i<nameList.length;i++){
                let name = nameList[i];
                let item = this.node.getChildByName(name);
                item.getChildByName('number').active = true;
                item.getComponent(cc.Button).interactable = true;
                item.getComponent(cc.Sprite).spriteFrame = this.unlockList[i];
                item.getChildByName('lockLevel').active=false;

                cc.systemEvent.emit('UPDATE_TOOL', {
                    type: i+1,
                });
            
            }
        }

      

    },

    //  改变玩家道具按钮的状态
    changeBtnStatus(num) {
        let name = 'btn' + num;
        let item = this.node.getChildByName(name);
        let record = cc.sys.localStorage.getItem(name);
        if (!!record) {
            item.getChildByName('number').active = true;
            item.getComponent(cc.Button).interactable = true;
            item.getComponent(cc.Sprite).spriteFrame = this.unlockList[num-1];
            item.getChildByName('lockLevel').active=false;
            cc.systemEvent.emit('UPDATE_TOOL', {
                type: num,
            });
        }

    },

    // 判断是否弹出道具介绍
    judgeEjectToolIntroduce(num) {
        let name = 'btn' + num;
        let record = cc.sys.localStorage.getItem(name);
        let item = this.node.getChildByName(name);
        if (!record) {

            let worldPos = item.parent.convertToWorldSpaceAR(item.position);
            cc.systemEvent.emit('PLAYER_TOOL_ANIMATION', { pos: worldPos, num: num });
            cc.sys.localStorage.setItem(name, 'yes');

        }
    },


    judgeLevel() {

        // if(GameData.bestLevel<40){}

        if (GameData.bestLevel == 9) {
            this.judgeEjectToolIntroduce(1);
        }else   if (GameData.bestLevel == 20) {
            this.judgeEjectToolIntroduce(2);
        }else if (GameData.bestLevel == 30) {
            this.judgeEjectToolIntroduce(3);
        }else if (GameData.bestLevel == 40) {
            this.judgeEjectToolIntroduce(4);
        }
      
    },



    // 解锁玩家道具动画
    start() {

        this.lockedAllPlayerTool();
        this.unlockPlayerTool();

        // this.initToolDisplay();
        // this.isToolUnlocked(10);
        // this.loadBtnstatu();
    },

    // update (dt) {},
});
