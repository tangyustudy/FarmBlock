let plantViewList = cc.Class({
    // extends: cc.Component,
    name: 'plantViewList',
    properties: {
        viewList: [cc.SpriteFrame]
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        plantSpriteList: [plantViewList],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.startPlantAnimation();
    },


    // 执行植物缓动动画
    startPlantAnimation() {

        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].active = true;
            this.plantMoveAnimation(children[i], 0.5 + 0.1 * i);
        }
<<<<<<< HEAD

    },

    // 停止所有动画，回复植物原来大小
    stopAnimaAndResume() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].stopAllActions();
            children[i].scale = 1;
        }
    },

    //关闭植物的缓动动画 
    endPlantAnimation() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].active = false;
            children[i].stopAllActions();
=======
    },

     //关闭植物的缓动动画 
     endPlantAnimation() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
           
            children[i].active = false;
            children[i].stopAllActions();

>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        }
    },


    //关闭植物的缓动动画 
    endPlantAnimation1() {
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let action = cc.sequence(
                cc.fadeOut(0.8),
                cc.callFunc(function () {
                    children[i].active = false;
                    children[i].stopAllActions();
                })
            );
            children[i].runAction(action);
        }
    },


    // 植物的缓动动画
    plantMoveAnimation(node, time) {
        let action2 = cc.sequence(
            cc.scaleTo(time, 1.05),
            cc.scaleTo(time, 0.95),
            cc.scaleTo(time, 1),
        ).repeatForever();
        node.runAction(action2);
    },

    // 更换所有的植物的纹理
    /**
     * 
     * @param {Number} type 植物类型 
     * @param {Number} statue  植物的生长状态
     */
<<<<<<< HEAD
    changePlantTexture(type, statue, index, reap) {
        // console.log(type, statue, index, '80');
=======
    changePlantTexture(type, statue, index) {
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        if (!!index) {
            this.index = index;
        }
        if (typeof this.statue == 'undefined') {
<<<<<<< HEAD
            // console.log(this.statue, statue);
=======
            console.log(this.statue, statue);
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
            this.statue = -1;
        } else {
            if (this.statue >= 0 && this.statue == statue) {
                return;
            }
        }
        this.statue = statue;
        this.node.active = true;
        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].active = true;
            children[i].stopAllActions();
            children[i].getComponent(cc.Sprite).spriteFrame = this.plantSpriteList[type].viewList[statue];
            this.fadeInFromSmall(children[i]);
        }
        this.scheduleOnce(function () {
<<<<<<< HEAD
            if (!reap) {
                this.startPlantAnimation();
            } else {
                this.stopAnimaAndResume();
            }

=======
            this.startPlantAnimation();
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        }, 1.5);

    },


<<<<<<< HEAD
=======



>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    // 从小到大 从透明开始显示
    fadeInFromSmall(node) {
        node.opacity = 0;
        node.scale = 0.1;
        let action = cc.spawn(
<<<<<<< HEAD
            cc.fadeIn(0.2),
            cc.scaleTo(0.8, 1),
        );
        node.runAction(action);
        // console.log('11111111111111111');
    },


=======
            cc.fadeIn(0.8),
            cc.scaleTo(0.8, 1),
        );
        node.runAction(action);
        console.log('11111111111111111');
    },




>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
    // 隐藏节点
    hideView() {
        this.endPlantAnimation();
        this.node.active = false;
    },

<<<<<<< HEAD
    fadeOut() {
        this.endPlantAnimation1();
        this.scheduleOnce(
            function () {
                this.node.active = false;
            }, 1.5
=======
    fadeOut(){
        this.endPlantAnimation1();
        this.scheduleOnce(
            function(){
                this.node.active=false;
            },1.5
>>>>>>> 662237983afb394cd7d49d6a606109dc170a97d9
        )
    },



    onCollisionEnter: function (other, self) {
        let event = new cc.Event.EventCustom('colliderEvent', true);
        // console.log(event);
        event.detail = { index: this.index };
        this.node.dispatchEvent(event);
    },



    // update (dt) {},
});
