import Dialog from "../../../scripts/common/Dialog";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHistory extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.SpriteAtlas)
    sprAtlasCards: cc.SpriteAtlas = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    show() {
        this.endScale = 1.23;
        this.showScale = 1.27;
        super.show();

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;


    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "";
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "";
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "";
            this.loadData();
        }
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 107, "mt": Configs.App.MONEY_TYPE, "p": this.page, "nn": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (res["success"]) {

                if (this.items.length == 0) {
                    for (let i = 0; i < 10; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        item.active = false;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "";
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["results"].length) {
                        let itemData = res["results"][i];
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("Session").getComponent(cc.Label).string = "#" + itemData["transId"];
                        item.getChildByName("Time").getComponent(cc.Label).string = itemData["timestamp"].split(" ").join("\n");
                        item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
                        let cardId = "card" + this.getindex(itemData["cards"]);
                        item.getChildByName("Result").getComponent(cc.Label).string = itemData["cards"];
                        nodeUtils.setSpriteFrame(item.getChildByName("Result"), this.sprAtlasCards.getSpriteFrame(`CardID_${cardId}`));
                        item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(itemData["prize"]);
                        item.getChildByName("Step").getComponent(cc.Label).string = Utils.formatNumber(itemData["step"]);
                        if (itemData["step"] == 1) {
                            item.getChildByName("BetDoor").getComponent(cc.Label).string = "";
                        } else {
                            item.getChildByName("BetDoor").getComponent(cc.Label).string = itemData["potBet"] == 0 ? "Dưới" : "Trên";
                        }
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            }
        });
    }

    getindex(cardResilt: String) {
        switch (cardResilt) {
            case '2♠':
                return 0;
            case '2♣':
                return 1;
            case '2♦':
                return 2;
            case '2♥':
                return 3;
            case '3♠':
                return 4;
            case '3♣':
                return 5;
            case '3♦':
                return 6;
            case '3♥':
                return 7;
            case '4♠':
                return 8;
            case '4♣':
                return 9;
            case '4♦':
                return 10;
            case '4♥':
                return 11;
            case '5♠':
                return 12;
            case '5♣':
                return 13;
            case '5♦':
                return 14;
            case '5♥':
                return 15;
            case '6♠':
                return 16;
            case '6♣':
                return 17;
            case '6♦':
                return 18;
            case '6♥':
                return 19;
            case '7♠':
                return 20;
            case '7♣':
                return 21;
            case '7♦':
                return 22;
            case '7♥':
                return 23;
            case '8♠':
                return 24;
            case '8♣':
                return 25;
            case '8♦':
                return 26;
            case '8♥':
                return 27;
            case '9♠':
                return 28;
            case '9♣':
                return 29;
            case '9♦':
                return 30;
            case '9♥':
                return 31;
            case '10♠':
                return 32;
            case '10♣':
                return 33;
            case '10♦':
                return 34;
            case '10♥':
                return 35;
            case 'J♠':
                return 36;
            case 'J♣':
                return 37;
            case 'J♦':
                return 38;
            case 'J♥':
                return 39;
            case 'Q♠':
                return 40;
            case 'Q♣':
                return 41;
            case 'Q♦':
                return 42;
            case 'Q♥':
                return 43;
            case 'K♠':
                return 44;
            case 'K♣':
                return 45;
            case 'K♦':
                return 46;
            case 'K♥':
                return 47;
            case 'A♠':
                return 48;
            case 'A♣':
                return 49;
            case 'A♦':
                return 50;
            case 'A♥':
                return 51;
            default :
                return 0;
        }
    }
}
