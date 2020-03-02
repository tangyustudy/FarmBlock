
let Utils = require('../utils');

cc.Class({
    extends: cc.Component,

    properties: {
      rank_world:cc.Node,
      rank_world_itemContainer:cc.Node,
      rank_world_myRank:cc.Node,
      rank_team:cc.Node,
      rank_team_container:cc.Node,
      rank_item:cc.Prefab,
      loadingIcon:cc.Node,
      rank_btnArea:cc.Node,
      btn_world:cc.Sprite,
      btn_team:cc.Sprite,
      worldBtnList:[cc.SpriteFrame],
      teamBtnList:[cc.SpriteFrame],
    //   countryIconList:cc.SpriteAtlas,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self=this;
        let uid = '109';
        let callback = function(res){
            console.log(res);
            if(!!res){
                self.rankData = res.world;
                self.teamData = res.team;
            }
        }
        cc.director.ServerManager.getLeaderBoardList(1,uid,callback);
    },

    // 数据加载过程中的缓冲动画
    loadingData(){
        // if(!this.loadingIcon){
        //     return ;
        // }
        // this.loadingIcon.active=true;
        // this.loadingIcon.runAction(
        //     cc.rotateBy(2,360).repeatForever()
        // );
        cc.systemEvent.emit('LOAD_TIPS_SHOW');
    },

    // 加载到数据后移除缓冲动画
    loadedData(){
        // if(!this.loadingIcon.active){
        //     return ;
        // }else{
        //     this.loadingIcon.stopAllActions();
        //     this.loadingIcon.active=false;
        // }
        cc.systemEvent.emit('LOAD_TIPS_HIDE');
    },

    
    // 初始化排行榜数据
    initRankContainer(){
        // todo 这里应该是去拉数据
        let data =this.rankData ; 
        // this.recycleRankItem();

        if(!!data && data.length>0){
            this.loadedData();
            let listData = data;
            let len = listData.length;
            for(let i=0;i<len;i++){
                let item;
                if(!this.itemPool){
                    item = cc.instantiate(this.rank_item);
                }else{
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.rank_item);
                    }
                }
                item.parent  = this.rank_world_itemContainer;
                item.getComponent('item_rank').init(i,listData[i]);
                
            }
        }else{
            // 如果没加载到数据 5秒钟之后隐藏缓冲提示
            this.scheduleOnce(function(){
                this.loadedData();
            },3);
        }
    },

    // 初始化我的数据
    initMyRankContainer(data){
        let item = cc.instantiate(this.rank_item);
        item.getComponent('item_rank').init(data,true);
        // if(this.rank_world_myRank.children.length>0){
        //     this.rank_world_myRank.removeAllChildren();
        // }
        item.parent = this.rank_world_myRank;
    },


    // 显示排行榜界面
    showView(){
        this.node.active=true;
        Utils.showPromptWithScale(this.node);
        this.loadingData();
        this.scheduleOnce(function(){
            this.initRankContainer();
            this.initMyRankContainer(this.myRankData);
            this.initTeamRank();
            this.showWorldRank();
        },2)
    },

    // 隐藏排行榜界面
    hideView(){
        this.node.active=false;
        this.recycleRankItem(this.rank_world_itemContainer);
        this.recycleRankItem(this.rank_team_container);
        this.rank_world_myRank.removeAllChildren();
        
    },

    // 回收节点
    recycleRankItem(node){
        let children = node.children;
        if(!this.itemPool){
            this.itemPool  = new cc.NodePool('item_rank');
        }
        if(children.length>0){
            let len = children.length;
            for(let i=len-1;i>=0;i--){
                let child = children[i];
                if(child.name == 'item_rank'){
                    this.itemPool.put(child);
                }else{
                    child.removeFromParent();
                } 
            }
        }
    },

    
    // 显示世界排行
    showWorldRank(){
        this.rank_world.active=true;
        this.rank_team.active = false;
        this.btn_world.spriteFrame = this.worldBtnList[0];
        this.btn_team.spriteFrame = this.teamBtnList[1];
    },


    // 显示团队排行
    showTeamRank(){
        this.rank_world.active=false;
        this.rank_team.active=true;
        this.btn_world.spriteFrame = this.worldBtnList[1];
        this.btn_team.spriteFrame = this.teamBtnList[0];
    },




    // 初始化团队排行榜
    initTeamRank(){
        let teamData = this.teamData;
        let len = teamData.length;
        if(!!teamData && teamData.length>0){
            for(let i=0;i<len;i++){

                let item;
                if(!!this.itemPool){
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.rank_item);
                    }
                }else{
                    item = cc.instantiate(this.rank_item);
                }

                item.parent = this.rank_team_container;
                item.getComponent('item_rank').init(i,teamData[i]);

            }
        }    
      

    },








    start () {
        // this.showView();
    },

    // update (dt) {},
});
