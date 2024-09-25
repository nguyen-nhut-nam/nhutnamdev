import cmd from "./MiniPoker.Cmd";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import Tween from "../../../scripts/common/Tween";
import Utils from "../../../scripts/common/Utils";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Configs from "../../../scripts/common/Configs";
import nodeUtils from "../../../scripts/common/NodeUtils";
import MiniGame from "../../../scripts/common/MiniGame";
import App from "../../../scripts/common/App";

const { ccclass, property } = cc._decorator;

@ccclass("ButtonBet")
export class ButtonBet {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.SpriteFrame)
    sfNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfActive: cc.SpriteFrame = null;

    _isActive = false;

    setActive(isActive: boolean) {
        this._isActive = isActive;
        this.button.getComponent(cc.Sprite).spriteFrame = isActive ? this.sfActive : this.sfNormal;
        this.button.interactable = !isActive;
    }
}

@ccclass
export default class MiniPokerController extends MiniGame {
    @property(cc.SpriteAtlas)
    sprAtlasCards: cc.SpriteAtlas = null;
    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    lblJackpot: cc.Label = null;
    @property([ButtonBet])
    buttonBets: ButtonBet[] = [];
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(sp.Skeleton)
    btnSpinAnim: sp.Skeleton = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Toggle)
    toggleAuto: cc.Toggle = null;
    @property(cc.Button)
    btnBoost: cc.Button = null;
    @property(cc.SpriteFrame)
    sfBoost0: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfBoost1: cc.SpriteFrame = null;
    @property(cc.Node)
    lblWinCash: cc.Node = null;
    @property(cc.Label)
    lblResult = null;
    @property(cc.Node)
    nodeResult = null;
    @property(cc.Node)
    nodeJackpot = null;
    @property(cc.Label)
    lblWinJackPot = null;

    @property(cc.SpriteFrame)
    sfTxtNoHu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtThungPhaSanh: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtTuQuy: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtThung: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtCuLu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtSanh: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtSamCo: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtHaiDoi: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfTxtDoiJ: cc.SpriteFrame = null;

    @property([cc.Node])
    public popups: cc.Node[] = [];
    @property(cc.Node)
    btnTrans = null;

    private readonly rollStartItemCount = 15;
    private readonly rollAddItemCount = 10;
    private readonly spinDuration = 1.2;
    private readonly addSpinDuration = 0.3;
    private readonly listBet = [100, 1000, 10000];
    private readonly defaultCards = [0, 1, 2, 3, 4];
    private itemHeight = 0;
    private betIdx = 0;
    private isAuto = false;
    private isBoost = false;
    private isSpined = true;
    private lastSpinRes: cmd.ReceiveSpin = null;
    private hasJackPot = false;

    private isTransparent = false;
    private isDragging = false;
    private isActiveChat = false;
    private defaultPosition = null;

    onLoad() {
        this.defaultPosition = this.gamePlay.position;
    }

    start() {
        this.itemHeight = this.itemTemplate.height;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let column = this.columns.children[i];
            let count = this.rollStartItemCount + i * this.rollAddItemCount;
            for (let j = 0; j < count; j++) {
                let item = cc.instantiate(this.itemTemplate);
                item.parent = column;
                if (j >= 1) {
                    item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprAtlasCards.getSpriteFrame("CardID_" + Utils.randomRangeInt(1, 15));
                } else {
                    item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprAtlasCards.getSpriteFrame("CardID_" + this.defaultCards[i]);
                }
            }
        }
        this.itemTemplate.removeFromParent();
        this.itemTemplate = null;

        for (let i = 0; i < this.buttonBets.length; i++) {
            var btn = this.buttonBets[i];
            btn.setActive(i == this.betIdx);
            btn.button.node.on("click", () => {
                let oldIdx = this.betIdx;
                this.betIdx = i;
                for (let i = 0; i < this.buttonBets.length; i++) {
                    this.buttonBets[i].setActive(i == this.betIdx);
                }
                MiniGameNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betIdx));
            });
        }

        this.toggleAuto.node.on("click", () => {
            this.isAuto = !this.isAuto;
            if (this.isAuto) {
                if (this.isSpined) this.actSpin();
                this.btnBoost.interactable = false;
            } else {
                this.btnBoost.interactable = true;
                if (this.isSpined) {
                    this.setEnableAllButtons(true);
                }
            }
        });

        this.btnBoost.node.on("click", () => {
            this.isBoost = !this.isBoost;
            if (this.isBoost) {
                if (this.isSpined) this.actSpin();
                this.toggleAuto.interactable = false;
                this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost1;
            } else {
                this.toggleAuto.interactable = true;
                this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost0;
                if (this.isSpined) {
                    this.setEnableAllButtons(true);
                }
            }
        });
        
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addOnClose(()=>{
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data: Uint8Array) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_JACKPOT: {
                    let res = new cmd.ReceiveUpdateJackpot(data);
                    Tween.numberTo(this.lblJackpot, res.value, 0.3);
                    break;
                }
                case cmd.Code.SPIN: {
                    let res = new cmd.ReceiveSpin(data);
                    this.onSpinResult(res);
                    break;
                }
            }
        }, this);

        this.gamePlay.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let pos = this.gamePlay.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.gamePlay.position = pos;
            this.isDragging = true;
        }, this);

        this.gamePlay.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.isDragging = false;
            this.reOrder();
            this.actSetNotTransparent();
        }, this);
    }

    show() {
        if (this.node.active) {
            this.reOrder();
            return;
        }
        super.show();

        this.lblToast.node.parent.active = false;
        this.nodeResult.active = false;
        this.lblWinCash.active = false;
        this.nodeJackpot.active = false;
        this.isAuto = false;
        this.toggleAuto.isChecked = false;
        this.isBoost = false;
        this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost0;
        this.toggleAuto.interactable = true;
        this.btnBoost.interactable = true;
        this.setEnableAllButtons(true);
        this.actSetNotTransparent();
        this.isSpined = true;
        this.betIdx = 0;
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].setActive(i == this.betIdx);
        }
        if(this.gamePlay.getNumberOfRunningActions() > 0) {
            this.gamePlay.stopAllActions();
        }
        this.gamePlay.scale = 1.2;
        this.gamePlay.position = this.defaultPosition;
        MiniGameNetworkClient.getInstance().send(new cmd.SendScribe(this.betIdx));
    }

    actSpin() {
        // console.log("actSpin");
        if (!this.isSpined) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        this.btnSpinAnim.setAnimation(0,"at", false);
        this.isSpined = false;
        this.setEnableAllButtons(false);
        for (var i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].button.interactable = false;
        }
        MiniGameNetworkClient.getInstance().send(new cmd.SendSpin(this.listBet[this.betIdx]));
    }

    private showToast(message: string) {
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(2), cc.fadeOut(0.2), cc.callFunc(() => {
            parent.active = false;
        })));
    }

    private setEnableAllButtons(isEnable: boolean) {
        this.btnSpin.interactable = isEnable;
    }

    private onSpinResult(data: cmd.ReceiveSpin) {
        // console.log(data);
        this.lastSpinRes = data;

        var resultSuccess = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        if (resultSuccess.indexOf(data.result) < 0) {
            this.scheduleOnce(function () {
                this.isSpined = true;
            }, 1);
            this.setEnableAllButtons(true);
            for (var i = 0; i < this.buttonBets.length; i++) {
                this.buttonBets[i].button.interactable = true;
            }

            this.isAuto = false;
            this.toggleAuto.isChecked = false;
            this.toggleAuto.interactable = true;

            this.isBoost = false;
            this.btnBoost.interactable = true;
            this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost0;

            switch (data.result) {
                case 102:
                    this.showToast("Số dư không đủ vui lòng nạp thêm.");
                    break;
                default:
                    this.showToast("Có lỗi xảy ra, vui lòng thử lại sau.");
                    break;
            }
            return;
        }

        Configs.Login.Coin -= this.listBet[this.betIdx];
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        Configs.Login.Coin = data.currentMoney;

        let result = [data.card1, data.card2, data.card3, data.card4, data.card5];
        console.log(result);
        //currentMoney: 3392748
        // prize: 0
        // result: 10 = khong an
        // result: 9 = doi J+
        // result: 8 = hai doi
        // result: 7 = sam
        let timeScale = this.isBoost ? 0.5 : 1;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            let step1Pos = this.itemHeight * 0.2;
            let step2Pos = -this.itemHeight * roll.childrenCount + this.itemHeight - this.itemHeight * 0.2;
            let step3Pos = -this.itemHeight * roll.childrenCount + this.itemHeight;
            roll.runAction(cc.sequence(
                cc.delayTime(0.2 * i * timeScale),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step1Pos)).easing(cc.easeQuadraticActionOut()),
                cc.moveTo((this.spinDuration + this.addSpinDuration * i) * timeScale, cc.v2(roll.getPosition().x, step2Pos)).easing(cc.easeQuadraticActionInOut()),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step3Pos)).easing(cc.easeQuadraticActionIn()),
                cc.callFunc(() => {
                    roll.setPosition(cc.v2(roll.getPosition().x, 0));
                    if (i === this.columns.childrenCount - 1) {
                        this.spined();
                    }
                })
            ));
            roll.runAction(cc.sequence(
                cc.delayTime((0.45 + 0.2 * i) * timeScale),
                cc.callFunc(() => {
                    let children = roll.children;
                    let bottomSprite = children[0].children[0].getComponent(cc.Sprite);
                    let topSprite = children[children.length - 1].children[0].getComponent(cc.Sprite);
                    bottomSprite.spriteFrame = topSprite.spriteFrame = this.sprAtlasCards.getSpriteFrame("CardID_" + result[i]);
                })
            ));
        }
    }

    private spined() {
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        this.setEnableAllButtons(true);
        this.btnSpinAnim.setAnimation(0,"iat", true);
        if (this.lastSpinRes.prize > 0) {
            switch (this.lastSpinRes.result) {
                case 1:
                    this.hasJackPot = true;
                    break;
                case 2:
                    this.lblResult.string = `THÙNG PHÁ SẢNH`;
                    break;
                case 3:
                    this.lblResult.string = `TỨ QUÝ`;
                    break;
                case 4:
                    this.lblResult.string = `THÙNG`;
                    break;
                case 5:
                    this.lblResult.string = `CÙ LŨ`;
                    break;
                case 6:
                    this.lblResult.string = `SẢNH`;
                    break;
                case 7:
                    this.lblResult.string = `SÁM CÔ`;
                    break;
                case 8:
                    this.lblResult.string = `THÚ`;
                    break;
                case 9:
                    this.lblResult.string = `ĐÔI J+`;
                    break;
            }
            if(!this.hasJackPot) {
                this.nodeResult.active = true;
                this.lblWinCash.active = true;
                this.lblWinCash.getComponent(cc.Label).string = "+" + this.lastSpinRes.prize;
                this.lblWinCash.runAction(cc.sequence(
                    cc.delayTime(1.5),
                    cc.callFunc(() => {
                        this.nodeResult.active = false;
                        this.scheduleOnce(() => {
                            this.isSpined = true;
                            if (this.isAuto || this.isBoost) {
                                this.actSpin();
                            } else {
                                for (var i = 0; i < this.buttonBets.length; i++) {
                                    this.buttonBets[i].button.interactable = true;
                                }
                            }
                        }, 0.2);
                    })
                ));
            } else {
                this.nodeJackpot.active = true;
                Tween.numberTo(this.lblWinJackPot, this.lastSpinRes.prize, .5);
                this.lblWinJackPot.node.runAction(cc.sequence(
                    cc.delayTime(3.5),
                    cc.callFunc(() => {
                        this.nodeJackpot.active = false;
                        this.scheduleOnce(() => {
                            this.isSpined = true;
                            if (this.isAuto || this.isBoost) {
                                this.actSpin();
                            } else {
                                for (var i = 0; i < this.buttonBets.length; i++) {
                                    this.buttonBets[i].button.interactable = true;
                                }
                            }
                        }, 0.2);
                    })
                ));
            }
        } else {
            this.scheduleOnce(() => {
                this.isSpined = true;
                if (this.isAuto || this.isBoost) {
                    this.actSpin();
                } else {
                    for (var i = 0; i < this.buttonBets.length; i++) {
                        this.buttonBets[i].button.interactable = true;
                    }
                }
            }, 0.4);
        }
    }

    dismiss() {
        if(!this.isSpined) {
            this.showToast("Không thể thoát lúc đang quay");
            return;
        }
        super.dismiss();
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        App.instance.miniPoker = null;
        MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribe(this.betIdx));
    }

    setTrans() {
        this.gamePlay.scale = 0.85;
        nodeUtils.disableNode(this.btnTrans);
        this.isTransparent = true;
    }

    onClickJackpot() {
        this.nodeJackpot.active = false;
        this.isSpined = true;
    }

    actSetNotTransparent() {
        this.gamePlay.scale = 1.2;
        nodeUtils.activeNode(this.btnTrans);
        this.setEnableAllButtons(true);
        this.reOrder();
    }
}
