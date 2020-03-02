// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// const starStandard = [15000, 30000, 45000];

let GameData = require('../gameData');
let levelRes = require('../levelResource');

cc.Class({
    extends: cc.Component,

    properties: {
        starList: [cc.Node],
        progressBar: cc.ProgressBar,
        starView: [cc.SpriteFrame],
        star_boom:cc.Prefab,
        header:cc.Node,
        container:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.scoreValue = 0;
        this.starLevel = 0;
        // this.scoreStandard
        this.passRate=-1;
    },

    start() {
        // this.initProgressBar();
        this.judgeHasHair();
    },

    initProgressBar() {
        this.progressBar.progress = 0;
        this.scoreValue=0;
        this.starStandard = levelRes['lv'+GameData.bestLevel].scoreStandard;
        this.initStarView();
    },

    initStarView() {
        for (let i = 0; i < this.starList.length; i++) {
            let inner = this.starList[i].getChildByName('inner');
            inner.active = false;
        }
    },

    judgeStepScore(num) {
     
        if (num > 0) {
            this.scoreValue += num;
            GameData.currScore = this.scoreValue;
            this.starLight(this.scoreValue);
            let progress =  num / this.starStandard[2];
            // parseFloat(().toFixed(2));
            // this.progressBar.progress += progress;
            this.slowAddEffect(progress);
        }

    },

    slowAddEffect(progress){
        let bit = progress/10;
        for(let i=0;i<10;i++){
            this.scheduleOnce(
                function(){
                    this.progressBar.progress +=bit;
                },0.05*i
            )
        } 
        // console.log(this.progressBar.progress);
    },


    // starBoomEffect
    addEffect(num){

        let effect = cc.instantiate(this.star_boom);
        effect.parent = this.node;
        effect.position = this.starList[num].position;
        effect.getComponent(cc.ParticleSystem).resetSystem();

    },




    starLight(scoreValue){

        if(scoreValue<this.starStandard[0]){
            GameData.passRate=-1;
            return;
        }

        if(scoreValue>=this.starStandard[0] && scoreValue<this.starStandard[1] ){
            this.starList[0].getChildByName('inner').active=true;
            if(this.passRate==1){
                if(!!cc.director.container.target.isGameEnd && !!cc.director.container.target.isPass){
                    GameData.passRate = this.passRate;
                }
                return ;
            }
            this.passRate=1;
            cc.director.SoundManager.playSound('starCollect');
            // console.log(this.starList[0]);
            this.addEffect(0);
            this.starList[0].runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.scaleTo(0.1,0.9),
                    cc.scaleTo(0.3,2),
                    cc.scaleTo(0.1,1),
                )

            )
        }

        if(scoreValue>=this.starStandard[1] && scoreValue<this.starStandard[2] ){
            this.starList[0].getChildByName('inner').active=true;
            this.starList[1].getChildByName('inner').active=true;
            if(this.passRate==2){
                if(!!cc.director.container.target.isGameEnd && !!cc.director.container.target.isPass){
                    GameData.passRate = this.passRate;
                }
                return ;
            }
            this.passRate=2;
            
            cc.director.SoundManager.playSound('starCollect');
            this.addEffect(1);
            this.starList[1].runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.scaleTo(0.1,0.9),
                    cc.scaleTo(0.3,2),
                    cc.scaleTo(0.1,1),
                )

            )

        }

        if(scoreValue>=this.starStandard[2] ){
            
            this.starList[0].getChildByName('inner').active=true;
            this.starList[1].getChildByName('inner').active=true;
            this.starList[2].getChildByName('inner').active=true;
            if(this.passRate==3){
                // console.log(cc.director.container.target.isGameEnd ,cc.director.container.target.isPass);
                if(!!cc.director.container.target.isGameEnd && !!cc.director.container.target.isPass){
                    GameData.passRate = this.passRate;
                }
                return ;
            }
            this.passRate=3;
            cc.director.SoundManager.playSound('starCollect');
            this.addEffect(2);
            this.starList[2].runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.scaleTo(0.1,0.9),
                    cc.scaleTo(0.3,2),
                    cc.scaleTo(0.1,1),
                )

            )

        }

    },


    
    judgeHasHair(){
        let hasHair =  window.NativeManager.hasPhoneHair();
        // let hasHair=true;
       if(!!hasHair){
           this.moveNeedMoveArea();
       }
    },

    moveNeedMoveArea(){
        let widget1 = this.header.getComponent(cc.Widget);
        // console.log(widget1);
        widget1.top=80;
        let widget2 = this.container.getComponent(cc.Widget);
        widget2.verticalCenter-=60;

    }


    // update (dt) {},
});
