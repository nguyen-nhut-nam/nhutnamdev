import App from "../../../scripts/common/App";
import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import XocDiaHonorItem from "./XocDia.HonorItem";
import XocDiaHistoryItem from "./XocDia.HistoryItem";
import Popup from "../../../scripts/common/Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaPopupHistory extends Popup {
    @property(cc.Node)
    nodeHistoryTemplate = null;
    @property(cc.Node)
    transactionContainer = null;
    @property(cc.Label)
    lblCurrentPage = null;
    @property(cc.Node)
    btnNext = null;
    @property(cc.Node)
    btnPrevious = null;

    private _maxPages = 1;
    private _currentPage = 1;

    protected onLoad() {
        super.onLoad();
        this._getListHistory();

    }

    private _getListHistory() {
        let params = {
            "c": 4106, "p": this._currentPage, "un": Configs.Login.Nickname
        };

        Http.get(Configs.App.API, params, (err, res) => {
            // if (err != null) return;
            // if (!res["success"]) return;
            this._maxPages = res['totalPages'];
            let listTransactions = res['transactions'];

            for (let i = 0; i < listTransactions.length; i++) {
                let item = listTransactions[i];
                let nodeHonor = cc.instantiate(this.nodeHistoryTemplate);
                nodeHonor.getComponent(XocDiaHistoryItem).initHistoryItem(item, i);
                this.transactionContainer.addChild(nodeHonor);
            }
        });
    }

    actNextPage() {
        if (this._currentPage < this._maxPages) {
            this._currentPage++;
            this.lblCurrentPage.string = this._currentPage + "";
            this.transactionContainer.removeAllChildren(true);
            this._getListHistory();
        }
    }

    actPrevPage() {
        if (this._currentPage > 1) {
            this._currentPage--;
            this.lblCurrentPage.string = this._currentPage + "";
            this.transactionContainer.removeAllChildren(true);
            this._getListHistory();
        }
    }
}
