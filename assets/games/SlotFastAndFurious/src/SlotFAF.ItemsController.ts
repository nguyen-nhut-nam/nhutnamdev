import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotFAFItemsController extends ItemController {

    @property(cc.Boolean)
    isLSC = true;

    protected onLoad() {
        this.showAnimCallBack = this.animItemsFast.bind(this);
    }

    animItemsFast(delayTime, isLoop = false, itemPrefix) {
        this.animWinItems(delayTime, isLoop, itemPrefix);
        if(!this.isWin || !this.isStopColumn) {
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
                                                this.mapAnimWithID(0, "Free-Items", 1 ,delayTime, isLoop);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(0, "Bonus-Items", 1 ,delayTime, isLoop);
                                                break;
                                            case 3:
                                                this.mapAnimWithID(0, "jackpot-Items", 1 ,delayTime, isLoop);
                                                break;
                                        }
                                        if(itemPrefix.localeCompare("3_") === 0) {
                                            switch (this.serverID) {
                                                case 4:
                                                    this.mapAnimWithID(1, "3_8", 1, delayTime, isLoop);
                                                    break;
                                                case 5:
                                                    this.mapAnimWithID(1, "3_1", 1, delayTime, isLoop);
                                                    break;
                                                case 6:
                                                    this.mapAnimWithID(1, "3_5", 1, delayTime, isLoop);
                                                    break;
                                                case 7:
                                                    this.mapAnimWithID(1, "3_4", 1, delayTime, isLoop);
                                                    break;
                                                case 8:
                                                    this.mapAnimWithID(1, "3_7", 1, delayTime, isLoop);
                                                    break;
                                                case 9:
                                                    this.mapAnimWithID(1, "3_3", 1, delayTime, isLoop);
                                                    break;
                                                case 10:
                                                    this.mapAnimWithID(1, "3_6", 1, delayTime, isLoop);
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
                                                this.mapAnimWithID(0, "Free-Items", 1 ,delayTime, isLoop);
                                                break;
                                            case 1:
                                                this.mapAnimWithID(0, "Bonus-Items", 1 ,delayTime, isLoop);
                                                break;
                                            case 3:
                                                this.mapAnimWithID(0, "jackpot-Items", 1 ,delayTime, isLoop);
                                                break;
                                        }
                                        if(itemPrefix.localeCompare("3_") === 0) {
                                            switch (this.serverID) {
                                                case 4:
                                                    this.mapAnimWithID(1, "3_8", 1, delayTime, isLoop);
                                                    break;
                                                case 5:
                                                    this.mapAnimWithID(1, "3_1", 1, delayTime, isLoop);
                                                    break;
                                                case 6:
                                                    this.mapAnimWithID(1, "3_5", 1, delayTime, isLoop);
                                                    break;
                                                case 7:
                                                    this.mapAnimWithID(1, "3_4", 1, delayTime, isLoop);
                                                    break;
                                                case 8:
                                                    this.mapAnimWithID(1, "3_7", 1, delayTime, isLoop);
                                                    break;
                                                case 9:
                                                    this.mapAnimWithID(1, "3_3", 1, delayTime, isLoop);
                                                    break;
                                                case 10:
                                                    this.mapAnimWithID(1, "3_6", 1, delayTime, isLoop);
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
