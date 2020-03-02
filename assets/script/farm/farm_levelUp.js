let FarmUtils = require('./framUtils');
let FarmData = require('./FarmData');
cc.Class({

    extends: cc.Component,
    properties: {
        sprite_view: cc.Sprite,
        label_Level_current: cc.Label,
        label_Level_next: cc.Label,
        label_produce_current: cc.Label,
        label_produce_next: cc.Label,
        node_bg_light: cc.Node,
        list_view: [cc.SpriteFrame],
        node_particle: cc.ParticleSystem,
        node_animation: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    lightRatation() {
        let action = cc.rotateBy(6, 360).repeatForever();
        this.node_bg_light.runAction(action);
    },

    showView(type) {
        this.node.active = true;
        FarmUtils.showPromptWithScale(this.node);
        this.updateView(type);
        this.updateLevel(type);
        this.updateProduce(type);
        this.lightRatation();
        this.playParticleAnimation();
        this.playAnimation(this.node_animation);
    },

    hideView() {
        this.node_animation.active = false;
        this.node.active = false;
        this.node_bg_light.stopAllActions();
    },

    updateLevel(type) {
        let level = FarmUtils.getDataProperty(type, 'seedData', 'level');
        this.updateLabelString(this.label_Level_next, level);
        this.updateLabelString(this.label_Level_current, level - 1);
        // console.log(level);
    },

    updateProduce(type) {
        let level = FarmUtils.getDataProperty(type, 'seedData', 'level');
        let p1 = FarmData.getPlantProduce(level - 1, type);
        let p2 = FarmData.getPlantProduce(level, type);
        // console.log(p1, p2);
        this.updateLabelString(this.label_produce_current, p1);
        this.updateLabelString(this.label_produce_next, p2);
    },

    updateView(type) {
        this.sprite_view.spriteFrame = this.list_view[type];
    },


    updateLabelString(label, str) {
        label.string = new String(str);
    },


    // 播放粒子动画
    playParticleAnimation() {
        this.node_particle.node.active = true;
        this.node_particle.resetSystem();

    },

    // 播放帧动画
    playAnimation(node) {
        node.active = true;
        let anima = node.getComponent(cc.Animation);
        anima.play();
    },

    start() {

    },

    // update (dt) {},
});
