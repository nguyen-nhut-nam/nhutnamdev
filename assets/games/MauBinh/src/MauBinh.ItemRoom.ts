import MauBinhController from "./MauBinh.Controller";
import Utils from "../../../scripts/common/Utils";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBetMin: cc.Label = null;
    @property(cc.Label)
    labelNumPlayers: cc.Label = null;
    @property(cc.Sprite)
    progressNumPlayers: cc.Sprite = null;

     roomInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(info) {
        this.roomInfo = info;

        this.labelBet.string = this.moneyToK(info["moneyBet"]);
        this.labelBetMin.string = Utils.formatNumber(info["requiredMoney"]);
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
        if(this.roomInfo["requiredMoney"] > Configs.Login.Coin){
            App.instance.ShowAlertDialog("Bạn không đủ tiền vào phòng");
        }else{
            MauBinhController.instance.joinRoom(this.roomInfo);
        }
    }

    // update (dt) {}
}
