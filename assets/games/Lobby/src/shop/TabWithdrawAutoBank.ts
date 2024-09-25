import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import Configs from "../../../../scripts/common/Configs";
import Utils from "../../../../scripts/common/Utils";
import ApiIDEnum from "../enum/ApiIDEnum";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import LobbyLobbyController from "../Lobby.LobbyController";
import PopupCashout from "./PopupCashout";
import GameErrorMessage from "../../../../scripts/enum/GameErrorMessage";
import GameSuccessMessage from "../../../../scripts/enum/GameSuccessMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabWithdrawAutoBank extends cc.Component {

    @property(cc.EditBox)
    edbBankNumber = null;
    @property(cc.EditBox)
    edbBankAccountName = null;
    @property(cc.EditBox)
    edbAmount = null;
    @property(cc.EditBox)
    edbOTP = null;
    @property(cc.Label)
    lblBankName = null;
    @property(cc.Node)
    dropDownBank = null;
    @property(cc.Label)
    lblWithdrawAmount = null;
    @property(cc.Prefab)
    itemBankTemplate = null;
    @property(cc.Node)
    bankNameContainer = null;
    @property(cc.Node)
    nodeActivePhone = null;
    @property(cc.Node)
    nodeWithdraw = null;
    @property(cc.Label)
    lblWithdrawNote = null;

    private _listBank = [];
    private _minCashOut = 0;
    private _maxCashOut = 0;
    private isAllowCashOut = false;
    private fee = 1;
    private _withdrawAmount = 0;
    private messNotAllowCashOut = "Hệ thống rút tiền đang bảo trì, vui lòng thử lại sau";
    private _selectedBankName = "";
    private _selectedBankCode = "";
    private _selectedBank = null;
    private _defaultBankAccountName = "";
    private _listWithdrawBanks = [];

    protected start() {
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.GAME_CONFIG }, (err, res) => {
                if(err) {
                    console.log(err);
                    App.instance.actShowThongBao(err);
                } else {
                    if(res.list_bank_cashout) {
                        this._minCashOut = res.cashout_bank_min;
                        this._maxCashOut = res.cashout_bank_max;
                        this.fee = res.ratio_cashout_bank;
                        this.isAllowCashOut = res.is_cashout_bank_sunvin != 1;
                        this.messNotAllowCashOut = res.mes_notcashout_bank;
                        this.getListUserBanks();
                        this.lblWithdrawNote.string = `Rút tối thiểu\n${Utils.formatNumber(this._minCashOut)}/lệnh`;
                        this.lblWithdrawNote.node.parent.runAction(
                            cc.sequence(
                                cc.scaleTo(.3, 1,1),
                                cc.delayTime(5),
                                cc.scaleTo(.3, 0,0)
                            )
                        )
                    }
                }
            });
        } catch(ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        } finally {
            App.instance.showLoading2(false);
        }

        this.getListSupportedWithdrawBank();
    }

    getListSupportedWithdrawBank() {
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.GET_SUPPORTED_WITHDRAW_BANK }, (err, res) => {
                if(err) {
                    console.log(err);
                    App.instance.actShowThongBao(err);
                } else {
                    if(res.data) {
                        this._listBank = res.data;
                        let bankName = [];
                        for(let i = 0 ; i < this._listBank.length; i++) {
                            bankName.push({"bankName": this._listBank[i].shortName, "bankCode": this._listBank[i].code});
                        }
                        this.initBankList(bankName);
                    }
                }
            });
        } catch(ex) {
            console.log(ex);
        }
    }

    initBankList(_listBank) {
        if(_listBank.length === 0) {
            return;
        }
        for(let i = 0 ; i < _listBank.length; i++) {
            let bankItem = cc.instantiate(this.itemBankTemplate);
            bankItem.getComponent(cc.Label).string = _listBank[i].bankName;
            this.bankNameContainer.addChild(bankItem);
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TabWithdrawAutoBank";
            clickEventHandler.handler = "actSelectBank";
            clickEventHandler.customEventData = _listBank[i].bankName;
            bankItem.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
    }

    actSelectBank(event, data) {
        this._selectedBankName = data;
        let selectedBank = this._listBank.find((bank) => bank.shortName == this._selectedBankName);
        this._selectedBankCode = selectedBank.code;
        this.fillUserBankData(this._selectedBankCode);
        this.lblBankName.string = this._selectedBankName;
        this.dropDownBank.runAction(
            cc.scaleTo(.15, 1, 0)
        );
    }

    actOpenDropDownBank() {
        if(this.dropDownBank.scaleY === 0) {
            this.dropDownBank.runAction(
                cc.scaleTo(.15, 1, 1)
            );
        } else {
            this.dropDownBank.runAction(
                cc.scaleTo(.15, 1, 0)
            );
        }
    }

    fillUserBankData(_selectedBankCode) {
        this._selectedBank = this._listWithdrawBanks.find(bank => bank.bankName == _selectedBankCode);
        if(this._selectedBank) {
            this.edbBankNumber.string = this._selectedBank.bankAccount;
            this.edbBankNumber.enabled = false;
        } else {
            this.edbBankNumber.string = "";
            this.edbBankNumber.enabled = true;
        }
    }

    getListUserBanks() {
        App.instance.showLoading2(true);
        try {
            Http.get(Configs.App.API, { "c" : ApiIDEnum.GET_USER_WITHDRAWAL_BANK, "nickName": Configs.Login.Nickname}, (err, res) => {
                App.instance.showLoading2(false);
                if(res.success) {
                    if(res.banks) {
                        this._listWithdrawBanks = res.banks;
                        if(this._listWithdrawBanks.length > 0) {
                            this._defaultBankAccountName = this._listWithdrawBanks[0].accountName;
                            this.edbBankAccountName.string = this._defaultBankAccountName;
                            this.edbBankAccountName.enabled = false;
                        } else {
                            this.edbBankAccountName.enabled = true;
                        }
                    }
                } else {
                    App.instance.actShowThongBao(res.errorCode);
                }
            });
        } catch(ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        } finally {
            App.instance.showLoading2(false);
        }
    }

    cleanAccents (str: string) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Combining Diacritical Marks
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
        return str;
    }

    actWithdrawAutoBank() {
        let withdrawSuccessfullyMsg = "Rút tiền thành công, vui lòng chờ";
        let maxCashOutMsg = `Số tiền rút tối đa là ${Utils.formatNumber(this._maxCashOut)}`;
        let minCashOutMsg = `Số tiền rút tối thiểu là ${Utils.formatNumber(this._minCashOut)}`;
        if(!this.isAllowCashOut) {
            App.instance.actShowThongBao(this.messNotAllowCashOut);
            return;
        }

        if(this._selectedBankCode.length == 0) {
            App.instance.actShowThongBao(GameErrorMessage.NO_BANK_SELECTED);
            return;
        }

        if(this._withdrawAmount > Configs.Login.Coin) {
            App.instance.actShowThongBao(GameErrorMessage.NOT_ENOUGH_BALANCE);
            return;
        }

        if(this._withdrawAmount <= 0) {
            App.instance.actShowThongBao(GameErrorMessage.INVALID_WITHDRAW_AMOUNT_VALUE);
            return;
        }

        if(this._withdrawAmount > this._maxCashOut) {
            App.instance.actShowThongBao(maxCashOutMsg);
            return;
        }

        if(this._withdrawAmount < this._minCashOut) {
            App.instance.actShowThongBao(minCashOutMsg);
            return;
        }

        let bankNumber = this.edbBankNumber.string.trim();
        if(bankNumber == "") {
            App.instance.actShowThongBao(GameErrorMessage.NO_BANK_NUMBER_FILLED);
            return;
        }

        let bankAccountName = this.cleanAccents(this.edbBankAccountName.string.trim());

        if(bankAccountName == "") {
            App.instance.actShowThongBao(GameErrorMessage.NO_BANK_ACCOUNT_FILLED);
            return;
        }

        let otp = this.edbOTP.string.trim();
        if(otp == "") {
            App.instance.actShowThongBao(GameErrorMessage.INVALID_OTP);
            return;
        }

        App.instance.showLoading2(true);
        let reqParams = {"c": ApiIDEnum.CASH_OUT_BANK_POST, 'bankname': this._selectedBankCode, "amount": this._withdrawAmount, "bankacc": bankAccountName, "banknum": bankNumber, "type": "bank", 'otp': otp, 'at': Configs.Login.AccessToken};
        // let reqParams = {"c": ApiIDEnum.CASH_OUT_BANK_POST, 'bankname': this._selectedBankCode, "amount": this._withdrawAmount, "bankacc": bankAccountName, "banknum": bankNumber, "type": "bank", 'otp': otp};
        let formBody = [];
        for(let property in reqParams) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(reqParams[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        // Http.get(Configs.App.API, reqParams, (err, res) => {
        Http.post(Configs.App.API, formBody.join("&"), (err, res) => {
            App.instance.showLoading2(false);
            if(err != null) {
                App.instance.alertDialog.showMsg(err);
                return;
            }
            if(res) {
                if(!res.success) {
                    App.instance.alertDialog.showMsg(res.errorCode);
                    return;
                } else {
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    App.instance.actShowThongBao(GameSuccessMessage.WITHDRAW_SUCCESSFULLY);
                    if(!this._selectedBank) {
                        Http.get(Configs.App.API, { "c": ApiIDEnum.SAVE_USER_WITHDRAWAL_BANK, "nickName": Configs.Login.Nickname, "accountName": bankAccountName, "bankAccount": bankNumber, "bankName": this._selectedBankCode}, (err, res) => {
                            if (err == null) {
                                console.log(res);
                            }
                        });
                    }
                    LobbyLobbyController._instance.actOpenCashOutTransaction();
                    PopupCashout._instance.actCloseWithdraw();
                }
            } else {
                App.instance.alertDialog.showMsg(res.toString());
                return;
            }
        });
    }

    amountChange() {
        let amount = Utils.stringToInt(this.edbAmount.textLabel.string.trim());

        if(amount <= 0) {
            this.edbAmount.string = 0;
            this.lblWithdrawAmount.string = 0;
            return;
        }
        let amountSend = Number(amount);
        this._withdrawAmount = Math.floor(amountSend * this.fee);
        if(this._withdrawAmount >= Configs.Login.Coin) {
            this._withdrawAmount = Configs.Login.Coin;
            this.edbAmount.string = Configs.Login.Coin.toString();
            this.lblWithdrawAmount.string = Utils.formatNumber(Configs.Login.Coin);
        }
        this.lblWithdrawAmount.string = Utils.formatNumber(this._withdrawAmount);
    }

    onEditBegan() {
        this.edbAmount.textLabel.node.active = false;
        this.edbAmount.textLabel.node.opacity = 0;
        this.edbAmount.fontColor = new cc.Color(255, 255, 255, 0);
    }

    onOpenBotTelegram() {
        LobbyLobbyController._instance.getQuickOTPTelegram();
    }

    actOpenActivePhoneSecurity() {

    }

    checkInvalidBank() {

    }
}
