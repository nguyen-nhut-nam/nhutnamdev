const {ccclass, property} = cc._decorator;

@ccclass
export default class SafeArea extends cc.Component {

    protected onLoad() {
        if(!cc.sys.isNative) {
            this.node.getComponent(cc.Canvas).fitHeight = true;
            return;
        }

        let ratio = cc.view.getFrameSize().width / cc.view.getFrameSize().height;

        if(ratio < 1.7) {
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).fitHeight = false;
        } else {
            this.node.getComponent(cc.Canvas).fitWidth = false;
            this.node.getComponent(cc.Canvas).fitHeight = true;
        }
        let rect = cc.sys.getSafeAreaRect();
    }
}
