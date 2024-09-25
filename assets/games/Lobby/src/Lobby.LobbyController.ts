import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import SPUtils from "../../../scripts/common/SPUtils";
import Tween from "../../../scripts/common/Tween";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import TienLenNetworkClient from "../../../scripts/networks/TienLenNetworkClient";
import SamNetworkClient from "../../../scripts/networks/SamNetworkClient";
import cmd from "./../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import TabsListGame from "./Lobby.TabsListGame";
import Utils from "../../../scripts/common/Utils";
import ButtonListJackpot from "./Lobby.ButtonListJackpot";
import VersionConfig from "../../../scripts/common/VersionConfig";
import ShootFishNetworkClient from "../../../scripts/networks/ShootFishNetworkClient";
import AudioManager from "../../../scripts/common/Common.AudioManager";
import {Tophudata} from './Lobby.ItemTopHu';
import TopHu from "./Lobby.TopHu";
import BauCuaTo2NetworkClient from "../../../scripts/networks/BauCuaTo2NetworkClient";
import PopupSecurityPhone from "./Lobby.PopupSecurityPhone";
import nodeUtils from "../../../scripts/common/NodeUtils";
import TaiXiuNetWorkClient from "../../../scripts/networks/TaiXiuNetWorkClient";
import MiniGame from "./../../../scripts/common/MiniGame";
import LobbyLobbyController from "./Lobby.LobbyController";
import ShopTabEnum from "./enum/ShopTabEnum";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import ApiIDEnum from "./enum/ApiIDEnum";
import LobbySystemMessage from "./Lobby.SystemMessage";
import GameURL from "../../../scripts/common/game/GameURL";
import TaiXiuMD5NetWorkClient from "../../../scripts/networks/TaiXiuMD5NetWorkClient";
import GameErrorMessage from "../../../scripts/enum/GameErrorMessage";
import BundleControl from "../../../scripts/common/BundleControl";
import GameSuccessMessage from "../../../scripts/enum/GameSuccessMessage";

const {ccclass, property} = cc._decorator;

var countIdx = 0;

@ccclass("MinigameGroup")
export class Minigame {
    @property(cc.String)
    Key = ''

    @property(cc.Node)
    Icon = null
}

@ccclass("Lobby.LobbyController.PanelMenu")
export class PanelMenu {
    @property(cc.Node)
    node: cc.Node = null;
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;

    private animate = false;

    start() {
        this.toggleMusic.node.on("toggle", () => {
            SPUtils.setMusicVolumn(this.toggleMusic.isChecked ? 1 : 0);
            BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
        });
        this.toggleSound.node.on("toggle", () => {
            SPUtils.setSoundVolumn(this.toggleSound.isChecked ? 1 : 0);
            BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
        });
        this.toggleMusic.isChecked = SPUtils.getMusicVolumn() > 0;
        this.toggleSound.isChecked = SPUtils.getSoundVolumn() > 0;
        this.node.active = false;
    }

    show() {
        if (this.animate) return;
        this.animate = true;
        this.node.stopAllActions();
        this.node.active = true;
        this.node.scaleY = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1).easing(cc.easeBackOut()),
            cc.callFunc(() => {
                this.animate = false;
            })
        ));
    }

    dismiss() {
        if (this.animate) return;
        this.animate = true;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1, 0).easing(cc.easeBackIn()),
            cc.callFunc(() => {
                this.node.active = false;
                this.animate = false;
            })
        ));
    }

    toggle() {
        if (this.node.active) {
            this.dismiss();
        } else {
            this.show();
        }
    }
}

namespace Lobby {
    @ccclass
    export class LobbyController extends cc.Component {

        @property(cc.Node)
        panelNotLogin: cc.Node = null;
        @property(cc.Node)
        panelLogined: cc.Node = null;
        @property(cc.Sprite)
        sprAvatar2: cc.Sprite = null;
        @property(cc.Label)
        lblNickname: cc.Label = null;
        @property(cc.Label)
        lblCoin: cc.Label = null;
    
        @property(LobbySystemMessage)
        notifyMarquee = null;
        @property(ButtonListJackpot)
        buttonListJackpot: ButtonListJackpot = null;
        @property(TabsListGame)
        tabsListGame: TabsListGame = null;
        @property(cc.Prefab)
        popupTransaction = null;

        @property({type: cc.AudioClip})
        clipBgm: cc.AudioClip = null;
        @property({type: cc.AudioClip})
        clickSound: cc.AudioClip = null;
        @property(TopHu)
        topHu: TopHu = null;

        @property(cc.PageView)
        adsContent: cc.PageView = null;

        @property(cc.Prefab)
        popupLogin = null;

        @property(cc.Label)
        huTX: cc.Label = null;
        @property(cc.Label)
        moneyBetTaiTX: cc.Label = null;
        @property(cc.Label)
        moneyBetXiuTX: cc.Label = null;
        @property(cc.Label)
        huTXMD5: cc.Label = null;
        @property(cc.Label)
        moneyBetTaiTXMD5: cc.Label = null;
        @property(cc.Label)
        moneyBetXiuTXMD5: cc.Label = null;
        @property(PopupSecurityPhone)
        popupSecurityPhone: PopupSecurityPhone = null;
        @property({ type: cc.AudioClip })
        soundClickSun: cc.AudioClip = null;
        @property(cc.Node)
        listAllGame: cc.Node =null;
        @property(cc.Prefab)
        loadingSun: cc.Prefab = null;
        @property(cc.Node)
        nodeTopJackpot: cc.Node = null;
        @property(Minigame)
        ArrMiniGame = [];

        @property(cc.Prefab)
        popupRegister = null;
        @property(cc.Node)
        nodeLobby = null;
        @property(cc.Prefab)
        popupProfile = null;
        @property(cc.Prefab)
        popupShop = null;
        @property(cc.Prefab)
        prefabMailBox = null;
        @property(cc.Prefab)
        prefabPopupCashOut = null;
        @property(cc.Prefab)
        prefabPopupCashOutTransaction = null;
        @property(cc.Prefab)
        prefabPopupCashOutGuide = null;
        @property(cc.Prefab)
        prefabPopupEvent = null;
        @property(cc.Prefab)
        popupSecurity = null;
        @property(cc.Prefab)
        prefabPopupForgetPassword = null;

        @property(cc.Node)
        tagGameNode = null;
        @property(cc.Node)
        nodeActivePhone = null;
        @property(cc.Prefab)
        prefabPopupSetting = null;
        @property(cc.Prefab)
        prefabPopupGiftCode = null;
        @property(cc.Prefab)
        prefabPopupUpdateCashoutBank = null;
        @property(cc.Prefab)
        prefabPopupChargeTransaction = null;
        @property(cc.Prefab)
        prefabPopupChargeGuide = null;
        @property(cc.Prefab)
        popupActiveTelegram = null;
        @property(cc.Prefab)
        prefabPopupSafe = null;
        @property(cc.Prefab)
        prefabPopupTelegramGuide = null;
        @property(cc.Prefab)
        prefabPopupBigBanner = null;
        @property(cc.Prefab)
        prefabPopupUpdateNickName = null;
        @property(cc.Node)
        nodeSupport = null;
        @property(cc.Node)
        nodeUnreadMail = null;

        listData100: Array<Tophudata> = new Array<Tophudata>();
        listData1000: Array<Tophudata> = new Array<Tophudata>();
        listData10000: Array<Tophudata> = new Array<Tophudata>();
        private static notifyMarquee = "";
        public static _instance: LobbyController = null;

