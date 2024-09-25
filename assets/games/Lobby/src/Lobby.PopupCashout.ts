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
import PopUpHuongDanNap from "./Lobby.PopUpHuongDanNap";
import AudioManager from "../../../scripts/common/Common.AudioManager";
import {Tab} from "./Lobby.TabsListGame";
import nodeUtils from "../../../scripts/common/NodeUtils";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupCashout.TabRutThe")
export class TabRutThe {
    @property(Dropdown)
    dropdownTelco: Dropdown = null;
    @property(Dropdown)
    dropdownAmount: Dropdown = null;
    @property(Dropdown)
    dropdownQuantity: Dropdown = null;
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblSum: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;
    @property({ type: cc.AudioClip })
    soundClickSun: cc.AudioClip = null;
    
    @property(cc.ToggleContainer)
    tabNhaMangs: cc.ToggleContainer = null;
    private tabSelectedIdx = 0;


    private sumCashout : number = 0;

    start() {
        for (let i = 0; i < this.tabNhaMangs.toggleItems.length; i++) {
            this.tabNhaMangs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                AudioManager.getInstance().playEffect(this.soundClickSun);
                console.log("tab thay doi" + this.tabSelectedIdx);
                this.reset();
                this.dropdownAmount.dismiss();
                //this.onTabChanged();
            });
        }
       this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
       let fee = Configs.App.SERVER_CONFIG.ratioRutThe - 1;
       let feeNum = fee > 0 ? Math.ceil(fee * 100) : 0;
       this.lblFee.string = Utils.formatNumber(feeNum)+ "%"
    }

    reset() {
        this.dropdownTelco.setOptions(["Chọn nhà mạng"].concat(Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang));
        this.dropdownQuantity.setOptions(["Chọn số lượng"].concat(Configs.App.CASHOUT_CARD_CONFIG.listQuantity))
        let telName = Configs.App.CASHOUT_CARD_CONFIG.listTenNhaMang[this.tabSelectedIdx];
        let listMenhGia = ["Chọn mệnh giá"];
        for (let i = 0; i < Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe.length; i++) {
            listMenhGia.push(telName + " " + Utils.formatNumber(Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe[i]));
        }

        this.dropdownAmount.setOptions(listMenhGia);
        let that = this;
        this.dropdownAmount.setOnValueChange((idx)=>{
            that.setSumblb()
        });
        this.dropdownQuantity.setOnValueChange((idx)=>{
            that.setSumblb()
        });
        this.dropdownTelco.setOnValueChange((idx)=>{
            that.setSumblb()
        });
        this.resetForm();
    }

    setSumblb(){
        let amount = this.dropdownAmount.getValue();
        let telco = this.tabSelectedIdx+1;
        let quanitySelected = 1;
        if(quanitySelected == 0 || amount == 0 || telco == 0){
            this.lblSum.string = "0";
            return;
        }
        let amountNum = Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe[amount - 1];
        let quantity = Configs.App.CASHOUT_CARD_CONFIG.listQuantity[quanitySelected - 1];
        let sum = amountNum * Number(quantity);
        sum *= Configs.App.SERVER_CONFIG.ratioRutThe;
        this.sumCashout = sum;
        this.lblSum.string = Utils.formatNumber(sum);
    }

    resetForm() {
        this.dropdownTelco.setValue(0);
        this.dropdownAmount.setValue(0);
        this.dropdownQuantity.setValue(0);
        
    }

    submit() {
        let ddTelcoValue =  this.tabSelectedIdx+1;;
        let ddAmountValue = this.dropdownAmount.getValue();
        let ddQuantityValue = 1;
        
        if (ddTelcoValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn nhà mạng.");
            return;
        }
        if (ddAmountValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn mệnh giá.");
            return;
        }
        if (ddQuantityValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn Số lượng.");
            return;
        }
        
        let telcoId = Configs.App.CASHOUT_CARD_CONFIG.listIdNhaMang[ddTelcoValue - 1];
        let amount = Configs.App.CASHOUT_CARD_CONFIG.listMenhGiaNapThe[ddAmountValue - 1];
        let quantity = Number(Configs.App.CASHOUT_CARD_CONFIG.listQuantity[ddQuantityValue - 1]);
        console.log("telcoId ===========>" , ddTelcoValue);
        let sum = amount * Number(quantity);
        sum *= Configs.App.SERVER_CONFIG.ratioRutThe;
        if(sum > Configs.Login.Coin){
            App.instance.alertDialog.showMsg("Số dư không đủ!");
            return;
        }

        let sodu = Configs.Login.Coin - amount;
        if(sodu < 50000){
            App.instance.alertDialog.showMsg("Số dư sau khi rút phải lớn hơn hoặc bằng 50k vnd!");
            return;
        }

        App.instance.showLoading2(true);
        setTimeout(() => {
            App.instance.showLoading2(false);
        }, 2000);
        // if(Configs.App.secretCode ===""){

        //     App.instance.popUpSercretCode.show();

        // } else{
        Http.get(Configs.App.API, {
            "c": 4088,
            "amount": amount,
            "telcoid": telcoId,
            "quantity": quantity
        }, (err, res) => {
            if (err != null)
            {
                App.instance.alertDialog.showMsg("Hệ thống đang quá tải. Vui lòng thử lại hoặc liên hệ CSKH");
                return;
            }
            if (res.errorCode == 0) {
                App.instance.alertDialog.showMsg("Rút thẻ thành công.");
            } else {
                App.instance.alertDialog.showMsg("Rút thẻ thất bại. Vui lòng thử lại hoặc liên hệ CSKH");
            }
        });
            // MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutCard(telcoId, amount, quantity));
            // App.instance.checkSecretCodePopUp(()=>{
            
            //     MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutCard(telcoId, amount, quantity));
            // })
       
       // }
        
    }
}


