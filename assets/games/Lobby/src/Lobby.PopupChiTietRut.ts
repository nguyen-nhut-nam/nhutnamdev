import Dialog from "../../../scripts/common/Dialog";


const { ccclass, property } = cc._decorator;


@ccclass
export default class LobbyPopupChiTietRut extends Dialog {
    @property(cc.Label)
    lblTxt: cc.Label = null;

    public showDetail(txt) {
        this.lblTxt.string = txt;
        super.show();
    }
}