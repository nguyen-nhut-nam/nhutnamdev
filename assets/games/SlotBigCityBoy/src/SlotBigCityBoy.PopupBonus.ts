import Dialog from "../../../scripts/common/Dialog";
import Tween from "../../../scripts/common/Tween";
import Utils from "../../../scripts/common/Utils";
import SlotBigCityBoySlotController from "./SlotBigCityBoy.SlotController";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends cc.Component {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Node)
    finishedNotifyNode = null;
    @property(cc.Label)
    finishedMoneyLabel = null;
    @property(cc.Label)
    autoLabel = null;
    @property(cc.Node)
    iconOver = null;
    @property([cc.Node])
    listItemBonus = [];
    @property(cc.Prefab)
    moneyPrefab = null;
    @property(cc.Node)
    itemsLabel = null;
    @property([cc.Node])
    outDoorItemsNode = [];
    @property(cc.Node)
    outDoorNode = null;

    @property({ type: cc.AudioClip })
    soundBonusItem = null;
    @property({ type: cc.AudioClip })
    soundBonusOver = null;
    @property({ type: cc.AudioClip })
    soundSelectFactor = null;
    @property({ type: cc.AudioClip })
    soundOtherFactor = null;
    @property({ type: cc.AudioClip })
    soundFinishedNotification = null;

    private left = 0;
    private onFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private factors: number[] = [];
    private totalCoin = 0;
    private _autoTimer = 20;
    private _totalBonusAuto = 0;
    private _selectedFactor = 0;
    private _iconBonusCount = 0;
    private _minimumXFactors = 0;

    start() {
        let self = this;
        for (let i = 0; i < this.listItemBonus.length; i++) {
            let node = this.listItemBonus[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this.playSoundClickBonusItem();
                this.scheduleCountTimeBonus();
                let moneyPrefab = cc.instantiate(this.moneyPrefab);
                let nodePosition = node.position;
                moneyPrefab.position = nodePosition;
                node.off(cc.Node.EventType.TOUCH_END);
                var value = this.dataBonus[this.dataBonus.length - this.left];
                node.getComponent(sp.Skeleton).setAnimation(0, `disappear${i + 1}`, false);
                if(this.left == 0) {
                    this.playSoundOver();
                    this.iconOver.position = nodePosition;
                    this.iconOver.active = true;
                    this.iconOver.stopAllActions();
                    this.iconOver.scale = 3;
                    this.iconOver.opacity = 0;
                    this.iconOver.angle = 0;
                    this.iconOver.runAction(
                        cc.spawn(
                            cc.rotateBy(.5, 360),
                            cc.fadeIn(.5),
                            cc.scaleTo(.5 ,1).easing(cc.easeBackIn()),
                        )
                    );
                    this.removeElseItemTouch();
                    node.runAction(
                        cc.sequence(
                            cc.delayTime(1),
                            cc.callFunc(() => {
                                this.showSpecial();
                            })
                        )
                    )
                } else {
                    if(value) {
                        this.totalCoin += value;
                        this.itemsLabel.addChild(moneyPrefab);
                        this.lblTotal.node.stopAllActions();
                        moneyPrefab.runAction(
                            cc.sequence(
                                cc.delayTime(.3),
                                cc.callFunc(() => {
                                    moneyPrefab.getComponent(cc.Label).string = Utils.formatNumber(value);
                                })
                            )
                        );
                        this.lblTotal.node.runAction(
                            cc.sequence(
                                cc.delayTime(.3),
                                cc.spawn(
                                    cc.scaleTo(.2, 1.2),
                                    cc.callFunc(() => {
                                        this.lblTotal.string = Utils.formatNumber(this.totalCoin);
                                    })
                                ),
                                cc.scaleTo(.2, 1)
                            )
                        )
                    }
                }
                this.left--;
            });
        }
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                node.getComponent(sp.Skeleton).timeScale = 1;
                node.off(cc.Node.EventType.TOUCH_END);
                this.playSoundSelectFactor();
                switch (i) {
                    case 0:
                        node.getComponent(sp.Skeleton).setAnimation(0, `Girl_A_disapear_X${this.factors[0]}`, false);
                        break;
                    case 1:
                        node.getComponent(sp.Skeleton).setAnimation(0, `Girl_B_disapear_X${this.factors[0]}`, false);
                        break;
                    case 2:
                        node.getComponent(sp.Skeleton).setAnimation(0, `Girl_C_disapear_X${this.factors[0]}`, false);
                        break;
                }
                this.clearElseOutDoorItemsNodeTouch(i);
                node.runAction(
                    cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(() => {
                            let otherFactorIndex = 0;
                            for(let j = 0; j < this.outDoorItemsNode.length; j++) {
                                if(i !== j) {
                                    otherFactorIndex++;
                                    let factorOther = this.factors[otherFactorIndex];
                                    let otherItemNode = this.outDoorItemsNode[j];
                                    switch (j) {
                                        case 0:
                                            otherItemNode.getComponent(sp.Skeleton).setAnimation(0, `Girl_A_disapear_X${factorOther}`, false);
                                            break;
                                        case 1:
                                            otherItemNode.getComponent(sp.Skeleton).setAnimation(0, `Girl_B_disapear_X${factorOther}`, false);
                                            break;
                                        case 2:
                                            otherItemNode.getComponent(sp.Skeleton).setAnimation(0, `Girl_C_disapear_X${factorOther}`, false);
                                            break;
                                    }
                                    otherItemNode.getComponent(sp.Skeleton).setCompleteListener((anim) => {
                                        self.playSoundSelectOtherFactor();
                                    });
                                }
                            }
                        }),
                        cc.delayTime(2),
                        cc.callFunc(() => {
                            this.unschedule(this.countTime);
                            this.playSoundFinishedNotification();
                            this.finishedNotifyNode.active = true;
                            this.finishedMoneyLabel.string =`${Utils.formatNumber(this.totalCoin)} x ${this.factors[0]} = ${Utils.formatNumber(this.totalCoin * (this.factors[0]))}`;
                            this.scheduleOnce(() => {
                                this.hidden();
                            }, 2);
                        })
                    )
                )
            });
        }
    }

    showBonus(bonus: string, onFinished: () => void) {
        this.node.active = true;
        this.itemsLabel.removeAllChildren();
        this.iconOver.active = false;
        this.items.active = true;
        this.outDoorNode.active = false;
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        this._iconBonusCount = 0;
        for (let i = 0; i < arrBonus.length - 2; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this._iconBonusCount = Number(arrBonus[arrBonus.length - 1]);
        this._minimumXFactors = this._iconBonusCount - 2;
        this.left = this.dataBonus.length;

        let factor = Number(arrBonus[arrBonus.length - 2]);
        this.factors.length = 0;
        this.factors.push(factor);
        for (let i = this._minimumXFactors; i <= this._iconBonusCount; i++) {
            if (i != factor) {
                this.factors.push(i);
            }
        }
        this.lblTotal.string = "0";
        this.totalCoin = 0;
        this._totalBonusAuto = 0;
        this._selectedFactor = factor;
        this.finishedNotifyNode.active = false;
        this._totalBonusAuto = this.calculateAutoBonus(this.dataBonus);

        this._autoTimer = 20;
        this.autoLabel.string = this._autoTimer;
        this.scheduleCountTimeBonus();
    }

    private showSpecial() {
        this.items.active = false;
        this.itemsLabel.active = false;
        this.iconOver.active = false;
        this.outDoorNode.active = true;
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
        }
    }

    hidden() {
        this.scheduleOnce(() => {
            this.finishedNotifyNode.stopAllActions();
            this.finishedNotifyNode.active = false;
            this.onFinished();
            this.node.destroy();
        }, 3.5);
    }

    dismiss() {
        this.finishedNotifyNode.stopAllActions();
        this.finishedNotifyNode.active = false;
        this.unscheduleAllCallbacks();
        this.onFinished();
        this.node.destroy();
    }

    calculateAutoBonus(dataAutoBonus) {
        let totalAutoBonus = 0;
        dataAutoBonus.forEach(value => totalAutoBonus += value);
        return totalAutoBonus;
    }

    showTotalRewardBonus(totalReward = 0, factor) {
        this.playSoundFinishedNotification();
        this.finishedNotifyNode.active = true;
        this.finishedNotifyNode.opacity = 0;
        this.finishedNotifyNode.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.finishedMoneyLabel.string =`${Utils.formatNumber(totalReward)} x ${factor} = ${Utils.formatNumber(totalReward * factor)}`;
    }

    countTime() {
        this.autoLabel.node.parent.active = true;
        this._autoTimer--;
        if (this._autoTimer < 1) {
            this.autoLabel.node.parent.active = false;
            this.unschedule(this.countTime);
            this.scheduleOnce(() => {
                this.showTotalRewardBonus(this._totalBonusAuto, this._selectedFactor);
            }, 0.5);
            this.hidden();
        }
        this.autoLabel.string = `${this._autoTimer < 10 ? `0${this._autoTimer}` : this._autoTimer}`;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.autoLabel.node.parent.active = false;
        this._autoTimer = 10;
        this.schedule(this.countTime, 1, cc.macro.REPEAT_FOREVER , 3);
    }

    clearElseOutDoorItemsNodeTouch(selectedOutDoorItemID) {
        for(let i = 0 ; i < this.outDoorItemsNode.length; i++) {
            if(i !== selectedOutDoorItemID) {
                this.outDoorItemsNode[i].off(cc.Node.EventType.TOUCH_END);
            }
        }
    }

    removeElseItemTouch() {
        for(let i = 0 ; i < this.listItemBonus.length; i++) {
            this.listItemBonus[i].off(cc.Node.EventType.TOUCH_END);
        }
    }

    playSoundClickBonusItem() {
        this.playSoundEffect(this.soundBonusItem);
    }

    playSoundOver() {
        this.playSoundEffect(this.soundBonusOver);
    }

    playSoundSelectFactor() {
        this.playSoundEffect(this.soundSelectFactor);
    }

    playSoundSelectOtherFactor() {
        this.playSoundEffect(this.soundOtherFactor);
    }

    playSoundFinishedNotification() {
        this.playSoundEffect(this.soundFinishedNotification);
    }

    playSoundEffect(soundEffect) {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playEffect(soundEffect, false);
        }
    }
}
export default PopupBonus;