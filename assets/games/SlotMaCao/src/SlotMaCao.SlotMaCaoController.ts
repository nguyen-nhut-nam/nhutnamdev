import cmd from "./SlotMaCao.Cmd";
import Tween from "../../../scripts/common/Tween";
import InPacket from "../../../scripts/networks/Network.InPacket";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import Configs from "../../../scripts/common/Configs";
import Utils from "../../../scripts/common/Utils";
import TrialResults from "./SlotMaCao.TrialResults";
import PopupBonus from "./SlotMaCao.PopupBonus";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import RollerController from "../../../scripts/common/slot/RollerController";
import SlotMaCaoItemsController from "./SlotMaCaoItemsController";
import GameUtil from "../../../scripts/common/game/GameUtil";
import MusicPlayer from "../../../scripts/common/game/MusicPlayer";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class SlotMaCaoController extends cc.Component {

    @property(cc.Node)
    columns: cc.Node = null;
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
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Label)
    lblWinCash = null;
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
    @property(cc.Prefab)
    popupBonus: cc.Prefab = null;
    @property(cc.Prefab)
    popupGuide: cc.Prefab = null;
    @property(cc.Node)
    nodeMain = null;
    @property(cc.Node)
    canvas = null;
    @property(cc.Node)
    popupChooseBet: cc.Node = null;
    @property(cc.Label)
    labelRoom100: cc.Label = null;
    @property(cc.Label)
    labelRoom1k: cc.Label = null;
    @property(cc.Label)
    labelRoom10k: cc.Label = null;

    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpining: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinStop: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundFreeSpin = null;
    @property({ type: cc. AudioClip })
    soundExpandWild = null;
    @property({ type: cc.AudioSource})
    musicBackground = null;

    @property(cc.Node)
    spinNode = null;
    @property(cc.ProgressBar)
    autoProgressBar = null;
    @property(sp.Skeleton)
    animSpinNode = null;
    @property(cc.Node)
    nodeTrial = null;
    @property(cc.Node)
    iconWildColumns = null;
    @property(cc.SpriteAtlas)
    gameAtlas = null;
    @property([cc.Node])
    listNodeAnim = [];
    @property([cc.Node])
    expWild = [];
    @property(cc.Node)
    rollerNode = null;

    private betIdx = 0;
    private listBet = [100, 1000, 5000, 10000];
    private listBetLabel = ["100", "1K", "5K", "10K"];
    private arrLineSelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    private isSpined = true;
    private isPlayingTrial = false;
    private _isFreeSpin = false;
    private mapLine = [
        [0, 1, 2, 3, 4],//1
        [5, 6, 7, 8, 9],//2
        [10, 11, 12, 13, 14],//3
        [0, 6, 12, 8, 4],//4
        [10, 6, 2, 8, 14],//5
        [5, 1, 7, 3, 9],//6
        [5, 11, 7, 13, 9],//7
        [0, 6, 2, 8, 4],//8
        [10, 6, 12, 8, 14],//9
        [5, 1, 2, 3, 9],//10
        [5, 11, 12, 13, 9],//11
        [10, 11, 7, 13, 14],//12
        [0, 1, 7, 3, 4],//13
        [10, 6, 7, 8, 14],//14
        [0, 6, 7, 8, 4],//15
        [0, 11, 2, 13, 4],//16
        [10, 1, 12, 3, 14],//17
        [5, 6, 2, 8, 9],//18
        [5, 6, 12, 8, 9],//19
        [10, 11, 2, 13, 14],//20
    ];
    private lastSpinRes = null;

    private spinAuto = false;
    private firstTouch = null;
    private isTouchOn = false;
    private freeSpins = 0;
    public static _instance: SlotMaCaoController = null;
    private rollerCtrl: RollerController = null;
    private isCanStop = false;
    private hasJackPot = false;
    private hasMiniGame = false;
    private hasFreeSpin = false;
    private hasBigWin = false;
    private symbols = [];
    private rewards = [];
    private stopImmediately = false;
    private moneyExchange = 0;
    private defaultRollingTimer = 5;
    private rollingTimeOut = 5;
    private isRollingTimeOut = false;

    public static getInstance(): SlotMaCaoController {
        return this._instance;
    }

    protected onLoad() {
        cc.audioEngine.stopAll();
        this.rollerCtrl = this.rollerNode.getComponent(RollerController);
    }

    start() {
        let self = this;
        if(SlotMaCaoController._instance == null) {
            SlotMaCaoController._instance = this;
        }
        this.rollerCtrl.onRollDone = this.onRollDone.bind(this);
        this.rollerCtrl.setGameController(this);

        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.playAudioSourceMain();
        }

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
                    this._isFreeSpin = res.freeSpin > 0;
                    this.freeSpins = res.freeSpin;
                    if(this._isFreeSpin) {
                        this.showFreeSpinNode();
                        this.lblFreeSpinTurn.string = res.freeSpin.toString();
                    }
                }
                    break;

                case cmd.Code.UPDATE_POT:
                    {
                        let res = new cmd.ReceiveUpdatePot(data);

                        Tween.numberTo(this.labelRoom100, res.value100, 0.3);
                        Tween.numberTo(this.labelRoom1k, res.value1000, 0.3);
                        Tween.numberTo(this.labelRoom10k, res.value10000, 0.3);

                        switch (this.betIdx) {
                            case 0:
                                Tween.numberTo(this.lblJackpot, res.value100, 0.3);
                                break;
                            case 1:
                                Tween.numberTo(this.lblJackpot, res.value1000, 0.3);
                                break;
                            // case 2:
                            //     Tween.numberTo(this.lblJackpot, res.valueRoom3, 0.3);
                            //     break;
                            case 3:
                                Tween.numberTo(this.lblJackpot, res.value10000, 0.3);
                                break;
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
                self.animSpinNode.setAnimation(0, "stop", true);
                if(!self.rollerCtrl.rolling) {
                    self.setEnabledAllButtons(true);
                }
            }
            self.firstTouch = target.getLocation();
            self.autoProgressBar.progress = 0;
            self.animSpinNode.setAnimation(0, "spin", false);
            self.spinNode.runAction(
                cc.sequence(
                    cc.delayTime(.2),
                    cc.repeat(
                        cc.sequence(
                            cc.delayTime(.05),
                            cc.callFunc(() => {
                                self.autoProgressBar.progress += 1/30;
                                if(self.autoProgressBar.progress >= 1 && !self.spinAuto) {
                                    if(self.isPlayingTrial) {
                                        self.spinAuto = false;
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                        self.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
                                    } else {
                                        self.spinAuto = true;
                                        self.isTouchOn = true;
                                        self.btnRollClick();
                                        self.spinNode.getComponent(cc.Button).interactable = false;
                                        self.animSpinNode.setAnimation(0, "stop", true);
                                    }
                                }
                            })
                        )
                    ,31)
                )
            )
        });

        this.spinNode.on(cc.Node.EventType.TOUCH_END, () => {
            self.isTouchOn = false;
            self.spinNode.stopAllActions();
            self.autoProgressBar.progress = 0;
            if(this.spinAuto) {
                self.animSpinNode.setAnimation(0, "stop", true);
            } else {
                self.animSpinNode.clearTracks();
            }
            if(Configs.Login.Coin < self.arrLineSelect.length * self.listBet[self.betIdx]
                && !self.isPlayingTrial
                && !self.isSpined
                && self.freeSpins == 0) {
                self.animSpinNode.setAnimation(0, null, false);
            }
        });

        this.spinNode.on(cc.Node.EventType.TOUCH_MOVE, () => {

        })
    }

    onRollDone() {
        this.isCanStop = false;
        if(!this.spinAuto) {
            this.animSpinNode.setAnimation(0, "", true);
        }
        if(MusicPlayer.getInstance().loopEffectId !== -1) {
            cc.audioEngine.stopEffect(MusicPlayer.getInstance().loopEffectId);
        }
        if(cc.sys.isBrowser) {
            cc.audioEngine.stopAllEffects();
        }

        let delayTime = 0.3;
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
            this.rollerCtrl.showExpandWild(true);
            this.showLineWins();
        }
        if(!this.spinAuto) {
            this.setEnabledAllButtons(true);
        }
    }

    chooseBet(event, bet) {
        var oldIdx = this.betIdx;
        this.betIdx = parseInt(bet);
        if (this.betIdx == this.listBet.length) {
            this.betIdx = 0;
        }
        this.lblBet.string = this.listBetLabel[this.betIdx];
        // Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3);
        this.lblTotalBet.string = Utils.formatNumber(this.arrLineSelect.length * this.listBet[this.betIdx]);
        SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betIdx));
        this.actSelectRoom();
        this.stopAllEffects();
        this.isPlayingTrial = false;
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    actBack() {
        if(this.rollerCtrl.rolling) {
            this.showToast("không thể rời phòng lúc đang quay.");
            return;
        }

        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        cc.audioEngine.stopAll();
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        // App.instance.loadScene("Lobby");
        this.popupChooseBet.active = true;
        this.animSpinNode.setAnimation(0, "Btn-quay", true);
        this.stopShowLinesWin();
        if(this.rollerCtrl.rolling) {
            this.rollerCtrl.stopAllColumn();
        }
    }

    actTrial() {
        this.isPlayingTrial = true;
        if (this.isPlayingTrial) {
            this.lblLine.string = "20";
            this.lblBet.string = "100";
            // Tween.numberTo(this.lblTotalBet, 2000, 0.3);
            this.lblTotalBet.string = Utils.formatNumberMin(2000);
            this.nodeTrial.active = true;
        } else {
            this.nodeTrial.active = false;
            this.lblLine.string = this.arrLineSelect.length.toString();
            this.lblBet.string = this.listBetLabel[this.betIdx];
            // Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3);
            this.lblTotalBet.string = Utils.formatNumber(this.arrLineSelect.length * this.listBet[this.betIdx]);
        }
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
        this.spinNode.getComponent(cc.Button).interactable = enabled;
    }

    private onSpinResult(res: cmd.ReceiveResult | any) {
        this.stopSpin();
        this.isCanStop = true;
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
                this.animSpinNode.setAnimation(0, 'stop', true);
            } else {
                this.animSpinNode.setAnimation(0, 'spin', true);
            }
            switch (res.result) {
                case 102:
                    this.showToast("Số dư không đủ, vui lòng nạp thêm.");
                    this.rollerCtrl.stop(true);
                    break;
                default:
                    this.showToast("Có lỗi xảy ra, vui lòng thử lại.");
                    this.rollerCtrl.stop(true);
                    break;
            }
            return;
        }
        this.lastSpinRes = res;
        this.freeSpins = res.freeSpin;
        this.lblFreeSpinTurn.string = res.freeSpin;
        if (!this.isPlayingTrial && !this._isFreeSpin) {
            let curMoney = Configs.Login.Coin - this.arrLineSelect.length * this.listBet[this.betIdx];
            Tween.numberTo(this.lblCoin, curMoney, 0.3);
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
    }

    private showLineWins() {
        this.isSpined = true;
        Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
        if (!this.isPlayingTrial) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        if (!this.spinAuto) {
            this.setEnabledAllButtons(true);
            this.animSpinNode.setAnimation(0, "spin", true);
        }
        if(this.spinAuto) {
            this.animSpinNode.setAnimation(0, "stop", true);
        }

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
                                rolls[i].children[2 - itemRow].getComponent(SlotMaCaoItemsController).showAnimItem(1.5, true, false, rolls[i].parent.getComponent(RollerController).imagePrefix);
                            }
                        })
                    );
                    actions.push(cc.delayTime(1.5));
                    actions.push(cc.callFunc(() => {
                        line.active = false;
                        this.stopAllItemEffect();
                    }));
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

    private showEffectBonus(cb: () => void) {
        this.effectBonus.stopAllActions();
        this.effectBonus.active = true;
        this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
        this.scheduleOnce(() => {
            this.effectBonus.active = false;
            if(cb != null) cb();
        }, 3.1);
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
        this.rollerCtrl.hideAllAnim();
    }

    private showToast(msg: string) {
        this.toast.getComponentInChildren(cc.Label).string = msg;
        this.toast.stopAllActions();
        this.toast.active = true;
        this.toast.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            this.toast.active = false;
        })));
    }

    actSelectRoom() {
        this.popupChooseBet.active = false;
        this.nodeTrial.active = false;
        this.runAnimListTopButton();
    }

    runAnimListTopButton() {
        for(let i = 0 ; i < this.listNodeAnim.length; i++) {
            let nodeAnim = this.listNodeAnim[i];
            nodeAnim.stopAllActions();
            nodeAnim.opacity = 255;
            let nodeAnimY = nodeAnim.y;
            nodeAnim.y = nodeAnimY + 100;
            nodeAnim.runAction(
                cc.spawn(
                    cc.moveTo(.5, cc.v2(nodeAnim.x, nodeAnimY)).easing(cc.easeBackOut()),
                    cc.fadeIn(.5)
                )
            )
        }
    }

    private showFreeSpinNode() {
        let freeSpinNode = this.lblFreeSpinTurn.node.parent;
        if(freeSpinNode.active) {
            return;
        }
        freeSpinNode.scale = 0;
        freeSpinNode.stopAllActions();
        freeSpinNode.active = true;
        freeSpinNode.runAction(
            cc.sequence(
                cc.delayTime(1.1),
                cc.scaleTo(.5, 1).easing(cc.easeBackOut())
            )
        )
    }

    playSoundButton() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    playSoundStartSpin() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundSpin, false, 1);
        }
    }

    playAudioSourceMain() {
        this.musicBackground.play();
    }

    muteAllAudioSource() {
        this.musicBackground.stop();
    }

    btnRollClick() {
        if(this.rollerCtrl.rolling) {
            if(!this.rollerCtrl.stopping && this.isCanStop) {
                this.unscheduleAllCallbacks();
                this.rollerCtrl.setResult(this.symbols);
                this.rollerCtrl.stop(true);
                this.animSpinNode.setAnimation(0, "Btn-quay", true);
            }
        } else {
            if(Configs.Login.Coin < this.arrLineSelect.length * this.listBet[this.betIdx]
                && !this.isPlayingTrial
                && !this.rollerCtrl.rolling
                && this.freeSpins === 0)
            {
                this.animSpinNode.setAnimation(0, "Btn-quay2", false);
                this.autoProgressBar.progress = 0;
                this.spinNode.getComponent(cc.Button).interactable = true;
                this.spinAuto = false;
                return this.showToast("Bạn không đủ số dư");
            }

            if(this.hasMiniGame || this.hasBigWin || this.hasFreeSpin) {
                return;
            }

            this.unscheduleAllCallbacks();
            this.isCanStop = false;
            cc.audioEngine.playEffect(this.soundSpin, false);
            this.playSoundEffectLoop("Sounds/nightclub/roll");
            this.resetAllData();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            this.rollerCtrl.hideAllAnim();
            this.rollerCtrl.roll(this.toggleBoost.isChecked);
            this.rollingTimeOut = this.defaultRollingTimer;
            this.isRollingTimeOut = false;
            this.schedule(this.checkTimeOutSpin, 1, cc.macro.REPEAT_FOREVER, 0);
            if (!this.isPlayingTrial) {
                SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.arrLineSelect.toString()));
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
        this._isFreeSpin = this.freeSpins > 0;
        let delayTime = 1.5;
        if(this.toggleBoost.isChecked && this.rollerCtrl.isFast) {
            delayTime = .3;
        }
        if(this.rollerCtrl.rolling) {
            this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                this.rollerCtrl.setResult(this.symbols);
                this.rollerCtrl.stop();
            }, delayTime);
        }
    }

    checkWinAndShowResult() {

    }

    checkAutoSpin() {
        !this.spinAuto || this.isMiniGame() || this.hasFreeSpin || this.hasBigWin || this.hasJackPot || this.btnRollClick();
    }

    checkBigWin() {
        if(this.hasBigWin) {
            this.effectBigWin.stopAllActions();
            this.effectBigWin.active = true;
            this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
            let labelNode = this.effectBigWin.children[1].children[1];
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
        let countFreeSpinNode = this.lblFreeSpinTurn.node.parent;
        if(this.freeSpins <= 0) {
            countFreeSpinNode.active = false;
            this.effectFreeSpin.active = false;
            this.lblFreeSpinTurn.string = this.freeSpins.toString();
        } else {
            this.showFreeSpinNode();
            this.lblFreeSpinTurn.string = this.freeSpins.toString();
            if(this.hasFreeSpin) {
                this.hasFreeSpin = false;
                this.effectFreeSpin.active = true;
                this.effectFreeSpin.stopAllActions();
                if(GameConfigManager.getInstance().enableSound) {
                    cc.audioEngine.play(this.soundFreeSpin, false, 1);
                }
                this.effectFreeSpin.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
                this.effectFreeSpin.getComponentInChildren(sp.Skeleton).timeScale = 1.3;
                this.effectFreeSpin.runAction(
                    cc.sequence(
                        cc.fadeIn(.1),
                        cc.delayTime(1.5),
                        cc.fadeOut(.5),
                        cc.callFunc(() => {
                            this.checkAutoSpin();
                            this.effectFreeSpin.active = false;
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
            this.showEffectBonus(() => {
                let popupBonus = cc.instantiate(this.popupBonus);
                this.nodeMain.addChild(popupBonus);
                popupBonus.getComponent(PopupBonus).showBonus(this.lastSpinRes.haiSao, () => {
                    this.hasMiniGame = false;
                    this.checkAutoSpin();
                });
            });
        }
    }

    checkJackPot() {
        let lblJackpot = this.effectJackpot.children[1].children[1];
        let jackPotAnimation = this.effectJackpot.children[1];
        if(this.hasJackPot) {
            this.effectJackpot.active = true;
            this.effectJackpot.stopAllActions();
            jackPotAnimation.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
            GameUtil.runAnimationMoneyWithColom(lblJackpot.getComponent(cc.Label), 0, this.moneyExchange, 1.5);
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.delayTime(2),
                    cc.callFunc(() => {
                        lblJackpot.runAction(
                            cc.sequence(
                                cc.scaleTo(.3, 1),
                                cc.delayTime(3),
                                cc.callFunc(() => {
                                    this.hasJackPot = false;
                                    this.checkAutoSpin();
                                    this.effectJackpot.active = false;
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
        let lblJackpot = this.effectJackpot.children[1].children[0];
        if(!this.hasJackPot || this.effectJackpot.getNumberOfRunningActions() <= 0) {
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeOut(.5),
                    cc.callFunc(() => {
                        this.effectJackpot.active = false;
                        lblJackpot.stopAllActions();
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
        this.canvas.addChild(popupGuide);
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
    //     this.nodeMain.addChild(popupBonus);
    //     popupBonus.getComponent(PopupBonus).showBonus("1000,1000,500", () => {
    //         this.hasMiniGame = false;
    //     });
    // }
}
export default SlotMaCaoController;