        thongbao = "Thông báo: Cập nhật Link game mới nhất: kingvip" +
            "#Quý khách lưu lại để tránh vào nhầm domain lạ mất tài khoản." +
            "#Do đơn nạp/rút nhiều đôi khi ngân hàng xử lý chậm," +
            "#Nạp 30p chưa + điểm quý khách vui lòng liên hệ Hỗ trợ trực tuyến Live chát để được xử lý" +
            "#Hoặc telegam @cskh_kingvip#Cú pháp Tên NV + Hóa đơn.";

        public linkFacebook = '';
        public linkLiveChat = '';
        // public linkGroup = 'https://www.facebook.com/groups/982787475500801'
        public congdong = "https://www.facebook.com/groups/982787475500801";
        public linkDownloadApp = '';
        public linktelegramcskh = 'https://t.me/oxy1club';
        private taiXiuMD5: MiniGame = null;

        protected onLoad() {
            if(LobbyController._instance == null) {
                LobbyController._instance = this;
            }
        }

        protected onEnable() {
            if(Configs.Login.IsLogin) {
                this.loadListMail();
            }
            App.instance.setButtonMiniGamesPosition(App.instance.originalMiniGamesButtonPosition);

            Http.get(Configs.App.API, {"c": ApiIDEnum.GET_URL_LINK}, (err, res) => {
                if(res.success) {
                    if(res.md5) {
                        GameURL.MD5_CHECKER = res.md5;
                    }
                    GameURL.GROUP_FACEBOOK = res.groupFacebook ? res.groupFacebook : "";
                    GameURL.CSKH_TELEGRAM = res.teleCSKH ? res.teleCSKH : "";
                    if(res.botTele && res.botTele.length > 0) {
                        GameURL.BOT_TELEGRAM = res.botTele;
                    }

                    if(res.checkLocTele && res.checkLocTele.length > 0) {
                        GameURL.CHECK_LOC_TELEGRAM = res.checkLocTele;
                    }
                    GameURL.FANPAGE = res.fanPage ? res.fanPage : "";
                    GameURL.TELEGRAM_COMMUNITY = res.groupTele ? res.groupTele : "";
                    GameURL.LIVE_CHAT = res.liveChat ? res.liveChat : "";
                } else {
                    App.instance.actShowThongBao(res.errorCode);
                }
            });
            this.actPlayAudioMain();
            BundleControl.loadBundle('CardLobby');
        }

