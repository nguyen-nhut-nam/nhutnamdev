import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import PopupTranferToDaiLy from './Lobby.PopupTranferToDaiLY';

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupDaiLy extends Dialog {

    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    titleList: cc.Label = null;

    show() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
        super.show();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
        this.loadData("vietnam");
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
    }

    private getItem(): cc.Node {
        let item = null;
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            let node = this.itemTemplate.parent.children[i];
            if (node != this.itemTemplate && !node.active) {
                item = node;
                break;
            }
        }
        if (item == null) {
            item = cc.instantiate(this.itemTemplate);
            item.parent = this.itemTemplate.parent;
        }
        item.active = true;
        return item;
    }

    actDLVN() {
        this.titleList.string = "Danh Sách Đại Lý Việt Nam";
        this.loadData("vietnam");
    }


    actDLGlobal() {
        this.titleList.string = "Danh Sách Đại Lý Quốc Tế";
        this.loadData("quocte");
    }

    private loadData(type: string) {
        App.instance.showLoading2(true);
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
        Http.get(Configs.App.API, {"c": 4091, "type": type}, (err, res) => {
            App.instance.showLoading2(false);
            if (err != null) return;
            let data = res;
            for (let i = 0; i < data.length; i++) {
                let itemData = data[i];
                let nickname = itemData["nickname"];
                let item = this.getItem();
                item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                item.getChildByName("No.").getComponent(cc.Label).string = (i + 1).toString();
                item.getChildByName("Fullname").getComponent(cc.Label).string = itemData["fullname"];
                item.getChildByName("Nickname").getComponent(cc.Label).string = nickname;
                item.getChildByName("Phone").getComponent(cc.Label).string = itemData["phone"];
                item.getChildByName("Phone").color = cc.Color.WHITE;
                item.getChildByName("Phone").off("click");
                if (itemData["phone"] && itemData["phone"].trim().length > 0 && itemData["phone"].trim()[0] != "0") {
                    item.getChildByName("Phone").color = cc.Color.CYAN;
                    item.getChildByName("Phone").on("click", () => {
                        App.instance.openTelegram(itemData["phone"]);
                    });
                }
                item.getChildByName("Address").getComponent(cc.Label).string = itemData["khuvuc"];
                item.getChildByName("BtnFacebook").off("click");
                item.getChildByName("BtnFacebook").on("click", () => {
                    cc.sys.openURL(itemData["facebook"]);
                });
                item.getChildByName("BtnTransfer").off("click");
                item.getChildByName("BtnTransfer").on("click", () => {
                    //App.instance.ShowAlertDialog("Tính năng đang tạm khóa");
                    //App.instance.popupShop.showAndOpenTransfer(nickname);
                    // App.instance.popupTranferToDaiLy.showPopUpTranfer(nickname, itemData);
                });
            }
        });
    }
}
