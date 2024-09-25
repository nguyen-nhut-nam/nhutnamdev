import InPacket from "../../../scripts/networks/Network.InPacket";
import TienLenNetworkClient from "../../../scripts/networks/TienLenNetworkClient";
import CardGameCmd from "../../../scripts/networks/CardGame.Cmd";
import TienLenCmd from "./TienLen.Cmd";
import Tween from "../../../scripts/common/Tween";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";
import App from "../../../scripts/common/App";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import TienLenGameLogic from "./TienLen.GameLogic";
import InGame from "./TienLen.InGame";
import Res from "./TienLen.Res";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Room extends cc.Component {
    public static IS_SOLO = false;
    public static instance: Room = null;

    @property(cc.Node)
    roomContent: cc.Node = null;
    @property(cc.Node)
    ingameNode: cc.Node = null;
    @property(cc.Label)
    lbCoin: cc.Label = null;
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Sprite)
    sprAvatar2: cc.Sprite = null;

    @property(cc.Prefab)
    prefabItemRoom: cc.Prefab = null;
    @property(cc.Node)
    popupGuide = null;

    private ingame: InGame = null;
    private listRoom = [];
    private listmember = [];

    totalBanUser = 0;
    totalBanSolo = 0;
    totalBan4Nguoi = 0;


    private intervalPing = -1;
    private timeout = 0;

    onLoad() {
        //this.getRoomMember();
        Room.instance = this;
        Res.getInstance();

        this.ingame = this.ingameNode.getComponent(InGame);
        this.ingameNode.active = false;

        this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        TienLenNetworkClient.getInstance().addOnClose(() => {
            this.actBack();
        }, this);

        this.lblNickname.string = Configs.Login.Nickname;
        this.sprAvatar2.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        this.intervalPing = setInterval(() => this.ping(), 5000);
    }

    ping() {
        if(this.timeout >= 60) {
            this.actBack();
            return;
        }
        this.timeout += 5;
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendPing());
    }

    start() {
        TienLenNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            let cmdId = inpacket.getCmdId();
            cc.log("TienLen cmd: ", cmdId);
            switch (cmdId) {
                case CardGameCmd.Code.LOGIN:
                    TienLenNetworkClient.getInstance().send(new TienLenCmd.SendReconnectRoom());
                    cc.log("TienLen Login");
                    break;
                case CardGameCmd.Code.MONEY_BET_CONFIG: {
                    let res = new CardGameCmd.ResMoneyBetConfig(data);
                    cc.log(res);
                    this.listRoom = res.list;
                    this.initRooms(res.list);
                    break;
                }
                case CardGameCmd.Code.JOIN_ROOM_FAIL: {
                    let res = new CardGameCmd.ReceivedJoinRoomFail(data);
                    var e = "";
                    switch (res.error) {
                        case 1:
                            e = "L\u1ed7i ki\u1ec3m tra th\u00f4ng tin!";
                            break;
                        case 2:
                            e = "Kh\u00f4ng t\u00ecm \u0111\u01b0\u1ee3c ph\u00f2ng th\u00edch h\u1ee3p. Vui l\u00f2ng th\u1eed l\u1ea1i sau!";
                            break;
                        case 3:
                            e = "B\u1ea1n kh\u00f4ng \u0111\u1ee7 ti\u1ec1n v\u00e0o ph\u00f2ng ch\u01a1i n\u00e0y!";
                            break;
                        case 4:
                            e = "Kh\u00f4ng t\u00ecm \u0111\u01b0\u1ee3c ph\u00f2ng th\u00edch h\u1ee3p. Vui l\u00f2ng th\u1eed l\u1ea1i sau!";
                            break;
                        case 5:
                            e = "M\u1ed7i l\u1ea7n v\u00e0o ph\u00f2ng ph\u1ea3i c\u00e1ch nhau 10 gi\u00e2y!";
                            break;
                        case 6:
                            e = "H\u1ec7 th\u1ed1ng b\u1ea3o tr\u00ec!";
                            break;
                        case 7:
                            e = "Kh\u00f4ng t\u00ecm th\u1ea5y ph\u00f2ng ch\u01a1i!";
                            break;
                        case 8:
                            e = "M\u1eadt kh\u1ea9u ph\u00f2ng ch\u01a1i kh\u00f4ng \u0111\u00fang!";
                            break;
                        case 9:
                            e = "Ph\u00f2ng ch\u01a1i \u0111\u00e3 \u0111\u1ee7 ng\u01b0\u1eddi!";
                            break;
                        case 10:
                            e = "B\u1ea1n b\u1ecb ch\u1ee7 ph\u00f2ng kh\u00f4ng cho v\u00e0o b\u00e0n!"
                    }
                    App.instance.alertDialog.showMsg(e);
                    break;
                }
                case TienLenCmd.Code.JOIN_ROOM_SUCCESS: {
                    let res = new TienLenCmd.ReceivedJoinRoomSuccess(data);
                    cc.log(res);
                    TienLenGameLogic.getInstance().initWith(res);
                    this.show(false);
                    this.ingame.show(true, res);
                    break;
                }
                case TienLenCmd.Code.UPDATE_GAME_INFO: {
                    let res = new TienLenCmd.ReceivedUpdateGameInfo(data);
                    cc.log(res);
                    this.show(false);
                    this.ingame.updateGameInfo(res);
                    break;
                }
                case TienLenCmd.Code.AUTO_START: {
                    let res = new TienLenCmd.ReceivedAutoStart(data);
                    cc.log(res);
                    TienLenGameLogic.getInstance().autoStart(res);
                    this.ingame.autoStart(res);
                    break;
                }
                case TienLenCmd.Code.USER_JOIN_ROOM: {
                    let res = new TienLenCmd.ReceiveUserJoinRoom(data);
                    cc.log(res);
                    this.ingame.onUserJoinRoom(res);
                    break;
                }
                case TienLenCmd.Code.FIRST_TURN: {
                    let res = new TienLenCmd.ReceivedFirstTurnDecision(data);
                    cc.log(res);
                    this.ingame.firstTurn(res);
                    break;
                }
                case TienLenCmd.Code.CHIA_BAI: {
                    let res = new TienLenCmd.ReceivedChiaBai(data);
                    cc.log(res);
                    this.ingame.chiaBai(res)
                    break;
                }
                case TienLenCmd.Code.CHANGE_TURN: {
                    let res = new TienLenCmd.ReceivedChangeTurn(data);
                    cc.log(res);
                    this.ingame.changeTurn(res);
                    break;
                }
                case TienLenCmd.Code.DANH_BAI: {
                    let res = new TienLenCmd.ReceivedDanhBai(data);
                    cc.log(res);
                    this.ingame.submitTurn(res);
                    break;
                }
                case TienLenCmd.Code.BO_LUOT: {
                    let res = new TienLenCmd.ReceivedBoluot(data);
                    cc.log(res);
                    this.ingame.passTurn(res);
                    break;
                }
                case TienLenCmd.Code.END_GAME: {
                    let res = new TienLenCmd.ReceivedEndGame(data);
                    cc.log(res);
                    this.ingame.endGame(res);
                    break;
                }
                case TienLenCmd.Code.UPDATE_MATCH: {
                    let res = new TienLenCmd.ReceivedUpdateMatch(data);
                    cc.log(res);
                    this.ingame.updateMatch(res);
                    break;
                }
                case TienLenCmd.Code.USER_LEAVE_ROOM: {
                    let res = new TienLenCmd.UserLeaveRoom(data);
                    cc.log(res);
                    this.ingame.userLeaveRoom(res);
                    break;
                }
                case TienLenCmd.Code.REQUEST_LEAVE_ROOM: {
                    let res = new TienLenCmd.ReceivedNotifyRegOutRoom(data);
                    cc.log(res);
                    this.ingame.notifyUserRegOutRoom(res);
                    break;
                }
                case TienLenCmd.Code.CHAT_ROOM: {
                    App.instance.showLoading(false);
                    let res = new TienLenCmd.ReceivedChatRoom(data);
                    cc.log("TLMN CHAT_ROOM res : ", JSON.stringify(res));
                    this.ingame.playerChat(res);
                }
                    break;
                case TienLenCmd.Code.CHAT_CHONG: {
                    App.instance.showLoading(false);
                    let res = new TienLenCmd.ReceivedChatChong(data);
                    cc.log("TLMN CHAT_CHONG res : ", JSON.stringify(res));
                    this.ingame.playerChatChong(res);
                }
                    break;
                case TienLenCmd.Code.WAIT_4_DOI_THONG: {
                    App.instance.showLoading(false);
                    let res = new TienLenCmd.ReceivedWaitBonDoiThong(data);
                    cc.log("TLMN WAIT_4_DOI_THONG res : ", JSON.stringify(res));
                    this.ingame.wait4doithong(res);
                    break;
                }
                case TienLenCmd.Code.PING_PONG:
                    let res = new TienLenCmd.ReceivePong(data);
                    console.log(res);
                    this.timeout = 0;
                    break;
                // case TienLenCmd.Code.RECONNECT_GAME_ROOM: {
                //     let res = new TienLenCmd.UserLeaveRoom(data);
                //     cc.log(res);
                //     this.ingame.userLeaveRoom(res);
                //     break;
                // }
            }
        }, this);

        //get list room
        this.refreshRoom();
    }

    initRooms(rooms) {
        let arrBet = [];
        this.roomContent.removeAllChildren();
        let id = 0;
        let names = ["San bằng tất cả", "Nhiều tiền thì vào", "Dân chơi", "Bàn cho đại gia", "Tứ quý", "Bốn đôi thông", "Tới trắng", "Chặt heo"];
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                id++;

                let isExisted = arrBet.indexOf(room.moneyBet);
                if (isExisted == -1) {
                    arrBet.push(room.moneyBet);
                }

                // var item = cc.instantiate(this.roomItem);
                // item.getChildByName("lblId").getComponent(cc.Label).string = id.toString();
                // item.getChildByName("lblName").getComponent(cc.Label).string = names[Utils.randomRangeInt(0, names.length)];
                // var txts = item.getComponentsInChildren(cc.Label);
                // Tween.numberTo(txts[2], room.moneyRequire, 0.3);
                // Tween.numberTo(txts[3], room.moneyBet, 0.3);
                // txts[4].string = room.nPersion + "/" + room.maxUserPerRoom;
                // var progress = item.getChildByName("playersProgress").getComponent(cc.Sprite);
                // progress.fillRange = room.nPersion / room.maxUserPerRoom;
                // var btnJoin = item.getComponentInChildren(cc.Button);
                // btnJoin.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                //     TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0));
                // });
                // item.parent = this.roomContent;
            }
        }

        cc.log("CardGame_ItemRoom arrBet : ", arrBet);
        arrBet.sort(function (a, b) {
            return a - b;
        });
        cc.log("CardGame_ItemRoom arrBet Increase : ", arrBet);

        for (let index = 0; index < arrBet.length; index++) {
            let playerCount = 0;
            let maxUser = 0;
            let moneyRequire = 0;
            for (let a = 0; a < rooms.length; a++) {
                let room = rooms[a];

                if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                    if (room.moneyBet == arrBet[index]) {
                        playerCount += room.nPersion;
                        maxUser = room.maxUserPerRoom;
                        moneyRequire = room.moneyRequire;
                        cc.log("room : ", room);
                    }
                }
            }
            cc.log("CardGame_ItemRoom playerCount : ", playerCount);
            if (index < Configs.App.listmember.length) {
                playerCount = Configs.App.listmember[index] + playerCount;
            }

            let item = cc.instantiate(this.prefabItemRoom).getComponent("CardGame_ItemRoom");
            item.initItems({
                bet: arrBet[index],
                players: playerCount,
                maxUser: maxUser,
                moneyRequire: moneyRequire,
                gameId: Room.IS_SOLO ? 1 : 0  // 0 = TLMN, 1 = TLMN Solo, 2 = Sam Loc, 3 = Ba Cay, 4 = Bai Cao, 5 = Poker, 6 = Mau Binh
            });
            this.roomContent.addChild(item.node);
        }
    }

    handleJoinRoom(info) {
        cc.log("CardGame handleJoinRoom info : ", info);
        if (Configs.Login.Coin < info.moneyRequire) {
            App.instance.alertDialog.showMsg("Không đủ tiền để tham gia phòng này.");
            return;
        }

        TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, info.maxUser, info.bet, 0));
    }

    actBack() {
        TienLenNetworkClient.getInstance().close();
        clearInterval(this.intervalPing);
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    protected onDestroy() {
        clearInterval(this.intervalPing);
        TienLenNetworkClient.getInstance().close();
    }

    public show(isShow: boolean) {
        this.node.active = isShow;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    refreshRoom() {
        TienLenNetworkClient.getInstance().send(new CardGameCmd.SendMoneyBetConfig());
    }

    public actQuickPlay() {
        if (this.listRoom == null) {
            App.instance.alertDialog.showMsg("Không tìm thấy bàn nào phù hợp với bạn.");
            return;
        }
        //find all room bet < coin
        let listRoom = [];
        for (let i = 0; i < this.listRoom.length; i++) {
            if (this.listRoom[i].moneyRequire <= Configs.Login.Coin) {
                let room = this.listRoom[i];
                if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                    listRoom.push(room);
                }
            }
        }
        if (listRoom.length <= 0) {
            App.instance.alertDialog.showMsg("Không tìm thấy bàn nào phù hợp với bạn.");
            return;
        }
        let randomIdx = Utils.randomRangeInt(0, listRoom.length);
        let room = listRoom[randomIdx];
        TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0));
    }

    changeChooseRoom(event, index) {
        this.filterRoom(this.listRoom, parseInt(index));
    }

    filterRoom(rooms, number) {
        this.totalBanSolo = 0;
        this.totalBanUser = 0;
        this.totalBan4Nguoi = 0;
        let arrBet = [];
        this.roomContent.removeAllChildren();
        let id = 0;
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            if (room.moneyBet < 1000) {
                continue;
            }
            let isExisted = arrBet.indexOf(room.moneyBet + "|" + room.maxUserPerRoom);
            if (isExisted == -1) {
                arrBet.push(room.moneyBet + "|" + room.maxUserPerRoom);
            }
        }

        ////cc.log("CardGame_ItemRoom arrBet : ", arrBet);
        arrBet.sort(function (a, b) {
            return parseInt(a.split("|")[0]) - parseInt(b.split("|")[0])
        });
        ////cc.log("CardGame_ItemRoom arrBet Increase : ", arrBet);

        for (let index = 0; index < arrBet.length; index++) {
            let playerCount = 0;
            let maxUser = 0;
            let moneyRequire = 0;
            let bet = 0;
            for (let a = 0; a < rooms.length; a++) {
                let room = rooms[a];
                if (room.moneyBet + "|" + room.maxUserPerRoom == arrBet[index]) {
                    bet = room.moneyBet;
                    playerCount += room.nPersion;
                    maxUser = room.maxUserPerRoom;
                    moneyRequire = room.moneyRequire;
                    ////cc.log("room : ", room);
                }
            }
            ////cc.log("CardGame_ItemRoom playerCount : ", playerCount);
            if (index < Configs.App.listmember.length) {
                playerCount = Configs.App.listmember[index] + playerCount;
            }
            let item = cc.instantiate(this.prefabItemRoom).getComponent("CardGame_ItemRoom");
            item.initItems({
                bet: bet,
                players: playerCount,
                maxUser: maxUser,
                moneyRequire: moneyRequire,
                gameId: maxUser == 2 ? 1 : 0  // 0 = TLMN, 1 = TLMN Solo, 2 = Sam Loc, 3 = Ba Cay, 4 = Bai Cao, 5 = Poker, 6 = Mau Binh
            });
            if (number == 0) {
                this.roomContent.addChild(item.node);
            } else if (number == 1) {
                if (maxUser != 2) {
                    continue;
                } else {
                    this.roomContent.addChild(item.node);
                }
            } else if (number == 2) {
                if (maxUser != 4) {
                    continue;
                } else {
                    this.roomContent.addChild(item.node);
                }
            }
        }
    }

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
    }

    showPopupGuide() {
        this.popupGuide.active = true;
    }

    closePopupGuide() {
        this.popupGuide.active = false;
    }
}