        start() {
            cc.game.on(cc.game.EVENT_SHOW, this.onShowApp, this);
            console.log("CPName: " + VersionConfig.CPName);
            console.log("VersionName: " + VersionConfig.VersionName);

            // Http.get(Configs.App.API, {"c":4074, "t": 50 }, (err, json)=>{
            //     if(err == null &&  json != null && json.code == 0) {
            //         Configs.App.MAP_DAILY = json.description.mapdaily;
            //         //console.log("Configs.App.MAP_DAILY ", Configs.App.MAP_DAILY);
            //     } else{
            //         if(err == null){
            //             GameChecker.sendDomainDieToTelegram("Domain game die " + VersionConfig.DOMAIN_DEV);
            //         }
            //     }
            // })
            this.lblCoin.node.parent.active = true;
            this.nodeSupport.scaleY = 0;
            // for (let i = 0; i < this.logos.childrenCount; i++) {
            //     this.logos.children[i].active = this.logos.children[i].name == VersionConfig.CPName;
            // }

            // if (!cc.sys.isNative){
            //     App.instance.countClick();
            //     let url  = new URL(window.location.href);
            //     let username = url.searchParams.get("un");
            //     let password = url.searchParams.get("pw");
            //     let codedaily = url.searchParams.get("dl");
            //     if (codedaily != null) {
            //         this.popupRegister.show();
            //         if(username != null && password != null) {
            //             App.instance.showLoading2(true);
            //             let reqParams = { "c": 1, "un": username, "pw": md5(password), "cp": "1", "cid": "1"};
            //             reqParams["code_daily"] = codedaily;
            //             Http.get(Configs.App.API, reqParams, (err, res) => {
            //                 App.instance.showLoading2(false);
            //                 if (err != null) {
            //                     App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
            //                     return;
            //                 }
            //                 if (!res["success"]) {
            //                     switch (parseInt(res["errorCode"])) {
            //                         case 1001:
            //                             App.instance.alertDialog.showMsg("Kết nối mạng không ổn định, vui lòng thử lại sau.");
            //                             break;
            //                         case 101:
            //                             App.instance.alertDialog.showMsg("Tên đăng nhập không hợp lệ.");
            //                             break;
            //                         case 1006:
            //                             App.instance.alertDialog.showMsg("Tài khoản đã tồn tại.");
            //                             break;
            //                         case 102:
            //                             App.instance.alertDialog.showMsg("Mật khẩu không hợp lệ.");
            //                             break;
            //                         case 108:
            //                             App.instance.alertDialog.showMsg("Mật khẩu không được trùng với tên đăng nhập.");
            //                             break;
            //                         case 115:
            //                             App.instance.alertDialog.showMsg("Mã xác nhận không chính xác.");
            //                             break;
            //                         case 1114:
            //                             App.instance.alertDialog.showMsg("Hệ thống đang bảo trì. Vui lòng quay trở lại sau!");
            //                             break;
            //                         default:
            //                             App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
            //                             break;
            //                     }
            //                     this.popupRegister.show();
            //                     return;
            //                 } else {
            //                     window.history.replaceState({}, document.title, "/");
            //                 }
            //                 this.popupEventLogin.dismiss();
            //                 this.popupUpdateNickname.show2(username, password);
            //             });
            //         }
            //     } else if(username != null && password != null) {
            //         this.edbUsername.string = username;
            //         this.edbPassword.string = password;
            //         this.actLogin();
            //         window.history.pushState({}, document.title, "/");
            //     }
            // }

            BroadcastReceiver.register(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, (data) => {
                SPUtils.setUserName(data['username']);
                SPUtils.setUserPass(data["password"]);
                this.actLogin();
            }, this);

            BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
                Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetSecurityInfo());
            }, this);

            BroadcastReceiver.register(BroadcastReceiver.USER_INFO_UPDATED, () => {
                this.lblNickname.string = Configs.Login.Nickname;
                this.sprAvatar2.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
                this.panelLogined.active = true;
                this.panelNotLogin.active = false;
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
            }, this);

            BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, (data) => {
                Configs.Login.clear();
                this.panelNotLogin.active = true;
                this.panelLogined.active = false;
                // this.edbUsername.string = SPUtils.getUserName();
                // this.edbPassword.string = SPUtils.getUserPass();
                SPUtils.setUserName("");
                SPUtils.setUserPass("");
                MiniGameNetworkClient.getInstance().close();
                TaiXiuNetWorkClient.getInstance().close();
                TaiXiuMD5NetWorkClient.getInstance().close();
                SlotNetworkClient.getInstance().close();
                TienLenNetworkClient.getInstance().close();
                ShootFishNetworkClient.getInstance().close();
                BauCuaTo2NetworkClient.getInstance().close();
                App.instance.buttonMiniGame.hidden();
            }, this);

            // this.edbUsername.string = SPUtils.getUserName();
            // this.edbPassword.string = SPUtils.getUserPass();

            let i = 0;
            let listNotif = this.thongbao.split("#");
            let oldMess = "";
            // cc.tween(this.txtNotifyMarquee.node)
            //     .repeatForever(
            //         cc.tween()
            //             .call(() => {
            //                 let notif = this.thongbao + LobbyController.notifyMarquee;
            //                 if (notif != oldMess) {
            //                     oldMess = notif;
            //                     console.log("notif ", notif);
            //                     listNotif = notif.split("#");
            //                 }
            //             })
            //             .call(() => {
            //                 if (listNotif != undefined) {
            //                     if (i > listNotif.length - 1) {
            //                         i = 0;
            //                     }
            //                     let text = listNotif[i];
            //                     this.txtNotifyMarquee.string = text;
            //                     let moveWidth = this.txtNotifyMarquee.node.width + this.txtNotifyMarquee.node.parent.width;
            //                     this.txtNotifyMarquee.node.opacity = 0;
            //                     i++;
            //                 }
            //             })
            //             .to(0.2, {opacity: 255})
            //             .delay(3)
            //             .to(0.2, {opacity: 0})
            //             .delay(0.5)
            //     )
            //     .start();


            // let pos = this.txtNotifyMarquee.node.position;
            // pos.x = this.txtNotifyMarquee.node.parent.width + 50;
            // this.txtNotifyMarquee.node.position = pos;
            // this.txtNotifyMarquee.string = this.thongbao + LobbyController.notifyMarquee;
            // moveAndCheck();

            if (!Configs.Login.IsLogin) {
                if (SPUtils.getUserName().length > 0 && SPUtils.getUserPass().length > 0) {
                    this.actLogin();
                }
                this.panelNotLogin.active = true;
                this.panelLogined.active = false;
                App.instance.buttonMiniGame.hidden();

                //fake jackpot
                var j100 = Utils.randomRangeInt(5000, 7000) * 100;
                var j1000 = Utils.randomRangeInt(5000, 7000) * 1000;
                var j10000 = Utils.randomRangeInt(5000, 7000) * 10000;
                // //
                // this.tabsListGame.updateItemJackpots("audition", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("captain", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("spartans", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("tamhung", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("aztec", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("zeus", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("gainhay", j100, false, j1000, false, j10000, false);
                this.createListdata(j100, j1000, j10000)
                // this.topHu.ShowData(this.listData100, this.listData1000, this.listData10000);
            } else {
                //BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                this.panelNotLogin.active = false;
                this.panelLogined.active = true;
                this.gesecretCode();
                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetMoneyUse());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetSecurityInfo());
            }

            Configs.App.getServerConfig();
            Configs.App.getRoomMember();
            MiniGameNetworkClient.getInstance().addOnClose(() => {
                console.log("on close minigame");
            }, this);

            MiniGameNetworkClient.getInstance().addListener((data) => {
                let inPacket = new InPacket(data);
                // console.log(inPacket.getCmdId());
                switch (inPacket.getCmdId()) {
                    case cmd.Code.NOTIFY_MARQUEE: {
                        let res = new cmd.ResNotifyMarquee(data);
                        let resJson = JSON.parse(res.message);
                        if(resJson["entries"].length === 0) {
                            return;
                        }
                        LobbyController.notifyMarquee = "Chúc mừng ";
                        for (let i = 0; i < resJson["entries"].length; i++) {
                            let e = resJson["entries"][i];
                            LobbyController.notifyMarquee += Configs.GameId.getGameName(e["g"]) + "";
                            LobbyController.notifyMarquee += " <color=#00FFF5>" + e["n"] + "</color> Thắng ";
                            LobbyController.notifyMarquee += "<color=#FFF500>" + Utils.formatNumber(e["m"]) + "</color>";
                            //LobbyController.notifyMarquee +=""+ "    "+ this.thongbao  + "";
                            if (i < resJson["entries"].length - 1) {
                                LobbyController.notifyMarquee += "        ";
                            }
                            LobbyController.notifyMarquee.trim();
                        }
                        this.notifyMarquee.runMessage(LobbyController.notifyMarquee);
                        break;
                    }
                    case cmd.Code.UPDATE_JACKPOTS: {
                        let res = new cmd.ResUpdateJackpots(data);
                        this.buttonListJackpot.setData(res);
                        this.tabsListGame.updateItemJackpots("bau_cua", 0, false, 0, false, res.baucuato, false);
                        this.tabsListGame.updateItemJackpots("minipoker",res.miniPoker100 ,false ,res.miniPoker1000 ,false,res.miniPoker10000,false );
                        this.tabsListGame.updateItemJackpots("whiskey",res.pokeGo100 ,false ,res.pokeGo1000 ,false,res.pokeGo10000,false );
                        this.tabsListGame.updateItemJackpots("caothap",res.caoThap1000 ,false ,res.caoThap10000 ,false,res.caoThap500000,false );
                        break;
                    }
                    case cmd.Code.UPDATE_BAU_CUA_JACKPOTS: {

                        let res = new cmd.ResUpdateBauCuaJackpots(data);
                        // todo : update jackpot here
                        //this.hubaucua.string = res.baucuato+"";
                        // Tween.numberTo(this.hubaucua, res.baucuato, 3);
                        // console.log("Hu TX" +  res.txHu);
                        // //this.hubaucua.string = res.baucuato+"";
                        // Tween.numberTo(this.huTX, res.txHu,2);
                        break;
                    }
                    case cmd.Code.UPDATE_TX_JACKPOTS: {
                        let res = new cmd.ResUpdateTXJackpots(data);
                        // todo : update jackpot here
                        Tween.numberTo(this.huTX, res.txHu, 2);
                        Tween.numberTo(this.moneyBetTaiTX, res.txTai, 2);
                        Tween.numberTo(this.moneyBetXiuTX, res.txXiu, 2);
                        break;
                    }
                    case cmd.Code.UPDATE_TX_MD5_JACKPOTS: {
                        let res = new cmd.ResUpdateTXMD5Jackpots(data);

                        // todo : update jackpot here
                        Tween.numberTo(this.huTXMD5, res.moneyHu, 2);
                        Tween.numberTo(this.moneyBetTaiTXMD5, res.moneyTai, 2);
                        Tween.numberTo(this.moneyBetXiuTXMD5, res.moneyXiu, 2);
                        break;
                    }
                    case cmd.Code.GET_MONEY_USE: {
                        let res = new cmd.ResGetMoneyUse(data);
                        Configs.Login.Coin = res.moneyUse;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        break;
                    }
                    case cmd.Code.MONEY_CHANGE : {
                        let res = new cmd.ResMoneyChange(data);
                        Configs.Login.Coin = res.moneyCurrent;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        break;
                    }
                    case cmd.Code.TIME_CHANGE : {
                        let res = new cmd.ResTimeChange(data);
                        let tim = res.time;
                        break;
                    }

                    case cmd.Code.GET_SECURITY_INFO: {
                        let res = new cmd.ResGetSecurityInfo(data);
                        Configs.Login.MobileSecured = res.mobileSecure !== 0;
                        Configs.Login.AppSecured = res.appSecure !== 0;
                        this.nodeActivePhone.active = res.mobile.length <= 0;
                        break;
                    }
                }
            }, this);


            try {
                SlotNetworkClient.getInstance().addListener((data) => {
                    let inPacket = new InPacket(data);
                    switch (inPacket.getCmdId()) {
                        case cmd.Code.UPDATE_JACKPOT_SLOTS: {
                            //{"ndv":{"100":{"p":673620,"x2":0},"1000":{"p":6191000,"x2":0},"10000":{"p":73540000,"x2":0}},"kb":{"100":{"p":503160,"x2":0},"1000":{"p":5044400,"x2":0},"10000":{"p":51398000,"x2":0}},"vqv":{"100":{"p":509480,"x2":0},"1000":{"p":5013000,"x2":0},"10000":{"p":50852000,"x2":0}},"sah":{"100":{"p":502890,"x2":0},"1000":{"p":6932010,"x2":0},"10000":{"p":55193700,"x2":0}}}
                            let res = new cmd.ResUpdateJackpotSlots(data);
                            let resJson = JSON.parse(res.pots);
                            this.buttonListJackpot.setDataSlot(res);
                            let FastAndFurious = resJson["FastAndFurious"];
                            this.tabsListGame.updateItemJackpots("FastAndFurious", FastAndFurious["100"]["p"], FastAndFurious["100"]["x2"] == 1, FastAndFurious["1000"]["p"], FastAndFurious["1000"]["x2"] == 1, FastAndFurious["10000"]["p"], FastAndFurious["10000"]["x2"] == 1);

                            //audition
                            let Cowboy = resJson["Cowboy"];
                            this.tabsListGame.updateItemJackpots("Cowboy", Cowboy["100"]["p"], Cowboy["100"]["x2"] == 1, Cowboy["1000"]["p"], Cowboy["1000"]["x2"] == 1, Cowboy["10000"]["p"], Cowboy["10000"]["x2"] == 1);

                            //maybach
                            let LadyNight = resJson["LadyNight"];
                            this.tabsListGame.updateItemJackpots("LadyNight", LadyNight["100"]["p"], LadyNight["100"]["x2"] == 1, LadyNight["1000"]["p"], LadyNight["1000"]["x2"] == 1, LadyNight["10000"]["p"], LadyNight["10000"]["x2"] == 1);

                            //tamhung
                            let LienMinh = resJson["LienMinh"];
                            this.tabsListGame.updateItemJackpots("LienMinh", LienMinh["100"]["p"], LienMinh["100"]["x2"] == 1, LienMinh["1000"]["p"], LienMinh["1000"]["x2"] == 1, LienMinh["10000"]["p"], LienMinh["10000"]["x2"] == 1);

                            let SexyDance = resJson["SexyDance"];
                            this.tabsListGame.updateItemJackpots("SexyDance", SexyDance["100"]["p"], SexyDance["100"]["x2"] == 1, SexyDance["1000"]["p"], SexyDance["1000"]["x2"] == 1, SexyDance["10000"]["p"], SexyDance["10000"]["x2"] == 1);

                            let BongLaiCac = resJson["BongLaiCac"];
                            this.tabsListGame.updateItemJackpots("BongLaiCac", BongLaiCac["100"]["p"], BongLaiCac["100"]["x2"] == 1, BongLaiCac["1000"]["p"], BongLaiCac["1000"]["x2"] == 1, BongLaiCac["10000"]["p"], BongLaiCac["10000"]["x2"] == 1);

                            let Halloween = resJson["Halloween"];
                            this.tabsListGame.updateItemJackpots("Halloween", Halloween["100"]["p"], Halloween["100"]["x2"] == 1, Halloween["1000"]["p"], Halloween["1000"]["x2"] == 1, Halloween["10000"]["p"], Halloween["10000"]["x2"] == 1);

                            let MaCao = resJson['LasVegas'];
                            this.tabsListGame.updateItemJackpots("MaCao", MaCao["100"]["p"], MaCao["100"]["x2"] == 1, MaCao["1000"]["p"], MaCao["1000"]["x2"] == 1, MaCao["10000"]["p"], MaCao["10000"]["x2"] == 1);

                            let BigCityBoy = resJson['BigCityBoy'];
                            this.tabsListGame.updateItemJackpots("BigCityBoy", BigCityBoy["100"]["p"], BigCityBoy["100"]["x2"] == 1, BigCityBoy["1000"]["p"], BigCityBoy["1000"]["x2"] == 1, BigCityBoy["10000"]["p"], BigCityBoy["10000"]["x2"] == 1);

                            this.createListdata(j100, j1000, j10000);
                            for (var i = 0; i < this.listData100.length; i++) {
                                if (this.listData10000[i].gameid == "FastAndFurious") {
                                    this.listData10000[i] = new Tophudata("FastAndFurious", "Fast and Furious", FastAndFurious["10000"]["p"]);
                                }
                                if (this.listData10000[i].gameid == "Cowboy") {
                                    this.listData10000[i] = new Tophudata("Cowboy", "Cao Bồi Viễn Tây", Cowboy["10000"]["p"]);
                                }
                                if (this.listData10000[i].gameid == "zeus") {
                                    this.listData10000[i] = new Tophudata("LadyNight", "LadyNight", LadyNight["10000"]["p"]);
                                }
                                if (this.listData10000[i].gameid == "gainhay") {
                                    this.listData10000[i] = new Tophudata("LienMinh", "Liên Minh Huyền Thoại", LienMinh["10000"]["p"]);
                                }
                            }
                            // this.topHu.ShowData(this.listData100, this.listData1000, this.listData10000);
                            break;
                        }
                    }
                }, this);
            } catch(ex) {
                console.log(ex);
            }

            ShootFishNetworkClient.getInstance().addListener((route, data) => {
                switch (route) {
                    case "OnUpdateJackpot":
                        this.tabsListGame.updateItemJackpots("shootfish1", data["14"], false, data["24"], false, data["34"], false);
                        break;
                }
            }, this);
            // this.initAutoScrollAds();
            // this.actShowAds();
            // this.nodeTopJackpot.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            //     const pos = this.nodeTopJackpot.position;
            //     pos.x += event.getDeltaX();
            //     pos.y += event.getDeltaY();
            //     this.nodeTopJackpot.position = pos;
            // });
        }

         gesecretCode(){
            Http.get(Configs.App.API, { "c": 4015,"u":Configs.Login.Nickname }, (err, res) => {
                // console.log(res);
               if(res["ok"]==1){
               // this.PopupCreateSecretcode.show();
               }
               this.thongbao = res["text2"];
            });
        }
    
        // actSubmitSecret(){
        //     let code = this.secretCode.string;
        //     let reCode = this.resecretCode.string;
        //     let passwordSecret = this.password4Secret.string;
        //     passwordSecret = md5(passwordSecret);
        //     if(code != reCode)  App.instance.ShowAlertDialog("hai mã không giống nhau!");
        //     if(code.length<4){
        //         App.instance.ShowAlertDialog("Mã bí cần ít nhất 4 kí tự !");
        //     }else{
        //         MiniGameNetworkClient.getInstance().send(new cmd.ReqCreateSecretCode(code,passwordSecret));
        //         this.PopupCreateSecretcode.dismiss();
        //     }
        // }
        // auto scroll
        autoScroll() {
            if (this.adsContent.getCurrentPageIndex() == this.adsContent.getPages().length - 1) {
                this.adsContent.scrollToPage(0, 0.8)
            } else {
                this.adsContent.scrollToPage((this.adsContent.getCurrentPageIndex() + 1), 0.8)
            }
        }

        //
        initAutoScrollAds() {
            setInterval(() => {
                try {
                    if (this.adsContent != null && !this.adsContent.isScrolling()) {
                        this.autoScroll();
                    }
                } catch (error) {
                    console.log("Loi scrooling");

                }

            }, 5000);
        }

        loadBannerFromUrl(listBanner) {
            console.log("listBanner ", listBanner);
            let content_online = nodeUtils.getChildNode(this.adsContent.node, "view", "content_online");
            let page_tmp = nodeUtils.getChildNode(content_online, "page_tmp");
            listBanner.forEach(item => {
                let page = cc.instantiate(page_tmp);
                page.parent = page_tmp.parent;
                cc.loader.load({url: item["image"], type: 'png'}, function (err, tex) {
                    if (err) {
                        console.log("lỗi này ", err);
                        return;
                    } else {
                        console.log("tex này ", tex);
                        if (tex instanceof cc.Texture2D) {
                            let spriteFrame = new cc.SpriteFrame();
                            spriteFrame.setTexture(tex);
                            page.getComponent(cc.Sprite).spriteFrame.clearTexture();
                            page.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            page.width = page_tmp.width;
                            page.height = page_tmp.height;
                            nodeUtils.activeNode(page);
                        } else {
                            nodeUtils.disableNode(page);
                            return;
                        }
                    }
                });
                page.name = item["game"];
            });
            page_tmp.removeFromParent(true);
            page_tmp.destroy();
            nodeUtils.activeNode(content_online);
            nodeUtils.disableNode(nodeUtils.getChildNode(this.adsContent.node, "view", "content"));
        }

        actLoadAds() {
            // Http.get(Configs.App.API, {"c": 4082}, (err, res) => {
            //     App.instance.showLoading(false);
            //     if (err != null) {
            //         console.log("Lỗi này ", err);
            //         return;
            //     }
            //     let listBanner = res["clientsun"].banner;
            //     this.loadBannerFromUrl(listBanner);
                this.actPlayAds();
          //  });
        }

        actPlayAds() {
            let content = nodeUtils.getChildNode(this.adsContent.node, "view", "content");
            if (content.active === false) {
                content = nodeUtils.getChildNode(this.adsContent.node, "view", "content_online");
            }

            //console.log("content ", content);
            let bgPage = nodeUtils.getChildNode(this.adsContent.node, "bgPage");

            let i = content.childrenCount - 1;
            let currPage: cc.Node;
            let prevPage: cc.Node;
            cc.tween(content)
                .repeatForever(
                    cc.tween()
                        .call(() => {
                            let currIdx = i;     //7  6 5 4 2 1
                            let prevIdx = i - 1; //6  5 4 3 1 0
                            if (i == 0) {
                                i = content.childrenCount - 1;
                                prevIdx = i;
                            } else {
                                i--; //6 5 4 3 2 1 0s
                            }
                            currPage = content.children[currIdx];
                            prevPage = content.children[prevIdx];
                            bgPage.stopAllActions();
                            bgPage.opacity = 0;
                        })
                        .call(() => {
                            nodeUtils.activeNode(currPage);
                        })
                        .delay(5)
                        .call(() => {
                            cc.tween(bgPage)
                                .to(0.5, {opacity: 255})
                                .start();
                        })
                        .delay(0.5)
                        .call(() => {
                            bgPage.stopAllActions();
                            bgPage.opacity = 0;
                            nodeUtils.disableNode(currPage);
                            nodeUtils.activeNode(prevPage);
                        })
                )
                .start();
        }

        actShowAds() {
            // this.actLoadAds();
        }
        //

        actShowPopupLogin() {
            this.actOpenPopup(this.popupLogin);
        }

        actShowPopupRegister() {
            this.actOpenPopup(this.popupRegister);
        }

        onDestroy() {
            SlotNetworkClient.getInstance().send(new cmd.ReqUnSubcribeHallSlot());
            MiniGameNetworkClient.getInstance().send(new cmd.ReqUnSubcribeJackpots());
            LobbyLobbyController._instance = null;
        }

        createListdata(j100: number, j1000: number, j10000: number) {
            this.listData100 = new Array<Tophudata>();
            this.listData1000 = new Array<Tophudata>();
            this.listData10000 = new Array<Tophudata>();
            this.listData100.push(
                new Tophudata("spartans", "Spartans", j100),
                // new Tophudata("audition", "Audition", j100),
                new Tophudata("captain", "Captain", j100),
                new Tophudata("tamhung", "Tam Hùng", j100),
                new Tophudata("aztec", "Aztec", j100),
                new Tophudata("zeus", "Zeus", j100),
                new Tophudata("gainhay", "Gái Nhảy", j100));
            this.listData1000.push(
                new Tophudata("spartans", "Spartans", j1000),
                // new Tophudata("audition", "Audition", j1000),
                new Tophudata("captain", "Captain", j1000),
                new Tophudata("tamhung", "Tam Hùng", j1000),
                new Tophudata("aztec", "Aztec", j1000),
                new Tophudata("zeus", "Zeus", j1000),
                new Tophudata("gainhay", "Gái Nhảy", j1000));
            this.listData10000.push(
                new Tophudata("spartans", "Spartans", j10000),
                // new Tophudata("audition", "Audition", j10000),
                new Tophudata("captain", "Captain", j10000),
                new Tophudata("tamhung", "Tam Hùng", j10000),
                new Tophudata("aztec", "Aztec", j10000),
                new Tophudata("zeus", "Zeus", j10000),
                new Tophudata("gainhay", "Gái Nhảy", j10000));
        }
        
        md52(message = '', key = ''){
            let m = CryptoJS.AES.encrypt(message, key);
            return base64.encode (m.toString());
        }
       

        actLogin(): void {
            // console.log("actLogin");
            let username = SPUtils.getUserName().trim();
            let password = SPUtils.getUserPass();

            if (username.length == 0) {
                App.instance.alertDialog.showMsg("Tên đăng nhập không được để trống.");
                return;
            }

            if (password.length == 0) {
                App.instance.alertDialog.showMsg("Mật khẩu không được để trống.");
                return;
            }

            App.instance.showLoading2(true);
            Http.get(Configs.App.API, {c: 3, un: username, pw: this.md52(password,"12345"), pf: Utils.getPlatform(), countIdx: countIdx}, (err, res) => {
                countIdx++;
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
                        Configs.Login.Username = username;
                        Configs.Login.Password = password;
                        Configs.Login.IsLogin = true;
                        var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                        Configs.Login.Nickname = userInfo["nickname"];
                        Configs.Login.UserId = userInfo["id"];
                        Configs.Login.Avatar = userInfo["avatar"];
                        Configs.Login.Coin = userInfo["vinTotal"];
                        Configs.Login.LuckyWheel = userInfo["luckyRotate"];
                        Configs.Login.IpAddress = userInfo["ipAddress"];
                        Configs.Login.CreateTime = userInfo["createTime"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.VipPoint = userInfo["vippoint"];
                        Configs.Login.VipPointSave = userInfo["vippointSave"];
                        Configs.Login.MobileSecured = userInfo["mobileSecure"] !== 0;
                        Configs.Login.AppSecured = userInfo["appSecure"] !== 0;
                        // MiniGameNetworkClient.getInstance().checkConnect();
                        MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                        MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetSecurityInfo());
                        TaiXiuNetWorkClient.getInstance().checkConnect(() => {});
                        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                        ShootFishNetworkClient.getInstance().checkConnect(() => {
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        });
                        this.loadListMail();

                        this.panelNotLogin.active = false;
                        this.panelLogined.active = true;

                        SPUtils.setUserName(Configs.Login.Username);
                        SPUtils.setUserPass(Configs.Login.Password);
                        this.gesecretCode();
                        App.instance.buttonMiniGame.show();

                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                        this.actOpenBigBanner();
                        break;
                    case 1007:
                        App.instance.alertDialog.showMsg(GameErrorMessage.WRONG_LOGIN_INFORMATION);
                        break;
                    case 1109:
                        App.instance.alertDialog.showMsg(GameErrorMessage.ACCOUNT_LOCKED);
                        break;
                    case 2001:
                        LobbyLobbyController._instance.actOpenPopup(this.prefabPopupUpdateNickName);
                        return;
                    default:
                        App.instance.alertDialog.showMsg(GameErrorMessage.LOGIN_FAILED);
                        break;
                }
            });
        }

        actBack() {
            App.instance.confirmDialog.show3("Bạn có muốn đăng xuất khỏi tài khoản?", "ĐĂNG XUẤT", (isConfirm) => {
                if (isConfirm) {
                    BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                }
            });
        }

        actMenu() {
          
        }

        actVQMM() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
           
        }

        actEvent() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // cc.sys.openURL(Configs.App.LINK_EVENT);
        }

        actDownload() {
            cc.sys.openURL(this.linkDownloadApp);
        }

        actFanpage() {
            var url = this.linkFacebook;
            cc.sys.openURL(url);
            //cc.sys.openURL(Configs.App.getLinkFanpage());
        }

        actGrfacebook() {
            var url = this.linkFacebook;
            cc.sys.openURL(url);
            //cc.sys.openURL(Configs.App.getLinkGrFacebook());
        }

        // actGroup() {
        //     cc.sys.openURL(this.congdong);
        // }
        actLinkGroup() {
            cc.sys.openURL(this.congdong);
        }
        actTelegram() {
            // var url = "https://t.me/CSKH_sun9.club";
            cc.sys.openURL(this.linktelegramcskh);
            // App.instance.openTelegram(Configs.App.getLinkTelegramGroup());
        }

        actDownloadApp() {
            var url = this.linkDownloadApp;
            cc.sys.openURL(url);
        }

        actAppOTP() {
            App.instance.openTelegram();
        }


        actSupportOnline() {
            // if (!cc.sys.isNative) {
            //     var url = this.linkLiveChat;
            //     cc.sys.openURL(url);
            // } else {
            //     this.actFanpage();
            // }
            var url = this.linkLiveChat;
            cc.sys.openURL(url);
        }

        // actLinkGroup() {
        //  let defaultLink = 'https://t.me/cskh_sunwin24';    
        //     if(this.linkGroup) {
        //         cc.sys.openURL(this.congdong);
        //     }else {
        //         cc.sys.openURL(defaultLink);
        //     }
        // }

        actLinkFanpage() {
            let defaultLink = 'https://t.me/cskh_sunwin24';
            if(this.linkFacebook) {
                cc.sys.openURL(this.linkFacebook);
            }else {
                cc.sys.openURL(defaultLink);
            }
        }
        public actSwitchCoin() {
            if (this.lblCoin.node.parent.active) {
                this.lblCoin.node.parent.active = false;
            } else {
                this.lblCoin.node.parent.active = true;
            }
        }

        actGameTaiXiu(event, game) {
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.openGameTaiXiuMini();
        }

        actGameBauCua() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.openGameBauCua();
        }

        actGameCaoThap(event, game) {
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.openGameCaoThap();
        }

        actGameSlot3x3(event, game) {
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.openGameSlot3x3();
        }

        actGameMiniPoker(event, game) {
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.openGameMiniPoker();
        }

        actGameTaLa() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.alertDialog.showMsg("Sắp ra mắt.");
        }

        actGoToSlot1(event, data) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("Slot1", "Slot1");
            });
        }

        actGoToSlot2() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("Slot2", "Slot2");
            });
        }

        actGoToSlot3() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("Slot3", "Slot3");
            });
        }

        actGoToSlot4(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("Slot4", "Slot4");
            });
        }
        actGoToSlotDau1() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "1DRAGON_PHOENIX");
            });
        }

        actGoToSlotDau2() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "2MAYA_GAME");
            });
        }

        actGoToSlotDau3() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "3CLEOPATRA");
            });
        }

        actGoToSlotDau4() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "4ZEUS");
            });
        }

        actGoToSlotDau5() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "5HADES");
            });
        }

        actGoToSlotDau6() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "6ALICE");
            });
        }

        actGoToSlotDau7() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "7DRAGON_FIRE");
            });
        }

        actGoToSlotDau8() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "7DRAGON_FIRE");
            });
        }

        actGoToSlotDau9() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "9TOWER_OF_FORTUNAR");
            });
        }

        actGoToSlotDau10() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "10THAI_BLOSSOMS");
            });
        }

        actGoToSlotDau11() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "11POTS_OF_GOLD");
            });
        }

        actGoToFastDau1() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "22PLINKO");
            });
        }

        actGoToFastDau2() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("GauDau", "23MINER");
            });
        }

        actGoToSlotTT() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("SlotTT", "SlotTT");
            });
        }

        actGoToSlotThewitcher() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("Thewitcher", "Thewitcher");
            });
        }

        actGoToSlot5(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("Slot5", "Slot5");
            });
        }


        actGoToSlot6() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("Slot6", "Slot6");
            });
        }

        actGoToSlot7(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("Slot7", "Slot7");
            });
        }

        actGoToSlotFastAndFurious(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("SlotFastAndFurious", "SlotFAF");
            });
        }

        actGoToSlotBongLaiCac(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("SlotBLC", "SlotBongLaiCac");
            });
        }

        actGoToSlotSexyDance(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("SlotSexyDance", "SlotSexyDance");
            });
        }

        actGoToSlotLadyNight(event, game) {
            if(!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("SlotLadyNight", "SlotLadyNight");
            });
        }

        actGoToSlot8() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.loadSceneInSubpackage("Slot8", "Slot8");
            });
        }

        actGoToSlot9(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("Slot9", "Slot9");
            });
        }

        actDev() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.alertDialog.showMsg("Sắp ra mắt.");
            return;
        }

        actGoToShootFish() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.loadSceneInSubpackage("ShootFish", "ShootFish");
        }

        actGoToMauBinh(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance._selectGameNode = event.currentTarget;
            App.instance.loadSceneInSubpackage("MauBinh", "MauBinh");
        }

        actGotoLoto() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.loadSceneInSubpackage("Loto", "Loto");
        }

        actGotoBongDa() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.loadSceneInSubpackage("BongDa", "BongDa");

        }
        actGoToBanCaACE(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }

            Http.get(Configs.App.API, {"c" :4074, "t":49}, (err,json) => {
                // if(this.isGameOff("banca", json)) {
                //     this.actShowCommingSoon();
                //     return;
                // }
                // App.instance.showLoading(false);

                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                App.instance.loadSceneInSubpackage("ShootFish", "ShootFish");
            })
        }

        actGameTaiXiuMD5(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            App.instance.openGameTaiXiuMD5();
        }

        actGoToXocDia(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;
            App.instance._selectGameNode = event.currentTarget;
            App.instance.loadSceneInSubpackage("XocDia", "XocDia");
        }

        actAddCoin() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            this.actCreatePopupShop(ShopTabEnum.AUTO_BANK);
        }

        actCreatePopupShop(startTab) {
            cc.sys.localStorage.setItem('startChargeTab', startTab);
            this.actOpenPopup(this.popupShop, true);
        }

        actOpenGiftCode() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            this.actOpenPopup(this.prefabPopupGiftCode);
        }

        actCashout() {
            cc.sys.localStorage.setItem('startWithdrawTab', ShopTabEnum.AUTO_BANK);
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            this.actOpenPopup(this.prefabPopupCashOut, true);
        }

        accExchange() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
        }

        actGoToTLMN(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;

            App.instance.showErrLoading("Đang kết nối tới server...");
        }

        actGameTLMNSolo() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;

            App.instance.showErrLoading("Đang kết nối tới server...");
            TienLenNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                // App.instance.loadScene("TienLen");
                App.instance.loadSceneInSubpackage("TienLen", "TienLen");
            });
        }

        actGoToSam(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;

            App.instance.showErrLoading("Đang kết nối tới server...");
            SamNetworkClient.getInstance().checkConnect(() => {
                // App.instance.showLoading(false);
                App.instance._selectGameNode = event.currentTarget;
                // App.instance.loadScene("Sam");
                App.instance.loadSceneInSubpackage("Sam", "Sam");
            });
        }

        actGoToBauCuaTo2(event, game) {
            let iconGame = null;
            for(let j = 0 ; j < this.ArrMiniGame.length ; j++) {
                if(game == this.ArrMiniGame[j].Key) {
                    iconGame = this.ArrMiniGame[j].Icon;
                }
            }
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            //     BauCuaTo2NetworkClient.getInstance().checkConnect(() => {
            App.instance.loadSceneInSubpackage("BauCuaTo2", "BauCuaTo2");
            // });

        }


        actGoToBaCay(event, data) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance._selectGameNode = event.currentTarget;
            App.instance.loadSceneInSubpackage("BaCay", "BaCay");
        }

        actGoToLieng() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            App.instance.loadSceneInSubpackage("Lieng", "Lieng");
        }
        actGoToBaiCao(event, data) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;
            App.instance._selectGameNode = event.currentTarget;
            App.instance.loadSceneInSubpackage("BaiCao", "BaiCao");
        }

        actGoToXiDach() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            // App.instance.alertDialog.showMsg("Sắp ra mắt.");
            // return;
            App.instance.loadSceneInSubpackage("XiDach", "XiDach");
        }
        actGoToPoker(event, game) {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            //App.instance.alertDialog.showMsg("Sắp ra mắt.");
            //return;
            App.instance._selectGameNode = event.currentTarget;
            App.instance.loadSceneInSubpackage("Poker", "Poker");
        }


        actSoundClick() {
            AudioManager.getInstance().playEffect(this.soundClickSun);
        }

        actOpenVerifyPhoneNumber() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
            this.popupSecurityPhone.show();
        }

        actRecharge() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }
        }

        isGameOff(game: string, json) {
            console.log("json ", json);
            if (json == null || json.code != 0) {
                return false;
            }
            let data = json.description.sunvin;
            if (data != undefined && data.hasOwnProperty(game) && data[game] == 'off') {
                return true;
            } else {
                return false;
            }
        }

        onClickCommunityAndSupports(event, game) {
            let containerChild = event.currentTarget.children[0];
            if(containerChild.scaleY <= 0) {
                containerChild.runAction(cc.scaleTo(0.2, 1, 1));
            } else {
                containerChild.runAction(cc.scaleTo(0.2, 1, 0));
            }
        }

        onClickFanpageFB() {
            cc.sys.openURL('https://facebook.com');
        }

        onClickGroupFB() {
            cc.sys.openURL('https://facebook.com');
        }

        onClickLiveChat() {
            cc.sys.openURL('https://facebook.com');
        }

        onClickTelegram() {
            cc.sys.openURL(this.linktelegramcskh);
        }

        // actOpenGame(event) {
        //     if (!Configs.Login.IsLogin) {
        //         App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
        //         return;
        //     }
        //     let name = event.currentTarget.name;
        //     console.log("name này ", name);
        //     switch (name) {
        //         //
        //         case "fanpage":
        //             this.actFanpage();
        //             break;
        //         case "kichhoat":
        //             this.actOpenVerifyPhoneNumber();
        //             break;
        //         // slots
        //         case "ongdo":
        //             this.actShowCommingSoon();
        //             break;
        //         case "avengers":
        //             this.actGoToSlot5();
        //             break;
        //         case "private_king":
        //             this.actGoToSlot4();
        //             break;
        //         case "thuycung":
        //             this.actShowCommingSoon();
        //             break;
        //         case "thantai":
        //             this.actGoToSlot7();
        //             break;
        //         case "tayduky":
        //             this.actShowCommingSoon();
        //             break;
        //         case "thanthu":
        //             this.actShowCommingSoon();
        //             break;
        //         // mini game
        //         case "taixiu":
        //             this.actGameTaiXiu();
        //             break;
        //         case "baucua":
        //             this.actGameBauCua();
        //             break;
        //         case "kimcuong":
        //             this.actGameSlot3x3();
        //             break;
        //         case "trenduoi":
        //             this.actGameCaoThap();
        //             break;
        //         case "minipoker":
        //             this.actGameMiniPoker();
        //             break;
        //         // game bai
        //         case "tlmn":
        //             this.actGoToTLMN();
        //             break;
        //         case "samloc":
        //             this.actGoToSam();
        //             break;
        //         case "poker":
        //             this.actGoToPoker();
        //             break;
        //         case "blackjack":
        //             this.actGoToSam();
        //             break;
        //         case "phom":
        //             this.actGoToBaiCao();
        //             break;
        //         case "maubinh":
        //             this.actGoToMauBinh();
        //             break;
        //         case "lieng":
        //             this.actShowCommingSoon();
        //             break;
        //         case "xito":
        //             this.actShowCommingSoon();
        //             break;
        //         //
        //         case "banca":
        //             this.actGoToBanCaACE();
        //             break;
        //         case "sicbo":
        //             this.actGotoSicBo();
        //             break;
        //         case "xocdia":
        //             this.actGoToXocDia();
        //             break;
        //         case "xocdia_livestream":
        //             this.actShowCommingSoon();
        //             break;
        //         case "tayduthankhi":
        //             this.actShowCommingSoon();
        //             break;
        //         case "xeng777":
        //             this.actGotoXeng777();
        //             break;
        //         case "keno_locphat":
        //             break;
        //         case "baucuato2":
        //             this.actGoToBauCuaTo2();
        //             break;
        //         case "baccarat":
        //             this.actShowCommingSoon();
        //             break;
        //         default:
        //             break;
        //     }
        // }

        actOpenUserProfile() {
            this.actOpenPopup(this.popupProfile);
        }

        actOpenPopupTransaction() {
            this.actOpenPopup(this.popupTransaction);
        }

        actOpenPopup(prefab: cc.Prefab, isGlobal = false) {
            if(prefab == null) {
                return;
            }
            let popup = cc.instantiate(prefab);
            this.actPlaySFXClick();
            if(isGlobal) {
                App.instance.node.getChildByName('PopupParent').addChild(popup);
            } else {
                this.nodeLobby.addChild(popup);
            }
            popup.getChildByName('Container').scale = 0;
            popup.getChildByName('Container').runAction(
                cc.sequence(
                    cc.scaleTo(.27, 1.1),
                    cc.scaleTo(.06, 1)
                )
            );
        }

        actClosePopup(node, cb: () => void = null) {
            node.getChildByName('Container').runAction(
                cc.sequence(
                    cc.scaleTo(.06, 1.2),
                    cc.scaleTo(.27, 0),
                    cc.callFunc(() => {
                        if(cb != null) {
                            cb();
                        }
                        node.destroy();
                    })
                )
            )
        }

        actOpenMailBox() {
            this.actOpenPopup(this.prefabMailBox);
        }

        actOpenCashOutTransaction() {
            this.actOpenPopup(this.prefabPopupCashOutTransaction, true);
        }

        actOpenCashOutGuide() {
            this.actOpenPopup(this.prefabPopupCashOutGuide, true);
        }

        actOpenChargeTransaction() {
            this.actOpenPopup(this.prefabPopupChargeTransaction, true);
        }

        actOpenChargeGuide() {
            this.actOpenPopup(this.prefabPopupChargeGuide, true);
        }

        actOpenPopupEvent() {
            this.actOpenPopup(this.prefabPopupEvent);
        }

        actOpenPopupForgetPassword() {
            this.actOpenPopup(this.prefabPopupForgetPassword);
        }

        actOpenTagGame() {
            if(this.tagGameNode.scaleY === 0) {
                this.tagGameNode.runAction(
                    cc.scaleTo(.15, 1, 1)
                );
            } else {
                this.tagGameNode.runAction(
                    cc.scaleTo(.15, 1, 0)
                );
            }
        }

        actOpenPopupSecurity() {
            if(this.popupSecurity) {
                this.actOpenPopup(this.popupSecurity);
            }
        }

        actOpenPopupActiveTelegram() {
            if(this.popupActiveTelegram) {
                this.actOpenPopup(this.popupActiveTelegram);
            }
        }

        actOpenPopupSetting() {
            this.actOpenPopup(this.prefabPopupSetting, true);
        }

        actPlayAudioMain() {
            if(GameConfigManager.getInstance().enableBackgroundMusic) {
                cc.audioEngine.stopAll();
                cc.audioEngine.playMusic(this.clipBgm, true);
            }
        }

        actPauseAudioMain() {
            cc.audioEngine.stopMusic();
        }

        actPlaySFXClick() {
            if(GameConfigManager.getInstance().enableSound) {
                cc.audioEngine.playEffect(this.clickSound, false);
            }
        }

        actOpenPopupCashOutBank() {
            this.actOpenPopup(this.prefabPopupUpdateCashoutBank);
        }

        actOpenSupport() {
            if(this.nodeSupport.scaleY === 0) {
                this.nodeSupport.runAction(
                    cc.scaleTo(.2, 1, 1),
                )
            } else {
                this.nodeSupport.runAction(
                    cc.scaleTo(.2, 1, 0),
                )
            }
        }

        actShowComingSoon() {
            App.instance.actShowThongBao('Game sắp ra mắt.');
        }

        actOpenPopupSafe() {
            if(this.prefabPopupSafe) {
                this.actOpenPopup(this.prefabPopupSafe);
            }
        }

        actOpenPopupTelegramActiveGuide() {
            if(this.prefabPopupTelegramGuide) {
                this.actOpenPopup(this.prefabPopupTelegramGuide);
            }
        }

        loadListMail() {
            try {
                Http.get(Configs.App.API, { "c": ApiIDEnum.GET_MAIL, "nn": Configs.Login.Nickname, "p": 0}, (err, res) => {
                    if(res.success) {
                        if(this.nodeUnreadMail) {
                            this.nodeUnreadMail.active = res.mailNotRead != 0;
                        }
                    }
                });
            } catch(ex) {
                console.log(ex);
                this.nodeUnreadMail.active = false;
            } finally {
                App.instance.showLoading2(false);
            }
        }

        onShowApp() {
            if(Configs.Login.IsLogin) {
                this.loadListMail();
            }
            this.actPlayAudioMain();
        }

        onSelectGame(event, game) {
            if(!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(GameErrorMessage.NOT_LOGINED);
                return;
            }

            if(game === undefined) {
                App.instance.actShowThongBao("Game sắp ra mắt.");
                return;
            }

            if(game == 'Maintenance') {
                App.instance.actShowThongBao("Game đang bảo trì.");
                return;
            }

            let iconGame = null;
            for(let i = 0 ; i < this.ArrMiniGame.length; i++) {
                if(game == this.ArrMiniGame[i].Key) {
                    iconGame = this.ArrMiniGame[i].Icon;
                }
            }
            this.actPlaySFXClick();
            if(!event && iconGame) {
                // @ts-ignore
                cc._selectedGameNode = iconGame;
            } else if(event) {
                // @ts-ignore
                cc._selectedGameNode = event.currentTarget;
            }
            switch (game) {
                case 'BaCay':
                    App.instance.loadSceneFromBundle('BaCay', {src: "BaCay"});
                    break;
                case 'ShootFish':
                    App.instance.loadSceneFromBundle('ShootFish', {src: "ShootFish"});
                    break;
                case 'XocDia':
                    App.instance.loadSceneFromBundle('XocDia', {src: "XocDia"});
                    break;
                case 'BauCuaTo2':
                    App.instance.loadSceneFromBundle('BauCuaTo2', {src: "BauCuaTo2"});
                    break;
                case 'FastAndFurious':
                    App.instance.loadSceneFromBundle('SlotFAF', {src: "SlotFastAndFurious"});
                    break;
                case 'SexyDance':
                    App.instance.loadSceneFromBundle('SlotSexyDance', {src: "SlotSexyDance"});
                    break;
                case 'LadyNight':
                    App.instance.loadSceneFromBundle('SlotLadyNight', {src: "SlotLadyNight"});
                    break;
                case 'CowBoy':
                    App.instance.loadSceneFromBundle('Slot7', {src: "Slot7"});
                    break;
                case 'LienMinh':
                    App.instance.loadSceneFromBundle('Slot1', {src: "Slot1"});
                    break;
                case 'BongLaiCac':
                    App.instance.loadSceneFromBundle('SlotBongLaiCac', {src: "SlotBLC"});
                    break;
                case 'MauBinh':
                    App.instance.loadSceneFromBundle('MauBinh', {src: "MauBinh"});
                    break;
                case 'Sam':
                    SamNetworkClient.getInstance().checkConnect(() => {
                        App.instance.loadSceneFromBundle('Sam', {src: "Sam"});
                    });
                    break;
                case 'TLMN':
                    TienLenNetworkClient.getInstance().checkConnect(() => {
                        App.instance.loadSceneFromBundle('TienLen', {src: "TienLen"});
                    });
                    break;
                case 'Poker':
                    App.instance.loadSceneFromBundle('Poker', {src: "Poker"});
                    break;
                case 'BaiCao':
                    App.instance.loadSceneFromBundle('BaiCao', {src: "BaiCao"});
                    break;
                case 'Whisky':
                    App.instance.openGameSlot3x3();
                    break;
                case 'CaoThap':
                    App.instance.openGameCaoThap();
                    break;
                case 'MiniPoker':
                    App.instance.openGameMiniPoker();
                    break;
                case 'TaiXiu':
                    App.instance.openGameTaiXiuMini();
                    break;
                case 'TaiXiuMD5':
                    App.instance.openGameTaiXiuMD5();
                    break;
                case 'MaCao':
                    App.instance.loadSceneFromBundle('SlotMaCao', {src: "SlotMaCao"})
                    break;
                case 'Halloween':
                    App.instance.loadSceneFromBundle('SlotHalloween', {src: "SlotHalloween"})
                    break;
                case 'BigCityBoy':
                    App.instance.loadSceneFromBundle('SlotBigCityBoy', {src: "SlotBigCityBoy"})
                    break;
            }
        }

        getQuickOTPTelegram() {
            let req = {
                "c": ApiIDEnum.QUICK_OTP_TELEGRAM,
                "nickname": Configs.Login.Nickname
            };
            Http.get(Configs.App.API, req, (err, res) => {
                if(res.success) {
                    App.instance.actShowThongBao(GameSuccessMessage.GET_OTP_SUCCESSFULLY);
                    return;
                } else {
                    App.instance.alertDialog.showMsg(res.errorCode);
                }
            });
        }

        actOpenBigBanner() {
            this.actOpenPopup(this.prefabPopupBigBanner);
        }
    }
}
export default Lobby.LobbyController;