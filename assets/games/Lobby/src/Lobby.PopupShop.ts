import Dialog from "../../../scripts/common/Dialog";
import cmd from "../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import Dropdown from "../../../scripts/common/Dropdown";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import PopUpHuongDanNap from "./Lobby.PopUpHuongDanNap";
import AudioManager from "../../../scripts/common/Common.AudioManager";
import PopupUpdateNickname from "./PopupUpdateNickname";
import PopupUpdateBankCashout from "./PopupUpdateBankCashout";
import utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupShop.TabNapThe")
export class TabNapThe {
    @property(Dropdown)
    dropdownTelco: Dropdown = null;
    @property(Dropdown)
    dropdownAmount: Dropdown = null;
    @property(cc.EditBox)
    edbCode: cc.EditBox = null;
    @property(cc.EditBox)
    edbSerial: cc.EditBox = null;
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;
    @property(cc.ToggleContainer)
    tabNhaMangs: cc.ToggleContainer = null;



    private tabSelectedIdx = 0;

    start() {
        this.itemFactorTemplate.active = false;
        this.reset();
        this.dropdownAmount.dismiss();
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            let node = cc.instantiate(this.itemFactorTemplate);
            node.parent = this.itemFactorTemplate.parent;
            node.active = true;

            let menhGia = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i];
            let nhan = Math.ceil(menhGia * Configs.App.SERVER_CONFIG.ratioNapTheVTT);
            node.getChildByName("menhgia").getComponent(cc.Label).string = Utils.formatNumber(menhGia) + " VNĐ";
            node.getChildByName("khuyenmai").getComponent(cc.Label).string = "0%";
            node.getChildByName("nhan").getComponent(cc.Label).string = Utils.formatNumber(nhan);
        }

        for (let i = 0; i < this.tabNhaMangs.toggleItems.length; i++) {
            this.tabNhaMangs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.reset();
                this.dropdownAmount.dismiss();
                //this.onTabChanged();
            });
        }
    }

    reset() {
        this.dropdownTelco.setOptions(["Chọn nhà mạng"].concat(Configs.App.SERVER_CONFIG.listTenNhaMang));
        let listMenhGia = ["Chọn mệnh giá"];
        let nhaMang = Configs.App.SERVER_CONFIG.listTenNhaMang[this.tabSelectedIdx];
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            listMenhGia.push(nhaMang + " " + Utils.formatNumber(Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i]));
        }
        this.dropdownAmount.setOptions(listMenhGia);
        this.resetForm();
    }

    resetForm() {
        this.dropdownTelco.setValue(0);
        this.dropdownAmount.setValue(0);
        this.edbCode.string = "";
        this.edbSerial.string = "";
    }

    submit() {
        let ddTelcoValue = this.tabSelectedIdx + 1;
        //console.log("ddTelcoValue", ddTelcoValue);
        let ddAmountValue = this.dropdownAmount.getValue();
        let code = this.edbCode.string.trim();
        let serial = this.edbSerial.string.trim();
        if (ddTelcoValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn nhà mạng.");
            return;
        }
        if (ddAmountValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn mệnh giá.");
            return;
        }
        if (code == "" || parseInt(code) <= 0 || isNaN(parseInt(code))) {
            App.instance.alertDialog.showMsg("Mã thẻ không hợp lệ.");
            return;
        }
        if (serial == "" || parseInt(serial) <= 0 || isNaN(parseInt(serial))) {
            App.instance.alertDialog.showMsg("Mã serial không hợp lệ.");
            return;
        }
        let telcoId = Configs.App.SERVER_CONFIG.listIdNhaMang[ddTelcoValue - 1];
        let amount = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[ddAmountValue - 1].toString();
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, {
            "c": 4087,
            "cardtype": telcoId,
            "pin": code,
            "seri": serial,
            "amount": amount
        }, (err, res) => {
            if (err != null)
            {
                App.instance.alertDialog.showMsg("Hệ thống đang quá tải. Vui lòng thử lại hoặc liên hệ CSKH");
                App.instance.showLoading2(false);
                return;
            }
            if (res.errorCode == 0) {
                App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
            } else {
                App.instance.alertDialog.showMsg("Nạp thất bại. Vui lòng liên hệ chăm sóc khách hàng");
            }
            App.instance.showLoading2(false);
        });
        //MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositCard(telcoId, serial, code, amount));
    }

}

@ccclass("Lobby.PopupShop.TabMomo")
export class TabMomo {
    //@property(cc.Node)
    //itemFactorTemplate: cc.Node = null;

    @property(cc.Label)
    lblPhone: cc.Label = null;
    @property(cc.Label)
    lblAccountName: cc.Label = null;

    @property(cc.Label)
    lblTransNote: cc.Label = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    edbPhone: cc.EditBox = null;

    @property(cc.Node)
    nodeTaoCode: cc.Node = null;
    @property(cc.Node)
    nodeXacNhan: cc.Node = null;

    @property(cc.Node)
    codeMomo: cc.Node = null;
    @property(cc.Label)
    lblCodeMomo: cc.Label = null;
    @property(cc.Label)
    lblCountTime: cc.Label = null;
    @property(cc.Node)
    btnSubmit: cc.Node = null;

    public timer : any ;
    transId = "0";
    btnCp1: cc.Button = null;
    btnCp2: cc.Button = null;
    btnCp3: cc.Button = null;
    public count: number = 300;
    private tranID: string = '';
    static b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    start() {

        let map2 = new Map<string, string>()
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, { "c": 4038 }, (err, res) => {
            App.instance.showLoading2(false);
            if(res.phoneNum != undefined) {
                this.lblPhone.string = res.phoneNum;
                this.lblAccountName.string = res.phoneName;

                this.lblCodeMomo.string = res.comment;
                this.tranID = res.TrainID;
                this.codeMomo.active = true;
                this.btnSubmit.active = false;
                clearInterval(this.timer);
                this.counter(res.timeToExpired);
            }
        });

