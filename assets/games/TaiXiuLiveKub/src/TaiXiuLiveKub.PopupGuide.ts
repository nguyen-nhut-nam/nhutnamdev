import TaiXiuKuBetController from "./TaiXiuLiveKub.TaiXiuLiveKubController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaiXiuLiveKubPopupGuide extends cc.Component {

    dismiss() {
        this.node.getChildByName('Container').runAction(
            cc.sequence(
                cc.scaleTo(.15, 1.1, 1.1),
                cc.scaleTo(.35, 0, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                    TaiXiuKuBetController.instance.toggleVideoLiveStream(true);
                })
            )
        )
    }
}
