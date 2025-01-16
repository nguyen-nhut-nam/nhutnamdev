import App from "./App";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Popup extends cc.Component {

    private _animation: cc.Animation = null;
    protected onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
    }

    protected onEnable() {
        this.runActionOpen();
    }

    onClose() {
        let delay = 0.35;
        this.runActionClose();
        this.scheduleOnce(() => {
            this.node.destroy();
        }, delay);
    }

    runActionOpen() {
        this.node.getChildByName('Container').scale = 0;
        this.node.getChildByName('Container').runAction(cc.sequence(
            cc.scaleTo(.27, 1.1),
            cc.scaleTo(.06, 1)
        ));
    }

    runActionClose(callback = null) {
        this.node.getChildByName('Container').runAction(
            cc.sequence(
                cc.scaleTo(.06, 1.2),
                cc.scaleTo(.27, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                    if(callback) {
                        callback();
                    }
                })
            )
        );
    }
}