        this.btnCp1 = this.lblPhone.node.getChildByName("copy").getComponent(cc.Button);
        this.btnCp1.node.on("click", this.callBack, this)

    }
    checkCodeMomo() {
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, { "c": 4038 }, (err, res) => {
            App.instance.showLoading2(false);
            if(res.phoneNum != undefined) {
                this.lblPhone.string = res.phoneNum;
                this.lblAccountName.string = res.phoneName;
                clearInterval(this.timer);
                this.lblCodeMomo.string = res.comment;
                this.tranID = res.TrainID;
                this.codeMomo.active = true;
                this.btnSubmit.active = false;
                this.counter(res.timeToExpired);
            }else {
                // this.createCode();
            }
        });

        this.btnCp1 = this.lblPhone.node.getChildByName("copy").getComponent(cc.Button);
        this.btnCp1.node.on("click", this.callBack, this)
    }
    createCode(){
        let reqParams = { "c": 4039};
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, reqParams, (err, res) => {
            if(res.phoneNum == undefined){
                App.instance.showLoading2(false);
                App.instance.alertDialog.showMsg("Momo đang bảo trì!");
                return;
            } else {
                App.instance.showLoading2(false);
                this.lblPhone.string = res.phoneNum;
                this.lblAccountName.string = res.phoneName;
                clearInterval(this.timer);
                this.lblCodeMomo.string = res.comment;
                this.tranID = res.TrainID;
                this.codeMomo.active = true;
                this.btnSubmit.active = false;
                clearInterval(this.timer);
                this.counter(res.timeToExpired);
                // let amount = "1";
                // let dataall = "Momo" + "|"+"momo"+"|"+this.lblAccountName.string+"|"+res.TrainID+"|"+ res.comment;
                // MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(this.lblPhone.string, Utils.stringToInt(amount), dataall));
            }
        });
    }

    counter(time) {
        this.count = time;
        var date = new Date(0);
        date.setSeconds(this.count); // specify value for SECONDS here
        this.lblCountTime.string = date.toISOString().substr(11, 8);
        this.count--;
        if(this.count < 0) {
            this.codeMomo.active = false;
            this.btnSubmit.active = true;
            Http.get(Configs.App.API, { "c": 4013, "transID": this.tranID }, (err, res) => {
                if (err != null) return;
                if (res == 1) {
                    App.instance.alertDialog.showMsg("Hết thời gian chờ! Giao dịch Momo của bạn đã tự động hủy!");
                }
            });
            return;
        };
        this.codeMomo.active = true;
        this.btnSubmit.active = false;
        this.timer = setTimeout(() => {
            this.counter(this.count);
        }, 1000);
    }


    actCoppyCodeMomo() {
        let copyText = this.lblCodeMomo.string;
        utils.copyTextToClipboard(copyText);
    }

    actCoppyPhoneNumber() {
        let copyText = this.lblPhone.string;
        utils.copyTextToClipboard(copyText);
    }


    callBack(arg0: string, callBack: any, arg2: this) {
        utils.copyTextToClipboard(this.lblPhone.string);

    }
    callBack2(arg0: string, callBack: any, arg2: this) {
        utils.copyTextToClipboard(this.lblAccountName.string);

    }
    callBack3(arg0: string, callBack: any, arg2: this) {
        utils.copyTextToClipboard(this.lblTransNote.string);

    }

    submit() {

        let amount = this.edbAmount.textLabel.string.trim();
        let phoneSend = this.edbPhone.string.trim();
        let amountSend = Utils.stringToInt(amount);
        // if (amount == "" || parseInt(amount) <= 0 || isNaN(Number(amount))) {
        if (amount == "" || amountSend <= 0) {
            App.instance.alertDialog.showMsg("Số tiền không hợp lệ");
            return;
        }
        if (phoneSend == "") {
            App.instance.alertDialog.showMsg("Vui lòng nhập số điện thoại gửi");
            return;
        }
        // let amountSend = Number(amount);
        // Utils.validateMoneyRecharge50K(amountSend);
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositMomo(amountSend, phoneSend));

    }


    submitDone() {

        let amount = this.edbAmount.textLabel.string.trim();
        let phoneSend = this.edbPhone.string.trim();
        let amountSend = Utils.stringToInt(amount);
        if (amount == "" || amountSend <= 0) {
            App.instance.alertDialog.showMsg("Số tiền không hợp lệ");
            return;
        }
        if (phoneSend == "") {
            App.instance.alertDialog.showMsg("Vui lòng nhập số điện thoại gửi");
            return;
        }

        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositDoneMomo(amountSend, phoneSend, this.transId,
            this.lblAccountName.string, this.lblPhone.string, this.lblTransNote.string));
        this.actReset();
    }


    actReset() {
        this.btnCp1.node.active = false;
        this.btnCp2.node.active = false;
        this.btnCp3.node.active = false;
        this.nodeXacNhan.active = false;
        this.nodeTaoCode.active = true
        this.transId = "";
        this.lblAccountName.string = "";
        this.lblPhone.string = "";
        this.lblTransNote.string = "";
        this.edbPhone.string = "";
        this.edbAmount.textLabel.string = "";
    }

    actCloseX() {
        this.codeMomo.active = false;
        this.btnSubmit.active = true;
    }

}

@ccclass("Lobby.PopupShop.TabOnePay")
export class TabOnePay {

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    edbBankAcountName: cc.EditBox = null;
    @property(cc.EditBox)
    edbBankAcountPassword: cc.EditBox = null;

    @property(cc.Node)
    nodeAmount: cc.Node = null;

    @property(cc.Node)
    nodeAccount: cc.Node = null;
    @property(cc.Label)
    labelMoney: cc.Label = null;

    @property(cc.EditBox)
    labelOtp: cc.EditBox = null;

    @property(cc.Node)
    nodeTransId: cc.Node = null;

    @property(cc.Node)
    nodeOtp: cc.Node = null;

    @property(cc.Node)
    listImgBank: cc.Node = null;

    @property(cc.Node)
    nodeTransTechcom: cc.Node = null;

    @property(cc.Node)
    nodefatherTransTechcom: cc.Node = null;


    @property(cc.Label)
    tenNganhang: cc.Label = null;
    @property(cc.Label)
    edbBankName: cc.Label = null;
    @property(cc.Label)
    edbBankNote: cc.Label = null;
    private _listBank = [];
    private indexBank = 0;
    private currentTransId = "";
    public bankNote = "";
    start() {

        App.instance.showLoading2(true);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading2(false);
            if (err == null) {
                if (res.list_bank_one_pay === undefined || res.list_bank_one_pay.length == 0) {

                    return;
                }
                //console.log(res.)
                let listBank = res.list_bank_one_pay;
                this._listBank = listBank;
                let bankName = [];
                for (let i = 0; i < listBank.length; i++) {
                    bankName.push(listBank[i].bankName);
                }
                this.tenNganhang.string = listBank[0].bankName + " của bạn";
                this.edbBankName.string = listBank[0].bankName;
                this.edbBankNote.string = listBank[0].bankAddress == "DN" ? '*Nhập Mã OTP sms-banking của bạn' : listBank[0].bankAddress;
                this.bankNote = listBank[0].bankNote;
                this.dropdownBank.setOptions(bankName);
                this.dropdownBank.setOnValueChange((idx) => {
                    if (idx >= 0) {
                        this.tenNganhang.string = listBank[idx].bankName + " của bạn";
                        this.edbBankName.string = listBank[idx].bankName;
                        this.edbBankNote.string = listBank[idx].bankAddress == "DN" ? '*Nhập Mã OTP sms-banking của bạn' : listBank[idx].bankAddress;
                        this.bankNote = listBank[idx].bankNote;


                        this.listImgBank.getChildByName('textDefault').active = false;
                        for (let i = 0; i < listBank.length; i++) {
                            if (this.listImgBank.getChildByName(listBank[i].bankName.toUpperCase()) != null) {
                                this.listImgBank.getChildByName(listBank[i].bankName.toUpperCase()).active = false;
                            }
                        }

                        if (this.listImgBank.getChildByName(listBank[idx].bankName.toUpperCase()) != null) {
                            this.listImgBank.getChildByName(listBank[idx].bankName.toUpperCase()).active = true;
                        } else {
                            this.listImgBank.getChildByName('textDefault').active = true;
                            this.listImgBank.getChildByName('textDefault').getComponent(cc.Label).string = listBank[idx].bankName;
                        }

                       // console.log(idx);
                    } else {
                       // console.log(idx);

                    }
                    // this.dropdownBank.setOptions(bankName[idx]);
                    this.indexBank = idx;
                })
            }
        });

    }

    actNext() {
        this.nodeAmount.active = false;
        this.nodeAccount.active = true;
        this.labelMoney.string = this.edbAmount.textLabel.string.trim();
    }
    actBack() {
        this.nodeAmount.active = true;
        this.nodeAccount.active = false;
    }

    actCopytransId() {
        utils.copyTextToClipboard(this.nodeTransId.getComponent(cc.Label).string.trim());
    }

    actShowTransId(transId) {
        this.nodeTransId.active = true;
        this.nodeTransId.getComponent(cc.Label).string = "Mã giao dịch: " + transId;
        this.currentTransId = transId;
    }

    actShowOTP() {
        this.nodeAmount.active = false;
        this.nodeAccount.active = false;
        this.edbAmount.string = "";
        this.nodeOtp.active = true;
    }

    actreset() {
        this.nodeAmount.active = true;
        this.nodeAccount.active = false;
        this.edbAmount.string = "";
        this.edbAmount.textLabel.string = "";
        this.edbAmount.placeholderLabel.string = "";
        this.nodeOtp.active = false;
        this.labelOtp.string = "";
        this.nodeTransId.getComponent(cc.Label).string = "";
        this.nodeTransId.active = false;
        this.currentTransId = "";
        this.hideTransTechcombank();
    }

    actResetLabelOTP() {
        this.labelOtp.string = "";
    }

    actOtp() {
        let otp = this.labelOtp.string.trim();

        if (otp == null) {
            App.instance.alertDialog.showMsg("Vui lòng nhập OTP");
        }
        if (this.currentTransId == null || this.currentTransId == "") {
            App.instance.alertDialog.showMsg("Vui lòng nhập OTP");
        }
        MiniGameNetworkClient.getInstance().send(new cmd.ReqOTPOnepayBank(otp, this.currentTransId));
    }



    submit() {
        let ddBank = this.dropdownBank.getValue();
        // if (ddBank == 0) {
        //     App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
        //     return;
        // }
        let bankSelected = this._listBank[ddBank].bankName;

        let amountSt = Utils.stringToInt(this.edbAmount.textLabel.string.trim());
        Utils.validateMoneyRecharge50K(amountSt);
        let amount = Number(amountSt);
        if (isNaN(amount) || amount < 200000) {
            App.instance.alertDialog.showMsg("Số tiền nạp tối thiểu 200K");
            return;
        }
        let username = App.instance.cleanAccents(this.edbBankAcountName.string.trim());
        let pws = this.edbBankAcountPassword.string.trim();
        if ((username == null) || pws == null) {
            App.instance.alertDialog.showMsg("tài khoản và mật khẩu ngân hàng không được để trống");
            return;
        }
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositOnepayBank(username, amount, pws, bankSelected));
    }



    // techcombank only

    showTransTechcombank(transID) {
        this.nodeTransTechcom.active = true;
        // this.nodeTransTechcom.getComponent(cc.Label).string = transID;
    }

    hideTransTechcombank() {
        this.nodeTransTechcom.active = false;
        this.nodefatherTransTechcom.active = false
        this.nodeTransTechcom.getComponent(cc.Label).string = "";
    }

    actCopyTechCombanktransId() {
        utils.copyTextToClipboard(this.nodeTransTechcom.getComponent(cc.Label).string.trim());
    }
    actShowTecComTransId(transId) {
        this.nodeTransTechcom.active = true;
        this.nodefatherTransTechcom.active = true;
        this.nodeTransTechcom.getComponent(cc.Label).string = transId;
    }


}

