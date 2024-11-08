import cmd from "./Slot1.Cmd";
import Tween from "../../../scripts/common/Tween";
import InPacket from "../../../scripts/networks/Network.InPacket";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";
import TrialResults from "./Slot1.TrialResults";
import PopupSelectLine from "./Slot1.PopupSelectLine";
import PopupBonus from "./Slot1.PopupBonus";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import MusicPlayer from "../../../scripts/common/game/MusicPlayer";
import GameUtil from "../../../scripts/common/game/GameUtil";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Slot1ItemsController from "./Slot1.ItemsController";
import RollerControllerB52 from "../../../scripts/common/slot/RollerControllerB52";

const { ccclass, property } = cc._decorator;

@ccclass
export class Slot1Controller extends cc.Component {

    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    lblJackpot: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblWinNow: cc.Label = null;
    @property(cc.Label)
    lblLine: cc.Label = null;
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Label)
    lblTotalBet: cc.Label = null;
    @property(cc.Node)
    toast: cc.Node = null;
    @property(cc.Toggle)
    toggleBoost: cc.Toggle = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Node)
    effectBigWin: cc.Node = null;
    @property(cc.Node)
    effectJackpot: cc.Node = null;
    @property(cc.Node)
    effectBonus: cc.Node = null;
    @property(cc.Node)
    effectFreeSpin = null;
    @property(cc.Label)
    lblFreeSpinTurn = null;
    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property(cc.Prefab)
    popupBonus: cc.Prefab = null;
    @property(cc.Prefab)
    popupGuide: cc.Prefab = null;
    @property(cc.Node)
    popupChooseBet: cc.Node = null;
    @property(cc.Node)
    nodeMainGame = null;

    @property(cc.Label)
    labelRoom100: cc.Label = null;
    @property(cc.Label)
    labelRoom1k: cc.Label = null;
    // @property(cc.Label)
    // labelRoom5k: cc.Label = null;
    @property(cc.Label)
    labelRoom10k: cc.Label = null;
    @property(cc.Node)
    toggleMusic = null;
    @property(cc.Node)
    toggleEffect = null;

    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioSource })
    musicBonus = null;
    @property(cc.AudioSource)
    musicBackground = null;

    @property({ type: cc.AudioSource })
    audioSourceMain = null;
    @property({ type: cc.AudioSource })
    audioSourceBonus = null;
    @property({ type: cc.AudioSource })
    audioSourceChooseBet = null;

    @property(cc.Node)
    header = null;
    @property(cc.Node)
    bottom = null;
    @property(cc.Node)
    spinNode = null;
    @property(cc.ProgressBar)
    autoProgressBar = null;
    @property(cc.SpriteFrame)
    sprQuay = null;
    @property(cc.SpriteFrame)
    sprStop = null;
    @property(cc.Node)
    nodeTrial = null;

    @property(cc.SpriteAtlas)
    gameAtlas = null;
    @property(cc.Node)
    rollerNode = null;

    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    private itemHeight = 0;
    public betIdx = 0;
    private listBet = [100, 1000, 5000, 10000];
    private listBetLabel = ["100", "1K", "5K", "10K"];
    private arrLineSelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    private isSpined = true;
    private _isFreeSpin = false;
    private mapLine = [
        [5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4],
        [10, 11, 12, 13, 14],
        [5, 6, 2, 8, 9],
        [5, 6, 12, 8, 9],
        [0, 1, 7, 3, 4],
        [10, 11, 7, 13, 14],
        [0, 11, 2, 13, 4],
        [10, 1, 12, 3, 14],
        [5, 1, 12, 3, 9],
        [10, 6, 2, 8, 14],
        [0, 6, 12, 8, 4],
        [5, 11, 7, 3, 9],
        [5, 1, 7, 13, 9],
        [10, 6, 7, 8, 14],
        [0, 6, 7, 8, 4],
        [5, 11, 12, 13, 9],
        [5, 1, 2, 3, 9],
        [10, 11, 7, 3, 4],
        [0, 1, 7, 13, 14]
    ];
    private lastSpinRes = null;

    private posYTopBar = 310.5;
    private posYBottomBar = -310.5;
    private remoteMusicBackground = null;
    private _currentBackgroundMusic = null;
    private spinAuto = false;
    private firstTouch = null;
    private isTouchOn = false;
    private freeSpins = 0;
    private _isInFreeSpin = false;
    private moneyExchange = 0;
    private rollerCtrl: RollerControllerB52 = null;
    private isCanStop = false;
    private hasJackPot = false;
    private hasMiniGame = false;
    private hasFreeSpin = false;
    private hasBigWin = false;
    private symbols = [];
    private rewards = [];
    private stopImmediately = false;
    private isPlayingTrial = false;
    private _prefix = "3_";
    private defaultRollingTimer = 5;
    private rollingTimeOut = 5;
    private isRollingTimeOut = false;
    private valueJackpotRoom1 = 0;
    private valueJackpotRoom2 = 0;
    private valueJackpotRoom3 = 0;
    private valueJackpotRoom4 = 0;

    private _moneyJackPotTrial = 50000000;
    private _moneyUserTrial = 50000000;
    private _moneyBetPerRoll = 200000;
    private _lineTrial = 20;
    private _jackPotFee = 0.01;

    static _instance: Slot1Controller = null;

    protected onLoad() {
        cc.audioEngine.stopAll();
        this.rollerCtrl = this.rollerNode.getComponent(RollerControllerB52);
    }

    static getInstance() {
        return Slot1Controller._instance;
    }
    start() {
        let self = this;
        if(Slot1Controller._instance == null) {
            Slot1Controller._instance = this;
        }
        this.scheduleOnce(() => {
            this.posYTopBar = this.header.position.y;
            this.posYBottomBar = this.bottom.position.y;
        });
        this.rollerCtrl.onRollDone = this.onRollDone.bind(this);
        this.rollerCtrl.setGameController(this);

        this.popupChooseBet.active = true;

        SlotNetworkClient.getInstance().addOnClose(() => {
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }, this);

        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.GAME_INFO:
                    {
                        let res = new cmd.ReceiveGameInfo(data);
                        this._isInFreeSpin = res.freeSpin > 0;
                        this.freeSpins = res.freeSpin;
                        let freeSpinNode = this.lblFreeSpinTurn.node.parent;
                        if(this._isInFreeSpin) {
                            freeSpinNode.active = true;
                            this.lblFreeSpinTurn.string = this.freeSpins.toString();
                        } else {
                            freeSpinNode.active = false;
                        }
                        break;
                    }
                case cmd.Code.UPDATE_POT:
                    {
                        let res = new cmd.ReceiveUpdatePot(data);
                        // cc.log("Slot1 Jackpot res : ", JSON.stringify(res));

                        Tween.numberTo(this.labelRoom100, res.valueRoom1, 0.3);
                        Tween.numberTo(this.labelRoom1k, res.valueRoom2, 0.3);
                        // Tween.numberTo(this.labelRoom5k, res.valueRoom3, 0.3);
                        Tween.numberTo(this.labelRoom10k, res.valueRoom4, 0.3);
                        this.valueJackpotRoom1 = res.valueRoom1;
                        this.valueJackpotRoom2 = res.valueRoom2;
                        this.valueJackpotRoom3 = res.valueRoom3;
                        this.valueJackpotRoom4 = res.valueRoom4;

                        if(!this.isPlayingTrial) {
                            switch (this.betIdx) {
                                case 0:
                                    Tween.numberTo(this.lblJackpot, res.valueRoom1, 0.3);
                                    break;
                                case 1:
                                    Tween.numberTo(this.lblJackpot, res.valueRoom2, 0.3);
                                    break;
                                case 2:
                                    Tween.numberTo(this.lblJackpot, res.valueRoom3, 0.3);
                                    break;
                                case 3:
                                    Tween.numberTo(this.lblJackpot, res.valueRoom4, 0.3);
                                    break;
                            }
                        }
                    }
                    break;
                case cmd.Code.UPDATE_RESULT:
                    {
                        let res = new cmd.ReceiveResult(data);
                        this.onSpinResult(res);
                    }
                    break;
            }
        }, this);

        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.toast.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.effectFreeSpin.active = false;
        // this.panelSetting.active = false;
        this.popupSelectLine.onSelectedChanged = (lines) => {
            this.arrLineSelect = lines;
            this.lblLine.string = this.arrLineSelect.length.toString();
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3);
        }
        this.lblTotalBet.string = Utils.formatNumber(this.arrLineSelect.length * this.listBet[this.betIdx]);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });

        this.spinAuto = false;
        this.spinNode.on(cc.Node.EventType.TOUCH_START, (target) => {
            if(self.spinAuto) {
                self.spinAuto = false;
                self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprQuay;
                if(!self.rollerCtrl.rolling) {
                    self.setEnabledAllButtons(true);
                }
            }
            self.firstTouch = target.getLocation();
            self.autoProgressBar.progress = 0;
            self.spinNode.runAction(
                cc.sequence(
                    cc.delayTime(.2),
                    cc.repeat(
                        cc.sequence(
                            cc.delayTime(.05),
                            cc.callFunc(() => {
                                self.autoProgressBar.progress += 1/30;
                                if(self.autoProgressBar.progress >= 1 && !self.spinAuto) {
                                    self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprStop;
                                    if(self.isPlayingTrial) {
                                        self.spinAuto = false;
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                        self.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
                                        self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprQuay;
                                    } else {
                                        self.spinAuto = true;
                                        self.isTouchOn = true;
                                        self.btnRollClick(null);
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                    }
                                }
                            })
                        )
                    ,31)
                )
            )
        });

        this.spinNode.on(cc.Node.EventType.TOUCH_END, (target) => {
            self.isTouchOn = false;
            self.spinNode.stopAllActions();
            self.autoProgressBar.progress = 0;
            if(Configs.Login.Coin < self.arrLineSelect.length * self.listBet[self.betIdx]
                && !self.isPlayingTrial
                && !self.isSpined
                && self.freeSpins == 0) {
                self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprQuay;
            }
        });

        this.spinNode.on(cc.Node.EventType.TOUCH_MOVE, (target) => {

        })
        this.playAudioSourceChooseBet();
    }

    chooseBet(event, bet) {
        this.isPlayingTrial = false;
        var oldIdx = this.betIdx;
        this.betIdx = parseInt(bet);
        if (this.betIdx == this.listBet.length) {
            this.betIdx = 0;
        }
        switch (this.betIdx) {
            case 0:
                this._prefix = "1_";
                break;
            case 1:
                this._prefix = "2_";
                break;
            case 3:
                this._prefix = "3_";
                break;
        }
        if(!this.isPlayingTrial) {
            switch (this.betIdx) {
                case 0:
                    Tween.numberTo(this.lblJackpot, this.valueJackpotRoom1, 0.3);
                    break;
                case 1:
                    Tween.numberTo(this.lblJackpot, this.valueJackpotRoom2, 0.3);
                    break;
                case 2:
                    Tween.numberTo(this.lblJackpot, this.valueJackpotRoom3, 0.3);
                    break;
                case 3:
                    Tween.numberTo(this.lblJackpot, this.valueJackpotRoom4, 0.3);
                    break;
            }
        }
        this.lblBet.string = this.listBetLabel[this.betIdx];
        Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3);
        SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betIdx));
        this.actSelectRoom();
        // if(cc.sys.platform !== cc.sys.MOBILE_BROWSER) {
        //     this.animMove(this.header, this.posYTopBar + 100, this.posYTopBar, 0);
        //     this.animMove(this.bottom, this.posYBottomBar - 100, this.posYBottomBar, 0);
        // }
        this.rollerCtrl.setItemsRandom(true, this._prefix);
        this.isPlayingTrial = false;
        this.nodeTrial.active = false;
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.playAudioSourceMain();
    }

    actLine() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isPlayingTrial) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }

        if(this.rollerCtrl.rolling) {
            this.showToast("không thể rời phòng lúc đang quay.");
            return;
        }
        this.popupSelectLine.show();
    }

    actBack() {
        if(this.rollerCtrl.rolling) {
            this.showToast("không thể rời phòng lúc đang quay.");
            return;
        }

        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        cc.audioEngine.stopAll();
        if (GameConfigManager.getInstance().enableSound) {
            this.playSFXClick();
        }
        // App.instance.loadScene("Lobby");
        this.stopShowLinesWin();
        this.removeAllAnimBack();
        if(cc.sys.platform !== cc.sys.MOBILE_BROWSER) {
            this.animMove(this.header, this.posYTopBar, this.posYTopBar + 100, 0);
            this.animMove(this.bottom, this.posYBottomBar, this.posYBottomBar - 100, 0);
        }
        this.popupChooseBet.active = true;
    }

    actRoomBack() {
        Slot1Controller._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    actHidden() {
        this.showToast("Tính năng đang phát triển.");
    }

    actTrial() {
        this.isPlayingTrial = true;
        if (this.isPlayingTrial) {
            this.setupTrial();
            this.nodeTrial.active = true;
        } else {
            this.nodeTrial.active = false;
            this.lblLine.string = this.arrLineSelect.length.toString();
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3);
        }
        this.betIdx = 3;
        this._prefix = "3_";
        this.rollerCtrl.setItemsRandom(true, this._prefix);
        this.actSelectRoom();
    }

    private stopSpin() {
        for (var i = 0; i < this.columns.childrenCount; i++) {
            var roll = this.columns.children[i];
            roll.stopAllActions();
            roll.setPosition(cc.v2(roll.getPosition().x, 0));
        }
    }

    private setEnabledAllButtons(enabled: boolean) {
        this.btnSpin.interactable = enabled;
        this.btnBack.interactable = enabled;
        this.btnLine.interactable = enabled;
        this.spinNode.getComponent(cc.Button).interactable = enabled;
    }

    private onSpinResult(res: cmd.ReceiveResult | any) {
        var successResult = [0, 1, 2, 3, 5, 6];
        //res.result == 5 //bonus
        //res.result == 0 //khong an
        //res.result == 1 //thang thuong
        //res.result == 2 //thang lon
        //res.result == 3 //no hu
        //res.result == 6 //free spin
        if (successResult.indexOf(res.result) === -1) {
            this.isSpined = true;
            this.toggleBoost.isChecked = false;
            this.toggleBoost.interactable = true;
            if(this.spinAuto) {
                this.btnSpin.node.getComponent(cc.Sprite).spriteFrame = this.sprStop;
            } else {
                this.btnSpin.node.getComponent(cc.Sprite).spriteFrame = this.sprQuay;
            }
            switch (res.result) {
                case 102:
                    this.showToast("Số dư không đủ, vui lòng nạp thêm.");
                    break;
                default:
                    this.showToast("Có lỗi xảy ra, vui lòng thử lại.");
                    break;
            }
            return;
        }
        this.lastSpinRes = res;
        this._isFreeSpin = res.freeSpin > 0;
        this.freeSpins = res.freeSpin;
        this.lblFreeSpinTurn.string = res.freeSpin;
        if (!this.isPlayingTrial && !this._isFreeSpin) {
            let curMoney = Configs.Login.Coin - this.arrLineSelect.length * this.listBet[this.betIdx];
            Tween.numberTo(this.lblCoin, curMoney, 0.3);
        } else {
            this.playTrialResult(res);
        }

        if(!this.isPlayingTrial) {
            Configs.Login.Coin = res.currentMoney;
        }

        let matrix = res.matrix.split(",");
        this.showResult(res.prize,  matrix.map(Number), this.freeSpins);
    }

    private spined() {
        this.hasFreeSpin = false;
        this.hasMiniGame = false;
        this.hasJackPot = false;
        this.hasBigWin = false;
        switch (this.lastSpinRes.result) {
            case 0://k an
                break;
            case 1:// thang thuong
                break;
            case 2:// thang lon
                this.hasBigWin = true;
                break;
            case 3://jackpot
                this.hasJackPot = true;
                break;
            case 6://freespin
                this.hasFreeSpin = true;
                break;
            case 5://bonus
                this.hasMiniGame = true;
                break;
        }
    }

    private stopAllEffects() {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = false;
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = false;
        this.effectBonus.stopAllActions();
        this.effectBonus.active = false;
        this.effectFreeSpin.stopAllActions();
        this.effectFreeSpin.active = false;
    }

    private showLineWins() {
        this.isSpined = true;
        if(!this.spinAuto) {
            this.setEnabledAllButtons(true);
        }
        Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
        if (!this.isPlayingTrial) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        this.linesWin.stopAllActions();
        let linesWin = this.lastSpinRes.linesWin.split(",");
        linesWin = Utils.removeDups(linesWin);
        let matrix = this.lastSpinRes.matrix.split(",");
        let linesWinChildren = this.linesWin.children;
        let rolls = this.columns.children;
        let actions = [];
        for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;;
        }
        if (this.lastSpinRes.prize > 0) {
            actions.push(cc.delayTime(1.5));
            actions.push(cc.callFunc(function () {
                for (let i = 0; i < linesWinChildren.length; i++) {
                    linesWinChildren[i].active = false;
                }
            }));
            actions.push(cc.delayTime(0.3));
            for (let i = 0; i < linesWin.length; i++) {
                let lineIdx = parseInt(linesWin[i]) - 1;
                let line = linesWinChildren[lineIdx];
                actions.push(cc.callFunc(() => {
                    line.active = true;
                }));
                if(!this.spinAuto) {
                    actions.push(
                        cc.callFunc(() => {
                            let mLine = this.mapLine[lineIdx];
                            let countWin = {};
                            let wildId = "1";
                            let itemCount3Win = ["0", "1", "2", "3", "4"];
                            let itemCount4Win = ["6", "5"];
                            for (let i = 0; i < mLine.length; i++) {
                                let itemId = matrix[mLine[i]];
                                if (countWin.hasOwnProperty(itemId)) {
                                    countWin[itemId]++;
                                } else {
                                    countWin[itemId] = 1;
                                }
                            }
                            let itemIdTemp = [];
                            if (countWin.hasOwnProperty(wildId)) {
                                itemIdTemp.push(wildId);
                                if (countWin[wildId] < 5) {
                                    for (var k in countWin) {
                                        if (k !== wildId) {
                                            countWin[k] += countWin[wildId];
                                        }
                                    }
                                }
                            }
                            // console.log(countWin);
                            for (let k in countWin) {
                                if (itemCount3Win.indexOf(k) >= 0 && countWin[k] >= 3) {
                                    itemIdTemp.push(k);
                                } else if (itemCount4Win.indexOf(k) >= 0 && countWin[k] >= 4) {
                                    itemIdTemp.push(k);
                                }
                            }
                            // console.log(itemIdTemp);
                            for (let i = 0; i < mLine.length; i++) {
                                let itemId = mLine[i];
                                let itemIdInMatrix = matrix[mLine[i]];
                                let itemIdNumber = parseInt(itemId.toString());
                                let itemRow = parseInt((itemIdNumber / 5).toString());
                                rolls[i].children[2 - itemRow].stopAllActions();
                                rolls[i].children[2 - itemRow].getComponent(Slot1ItemsController).showAnimItem(1.5, true, false, this._prefix);
                            }
                        })
                    );
                    actions.push(cc.delayTime(1.5));
                    actions.push(cc.callFunc(() => {
                        line.active = false;
                        this.stopAllItemEffect();
                    }));
                    actions.push(cc.delayTime(0.1));
                } else {
                    actions.push(cc.callFunc(function () {
                        for (let i = 0; i < linesWinChildren.length; i++) {
                            linesWinChildren[i].active = false;
                        }
                    }));
                }
            }
        }
        if (actions.length == 0) {
            actions.push(cc.callFunc(() => {
                //fixed call cc.sequence.apply
            }))
        }
        actions.push(cc.callFunc(() => {

        }));
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }

    private stopShowLinesWin() {
        this.linesWin.stopAllActions();
        for (var i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private showEffectBigWin(cash: number, cb: () => void) {
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = true;
        this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "bigwin", false);
        let label = this.effectBigWin.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectBigWin.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(() => {
                label.string = "";
                label.node.active = true;
                Tween.numberTo(label, cash, 1);
            }),
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectBigWin.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showEffectJackpot(cash: number, cb: () => void = null) {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = true;
        this.effectJackpot.getComponentInChildren(sp.Skeleton).setAnimation(0, "jackpot", false);
        let label = this.effectJackpot.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectJackpot.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                label.string = "";
                label.node.active = true;
                Tween.numberTo(label, cash, 1);
            }),
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectJackpot.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showEffectBonus(cb: () => void) {
        this.effectBonus.stopAllActions();
        this.effectBonus.active = true;
        this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "bonus", false);
        this.scheduleOnce(() => {
            this.effectBonus.active = false;
            if(cb != null) cb();
        }, 2.9);
    }

    private stopAllItemEffect() {
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let children = this.columns.children[i].children;
            children[0].stopAllActions();
            children[1].stopAllActions();
            children[2].stopAllActions();

            children[0].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
            children[1].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
            children[2].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
        }
    }

    private showToast(msg: string) {
        this.toast.getComponentInChildren(cc.Label).string = msg;
        this.toast.stopAllActions();
        this.toast.active = true;
        this.toast.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            this.toast.active = false;
        })));
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    showLineClick(event, data) {
        let selectedLineIndex = parseInt(data) - 1;
        let selectedLine = this.linesWin.children[selectedLineIndex];
        this.scheduleOnce(() => {
            selectedLine.active = true;
            selectedLine.opacity = 0;
            selectedLine.stopAllActions();
            selectedLine.runAction(
                cc.sequence(
                    cc.fadeIn(0.5),
                    cc.delayTime(2),
                    cc.fadeOut(0.5),
                    cc.delayTime(0.5),
                    cc.callFunc(function() {
                        selectedLine.opacity = 255;
                        selectedLine.active = false;
                    })
                )
            )
        }, 0);
    }

    actSelectRoom() {
        this.popupChooseBet.active = false;
        if(cc.sys.platform !== cc.sys.MOBILE_BROWSER) {
            this.animMove(this.header, this.posYTopBar + 100, this.posYTopBar, 0);
            this.animMove(this.bottom, this.posYBottomBar - 100, this.posYBottomBar, 0);
        }
    }

    onRollDone() {
        this.isCanStop = false;
        if(!this.spinAuto) {
            this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprQuay;
        }
        if(MusicPlayer.getInstance().loopEffectId !== -1) {
            cc.audioEngine.stopEffect(MusicPlayer.getInstance().loopEffectId);
        }
        if(cc.sys.isBrowser) {
            cc.audioEngine.stopAllEffects();
        }

        let delayTime = 0.3;
        if(this.toggleBoost.isChecked) {
            delayTime = .5;
        } else {
            delayTime = 1.3;
        }
        this.unschedule(this.checkTimeOutSpin);
        this.rollerNode.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => {
                    this.checkAutoSpin();
                })
            )
        )
        if(!this.isRollingTimeOut) {
            this.checkJackPot();
            this.checkBigWin();
            this.checkFreeSpinLabel();
            this.checkMiniGame();
            this.scheduleOnce(() => {
                this.showLineWins();
            }, .1);
            if(this.moneyExchange > 0) {
                this.playSFXStopRoll();
            }
        }
        if(!this.spinAuto) {
            this.setEnabledAllButtons(true);
        }
    }

    btnRollClick(t) {
        if(this.rollerCtrl.rolling) {
            if(t != null) {
                if(!this.isTouchOn) {
                    this.spinAuto = false;
                }
                this.stopImmediately = true;
                if(!this.rollerCtrl.stopping && this.toggleBoost.isChecked) {
                    this.rollerCtrl.stopImmediately();
                }
            } else {
                if(this.stopImmediately) {
                    this.rollerCtrl.stopImmediately();
                } else {
                    this.rollerCtrl.stop(this.toggleBoost.isChecked);
                }
            }
        } else {
            if(Configs.Login.Coin < this.arrLineSelect.length * this.listBet[this.betIdx]
                && !this.isPlayingTrial
                && !this.rollerCtrl.rolling
                && this.freeSpins === 0)
            {
                this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprQuay;
                this.autoProgressBar.progress = 0;
                this.spinNode.getComponent(cc.Button).interactable = true;
                this.spinAuto = false;
                return this.showToast("Vui lòng nạp thêm tiền");
            }

            if(this.hasMiniGame || this.hasBigWin || this.hasFreeSpin) {
                return;
            }

            this.unscheduleAllCallbacks();
            this.isCanStop = false;
            this.playSFXRoll();
            this.resetAllData();
            this.stopShowLinesWin();
            this.rollerCtrl.hideAllAnim();
            this.rollerCtrl.roll(this.toggleBoost.isChecked);
            this.rollingTimeOut = this.defaultRollingTimer;
            this.isRollingTimeOut = false;
            this.schedule(this.checkTimeOutSpin, 1, cc.macro.REPEAT_FOREVER, 0);
            this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprStop;
            this.setEnabledAllButtons(false);
            if (!this.isPlayingTrial) {
                SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.listBet[this.betIdx], this.arrLineSelect.toString()));
            } else {
                var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
                this.scheduleOnce(() => {
                    this.onSpinResult(TrialResults.results[rIdx]);
                }, 0.2);
            }
        }
    }

    resetAllData() {
        this.hasJackPot = false;
        this.hasMiniGame = false;
        this.hasFreeSpin = false;
        this.rewards = [];
        this.symbols = [];
        this.stopImmediately = false;
    }

    showResult (moneyExchange, symbolsMatrix, freeSpinCount) {
        this.spined();
        this.moneyExchange = moneyExchange;
        this.freeSpins = freeSpinCount;
        this.symbols = symbolsMatrix;
        this.rollerCtrl.setResult(symbolsMatrix);
        if(this.rollerCtrl.rolling) {
            this.btnRollClick(null);
        }
    }

    checkWinAndShowResult() {

    }

    checkAutoSpin() {
        !this.spinAuto || this.isMiniGame() || this.hasFreeSpin || this.hasBigWin || this.hasJackPot || this.btnRollClick(null);
    }

    checkBigWin() {
        if(this.hasBigWin) {
            this.effectBigWin.stopAllActions();
            this.effectBigWin.active = true;
            this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "bigwin", false);
            let labelNode = this.effectBigWin.children[1];
            labelNode.getComponent(cc.Label).string = "0";
            GameUtil.runAnimationMoneyWithColom(labelNode.getComponent(cc.Label), 0, this.moneyExchange, 1);
            cc.audioEngine.play(this.soundBigWin, false, 1);
            this.effectBigWin.runAction(
                cc.sequence(
                    cc.fadeIn(.2),
                    cc.delayTime(1),
                    cc.callFunc(() => {
                        labelNode.stopAllActions();
                        labelNode.runAction(
                            cc.sequence(
                                cc.scaleTo(.3, 1),
                                cc.callFunc(() => {
                                    this.hasBigWin = false;
                                })
                            )
                        )
                    }),
                    cc.delayTime(1.8),
                    cc.fadeOut(.3),
                    cc.callFunc(() => {
                        this.checkAutoSpin();
                        this.effectBigWin.active = false;
                    })
                )
            )
        } else {
            this.effectBigWin.active = false;
        }
    }

    checkFreeSpinLabel() {
        let freeSpinNode = this.lblFreeSpinTurn.node.parent;
        let freeSpinLabel = this.lblFreeSpinTurn;
        let freeSpinAnimNode = this.effectFreeSpin;
        if(this.freeSpins <= 0) {
            freeSpinNode.active = false;
            freeSpinAnimNode.active = false;
            freeSpinLabel.string = this.freeSpins.toString();
            this._isInFreeSpin = false;
        } else {
            this._isInFreeSpin = true;
            freeSpinNode.active = true;
            freeSpinLabel.string = this.freeSpins.toString();
            freeSpinAnimNode.active = false;
            if(this.hasFreeSpin) {
                this.playSFXFreeSpin();
                freeSpinAnimNode.active = true;
                this.hasFreeSpin = false;
                this.hasBigWin = false;
                freeSpinAnimNode.stopAllActions();
                freeSpinAnimNode.getComponentInChildren(sp.Skeleton).setAnimation(0, "free", false);
                freeSpinAnimNode.runAction(
                    cc.sequence(
                        cc.fadeIn(.3),
                        cc.delayTime(1.5),
                        cc.callFunc(() => {
                            this.hasBigWin = false;
                        }),
                        cc.fadeOut(1),
                        cc.callFunc(() => {
                            this.checkAutoSpin();
                            freeSpinAnimNode.active = false;
                        })
                    )
                )
            }
        }
    }
    isMiniGame() {
        return this.hasMiniGame && this.lastSpinRes.haiSao != "";
    }

    checkMiniGame() {
        if(this.isMiniGame()) {
            this.playSFXBonus();
            this.showEffectBonus(() => {
                if(GameConfigManager.getInstance().enableBackgroundMusic) {
                    this.playAudioSourceBonus();
                }
                let popupBonus = cc.instantiate(this.popupBonus);
                this.nodeMainGame.addChild(popupBonus);
                popupBonus.getComponent(PopupBonus).showBonus(this.isPlayingTrial ? 100 : this.listBet[this.betIdx],this.lastSpinRes.haiSao, () => {
                    this.hasMiniGame = false;
                    if(GameConfigManager.getInstance().enableBackgroundMusic) {
                        this.playAudioSourceMain();
                    }
                    this.checkAutoSpin();
                });
            });
        }
    }

    checkJackPot() {
        let lblJackpot = this.effectJackpot.children[1];
        let jackPotAnimation = this.effectJackpot.children[0];
        if(this.hasJackPot) {
            this.effectJackpot.active = true;
            this.effectJackpot.stopAllActions();
            lblJackpot.scale = 0;
            lblJackpot.opacity = 0;
            this.playSFXNoHu();
            jackPotAnimation.getComponent(sp.Skeleton).setAnimation(0, "jackpot", false);
            GameUtil.runAnimationMoneyWithColom(lblJackpot.getComponent(cc.Label), 0, this.moneyExchange, .7);
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.callFunc(() => {
                        lblJackpot.stopAllActions();
                        lblJackpot.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.scaleTo(1,1),
                                    cc.fadeIn(1)
                                ),
                                cc.delayTime(5),
                                cc.callFunc(() => {
                                    this.hasJackPot = false;
                                    this.effectJackpot.active = false;
                                    this.checkAutoSpin();
                                })
                            )
                        )
                    })
                )
            )
        } else {
            this.effectJackpot.active = false;
        }
    }

    playSFXRoll() {
        MusicPlayer.getInstance().playEffectLoop("Sounds/lmht/roll");
    }

    playSFXFreeSpin() {
        MusicPlayer.getInstance().playEffect("Sounds/lmht/freespin");
    }

    playSFXBonus() {
        MusicPlayer.getInstance().playEffect("Sounds/lmht/bonus");
    }

    playSFXStopRoll() {
        MusicPlayer.getInstance().playEffect("Sounds/lmht/roll_stop");
    }

    playSFXClick() {
        cc.audioEngine.playEffect(this.soundClick, false);
    }

    playSFXNoHu() {
        MusicPlayer.getInstance().playEffect("Sounds/lmht/jackpot");
    }

    playAudioSourceMain() {
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.audioSourceMain.play();
        }
    }

    playAudioSourceBonus() {
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.audioSourceBonus.play();
        }
    }

    playAudioSourceChooseBet() {
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.audioSourceChooseBet.play();
        }
    }

    muteAllAudioSource() {
        this.audioSourceBonus.stop();
        this.audioSourceMain.stop();
        this.audioSourceChooseBet.stop();
    }

    removeAllAnimBack() {
        this.rollerCtrl.hideAllAnim();
        this.effectBigWin.active = false;
        this.effectJackpot.active = false;
        this.effectFreeSpin.active = false;
        this.hasBigWin = false;
        this.hasFreeSpin = false;
        this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprQuay;
    }

    animMove(node, oldY, newY, delayTime) {
        node.stopAllActions();
        node.y = oldY;
        node.opacity = 0;
        node.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.spawn(
                    cc.moveTo(.25, cc.v2(node.x, newY)),
                    cc.fadeIn(.25),
                )
            )
        )
    }


    checkTimeOutSpin() {
        this.rollingTimeOut--;
        if(this.rollingTimeOut == 0) {
            App.instance.actShowThongBao("Đường truyền có vấn đề, vui lòng tải lại");
            this.isRollingTimeOut = true;
            this.rollerCtrl.stop();
        }
    }

    onClickJackpot() {
        if(!this.hasJackPot || this.lblJackpot.node.getNumberOfRunningActions() <= 0) {
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeOut(.5),
                    cc.callFunc(() => {
                        this.effectJackpot.active = false;
                        this.lblJackpot.node.stopAllActions();
                        this.hasJackPot = false;
                        this.checkAutoSpin();
                    })
                )
            )
        }
    }

    actSoundClick() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    actOpenPopupGuide() {
        this.actSoundClick();
        let popupGuide = cc.instantiate(this.popupGuide);
        this.nodeMainGame.addChild(popupGuide);
        let container = popupGuide.getChildByName('Container');
        container.scale = 0;
        container.runAction(
            cc.sequence(
                cc.scaleTo(0.15, 1.1),
                cc.scaleTo(0.1, 1)
            )
        );
    }

    // protected onEnable() {
    //     let popupBonus = cc.instantiate(this.popupBonus);
    //     this.nodeMainGame.addChild(popupBonus);
    //     popupBonus.getComponent(PopupBonus).showBonus(1000, "0,1,1,1,1,1,1,2,2,3,4,1", () => {
    //     });
    // }

    setupTrial() {
        this.lblLine.string = this._lineTrial.toString();
        this.lblBet.string = "10K";
        Tween.numberTo(this.lblTotalBet, 200000, 0.3);
        Tween.numberTo(this.lblJackpot, this._moneyJackPotTrial, .3);
        Tween.numberTo(this.lblCoin, this._moneyUserTrial, .3);
    }

    playTrialResult(res: cmd.ReceiveResult | any) {
        this._moneyUserTrial += res.prize;
        this._moneyJackPotTrial += this._moneyBetPerRoll * this._jackPotFee;
        Tween.numberTo(this.lblJackpot, this._moneyJackPotTrial, .3);
        Tween.numberTo(this.lblCoin, this._moneyUserTrial, .3);
    }
}
export default Slot1Controller;