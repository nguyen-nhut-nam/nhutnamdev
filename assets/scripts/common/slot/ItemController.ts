const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemController extends cc.Component {

    public static _instance: ItemController = null;

    @property(cc.Sprite)
    image = null;
    @property(cc.Node)
    spinNode = null;
    @property(cc.Node)
    winItem = null;
    @property([sp.SkeletonData])
    listAnimFB = [];

    public nodeEvent = null;
    public id = 5;
    public serverID = 0;
    public isWin = false;
    public isStopColumn = false;
    public columnID = - 1;
    public isChangeColor = false;


    public showAnimCallBack: (delayTime, isLoop, itemPrefix) => void = null;

    public static getInstance() {
        if(this._instance == null) {
            this._instance = new ItemController();
        }
        return this._instance;
    }

    mapAnimWithID(skeletonDataIndex, animationName, timeScale = 1, delayTime = 1.5, isLoop = false) {
        this.image.enabled = false;
        this.spinNode.active = true;
        this.spinNode.getComponent(sp.Skeleton).skeletonData = this.listAnimFB[skeletonDataIndex];
        this.spinNode.stopAllActions();
        this.spinNode.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    this.spinNode.getComponent(sp.Skeleton).setAnimation(0, animationName, isLoop);
                    this.spinNode.getComponent(sp.Skeleton).timeScale = timeScale;
                }),
                cc.delayTime(delayTime),
                cc.callFunc(() => {
                    if(this.winItem) {
                        this.winItem.active = false;
                        this.isWin = false;
                    }
                    if(this.isWin && this.isChangeColor) {
                        this.spinNode = false;
                        this.image.enabled = true;
                        this.node.color = cc.Color.GRAY;
                        this.isWin = false;
                    }
                })
            )
        );
    }

    hideAnimItem() {
        this.node.opacity = 255;
        this.node.color = cc.Color.WHITE;

        if(this.image) {
            this.image.node.stopAllActions();
            this.image.node.angle = 0;
        }

        if(this.spinNode) {
            this.spinNode.stopAllActions();
            this.spinNode.active = false;
            this.image.enabled = true;
        }

        if(this.winItem) {
            this.winItem.active = false;
        }
    }

    showAnimItem(delayTime = 1.5, isWin = false, isLoop = false, itemPrefix = "1_") {
        this.isWin = isWin;
        if(this.winItem) {
            this.winItem.active = false;
        }
        let itemDelayTime = 0;
        if(this.isWin || this.isStopColumn) {
            itemDelayTime = 0;
        } else {
            itemDelayTime = .3;
        }

        this.node.stopAllActions();

        this.hideAnimItem();

        this.node.runAction(
            cc.sequence(
                cc.delayTime(itemDelayTime),
                cc.callFunc(() => {
                    if(this.showAnimCallBack) {
                        this.showAnimCallBack(delayTime, isLoop, itemPrefix);
                    }
                })
            )
        )
    }
}
