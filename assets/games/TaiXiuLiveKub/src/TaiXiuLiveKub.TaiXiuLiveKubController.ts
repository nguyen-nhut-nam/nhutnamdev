import cmd from "./TaiXiuLiveKub.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import Utils from "../../../scripts/common/Utils";
import Tween from "../../../scripts/common/Tween";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import AudioManager from "../../../scripts/common/Common.AudioManager";
import TaiXiuKuBetNetWorkClient from "../../../scripts/networks/TaiXiuKuBetNetWorkClient";
import nodeUtils from "../../../scripts/common/NodeUtils";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

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
    tai: cc.Node = null;
    @property(cc.Node)
    xiu: cc.Node = null;
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
    @property(cc.Label)
    lblMyCoin = null;
    @property(cc.Sprite)
    sprAvatar = null;
    @property(cc.Label)
    lblNickName = null;

    public isBetting = false;
    public isResult = false;
    private remainTime = 0;
    private canBet = true;
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
    }

    actRunTaiXiuAnim() {
        const timeDelay = 0.1;
        // cc.tween(this.taiAnimation)
        //     .repeatForever(
        //         cc.tween()
        //             .delay(timeDelay)
        //             .to(0.2, {scale: 0.9})
        //             .delay(timeDelay)
        //             .to(0.2, {scale: 1.1})
        //     )
        //     .start();
        // cc.tween(this.xiuAnimation)
        //     .repeatForever(
        //         cc.tween()
        //             .delay(timeDelay)
        //             .to(0.2, {scale: 0.9})
        //             .delay(timeDelay)
        //             .to(0.2, {scale: 1.1})
        //     )
        //     .start();
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
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GAME_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceiveGameInfo(data);
                    this.webViewLiveStream.url = res.streamURL;
                    this.stopWin();
                    if (res.bettingState) {
                        // dang trong thời gian đặt cược
                        this.isResult = false;
                        this.isBetting = true;

                        this.lblRemainTime.string = res.remainTime.toString();
                        Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                        Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                        Tween.numberTo(this.lblTotalBetChan, res.potChan, 0.3);
                        Tween.numberTo(this.lblTotalBetLe, res.potLe, 0.3);
                        this.stopWin();
                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 1 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.showToast("Trả tiền cân cửa");
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
                        this.actRunTaiXiuAnim();
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
                    console.log(res);
                    this.lblRemainTime.string = res.remainTime.toString();
                    if (res.bettingState) {
                        this.isBetting = true;
                        this.isResult = false;
                        this.stopWin();
                        this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                        this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                        this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                        this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
                        if (res.remainTime < 5) {
                            console.log("this.wasCalled 2 -- ", this.wasCalled);
                            if (!this.wasCalled) {
                                this.showToast("Trả tiền cân cửa");
                            }
                            this.wasCalled = true;
                            this.lblTotalBetTai.node.stopAllActions();
                            this.lblTotalBetXiu.node.stopAllActions();
                        } else {
                            this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                            this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                            this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                            this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
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
                        this.wasCalled = false;
                        this.lblTotalBetTai.string = Utils.formatNumber(res.potTai);
                        this.lblTotalBetXiu.string = Utils.formatNumber(res.potXiu);
                        this.lblTotalBetChan.string = Utils.formatNumber(res.potChan);
                        this.lblTotalBetLe.string = Utils.formatNumber(res.potLe);
                    }
                    break;
                }
                case cmd.Code.DICES_RESULT: {
                    let res = new cmd.ReceiveDicesResult(data);
                    console.log(res);
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
                    break;
                }
                case cmd.Code.NEW_GAME: {
                    this.showToast("Bắt Đầu Phiên Mới");
                    // this.noHu.active = false;
                    let res = new cmd.ReceiveNewGame(data);
                    AudioManager.getInstance().playEffect(this.soundPhienMoi);

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
                    // this.bettingDoor = BetDoor.None;
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
                    this.updateBtnHistories();
                    break;
                }
                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    console.log(res);
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
                            AudioManager.getInstance().playEffect(this.soundDatCuoc);
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

    actClose() {

    }

    actBetTai() {
        AudioManager.getInstance().playEffect(this.soundClick);
        // if (!this.isBetting) {
        //     this.showToast("Chưa đến thời gian đặt cược.");
        //     return;
        // }
        if (this.bettingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.bettedXiu > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
    }

    actBetXiu() {
        AudioManager.getInstance().playEffect(this.soundClick);
        // if (!this.isBetting) {
        //     this.showToast("Chưa đến thời gian đặt cược.");
        //     return;
        // }
        if (this.bettingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.bettedTai > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
    }
    
    actBet(event, data) {
        this.bettingDoor = parseInt(data);
        AudioManager.getInstance().playEffect(this.soundClick);
        console.log(this.bettingDoor);
        TaiXiuKuBetNetWorkClient.getInstance().send(new cmd.SendBet(this.referenceId, this.bettingValue, this.bettingDoor, this.remainTime));
    }

    actAgree() {
        AudioManager.getInstance().playEffect(this.soundClick);
        if (this.bettingValue >= 0 || !this.canBet) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        TaiXiuKuBetNetWorkClient.getInstance().send(new cmd.SendBet(this.referenceId, this.bettingValue, this.bettingDoor == BetDoor.Tai ? 1 : 0, this.remainTime));
        if(this.bettingValue <= 0) {
            return;
        }
        this.canBet = false;
        this.scheduleOnce(function () {
            this.canBet = true;
        }, 1);
    }

    actCancel() {
        AudioManager.getInstance().playEffect(this.soundClick);
    }

    private showResult() {
        //console.error("showResult");
        this.isResult = true;
        cc.audioEngine.play(this.soundKetQua, false, 1);
        this.actRunTaiXiuAnim();
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
        this.updateBtnHistories();
    }

    private stopWin() {
        // cc.tween(this.taiAnimation).stop();
        // cc.tween(this.xiuAnimation).stop();
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
        AudioManager.getInstance().playEffect(this.soundThang);
        this.lblWinCash.node.stopAllActions();
        this.lblWinCash.node.active = true;
        Tween.numberTo(this.lblWinCash, this.lastWinCash, 0.5, (n) => {
            return ("+" + Utils.formatNumber(n))
        });

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
        AudioManager.getInstance().playEffect(this.soundClick);
        let histories = this.histories.slice();
        if (histories.length > this.btnHistories.childrenCount) {
            histories.splice(0, histories.length - this.btnHistories.childrenCount);
        }
        let idx = histories.length - 1;
    }

    actSoundClick() {
        AudioManager.getInstance().playEffect(this.soundClick);
    }

    actOpenBetHistory() {
        if(this.prefabPopupHistory) {
            let popupHistory = cc.instantiate(this.prefabPopupHistory);
            this.nodePopup.addChild(popupHistory);
            this.toggleVideoLiveStream(false);
        }
    }

    actOpenPopupGuide() {
        if(this.prefabGuide) {
            let popupGuide = cc.instantiate(this.prefabGuide);
            this.nodePopup.addChild(popupGuide);
            this.toggleVideoLiveStream(false);
        }
    }

    actOpenPopupGraph() {
        if(this.prefabSoiCau) {
            let popupGraph = cc.instantiate(this.prefabSoiCau);
            this.nodePopup.addChild(popupGraph);
            this.toggleVideoLiveStream(false);
        }
    }

    actOpenPopupRanking() {
        if(this.prefabRanking) {
            let popupRanking = cc.instantiate(this.prefabRanking);
            this.nodePopup.addChild(popupRanking);
            this.toggleVideoLiveStream(false);
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
         return isUsed ? this.webViewLiveStream.node.y = 0 : this.webViewLiveStream.node.y = 5000;
    }
}