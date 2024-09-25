import ItemController from "../../../scripts/common/slot/ItemController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotBLCItemsController extends ItemController {

    @property(cc.Boolean)
    isLSC = true;

    protected onLoad() {
        this.showAnimCallBack = this.animItemsBLC.bind(this);
    }

    animItemsBLC(delayTime, isLoop = false, itemPrefix) {
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
                                            case 3:
                                                this.mapAnimWithID(0, "animation", 1 ,delayTime, isLoop);
                                                break;
                                        }
                                    }
                                }),
                                cc.scaleTo(.3, 1.1)
                            ),
                            cc.scaleTo(.3, 0.9),
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
                    cc.callFunc(() => {
                        this.winItem.active = true;
                    }),
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
                        this.winItem.active = false;
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
                                            case 3:
                                                this.mapAnimWithID(0, "animation", 1 ,delayTime, isLoop);
                                                break;
                                        }
                                    }
                                }),
                                cc.scaleTo(.3, 1.1)
                            ),
                            cc.scaleTo(.3, 0.9),
                            cc.delayTime(3)
                        ), 100
                    )
                )
            }
        }
    }
}
