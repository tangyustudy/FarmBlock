module.exports = {
    sounds: {},
    init: function(){
        var self = this;
        cc.loader.loadResDir("Sound", cc.AudioClip, function (err, assets, urls) {
            console.log("load dir success");
            if(!err && !!assets){
                for(var i=0; i<assets.length; i++){
                    self.sounds[assets[i]._name] = assets[i];
                }
            }
        });

        var sound = cc.sys.localStorage.getItem("sound");
        if(sound == "0"){
            this.isSound = false;
        }else{
            this.isSound = true;
        }
    },

    playSound: function(soundName){
        if(!!this.isSound && !!this.sounds[soundName]){
            cc.audioEngine.play(this.sounds[soundName], false, 1);
        }
    },

    // 循环
    playSoundLoop:function(soundName,loop){
        if(!!loop){
            if(!!this.isSound && !!this.sounds[soundName]){
               return  cc.audioEngine.play(this.sounds[soundName], true, 1);
            }
        }else{
            if(!!this.isSound && !!this.sounds[soundName]){
                cc.audioEngine.play(this.sounds[soundName], false, 1);
                return false;
            }
        }
        return false;
    },

    canSound: function(){
        return this.isSound;
    },

    openSound: function(){
        this.isSound = true;
        cc.sys.localStorage.setItem("sound", "1");
    },

    closeSound: function(){
        this.isSound = false;
        cc.sys.localStorage.setItem("sound", "0");
    },
}