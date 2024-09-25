import cmd from "./BauCuaTo2.Cmd";
import InPacket from "../../../scripts/networks/Network.InPacket";
import ButtonPayBet from "./BauCuaTo2.ButtonPayBet";
import Utils from "../../../scripts/common/Utils";
import Configs from "../../../scripts/common/Configs";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import BauCuaTo2NetworkClient from "../../../scripts/networks/BauCuaTo2NetworkClient";
import App from "../../../scripts/common/App";
import TimeUtils from "../../../scripts/common/TimeUtils";
import Tween from "../../../scripts/common/Tween";
import Player from "./BauCuaTo2.Player";
import Random from "../../../scripts/common/Random";
import PopUpLichSuNoHu from "./BauCuaTo2.PopUpLichSuNoHu";
import nodeUtils from "../../../scripts/common/NodeUtils";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import BauCuaTo2PaneShowListUser from "./BauCuaTo2.PaneShowListUser";
const { ccclass, property } = cc._decorator;

@ccclass("BauCuaTo2.ButtonBet")
export class ButtonBet {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.SpriteFrame)
    sfNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfActive: cc.SpriteFrame = null;

    _isActive = false;

    actMove(pos) {
        this.button.node.stopAllActions();
        this.button.node.runAction(cc.moveTo(0.4, pos));
    }

    getPos() {
        return this.button.node.position;
    }

    setActive(isActive: boolean) {
        this._isActive = isActive;
        this.button.getComponent(cc.Sprite).spriteFrame = isActive ? this.sfActive : this.sfNormal;
        let active = nodeUtils.getChildNode(this.button.node, "active");

        this.button.node.stopAllActions();

        this.button.node.children.forEach(item => {
            item.scale = 1;
        })
        active.stopAllActions();
        if (this._isActive) {
            this.button.node.children.forEach(item => {
                item.scale = 1.3;
            })
            nodeUtils.activeNode(active);
            active.opacity = 255;
            cc.tween(active)
                .repeatForever(
                    cc.tween()
                        .to(0.1, {opacity: 0})
                        .delay(0.2)
                        .to(0.1, {opacity: 255})
                        .delay(0.2)
                )
                .start();
        } else {
            active.stopAllActions();
            active.opacity = 255;
            nodeUtils.disableNode(active);
        }
        this.button.interactable = !isActive;
    }
}

@ccclass
export default class BauCuaController extends cc.Component {

    static instance: BauCuaController = null;
    static lastBeted = null;

    @property([cc.SpriteFrame])
    public sprSmallDices: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprSmallDicesLatest = [];
    @property([cc.SpriteFrame])
    public resultDices: cc.SpriteFrame[] = [];
    @property([cc.Node])
    public buttonBets: cc.Node[] = [];
    @property([ButtonPayBet])
    public btnPayBets: ButtonPayBet[] = [];
    @property(cc.Node)
    public itemHistoryTemplate: cc.Node = null;
    @property([cc.Label])
    public lblsSoiCau: cc.Label[] = [];

    @property(cc.Node)
    public UI_Chat :cc.Node =null;
    @property(cc.Node)
    bgChat :cc.Node =null;
    @property(cc.Node)
    bgMenu :cc.Node =null;
    @property(cc.Node)
    public UI_Phien :cc.Node =null;


    @property(cc.Node)
    public dice1 :cc.Node =null;
    @property(cc.Node)
    public dice2 :cc.Node =null;
    @property(cc.Node)
    public dice3 :cc.Node =null;

    @property(cc.Node)
    caibat: cc.Node = null;
    @property(sp.Skeleton)
    dealer = null;
    @property(cc.Node)
    dealerHandsPoint : cc.Node =null;
    @property(cc.Node)
    chips: cc.Node = null;
    @property(cc.Node)
    chipTemplate: cc.Node = null;
    @property([Player])
    players : Player []=[];
    @property([cc.SpriteFrame])
    sprChipSmalls: cc.SpriteFrame[] = [];
    @property(cc.Label)
    numberUserOnRoom: cc.Label=null;
    @property(cc.Label)
    lblTongTienHu : cc.Label = null;
    @property(sp.Skeleton)
    huAnimation : sp.Skeleton =null;
    @property(cc.Node)
    menuBack: cc.Node = null;
    @property(cc.EditBox)
    edtChatInput: cc.EditBox = null;
    @property(Player)
    otherPlayer :Player = null
    @property(cc.Node)
    chatEmotionNode: cc.Node = null;
    @property(cc.Node)
    chatMsgNode: cc.Node = null;
    @property(cc.Node)
    chatNode: cc.Node = null;
    @property(PopUpLichSuNoHu)
    PopUpLichSuNoHu : PopUpLichSuNoHu =null;
    @property(cc.Label)
    labelNoHu : cc.Label =null;
    @property({ type: cc.AudioClip })
    musicBackground: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundXocDia: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundMoBat: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundDatCuoc: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundCollectChip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundRewardChip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundUserWin: cc.AudioClip = null;
    @property(cc.Node)
    detailHistory: cc.Node = null;
    @property(cc.Node)
    showHistory: cc.Node = null;
    @property(cc.Node)
    lblTotalUser: cc.Node = null;
    @property(cc.ScrollView)
    scrollListChip = null;
    @property(cc.Button)
    nextCoinBtn = null;
    @property(cc.Button)
    previousCoinBtn = null;
    @property(cc.Sprite)
    sprProgressTime: cc.Sprite = null;
    @property(cc.Node)
    nodeSoiCau = null;
    @property(cc.Prefab)
    prefabPopupHonor = null;
    @property(cc.Prefab)
    prefabPopupTransation = null;
    @property(cc.Prefab)
    prefabPopupGuide = null;
    @property(cc.Prefab)
    prefabPopupListUser = null;
    @property(cc.Toggle)
    toggleAutoRebet = null;
    @property(cc.Button)
    btnRebet = null;
    @property(cc.Node)
    btnMenu = null;
    @property(cc.Node)
    nodeBlack = null;

