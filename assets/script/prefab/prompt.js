// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 上 下 左 右

let Utils = require('../utils');

cc.Class({
    extends: cc.Component,

    properties: {
       bound:[cc.Node],
       angle:[cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 根据数组来控制四条边的显示隐藏
    bounderControl(list){
        for(let i=0;i<list.length;i++){
            if(list[i]==1){
                this.bound[i].active=true;
                // this.bound[i].width=100;
                // if(i==2){
                //     this.bound[i]
                // }
            }else{
                this.bound[i].active=false;
            }
        }
        this.isAngleShow(this.bound);
    },

    // 拐角如何显示
    isAngleShow(list){
        if(list[0].active && list[2].active){
            this.angle[0].active=true;
            // list[0].width = list[2].width = 60;
        }

        if(list[0].active && list[3].active){
            this.angle[1].active=true;
            // list[0].width = list[3].width = 60;
        }

        if(list[1].active && list[2].active){
            this.angle[3].active=true;
            // list[1].width = list[2].width = 60;
        }

        if(list[1].active && list[3].active){
            this.angle[2].active=true;
            // list[1].width = list[3].width = 60;
        }
    },

    angleControl(list){
        // console.log(list);
        for(let i=0;i<list.length;i++){
            if(this.angle[i].active){
                if(!!list[i]){
                    // this.angle[i].rotation = list[i];
                    this.angle[i].active=false;
                    // console.log(i);
                }
               
            }
        }
    },




    start () {

    },

    // update (dt) {},
});
