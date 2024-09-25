import Utils from "../../../scripts/common/Utils";
import SlotBLCSlotBLCController from "./SlotBLC.SlotBLCController";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends cc.Component {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Node)
    finishedNotififyNode = null;
    @property(cc.Label)
    finishedMoneyLabel = null;
    @property(cc.Label)
    autoLabel = null;
    @property([cc.Node])
    listItemBonus = [];
    @property(cc.Prefab)
    moneyPrefab = null;
    @property(cc.Node)
    itemsLabel = null;
    @property([cc.Node])
    outDoorItemsNode = [];
    @property([cc.Node])
    outDoorRateNode = [];
    @property(cc.Node)
    outDoorNode = null;
    @property(cc.Label)
    lblTurnBonus = null;
    @property(cc.SpriteFrame)
    sprBoxOpened = null;
    @property(cc.SpriteFrame)
    sprBoxClose = null;

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
        for (let i = 0; i < this.listItemBonus.length; i++) {
            let node = this.listItemBonus[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                SlotBLCSlotBLCController.getInstance().playSoundClickBonusItem();
                this.scheduleCountTimeBonus();
                let moneyPrefab = cc.instantiate(this.moneyPrefab);
                let nodePosition = node.position;
                moneyPrefab.position = nodePosition;
                node.active = false;
                node.off(cc.Node.EventType.TOUCH_END);
                var value = this.dataBonus[this.dataBonus.length - this.left];
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
                this.left--;
                if(this.left == 0) {
                    this.removeElseItemTouch();
                    this.scheduleOnce(() => {
                        this.showSpecial();
                    }, 1);
                }
                this.lblTurnBonus.string = (this.left).toString();
            });
        }
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
            let nodeRate = this.outDoorRateNode[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                node.off(cc.Node.EventType.TOUCH_END);
                SlotBLCSlotBLCController.getInstance().playSoundClickTreasure();
                node.color = cc.Color.WHITE;
                // node.getComponent(sp.Skeleton).setAnimation(0, "at", false);
                node.getComponent(cc.Sprite).spriteFrame = this.sprBoxOpened;
                nodeRate.opacity = 255;
                nodeRate.getComponent(cc.Label).string = this.getOutDoorItemSpriteFrameByRate(this.factors[0]);
                this.clearElseOutDoorItemsNodeTouch(i);
                nodeRate.active = true;
                nodeRate.scale = 0;
                nodeRate.stopAllActions();
                nodeRate.runAction(
                    cc.sequence(
                        cc.delayTime(.5),
                        cc.callFunc(() => {

                        }),
                        cc.scaleTo(.3, 1).easing(cc.easeBackOut()),
                        cc.delayTime(.3),
                        cc.callFunc(() => {
                            let otherFactorIndex = 0;
                            for(let j = 0; j < this.outDoorItemsNode.length; j++) {
                                if(i !== j) {
                                    otherFactorIndex++;
                                    let factorOther = this.factors[otherFactorIndex];
                                    let otherItemNode = this.outDoorItemsNode[j];
                                    // otherItemNode.getComponent(sp.Skeleton).setAnimation(0, "at", false);
                                    otherItemNode.getComponent(cc.Sprite).spriteFrame = this.sprBoxOpened;
                                    let otherRateNode = this.outDoorRateNode[j];
                                    otherItemNode.color = new cc.Color(130,130,130,255);
                                    otherRateNode.active = true;
                                    otherRateNode.scale = 0;
                                    otherRateNode.opacity = 125;
                                    otherRateNode.getComponent(cc.Label).string = this.getOutDoorItemSpriteFrameByRate(factorOther);
                                    otherRateNode.stopAllActions();
                                    otherRateNode.runAction(
                                        cc.sequence(
                                            cc.delayTime(.5),
                                            cc.scaleTo(.3, 1).easing(cc.easeBackOut())
                                        )
                                    )
                                }
                            }
                        }),
                        cc.delayTime(2),
                        cc.callFunc(() => {
                            this.unschedule(this.countTime);
                            this.finishedNotififyNode.active = true;
                            this.finishedMoneyLabel.string =`${Utils.formatNumber(this.totalCoin * (this.factors[0]))}`;
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
        this.items.active = true;
        this.outDoorNode.active = false;
        this.resetAll();

        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        this._iconBonusCount = 0;
        for (let i = 0; i < arrBonus.length - 2; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.lblTurnBonus.string = (this.dataBonus.length).toString();
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
        this.finishedNotififyNode.active = false;
        this._totalBonusAuto = this.calculateAutoBonus(this.dataBonus);

        this._autoTimer = 20;
        this.autoLabel.string = this._autoTimer;
        this.scheduleCountTimeBonus();
    }

    private showSpecial() {
        this.outDoorNode.active = true;
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
            node.color = cc.Color.WHITE;
        }
    }

    hidden() {
        this.scheduleOnce(() => {
            this.finishedNotififyNode.stopAllActions();
            this.finishedNotififyNode.active = false;
            this.resetAll();
            this.onFinished();
            this.node.destroy();
        }, 3.5);
    }

    dismiss() {
        this.finishedNotififyNode.stopAllActions();
        this.finishedNotififyNode.active = false;
        this.resetAll();
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
        this.finishedNotififyNode.active = true;
        this.finishedNotififyNode.opacity = 0;
        this.finishedNotififyNode.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.finishedMoneyLabel.string =`${Utils.formatNumber(totalReward * factor)}`;
    }

    countTime() {
        this.autoLabel.node.active = true;
        this._autoTimer--;
        if (this._autoTimer < 1) {
            this.autoLabel.node.active = false;
            this.unschedule(this.countTime);
            this.scheduleOnce(() => {
                this.showTotalRewardBonus(this._totalBonusAuto, this._selectedFactor);
            }, 0.5);
            this.hidden();
        }
        this.autoLabel.string = `Kết thúc sau: ${this._autoTimer < 10 ? `0${this._autoTimer}` : this._autoTimer}S`;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.autoLabel.node.active = false;
        this._autoTimer = 10;
        this.schedule(this.countTime, 1, cc.macro.REPEAT_FOREVER , 3);
    }

    resetAll() {
        for (var t = 0; t < this.outDoorItemsNode.length; t++) {
            if(this.outDoorNode.active) {
                // this.outDoorItemsNode[t].getComponent(sp.Skeleton).setAnimation(0, "iat", true);
                this.outDoorItemsNode[t].getComponent(cc.Sprite).spriteFrame = this.sprBoxClose;
                this.outDoorItemsNode[t].opacity = 255;
                this.outDoorItemsNode[t].getComponent(cc.Button).interactable = true;
            }
        }

        this.outDoorNode.active = false;
        this.lblTotal.string = "";
    }

    getOutDoorItemSpriteFrameByRate(rate) {
        return `X${rate}`;
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
}
export default PopupBonus;