import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import Configs from "../../../../scripts/common/Configs";
import ApiIDEnum from "../enum/ApiIDEnum";
import Utils from "../../../../scripts/common/Utils";
import ChargeBankEnum from "../enum/ChargeBankEnum";

const {ccclass, property} = cc._decorator;

let bank_code_value = {
    ABBANK: "970425",
    ACB: "970416",
    AGRIBANK: "970405",
    BAB: "970409",
    BIDV: "970418",
    BVBANK: "970438",
    COOPBANK: "970446",
    DABANK: "970406",
    EXIMBANK: "970431",
    GPBANK: "970408",
    HDBANK: "970437",
    HLBANK: "970442",
    IVB: "970434",
    KLB: "970452",
    LVB: "970449",
    MB: "970422",
    MSB: "970426",
    NAMABANK: "970428",
    NCB: "970419",
    OCB: "970448",
    PGBANK: "970430",
    PVC: "970412",
    SCB: "970429",
    SEA: "970440",
    SGBANK: "970400",
    SHINHAN: "970424",
    SHB: "970443",
    SACOMBANK: "970403",
    TCB: "970407",//TECHCOMBANK
    TPB: "970423",//tien phong bank
    UOB: "970458",
    VAB: "970427",
    VC: "970460",
    VCB: "970436",//VIETCOMBANK
    VCCB: "970454",
    // VIB: "970441",
    VPB: "970432",//vp bank
    VRB: "970421",
    VIB: "970415",//VIETINBANK
    WRB: "970457",
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    itemBankTemplate = null;
    @property(cc.Node)
    bankNameContainer = null;
    @property(cc.Label)
    lblBankName = null;
    @property(cc.Node)
    dropDownBank = null;
    @property(cc.Label)
    lblBankNumber = null;
    @property(cc.Label)
    lblBankOwner = null;
    @property(cc.Label)
    lblBankContent = null;
    @property(cc.Label)
    lblBankBranch = null;
    @property(cc.Label)
    lblBankApp = null;
    @property(cc.Node)
    nodeQRCode = null;
    @property(cc.Node)
    nodeBank = null;
    @property(cc.Node)
    nodeQR = null;

    private _listBank = [];
    private _selectedBank = null;
    private _bankCode = "";

    private nodeActiveTab = null;
    private currentTab = "";

    protected start() {
        this.nodeActiveTab = this.nodeBank;
        this.currentTab = ChargeBankEnum.CHARGE_BANK_NUMBER;

        Http.get(Configs.App.API, { "c": ApiIDEnum.GAME_CONFIG }, (err, res) => {
            if(err) {
                console.log(err);
                App.instance.alertDialog.showMsg(err);
            } else {
            }
        });
    }

    protected onEnable() {
        let getBankPartnerError = 'Lấy thông tin ngân hàng lỗi';
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.LIST_CHARGE_AUTO_BANK}, (err, res) => {
                if(err) {
                    App.instance.alertDialog.showMsg(err);
                    return;
                }
                if(res) {
                    this.initBankList(res.data);
                }
            });
        } catch (ex) {
            console.log(ex);
            App.instance.alertDialog.showMsg(getBankPartnerError);
        }
    }

    initBankList(_listBank) {
        if(_listBank.length === 0) {
            return;
        }
        this.bankNameContainer.removeAllChildren(true);
        this._listBank = _listBank;
        for(let i = 0 ; i < _listBank.length; i++) {
            let bankItem = cc.instantiate(this.itemBankTemplate);
            bankItem.getComponentInChildren(cc.Label).string = _listBank[i].shortName;
            bankItem.active = true;
            this.bankNameContainer.addChild(bankItem);
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TabChargeAutoBank";
            clickEventHandler.handler = "actSelectBank";
            clickEventHandler.customEventData = _listBank[i].code;
            bankItem.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
    }

    actSelectBank(event, data) {
        this._bankCode = data;
        this._selectedBank = this._listBank.find((bank) => bank.code === this._bankCode);
        this.lblBankName.string = this._selectedBank.shortName;
        this.setupBankInformation();
        this.dropDownBank.runAction(
            cc.scaleTo(.15, 1, 0)
        );
    }

    setupBankInformation() {
        let self = this;
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.CHARGE_AUTO_BANK_DETAIL, "chargeType": "bank", "amount": 0, "subType": this._bankCode, "nn": Configs.Login.Nickname}, (err, res) => {
                if(err) {
                    App.instance.alertDialog.showMsg(err);
                    return;
                }
                if(res) {
                    this.lblBankNumber.string = res.BankAccountNumber;
                    this.lblBankOwner.string = res.BankAccountName;
                    this.lblBankContent.string = res.Description;
                    this.lblBankBranch.string = 'HÀ NỘI';
                    this.lblBankApp.string = res.subType;
                    this.nodeQRCode.active = true;
                    this.nodeQRCode.getComponent('CQRCode').string = this.getQRCode(bank_code_value[this._bankCode.toUpperCase()], res.BankAccountNumber, res.Description, '0');
                }
            });
        } catch(ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        } finally {
            App.instance.showLoading2(false);
        }
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

    copyBankNumberToClipBoard() {
        if(this.lblBankNumber.string.trim().length === 0) {
            App.instance.actShowThongBao('Không có dữ liệu');
            return;
        }
        App.instance.actShowThongBao('Sao chép thành công');
        Utils.copyTextToClipboard(this.lblBankNumber.string);
    }

    copyTransferContentToClipBoard() {
        if(this.lblBankContent.string.trim().length === 0) {
            App.instance.actShowThongBao('Không có dữ liệu');
            return;
        }
        App.instance.actShowThongBao('Sao chép thành công');
        Utils.copyTextToClipboard(this.lblBankContent.string);
    }

    changeTabClick(event, data) {
        if(data.toString() === this.currentTab) {
            return;
        }
        this.activeTab(data.toString());
    }

    activeTab(tabName) {
        this.nodeActiveTab.active = false;

        switch (tabName) {
            case ChargeBankEnum.CHARGE_BANK_NUMBER:
                this.nodeActiveTab = this.nodeBank;
                break;
            case ChargeBankEnum.CHARGE_BANK_QR:
                this.nodeActiveTab = this.nodeQR;
                break;
        }

        this.nodeActiveTab.active = true;
        this.currentTab = tabName;
    }

    getQRCode(BINCode, bankNumber, transferContent, paymentPrice = '0') {
        // docs : https://vietqr.net/portal-service/download/documents/QR_Format_T&C_v1.0_VN_092021.pdf
        // 2 số đầu là mã ID, 2 số tiếp là độ dài, các số sau đó là giá trị

        let getLength = function (n) {
            return n > 9 ? n : "0" + n
        }

        let consumerAccountSubValue = [
            `0006${BINCode}`,                   // mã BIN của ngân hàng
            `01${getLength(bankNumber.length)}${bankNumber}`   // số tài khoản
        ].join('')

        let consumerAccountValue = [
            '0010A000000727', // định danh của NAPAS (cố định)
            `01${consumerAccountSubValue.length}${consumerAccountSubValue}`,
            '0208QRIBFTTA'    // Mã dịch vụ chuyển tiền nhanh NAPAS bằng QR đến tài khoản
        ].join('')

        let additionalInfo = `08${getLength(transferContent.length)}${transferContent}`

        let subQRCode = [
            '000201',                                                 // Phiên bản dữ liệu (cố định)
            '010212',                                                 // 2 số cuối: 11 -> qr tĩnh (dùng nhiều lần) , 12 -> qr động (dùng 1 lần)
            `38${consumerAccountValue.length}${consumerAccountValue}`,
            '5303704',                                                // Mã tiền tệ -> VND (cố định)
            `54${getLength(paymentPrice.length)}${paymentPrice}`,     // số tiền giao dịch
            '5802VN',                                                 // Mã quốc gia -> VN (cố định)
            `62${getLength(additionalInfo.length)}${additionalInfo}`, // Thông tin bổ sung
            '6304'                                                    // ID và độ dài của CRC
        ].join('')
        // console.log(subQRCode);
        let encodeText = subQRCode + this.calculateCRC16(subQRCode);
        // console.log(encodeText);
        return encodeText;
    }

    calculateCRC16(s) {
        var crcTable = [
            0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5,
            0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b,
            0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
            0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
            0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c,
            0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
            0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b,
            0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
            0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
            0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738,
            0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5,
            0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
            0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969,
            0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96,
            0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
            0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
            0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03,
            0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
            0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6,
            0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
            0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
            0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb,
            0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1,
            0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
            0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c,
            0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2,
            0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
            0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
            0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447,
            0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
            0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2,
            0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
            0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
            0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827,
            0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c,
            0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
            0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0,
            0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d,
            0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
            0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
            0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba,
            0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
            0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
        ];

        var crc = 0xFFFF;
        var j, i;

        for (i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            if (c > 255) {
                throw new RangeError();
            }
            j = (c ^ (crc >> 8)) & 0xFF;
            crc = crcTable[j] ^ (crc << 8);
        }
        let crcResult = ((crc ^ 0) & 0xFFFF).toString(16)

        // add 0 to make crc always returns 4 chars (eg: 'bd6' -> '0bd6')
        return ('0000' + crcResult).slice(-4);
    }

}
