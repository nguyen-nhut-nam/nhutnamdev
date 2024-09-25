export namespace common {
    export class NodeUtils {
        static getChildNode(rootNode: cc.Node, ...listChild: string[]): cc.Node {
            if (rootNode === null) {
                return;
            }
            let node = rootNode;
            for (let i = 0; i < listChild.length; i++) {
                node = node.getChildByName(listChild[i]);
            }
            return node;
        }

        static setNodeLabel(node: cc.Node, value: string) {
            if (node === null) {
                return;
            }
            node.getComponent(cc.Label).string = value;
        }

        static activeNode(node: cc.Node) {
            if (node === null) {
                return;
            }
            node.active = true;
        }

        static disableNode(node: cc.Node) {
            if (node === null) {
                return;
            }
            node.active = false;
        }

        static setNodeColorFromHex(node: cc.Node, hexColor: string) {
            node.color = cc.Color.BLACK.fromHEX(hexColor);
        }

        static setNodeColor(node: cc.Node, ccColor: cc.Color) {
            node.color = ccColor;
        }

        static setSpriteFrame(node, spriteFrame: cc.SpriteFrame) {
            if (node === null || spriteFrame === null) {
                return;
            }
            try {
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            } catch (err) {
                console.log("NodeUtils.setSpriteFrame" + err.message);
            }
        }

        static setAnimation(node, animationName: string, isLoop: boolean) {
            try {
                let animation = node.getComponent(sp.Skeleton);
                animation.setAnimation(0, animationName, isLoop);
            } catch (error) {
                console.log("NodeUtils.setAnimation" + error.message);
            }
        }

        static reverseNodeByX(node: cc.Node) {
            if (node === null) {
                return;
            }
            cc.tween(node)
                .to(0.1, {position: cc.v2(-node.x, node.y)})
                .start();
        }
    }
}
export default common.NodeUtils;