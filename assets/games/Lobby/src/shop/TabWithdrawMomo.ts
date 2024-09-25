import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import Configs from "../../../../scripts/common/Configs";
import Utils from "../../../../scripts/common/Utils";
import ApiIDEnum from "../enum/ApiIDEnum";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import LobbyLobbyController from "../Lobby.LobbyController";
import PopupCashout from "./PopupCashout";
import GameURL from "../../../../scripts/common/game/GameURL";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabWithdrawMomo extends cc.Component {

    @property(cc.EditBox)
    edbMomoNumber = null;
    @property(cc.EditBox)
    edbMomoAccountName = null;
    @property(cc.EditBox)
    edbAmount = null;
    @property(cc.EditBox)
    edbOTP = null;
    @property(cc.Label)
    lblWithdrawAmount = null;
    @property(cc.Label)
    lblWithdrawNote = null;

    private _listBank = [];
    private _minCashOut = 0;
    private _maxCashOut = 0;
    private isAllowCashOut = false;
    private fee = 1;
    private _withdrawAmount = 0;
    private messNotAllowCashOut = "Hệ thống rút tiền đang bảo trì, vui lòng thử lại sau";
    private hasMomoAccount = false;
    private _defaultMomoAccount = null;

    protected start() {
        App.instance.showLoading2(true);
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.GAME_CONFIG }, (err, res) => {
                App.instance.showLoading2(false);
                if(err) {
                    console.log(err);
                    App.instance.alertDialog.showMsg(err);
                } else {
                    if(res.list_bank_cashout) {
                        this._listBank = res.list_bank_cashout;
                        let bankName = [];
                        for(let i = 0 ; i < this._listBank.length; i++) {
                            bankName.push(this._listBank[i].bankName);
                        }

                        this._minCashOut = res.cashout_momo_min;
                        this._maxCashOut = res.cashout_momo_max;
                        this.fee = res.ratio_cashout_momo;
                        this.isAllowCashOut = res.is_cashout_bank_sunvin != 1;
                        this.messNotAllowCashOut = res.mes_notcashout_bank;
                        this.lblWithdrawNote.string = `Rút tối thiểu\n${Utils.formatNumber(this._minCashOut)}/lệnh`;
                        this.lblWithdrawNote.node.parent.runAction(
                            cc.sequence(
                                cc.scaleTo(.3, 1,1),
                                cc.delayTime(5),
                                cc.scaleTo(.3, 0,0)
                            )
                        )
                        this.fillAccMomo();
                    }
                }
            });
        } catch(ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        } finally {
            App.instance.showLoading2(false);
        }
    }

    fillAccMomo() {
        try {
            Http.get(Configs.App.API, { "c" : ApiIDEnum.GET_USER_WITHDRAWAL_MOMO, "nickName": Configs.Login.Nickname}, (err, res) => {
                if(res.success) {
                    if(res.momo.length > 0) {
                        this._defaultMomoAccount = res.momo[0];
                        this.edbMomoAccountName.string = this._defaultMomoAccount.phoneName;
                        this.edbMomoNumber.string = this._defaultMomoAccount.phoneNumber;
                        this.edbMomoAccountName.enabled = false;
                        this.edbMomoNumber.enabled = false;
                        this.hasMomoAccount = true;
                    } else {
                        this.edbMomoAccountName.enabled = true;
                        this.edbMomoNumber.enabled = true;
                        this.hasMomoAccount = false;
                    }
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
        let invalidAmountWithdrawMsg = "Số tiền rút không hợp lệ";
        let notEnoughBalanceMsg = "Số dư không đủ";
        let noBankNumberMsg = "Vui lòng nhập số tài khoản!";
        let noBankAccountMsg = "Vui lòng nhập tên tài khoản";
        let withdrawSuccessfullyMsg = "Rút tiền thành công, vui lòng chờ";
        let withdrawErrorMsg = "Hệ thống quá tải vui lòng quay lại sau!";
        let notEnoughWithdrawInformation = "Không đủ thông tin chuyển khoảna";
        let maxCashOutMsg = `Số tiền rút tối đa là ${Utils.formatNumber(this._maxCashOut)}`;
        let minCashOutMsg = `Số tiền rút tối thiểu là ${Utils.formatNumber(this._minCashOut)}`;
        let otpInvalid = "Mã OTP không hợp lệ.";

        if(!this.isAllowCashOut) {
            App.instance.actShowThongBao(this.messNotAllowCashOut);
            return;
        }

        if(this._withdrawAmount <= 0) {
            App.instance.actShowThongBao(invalidAmountWithdrawMsg);
            return;
        }

        if(this._withdrawAmount > Configs.Login.Coin) {
            App.instance.actShowThongBao(notEnoughBalanceMsg);
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

        let momoNumber = this.edbMomoNumber.string.trim();
        if(momoNumber.length == 0) {
            App.instance.actShowThongBao(noBankNumberMsg);
            return;
        }

        let momoAccountName = this.cleanAccents(this.edbMomoAccountName.string.trim());

        if(momoAccountName.length == 0) {
            App.instance.actShowThongBao(noBankAccountMsg);
            return;
        }

        let otp = this.edbOTP.string.trim();
        if(otp.length == 0) {
            App.instance.alertDialog.showMsg(otpInvalid);
            return;
        }

        App.instance.showLoading2(true);
        let reqParams = {'c': ApiIDEnum.CASH_OUT_BANK_POST, "amount": this._withdrawAmount, "bankacc": momoAccountName, "banknum": momoNumber, "type": "momo", 'otp': otp, 'at': Configs.Login.AccessToken};
        let formBody = [];
        for(let property in reqParams) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(reqParams[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        Http.post(Configs.App.API, formBody.join("&"), (err, res) => {
        // Http.get(Configs.App.API, reqParams, (err, res) => {
            App.instance.showLoading2(false);
            if(err != null) {
                App.instance.alertDialog.showMsg(err);
                return;
            }
            if(res) {
                if(res.success) {
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    App.instance.alertDialog.showMsg(withdrawSuccessfullyMsg);
                    if(!this.hasMomoAccount) {
                        Http.get(Configs.App.API, { "c": ApiIDEnum.SAVE_USER_WITHDRAWAL_MOMO, "nickName": Configs.Login.Nickname, "phoneNumber": momoNumber, "phoneName": momoAccountName}, (err, res) => {
                            if (err == null) {
                                console.log(res);
                            }
                        });
                    }
                    LobbyLobbyController._instance.actOpenCashOutTransaction();
                    PopupCashout._instance.actCloseWithdraw();
                } else {
                    App.instance.alertDialog.showMsg(res.errorCode);
                    return;
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
}
