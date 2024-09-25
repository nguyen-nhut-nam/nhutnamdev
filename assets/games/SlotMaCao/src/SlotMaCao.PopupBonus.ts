import Dialog from "../../../scripts/common/Dialog";
import {common} from "../../../scripts/common/Utils";
import Utils = common.Utils;
import SlotLadyNightController from "./SlotMaCao.SlotMaCaoController";
import SlotLadyNightSlotLNController from "./SlotMaCao.SlotMaCaoController";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends Dialog {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Label)
    lblTotalReward = null;
    @property(cc.Node)
    nodeTotalReward = null;
    @property(cc.Label)
    lblTotalRewardNotification = null;
    @property(cc.Label)
    lblTimer = null;
    @property([cc.Node])
    listItem = [];
    @property([sp.Skeleton])
    listItemAnim = [];
    @property(cc.Prefab)
    moneyPrefab = null;
    @property(cc.Node)
    parentLabel = null;
    @property(cc.Node)
    toast = null;

    private left = 0;
    private onFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private _totalBonusReward = 0;
    private _autoTimer = 20;

    start() {
        var soundSave = cc.sys.localStorage.getItem("sound_Slot_Lady_Night");
        let reward = 0;
        let self = this;
        for (let i = 0; i < this.listItem.length; i++) {
            let nodeItem = this.listItem[i];
            let nodeAnim = this.listItemAnim[i];
            nodeItem.on(cc.Node.EventType.TOUCH_END, () => {
                this.scheduleCountTimeBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                if(this.left > 0) {
                    nodeItem.stopAllActions();
                    nodeItem.off(cc.Node.EventType.TOUCH_END);
                    nodeAnim.setAnimation(0, "mo" + (i+1), false);
                    nodeItem.runAction(
                        cc.sequence(
                            cc.delayTime(.5),
                            cc.callFunc(() => {
                                let moneyPrefab = cc.instantiate(this.moneyPrefab);
                                this.parentLabel.addChild(moneyPrefab);
                                moneyPrefab.position = cc.v2(nodeItem.x, nodeItem.y - 125);
                                moneyPrefab.getComponentInChildren(cc.Label).string = Utils.formatNumber(value);
                                this._totalBonusReward += value;
                                this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
                            }),
                            cc.delayTime(.8),
                            cc.callFunc(() => {
                                nodeAnim.setAnimation(0, "bai" + (i + 1), true);
                            })
                        )
                    )
                }
                if(this.left <= 1) {
                    nodeItem.runAction(
                        cc.sequence(
                            cc.delayTime(3),
                            cc.callFunc(() => {
                                this.removeElseItemTouch();
                                this.showTotalRewardBonus(this._totalBonusReward);
                                this.unschedule(this.countTime);
                            })
                        )
                    )
                }
                this.left--;
                if(this.left < 0) {
                    this.showToast(`Chỉ được chọn ${this.dataBonus.length} lần`);
                    nodeItem.stopAllActions();
                }
                this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
            });
        }
    }

    showBonus(bonus: string, onFinished: () => void) {
        this.node.active = true;
        for (let i = 0; i < this.listItemAnim.length; i++) {
            let animItem = this.listItemAnim[i];
            animItem.setAnimation(0, "baiup", true);
        }
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        for (let i = 0; i < arrBonus.length; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.left = this.dataBonus.length;
        this.lblTotalReward.string = `0`;
        this._totalBonusReward = 0;
        this.nodeTotalReward.active = false;
        this.scheduleCountTimeBonus();
    }

    hidden() {
        this.nodeTotalReward.stopAllActions();
        this.nodeTotalReward.active = false;
        this.onFinished();
        this.node.destroy();
    }

    showTotalRewardBonus(totalReward = 0) {
        this.nodeTotalReward.active = true;
        this.nodeTotalReward.opacity = 0;
        this.nodeTotalReward.stopAllActions();
        this.nodeTotalReward.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.lblTotalRewardNotification.string = Utils.formatNumber(totalReward);
        this.scheduleOnce(() => {
            this.hidden();
        }, 2);
    }

    calculateAutoBonus(dataAutoBonus) {
        let totalAutoBonus = 0;
        for(let i = 0 ; i < dataAutoBonus.length; i++) {
            totalAutoBonus += dataAutoBonus[i];
        }
        return totalAutoBonus;
    }

    countTime() {
        this.lblTimer.node.active = true;
        this._autoTimer--;
        if(this._autoTimer < 1) {
            this.lblTimer.node.active = false;
            this.unschedule(this.countTime);
            this.scheduleOnce(() => {
                this.showTotalRewardBonus(this.calculateAutoBonus(this.dataBonus));
            }, 0.5);
        }
        this.lblTimer.string = this._autoTimer;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.lblTimer.node.active = false;
        this._autoTimer = 10;
        this.schedule(this.countTime, 1, cc.macro.REPEAT_FOREVER , 3);
    }

    removeElseItemTouch() {
        for(let i = 0 ; i < this.listItem.length; i++) {
            this.listItem[i].off(cc.Node.EventType.TOUCH_END);
        }
    }

    private showToast(msg: string) {
        this.toast.getComponentInChildren(cc.Label).string = msg;
        this.toast.stopAllActions();
        this.toast.active = true;
        this.toast.opacity = 0;
        this.toast.runAction(
            cc.sequence(
                cc.fadeIn(0.5),
                cc.delayTime(.5),
                cc.fadeOut(.5),
                cc.delayTime(2),
                cc.callFunc(() => {
                    this.toast.active = false;
                })
            )
        );
    }
}
export default PopupBonus;