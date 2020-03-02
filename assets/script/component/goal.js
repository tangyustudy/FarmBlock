// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require('../utils')

cc.Class({
    extends: cc.Component,

    properties: {
        nodeList:[cc.Node],
        viewList:[cc.SpriteFrame],
        hinderListView:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // 隐藏目标
    hideTargetNode(){
        for(let i=0;i<this.nodeList.length;i++){
            this.nodeList[i].active=false;
        }
    },


    updateNodeTag(list) {
        this.tContent = list;
        this.hideTargetNode();
        let gap = Utils.computedNodeGap(list.length, this.node, this.nodeList[0]);
        for (let i = 0; i < list.length; i++) {

            let node = this.nodeList[i];
            node.position = cc.v2(gap * (i + 1) + node.width * i + (node.width / 2), 0);
            node.active = true;
            let sprite = node.getChildByName('icon');
            let type = list[i][0] < 20 ? list[i][0] : list[i][0] - 20;
            if(list[i][0]<20){
                Utils.changeLocalNodeTexture(sprite, this.viewList, type);
            }else{
                if(list[i][0]==38){
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 10);
                }else if(list[i][0]==39){
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 11);
                }else if(list[i][0]==37){
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, 12);
                }else{
                    Utils.changeLocalNodeTexture(sprite, this.hinderListView, type);
                }
            }
        }
        this.updateGoalNumber(list);
    },

    // 获得当前子节点的世界坐标
    getTargetItemWorldPosition(){
        let itemList=[];
        for(let i=0;i<this.nodeList.length;i++){

            let nItem = this.nodeList[i];
            if(nItem.active){
                // console.log(nItem.position);
                let wp = nItem.parent.convertToWorldSpaceAR(nItem.position);
                let item = {};
                item.index = i;
                item.worldPos = wp;
                item.type = this.tContent[i][0];
                itemList.push(item);
            }

        }
        return itemList;
    },
    


    updateGoalNumber(list) {
        for (let i = 0; i < list.length; i++) {
            let item = this.nodeList[i];
            let number = item.getChildByName('num').getComponent(cc.Label);
            // let addIcon = item.getChildByName('addIcon');
            if (list[i][1] > 0) {
                number.string = '' + list[i][1];
                number.node.active = true;
                // addIcon.active = false;
            } else {
                number.node.active = false;
                // addIcon.active = true;
            }
        }
    },



    start () {

    },

    // update (dt) {},
});
