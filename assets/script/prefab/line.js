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
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    computedLineDistanceAndRotation(pos,tarPos){
        pos = this.node.convertToNodeSpaceAR(pos);
        let nPos = new cc.Vec2(pos.x,pos.y);
        tarPos = this.node.convertToNodeSpaceAR(tarPos);
        let distance = Math.ceil(nPos.sub(tarPos).mag());
        let vector1 =  nPos.sub(cc.v2(nPos.x,nPos.y+100));
        let vector2 = nPos.sub(tarPos);
        let degree = parseInt(vector2.signAngle(vector1)*(180/Math.PI));
        this.node.height = distance;
        this.node.rotation = degree;
        // console.log(degree);
        // console.log(vector1,vector2);
    },

    unuse() {
        // this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        // this.mark.active=false;
        // this.node.stopActionByTag(1);
        this.node.rotation=0;
        // this._stoneType=-1;
        // this.effectRemoveCol();
    },

    // menuItemPool.get() 获取节点后，就会调用 MenuItem 里的 reuse 方法
    reuse() {
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        // this.node.scale = 0.2;
        // this.node.active = true;
        // this.node.runAction(
        //     cc.spawn(
        //         cc.scaleTo(0.3,1),
        //         cc.fadeIn(0.1)
        //     )
            
        // )
    },


    start () {
    },

    // update (dt) {},
});
