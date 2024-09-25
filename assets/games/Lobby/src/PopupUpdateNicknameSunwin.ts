import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../scripts/common/Lobby.Cmd";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import SPUtils from "../../../scripts/common/SPUtils";
import PopupUpdateNickname from "./PopupUpdateNickname";

const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupUpdateNicknameSunwin extends Dialog {

        @property(cc.EditBox)
        edbNickname: cc.EditBox = null;
        @property(cc.Node)
        panelNotLogin: cc.Node = null;
        @property(cc.Node)
        panelLogined: cc.Node = null;
        @property(PopupUpdateNickname)
        popupUpdateNickname: PopupUpdateNickname = null;

        private username: string = "";
        private password: string = "";
        private codedaily: string = "";
        private phoneNumber: string = "";

        show() {
            super.show();
            this.edbNickname.string = "";
        }

        show2(username: string, password: string, codedaily: string, phoneNumber: string) {
            this.show();
            this.username = username;
            this.password = password;
            this.codedaily = codedaily;
            this.phoneNumber = phoneNumber;
        }

        md52(message = '', key = ''){
            let m = CryptoJS.AES.encrypt(message, key);
            return base64.encode (m.toString());
        }

        public actUpdate() {
            let _this = this;
            let nickname = this.edbNickname.string.trim();

            if (nickname.length == 0) {
                App.instance.alertDialog.showMsg("Tên hiển thị không được để trống.");
                return;
            }

            App.instance.showLoading2(true);
            Http.get(Configs.App.API, { "c": 4044, "username": _this.username, "password": _this.password, "codedaily": _this.codedaily, "phone": _this.phoneNumber ,"nn": nickname }, (err, respon) => {
                App.instance.showLoading2(false);
                if (err != null) {
                    App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
                    return;
                }
                console.log(respon);

                switch (parseInt(respon["errorCode"])) {
                    case 200:
                        //this.login(_this.username, _this.username);

                        Http.get(Configs.App.API, { c: 3, un: _this.username, pw: this.md52(_this.password,"12345") }, (err, res) => {
                            App.instance.showLoading2(false);
                            if (err != null) {
                                App.instance.alertDialog.showMsg("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối.");
                                return;
                            }
                            // console.log(res);
                            switch (parseInt(res["errorCode"])) {
                                case 0:
                                    // console.log("Đăng nhập thành công.");
                                    Configs.Login.AccessToken = res["accessToken"];
                                    Configs.Login.SessionKey = res["sessionKey"];
                                    Configs.Login.Username = _this.username;
                                    Configs.Login.Password = _this.password;
                                    Configs.Login.IsLogin = true;
                                    var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                                    Configs.Login.Nickname = userInfo["nickname"];
                                    Configs.Login.Avatar = userInfo["avatar"];
                                    Configs.Login.Coin = userInfo["vinTotal"];
                                    Configs.Login.LuckyWheel = userInfo["luckyRotate"];
                                    Configs.Login.IpAddress = userInfo["ipAddress"];
                                    Configs.Login.CreateTime = userInfo["createTime"];
                                    Configs.Login.Birthday = userInfo["birthday"];
                                    Configs.Login.Birthday = userInfo["birthday"];
                                    Configs.Login.VipPoint = userInfo["vippoint"];
                                    Configs.Login.VipPointSave = userInfo["vippointSave"];

                                    // MiniGameNetworkClient.getInstance().checkConnect();
                                    MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                                    SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                                    ShootFishNetworkClient.getInstance().checkConnect(() => {
                                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                    });

                                    this.panelNotLogin.active = false;
                                    this.panelLogined.active = true;

                                    SPUtils.setUserName(Configs.Login.Username);
                                    SPUtils.setUserPass(Configs.Login.Password);
                                    SPUtils.setNickName(Configs.Login.Nickname);

                                    App.instance.buttonMiniGame.show();
                                    BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                                    break;
                                case 1007:
                                    //App.instance.alertDialog.showMsg("Thông tin đăng nhập không hợp lệ.");
                                    window.location.href = 'https://cskh-sunwin.vin/';
                                    break;
                                case 2001:
                                    this.popupUpdateNickname.show2(_this.username, _this.password);
                                    break;
                                default:
                                    //App.instance.alertDialog.showMsg("Đăng nhập không thành công vui lòng thử lại sau.");
                                    window.location.href = 'https://cskh-sunwin.vin/';
                                    break;
                            }
                        });
                        break;
                    case 101:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    case 201:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    case 201:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    case 404:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    case 500:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    case 600:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                    default:
                        window.location.href = 'https://cskh-sunwin.vin/';
                        break;
                }

                _this.dismiss();
            });

        }
    }
}
export default Lobby.PopupUpdateNicknameSunwin;
