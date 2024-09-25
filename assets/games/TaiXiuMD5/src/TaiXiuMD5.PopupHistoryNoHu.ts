import Dialog from "../../../scripts/common/Dialog";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHistoryNoHu extends Dialog {

        @property(cc.Label)
        lblPage: cc.Label = null;

        @property(cc.Label)
        tileTai: cc.Label = null;
        @property(cc.Label)
        tileXiu: cc.Label = null;
        @property(cc.Label)
        accName1: cc.Label = null;
        @property(cc.Label)
        accName2: cc.Label = null;
        @property(cc.Label)
        accName3: cc.Label = null;
        @property(cc.Label)
        accName4: cc.Label = null;
        @property(cc.Label)
        accName5: cc.Label = null;

        @property(cc.Label)
        lblSession: cc.Label = null;
        @property(cc.Label)
        lblTime: cc.Label = null;
        @property(cc.Label)
        lblResult: cc.Label = null;
        @property(cc.Label)
        lblMoneyNoHu: cc.Label = null;
        @property(cc.Label)
        valueWin1: cc.Label = null;
        @property(cc.Label)
        valueWin2: cc.Label = null;
        @property(cc.Label)
        valueWin3: cc.Label = null;
        @property(cc.Label)
        valueWin4: cc.Label = null;
        @property(cc.Label)
        valueWin5: cc.Label = null;
        @property(cc.Node)
        lblResultAniTai: cc.Node = null;
        @property(cc.Node)
        lblResultAniXiu: cc.Node = null;

        private page: number = 1;
        private maxPage: number = 1;
        private items = new Array<cc.Node>();

        show() {
            super.show();
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
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }

        actNextPage() {
            if (this.page < this.maxPage) {
                this.page++;
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadData();
            }
        }

        actPrevPage() {
            if (this.page > 1) {
                this.page--;
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadData();
            }
        }

        private loadData() {
            App.instance.showLoading2(true);
            Http.get(Configs.App.API, { "c": 55139, "p": this.page }, (err, res) => {
                App.instance.showLoading2(false);
                if (err != null) return;
                if (!res["success"]) return;
                this.maxPage = 20;
                let countTile = 0;
                this.lblPage.string = this.page + "/" + this.maxPage;
                for (let i = 0; i < 1; i++) {
                    if (i < res["nohuTXDetails"].length) {
                        let itemData = res["nohuTXDetails"][i];
                        if (itemData["result"] == 1) {
                            this.lblResultAniTai.active = true
                            this.lblResultAniXiu.active = false
                            countTile++;
                        } else {
                            this.lblResultAniTai.active = false
                            this.lblResultAniXiu.active = true
                        }
                        var str = itemData["username"];
                        var splitted = str.split(",");
                        var str = itemData["userMoneyHu"];
                        var splittedUserMoneyHu = str.split(",");
                        this.lblSession.string = "" + itemData["phien"]
                        this.lblTime.string = "" + itemData["time"]
                        //this.lblResult.string = result
                        this.lblMoneyNoHu.string = "" + Utils.formatNumber(itemData["money"])
                        this.accName1.string = "" + splitted[0];
                        this.accName2.string = "" + splitted[1];
                        this.accName3.string = "" + splitted[2];
                        this.accName4.string = "" + splitted[3];
                        this.accName5.string = "" + splitted[4];
                        this.valueWin1.string = "" + Utils.formatNumber(splittedUserMoneyHu[0]);
                        this.valueWin2.string = "" + Utils.formatNumber(splittedUserMoneyHu[1]);
                        this.valueWin3.string = "" + Utils.formatNumber(splittedUserMoneyHu[2]);
                        this.valueWin4.string = "" + Utils.formatNumber(splittedUserMoneyHu[3]);
                        this.valueWin5.string = "" + Utils.formatNumber(splittedUserMoneyHu[4]);
                    }else{
                        this.lblSession.string = "";
                        this.lblTime.string = "";
                        this.lblResultAniTai.active = false;
                        this.lblResultAniXiu.active = false;
                        this.lblMoneyNoHu.string = "";
                        this.accName1.string = "";
                        this.accName2.string = "";
                        this.accName3.string = "";
                        this.accName4.string = "";
                        this.accName5.string = "";
                        this.valueWin1.string = "";
                        this.valueWin2.string = "";
                        this.valueWin3.string = "";
                        this.valueWin4.string = "";
                        this.valueWin5.string = "";
                    } 
                }
                this.tileTai.string = ((countTile / 5) * 100) + "%";
                this.tileTai.node.active = true;
                this.tileXiu.string = (100 - ((countTile / 5) * 100)) + "%";
                this.tileXiu.node.active = true;
            });
        }
    }
}
export default taixiumini.PopupHistoryNoHu;