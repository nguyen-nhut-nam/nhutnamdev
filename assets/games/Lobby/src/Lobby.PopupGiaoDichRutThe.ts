
import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import PopupTranferToDaiLy from './Lobby.PopupTranferToDaiLY';
import Utils from '../../../scripts/common/Utils';

const { ccclass, property } = cc._decorator;


@ccclass
export default class PopupGiaoDichRutThe extends Dialog {

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

    actNext() {
        if ((this.page * 20) < this.record) {
            this.page += 1;
        }
        this.labelPage.string = this.page + "";
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
        this.loadData();
    }
    actpret() {
        if (this.record >= 20) {
            this.page -= 1;
        }
        if (this.page < 1) {
            this.page = 1;
            return;
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

    private moneyToK(money: number): string {
        if(money<=0) money = money * -1;
        if (money < 1000) {
            return Utils.formatNumber(money);
        } if(money < 1000000){
            money = parseInt((money / 1000).toString());
            return Utils.formatNumber(money) + "K";
        }

    }

    private loadData() {
        App.instance.showLoading2(true);
        Http.get(Configs.App.API, {
            "c": 2002,
            "token": Configs.Login.AccessToken,
            "nickname": Configs.Login.Nickname,
            "p": this.page,
            "ver": "2"
        }, (err, res) => {
            App.instance.showLoading2(false);
            this.record = res["totalpage"];
            if (err != null) return;
            if (res["success"]) {
                for (let i = 0; i < res["listTrans"].length; i++) {
                    let itemData = res["listTrans"][i];
                    let giaodich = itemData["giaodich"];
                    let hinhthucTrans = itemData["hinhthucTrans"];
                    let hinhthuc = itemData["hinhthuc"];
                    let sotien = itemData["sotien"];
                    let trangthai = itemData["trangthai"];
                    let ghiChu = itemData["ghiChu"];
                    let createAt = itemData["createAt"];
                    let id = itemData["id"];
                    let transId = itemData["transId"];

                    if (hinhthucTrans.toUpperCase().normalize().trim() === "RUT_CARD".toUpperCase().normalize()) {
                        let item = this.getItem();
                        item.getChildByName("thoigian").getComponent(cc.Label).string = createAt.split(" ")[1].split(" ").reverse() + ' ' + createAt.split(" ")[0].split("-").reverse().join("-");
                        item.getChildByName("loaithe").getComponent(cc.Label).string = giaodich + ' ' + this.moneyToK(sotien);
                        if (trangthai.toUpperCase().normalize().trim() === "Từ chối".toUpperCase().normalize()) {
                            item.getChildByName("ghiChu").getComponent(cc.Label).string = "Từ chối";
                        } else {
                            item.getChildByName("ghiChu").getComponent(cc.Label).string = ghiChu;
                        }
                    }
                }
            }
        });
    }
}
