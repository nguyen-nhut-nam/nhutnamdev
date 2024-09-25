import Configs from "../../../../scripts/common/Configs";
import Utils from "../../../../scripts/common/Utils";
import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import ApiIDEnum from "../enum/ApiIDEnum";
import PopupCashout from "./PopupCashout";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabWithdrawCard extends cc.Component {

    @property(cc.Node)
    dropDownCardList = null;
    @property(cc.Prefab)
    templateCard = null;
    @property(cc.Node)
    cardContainer = null;
    @property(cc.Label)
    lblCardInformation = null;

    private _selectedCardId = Configs.App.CASHOUT_CARD_CONFIG.listIdNhaMang[0];
    private _selectCardName = Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang[0];
    private _selectedCardValue = 0;

    protected onLoad() {
        this.setupDropDownBankList();
    }


    setupDropDownBankList() {
        this.cardContainer.removeAllChildren(true);
        for(let i = 0 ; i < Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe.length; i++) {
            let cardValue = Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe[i];
            let cardItem = cc.instantiate(this.templateCard);
            cardItem.getComponent(cc.Label).string = `${this._selectCardName} ${Utils.formatNumber(cardValue)}`;
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TabWithdrawCard";
            clickEventHandler.handler = "actSelectCardValue";
            clickEventHandler.customEventData = cardValue.toString();
            cardItem.getComponent(cc.Button).clickEvents.push(clickEventHandler);
            this.cardContainer.addChild(cardItem);
        }
    }

    actChooseCard(event, data) {
        this._selectedCardId = Configs.App.CASHOUT_CARD_CONFIG.listIdNhaMang[parseInt(data)];
        this._selectCardName = Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang[parseInt(data)];
        this.lblCardInformation.string = `Chọn mệnh giá`;
        this._selectedCardValue = 0;
        this.setupDropDownBankList();
    }

    actOpenDropDownCard() {
        if(this.dropDownCardList.scaleY === 0) {
            this.dropDownCardList.runAction(
                cc.scaleTo(.15, 1, 1)
            );
        } else {
            this.dropDownCardList.runAction(
                cc.scaleTo(.15, 1, 0)
            );
        }
    }

    actSelectCardValue(event, data) {
        this._selectedCardValue = parseInt(data);
        this.lblCardInformation.string = `${this._selectCardName} ${Utils.formatNumber(this._selectedCardValue)}đ`;
        this.actOpenDropDownCard();
    }

    actWithdrawCard() {
        let notEnoughBalanceMsg = 'Số dư không đủ';
        let overDoseSystemMsg = 'Hệ thống đang quá tải. Vui lòng thử lại hoặc liên hệ CSKH';
        let withdrawCardSuccessfullyMsg = 'Rút thẻ thành công';
        let withdrawCardFailedMsg = 'Rút thẻ thất bại. Vui lòng thử lại hoặc liên hệ CSKH';
        let selectCardValue = 'Vui lòng chọn mệnh giá.';
        if(this._selectedCardValue > Configs.Login.Coin) {
            App.instance.actShowThongBao2(notEnoughBalanceMsg);
            return;
        }

        if(this._selectedCardValue === 0) {
            App.instance.actShowThongBao2(selectCardValue);
            return;
        }

        App.instance.showLoading2(true);
        try {
            Http.get(Configs.App.API, {"c": ApiIDEnum.CASH_OUT_CARD, "amount": this._selectedCardValue, "telcoid": this._selectedCardId, "quantity": 1}, (err, res) => {
                App.instance.showLoading2(false);
                if(err != null) {
                    App.instance.actShowThongBao2(overDoseSystemMsg);
                    return;
                }
                if(res.errorCode == 0) {
                    App.instance.alertDialog.showMsg(withdrawCardSuccessfullyMsg);
                    PopupCashout._instance.actCloseWithdraw();
                    PopupCashout._instance.actOpenCashOutTransaction();
                } else {
                    App.instance.alertDialog.showMsg(withdrawCardFailedMsg);
                }
            });
        } catch (ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        } finally {
            App.instance.showLoading2(false);
        }
    }

    resetAllValue() {
        this.lblCardInformation.string = `Chọn mệnh giá`;
        this._selectedCardValue = 0;
    }
}
