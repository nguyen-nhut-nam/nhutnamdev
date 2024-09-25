const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotPopupBase extends cc.Component {
    public static instance: SlotPopupBase = null;
    @property(cc.Node)
    popup = null;
    @property(cc.Node)
    bg = null;
    private nodeAnimations = [];
    private nodeAnimationDownUp = [];
    private arrayEditBox = [];
    private posStart = cc.v2(0,0);
    private showCallBack = null;
    private hideCallBack = null;
    private isDestroyOnHide = true;
    private isShowDone = false;
    private positionOriginalBoard = cc.v2(0,0);
    private canCloseWhenChangeScene = true;

    onLoad() {
        if (SlotPopupBase.instance != null) {
            this.node.destroy();
            return;
        }
        SlotPopupBase.instance = this;
        this.posStart = cc.v2(this.popup.x, 0);
    }

    protected start() {
        this.positionOriginalBoard = this.popup.position;
    }

    private setShowCallBack(enabled) {
        this.showCallBack = enabled;
    }

    private setHideCallBack(enabled) {
        this.hideCallBack = enabled;
    }

    public show(controller, duration = .4, scale = 1, n = false) {
        let self = this;
        if(this.popup != null) {
            this.node.active = true;
            this.popup.scale = 1;
            this.popup.active = true;
            this.popup.position = this.positionOriginalBoard;
            if(this.bg != null) {
                this.bg.active = true;
                this.bg.opacity = 0;
                this.bg.stopAllActions();
                this.bg.runAction(
                    cc.fadeTo(.2, 178.5),
                );
                this.popup.stopAllActions();
                this.popup.runAction(cc.fadeIn(duration));
                this.isShowDone = true;
                this.popup.scaleX = 1;
                this.popup.scaleY = .5;
                this.popup.stopAllActions();

                this.popup.runAction(
                    cc.sequence(
                        cc.scaleTo(.3, scale).easing(cc.easeBackOut()),
                        cc.callFunc(function() {
                            self.positionOriginalBoard = self.popup.position;
                        })
                    )
                )
            }
        }
    }

    public hide (t, e = .4, i = true, n = true) {
        let self = this;
        if(this.bg != null) {
            this.bg.stopAllActions();
            this.bg.runAction(cc.fadeOut(.2));
            this.popup.runAction(
                cc.sequence(
                    cc.moveTo(.2, cc.v2(self.popup.x, self.popup.y + 40)),
                    cc.moveBy(.3, cc.v2(0, -cc.winSize.height)),
                    cc.callFunc(function() {
                        self.isShowDone = false;
                        self.node.active = false;
                        self.node.position = self.posStart;
                    })
                )
            )
        }
    }




}
