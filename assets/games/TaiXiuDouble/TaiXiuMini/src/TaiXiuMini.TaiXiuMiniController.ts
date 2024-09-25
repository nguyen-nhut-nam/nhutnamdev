import cmd from "./TaiXiuMini.Cmd";
import PanelChat from "./TaiXiuMini.PanelChat";
import MiniGameNetworkClient from "../../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../../scripts/networks/Network.InPacket";
import Utils from "../../../../scripts/common/Utils";
import Tween from "../../../../scripts/common/Tween";
import Configs from "../../../../scripts/common/Configs";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import App from "../../../../scripts/common/App";
import TaiXiuDoubleController from "../../src/TaiXiuDouble.Controller";
import PopupDetailHistory from "./TaiXiuMini.PopupDetailHistory";
import AudioManager from "../../../../scripts/common/Common.AudioManager";
import TaiXiuNetWorkClient from "../../../../scripts/networks/TaiXiuNetWorkClient";
import show = cc.show;
import nodeUtils from "../../../../scripts/common/NodeUtils";
import TaiXiuMiniPanelChat from "./TaiXiuMini.PanelChat";

const {ccclass, property} = cc._decorator;

enum BetDoor {
    None, Tai, Xiu
}

@ccclass
export default class TaiXiuMiniController extends cc.Component {

    static instance: TaiXiuMiniController = null;

