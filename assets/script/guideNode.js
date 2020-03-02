// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let GameData = require('./gameData');
let Utils = require('./utils');
const stepList = ['one_step', 'two_step', 'three_step', 'four_step', 'five_step', 'six_step', 'seven_step',
'eight_step','nine_step','ten_step','eleven_step','twelve_step','fourteen_step'];
const toolName = ['btn1', 'btn2', 'btn3', 'btn4'];
const offset =400;
cc.Class({
    extends: cc.Component,

    properties: {
        goal: cc.Node,
        // mask: cc.Node,
        finger: cc.Node,
        // target:cc.Node,
        wordList: cc.Sprite,
        createList: [cc.SpriteFrame],
        funcList: [cc.SpriteFrame],
        explain: cc.Node,
        superWord: cc.SpriteFrame,
        balloonWord: cc.SpriteFrame,
        nutsWord: cc.SpriteFrame,
        firstWord: cc.SpriteFrame,
        vineWord:cc.SpriteFrame,
        toolList: cc.Node,
        arrow: cc.Node,
        playerTool_explain: cc.Node,
        playerToolList: [cc.SpriteFrame],
        hinderWordList:[cc.SpriteFrame], 
        prefab_bubble:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 标记当前所在引导步骤
        this.currentStep = -1;
        cc.systemEvent.on('EXCUTE_GUIDE_STEP', this.accordingLevelShowGuide, this);
        cc.systemEvent.on('PLAYER_TOOL_GUIDE', this.guide_playerTool, this);
        cc.systemEvent.on('WINDMILL_SECOND_GUIDE', this.guideWindmill_again, this);
        cc.systemEvent.on('STATUE_SECOND_GUIDE',this.guide_thirteen,this);//todo
    },

    // 引导第一步
    guide_one() {
        let one_step = this.node.getChildByName('one_step');
        this.currentStep = 1;
        one_step.active = true;
        let goalPosition = this.node.convertToNodeSpaceAR(this.goal.parent.convertToWorldSpaceAR(this.goal.position));
        // this.mask.position = goalPosition;
        // this.mask.width = this.goal.width;
        // this.mask.height = this.goal.height + 30;
        let goal = cc.instantiate(this.goal);
        goal.parent = one_step;
        goal.position = goalPosition;
        goal.removeComponent('target');
        let node = this.node.getChildByName('one_step').getChildByName('arrow');
        node.x = this.goal.x + this.goal.width / 2;
        // node.y = this.goal.y ;
        node.scale = 1;
        // node.rotation = 180;
        node.runAction(
            cc.sequence(
                cc.scaleTo(1, 0.95),
                cc.scaleTo(1, 1.05),
            ).repeatForever()
        )
    },

    // 判断第一步引导是否结束；
    one_continue() {
        cc.director.SoundManager.playSound('btnEffect');
        this.node.getChildByName('one_step').active = false;
        cc.sys.localStorage.setItem('one_step', 'yes');
        // 唤起第二步
        this.guide_two();

    },


    // 获得可合成方块
    showClickCubeList(node, itemList, finger) {
        if (!itemList || itemList.length <= 0) {
            return;
        }
        node.active = true;
        finger.active = true;
        let container = node.getChildByName('container');
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            let index = Utils.indexValue(item.x, item.y);
            let cNode = GameData.starSprite[index];
            // console.log(node,index);
            let wp = cNode.parent.convertToWorldSpaceAR(cNode.position);
            // posList[i] = wp;
            let son = cc.instantiate(cNode);
            son.position = container.convertToNodeSpaceAR(wp);
            son.runAction(
                cc.sequence(
                    cc.scaleTo(1, 0.95),
                    cc.scaleTo(1, 1.05),
                ).repeatForever()
            )
            container.addChild(son);
            this.addTouchEvent(son);
            // console.log(this.mask);
            if (i == 1) {
                let pos = node.convertToNodeSpaceAR(wp);
                finger.position = cc.v2(pos.x + 80, pos.y - 80);
            }
        }
        this.fingerScale();
    },


    // 获得道具
    showTool(node, itemList, finger,isBubble) {
        if (!itemList || itemList.length == 0) {
            return;
        }
        node.active = true;
        finger.active = true;
        let container = node.getChildByName('container');
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            let index = Utils.indexValue(item.x, item.y);
            let cNode = GameData.starSprite[index];
            let wp = cNode.parent.convertToWorldSpaceAR(cNode.position);
            let son = cc.instantiate(cNode);
            if(!!isBubble){
                let bubble = cc.instantiate(this.prefab_bubble);
                bubble.parent = son;
            }
            son.position = container.convertToNodeSpaceAR(wp);
            son.runAction(
                cc.sequence(
                    cc.scaleTo(1, 0.95),
                    cc.scaleTo(1, 1.05),
                ).repeatForever()
            )
            container.addChild(son);
            this.addTouchEvent(son);
            if (i == 0) {
                let pos = node.convertToNodeSpaceAR(wp);
                finger.position = cc.v2(pos.x + 80, pos.y - 80);
                this.fingerScale();
            }
        }


    },


    //道具
    tool_display() {
        let toolDisplay = this.node.getChildByName('tool_display');
        this.currentStep = 4;
        let item = cc.director.container.getGameTool();
        if (!!item) {
            if (GameData.starMatrix[item.x][item.y] == 10) {
                cc.sys.localStorage.setItem('three_step', 'yes');
            }
            this.showTool(toolDisplay, [item], this.finger);
            this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.funcList[GameData.bestLevel - 1];
            this.explain.position = cc.v2(0, this.finger.y + offset);
            this.explain.active = true;
        }
    },


    // 引导第二步
    guide_two() {

        let two_step = this.node.getChildByName('two_step');
        this.currentStep = 2;
        let itemList = Utils.canRemoveList(GameData.starMatrix);
        
        this.showClickCubeList(two_step, itemList, this.finger);
        this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.firstWord;
        this.explain.position = cc.v2(0, this.finger.y + offset);
        this.explain.active = true;
    },

    guide_three() {
        let itemList = Utils.chooseRemoveList(GameData.starMatrix).pop();
        // console.log(itemList,'184');
        if (!itemList) {
            return;
        }
        let three_step = this.node.getChildByName('three_step');
        this.currentStep = 3;
        this.showClickCubeList(three_step, itemList, this.finger);
        this.explain.position = cc.v2(0, this.finger.y + offset);
        this.explain.active = true;
        this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.createList[GameData.bestLevel - 1];

    },

    guide_four() {
        let toolDisplay = this.node.getChildByName('tool_display');
      
        let itemList = Utils.judgeNearNode(GameData.starMatrix);
        if (itemList.length > 0) {
            this.currentStep = 4;
            this.showTool(toolDisplay, itemList, this.finger);
            this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.superWord;
            this.explain.position = cc.v2(0, this.finger.y + offset);
            this.explain.active = true;
            cc.sys.localStorage.setItem('four_step', 'yes');
        }

    },

    guide_five() {
        // console.log('heheheeh');
        let toolDisplay = this.node.getChildByName('tool_display');
      
        // let list  = 
        let itemList = Utils.noticeLongestList(GameData.starMatrix);
        let balloonList = Utils.getBalloonClearList(GameData.starMatrix, itemList, 21);
        let newList = [...itemList, ...balloonList];
        if ( !!balloonList && balloonList.length>0 && newList.length > 0) {
            this.currentStep = 5;
            this.showTool(toolDisplay, newList, this.finger);
            this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.balloonWord;
            this.explain.position = cc.v2(0, this.finger.y + offset + 100);
            this.explain.active = true;
            // cc.sys.localStorage.setItem('five_step', 'yes');
        }
    },

    // 坚果引导
    guide_six() {
        let toolDisplay = this.node.getChildByName('tool_display');
       
        // let list  = 
        let itemList = Utils.noticeLongestList(GameData.starMatrix);
        let nutsList = Utils.getBalloonClearList(GameData.starMatrix, itemList, 20);
        
        // let newList = [...itemList, ...nutsList];

        if (!!nutsList && nutsList.length > 0) {
            this.currentStep = 6;
            this.showTool(toolDisplay, nutsList, this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.nutsWord;
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset);
            this.finger.active=false;
            this.arrow.active=true;
            this.arrow.position = cc.v2(this.finger.x, this.finger.y + 200);
            this.arrow.scale=0.5
            this.arrow.runAction(
                cc.sequence(
                    cc.scaleTo(0.5, 0.55),
                    cc.scaleTo(0.5, 0.45),
                ).repeatForever()
            )
            this.playerTool_explain.active = true;
            // cc.sys.localStorage.setItem('five_step', 'yes');
        }
    },

    // 藤蔓引导
    guide_seven(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let vineList = Utils.getCurrentMapVineList(GameData.starMatrix);
        if(!!vineList && vineList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 7;
            this.showTool(toolDisplay,vineList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.vineWord;
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    // 箱子引导
    guide_eight(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let boxList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,25);
        if(!!boxList && boxList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 8;
            this.showTool(toolDisplay,boxList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[0];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    // 花瓣引导
    guide_nine(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let flowerList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,26);
        if(!!flowerList && flowerList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 9;
            this.showTool(toolDisplay,flowerList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[1];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    // 第一次出现风车的引导
    guide_ten(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let windmillList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,27);
        if(!!windmillList && windmillList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 10;
            this.showTool(toolDisplay,windmillList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[2];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    // 当风车被消除掉网之后的提示
     guideWindmill_again(event){
        let toolDisplay = this.node.getChildByName('tool_display');
        let windmillList = event.windmillList;
        if(!!windmillList && windmillList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 11;
            this.showTool(toolDisplay,windmillList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[3];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
     },

     guide_twelve(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let hideList = Utils.noticeLongestList(GameData.starMatrix);
        if(!!hideList && hideList.length>0){
            this.currentStep = 12;
            this.showTool(toolDisplay,hideList,this.finger);
            this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[4];
            this.explain.position = cc.v2(0, this.finger.y + offset + 100);
            this.explain.active = true;
            this.finger.active=true;
        }
    },

    guide_thirteen(){
        this.currentStep = 13;
        let toolDisplay = this.node.getChildByName('tool_display');
        toolDisplay.active=true;
        let container = toolDisplay.getChildByName('container');
        container.removeAllChildren();
        // toolDisplay.removeAllChildren();
        // let list = [cc.v2(4,4)];
        // this.showTool(toolDisplay,list,this.finger);
        this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[5];
        this.playerTool_explain.position =cc.v2(0,0);
        this.finger.active=false;
        this.playerTool_explain.active = true;
    },


    guide_fourteen(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let windmillList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,37);
        if(!!windmillList && windmillList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 14;
            this.showTool(toolDisplay,windmillList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[6];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    guide_fifteen(){
        let toolDisplay = this.node.getChildByName('tool_display');
        // let windmillList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,38);
        let hinderList = Utils.noticeLongestList(GameData.starMatrix);
        if(!!hinderList && hinderList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 15;
            this.showTool(toolDisplay,hinderList,this.finger,true);
            this.explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[7];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 100);
            this.finger.active=false;
            this.explain.active = true;
        }
    },

    guide_sixteen(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let windmillList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,39);
        if(!!windmillList && windmillList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 16;
            this.showTool(toolDisplay,windmillList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[8];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },

    guide_seventeen(){
        let toolDisplay = this.node.getChildByName('tool_display');
        let windmillList = Utils.judgeCurrentMapHinderByType(GameData.starMatrix,29); 
        console.log(windmillList,'415');
        if(!!windmillList && windmillList.length>0){
            // console.log(vineList,'258');
            this.currentStep = 17;
            this.showTool(toolDisplay,windmillList,this.finger);
            this.playerTool_explain.getChildByName('word').getComponent(cc.Sprite).spriteFrame = this.hinderWordList[9];
            this.playerTool_explain.position = cc.v2(0, this.finger.y + offset + 20);
            this.finger.active=false;
            this.playerTool_explain.active = true;
        }
    },




    // 引导玩家工具
    guide_playerTool(event) {

        let index = event.num-1;
        this.playerType = index;
        let node = this.toolList.getChildByName(toolName[index]);
        let word = this.playerTool_explain.getChildByName('word');
        word.getComponent(cc.Sprite).spriteFrame = this.playerToolList[index];
        let toolDisplay = this.node.getChildByName('tool_display');
        toolDisplay.active = true;
        this.playerTool_explain.active = true;
        this.currentStep = 4;
        let nodePos = toolDisplay.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
        let display = cc.instantiate(node);
        display.parent = toolDisplay;
        display.position = nodePos;
        display.removeComponent(cc.Widget);
        display.removeComponent(cc.Button);
        this.arrow.position = cc.v2(display.position.x, display.position.y + 170);
        this.arrow.active = true;
        // this.arrow.scale=0.6;
        this.arrow.runAction(
            cc.sequence(
                cc.scaleTo(0.5, 0.95),
                cc.scaleTo(0.5, 1.05),
            ).repeatForever()
        )
    },

    closePlayerToolGuide() {
        let toolDisplay = this.node.getChildByName('tool_display');
        toolDisplay.active = false;
        this.playerTool_explain.active = false;
        this.finger.active = false;
        if(this.currentStep==6){
            this.arrow.stopAllActions();
            this.arrow.active=false;
            cc.sys.localStorage.setItem('six_step', 'yes');
        }else if(this.currentStep==7){
            cc.sys.localStorage.setItem('seven_step', 'yes');
        }else if(this.currentStep==8){
            cc.sys.localStorage.setItem('eight_step', 'yes');
        }else if(this.currentStep==9){
            cc.sys.localStorage.setItem('nine_step', 'yes');
        }else if(this.currentStep==10){
            cc.sys.localStorage.setItem('ten_step', 'yes');
        }else if(this.currentStep==11){
            cc.sys.localStorage.setItem('eleven_step', 'yes');
        }else if(this.currentStep==13){
            cc.sys.localStorage.setItem('thirteen_step','yes');
        }else if(this.currentStep==14){
            cc.sys.localStorage.setItem('fourteen_step','yes');
        }else if(this.currentStep==16){
            cc.sys.localStorage.setItem('sixteen_step','yes');
        }else if(this.currentStep==17){
            cc.sys.localStorage.setItem('seventeen_step','yes');
        }
        else{
            cc.director.SoundManager.playSound('btnEffect');
            if (!!this.playerType) {
                cc.sys.localStorage.setItem('playerIndex' + this.playerType, 'yes');
            }
            this.arrow.stopAllActions();
            this.arrow.active = false;
        }
    },




    // 手指的缩放
    fingerScale() {

        this.finger.runAction(
            cc.sequence(
                cc.scaleTo(1, 0.9),
                cc.scaleTo(1, 1.1),
            ).repeatForever()
        )

    },

    addTouchEvent(node) {
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart(event) {

        event.target.getComponent('block').onTouchStart();
        if (this.currentStep == 2) {
            let two_step = this.node.getChildByName('two_step');
            two_step.active = false;
            this.finger.active = false;
            cc.sys.localStorage.setItem('two_step', 'yes');
            this.explain.active = false;
        }else if (this.currentStep == 3) {
            let three_step = this.node.getChildByName('three_step');
            three_step.active = false;
            this.finger.active = false;
            // cc.sys.localStorage.setItem('three_step','yes');
            let container = three_step.getChildByName('container');
            container.removeAllChildren();
            this.explain.active = false;
            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 1 });
            setTimeout(function () {
                this.tool_display();
                cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
            }.bind(this), 1500)
        }else if (this.currentStep == 4) {
            let toolDisplay = this.node.getChildByName('tool_display');
            toolDisplay.active = false;
            this.finger.active = false;
            this.explain.active = false;
        }else   if (this.currentStep == 5) {
            let toolDisplay = this.node.getChildByName('tool_display');
            toolDisplay.active = false;
            this.finger.active = false;
            this.explain.active = false;
            cc.sys.localStorage.setItem('five_step', 'yes');
        }else  if (this.currentStep == 12) {
            let toolDisplay = this.node.getChildByName('tool_display');
            toolDisplay.active = false;
            this.finger.active = false;
            // this.playerTool_explain.active = false;
            this.explain.active=false;
            cc.sys.localStorage.setItem('twelve_step', 'yes');
        }else  if (this.currentStep == 15) {
            let toolDisplay = this.node.getChildByName('tool_display');
            toolDisplay.active = false;
            this.finger.active = false;
            // this.playerTool_explain.active = false;
            this.explain.active=false;
            cc.sys.localStorage.setItem('fifteen_step', 'yes');
        }


    },

    // 查询执行到哪个引导步骤
    // checkGoWhichStep() {
    //     for (let i = 0; i < stepList.length; i++) {
    //         let step = cc.sys.localStorage.getItem(stepList[i]);
    //         if (!step) {
    //             return i;
    //         }
    //     }
    // },

    // // 开始执行引导
    // excuteGuideStep() {
    //     // console.log(num);
    //     let num = this.checkGoWhichStep() + 1;
    //     switch (num) {
    //         case 1:
    //             this.guide_one();
    //             break;
    //         case 2:
    //             this.guide_two();
    //             break;
    //         case 3:
    //             this.guide_three();
    //             break;
    //         case 4:
    //             this.guide_four();
    //             break;
    //         case 5:
    //             this.guide_five();
    //             break;
    //         case 6:
    //             this.guide_six();
    //             break;
    //         case 7:
    //             this.guide_seven();
    //             break;
    //         case 8:
    //             this.guide_eight();
    //             break;
    //         case 9:
    //             this.guide_nine();
    //             break; 
    //         case 10:
    //             this.guide_ten();
    //             break; 
    //         case 11 :
    //             // this.guide_eleven();    
    //             break;
    //         case 12 :
    //             this.guide_twelve();
    //             break;
    //     }

    // },


    // // 根据等级来显示引导 
    accordingLevelShowGuide(){
        //  藤蔓首次出现关卡 ： 15 
        //  箱子首次出现关卡 ： 24
        // 花瓣首次出现关卡 ： 34
        // 风车首次出现关卡 ： 39
        // 石像首次出现关卡 45
//         const stepList = ['one_step', 'two_step', 'three_step', 'four_step', 'five_step', 'six_step', 'seven_step',
// 'eight_step','nine_step','ten_step','eleven_step','twelve_step'];

        let level = GameData.bestLevel;
        let localRecord;
        switch(level){
            case 0 :
                localRecord = cc.sys.localStorage.getItem('one_step');
                if(!localRecord){
                    this.guide_one();
                }
                break;

            case 1 : 
                localRecord = cc.sys.localStorage.getItem('three_step');
                if(!localRecord){
                    this.guide_three();
                }
                break;

            case 2 :
                localRecord = cc.sys.localStorage.getItem('three_step');
                if(!localRecord){
                    this.guide_three();
                }
                break;

            case 3: 
                localRecord = cc.sys.localStorage.getItem('three_step');
                if(!localRecord){
                    this.guide_three();
                }
                break;
            case 4: 
                localRecord = cc.sys.localStorage.getItem('four_step');
                if(!localRecord){
                    this.guide_four();
                }
                
                break;
            case 5 :
                localRecord = cc.sys.localStorage.getItem('five_step');
                if(!localRecord){
                    this.guide_five();//气球
                }
            
                break;
            case 7 :

                localRecord = cc.sys.localStorage.getItem('eight_step');
                if(!localRecord){
                    this.guide_eight(); //箱子
                }
                break;
            case 14: 
                localRecord = cc.sys.localStorage.getItem('six_step');
                if(!localRecord){
                    this.guide_six(); //坚果
                }
                break;
            case 19 : 
                localRecord = cc.sys.localStorage.getItem('seven_step');
                if(!localRecord){
                    this.guide_seven();// 藤蔓
                }
                break;
            case 24 : 
            localRecord = cc.sys.localStorage.getItem('fourteen_step');
            if(!localRecord){
                this.guide_fourteen();// 虫子
            }
            
            break;
            case 39:
                localRecord = cc.sys.localStorage.getItem('twelve_step');
                if(!localRecord){
                    this.guide_twelve();//石像
                }
                break;
            case 59:

                localRecord = cc.sys.localStorage.getItem('ten_step');
                if(!localRecord){
                    this.guide_ten();  //风车  
                }
                break;

            case  89 :
            
                localRecord = cc.sys.localStorage.getItem('fifteen_step');
                if(!localRecord){
                    this.guide_fifteen(); // 气泡
                }  
                break;

            case  129 :

                localRecord = cc.sys.localStorage.getItem('nine_step');
                if(!localRecord){
                    this.guide_nine(); //花瓣
                }  
                break;   
            
            case  179 :

                localRecord = cc.sys.localStorage.getItem('sixteen_step');
                if(!localRecord){
                    this.guide_sixteen(); // 滚石
                }  
                break;   
            
            case  229 :

                localRecord = cc.sys.localStorage.getItem('seventeen_step');
                if(!localRecord){
                    this.guide_seventeen(); // 彩色箱子
                }  
                break;   
            

        }
    },



    start() {
        // this.guide_one();
        // this.excuteGuideStep();
        // this.finger.active=false;
        // this.guide_playerTool();
    },

    // update (dt) {},
});
