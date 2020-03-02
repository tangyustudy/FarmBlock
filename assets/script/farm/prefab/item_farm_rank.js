
const levelSpace = 40; 

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_headView: cc.Sprite,
        sprite_rankGrade: cc.Sprite,
        label_rankGrade: cc.Label,
        label_exp: cc.Label,
        label_name: cc.Label,
        label_level: cc.Label,
        spriteAtlas_country: cc.SpriteAtlas,
        list_rankGrade: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItemDetail(data) {
        this.updateHeadView(data.country);
        this.updateNickName(data.name);
        this.updateRankGrade(data.index);
        this.updateLevel(data.fmlevel);
        this.updateExp(data.fmexp);
    },

    updateHeadView(index) {
        this.sprite_headView.spriteFrame = this.spriteAtlas_country.getSpriteFrame('country' + index);
    },

    updateNickName(name) {
        this.changeLabelString(this.label_name, name);
    },

    updateRankGrade(num) {
        if (num > 2) {
            num += 1;
            this.changeLabelString(label_rankGrade, num);
            this.sprite_rankGrade.node.active=false;
            this.label_rankGrade.node.active=true;
        } else {
            this.sprite_rankGrade.node.active=true;
            this.label_rankGrade.node.active=false;
            this.sprite_rankGrade.spriteFrame = this.list_rankGrade[num];
        }
    },

    updateLevel(num) {
        this.changeLabelString(this.label_level,num);
        this.label_level.node.getComponent(cc.Widget).left = levelSpace;

    },
    
    updateExp(num) {
        this.changeLabelString(this.label_exp,num);
        // console.log(this.label_exp.node);
        this.label_exp.node.getComponent(cc.Widget).left = levelSpace;
    },

    //  改变标签的字符
    changeLabelString(label, str) {
        label.string = new String(str);
    },

    start() {

    },

    // update (dt) {},
});