@ccclass("Lobby.PopupShop.TabBank")
export class TabBank {
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    @property(cc.Label)
    lblBankName: cc.Label = null;
    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.Label)
    lblBankAddress: cc.Label = null;
    @property(cc.Label)
    lblBankMes: cc.Label = null;

    @property(cc.Label)
    lblGuideBank1: cc.Label = null;
    @property(cc.Label)
    lblGuideBank2: cc.Label = null;
    @property(cc.Label)
    lblGuideBank3: cc.Label = null;

    @property(cc.Label)
    lblTransNote: cc.Label = null;

    @property(cc.Label)
    lblSTK: cc.Label = null;
    @property(cc.Label)
    lblTTK: cc.Label = null;
    @property(cc.Label)
    lblNDCT: cc.Label = null;
    @property(cc.Label)
    lblBankSubmit: cc.Label = null;
    @property(cc.Label)
    lblNotify: cc.Label = null;
    @property(cc.Button)
    btnCloseX: cc.Button = null;

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(Dropdown)
    dropdownPhuongThucBank: Dropdown = null;

    @property(cc.EditBox)
    edbSender: cc.EditBox = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    edbGhichu: cc.EditBox = null;
    @property(cc.Button)
    btnCoppyBank: cc.Button = null;
    @property(cc.Button)
    btnCoppyName: cc.Button = null;
    @property(cc.Button)
    btnCoppyAddress: cc.Button = null;
    @property(PopupUpdateBankCashout)
    popupUpdateBankCashout: PopupUpdateBankCashout = null;

    private _listBank = [];

    start(configs_bank) {
        if (configs_bank.list_bank === undefined || configs_bank.list_bank.length == 0) {
            return;
        }
        let listBank = configs_bank.list_bank;
        this._listBank = listBank;
        let bankName = [];
        for (let i = 0; i < listBank.length; i++) {
            bankName.push(listBank[i].bankName);
        }
        this.lblBankName.string = listBank[0].bankName;
        this.lblBankAddress.string = listBank[0].bankAddress;
        this.lblBankAccountName.string = listBank[0].bankAccountName;
        this.lblBankNumber.string = listBank[0].bankNumber;
        this.lblBankMes.string = listBank[0].bankMes;
        this.dropdownBank.setOptions(bankName);
        this.dropdownBank.setOnValueChange((idx) => {
            if (idx >= 0) {
                this.lblBankAddress.string = listBank[idx ].bankAddress;
                this.lblBankAccountName.string = listBank[idx ].bankAccountName;
                this.lblBankNumber.string = listBank[idx ].bankNumber;
                this.lblBankMes.string = listBank[idx ].bankMes;
            } else {
                this.btnCoppyAddress.node.active = false;
                this.btnCoppyBank.node.active = false;
                this.btnCoppyName.node.active = false;
                this.lblBankAccountName.string = "";
                this.lblBankNumber.string = "";
                this.lblBankAddress.string = "";
                this.lblBankMes.string = "";
            }
            this.btnCoppyAddress.node.active = false;
            this.btnCoppyBank.node.active = true;
            this.btnCoppyName.node.active = true;
        })


        // Set Phuong thuc => chỉ view
        let bankPhuongThucName = ["Internet Banking", "ATM", "Quầy giao dịch"];
        this.dropdownPhuongThucBank.setOptions(bankPhuongThucName);
        this.dropdownPhuongThucBank.setOnValueChange((idx) => {
            if (idx >= 0) {

            }
        })
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

    static b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    GenBank(){
        if(this.lblBankSubmit.string == "NẠP TIẾP"){
            this.edbAmount.placeholderLabel.string = "";
            this.edbGhichu.placeholderLabel.string = "Điền Mã Giao Dịch";
            this.edbAmount.string = "";
            this.edbSender.string = "";
            this.edbGhichu.string = "";
            this.lblBankAddress.string = "";
            this.lblBankAccountName.string = "";
            this.lblBankNumber.string = "";
            this.lblBankSubmit.string = "NẠP TIỀN";
            this.btnCoppyAddress.node.active = false;
            this.btnCoppyBank.node.active = false;
            this.btnCoppyName.node.active = false;
            this.lblSTK.node.active = true;
            this.lblTTK.node.active = true;
            this.lblNDCT.node.active = true;
            this.lblNotify.node.active = false;
            this.lblGuideBank1.node.active = false;
            this.lblGuideBank2.node.active = false;
            this.lblGuideBank3.node.active = false;
            this.dropdownBank.setValue(0);
        }else{
            this.lblNotify.node.active = false;
            let ddBank = this.dropdownBank.getValue();
        // if (ddBank == 0) {
        //     App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
        //     return;
        // }
        let bankSelected = this._listBank[ddBank].bankName;
        let amountSt = this.edbAmount.textLabel.string.trim();
        let sender = this.cleanAccents(this.edbSender.string.trim());
        let amount = amountSt;
        let ghichu = this.cleanAccents(this.edbGhichu.string.trim());

        let dataall;

        if(amount.length == 0 && sender.length == 0){
            App.instance.alertDialog.showMsg("Vui lòng nhập tên người gửi và số tiền vào trước sau đó ấn tiếp tục!");
            return;
        }

        if (amount.length == 0) {
            App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
            return;
        }
        if(sender.length == 0){
            App.instance.alertDialog.showMsg("Không được bỏ trống tên người gửi");
            return;
        }
        // if(Utils.stringToInt(amount) < 1){
        //     App.instance.alertDialog.showMsg("Số tiền nạp phải lớn hơn hoặc bằng 1 vnđ !");
        //     return;
        // }

        App.instance.showLoading2(true);
        let amountSend = Utils.stringToInt(amount);
        //Utils.validateMoneyRecharge50K(amountSend);
        let map2 = new Map<string, string>()

        let reqParams = { "c": 4012, "bank": bankSelected, "amount": amountSend ,"userSend": sender.split(' ').join('_'), "content": ghichu.split(' ').join('_'), "banknum":this.lblBankNumber.string};

        Http.get(Configs.App.API, reqParams, (err, res) => {
            //console.log(res);
             App.instance.showLoading2(false);
             if(res == "0"){
                 App.instance.alertDialog.showMsg("Số tiền nạp phải lớn hơn hoặc bằng 50k vnđ !");
                 return;
            }else{
                 if (res.errorCode == 300) {
                     App.instance.alertDialog.showMsg("Bạn đang có giao dịch chờ xử lý, vui lòng chờ đến khi giao dịch được hoàn tất.");
                     return;
                 } else {
                     App.instance.alertDialog.showMsg("Bạn đã tạo phiếu nạp thành công, nhân viên sẽ xác nhận trong vòng 3 phút");
                     let map = new Map<string, string>()
                     for (var value in res) {
                         map.set(value,res[value])
                     }
                     this.lblSTK.node.active = true;
                     this.lblTTK.node.active = true;
                     this.lblNDCT.node.active = true;
                     this.lblBankSubmit.string = "NẠP TIẾP";
                     this.btnCoppyAddress.node.active = false;
                     this.btnCoppyBank.node.active = true;
                     this.btnCoppyName.node.active = true;
                     this.lblGuideBank1.node.active = false;
                     this.lblGuideBank2.node.active = false;
                     this.lblGuideBank3.node.active = false;

                     // dataall = sender + "|"+bankSelected+"|"+this.lblBankAccountName.string+"|"+tranID+"|"+this.edbGhichu.string;
                     //  App.instance.showLoading2(true);
                     //  MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(this.lblBankNumber.string, Utils.stringToInt(amount), dataall));
                 }
            }
        });

        }


    }

    submit() {
        let ddBank = this.dropdownBank.getValue();
        // if (ddBank == 0) {
        //     App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
        //     return;
        // }
        let bankSelected = this._listBank[ddBank].bankNumber;
        let amountSt = this.edbAmount.textLabel.string.trim();
        let sender = this.edbSender.string.trim();
        let amount = amountSt;
        if (amount.length == 0) {
            App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
            return;
        }

        Http.get(Configs.App.API, { "c": 4050, "nickname": Configs.Login.Nickname }, (err, res) => {
            if (err == null) {
                if(res.error == 1) {
                    this.popupUpdateBankCashout.show();
                } else {
                    App.instance.showLoading2(true);
                    let amountSend = Utils.stringToInt(amount);
                    Utils.validateMoneyRecharge50K(amountSend);
                    MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(bankSelected, Utils.stringToInt(amount), sender));
                }
            }
        });
    }

    actCloseX() {
        this.lblBankSubmit.string = "NẠP TIỀN";
        this.lblSTK.node.active = true;
        this.lblTTK.node.active = true;
        this.lblNDCT.node.active = true;
        this.edbAmount.string = "";
        this.edbSender.string = "";
        this.lblBankAddress.string = "";
        this.lblBankAccountName.string = "";
        this.lblBankNumber.string = "";
        this.btnCoppyAddress.node.active = false;
        this.btnCoppyBank.node.active = false;
        this.btnCoppyName.node.active = false;
        this.lblNotify.node.active = false;
        this.lblGuideBank3.node.active = false;
        this.lblGuideBank1.node.active = false;
        this.lblGuideBank2.node.active = false;
        this.dropdownBank.setValue(0);

    }

    actCoppyName() {
        let copyText = this.lblBankAccountName.string;

        utils.copyTextToClipboard(copyText);

    }
    actCoppyAccountNumber() {
        let copyText = this.lblBankNumber.string;

        utils.copyTextToClipboard(copyText);

    }
    actCoppyBankAccountAddress() {
        let copyText = this.lblBankAddress.string;

        utils.copyTextToClipboard(copyText);

    }

}


