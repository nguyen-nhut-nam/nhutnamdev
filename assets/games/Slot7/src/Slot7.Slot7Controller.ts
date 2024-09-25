import Utils from "../../../scripts/common/Utils";
import SlotNetworkClient from "../../../scripts/networks/SlotNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "./Slot7.Cmd";
import Tween from "../../../scripts/common/Tween";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import App from "../../../scripts/common/App";
import Configs from "../../../scripts/common/Configs";
import PopupSelectLine from "./Slot7.PopupSelectLine";
import PopupBonus from "./Slot7.PopupBonus";
import TrialResults from "./Slot7.TrialResults";
import PopupSetting from "../../Slot7/src/Slot7.PopupSetting";
import utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import MusicPlayer from "../../../scripts/common/game/MusicPlayer";
import GameUtil from "../../../scripts/common/game/GameUtil";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Slot7ItemsController from "./Slot7.ItemsController";
import RollerControllerB52 from "../../../scripts/common/slot/RollerControllerB52";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot7Slot7Controller extends cc.Component {

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
    @property(cc.Toggle)
    toggleTrial: cc.Toggle = null;
    
    @property(cc.Toggle)
    btnSetting: cc.Toggle = null;
    
    @property(cc.Button)
    btnHelp: cc.Button = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Node)
    spinNode = null;
    @property(cc.SpriteFrame)
    sprStop = null;
    @property(cc.SpriteFrame)
    sprQuay = null;
    @property(cc.ProgressBar)
    autoProgressBar = null;
    @property(sp.Skeleton)
    animSpinNode = null;
    @property(cc.Node)
    sprVienDan = null;

    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;

    @property(cc.Node)
    toast: cc.Node = null;

    @property(cc.Node)
    panelSetting: cc.Node = null;

    @property(cc.Node)
    effectWinCash: cc.Node = null;
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
    @property(PopupSetting)
    popupSetting: PopupSetting = null;
    @property({ type: cc.AudioClip })
    soundSpinWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinStart: cc.AudioClip = null;
    @property({ type: cc.AudioSource })
    audioSourceMain = null;
    @property({ type: cc.AudioSource })
    audioSourceBonus = null;

    @property(cc.SpriteAtlas)
    gameAtlas = null;
    @property(cc.Node)
    rollerNode = null;
    @property(cc.Node)
    nodeMain = null;


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

    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    private itemHeight = 0;
    private betIdx = 1;
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
        [0, 6, 12, 8, 4],//4
        [10, 6, 2, 8, 14],//5
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

    private musicSlotState = null;
    private soundSlotState = null;
    private remoteMusicBackground = null;
    private spinAuto = false;
    private firstTouch = null;
    private isPlayingTrial = false;
    private isTouchOn = false;
    private _isInFreeSpin = false;
    private defaultRollingTimer = 5;
    private rollingTimeOut = 5;
    private isRollingTimeOut = false;

    public static _instance: Slot7Slot7Controller = null;

    protected onLoad() {
        cc.audioEngine.stopAll();
        this.rollerCtrl = this.rollerNode.getComponent(RollerControllerB52);
    }

    protected onEnable() {
        // let popupBonus = cc.instantiate(this.popupBonus);
        // this.nodeMain.addChild(popupBonus);
        // popupBonus.getComponent(PopupBonus).showBonus("1000,1000,500,800,1,3", () => {
        //     this.hasMiniGame = false;
        // });
    }

    start() {
        SlotNetworkClient.getInstance().addOnClose(() => {
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }, this);
        if(Slot7Slot7Controller._instance === null) {
            Slot7Slot7Controller._instance = this;
        }
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.muteAllAudioSource();
            this.playAudioSourceMain();
        }

        this.rollerCtrl.onRollDone = this.onRollDone.bind(this);
        this.rollerCtrl.setGameController(this);

        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.GAME_INFO:
                    {
                        let res = new cmd.ReceiveGameInfo(data);
                        this._isInFreeSpin = res.freeSpin > 0;
                        this.freeSpins = res.freeSpin;
                        let freeSpinNode = this.lblFreeSpinCount.node.parent;
                        if(this._isInFreeSpin) {
                            freeSpinNode.stopAllActions();
                            freeSpinNode.y = -350;
                            freeSpinNode.runAction(
                                cc.moveTo(1, cc.v2(freeSpinNode.x, 85)).easing(cc.easeExponentialOut())
                            );
                        } else {
                            freeSpinNode.y = -350;
                        }
                    }
                    break;
                case cmd.Code.UPDATE_POT:
                    {
                        let res = new cmd.ReceiveUpdatePot(data);
                        Tween.numberTo(this.lblJackpot, res.jackpot, 0.3);
                    }
                    break;
                case cmd.Code.PLAY:
                    {
                        let res = new cmd.ReceivePlay(data);
                        // console.log(res);
                        this.onSpinResult(res);
                    }
                    break;
            }
        }, this);

        console.log("Slot7Controller started");

        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.toast.active = false;
        this.effectWinCash.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.panelSetting.active = false;
        this.popupSelectLine.onSelectedChanged = (lines) => {
            this.arrLineSelect = lines;
            this.lblLine.string = this.arrLineSelect.length.toString();
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
        this.lblTotalBet.string = this.moneyToK(this.arrLineSelect.length * this.listBet[this.betIdx]).toString();


        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });
        console.log("Slot7Controller started");

        let self = this;
        this.spinAuto = false;
        this.spinNode.on(cc.Node.EventType.TOUCH_START, touch => {
            if(self.spinAuto) {
                self.spinAuto = false;
                self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprQuay;
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
                                    self.animSpinNode.setAnimation(0, "giudetuquay", true);
                                }
                                self.autoProgressBar.progress += 1/30;
                                if(self.autoProgressBar.progress < 1) {
                                    self.sprVienDan.runAction(cc.rotateBy(.2, 120));
                                }
                                if(self.autoProgressBar.progress >= 1) {
                                    self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprStop;
                                    self.animSpinNode.setAnimation(0, "buttonquay", true);
                                    self.sprVienDan.stopAllActions();
                                    let delta = 60 * Math.ceil(self.sprVienDan.angle / 60) - self.sprVienDan.angle;
                                    self.sprVienDan.runAction(
                                        cc.sequence(
                                            cc.rotateBy(.2, delta + 120),
                                            cc.callFunc(function() {
                                                self.sprVienDan.angle = 0;
                                            })
                                        )
                                    );

                                    if(self.isPlayingTrial) {
                                        self.spinAuto = false;
                                        App.instance.actShowThongBao("Không hỗ trợ ở chế độ chơi thử");
                                        self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprQuay;
                                    } else {
                                        self.spinAuto = true;
                                        self.isTouchOn = false;
                                        self.btnSpin.interactable = false;
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
            self.animSpinNode.setAnimation(0, "buttonquay", true);
            self.btnSpin.interactable = true;
            if(!self.spinAuto) {
                self.spinNode.stopAllActions();
                self.autoProgressBar.progress = 0;
                self.sprVienDan.stopAllActions();
                self.sprVienDan.runAction(
                    cc.sequence(
                        cc.rotateBy(.2, 60),
                        cc.callFunc(function() {
                            let deltaAngle = 60 * Math.ceil(self.sprVienDan.angle / 60) - self.sprVienDan.angle;
                            self.sprVienDan.runAction(cc.rotateBy(.2, deltaAngle))
                        })
                    )
                );
            }

            if(self.spinAuto) {
                self.spinNode.stopAllActions();
                self.sprVienDan.stopAllActions();
                self.spinNode.getComponent(cc.Sprite).spriteFrame = self.sprStop;
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
        this.toggleTrial.interactable = enabled;
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
        if (!this.toggleTrial.isChecked) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        this.linesWin.stopAllActions();
        let linesWin = this.lastSpinRes.linesWin.split(",");
        linesWin = Utils.removeDups(linesWin);
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
            this.showWinCash(this.lastSpinRes.prize);
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
                    // console.log("lineIdx: " + lineIdx + "fisrtItemId: " + fisrtItemId + " countItemWin: " + countItemWin);
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
                            rolls[j].children[2 - itemRow].getComponent(Slot7ItemsController).showAnimItem(1.5, true, false);
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
    }

    private showWinCash(cash: number) {
        this.effectWinCash.stopAllActions();
        this.effectWinCash.active = true;
        let label = this.effectWinCash.getComponentInChildren(cc.Label);
        label.string = "0";
        this.effectWinCash.opacity = 0;
        this.effectWinCash.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                Tween.numberTo(label, cash, 0.5);
            }),
            cc.delayTime(1.5),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.effectWinCash.active = false;
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
        let spSkeleteBonus = this.effectBonus.getComponentInChildren(sp.Skeleton);
        spSkeleteBonus.setAnimation(0, "banthunggo", false);
        this.scheduleOnce(() => {
            this.effectBonus.active = false;
            if (cb != null) cb();
        }, 1.7);
    }

    private showEffectFreeSpin(cb: () => void) {
        this.effectFreeSpin.stopAllActions();
        this.effectFreeSpin.active = true;
        this.effectFreeSpin.getComponentInChildren(sp.Skeleton).setAnimation(0, "FreeSpin", false);
        let spSkeleton = this.effectFreeSpin.getComponentInChildren(sp.Skeleton);
        let trackEntry = spSkeleton.getCurrent(0);
        let posStart = cc.v2(535, 0);
        let posEnd = cc.v2(this.lblFreeSpinCount.node.parent.x, 130);
        this.lblFreeSpinCount.node.parent.position = posStart;
        spSkeleton.setTrackCompleteListener(trackEntry, (entry, loopCount) => {
            this.effectFreeSpin.active = false;
            this.lblFreeSpinCount.node.parent.active = true;
            this.lblFreeSpinCount.node.parent.runAction(
                cc.moveTo(0.5, posEnd)
            );
            if (cb != null) cb();
        });
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
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if(this.rollerCtrl.rolling) {
            this.showToast("Không thể thoát ra khỏi phòng lúc đang quay");
            return;
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        cc.audioEngine.stopAll();
        Slot7Slot7Controller._instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    actHidden() {
        this.showToast("Tính năng đang phát triển.");
    }

    actChangeBet() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }

        if(this.rollerCtrl.rolling) {
            this.showToast("Vui lòng đợi quay xong");
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
    actBetUp() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }
        if (this.betIdx < this.listBet.length - 1) {
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, ++this.betIdx));            
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
            this.lblBet.string = this.listBetLabel[this.betIdx];
        }
    }

    actBetDown() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }
        if (this.betIdx > 0) {
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, --this.betIdx));
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
            if(parseInt(this.listBetLabel[this.betIdx]) != 100){
                this.lblBet.string = this.moneyToK(parseInt(this.listBetLabel[this.betIdx]))  +"K";
            }
            
        }
    }

    private getSelectedLines() {
        let lines = new Array<number>();
        for (let i = 0; i < this.linesSelected; i++) {
            lines.push(i + 1);
        }
        return lines;
    }

    actLine() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }

        if(this.rollerCtrl.rolling) {
            this.showToast("Vui lòng đợi quay xong");
            return;
        }

        this.linesSelected++;
        if (this.linesSelected > 25) {
            this.linesSelected = 1;
        }
        this.arrLineSelect = this.getSelectedLines();
        this.lblLine.string = this.arrLineSelect.length.toString();
        this.lblTotalBet.string = this.moneyToK(this.arrLineSelect.length * this.listBet[this.betIdx]).toString();
    }

    actSetting() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.popupSetting.show();
    }

    toggleTrialOnCheck() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isPlayingTrial = this.toggleTrial.isChecked;
        if (this.toggleTrial.isChecked) {
            this.lblLine.string = "25";
            this.lblBet.string = "100";
            Tween.numberTo(this.lblTotalBet, 2500, 0.3, (n) => this.moneyToK(n));
        } else {
            this.lblLine.string = this.arrLineSelect.length.toString();
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => this.moneyToK(n));
            this.lblBet.string = this.listBetLabel[this.betIdx];
        }
    }

    toggleBoostOnCheck() {
        if (GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleBoost.isChecked && this.toggleTrial.isChecked) {
            this.toggleBoost.isChecked = false;
            this.showToast("Tính năng này không hoạt động ở chế độ chơi thử.");
            return;
        }
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

    setupIconById(nodeItem, id) {
        // Icon id = 0 = Scatter => skeletonBig scatter
        // Icon Id = 1 = Bonus => skeletonBig Bonus
        // Icon ID = 2 = Wild => skeletonBig wild
        // Icon ID = 3 = Jackpot => skeletonBig Jackpot
        // Icon ID = 4 => Horse => skeletonBig horse

        // Icon ID = 5 => hat => skeletonLow hat
        // Icon ID = 6 => beer => skeletonLow beer
        // Icon ID = 7 => jack => skeletonLow xuongrong
        // Icon ID = 8 => queen => skeletonLow mongngua
        // Icon ID = 9 => king => skeletonLow ketsat
        // Icon ID = 10 => ace => skeletonLow wanted
        let sprite = nodeItem.getChildByName("sprite");
        let nodeSkeletonBig = nodeItem.getChildByName("skeletonBig");
        let nodeSkeletonLow = nodeItem.getChildByName("skeletonLow");
        let skeletonBig = nodeSkeletonBig.getComponent(sp.Skeleton);
        let skeletonLow = nodeSkeletonLow.getComponent(sp.Skeleton);
        sprite.active = false;
        switch(id) {
            case 0:
                nodeSkeletonBig.active = true;
                nodeSkeletonLow.active = false;
                skeletonBig.setAnimation(0, "scatter", true);
                break;
            case 1:
                nodeSkeletonBig.active = true;
                nodeSkeletonLow.active = false;
                skeletonBig.setAnimation(0, "Bonus", true);
                break;
            case 2:
                nodeSkeletonBig.active = true;
                nodeSkeletonLow.active = false;
                skeletonBig.setAnimation(0, "wild", true);
                break;
            case 3:
                nodeSkeletonBig.active = true;
                nodeSkeletonLow.active = false;
                skeletonBig.setAnimation(0, "Jackpot", true);
                break;
            case 4:
                nodeSkeletonBig.active = true;
                nodeSkeletonLow.active = false;
                skeletonBig.setAnimation(0, "horse", true);
                break;
            case 5:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "hat", true);
                break;
            case 6:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "beer", true);
                break;
            case 7:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "xuongrong", true);
                break;
            case 8:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "mongngua", true);
                break;
            case 9:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "ketsat", true);
                break;
            case 10:
                nodeSkeletonBig.active = false;
                nodeSkeletonLow.active = true;
                skeletonLow.setAnimation(0, "wanted", true);
                break;
        }
    }

    muteAllAudioSource() {
        this.audioSourceBonus.stop();
        this.audioSourceMain.stop();
    }

    playAudioSourceMain() {
        this.audioSourceMain.play();
    }

    playAudioSourceBonus() {
        this.audioSourceBonus.play();
    }

    playSoundBonusStart() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundBonus, false, 1);
        }
    }

    onRollDone() {
        this.isCanStop = false;
        // if(this.toggleBoost.isChecked) {
        //     MusicPlayer.getInstance().playEffect("Sounds/cowboy/roll_stop");
        // }
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

        this.rollerNode.stopAllActions();
        this.rollerNode.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => {
                    this.checkAutoSpin();
                })
            )
        )
        this.unschedule(this.checkTimeOutSpin);
        if(!this.isRollingTimeOut) {
            this.checkJackPot();
            this.checkBigWin();
            this.checkFreeSpinLabel();
            this.checkMiniGame();
            this.scheduleOnce(() => {
                this.showLineWins();
            }, .1);
            this.schedule(() => {
                this.showLineWins();
            }, 20, cc.macro.REPEAT_FOREVER, 0);
            if(this.moneyExchange > 0) {
                this.playSFXWin();
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
                this.autoProgressBar.progress = 0;
                this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprQuay;
                this.btnSpin.getComponent(cc.Button).interactable = true;
                this.spinAuto = false;
                return this.showToast("Vui lòng nạp thêm tiền");
            }

            if(this.hasMiniGame || this.hasBigWin || this.hasFreeSpin) {
                return;
            }

            this.setEnabledAllButtons(false);

            this.unscheduleAllCallbacks();
            this.isCanStop = false;
            if(GameConfigManager.getInstance().enableSound) {
                cc.audioEngine.playEffect(this.soundSpinStart, false);
            }
            this.playSFXRoll();
            this.resetAllData();
            this.stopShowLinesWin();
            this.rollerCtrl.hideAllAnim();
            this.rollerCtrl.roll(this.toggleBoost.isChecked);
            this.rollingTimeOut = this.defaultRollingTimer;
            this.isRollingTimeOut = false;
            this.schedule(this.checkTimeOutSpin, 1, cc.macro.REPEAT_FOREVER, 0);
            this.spinNode.getComponent(cc.Sprite).spriteFrame = this.sprStop;
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
        this.moneyExchange = 0;
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
        this._isInFreeSpin = this.freeSpins > 0;
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
            this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "Bigwin", false);
            let labelNode = this.effectBigWin.children[1];
            labelNode.getComponent(cc.Label).string = "0";
            GameUtil.runAnimationMoneyWithColom(labelNode.getComponent(cc.Label), 0, this.moneyExchange, 2);
            cc.audioEngine.play(this.soundBigWin, false, 1);
            this.effectBigWin.runAction(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.callFunc(() => {
                        labelNode.stopAllActions();
                        labelNode.runAction(
                            cc.sequence(
                                cc.scaleTo(.7, 1),
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
            if(this.effectBigWin.active) {
                this.effectBigWin.stopAllActions();
                this.effectBigWin.runAction(
                    cc.sequence(
                        cc.fadeOut(.2),
                        cc.callFunc(() => {
                            this.effectBigWin.active = false;
                        })
                    )
                )
            } else {
                this.effectBigWin.active = false;
            }
        }
    }

    checkFreeSpinLabel() {
        let freeSpinNode = this.lblFreeSpinCount.node.parent;
        if(this.freeSpins <= 0) {
            freeSpinNode.stopAllActions();
            freeSpinNode.runAction(
                cc.sequence(
                    cc.moveTo(.5, cc.v2(freeSpinNode.x, -500)).easing(cc.easeExponentialIn()),
                    cc.callFunc(() => {
                        freeSpinNode.active = false;
                    })
                )
            );
            this.lblFreeSpinCount.string = this.freeSpins.toString();
            this._isInFreeSpin = false;
        } else {
            this._isInFreeSpin = true;
            freeSpinNode.active = true;
            this.effectFreeSpin.stopAllActions();
            this.lblFreeSpinCount.string = this.freeSpins.toString();
            if(this.hasFreeSpin) {
                this.playSFXFreeSpin();
                this.effectFreeSpin.active = true;
                freeSpinNode.stopAllActions();
                freeSpinNode.y = -350;
                freeSpinNode.runAction(
                    cc.moveTo(1, cc.v2(freeSpinNode.x, 85)).easing(cc.easeExponentialOut())
                );
                this.effectFreeSpin.active = true;
                this.hasFreeSpin = false;
                this.effectFreeSpin.getComponentInChildren(sp.Skeleton).setAnimation(0, "FreeSpin", false);
                this.effectFreeSpin.runAction(
                    cc.sequence(
                        cc.fadeIn(.3),
                        cc.delayTime(.4),
                        cc.fadeOut(.5),
                    )
                );
                this.effectFreeSpin.runAction(
                    cc.sequence(
                        cc.fadeIn(.3),
                        cc.delayTime(2),
                        cc.fadeOut(1),
                        cc.callFunc(() => {
                            this.checkAutoSpin();
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
                this.nodeMain.parent.addChild(popupBonus);
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
        let lblJackpot = this.effectJackpot.children[1];
        if(this.hasJackPot) {
            this.effectJackpot.active = true;
            this.effectJackpot.stopAllActions();
            this.effectJackpot.getComponentInChildren(sp.Skeleton).setAnimation(0, "jackpot", false);
            this.playSFXNoHu();
            GameUtil.runAnimationMoneyWithColom(lblJackpot.getComponent(cc.Label), 0, this.moneyExchange, 1.5);
            this.effectJackpot.runAction(
                cc.sequence(
                    cc.fadeIn(.3),
                    cc.callFunc(() => {
                        lblJackpot.runAction(
                            cc.sequence(
                                cc.scaleTo(.7, 1),
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
        let lblJackpot = this.effectJackpot.children[1].children[0];
        if(!this.hasJackPot || lblJackpot.getNumberOfRunningActions() > 0) {
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

    playSFXRoll() {
        this.playSoundEffectLoop("Sounds/cowboy/roll");
    }

    playSFXFreeSpin() {
        MusicPlayer.getInstance().playEffect("Sounds/cowboy/cowboy_freespin");
    }

    playSFXNoHu() {
        MusicPlayer.getInstance().playEffect("Sounds/cowboy/cowboy_jackpot");
    }

    playSFXRollStop() {
        MusicPlayer.getInstance().playEffect("Sounds/cowboy/roll_stop");
    }

    public static getInstance(): Slot7Slot7Controller {
        return this._instance;
    }

    playSFXWin() {
        MusicPlayer.getInstance().playEffect("Sounds/cowboy/win");
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
        this.nodeMain.addChild(popupGuide);
        let container = popupGuide.getChildByName('Container');
        container.scale = 0;
        container.runAction(
            cc.sequence(
                cc.scaleTo(0.15, 1.1),
                cc.scaleTo(0.1, 1)
            )
        );
    }
}