@ccclass("Lobby.PopupCashout.TabBank")
export class TabBank {
    
    // @property(cc.Node)
    // txtSum: cc.Node = null;

    // @property(cc.Label)
    // lblCoin: cc.Label = null;
    @property(cc.Label)
    lblSum: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;

    @property(cc.EditBox)
    edbBankNumber: cc.EditBox = null;

    @property(cc.EditBox)
    edbBankAccountName: cc.EditBox = null;

    @property(cc.Label)
    lblBankNameX: cc.Label = null;

    private _listBank = [];
    private fee: number = 1;
    private minCashout = 0;
    private maxCashout = 0;
    private isAllowCashout = false;
    private sum = 0;
    private mesNotAllowCashout = 'Hệ thống rút tiền đang bảo trì, vui lòng đợi hết bảo trì Xin cảm ơn!';

    start() {
      //  this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading2(false);
            if (err == null) {
                if(res.list_bank_cashout === undefined || res.list_bank_cashout.length == 0){

                    return;
                }

                let listBank = res.list_bank_cashout;
                this._listBank = listBank;
                let bankName = ["Chọn Ngân Hàng"];
                for(let i = 0; i < listBank.length; i ++){
                    bankName.push(listBank[i].bankName);
                }

                // this.lblBankNameX.string = bankName[0];
                this.dropdownBank.setOptions(bankName);
                this.fee = res.ratio_cashout_bank;
                this.minCashout = res.cashout_bank_min;
                this.maxCashout = res.cashout_bank_max;
                this.isAllowCashout = res.is_cashout_bank_sunvin == 1 ? false : true;
                this.mesNotAllowCashout = res.mes_notcashout_bank;

                this.lblFee.string = Math.round((this.fee - 1) * 100) + "%";

                this.checkAccBank();
                
            }
        });

    }

    checkAccBank(){
        Http.get(Configs.App.API, { "c": 4050, "nickname": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading2(false);
            if (err == null) {
                if(res.error == 0) {
                    // this.lblBankNameX.string = res.bankname;
                    this.edbBankAccountName.string = res.nameBank;
                    this.edbBankAccountName.node.off(cc.Node.EventType.TOUCH_END);
                }
            }
        });
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

    submit() {
        if(!this.isAllowCashout){
            App.instance.alertDialog.showMsg(this.mesNotAllowCashout);
            return;
        }
        let ddBank = this.dropdownBank.getValue();
        if (ddBank == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
            return;
        }
        let bankSelected = this._listBank[ddBank - 1].bankName;
        if(bankSelected == null) {
            App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng");
            return;
        }
        let amountSt = this.edbAmount.textLabel.string.trim();
        let amount = Utils.stringToInt(amountSt);
        if(amount <= 0 ){
            App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
            return;
        }

        if(amount > this.maxCashout){
            App.instance.alertDialog.showMsg("Số tiền rút tối đa là "+ Utils.formatNumber(this.maxCashout));
            return;
        }
        if(amount < this.minCashout){
            App.instance.alertDialog.showMsg("Số tiền rút tối thiểu là "+ Utils.formatNumber(this.minCashout));
            return;
        }
        this.sum = amount * this.fee;
        if(this.sum > Configs.Login.Coin){
            App.instance.alertDialog.showMsg("Số dư không đủ");

            return;
        }

        let bankNumber = this.edbBankNumber.string.trim();
        if(bankNumber == ""){
            App.instance.alertDialog.showMsg("Vui lòng nhập số tài khoản!");
            return;
        }
        let bankActName = this.cleanAccents(this.edbBankAccountName.string.trim());
        bankActName = bankActName.split(' ').join('_');

        if(bankActName == ""){
            App.instance.alertDialog.showMsg("Vui lòng nhập tên tài khoản");
            return;
        }

        // CALL API
        App.instance.showLoading2(true);
        let reqParams = { "c": 4052, "bankname": bankSelected, "amount": amount, "bankacc": bankActName, "banknum": bankNumber};
        Http.get(Configs.App.API, reqParams, (err, res) => {
            App.instance.showLoading2(false);
            if(res.error == 200){
                Configs.Login.Coin = res.currentMoney;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.alertDialog.showMsg("Rút tiền thành công, vui lòng chờ 1-3 phút để nhân viên xử lý");
            } else{
                App.instance.alertDialog.showMsg("Hệ thống quá tải vui lòng quay lại sau!");
            }
        });
        // CALL websocket
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
    }

    amountChange(){
        let amount = Utils.stringToInt(this.edbAmount.textLabel.string.trim());
        if (amount <= 0) {
            //this.txtSum.active = false;
            return;
        }
        let amountSend = Number(amount);
        if(amountSend < this.minCashout || amountSend > this.maxCashout)
        { 
            //this.txtSum.active = false;
            return;
        }
       
        this.sum = Math.floor(amountSend * this.fee);

        if(this.sum > Configs.Login.Coin){
           // this.txtSum.active = false;
            return;
        }
        this.lblSum.string = Utils.formatNumber(this.sum);
      //  this.txtSum.active = true;
    }

    

    
}

