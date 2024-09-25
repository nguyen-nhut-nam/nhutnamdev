import Dialog from "../../../scripts/common/Dialog";
import Tween from "../../../scripts/common/Tween";
import Utils from "../../../scripts/common/Utils";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends Dialog {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    nodeMoney = null;
    @property(cc.Prefab)
    money = null;
    @property(cc.Node)
    outDoorNode: cc.Node = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Label)
    lblSpecial: cc.Label = null;
    @property([cc.SpriteFrame])
    sprFramesFactor: cc.SpriteFrame[] = [];
    @property(cc.Label)
    lblTimer = null;
    @property([cc.Node])
    outDoorItemsNode = [];
    @property([cc.Node])
    outDoorRateNode = [];
    @property(cc.Node)
    finishedNotifyNode = null;
    @property(cc.Label)
    finishedMoneyLabel = null;

    @property({ type: cc.AudioClip })
    soundOpenPumpkin = null;
    @property({ type: cc.AudioClip })
    soundOpenPumpkinMissed = null;
    @property({ type: cc.AudioClip })
    soundOpenChest = null;
    @property({ type: cc.AudioClip })
    soundItem = null;
    @property({ type: cc.AudioClip })
    soundNotifyOpened = null;

    private left = 0;
    private onFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private factors: number[] = [];
    private totalCoin = 0;
    private cbAutoClose: Function = null;
    private _autoTimer = 20;
    private _totalBonusAuto = 0;
    private _selectedFactor = 0;
    private listFactors = [[1,2,3], [4,5,6], [8,9,10]];

    start() {
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                node.off(cc.Node.EventType.TOUCH_END);
                this.scheduleCountTimeBonus();
                for (let i = 0; i < this.items.childrenCount; i++) {
                    this.items.children[i].getComponent(cc.Button).interactable = false;
                }
                var value = this.dataBonus[this.dataBonus.length - this.left];
                let skeletonIcon = node.getComponentInChildren(sp.Skeleton);
                this.left--;
                if (this.left == -1) {
                    if(GameConfigManager.getInstance().enableSound) {
                        cc.audioEngine.play(this.soundOpenPumpkinMissed, false, 1);
                    }
                    for (let i = 0; i < this.items.childrenCount; i++) {
                        this.items.children[i].getComponent(cc.Button).interactable = false;
                    }
                    skeletonIcon.setAnimation(0, "Bonus_Bi_Heo", false);
                    this.removeElseItemTouch();
                    let entryIcon = skeletonIcon.getCurrent(0);
                    skeletonIcon.setTrackCompleteListener(entryIcon, (entry, loopCount) => {
                        this.scheduleOnce(() => {
                            this.showSpecial();
                        }, 0);
                    });
                } else {
                    if(GameConfigManager.getInstance().enableSound) {
                        cc.audioEngine.play(this.soundOpenPumpkin, false, 1);
                    }
                    skeletonIcon.setAnimation(0, "Bonus_Bi_DaChon", false);
                    if(value) {
                        let moneyNode = cc.instantiate(this.money);
                        moneyNode.getComponent(cc.Label).string = `+${Utils.formatNumber(value)}`;
                        this.nodeMoney.addChild(moneyNode);
                        moneyNode.position = node.position;
                        this.totalCoin += value;
                    }
                }
                Tween.numberTo(this.lblTotal, this.totalCoin, 0.3);
                this.unschedule(this.cbAutoClose);
            });
        }
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
            let nodeRate = this.outDoorRateNode[i];
            node.on(cc.Node.EventType.TOUCH_END, () => {
                node.off(cc.Node.EventType.TOUCH_END);
                this.unschedule(this.cbAutoClose);
                this.scheduleCountTimeBonus();
                node.getComponentInChildren(sp.Skeleton).setAnimation(0, "Bonus_Hu_DaChon", false);
                node.stopAllActions();
                node.runAction(
                    cc.sequence(
                        cc.rotateTo(.1, 10),
                        cc.rotateTo(.1, -10),
                        cc.rotateTo(.1 ,0),
                    )
                );
                nodeRate.active = true;
                nodeRate.scale = 0;
                nodeRate.opacity = 255;
                nodeRate.position = node.position;
                nodeRate.getComponent(cc.Sprite).spriteFrame = this.getOutDoorItemSpriteFrameByRate(this.factors[0]);
                this.clearElseOutDoorItemsNodeTouch(i);
                nodeRate.stopAllActions();
                nodeRate.runAction(
                    cc.sequence(
                        cc.delayTime(.2),
                        cc.callFunc(() => {
                            this.playSFXRateOpen();
                        }),
                        cc.delayTime(.8),
                        cc.spawn(
                            cc.callFunc(() => {
                                this.playSFXRateItem();
                            }),
                            cc.scaleTo(.3, 1),
                            cc.moveTo(.5, cc.v2(nodeRate.x, nodeRate.y + 100))
                        ),
                        cc.delayTime(.3),
                        cc.callFunc(() => {
                            let otherFactorIndex = 0;
                            for(let j = 0; j < this.outDoorItemsNode.length; j++) {
                                if(i != j) {
                                    otherFactorIndex++;
                                    let factorOther = this.factors[otherFactorIndex];
                                    let otherNodeRate = this.outDoorItemsNode[j];
                                    let otherRateValueNode = this.outDoorRateNode[j];
                                    otherNodeRate.getComponentInChildren(sp.Skeleton).setAnimation(0, "Bonus_Hu_DaChon", false);
                                    otherRateValueNode.active = true;
                                    otherRateValueNode.scale = 0;
                                    otherRateValueNode.opacity = 200;
                                    otherNodeRate.color = new cc.Color(100, 90, 55, 255);
                                    otherRateValueNode.position = otherNodeRate.position;
                                    otherNodeRate.stopAllActions();
                                    otherNodeRate.runAction(
                                        cc.sequence(
                                            cc.rotateTo(.1, 10),
                                            cc.rotateTo(.1, -10),
                                            cc.rotateTo(.1 ,0),
                                        )
                                    );
                                    otherRateValueNode.getComponent(cc.Sprite).spriteFrame = this.getOutDoorItemSpriteFrameByRate(factorOther);
                                    otherRateValueNode.getComponent(cc.Button).interactable = false;
                                    otherRateValueNode.stopAllActions();
                                    otherRateValueNode.runAction(
                                        cc.sequence(
                                            cc.delayTime(.2),
                                            cc.callFunc(() => {
                                                this.playSFXRateOpen();
                                            }),
                                            cc.delayTime(.8),
                                            cc.spawn(
                                                cc.callFunc(() => {
                                                    this.playSFXRateItem();
                                                }),
                                                cc.scaleTo(.3, 1),
                                                cc.moveTo(.5, cc.v2(otherNodeRate.x, otherNodeRate.y + 100))
                                            ),
                                            cc.delayTime(2),
                                            cc.callFunc(() => {
                                                this.unschedule(this.countTime);
                                                if(GameConfigManager.getInstance().enableSound) {
                                                    cc.audioEngine.playEffect(this.soundNotifyOpened, false);
                                                }
                                                this.finishedNotifyNode.active = true;
                                                this.finishedNotifyNode.opacity = 0;
                                                this.finishedNotifyNode.runAction(
                                                    cc.fadeIn(0.5).easing(cc.easeBackOut())
                                                )
                                                this.finishedMoneyLabel.string =`${Utils.formatNumber(this.totalCoin)} * ${this.factors[0]} = ${Utils.formatNumber(this.totalCoin * (this.factors[0]))}`;
                                                this.scheduleOnce(() => {
                                                    this.hidden();
                                                }, 2);
                                            })
                                        )
                                    )
                                }
                            }
                        }),
                    )
                )
            });
        }
    }

    showBonus(bonus: string, onFinished: () => void) {
        super.show();
        this.items.active = true;
        this.nodeMoney.active = true;
        this.outDoorNode.active = false;
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        for (let i = 0; i < arrBonus.length - 2; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.left = this.dataBonus.length;

        let factor = Number(arrBonus[arrBonus.length - 2]);
        let totalBonusSymBol = 0;
        totalBonusSymBol = Number(arrBonus[arrBonus.length - 1]);
        let listFactor = [];
        switch (totalBonusSymBol) {
            case 3:
                listFactor = this.listFactors[0];
                break;
            case 4:
                listFactor = this.listFactors[1];
                break;
            case 5:
                listFactor = this.listFactors[2];
                break;
        }
        this.factors.length = 0;
        this.factors.push(factor);
        for(let i = 0 ; i < listFactor.length; i++) {
            if(listFactor[i] === factor) continue;
            this.factors.push(listFactor[i]);
        }
        this.lblTotal.string = "0";
        this.totalCoin = 0;
        this._totalBonusAuto = 0;
        this._selectedFactor = factor;
        this.cbAutoClose = () => {
            this.dismiss();
            this.onFinished();
        };
        this.scheduleOnce(this.cbAutoClose, 15);
        this._totalBonusAuto = this.calculateAutoBonus(this.dataBonus);

        this._autoTimer = 20;
        this.lblTimer.string = `KẾT THÚC SAU: ${this._autoTimer}s`;
        this.scheduleCountTimeBonus();
    }

    private showSpecial() {
        this.outDoorNode.active = true;
        this.items.active = false;
        this.nodeMoney.active = false;
        for (let i = 0; i < this.outDoorItemsNode.length; i++) {
            let node = this.outDoorItemsNode[i];
            node.color = cc.Color.WHITE;
        }
    }

    hidden() {
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
            this.node.destroy();
        }, 3.5);
    }

    onClickCloseBonus() {
        this.unscheduleAllCallbacks();
        this.dismiss();
        this.onFinished();
        this.node.destroy();
    }

    calculateAutoBonus(dataAutoBonus) {
        let totalAutoBonus = 0;
        dataAutoBonus.forEach(value => totalAutoBonus += value);
        return totalAutoBonus;
    }

    showTotalRewardBonus(totalReward = 0, factor) {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playEffect(this.soundNotifyOpened, false);
        }
        this.finishedNotifyNode.active = true;
        this.finishedNotifyNode.opacity = 0;
        this.finishedNotifyNode.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.finishedMoneyLabel.string =`${Utils.formatNumber(totalReward)} * ${factor} = ${Utils.formatNumber(totalReward * factor)}`;
    }

    countTime() {
        this.lblTimer.node.parent.active = true;
        this._autoTimer--;
        if (this._autoTimer < 1) {
            this.lblTimer.node.parent.active = false;
            this.unschedule(this.countTime);
            this.scheduleOnce(() => {
                this.showTotalRewardBonus(this._totalBonusAuto, this._selectedFactor);
            }, 0.5);
            this.hidden();
        }
        this.lblTimer.string = `KẾT THÚC SAU: ${this._autoTimer}s`;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.lblTimer.node.parent.active = false;
        this._autoTimer = 10;
        this.scheduleOnce(() => {
            this.schedule(this.countTime, 1);
        }, 5);
    }

    removeElseItemTouch() {
        for(let i = 0 ; i < this.items.childrenCount; i++) {
            this.items.children[i].off(cc.Node.EventType.TOUCH_END);
        }
    }

    clearElseOutDoorItemsNodeTouch(selectedOutDoorItemID) {
        for(let i = 0 ; i < this.outDoorItemsNode.length; i++) {
            if(i !== selectedOutDoorItemID) {
                this.outDoorItemsNode[i].off(cc.Node.EventType.TOUCH_END);
            }
        }
    }

    getOutDoorItemSpriteFrameByRate(rate) {
        return this.sprFramesFactor[rate - 1];
    }

    playSFXRateOpen() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playMusic(this.soundOpenChest, false);
        }
    }

    playSFXRateItem() {
        if(GameConfigManager.getInstance().enableSound) {
            cc.audioEngine.playMusic(this.soundItem, false);
        }
    }
}
export default PopupBonus;