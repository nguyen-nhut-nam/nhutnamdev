import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Utils from "../../../scripts/common/Utils";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import cmd from "./XocDia.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import App from "../../../scripts/common/App";
import XocDiaController from "./XocDia.XocDiaController";
import Random from "../../../scripts/common/Random";
import Tween from "../../../scripts/common/Tween";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    notifyMarquee = "";
    @property(cc.Node)
    listItems: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Sprite)
    sprAvatar2: cc.Sprite = null;

    private inited = false;

    // onLoad () {}
    @property([cc.Label])
    lblUser: cc.Label[] = [];
    @property(cc.Label)
    lblHu: cc.Label = null;
    start() {

    }
    @property(cc.Label)
    txtNotifyMarquee: cc.Label = null;
    thongbao = "Thông báo: Cập nhật Link game mới nhất: sun9.club" +
        "#Quý khách lưu lại để tránh vào nhầm domain lạ mất tài khoản." +
        "#Do đơn nạp/rút nhiều đôi khi ngân hàng xử lý chậm," +
        "#Nạp 30p chưa + điểm quý khách vui lòng liên hệ Hỗ trợ trực tuyến Live chát để được xử lý" +
        "#Hoặc telegam @cskh_sun9.club#Cú pháp Tên NV + Hóa đơn.";

    public init() {
        let i = 0;
        let oldMess = "";
        let listNotif = this.thongbao.split("#");
        cc.tween(this.txtNotifyMarquee.node)
            .repeatForever(
                cc.tween()
                    .call(() => {
                        let notif = this.thongbao + this.notifyMarquee;
                        if (notif != oldMess) {
                            oldMess = notif;
                            console.log("notif ", notif);
                            listNotif = notif.split("#");
                        }
                    })
                    .call(() => {
                        if (listNotif != undefined) {
                            if (i > listNotif.length - 1) {
                                i = 0;
                            }
                            let text = listNotif[i];
                            this.txtNotifyMarquee.string = text;
                            this.txtNotifyMarquee.node.opacity = 0;
                            i++;
                        }
                    })
                    .to(0.2, {opacity: 255})
                    .delay(3)
                    .to(0.2, {opacity: 0})
                    .delay(0.5)
            )
            .start();
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            // console.log(inPacket.getCmdId());
            switch (inPacket.getCmdId()) {
                case cmd.Code.NOTIFY_MARQUEE: {
                    let res = new cmd.ResNotifyMarquee(data);
                    let resJson = JSON.parse(res.message);
                    this.notifyMarquee = "";
                    for (let i = 0; i < resJson["entries"].length; i++) {
                        let e = resJson["entries"][i];
                        this.notifyMarquee += "#" + Configs.GameId.getGameName(e["g"]) + "";
                        this.notifyMarquee += " " + e["n"] + " Thắng ";
                        this.notifyMarquee += "" + Utils.formatNumber(e["m"]) + "";
                        //LobbyController.notifyMarquee +=""+ "    "+ this.thongbao  + "";
                        if (i < resJson["entries"].length - 1) {
                            this.notifyMarquee += "        ";
                        }
                        this.notifyMarquee.trim();
                    }
                    break;
                }
            }
        }, this);
        let jackBot = Random.rangeInt(200000, 500000);
        Tween.numberTo(this.lblHu, jackBot*1000, 0.3);
        for(let i = 0 ; i< this.lblUser.length; i++) {
            let item = this.lblUser[i];
            if(i ==0) {
                let userCount = Random.rangeInt(200, 500);
                item.string = userCount+"";
            }else if(i == 1) {
                let userCount = Random.rangeInt(0, 50);
                item.string = userCount+"";
            }else if(i == 2) {
                let userCount = Random.rangeInt(0, 50);
                item.string = userCount+"";
            }else if(i == 3) {
                let userCount = Random.rangeInt(0, 50);
                item.string = userCount+"";
            }
        }
        if (this.inited) return;
        this.inited = true;

        this.lblNickname.string = Configs.Login.Nickname;
        this.sprAvatar2.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        XocDiaNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    {
                        XocDiaNetworkClient.getInstance().send(new cmd.SendReconnect());
                    }
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceiveJoinRoomFail(data);
                        console.log(res);
                        let msg = "Lỗi " + res.getError() + ", không xác định.";
                        switch (res.getError()) {
                            case 1:
                                msg = "Lỗi kiểm tra thông tin!";
                                break;
                            case 2:
                                msg = "Không tìm được phòng thích hợp. Vui lòng thử lại sau!";
                                break;
                            case 3:
                                msg = "Bạn không đủ tiền vào phòng chơi này!";
                                break;
                            case 4:
                                msg = "Không tìm được phòng thích hợp. Vui lòng thử lại sau!";
                                break;
                            case 5:
                                msg = "Mỗi lần vào phòng phải cách nhau 10 giây!";
                                break;
                            case 6:
                                msg = "Hệ thống bảo trì!";
                                break;
                            case 7:
                                msg = "Không tìm thấy phòng chơi!";
                                break;
                            case 8:
                                msg = "Mật khẩu phòng chơi không đúng!";
                                break;
                            case 9:
                                msg = "Phòng chơi đã đủ người!";
                                break;
                            case 10:
                                msg = "Bạn bị chủ phòng không cho vào bàn!"
                        }
                        App.instance.alertDialog.showMsg(msg);
                    }
                    break;
                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceiveJoinRoomSuccess(data);
                        this.node.active = false;
                        XocDiaController.instance.play.show(res);
                    }
                    break;
                default:
                    console.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);

        // this.itemTemplate.active = false;
    }

    public show() {
        this.node.active = true;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        this.actRefresh();
    }

    public actRefresh() {
        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }

    public actBack() {
        XocDiaNetworkClient.getInstance().close();
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    protected onDestroy() {
        XocDiaNetworkClient.getInstance().close();
    }

    public actCreateTable() {
        App.instance.alertDialog.showMsg("Không thể tạo bàn trong game này.");
    }

    public actVaoGame() {
        this.node.active = false;
        App.instance.showLoading(true);
        XocDiaNetworkClient.getInstance().send(new cmd.SendJoinRoomById(1));
    }
    // update (dt) {}

    actAddCoin() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
    }

    actCashout() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
        // App.instance.popupCashout.show();
    }
}
