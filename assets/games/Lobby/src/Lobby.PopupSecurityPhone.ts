import Dialog from "../../../scripts/common/Dialog";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "../../../scripts/common/Lobby.Cmd";
import App from "../../../scripts/common/App";
import SPUtils from "../../../scripts/common/SPUtils";
import Http from "../../../scripts/common/Http";
import utils from "../../../scripts/common/Utils";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import ApiIDEnum from "./enum/ApiIDEnum";
import GameURL from "../../../scripts/common/game/GameURL";
import Configs from "../../../scripts/common/Configs";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupSecurityPhone.PanelSmsPlus")
export class PanelSmsPlus {
    @property(cc.Node)
    update: cc.Node = null;
    @property(cc.Node)
    continue: cc.Node = null;
    @property(cc.EditBox)
    continueEdbOTP: cc.EditBox = null;
    @property(cc.Node)
    countDown: cc.Node = null;
    @property(cc.Node)
    btnGetOTP: cc.Node = null;
    @property(cc.Node)
    btnGetOTPDis: cc.Node = null;
    @property(cc.Label)
    lblCountDown: cc.Label = null;
    @property(cc.Label)
    lblTitle = null;
}

@ccclass
export default class PopupSecurityPhone extends Dialog {
    @property(cc.EditBox)
    updateEdbPhoneNumber: cc.EditBox = null;
    @property(PanelSmsPlus)
    panelSmsPlus: PanelSmsPlus = null;

    private phoneNumber = "";

    private showSmsPlusContinue() {
        this.panelSmsPlus.update.active = false;
        this.panelSmsPlus.continue.active = true;
        this.panelSmsPlus.continueEdbOTP.string = "";
    }

     private count: number = 180;

    counter() {
       this.panelSmsPlus.countDown.active = true;
       this.panelSmsPlus.lblCountDown.string = "Quý khách vui lòng chờ trong giây lát! " + this.count + " s";
       this.count--;
       if(this.count < 0) {
            this.panelSmsPlus.lblCountDown.string = "Nếu chưa có tin nhắn gửi về Quý khách vui lòng ấn Lấy OTP để thử lại!";
            this.panelSmsPlus.btnGetOTP.active = true;
            this.panelSmsPlus.btnGetOTPDis.active = false;
            return;
       };
       setTimeout(() => {
          this.counter();
       }, 1000);
    }

