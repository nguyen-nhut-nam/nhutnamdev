import utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TienLenInviteUser extends cc.Component {

    @property(cc.Node)
    itemTmp: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;

    private oldPos = cc.v2(500, 0);


    protected start() {

        this.loadData();
    }

    onShow() {
        nodeUtils.activeNode(this.bg);
        cc.tween(this.node)
            .to(0.4, {position: this.oldPos})
            .start()
    }

    onClose() {
        nodeUtils.disableNode(this.bg);
        cc.tween(this.node)
            .to(0.4, {position: cc.v2(1500, 0)})
            .start()
    }

    actCheck(event) {
        let item = event.currentTarget;
        let isCheck = nodeUtils.getChildNode(item, "ischeck");
        isCheck.active = !isCheck.active;
    }

    loadData() {
        let userCount = utils.randomRangeInt(10, 100);
        for (let i = 0; i < userCount; i++) {
            let item = cc.instantiate(this.itemTmp);
            item.parent = this.itemTmp.parent;
            let money = utils.formatNumberMin(utils.randomRangeInt(10000, 10000000)).toString();
            nodeUtils.setNodeLabel(nodeUtils.getChildNode(item, "money"), money);
        }
        this.itemTmp.removeFromParent(true);
        this.itemTmp.destroy();
        this.itemTmp = null;
    }
}