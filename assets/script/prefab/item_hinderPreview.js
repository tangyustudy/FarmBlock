
cc.Class({
    extends: cc.Component,

    properties: {
        itemBg:cc.Sprite,
        itemViewList:[cc.SpriteFrame],
        index:cc.Sprite,
        indexList:[cc.SpriteFrame],
        lockNameBg:cc.Node,
        unlockNameBg:cc.Node,
        itemName:cc.Sprite,
        nameList:[cc.SpriteFrame],
        unlockLevel:cc.Sprite,
        unlockLevelList:[cc.SpriteFrame],
        hinderView:cc.Node,
        hinderViewList:[cc.SpriteFrame],
        lockLine:cc.Node,
        lockHinderView:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItemData(index,statusNum){
        this.updateIndex(index);
        this.updateNameBg(statusNum);
        this.updateHinderName(index);
        this.updateUnlockLevel(index);
        this.updateHinderView(index,statusNum);
    },

    // Item的索引
    updateIndex(index){
        // console.log(index);
        if(typeof index == 'number'){
            this.index.spriteFrame = this.indexList[index];
            // this.hinderView.getComponent(cc.Sprite).spriteFrame = this.hinderViewList[index];
        }
    },

    // 更新名字背景
    updateNameBg(statusNum){
        // 1:已解锁
        // 2:即将解锁
        // 3:未解锁
        if(statusNum==1){
            this.unlockNameBg.active=true;
            this.unlockLevel.node.active=false;
            this.lockNameBg.active=false;
            this.lockLine.active=false;
            this.itemBg.spriteFrame = this.itemViewList[0];
            this.hinderView.y -=80
        }else{ 
            
            this.unlockNameBg.active=false;
            this.lockNameBg.active=true;
            this.lockLine.active=true;
            this.itemBg.spriteFrame = this.itemViewList[1];
            
        }
    },

    comingSoon(){
        this.initItemData(11,3);
        this.unlockLevel.spriteFrame = this.unlockLevelList[11];
        this.itemName.spriteFrame = this.nameList[12];
    },



    //更新元素的名字
    updateHinderName(index){
        this.itemName.spriteFrame = this.nameList[index];
    },

    // 更新元素的视图
    updateHinderView(index,statusNum){
        if(statusNum==1){   //已经解锁
            this.hinderView.getComponent(cc.Sprite).spriteFrame = this.hinderViewList[index];
        }else if(statusNum==2){ //将要解锁 
            this.hinderView.getComponent(cc.Sprite).spriteFrame = this.hinderViewList[index];
            this.hinderView.color = new cc.Color(150,150,150);

        }else{ //未解锁
            this.hinderView.getComponent(cc.Sprite).spriteFrame =this.lockHinderView;
            this.itemName.spriteFrame = this.nameList[11];

        }
        
        
    },

    // 更新解锁等级
    updateUnlockLevel(index){
        this.unlockLevel.spriteFrame = this.unlockLevelList[index];
    },




    start () {

    },

    // update (dt) {},
});
