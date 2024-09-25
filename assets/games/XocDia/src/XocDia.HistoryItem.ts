import {common} from "../../../scripts/common/Utils";
import Utils = common.Utils;
import XocDiaResultGate from "./XocDia.ResultGate";
import XocDiaGateNameMapping from "./XocDia.GateNameMapping";
import XocDiaResultNameMapping from "./XocDia.ResultNameMapping";

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
export default class XocDiaHistoryItem extends cc.Component {

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
            case XocDiaResultGate.CHAN:
                return XocDiaGateNameMapping.CHAN;
            case XocDiaResultGate.LE:
                return XocDiaGateNameMapping.LE;
            case XocDiaResultGate.LE_3_TRANG:
                return XocDiaGateNameMapping.LE_3_TRANG;
            case XocDiaResultGate.LE_3_DO:
                return XocDiaGateNameMapping.LE_3_DO;
            case XocDiaResultGate.CHAN_4_TRANG:
                return XocDiaGateNameMapping.CHAN_4_TRANG;
            case XocDiaResultGate.CHAN_4_DO:
                return XocDiaGateNameMapping.CHAN_4_DO;
            default:
                return "";
        }
    }

    private convertStringToResult(_transactionResult) {
        switch (_transactionResult) {
            case XocDiaResultGate.CHAN:
                return XocDiaResultNameMapping.CHAN;
            case XocDiaResultGate.LE:
                return XocDiaResultNameMapping.LE;
            case XocDiaResultGate.LE_3_TRANG:
                return XocDiaResultNameMapping.LE_3_TRANG;
            case XocDiaResultGate.LE_3_DO:
                return XocDiaResultNameMapping.LE_3_DO;
            case XocDiaResultGate.CHAN_4_TRANG:
                return XocDiaResultNameMapping.CHAN_4_TRANG;
            case XocDiaResultGate.CHAN_4_DO:
                return XocDiaResultNameMapping.CHAN_4_DO;
            default:
                return "";
        }
    }
}
