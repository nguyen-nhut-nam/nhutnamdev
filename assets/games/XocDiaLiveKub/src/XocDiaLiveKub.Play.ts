import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import cmd from "./XocDiaLiveKub.Cmd";
import Configs from "../../../scripts/common/Configs";
import BtnPayBet from "./XocDiaLiveKub.BtnPayBet";
import XocDiaLiveKubNetworkClient from "./XocDiaLiveKub.XocDiaNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import TimeUtils from "../../../scripts/common/TimeUtils";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import cmdNetwork from "../../../scripts/networks/Network.Cmd";
import XocDiaLiveKubGameMessage from "./XocDiaLiveKub.GameMessage";
import XocDiaLiveKubController from "./XocDiaLiveKub.XocDiaController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Play extends cc.Component {
    public static instance: Play = null;
    @property(cc.Label)
    lblNickName = null;
    @property(cc.Label)
    lblMoney = null;
    @property(cc.Sprite)
    spriteAvatar = null;

    @property(cc.Label)
    lblSessionId = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblDate = null;
    @property(cc.Label)
    lblTimer = null;

    @property([BtnPayBet])
    btnPayBets: BtnPayBet[] = [];
    @property(cc.Label)
    lblHistoryOdd: cc.Label = null;
    @property(cc.Label)
    lblHistoryEven: cc.Label = null;
    @property(cc.Label)
    lblHistory4Red = null;
    @property(cc.Label)
    lblHistory4White = null;
    @property(cc.Label)
    lblHistory3White = null;
    @property(cc.Label)
    lblHistory3Red = null;

    @property(cc.SpriteFrame)
    sfOdd: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfEven: cc.SpriteFrame = null;

    @property(cc.Node)
    lblHistoryItems: cc.Node = null;

    @property({ type: cc.AudioClip })
    soundMoBat: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundDatCuoc: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundRewardChip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundUserWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundStartSession: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick = null;

    @property(cc.Prefab)
    prefabPopupHonor = null;
    @property(cc.Prefab)
    prefabPopupTransaction = null;
    @property(cc.Prefab)
    prefabPopupGuide = null;

    @property(cc.WebView)
    webViewLiveStream = null;
    @property(cc.Node)
    nodePlayVideo = null;
    @property(cc.Label)
    lblTextSession = null;
    @property(cc.Node)
    nodeToast = null;
    @property(cc.Node)
    nodeToastMoneyWin = null;

    private inited = false;
    private roomId = 0;
    private curTime = 0;
    private gameState = 0;
    // private readonly listBets = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];
    private lastUpdateTime = TimeUtils.currentTimeMillis();
    private remoteMusicBackground = null;
    private _runningSessionTime = 1;
    private _bettingValue = 1000;
    private listMyBetCurrent = [0, 0, 0, 0, 0, 0];
    private _livestreamUrl = "";
    private _moneyWin = 0;
    public isOpenPopup = false;

    protected onEnable() {
        this.resetView();
    }

    protected onLoad() {
        Play.instance = this;
        XocDiaLiveKubController.getInstance().setXocDiaLiveView(this);
    }

    start() {
        let self = this;
        XocDiaLiveKubNetworkClient.getInstance().addOnOpen(() => {
            XocDiaLiveKubNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);

        XocDiaLiveKubNetworkClient.getInstance().addOnClose(() => {
            Play.instance.offBgMusic();
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }, this);
        this.init();
        XocDiaLiveKubNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    App.instance.showLoading(true);
                    XocDiaLiveKubNetworkClient.getInstance().send(new cmd.SendJoinRoomById(1));
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceiveJoinRoomFail(data);
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
                    this.show(res);
                }
                    break;
                default:
                    console.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShowApp, this);
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btn = this.btnPayBets[i];
            btn.node.on("click", () => {
                self.actClick();
                if(Configs.Login.Coin < self._bettingValue ) {
                    App.instance.actShowThongBao(XocDiaLiveKubGameMessage.NOT_ENOUGH_BALANCE_TO_BET);
                    return;
                }
                if (self.gameState != 2) {
                    self.toastMessage(XocDiaLiveKubGameMessage.WAIT_FOR_NEW_SESSION);
                    return;
                }
                XocDiaLiveKubNetworkClient.getInstance().send(new cmd.SendPutMoney(i, self._bettingValue));
            });
        }

        XocDiaLiveKubNetworkClient.getInstance().connect();
    }

    update(dt) {
        if (this.curTime > 0) {
            let timeLeft = Math.max(0, this.curTime - TimeUtils.currentTimeMillis());
            if (timeLeft == 0) {
                this.curTime = 0;
            }
        }

        let t = TimeUtils.currentTimeMillis();
        if (t - this.lastUpdateTime > 2000) {
            //console.log("on resume");
            this.node.stopAllActions();
        }
        this.lastUpdateTime = t;

        if(this.isOpenPopup || App.instance.isMiniGameOpened || App.instance.miniGame.childrenCount > 0) {
            this.toggleVideoLiveStream(false);
        } else {
            this.toggleVideoLiveStream(true);
        }
    }

    public init() {
        if (this.inited) return;
        this.inited = true;

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.lblMoney.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        XocDiaLiveKubNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.USER_JOIN_ROOM_SUCCESS:
                    {
                        // let res = new cmd.ReceiveUserJoinRoom(data);
                    }
                    break;
                case cmd.Code.QUIT_ROOM:
                    {
                        let res = new cmd.ReceiveLeavedRoom(data);
                        switch (res.reason) {
                            case 1:
                               // App.instance.loadScene("lobby");
                                this.closeGameAndShowDialog(XocDiaLiveKubGameMessage.NOT_ENOUGH_BALANCE);
                                break;
                            case 2:
                             //   App.instance.loadScene("lobby");

                                this.closeGameAndShowDialog(XocDiaLiveKubGameMessage.MAINTENANCE);
                                break;
                            case 5:
                             //   App.instance.loadScene("lobby");

                                this.closeGameAndShowDialog(XocDiaLiveKubGameMessage.KICKED);
                                break;
                            case 6:
                                this.closeGameAndShowDialog("Nhà cái đã kick bạn ra khỏi phòng!");
                                break;
                        }

                    }
                    break;
                case cmd.Code.ACTION_IN_GAME:
                    {
                        let res = new cmd.ReceiveActionInGame(data);
                        this.gameState = res.action;
                        switch (res.action) {
                            case 1://bat dau van moi
                                break;
                            case 2://bat dau dat cua
                                this.curTime = TimeUtils.currentTimeMillis() + res.time * 1000;
                                this._runningSessionTime = res.time;
                                break;
                            case 3://bat dau ban cua
                                break;
                            case 5://bat dau hoan tien
                                break;
                            case 6://bat dau tra thuong
                                break;
                        }
                    }
                    break;
                case cmd.Code.START_GAME:
                    {
                        let res = new cmd.ReceiveStartGame(data);
                        this.actPlaySoundEffect(this.soundStartSession);
                        this.btnPayBets.forEach(e => e.reset());
                        this.resetBetList();
                        this.lblDate.string = App.instance.getCurrentDate();
                        this.lblTime.string = App.instance.getCurrentTime();
                    }
                    break;
                case cmd.Code.PUT_MONEY:
                    {
                        let res = new cmd.ReceivePutMoney(data);
                        let btnPayBet = this.btnPayBets[res.potId];
                        btnPayBet.setTotalBet(res.potMoney, res.potId);
                        this.scheduleOnce(() => {
                            this.actPlaySoundEffect(this.soundDatCuoc);
                        }, 1);
                        if (res.nickname == Configs.Login.Nickname) {
                            this.listMyBetCurrent[res.potId] += res.betMoney;
                            this.btnPayBets[res.potId].getComponent(BtnPayBet).setMyBet(this.listMyBetCurrent[res.potId]);
                            switch (res.error) {
                                case 0:
                                    break;
                                case 1:
                                    App.instance.alertDialog.showMsg(XocDiaLiveKubGameMessage.NOT_ENOUGH_BALANCE);
                                    return;
                                case 2:
                                    App.instance.alertDialog.showMsg("Không thể đặt quá hạn mức của cửa!");
                                    return;
                                default:
                                    App.instance.alertDialog.showMsg("Lỗi " + res.error + ", không xác định.");
                                    return;
                            }
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        }
                    }
                    break;
                case cmd.Code.FINISH_GAME:
                    {
                        let res = new cmd.ReceiveFinishGame(data);
                        for (let i = 0; i < res.playerInfoWin.length; i++) {
                            let playerData = res.playerInfoWin[i];
                            if (playerData["nickname"] == Configs.Login.Nickname) {
                                this._moneyWin = playerData['moneyWin'];
                                this.toastMoneyWin(`+${Utils.formatNumber(this._moneyWin)}`);
                                Configs.Login.Coin = playerData["currentMoney"];
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                break;
                            }
                        }

                        let doorWins = [];

                        for(let i = 0; i < res.infoAllPot.length; i++) {
                            let potInfo = res.infoAllPot[i];
                            if(potInfo.win) {
                                doorWins.push(potInfo.potId);
                            }
                        }

                        this.scheduleOnce(() => {
                            doorWins.forEach(door => {
                                this.btnPayBets[door].highLightWin.active = true;
                                this.btnPayBets[door].highLightWin.runAction(
                                    cc.repeatForever(
                                        cc.sequence(
                                            cc.fadeIn(.35),
                                            cc.fadeOut(.35),
                                        )
                                    )
                                )
                            });
                        }, 0);

                        XocDiaLiveKubNetworkClient.getInstance().send(new cmd.CmdSendGetCau());
                    }
                    break;
                case cmd.Code.SOI_CAU:
                    {
                        let res = new cmd.ReceiveGetCau(data);
                        this.lblHistoryOdd.string = res.totalOdd.toString();
                        this.lblHistoryEven.string = res.totalEven.toString();
                        this.lblHistory4Red.string = res.total4Black;
                        this.lblHistory4White.string = res.total4White;
                        this.lblHistory3White.string = res.total3White;
                        this.lblHistory3Red.string = res.total3Black;
                        for (let i = 0; i < this.lblHistoryItems.childrenCount; i++) {
                            if (i < res.arrayCau.length) {
                                this.lblHistoryItems.children[i].active = false;
                                this.lblHistoryItems.children[i].getComponent(cc.Sprite).spriteFrame = (res.arrayCau[i] == 1 || res.arrayCau[i] == 4 || res.arrayCau[i] == 5) ? this.sfOdd : this.sfEven;
                                this.lblHistoryItems.children[i].active = true;
                                if(i + 1 === res.arrayCau.length) {
                                    this.lblHistoryItems.children[i].active = true;
                                }
                            } else {
                                this.lblHistoryItems.children[i].active = false;
                            }
                        }
                    }
                    break;
                case cmd.Code.CHAT_MS_RESPONSE:{

                    // let res = new cmd.ReceivedChatRoom(data);
                    break;
                }
                case cmd.Code.INFO_MONEY_AFTER_BANKER_SELL:
                    {
                        // let res = new cmd.ReceiveInfoMoneyAfterBankerSell(data);
                        //console.log(res);
                    }
                    break;
                case cmd.Code.GET_GAME_STATE:
                    {
                        let res = new cmd.ReceiveGameState(data);
                        this.gameState = res.gameState;
                        switch (res.gameState) {
                            case 2:
                                this.lblTextSession.string = 'Thời gian đặt cược';
                                this.lblTimer.node.color = cc.Color.WHITE;
                                break;
                            case 3:
                                this.lblTextSession.string = 'Chờ kết quả';
                                this.lblTimer.node.color = cc.Color.RED;
                                break;
                            case 6:
                                this.lblTextSession.string = 'Chờ phiên mới';
                                this.lblTimer.node.color = cc.Color.RED;
                                break;
                        }
                        this.lblTimer.string = res.time;
                        if(this._livestreamUrl != res.livestreamUrl) {
                            this._livestreamUrl = res.livestreamUrl ?? "";
                            this.webViewLiveStream.url = this._livestreamUrl;
                        }
                        this.lblSessionId.string = `#${res.sessionId}`;
                    }
                    break;
                default:
                    //console.log("inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);
    }

    private resetView() {
        this.btnPayBets.forEach(e => e.reset());
        this.curTime = 0;
        cc.audioEngine.stopAll();
    }

    public show(data: cmd.ReceiveJoinRoomSuccess) {
        this.resetView();
        this.roomId = data.roomId;
        this.lastUpdateTime = TimeUtils.currentTimeMillis();
        Configs.Login.Coin = data.money;

        this.lblMoney.string = Utils.formatNumber(Configs.Login.Coin);
        this.lblNickName.string = Configs.Login.Nickname;
        this.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);

        for (let i = 0; i < data.potID.length; i++) {
            let potData = data.potID[i];
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.setTotalBet(potData["totalMoney"], potData["id"]);
        }

        this.gameState = data.gameState;
        // let msg = "";
        switch (this.gameState) {
            case 1://bat dau van moi
                break;
            case 2://bat dau dat cua
                {
                    this.curTime = TimeUtils.currentTimeMillis() + data.remainBetTime * 1000;
                }
                break;
            case 3://bat dau ban cua
                break;
            case 4://nha cai can tien, hoan tien
                break;
            case 5://bat dau hoan tien
                break;
            case 6://bat dau tra thuong
                break;
        }
        XocDiaLiveKubNetworkClient.getInstance().send(new cmd.CmdSendGetCau());
        this.lblDate.string = App.instance.getCurrentDate();
        this.lblTime.string = App.instance.getCurrentTime();
    }

    public actBack() {
        this.actClick();
        XocDiaLiveKubNetworkClient.getInstance().send(new cmd.SendLeaveRoom());
        XocDiaLiveKubNetworkClient.getInstance().close();
        cc.audioEngine.stop(this.remoteMusicBackground);
        App.instance.actCloseThongBao();
        Play.instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    protected onDestroy() {
        Play.instance = null;
        XocDiaLiveKubNetworkClient.getInstance().close();
    }


    actActiveBetChip(betChip: cc.Node, isActive: boolean) {
        let active = nodeUtils.getChildNode(betChip, "active");
        active.stopAllActions();
        if (isActive) {
            nodeUtils.activeNode(active);
            active.opacity = 255;
            betChip.scale = 1;
        } else {
            betChip.scale = .9;
            active.stopAllActions();
            active.opacity = 255;
            nodeUtils.disableNode(active);
        }
        betChip.getComponent(cc.Button).interactable = !isActive;
    }

    actShowPopupHonor() {
        this.actClick();
        let popupHonor = cc.instantiate(this.prefabPopupHonor);
        this.node.addChild(popupHonor);
        this.toggleVideoLiveStream(false);
        this.isOpenPopup = true;
    }

    actShowPopupTransaction() {
        this.actClick();
        let popupTransaction = cc.instantiate(this.prefabPopupTransaction);
        this.node.addChild(popupTransaction);
        this.toggleVideoLiveStream(false);
        this.isOpenPopup = true;
    }

    actShowPopupGuide() {
        this.actClick();
        let popupGuide = cc.instantiate(this.prefabPopupGuide);
        this.node.addChild(popupGuide);
        this.toggleVideoLiveStream(false);
        this.isOpenPopup = true;
    }

    onShowApp() {
        this.btnPayBets.forEach(e => e.resetHighlightEffect());
        this.nodeToast.scaleX = 0;
        this.nodeToast.stopAllActions();
        this.nodeToastMoneyWin.active = false;
        this.nodeToastMoneyWin.stopAllActions();
    }

    actClick() {
        this.actPlaySoundEffect(this.soundClick);
    }

    actPlaySoundEffect(soundEffect) {
        if(GameConfigManager.getInstance().enableSound && soundEffect != null) {
            cc.audioEngine.play(soundEffect, false, 1);
        }
    }

    actOnBgMusic() {
    }

    offBgMusic() {
        cc.audioEngine.stop(this.remoteMusicBackground);
    }

    actChooseChip(event, data) {
        this._bettingValue = parseInt(data);
    }

    public closeGameAndShowDialog(text){
        App.instance.alertDialog.showMsgWithOnDismissed(text, () => {
            Play.instance = null;
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        });
        this.scheduleOnce(()=>{
            Play.instance = null;
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        },3)
    }

    resetBetList() {
        for(let i = 0; i < this.listMyBetCurrent.length; i++) {
            this.listMyBetCurrent[i] = 0;
        }
    }

    toggleVideoLiveStream(isUsed = false) {
        if(isUsed) {
            this.webViewLiveStream.node.y = 0;
            this.nodePlayVideo.y = 5000;
        } else {
            this.webViewLiveStream.node.y = 5000;
            this.nodePlayVideo.y = 0;
        }
    }

    toastMessage(message, delayTime = 2) {
        this.nodeToast.children[0].getComponent(cc.Label).string = message;
        this.nodeToast.scaleX = 0;
        this.nodeToast.stopAllActions();
        this.nodeToast.runAction(
            cc.sequence(
                cc.scaleTo(.25, 1),
                cc.delayTime(delayTime),
                cc.scaleTo(.25, 0),

            )
        )
    }

    toastMoneyWin(message, delayTime = 2) {
        this.nodeToastMoneyWin.children[0].getComponent(cc.Label).string = message;
        this.nodeToastMoneyWin.y = 0;
        this.nodeToastMoneyWin.active = true;
        this.nodeToastMoneyWin.stopAllActions();
        this.nodeToastMoneyWin.runAction(
            cc.sequence(
                cc.moveTo(.5, cc.v2(0, 100)),
                cc.delayTime(delayTime),
                cc.moveTo(.5, cc.v2(0, 0)),
                cc.callFunc(() => {
                    this.nodeToastMoneyWin.active = false;
                })
            )
        )
    }
}