@ccclass("Lobby.PopupShop.TabCodePay")
export class TabCodePay {


    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.Label)
    lblBankAddress: cc.Label = null;
    @property(cc.Label)
    lblBankNameX: cc.Label = null;

    @property(cc.Node)
    codePay: cc.Node = null;
    @property(cc.Label)
    lblCodePay: cc.Label = null;
    @property(cc.Label)
    lblCountTime: cc.Label = null;

    @property(cc.Node)
    btnSubmit: cc.Node = null;

    @property(cc.Button)
    btnCloseX: cc.Button = null;

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(cc.Button)
    btnCoppyName: cc.Button = null;

    @property(PopupUpdateBankCashout)
    popupUpdateBankCashout: PopupUpdateBankCashout = null;

    public _listBank = [];
    public listBankName = [];
    public count: number = 1200;
    public tranID: string = '';
    public comment: string = '';
    public timer : any ;
    public isUpdateBankCashout = false;
    public isCreateCodepayApi = true;

    start(configs_bank) {

        if (configs_bank.list_bank === undefined || configs_bank.list_bank.length == 0) {
            return;
        }
        this.isCreateCodepayApi = configs_bank.createCodepayApi == '1' ? true : false;

        let listBank = configs_bank.list_bank;
        this._listBank = listBank;
        let bankName = [];
        for (let i = 0; i < listBank.length; i++) {
            bankName.push(listBank[i].bankName);
        }
        this.listBankName = bankName;
        this.lblBankNameX.string = listBank[0].bankName;
        this.lblBankAddress.string = listBank[0].bankAddress;
        this.lblBankAccountName.string = listBank[0].bankAccountName;
        this.lblBankNumber.string = listBank[0].bankNumber;
        this.dropdownBank.setOptions(bankName);
        this.dropdownBank.setOnValueChange((idx) => {
            if (idx >= 0) {
                this.lblBankNameX.string = listBank[idx].bankName;
                this.lblBankAddress.string = listBank[idx].bankAddress;
                this.lblBankAccountName.string = listBank[idx].bankAccountName;
                this.lblBankNumber.string = listBank[idx].bankNumber;
            } else {
                this.btnCoppyName.node.active = false;
                this.lblBankAccountName.string = "";
                this.lblBankNumber.string = "";
                this.lblBankAddress.string = "";
            }
            this.btnCoppyName.node.active = true;
        })


    }

    checkCodePay(){
        if (this.isCreateCodepayApi) {
            App.instance.showLoading2(true);
            let reqParams = { "c": 4036, "bank": "you88", "cardName": "you88", "cardCode": "you88", "ver" : "new"};
            Http.get(Configs.App.API, reqParams, (err, res) => {
                App.instance.showLoading2(false);
                this.showCodepay(res);
            });
        } else {
            MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositCodePay('you88', 'you88', 'you88'));
        }

    }

    showCodepay(res) {
        if(res.errorCode == 300){
            this.codePay.active = false;
            this.btnSubmit.active = true;
            clearInterval(this.timer);
            this.counter(0);
            return;
        } else {
            clearInterval(this.timer);
            this.tranID = res.TrainID;
            this.lblCodePay.string = res.comment;
            this.codePay.active = true;
            this.btnSubmit.active = false;
            let timeCounter = res.timecon == undefined ? 0 : res.timecon;
            let index = this.listBankName.indexOf(res.bankname);
            this.counter(timeCounter);
            this.lblBankNameX.string = this._listBank[index].bankName;
            this.lblBankAddress.string = this._listBank[index].bankAddress;
            this.lblBankAccountName.string = this._listBank[index].bankAccountName;
            this.lblBankNumber.string = this._listBank[index].bankNumber;
        }

    }

    createCode(){
        // if (ddBank < 0) {
        //     App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
        //     return;
        // }

        let ddBank = this.dropdownBank.getValue();
        let bankSelected = this._listBank[ddBank].bankName;
        let bankAccountName = this._listBank[ddBank].bankAccountName;
        let bankNumber = this._listBank[ddBank].bankNumber;

        Http.get(Configs.App.API, { "c": 4050, "nickname": Configs.Login.Nickname }, (err, res) => {
            if (err == null) {
                if(res.error == 1) {
                    //this.isUpdateBankCashout = true;
                    this.popupUpdateBankCashout.show();
                } else {
                    if (this.isCreateCodepayApi) {
                        App.instance.showLoading2(true);
                        let reqParams = { "c": 4036, "bank": bankSelected, "cardName": "napCodePay", "cardCode": bankNumber, "ver" : "new"};
                        Http.get(Configs.App.API, reqParams, (err, res) => {
                            //console.log(res);
                            App.instance.showLoading2(false);
                            if(res.errorCode == 300){
                                return;
                            } else {
                                this.showCodepay(res);
                                this.tranID = res.TrainID;
                                // let amount = "1";
                                // let dataall = "CodePay" + "|"+bankSelected+"|"+this.lblBankAccountName.string+"|"+res.TrainID+"|"+ res.comment;
                                // MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(this.lblBankNumber.string, Utils.stringToInt(amount), dataall));
                            }
                        });
                    } else {
                        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositCodePay(bankSelected, bankAccountName, bankNumber));
                    }
                }
            }
        });

        // if (this.isUpdateBankCashout) {
        //     this.popupUpdateBankCashout.show();
        // } else {
        //
        // }
    }

    counter(time) {
        this.count = time;
        var date = new Date(0);
        date.setSeconds(this.count); // specify value for SECONDS here
        this.lblCountTime.string = date.toISOString().substr(11, 8);
        this.count--;
        if(this.count < 0) {
            this.codePay.active = false;
            this.btnSubmit.active = true;
            this.lblCodePay.string = '-';
            // Http.get(Configs.App.API, { "c": 4013, "transID": this.tranID }, (err, res) => {
            //     if (err != null) return;
            //     if (res == 1) {
            //         App.instance.alertDialog.showMsg("Hết thời gian chờ! Giao dịch CodePay của bạn đã tự động hủy!");
            //     }
            // });
            return;
        };
        this.codePay.active = true;
        this.btnSubmit.active = false;
      this.timer =  setTimeout(() => {
            this.counter(this.count);
        }, 1000);
    }

    submit() {

    }

    actCoppyCodePay() {
        let copyText = this.lblCodePay.string;
        utils.copyTextToClipboard(copyText);
    }

   actCopySTKCodePay() {
       let copyText = this.lblBankNumber.string;
       utils.copyTextToClipboard(copyText);
   }

    actCloseX() {
        this.lblBankAddress.string = "";
        this.lblBankAccountName.string = "";
        this.lblBankNumber.string = "";
        this.btnCoppyName.node.active = false;
        this.codePay.active = false;
        this.btnSubmit.active = true;
        this.dropdownBank.setValue(0);
    }


    actCoppyAccountNumber() {
        let copyText = this.lblBankNumber.string;
        utils.copyTextToClipboard(copyText);
    }


}

