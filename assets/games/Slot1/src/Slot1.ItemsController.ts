import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot1ItemsController extends ItemController {

    protected onLoad() {
        this.showAnimCallBack = this.animItemsLMHT.bind(this);
    }

    animItemsLMHT(delayTime, isLoop = false, itemPrefix) {
        this.animWinItems(delayTime, isLoop, itemPrefix);
        if((this.isWin || this.isStopColumn) && this.spinNode && this.id < 3) {
            switch (this.serverID) {
                case 0:
                    this.mapAnimWithID(0, "jackpot", 1, delayTime, isLoop);
                    break;
                case 1:
                    this.mapAnimWithID(0, "free", 1, delayTime, isLoop);
                    break;
                case 2:
                    this.mapAnimWithID(0, "bonus", 1, delayTime, isLoop);
                    break;
            }
            if(itemPrefix.localeCompare("1_") === 0) {
                switch (this.serverID) {
                    case 3:
                        this.mapAnimWithID(0, "song dao", 1, delayTime, isLoop);
                        break;
                    case 4:
                        this.mapAnimWithID(0, "ball", 1, delayTime, isLoop);
                        break;
                    case 5:
                        this.mapAnimWithID(0, "fleed_footwork_rune", 1, delayTime, isLoop);
                        break;
                    case 6:
                        this.mapAnimWithID(0, "health", 1, delayTime, isLoop);
                        break;
                }
            } else if(itemPrefix.localeCompare("2_") === 0) {
                switch (this.serverID) {
                    case 3:
                        this.mapAnimWithID(0, "master yi", 1, delayTime, isLoop);
                        break;
                    case 4:
                        this.mapAnimWithID(0, "wayne", 1, delayTime, isLoop);
                        break;
                    case 5:
                        this.mapAnimWithID(0, "leesin", 1, delayTime, isLoop);
                        break;
                    case 6:
                        this.mapAnimWithID(0, "janna", 1, delayTime, isLoop);
                        break;
                }
            } else if(itemPrefix.localeCompare("3_") === 0) {
                switch (this.serverID) {
                    case 3:
                        this.mapAnimWithID(0, "zed", 1, delayTime, isLoop);
                        break;
                    case 4:
                        this.mapAnimWithID(0, "fortune", 1, delayTime, isLoop);
                        break;
                    case 5:
                        this.mapAnimWithID(0, "yasuo", 1, delayTime, isLoop);
                        break;
                    case 6:
                        this.mapAnimWithID(0, "lux", 1, delayTime, isLoop);
                        break;
            }
            }
        }
    }

    animWinItems(delayTime, isLoop = false, itemPrefix = "1_") {
        if(this.isWin) {
            this.node.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0)
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0),
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0),
                            ),
                            cc.spawn(
                                cc.scaleTo(.19, 1.1),
                                cc.rotateTo(.19, 0),
                            )
                        ), 2
                    ),
                    cc.callFunc(() => {
                        this.node.stopAllActions();
                        this.node.angle = 0;
                    })
                )
            )
        } else if(!this.isWin || !this.isStopColumn) {
            this.node.stopAllActions();
            this.spinNode.active = false;
            this.image.enabled = true;
            this.node.angle = 0;
            this.node.scale = 1;
            if(itemPrefix.localeCompare("0_") !== 0) {
                this.node.runAction(
                    cc.repeat(
                        cc.sequence(
                            cc.repeat(
                                cc.sequence(
                                    cc.rotateTo(.1, -1),
                                    cc.rotateTo(.1, 0),
                                    cc.rotateTo(.1, 1),
                                    cc.rotateTo(.1, 0),
                                ), 2
                            ),
                            cc.spawn(
                                cc.callFunc(() => {
                                    if(this.spinNode && this.id < 3) {
                                        switch (this.serverID) {
                                            case 0:
                                                this.mapAnimWithID(0, "jackpot", 1 ,delayTime, isLoop);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(0, "free", 1 ,delayTime, isLoop);
                                                break;
                                            case 2:
                                                this.mapAnimWithID(0, "bonus", 1 ,delayTime, isLoop);
                                                break;
                                        }
                                        if(itemPrefix.localeCompare("1_") === 0) {
                                            switch (this.serverID) {
                                                case 3:
                                                    this.mapAnimWithID(0, "song dao", 1, delayTime, isLoop);
                                                    break;
                                                case 4:
                                                    this.mapAnimWithID(0, "ball", 1, delayTime, isLoop);
                                                    break;
                                                case 5:
                                                    this.mapAnimWithID(0, "fleed_footwork_rune", 1, delayTime, isLoop);
                                                    break;
                                                case 6:
                                                    this.mapAnimWithID(0, "health", 1, delayTime, isLoop);
                                                    break;
                                            }
                                        } else if(itemPrefix.localeCompare("2_") === 0) {
                                            switch (this.serverID) {
                                                case 3:
                                                    this.mapAnimWithID(0, "master yi", 1, delayTime, isLoop);
                                                    break;
                                                case 4:
                                                    this.mapAnimWithID(0, "wayne", 1, delayTime, isLoop);
                                                    break;
                                                case 5:
                                                    this.mapAnimWithID(0, "leesin", 1, delayTime, isLoop);
                                                    break;
                                                case 6:
                                                    this.mapAnimWithID(0, "janna", 1, delayTime, isLoop);
                                                    break;
                                            }
                                        } else if(itemPrefix.localeCompare("3_") === 0) {
                                            switch (this.serverID) {
                                                case 3:
                                                    this.mapAnimWithID(0, "zed", 1, delayTime, isLoop);
                                                    break;
                                                case 4:
                                                    this.mapAnimWithID(0, "fortune", 1, delayTime, isLoop);
                                                    break;
                                                case 5:
                                                    this.mapAnimWithID(0, "yasuo", 1, delayTime, isLoop);
                                                    break;
                                                case 6:
                                                    this.mapAnimWithID(0, "lux", 1, delayTime, isLoop);
                                                    break;
                                            }
                                        }
                                    }
                                }),
                                cc.scaleTo(.3, 1.1)
                            ),
                            cc.scaleTo(.3, 1),
                            cc.delayTime(3)
                        ), 100
                    )
                )
            }
        }
    }
}