    // private readonly listBet = [100, 500,1000, 5000, 10000, 50000, 100000, 500000, 1000000];
    private readonly listBet = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];
    private roomId = 0;
    private betIdx = 0;
    private isBetting = false;
    private historiesData = [];
    private beted = [0, 0, 0, 0, 0, 0];
    private betting = [0, 0, 0, 0, 0, 0];
    private rebetData = [0, 0, 0, 0, 0, 0];
    private inited = false;
    private chipsInDoors: any = {};
    private time = 0;
    private minBetIdx = 0;
    private listUsers =[];
    private listBets =[];
    private timeoutChat =null;

    private isShow = false;
    private stepToNext = 4;
    private stepToPrev = -1;
    private mucCuocDangLuaChonIndex = 0;
    private previousY = 0;
    private _currentChoosingCoinValue = 0;
    private doorWin = [];
    private _runningSessionTime = 0;
    private curTime = 0;
    private isAutoReBetted = false;
    private _winJackpotPrize = 0;

    private _lastBetsBauCua = [];
    private chipPool: cc.Node[] = [];
    private _isMyselfFirstLoginGame = false;

    onLoad(){
        cc.audioEngine.stopAll();
    }
    private musicSlotState = null;
    private remoteMusicBackground = null;
    isHideChat = false;

    settingMusic() {
        this.remoteMusicBackground = cc.audioEngine.playMusic(this.musicBackground, true);
        this.musicSlotState = 1;
        cc.sys.localStorage.setItem("music_Bau_cua", "" + this.musicSlotState);
    }

    actOnBgMusic() {
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.musicBackground, true);
        }
    }

    offBgMusic() {
        cc.audioEngine.stop(this.remoteMusicBackground);
    }

    start() {
        cc.game.on(cc.game.EVENT_SHOW, this.onShowApp, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHideApp, this);
        BauCuaController.instance = this;
        BauCuaTo2NetworkClient.getInstance().checkConnect(() => {
            this.show();
        });

       BauCuaTo2NetworkClient.getInstance().send(new cmd.SendScribe(this.roomId));
        this.itemHistoryTemplate.active = false;
        this.settingMusic();

        this.actActiveBetChip(this.buttonBets[0], true);
        for (let i = 0; i < this.buttonBets.length; i++) {
            let btn = this.buttonBets[i];
            btn.on("click", () => {
                this.betIdx = i;
                for (let i = 0; i < this.buttonBets.length; i++) {
                    this.actActiveBetChip(this.buttonBets[i], false);
                }
                this.actActiveBetChip(this.buttonBets[i], true);
            });
        }

        for (let i = 0; i < this.btnPayBets.length; i++) {
            this.btnPayBets[i].node.on("click", () => {
                if (!this.isBetting) {
                    this.showToast("Ván Chơi Chưa Bắt Đầu");
                } else {
                    this.betting[i] += this.listBet[this.betIdx];
                    if (this.betting[i] <= Configs.Login.Coin) {
                        this.actConfirm();
                    } else {
                        this.showToast("Số dư không đủ.");
                    }
                }
            });
        }

        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        BauCuaTo2NetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            console.log("Close");
            this.dismiss();
        }, this);


        BauCuaTo2NetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);

            if (this.historiesData.length == 0) {
                switch (inpacket.getCmdId()) {
                    case cmd.Code.INFO: {
                        let res = new cmd.ReceiveInfo(data);
                        this._runningSessionTime = res.totalBetTime;
                        this.curTime = TimeUtils.currentTimeMillis() + res.remainBetTime * 1000;
                        if (res.lichSuPhien != "") {
                            let histories = res.lichSuPhien.split(",");
                            for (let i = 0; i < histories.length; i++) {
                                this.addHistory([
                                    parseInt(histories[i]),
                                    parseInt(histories[++i]),
                                    parseInt(histories[++i])
                                ]);
                                ++i;
                                ++i;
                            }
                            this.calculatorSoiCau();
                            this.caculatorSoiCau();
                            this.soiCauNhanh();
                        }
                        break;
                    }
                }
            }
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN: {
               //     console.log("Login roofi");
                    this.resetView();
                    BauCuaTo2NetworkClient.getInstance().send(new cmd.SendScribe(this.roomId));
                    break;
                }
                case cmd.Code.INFO: {
                    this.inited = true;
                    let res = new cmd.ReceiveInfo(data);
                    this.listUsers = res.listUsers;
                    this._runningSessionTime = res.totalBetTime;
                    this.curTime = TimeUtils.currentTimeMillis() + res.remainBetTime * 1000;
                    nodeUtils.setNodeLabel(this.lblTotalUser, (this.listUsers.length - this.players.length).toString());

                    this.isBetting = res.bettingState;
                    this.time = TimeUtils.currentTimeMillis() + res.remainBetTime * 1000;

                    this.setAnimationHu(res.funds,res.isNohu);

                    if(this.isBetting){
                        this.sprProgressTime.node.parent.active = true;
                    } else if(!this.isBetting){
                        this.sprProgressTime.node.parent.active = false;
                    }

                    let totalBets = res.potData.split(",");
                    let beted = res.betData.split(",");
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblTotal.string = Utils.NFormatter(parseInt(totalBets[i])).toString();
                        btnPayBet.lblBeted.string = Utils.NFormatter(parseInt(beted[i])).toString();
                        btnPayBet.overlay.active = false;
                        //btnPayBet.button.interactable = this.isBetting;
                        this.beted[i] = parseInt(beted[i]);
                    }

                    if (!this.isBetting) {
                        this.btnPayBets.forEach(btn => {
                            btn.overlay.active = false;
                        })
                    }
                    this.listBets = res.listBets;
                    let indexMe =0;
                    for(let i =0 ; i < this.listBets.length; i++){
                     let playerName = this.listBets[i]["username"];
                     let playerOnChair = this.getPlayerInChair(playerName);
                     if(playerName.normalize() === Configs.Login.Nickname.normalize()) {
                        indexMe = 1;
                     }
                     if(playerOnChair > -1){
                         let playerBetStr =  this.listBets[i]["betStr"].split(",");
                         let index = this.getPotId(playerBetStr);
                         let listCoin = this.convertMoneyToChipMoney(playerBetStr[index]);
                         for (let i = 0; i < listCoin.length; i++) {
                             let chip = this.getChip(listCoin[i]);
                             chip.name = playerName;
                             if(indexMe ==1){
                                 chip.position = this.players[0].node.position;
                                 indexMe=0;
                             }else{
                                 chip.position =  this.players[playerOnChair].node.position;
                             }
                             if (!this.chipsInDoors.hasOwnProperty(index)) {
                                 this.chipsInDoors[index] = [];
                             }
                             this.chipsInDoors[index].push(chip);

                             let position = this.btnPayBets[index].node.position.clone();
                             position.x = position.x / (this.btnPayBets[index].node.scaleX);
                             position.y = position.y / (this.btnPayBets[index].node.scaleY);

                             position.x += Random.rangeInt(-this.btnPayBets[index].node.width / 3, this.btnPayBets[index].node.width /3);
                             position.y += Random.rangeInt(-this.btnPayBets[index].node.height / 4, this.btnPayBets[index].node.height / 4);
                             chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                         }
                     } else if(this.listUsers.length > this.players.length - 1){
                             let playerBetStr =  this.listBets[i]["betStr"].split(",");
                             let index = this.getPotId(playerBetStr);
                             let listCoin = this.convertMoneyToChipMoney(playerBetStr[index]);
                             for (let i = 0; i < listCoin.length; i++) {
                                 let chip = this.getChip(listCoin[i]);
                                 chip.name = playerName;
                                 if(indexMe ==1){
                                    chip.position = this.players[0].node.position;
                                    indexMe=0;
                                 }else{
                                    chip.position =  this.players[this.players.length - 1].node.position;
                                 }
                                 if (!this.chipsInDoors.hasOwnProperty(index)) {
                                     this.chipsInDoors[index] = [];
                                 }
                                 this.chipsInDoors[index].push(chip);

                                 let position = this.btnPayBets[index].node.position.clone();
                                 position.x = position.x / (this.btnPayBets[index].node.scaleX);
                                 position.y = position.y / (this.btnPayBets[index].node.scaleY);
                                 position.x += Random.rangeInt(-this.btnPayBets[index].node.width / 3, this.btnPayBets[index].node.width /3);
                                 position.y += Random.rangeInt(-this.btnPayBets[index].node.height / 4, this.btnPayBets[index].node.height / 4);
                                 chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                             }
                     }
                 }
                    if (res.lichSuPhien != "") {
                        let histories = res.lichSuPhien.split(",");
                        for (let i = 0; i < histories.length; i++) {
                            this.addHistory([
                                parseInt(histories[i]),
                                parseInt(histories[++i]),
                                parseInt(histories[++i])
                            ]);
                            ++i;
                            ++i;
                        }
                        this.calculatorSoiCau();
                        this.caculatorSoiCau();
                        this.soiCauNhanh();
                    }
                    break;
                }
                case cmd.Code.START_NEW_GAME: {
                    this.isAutoReBetted = false;
                    this.curTime = TimeUtils.currentTimeMillis() + (this._runningSessionTime + 0.8) * 1000;
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                    }
                    let chen = this.caibat.getChildByName('chen');
                    this.caibat.scale = 0.5;
                    chen.opacity = 255;
                    chen.x = 0;
                    this.caibat.runAction(
                        cc.sequence(
                            cc.scaleTo(.25, 1),
                            cc.delayTime(.1),
                            cc.repeat(
                                cc.sequence(
                                    cc.rotateTo(.05, -20),
                                    cc.rotateTo(.05, 0),
                                    cc.rotateTo(.05, 20),
                                    cc.rotateTo(.05, 0),
                                ), 4),
                            cc.delayTime(.1),
                            cc.scaleTo(.25, 0.5),
                            cc.callFunc(() => {
                                if(!this.isShow) {
                                    let msgNode = this.dealer.node.children[0];
                                    let msgText = msgNode.children[0];
                                    this.dealer.setAnimation(0, "DEAL", false);
                                    msgText.getComponent(cc.Label).string = `Xin mời đặt cược`;
                                    msgNode.scale = 0;
                                    msgNode.runAction(
                                        cc.sequence(
                                            cc.scaleTo(.2, 1),
                                            cc.delayTime(2.5),
                                            cc.scaleTo(.2, 0),
                                        )
                                    )
                                }
                                this.isShow = true;
                            })
                        )
                    )
                    let res = new cmd.ReceiveNewGame(data);
                    this.actPlaySoundEffect(this.soundXocDia);
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblBeted.string = "";
                        btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                        btnPayBet.lblTotal.string = "";
                        btnPayBet.overlay.active = false;
                        btnPayBet.button.interactable = true;
                        btnPayBet.setAnimationOff();
                    }
                    this.beted = [0, 0, 0, 0, 0, 0];
                    this.betting = [0, 0, 0, 0, 0, 0];
                    this.rebetData = [0, 0, 0, 0, 0, 0];
                    break;
                }
                case cmd.Code.UPDATE: {
                    let res = new cmd.ReceiveUpdate(data);
                    this.chipTemplate.runAction(cc.moveTo(0.5,this.dealerHandsPoint.position))
                        this.listBets = res.listBets;
                        for(let i =0 ; i < this.listBets.length; i++){
                        let playerName = this.listBets[i]["username"];
                        let playerOnChair = this.getPlayerInChair(playerName);
                        if(playerName.normalize() === Configs.Login.Nickname.normalize()) {
                            continue;
                        } else {
                            if(playerOnChair >-1 ){
                                this.scheduleOnce(() => {
                                    this.actPlaySoundEffect(this.soundDatCuoc);
                                }, .2);
                                let playerBetStr =  this.listBets[i]["betStr"].split(",");
                                let index = this.getPotId(playerBetStr);
                                let listCoin = this.convertMoneyToChipMoney(playerBetStr[index]);
                                for (let i = 0; i < listCoin.length; i++) {
                                    let chip = this.getChip(listCoin[i]);
                                    chip.name = playerName;
                                    chip.position =  this.players[playerOnChair].node.position;
                                    if (!this.chipsInDoors.hasOwnProperty(index)) {
                                        this.chipsInDoors[index] = [];
                                    }
                                    this.chipsInDoors[index].push(chip);

                                    let position = this.btnPayBets[index].node.position.clone();
                                    position.x += Random.rangeInt(-40,40);
                                    position.y += Random.rangeInt(-25,20);
                                    chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                                }
                            } else {
                                this.scheduleOnce(() => {
                                    this.actPlaySoundEffect(this.soundDatCuoc);
                                }, .2);
                                let playerBetStr =  this.listBets[i]["betStr"].split(",");
                                let index = this.getPotId(playerBetStr);
                                let listCoin = this.convertMoneyToChipMoney(playerBetStr[index]);
                                for (let i = 0; i < listCoin.length; i++) {
                                    let chip = this.getChip(listCoin[i]);
                                    chip.name = playerName;
                                    chip.position =  this.otherPlayer.node.position;
                                    if (!this.chipsInDoors.hasOwnProperty(index)) {
                                        this.chipsInDoors[index] = [];
                                    }
                                    this.chipsInDoors[index].push(chip);

                                    let position = this.btnPayBets[index].node.position.clone();
                                    position.x += Random.rangeInt(-40,40);
                                    position.y += Random.rangeInt(-25,20);
                                    chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                                }
                            }
                        }
                    }
                    this.time = TimeUtils.currentTimeMillis() + res.remainTime * 1000;
                    this.isBetting = res.bettingState == 1;
                    if(this.isBetting) {
                        this.sprProgressTime.node.parent.active = true;
                        if(this.checkAutoRebet() && !this.isAutoReBetted) {
                            this.onAutoRebetClick();
                        }
                    } else {
                        this.sprProgressTime.node.parent.active = false;
                    }
                    let totalBets = res.potData.split(",");
                    if(!this.isBetting && res.remainTime==13){
                        this.dice3.parent.active = false;
                    }

                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblTotal.string = Utils.NFormatter(parseInt(totalBets[i])).toString();

                        if (this.isBetting) {
                            btnPayBet.overlay.active = false;
                            btnPayBet.setAnimationOff();
                        } else {
                            //btnPayBet.button.interactable = false;
                            btnPayBet.lblBeted.string = Utils.NFormatter(this.beted[i]);
                            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                        }
                    }
                    break;
                }
                case cmd.Code.RESULT: {
                    this.isShow = false;
                    let msgNode = this.dealer.node.children[0];
                    let msgText = msgNode.children[0];
                    msgText.getComponent(cc.Label).string = `Mở Bát`;
                    msgNode.scale = 0;
                    msgNode.runAction(
                        cc.sequence(
                            cc.scaleTo(.2, 1),
                            cc.delayTime(2.5),
                            cc.scaleTo(.2, 0),
                        )
                    )
                    let res = new cmd.ReceiveResult(data);
                    this.sprProgressTime.node.parent.active = false;
                    let chen = this.caibat.getChildByName('chen');
                    this.caibat.scale = 0.7;
                    chen.opacity = 255;
                    chen.x = 0;
                    this.caibat.runAction(
                        cc.sequence(
                            cc.scaleTo(.2, 1),
                            cc.delayTime(.5),
                            cc.callFunc(() => {
                                this.actPlaySoundEffect(this.soundMoBat);
                                chen.runAction(
                                    cc.sequence(
                                        cc.moveBy(.35, cc.v2(200, 0)),
                                        cc.fadeOut(.2),
                                    )
                                )
                            }),
                            cc.delayTime(1.5),
                            cc.callFunc(() => {
                                for (let i = 0; i < this.btnPayBets.length; i++) {
                                    let btnPayBet = this.btnPayBets[i];
                                    btnPayBet.overlay.active = false;
                                    btnPayBet.setShadow();
                                }
                                this.btnPayBets[res.dice1].setAnimationOn();
                                this.btnPayBets[res.dice2].setAnimationOn();
                                this.btnPayBets[res.dice3].setAnimationOn();
                            }),
                            cc.delayTime(1.5),
                            cc.scaleTo(.2, .5),
                            cc.delayTime(1.5),
                            cc.callFunc(() => {
                                chen.runAction(
                                    cc.sequence(
                                        cc.fadeIn(.2),
                                        cc.moveBy(.35, cc.v2(-200, 0)),
                                    )
                                )
                            }),
                            cc.delayTime(.5),
                            cc.callFunc(() => {
                                this.spin(() => {
                                    this.addHistory([res.dice1, res.dice2, res.dice3]);
                                    this.calculatorSoiCau();
                                    this.caculatorSoiCau();
                                    this.soiCauNhanh();
                                });
                            })
                        )
                    )

                    this.dice1.getComponent(cc.Sprite).spriteFrame =this.resultDices[res.dice1]
                    this.dice2.getComponent(cc.Sprite).spriteFrame =this.resultDices[res.dice2]
                    this.dice3.getComponent(cc.Sprite).spriteFrame =this.resultDices[res.dice3]
                    this.doorWin = [];
                    this.doorWin.push(res.dice1, res.dice2, res.dice3);
                    for(let i = 0 ; i < this.rebetData.length; i++) {
                        this.setLastBetBauCua(i, this.rebetData[i]);
                    }
                    break;
                }
                case cmd.Code.UPDATELISTUSER:{
                    let res = new cmd.ReceiveUpdateListUser(data);
                    this.listUsers = res.listUsers;
                    let listUsers = res.listUsers;
                    if(!this._isMyselfFirstLoginGame) {
                        this._isMyselfFirstLoginGame = true;
                        var myPlayerInformation = listUsers.find((myInfor) => myInfor.username == Configs.Login.Nickname);
                        this.players[0].getComponent(Player).leave();
                        this.players[0].getComponent(Player).set(myPlayerInformation.username, myPlayerInformation.avatar, myPlayerInformation.currentMoney);
                        this.listUsers.splice(this.listUsers.indexOf(myPlayerInformation), 1);
                    }
                    for(let i = 1 ; i < this.players.length; i++) {
                        this.players[i].getComponent(Player).leave();
                    }
                    for (let i = 0; i < this.listUsers.length; i++) {
                        let playerData = this.listUsers[i];
                        let player = this.getRandomEmptyPlayer();
                        if (player != null) {
                            if(player.nickname === playerData["username"]) continue;
                            player.leave();
                            let playerDataIndex = this.listUsers.indexOf(playerData);
                            player.set(playerData["username"], playerData["avatar"], playerData["currentMoney"]);
                            this.listUsers.splice(playerDataIndex, 1);
                        } else {
                            break;
                        }
                    }
                    this.lblTotalUser.getComponent(cc.Label).string = `${this.listUsers.length > this.players.length ? this.listUsers.length - this.players.length : 0}`;
                    break;
                }
                case cmd.Code.PRIZE: {
                    let res = new cmd.ReceivePrize(data);
                    //show win coin
                    Configs.Login.Coin = res.currentMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    break;
                }

                case cmd.Code.WINEFFECT :{
                    // trả về dữ liệu những người thắng và thực hiện effect cộng tiền
                    let res = new cmd.ResultMsgWinEffect(data);
                  //  console.log("list win user ================>" , res.listWins);
                    this.scheduleOnce(() => {
                        let chipsWithNickname: any = {};
                        for (let k in this.chipsInDoors) {
                            let doorId = parseInt(k);
                            let chips: Array<cc.Node> = this.chipsInDoors[doorId];
                            this.actPlaySoundEffect(this.soundCollectChip);
                            if (this.doorWin.indexOf(doorId) == -1) {
                                for(let i = 0 ; i < chips.length; i++) {
                                    cc.tween(chips[i])
                                        .delay(0.1)
                                        .to(0.4, {x: this.dealerHandsPoint.x, y: this.dealerHandsPoint.y})
                                        .to(0.1, {opacity: 0}, {easing: cc.easing.sineOut})
                                        .start();
                                }

                            } else {
                                for (let i = 0; i < chips.length; i++) {
                                    let chip = chips[i];
                                    let nickname = chip.name;
                                    if (!chipsWithNickname.hasOwnProperty(nickname)) {
                                        chipsWithNickname[nickname] = [];
                                    }
                                    chipsWithNickname[nickname].push(chip);
                                }
                            }
                        }
                        this.node.runAction(
                            cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    var chipNewNode = [];
                                    for(let doorId in this.chipsInDoors) {
                                        let doorIdInt = parseInt(doorId);
                                        let chips: Array<cc.Node> = this.chipsInDoors[doorIdInt];
                                        this.actPlaySoundEffect(this.soundRewardChip);
                                        if(this.doorWin.indexOf(doorIdInt) != -1) {
                                            let length = chips.length;
                                            for(let i = 0 ; i < length; i++) {
                                                let _pos = {position: this.dealerHandsPoint.position};
                                                // let chipNode = cc.instantiate(chips[i]);
                                                let chipNode = this.getWiningChip(chips[i], i);
                                                this.moveChipBet(_pos, doorIdInt, chipNode);
                                            }
                                        }
                                    }
                                }),
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    //move chip back to other users
                                    let _toOther = this.otherPlayer.node.position;
                                    for(let doorID in this.chipsInDoors) {
                                        let doorIdInt = parseInt(doorID);
                                        let chips: Array<cc.Node> = this.chipsInDoors[doorIdInt];
                                        if(this.doorWin.indexOf(doorIdInt) != -1) {
                                            for (let i = 0; i < chips.length; i++) {
                                                let chip = chips[i];
                                                let nickname = chip.name;
                                                let seatId = this.getPlayerInChair(nickname);
                                                if (seatId > -1) {
                                                    for(let i = 0 ; i < this.players.length; i++) {
                                                        if(this.players[i].nickname == nickname) {
                                                            cc.tween(chip)
                                                                .to(.4, {x: this.players[i].node.x, y: this.players[i].node.y})
                                                                .to(.1, {opacity: 0}, {easing: cc.easing.sineOut})
                                                                .start();
                                                        }
                                                    }
                                                } else {
                                                    cc.tween(chip)
                                                        .to(.4, {x: _toOther.x, y: _toOther.y})
                                                        .to(.1, {opacity: 0}, {easing: cc.easing.sineOut})
                                                        .start();
                                                }

                                            }
                                        }
                                    }
                                }),
                                cc.delayTime(.5),
                                cc.callFunc(() => {
                                    for(let i = 0 ; i < res.listWins.length; i++){
                                        let playerOnChair = this.getPlayer(res.listWins[i]["username"]);
                                        if(res.listWins[i]["username"] === Configs.Login.Nickname) {
                                            this.actPlaySoundEffect(this.soundUserWin);
                                            this._winJackpotPrize = res.listWins[i]["winMoney"];
                                        }
                                        if(playerOnChair!=null){
                                            playerOnChair.showWinCoin(res.listWins[i]["winMoney"]);
                                            playerOnChair.setCoin(res.listWins[i]["currentMoney"]);
                                        }
                                    }
                                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                })
                            )
                        )
                    }, 0);
                    this.setAnimationHu(res.funds,res.isNohu);
                    break;
                }

                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    this.actPlaySoundEffect(this.soundDatCuoc);
                    switch (res.result) {
                        case 100:
                            this.showToast("Đặt cược thất bại.");
                            break;
                        case 101:
                            this.showToast("Chưa tới thời gian đặt cược.");
                            break;
                        case 102:
                            this.showToast("Số dư không đủ.");
                            break;
                        case 103:
                            this.showToast("chỉ được cược tối đa 1000.000.");
                            break;
                    }
                    if (res.result != 1) {
                        break;
                    }
                    this.btnRebet.interactable = true;
                    Configs.Login.Coin = res.currentMoney;
                    this.players[0].setCoin(Configs.Login.Coin);
                    let btnPayBet = this.btnPayBets[res.potId];
                    let listCoin = this.convertMoneyToChipMoney(res.moneyBet);
                    for (let i = 0; i < listCoin.length; i++) {
                        let chip = this.getChip(listCoin[i]);
                        chip.name = Configs.Login.Nickname;
                        chip.position = this.players[0].node.position;
                        if (!this.chipsInDoors.hasOwnProperty(res.potId)) {
                            this.chipsInDoors[res.potId] = [];
                        }
                        this.chipsInDoors[res.potId].push(chip);
                        let position = btnPayBet.node.position.clone();
                        position.x += Random.rangeInt(-40,40);
                        position.y += Random.rangeInt(-25,20);
                        chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                    }
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        this.betting[i] = 0;
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                    }
                    this.beted[res.potId] += res.moneyBet;
                    this.rebetData[res.potId] += res.moneyBet;
                    for(let i = 0 ; i < this.rebetData.length; i++) {
                        this.setLastBetBauCua(i, this.rebetData[i]);
                    }
                    this.btnPayBets[res.potId].lblBeted.string = Utils.NFormatter(this.beted[res.potId]).toString();
                    break;
                }

                case cmd.Code.CHAT_ROOM:{
                    let res = new cmd.ReceivedChatRoom(data);
                    if(res.nickname.normalize() === Configs.Login.Nickname){
                        if (res.isIcon) {
                            this.players[0].showChatEmotion(res.content);
                        }else{
                            this.players[0].showChatMsg(res.content);
                        }
                    } else if (res.isIcon) {
                        // Chat Icon
                        let seatId = this.getPlayerInChair(res.nickname);
                        if (seatId > -1) {
                            this.players[seatId].showChatEmotion(res.content);
                        } else if(this.listUsers.length > this.players.length){
                            this.otherPlayer.showChatEmotion(res.content);
                        }
                    } else {
                        // Chat Msg
                        let seatId = this.getPlayerInChair(res.nickname);
                        if (seatId > -1) {
                            this.players[seatId].showChatMsg(res.content);
                        } else if(this.listUsers.length > this.players.length){
                            this.otherPlayer.showChatMsg(res.content);
                        }
                    }

                    break;
                }
                case cmd.Code.LICH_SU_NO_HU :{
                    let res = new cmd.ReceivedLichSuNoHu(data);
                    console.log(res);
                    this.PopUpLichSuNoHu.setData(res.listTras,res.rate);
                    this.PopUpLichSuNoHu.show();
                    break;
                }
            }
        }, this);


    }

    private resetView() {
        this.players.forEach(e => e.leave());
        this.btnPayBets.forEach(e => e.reset());
        this.dealer.setAnimation(0, "IDLE", true);
        this.clearChips();
        this.sprProgressTime.node.parent.active = false;
        this.time = 0;
    }
    
    showChatEmotion(content) {
        if (this.isHideChat) {
            return;
        }
        this.chatNode.active = false;
        this.chatEmotionNode.active = true;
        this.chatMsgNode.active = false;
        clearTimeout(this.timeoutChat);
        this.chatEmotionNode.getComponent(sp.Skeleton).setAnimation(0, `Emoji_${content}`, true);
        this.timeoutChat = setTimeout(() => {
            this.chatEmotionNode.active = false;
            this.chatMsgNode.active = false;
        }, 3000);
    }

    showChatMsg(content) {
        if (this.isHideChat) {
            return;
        }
        this.chatEmotionNode.active = false;
        this.chatMsgNode.active = true;
        clearTimeout(this.timeoutChat);
        let text = nodeUtils.getChildNode(this.chatMsgNode, "BG", "text");
        nodeUtils.setNodeLabel(text, content);
        this.timeoutChat = setTimeout(() => {
            this.chatEmotionNode.active = false;
            this.chatMsgNode.active = false;
        }, 3000);
    }

    setAnimationHu(funds:number,isNohu:boolean){
        Tween.numberTo(this.lblTongTienHu, funds, 2);
        if(isNohu){
            this.huAnimation.node.active = true;
            this.huAnimation.setAnimation(0,"hutim_big_in",false);
            this.scheduleOnce(() => {
                this.huAnimation.setAnimation(0,"hutim_big_loop",true);
                this.labelNoHu.node.active=true;
                Tween.numberTo(this.labelNoHu, this._winJackpotPrize, 1);
                Tween.numberTo(this.lblTongTienHu , funds,2);
            }, 3);
            this.scheduleOnce(()=>{
                this.huAnimation.setAnimation(0,"hutim_big_out",false);
                this.labelNoHu.node.active=false;
            },5)
            this.scheduleOnce(() => {
                this.huAnimation.node.active = false;
            }, 5.5);
        }
    }

    private getPotId(listPot: any[]) : number{
        for(let i=0 ; i< listPot.length ; i++){
            if(listPot[i] >0){
                return i
            }
        }
    }

    private getPlayerInChair(username : string) : number{
        for(let i = 0 ; i < this.players.length; i++){
            if(this.players[i].lblNickname.string == username){
                return i;
            }
        }
        return -1;
    }

    private getPlayer(username : string) : Player{
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].lblNickname.string == username) {
                return this.players[i];
            }
        }
        return null;
    }


    private clearChips() {
        this.chipTemplate.active = false;
        for (let i = 0; i < this.listChip.length; i++) {
            this.listChip[i].active = false;
        }
        this.chipsInDoors = {};
    }

    private spin(cb: () => void) {
        let idx = 0;
        let count = 7;
        this.schedule(() => {
            for (let i = 0; i < this.btnPayBets.length; i++) {
                let btnPayBet = this.btnPayBets[i];
                //btnPayBet.overlay.active = i != idx;
            }
            idx++;
            count--;
            if (idx == this.btnPayBets.length - 1) {
                idx = 0;
            }
            if (count == 0) {
                cb();
            }
        }, 0.07, count - 1, 0);
    }

    private longToTime(time: number): string {
        let m = parseInt((time / 60).toString());
        let s = time % 60;
        // return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        return (s < 10 ? "0" : "") + s;
    }

    private moneyToK(money: number): string {
        if(money<=0) return "";
        if (money < 1000) {
            return Utils.formatNumber(money);
        } if(money < 1000000){
            money = parseInt((money / 1000).toString());
            return Utils.formatNumber(money) + "K";
        }
        if( money >= 1000000)
        {
            money = parseInt((money / 1000000).toString());
            return Utils.formatNumber(money) + "M";
        }

    }

    private addHistory(dices: Array<number>) {

        if (this.itemHistoryTemplate.parent.childrenCount > 50) {
            this.itemHistoryTemplate.parent.children[1].removeFromParent();
            this.historiesData.splice(0, 1);
        }
        this.historiesData.push(dices);
        let item = cc.instantiate(this.itemHistoryTemplate);
        item.parent = this.itemHistoryTemplate.parent;
        item.active = true;
        item.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[0]];
        item.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[1]];
        item.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[2]];
    }

    private soiCauNhanh() {
        let maximumSoiCauNumber = 6;
        if(this.historiesData.length <= maximumSoiCauNumber) {
            for(let i = 0 ; i < this.nodeSoiCau.childrenCount; i++) {
                this.nodeSoiCau.children[i].active = false;
            }
            for(let i = 0 ; i < this.historiesData.length; i++) {
                let soiCauNhanhNode = this.nodeSoiCau.children[i];
                soiCauNhanhNode.active = true;
                let history = this.historiesData[i];
                if(i === this.historiesData.length - 1) {
                    soiCauNhanhNode.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[0]];
                    soiCauNhanhNode.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[1]];
                    soiCauNhanhNode.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[2]];
                } else {
                    soiCauNhanhNode.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[0]];
                    soiCauNhanhNode.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[1]];
                    soiCauNhanhNode.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[2]];
                }
            }
        } else {
            let historiesData = this.historiesData.slice(this.historiesData.length - 5);
            for(let i = 0 ; i < historiesData.length; i++) {
                let soiCauNhanhNode = this.nodeSoiCau.children[i];
                soiCauNhanhNode.active = true;
                let history = historiesData[i];
                if(i === historiesData.length - 1) {
                    soiCauNhanhNode.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[0]];
                    soiCauNhanhNode.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[1]];
                    soiCauNhanhNode.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDicesLatest[history[2]];
                } else {
                    soiCauNhanhNode.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[0]];
                    soiCauNhanhNode.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[1]];
                    soiCauNhanhNode.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[history[2]];
                }
            }
        }
    }
    private calculatorSoiCau() {
        let counts = [0, 0, 0, 0, 0, 0];
        let listName = ["nai", "bau", "ga", "ca", "cua", "tom"];
        for (let i = 0; i < this.historiesData.length; i++) {
            let dices = this.historiesData[i];
            for (let j = 0; j < 3; j++) {
                counts[dices[j]]++;
            }
        }
        for (let i = 0; i < counts.length; i++) {
            let node = nodeUtils.getChildNode(this.detailHistory, listName[i]);
            let lbl = nodeUtils.getChildNode(node, "lbl");
            let count = counts[i] < 10 ? "0" + counts[i] : counts[i].toString();
            nodeUtils.setNodeLabel(lbl, count);
        }
    }

    btnShowDetail() {
        let show = this.detailHistory.parent;
        show.stopAllActions();
        let newW = 300 - show.width;
        cc.tween(show)
            .to(0.3, {width: newW})
            .start();
    }

    private caculatorSoiCau() {
        let counts = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.historiesData.length; i++) {
            let dices = this.historiesData[i];
            for (let j = 0; j < 3; j++) {
                counts[dices[j]]++;
            }
        }
        for (let i = 0; i < this.lblsSoiCau.length; i++) {
            this.lblsSoiCau[i].string = counts[i].toString()+"%";
        }
    }

    // Chat
    showUIChat() {
        this.UI_Chat.stopAllActions();
        this.UI_Chat.active = true;
        nodeUtils.activeNode(this.bgChat);
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 0, 0)
        );
    }

    actShowLichSuHu(){
        BauCuaTo2NetworkClient.getInstance().send(new cmd.SendGetLichSu(this.roomId));
    }

    actCloseLichSuHu(){
        this.PopUpLichSuNoHu.dismiss();
    }

    closeUIChat() {
        nodeUtils.disableNode(this.bgChat);
        this.UI_Chat.stopAllActions();
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 2000, 0)
        );
    }
           // Chat
    showUIPhien() {
            this.UI_Phien.active = true;
            this.UI_Phien.runAction(
                cc.moveTo(0.5, 0, 0)
            );
        }

    closeUIPhien() {
            this.UI_Phien.runAction(
                cc.sequence(
                    cc.moveTo(0.5, 2000, 0),
                    cc.callFunc(() => {
                        this.UI_Phien.active = false;
                    })
                )
            );
        }

    actCloseMenuBack(){
        nodeUtils.disableNode(this.bgMenu);
        nodeUtils.activeNode(this.btnMenu);
        this.menuBack.runAction( cc.moveTo(0.5, -2000, 0))
    }

    actShowMenuBack(event, data){
        let btnMenu = event.currentTarget;
        nodeUtils.activeNode(this.bgMenu);
        nodeUtils.disableNode(this.btnMenu);
        this.menuBack.runAction( cc.moveTo(0.5, 0, 0));
    }


    chatEmotion(event, id) {
        cc.log(" chatEmotion id : ", id);
        BauCuaTo2NetworkClient.getInstance().send(new cmd.SendChatRoom(this.roomId,1, id));
    }

    chatMsg() {
        if (this.isHideChat) {
            return;
        }
        if (this.edtChatInput.string.trim().length > 0) {
            BauCuaTo2NetworkClient.getInstance().send(new cmd.SendChatRoom(this.roomId,0, this.edtChatInput.string));
            this.edtChatInput.string = "";

        }
    }

    private showToast(message: string) {
        App.instance.actShowThongBao(message);
    }

    actSoiCau() {

    }

    actCancel() {
        if (!this.inited) return;
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
            btnPayBet.lblBeted.string = Utils.NFormatter(this.beted[i]);
            this.betting[i] = 0;
        }
    }

    private listChip: cc.Node[] = [];
    private getChip(coin: number): cc.Node {
        let ret: cc.Node = null;
        for (let i = 0; i < this.listChip.length; i++) {
            if (!this.listChip[i].active) {
                ret = this.listChip[i];
                break;
            }
        }
        if (ret == null) {
            ret = cc.instantiate(this.chipTemplate);
            ret.parent = this.chips;
            this.listChip.push(ret);
        }
        let chipIdx = 0;
        for (let i = 0; i < this.listBet.length; i++) {
            if (this.listBet[i] == coin) {
                chipIdx = i;
                break;
            }
        }
        chipIdx -= this.minBetIdx;
        ret.getComponent(cc.Sprite).spriteFrame = this.sprChipSmalls[chipIdx];
        ret.opacity = 255;
        ret.active = true;
        ret.setSiblingIndex(this.chips.childrenCount - 1);
        return ret;
    }

    private convertMoneyToChipMoney(coin: number): Array<number> {
        let ret = new Array<number>();
        let _coin = coin;
        let minCoin = this.listBet[this.minBetIdx];
        let counter = 0;
        while (_coin >= minCoin || counter < 15) {
            for (let i = this.minBetIdx + this.buttonBets.length; i >= this.minBetIdx; i--) {
                if (_coin >= this.listBet[i]) {
                    ret.push(this.listBet[i]);
                    _coin -= this.listBet[i];
                    break;
                }
            }
            counter++;
        }
        return ret;
    }

    actConfirm() {
        if (!this.inited) return;
        if (!this.isBetting) {
            this.showToast("Chưa đến thời gian đặt cược.");
           // this.btnPayBets[i].lblBeted.string = this.moneyToK(0);
            return;
        }
        let total = 0;
        for (let i = 0; i < this.betting.length; i++) {
            total += this.betting[i];
        }
        if (total <= 0) {
            this.showToast("Bạn chưa đặt cửa.");
            return;
        }
        BauCuaTo2NetworkClient.getInstance().send(new cmd.SendBet(this.betting.toString()));
    }

    actReBet() {
        if (!this.inited) return;
        if (!this.isBetting) {
            this.showToast("Chưa đến thời gian đặt cược.");
            return;
        }
        if(this.getTotalLastBetBauCua() <= 0) {
            App.instance.actShowThongBao(`Chưa có dữ liệu đặt cược.`);
            return;
        }

        if(this.getTotalLastBetBauCua() > Configs.Login.Coin) {
            App.instance.actShowThongBao(`Số dư không đủ.`);
            return;
        }
        for(let i = 0 ; i < this._lastBetsBauCua.length; i++) {
            let listBetting = [0, 0, 0, 0, 0, 0];
            listBetting[i] = this._lastBetsBauCua[i];
            BauCuaTo2NetworkClient.getInstance().send(new cmd.SendBet(listBetting.toString()));
        }
    }




    show() {
        if (this.node === null || this.node.active) {
            return;
        }
        this.inited = false;
        this.labelNoHu.node.active = false;
        this.betIdx = 0;
        this.betting = [0, 0, 0, 0, 0, 0];
        this.historiesData = [];

        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], i == this.betIdx);
        }

        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.lblBeted.string = "";
            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
            btnPayBet.lblTotal.string = "";
            btnPayBet.overlay.active = true;
        }


    }

    actBack() {
        BauCuaTo2NetworkClient.getInstance().send(new cmd.SendUnScribe(this.roomId));
        cc.audioEngine.stopAll();
        this.clearLastBetBauCua();
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        BauCuaTo2NetworkClient.getInstance().close();
    }

    protected onDestroy() {
        BauCuaTo2NetworkClient.getInstance().close();
        BauCuaController.instance = null;
    }

    actActiveBetChip(betChip: cc.Node, isActive: boolean) {
        let active = nodeUtils.getChildNode(betChip, "active");
        active.stopAllActions();
        if (isActive) {
            nodeUtils.activeNode(active);
            active.opacity = 255;
            betChip.scale = .9;
        } else {
            betChip.scale = .9;
            active.stopAllActions();
            active.opacity = 255;
            nodeUtils.disableNode(active);
        }
        betChip.getComponent(cc.Button).interactable = !isActive;
    }

    actMove(pos: cc.Vec2, chipSrc: cc.Node) {
        chipSrc.runAction(cc.moveTo(0.05, pos));
    }

    actMoveNextListChip() {
        this.actMove(cc.v2(this.buttonBets[0].x - 300, this.buttonBets[0].y), this.buttonBets[0]);
        for (let i = 1; i < this.buttonBets.length; i++) {
            let prev = this.buttonBets[i - 1];
            let curr = this.buttonBets[i];
            this.actMove(prev.position, curr);
        }
    }

    actMovePrevListChip() {
        this.actMove(cc.v2(this.buttonBets[this.buttonBets.length - 1].x + 300,
                this.buttonBets[this.buttonBets.length - 1].y),
            this.buttonBets[this.buttonBets.length - 1]);
        for (let i = this.buttonBets.length - 1; i > 0; i--) {
            let curr = this.buttonBets[i];
            let prev = this.buttonBets[i - 1];
            this.actMove(curr.position, prev);
        }
    }

    actNextLeft() {
        this.betIdx--;
        if (this.betIdx < 0) {
            this.betIdx = 0;
        }
        if (this.betIdx == this.stepToPrev) {
            this.actMovePrevListChip();
            this.stepToNext--;
            this.stepToPrev--;
        }
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], false);
        }
        this.actActiveBetChip(this.buttonBets[this.betIdx], true);
    }

    actNextRight() {
        this.betIdx++;
        if (this.betIdx >= this.buttonBets.length - 1) {
            this.betIdx = this.buttonBets.length - 1;
        }
        if (this.betIdx == this.stepToNext) {
            this.actMoveNextListChip();
            this.stepToNext++;
            this.stepToPrev++;
        }
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], false);
        }
        this.actActiveBetChip(this.buttonBets[this.betIdx], true);
    }



    dismiss() {

        this.actBack();
        for (let i = 1; i < this.itemHistoryTemplate.parent.childrenCount; i++) {
            this.itemHistoryTemplate.parent.children[i].destroy();
        }

    }

    actShowListUsers() {
        this.actClick();
        let popupListUser = cc.instantiate(this.prefabPopupListUser);
        popupListUser.getComponent(BauCuaTo2PaneShowListUser).showListUser(this.listUsers);
        this.node.addChild(popupListUser);
    }

    update(dt){
    if (this.curTime > 0) {
        let timeLeft = Math.max(0, this.curTime - TimeUtils.currentTimeMillis());
        this.sprProgressTime.fillRange = timeLeft / (this._runningSessionTime * 1000);
        if (timeLeft == 0) {
            this.curTime = 0;
        }
    }
  }

    private getRandomEmptyPlayer(): Player {
        let emptyPlayers = new Array<Player>();
        for (let i = 1; i < this.players.length; i++) {
            if (this.players[i].nickname == "") emptyPlayers.push(this.players[i]);
        }
        if (emptyPlayers.length > 0) {
            return emptyPlayers[Random.rangeInt(0, emptyPlayers.length)];
        }
        return null;
    }


    onShowApp() {
        this.nodeBlack.active = true;
        this.nodeBlack.opacity = 0;
        this.nodeBlack.runAction(
            cc.sequence(
                cc.fadeIn(.25),
                cc.fadeOut(.25),
                cc.callFunc(() => {
                    this.nodeBlack.active = false;
                })
            )
        )
        this.chipsInDoors = {};
        this.chips.removeAllChildren(true);
        this.listChip = [];
        this.resetAllDataWhenShow();
    }

    onHideApp() {
        this.nodeBlack.active = false;
    }

    actClick() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    actPlaySoundEffect(soundEffect) {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(soundEffect, false, 1);
        }
    }

    onClickBtnChoseEntry(event, data) {
        this.setMucCuoc(parseInt(data));
        this.actClick();
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], false);
        }
        this.actActiveBetChip(this.buttonBets[this.mucCuocDangLuaChonIndex], true);
    }

    setMucCuoc(chipIndex) {
        if(this.mucCuocDangLuaChonIndex !== chipIndex) {
            this.mucCuocDangLuaChonIndex = chipIndex;
            this.betIdx = this.mucCuocDangLuaChonIndex;
            this.nextCoinBtn.interactable = this.mucCuocDangLuaChonIndex < this.listBet.length - 1;
            this.previousCoinBtn.interactable = this.mucCuocDangLuaChonIndex > 0;
            this._currentChoosingCoinValue = this.listBet[this.mucCuocDangLuaChonIndex];
        }
    }

    onClickNextChoseCoin() {
        this.actClick();
        if(this.mucCuocDangLuaChonIndex < this.listBet.length - 1) {
            this.setMucCuoc(this.mucCuocDangLuaChonIndex + 1);
            this.scrollToOffset(this.mucCuocDangLuaChonIndex, .2);
        }
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], false);
        }
        this.actActiveBetChip(this.buttonBets[this.mucCuocDangLuaChonIndex], true);
    }

    onClickPreChoseCoin() {
        this.actClick();
        if(this.mucCuocDangLuaChonIndex > 0) {
            this.setMucCuoc(this.mucCuocDangLuaChonIndex - 1);
            this.scrollToOffset(this.mucCuocDangLuaChonIndex, .2);
        }
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.actActiveBetChip(this.buttonBets[i], false);
        }
        this.actActiveBetChip(this.buttonBets[this.mucCuocDangLuaChonIndex], true);
    }

    scrollToOffset(chipIndex, duration = 0) {
        let disChoseCoin = 135;
        let i = -280 - Math.min(chipIndex, this.buttonBets.length - 4) * disChoseCoin;
        let contentListMucCuoc = this.scrollListChip.content;
        if(contentListMucCuoc.getNumberOfRunningActions() > 0) {
            contentListMucCuoc.stopAllActions();
        }
        if(duration > 0) {
            if(i > contentListMucCuoc.x) {
                contentListMucCuoc.runAction(
                    cc.moveTo(duration, i, contentListMucCuoc.y)
                )
            } else {
                if(-280 - chipIndex * disChoseCoin <= contentListMucCuoc.x - 3.8 * disChoseCoin) {
                    contentListMucCuoc.runAction(
                        cc.moveTo(duration, -280 - chipIndex * disChoseCoin + 3 * disChoseCoin, contentListMucCuoc.y)
                    );
                }
            }
        } else {
            contentListMucCuoc.x = i;
        }
        this.previousY = this.scrollListChip.getScrollOffset().x;
    }

    moveChipBet(nodeFrom, doorId, _chip) {
        if(!this.chipsInDoors.hasOwnProperty(doorId)) {
            this.chipsInDoors[doorId] = [];
        }
        let nodeTo = this.btnPayBets[doorId].node;
        // this.chips.addChild(_chip);
        this.chipsInDoors[doorId].push(_chip);
        let _diff_x = Random.rangeInt(-50,50);
        let _diff_y = Random.rangeInt(-25,20);
        let _pos = cc.v2(nodeTo.x + _diff_x, nodeTo.y + _diff_y);
        _chip.position = nodeFrom.position;
        _chip.stopAllActions();
        _chip.runAction(
            cc.moveTo(0.5, _pos)
        );
    }

    actShowPopupHonor() {
        this.actClick();
        let popupHonor = cc.instantiate(this.prefabPopupHonor);
        this.node.addChild(popupHonor);
    }

    actShowPopupTransaction() {
        this.actClick();
        let popupTransaction = cc.instantiate(this.prefabPopupTransation);
        this.node.addChild(popupTransaction);
    }

    actShowPopupGuide() {
        this.actClick();
        if(this.prefabPopupGuide) {
            let popupGuide = cc.instantiate(this.prefabPopupGuide);
            this.node.addChild(popupGuide);
        }
    }

    onRebetClick() {
        this.actClick();
        if(this.getTotalLastBetBauCua() <= 0) {
            App.instance.actShowThongBao(`Chưa có dữ liệu đặt cược.`);
        }
        for(let i = 0 ; i < this.rebetData.length; i++) {
            if(this.rebetData[i] != 0) {
                let betArray = [0, 0, 0, 0, 0, 0];
                betArray[i] += this.rebetData[i];
                BauCuaTo2NetworkClient.getInstance().send(new cmd.SendBet(betArray.toString()));
            }
        }
    }

    onAutoRebetClick() {
        this.actClick();
        for(let keys in this._lastBetsBauCua) {
            let betArray = [0, 0, 0, 0, 0, 0];
            betArray[keys] += this._lastBetsBauCua[keys];
            BauCuaTo2NetworkClient.getInstance().send(new cmd.SendBet(betArray.toString()));
        }
        this.isAutoReBetted = true;
    }

    onClickAutoRebet() {
        if(this.getTotalLastBetBauCua() <= 0) {
            App.instance.actShowThongBao(`Không có dữ liệu đặt cược.`);
            this.toggleAutoRebet.isChecked = false;
            return;
        } else {
            if(this.toggleAutoRebet.isChecked) {
                App.instance.actShowThongBao(`Kích hoạt: Tự động cược lại mỗi ván.`);
            } else {
                App.instance.actShowThongBao(`Hủy tự động cược lại.`);
            }
        }
    }

    checkAutoRebet() {
        return !!this.toggleAutoRebet.isChecked;
    }

    getTotalLastBetBauCua() {
        let totalBet = 0;
        for(let i = 0 ; i < this._lastBetsBauCua.length; i++) {
            let lastBet = this._lastBetsBauCua[i];
            if(lastBet > 0) {
                totalBet += lastBet;
            }
        }
        return totalBet;
    }

    clearLastBetBauCua() {
        for(let i = 0 ; i < this._lastBetsBauCua.length; i++) {
            this._lastBetsBauCua[i] = 0;
        }
    }

    setLastBetBauCua(betIdx, value) {
        this._lastBetsBauCua[betIdx] = value;
    }

    resetAllDataWhenShow() {
        let chen = this.caibat.getChildByName('chen');
        this.caibat.scale = 0.5;
        this.caibat.rotation = 0;
        chen.opacity = 255;
        chen.x = 0;
        this.caibat.stopAllActions();
        this.btnPayBets.forEach(gate => gate.overlay.active = false);
        this.players.forEach(player => player.hideWinCoin());
        this.huAnimation.node.active = false;
        this.unscheduleAllCallbacks();
    }

    private getWiningChip(chipNode, chipIdx) {
        let chip: cc.Node = null;
        if (!this.chipPool[chipIdx].active) {
            chip = this.chipPool[chipIdx];
        }

        if(chipIdx > this.chipPool.length - 1 || chip == null) {
            chip = cc.instantiate(this.chipTemplate);
            chip.parent = this.chips;
            this.chipPool.push(chip);
        }
        chip.opacity = 255;
        chip.active = true;
        chip.getComponent(cc.Sprite).spriteFrame = chipNode.getComponent(cc.Sprite).spriteFrame;
        chip.name = chipNode.name;
        chip.setSiblingIndex(this.chips.childrenCount - 1);
        return chip;
    }

    private _initWinningChipPool() {
        for(let i = 0; i < 1000; i++) {
            let chip = cc.instantiate(this.chipTemplate);
            chip.parent = this.chips;
            chip.getComponent(cc.Sprite).spriteFrame = this.sprChipSmalls[Math.floor(Math.random() * (this.sprChipSmalls.length - 1))];
            this.chipPool.push(chip);
        }
    }

    protected onEnable() {
        this._initWinningChipPool();
    }
}
