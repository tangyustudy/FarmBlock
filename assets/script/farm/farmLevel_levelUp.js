let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');

cc.Class({

    extends: cc.Component,
    properties: {
        node_light: cc.Node,
        label_lastLevel: cc.Label,
        label_nextLevel: cc.Label,
        node_particle: cc.ParticleSystem,
        node_farmIcon: cc.Node,
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 光效
    light_rotation() {
        let action = cc.rotateBy(2, 180).repeatForever();
        this.node_light.runAction(action);
    },

    updateLevel() {
        let farmInfo = FarmUtils.getLocalData('localFarmInfo');
        this.changeLabelString(this.label_lastLevel, farmInfo.level - 1);
        this.changeLabelString(this.label_nextLevel, farmInfo.level);
        this.currentLevel = farmInfo.level;
    },

    showView() {
        this.node.active = true;
        FarmUtils.showPromptWithScale(this.node);
        this.updateLevel();
        this.light_rotation();
        this.playFarmLevelUpAnimation();
        // this.playParticleAnimation();
    },

    hideView() {
        this.node_light.stopAllActions();
        this.node.active = false;
        cc.director.FarmManager.isLandUnlockBylevelUp();
        this.isNeedShowPlantUnlockPrompt();



    },

    isNeedShowPlantUnlockPrompt() {
        // let nextUnlockLand = 
        let index = FarmData.plantLimitedList.indexOf(this.currentLevel);
        if (index >= 0) {
            cc.systemEvent.emit('SHOW_PLANT_UNLOCK', { type: index });
        }
    },



    changeLabelString(label, str) {
        label.string = 'lv.' + new String(str);
    },

    // 播农场升级动画
    playFarmLevelUpAnimation() {
        let anima = this.node_farmIcon.getComponent(cc.Animation);
        anima.play('levelUp_farm');
        let duration = anima.getClips()[0].duration;
        this.scheduleOnce(
            function () {
                this.playParticleAnimation();
            }, duration
        )
    },

    // 播放粒子动画
    playParticleAnimation() {
        this.node_particle.node.active = true;
        this.node_particle.resetSystem();

    },




    start() {

    },

    // update (dt) {},
});
