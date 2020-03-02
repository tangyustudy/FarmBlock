
let GameData = require('../gameData');
let Utils = require('../utils');
let Config = require('../psconfig');

cc.Class({
    extends: cc.Component,

    properties: {
        bubble:cc.Prefab,
        // container:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on('REMOVE_SINGLE_BUBBLE',this.removeSingleBubble,this);
        this.bubblePool = new  cc.NodePool();
    },

       // 初始化泡泡资源
    initBubbleView(){
        var matrixData = new Array(Config.matrixRow);
        let spriteList = [];
        for (var row = 0; row < Config.matrixRow; row++) {
            matrixData[row] = new Array(Config.matrixCol);
            for (var col = 0; col < Config.matrixCol; col++) {
                matrixData[row][col] =0;
                let index = Utils.indexValue(row,col);
                spriteList[index]=null;
            }
        }
        this.bubbleList = matrixData;
        this.spriteList = spriteList;
    },


      // 载入地图资源
    loadMapRes(posList,dataList){
        for(let p=0;p<posList.length;p++){
            let item = posList[p];
            let xStart = item[0][0];
            let xEnd = item[1][0];
            let yStart = item[0][1];
            let yEnd = item[1][1];
            let type = item[2];
            for(let i = xStart;i<=xEnd;i++){
                for(let j=yStart;j<=yEnd;j++){
                    if(GameData.starMatrix[i][j]==-2){
                        continue;
                    }
                    dataList[i][j]=type;
                }
            }
        }      
    },

     // 载入泡泡资源
     loadBubbleRes(dataList){
        if(this.node.children.length>0){
            // this.node
            this.recycleBubbleNode();
        }
        for(let i=0;i<dataList.length;i++){
            for(let j=0;j<dataList.length;j++){
                if(dataList[i][j]>=1){
                    let item = cc.v2(i,j);
                    this.addBubbleChild(item,dataList[i][j]);
                }
            }
            
        }
    },


    // 将气泡资源放入地图中
    addBubbleChild(pos,type){
        let index = Utils.indexValue(pos.x,pos.y);
        let bubble;
        if(this.bubblePool.size()>0){
            bubble = this.bubblePool.get();
        }else{
            bubble = cc.instantiate(this.bubble);
        }
        bubble.parent = this.node;
        bubble.position =Utils.grid2Pos(pos.x,pos.y);
        // let script = grass.getComponent('ground');
        // script.initGroundData(type);
        this.spriteList[index] = bubble;
    },


     // 回收气泡节点
     recycleBubbleNode(){
        let list = this.node.children;
        for(let i=list.length-1;i>=0;i--){
            if(list[i].name=='bubbleCube'){
                this.bubblePool.put(list[i]);
            }else{
                list[i].removeFromParent();
            }
        }
     },

     //  移除某个水泡
     removeSingleBubble(event){
        let pos = event.pos;
        let index = Utils.indexValue(pos.x,pos.y);
        if(!!this.spriteList && this.spriteList[index]!=null){
            let bubbleItem = this.spriteList[index];
            // let script = bubbleItem.getComponent('ground');
            let wp = bubbleItem.parent.convertToWorldSpaceAR(bubbleItem.position);
            // if(script.bombCount>1){
            //     script.bombCount--;
            //     script.hitGround(); 
            //     cc.systemEvent.emit('HIT_GRASS_ANIMATION',{
            //         worldPos:wp,
            //         index:1,
            //     });
            // }else{
            //     cc.systemEvent.emit('HIT_GRASS_ANIMATION',{
            //         worldPos:wp,
            //         index:2,
            //     });
                this.bubblePool.put(bubbleItem);
                this.spriteList[index]=null;
                this.bubbleList[pos.x][pos.y]=0;
                cc.director.SoundManager.playSound('cubeBubble');
                cc.systemEvent.emit('HIT_BUBBLE_ANIMATION',{
                    worldPos:wp,
                    // index:2,
                });
                cc.systemEvent.emit('NUMBER_COUNT', {
                    type: 38
                });
                // this.judgeSquirrelIsHide();
            // }   
        }
    }, 


    reset(){
        this.recycleBubbleNode();
    },

     //  初始函数
    initFunc(list){
        this.initBubbleView();
        this.loadMapRes(list,this.bubbleList);
        this.loadBubbleRes(this.bubbleList);
    },

    start () {

    },

    // update (dt) {},
});