@ccclass("Lobby.PopupShop.TabTransfer")
export class TabTransfer {
    @property(cc.Node)
    panelContent: cc.Node = null;
    @property(cc.Node)
    panelContinue: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;
    @property(cc.Label)
    lblReceive: cc.Label = null;
    @property(cc.Label)
    lblDaiLy: cc.Label = null;
    @property(cc.Label)
    lblNote: cc.Label = null;
    @property(cc.EditBox)
    edbNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbReNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbCoinTransfer: cc.EditBox = null;
    @property(cc.EditBox)
    edbNote: cc.EditBox = null;

    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;

    ratioTransfer = Configs.App.SERVER_CONFIG.ratioTransfer;

    receiverAgent: boolean = false;

    start() {
        this.edbCoinTransfer.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoinTransfer.string);
            this.edbCoinTransfer.string = Utils.formatNumber(number);
            this.lblReceive.string = Utils.formatNumber(Math.round(this.ratioTransfer * number));
        });
        this.edbNickname.node.on("editing-did-ended", () => {
            let nickname = this.edbNickname.string.trim();
            if (nickname != "") {
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
            }
        });
    }

    reset() {
        this.panelContent.active = true;
        this.panelContinue.active = false;
        this.lblDaiLy.node.active = false;
        this.lblFee.string = "0";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.lblReceive.string = "0";
        this.edbNickname.string = "";
        this.edbReNickname.string = "";
        this.edbNote.string = "";
        this.edbCoinTransfer.string = "";
        this.lblNote.string = this.lblNote.string.replace("%s", Math.round((1 - this.ratioTransfer) * 100) + "%");
        this.lblFee.string = Math.round((1 - this.ratioTransfer) * 100) + "%";
    }

    continue() {
        let nickname = this.edbNickname.string.trim();
        let reNickname = this.edbReNickname.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.string);
        let note = this.edbNote.string.trim();
        if (nickname == "") {
            App.instance.alertDialog.showMsg("Nickname không được để trống.");
            return;
        }
        if (nickname != reNickname) {
            App.instance.alertDialog.showMsg("Hai nickname không giống nhau.");
            return;
        }
        if (note == "") {
            App.instance.alertDialog.showMsg("Lý do chuyển khoản không được để trống.");
            return;
        }
        if (coin < 200000) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch tối thiểu bằng 200.000.");
            return;
        }
        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số dư không đủ.");
            return;
        }

        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + "\" (Không phải Đ.Lý)\nSố tiền: " + this.edbCoinTransfer.string + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoin(nickname, coin, note));
            }
        });
    }
}

@ccclass("Lobby.PopupShop.TabCard")
export class TabCard {
    @property(Dropdown)
    dropdownAmount: Dropdown = null;
    @property(cc.EditBox)
    edbCode: cc.EditBox = null;
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    start() {
        this.itemFactorTemplate.active = false;
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            let node = cc.instantiate(this.itemFactorTemplate);
            node.parent = this.itemFactorTemplate.parent;
            node.active = true;

            let menhGia = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i];
            let nhan = Math.ceil(menhGia * Configs.App.SERVER_CONFIG.ratioNapTheVTT);
            node.getChildByName("menhgia").getComponent(cc.Label).string = Utils.formatNumber(menhGia);
            node.getChildByName("khuyenmai").getComponent(cc.Label).string = "0%";
            node.getChildByName("nhan").getComponent(cc.Label).string = Utils.formatNumber(nhan);
        }
    }

    reset() {
        let listMenhGia = ["Chọn mệnh giá"];
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            listMenhGia.push(Utils.formatNumber(Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i]));
        }
        this.dropdownAmount.setOptions(listMenhGia);
        this.resetForm();
    }

    resetForm() {
        this.dropdownAmount.setValue(0);
        this.edbCode.string = "";
    }

    submit() {
        let ddAmountValue = this.dropdownAmount.getValue();
        let code = this.edbCode.string.trim();
        if (ddAmountValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn mệnh giá.");
            return;
        }
        if (code == "" || parseInt(code) <= 0 || isNaN(parseInt(code))) {
            App.instance.alertDialog.showMsg("Mã thẻ không hợp lệ.");
            return;
        }
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqInsertGiftcode(code));
    }
}

@ccclass("Lobby.PopupShop.TabBitCoin")
export class TabBitCoin {
    @property(cc.EditBox)
    edbAddress: cc.EditBox = null;
    @property(Dropdown)
    dropdownMoneyType: Dropdown = null;

    private readonly moneyTypes = ["", "BTC", "LTC", "ETH", "TUSD", "USDC", "USDT.ERC20"];
    private readonly moneyTypesName = ["Chọn loại tiền", "BTC", "LTC", "ETH", "TUSD", "USDC", "USDT"];
    private address = "";

