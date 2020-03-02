// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Config = require('../psconfig');
let Uitls = require('../utils');

cc.Class({
    extends: cc.Component,

    properties: {
        prompt:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initBgPrompt(list){
        if(this.node.children.length>0){
            this.node.removeAllChildren();
        }
        for(let row=0;row<Config.matrixRow;row++){
            for(let col=0;col<Config.matrixCol;col++){
               if(list[row][col]>=0){
                    let item = cc.v2(row,col);
                    let  boundList= Uitls.judgeBounder(item,list);
                    let angelList = Uitls.judgeAngle(item,list);
                    // console.log(angelList,35);
                    let prompt = cc.instantiate(this.prompt);
                    let pos = Uitls.girdToPos(row,col,0.5);
                    // console.log(pos,'11111111'); 
                    prompt.position =pos;
                    prompt.getComponent('prompt').bounderControl(boundList);
                    prompt.getComponent('prompt').angleControl(angelList);
                    this.node.addChild(prompt);
                //   console.log( prompt.position) ;
               } 
            }
        }

        // let  boundList= Uitls.judgeBounder(cc.v2(7,8),list);
        // console.log(boundList);
    },


    start () {

    },

    // update (dt) {},
});
