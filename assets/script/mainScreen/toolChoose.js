// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        screenDialog:require('screenDialog'),
        btnList: [cc.Node],
        btnView: [cc.SpriteFrame],
        btnChooseView: [cc.SpriteFrame],
        lockIcon:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.toolList = [300, 35, 4];
        this.toolNum = [0, 0, 0];
    },


    // 设置节点的tag；
    initBtnTag() {
        for (let i = 0; i < this.btnList.length; i++) {
            this.btnList[i].name = i.toString();
            // console.log(this.btnList[i]);
            // this.addEventListener(this.btnList[i]);
        }
    },


    // 更新当前游戏道具的数量

    updateGameToolNumber(list) {

        if(GameData.bestLevel<8){
            this.lockTool();
        }else{
            for (let i = 0; i < list.length; i++) {
                let item = this.btnList[i];
                let number = item.getChildByName('count').getComponent(cc.Label);
                let addIcon = item.getChildByName('addIcon');
                this.addEventListener(item);
                if (list[i] > 0) {
                    number.string = '' + list[i];
                    number.node.active = true;
                    addIcon.active = false;
                } else {
                    number.node.active = false;
                    addIcon.active = true;
                }
            }
        }
    },


    // 锁住游戏道具
    lockTool(){
        for(let i=0;i<this.btnList.length;i++){
            let item = this.btnList[i];
            let view = item.getChildByName('view');
            let addIcon = item.getChildByName('addIcon');
            let num = item.getChildByName('count');
            addIcon.active = num.active=false;
            view.getComponent(cc.Sprite).spriteFrame =  this.lockIcon;
        }
    },



    // 增加事件监听
    addEventListener(node) {
        node.on(cc.Node.EventType.TOUCH_END, this.gameToolBtnTouchEvent, this);
    },


    gameToolBtnTouchEvent(event) {
        cc.director.SoundManager.playSound('btnEffect');
        let node = event.target;
        let tag =parseInt(node.name);
        let numNode = node.getChildByName('count');
        let view = node.getChildByName('view');
        if(GameData.gameToolList[tag]>0){
            if (!!node.hasBeenChoosed) {
                view.getComponent(cc.Sprite).spriteFrame = this.btnView[tag];
                node.hasBeenChoosed = false;
                this.toolNum[tag] = 0;
                numNode.active=true;
            } else {
                view.getComponent(cc.Sprite).spriteFrame = this.btnChooseView[tag];
                node.hasBeenChoosed = true;
                this.toolNum[tag] = 1;
                numNode.active=false;
            }
            GameData.choosedList=this.toolNum;
        }else{

            let scene = cc.director.getScene();
            if(scene.name == 'gameView'){
                cc.director.dialogScript.showPlayerShop(tag,1);
            }
            if(scene.name=='mainScreen'){
                this.screenDialog.showGameToolShop(tag,1);
            }

            
        }
        
    },

    // 还原数据
    resumeData(){
    
        for(let i=0;i<this.btnList.length;i++){
            let item = this.btnList[i];
            // item.getComponent(cc.Sprite).spriteFrame = this.btnView[i];
            item.getChildByName('view').getComponent(cc.Sprite).spriteFrame = this.btnView[i];
            let numNode = item.getChildByName('count');
            if(!!item.hasBeenChoosed){
                numNode.active=false;
                item.hasBeenChoosed=false;
            }else{
                numNode.active=true;
            } ;
        }
    },


    getTooNumList(){
        return this.toolNum;
    },


    start() {
        this.initBtnTag();
        // this.updateGameToolNumber(GameData.gameToolList);
        // console.log('fuck,you');
    },

    // update (dt) {},
});
