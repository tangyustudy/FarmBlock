window.NativeManager = {
    splashBegin: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "splashBegin", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "splashBegin");
            }
        } catch (e) {
        }
    },
    splashEnd: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "splashEnd", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "splashEnd");
            }
        } catch (e) {
        }
    },

    getUid: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var uid = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getOpenUDID", "()Ljava/lang/String;");
                return !!uid ? uid : "";
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var uid = jsb.reflection.callStaticMethod("NativeBridge", "getOpenUDID");
                return !!uid ? uid : "";
            }
        } catch (e) {
        }

        return "";
    },

    getCountryCode: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCountryCode", "()Ljava/lang/String;");
                return !!code ? code : "ZZ";
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var code = jsb.reflection.callStaticMethod("NativeBridge", "getCountryCode");
                return !!code ? code : "ZZ";
            }
        } catch (e) {
        }

        return "ZZ";
    },


    showGift: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showGift", "()V");
            }
        } catch (e) {
        }
    },

    showBannerAd: function (isShow) {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showBannerAd", "(Z)V", (!!isShow ? true : false));
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "showBannerAd:", (!!isShow ? true : false));
            }
        } catch (e) {
        }
    },


    /**
     * 
     * @param { 
     * 启动页之后：1, 
     * 点击开始按钮： 2, 
     * 结束页面或者成功页面： 3} position 
     
     */

    showInterstitialAd: function (position) {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(I)V", position);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "showAd:", position);
            }
        } catch (e) {
        }
    },

    
    showRate: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showRate", "()V");
            }
        } catch (e) {
        }
    },

    hasRewardVideo: function () {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return !!jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hasRewardVideo", "()Z");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod("NativeBridge", "hasRewardVideo");
            }
        } catch (e) { 
            return false;
        }
    },

    showRewardVideo: function (callback) {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showRewardVideo", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "showRewardVideo");
            }

            this.rewardVideoCallback = callback;
        } catch (e) {
            
        }
    },

    rewardVideoBack: function (isFinished) {
        if (!!this.rewardVideoCallback) {
            this.rewardVideoCallback(isFinished == 1 ? true : false);
        }
    },

    // todo
    goShare: function (callback) {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "goShare", "()V");
            }else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeBridge", "goShare");
            }
            this.shareCallback = callback;
        } catch (e) {
        }
    },

    
    shareBack: function(isSuccess){
        if(!!this.shareCallback){
            this.shareCallback(isSuccess == 1 ? true : false);
        }
    },


    reportLifeChanged: function (lifeCount){
        try {
            if(lifeCount >= 0){
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "reportLifeChanged", "(I)V", lifeCount);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeBridge", "reportLifeChanged:", lifeCount);
                }
                }
            } catch (e) {

            }
    },

    reportReview: function(score){
        try {
            if(score >= 0){
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "reportReview", "(I)V", score);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeBridge", "reportReview:", score);
                }
            }
        }catch (e) {

        }
    },
    reportLevelEvent: function(level){
        try {
            if(level >= 0){
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "reportLevelEvent", "(I)V", level);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeBridge", "reportLevelEvent:", level);
                }
            }
        }catch (e) {

        }
    },

    hasPhoneHair: function(){
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hasPhoneHair", "()Z");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod("NativeBridge", "hasPhoneHair");
            }
        }catch (e) {
        }
        return false;
    },

    tjReport: function(level, step, isProp){
        try {
            if(level >= 0){
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "tjReport", "(III)V", level, step, isProp);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("NativeBridge", "tjReport:step:isProp", level, step, isProp);
                }
            }
        }catch (e) {

        }
    },

    // 浏览器跳转
    goForum: function(){
        try {
               if (cc.sys.os == cc.sys.OS_ANDROID) {
                   jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "goForum", "()V");
               }else if (cc.sys.os == cc.sys.OS_IOS) {
                   jsb.reflection.callStaticMethod("NativeBridge", "goForum");
               }
               this.shareCallback = callback;
           } catch (e) {
           }
       },


       /**
     * 
     * @param {*} goodsId  商品id， 传整数1，2，3....
     * @param {*} callback 购买结果回调
     */
    purchaseGoods: function (goodsId, callback) {
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "purchaseGoods", "(I)V", goodsId);
            } 
            // else if (cc.sys.os == cc.sys.OS_IOS) {
            //     jsb.reflection.callStaticMethod("NativeBridge", "purchaseGoods:", goodsId);
            // }

            this.purchaseCallback = callback;
            // callback(true);
        } catch (e) {
            
        }
    },

    purchaseBack: function(goodsId){
        if (!!this.purchaseCallback) {
            this.purchaseCallback(goodsId);
        }
    },

    login: function(callback){
        try {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "login", "()V");
            } 
            // else if (cc.sys.os == cc.sys.OS_IOS) {
            //     jsb.reflection.callStaticMethod("NativeBridge", "login");
            // }

            this.loginCallback = callback;
        } catch (e) {
        }
    },

    loginBack: function(isSucc, lid){
        if (!!this.loginCallback) {
            this.loginCallback(isSucc, lid);
        }
    },

};

module.exports = window.NativeManager;