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
        expItem: cc.Prefab,
        cropItem: cc.Prefab,
        coinsNode: cc.Node,

        coinsItem: cc.Prefab,
        land: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.positionList = {
            targetUrl1: 'Canvas/UiNode/header/levelNode',
            targetUrl2: 'Canvas/UiNode/btnArea/warehouse',
            targetUrl3: 'Canvas/UiNode/btnArea/plant',
        };

        cc.systemEvent.on('START_TO_END', this.fromStartToTarget, this);
        cc.systemEvent.on('OBTAIN_CROPS', this.obtainCrops, this);
        cc.systemEvent.on('OBTAIN_COINS', this.obtainCoinsAnimation, this);
        cc.systemEvent.on('ANIMA_LAND_UNLOCK', this.landUnlockAnimation, this);
        cc.systemEvent.on('OBTAIN_SEED', this.unlockPlantSeedReward, this);

        this.expPool = new cc.NodePool();
        this.cropPool = new cc.NodePool();
    },


    initPool() {
        let item = cc.instantiate(this.expItem);
        for (let i = 0; i < 10; i++) {
            this.expPool.put(item);
        }

        let item1 = cc.instantiate(this.cropItem);
        for (let j = 0; j < 10; j++) {
            this.cropPool.put(item1);
        }
    },



    // 经验

    fromStartToTarget(event) {
        let self = this;
        let item;
        if (this.expPool.size() > 0) {
            item = this.expPool.get();
        } else {
            item = cc.instantiate(this.expItem);
        }
        let startPos = event.worldPos;
        let number = event.num;
        let exp = event.exp;
        let coins = event.coins;
        let end = cc.find(this.positionList['targetUrl1']);
        let endWp = end.parent.convertToWorldSpaceAR(end.position);
        let nodeStart = this.node.convertToNodeSpaceAR(startPos);
        let nodeEnd = this.node.convertToNodeSpaceAR(endWp);
        item.position = nodeStart;
        item.parent = this.node
        item.getComponent('expItem').updateExpNumber(exp);
        let distance = nodeEnd.sub(nodeStart).mag();
        let speed = 900;
        let t = distance / speed;
        let action = cc.sequence(
            cc.moveTo(t, nodeEnd).easing(cc.easeIn(2.0)),
            cc.callFunc(function () {
                self.expPool.put(item);
                cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: number, islevelUp: event.islevelUp, coins: coins });
                cc.director.SoundManager.playSound('farm_reap_exp');
            })
        );
        item.stopAllActions();
        item.runAction(action);
    },


    // 收成
    obtainCrops(event) {
        // console.log(event.data,'80');
        let self = this;
        let item;
        if (this.cropPool.size() > 0) {
            item = this.cropPool.get();
        } else {
            item = cc.instantiate(this.cropItem);
        }
        let startPos = event.worldPos;
        // let number = event.data.num;
        let end = cc.find(this.positionList['targetUrl2']);
        console.log(end.position, event.data);
        let endWp = end.parent.convertToWorldSpaceAR(end.position);
        let nodeStart = this.node.convertToNodeSpaceAR(startPos);
        let nodeEnd = this.node.convertToNodeSpaceAR(endWp);
        item.position = nodeStart;
        item.parent = this.node;
        item.getComponent('cropItem').updateDetail(event.data);
        let distance = nodeEnd.sub(nodeStart).mag();
        let speed = 600;
        let t = distance / speed;
        let action = cc.sequence(
            cc.moveTo(0.5, cc.v2(nodeStart.x, nodeStart.y + 100)),
            cc.delayTime(0.2),
            cc.moveTo(t, nodeEnd).easing(cc.easeIn(3.0)),
            cc.callFunc(function () {
                self.cropPool.put(item);
                end.runAction(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.1),
                        cc.scaleTo(0.2, 0.9),
                        cc.scaleTo(0.2, 1)
                    )
                )

                cc.director.SoundManager.playSound('farm_reap_vagetable');

                // cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: number });
            })
        );
        item.stopAllActions();
        item.runAction(action);

    },


    // 解锁新植物时的种子奖励
    unlockPlantSeedReward(event) {
        let self = this;
        let item;
        if (this.cropPool.size() > 0) {
            item = this.cropPool.get();
        } else {
            item = cc.instantiate(this.cropItem);
        }
        let startPos = event.worldPos;
        let end = cc.find(this.positionList['targetUrl3']);
        // console.log(end, 153);
        let endWp = end.parent.convertToWorldSpaceAR(end.position);
        let nodeStart = this.node.convertToNodeSpaceAR(startPos);
        let nodeEnd = this.node.convertToNodeSpaceAR(endWp);
        item.position = nodeStart;
        item.parent = this.node;
        item.getComponent('cropItem').updateDetail(event.data);
        let distance = nodeEnd.sub(nodeStart).mag();
        let speed = 600;
        let t = distance / speed;
        let action = cc.sequence(
            cc.moveTo(t, nodeEnd).easing(cc.easeIn(3.0)),
            cc.callFunc(function () {
                self.cropPool.put(item);
                cc.systemEvent.emit('UPDATE_SEED', { data: { mode: 1, type: event.data.type, number: event.data.number } });
                end.runAction(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.1),
                        cc.scaleTo(0.2, 0.9),
                        cc.scaleTo(0.2, 1)
                    )
                )

                cc.director.SoundManager.playSound('farm_reap_vagetable');

                // cc.systemEvent.emit('UPDATE_FARM_PROGRESS', { num: number });
            })
        );
        item.stopAllActions();
        item.runAction(action);
    },



    // 获得金币的动画
    obtainCoinsAnimation(event) {
        console.log(event, 'farm animaLayer');
        let item_coin = cc.instantiate(this.coinsItem);
        let label = item_coin.getComponent(cc.Label);
        label.string = '.' + event.coin;
        // let startPos = cc.v2(0, 0);
        let end = this.coinsNode.parent.convertToWorldSpaceAR(this.coinsNode.position);
        let endPos = this.node.convertToNodeSpaceAR(end);
        let action = cc.sequence(
            cc.moveTo(1, endPos).easing(cc.easeIn(3.0)),
            cc.callFunc(
                function () {
                    // console.log(event, 'heheheheh');
                    cc.systemEvent.emit('ADD_COINS', event.coin);
                    // cc.systemEvent.emit('UPDATE_FARM_COINS');
                    item_coin.removeFromParent();
                }
            )
        )
        item_coin.parent = this.node;
        item_coin.runAction(action);
    },


    // 土块飞到解锁土地，并完成解锁
    landUnlockAnimation(event) {
        let targetPos = this.node.convertToNodeSpaceAR(event.worldPos);
        let changeNode = cc.director.FarmManager.landContainer.children[event.index];
        let land = cc.instantiate(this.land);
        land.parent = this.node;
        land.active = true;
        let action = cc.sequence(
            cc.spawn(
                cc.moveTo(0.5, targetPos),
                cc.scaleTo(0.5, 0.5),
            ),
            cc.callFunc(
                function () {
                    land.removeFromParent();
                    changeNode.getComponent('groundLand').displayLandStatue(3, false);
                    // cc.systemEvent.emit('SHOW_PLANT_UNLOCK', { type: 8 - event.index });
                }
            )
        );
        land.runAction(action);

    },

    //  经验飞到





    start() {

    },

    // update (dt) {},
});
