import nodeUtils from "../../../scripts/common/NodeUtils";
import App from "../../../scripts/common/App";
import utils from "../../../scripts/common/Utils";
import Popup from "../../../scripts/common/Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubListUser extends Popup {

    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    lplPage: cc.Node = null;
    @property(cc.Button)
    btnNextPage = null;
    @property(cc.Button)
    btnPreviousPage = null;

    private listUsers = [];

    private items = new Array<cc.Node>();
    private page = 0;
    private maxPage = 0;


    public showListUser(listUsers) {
        this.listUsers = listUsers;
    }

    protected onEnable() {
        this.runActionOpen();
        this.maxPage = Math.floor(this.listUsers.length / 15);
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 0) {
            this.page--;
            this.loadData();
        }
    }

    close() {
        this.runActionClose();
    }

    loadData() {
        nodeUtils.setNodeLabel(this.lplPage, (this.page + 1).toString());
        if (this.items.length == 0) {
            for (let i = 0; i < 15; i++) {
                let item = cc.instantiate(this.itemTemplate);
                item.parent = this.itemTemplate.parent;
                this.items.push(item);
            }
            this.itemTemplate.removeFromParent(true);
            this.itemTemplate.destroy();
            this.itemTemplate = null;
        }
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let index = i + 15 * this.page;
            if (index < this.listUsers.length) {
                nodeUtils.activeNode(item);
                let userName = this.listUsers[index]["nickname"];
                let avatar = this.listUsers[index]["avatar"];
                let money = this.listUsers[index]["money"];
                let nodeUserName = nodeUtils.getChildNode(item, "boxInfor", "displayName");
                let nodeAvatar = nodeUtils.getChildNode(item,"boxAvatar","avatar");
                let nodeMoney = nodeUtils.getChildNode(item, "boxInfor", "money");
                nodeUtils.setNodeLabel(nodeUserName, userName);
                nodeUtils.setNodeLabel(nodeMoney, "" + utils.numFormatterTofixed0(parseInt(money)));
                nodeUtils.setSpriteFrame(nodeAvatar, App.instance.getAvatarSpriteFrame(avatar));
            } else {
                nodeUtils.disableNode(item);
            }
        }
    }
}