    @property(cc.Node)
    gamePlay: cc.Node = null;
    @property([cc.SpriteFrame])
    sprDices: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();
    @property(cc.SpriteFrame)
    sprFrameTai: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameXiu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameBtnNan: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameBtnNan2: cc.SpriteFrame = null;
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblRemainTime: cc.Label = null;
    @property(sp.Skeleton)
    lblRemainTimeAnim: sp.Skeleton = null;
    @property(cc.Label)
    lblRemainTime2: cc.Label = null;
    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Label)
    lblUserTai: cc.Label = null;
    @property(cc.Label)
    lblUserXiu: cc.Label = null;
    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;
    @property(cc.Label)
    lblBetTai: cc.Label = null;
    @property(cc.Label)
    lblBetXiu: cc.Label = null;
    @property(cc.Label)
    lblBetedTai: cc.Label = null;
    @property(cc.Label)
    lblBetedXiu: cc.Label = null;
    @property(cc.Node)
    dice1: cc.Node = null;
    @property(cc.Node)
    dice2: cc.Node = null;
    @property(cc.Node)
    dice3: cc.Node = null;

    @property(cc.Node)
    dice1Static: cc.Node = null;
    @property(cc.Node)
    dice2Static: cc.Node = null;
    @property(cc.Node)
    dice3Static: cc.Node = null;

    @property(sp.Skeleton)
    diceAnim: sp.Skeleton = null;
    // @property(sp.Skeleton)
    // xingauBaBy: sp.Skeleton = null;
    // @property(sp.Skeleton)
    // xingau2BaBy: sp.Skeleton = null;
    // @property(sp.Skeleton)
    // xingau3BaBy: sp.Skeleton = null;
    @property(cc.Node)
    bowl: cc.Node = null;
    @property(cc.Node)
    tai: cc.Node = null;
    @property(cc.Node)
    xiu: cc.Node = null;
    @property(cc.Node)
    btnHistories: cc.Node = null;
    @property(cc.Node)
    nodePanelChat: cc.Node = null;
    @property(cc.Node)
    layoutBet: cc.Node = null;
    @property([cc.Button])
    buttonsBet1: Array<cc.Button> = new Array<cc.Button>();
    @property([cc.Button])
    buttonsBet2: Array<cc.Button> = new Array<cc.Button>();
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Label)
    lblWinCash: cc.Label = null;
    @property(cc.Node)
    bgLblWinCash: cc.Node = null;
    @property(cc.Node)
    btnNan: cc.Node = null;
    // @property(cc.Node)
    // noHu: cc.Node = null;

    @property(PopupDetailHistory)
    popupDetailHistory: PopupDetailHistory = null;

    @property([cc.Node])
    public popups: cc.Node[] = [];

    @property(cc.Node)
    cuocTai: cc.Node = null;
    @property(cc.Node)
    cuocXiu: cc.Node = null;

    @property(cc.Node)
    taiAnimation: cc.Node = null;
    @property(cc.Node)
    xiuAnimation: cc.Node = null;
    @property(cc.Label)
    HuTx: cc.Label = null;
    @property(cc.Node)
    diceAnimDo: cc.Node = null;

    // @property({ type: cc.AudioClip })
    // soundLacxiNgau: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    soundKetQua: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundPhienMoi: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundDatCuoc: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundThang: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    audioRollDice = null;

    @property({type: cc.Node})
    detail: cc.Node = null;
    @property({type: cc.Node})
    bgBetTai: cc.Node = null;
    @property({type: cc.Node})
    bgBetXiu: cc.Node = null;

    @property({type: cc.Node})
    animNhayTai: cc.Node = null;
    @property({type: cc.Node})
    animNhayXiu: cc.Node = null;
    @property({type:cc.Node})
    lblLasted: cc.Node = null;
    @property(cc.Prefab)
    prefabPopupHistory = null;
    @property(cc.Node)
    nodePopup = null;

    public isBetting = false;
    public isResult = false;
    private remainTime = 0;
    private canBet = true;
    private betedTai = 0;
    private betedXiu = 0;
    private referenceId = 0;
    private betingValue = -1;
    private betingDoor = BetDoor.None;
    private isOpenBowl = false;
    private lastWinCash = 0;
    private lastScore = 0;
    private isNan = false;
    histories = [];
    arrayNameAniXiNgau = ['', 'xi ngau bay 1', 'xi ngau bay 2', 'xi ngau bay 3', 'xi ngau bay 4', 'xi ngau bay 5', 'xi ngau bay 6'];
    private isCanChat = true;
    private panelChat: PanelChat = null;
    private readonly maxBetValue = 999999999;
    private listBets = [1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000];
    private readonly bowlStartPos = cc.v2(0, -60);
    private readonly diceStartPos = cc.v2(-8.092, -150.803);
    private readonly diceEndPos = cc.v2(-7.092, -113.803);
    private diceA = 0;
    private diceB = 0;
    private diceC = 0;
    private numberUserAdd = 50;
    private time = 50;
    private timeArr = [41, 42, 43, 44, 45, 46, 47, 48, 49];

    private wasCalled = false;
    private defaultPosition = null;

    onLoad() {
        TaiXiuMiniController.instance = this;
        this.defaultPosition = this.gamePlay.position;
    }

    getRanDom() {
        return this.timeArr[Math.floor(Math.random() * this.timeArr.length)];
    }

    actRunTaiXiuAnim() {
        const timeDelay = 0.1;
        cc.tween(this.taiAnimation)
            .repeatForever(
                cc.tween()
                    .delay(timeDelay)
                    .to(0.2, {scale: 0.9})
                    .delay(timeDelay)
                    .to(0.2, {scale: 1.1})
            )
            .start();
        cc.tween(this.xiuAnimation)
            .repeatForever(
                cc.tween()
                    .delay(timeDelay)
                    .to(0.2, {scale: 0.9})
                    .delay(timeDelay)
                    .to(0.2, {scale: 1.1})
            )
            .start();
    }
    start() { // nghe kết quả trả về từ server
        // this.noHu.active = false;
       //TaiXiuNetWorkClient MiniGameNetworkClient
        nodeUtils.disableNode(this.bgBetXiu);
        nodeUtils.disableNode(this.bgBetTai);
        nodeUtils.disableNode(this.layoutBet);
        this.lblBetTai.string = "0";
        this.lblBetXiu.string = "0";
        this.betingDoor = BetDoor.None;
        this.actDisableAnimLastedSession();
        cc.game.on(cc.game.EVENT_SHOW, this.stopWin, this);
       TaiXiuNetWorkClient.getInstance().addListener((data: Uint8Array) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {

                case cmd.Code.GAME_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceiveGameInfo(data);
                    this.stopWin();
                    this.bowl.active = false;
                    if (res.bettingState) {
                        // dang trong thời gian đặt cược
                        this.isResult = false;
                        this.bowl.getComponent(cc.BlockInputEvents).enabled = false;
                        this.isBetting = true;
                        this.dice1.active = false;
                        this.dice2.active = false;
                        this.dice3.active = false;

                        this.dice1Static.active = false;
                        this.dice2Static.active = false;
                        this.dice3Static.active = false;
                        this.lblRemainTime.node.active = true;
                        this.lblRemainTime.string = res.remainTime < 10 ? "" + res.remainTime : "" + res.remainTime;
                        this.lblRemainTime2.node.parent.active = false;
                        this.lblScore.node.parent.active = false;
                        Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                        Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                        this.stopWin();
                        this.actDisableAnimLastedSession();
                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 1 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.showToast("Trả tiền cân cửa");
                            }
                            this.wasCalled = true;
                            if (res.potXiu >= res.potTai) {
                                Tween.numberTo(this.lblTotalBetXiu, res.potTai, 0.3);
                            } else {
                                Tween.numberTo(this.lblTotalBetTai, res.potXiu, 0.3);
                            }
                        }
                    } else {
                        // sang thời gian chờ phiên mới
                        this.lastScore = res.dice1 + res.dice2 + res.dice3;
                        this.isBetting = false;
                        this.bowl.getComponent(cc.BlockInputEvents).enabled = true;
                        this.dice1Static.active = true;
                        this.dice2Static.active = true;
                        this.dice3Static.active = true
                        this.dice1Static.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice1];
                        this.dice2Static.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice2];
                        this.dice3Static.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice3];
                        this.actRunTaiXiuAnim();
                        this.dice1.active = false;
                        this.dice2.active = false;
                        this.dice3.active = false;
                        this.wasCalled = false;
                        // this.xingauBaBy.node.active = true;
                        // this.xingauBaBy.setAnimation(0, this.arrayNameAniXiNgau[res.dice1], false);
                        //
                        // this.xingau2BaBy.node.active = true;
                        // this.xingau2BaBy.setAnimation(0, this.arrayNameAniXiNgau[res.dice2], false);
                        //
                        // this.xingau3BaBy.node.active = true;
                        // this.xingau3BaBy.setAnimation(0, this.arrayNameAniXiNgau[res.dice3], false);
                        // this.dicesA[res.dice1].node.active = true;
                        // this.dicesB[res.dice2].node.active = true;
                        // this.dicesC[res.dice3].node.active = true;
                        this.lblRemainTime.node.active = false;
                        this.lblRemainTime2.node.parent.active = true;
                        this.lblRemainTime2.string = "" + (res.remainTime < 10 ? "00:0" + res.remainTime : "" + res.remainTime);
                        this.showResult();
                    }
                    this.HuTx.string = Utils.formatNumber(res.moneyHu);
                    this.diceAnim.node.active = false;
                    this.betedTai = res.betTai;
                    this.lblBetedTai.string = Utils.formatNumber(this.betedTai);
                    this.betedXiu = res.betXiu;
                    this.lblBetedXiu.string = Utils.formatNumber(this.betedXiu);
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.remainTime = res.remainTime;
                    break;
                }
                case cmd.Code.UPDATE_TIME: {
                    let res = new cmd.ReceiveUpdateTime(data);
                    if (res.bettingState) {
                        this.isBetting = true;
                        this.isResult = false;
                        this.actDisableAnimLastedSession();
                        this.lblRemainTime.node.active = true;
                        // this.lblRemainTimeAnim.node.active = false;
                        this.lblRemainTime.string = res.remainTime < 10 ? `0${res.remainTime}` : "" + res.remainTime;
                        this.lblRemainTime2.node.parent.active = false;
                        this.lblScore.node.parent.active = false;
                        //Update số người chơi đặt mỗi bên
                        this.lblUserTai.string = "" + Utils.formatNumber(res.numBetTai) + "";
                        this.lblUserXiu.string = "" + Utils.formatNumber(res.numBetXiu) + "";
                        this.stopWin();
                        this.lblUserTai.node.runAction(
                            cc.sequence(
                                cc.scaleTo(.1, 1.2),
                                cc.scaleTo(.1, 1)
                            )
                        )
                        this.lblUserXiu.node.runAction(
                            cc.sequence(
                                cc.scaleTo(.1, 1.2),
                                cc.scaleTo(.1, 1)
                            )
                        )
                        //
                        // if(res.remainTime <= 5) {
                        //     this.lblRemainTime.node.active = false;
                        //     this.lblRemainTimeAnim.node.active = true;
                        //     this.lblRemainTimeAnim.clearTracks();
                        //     this.lblRemainTimeAnim.setAnimation(0, `${res.remainTime}`, false);
                        // }

                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 2 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.showToast("Trả tiền cân cửa");
                            }
                            this.wasCalled = true;
                            if (res.potXiu >= res.potTai) {
                                Tween.numberTo(this.lblTotalBetXiu, res.potTai, 0.3);
                            } else {
                                Tween.numberTo(this.lblTotalBetTai, res.potXiu, 0.3);
                            }
                            this.lblTotalBetTai.node.stopAllActions();
                            this.lblTotalBetXiu.node.stopAllActions();
                        } else {
                            this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                            this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                            this.lblTotalBetTai.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.2),
                                    cc.scaleTo(.1, 1)
                                )
                            )
                            this.lblTotalBetXiu.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.2),
                                    cc.scaleTo(.1, 1)
                                )
                            )
                        }
                    } else {
                        this.isBetting = false;
                        this.lblRemainTime.node.active = false;
                        this.lblRemainTime2.node.parent.active = true;
                        this.lblRemainTime2.string = "" + (res.remainTime < 10 ? "00:0" + res.remainTime : "" + res.remainTime);
                        if (res.potXiu >= res.potTai) {
                            Tween.numberTo(this.lblTotalBetXiu, res.potTai, 0.3);
                            Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                        } else {
                            Tween.numberTo(this.lblTotalBetTai, res.potXiu, 0.3);
                            Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                        }
                        if (res.remainTime < 3 && this.isNan && !this.isOpenBowl) {
                            this.bowl.active = false;
                            this.showResult();
                            this.showWinCash();
                            this.isOpenBowl = true;
                        }
                        this.wasCalled = false;
                    }
                    this.HuTx.string = Utils.formatNumber(res.moneyhu);
                    break;
                }
                case cmd.Code.DICES_RESULT: {
                    let res = new cmd.ReceiveDicesResult(data);
                    this.lastScore = res.dice1 + res.dice2 + res.dice3;
                    this.lblRemainTime.node.active = false;
                    this.diceAnim.node.active = true;
                    this.dice1.active = true;
                    this.dice2.active = true;
                    this.dice3.active = true;

                    this.dice1Static.active = false;
                    this.dice2Static.active = false;
                    this.dice3Static.active = false;

                    this.dice1.getComponent(sp.Skeleton).clearTracks();
                    this.dice2.getComponent(sp.Skeleton).clearTracks();
                    this.dice3.getComponent(sp.Skeleton).clearTracks();
                    this.diceAnim.setAnimation(0, "anim xx", false);
                    cc.audioEngine.play(this.audioRollDice, false, 1);
                    this.dice1.getComponent(sp.Skeleton).setAnimation(res.dice1, `goc1_mat ${res.dice1}`, false);
                    this.dice2.getComponent(sp.Skeleton).setAnimation(6 + res.dice2, `goc2_mat ${res.dice2}`, false);
                    this.dice3.getComponent(sp.Skeleton).setAnimation(12 + res.dice3, `goc3_mat ${res.dice3}`, false);
                    this.scheduleOnce(() => {
                        this.diceAnim.node.active = false;
                        if (!this.isNan) {
                            this.showResult();
                        } else {
                            this.bowl.active = true;
                            this.bowl.position = this.bowlStartPos;
                        }
                    }, 2);

                    if (this.histories.length >= 100) {
                        this.histories.slice(0, 1);
                    }
                    this.histories.push({
                        "session": this.referenceId,
                        "dices": [
                            res.dice1,
                            res.dice2,
                            res.dice3
                        ]
                    });
                    break;
                }
                case cmd.Code.RESULT: {
                    let res = new cmd.ReceiveResult(data);
                    // console.log(res);
                    Configs.Login.Coin = res.currentMoney;
                    this.lastWinCash = res.totalMoney;
                    this.HuTx.string = "" + res.moneyHu;
                    if (!this.bowl.active) {
                        if (res.totalMoney > 0) this.showWinCash();
                    }
                    break;
                }
                case cmd.Code.NEW_GAME: {
                    this.showToast("Bắt Đầu Phiên Mới");
                    // this.noHu.active = false;
                    this.time = this.getRanDom();
                    let res = new cmd.ReceiveNewGame(data);
                    AudioManager.getInstance().playEffect(this.soundPhienMoi);
                    nodeUtils.disableNode(this.bgBetTai);
                    nodeUtils.disableNode(this.bgBetXiu);
                    this.diceAnim.node.active = false;
                    // this.xingauBaBy.node.active = false;
                    // this.xingau2BaBy.node.active = false;
                    // this.xingau3BaBy.node.active = false;
                    this.dice1.active = false;
                    this.dice2.active = false;
                    this.dice3.active = false;

                    this.dice1Static.active = false;
                    this.dice2Static.active = false;
                    this.dice3Static.active = false;

                    this.dice1.getComponent(sp.Skeleton).clearTracks();
                    this.dice2.getComponent(sp.Skeleton).clearTracks();
                    this.dice3.getComponent(sp.Skeleton).clearTracks();

                    this.lblBetTai.string = "0";
                    this.lblBetXiu.string = "0";

                    this.lblTotalBetTai.string = "0";
                    this.lblTotalBetXiu.string = "0";
                    this.HuTx.string = "0";
                    this.lblBetedTai.string = "0";
                    this.lblBetedXiu.string = "0";
                    this.lblUserTai.string = "0";
                    this.lblUserXiu.string = "0";
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.betingValue = -1;
                    // this.betingDoor = BetDoor.None;
                    this.betedTai = 0;
                    this.betedXiu = 0;
                    this.isOpenBowl = false;
                    this.lastWinCash = 0;
                    this.actDisableAnimLastedSession();
                    this.stopWin();
                    break;
                }
                case cmd.Code.HISTORIES: {
                    let res = new cmd.ReceiveHistories(data);
                    var his = res.data.split(",");
                    for (var i = 0; i < his.length; i++) {
                        this.histories.push({
                            "session": this.referenceId - his.length / 3 + parseInt("" + ((i + 1) / 3)) + (this.isBetting ? 0 : 1),
                            "dices": [
                                parseInt(his[i]),
                                parseInt(his[++i]),
                                parseInt(his[++i])
                            ]
                        });
                    }
                    this.updateBtnHistories();
                    break;
                }
                case cmd.Code.LOG_CHAT: {
                    let res = new cmd.ReceiveLogChat(data);
                    var msgs = JSON.parse(res.message);
                    for (var i = 0; i < msgs.length; i++) {
                        this.panelChat.addMessage(msgs[i]["u"], msgs[i]["m"]);
                    }
                    this.panelChat.scrollToBottom();
                    break;
                }
                case cmd.Code.SEND_CHAT: {
                    console.log("data ")
                    let res = new cmd.ReceiveSendChat(data);
                    switch (res.error) {
                        case 0:
                            this.panelChat.addMessage(res.nickname, res.message);
                            break;
                        case 2:
                            this.showToast("Bạn không có quyền Chat!");
                            break;
                        case 3:
                            this.showToast("Tạm thời bạn bị cấm Chat!");
                            break;
                        case 4:
                            this.showToast("Nội dung chat quá dài.");
                            break;
                        default:
                            this.showToast("Bạn không thể chat vào lúc này.");
                            break;
                    }
                    // console.log(res);
                    break;
                }
                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    switch (res.result) {
                        case 0:
                            switch (this.betingDoor) {
                                case BetDoor.Tai:
                                    this.betedTai += this.betingValue;
                                    this.lblBetedTai.string = Utils.formatNumber(this.betedTai);
                                    break;
                                case BetDoor.Xiu:
                                    this.betedXiu += this.betingValue;
                                    this.lblBetedXiu.string = Utils.formatNumber(this.betedXiu);
                                    break;
                            }
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

                            this.betingValue = -1;
                            this.showToast("Đặt cược thành công.");
                            AudioManager.getInstance().playEffect(this.soundDatCuoc);
                            break;
                        case 2:
                            this.betingValue = -1;
                            this.showToast("Hết thời gian cược.");
                            break;
                        case 3:
                            this.betingValue = -1;
                            this.showToast("Số dư không đủ vui lòng nạp thêm.");
                            break;
                        case 4:
                            this.betingValue = -1;
                            this.showToast("Số tiền cược không hợp lệ.");
                            break;
                        default:
                            this.betingValue = -1;
                            this.showToast("Đặt cược không thành công.");
                            break;
                    }
                    break;
                }
                default:
                    // console.log(inpacket.getCmdId());
                    break;
            }
        }, this);
        for (let i = 0; i < this.buttonsBet1.length; i++) {
            if(this.buttonsBet1[i] == null) continue;
            let btn = this.buttonsBet1[i];
            let value = this.listBets[i];
            btn.node.on("click", () => {
                if (this.betingDoor === BetDoor.None) return;
                let lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
                let number = Utils.stringToInt(lblBet.string) + value;
                if (number > this.maxBetValue) number = this.maxBetValue;
                lblBet.string = Utils.formatNumber(number);
            });
        }
        this.actShowDetail();
        this.bowl.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            const pos = this.bowl.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.bowl.position = pos;

            let distance = Utils.v2Distance(pos, this.bowlStartPos);
            // console.log(distance);
            if (Math.abs(distance) > 240) {
                this.bowl.active = false;
                this.isOpenBowl = true;
                this.showResult();
                this.showWinCash();
            }
        }, this);

        // this.gamePlay.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
        //     let pos = this.gamePlay.position;
        //     pos.x += event.getDeltaX();
        //     pos.y += event.getDeltaY();
        //     this.gamePlay.position = pos;
        // }, this);
    }

    actAllin() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.betingDoor === BetDoor.None) return;
        let lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        let number = Configs.Login.Coin;
        if (number > this.maxBetValue) number = this.maxBetValue;
        lblBet.string = Utils.formatNumber(number);
    }

    show() {
        App.instance.buttonMiniGame.showTimeTaiXiu(false);
        nodeUtils.getChildNode(this.node, "GamePlay").children.forEach(node => {
            node.opacity = 255;
        })
       // this.layoutBet.active = false;
        this.lblToast.node.parent.active = false;
        this.lblWinCash.node.active = false;
        this.bgLblWinCash.active = false
        this.diceAnim.node.active = false;
        this.bowl.active = false;
        this.dice1.active = false;
        this.dice2.active = false;
        this.dice3.active = false;
        this.time = this.getRanDom();
        this.gamePlay.position = this.defaultPosition;
        TaiXiuNetWorkClient.getInstance().send(new cmd.SendScribe());
        this.showChat();
    }

    showChat() {
        try {
            this.panelChat = this.nodePanelChat.getComponent(PanelChat);
            this.panelChat.show(true);
        } catch (error) {

        }
    }

    dismiss() {
        try {
            for (let i = 0; i < this.popups.length; i++) {
                this.popups[i].active = false;
            }
            this.panelChat.show(false);
        } catch (error) {
            
        }
      
        TaiXiuNetWorkClient.getInstance().send(new cmd.SendUnScribe());
    }

    actClose() {
        AudioManager.getInstance().playEffect(this.soundClick);
        TaiXiuDoubleController.instance.dismiss();
    }

    actChat() {
        AudioManager.getInstance().playEffect(this.soundClick);
        this.panelChat.show(!this.panelChat.node.active);
    }

    actBetTai() {
        AudioManager.getInstance().playEffect(this.soundClick);
        // if (!this.isBetting) {
        //     this.showToast("Chưa đến thời gian đặt cược.");
        //     return;
        // }
        if (this.betingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betedXiu > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
        this.betingDoor = BetDoor.Tai;
        this.cuocTai.active = false;
        this.lblBetTai.string = "0";
        this.cuocXiu.active = true;
        this.lblBetXiu.string = "0";
        this.layoutBet.active = true;
    }

    actBetXiu() {
        AudioManager.getInstance().playEffect(this.soundClick);
        // if (!this.isBetting) {
        //     this.showToast("Chưa đến thời gian đặt cược.");
        //     return;
        // }
        if (this.betingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betedTai > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
        this.betingDoor = BetDoor.Xiu;
        this.cuocXiu.active = false;
        this.lblBetXiu.string = "0";
        this.cuocTai.active = true;
        this.lblBetTai.string = "0";
        this.layoutBet.active = true;
    }

    actAgree() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.betingValue >= 0 || !this.canBet) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        this.betingValue = Utils.stringToInt(lblBet.string);
        this.betingDoor = this.betingDoor;
        TaiXiuNetWorkClient.getInstance().send(new cmd.SendBet(this.referenceId, this.betingValue, this.betingDoor == BetDoor.Tai ? 1 : 0, this.remainTime));
        if(this.betingValue <= 0) {
            return;
        }
        lblBet.string = "0";
        if (this.betingDoor === BetDoor.Tai) {
            nodeUtils.activeNode(this.bgBetTai);
            nodeUtils.disableNode(this.bgBetXiu);
        } else {
            nodeUtils.disableNode(this.bgBetTai);
            nodeUtils.activeNode(this.bgBetXiu);
        }
        this.canBet = false;
        this.scheduleOnce(function () {
            this.canBet = true;
        }, 1);
    }

    actCancel() {
        AudioManager.getInstance().playEffect(this.soundClick);
        this.cuocXiu.active = true;
        this.cuocTai.active = true;
        this.lblBetXiu.string = "0";
        this.lblBetTai.string = "0";
        this.betingDoor = BetDoor.None;
        this.layoutBet.active = false;
    }

    actBtnGapDoi() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        var number = Utils.stringToInt(lblBet.string) * 2;
        if (number > this.maxBetValue) number = this.maxBetValue;
        lblBet.string = Utils.formatNumber(number);
    }

    actBtnDelete() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        var number = "" + Utils.stringToInt(lblBet.string);
        number = number.substring(0, number.length - 1);
        number = Utils.formatNumber(Utils.stringToInt(number));
        lblBet.string = number;
    }

    actBtn000() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        var number = Utils.stringToInt(lblBet.string + "000");
        if (number > this.maxBetValue) number = this.maxBetValue;
        lblBet.string = Utils.formatNumber(number);
    }

    actNan() {
        AudioManager.getInstance().playEffect(this.soundClick);
        this.isNan = !this.isNan;
        this.btnNan.getComponent(cc.Sprite).spriteFrame = this.isNan ? this.sprFrameBtnNan : this.sprFrameBtnNan2;
    }

    private showResult() {
        //console.error("showResult");
        this.lblScore.node.parent.active = true;
        this.lblScore.string = "" + this.lastScore;
        this.isResult = true;
        cc.audioEngine.play(this.soundKetQua, false, 1);
        this.actRunTaiXiuAnim();
        if (this.lastScore >= 11) {
            if (this.lastScore == 18) {
                // this.noHu.active = true;
                this.taiAnimation.active = true;
                this.tai.active = false;
            } else {
                this.taiAnimation.active = true;
                this.tai.active = false;
                // this.noHu.active = false;
            }
        } else {
            if (this.lastScore == 3) {
                // this.noHu.active = true;
                this.xiuAnimation.active = true;
                this.xiu.active = false;
            } else {
                this.xiuAnimation.active = true;
                this.xiu.active = false;
                // this.noHu.active = false;
            }
        }
        this.updateBtnHistories();
    }

    private stopWin() {
        this.tai.stopAllActions();
        this.taiAnimation.stopAllActions();
        cc.tween(this.taiAnimation).stop();
        this.tai.active = true;
        this.taiAnimation.active = false;

        this.xiu.stopAllActions();
        this.xiu.active = true;
        this.xiuAnimation.stopAllActions();
        cc.tween(this.xiuAnimation).stop();
        this.xiuAnimation.active = false;
    }

    public showToast(message: string) {
        // App.instance.actShowThongBao2(message);
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.y = 50;
        parent.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.2, cc.v2(parent.x, 25)),
                    cc.fadeIn(0.2),
                ),
                cc.delayTime(2),
                cc.spawn(
                    cc.moveTo(0.2, cc.v2(parent.x, 150)),
                    cc.fadeOut(0.2),
                ),
                cc.callFunc(() => {
                    parent.active = false;
                }),
            )
        );
    }

    private showWinCash() {
        if (this.lastWinCash <= 0) return;
        this.bgLblWinCash.active = true
        AudioManager.getInstance().playEffect(this.soundThang);
        this.lblWinCash.node.stopAllActions();
        this.lblWinCash.node.active = true;
        this.bgLblWinCash.scale = 0;
        this.bgLblWinCash.position = cc.Vec2.ZERO;
        Tween.numberTo(this.lblWinCash, this.lastWinCash, 0.5, (n) => {
            return ("+" + Utils.formatNumber(n))
        });
        this.bgLblWinCash.runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.delayTime(2),
            cc.moveBy(1, cc.v2(0, 60)),
            cc.callFunc(() => {
                this.bgLblWinCash.active = false;
            })
        ));

        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    updateBtnHistories() {
        let histories = this.histories.slice();
        if (histories.length > this.btnHistories.childrenCount) {
            histories.splice(0, histories.length - this.btnHistories.childrenCount);
        }
        let idx = histories.length - 1;
        for (let i = this.btnHistories.childrenCount - 1; i >= 0; i--) {
            if (idx >= 0) {
                const score = histories[idx]["dices"][0] + histories[idx]["dices"][1] + histories[idx]["dices"][2];
                this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = score >= 11 ? this.sprFrameTai : this.sprFrameXiu;
                if (i === this.btnHistories.childrenCount - 1) {
                    let phien = this.btnHistories.children[i];
                    phien.active = false;
                    nodeUtils.activeNode(phien);
                }
                this.btnHistories.children[i].off("click");
                this.btnHistories.children[i].on("click", (e, b) => {
                    this.popupDetailHistory.showDetail(histories[idx]["session"]);
                });
                this.btnHistories.children[i].active = true;
            } else {
                this.btnHistories.children[i].active = false;
            }
            idx--;
        }
        // this.actShowAnimLastedSession();
    }

    actShowHistory() {
        AudioManager.getInstance().playEffect(this.soundClick);
        let histories = this.histories.slice();
        if (histories.length > this.btnHistories.childrenCount) {
            histories.splice(0, histories.length - this.btnHistories.childrenCount);
        }
        let idx = histories.length - 1;
        this.popupDetailHistory.showDetail(histories[idx]["session"]);
    }

    sendChat(message: string) {
        let _this = this;
        AudioManager.getInstance().playEffect(this.soundClick);
        if (!_this.isCanChat) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        _this.isCanChat = false;
        this.scheduleOnce(function () {
            _this.isCanChat = true;
        }, 1);
        var req = new cmd.SendChat(unescape(encodeURIComponent(message)));
        TaiXiuNetWorkClient.getInstance().send(req); // gửi chat này
    }

    actSoundClick() {
        AudioManager.getInstance().playEffect(this.soundClick);
    }

    showDetail(pos, sessionHistory) {
        this.detail.position = cc.v2(pos.x + this.btnHistories.x, this.btnHistories.y + pos.y - 100);
        let session = "#" + sessionHistory['session'].toString();
        let kq = sessionHistory['dices'][0] + sessionHistory['dices'][1] + sessionHistory['dices'][2];
        let detail = "(" + sessionHistory['dices'][0] + "-"
            + sessionHistory['dices'][1] + "-"
            + sessionHistory['dices'][2] + ")";
        if (kq > 10) {
            detail = "Tài " + detail;
        } else {
            detail = "Xỉu " + detail;
        }
        let nodeSession = nodeUtils.getChildNode(this.detail, "session");
        nodeUtils.setNodeLabel(nodeSession, session);
        let nodeDetail = nodeUtils.getChildNode(this.detail, "detail");
        nodeUtils.setNodeLabel(nodeDetail, detail);
        this.detail.active = true;
    }

    hideDetail() {
        this.detail.active = false;
    }

    actShowDetail() {
        for (let i = this.btnHistories.childrenCount - 1; i >= 0; i--) {
            let his = this.btnHistories.children[i];
            his.on(cc.Node.EventType.MOUSE_MOVE, () => {
                if (this.detail.active === false) {
                    let latestHistory = this.histories.slice();
                    if (latestHistory.length > this.btnHistories.childrenCount) {
                        latestHistory.splice(0, latestHistory.length - this.btnHistories.childrenCount);
                    }
                    // console.log(latestHistory[i]);
                    // this.showDetail(his.position, latestHistory[i]);
                }
            })
            his.on(cc.Node.EventType.MOUSE_LEAVE, () => {
                this.hideDetail();
            })
        }
    }

    actDisableAnimLastedSession() {
        nodeUtils.disableNode(this.lblLasted);
        nodeUtils.disableNode(this.animNhayXiu);
        nodeUtils.disableNode(this.animNhayTai);
    }

    actShowAnimLastedSession() {
        nodeUtils.setNodeLabel(this.lblLasted, this.lastScore.toString());
        if (this.lastScore > 10) {
            nodeUtils.activeNode(this.animNhayTai);
            nodeUtils.setNodeColor(this.lblLasted, cc.Color.WHITE);
        } else {
            nodeUtils.activeNode(this.animNhayXiu);
            nodeUtils.setNodeColor(this.lblLasted, cc.Color.BLACK);
        }
        nodeUtils.activeNode(this.lblLasted);
    }

    actOpenBetHistory() {
        if(this.prefabPopupHistory) {
            let popupHistory = cc.instantiate(this.prefabPopupHistory);
            this.nodePopup.addChild(popupHistory);
        }
    }
}