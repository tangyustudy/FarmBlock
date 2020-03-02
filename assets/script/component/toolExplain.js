// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mask:cc.Node,
        funcNode:cc.Node,
        item:cc.Node,
        explainView:cc.Sprite,
        iconView:cc.Sprite,
        explain_list:[cc.SpriteFrame],
        icon_list:[cc.SpriteFrame],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        let winSize = cc.view.getVisibleSize();
      
        this.startPos = cc.v2(0,(winSize.height + this.funcNode.height)/2);
        this.endPos = cc.v2(0,(winSize.height-this.funcNode.height)/2);
        // console.log(winSize,this.startPos,this.endPos);
        cc.systemEvent.on('FUNCTION_EXPLAIN_ON',this.showView,this);
        cc.systemEvent.on('FUNCTION_EXPLAIN_OFF',this.hideView,this);
        
    },

    // 显示
    showView(event){
        // console.log(event.detail);
        let type = event.type;
        let itemPos = event.itemPos;
        this.item.position = this.node.convertToNodeSpaceAR(itemPos);
        this.explainView.spriteFrame = this.explain_list[type];
        this.iconView.spriteFrame = this.icon_list[type]; 
        this.item.getComponent(cc.Sprite).spriteFrame = this.icon_list[type];
        this.show_();
        this.initFuncNode();

    },


    hideView(){
        this.hide_();
    },


    //设置功能提示信息的初始位置
    initFuncNode(){
        this.funcNode.stopAllActions();
        this.funcNode.position = this.startPos;
        this.funcNode.runAction(
            cc.spawn(
                cc.fadeIn(0.1),
                 cc.moveTo(0.5,this.endPos)
            )
           
        )
    },

    // 显示
    show_(){
        // this.
        this.mask.active=true;
        this.mask.opacity =220;
        this.funcNode.active=true;
        this.item.active=true;
        this.item.opacity =255;
    },

    // 隐藏
    hide_(){
        // this.mask.active=false;
        // this.funcNode.active=false;
        // this.item.active=false;
        cc.director.SoundManager.playSound('btnEffect');
        this.funcNode.stopAllActions();
        this.nodeFadeOut(this.mask);
        this.nodeFadeOut(this.item);
        this.funcNode.runAction(
            cc.sequence(
                cc.moveTo(0.5,this.startPos),
                cc.fadeOut(0.1),
            )
            
        )
    },

    // 节点隐藏
    nodeFadeOut(node){
        node.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(function(){
                    node.active=false;
                })
            )
           
        )
    },

    //    取消道具
    cancleTool(){
        cc.systemEvent.emit('CLEAR_BTN');
        cc.systemEvent.emit('FUNCTION_EXPLAIN_OFF');
    },



    start () {
        this.initFuncNode();
        // console.log(this.startPos,'43');
    },

    // update (dt) {},
});
