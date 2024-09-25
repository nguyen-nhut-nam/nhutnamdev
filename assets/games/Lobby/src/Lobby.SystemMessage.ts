const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbySystemMessage extends cc.Component {

    @property(cc.RichText)
    message = null;

    isMessageRunning: boolean = false;

    public runMessage(msg) {
        if (msg.length > 0 && !this.isMessageRunning) {
            this.isMessageRunning = true;
            let messageBoxWidth = this.node.width;
            this.message.node.stopAllActions();
            this.message.string = msg;
            this.message.node.x = messageBoxWidth;
            let moveWidth = messageBoxWidth + this.message.node.width;
            let duration = moveWidth / 200.0;
            let self = this;
            // @ts-ignore
            this.message.node.runAction(cc.repeatForever(new cc.sequence(
                cc.moveTo(duration, cc.v2(-moveWidth, 0)),
                cc.callFunc(function () {
                    self.message.node.x = messageBoxWidth;
                    self.isMessageRunning = false;
                })
            )));
        }
    }
}
