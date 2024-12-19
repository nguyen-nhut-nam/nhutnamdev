import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import cmd from "./XocDia.Cmd";
import Player from "./XocDia.Player";
import Random from "../../../scripts/common/Random";
import Configs from "../../../scripts/common/Configs";
import XocDiaController from "./XocDia.XocDiaController";
import BtnPayBet from "./XocDia.BtnPayBet";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import TimeUtils from "../../../scripts/common/TimeUtils";
import App from "../../../scripts/common/App";
import BtnBet from "./XocDia.BtnBet";
import Utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import Dialog from "../../../scripts/common/Dialog";
import XocDiaListUser from "./XocDia.ListUser";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Play extends cc.Component {
    public static instance: Play = null;
    @property(Player)
    mePlayer: Player = null;
    @property([Player])
    players: Player[] = [];
    @property([BtnBet])
    btnBets: BtnBet[] = [];
    @property([BtnPayBet])
    btnPayBets: BtnPayBet[] = [];
    @property(sp.Skeleton)
    dealer: sp.Skeleton = null;
    @property(cc.Node)
    dealerHandPoint: cc.Node = null;
    @property(sp.Skeleton)
    bowl: sp.Skeleton = null;
    @property([cc.SpriteFrame])
    sprChipSmalls: cc.SpriteFrame[] = [];
    @property(cc.Node)
    chips: cc.Node = null;
    @property(cc.Node)
    chipTemplate: cc.Node = null;
    @property(cc.Sprite)
    sprProgressTime: cc.Sprite = null;
    // @property(PanelPayDoor)
    // panelPayDoor: PanelPayDoor = null;
    @property(cc.Label)
    lblHistoryOdd: cc.Label = null;
    @property(cc.Label)
    lblHistoryEven: cc.Label = null;
    @property(cc.SpriteFrame)
    sfOdd: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightOdd = null;
    @property(cc.SpriteFrame)
    sfEven: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightEven = null;

    @property(cc.Node)
    lblHistoryItems: cc.Node = null;
    // @property(cc.Button)
    // btnLamCai: cc.Button = null;
    // @property(cc.Button)
    // btnHuyLamCai: cc.Button = null;
    // @property(BankerControl)
    // bankerControl: BankerControl = null;

    @property([cc.Label])
    currentBetList: cc.Label[] = [];

    @property(cc.Label)
    other_Player: cc.Label = null;

    @property(cc.Node)
    otherPlayer: cc.Node = null;

    @property(cc.Node)
    otherChipPoint1 : cc.Node = null;

    @property(cc.Node)
    otherChipPoint2 : cc.Node = null;

    @property({ type: cc.AudioClip })
    musicBackground: cc.AudioClip = null;
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
    @property({ type: cc.AudioClip })
    soundStartSession: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick= null;
    @property(cc.Prefab)
    prefabPopupHonor = null;
    @property(cc.Prefab)
    prefabPopupTransation = null;
    @property(cc.Prefab)
    prefabPopupGuide = null;
    @property(cc.Prefab)
    prefabPopupListUser = null;
    @property([cc.Node])
    nodeResult = [];
    @property([cc.SpriteFrame])
    spriteFrameResult = [];
    @property(cc.Node)
    mainBowl = null;
    @property(cc.ScrollView)
    scrollListChip = null;
    @property(cc.Button)
    nextCoinBtn = null;
    @property(cc.Button)
    previousCoinBtn = null;
    @property(cc.Node)
    slotMachine = null;
    @property(sp.Skeleton)
    canGat = null;
    @property(cc.Toggle)
    toggleAutoRebet = null;
    @property([cc.SpriteFrame])
    sprDicesBlur = [];
    @property([cc.SpriteFrame])
    sprDices = [];
    @property(cc.Node)
    btnMenu = null;
    @property(cc.Node)
    nodeBlack = null;

    private inited = false;
    private roomId = 0;

    private chipsInDoors: any = {};
    private lastBowlStateName = "";
    private curTime = 0;
    private gameState = 0;
    private readonly listBets = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];
    private betIdx = 0;
    private minBetIdx = 0;
    private isBanker = false;
    private banker = "nhacai";
    private listBetcurrents =[0,0,0,0,0,0];
    private lastUpdateTime = TimeUtils.currentTimeMillis();

    private remoteMusicBackground = null;
    private _listUser = [];
    private _stepToNext = 4;
    private _stepToPrev = -1;

    private _runningSessionTime = 1;
    private mucCuocDangLuaChonIndex = 0;
    private _currentChoosingCoinValue = 0;
    private scrollVelocity = 0;
    private previousY = 0;
    private rebetData: any;
    private bettingTime = 0;
    private listChip: cc.Node[] = [];
    private chipPool: cc.Node[] = [];

    protected onEnable() {
        this._reset();
        this._initWinningChipPool();
    }

    protected onLoad() {
        Play.instance = this;
    }

    start() {
        cc.game.on(cc.game.EVENT_SHOW, this.onShowApp, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHideApp, this);
        this.remoteMusicBackground = cc.audioEngine.playMusic(this.musicBackground, true);
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btn = this.btnPayBets[i];
            btn.node.on("click", () => {
                this.actClick();
                if(Configs.Login.Coin <this.listBets[this.betIdx] ) {
                    App.instance.actShowThongBao("Số dư của bạn không đủ để đặt cược");
                }
                if (this.gameState != 2) {
                    App.instance.actShowThongBao("Ván chơi chưa bắt đầu");
                    return;
                }
                if (this.isBanker) {
                    App.instance.alertDialog.showMsg("Bạn đang làm cái.");
                    return;
                }
                XocDiaNetworkClient.getInstance().send(new cmd.SendPutMoney(i, this.listBets[this.betIdx]));
            });
        }

        for (let i = 0; i < this.btnBets.length; i++) {
            let btnBet = this.btnBets[i];
            btnBet.active.runAction(cc.repeatForever(
                cc.sequence(cc.fadeIn(0.5),
                    cc.fadeOut(0.4)
                )));
            btnBet.node.on("click", () => {
                this.betIdx = this.minBetIdx + i;
                for (let j = 0; j < this.btnBets.length; j++) {
                    this.btnBets[j].active.active = j == i;
                }
            });
        }
    }

    _initWinningChipPool() {
        for(let i = 0; i < 1000; i++) {
            let chip = cc.instantiate(this.chipTemplate);
            chip.parent = this.chips;
            chip.getComponent(cc.Sprite).spriteFrame = this.sprChipSmalls[Math.floor(Math.random() * (this.sprChipSmalls.length - 1))];
            this.chipPool.push(chip);
        }
    }

    _reset() {
        this.rebetData = {};
    }

    resetBetlist(){ // reset
        for(var i =0 ; i< this.currentBetList.length; i++){
             this.currentBetList[i].string="";
             this.listBetcurrents[i] =0;
        }
    }

    update(dt) {
        if (this.curTime > 0) {
            let timeLeft = Math.max(0, this.curTime - TimeUtils.currentTimeMillis());
            this.sprProgressTime.fillRange = timeLeft / (this._runningSessionTime * 1000);
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
    }

    setOtherPlayer(){
        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }
    public init() {
        if (this.inited) return;
        this.inited = true;

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.mePlayer.setCoin(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        XocDiaNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceiveJoinRoomSuccess(data);
                        this._runningSessionTime = res.totalBetTime;
                        this.curTime = TimeUtils.currentTimeMillis() + res.remainBetTime * 1000;
                        this.resetSlotMachine();
                        this.show(res);
                        // this.setOtherPlayer();
                        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListUser());
                    }
                    break;
                case cmd.Code.USER_JOIN_ROOM_SUCCESS:
                    {
                        let res = new cmd.ReceiveUserJoinRoom(data);
                        let player = this.getRandomEmptyPlayer();
                        if (player != null) {
                            player.set(res.nickname, res.avatar, res.money, false);
                        }
                    }
                    break;
                case cmd.Code.USER_OUT_ROOM:
                    {
                        let res = new cmd.ReceiveUserOutRoom(data);
                        let player = this.getPlayer(res.nickname);
                        if (player != null) player.leave();
                    }
                    break;
                case cmd.Code.GET_LIST_USER:
                    {
                        let res = new cmd.ReceiveListUser(data);
                        for(let i = 1 ; i < this.players.length; i++) {
                            if(this.players[i].nickname && this.players[i].nickname !== "") {
                                this.players[i].leave();
                            }
                        }
                        this._listUser = res.playerInfos;
                        if(this._listUser.length > this.players.length - 1) {
                            this._listUser = this._listUser.slice(this.players.length - 1);
                        }
                        this.other_Player.string = `${res.playerInfos.length > this.players.length - 1 ? res.playerInfos.length - this.players.length + 1 : 0}`;
                        for (let i = 0; i < res.playerInfos.length; i++) {
                            let playerData = res.playerInfos[i];
                            let player = this.getRandomEmptyPlayer();
                            if (player != null) {
                                player.set(playerData["nickname"], playerData["avatar"], playerData["money"], playerData["banker"]);
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                case cmd.Code.GETLISTROOM:
                    {
                        let res = new cmd.ReceiveGetListRoom(data);
                        let itemData = res.list[0];
                        let currentUser =   itemData["userCount"] ;
                         if(currentUser>9){
                            this.other_Player.string =  (currentUser - 9)+"";
                        }else{
                            this.other_Player.string = "0";
                        }

                    }
                    break;
                case cmd.Code.QUIT_ROOM:
                    {
                        let res = new cmd.ReceiveLeavedRoom(data);
                        this.node.active = false;
                        switch (res.reason) {
                            case 1:
                               // App.instance.loadScene("lobby");
                                XocDiaController.instance.closeGameAndShowDialg("Bạn không đủ tiền để tham gia phòng!");
                                break;
                            case 2:
                             //   App.instance.loadScene("lobby");

                                XocDiaController.instance.closeGameAndShowDialg("Hệ thống đang tạm thời bảo trì!");
                                break;
                            case 5:
                             //   App.instance.loadScene("lobby");

                                XocDiaController.instance.closeGameAndShowDialg("Bạn bị mời ra khỏi phòng vì quá lâu không tương tác!");
                                break;
                            case 6:
                                //App.instance.loadScene("lobby");

                                XocDiaController.instance.closeGameAndShowDialg("Nhà cái đã kick bạn ra khỏi phòng!");
                                break;
                        }

                    }
                    break;
                case cmd.Code.DANG_KY_THOAT_PHONG:
                    {
                        let res = new cmd.ReceiveLeaveRoom(data);
                        //console.log(res);
                        if (res.bRegis) {
                            App.instance.alertDialog.showMsg("Đã đăng ký rời phòng.");
                        } else {
                            App.instance.alertDialog.showMsg("Đã huỷ đăng ký rời phòng.");
                        }
                    }
                    break;
                case cmd.Code.ACTION_IN_GAME:
                    {
                        let res = new cmd.ReceiveActionInGame(data);
                        // console.log(res);
                        let msg = "";
                        this.gameState = res.action;
                        switch (res.action) {
                            case 1://bat dau van moi
                                this.sprProgressTime.node.parent.active = false;
                                break;
                            case 2://bat dau dat cua
                                this.sprProgressTime.node.parent.active = true;
                                if(this.checkAutoRebet()) {
                                    this.onAutoRebetClick();
                                }
                                this.dealer.setAnimation(0, "DEAL", false);
                                let label = this.dealer.node.children[0].children[0].getComponent(cc.Label);
                                label.node.parent.scale = 0;
                                this.scheduleOnce(() => {
                                    label.node.parent.runAction(
                                        cc.sequence(
                                            cc.scaleTo(.3, 1),
                                            cc.delayTime(3),
                                            cc.scaleTo(.3, 0),
                                        )
                                    )
                                }, 0.3);
                                this.curTime = TimeUtils.currentTimeMillis() + res.time * 1000;
                                this._runningSessionTime = res.time;
                                break;
                            case 3://bat dau ban cua
                                this.sprProgressTime.node.parent.active = false;
                                break;
                            case 5://bat dau hoan tien
                                this.sprProgressTime.node.parent.active = false;
                                break;
                            case 6://bat dau tra thuong
                                this.sprProgressTime.node.parent.active = false;
                                break;
                        }
                    }
                    break;
                case cmd.Code.START_GAME:
                    {
                        let res = new cmd.ReceiveStartGame(data);
                        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListUser());
                        if (res.banker != "" && res.banker != Configs.Login.Nickname && this.isBanker) {
                            App.instance.alertDialog.showMsg("Bạn không đủ tiền để tiếp tục làm cái!");
                        }
                        this.actPlaySoundEffect(this.soundStartSession);
                        this.banker = res.banker;
                        this.isBanker = this.banker == Configs.Login.Nickname;

                        for (let i = 0; i < this.players.length; i++) {
                            let player = this.players[i];
                            player.banker.active = player.nickname != "" && player.nickname == this.banker;
                        }
                        this.bowl.node.active = true;
                        let chen = this.mainBowl.getChildByName('chen');
                        this.mainBowl.scale = 0.5;
                        chen.opacity = 255;
                        chen.x = 0;
                        this.bowl.setAnimation(0, `xoc_dia`, false);
                        let bowlShakeCompleteTime = 1.05;
                        this.scheduleOnce(() => {
                            this.bowl.node.active = false;
                        }, bowlShakeCompleteTime);

                        this.btnPayBets.forEach(e => e.reset());
                        this.clearChips();
                        this.resetBetlist();
                        this.playSlotMachine();
                        this.actPlaySoundEffect(this.soundXocDia);

                    }
                    break;
                case cmd.Code.PUT_MONEY:
                    {
                        let res = new cmd.ReceivePutMoney(data);
                        let btnPayBet = this.btnPayBets[res.potId];
                        btnPayBet.setTotalBet(res.potMoney);
                        this.scheduleOnce(() => {
                            this.actPlaySoundEffect(this.soundDatCuoc);
                        }, 1);
                        if (res.nickname == Configs.Login.Nickname) {

                            this.listBetcurrents[res.potId] += res.betMoney;
                            if(this.listBetcurrents[res.potId] != 0) {
                                this.rebetData[res.potId] = this.listBetcurrents[res.potId];
                            }
                            this.currentBetList[res.potId].string = Utils.NFormatter(this.listBetcurrents[res.potId]);
                            switch (res.error) {
                                case 0:
                                    break;
                                case 1:
                                    App.instance.alertDialog.showMsg("Bạn không đủ tiền!");
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

                        let player = this.getPlayer(res.nickname);
                        if (player != null) {
                            player.setCoin(res.currentMoney);
                            let listCoin = this.convertMoneyToChipMoney(res.betMoney);
                            for (let i = 0; i < listCoin.length; i++) {
                                let chip = this.getChip(listCoin[i]);
                                chip.name = player.nickname;
                                chip.position = player.node.position;
                                if (!this.chipsInDoors.hasOwnProperty(res.potId)) {
                                    this.chipsInDoors[res.potId] = [];
                                }
                                this.chipsInDoors[res.potId].push(chip);

                                let position = btnPayBet.node.position.clone();
                                position.x += Random.rangeInt(-50,50);
                                position.y += Random.rangeInt(-25,20);
                                chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                            }
                        } else {
                            let listCoin = this.convertMoneyToChipMoney(res.betMoney);
                            for (let i = 0; i < listCoin.length; i++) {
                                let chip = this.getChip(listCoin[i]);
                                chip.name = "other_player_in_room_okd";
                                chip.position = this.otherPlayer.position;
                                if (!this.chipsInDoors.hasOwnProperty(res.potId)) {
                                    this.chipsInDoors[res.potId] = [];
                                }
                                this.chipsInDoors[res.potId].push(chip);

                                let position = btnPayBet.node.position.clone();
                                position.x += Random.rangeInt(-50,50);
                                position.y += Random.rangeInt(-25,20);
                                chip.runAction(cc.moveTo(0.5, position).easing(cc.easeSineOut()));
                            }
                        }
                    }
                    break;
                case cmd.Code.BANKER_SELL_GATE:
                    {
                        // let res = new cmd.ReceiveBankerSellGate(data);
                        // //console.log(res);
                        //
                        // if (res.action != 1) {
                        //     this.panelPayDoor.show(res.action, res.moneySell);
                        // }
                    }
                    break;
                case cmd.Code.BUY_GATE:
                    {
                        // let res = new cmd.ReceiveBuyGate(data);
                        // //console.log(res);
                        //
                        // if (res.nickname == Configs.Login.Nickname) {
                        //     let msg = "";
                        //     switch (res.error) {
                        //         case 0:
                        //             //nothing
                        //             break;
                        //         case 1:
                        //             msg = "Bạn không đủ tiền để mua cửa!";
                        //             break;
                        //         case 2:
                        //             msg = "Nhà cái đã bán cửa xong!";
                        //             break;
                        //         default:
                        //             msg = "Lỗi " + res.error + ", không xác định.";
                        //             break;
                        //     }
                        //     if (msg != "") {
                        //         App.instance.alertDialog.showMsg(msg);
                        //         break;
                        //     }
                        // }
                        // this.panelPayDoor.addUser(res.nickname, res.moneyBuy, res.rmMoneySell);
                    }
                    break;
                case cmd.Code.REFUN_MONEY:
                    {
                        // let res = new cmd.ReceiveRefunMoney(data);
                        // //console.log(res);
                        //
                        // this.panelPayDoor.node.active = false;
                        // this.bankerControl.node.active = false;
                        //
                        // for (let i = 0; i < res.playerInfosRefun.length; i++) {
                        //     let rfData = res.playerInfosRefun[i];
                        //     let player = this.getPlayer(rfData["nickname"]);
                        //     if (player != null) {
                        //         player.showRefundCoin(rfData["moneyRefund"]);
                        //         player.setCoin(rfData["currentMoney"]);
                        //     }
                        //     if (rfData["nickname"] == Configs.Login.Nickname) {
                        //         Configs.Login.Coin = rfData["currentMoney"];
                        //         BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        //     }
                        // }
                        //
                        // for (let i = 0; i < res.potID.length; i++) {
                        //     let potData = res.potID[i];
                        //     this.btnPayBets[i].setTotalBet(potData["totalMoney"]);
                        // }
                    }
                    break;
                case cmd.Code.FINISH_GAME:
                    {
                        let res = new cmd.ReceiveFinishGame(data);
                        // console.log(res);

                        this.stopSlotMachine();
                        // this.panelPayDoor.node.active = false;
                        // this.bankerControl.node.active = false;

                        for (let i = 0; i < res.playerInfoWin.length; i++) {
                            let playerData = res.playerInfoWin[i];
                            if (playerData["nickname"] == Configs.Login.Nickname) {
                                Configs.Login.Coin = playerData["currentMoney"];
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                break;
                            }
                        }

                        for (let i = 0; i < res.diceIDs.length; i++) {
                            if (res.diceIDs[i] == 1) {
                                this.nodeResult[i].getComponent(cc.Sprite).spriteFrame = this.spriteFrameResult[0];
                            } else {
                                this.nodeResult[i].getComponent(cc.Sprite).spriteFrame = this.spriteFrameResult[1];
                            }
                        }
                        let chen = this.mainBowl.getChildByName('chen');
                        let dia = this.mainBowl.getChildByName('dia');
                        this.mainBowl.scale = 0.5;
                        chen.opacity = 255;
                        chen.x = 0;
                        this.mainBowl.runAction(
                            cc.sequence(
                                cc.scaleTo(.2, 1),
                                cc.delayTime(.5),
                                cc.callFunc(() => {
                                    this.actPlaySoundEffect(this.soundMoBat);
                                    chen.runAction(
                                        cc.sequence(
                                            cc.moveBy(.7, cc.v2(200, 0)),
                                            cc.fadeOut(.2),
                                        )
                                    )
                                }),
                                cc.delayTime(3),
                                cc.scaleTo(.2, .5),
                                cc.delayTime(1.5),
                                cc.callFunc(() => {
                                    chen.runAction(
                                        cc.sequence(
                                            cc.fadeIn(.2),
                                            cc.moveBy(.7, cc.v2(-200, 0)),
                                        )
                                    )
                                }),
                            )
                        )
                        let doorWins = [];

                        for(let i = 0; i < res.infoAllPot.length; i++) {
                            let potInfo = res.infoAllPot[i];
                            if(potInfo.win) {
                                doorWins.push(potInfo.potId);
                            }
                        }

                        this.scheduleOnce(() => {
                            doorWins.forEach(door => this.btnPayBets[door].active.active = true);
                            let chipsWithNickname: any = {};
                            for (let k in this.chipsInDoors) {
                                let doorId = parseInt(k);
                                let chips: Array<cc.Node> = this.chipsInDoors[doorId];
                                this.actPlaySoundEffect(this.soundCollectChip);
                                if (doorWins.indexOf(doorId) == -1) {
                                    for(let i = 0 ; i < chips.length; i++) {
                                        cc.tween(chips[i])
                                            .delay(0.1)
                                            .to(0.4, {x: this.dealerHandPoint.x, y: this.dealerHandPoint.y})
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
                                    cc.delayTime(2),
                                    cc.callFunc(() => {
                                        var chipNewNode = [];
                                        for(let doorId in this.chipsInDoors) {
                                            let doorIdInt = parseInt(doorId);
                                            let chips: Array<cc.Node> = this.chipsInDoors[doorIdInt];
                                            this.actPlaySoundEffect(this.soundRewardChip);
                                            if(doorWins.indexOf(doorIdInt) != -1) {
                                                let length = chips.length;
                                                for(let i = 0 ; i < length; i++) {
                                                    let _pos = {position: this.dealerHandPoint.position};
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
                                        let _toOther = this.otherPlayer.position;
                                        for(let doorID in this.chipsInDoors) {
                                            let doorIdInt = parseInt(doorID);
                                            let chips: Array<cc.Node> = this.chipsInDoors[doorIdInt];
                                            if(doorWins.indexOf(doorIdInt) != -1) {
                                                for (let i = 0; i < chips.length; i++) {
                                                    let chip = chips[i];
                                                    let nickname = chip.name;
                                                    for(let i = 0 ; i < this.players.length; i++) {
                                                        if(nickname === 'other_player_in_room_okd') {
                                                            cc.tween(chip)
                                                                .to(.4, {x: _toOther.x, y: _toOther.y})
                                                                .to(.1, {opacity: 0}, {easing: cc.easing.sineOut})
                                                                .start();
                                                        } else {
                                                            if(this.players[i].nickname === nickname) {
                                                                cc.tween(chip)
                                                                    .to(.4, {x: this.players[i].node.x, y: this.players[i].node.y})
                                                                    .to(.1, {opacity: 0}, {easing: cc.easing.sineOut})
                                                                    .start();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }),
                                    cc.delayTime(.5),
                                    cc.callFunc(() => {
                                        for (let i = 0; i < res.playerInfoWin.length; i++) {
                                            let playerData = res.playerInfoWin[i];
                                            let player = this.getPlayer(playerData["nickname"]);
                                            if(playerData["nickname"] === Configs.Login.Nickname) {
                                                this.actPlaySoundEffect(this.soundUserWin);
                                            }
                                            if (player != null) {
                                                player.showWinCoin(playerData["moneyWin"]);
                                                player.setCoin(playerData["currentMoney"]);
                                            }
                                        }
                                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                    })
                                )
                            )
                        }, 2);

                        if (this.isBanker) {
                            this.mePlayer.showWinCoin(res.moneyBankerExchange);
                            this.mePlayer.setCoin(res.moneyBankerAfter);
                            Configs.Login.Coin = res.moneyBankerAfter;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        }

                        XocDiaNetworkClient.getInstance().send(new cmd.CmdSendGetCau());
                    }
                    break;
                case cmd.Code.SOI_CAU:
                    {
                        let res = new cmd.ReceiveGetCau(data);
                        // console.log(res);

                        this.lblHistoryOdd.string = Utils.formatNumber(res.arrayCau.filter((cau) => cau == 1).length);
                        this.lblHistoryEven.string = Utils.formatNumber(res.arrayCau.filter((cau) => cau == 0).length);
                        for (let i = 0; i < this.lblHistoryItems.childrenCount; i++) {
                            if (i < res.arrayCau.length) {
                                this.lblHistoryItems.children[i].children[0].active = false;
                                this.lblHistoryItems.children[i].getComponent(cc.Sprite).spriteFrame = res.arrayCau[i] == 1 ? this.sfOdd : this.sfEven;
                                this.lblHistoryItems.children[i].active = true;
                                if(i + 1 === res.arrayCau.length) {
                                    this.lblHistoryItems.children[i].children[0].active = true;
                                    this.lblHistoryItems.children[i].children[0].getComponent(cc.Sprite).spriteFrame = res.arrayCau[i] == 1 ? this.lightOdd : this.lightEven;
                                }
                            } else {
                                this.lblHistoryItems.children[i].active = false;
                            }
                        }
                    }
                    break;
                case cmd.Code.ORDER_BANKER:
                    {
                        // let res = new cmd.ReceiveOrderBanker(data);
                        // //console.log(res);
                        // switch (res.error) {
                        //     case 0:
                        //         break;
                        //     case 1:
                        //         App.instance.alertDialog.showMsg("Bạn cần " + Utils.formatNumber(res.moneyRequire) + " Xu để làm cái!");
                        //         this.btnLamCai.node.active = false;
                        //         break;
                        //     default:
                        //         App.instance.alertDialog.showMsg("Lỗi " + res.error + ", không xác định.");
                        //         this.btnLamCai.node.active = false;
                        //         break;
                        // }
                    }
                    break;
                case cmd.Code.HUY_LAM_CAI:
                    {
                        let res = new cmd.ReceiveCancelBanker(data);
                        //console.log(res);
                        if (res.bDestroy && this.isBanker) {
                            App.instance.alertDialog.showMsg("Đăng ký huỷ làm cái thành công.");
                        }
                    }
                    break;
                case cmd.Code.INFO_GATE_SELL:
                    {
                        // let res = new cmd.ReceiveInfoGateSell(data);
                        // //console.log(res);
                        // this.bankerControl.show(res.moneyOdd, res.moneyEven);
                    }
                    break;
                case cmd.Code.CHAT_MS_RESPONSE:{

                    let res = new cmd.ReceivedChatRoom(data);
                    //     console.log("get res",res);
                    // console.log(res);
                    if(res.nickname.normalize() === Configs.Login.Nickname){
                        if (res.isIcon) {
                            this.showChatEmotion(res.content);
                        }else{
                            this.players[0].showChatMsg(res.content);
                        }
                    } else if (res.isIcon) {
                        // Chat Icon
                        let seatId = this.getPlayerInChair(res.nickname);
                        if (seatId > -1) {
                            this.players[seatId].showChatEmotion(res.content);
                        } else {
                            this.otherPlayer.getComponent(Player).showChatEmotion(res.content);
                        }
                    } else {
                        // Chat Msg
                        let seatId = this.getPlayerInChair(res.nickname);
                        if (seatId > -1) {
                            this.players[seatId].showChatMsg(res.content);
                        } else {
                            this.otherPlayer.getComponent(Player).showChatMsg(res.content);
                        }
                    }
                    break;
                }
                case cmd.Code.INFO_MONEY_AFTER_BANKER_SELL:
                    {
                        let res = new cmd.ReceiveInfoMoneyAfterBankerSell(data);
                        //console.log(res);
                    }
                    break;
                default:
                    //console.log("inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);
    }

    private resetView() {
        this.mePlayer.leave();
        this.players.forEach(e => e.leave());
        this.btnPayBets.forEach(e => e.reset());

        this.dealer.setAnimation(0, "IDLE", true);
        this.bowl.node.active = false;
        this.clearChips();

        this.sprProgressTime.node.parent.active = false;
        this.curTime = 0;
    }

    private getRandomEmptyPlayer(): Player {
        let emptyPlayers = new Array<Player>();
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].nickname == "") emptyPlayers.push(this.players[i]);
        }
        if (emptyPlayers.length > 0) {
            return emptyPlayers[Random.rangeInt(0, emptyPlayers.length)];
        }
        return null;
    }

    private getPlayerInChair(username : string) : number{
        for(let i = 0 ; i < this.players.length; i++){
            if(this.players[i].lblNickname.string == username){
                return i;
            }
        }
        return -1;
    }

    private getPlayer(nickname: string): Player {
        //console.log("getPlayer: " + nickname);
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            if (player.nickname != "" && player.nickname == nickname) return player;
        }
        return null;
    }

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
        for (let i = 0; i < this.listBets.length; i++) {
            if (this.listBets[i] == coin) {
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

    private clearChips() {
        for (let i = 0; i < this.listChip.length; i++) {
            this.listChip[i].active = false;
        }

        for(let i = 0 ; i < this.chipPool.length; i++) {
            this.chipPool[i].active = false;
        }
        this.chipsInDoors = {};
    }

    private convertMoneyToChipMoney(coin: number): Array<number> {
        let ret = new Array<number>();
        let _coin = coin;
        let minCoin = this.listBets[this.minBetIdx];
        let counter = 0;
        while (_coin >= minCoin || counter < 15) {
            for (let i = this.minBetIdx + this.btnBets.length; i >= this.minBetIdx; i--) {
                if (_coin >= this.listBets[i]) {
                    ret.push(this.listBets[i]);
                    _coin -= this.listBets[i];
                    break;
                }
            }
            counter++;
        }
        return ret;
    }

    public show(data: cmd.ReceiveJoinRoomSuccess) {
        this.node.active = true;
        this.resetView();
        this.roomId = data.roomId;
        this.lastUpdateTime = TimeUtils.currentTimeMillis();
        Configs.Login.Coin = data.money;
        this.isBanker = data.banker;
        this.banker = "";
        // if (this.isBanker) {
        //     this.btnHuyLamCai.node.active = false;
        //     this.btnLamCai.node.active = false;
        //     this.banker = Configs.Login.Nickname;
        // } else {
        //     this.btnLamCai.node.active = false;
        //     this.btnHuyLamCai.node.active = false;
        // }

        this.mePlayer.set(Configs.Login.Nickname, Configs.Login.Avatar, Configs.Login.Coin, data.banker);
        // for (let i = 0; i < data.playerInfos.length; i++) {
        //     let playerData = data.playerInfos[i];
        //     let player = this.getRandomEmptyPlayer();
        //     if (player != null) {
        //         player.set(playerData["nickname"], playerData["avatar"], playerData["money"], playerData["banker"]);
        //         if (playerData["banker"]) {
        //             this.banker = playerData["nickname"];
        //         }
        //     } else {
        //         break;
        //     }
        // }

        for (let i = 0; i < data.potID.length; i++) {
            let potData = data.potID[i];
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.setTotalBet(potData["totalMoney"]);
            this.listBetcurrents[i] = potData["moneyBet"];
            this.currentBetList[i].string = Utils.NFormatter(this.listBetcurrents[i]);
        }

        for (let i = 0; i < this.listBets.length; i++) {
            if (data.moneyBet <= this.listBets[i]) {
                this.betIdx = i;
                this.minBetIdx = this.betIdx;
                break;
            }
        }

        this.gameState = data.gameState;
        let msg = "";
        this.playSlotMachine();
        switch (this.gameState) {
            case 1://bat dau van moi
                break;
            case 2://bat dau dat cua
                {
                    this.dealer.setAnimation(0, "DEAL", false);
                    // msg = "Bắt đầu đặt cửa";
                    this.sprProgressTime.node.parent.active = true;
                    this.curTime = TimeUtils.currentTimeMillis() + data.remainBetTime * 1000;
                    let _animation = this.slotMachine.getComponent(cc.Animation);
                    if(_animation) {
                        _animation.play(_animation.getClips()[0].name);
                    }
                }
                break;
            case 3://bat dau ban cua
                {
                    // if (this.isBanker) {
                    //     this.bankerControl.show(data.moneyPurchaseOdd, data.moneyPurchaseEven);
                    // } else {
                    //     msg = "Bắt đầu bán cửa";
                    //     if (data.purchaseStatus != 1) {
                    //         this.panelPayDoor.show(data.purchaseStatus, data.moneyRemain);
                    //     }
                    //     for (let i = 0; i < data.list_buy_gate.length; i++) {
                    //         let playerData = data.list_buy_gate[i];
                    //         this.panelPayDoor.addUser(playerData["nickname"], playerData["money"], data.moneyRemain);
                    //     }
                    // }
                }
                break;
            case 4://nha cai can tien, hoan tien
                this.stopSlotMachine();
                break;
            case 5://bat dau hoan tien
                this.stopSlotMachine();
                break;
            case 6://bat dau tra thuong
                this.stopSlotMachine();
                break;
        }

        // if (msg != "") {
        //     this.dealer.setAnimation(0, "DEAL", false);
        //     let label = this.dealer.node.children[0].getComponentInChildren(cc.Label);
        //     label.string = msg;
        //     label.node.parent.active = false;
        //     label.node.parent.scale = 0;
        //     this.scheduleOnce(() => {
        //         label.node.parent.active = true;
        //         label.node.parent.runAction(
        //             cc.sequence(
        //                 cc.scaleTo(.5, 1),
        //                 cc.delayTime(3),
        //                 cc.scaleTo(.5, 0),
        //                 cc.callFunc(() => {
        //                     label.node.parent.active = false;
        //                 })
        //             )
        //         )
        //     }, 0.3);
        // }

        XocDiaNetworkClient.getInstance().send(new cmd.CmdSendGetCau());
    }

    public actBack() {
        this.actClick();
        XocDiaNetworkClient.getInstance().send(new cmd.SendLeaveRoom());
        XocDiaNetworkClient.getInstance().close();
        cc.audioEngine.stop(this.remoteMusicBackground);
        App.instance.actCloseThongBao();
        Play.instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    protected onDestroy() {
        Play.instance = null;
        XocDiaNetworkClient.getInstance().close();
    }

    // public actBuyGate() {
    //     XocDiaNetworkClient.getInstance().send(new cmd.SendBuyGate(this.panelPayDoor.coin));
    // }

    // public actOrderBanker() {
    //     this.btnLamCai.node.active = false;
    //     XocDiaNetworkClient.getInstance().send(new cmd.SendOrderBanker());
    // }
    //
    // public actCancelBanker() {
    //     this.btnHuyLamCai.node.active = false;
    //     XocDiaNetworkClient.getInstance().send(new cmd.SendCancelBanker());
    // }

    @property(cc.Node)
    menuBack: cc.Node = null;
    actCloseMenuBack(){
        // nodeUtils.disableNode(this.bgChat);
        this.btnMenu.active = true;
        this.menuBack.getChildByName('bgClose').active = false;
        this.menuBack.runAction(
            cc.sequence(
                cc.moveTo(0.1, -2000, 0),
                cc.callFunc(() => {
                    this.menuBack.active = false;
                })
            )
        )
    }

    actShowMenuBack(event, data){
        this.actClick();
        event.currentTarget.active = false;
        this.menuBack.active = true;
        this.menuBack.getChildByName('bgClose').active = true;
        this.menuBack.runAction( cc.moveTo(0.1, 0, 0));
    }

    @property(Dialog)
    popUpHuongDan :Dialog=null;
    //chat

    isHideChat = false;
    @property(cc.Node)
    chatEmotionNode: cc.Node = null;

    @property(cc.Node)
    chatMsgNode: cc.Node = null;

    @property(cc.Node)
    chatNode: cc.Node = null;
    private timeoutChat =null;
    @property(cc.EditBox)
    edtChatInput: cc.EditBox = null;
    @property(cc.Node)
    public UI_Chat :cc.Node =null;
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

    chatMsg() {
        if (this.isHideChat) {
            return;
        }
        if (this.edtChatInput.string.trim().length > 0) {
            XocDiaNetworkClient.getInstance().send(new cmd.SendChatRoom(this.roomId,0, this.edtChatInput.string));
            this.edtChatInput.string = "";
        }
    }
    closeUIChat() {
        this.actClick();
        this.UI_Chat.stopAllActions();
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 2500, 0)
        );
    }

    actShowListUsers() {
        this.actClick();
        let popupListUser = cc.instantiate(this.prefabPopupListUser);
        popupListUser.getComponent(XocDiaListUser).showListUser(this._listUser);
        this.node.addChild(popupListUser);
    }

    // actCloseListUsers() {
    //     this.popUpListUser.close();
    //     cc.tween(this.popUpListUser.node)
    //         .to(0.3, {position: cc.v2(5000, 0)})
    //         .start();
    // }

    actNextLeft() {
        this.betIdx--;
        if (this.betIdx < 0) {
            this.betIdx = 0;
        }
        if (this.betIdx == this._stepToPrev) {
            this.actMovePrevListChip();
            this._stepToNext--;
            this._stepToPrev--;
        }
        for (let i = 0; i < this.btnBets.length; i++) {
            this.actActiveBetChip(this.btnBets[i].node, false);
        }
        this.actActiveBetChip(this.btnBets[this.betIdx].node, true);
    }

    actNextRight() {
        this.betIdx++;
        if (this.betIdx >= this.btnBets.length - 1) {
            this.betIdx = this.btnBets.length - 1;
        }
        if (this.betIdx == this._stepToNext) {
            this.actMoveNextListChip();
            this._stepToNext++;
            this._stepToPrev++;
        }
        for (let i = 0; i < this.btnBets.length; i++) {
            this.actActiveBetChip(this.btnBets[i].node, false);
        }
        this.actActiveBetChip(this.btnBets[this.betIdx].node, true);
    }

    actMovePrevListChip() {
        this.actMove(cc.v2(this.btnBets[this.btnBets.length - 1].node.x + 300,
                this.btnBets[this.btnBets.length - 1].node.y),
            this.btnBets[this.btnBets.length - 1].node);
        for (let i = this.btnBets.length - 1; i > 0; i--) {
            let curr = this.btnBets[i];
            let prev = this.btnBets[i - 1];
            this.actMove(curr.node.position, prev.node);
        }
    }

    actMove(pos: cc.Vec2, chipSrc: cc.Node) {
        chipSrc.runAction(cc.moveTo(0, pos));
    }

    actMoveNextListChip() {
        this.actMove(cc.v2(this.btnBets[0].node.x - 300, this.btnBets[0].node.y), this.btnBets[0].node);
        for (let i = 1; i < this.btnBets.length; i++) {
            let prev = this.btnBets[i - 1];
            let curr = this.btnBets[i];
            this.actMove(prev.node.position, curr.node);
        }
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
    }

    actShowPopupTransaction() {
        this.actClick();
        let popupTransaction = cc.instantiate(this.prefabPopupTransation);
        this.node.addChild(popupTransaction);
    }

    actShowPopupGuide() {
        this.actClick();
        let popupGuide = cc.instantiate(this.prefabPopupGuide);
        this.node.addChild(popupGuide);
    }

    showUIChat() {
        this.actClick();
        let visibleSize = cc.view.getVisibleSize();
        this.UI_Chat.stopAllActions();
        this.UI_Chat.active = true;
        this.UI_Chat.runAction(
            cc.moveTo(0.3, 0, 0)
        );
    }

    chatEmotion(event, id) {
        cc.log(" chatEmotion id : ", id);
        XocDiaNetworkClient.getInstance().send(new cmd.SendChatRoom(this.roomId,1, id));
    }

    onClickBtnChoseEntry(event, data) {
        this.setMucCuoc(parseInt(data));
        this.actClick();
        for (let i = 0; i < this.btnBets.length; i++) {
            this.actActiveBetChip(this.btnBets[i].node, false);
        }
        this.actActiveBetChip(this.btnBets[this.mucCuocDangLuaChonIndex].node, true);
    }

    setMucCuoc(chipIndex) {
        if(this.mucCuocDangLuaChonIndex !== chipIndex) {
            this.mucCuocDangLuaChonIndex = chipIndex;
            this.betIdx = this.mucCuocDangLuaChonIndex;
            this.nextCoinBtn.interactable = this.mucCuocDangLuaChonIndex < this.listBets.length - 1;
            this.previousCoinBtn.interactable = this.mucCuocDangLuaChonIndex > 0;
            this._currentChoosingCoinValue = this.listBets[this.mucCuocDangLuaChonIndex];
        }
    }

    onClickNextChoseCoin() {
        this.actClick();
        if(this.mucCuocDangLuaChonIndex < this.listBets.length - 1) {
            this.setMucCuoc(this.mucCuocDangLuaChonIndex + 1);
            this.scrollToOffset(this.mucCuocDangLuaChonIndex, .2);
        }
        for (let i = 0; i < this.btnBets.length; i++) {
            this.actActiveBetChip(this.btnBets[i].node, false);
        }
        this.actActiveBetChip(this.btnBets[this.mucCuocDangLuaChonIndex].node, true);
    }

    onClickPreChoseCoin() {
        this.actClick();
        if(this.mucCuocDangLuaChonIndex > 0) {
            this.setMucCuoc(this.mucCuocDangLuaChonIndex - 1);
            this.scrollToOffset(this.mucCuocDangLuaChonIndex, .2);
        }
        for (let i = 0; i < this.btnBets.length; i++) {
            this.actActiveBetChip(this.btnBets[i].node, false);
        }
        this.actActiveBetChip(this.btnBets[this.mucCuocDangLuaChonIndex].node, true);
    }

    scrollToOffset(chipIndex, duration = 0) {
        let disChoseCoin = 135;
        let i = -280 - Math.min(chipIndex, this.btnBets.length - 4) * disChoseCoin;
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

    onRebetClick() {
        this.actClick();
        if(!this.checkCurrentBetHasData()) {
            App.instance.actShowThongBao(`Chưa có dữ liệu đặt cược.`);
        }
        for(let i = 0 ; i < this.listBetcurrents.length; i++) {
            if(this.listBetcurrents[i] != 0) {
                XocDiaNetworkClient.getInstance().send(new cmd.SendPutMoney(i, this.listBetcurrents[i]));
            }
        }
    }

    onAutoRebetClick() {
        this.actClick();
        for(let keys in this.rebetData) {
            XocDiaNetworkClient.getInstance().send(new cmd.SendPutMoney(parseInt(keys), this.rebetData[keys]));
        }
    }

    playSlotMachine() {
        let kq = this.slotMachine.getChildByName('kq');
        let result = this.slotMachine.getChildByName('result');
        let _animation = this.slotMachine.getComponent(cc.Animation);
        this.canGat.setAnimation(0, 'can_gat', false);
        this.scheduleOnce(() => {
            if(_animation) {
                kq.active = false;
                result.active = true;
                _animation.play(_animation.getClips()[0].name);
            }
        }, 1);
    }

    onClickAutoRebet() {
        if(Object.keys(this.rebetData).length == 0) {
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

    stopSlotMachine() {
        let kq = this.slotMachine.getChildByName('kq');
        let result = this.slotMachine.getChildByName('result');
        let _animation = kq.getComponent(cc.Animation);
        if(_animation) {
            kq.active = true;
            _animation.play(_animation.getClips()[0].name);
            _animation.on('finished', () => {
                result.active = false;
                this.slotMachine.getComponent(cc.Animation).stop();
            });
        }
    }

    resetSlotMachine() {
        let kq = this.slotMachine.getChildByName('kq');
        kq.active = false;
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
        this.listChip = [];
        // this.chips.removeAllChildren(true);
        this.chips.children.forEach(child => child.active = false);
        this.resetAllDataWhenShow();
    }

    onHideApp() {
        this.nodeBlack.active = false;
    }

    checkCurrentBetHasData() {
        for(let i = 0 ; i < this.listBetcurrents.length; i++) {
            if(this.listBetcurrents[i] > 0) {
                return true;
            }
        }
        return false;
    }

    actClick() {
        this.actPlaySoundEffect(this.soundClick);
    }

    actPlaySoundEffect(soundEffect) {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.play(soundEffect, false, 1);
        }
    }

    resetAllDataWhenShow() {
        let chen = this.mainBowl.getChildByName('chen');
        this.mainBowl.scale = 0.5;
        chen.opacity = 255;
        chen.x = 0;
        this.mainBowl.stopAllActions();
        this.bowl.node.active = false;
        this.btnPayBets.forEach(gate => gate.active.active = false);
        this.players.forEach(player => player.hideWinCoin());
        this.unscheduleAllCallbacks();
        for(let i = 1; i < this.players.length; i++) {
            this.players[i].getComponent(Player).leave();
        }
        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListUser());
    }

    actHuongDan(){
        this.popUpHuongDan.show();
    }
    actCloseHuongDan(){
        this.popUpHuongDan.dismiss();
    }
    actOnBgMusic() {
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.musicBackground, true);
        }
    }

    offBgMusic() {
        cc.audioEngine.stop(this.remoteMusicBackground);
    }
}
