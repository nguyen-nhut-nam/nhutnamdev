import Dialog from "../../../scripts/common/Dialog";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "../../../scripts/common/Lobby.Cmd";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import nodeUtils from "../../../scripts/common/NodeUtils";
import utils from "../../../scripts/common/Utils";
import PopupProfile from "./Lobby.PopupProfile";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupSecurity extends Dialog {
    // @property(cc.ToggleContainer)
    // tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    // @property(PanelSmsPlus)
    // panelSmsPlus: PanelSmsPlus = null;
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblBalanceSafes: cc.Label = null;
    // @property(TabSafes)
    // tabSafes: TabSafes = null;

    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    // @property([cc.Label])
    // lblContainsBotOTPs: cc.Label[] = [];
    @property({type: cc.Node})
    popupConfirm: cc.Node = null;
    @property({type: cc.Node})
    lblConfirm: cc.Node = null;
    private isNap = false;
    private isRut = false;
    private tabSelectedIdx = 0;
    private phoneNumber = "";
    private isMobileSecure = false;

    start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            // console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_SECURITY_INFO: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResGetSecurityInfo(data);
                    this.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                    this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
                    console.log("vao đây 1" + res.safe)
                    // console.log(res);
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
                    //this.showSmsPlusContinue();
                    this.actSmsPlusActivePhone();
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
                            //this.showSmsPlusContinue();
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
                        App.instance.alertDialog.showMsg("Kích hoạt SĐT thành công!");
                        //this.onTabChanged();
                    } else {
                        App.instance.alertDialog.showMsg("Kích hoạt SĐT không thành công!");
                    }
                    break;
                }
                case cmd.Code.RESULT_ACTIVE_NEW_MOBILE: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("Thay đổi số điện thoại và kích hoạt bảo mật thành công!");
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
                case cmd.Code.RESULT_SAFES: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultSafes(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            this.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                            this.edbCoin.string = "";
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            this.dismiss();
                            PopupProfile.instance.dismiss();
                            break;
                        case 3:
                            this.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                            this.edbCoin.string = "";
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    show() {
        super.show();
        // App.instance.showLoading2(true);
        App.instance.showLoading2(true, 0.2);
        // this.lblBalanceSafes.string = PopupProfile.lblKet;
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(0, 1));
        //this.tabSelectedIdx = 0;
        // this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        //this.onTabChanged();
    }

    // actSmsPlusInfo() {
    //     this.panelSmsPlus.info.active = true;
    //     this.panelSmsPlus.update.active = false;
    //     this.panelSmsPlus.continue.active = false;
    // }

    // actSmsPlusUpdate() {
    //     this.panelSmsPlus.info.active = false;
    //     this.panelSmsPlus.update.active = true;
    //     this.panelSmsPlus.continue.active = false;
    //     this.panelSmsPlus.updateEdbPhoneNumber.string = "";
    // }

    // private showSmsPlusContinue() {
    //     this.panelSmsPlus.info.active = false;
    //     this.panelSmsPlus.update.active = false;
    //     this.panelSmsPlus.continue.active = true;
    //     this.panelSmsPlus.continueEdbOTP.string = "";
    // }

    // actSmsPlusSubmitUpdateUserInfo() {
    //     let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
    //     if (phoneNumber.length == 0) {
    //         App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
    //         return;
    //     }
    //     App.instance.showLoading2(true);
    //     MiniGameNetworkClient.getInstance().send(new cmd.ReqUpdateUserInfo(phoneNumber));
    // }

    // actSmsPlusSubmitUpdatePhoneNumber() {
    //     let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
    //     if (phoneNumber.length == 0) {
    //         App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
    //         return;
    //     }
    //     App.instance.showLoading2(true);
    //     MiniGameNetworkClient.getInstance().send(new cmd.ReqChangePhoneNumber(phoneNumber));
    // }

    // actSmsPlusSubmitContinuePhoneNumber() {
    //     let otp = this.panelSmsPlus.continueEdbOTP.string.trim();
    //     if (otp.length == 0) {
    //         App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
    //         return;
    //     }
    //     App.instance.showLoading2(true);
    //     MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    // }

    actSmsPlusActivePhone() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqActivePhone());
    }

    actSubmitSafesNap() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
            return;
        } else if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số tiền hiện tại không đủ thực hiện yêu cầu nạp");
            return;
        }
        this.isNap = true;
        this.isRut = false;
        nodeUtils.setNodeLabel(this.lblConfirm, "Bạn muốn gửi $" + utils.formatNumber(coin) + " vào két sắt?");
        nodeUtils.activeNode(this.popupConfirm);
    }

    actSubmitSafesRut() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        //let otp = this.tabSafes.edbOTP.string;
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
            return;
        }
        else if (coin > Utils.stringToInt(this.lblBalanceSafes.string.trim())) {
            App.instance.alertDialog.showMsg("Số tiền trong két không đủ để thực hiện yêu cầu rút");
            return;
        }
        this.isNap = false;
        this.isRut = true;
        nodeUtils.setNodeLabel(this.lblConfirm, "Bạn muốn rút $" + utils.formatNumber(coin) + " khỏi két sắt?");
        nodeUtils.activeNode(this.popupConfirm);
        // if (otp.length == 0) {
        //     App.instance.alertDialog.showMsg("Mã xác thực OTP không được bỏ trống.");
        //     return;
        // }
        // App.instance.showLoading2(true);
    }

    actGetOTP() {
        App.instance.showLoading2(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actTelegram() {
        App.instance.openTelegram();
    }

    private onTabChanged() {
        // for (let i = 0; i < this.tabContents.childrenCount; i++) {
        //     this.tabContents.children[i].active = i == this.tabSelectedIdx;
        // }
        // for (let j = 0; j < this.tabs.toggleItems.length; j++) {
        //     this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        // }

        switch (this.tabSelectedIdx) {
            case 0:
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                break;
            case 1:
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                // this.tabSafes.tabSelectedIdx = 0;
                // this.tabSafes.tabs.toggleItems[this.tabSafes.tabSelectedIdx].isChecked = true;
                // this.tabSafes.onTabChanged();
                break;
        }
    }

    private confirmStateOK() {
        if (this.isNap) {
            let coin = Utils.stringToInt(this.edbCoin.string);
            if (coin <= 0) {
                App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
                return;
            } else if (coin > Configs.Login.Coin) {
                App.instance.alertDialog.showMsg("Số tiền hiện tại không đủ thực hiện yêu cầu nạp");
                return;
            }
            MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 1));
        } else if (this.isRut) {
            let coin = Utils.stringToInt(this.edbCoin.string);
            //let otp = this.tabSafes.edbOTP.string;
            if (coin <= 0) {
                App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
                return;
            }
            else if (coin > Utils.stringToInt(this.lblBalanceSafes.string.trim())) {
                App.instance.alertDialog.showMsg("Số tiền trong két không đủ để thực hiện yêu cầu rút");
                return;
            }
            MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 0));
        }

        nodeUtils.disableNode(this.popupConfirm);
    }

    private confirmStateCancel() {
        nodeUtils.disableNode(this.popupConfirm);
    }
}