@ccclass("Lobby.PopupCashout.TabMomo")
export class TabMomo {
    @property(cc.Node)
    txtSum: cc.Node = null;

    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblSum: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    edbPhone: cc.EditBox = null;

    private fee: number = 1;
    private minCashout = 0;
    private maxCashout = 0;
    private isAllowCashout = false;
    private sum = 0;
    start() {
       
        //get config from server 
        this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            this.fee = res.ratio_cashout_momo;
            this.minCashout = res.cashout_momo_min;
            this.maxCashout = res.cashout_momo_max;
            this.isAllowCashout = res.is_cashout_momo == 1 ? false : true;

            this.lblFee.string = Math.round((this.fee - 1) * 100) + "%";
        });
       

    }
    amountChange(){
        let amount = Utils.stringToInt(this.edbAmount.textLabel.string.trim());
        if (amount <= 0 ) {
            this.txtSum.active = false;
            return;
        }
        let amountSend = Number(amount);
        if(amountSend < this.minCashout || amountSend > this.maxCashout)
        { 
            this.txtSum.active = false;
            return;
        }
       
        this.sum = Math.floor(amountSend * this.fee);

        if(this.sum > Configs.Login.Coin){
            this.txtSum.active = false;
            return;
        }
        this.lblSum.string = Utils.formatNumber(this.sum);
        this.txtSum.active = true;
    }

    submit() {
        if(!this.isAllowCashout){
            App.instance.alertDialog.showMsg("Rút Momo đang bảo trì, vui lòng thử lại sau!");
            return;
        }
        let amount = Utils.stringToInt(this.edbAmount.textLabel.string.trim());
        let phoneSend = this.edbPhone.string.trim();
        
        if (amount <= 0) {
            App.instance.alertDialog.showMsg("Số tiền không hợp lệ");
            return;
        }
        
        if (phoneSend == "") {
            App.instance.alertDialog.showMsg("Vui lòng nhập số điện thoại nhận tiền");
            return;
        }
        let amountSend = Number(amount);
        if(amountSend > this.maxCashout){
            App.instance.alertDialog.showMsg("Số tiền rút tối đa là "+ Utils.formatNumber(this.maxCashout));
            return;
        }
        if(amountSend < this.minCashout){
            App.instance.alertDialog.showMsg("Số tiền rút tối thiểu là "+ Utils.formatNumber(this.minCashout));
            return;
        }
        this.sum = amountSend * this.fee;
        if(this.sum > Configs.Login.Coin){
            App.instance.alertDialog.showMsg("Số dư không đủ");

            return;
        }

        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutMomo(phoneSend, amountSend));
    }


    

    
}


