import nodeUtils from "../../../scripts/common/NodeUtils";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import BauCuaController from "./BauCuaTo2.BauCuaController";
import utils from "../../../scripts/common/Utils";
import Popup from "../../../scripts/common/Popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BauCuaTo2PaneShowListUser extends Popup {
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    lplPage: cc.Node = null;
    private listUsers = [];

    private items = new Array<cc.Node>();
    private page = 0;
    private maxPage = 0;


    public showListUser(listUsers) {
        this.listUsers = listUsers;
        this.maxPage = Math.floor(this.listUsers.length / 15);
        this.loadData();
    }

    protected start() {

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
        this.page = 0;
    }

    show() {
        this.maxPage = Math.ceil(this.listUsers.length / 15);
        this.loadData();
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
                let userName = this.listUsers[index]["username"];
                let avatar = this.listUsers[index]["avatar"];
                let money = this.listUsers[index]["currentMoney"];
                let nodeUserName = nodeUtils.getChildNode(item,"boxInfo", "userName");
                let nodeAvatar = nodeUtils.getChildNode(item, "boxAvatar", "avatar");
                let nodeMoney = nodeUtils.getChildNode(item, "boxInfo", "money");
                nodeUtils.setNodeLabel(nodeUserName, userName);
                nodeUtils.setNodeLabel(nodeMoney, "" + utils.numFormatterTofixed0(parseInt(money)));
                nodeUtils.setSpriteFrame(nodeAvatar, App.instance.getAvatarSpriteFrame(avatar));
            } else {
                nodeUtils.disableNode(item);
            }
        }
    }
}