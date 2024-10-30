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

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyPopupTransferToUser extends Dialog {

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbCoinTransfer: cc.EditBox = null;
    @property(cc.EditBox)
    edbNote: cc.EditBox = null;
    @property(PopupSecurityPhone)
    popupSecurityPhone: PopupSecurityPhone = null;

    ratioTransfer = Configs.App.SERVER_CONFIG.ratioTransfer;

    receiverAgent: boolean = false;

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    if (res.error == 0) {
                        this.edbNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                        break;
                    }
                    break;
                }
                case cmd.Code.TRANSFER_MONEY_TO_DAILY: {
                    App.instance.showLoading2(false);
                    App.instance.alertDialog.showMsg("Chuyen tien dai ly chua okee");
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultTransferCoin(data);
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
                        case 23:
                            App.instance.alertDialog.showMsg("Nickname người nhận không tồn tại.");
                            break;
                        case 24:
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            this.actResetFiled();
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
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            this.actResetFiled()
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    break;
                }
            }
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        }, this);
    }


    show() {
        Http.get(Configs.App.API, { "c": 4020, "nickname": SPUtils.getNickName() }, (err, res) => {
            if (err == null) {
                if(res == '0') {
                    App.instance.alertDialog.showMsg("Vui lòng xác thực tài khoản để thực hiện chuyển tiền!");
                    this.popupSecurityPhone.show();
                } else {
                    super.show();
                    this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
                    this.edbNickname.string = "";
                    this.edbCoinTransfer.string = "";
                    this.edbNote.string = "";
                }
            }
        });
    }

    actResetFiled() {
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.edbNickname.string = "";
        this.edbCoinTransfer.string = "";
        this.edbNote.string = "";
    }

    actSubmit() {
        let nickname = this.edbNickname.textLabel.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.textLabel.string);
        let note = this.edbNote.string.trim();
        if (nickname == "") {
            App.instance.alertDialog.showMsg("Nickname không được để trống.");
            return;
        }
        if (note == "") {
            App.instance.alertDialog.showMsg("Lý do chuyển khoản không được để trống.");
            return;
        }
        if (coin < 10000) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch tối thiểu bằng 20.000.");
            return;
        }

        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số dư không đủ.");
            return;
        }

        if (Configs.Login.Coin < 100000)  {
            App.instance.alertDialog.showMsg("Số dư chuyển tiền tối thiểu 100.000.");
            return;
        }

        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + " Số tiền: " + this.edbCoinTransfer.textLabel.string + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading2(true);
                //App.instance.checkSecretCodePopUp(()=>{
                    //   MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
                      
                    //   MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(nickname, coin, note));
                   //})
                   MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(nickname, coin, note));

            //     if(Configs.App.secretCode ===""){

            //         App.instance.popUpSercretCode.show();
        
            //     } else{

            //     MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(nickname, coin, note));
            // }
        }
        });
    }


    actSubmitTransfer() {
        // if(Configs.App.secretCode ===""){

        //     App.instance.popUpSercretCode.show();

        // } else{
        App.instance.showLoading2(true);
       // App.instance.checkSecretCodePopUp(()=>{
            //   MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
            //MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(this.edbNickname.textLabel.string.trim(), Utils.stringToInt(this.edbCoinTransfer.textLabel.string.trim()), this.edbNote.string));

             //  MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(nickname, coin, note));
           //})
           MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(this.edbNickname.textLabel.string.trim(), Utils.stringToInt(this.edbCoinTransfer.textLabel.string.trim()), this.edbNote.string));

   // }
}

}
