import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import XocDiaLiveKubHistoryItem from "./XocDiaLiveKub.HistoryItem";
import Popup from "../../../scripts/common/Popup";
import XocDiaLiveKubController from "./XocDiaLiveKub.XocDiaController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubPopupHistory extends Popup {
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
            "c": 44106, "p": this._currentPage, "un": Configs.Login.Nickname
        };

        Http.get(Configs.App.API, params, (err, res) => {
            // if (err != null) return;
            // if (!res["success"]) return;
            this._maxPages = res['totalPages'];
            let listTransactions = res['transactions'];

            for (let i = 0; i < listTransactions.length; i++) {
                let item = listTransactions[i];
                let nodeHonor = cc.instantiate(this.nodeHistoryTemplate);
                nodeHonor.getComponent(XocDiaLiveKubHistoryItem).initHistoryItem(item, i);
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

    runActionClose() {
        super.runActionClose(() => {
            XocDiaLiveKubController.getInstance().toggleLiveStreamVideo(true);
            XocDiaLiveKubController.getInstance().setIsOpenPopup(false);
        });
    }
}
