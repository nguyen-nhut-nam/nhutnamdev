import nodeUtils from "../../../scripts/common/NodeUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonPayBet extends cc.Component {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Label)
    lblBeted: cc.Label = null;
    @property(cc.Node)
    overlay: cc.Node = null;

    animation : boolean = false;
    count = 0;


    setAnimationOn(){
        // this.animation = true;
        nodeUtils.activeNode(this.overlay);
        this.overlay.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.fadeOut(.3),
                )
            )
        )
    }

    setAnimationOff(){
        this.animation = false;
        nodeUtils.disableNode(this.overlay);
    }

    setShadow() {
        nodeUtils.disableNode(this.overlay);
    }

    update() {
    }
    public reset() {
        this.lblBeted.string = "";
        this.overlay.active = false;
    }

}