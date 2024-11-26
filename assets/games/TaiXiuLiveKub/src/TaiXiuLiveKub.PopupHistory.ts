import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import Popup from "../../../scripts/common/Popup";
import ApiIDEnum from "../../Lobby/src/enum/ApiIDEnum";
import TaiXiuKuBetController from "./TaiXiuLiveKub.TaiXiuLiveKubController";

const { ccclass, property } = cc._decorator;

enum BetDoor {
    Xiu, Tai, Chan, Le
}

namespace taixiukubet {
    @ccclass
    export class PopupHistory extends Popup {

        @property(cc.Label)
        lblPage: cc.Label = null;
        @property(cc.Node)
        itemTemplate: cc.Node = null;

        private page: number = 1;
        private maxPage: number = 1;
        private items = new Array<cc.Node>();

        protected onLoad() {
            this.loadData();
        }

        runActionClose() {
            super.runActionClose();
            TaiXiuKuBetController.instance.toggleVideoLiveStream(true);
            TaiXiuKuBetController.instance.isOpenPopup = false;
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
            Http.get(Configs.App.API, { "c": ApiIDEnum.GET_MY_HISTORY_LIVE_TX, "p": this.page, "un": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                if (err != null) return;
                if (!res["success"]) return;

                if (this.items.length == 0) {
                    for (var i = 0; i < 10; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                this.maxPage = res["totalPages"] ? res["totalPages"] : 1;
                this.lblPage.string = this.page + "";
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["transactions"].length) {
                        let itemData = res["transactions"][i];
                        let betDoor = itemData["betSide"] == 1 ? "Tài" : "Xỉu";
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("lblSession").getComponent(cc.Label).string = "#" + itemData["referenceId"];

                        item.getChildByName("lblTime").getComponent(cc.Label).string = itemData["timestamp"].split(" ")[0].split(" ").reverse() + '\n' + itemData["timestamp"].split(" ")[1].replace(/\//gi, "-");
                        switch (itemData["betSide"]) {
                            case BetDoor.Xiu:
                                item.getChildByName("lblBetDoor").getComponent(cc.Label).string = 'Xỉu';
                                break;
                            case BetDoor.Tai:
                                item.getChildByName("lblBetDoor").getComponent(cc.Label).string = 'Tài';
                                break;
                            case BetDoor.Chan:
                                item.getChildByName("lblBetDoor").getComponent(cc.Label).string = 'Chẵn';
                                break;
                            case BetDoor.Le:
                                item.getChildByName("lblBetDoor").getComponent(cc.Label).string = 'Lẻ';
                                break;
                        }
                        let tienThang = itemData["totalPrize"];
                        item.getChildByName("lblWin").getComponent(cc.Label).string = "+" + Utils.formatNumber(tienThang);
                        if(itemData['resultPhien'] > 10) {
                            if(Utils.checkNumberEven(itemData['resultPhien'])) {
                                item.getChildByName("lblResult").getComponent(cc.Label).string = `${itemData['resultPhien']}-Tài-Chẵn`;
                            } else {
                                item.getChildByName("lblResult").getComponent(cc.Label).string = `${itemData['resultPhien']}-Tài-Lẻ`;
                            }
                        } else {
                            if(Utils.checkNumberEven(itemData['resultPhien'])) {
                                item.getChildByName("lblResult").getComponent(cc.Label).string = `${itemData['resultPhien']}-Xỉu-Chẵn`;
                            } else {
                                item.getChildByName("lblResult").getComponent(cc.Label).string = `${itemData['resultPhien']}-Xỉu-Lẻ`;
                            }
                        }
                        item.getChildByName("lblBet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
                        if (itemData["totalRefund"] > 0) {
                            item.getChildByName("lblRefund").getComponent(cc.Label).node.color = cc.Color.BLACK.fromHEX("#f70100");
                        }
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            });
        }
    }
}
export default taixiukubet.PopupHistory;