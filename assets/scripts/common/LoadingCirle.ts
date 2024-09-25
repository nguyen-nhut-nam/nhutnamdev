
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingCirle extends cc.Component {


    @property(cc.Node)
    loadingSun: cc.Node = null;
    @property(cc.Node)
    loadingSprSun: cc.Node = null;
    @property(cc.Label)
    loadingLabelSun: cc.Label = null;

    showLoadingSun(isShow, rate? ){

        if(isShow){
            this.loadingSun.active = true;
            this.loadingLabelSun.string = rate < 0 ? "0%" : parseInt("" + (rate * 100)) + "%";
            //     this.loadingLabelB52.string =  parseInt("" + (rate * 100)) + "%";
            this.loadingSprSun.getComponent(cc.Sprite).fillRange= -rate;
        }else{
            this.loadingSun.active = false;
        }

    }

    start () {

    }

    // update (dt) {}
}