    actionCopyUrl() {
        let urlweb = Configs.App.LINK_BOT_OTP+"?start="+Configs.Login.AccessToken+"-"+Configs.Login.Nickname;
        utils.copyTextToClipboard(urlweb);
    }
    actActiveByTele() {
        let urlweb = Configs.App.LINK_BOT_OTP+"?start="+Configs.Login.AccessToken+"-"+Configs.Login.Nickname;
        cc.sys.openURL(urlweb);
    }
    actSmsPlusSubmitPhoneNumber() {

        let phoneNumber = this.updateEdbPhoneNumber.string.trim();
        if (phoneNumber.length == 0) {
            App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
            return;
        }
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, { "c": 4021, "nickname": SPUtils.getNickName(), "username": SPUtils.getUserName(), "phone": phoneNumber }, (err, res) => {
            if (err == null) {

                App.instance.showLoading2(false);
                if (res == '1') {
                    this.count = 180;
                    this.counter();
                    this.showSmsPlusContinue();
                } else if (res == '500') {
                    App.instance.alertDialog.showMsg("Mỗi thao tác lấy SMS OTP phải cách nhau ít nhất 3 phút!");
                } else if (res == '0') {
                    App.instance.alertDialog.showMsg("Số điện thoại đã được đăng ký bởi tài khoản khác!");
                } else if (res == '444') {
                    App.instance.alertDialog.showMsg("Để kích hoạt SDT, tài khoản game phải có tối thiểu 1.000 !");
                } else {
                    App.instance.alertDialog.showMsg("Số điện thoại không đúng, Quý khách vui kiểm tra lại số điện thoại!");
                }
            }
        });
    }

    actSmsPlusSubmitContinuePhoneNumber() {
        let otp = this.panelSmsPlus.continueEdbOTP.string.trim();
        let activePhoneNumberSuccessfully = 'Kích hoạt số điện thoại thành công.';
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
            return;
        }
        App.instance.showLoading2(true);
        let params = {
            "c": ApiIDEnum.VERIFY_PHONE_OTP,
            "nickname": Configs.Login.Nickname,
            "otp": otp
        };
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading2(false);
            if(!res.success) {
                App.instance.actShowThongBao(res.errorCode);
                return;
            } else {
                App.instance.actShowThongBao(activePhoneNumberSuccessfully);
                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                this.dismiss();
            }
        });
    }

    protected onLoad() {
        if(!Configs.Login.MobileSecured) {
            this.panelSmsPlus.update.active = true;
            this.panelSmsPlus.continue.active = false;
            this.panelSmsPlus.lblTitle.string = `KÍCH HOẠT SĐT`;
        }
    }

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            // console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_SECURITY_INFO: {
                    let res = new cmd.ResGetSecurityInfo(data);
                    Configs.Login.MobileSecured = res.mobileSecure !== 0;
                    Configs.Login.AppSecured = res.appSecure !== 0;
                    break;
                }
                case cmd.Code.UPDATE_USER_INFO: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResUpdateUserInfo(data);
                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                                App.instance.alertDialog.showMsg("Kết nối mạng không ổn định. Vui lòng thử lại sau!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("Số điện thoại không hợp lệ!");
                                break;
                            case 5:
                            case 11:
                                App.instance.alertDialog.showMsg("Số điện thoại đã được đăng ký bởi tài khoản khác!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }

                    App.instance.alertDialog.showMsg("Kích hoạt bảo mật thành công!");
                    BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                    this.dismiss();
                    //this.showSmsPlusContinue();
                    // this.actSmsPlusActivePhone();
                    break;
                }
                case cmd.Code.CHANGE_PHONE_NUMBER: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResChangePhoneNumber(data);
                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                                App.instance.alertDialog.showMsg("Kết nối mạng không ổn định. Vui lòng thử lại sau!");
                                break;
                            case 2:
                                App.instance.alertDialog.showMsg("Số điện thoại không hợp lệ!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Số điện thoại mới trùng với số điện thoại cũ!");
                                break;
                            case 4:
                            case 5:
                                App.instance.alertDialog.showMsg("Số điện thoại đã được đăng ký bởi tài khoản khác!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }
                    //this.showSmsPlusContinue();
                    App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP (Số điện thoại cũ) để tiếp tục thay đổi số điện thoại bảo mật!");
                    break;
                }
                case cmd.Code.GET_OTP: {
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
                    App.instance.showLoading2(false);
                    let res = new cmd.ResSendOTP(data);
                    // console.log(res);
                    if (res.error != 0) {
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
                    break;
                }
                case cmd.Code.ACTIVE_PHONE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResActivePhone(data);
                    switch (res.error) {
                        case 0:
                            // this.showSmsPlusContinue();
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("Kết nối mạng không ổn định. Vui lòng thử lại sau!");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("Số điện thoại đã được đăng ký bởi tài khoản khác!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_ACTIVE_MOBILE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("Kích hoạt bảo mật thành công!");
                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                        //this.onTabChanged();
                    } else {
                        App.instance.alertDialog.showMsg("Kích hoạt bảo mật không thành công!");
                    }
                    break;
                }
                case cmd.Code.RESULT_ACTIVE_NEW_MOBILE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("Thay đổi số điện thoại và kích hoạt bảo mật thành công!");
                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                        //this.onTabChanged();
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công, vui lòng thử lại sau!");
                    }
                    break;
                }
                case cmd.Code.RESULT_CHANGE_MOBILE_ACTIVED: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        //this.showSmsPlusContinue();
                        App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP (Số điện thoại mới) để hoàn tất thay đổi số điện thoại bảo mật!");
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công, vui lòng thử lại sau!");
                    }
                    break;
                }
            }
        }, this);
    }

    show() {
        super.show();
        this.phoneNumber = "";
    }

    protected onEnable() {
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
    }

    actSmsPlusSubmitUpdatePhoneNumber() {
        let phoneNumber = this.updateEdbPhoneNumber.string.trim();
        if (phoneNumber.length == 0) {
            App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
            return;
        }
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqChangePhoneNumber(phoneNumber));
    }


    actSmsPlusSubmitUpdateUserInfo() {
        this.phoneNumber = this.updateEdbPhoneNumber.string.trim();
        if (this.phoneNumber.length == 0) {
            App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
            return;
        }
        App.instance.showLoading2(true);
        let params = {
            "c": ApiIDEnum.GET_PHONE_OTP,
            "nickname": Configs.Login.Nickname,
            "phoneNumber": this.phoneNumber,
            "at": Configs.Login.AccessToken
        }
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading2(false);
            if(!res.success) {
                App.instance.actShowThongBao(res.errorCode);
                return;
            } else {
                this.panelSmsPlus.update.active = false;
                this.panelSmsPlus.continue.active = true;
            }
        });
    }

    actResendPhoneOTP() {
        let msgEnterPhoneSuccessfully = 'Mã OTP đã được gửi về số của bạn.';
        let params = {
            "c": ApiIDEnum.GET_PHONE_OTP,
            "nickname": Configs.Login.Nickname,
            "phoneNumber": this.phoneNumber
        }

        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading2(false);
            if(!res.success) {
                App.instance.actShowThongBao(res.errorCode);
                return;
            } else {
                if(res.errorCode == "0") {
                    App.instance.actShowThongBao(msgEnterPhoneSuccessfully);
                    this.panelSmsPlus.update.active = false;
                    this.panelSmsPlus.continue.active = true;
                }
            }
        });
    }

    actSmsPlusActivePhone() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqActivePhone());
    }


    actGetOTP() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actOpenBotOTP() {
        cc.sys.openURL(`${GameURL.BOT_TELEGRAM}?start=${Configs.Login.Nickname}`);
    }

}
