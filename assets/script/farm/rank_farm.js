
cc.Class({
    extends: cc.Component,

    properties: {
        node_worldContainer: cc.Node,
        node_teamContainer: cc.Node,
        myRankArea: cc.Node,
        item_rank_farm: cc.Prefab,
        node_worldRank: cc.Node,
        node_teamRank: cc.Node,
        btn_world: cc.Node,
        btn_team: cc.Node,
        btn_world_viewList: [cc.SpriteFrame],
        btn_team_viewList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // 初始化世界排行榜
    addChildToContainer(data, node) {
        // let data = this.worldList;
        for (let i = 0; i < data.length; i++) {
            let item;
            if (!!this.itemPool) {
                if (this.itemPool.size() > 0) {
                    item = this.itemPool.get();
                } else {
                    item = cc.instantiate(this.item_rank_farm);
                }
            } else {
                item = cc.instantiate(this.item_rank_farm);
            }
            item.parent = node;
            data[i].index = i;
            item.getComponent('item_farm_rank').initItemDetail(data[i]);
        }
    },


    // 初始化世界排行榜
    initWorldLeaderboard() {
        let data = this.worldList;
        this.addChildToContainer(data, this.node_worldContainer);

    },

    // 初始化团队排行榜
    initTeamLeaderboard() {
        let data = this.teamList;
        this.addChildToContainer(data, this.node_teamContainer);
    },


    addChildToMyRank() {
        let item;
        if (!!this.itemPool) {
            if (this.itemPool.size() > 0) {
                item = this.itemPool.get();
            } else {
                item = cc.instantiate(this.item_rank_farm);
            }
        } else {
            item = cc.instantiate(this.item_rank_farm);
        }
        item.parent = this.myRankArea;
    },

    // 显示世界列表
    showWorldRank() {
        this.node_worldRank.active = true;
        this.node_teamRank.active = false;
        this.btn_world.getComponent(cc.Sprite).spriteFrame = this.btn_world_viewList[0];
        this.btn_team.getComponent(cc.Sprite).spriteFrame = this.btn_team_viewList[1];
        cc.director.SoundManager.playSound('farm_btn');

    },


    // 显示好友列表
    showTeamRank() {
        this.node_worldRank.active = false;
        this.node_teamRank.active = true;
        this.btn_world.getComponent(cc.Sprite).spriteFrame = this.btn_world_viewList[1];
        this.btn_team.getComponent(cc.Sprite).spriteFrame = this.btn_team_viewList[0];
        cc.director.SoundManager.playSound('farm_btn');
    },


    start() {

    },

    // 回收节点
    recycleRankItem(node) {
        let children = node.children;
        if (!this.itemPool) {
            this.itemPool = new cc.NodePool('item_rank');
        }
        if (children.length > 0) {
            let len = children.length;
            for (let i = len - 1; i >= 0; i--) {
                let child = children[i];
                if (child.name == 'item_rank') {
                    this.itemPool.put(child);
                } else {
                    child.removeFromParent();
                }
            }
        }
    },


    hideView() {
        this.node.active = false;
        this.recycleRankItem(this.node_worldContainer);
        // this.recycleRankItem(this.myRankArea);
        this.recycleRankItem(this.node_teamContainer);
        cc.systemEvent.emit('HIDE_CACHE_ANIMA');
    },

    showView() {
        this.node.active = true;
        this.showPromptWithScale(this.node);
        // this.scheduleOnce(function(){
            //     cc.systemEvent.emit('SHOW_CACHE_ANIMA');
            // },0.4);
            // 从服务器拿数据
        this.getRankData();
      
        this.scheduleOnce(function () {
            cc.systemEvent.emit('HIDE_CACHE_ANIMA');
            this.initWorldLeaderboard();
            this.initTeamLeaderboard();
        }, 3)
        // this.addChildToMyRank();
        this.showWorldRank();

    },


    showPromptWithScale(node) {
        node.scale = 0.2;
        let action = cc.sequence(
            cc.scaleTo(0.3, 1).easing(cc.easeBackOut(3)),
            cc.callFunc(function () {
                cc.systemEvent.emit('SHOW_CACHE_ANIMA');
            })
        )
        node.runAction(action);
    },

    getRankData() {
        let self = this;
        let type = 2;
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
            console.log(res);
            self.worldList = res.world;
            self.teamList = res.team;
        };
        cc.director.ServerManager.getLeaderBoardList(type, uid, callback);
    }


    // update (dt) {},
});
