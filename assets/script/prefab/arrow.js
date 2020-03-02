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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },


    computedLineDistanceAndRotation(pos, tarPos) {
        pos = this.node.convertToNodeSpaceAR(pos);
        let nPos = new cc.Vec2(pos.x, pos.y);
        tarPos = this.node.convertToNodeSpaceAR(tarPos);
        // let distance = Math.ceil(nPos.sub(tarPos).mag());
        let vector1 = nPos.sub(cc.v2(nPos.x, nPos.y + 100));
        let vector2 = nPos.sub(tarPos);
        let degree = parseInt(vector2.signAngle(vector1) * (180 / Math.PI));
        // this.node.height = distance;
        this.node.rotation = degree - 180;
        // console.log(degree + 180);
        // console.log(vector1, vector2);
    },

    unuse() {
        // this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        // this.mark.active=false;
        // this.node.stopActionByTag(1);
        this.node.rotation=0;
        // this._stoneType=-1;
        // this.effectRemoveCol();
    },



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
