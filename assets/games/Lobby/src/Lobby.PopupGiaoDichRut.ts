import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Utils from '../../../scripts/common/Utils';

const { ccclass, property } = cc._decorator;


@ccclass
export default class PopupGiaoDichRut extends Dialog {

    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    labelPage: cc.Label = null;
    @property(cc.Button)
    nextBtn: cc.Button = null;
    @property(cc.Button)
    preBtn: cc.Button = null;
    page = 1;
    record = 0;
    tranID = null;
    show() {
        super.show();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
    }

    protected onLoad() {
        this.loadData();
    }

    actNext() {
        if(this.page == this.record) {
            return;
        }

        if ((this.page) < this.record) {
            this.page += 1;
        }
        this.labelPage.string = this.page + "";
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
        this.loadData();
    }
    actpret() {
        if (this.page == 1) {
            return;
        }

        if (this.page > 1) {
            this.page -= 1;
        }

        this.labelPage.string = this.page + "";
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
        this.loadData();
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

    actShowDetail(event) {
        let btnDetail = event.getCurrentTarget();
        let txt = btnDetail.getChildByName("status").getComponent(cc.Label).string;
    }

    private loadData() {
        Http.get(Configs.App.API, {
            "c": 2002,
            "token": Configs.Login.AccessToken,
            "nickname": Configs.Login.Nickname,
            "p": this.page,
            "ver": "3"
        }, (err, res) => {
            this.record = res["totalpage"];
            if (err != null) return;
            if (res["success"]) {
                for (let i = 0; i < res["listTrans"].length; i++) {
                    let itemData = res["listTrans"][i];
                    let giaodich = itemData["congGiaoDich"];
                    let hinhthucTrans = itemData["hinhthucTrans"];
                    let hinhthuc = itemData["hinhthuc"];
                    let sotien = itemData["sotien"];
                    let trangthai = itemData["trangthai"];
                    let ghiChu = itemData["ghiChu"];
                    let createAt = itemData["createAt"];
                    let id = itemData["id"];
                    let transId = itemData["transId"];
                    let item = this.getItem();
                    item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                    item.getChildByName("giaodich").getComponent(cc.Label).string = createAt.split(" ")[1].split(" ").reverse() + ' ' + createAt.split(" ")[0].split("-").reverse().join("-");
                    item.getChildByName("congGiaoDich").getComponent(cc.Label).string = giaodich;
                    if (sotien === "") {
                        item.getChildByName("sotien").getComponent(cc.Label).string = '0đ';
                    } else {
                        item.getChildByName("sotien").getComponent(cc.Label).string = Utils.formatMoney(sotien) + 'đ';
                    }

                    item.getChildByName("ghiChu").getComponent(cc.Label).string = ghiChu;
                    item.getChildByName("trangthai").color = cc.Color.WHITE;
                    if (trangthai.toUpperCase().normalize().trim() === "Đã duyệt".toUpperCase().normalize()) {
                        item.getChildByName("trangthai").getComponent(cc.Label).string = "Đã chuyển";
                    } else if (trangthai.toUpperCase().normalize().trim() === "Thất Bại".toUpperCase().normalize() || trangthai.toUpperCase().normalize().trim() === "từ chối".toUpperCase().normalize()) {
                        item.getChildByName("trangthai").getComponent(cc.Label).string = trangthai;
                        item.getChildByName("trangthai").color = cc.Color.RED;
                    } else {
                        item.getChildByName("trangthai").getComponent(cc.Label).string = trangthai;
                        item.getChildByName('trangthai').color = cc.Color.BLACK.fromHEX("#00ff00");
                    }
                }
            }
        });
    }
}
