import Utils from "../common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardGame_ItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    lblBetRange = null;
    @property(cc.Label)
    labelPlayers: cc.Label = null;
    @property(cc.Sprite)
    progressNumPlayers = null;

    itemInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start() {}

    // update (dt) {}

    initItems(data) {
        cc.log("CardGame_ItemRoom data : ", data);
        this.itemInfo = data;
        this.labelBet.string = this.moneyToK(data.bet);
        this.lblBetRange.string = `${Utils.numFormatter(data.bet)}/${Utils.numFormatter(data.moneyRequire)}`;
        this.labelPlayers.string = `${this.formatGold(data.players)}/${this.formatGold(data.maxUser)}`;
        this.progressNumPlayers.fillRange = data["players"] / data["maxUser"];
    }

    scale(factor) {
        this.node.scale = factor;
    }

    chooseRoom() {
        cc.log("CardGame_ItemRoom chooseRoom : ", this.itemInfo);
        let controller = null;
        switch (this.itemInfo.gameId) {
            case 0:
            case 1:
                controller = this.node.parent.parent.parent.parent.getComponent("TienLen.Room");
                controller.handleJoinRoom(this.itemInfo);
                break;

            default:
                break;
        }
        cc.log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent);
        cc.log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent.parent);
        cc.log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent.parent.parent);
    }

    formatGold(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

    

}