import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";
import GameName from "../../../scripts/enum/GameName";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHonors extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    show() {
        this.endScale = 1.23;
        this.showScale = 1.27
        super.show();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;


    }

    dismiss(){
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
        // GameGetLeaderBoard.getInstance().getGameLeaderBoard(GameName.WHISKY, "DAY", (res) => {
        Http.get(Configs.App.API, {"c": 135, "mt": Configs.App.MONEY_TYPE, "p": this.page, "un": Configs.Login.Nickname}, (err, res) => {
            //if (err != null) return;
            if (res["success"]) {
                if (this.items.length == 0) {
                    for (var i = 0; i < 10; i++) {
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
                        item.getChildByName("bg").active = i % 2 == 0;
                        item.getChildByName("STT").getComponent(cc.Label).string = `${i+1}`;
                        item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"].split(" ").join("\n");
                        item.getChildByName("Account").getComponent(cc.Label).string = itemData["un"];
                        item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                        item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                        switch (itemData["rs"]) {
                            case 3:
                                item.getChildByName("Result").getComponent(cc.Label).string = "NỔ HŨ";
                                break;
                            default:
                                item.getChildByName("Result").getComponent(cc.Label).string = "THẮNG LỚN";
                                break
                        }
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            }
        });
    }
}
