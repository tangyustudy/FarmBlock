const ServerManager = require('../ServerManager');
cc.Class({
    extends: cc.Component,

    properties: {
        node_container: cc.Node,
        prefab_messageItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.data = [
            { country: 1, name: 'red', level: 1, time: 1578483458 },
            { country: 3, name: 'yellow', level: 3, time: 1578485458 },
            { country: 4, name: 'green', level: 2, time: 1578483458 },
            { country: 6, name: 'TarloySwift', level: 1, time: 1578482458 },
            { country: 8, name: 'James', level: 4, time: 1578480458 },
            { country: 9, name: 'KobeBryant', level: 2, time: 1578473458 },
        ]


    },

    //  初始化当前的容器
    initMessageContainer() {
        if (this.node_container.children.length > 0) {
            this.node_container.removeAllChildren();
        }
        for (let i = 0; i < this.data.length; i++) {
            let item = cc.instantiate(this.prefab_messageItem);
            item.parent = this.node_container;
            item.getComponent('item_farm_message').initItemDeatail(this.data[i]);
        }

    },

    //  回收



    // 获得好友帮助列表
    getFriendHelpMessage() {
        let self = this;
        let localData = cc.sys.localStorage.getItem('localData');
        let uid;
        if (!localData) {
            uid = window.NativeManager.getUid();
            // console.log('localData is not exist');
        } else {
            localData = JSON.parse(localData);
            uid = localData.uid;
        }

        let callback = function (res) {
            console.log(res, '------------farmMessage-------------');
        };

        ServerManager.getHelpMessage(uid, callback);


    },



    showView() {
        this.node.active = true;
        this.fromTopToCenter(this.node);
        this.getFriendHelpMessage();
        this.initMessageContainer();
    },

    hideView() {
        // this.node.active = false;
        
        this.fromCenterToTop(this.node);
    },


    // 从上往下进入界面
    fromTopToCenter(node) {
        let windowSize = cc.view.getDesignResolutionSize();
        node.position = cc.v2(0, (windowSize.height + node.height) / 2);
        let action = cc.moveTo(0.5, cc.v2(0, 0)).easing(cc.easeBackOut(3.0));
        node.runAction(action);
        
    },

    // 从中间往上回缩
    fromCenterToTop(node) {
        // let self=this;
        let windowSize = cc.view.getDesignResolutionSize();
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, (windowSize.height + node.height) / 2)).easing(cc.easeBackIn(3.0)),
            cc.callFunc(
                function () {
                    node.active = false;
                    cc.director.farmDialog.mask.active=false;
                }
            )

        )
        node.runAction(action);
    },


    start() {
        // this.scheduleOnce(
        //     function(){
        //         this.fromTopToCenter(this.node);
        //     },1
        // )

    },

    // update (dt) {},
});
