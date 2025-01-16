import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnPayBet extends cc.Component {

    @property(cc.Label)
    lblTotalBet: cc.Label = null;
    @property(cc.Node)
    highLightWin: cc.Node = null;
    @property(cc.Label)
    lblMyBet = null;

    public reset() {
        this.lblTotalBet.string = "0";
        this.lblMyBet.string = "0";
        this.resetHighlightEffect();
    }

    public setTotalBet(coin: number, potId) {
        if(potId == 0 || potId == 1) {
            this.lblTotalBet.string = coin > 0 ? Utils.formatNumber(coin) : "0";
        } else {
            this.lblTotalBet.string = coin > 0 ? Utils.NFormatter(coin) : "0";
        }

    }

    public setMyBet(myBet: number) {
        this.lblMyBet.string = myBet > 0 ? Utils.NFormatter(myBet) : "0";
    }

    public resetHighlightEffect() {
        this.highLightWin.active = false;
        this.highLightWin.stopAllActions();
    }
}