    start(component: cc.Component) {
        // this.edbAddress.node.on("editing-did-ended", () => {
        //     this.edbAddress.string = this.address;
        // });
        // this.dropdownMoneyType.setOptions(this.moneyTypesName);
        // this.dropdownMoneyType.setOnValueChange((idx) => {
        //     this.edbAddress.string = "";
        //     if (idx == 0) {
        //         this.edbAddress.placeholder = "Vui lòng chọn loại tiền.";
        //         return;
        //     }
        //     this.edbAddress.placeholder = "Đang tải...";
        //     App.instance.showLoading2(true);
        //     ShootFishNetworkClient.getInstance().request("getbtcaddress", {
        //         "coin": this.moneyTypes[idx]
        //     }, (res) => {
        //         App.instance.showLoading2(false);
        //         console.log(res);
        //         if (res["code"] == 200) {
        //             this.address = res["data"]["result"]["address"];
        //             Configs.Login.BitcoinToken = this.edbAddress.string = this.address;
        //         } else {
        //             this.edbAddress.placeholder = "Lỗi rồi, vui lòng thử lại sau.";
        //         }
        //     }, component);
        // });
        // this.dropdownMoneyType.setValue(0);
        // this.edbAddress.string = "";
        // this.edbAddress.placeholder = "Vui lòng chọn loại tiền.";
        // if (Configs.Login.BitcoinToken == "") {
        //     this.edbAddress.string = "";
        //     this.edbAddress.placeholder = "Đang tải...";
        //     App.instance.showLoading2(true);
        //     ShootFishNetworkClient.getInstance().request("getbtcaddress", null, (res) => {
        //         App.instance.showLoading2(false);
        //         console.log(res);
        //         if (res["code"] == 200) {
        //             this.address = res["data"]["result"]["address"];
        //             Configs.Login.BitcoinToken = this.edbAddress.string = this.address;
        //         } else {
        //             this.edbAddress.placeholder = "Lỗi rồi, vui lòng thử lại sau.";
        //         }
        //     }, component);
        // } else {
        //     this.edbAddress.string = Configs.Login.BitcoinToken;
        // }
        // Http.get("http://149.28.138.254:8080/bancaapi/getbtcaddress/" + Configs.Login.UserIdFish, null, (res) => {
        //     App.instance.showLoading2(false);
        //     console.log(res);
        //     if (res["code"] == 200) {
        //         this.address = res["data"]["result"]["address"];
        //         this.edbAddress.string = this.address;
        //     } else {
        //         this.edbAddress.placeholder = "Lỗi rồi, vui lòng thử lại sau.";
        //     }
        // });
    }
}

