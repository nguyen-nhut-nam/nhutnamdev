import nodeUtils from "../../scripts/common/NodeUtils";

const { ccclass, property } = cc._decorator;

namespace lobby {
    @ccclass
    export class MiniGame extends cc.Component {

        @property(cc.Node)
        gamePlay: cc.Node = null;

        onLoad() {
            this.gamePlay.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                this.reOrder();
            }, this);
        }

        reOrder() {
            var zIndex = 0;
            for (var i = 0; i < this.node.parent.childrenCount; i++) {
                let node = this.node.parent.children[i];
                if (node != this.node) {
                    node.zIndex = zIndex++;
                }
            }
            this.node.zIndex = zIndex++;
        }

        show() {
            this.reOrder();
            this.node.active = true;
            this.gamePlay.stopAllActions();
            this.gamePlay.scale = 0;
            this.gamePlay.runAction(cc.sequence(
                cc.scaleTo(0.3, 1),
                cc.callFunc(() => {
                    this._onShowed();
                })
            ));
        }

        _onShowed() {
            // console.log("_onShowed");
        }

        dismiss() {
            this.gamePlay.stopAllActions();
            this.gamePlay.runAction(cc.sequence(
                cc.scaleTo(0.3, 0),
                cc.callFunc(() => {
                    this._onDismissed();
                })
            ));
        }

        _onDismissed() {
            // console.log("_onDismissed");
            this.node.destroy();
        }

        actSetTransparent(listNotTransMinigame) {
            // let listNotTrans = ["bowl", "dice1", "dice2", "dice3", "PanelChat", "DiceAnim"];
            let listNotTrans = listNotTransMinigame;
            this.gamePlay.children.forEach(node => {
                if (listNotTrans.indexOf(node.name) === -1) {
                    node.opacity = 120;
                }
            })
            // nodeUtils.activeNode(this.btnNotTransparent);
            // nodeUtils.disableNode(this.btnTransparent);
            // nodeUtils.disableNode(this.bg);
        }
    }

}

export default lobby.MiniGame;