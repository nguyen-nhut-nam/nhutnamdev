import Configs from "../../../../scripts/common/Configs";
import Utils from "../../../../scripts/common/Utils";
import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import GameErrorMessage from "../../../../scripts/enum/GameErrorMessage";
import PopupShop from "./PopupShop";
import ApiIDEnum from "../enum/ApiIDEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    dropDownCardList = null;
    @property(cc.Prefab)
    templateCard = null;
    @property(cc.Node)
    cardContainer = null;
    @property(cc.Label)
    lblCardInformation = null;
    @property(cc.EditBox)
    edbCardSerial = null;
    @property(cc.EditBox)
    edbCardNumber = null;
    @property(cc.Node)
    exchangeRateContainer = null;
    @property(cc.Node)
    nodeExchangeRateTemp = null;

    private _selectedCardId = Configs.App.CASHOUT_CARD_CONFIG.listIdNhaMang[0];
    private _selectCardName = Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang[0];
    private _selectedCardValue = 0;

    protected onLoad() {
        this.setupDropDownBankList();
        this.generateListExchangeRate();
    }

    generateListExchangeRate() {
        this.exchangeRateContainer.removeAllChildren(true);
        let ratioExchange = 0;
        switch (this._selectedCardId) {
            case "VT":
                ratioExchange = Configs.App.SERVER_CONFIG.ratioNapTheVTT;
                break;
            case "VN":
                ratioExchange = Configs.App.SERVER_CONFIG.ratioNapTheVNP;
                break;
            case "MB":
                ratioExchange = Configs.App.SERVER_CONFIG.ratioNapTheVMS;
                break;
        }
        for(let i = 0 ; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            let valueCard = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i];
            let nodeExchangeRate = cc.instantiate(this.nodeExchangeRateTemp);
            nodeExchangeRate.children[0].getComponent(cc.Label).string = `${Utils.formatNumber(valueCard)} VNĐ`;
            nodeExchangeRate.children[1].children[0].getComponent(cc.Label).string = `${Utils.formatNumber(valueCard * ratioExchange)}`
            this.exchangeRateContainer.addChild(nodeExchangeRate);
        }
    }

    setupDropDownBankList() {
        this.cardContainer.removeAllChildren(true);
        for(let i = 0 ; i < Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe.length; i++) {
            let cardValue = Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe[i];
            let cardItem = cc.instantiate(this.templateCard);
            if(i == Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe.length - 1) {
                cardItem.children[0].active = false;
            }
            cardItem.getComponent(cc.Label).string = `${this._selectCardName} ${Utils.formatNumber(cardValue)}`;
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TabChargeCard";
            clickEventHandler.handler = "actSelectCardValue";
            clickEventHandler.customEventData = cardValue.toString();
            cardItem.getComponent(cc.Button).clickEvents.push(clickEventHandler);
            this.cardContainer.addChild(cardItem);
        }
    }

    actChooseCard(event, data) {
        this._selectedCardId = Configs.App.CASHOUT_CARD_CONFIG.listIdNhaMang[parseInt(data)];
        this._selectCardName = Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang[parseInt(data)];
        this.generateListExchangeRate();
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

    actChargeCard() {
        let code = this.edbCardNumber.string.trim();
        let serial = this.edbCardSerial.string.trim();
        if(this._selectedCardValue == 0) {
            App.instance.actShowThongBao(GameErrorMessage.INVALID_CARD_VALUE);
            return;
        }

        if (code == "" || parseInt(code) <= 0 || isNaN(parseInt(code))) {
            App.instance.actShowThongBao2("Mã thẻ không hợp lệ.");
            return;
        }
        if (serial == "" || parseInt(serial) <= 0 || isNaN(parseInt(serial))) {
            App.instance.actShowThongBao2("Mã serial không hợp lệ.");
            return;
        }

        App.instance.showLoading2(true);
        Http.get(Configs.App.API, {
            "c": ApiIDEnum.CHARGE_CARD,
            "cardtype": this._selectedCardId,
            "pin": code,
            "seri": serial,
            "amount": this._selectedCardValue
        }, (err, res) => {
            if (err != null)
            {
                App.instance.alertDialog.showMsg("Hệ thống đang quá tải. Vui lòng thử lại hoặc liên hệ CSKH");
                App.instance.showLoading2(false);
                return;
            }
            if (res.stt == 1) {
                App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
                PopupShop._instance.actOpenChargeTransaction();
                PopupShop._instance.actCloseShop(null);
                this.clearAllEditBox();
            } else {
                App.instance.alertDialog.showMsg(res.msg);
            }
            App.instance.showLoading2(false);
        });
    }

    clearAllEditBox() {
        this.edbCardNumber.string = "";
        this.edbCardSerial.string = "";
    }
}
