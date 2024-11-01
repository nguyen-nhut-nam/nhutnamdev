import App from "../../../scripts/common/App";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Configs from "../../../scripts/common/Configs";
import Dialog from "../../../scripts/common/Dialog";
import Http from "../../../scripts/common/Http";
import SPUtils from "../../../scripts/common/SPUtils";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../scripts/common/Lobby.Cmd";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import LobbyLobbyController from "./Lobby.LobbyController";
import Popup from "../../../scripts/common/Popup";
import Utils from "../../../scripts/common/Utils";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";

const {ccclass, property} = cc._decorator;
var countIdx = 0;
namespace Lobby {

@ccclass
export  class PopupLogin extends Popup {

    @property(cc.EditBox)
    edbUsername: cc.EditBox = null;
    @property(cc.EditBox)
    edbPassword: cc.EditBox = null;
    @property(cc.Prefab)
    prefabPopupUpdateNickName = null;

     md52(message = '', key = ''){
        let m = CryptoJS.AES.encrypt(message, key);
          return base64.encode (m.toString());
    }

    actLogin(): void {
        // console.log("actLogin");
        let _this = this;
        let username = this.edbUsername.string.trim();
        let password = this.edbPassword.string;

        if (username.length == 0) {
            App.instance.alertDialog.showMsg("Tên đăng nhập không được để trống.");
            return;
        }

        if (password.length == 0) {
            App.instance.alertDialog.showMsg("Mật khẩu không được để trống.");
            return;
        }

        App.instance.showLoading2(true);
        Http.get(Configs.App.API, { c: 3, un: username, pw: this.md52(password,"12345"), pf: Utils.getPlatform(), countIdx: countIdx}, (err, res) => {
            countIdx++;
            App.instance.showLoading2(false);
            if (err != null) {
                App.instance.alertDialog.showMsg("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối.");
                return;
            }
            SPUtils.setUserName(username);
            SPUtils.setUserPass(password);
            switch (parseInt(res["errorCode"])) {
                case 0:
                    Configs.Login.AccessToken = res["accessToken"];
                    Configs.Login.SessionKey = res["sessionKey"];
                    Configs.Login.Username = username;
                    Configs.Login.Password = password;
                    Configs.Login.IsLogin = true;
                    var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                    Configs.Login.UserId = userInfo["id"];
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
                    Configs.Login.MobileSecured = userInfo['mobileSecure'] !== 0;
                    Configs.Login.AppSecured = userInfo['appSecure'] !== 0;
                    Configs.Login.BanTransfer = userInfo["banTransfer"];
                    // MiniGameNetworkClient.getInstance().checkConnect();
                    MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                    SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                    ShootFishNetworkClient.getInstance().checkConnect(() => {
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    });
                    SPUtils.setUserName(Configs.Login.Username);
                    SPUtils.setUserPass(Configs.Login.Password);
                    SPUtils.setNickName(Configs.Login.Nickname);
                    App.instance.buttonMiniGame.show();
                    LobbyLobbyController._instance.loadListMail();
                    BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                    _this.onClose();
                    LobbyLobbyController._instance.actOpenBigBanner();
                    break;
                case 1007:
                    App.instance.alertDialog.showMsg("Thông tin đăng nhập không hợp lệ.");
                    //this.popupUpdatePhone.show2(username, password);
                    return;
                case 1109:
                    App.instance.alertDialog.showMsg(GameErrorMessage.ACCOUNT_LOCKED);
                    return;
                case 1005:
                    App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                    return;
                case 2001:
                    _this.onClose();
                    LobbyLobbyController._instance.actOpenPopup(this.prefabPopupUpdateNickName);
                    return;
                default:
                    App.instance.alertDialog.showMsg(res["errorCode"]);
                    break;
            }
        });
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
         if(SPUtils.getUserName().length > 0) {
             this.edbUsername.string = SPUtils.getUserName();
         }

         if(SPUtils.getUserPass().length > 0) {
             this.edbPassword.string = SPUtils.getUserPass();
         }
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            this.node.getChildByName('Container').rotation = -90;
            this.node.getChildByName('Container').scale = 0.9;
        }
    }

    openCSKHTele() {
        LobbyLobbyController._instance.actOpenPopupForgetPassword();
    }
}
}
export default Lobby.PopupLogin;
