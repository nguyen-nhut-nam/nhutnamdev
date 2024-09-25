import Dialog from "../../../scripts/common/Dialog";
import GameURL from "../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaiXiuMD5PopupGuide extends Dialog {

    @property(cc.RichText)
    lblMD5WebChecker = null;
    protected onLoad() {
        this.lblMD5WebChecker.string = GameURL.MD5_CHECKER;
    }

    openMD5Checker() {
        cc.sys.openURL(GameURL.MD5_CHECKER);
    }
}
