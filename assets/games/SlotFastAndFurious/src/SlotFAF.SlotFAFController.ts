import Utils from "../../../scripts/common/Utils";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "./SlotFAF.Cmd";
import Tween from "../../../scripts/common/Tween";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import Configs from "../../../scripts/common/Configs";
import PopupSelectLine from "./SlotFAF.PopupSelectLine";
import PopupBonus from "./SlotFAF.PopupBonus";
import TrialResults from "./SlotFAF.TrialResults";
import nodeUtils from "../../../scripts/common/NodeUtils";
import PopupSetting from "./SlotFAF.PopupSetting";
import MusicPlayer from "../../../scripts/common/game/MusicPlayer";
import GameUtil from "../../../scripts/common/game/GameUtil";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import SlotFAFItemsController from "./SlotFAF.ItemsController";
import RollerControllerB52 from "../../../scripts/common/slot/RollerControllerB52";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotFAFSlotFAFController extends cc.Component {
    @property(cc.SpriteAtlas)
    atlasSymbols = null;

    @property([cc.Node])
    nodeMain = [];
    @property([cc.Node])
    nodeFreeSpin = [];

    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Node)
    iconWildColumns: cc.Node = null;

    @property(cc.Label)
    lblJackpot: cc.Label = null;

    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Label)
    lblLine: cc.Label = null;
    @property(cc.Label)
    lblTotalBet: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblWinNow: cc.Label = null;
    @property(cc.Label)
    lblFreeSpinCount: cc.Label = null;

    @property(cc.Toggle)
    toggleBoost: cc.Toggle = null;
    
    @property(cc.Button)
    btnSetting: cc.Button = null;
    
    @property(cc.Button)
    btnHelp: cc.Button = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Node)
    spinNode = null;
    @property(sp.Skeleton)
    spSpin = null;
    @property(sp.Skeleton)
    spSpinOutSide = null;
    @property(cc.ProgressBar)
    autoProgressBar = null;

    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Node)
    toast: cc.Node = null;
    @property(cc.Node)
    effectBigWin: cc.Node = null;
    @property(cc.Node)
    effectJackpot: cc.Node = null;
    @property(cc.Node)
    effectBonus: cc.Node = null;
    @property(cc.Node)
    effectFreeSpin = null;

    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property(cc.Prefab)
    popupBonus: cc.Prefab = null;
    @property(cc.Prefab)
    popupGuide: cc.Prefab = null;
    @property(cc.Prefab)
    popupSetting = null;

    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpotStart: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpotLoop = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundCar = null;
    @property({ type: cc.AudioClip })
    soundBonusOver = null;
    @property({ type: cc.AudioClip })
    soundOpenTreasure = null;
    @property({ type: cc.AudioClip })
    soundFinishedNoti = null;
    @property({ type: cc.AudioSource })
    audioSourceMain = null;
    @property({ type: cc.AudioSource })
    audioSourceBonus = null;
    @property({ type: cc.AudioSource })
    audioSourceChooseRoom = null;

    @property(cc.Node)
    nodeChooseRoom = null;
    @property(cc.Node)
    nodeMainGame = null;
    @property(cc.Node)
    header = null;
    @property(cc.Node)
    footer = null;
    @property(cc.Node)
    nodeTrial = null;

    @property(cc.Label)
    lblJP100 = null;
    @property(cc.Label)
    lblJP1K = null;
    @property(cc.Label)
    lblJP10K = null;

    @property(cc.SpriteAtlas)
    gameAtlas = null;
    @property([cc.Node])
    expWild = [];
    @property(cc.Node)
    rollerNode = null;

    public static _instance: SlotFAFSlotFAFController = null;
    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    private itemHeight = 0;
    public betIdx = 0;
    private listBet = [100, 1000, 10000];
    private listBetLabel = ["100", "1K", "10K"];
    private arrLineSelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    private linesSelected = 25;
    private isSpined = true;
    private readonly wildItemId = 2;
    private readonly mapLine = [
        [5, 6, 7, 8, 9],//1
        [0, 1, 2, 3, 4],//2
        [10, 11, 12, 13, 14],//3
        [10, 6, 2, 8, 14],//4
        [0, 6, 12, 8, 4],//5
        [5, 1, 2, 3, 9],//6
        [5, 11, 12, 13, 9],//7
        [0, 1, 7, 13, 14],//8
        [10, 11, 7, 3, 4],//9
        [5, 11, 7, 3, 9],//10
        [5, 1, 7, 13, 9],//11
        [0, 6, 7, 8, 4],//12
        [10, 6, 7, 8, 14],//13
        [0, 6, 2, 8, 4],//14
        [10, 6, 12, 8, 14],//15
        [5, 6, 2, 8, 9],//16
        [5, 6, 12, 8, 9],//17
        [0, 1, 12, 3, 4],//18
        [10, 11, 2, 13, 14],//19
        [0, 11, 12, 13, 4],//20
        [10, 1, 2, 3, 14],//21
        [5, 1, 12, 3, 9],//22
        [5, 11, 2, 13, 9],//23
        [0, 11, 2, 13, 4],//24
        [10, 1, 12, 3, 14]//25
    ];
    private lastSpinRes: cmd.ReceivePlay = null;
    private columnsWild = [];

    private musicSlotState = 0;
    private soundSlotState = 0;
    private remoteMusicBackground = null;
    private spinAuto = false;
    private firstTouch = null;
    private isPlayingTrial = false;
    private isTouchOn = false;

    private posyTopBar = 310.5;
    private posyBottomBar = -310.5;
    private _prefix = "3_";
    private ItemSpriteFramePrefix = 'symbol_';
    private ItemSpriteBlurFramePrefix = 'symbol_blur_';
    private oldFreeSpinCount = 0;
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
    private freeSpins = 0;
    private defaultRollingTimer = 5;
    private rollingTimeOut = 5;
    private isRollingTimeOut = false;
    private _lastPrefix = "1_";

    private _moneyJackPotTrial = 50000000;
    private _moneyUserTrial = 50000000;
    private _moneyBetPerRoll = 250000;
    private _lineTrial = 25;
    private _jackPotFee = 0.01;

    protected onLoad() {
        cc.audioEngine.stopAll();
        this.rollerCtrl = this.rollerNode.getComponent(RollerControllerB52);
    }

    start() {
        if(SlotFAFSlotFAFController._instance === null) {
            SlotFAFSlotFAFController._instance = this;
        }
        this.resetGameRoom(true);
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.playAudioSourceChooseBet();
        }
        this.rollerCtrl.onRollDone = this.onRollDone.bind(this);
        this.rollerCtrl.setGameController(this);

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
                        this.lblFreeSpinCount.node.parent.active = false;
                        this.lblFreeSpinCount.node.parent.scale = 0;
                        // this._prefix = "0_";
                        if(this._isInFreeSpin) {
                            this.lblFreeSpinCount.node.parent.active = true;
                            this.lblFreeSpinCount.node.parent.scale = 1;
                            this.lblFreeSpinCount.string = res.freeSpin.toString();
                            if(this._isInFreeSpin) {
                                this.nodeFreeSpin.forEach(child => child.active = false);
                                this.nodeMain.forEach(child => child.active = true);
                                this.rollerCtrl.setResultFreeSpin(this._prefix);
                            }
                        }
                    }
                    break;

                case cmd.Code.UPDATE_POT:
                    {
                        let res = new cmd.ReceiveUpdatePot(data);
                        Tween.numberTo(this.lblJP100, res.value100, 0.3);
                        Tween.numberTo(this.lblJP1K, res.value1000, 0.3);
                        Tween.numberTo(this.lblJP10K, res.value10000, 0.3);

                        switch (this.betIdx) {
                            case 0:
                                Tween.numberTo(this.lblJackpot, res.value100, 0.3);
                                break;
                            case 1:
                                Tween.numberTo(this.lblJackpot, res.value1000, 0.3);
                                break;
                            case 2:
                                Tween.numberTo(this.lblJackpot, res.value10000, 0.3);
                                break;
                        }
                    }
                    break;
                case cmd.Code.PLAY:
                    {
                        let res = new cmd.ReceivePlay(data);
                        this.onSpinResult(res);
                    }
                    break;
            }
        }, this);

        console.log("SlotFAFController started");

        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.toast.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.popupSelectLine.onSelectedChanged = (lines) => {
            this.arrLineSelect = lines;
            this.lblLine.string = this.arrLineSelect.length.toString();
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
        this.lblLine.string = this.arrLineSelect.length.toString();
        this.lblTotalBet.string = this.moneyToK(this.arrLineSelect.length * this.listBet[this.betIdx]).toString();


        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });
        console.log("SlotFAFController started");

        let self = this;
        this.spinAuto = false;
        this.spinNode.on(cc.Node.EventType.TOUCH_START, touch => {
            if(self.spinAuto) {
                self.spinAuto = false;
                self.spSpin.setAnimation(0, 'MainScreen_Spin', true);
                self.spSpin.timeScale = .5;
                self.spSpinOutSide.timeScale = .5;
            }
            self.firstTouch = touch.getLocation();
            self.autoProgressBar.progress = 0;
            self.spinNode.runAction(
                cc.sequence(
                    cc.delayTime(.2),
                    cc.repeat(
                        cc.sequence(
                            cc.delayTime(.05),
                            cc.callFunc(function() {
                                if(self.autoProgressBar.progress === 0) {
                                    self.spSpin.timeScale = .5;
                                    self.spSpinOutSide.timeScale = .5;
                                }
                                self.autoProgressBar.progress += 1/30;
                                if(self.autoProgressBar.progress < 1) {
                                    self.spSpin.timeScale += .5;
                                    self.spSpinOutSide.timeScale += 1;
                                }
                                if(self.autoProgressBar.progress >= 1 && !self.spinAuto) {
                                    self.spSpin.setAnimation(0, "MainScreen_Spin_Stop", true);
                                    self.spSpin.timeScale = 2;
                                    self.spSpinOutSide.timeScale = 2;
                                    if(self.isPlayingTrial) {
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                        self.spinAuto = false;
                                        self.showToast("Không hỗ trợ ở chế độ chơi thử");
                                        self.spSpin.setAnimation(0, "MainScreen_Spin", true);
                                    } else {
                                        self.spinAuto = true;
                                        self.isTouchOn = true;
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                        self.btnRollClick(null);
                                    }
                                }
                            })
                        ), 31
                    )
                )
            )
        });

        this.spinNode.on(cc.Node.EventType.TOUCH_END, touch => {
            self.isTouchOn = false;
            self.spinNode.getComponent(cc.Button).interactable = true;
            self.spinNode.stopAllActions();
            self.autoProgressBar.progress = 0;
            if(Configs.Login.Coin < this.arrLineSelect.length * this.listBet[this.betIdx] && !self.isPlayingTrial) {
                self.spSpin.timeScale = .5;
                self.spSpinOutSide.timeScale = 2;
                if(self.spSpin.animation !== "MainScreen_Spin") {
                    self.spSpin.setAnimation(0, "MainScreen_Spin", true);
                }
            } else {
                if(self.spSpin.animation !== "MainScreen_Spin_Stop") {
                    self.spSpin.setAnimation(0, "MainScreen_Spin_Stop", true);
                }
            }
        });
    }

    

    private showToast(msg: string) {
        this.toast.getComponentInChildren(cc.Label).string = msg;
        this.toast.stopAllActions();
        this.toast.active = true;
        this.toast.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            this.toast.active = false;
        })));
    }

    private moneyToK(money: number): string {
        if(money<=0) return "0";
        if (money < 1000) {
            return Utils.formatNumber(money);
        } if(money < 1000000){
            money = parseFloat((money / 1000).toString());
            return Utils.formatNumber(money) + "K";
        }
        if( money >= 1000000) {
            money = parseInt((money / 1000000).toString());
            return Utils.formatNumber(money) + "M";
        }
    }

    private setEnabledAllButtons(enabled: boolean) {
        this.btnSetting.interactable = enabled;
        this.btnHelp.interactable = enabled;
    }

    private stopAllEffects() {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = false;
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = false;
    }

    private stopShowLinesWin() {
        this.linesWin.stopAllActions();
        for (var i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private stopAllItemEffect() {
        for (let i = 0; i < this.rollerNode.childrenCount; i++) {
            let children = this.rollerNode.children[i].children;
            children[0].stopAllActions();
            children[1].stopAllActions();
            children[2].stopAllActions();
            children[0].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
            children[1].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
            children[2].runAction(cc.scaleTo(0.1, this.rollerCtrl.sizeScaleOrigin));
        }
        this.rollerCtrl.hideAllAnim();
    }

    private stopSpin() {
        for (var i = 0; i < this.columns.childrenCount; i++) {
            var roll = this.columns.children[i];
            roll.stopAllActions();
            roll.setPosition(cc.v2(roll.getPosition().x, 0));
        }
    }

    private showLineWins() {
        this.isSpined = true;

        Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
        if (!this.isPlayingTrial) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        this.linesWin.stopAllActions();
        let linesWin = this.lastSpinRes.linesWin.split(",");
        if(linesWin.length > 0) {
            linesWin = Utils.removeDups(linesWin);
        }
        for (let i = 0; i < linesWin.length; i++) {
            if (linesWin[i] == "0") {
                linesWin.splice(i, 1);
                i--;
            }
        }
        let matrix = this.lastSpinRes.matrix.split(",");
        let linesWinChildren = this.linesWin.children;
        let rolls = this.columns.children;
        let actions = [];
        for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;
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
                if(this.spinAuto) {
                    actions.push(cc.callFunc(function () {
                        for (let i = 0; i < linesWinChildren.length; i++) {
                            linesWinChildren[i].active = false;
                        }
                    }));
                } else {
                    actions.push(cc.callFunc(() => {
                        let mLine = this.mapLine[lineIdx];
                        let countItemWin = 0;
                        let fisrtItemId = matrix[mLine[0]];
                        for (let j = 0; j < mLine.length; j++) {
                            let itemId = matrix[mLine[j]];
                            if (fisrtItemId == itemId || parseInt(itemId) == this.wildItemId || this.columnsWild.indexOf(j) >= 0) {
                                // console.log("==" + itemId + " j:" + j);
                                countItemWin++;
                            } else {
                                break;
                            }
                        }
                        for (let j = 0; j < 5; j++) {
                            let itemRow = parseInt((mLine[j] / 5).toString());
                            rolls[j].children[2 - itemRow].stopAllActions();
                            rolls[j].children[2 - itemRow].getComponent(SlotFAFItemsController).showAnimItem(1.5, true, false, this._prefix);
                        }
                    }));
                    actions.push(cc.delayTime(1.5));
                    actions.push(cc.callFunc(() => {
                        line.active = false;
                        this.stopAllItemEffect();
                    }));
                    actions.push(cc.delayTime(0.1));
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

        if(!this.spinAuto) {
            this.spSpin.setAnimation(0, "MainScreen_Spin", true);
            this.spSpin.timeScale = .5;
            this.spSpinOutSide.timeScale = .5;
        }
    }

    private showEffectBigWin(cash: number, cb: () => void) {
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = true;
        this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "bigwin", false);
        let label = this.effectBigWin.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectBigWin.runAction(cc.sequence(
            cc.delayTime(1),
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
        let jackpotStart = this.effectJackpot.getChildByName('jackpot_Start');
        let spJPStart = jackpotStart.getComponent(sp.Skeleton);
        let jackpotLoop = this.effectJackpot.getChildByName('jackpot_Loop')
        let spJPLoop = jackpotLoop.getComponent(sp.Skeleton);
        jackpotStart.active = true;
        jackpotLoop.active = false;
        this.playStartJackpotSound();
        this.playLoopJackpotSound();
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = true;
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundJackpotLoop, false, 1);
        }

        spJPStart.setAnimation(0,'jackpot_Start', false);
        let trackJPStart = spJPStart.getCurrent(0);
        spJPStart.setTrackCompleteListener(trackJPStart, (entry, loopCount) => {
            jackpotLoop.active = true;
            jackpotStart.active = false;
            spJPLoop.setAnimation(0, 'jackpot_Loop', true);
        });

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
        let spSkeleteBonus = this.effectBonus.getComponentInChildren(sp.Skeleton);
        spSkeleteBonus.setAnimation(0, "animation", false);
        this.scheduleOnce(() => {
            this.effectBonus.active = false;
            if (cb != null) cb();
        }, 2.2);
    }

    private showFreeSpinNode() {
        let freeSpinNode = this.lblFreeSpinCount.node.parent;
        freeSpinNode.active = true;
        freeSpinNode.scale = 0;
        freeSpinNode.stopAllActions();
        freeSpinNode.runAction(
            cc.sequence(
                cc.delayTime(1.1),
                cc.scaleTo(.5, 1).easing(cc.easeBackOut())
            )
        )
    }

    private hideFreeSpinNode() {
        let freeSpinNode = this.lblFreeSpinCount.node.parent;
        freeSpinNode.active = true;
        freeSpinNode.scale = 1;
        freeSpinNode.stopAllActions();
        freeSpinNode.runAction(
            cc.sequence(
                cc.delayTime(1.1),
                cc.scaleTo(.5, 0).easing(cc.easeBackOut())
            )
        )
    }

    private onSpinResult(res: cmd.ReceivePlay | any) {
        var successResult = [0, 1, 2, 3, 5, 6];
        //res.result == 5 //bonus
        //res.result == 0 //khong an
        //res.result == 1 //thang thuong
        //res.result == 2 //thang lon
        //res.result == 3 //no hu
        //res.result == 6 //thang cuc lon
        if (successResult.indexOf(res.result) === -1) {
            this.isSpined = true;
            this.toggleBoost.isChecked = false;
            this.toggleBoost.interactable = true;
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
        this.freeSpins = res.freeSpin;
        if (!this.isPlayingTrial && !this._isInFreeSpin) {
            let curMoney = Configs.Login.Coin - this.arrLineSelect.length * this.listBet[this.betIdx];
            Tween.numberTo(this.lblCoin, curMoney, 0.3);
        }

        if(!this.isPlayingTrial) {
            Configs.Login.Coin = res.currentMoney;
        } else {
            this.playTrialResult(res);
        }
        let matrix = res.matrix.split(",");
        this.showResult(res.prize,  matrix.map(Number), this.freeSpins);
    }

    private spined() {
        this.hasFreeSpin = false;
        this.hasMiniGame = false;
        this.hasJackPot = false;
        this.hasBigWin = false;
        var successResult = [0, 1, 3, 5, 6];
        //this.lastSpinRes.result = 3;
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

    actBack() {
        if(this.rollerCtrl.rolling) {
            this.showToast("không thể rời phòng lúc đang quay.");
            return;
        }
        this.playSoundButton();
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        this.animMove(this.header, this.posyTopBar, this.posyTopBar + 100, 0);
        this.animMove(this.footer, this.posyBottomBar, this.posyBottomBar - 100, 0);
        this.lblFreeSpinCount.node.parent.active = false;
        this.resetGameRoom(true);
        this.removeAnimBack();
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.playAudioSourceChooseBet();
        }
        this.stopShowLinesWin();
    }

    actHidden() {
        this.showToast("Tính năng đang phát triển.");
    }

    actChangeBet() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isPlayingTrial) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }
        let oldBet = this.betIdx;
        this.betIdx++;
        if (this.betIdx > this.listBet.length - 1) {
            this.betIdx = 0;
        }
        SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldBet, this.betIdx));
        this.lblBet.string = this.listBetLabel[this.betIdx];
        Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        this.lblBet.string = this.listBetLabel[this.betIdx];
    }

    actSelectRoom(event, data) {
        let oldIdx = this.betIdx;
        this.betIdx = parseInt(data);
        if (this.betIdx == this.listBet.length) {
            this.betIdx = 0;
        }
        this.playSoundButton();
        this.lblBet.string = this.listBetLabel[this.betIdx];
        Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betIdx));
        this.isPlayingTrial = false;
        this.resetGameRoom(false);
        this.actSelectRoomDone();
        this._prefix = `${parseInt(data)+1}_`;
        this.stopAllEffects();
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.playAudioSourceMain();
        }

        this.rollerCtrl.setItemsRandom(true, this._prefix);
        this._lastPrefix = this._prefix;
        this.nodeTrial.active = false;
    }

    private getSelectedLines() {
        let lines = new Array<number>();
        for (let i = 0; i < this.linesSelected; i++) {
            lines.push(i + 1);
        }
        return lines;
    }

    actLine() {
        this.playSoundButton();
        if (this.isPlayingTrial) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }
        if(this.rollerCtrl.rolling) {
            this.showToast("Không thể chọn dòng lúc đang quay");
            return;
        }
        this.popupSelectLine.getComponent(PopupSelectLine).show();
    }

    actSetting() {
        this.playSoundButton();
        let popupSetting = cc.instantiate(this.popupSetting);
        this.nodeMainGame.addChild(popupSetting);
    }

    settingSound(){
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.soundSlotState == 1) {
            this.soundSlotState = 0;
        } else {
            this.soundSlotState = 1;
        }

        cc.sys.localStorage.setItem("sound_slot_FAF", "" + this.soundSlotState);
    }

    showSelectedLine(event, data) {
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

    resetGameRoom(enabled) {
        this.nodeChooseRoom.active = enabled;
    }

    actSelectRoomDone() {
        this.nodeChooseRoom.active = false;
        this.animMove(this.header, this.posyTopBar + 100, this.posyTopBar, 0);
        this.animMove(this.footer, this.posyBottomBar - 100, this.posyBottomBar, 0);
    }

    actTrial() {
        this.isPlayingTrial = true;
        this.stopAllEffects();
        if (this.isPlayingTrial) {
            this.nodeTrial.active = true;
            this.setupTrial();
            this.betIdx = 5;
            this._prefix = `3_`;
            this.rollerCtrl.setItemsRandom(true, this._prefix);
            this._lastPrefix = this._prefix;
        }
        this.actSelectRoomDone();
        this.resetGameRoom(false);
        this.playSoundButton();
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

    // protected onEnable() {
    //     let popupBonus = cc.instantiate(this.popupBonus);
    //     this.nodeMainGame.addChild(popupBonus);
    //     popupBonus.getComponent(PopupBonus).showBonus("1000,1000,500,800,1,3", () => {
    //         this.hasMiniGame = false;
    //         if(GameConfigManager.getInstance().enableBackgroundMusic) {
    //             this.muteAllAudioSource();
    //             this.playAudioSourceMain();
    //         }
    //     });
    // }

    playSoundButton() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    playSoundClickBonusItem() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    playSoundBonusStart() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundBonus, false, 1);
        }
    }

    playSoundOver() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundBonusOver, false, 1);
        }
    }

    playSoundClickTreasure() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundOpenTreasure, false, 1);
        }
    }

    playSoundCar() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundCar, false, 1);
        }
    }

    playStartJackpotSound() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundJackpotStart, false, 1);
        }
    }

    playLoopJackpotSound() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundJackpotLoop, false, 1);
        }
    }

    playAudioSourceMain() {
        this.audioSourceMain.play();
    }

    playAudioSourceBonus() {
        this.audioSourceBonus.play();
    }

    playAudioSourceChooseBet() {
        this.audioSourceChooseRoom.play();
    }

    muteAllAudioSource() {
        this.audioSourceBonus.stop();
        this.audioSourceMain.stop();
        this.audioSourceChooseRoom.stop();
    }

    public static getInstance(): SlotFAFSlotFAFController {
        return this._instance;
    }

    actSelectLines() {

    }

    onRollDone() {
        this.isCanStop = false;
        if(!this.spinAuto) {
            this.spSpin.setAnimation(0, "MainScreen_Spin", true);
            this.spSpin.timeScale = .5;
            this.spSpinOutSide.timeScale = .5;
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
        this.playSFXRoll();
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
            this.rollerCtrl.showExpandWild();
            if(!this.spinAuto) {
                this.setEnabledAllButtons(true);
            }
            this.scheduleOnce(() => {
                this.showLineWins();
            }, .1);
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
                if(this.spSpin.animation != "MainScreen_Spin") {
                    this.spSpin.setAnimation(0, "MainScreen_Spin", false);
                }
                this.spSpin.timeScale =.5;
                this.spSpinOutSide.timeScale =.5;
                this.autoProgressBar.progress = 0;
                this.spinNode.getComponent(cc.Button).interactable = true;
                this.spinAuto = false;
                return this.showToast("Vui lòng nạp thêm tiền");
            }

            if(this.hasMiniGame || this.hasBigWin || this.hasFreeSpin) {
                return;
            }
            this.isSpined = false;
            this.unscheduleAllCallbacks();
            this.isCanStop = false;
            this.resetAllData();
            this.stopShowLinesWin();
            this.rollerCtrl.hideAllAnim();
            this.rollerCtrl.roll(this.toggleBoost.isChecked);
            this.rollingTimeOut = this.defaultRollingTimer;
            this.isRollingTimeOut = false;
            this.schedule(this.checkTimeOutSpin, 1, cc.macro.REPEAT_FOREVER, 0);
            if(this.spSpin.animation !== "MainScreen_Spin_Stop") {
                this.spSpin.setAnimation(0, "MainScreen_Spin_Stop", true);
            }
            if (!this.isPlayingTrial) {
                SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.arrLineSelect.toString()));
            } else {
                var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
                if(!this.hasFreeSpin) {
                    this._moneyUserTrial -= 250000;
                    Tween.numberTo(this.lblCoin, this._moneyUserTrial, .3);
                }
                this.scheduleOnce(() => {
                    this.onSpinResult(TrialResults.results[rIdx]);
                }, 0.7);
            }
        }
        this.setEnabledAllButtons(false);
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
            let labelNode = this.effectBigWin.children[1].children[0];
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
        let freeSpinNodeLabel = this.lblFreeSpinCount.node.parent;
        let freeSpinLabel = this.lblFreeSpinCount;
        let freeSpinAnimNode = this.effectFreeSpin;

        if(this.freeSpins <= 0) {
            freeSpinNodeLabel.active = false;
            freeSpinAnimNode.active = false;
            freeSpinLabel.string = this.freeSpins.toString();
            if(this._isInFreeSpin) {
                this._isInFreeSpin = false;
                this.nodeFreeSpin.forEach(child => child.active = false);
                this.nodeMain.forEach(child => child.active = true);
                this.rollerCtrl.setResultFreeSpin(this._prefix);
            }
        } else {
            freeSpinNodeLabel.active = true;
            freeSpinLabel.string = this.freeSpins.toString();
            if(this.hasFreeSpin) {
                this._prefix = "0_";
                this.showFreeSpinNode();
                this.effectBigWin.active = false;
                this.playSFXFreeSpin();
                freeSpinLabel.string = "";
                freeSpinAnimNode.active = true;
                freeSpinAnimNode.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
                freeSpinAnimNode.runAction(
                    cc.sequence(
                        cc.fadeIn(.3),
                        cc.delayTime(.8),
                        cc.callFunc(() => {
                            freeSpinLabel.string = this.freeSpins.toString();
                            this.rollerCtrl.setResultFreeSpin("0_");
                            this.stopShowLinesWin();
                            this.nodeFreeSpin.forEach(node => node.active = true);
                            this.nodeMain.forEach(node => node.active = false);
                            this._isInFreeSpin = true;
                            this.hasBigWin = false;
                            this.hasFreeSpin = false;
                        }),
                        cc.delayTime(1.2),
                        cc.fadeOut(1),
                        cc.callFunc(() => {
                            this.checkAutoSpin();
                            freeSpinAnimNode.active = false;
                            this._prefix = this._lastPrefix;
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
            this.playSoundBonusStart();
            this.showEffectBonus(() => {
                if(GameConfigManager.getInstance().enableBackgroundMusic) {
                    this.muteAllAudioSource();
                    this.playAudioSourceBonus();
                }
                let popupBonus = cc.instantiate(this.popupBonus);
                this.nodeMainGame.addChild(popupBonus);
                popupBonus.getComponent(PopupBonus).showBonus(this.lastSpinRes.haiSao, () => {
                    this.hasMiniGame = false;
                    if(GameConfigManager.getInstance().enableBackgroundMusic) {
                        this.muteAllAudioSource();
                        this.playAudioSourceMain();
                    }
                    this.checkAutoSpin();
                    this.showLineWins();
                });
            });
        }
    }

    checkJackPot() {
        let lblJackpot = this.effectJackpot.children[2].children[0];
        let jackPotAnimationStart = this.effectJackpot.children[1];
        let jackPotAnimationLoop = this.effectJackpot.children[2];
        if(this.hasJackPot) {
            this.effectJackpot.active = true;
            this.effectJackpot.stopAllActions();
            jackPotAnimationStart.getComponent(sp.Skeleton).setAnimation(0, "jackpot_Start", false);
            this.playStartJackpotSound();
            this.playLoopJackpotSound();
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.callFunc(() => {
                        jackPotAnimationLoop.getComponent(sp.Skeleton).setAnimation(0, "jackpot_Loop", true);
                        GameUtil.runAnimationMoneyWithColom(lblJackpot.getComponent(cc.Label), 0, this.moneyExchange, 1.5);
                        lblJackpot.runAction(
                            cc.sequence(
                                cc.scaleTo(.3, 1),
                                cc.delayTime(4),
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

    playSoundEffectLoop(pathSoundLoop) {
        if(MusicPlayer.getInstance().loopEffectId != -1) {
            cc.audioEngine.stopEffect(MusicPlayer.getInstance().loopEffectId);
        }
        MusicPlayer.getInstance().playEffectLoop(pathSoundLoop);
    }

    removeAnimBack() {
        this.effectFreeSpin.active = false;
        this.lblFreeSpinCount.node.parent.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.hasBigWin = false;
        this.hasJackPot = false;
        for(let i = 0 ; i < this.expWild.length; i++) {
            this.expWild[i].stopAllActions();
            this.expWild[i].active = false;
        }
        this.spSpin.setAnimation(0, "MainScreen_Spin", true);
        this.spSpin.timeScale = .5;
        this.spSpinOutSide.timeScale = .5;
        this.nodeMain.forEach(node => node.active = true);
        this.nodeFreeSpin.forEach(node => node.active = false);
    }

    playSFXFreeSpin() {
        MusicPlayer.getInstance().playEffect("Sounds/FAF/freespin");
    }

    playSFXRoll() {

    }

    checkTimeOutSpin() {
        this.rollingTimeOut--;
        if(this.rollingTimeOut == 0) {
            App.instance.actShowThongBao("Đường truyền có vấn đề, vui lòng tải lại");
            this.isRollingTimeOut = true;
            this.rollerCtrl.stop();
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

    setupTrial() {
        this.lblLine.string = this._lineTrial.toString();
        this.lblBet.string = "10,000";
        Tween.numberTo(this.lblTotalBet, 250000, 0.3);
        Tween.numberTo(this.lblJackpot, this._moneyJackPotTrial, .3);
        Tween.numberTo(this.lblCoin, this._moneyUserTrial, .3);
    }

    playTrialResult(res: cmd.ReceivePlay | any) {
        this._moneyUserTrial += res.prize;
        this._moneyJackPotTrial += this._moneyBetPerRoll * this._jackPotFee;
        Tween.numberTo(this.lblJackpot, this._moneyJackPotTrial, .3);
        Tween.numberTo(this.lblCoin, this._moneyUserTrial, .3);
    }
}
