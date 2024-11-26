import cmd from "./TaiXiuLiveKub.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import Utils from "../../../scripts/common/Utils";
import Tween from "../../../scripts/common/Tween";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import TaiXiuKuBetNetWorkClient from "../../../scripts/networks/TaiXiuKuBetNetWorkClient";
import nodeUtils from "../../../scripts/common/NodeUtils";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Http from "../../../scripts/common/Http";
import ApiIDEnum from "../../Lobby/src/enum/ApiIDEnum";

const {ccclass, property} = cc._decorator;

enum BetDoor {
    Xiu, Tai, Chan, Le
}

@ccclass
export default class TaiXiuKuBetController extends cc.Component {

    static instance: TaiXiuKuBetController = null;
    @property([cc.SpriteFrame])
    sprDices: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();
    @property(cc.SpriteFrame)
    sprFrameTaiChan: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameTaiLe: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameXiuChan: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameXiuLe: cc.SpriteFrame = null;
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblRemainTime: cc.Label = null;
    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;
    @property(cc.Label)
    lblTotalBetChan: cc.Label = null;
    @property(cc.Label)
    lblTotalBetLe: cc.Label = null;
    @property(cc.Label)
    lblMyBetTai: cc.Label = null;
    @property(cc.Label)
    lblMyBetXiu: cc.Label = null;
    @property(cc.Label)
    lblMyBetChan: cc.Label = null;
    @property(cc.Label)
    lblMyBetLe: cc.Label = null;
    @property(cc.Node)
    dice1: cc.Node = null;
    @property(cc.Node)
    dice2: cc.Node = null;
    @property(cc.Node)
    dice3: cc.Node = null;
    @property(cc.Label)
    lblTotalScore = null;
    @property(cc.Sprite)
    spriteResult = null;
    @property(cc.Sprite)
    spriteNumber = null;
    @property(cc.Node)
    btnHistories: cc.Node = null;
    @property(cc.Node)
    nodePanelChat: cc.Node = null;
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Label)
    lblWinCash: cc.Label = null;

    @property(cc.Node)
    taiAnimation: cc.Node = null;
    @property(cc.Node)
    xiuAnimation: cc.Node = null;
    @property(cc.Node)
    chanAnimation = null;
    @property(cc.Node)
    leAnimation = null;

    @property({ type: cc.AudioClip })
    soundCountDown: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundPhienMoi: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundDatCuoc: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundThang: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property(cc.Prefab)
    prefabPopupHistory = null;
    @property(cc.Prefab)
    prefabGuide = null;
    @property(cc.Prefab)
    prefabSoiCau = null;
    @property(cc.Prefab)
    prefabRanking = null;
    @property(cc.Node)
    nodePopup = null;
    @property(cc.WebView)
    webViewLiveStream = null;
    @property(cc.Node)
    nodePlayVideo = null;
    @property(cc.Label)
    lblMyCoin = null;
    @property(cc.Sprite)
    sprAvatar = null;
    @property(cc.Label)
    lblNickName = null;
    @property(cc.Label)
    lblCurrentSessionDate = null;
    @property(cc.Label)
    lblCurrentSessionTime = null;
    @property(cc.Label)
    lblHistorySessionDate = null;
    @property(cc.Label)
    lblHistorySessionTime = null;
    @property(cc.Label)
    lblHistorySessionID = null;

    @property(cc.Node)
    btnNextSessionDetail = null;
    @property(cc.Node)
    btnPrevSessionDetail = null;

    @property(cc.SpriteFrame)
    sfResultTai = null;
    @property(cc.SpriteFrame)
    sfResultXiu = null;
    @property(cc.SpriteFrame)
    sfNumberEven = null;
    @property(cc.SpriteFrame)
    sfNumberOdd = null;

    public isBetting = false;
    public isResult = false;
    private remainTime = 0;
    private bettedTai = 0;
    private bettedXiu = 0;
    private bettedChan = 0;
    private bettedLe = 0;
    private referenceId = 0;
    private bettingValue = 1000;
    private bettingDoor = null;
    private lastWinCash = 0;
    private lastScore = 0;
    histories = [];
    private wasCalled = false;
    private lastSelectedSessionHistory = null;
    private lastSelectedSessionId = null;
    private lastSelectSessionIndex = null;
    public isOpenPopup = false;

    onLoad() {
        TaiXiuKuBetController.instance = this;
        TaiXiuKuBetNetWorkClient.getInstance().checkConnect(() => {
            TaiXiuKuBetNetWorkClient.getInstance().send(new cmd.SendScribe());
        });

        TaiXiuKuBetNetWorkClient.getInstance().addOnClose(() => {
            this.actBackLobby();
        }, this);

        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        this.lblNickName.string = Configs.Login.Nickname;
        this.actRunTaiXiuAnim();
    }

    actRunTaiXiuAnim() {
        this.taiAnimation.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeOut(.65),
                    cc.fadeIn(.65),
                )
            )
        );
        this.xiuAnimation.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeOut(.65),
                    cc.fadeIn(.65),
                )
            )
        );
        this.chanAnimation.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeOut(.65),
                    cc.fadeIn(.65),
                )
            )
        );
        this.leAnimation.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeOut(.65),
                    cc.fadeIn(.65),
                )
            )
        );
    }
    start() { // nghe kết quả trả về từ server
        cc.game.on(cc.game.EVENT_SHOW, this.stopWin, this);
        this.lblMyCoin.string = Utils.formatNumber(Configs.Login.Coin);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblMyCoin, Configs.Login.Coin, 0.3);
        }, this);
       TaiXiuKuBetNetWorkClient.getInstance().addListener((data: Uint8Array) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.GAME_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceiveGameInfo(data);
                    this.webViewLiveStream.url = res.streamURL;
                    this.lblCurrentSessionTime.string = res.currentSessionDateTime.split(" ")[0];
                    this.lblCurrentSessionDate.string = res.currentSessionDateTime.split(" ")[1];
                    this.stopWin();
                    if (res.bettingState) {
                        // dang trong thời gian đặt cược
                        this.isResult = false;
                        this.isBetting = true;
                        this.lblRemainTime.string = res.remainTime.toString();
                        this.lblRemainTime.node.color = cc.Color.WHITE;
                        Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                        Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                        Tween.numberTo(this.lblTotalBetChan, res.potChan, 0.3);
                        Tween.numberTo(this.lblTotalBetLe, res.potLe, 0.3);
                        this.stopWin();
                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 1 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.lblRemainTime.node.color = cc.Color.RED;
                                this.playSoundEffect(this.soundCountDown);
                            }
                            this.wasCalled = true;
                        }
                    } else {
                        // sang thời gian chờ phiên mới
                        this.lastScore = res.dice1 + res.dice2 + res.dice3;
                        this.dice1.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice1 - 1];
                        this.dice2.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice2 - 1];
                        this.dice3.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice3 - 1];
                        this.lblTotalScore.string = this.lastScore;
                        this.isBetting = false;
                        this.wasCalled = false;
                        this.showResult();
                    }
                    this.bettedTai = res.betTai;
                    this.lblMyBetTai.string = Utils.formatNumber(this.bettedTai);
                    this.bettedXiu = res.betXiu;
                    this.lblMyBetXiu.string = Utils.formatNumber(this.bettedXiu);
                    this.bettedChan = res.betChan;
                    this.lblMyBetChan.string = Utils.formatNumber(this.bettedChan);
                    this.bettedLe = res.betLe;
                    this.lblMyBetLe.string = Utils.formatNumber(this.bettedLe);
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.remainTime = res.remainTime;
                    break;
                }
                case cmd.Code.UPDATE_TIME: {
                    let res = new cmd.ReceiveUpdateTime(data);
                    this.lblRemainTime.string = res.remainTime.toString();
                    if (res.bettingState) {
                        this.isBetting = true;
                        this.isResult = false;
                        this.stopWin();
                        this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                        this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                        this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                        this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
                        this.lblRemainTime.node.color = cc.Color.WHITE;
                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 2 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.lblRemainTime.node.color = cc.Color.RED;
                            }
                            this.wasCalled = true;
                            this.lblTotalBetTai.node.stopAllActions();
                            this.lblTotalBetXiu.node.stopAllActions();
                        } else {
                            this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                            this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                            this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                            this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
                            this.lblRemainTime.node.color = cc.Color.WHITE;
                            this.lblTotalBetTai.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.1),
                                    cc.scaleTo(.1, 1)
                                )
                            );
                            this.lblTotalBetXiu.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.1),
                                    cc.scaleTo(.1, 1)
                                )
                            );
                            this.lblTotalBetChan.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.1),
                                    cc.scaleTo(.1, 1)
                                )
                            );
                            this.lblTotalBetLe.node.runAction(
                                cc.sequence(
                                    cc.scaleTo(.15, 1.1),
                                    cc.scaleTo(.1, 1)
                                )
                            );
                        }
                    } else {
                        this.isBetting = false;
                        this.wasCalled = false;
                        this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                        this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                        this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                        this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
                        this.lblRemainTime.node.color = cc.Color.RED;
                    }
                    break;
                }
                case cmd.Code.DICES_RESULT: {
                    let res = new cmd.ReceiveDicesResult(data);
                    this.lastScore = res.dice1 + res.dice2 + res.dice3;
                    this.dice1.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice1 - 1];
                    this.dice2.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice2 - 1];
                    this.dice3.getComponent(cc.Sprite).spriteFrame = this.sprDices[res.dice3 - 1];
                    this.lblTotalScore.string = this.lastScore;
                    if (this.histories.length >= 100) {
                        this.histories.slice(0, 1);
                    }
                    this.histories.push({
                        "session": this.referenceId,
                        "datetime": Date.now(),
                        "dices": [
                            res.dice1,
                            res.dice2,
                            res.dice3
                        ]
                    });
                    this.lastSelectSessionIndex = this.histories.length - 1;
                    this.btnNextSessionDetail.active = false;
                    this.btnPrevSessionDetail.active = true;
                    this.lastSelectedSessionHistory = this.histories[this.lastSelectSessionIndex];
                    this.lastSelectedSessionId = this.lastSelectedSessionHistory.session;
                    this.lblHistorySessionID.string = this.lastSelectedSessionId.toString();
                    this.lblHistorySessionTime.string = new Date().toLocaleTimeString();
                    this.lblHistorySessionDate.string = new Date().toLocaleDateString();
                    this.setupHistoryResult(this.lastScore);
                    this.showResult();
                    this.scheduleOnce(() => {
                        this.showWinCash();
                    }, 2);
                    break;
                }
                case cmd.Code.RESULT: {
                    let res = new cmd.ReceiveResult(data);
                    Configs.Login.Coin = res.currentMoney;
                    this.lastWinCash = res.totalMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    break;
                }
                case cmd.Code.NEW_GAME: {
                    this.showToast("Bắt Đầu Phiên Mới");
                    let res = new cmd.ReceiveNewGame(data);
                    this.playSoundEffect(this.soundPhienMoi);
                    this.lblCurrentSessionTime.string = res.currentSessionDateTime.split(" ")[0];
                    this.lblCurrentSessionDate.string = res.currentSessionDateTime.split(" ")[1];
                    this.lblTotalBetTai.string = "0";
                    this.lblTotalBetXiu.string = "0";
                    this.lblTotalBetChan.string = "0";
                    this.lblTotalBetLe.string = "0";
                    this.lblMyBetTai.string = "0";
                    this.lblMyBetXiu.string = "0";
                    this.lblMyBetChan.string = "0";
                    this.lblMyBetLe.string = "0";
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.bettedTai = 0;
                    this.bettedXiu = 0;
                    this.bettedChan = 0;
                    this.bettedLe = 0;
                    this.lastWinCash = 0;
                    this.stopWin();
                    break;
                }
                case cmd.Code.HISTORIES: {
                    let res = new cmd.ReceiveHistories(data);
                    console.log(res);
                    var his = res.data.split(",");
                    for (let i = 0; i < his.length; i++) {
                        this.histories.push({
                            "session": this.referenceId - his.length / 3 + parseInt("" + ((i + 1) / 3)) + (this.isBetting ? 0 : 1),
                            "dices": [
                                parseInt(his[i]),
                                parseInt(his[++i]),
                                parseInt(his[++i])
                            ]
                        });
                    }
                    this.lastSelectSessionIndex = this.histories.length - 1;
                    this.lastSelectedSessionHistory = this.histories[this.lastSelectSessionIndex];
                    this.lastSelectedSessionId = this.lastSelectedSessionHistory.session;
                    this.dice1.getComponent(cc.Sprite).spriteFrame = this.sprDices[this.lastSelectedSessionHistory.dices[0] - 1];
                    this.dice2.getComponent(cc.Sprite).spriteFrame = this.sprDices[this.lastSelectedSessionHistory.dices[1] - 1];
                    this.dice3.getComponent(cc.Sprite).spriteFrame = this.sprDices[this.lastSelectedSessionHistory.dices[2] - 1];
                    let totalScore = this.lastSelectedSessionHistory.dices[0] + this.lastSelectedSessionHistory.dices[1] + this.lastSelectedSessionHistory.dices[2];
                    this.lblTotalScore.string = totalScore.toString();
                    this.setupHistoryResult(totalScore);
                    this.loadData();
                    this.updateBtnHistories();
                    break;
                }
                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    switch (res.result) {
                        case 0:
                            switch (this.bettingDoor) {
                                case BetDoor.Tai:
                                    this.bettedTai += this.bettingValue;
                                    this.lblMyBetTai.string = Utils.formatNumber(this.bettedTai);
                                    break;
                                case BetDoor.Xiu:
                                    this.bettedXiu += this.bettingValue;
                                    this.lblMyBetXiu.string = Utils.formatNumber(this.bettedXiu);
                                    break;
                                case BetDoor.Chan:
                                    this.bettedChan += this.bettingValue;
                                    this.lblMyBetChan.string = Utils.formatNumber(this.bettedChan);
                                    break;
                                case BetDoor.Le:
                                    this.bettedLe += this.bettingValue;
                                    this.lblMyBetLe.string = Utils.formatNumber(this.bettedLe);
                                    break;
                            }
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            this.playSoundEffect(this.soundDatCuoc);
                            break;
                        case 2:
                            this.showToast("Hết thời gian cược.");
                            break;
                        case 3:
                            this.showToast("Số dư không đủ vui lòng nạp thêm.");
                            break;
                        case 4:
                            this.showToast("Số tiền cược không hợp lệ.");
                            break;
                        default:
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
    }

    actBet(event, data) {
        this.bettingDoor = parseInt(data);
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playEffect(this.soundClick, false);
        }
        TaiXiuKuBetNetWorkClient.getInstance().send(new cmd.SendBet(this.referenceId, this.bettingValue, this.bettingDoor, this.remainTime));
    }

    private showResult() {
        if(this.lastScore == 0) {
            return;
        }
        this.isResult = true;
        if (this.lastScore >= 11) {
            this.taiAnimation.active = true;
            if (Utils.checkNumberEven(this.lastScore)) {
                this.chanAnimation.active = true;
            } else {
                this.leAnimation.active = true;
            }
        } else {
            this.xiuAnimation.active = true;
            if (Utils.checkNumberEven(this.lastScore)) {
                this.chanAnimation.active = true;
            } else {
                this.leAnimation.active = true;
            }
        }
        this.actRunTaiXiuAnim();
        this.updateBtnHistories();

    }

    private stopWin() {
        this.taiAnimation.active = false;
        this.taiAnimation.stopAllActions();
        this.taiAnimation.opacity = 255;
        this.xiuAnimation.active = false;
        this.xiuAnimation.stopAllActions();
        this.xiuAnimation.opacity = 255;
        this.chanAnimation.active = false;
        this.chanAnimation.stopAllActions();
        this.chanAnimation.opacity = 255;
        this.leAnimation.active = false;
        this.leAnimation.stopAllActions();
        this.leAnimation.opacity = 255;
    }

    public showToast(message: string) {
        // App.instance.actShowThongBao2(message);
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.y = 500;
        parent.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.2, cc.v2(parent.x, 300)),
                    cc.fadeIn(0.2),
                ),
                cc.delayTime(2),
                cc.spawn(
                    cc.moveTo(0.2, cc.v2(parent.x, 500)),
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
        this.playSoundEffect(this.soundThang);
        this.lblWinCash.node.parent.stopAllActions();
        this.lblWinCash.node.parent.active = true;
        Tween.numberTo(this.lblWinCash, this.lastWinCash, 0.5, (n) => {
            return ("+" + Utils.formatNumber(n))
        });
        this.lblWinCash.node.parent.runAction(
            cc.sequence(
                cc.fadeIn(.25),
                cc.delayTime(3),
                cc.fadeOut(.25),
                cc.callFunc(() => {
                    this.lblWinCash.node.parent.active = false;
                })
            )
        )
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
                if(score >= 11) {
                    if(Utils.checkNumberEven(score)) {
                        this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = this.sprFrameTaiChan;
                    } else {
                        this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = this.sprFrameTaiLe;
                    }
                } else {
                    if(Utils.checkNumberEven(score)) {
                        this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = this.sprFrameXiuChan;
                    } else {
                        this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = this.sprFrameXiuLe;
                    }
                }
                if (i === this.btnHistories.childrenCount - 1) {
                    let phien = this.btnHistories.children[i];
                    phien.active = false;
                    nodeUtils.activeNode(phien);
                }
                this.btnHistories.children[i].active = true;
            } else {
                this.btnHistories.children[i].active = false;
            }
            idx--;
        }
        // this.actShowAnimLastedSession();
    }

    actShowHistory() {
        this.playSoundEffect(this.soundClick);
        let histories = this.histories.slice();
        if (histories.length > this.btnHistories.childrenCount) {
            histories.splice(0, histories.length - this.btnHistories.childrenCount);
        }
        let idx = histories.length - 1;
    }

    actOpenBetHistory() {
        if(this.prefabPopupHistory) {
            let popupHistory = cc.instantiate(this.prefabPopupHistory);
            this.nodePopup.addChild(popupHistory);
            this.toggleVideoLiveStream(false);
            this.isOpenPopup = true;
        }
    }

    actOpenPopupGuide() {
        if(this.prefabGuide) {
            let popupGuide = cc.instantiate(this.prefabGuide);
            this.nodePopup.addChild(popupGuide);
            this.toggleVideoLiveStream(false);
            this.isOpenPopup = true;
        }
    }

    actOpenPopupGraph() {
        if(this.prefabSoiCau) {
            let popupGraph = cc.instantiate(this.prefabSoiCau);
            this.nodePopup.addChild(popupGraph);
            this.toggleVideoLiveStream(false);
            this.isOpenPopup = true;
        }
    }

    actOpenPopupRanking() {
        if(this.prefabRanking) {
            let popupRanking = cc.instantiate(this.prefabRanking);
            this.nodePopup.addChild(popupRanking);
            this.toggleVideoLiveStream(false);
            this.isOpenPopup = true;
        }
    }

    actBackLobby() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        TaiXiuKuBetNetWorkClient.getInstance().send(new cmd.SendUnScribe());
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    actChooseChip(event, data) {
        this.bettingValue = parseInt(data);
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

    toggleNextHistory() {
        if(this.lastSelectSessionIndex >= this.histories.length - 1) {
            this.btnNextSessionDetail.active = false;
            this.btnPrevSessionDetail.active = true;
            return;
        }
        this.lastSelectSessionIndex++;
        this.lastSelectedSessionHistory = this.histories[this.lastSelectSessionIndex];
        this.lastSelectedSessionId = this.lastSelectedSessionHistory.session;
        this.btnPrevSessionDetail.active = true;
        this.loadData();
        if(this.lastSelectSessionIndex >= this.histories.length - 1) {
            this.btnNextSessionDetail.active = false;
        }
    }

    togglePreviousHistory() {
        if(this.lastSelectSessionIndex < 0) {
            this.btnNextSessionDetail.active = true;
            this.btnPrevSessionDetail.active = false;
            return;
        }
        this.lastSelectSessionIndex--;
        this.lastSelectedSessionHistory = this.histories[this.lastSelectSessionIndex];
        this.lastSelectedSessionId = this.lastSelectedSessionHistory.session;
        this.btnNextSessionDetail.active = true;
        this.loadData();
        if(this.lastSelectSessionIndex == 0) {
            this.btnPrevSessionDetail.active = false;
        }
    }

    setupHistoryItem(resultTX) {
        if(!resultTX) {
            return;
        }
        this.lblHistorySessionID.string = `#${resultTX.referenceId.toString()}`;
        this.lblHistorySessionTime.string = resultTX.timestamp.split(" ")[1];
        this.lblHistorySessionDate.string = resultTX.timestamp.split(" ")[0];
        this.dice1.getComponent(cc.Sprite).spriteFrame = this.sprDices[resultTX.dice1 - 1];
        this.dice2.getComponent(cc.Sprite).spriteFrame = this.sprDices[resultTX.dice2 - 1];
        this.dice3.getComponent(cc.Sprite).spriteFrame = this.sprDices[resultTX.dice3 - 1];
        let totalScore = resultTX.dice1 + resultTX.dice2 + resultTX.dice3;
        this.lblTotalScore.string = totalScore.toString();
        this.setupHistoryResult(totalScore);
    }

    setupHistoryResult(totalScore) {
        if(totalScore > 10) {
            this.spriteResult.spriteFrame = this.sfResultTai;
            if(Utils.checkNumberEven(totalScore)) {
                this.spriteNumber.spriteFrame = this.sfNumberEven;
            } else {
                this.spriteNumber.spriteFrame = this.sfNumberOdd;
            }
        } else {
            this.spriteResult.spriteFrame = this.sfResultXiu;
            if(Utils.checkNumberEven(totalScore)) {
                this.spriteNumber.spriteFrame = this.sfNumberEven;
            } else {
                this.spriteNumber.spriteFrame = this.sfNumberOdd;
            }
        }
    }

    private loadData() {
        Http.get(Configs.App.API, { "c": ApiIDEnum.SESSION_DETAIL_LIVE_TX, "rid": this.lastSelectedSessionId, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            if (err != null) return;
            if (res.success && res["resultTX"] !== null) {
                this.setupHistoryItem(res.resultTX);
            }
        });
    }

    protected update(dt: number) {
        if(this.isOpenPopup || App.instance.isMiniGameOpened || App.instance.miniGame.childrenCount > 0) {
            this.toggleVideoLiveStream(false);
        } else {
            this.toggleVideoLiveStream(true);
        }
    }

    playSoundEffect(audioClip) {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playEffect(audioClip, false);
        }
    }
}