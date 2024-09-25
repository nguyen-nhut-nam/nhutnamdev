import PokerController from "./Poker.Controller";
import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBetMin: cc.Label = null;
    @property(cc.Label)
    labelNumPlayers: cc.Label = null;
    @property(cc.Sprite)
    progressNumPlayers: cc.Sprite = null;

    private roomInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(info) {
        this.roomInfo = info;

        this.labelBet.string = this.moneyToK(info["moneyBet"]);
        this.labelBetMin.string = this.moneyToK(info["requiredMoney"]);
        this.labelNumPlayers.string = info["userCount"] + "/" + info["maxUserPerRoom"];
        this.progressNumPlayers.fillRange = info["userCount"] / info["maxUserPerRoom"];
    }

    private moneyToK(money: number): string {
        if(money<=0) return "";
        if (money < 1000) {
            return Utils.formatNumber(money);
        } if(money < 1000000){
            money = parseInt((money / 1000).toString());
            return Utils.formatNumber(money) + "K";
        }
        if( money >= 1000000) {
            money = parseInt((money / 1000000).toString());
            return Utils.formatNumber(money) + "M";
        }
    }

    chooseRoom() {
        PokerController.instance.joinRoom(this.roomInfo);
    }

    // update (dt) {}
}
