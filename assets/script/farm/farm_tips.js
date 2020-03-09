// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let FarmData = require('./FarmData');

cc.Class({
    extends: cc.Component,

    properties: {
        netCacheNode: cc.Node,
        node_cloud: cc.Node,

        node_mask: cc.Node,
        node_guide: cc.Node,
        node_wordNotice: cc.Node,

        voice_bgm: cc.AudioSource,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        cc.systemEvent.on('SHOW_CACHE_ANIMA', this.showNetCacheAnimation, this);
        cc.systemEvent.on('HIDE_CACHE_ANIMA', this.hideNetCacheAnimation, this);
        cc.systemEvent.on('FADEIN_COULD_ANIMA', this.cloudFadeIn, this);
        cc.systemEvent.on('FADEOUT_COULD_ANIMA', this.cloudFadeOut, this);
        cc.systemEvent.on('SHOW_FARM_GUIDE', this.showFarmGuide, this);
        cc.systemEvent.on('HIDE_FARM_GUIDE', this.hidefarmGuide, this);
        cc.systemEvent.on('SHOW_WORD_NOTICE', this.showWordNotice, this);

        this.node_mask.on(cc.Node.EventType.TOUCH_END, this.onTouchMask, this);



    },

    onTouchMask() {
        cc.systemEvent.emit('HIDE_FARM_GUIDE');
    },

    // 显示网络缓存动画
    showNetCacheAnimation() {
        // console.log('helloworld')
        this.netCacheNode.active = true;
        this.anima = this.netCacheNode.getComponent(cc.Animation);
        this.anima.play('cache');
    },

    // 隐藏网络缓存动画
    hideNetCacheAnimation() {
        if (!this.anima) {
            this.anima = this.netCacheNode.getComponent(cc.Animation);
        }
        this.anima.stop('cache');
        this.netCacheNode.active = false;
    },

    //云缓慢退出
    cloudFadeOut() {
        let self = this;
        this.node_cloud.active = true;
        let left = this.node_cloud.getChildByName('cloudLeft');
        let right = this.node_cloud.getChildByName('cloudRight');
        left.position = cc.v2(-400, 0);
        right.position = cc.v2(400, 0);
        let action1 =
            cc.sequence(
                cc.fadeIn(0.1),
                cc.spawn(
                    cc.fadeOut(1),
                    cc.moveTo(1, cc.v2(-1200, 0))
                )
            ).easing(cc.easeInOut(3.0));
        let action2 = cc.sequence(
            cc.fadeIn(0.1),
            cc.spawn(
                cc.fadeOut(1),
                cc.moveTo(1, cc.v2(1200, 0))
            ),
            cc.callFunc(function () {
                // self.node_cloud.active=false;
                self.startFarmBgm();
            })
        ).easing(cc.easeInOut(3.0));
        left.runAction(action1);
        right.runAction(action2);
        cc.director.SoundManager.playSound('farm_cloud');
    },

    // 云缓慢合拢
    cloudFadeIn() {
        let self = this;
        this.node_cloud.active = true;
        let left = this.node_cloud.getChildByName('cloudLeft');
        let right = this.node_cloud.getChildByName('cloudRight');
        left.position = cc.v2(-1200, 0);
        right.position = cc.v2(1200, 0);
        let action1 = cc.sequence(
            cc.fadeOut(0.1),
            cc.spawn(
                cc.fadeIn(1),
                cc.moveTo(1, cc.v2(-400, 0))
            )
        ).easing(cc.easeInOut(3.0));
        let action2 = cc.sequence(
            cc.fadeOut(0.1),
            cc.spawn(
                cc.fadeIn(1),
                cc.moveTo(1, cc.v2(400, 0))
            ),
            cc.callFunc(function () {
                // self.node_cloud.active=false;
                self.endFarmBgm();
            })
        ).easing(cc.easeInOut(3.0));
        left.runAction(action1);
        right.runAction(action2);
        cc.director.SoundManager.playSound('farm_cloud');

    },


    // 显示游戏引导
    showFarmGuide() {

        this.node_mask.active = true;
        this.node_guide.active = true;

    },

    // 隐藏游戏引导
    hidefarmGuide() {
        this.node_mask.active = false;
        this.node_guide.active = false;
    },

    // 开启农场背景音乐
    startFarmBgm() {
        let isBgmOn = cc.sys.localStorage.getItem('bgm');
        // console.log(isBgmOn, 'farm_tips');
        if (isBgmOn) {
            this.voice_bgm.play();
        } else {
            // console.log('fuck music!');
        }

    },

    // 关闭农场背景音乐
    endFarmBgm() {
        this.voice_bgm.stop();
    },

    showWordNotice(event) {
        let label_word = this.node_wordNotice.getChildByName('word').getComponent(cc.Label);
        let tipsCode = event.code + '';
        label_word.string = FarmData.wordTips[tipsCode];
        this.node_wordNotice.stopAllActions();
        this.node_wordNotice.scale=0;
        this.node_wordNotice.active = true;
        let action = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.2, 1),
                cc.fadeIn(0.2),
            ),
            cc.delayTime(1),
            cc.spawn(
                cc.scaleTo(0.2, 0),
                cc.fadeOut(0.2),
            )
        );
        this.node_wordNotice.runAction(action);

    },


    start() {

    },

    // update (dt) {},
});
