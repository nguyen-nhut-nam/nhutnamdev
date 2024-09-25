import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTransaction extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private tabSelectedIdx = 0;

    protected onLoad() {
        this.loadData();
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
        this.lblPage.string = this.page +"";
        this.loadData();
    }

    show() {
        super.show();

        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page +"";
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

    private updateTabsTitleColor() {
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
    }

    private loadData() {
        let params = null;
        switch (this.tabSelectedIdx) {
            case 0:
                params = { "c": 302, "nn": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "p": this.page };
                break;
            case 1:
                params = { "c": 302, "nn": Configs.Login.Nickname, "mt": 3, "p": this.page };
                break;
            case 2:
                params = { "c": 302, "nn": Configs.Login.Nickname, "mt": 5, "p": this.page };
                break;
        }
        Http.get(Configs.App.API, params, (err, res) => {
            if (err != null) return;
            if (res["success"]) {

                if (this.items.length == 0) {
                    for (var i = 0; i < 5; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "";
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["transactions"].length) {
                        let itemData = res["transactions"][i];
                        item.getChildByName("bg").active = i % 2 == 0;
                        item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
                        let localeDateTime = itemData["transactionTime"];
                        item.getChildByName("Time").getComponent(cc.Label).string = localeDateTime.split(" ")[1].split(" ").reverse() + '\n' + localeDateTime.split(" ")[0].split("-").reverse().join("-");
                        item.getChildByName("Service").getComponent(cc.Label).string = itemData["serviceName"];
                        item.getChildByName("CoinLost").getComponent(cc.Label).string = Utils.formatNumber(itemData["moneyExchange"]);
                        item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
                        item.getChildByName("Desc").getComponent(cc.Label).string = itemData["description"];
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            }
        });
    }
    private loadCard(time: string) {
        let params = { "c": 2001, "nickname": Configs.Login.Nickname, "token": Configs.Login.AccessToken, "transTime": encodeURI(time) };
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading2(false);
            if (err != null) return;

            if (res == "") {
                return;
            }
        })
    }

}
