import help = cc._decorator.help;

const {ccclass, property} = cc._decorator;

@ccclass
export default class CanvasScene extends cc.Component {

    private fitHeight = false;
    private fitWidth = false;
    private designRatio = 1;
    private screenRatio = 1;
    private scaleRatio = 1;
    private prescaleRatio = 1;
    private designResolution = null;
    private resizeMobileCallBack = null;
    private onSizeChangeCallBack = null;
    private listSizeChangeCallBack = [];

    protected onLoad() {
        cc.debug.setDisplayStats(false);
        cc.sys.dump();
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            this.fitHeight = false;
            this.fitWidth = false;
            this.designResolution.width = 1560;
            this.designResolution.height = 720;
            cc.winSize.width = this.designResolution.width;
            cc.winSize.height = this.designResolution.height;
            cc.view.setDesignResolutionSize(this.designResolution.width, this.designResolution.height, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            cc.view.setResizeCallback(() => {
                this.updateDesktopSize();
            });
            this.updateDesktopSize();
        } else {
            this.updateSize();
            if(cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                cc.view.setResizeCallback(() => {
                    this.updateWebMobileSize();
                });
                if(this.resizeMobileCallBack != null) {
                    this.resizeMobileCallBack();
                }
            }
        }
    }

    protected start() {
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER) {
        }
    }

    addSizeChangedCallback(callback) {
        if(callback) {
            this.listSizeChangeCallBack.push(callback);
        }
    }

    updateWebMobileSize() {
        this.updateDesktopSize();
    }

    updateDesktopSize() {
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            let ratioWidth = this.designResolution.width / 1560;
            let ratioHeight = this.designResolution.height / 720;
            cc.winSize.width = 1560;
            cc.winSize.height = 720;
            this.designResolution.width = 1560;
            this.designResolution.height = 720;
            this.scaleRatio = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;
            if(this.scaleRatio >= .99 && this.scaleRatio <= 1) {
                this.scaleRatio = 1;
            }
            this.scaleRatio = 1;
            this.designRatio = 1;
            this.screenRatio = 1;
            if(this.onSizeChangeCallBack) {
                this.onSizeChangeCallBack();
            }
            for(let i = 0 ; i < this.listSizeChangeCallBack.length; i++) {
                try {
                    this.listSizeChangeCallBack[i]();
                } catch(ex) {
                    this.listSizeChangeCallBack.splice(i, 1);
                    i--;
                }
            }
        }
    }

    updateSize() {
        let scaleRatio = this.scaleRatio;
        this.prescaleRatio = scaleRatio;
        this.designRatio = this.designResolution.width / this.designResolution.height;
        this.screenRatio = cc.winSize.width / cc.winSize.height;
        let ratioWidth = this.designResolution.width / cc.winSize.width;
        let ratioHeight = this.designResolution.height / cc.winSize.height;

        if(ratioWidth < ratioHeight) {
            this.scaleRatio = ratioWidth;
            this.fitWidth = false;
            this.fitHeight = true;
        } else {
            this.scaleRatio = ratioHeight;
            this.fitWidth = true;
            this.fitHeight = false;
        }
        if(this.scaleRatio >= .99 && this.scaleRatio <= 1) {
            this.scaleRatio = 1;
        }
        if(this.onSizeChangeCallBack) {
            this.onSizeChangeCallBack();
        }
    }

    getScaleRatio() {
        if(cc.Canvas.instance == null) {
            return 1;
        }
        let canvasSize = cc.size(1560, 720)
        let scale = 1;
        if(canvasSize.width / cc.winSize.width > canvasSize.height / cc.winSize.height) {
            scale = cc.winSize.width / canvasSize.width;
        } else {
            scale = cc.winSize.height / canvasSize.height;
        }

        if(scale >= .99 && scale <= 1) {
            scale = 1;
        }
        this.scaleRatio = scale;
        return this.scaleRatio;
    }

    getBackgroundRatio() {
        if(cc.Canvas.instance == null) {
            return 1;
        } else {
            if(cc.Canvas.instance.designResolution.width / cc.winSize.width > cc.Canvas.instance.designResolution.height / cc.winSize.height) {
                return cc.winSize.height / cc.Canvas.instance.designResolution.height;
            } else {
                return cc.winSize.width / cc.Canvas.instance.designResolution.width
            }
        }
    }
}
