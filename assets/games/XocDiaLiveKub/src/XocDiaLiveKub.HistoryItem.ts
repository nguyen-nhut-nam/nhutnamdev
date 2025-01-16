import {common} from "../../../scripts/common/Utils";
import Utils = common.Utils;
import XocDiaLiveKubResultGate from "./XocDiaLiveKub.ResultGate";
import XocDiaLiveKubGateNameMapping from "./XocDiaLiveKub.GateNameMapping";
import XocDiaLiveKubResultNameMapping from "./XocDiaLiveKub.ResultNameMapping";

const {ccclass, property} = cc._decorator;
let betGate = {
    "zeroWhite": "4 ĐỎ",
    "fourWhite": "4 TRẮNG",
    "threeWhite": "3 TRẮNG",
    "oneWhite": "1 TRẮNG",
    "even": "CHẴN",
    "odd": "LẺ"
}
@ccclass
export default class XocDiaLiveKubHistoryItem extends cc.Component {

    @property(cc.Label)
    lblSessionId = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblMyBet = null;
    @property(cc.Label)
    lblResult = null;
    @property(cc.Label)
    lblTotalWin = null;

    private initHistoryItem(_transactionItem, _index) {
        let strMyBet = "";
        let objKey = Object.keys(_transactionItem.betResult);
        let count = 0;
        for(let i = 0; i < objKey.length; i++) {
            if(_transactionItem.betResult[objKey[i]] != 0) {
                if(count == 2) {
                    strMyBet += `\n`;
                }
                count++;
                strMyBet += `${this.convertStringToMyBet(objKey[i])}: ${Utils.NFormatter(_transactionItem.betResult[objKey[i]])}, `;
            }

        }
        strMyBet = strMyBet.slice(0, -2);
        this.lblMyBet.string = strMyBet;

        this.lblSessionId.string = _transactionItem.referenceId;
        this.lblTime.string = _transactionItem["timestamp"] ? _transactionItem["timestamp"].split(" ").join("\n") : "";
        this.lblResult.string = this.convertStringToResult(_transactionItem.result);
        this.lblTotalWin.string = `${Utils.formatNumber(_transactionItem.totalExchange + _transactionItem.totalPrize)}`;
    }

    private convertStringToMyBet(_transactionResult) {
        switch (_transactionResult) {
            case XocDiaLiveKubResultGate.CHAN:
                return XocDiaLiveKubGateNameMapping.CHAN;
            case XocDiaLiveKubResultGate.LE:
                return XocDiaLiveKubGateNameMapping.LE;
            case XocDiaLiveKubResultGate.LE_3_TRANG:
                return XocDiaLiveKubGateNameMapping.LE_3_TRANG;
            case XocDiaLiveKubResultGate.LE_3_DO:
                return XocDiaLiveKubGateNameMapping.LE_3_DO;
            case XocDiaLiveKubResultGate.CHAN_4_TRANG:
                return XocDiaLiveKubGateNameMapping.CHAN_4_TRANG;
            case XocDiaLiveKubResultGate.CHAN_4_DO:
                return XocDiaLiveKubGateNameMapping.CHAN_4_DO;
            default:
                return "";
        }
    }

    private convertStringToResult(_transactionResult) {
        switch (_transactionResult) {
            case XocDiaLiveKubResultGate.CHAN:
                return XocDiaLiveKubResultNameMapping.CHAN;
            case XocDiaLiveKubResultGate.LE:
                return XocDiaLiveKubResultNameMapping.LE;
            case XocDiaLiveKubResultGate.LE_3_TRANG:
                return XocDiaLiveKubResultNameMapping.LE_3_TRANG;
            case XocDiaLiveKubResultGate.LE_3_DO:
                return XocDiaLiveKubResultNameMapping.LE_3_DO;
            case XocDiaLiveKubResultGate.CHAN_4_TRANG:
                return XocDiaLiveKubResultNameMapping.CHAN_4_TRANG;
            case XocDiaLiveKubResultGate.CHAN_4_DO:
                return XocDiaLiveKubResultNameMapping.CHAN_4_DO;
            default:
                return "";
        }
    }
}
