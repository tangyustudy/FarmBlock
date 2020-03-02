// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 let Config = require('../psconfig');
 let Utils = require('../utils'); 
 let GameData = require('../gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        // glassGround:cc.Node,
        grass:cc.Prefab,
        squirrel_container:cc.Node,
        squirrel:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on('REMOVE_SINGLE_GRASS',this.removeSingleGrass,this);
        this.grassPool = new  cc.NodePool();
        this.squirrelNodeList=[];
    },

    // 初始化草地资源
    initGroundView(){
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
        this.groundList = matrixData;
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

    // 载入草地资源
    loadGrassRes(dataList){
        if(this.node.children.length>0){
            // this.node
            this.recycleGrassNode();
        }
        for(let i=0;i<dataList.length;i++){
            for(let j=0;j<dataList.length;j++){
                if(dataList[i][j]>=1){
                    let item = cc.v2(i,j);
                    this.addGrassChild(item,dataList[i][j]);
                }
            }
            
        }
    },

    // 载入松鼠石像资源
    loadSquirrelStatue(list){
        for(let i=0;i<list.length;i++){
            let item = list[i];
            let squirrel =cc.instantiate(this.squirrel);
            let script =  squirrel.getComponent('squirrel');
            script.initBearData(item);
            let position = script.comfirmBearPosition(item);
            squirrel.parent = this.squirrel_container;
            squirrel.position = position;
            this.squirrelNodeList.push(squirrel);
        }
    },

    // 将草地资源放入地图中
    addGrassChild(pos,type){
        let index = Utils.indexValue(pos.x,pos.y);
        let grass;
        if(this.grassPool.size()>0){
            grass = this.grassPool.get();
        }else{
            grass = cc.instantiate(this.grass);
        }
        grass.parent = this.node;
        grass.position =Utils.grid2Pos(pos.x,pos.y);
        let script = grass.getComponent('ground');
        script.initGroundData(type);
        this.spriteList[index] = grass;
    },

    // 回收草地节点
     recycleGrassNode(){
        let list = this.node.children;
        for(let i=list.length-1;i>=0;i--){
            if(list[i].name=='ground'){
                this.grassPool.put(list[i]);
            }else{
                list[i].removeFromParent();
            }
        }
     },

    //  移除某块小草地
     removeSingleGrass(event){
            let pos = event.pos;
            let index = Utils.indexValue(pos.x,pos.y);
            if(!!this.spriteList && this.spriteList[index]!=null){
                let grassItem = this.spriteList[index];
                let script = grassItem.getComponent('ground');
                let wp = grassItem.parent.convertToWorldSpaceAR(grassItem.position);
                if(script.bombCount>1){
                    script.bombCount--;
                    script.hitGround(); 
                    cc.systemEvent.emit('HIT_GRASS_ANIMATION',{
                        worldPos:wp,
                        index:1,
                    });
                }else{
                    cc.systemEvent.emit('HIT_GRASS_ANIMATION',{
                        worldPos:wp,
                        index:2,
                    });
                    this.grassPool.put(grassItem);
                    this.spriteList[index]=null;
                    this.groundList[pos.x][pos.y]=0;
                    this.judgeSquirrelIsHide();
                }   
            }
     },

   

    // 判断松鼠石像是否被遮挡
    judgeSquirrelIsHide(){
        let self=this;
        for(let i=0;i<this.squirrelNodeList.length;i++){
            let item = this.squirrelNodeList[i];
            let script = item.getComponent('squirrel')
            let isHide= script.judgeBearIsHide(this.groundList);
            if(!isHide){
                // console.log(i +' 这个石像已经被完全发现啦！！！！');
                let wp = this.squirrel_container.convertToWorldSpaceAR(item.position);
                this.squirrelNodeList.splice(i,1);
                // this.scheduleOnce(
                //     function(){
                item.removeFromParent();
                cc.systemEvent.emit('HINDER_SQUIRREL_ANIMATION',{
                    statue:item,
                    worldPos:wp,
                })
                    // },2
                // )
               
            }
        }
    },

    // 释放掉所有的松鼠石像
    releaseSquirreStatue(){
        if(!!this.squirrelNodeList && this.squirrelNodeList.length>0){
            while(this.squirrelNodeList.length>0){
                let item = this.squirrelNodeList.pop();
                item.removeFromParent();
            }
        }
    },

    reset(){
        this.releaseSquirreStatue();
        this.recycleGrassNode();
    },


     //  初始函数
     initFunc(list,stoneList){
         this.releaseSquirreStatue();
        this.initGroundView();
        this.loadMapRes(list,this.groundList);
        this.loadGrassRes(this.groundList);
        this.loadSquirrelStatue(stoneList);
    },


    start () {
     

    },

    // update (dt) {},
});
