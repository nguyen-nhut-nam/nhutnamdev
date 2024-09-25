const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelEditBox extends cc.Component {

    @property(cc.Boolean)
    isWebMobile = false;
    @property(cc.Boolean)
    isPassword = false;
    @property(cc.Label)
    newLabel = null;
    @property(cc.Label)
    oldLabel = null;
    @property(cc.EditBox)
    editBox = null;
    @property(cc.Node)
    placeHolder = null;

    private currentText = "";
    private isRotate = false;
    private isPlaying = false;
    private isStart = false;
    private isEnd = false;
    private countTime = 0;
    private needShow = false;
    protected start() {
        this.newLabel.string = "";
    }

    setString() {
        if(cc.sys.isNative) {
            this.currentText = this.newLabel.string = "";
        }
    }

    resetString() {
        this.editBox.string = this.currentText = this.newLabel.string = "";
    }

    onChangeText() {
        if(this.node) {
            if(cc.sys.isMobile && cc.sys.isBrowser && this.isWebMobile) {
                if(this.isPassword) {
                    if(this.newLabel.string.length !== this.editBox.string.length) {
                        this.newLabel.string = "";
                    }
                    for(let i = 0 ; i < this.editBox.string.length; i++) {
                        this.newLabel.string += "*";
                    }
                } else {
                    this.newLabel.string = this.editBox.string;
                    this.currentText = this.newLabel.string;
                }
            }
        }
    }

    onAddChar() {
        if(cc.sys.isMobile && cc.sys.isBrowser && this.isPlaying && this.isWebMobile) {
            if(this.isPassword && this.currentText.length !== 0) {
                this.currentText = "";
                for(let i = 0 ; i < this.editBox.string.length; i++) {
                    this.currentText += "*";
                }
            }
            this.newLabel.string = this.currentText;
        } else {
            if(cc.sys.isNative && this.isPlaying) {
                if(this.oldLabel.string.length == 0 || this.oldLabel == null) {
                    this.newLabel.string = this.currentText;
                } else {
                    this.newLabel.string = "";
                    this.oldLabel.string = this.currentText;
                }
            }
        }
    }

    isLandscape() {
        return window.orientation == 90 || window.orientation == -90;
    }

    onBeginText() {
        // this.onAddChar();
        if(cc.sys.platform === cc.sys.MOBILE_BROWSER && cc.sys.os === cc.sys.OS_IOS && this.isWebMobile && this.isLandscape()) {
            let edbY = this.node.y;
            if(edbY === 0) {
                edbY = this.node.parent.y;
            }
            let i = (cc.view.getDesignResolutionSize().height / 2 + edbY) * window.innerHeight / cc.view.getDesignResolutionSize().height + this.node.height / 3;
            window.scrollTo(0, 0);
        }
    }

    onEndText() {
        if(cc.sys.platform === cc.sys.MOBILE_BROWSER && cc.sys.os === cc.sys.OS_IOS) {
            window.scrollTo(0,0);
        }
        // this.onAddChar();
    }

    protected update(dt: number) {
        if(cc.sys.platform === cc.sys.MOBILE_BROWSER) {
            if(!this.isRotate && this.isLandscape()) {
                this.isRotate = true;
                this.editBox.blur();
            } else if(this.isRotate && !this.isLandscape()) {
                this.isRotate = false;
                this.editBox.blur();
            }
            window.scrollTo(0, 0);
        }

        if(cc.sys.isMobile && cc.sys.isBrowser && this.isWebMobile || cc.sys.isNative) {
            if(cc.sys.isNative && this.oldLabel.node.opacity !== 255) {
                this.oldLabel.node.opacity = 255;
            }
            if(!this.isPlaying && !this.isEnd) {
                this.isEnd = true;
                this.onChangeText();
            }
            this.countTime += dt;
            if(this.countTime > .4) {
                this.countTime -= .4;
                // this.onAddChar();
                this.needShow = !this.needShow;
            }
        } else {
            if(this.oldLabel.node.opacity != 255) {
                this.oldLabel.node.opacity = 255;
            }
        }
    }
}
