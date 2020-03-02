

cc.Class({
    extends: cc.Component,

    properties: {
        fMask:cc.Node,
        shop:require('./shop'),
        powerPool:require('./powerPool'),    
        shop_android:require('./shop_android'),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.funcView = this;
    },

    // 隐藏所有子节点
    hideAllChilden(){
        let children = this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].active=false;
        }
    },


    // 显示商店
    showShop(){
        cc.director.SoundManager.playSound('btnEffect');
        if(cc.sys.os == cc.sys.OS_ANDROID){
            this.hideAllChilden();
            this.fMask.active=true;
            this.shop_android.showView();
            window.NativeManager.showInterstitialAd(2);
        }else{
            this.hideAllChilden();
            this.fMask.active=true;
            this.shop.showView();
            window.NativeManager.showInterstitialAd(2);
        }
     
    },

    // 隐藏商店
    hideShop(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChilden();
        this.shop.hideView();
    },

    // 显示力量池
    showPowerPool(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChilden();
        this.fMask.active=true;
        this.powerPool.showView();
        window.NativeManager.showInterstitialAd(2);
    },

    // 隐藏力量池
    hidePowerPool(){
        cc.director.SoundManager.playSound('btnEffect');
        this.hideAllChilden();
        this.powerPool.hideView();
    },

    start () {

    },

    // update (dt) {},
});
