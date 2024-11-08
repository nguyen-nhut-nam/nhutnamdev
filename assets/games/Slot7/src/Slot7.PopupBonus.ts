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
    special: cc.Node = null;
    @property(cc.Node)
    itemSpecial: cc.Node = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Label)
    lblSpecial: cc.Label = null;
    @property([cc.SpriteFrame])
    sprFramesFactor: cc.SpriteFrame[] = [];

    @property(cc.Node)
    nodeTotalReward = null;
    @property(cc.Label)
    lblTotalRewardNotification = null;
    @property(cc.Label)
    lblTimer = null;
    @property(cc.Node)
    gun = null;
    @property({ type: cc.AudioClip })
    soundShot = null;
    @property({ type: cc.AudioClip })
    soundShotMiss = null;
    @property({ type: cc.AudioClip })
    soundUnbox = null;
    @property({ type: cc.AudioClip })
    soundMissed = null;
    @property({ type: cc.AudioClip })
    soundTreasure = null;
    @property({ type: cc.AudioClip })
    soundReward = null;

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
            node["btn"] = node.getChildByName("btn");
            node["icon"] = node.getChildByName("icon");
            node["label"] = node.getChildByName("label").getComponent(cc.Label);

            node["btn"].on(cc.Node.EventType.TOUCH_END, () => {
                this.scheduleCountTimeBonus();
                for (let i = 0; i < this.items.childrenCount; i++) {
                    this.items.children[i]["btn"].getComponent(cc.Button).interactable = false;
                }
                this.gun.active = true;
                this.gun.x = node.x + 30;
                this.gun.y = node.y - 40;
                var value = this.dataBonus[this.dataBonus.length - this.left];
                let skeletonGun = this.gun.getComponent(sp.Skeleton);
                let skeletonIcon = node["icon"].getComponent(sp.Skeleton);
                skeletonGun.setAnimation(0, "shot", false);

                if(value) {
                    node["label"].string = Utils.formatNumber(value);
                    this.totalCoin += value;
                }
                this.scheduleOnce(() => {
                    node["btn"].active = false;
                    node["icon"].active = true;
                    if (this.left == -1) {
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundShotMiss, false, 1);
                        }
                        for (let i = 0; i < this.items.childrenCount; i++) {
                            this.items.children[i].getChildByName("btn").getComponent(cc.Button).interactable = false;
                        }
                        node['label'].node.active = false;
                        skeletonIcon.setAnimation(0, "lose", false);
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundMissed, false, 1);
                        }
                        let entryIcon = skeletonIcon.getCurrent(0);
                        skeletonIcon.setTrackCompleteListener(entryIcon, (entry, loopCount) => {
                            this.scheduleOnce(() => {
                                this.showSpecial();
                            }, 0);
                        });
                    } else {
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundShot, false, 1);
                        }
                        skeletonIcon.setAnimation(0, "win", false);
                        node["label"].node.active = true;
                        node["label"].node.runAction(
                            cc.moveTo(.5, cc.v2(0, 80))
                        );
                        node["btn"].getComponent(cc.Button).interactable = true;
                    }
                    Tween.numberTo(this.lblTotal, this.totalCoin, 0.3);
                }, 0.6);
                this.left--;
                if(this.left >= 0) {
                    this.scheduleOnce(() => {
                        for (let i = 0; i < this.items.childrenCount; i++) {
                            this.items.children[i]["btn"].getComponent(cc.Button).interactable = true;
                        }
                    }, 0.8);
                }
                this.unschedule(this.cbAutoClose);
            });
        }
        for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
            let node = this.itemSpecial.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["icon"] = node.getChildByName("icon").getComponent(cc.Sprite);
            let skeletonBtn = node["btn"].node.getComponentInChildren(sp.Skeleton);
            node["btn"].node.on("click", () => {
                if(GameConfigManager.getInstance().enableSound) {
                    cc.audioEngine.play(this.soundTreasure, false, 1);
                }
                let factorOtherIdx = 0;
                this.scheduleCountTimeBonus();
                for (let j = 0; j < this.itemSpecial.childrenCount; j++) {
                    let node2 = this.itemSpecial.children[j];
                    node2["btn"].getComponent(cc.Button).interactable = false;
                    if (j == i) {
                        skeletonBtn.setAnimation(0, "hopmo", false);
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundReward, false, 1);
                        }
                        node2["icon"].node.active = true;
                        node2["icon"].spriteFrame = this.sprFramesFactor[this.factors[0] - 1];
                        node2["icon"].node.runAction(
                            cc.jumpTo(0.5, cc.v2(node2["icon"].node.x + 150, node2["icon"].node.y - 20), 120, 1)
                        );
                    } else {
                        node.runAction(
                            cc.sequence(
                                cc.callFunc(() => {
                                    skeletonBtn.setAnimation(0, "hopmo", false)
                                }),
                                cc.delayTime(.7),
                                cc.callFunc(() => {
                                    node2["btn"].node.opacity = 150;
                                    node2["icon"].node.active = true;
                                    node2["icon"].node.opacity = 150;
                                    factorOtherIdx++;
                                    node2["icon"].getComponent(cc.Sprite).spriteFrame = this.sprFramesFactor[this.factors[factorOtherIdx] - 1];
                                    node2["icon"].node.runAction(cc.jumpTo(0.5, cc.v2(node2["icon"].node.x + 150, node2["icon"].node.y - 20), 120, 1));
                                }),
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    this.unschedule(this.countTime);
                                    this.nodeTotalReward.active = true;
                                    this.lblSpecial.string = Utils.formatNumber(this.totalCoin) + " x " + this.factors[0] + " = " + Utils.formatNumber(this.totalCoin * this.factors[0]);
                                })
                            )
                        );
                    }
                }
                this.scheduleOnce(() => {
                    this.hidden();
                }, 2);
            });
        }
    }

    showBonus(bonus: string, onFinished: () => void) {
        console.log(bonus);
        super.show();
        this.items.active = true;
        this.special.active = false;
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("btn").getComponentInChildren(sp.Skeleton).setAnimation(0, "thung", true);
            node.getChildByName("icon").active = false;
            node.getChildByName("label").active = false;
            node.getChildByName("label").position = cc.v2(0,0);
        }
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
        this.gun.active = false;
        this.nodeTotalReward.active = false;
        this._totalBonusAuto = this.calculateAutoBonus(this.dataBonus);

        this._autoTimer = 20;
        this.lblTimer.string = this._autoTimer;
        this.scheduleCountTimeBonus();
    }

    private showSpecial() {
        this.items.active = false;
        for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
            let node = this.itemSpecial.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            let skeletonBtn = node.getChildByName("btn").getComponentInChildren(sp.Skeleton);
            btn.node.active = true;
            btn.interactable = true;
            skeletonBtn.setAnimation(0, 'hopdong', true);
            node.getChildByName("btn").children[0].opacity = 255;
            node.getChildByName("btn").opacity = 255;
            node.getChildByName("icon").active = false;
            node.getChildByName("icon").opacity = 255;
            node.getChildByName("icon").position = cc.v2(0,0);
        }
        this.lblSpecial.string = "";
        this.special.active = true;
    }

    hidden() {
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
            this.node.destroy();
        }, 3.5);
    }

    calculateAutoBonus(dataAutoBonus) {
        let totalAutoBonus = 0;
        dataAutoBonus.forEach(value => totalAutoBonus += value);
        return totalAutoBonus;
    }

    showTotalRewardBonus(totalReward = 0, factor) {
        this.nodeTotalReward.active = true;
        this.nodeTotalReward.opacity = 0;
        this.nodeTotalReward.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.lblTotalRewardNotification.string =`${Utils.formatNumber(totalReward)} x ${factor} = ${Utils.formatNumber(totalReward * factor)}`;
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
        this.lblTimer.string = `${this._autoTimer}S`;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.lblTimer.node.parent.active = false;
        this._autoTimer = 10;
        this.scheduleOnce(() => {
            this.schedule(this.countTime, 1);
        }, 5);
    }
}
export default PopupBonus;