import Dialog from "../../../scripts/common/Dialog";
import Tween from "../../../scripts/common/Tween";
import {common} from "../../../scripts/common/Utils";
import Utils = common.Utils;
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
    lblLeft: cc.Label = null;
    @property(cc.Label)
    lblFactor: cc.Label = null;
    @property(cc.Label)
    lblTotalReward = null;
    @property(cc.Node)
    nodeTotalReward = null;
    @property(cc.Label)
    lblTotalRewardNotification = null;
    @property(cc.Label)
    lblTimer = null;
    @property({ type: cc.AudioClip })
    soundUnbox: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundUnboxKey: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundUnboxTreasure: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    soundBonusTreasure = null;
    
    @property(cc.SpriteFrame)
    sprUnbox = null;
    @property(cc.SpriteFrame)
    sprTreasure = null;

    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private _totalBonusReward = 0;
    private _fakePrizes: Array<number> = [];
    private _autoTimer = 20;

    start() {
        let reward = 0;
        let self = this;
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["icon"] = node.getChildByName("icon");
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["factor"] = node.getChildByName("factor");
            node["btn"].node.on(cc.Node.EventType.TOUCH_END, () => {
                node["btn"].node.off(cc.Node.EventType.TOUCH_END);
                this.scheduleCountTimeBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                switch (value) {
                    case 0:
                        this.factor++;
                        this.lblFactor.string = `${this.factor}x`;
                        node["btn"].node.active = false;
                        node["factor"].active = true;
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundUnboxKey, false, 1);
                        }
                        break;
                    case 1:
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundUnbox, false, 1);
                        }
                        node.getChildByName("btn").active = false;
                        node.getChildByName("icon").active = true;
                        node["label"].node.active = true;
                        node["label"].string = "0";
                        reward = 4 * this.betValue * this.factor;
                        node["label"].string = `+${Utils.formatNumber(reward)}`;
                        node["label"].node.runAction(
                            cc.moveTo(.3, cc.v2(0, -75))
                        );
                        this._totalBonusReward += 4 * this.betValue * this.factor;
                        break;
                    case 2:
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.play(this.soundBonusTreasure, false, 1);
                        }
                        this.showSpecial(10, () => {
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node['icon'].getComponent(cc.Sprite).spriteFrame = this.sprTreasure;
                            reward = 10 * this.betValue * this.factor;
                            this._totalBonusReward += 10 * this.betValue * this.factor;
                            this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
                            if (this.left <= 0) {
                                this.hidden(this._totalBonusReward);
                            }
                        });
                        break;
                    case 3:
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.playMusic(this.soundBonusTreasure, false);
                        }
                        this.showSpecial(15, () => {
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node['icon'].getComponent(cc.Sprite).spriteFrame = this.sprTreasure;
                            reward = 15 * this.betValue * this.factor;
                            this._totalBonusReward += 15 * this.betValue * this.factor;
                            this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
                            if (this.left <= 0) {
                                this.hidden(this._totalBonusReward);
                            }
                        });
                        break;
                    case 4:
                        if(GameConfigManager.getInstance().enableSound) {
                            cc.audioEngine.playMusic(this.soundBonusTreasure, false);
                        }
                        this.showSpecial(20, () => {
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node['icon'].getComponent(cc.Sprite).spriteFrame = this.sprTreasure;
                            reward = 20 * this.betValue * this.factor;
                            this._totalBonusReward += 20 * this.betValue * this.factor;
                            this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
                            if (this.left <= 0) {
                                this.hidden(this._totalBonusReward);
                            }
                        });
                        break;
                }
                this.left--;
                this.lblLeft.string = "" + this.left;
                this.lblTotalReward.string = Utils.formatNumber(this._totalBonusReward);
                if (this.left <= 0) {
                    this.items.children.forEach(child => child.pauseSystemEvents(true));
                    if (value === 0 || value === 1) {
                        this.hidden(this._totalBonusReward);
                    }
                    for (let i = 0; i < this.items.childrenCount; i++) {
                        this.items.children[i]["btn"].interactable = false;
                    }
                }
            });
        }
        for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
            let node = this.itemSpecial.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["icon"] = node.getChildByName("icon");
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["btn"].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.scheduleCountTimeBonus();
                this.clearElseOutDoorItemsNodeTouch(i);
                if(GameConfigManager.getInstance().enableSound) {
                    cc.audioEngine.playMusic(this.soundUnboxTreasure, false);
                }
                for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
                    let node = this.itemSpecial.children[i];
                    node.getChildByName("btn").getComponent(cc.Button).interactable = false;
                }
                node["btn"].node.active = false;
                node["icon"].active = true;
                node["label"].node.active = true;
                node["label"].string = "0";
                reward = this.dataSpecial * this.betValue * this.factor;
                node["label"].string = Utils.formatNumber(reward);
                node["label"].node.runAction(
                    cc.moveTo(.3, cc.v2(0, -75))
                );
                this.scheduleOnce(() => {
                    for (let j = 0; j < this.itemSpecial.childrenCount; j++) {
                        if(i === j) continue;
                        this.clearElseOutDoorItemsNodeTouch(j);
                        let specialChild = this.itemSpecial.children[j];
                        specialChild["btn"].interactable = false;
                        specialChild.opacity = 155;
                        specialChild.getChildByName("label").active = true;
                        let fakePrizeIndex = Math.floor(Math.random() * 4);
                        specialChild.getChildByName("label").getComponent(cc.Label).string = Utils.formatNumber(self._fakePrizes[fakePrizeIndex]);
                        specialChild.getChildByName("label").runAction(
                            cc.moveTo(.5, cc.v2(0, -75)),
                        );
                    }
                    this.scheduleOnce(() => {
                        this.special.active = false;
                        this.onSpecialFinished();
                    }, 1.5);
                }, 0.5);

            });
        }
    }

    showBonus(betValue: number, bonus: string, onFinished: () => void) {
        super.show();
        this.special.active = false;
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("btn").active = true;
            node.getChildByName("icon").active = false;
            node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sprUnbox;
            node.getChildByName("label").active = false;
            node.getChildByName("label").position = cc.v2(0,0);
            node.getChildByName("factor").active = false;
            node.opacity = 255;
        }
        this.betValue = betValue;
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        for (let i = 0; i < arrBonus.length; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.left = this.dataBonus.length;
        this.factor = 1;
        this.lblLeft.string = "" + this.left;
        this.lblFactor.string = `${this.factor}x`;
        this.lblTotalReward.string = `0`;
        this._totalBonusReward = 0;
        this.nodeTotalReward.active = false;
        this._fakePrizes.push(10*this.betValue*this.factor);
        this._fakePrizes.push(15*this.betValue*this.factor);
        this._fakePrizes.push(20*this.betValue*this.factor);
        this._fakePrizes.push(20*this.betValue*this.factor);
        this.scheduleCountTimeBonus();
    }

    private showSpecial(data: number, onFinished: () => void) {
        for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
            let node = this.itemSpecial.children[i];
            node.opacity = 255;
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.resumeSystemEvents(true);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("icon").active = false;
            node.getChildByName("label").active = false;
            node.getChildByName("label").position = cc.v2(0,0);
        }
        this.onSpecialFinished = onFinished;
        this.dataSpecial = data;
        this.special.active = true;
    }

    hidden(totalWin) {
        this.unschedule(this.countTime);
        this.scheduleOnce(() => {
            this.showTotalRewardBonus(totalWin);
        }, 0.5)
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
        }, 2.5);
    }

    showTotalRewardBonus(totalReward = 0) {
        this.nodeTotalReward.active = true;
        this.nodeTotalReward.opacity = 0;
        this.nodeTotalReward.runAction(
            cc.fadeIn(0.5).easing(cc.easeBackOut())
        )
        this.lblTotalRewardNotification.string = Utils.formatNumber(totalReward);
    }

    calculateAutoBonus(dataAutoBonus) {
        let factor = 1;
        let totalAutoBonus = 0;
        for(let i = 0 ; i < dataAutoBonus.length; i++) {
            switch (dataAutoBonus[i]) {
                case 0:
                    factor++;
                    break;
                case 1:
                    totalAutoBonus += 4 * this.betValue * this.factor;
                    break;
                case 2:
                    totalAutoBonus += 10 * this.betValue * this.factor;
                    break;
                case 3:
                    totalAutoBonus += 15 * this.betValue * this.factor;
                    break;
                case 4:
                    totalAutoBonus += 20 * this.betValue * this.factor;
                    break;
            }
        }
        return totalAutoBonus;
    }

    countTime() {
        this.lblTimer.node.parent.active = true;
        this._autoTimer--;
        if(this._autoTimer < 1) {
            this.lblTimer.node.parent.active = false;
            this.unschedule(this.countTime);
            this.hidden(this.calculateAutoBonus(this.dataBonus));
        }
        this.lblTimer.string = this._autoTimer;
    }

    scheduleCountTimeBonus() {
        this.unschedule(this.countTime);
        this.lblTimer.node.parent.active = false;
        this._autoTimer = 10;
        this.scheduleOnce(() => {
            this.schedule(this.countTime, 1);
        }, 5);
    }

    clearElseOutDoorItemsNodeTouch(selectedOutDoorItemID) {
        for(let i = 0 ; i < this.itemSpecial.childrenCount; i++) {
            if(i !== selectedOutDoorItemID) {
                this.itemSpecial.children[i].getChildByName('btn').pauseSystemEvents(true);
            }
        }
    }
}
export default PopupBonus;