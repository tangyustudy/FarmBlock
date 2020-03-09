

cc.Class({
    extends: cc.Component,

    properties: {
        headView: cc.Sprite,
        farmLevel: cc.Label,
        helpInfo: cc.Label,
        countryList: cc.SpriteAtlas,
        label_name: cc.Label,
        label_helpCount: cc.Label,
        progress: cc.ProgressBar,
        sprite_bg: cc.Sprite,
        list_bg: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem_Friend(data, isSelf) {
        this.data = data;
        this.updateHeadView(data.country);
        this.updateFarmLevel(data.fmlevel);
        // this,updateHelpInfo(data.helpInfo);
        let rest = 5 - data.helpcount >= 5 ? 5 : 5 - data.helpcount;
        this.updateHelpCount(rest);
        this.updateName(data.name);
        if (!!isSelf) {
            this.sprite_bg.spriteFrame = this.list_bg[1];
        } else {
            this.sprite_bg.spriteFrame = this.list_bg[0];
        }
    },

    // 更新头像
    updateHeadView(index) {
        this.headView.spriteFrame = this.countryList.getSpriteFrame('country' + index);
    },

    // 更新好友的帮助次数
    updateHelpCount(number) {

        let str = new String(number);
        this.label_helpCount.string = str + ':5';
        this.updateProgressBar(number);

    },

    // 更新进度条进度
    updateProgressBar(number) {
        let rate = number / cc.game.FarmData.WHTER_COUNT_MAX;
        this.progress.progress = rate;
    },


    // 更新农场等级
    updateFarmLevel(level) {
        this.farmLevel.string = new String(level);
    },

    //  更新帮助信息
    updateHelpInfo(str) {
        this.helpInfo.string = str + '';
    },

    // 更新名字
    updateName(str) {
        str = decodeURIComponent(str);
        this.label_name.string = new String(str);
    },


    // 帮助好友浇水
    helpFriend() {

        // let callback = function(res){
        //     if(!!res){

        //     }
        // }

        // this.data.help+=1;
        // this.updateHelpCount(this.data.help);
<<<<<<< HEAD
        // console.log(this.data.index, '81');
=======
        console.log(this.data.index, '81');
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        if(this.data.self==1){
            console.log('you can not help yourself!');
        }else{
            if (this.data.helpcount > 0) {
                let event = new cc.Event.EventCustom('helpFriendWater', true);
                event.detail = { index: this.data.index, count: 5 - this.data.helpcount, id: this.data.uid };
                this.node.dispatchEvent(event);
            }
        }

        

    },

    // start () {

    // },

    // update (dt) {},
});
