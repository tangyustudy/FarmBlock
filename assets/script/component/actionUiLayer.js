// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils =  require('../utils');
let GameData = require('../gameData');
let Config = require('../psconfig');
const statueLimitedLevel = 39;
cc.Class({
    extends: cc.Component,

    properties: {
        target:require('./target'),
        listTool:require('./toolList'),
        pinePrefab:cc.Prefab,
        hammerPrefab:cc.Prefab,
        boxing:cc.Prefab,
        fork:cc.Prefab,
        toolList:[cc.Node],
        stepTips:cc.Node,
        header:cc.Node,
        tool:cc.Node,
        toolView:[cc.SpriteFrame],
        fire:cc.Prefab,
        item_target:cc.Prefab,
        targetList:[cc.SpriteFrame],
        evaluation:cc.Prefab,
        evaluationList:[cc.SpriteFrame],
        shuffleTips:cc.Node,
        toolItem:cc.Prefab,
        coinsNumber:cc.Node,
        flower_example:cc.Node,
        grassBreak:cc.Prefab,
        bubbleBreak:cc.Prefab,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pinePool = new cc.NodePool();
        for(let i=0;i<5;i++){
            let pineCone= cc.instantiate(this.pinePrefab);
            this.pinePool.put(pineCone);
        }

        this.evaluatePool = new cc.NodePool();
        for(let j=0;j<5;j++){
            let evaluateNode = cc.instantiate(this.evaluation);
            this.evaluatePool.put(evaluateNode);
        }

        this.grassPool = new cc.NodePool();
        for(let k=0; k<10; k++){
            let grassAnima = cc.instantiate(this.grassBreak);
            this.grassPool.put(grassAnima);
        };

        this.bubblePool = new cc.NodePool();

        cc.systemEvent.on('PINECONE',this.PineConeCollectEffect,this);
        cc.systemEvent.on('TOOL_TRANS_EFFECT',this.toolTransiteAnimation,this);
        cc.systemEvent.on('FIVE_STEP_TIPS',this.fiveStepTips,this);
        cc.systemEvent.on('PLAYER_TOOL_ANIMATION',this.playerToolUnlockAnima,this);
        cc.systemEvent.on('MOVE_ADD',this.movesAdd,this);
        cc.systemEvent.on('NOTICE_TARGET',this.noticeGameTarget,this);  
        cc.systemEvent.on('AFTER_BUY_PLAYERTOOL',this.animationAfterPlayerBuyPlayerTool,this);
        cc.systemEvent.on('OPERATION_EVALUATE',this.EvaluatePlayerOperation,this);
        cc.systemEvent.on('SHUFFLE_TIPS',this.shuffleEffectTips,this);
        cc.systemEvent.on('GAMEVIEW_COINS_OBTAIN',this.addCoins,this);
        cc.systemEvent.on('HINDER_SQUIRREL_ANIMATION',this.hinderSquirrelAnimation,this);
        cc.systemEvent.on('HINDER_FLOWER_ANIMATION',this.hinderFlowerAnimaiton,this);
        cc.systemEvent.on('HIT_GRASS_ANIMATION',this.hitGroundGrassAnimation,this);
        cc.systemEvent.on('HIT_BUBBLE_ANIMATION',this.hitCubesBubbleAnimation,this);
        cc.systemEvent.on('REDUCE_COINS_ANIMATION',this.coinsReduceAnimation,this);

        // this.starPool = new cc.NodePool();
        // for(let i=0;i<5;i++){
        //     let star = cc.instantiate(this.boom_star);
        //     this.starPool.put(star);
        // } 

    },

    
    /**
     * 
     * @param {*} event
     *   100 一个标记数字 
     */

    PineConeCollectEffect(event){


        let self=this;
        let pos = event.worldPosition;
        // console.log(pos);
        let pineCone ;
        if(this.pinePool.size()>0){
            pineCone = this.pinePool.get();
        }else{
            pineCone = cc.instantiate(this.pinePrefab);
        }
        let localPos = this.node.convertToNodeSpaceAR(pos);
        pineCone.parent = this.node;
        pineCone.position = localPos;
        let targetPos =  this.target.getTargetIconWolrdPosition(20);
        if(!targetPos){
            return ;
        }
        let localTargetPos =  this.node.convertToNodeSpaceAR(targetPos);
        // console.log(localTargetPos,'action 47');
        // cc.director.needWait=true;
        let action = 
        cc.sequence(
            cc.spawn(
                cc.moveBy(0.5,cc.v2(0,-50)),
                cc.scaleTo(0.5,1.1),
            ),
            cc.spawn(
                cc.moveTo(1,localTargetPos), 
                cc.scaleTo(1,0.8),
            ),  
            cc.callFunc(function(){
                self.pinePool.put(pineCone);
                cc.systemEvent.emit('NUMBER_COUNT', {
                    type: 20
                });
                if(event.isLast){
                    self.scheduleOnce(function(){
                        cc.director.checkLastPine++;
                        cc.systemEvent.emit('NUMBER_COUNT', {
                            type: 100
                        });
                        if(!self.target.isPass){
                            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                        }
                        
                    }, 1);
                }else{
                    cc.systemEvent.emit('NUMBER_COUNT', {
                        type: 100
                    });
                }
                cc.director.SoundManager.playSound('mission');
                // cc.director.needWait=false;
            })
        )
        cc.director.SoundManager.playSound('fruitDrop');
        pineCone.runAction(action);

    },

    // 锤子动画执行，起始位置，最终的作用位置
    toolTransiteAnimation(event){  
        // 第一阶段  锤子由小变大 
        // 第二阶段 锤子旋转
        // 第三阶段 锤子打击到色块，出现打击效果
        // console.log(event);
        let type=event.type;
        let grid = event.grid;
        let item = this.toolList[event.type-1];
        let wp = item.parent.convertToWorldSpaceAR(item.position); 
        let startPos = this.node.convertToNodeSpaceAR(wp);
        let endPos;

        // 拳头
        if(type==1){
            cc.director.SoundManager.playSound('glove');
            let boxing = cc.instantiate(this.boxing);
            cc.systemEvent.emit('BOXING_ANVIL',{
                grid:grid,
                node:boxing,
                dir:Config.direction.RIGHT
            })
        }

        if(type==2){
            let fork = cc.instantiate(this.fork);
            cc.systemEvent.emit('BOXING_ANVIL',{
                grid:grid,
                node:fork,
                dir:Config.direction.DOWN
            })
        }

        if(type==3){
            endPos  = this.node.convertToNodeSpaceAR(event.wp);
            let hammer = cc.instantiate(this.hammerPrefab);
            let action = cc.sequence(
                cc.spawn(
                    cc.moveTo(1,cc.v2(endPos.x+80,endPos.y)),
                    cc.scaleTo(0.5,1.5),
                    ),
                cc.rotateBy(0.5,50),
                cc.rotateBy(0.5,-80),
                cc.delayTime(0.1),
                cc.callFunc(
                     function(){
                        cc.systemEvent.emit('player_tool',{
                            type,grid
                        });
                        hammer.removeFromParent();
                        cc.systemEvent.emit('CLEAR_BTN');
                        cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');
                     }
                )
                    
            )
            hammer.parent = this.node;
            hammer.position = startPos;
            hammer.runAction(action);        
            
        }

        if(type==4){
           
            cc.systemEvent.emit('player_tool',{
                type,grid
            });
            cc.systemEvent.emit('CLEAR_BTN');
            cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');
        
        }


    },



    // 还剩5步提示

    fiveStepTips(){
        // const Pos = this.header.position;
        // let startPos =cc.v2(Pos.x,Pos.y-100) ;
        // this.stepTips.position = startPos;
        let self=this;
        this.stepTips.active=true;
        this.stepTips.scale = 0.01;
        cc.director.SoundManager.playSound('plateIn');
        let action = cc.sequence(
            cc.spawn(
                cc.fadeIn(0.5),
                cc.scaleTo(0.5,1),
            ),
            cc.sequence(
                cc.rotateBy(0.05,15),
                cc.rotateBy(0.05,-15),
                cc.rotateTo(0.05,0),
            ).repeat(3),
            cc.delayTime(1),
            cc.spawn(
                cc.fadeOut(0.5),
                cc.scaleTo(0.5,0.01),
            ),
            cc.callFunc(function(){
                cc.director.SoundManager.playSound('plateOut');
            })
        )
        this.stepTips.runAction(action);
    },



    // 玩家道具解锁动画
     playerToolUnlockAnima(event){
        
        let self=this;
        let pos = event.pos;
        let  nodePos= this.node.convertToNodeSpaceAR(pos);
        this.tool.active=true;
        this.tool.position = cc.v2(0,0);
        let light = this.tool.getChildByName('light');
        let toolView = this.tool.getChildByName('toolView');
        toolView.getComponent(cc.Sprite).spriteFrame = this.toolView[event.num-1];
        toolView.scale=0.1;
        cc.director.SoundManager.playSound('unlock');
        light.runAction(
          
                cc.spawn(
                    cc.rotateBy(2,180),
                    cc.sequence(
                        cc.scaleTo(0.5,1),
                        cc.delayTime(1),
                        cc.fadeOut(0.5)
                    )
                )
        )
        toolView.runAction(
            cc.sequence(
                cc.scaleTo(0.5,1),
                cc.delayTime(1),
                cc.scaleTo(0.5,0.4),
                cc.moveTo(0.5,nodePos),
                cc.callFunc(function(){
                   self.tool.active=false;
                   self.listTool.changeBtnStatus(event.num);
                   cc.systemEvent.emit('PLAYER_TOOL_GUIDE',{num:event.num});
                })
            )
        )
     },

    //  玩家购买道具后的动画
     animationAfterPlayerBuyPlayerTool(event){
    
        let itemNode = this.toolList[event.num-1];
        let pos = itemNode.parent.convertToWorldSpaceAR(itemNode.position);
        let self=this;
        let  nodePos= this.node.convertToNodeSpaceAR(pos);
        let toolClone = cc.instantiate(this.tool);
        toolClone.active=true;
        toolClone.parent=this.node;
        toolClone.position = cc.v2(0,0);
        let light = toolClone.getChildByName('light');
        light.active=false;
        let toolView = toolClone.getChildByName('toolView');
        toolView.scale=0.1;
        toolView.position=cc.v2(0,0);
        cc.director.SoundManager.playSound('flyStart');
        toolView.getComponent(cc.Sprite).spriteFrame = this.toolView[event.num-1];
        toolView.runAction(
            cc.sequence(
                cc.scaleTo(0.5,1),
                cc.delayTime(0.5),
                cc.scaleTo(0.5,0.4),
                cc.moveTo(0.5,nodePos),
                cc.callFunc(function(){
                    toolClone.removeFromParent();
                    cc.director.SoundManager.playSound('starCollect');
                    cc.systemEvent.emit('UPDATE_TOOL',{type:event.num,statu:3});
                })
            )
           
        )
     },





    //  步数增加效果

    movesAdd(event){
        let self=this;
        this.scheduleOnce(
            function(){
                let wp = event.pos;
                let np = this.node.convertToNodeSpaceAR(wp);
                let prefabLight = cc.instantiate(this.fire);
                prefabLight.parent = this.node;
                // prefabLight.position = np;
                cc.director.SoundManager.playSound('flyTool');
                prefabLight.runAction(
                    cc.sequence(
                        cc.moveTo(0.6,np),
                        cc.callFunc(function(){
                            self.target.stepCount+=5;
                            self.target.updateGameStep(self.target.stepCount);
                            prefabLight.removeFromParent();
                            cc.director.SoundManager.playSound('add_move');
                            cc.systemEvent.emit('GAMEMASK_CONTROL', { order: 2 });
                        })
                    )
                )
            },0.5
        )
    },


    //提醒玩家游戏目标
    noticeGameTarget(event){
      
        let self=this;
        let wp = event.worldPos;
        let np = this.node.convertToNodeSpaceAR(wp);

        let type = event.type>=20 ? event.type-12 : event.type;
        let index = event.index;
        let item = cc.instantiate(this.item_target);
        if(event.type==38){
            item.getComponent(cc.Sprite).spriteFrame = this.targetList[18];
        }else if(event.type==39){
            item.getComponent(cc.Sprite).spriteFrame = this.targetList[19];
        }else if(event.type==37){
            item.getComponent(cc.Sprite).spriteFrame = this.targetList[20];
        }else{
            item.getComponent(cc.Sprite).spriteFrame = this.targetList[type];
        }
        
        item.position =np;
        item.parent=this.node;

        let node = this.target.nodeList[index];
        let wp1 = node.parent.convertToWorldSpaceAR(node.position);
        let targetPos = this.node.convertToNodeSpaceAR(wp1);

        let callFunc = cc.callFunc(function(){
            item.removeFromParent();
            cc.director.SoundManager.playSound('mission');
            // console.log(cc.director.needWait,cc.director.isSuperTool,'403');
            
            cc.director.isMoving = false;
            cc.director.needWait = 0;
            cc.director.isrunning = 0;

            node.runAction(cc.sequence(
                cc.scaleTo(0.2,0.9),
                cc.scaleTo(0.2,1.1),
                cc.scaleTo(0.2,1),
            ))
        });
        cc.director.SoundManager.playSound('flyStart');
        let action =cc.sequence(
            cc.moveTo(1,targetPos).easing(cc.easeInOut(3.0)),
            callFunc,
        );
       
        item.runAction(action);
    },

    // 提示玩家当前操作的评价
    EvaluatePlayerOperation(event){

        let level = event.level;
        let soundName = 'evaluate'+level;
        // cc.director.SoundManager.playSound(soundName);
        this.operationAnimation(level);
        // if(level==2){

        // }
        // if(level==3){

        // }
        // if(level==4){

        // }
    },

    // 在中间提示
    operationAnimation(level){   
        if(!level){
            return ;
        }
        let evaluateNode ;
        if(this.evaluatePool.size()>0){
            evaluateNode = this.evaluatePool.get();
        }else{
            evaluateNode = cc.instantiate(this.evaluation);
        }

        evaluateNode.getComponent(cc.Sprite).spriteFrame = this.evaluationList[level-1];
        this.playOperateEffect(level);
        evaluateNode.scale = 0.00;
        evaluateNode.parent = this.node;
        let action = cc.sequence(
            cc.spawn(
                cc.fadeIn(0.5),
                cc.scaleTo(0.5,1).easing(cc.easeBackOut(3)),
            ),
            cc.delayTime(0.5),
            cc.fadeOut(0.5),
        )
        evaluateNode.runAction(action);
    },

    // 播放音效
    playOperateEffect(level){
        let name = 'operate'+level;
        cc.director.SoundManager.playSound(name);
    },

    // shuffle  提示
    shuffleEffectTips(){
        cc.director.SoundManager.playSound('shuffle');
        this.shuffleTips.active=true;
        this.shuffleTips.scale=0.01;
        let action = cc.sequence(
            cc.spawn(
                cc.fadeIn(0.1),
                cc.scaleTo(0.2,1).easing(cc.easeBackOut(3)),
            ),
            cc.sequence(
                cc.rotateBy(0.05,15),
                cc.rotateBy(0.05,-15),
                cc.rotateTo(0.05,0),
            ).repeat(3),
            cc.fadeOut(0.5),
        )
        this.shuffleTips.runAction(action);
    },



    addCoins(number){
        let self=this;
        let rest = number%10;
        let step = (number-rest)/10;
        for(let i=0;i<10;i++){
            setTimeout(function(){
                if(i==9){
                    self.obtainCoinsEffect(step+rest,true);
                }else{
                    self.obtainCoinsEffect(step);
                }
            
            },100*i)
        }
    },

    
      //获得金币时的效果
      obtainCoinsEffect(event,isLastCoins){

        let self=this;
        let coin = cc.instantiate(this.toolItem);
        // let targetPos = this.node.convertToNodeSpaceAR(this.coins.parent.convertToWorldSpaceAR(this.coins.position));
        let targetPos = this.coinsNumber.position;
        // let targetPos = cc.v2(0,400);
        if( !this.coinsNumber.active){
            this.coinsNumber.active=true;
            this.coinsNumber.scale = 0.1
            let number= GameData.getGameData().starCount;
            this.updateCoinsPrompt(this.coinsNumber,number);
            this.coinsNumber.runAction(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.scaleTo(0.5,1).easing(cc.easeBackOut(3))
                )
            )
        }
        coin.getComponent('toolItem').changeItemTexture(0);
        coin.parent=this.node;
        let randomX = Math.floor(Math.random()*200);
        let randomY =-500 +  Math.floor(Math.random()*100);
        let time = 0.2+ Math.random()*0.5; 
        coin.position = cc.v2(randomX,randomY);
        // cc.director.SoundManager.playSound('plateIn');
        let action = cc.sequence(
                cc.sequence(
                    cc.scaleTo(0.1,0.9),
                    cc.scaleTo(0.1,1.1),
                    cc.scaleTo(0.1,1),
                ),
                cc.spawn(
                    cc.rotateBy(time,720),
                    cc.moveTo(time,targetPos).easing(cc.easeInOut(3.0)),
                    cc.scaleTo(time,0.5),
                ),
                cc.callFunc(function(){
                    cc.director.SoundManager.playSound('flyCoins');
                }),
                cc.callFunc(function(){
                    coin.removeFromParent();
                    GameData.starCount += event;
                    self.updateCoinsPrompt(self.coinsNumber,GameData.starCount);
                    GameData.storeGameData();
                    if(!!isLastCoins){
                        self.coinsNumber.runAction(
                            cc.sequence(
                                cc.delayTime(0.5),
                                cc.fadeOut(0.5),
                                cc.callFunc(
                                    function(){
                                        self.coinsNumber.active=false;
                                    }
                                )
                            )
                           
                        )
                    }
                   
                })
        );
        coin.runAction(action);
    },
    
    // 显示金币减少的动画
    coinsReduceAnimation(event){
        let self = this;
        if( !this.coinsNumber.active){
            this.coinsNumber.active=true;
            this.coinsNumber.scale = 0.1
            let number= GameData.getGameData().starCount;
            this.updateCoinsPrompt(this.coinsNumber,number);
            let action =  cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.5,0.9),
                    cc.fadeIn(0.5)
                ), 
                cc.spawn(
                    cc.scaleTo(0.5,1.1),
                    cc.callFunc(function(){
                        self.updateCoinsPrompt(self.coinsNumber,GameData.starCount);
                    })
                ),
                cc.spawn(
                    cc.scaleTo(0.5,1),
                    cc.fadeOut(0.5)
                ),
                cc.callFunc(function(){
                    self.coinsNumber.active=false;
                })
            );
            this.coinsNumber.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.fadeIn(0.5),
                        cc.scaleTo(0.5,1).easing(cc.easeBackOut(3))
                    ),
                    cc.callFunc(function(){
                        GameData.starCount -= event.cost;
                        GameData.storeGameData();
                        self.coinsNumber.runAction(action);
                    })
                )
               
            );
        }
      
        
        
    },


    // 显示金币
    updateCoinsPrompt(node,num){
        if(!!node){
            let number = node.getChildByName('coins_number').getComponent(cc.Label);
            number.string = num +'';
        }        
    },

    // 石像被释放出的动画
    hinderSquirrelAnimation(event){
        let targetPos =  this.target.getTargetIconWolrdPosition(28);
        if(!targetPos){
            return ;
        }
        let squirrel = event.statue;
        let wp = event.worldPos;
        let nodePos = this.node.convertToNodeSpaceAR(wp);
        squirrel.parent = this.node;
        cc.director.SoundManager.playSound('statueShow');
        squirrel.position = nodePos;
        // console.log(targetPos,611);
        let np1 = this.node.convertToNodeSpaceAR(targetPos);

        let action = cc.sequence(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.5,0.8),
                    cc.scaleTo(0.5,1)
                ),
                cc.sequence(
                    cc.rotateBy(0.5,-10),
                    cc.rotateBy(0.5,10)
                ),    
            ),
            cc.spawn(
                cc.rotateTo(1,0),
                cc.moveTo(1,np1).easing(cc.easeIn(3)),
                cc.scaleTo(1,0.2),
                cc.callFunc(function(){
                    cc.director.SoundManager.playSound('statueMove');
                }),
            ),
            cc.callFunc(
                function(){
                    squirrel.removeFromParent(true);
                    // cc.systemEvent.on('NUMBER_COUNT', this.countBlockNumber, this);
                    cc.systemEvent.emit('NUMBER_COUNT',{
                        type:28,
                    });
                    if(GameData.bestLevel==statueLimitedLevel){
                        let thirteen = cc.sys.localStorage.getItem('thirteen_step');
                        if(!thirteen){
                            cc.systemEvent.emit('STATUE_SECOND_GUIDE');
                        }
                    } ;
                    cc.director.SoundManager.playSound('statueCollect');
                }
            )
                
        )
        squirrel.runAction(action);
    },


    // 花被收集的动画
    hinderFlowerAnimaiton(event){
        // cc.director.
        let flower = cc.instantiate(this.flower_example);
        // console.log(flower,'651');
        flower.active=true;
        let wp = event.worldPos;
        let nodePos = this.node.convertToNodeSpaceAR(wp);
        flower.parent = this.node;
        flower.position = nodePos;
        let targetPos =  this.target.getTargetIconWolrdPosition(26);
        if(!targetPos){
            return ;
        }
        let np1 = this.node.convertToNodeSpaceAR(targetPos);
        let action = cc.sequence(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.5,2),
                    cc.scaleTo(0.5,1.9)
                ),
                cc.sequence(
                    cc.rotateBy(0.5,-20),
                    cc.rotateBy(0.5,20)
                ),    
            ),
            cc.spawn(
                cc.moveTo(1,np1).easing(cc.easeIn(3)),
                cc.scaleTo(1,0.2),
            ),
            cc.callFunc(
                function(){
                    flower.removeFromParent(true);
                    // cc.systemEvent.on('NUMBER_COUNT', this.countBlockNumber, this);
                    cc.director.SoundManager.playSound('mission');
                    cc.systemEvent.emit('NUMBER_COUNT',{
                        type:26,
                    })
                }
            )
                
        )
        flower.runAction(action);
    },

    // 草地被碰到时候的动画
    hitGroundGrassAnimation(event){
        let self=this;
        let wp = event.worldPos;
        let index = event.index;
        let np = this.node.convertToNodeSpaceAR(wp);
        let animaNode;
        cc.director.SoundManager.playSound('grassHit1');
        if(this.grassPool.size()>0){
            animaNode = this.grassPool.get(); 
        }else{
            animaNode = cc.instantiate(this.grassBreak)
        }
        animaNode.parent = this.node;
        animaNode.position = np;
        let anima = animaNode.getComponent(cc.Animation);
        let name = 'grass' + index;
        anima.play(name);
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function(){
                self.grassPool.put(animaNode);
            },time
        )
    },

    // 泡泡被炸掉时的动画
    hitCubesBubbleAnimation(event){
        let self=this;
        let wp = event.worldPos;
        // let index = event.index;
        let np = this.node.convertToNodeSpaceAR(wp);
        let animaNode;
        // cc.director.SoundManager.playSound('grassHit1');
        if(this.bubblePool.size()>0){
            animaNode = this.bubblePool.get(); 
        }else{
            animaNode = cc.instantiate(this.bubbleBreak)
        }
        animaNode.parent = this.node;
        animaNode.position = np;
        let anima = animaNode.getComponent(cc.Animation);
        let name = 'cubeBubbleBreak';
        anima.play(name);
        let time = anima.getClips()[0].duration;
        this.scheduleOnce(
            function(){
                self.bubblePool.put(animaNode);
            },time
        )
    },

    start () {
        this.stepTips.opacity=0;
        // this.scheduleOnce(
        //     function(){
        //         this.shuffleEffectTips();
        //     },3
        // )
    },

    // update (dt) {},
});
