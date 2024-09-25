import Dialog from "../../../scripts/common/Dialog";
import cmd from "../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Http from "../../../scripts/common/Http";
import SPUtils from "../../../scripts/common/SPUtils";
import PopupSecurityPhone from "./Lobby.PopupSecurityPhone";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupTranferToDaiLy extends Dialog {

    // @property(cc.Node)
    // panelContent: cc.Node = null;
    // @property(cc.Node)
    // panelContinue: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    edbNickname: cc.Label = null;
    @property(cc.EditBox)
    edbCoinTransfer: cc.EditBox = null;
    @property(cc.EditBox)
    edbNote: cc.EditBox = null;
    @property(PopupSecurityPhone)
    popupSecurityPhone: PopupSecurityPhone = null;

    ratioTransfer = Configs.App.SERVER_CONFIG.ratioTransfer;

    receiverAgent: boolean = false;
    dataDl: any = null;

    start() {

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    console.log("CHECK_NICKNAME_TRANSFER " + res.error);
                    if (res.error == 0) {
                        this.edbNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                        break;
                    }
                    this.receiverAgent = res.type == 1 || res.type == 2;
                    if (!this.receiverAgent) {
                        this.edbNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản " + this.edbNickname.string + " Không phải là tài khoản đại lý.");
                        break;
                    }
                    // this.lblDaiLy.node.active = res.type == 1 || res.type == 2;
                    // this.lblFee.string = res.fee + "%";
                    // this.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_MONEY_TO_DAILY: {
                    App.instance.showLoading2(false);
                    console.log("TRANSFER_MONEY_TO_DAILY ");
                    App.instance.alertDialog.showMsg("Chuyen tien dai ly chua okee");
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResTransferCoin(data);
                    console.log("TRANSFER_COIN ");
                    switch (res.error) {
                        case 0:
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

                case cmd.Code.RESULT_TRANSFER_COIN: {
                    if (!this.node.active) return;
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    console.log("RESULT_TRANSFER_COIN");
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            this.actResetFiled();
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    //this.tabTransfer.reset();
                    break;
                }
            }
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        }, this);
    }


    private longToTime(l: number): string {
        return (l / 60) + " giờ " + (l % 60) + " phút";
    }


    show() {
        super.show();
    }

    showPopUpTranfer(nickname: string = null, data: any) {
        this.dataDl = data;
        super.show();
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.edbCoinTransfer.string = "";
        this.edbCoinTransfer.placeholder = "";
        this.edbNote.string = "";
        this.edbNote.placeholder = "";
        this.edbNickname.string = nickname;
        // if (nickname != null) {
        //     this.edbNickname.string = nickname;
        //     App.instance.showLoading2(true);
        //     MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        // }
    }

    actResetFiled() {
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.edbCoinTransfer.string = "";
        this.edbCoinTransfer.placeholder = "";
        this.edbNote.string = "";
        this.edbNote.placeholder = "";
    }

    actSubmit() {
        let nickname = this.edbNickname.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.string);
        let note = this.edbNote.string.trim();
        if (nickname == "") {
            App.instance.alertDialog.showMsg("Nickname không được để trống.");
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

        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + " Số tiền: " + this.edbCoinTransfer.string + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoin(nickname, coin, note));
            }
        });
    }

    // actShowHuongDan(){
    //     this.popupHuongDan.setBg(this.tabSelectedIdx);
    //     this.popupHuongDan.show();
    // }
    // actCloseHD(){
    //     this.popupHuongDan.dismiss();
    // }

    // actContinueTransfer() {
    //     if(!this.tabTransfer.receiverAgent)
    //     {
    //         App.instance.alertDialog.showMsg("Chỉ có thể chuyển tiền cho tài khoản đại lý");
    //         return;
    //     }
    //     this.tabTransfer.continue();
    // }

    actSubmitTransfer() {
        // let otp = "";
        // if (otp.length == 0) {
        //     App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
        //     return;
        // }
        // App.instance.alertDialog.showMsg("Số Tiền Không Được Bỏ Trống" + this.edbCoinTransfer.textLabel.string.trim());
        //  if(Configs.App.secretCode ===""){


        console.log(this.edbCoinTransfer.textLabel.string);
        let coin = Utils.stringToInt(this.edbCoinTransfer.textLabel.string);
        let note = this.edbNote.string.trim().replace(/ /g, ".");
        // } else{
        //   App.instance.popUpSercretCode.show();
        Http.get(Configs.App.API, {
            "c": 4094,
            "bank_nhan": this.dataDl.bank,
            "stk_nhan": this.dataDl.banknumber,
            "name_nhan": this.dataDl.bankname.trim().replace(/ /g, "."),
            "tien": coin,
            "nickname_dl": this.dataDl.username,
            "dlid": this.dataDl.dl_id,
            "note": note
        }, (err, res) => {
            if (err == null) {
                if (res.errorcode != 200) {
                    App.instance.alertDialog.showMsg("Vui lòng xác thực tài khoản bằng số điện thoại để thực hiện chức năng này!");
                    this.popupSecurityPhone.show();
                } else {
                    App.instance.alertDialog.showMsg("Chuyển tiền thành công!");
                    this.dismiss();
                }
            }
        });
    }

}
