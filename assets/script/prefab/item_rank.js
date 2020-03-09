// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      bg:cc.Sprite,
      bgList:[cc.SpriteFrame],
      best:cc.Sprite,
      playerRank:cc.Label,
      headView:cc.Sprite,
      userName:cc.Label,
      starNumber:cc.Label,
      levelNumver:cc.Label,
      bestIconList:[cc.SpriteFrame],
      countryIconList:cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 初始化内容
    init(index,data,tag){
        // data.rank;
        this.updatePlayerRank(index+1);
        this.updateHeadView(data.country);
        this.updateUserName(data.name);
        this.updateStarNumber(data.star);
        this.updateLevelNumber(data.level);
        this.changeItemTexture(tag);
    },


    // 更换item的皮肤
    changeItemTexture(tag){
        if(!!tag){
            this.bg.spriteFrame = this.bgList[1];
        }
    },

     
    updatePlayerRank(rank){
        if(typeof rank =='number'){
            if(rank>3){
                this.playerRank.string = rank +'';
                this.best.node.active=false;
                this.playerRank.node.active=true;
            }else{
                this.playerRank.node.active=false;
                this.best.node.active=true;
                this.best.spriteFrame = this.bestIconList[rank-1];
            }
            
        }else{
            cc.log(rank,'error in updatePLayerRank');
        }
        
    },

    updateHeadView(index){
        this.headView.spriteFrame = this.countryIconList.getSpriteFrame('country'+ index);
    },

    updateUserName(name){
        if(typeof name =='string'){
<<<<<<< HEAD
            // console.log(name)
=======
            console.log(name)
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            this.userName.string = decodeURIComponent(name);
            // this.userName.string =name;
        }else{
            cc.log(name,'error in updateUserName');
        }
    },

    updateStarNumber(starNumber){
        if(typeof starNumber =='string'){
            this.starNumber.string = starNumber ;
        }else{
            cc.log(starNumber,'error in updateStarNumber');
        }
    },

    updateLevelNumber(levelNumver){
        if(typeof levelNumver == 'string'){
            this.levelNumver.string = levelNumver;
        }else{
            cc.log(levelNumver,'error in updateLevelNumber');
        }
    },

    unuse(){
        // this.bg.spriteFrame = this.bgList[0];
    },

    reuse(){

    },


    start () {

    },

    // update (dt) {},
});