@ccclass
export default class PopupCashout extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(TabRutThe)
    tabNapThe: TabRutThe = null;
    
    @property(TabMomo)
    tabMomo: TabMomo = null;
    
    @property(PopUpHuongDanNap)
    popupHuongDan : PopUpHuongDanNap =null;
    
    
    actShowHD(){
        this.popupHuongDan.show();
    }
    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];


    @property(TabBank)
    tabBank: TabBank = null;



    private tabSelectedIdx = 0;

    start() {
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

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
               case cmd.Code.CASHOUT_CARD: {
                App.instance.showLoading2(false);
                let res = new cmd.ResCashoutCard(data);
                console.log(JSON.stringify(res));
                if(res.error == 0){
                    Configs.Login.Coin = res.currentMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    App.instance.alertDialog.showMsg("Rút thẻ thành công , bạn vui lòng chờ 1-3 phút để hệ thống xử lý");
                    // App.instance.popupCardInfo.setListItem(res.listCard);
                }else if(res.error == 7){
                    App.instance.alertDialog.showMsg("Bạn cần xác minh số điện thoại để rút thẻ");
                }
                else{
                    App.instance.alertDialog.showMsg("Hệ thống quá tải vui lòng quay lại sau!");
                }
                break;

                //console.log(res);
               }
               case cmd.Code.CASHOUT_BANK: {
                   App.instance.showLoading2(false);
                   let res = new cmd.ResCashoutBank(data);
                   if(res.error == 0){
                    Configs.Login.Coin = res.currentMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    App.instance.alertDialog.showMsg("Rút tiền thành công, vui lòng chờ 1-3 phút để nhân viên xử lý");
                   } else{
                    App.instance.alertDialog.showMsg("Hệ thống quá tải vui lòng quay lại sau!");
                   }
                   break;
               }
               case cmd.Code.CASHOUT_MOMO: {
                App.instance.showLoading2(false);
                let res = new cmd.ResCashoutMomo(data);
                if(res.error == 0){
                 Configs.Login.Coin = res.currentMoney;
                 BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                 App.instance.alertDialog.showMsg("Rút tiền thành công, vui lòng chờ 1-3 phút để nhân viên xử lý");
                } else{
                 App.instance.alertDialog.showMsg("Rút tiền không thành công!");
                }
                break;
            }
            }
        }, this);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
           // this.tabNapThe.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
           // this.tabBank.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
            this.tabMomo.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        this.tabNapThe.start();
       
        this.tabBank.start();
        this.tabMomo.start();
    }

    private onTabChanged() {
        AudioManager.getInstance().playEffect(this.soundClickSun);
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            //this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
        this.tabNapThe.dropdownAmount.dismiss();
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabBank.checkAccBank();
                this.tabNapThe.reset();
                break;
            case 1:
                break;
            
        }
    }

    private longToTime(l: number): string {
        return (l / 60) + " giờ " + (l % 60) + " phút";
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    

    actSubmitNapThe() {
        this.tabNapThe.submit();
    }

    actSubmitMomo() {
        this.tabMomo.submit();
    }

    

    actGetOTP() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }
    
    actSubmitNapNganHang() {
        this.tabBank.submit();
    }
    changeAmountMomo(){
        this.tabMomo.amountChange();
    }
    changeAmountBank(){
        this.tabBank.amountChange();
    }

    
}
