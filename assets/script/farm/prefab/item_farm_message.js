

cc.Class({
    extends: cc.Component,

    properties: {
        headView: cc.Sprite,
        atlas_headView: cc.SpriteAtlas,
        friendName: cc.Label,
        level: cc.Label,
        label_time:cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // 
    initItemDeatail(data) {
        this.updateHeadView(data.country);
        this.updateFriendName(data.name);
        this.updateLevel(data.level);
        this.updateTime(data.time);
    },


    updateHeadView(index) {
        // this.headView.spriteFrame = this.atlas_headView.getScprite('');
        this.headView.spriteFrame = this.atlas_headView.getSpriteFrame('country' + index);
    },

    updateFriendName(name) {
        this.friendName.string = new String(name);
    },

    updateLevel(level) {
        this.level.string = new String(level);
    },

    updateTime(stamp){
        // this.label_time.string =  new Date(stamp * 1000).toDateString();
        let date =  new Date(stamp*1000);
        let hour = date.getHours();
        let min = date.getMinutes();
        let str = hour+':'+min;
        this.label_time.string = str;
    },


    start() {

    },

    // update (dt) {},
});