@ccclass
export default class PopupShop extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(TabNapThe)
    tabNapThe: TabNapThe = null;
    @property(TabTransfer)
    tabTransfer: TabTransfer = null;
    // @property(TabCard)
    // tabCard: TabCard = null;
    @property(TabBitCoin)
    tabBitCoin: TabBitCoin = null;

    @property(cc.Label)
    dialogLable: cc.Label = null;

    @property(cc.Node)
    dialogCoppy: cc.Node = null;

    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];

    @property(PopUpHuongDanNap)
    popupHuongDan: PopUpHuongDanNap = null;

    @property(TabMomo)
    tabMomo: TabMomo = null;

    @property(TabBank)
    tabBank: TabBank = null;

    @property(TabCodePay)
    tabCodePay: TabCodePay = null;

    @property(TabOnePay)
    tabOnePay: TabOnePay = null;

    @property(cc.Node)
    loadingBar: cc.Node = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;

    private tabSelectedIdx = 0;
    public configs_bank = {};

    start() {
        /* switch (VersionConfig.CPName) {
            case VersionConfig.CP_NAME_F69:
                this.tabs.toggleItems[2].node.active = false;//inactive momo tab
                this.tabs.toggleItems[5].node.active = true;//active bitcoin tab
                break;
            default:
                this.tabs.toggleItems[2].node.active = true;//active momo tab
                this.tabs.toggleItems[5].node.active = false;//inactive bitcoin tab
                break;
        } */

        for (let i = 0; i < this.lblContainsBotOTPs.length; i++) {
            let lbl = this.lblContainsBotOTPs[i];
            lbl.string = lbl.string.replace("$bot_otp", "@" + Configs.App.getLinkTelegram());
        }

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }
        let timerCodePay ;
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            //console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_CARD: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResDepositCard(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        case 30:
                            this.tabNapThe.resetForm();
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch, vui lòng chờ hệ thống xử lý.");
                            break;
                        case 31:
                            App.instance.alertDialog.showMsg("Thẻ đã được sử dụng.");
                            break;
                        case 32:
                            App.instance.alertDialog.showMsg("Thẻ đã bị khóa.");
                            break;
                        case 33:
                            App.instance.alertDialog.showMsg("Thẻ chưa được kích hoạt.");
                            break;
                        case 34:
                            App.instance.alertDialog.showMsg("Thẻ đã hết hạn sử dụng.");
                            break;
                        case 35:
                            App.instance.alertDialog.showMsg("Mã thẻ không đúng.");
                            break;
                        case 36:
                            App.instance.alertDialog.showMsg("Số serial không đúng.");
                            break;
                        case 8:
                            App.instance.alertDialog.showMsg("Tài khoản đã bị khóa nạp thẻ do nạp sai quá nhiều lần! Thời gian khóa nạp thẻ còn lại: " + this.longToTime(res.timeFail));
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    if (res.error == 0) {
                        this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                        break;
                    }
                    this.tabTransfer.receiverAgent = res.type == 1 || res.type == 2;
                    if (!this.tabTransfer.receiverAgent) {
                        this.tabTransfer.edbNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản " + this.tabTransfer.edbNickname.string + " Không phải là tài khoản đại lý.");
                        break;
                    }
                    this.tabTransfer.lblDaiLy.node.active = res.type == 1 || res.type == 2;
                    this.tabTransfer.lblFee.string = res.fee + "%";
                    this.tabTransfer.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            this.tabTransfer.panelContent.active = false;
                            this.tabTransfer.panelContinue.active = true;
                            this.tabTransfer.edbOTP.string = "";
                            App.instance.alertDialog.showMsg("Vui lòng nhấn \"Lấy OTP SMS\" hoặc lấy OTP từ Telegram và nhập mã OTP để tiếp tục!");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("Số tiền tối thiểu là 200.000.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Chức năng chỉ dành cho những tài khoản đăng ký bảo mật SMS PLUS.");
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg("Số dư không đủ.");
                            break;
                        case 5:
                            App.instance.alertDialog.showMsg("Tài khoản bị cấm chuyển tiền.");
                            break;
                        case 6:
                            App.instance.alertDialog.showMsg("Nickname nhận không tồn tại.");
                            break;
                        case 10:
                            App.instance.alertDialog.showMsg("Chức năng bảo mật sẽ tự động kích hoạt sau 24h kể từ thời điểm đăng ký thành công!");
                            break;
                        case 11:
                            App.instance.alertDialog.showMsg("Bạn chỉ được chuyển cho Đại lý tổng trong khoảng tiền quy định!");
                            break;
                        case 22:
                            App.instance.alertDialog.showMsg("Tài khoản chưa đủ điều kiện để chuyển tiền.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
                    App.instance.showLoading2(false);
                    let res = new cmd.ResGetOTP(data);
                    // console.log(res);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("Mã OTP đã được gửi đi!");
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg("Mỗi thao tác lấy SMS OTP phải cách nhau ít nhất 5 phút!");
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công vui lòng thử lại sau!");
                    }
                    break;
                }
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    // console.log(res);
                    if (res.error != 0) {
                        App.instance.showLoading2(false);
                        switch (res.error) {
                            case 1:
                            case 2:
                                App.instance.alertDialog.showMsg("Giao dịch thất bại!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Mã xác thực không chính xác, vui lòng thử lại!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("Mã OTP đã hết hạn!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }
                    App.instance.showLoading2(true);
                    break;
                }
                case cmd.Code.DEPOSIT_WAIT_OTP_OnePayBANK: {
                    let res = new cmd.ResDepositOnepayBank(data);
                    // console.log(res);
                    App.instance.showLoading2(true);
                    //console.log("==================>Wait OTP" + res.error);
                    //console.log("==================>Wait TransID" + res.transId);
                    if (res.error != 0) {
                        //App.instance.showLoading2(false);
                        switch (res.error) {
                            case 1:
                                this.loadingBar.active = true;
                                this.tabOnePay.actShowTransId(res.transId);
                                break;
                            case 2:
                                App.instance.alertDialog.showMsg("Giao dịch thất bại!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Bạn đang có giao dịch chưa xử lý xin hãy chờ!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("Mã OTP đã hết hạn!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }
                    App.instance.showLoading2(true);
                    break;
                }
                case cmd.Code.DEPOSIT_NEED_SUBMIT_OTP_OnePayBANK: {
                    let res = new cmd.ResDepositOnepayOtpCmd(data);
                    let transTechombank = res.techcombankTrans;
                    //console.log("================>" + transTechombank);
                    if (transTechombank.trim().normalize() === "none".normalize() || transTechombank == null) {

                        this.tabOnePay.hideTransTechcombank();
                    } else {
                        this.tabOnePay.actShowTecComTransId(transTechombank);
                    }
                    this.tabOnePay.actShowOTP();
                    this.tabOnePay.actShowTransId(res.transId);
                    this.loadingBar.active = false;
                    App.instance.showLoading2(false);
                    //console.log("DEPOSIT_NEED_SUBMIT_OTP_OnePayBANK" + res.transId);
                    break;
                }
                case cmd.Code.DEPOSIT_ONEPAY_ACTION: { // todo
                    let res = new cmd.ResOnePayAction(data);
                    App.instance.showLoading2(false);
                    let code = res.code_step;
                    let transTechombank = res.techcombankTrans;
                    if (code == 0) {
                        // xử lý thành công
                        this.loadingBar.active = false;
                        App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                        this.tabOnePay.actreset();
                        Configs.Login.Coin = res.currentMoney;

                    } else if (code == 1) {
                        // chờ xử lý
                        this.loadingBar.active = true;
                    } else if (code == 2) {
                        this.loadingBar.active = false;
                        App.instance.alertDialog.showMsg("Thông tin tài khoản ngân hàng của quý khách không chính xác. Quý khách vui lòng kiểm tra và thử lại. Xin trân trọng cảm ơn !");
                        this.tabOnePay.actreset();
                        Configs.Login.Coin = res.currentMoney;
                    } else if (code == 3) {
                        this.loadingBar.active = false;
                        App.instance.alertDialog.showMsg("Xin lỗi tài khoản ngân hàng của quý khách Hiện tại không đủ số dư để thực hiện giao dịch này. Quý khách vui lòng kiểm tra và thử lại sau");
                        this.tabOnePay.actreset();
                        Configs.Login.Coin = res.currentMoney;
                    } else if (code == 4) {
                        this.loadingBar.active = false;
                        App.instance.alertDialog.showMsg("Hiện Tại Chúng Tôi Đang Nâng Cấp Ngân Hàng Này.. Qúy khách vui lòng nạp qua hình thức chuyển vào Ngân hàng Của chúng tôi để được hỗ trợ đơn nạp nhanh nhất trong mọi thời điểm ,Cảm ơn quý khách!");
                        this.tabOnePay.actreset();
                        Configs.Login.Coin = res.currentMoney;
                    }else if (code == 5) {
                        this.loadingBar.active = false;
                        if (this.tabOnePay.bankNote == "") {
                            App.instance.alertDialog.showMsg("Vui lòng đăng nhập app Vietcombank ->> Cài đặt ->> Cài đặt chung ->> Cài đặt đăng nhập ->> 'Cài đặt đăng nhập VCB Digibank trên trình duyệt web' bằng cách 'gạt nút tính năng sang trái để mở khoá'.");
                        } else {
                            App.instance.alertDialog.showMsg(this.tabOnePay.bankNote);
                        }
                        this.tabOnePay.actreset();
                        Configs.Login.Coin = res.currentMoney;
                    }
                    break;
                }
                case cmd.Code.RESULT_TRANSFER_COIN: {
                    if (!this.node.active) return;
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    this.tabTransfer.reset();
                    break;
                }
                case cmd.Code.INSERT_GIFTCODE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResInsertGiftcode(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Mã thẻ không chính xác. Vui lòng kiểm tra lại!");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("Mã thẻ đã được sử dụng.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Để sử dụng tính năng này vui lòng đăng ký bảo mật.");
                            break;
                        case 4:
                        case 5:
                        case 6:
                            App.instance.alertDialog.showMsg("Mã thẻ đã nhập không hợp lệ.");
                            break;
                        case 2:
                            Configs.Login.Coin = res.currentMoneyVin;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
                            break;
                    }
                    break;
                }
                case cmd.Code.DEPOSIT_BANK: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResDepositBank(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Đã tạo phiếu nạp thành công");
                            break;
                        case 3:
                                this.tabBank.lblBankSubmit.string = "NẠP TIỀN";
                                this.tabBank.lblTTK.node.active = true;
                                this.tabBank.lblNDCT.node.active = true;
                                this.tabBank.edbAmount.string = "";
                                this.tabBank.edbSender.string = "";
                                this.tabBank.lblBankAddress.string = "";
                                this.tabBank.lblBankAccountName.string = "";
                                this.tabBank.lblBankNumber.string = "";
                                this.tabBank.btnCoppyAddress.node.active = false;
                                this.tabBank.btnCoppyBank.node.active = false;
                                this.tabBank.btnCoppyName.node.active = false;
                                this.tabBank.lblNotify.node.active = false;
                                this.tabBank.lblGuideBank3.node.active = false;
                                this.tabBank.lblGuideBank1.node.active = false;
                                this.tabBank.lblGuideBank2.node.active = false;
                                this.tabBank.dropdownBank.setValue(0);

                                this.tabCodePay.codePay.active = false;
                                this.tabCodePay.btnSubmit.active = true;

                                this.tabMomo.codeMomo.active = false;
                                this.tabMomo.btnSubmit.active = true;

                            App.instance.alertDialog.showMsg("Bạn đang có giao dịch chờ xử lý, vui lòng chờ đến khi giao dịch được hoàn tất.");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                   // console.log(res.error);
                    break;
                }
                case cmd.Code.DEPOSIT_CODE_PAY: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResDepositCodepay(data);
                    let dataArray = res.comment.split("|");
                   // console.log(dataArray);
                    switch (res.error) {
                        case 200:
                            this.tabCodePay.lblCodePay.string = dataArray[0];
                            this.tabCodePay.codePay.active = true;
                            this.tabCodePay.btnSubmit.active = false;
                            let timeCounter = dataArray[1] == undefined ? 0 :  dataArray[1];
                            let nameBank = dataArray[2] == undefined ? 0 :  dataArray[2];
                            let index = this.tabCodePay.listBankName.indexOf(nameBank);
                            this.tabCodePay.counter(timeCounter);
                            this.tabCodePay.lblBankNameX.string = this.tabCodePay._listBank[index].bankName;
                            this.tabCodePay.lblBankAddress.string = this.tabCodePay._listBank[index].bankAddress;
                            this.tabCodePay.lblBankAccountName.string = this.tabCodePay._listBank[index].bankAccountName;
                            this.tabCodePay.lblBankNumber.string = this.tabCodePay._listBank[index].bankNumber;
                            break;
                        default:
                            this.tabCodePay.codePay.active = false;
                            this.tabCodePay.btnSubmit.active = true;
                            this.tabCodePay.lblCodePay.string = '-';
                            this.tabCodePay.counter(0);
                        //App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                    break;
                }
                case cmd.Code.TIME_CHANGE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResTimeChange(data);
                    switch (res.time) {
                        case 0:
                            let self = this;
                            clearTimeout(self.tabCodePay.timer) ;
                            self.tabCodePay.codePay.active = false;
                            self.tabCodePay.btnSubmit.active = true;
                            this.tabCodePay.lblCodePay.string = '-';
                            this.tabCodePay.counter(0);
                            App.instance.alertDialog.showMsg("Đơn nạp đã được xử lý!");
                            break;
                        case 300:
                            let selfx = this;
                            clearTimeout(selfx.tabCodePay.timer) ;
                            selfx.tabCodePay.codePay.active = false;
                            selfx.tabCodePay.btnSubmit.active = true;
                            this.tabCodePay.lblCodePay.string = '-';
                            this.tabCodePay.counter(0);
                            App.instance.alertDialog.showMsg("Đơn nạp đã được xử lý!");
                            break;
                        default:
                            this.tabCodePay.codePay.active = false;
                            this.tabCodePay.btnSubmit.active = true;
                            this.tabCodePay.lblCodePay.string = '-';
                            this.tabCodePay.counter(0);
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                    break;
                }
                case cmd.Code.DEPOSIT_MOMO: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResDepositMomo(data);

                    //console.log(" code DEPOSIT_MOMO =======>" + res.error);
                    if (res.code == 0) {
                        this.tabMomo.lblAccountName.string = res.name;
                        this.tabMomo.btnCp1.node.active = true;
                        this.tabMomo.transId = res.transId;
                        this.tabMomo.lblPhone.string = res.receiverPhone;
                        this.tabMomo.btnCp2.node.active = true;
                        this.tabMomo.lblTransNote.string = res.comment;
                        this.tabMomo.btnCp3.node.active = true;
                        this.tabMomo.nodeTaoCode.active = false;
                        this.tabMomo.nodeXacNhan.active = true;
                    }
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch của bạn, vui lòng Chuyển Momo theo thông tin đã hiển thị trên màn hình!");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Bạn đang có giao dịch chờ xử lý, vui lòng chờ đến khi giao dịch được hoàn tất");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch của bạn,vui lòng chờ hệ thống xử lý giao dịch!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                   // console.log(res.error);
                    break;
                }
            }
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        }, this);

        // Http.get(Configs.App.API, { "c": 129 }, (err, res) => {
        //     App.instance.showLoading2(false);
        //     if (err == null) {
        //         this.configs_bank = res;
        //         this.tabBank.start(this.configs_bank);
        //         this.tabCodePay.start(this.configs_bank);
        //     }
        // });

        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading2(false);
            if (err == null) {
                this.configs_bank = res;
                this.tabCodePay.start(this.configs_bank);
            }
        });
        this.tabNapThe.start();
        this.tabTransfer.start();
        // this.tabCard.start();
        this.tabMomo.start();
        this.tabOnePay.start();
    }

    actCoppyTransTechcom() {
        this.tabOnePay.actCopyTechCombanktransId();
    }

    actCopyBankName() {
        this.actShowDialog("Đã coppy Tên người nhận");
        this.tabBank.actCoppyName();
    }

    actCopyBankNumber() {
        this.actShowDialog("Đã coppy số tài khoản ngân hàng người nhận");
        this.tabBank.actCoppyAccountNumber();
    }

    actCopyCodepayBankNumber() {
        this.actShowDialog("Copy Số Tài Khoản Thành Công");
        this.tabCodePay.actCoppyAccountNumber();
    }

    actCopyBankAddress() {
        this.actShowDialog("Đã copy nội dung chuyển tiền")
        this.tabBank.actCoppyBankAccountAddress();
    }

    actCopyCodePay() {
        this.actShowDialog("Đã copy nội dung chuyển tiền");
        this.tabCodePay.actCoppyCodePay();
    }

    actCopySTKCodePay() {
        this.actShowDialog("Copy Số Tài Khoản Thành Công");
        this.tabCodePay.actCopySTKCodePay();
    }

    actcheckCodePay() {
        this.tabCodePay.checkCodePay();
    }

    actcheckMomoCodePay() {
        this.tabMomo.checkCodeMomo();
    }
    actCopyCodeMomo() {
        this.actShowDialog("Đã coppy nội dung chuyển tiền");
        this.tabMomo.actCoppyCodeMomo();
    }

    actCopyMomoPhoneNumber() {
        this.actShowDialog("Đã coppy số điện thoại");
        this.tabMomo.actCoppyPhoneNumber();
    }

    private onTabChanged() {
        AudioManager.getInstance().playEffect(this.soundClickSun);
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
            if (this.tabSelectedIdx == 1) {
                App.instance.ShowAlertDialog("Nạp bằng CodePay hiện tại đang bảo trì");
            }

            // if (this.tabSelectedIdx == 4) {
            //     App.instance.ShowAlertDialog("Nạp bằng Momo hiện tại đang bảo trì");
            //     this.tabSelectedIdx = 0;
            // }
            this.tabNapThe.reset();
            this.tabNapThe.dropdownAmount.dismiss();
        }
        // for (let j = 0; j < this.tabs.toggleItems.length; j++) {
        //     this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.WHITE : cc.Color.WHITE;
        // }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabNapThe.reset();
                break;
            case 1:
                this.tabTransfer.reset();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                // this.tabCard.reset();
                break;
            case 5:
                this.tabBitCoin.start(this);
                break;
        }
    }

    private longToTime(l: number): string {
        return (l / 60) + " giờ " + (l % 60) + " phút";
    }

    actNextOnepay() {
        this.tabOnePay.actNext();
    }
    actBackOnepay() {
        this.tabOnePay.actBack();
    }
    actOTPOnepay() {
        this.tabOnePay.actOtp();
    }
    actSubmitOnepay() {
        this.tabOnePay.submit();
    }

    actCoppyTransId() {
        this.tabOnePay.actCopytransId();
    }

    actShowDialog(msg) {
        this.dialogLable.string = msg;
        this.dialogCoppy.active = true;
        this.scheduleOnce(() => {
            this.dialogCoppy.active = false;
        }, 1)

    }



    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    showAndOpenTransfer(nickname: string = null) {
        super.show();
        this.tabSelectedIdx = 1;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
        if (nickname != null) {
            this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = nickname;
            App.instance.showLoading2(true);
            MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        }
    }

    actShowHuongDan() {
        // this.popupHuongDan.setBg(this.tabSelectedIdx);
        this.popupHuongDan.show();
    }
    actCloseHD() {
        this.popupHuongDan.dismiss();
    }
    actCloseX() {
        this.tabBank.actCloseX();
        this.tabMomo.actCloseX();
        this.tabCodePay.actCloseX();
        this.dismiss();
    }

    actCloseCodePay() {
        this.tabCodePay.actCloseX();
    }

    actSubmitNapThe() {
        this.tabNapThe.submit();
    }

    actContinueTransfer() {
        if (!this.tabTransfer.receiverAgent) {
            App.instance.alertDialog.showMsg("Chỉ có thể chuyển tiền cho tài khoản đại lý");
            return;
        }
        this.tabTransfer.continue();
    }

    actGetOTP() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actSubmitTransfer() {
        let otp = this.tabTransfer.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
            return;
        }
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    }

    actSubmitNapMomo() {
        this.tabMomo.submit();
    }

    actSubmitDoneNapMomo() {
        this.tabMomo.submitDone();
    }

    actSubmitNapNganHang() {
        Http.get(Configs.App.API, { "c": 4050, "nickname": Configs.Login.Nickname }, (err, res) => {
            if (err == null) {
                if(res.error == 1) {
                    this.tabBank.popupUpdateBankCashout.show();
                } else {
                    this.tabBank.GenBank();
                }
            }
        });

    }

    actSubmitDoneNapNganHang() {
        this.tabBank.submit();
    }

    actCreateCodePay() {
        this.tabCodePay.createCode();
    }

    actCreateCodeMomoSun() {
        this.tabMomo.createCode();
    }

    actSubmitNapCodePay() {
        this.tabCodePay.submit();
    }

    actSubmitCard() {
        // this.tabCard.submit();
    }
}
